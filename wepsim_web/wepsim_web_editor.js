/*
 *  Copyright 2015-2026 The WepSIM team (see docs/WEPSIM-TEAM.md)
 *
 *  This file is part of WepSIM.
 *
 *  WepSIM is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WepSIM is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with WepSIM.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import CodeMirror from 'codemirror';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/xml-hint';
import 'codemirror/addon/hint/html-hint';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/gas/gas';
import $ from 'jquery';
import { get_cfg } from '../sim_core/sim_cfg.js';
import { get_simware, set_simware } from '../sim_core/sim_adt_core.js';
import { i18n_get } from '../wepsim_i18n/i18n.js';
import { simcore_compile_firmware, simcore_reset } from '../sim_core/sim_api_core.js';
import { update_memories, wait_if_uievents } from '../sim_core/sim_core_ctrl.js';
import { onClick } from './wepsim_web_actions.js';
import { wepsim_notify_close, wepsim_notify_error, wepsim_notify_success } from '../wepsim_core/wepsim_notify.js';
import { wsweb_dlg_alert } from '../wepsim_core/wepsim_dialog.js';
import { asmdbg_update_assembly } from './wepsim_uielto_dbg_asm.js';
import { inputasm, inputfirm, sim_change_workspace } from './wepsim_web_simulator.js';
import { wsasm_src2mem } from '../sim_sw/assembly.js';

//
// WepSIM API
//

/*
     *  Editor
     */

export function sim_cfg_editor_theme(editor)
{
    var theme = get_cfg('editor_theme') ;

    editor.getWrapperElement().style['text-shadow'] = '0.0em 0.0em';
    editor.getWrapperElement().style['font-weight'] = 'bold';

    if (theme === 'blackboard')
    {
        editor.getWrapperElement().style['font-weight'] = 'normal';
    }

    editor.setOption('theme', theme);
}

export function sim_cfg_editor_mode(editor)
{
    var edt_mode = get_cfg('editor_mode');

    if (edt_mode === 'vim')
    {
        editor.setOption('keyMap', 'vim');
    }
    if (edt_mode === 'emacs')
    {
        editor.setOption('keyMap', 'emacs');
    }
    if (edt_mode === 'sublime')
    {
        editor.setOption('keyMap', 'sublime');
    }
}

export function sim_cm_get_firmcfg()
{
    return {
        value:         '\n\n\n\n\n\n\n\n\n\n\n\n',
        lineNumbers:   true,
        lineWrapping:  true,
        matchBrackets: true,
        tabSize:       2,
        foldGutter:    {
            rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment),
        },
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        mode:    'text/javascript',
    } ;
}

export function sim_cm_get_asmcfg()
{
    return {
        value:         '\n\n\n\n\n\n\n\n\n\n\n\n',
        lineNumbers:   true,
        lineWrapping:  true,
        matchBrackets: true,
        tabSize:       2,
        extraKeys:     {
            'Ctrl-Space': function(cm)
            {
                CodeMirror.showHint(cm, function(cm, options)
                {
                    var simware = get_simware();
                    var cur = cm.getCursor();
                    var result = [];
                    for (var i = 0; i < simware.firmware.length; i++)
                    {
                        if (simware.firmware[i].name != 'begin')
                        {
                            result.push(simware.firmware[i].signatureUser) ;
                        }
                    }
                    return { list: result, from: cur, to: cur } ;
                });
            },
            'Ctrl-/': function(cm)
            {
                cm.execCommand('toggleComment');
            },
        },
        mode: 'gas',
    } ;
}

export function sim_init_editor(editor_id, editor_cfg)
{
/*
            var view = new EditorView({
                  doc: "\n\n\n\n\n\n\n\n\n\n",
                  extensions: [
                 basicSetup,
                 history(),
                 keymap.of([...defaultKeymap, ...historyKeymap]),
                 javascript(),
                 syntaxHighlighting(defaultHighlightStyle),
                  ],
                  parent: document.getElementById(editor_id)
               }) ;

            return view ;
*/

    var editor_obj = CodeMirror.fromTextArea(document.getElementById(editor_id), editor_cfg) ;

    // default values
    editor_obj.setValue('\n\n\n\n\n\n\n\n\n\n') ;

    sim_cfg_editor_theme(editor_obj) ;
    sim_cfg_editor_mode(editor_obj) ;

    editor_obj.setSize('auto', '75vh');
    editor_obj.refresh();

    // event onChange -> update is_* attributes
    editor_obj.is_modified = true ;
    editor_obj.is_compiled = false ;
    editor_obj.is_refreshed = false ;

    editor_obj.on('change',
                  function (cmi, change)
                  {
                      cmi.is_modified = true ;
                      cmi.is_compiled = false ;
                      cmi.is_refreshed = false ;
                  }) ;

    // return object
    return editor_obj ;
}

/*
     *  Dialogs
     */

// Error dialog

export function goError(editor, pos)
{
    editor.setCursor({ line: pos - 1, ch: 0 }) ;
    var marked = editor.addLineClass(pos - 1, 'background', 'CodeMirror-selected') ;
    setTimeout(function()
    {
        editor.removeLineClass(marked, 'background', 'CodeMirror-selected');
    }, 3000) ;

    var t = editor.charCoords({ line: pos, ch: 0 }, 'local').top ;
    var middleHeight = editor.getScrollerElement().offsetHeight / 2 ;
    editor.scrollTo(null, t - middleHeight - 5) ;
}

export function showError(Msg, editor)
{
    var errorMsg = Msg.replace(/\t/g, ' ').replace(/ {3}/g, ' ');

    var pos = errorMsg.match(/Problem around line \d+/);
    var lineMsg = '' ;
    if (null !== pos)
    {
        pos = parseInt(pos[0].match(/\d+/)[0]);
        lineMsg += '<button type="button" class="btn btn-danger" ' +
            '        data-bind="click" data-action="go-error"' +
            '        data-editor="' + editor + '" data-pos="' + pos + '">' +
            ' Go line ' + pos +
            '</button>&nbsp;' ;
        onClick('go-error', (el) =>
        {
            var edt = (el.dataset.editor === 'inputasm') ? inputasm : inputfirm ;
            wepsim_notify_close() ;
            goError(edt, parseInt(el.dataset.pos)) ;
        }) ;
    }

    wepsim_notify_error('<strong>ERROR</strong>',
                        '<div class="container-fluid p-1 mb-1 mr-1 overflow-auto" ' +
                        '     style="-webkit-overflow-scrolling:touch; max-height:70vh; max-width:75vw;">' +
                        errorMsg + '<br>' +
                        '</div>' +
                        '<center>' +
                        lineMsg +
                        '<button type="button" class="btn btn-danger" ' +
                        '        data-bind="click" data-action="notify-close"><span data-langkey="Close">Close</span></button>' +
                        '</center>') ;
    onClick('notify-close', () => wepsim_notify_close()) ;
}

// Show binaries

export function wepsim_get_binary_code()
{
    // compile if needed
    if (false == inputasm.is_compiled)
    {
        var textToCompile = inputasm.getValue() ;
        var ok = wepsim_compile_assembly(textToCompile) ;
        inputasm.is_compiled = ok ;
    }

    // update content
    if (false == inputfirm.is_compiled)
    {
        if (inputfirm.getValue().trim() !== '')
        {
            var wsi = get_cfg('ws_idiom') ;
            var msg = i18n_get('gui', wsi, 'Microcode or Assembly are not compiled properly') ;
            wait_if_uievents(function()
            {
                wsweb_dlg_alert(msg + '.<br>\n') ;
            }, 50);
        }

        return null ;
    }
    if (false == inputasm.is_compiled)
    {
        return null ;
    }

    return get_simware() ;
}

export function wepsim_get_binary_microcode()
{
    // microcompile if needed
    if (false == inputfirm.is_compiled)
    {
        var textToMCompile = inputfirm.getValue() ;
        var ok = wepsim_compile_firmware(textToMCompile) ;
        inputfirm.is_compiled = ok ;
        inputasm.is_compiled = false ;
    }

    // update content
    if (false == inputfirm.is_compiled)
    {
        return null ;
    }

    return get_simware() ;
}

/*
     * Microcompile and compile
     */

export function wepsim_compile_assembly(textToCompile)
{
    // get SIMWARE.firmware
    var SIMWARE = get_simware() ;
    if (SIMWARE.firmware.length === 0)
    {
        wsweb_dlg_alert('WARNING: please load the microcode first.');
        sim_change_workspace('#main3') ;
        return false;
    }

    // compile Assembly and show message
    var SIMWAREaddon = wsasm_src2mem(SIMWARE, textToCompile, {});
    if (SIMWAREaddon.error != null)
    {
        showError(SIMWAREaddon.error, 'inputasm') ;
        return false;
    }

    wepsim_notify_success('<strong>INFO</strong>',
                          'Assembly was compiled and loaded.') ;

    // update memory and segments
    set_simware(SIMWAREaddon) ;
    update_memories(SIMWARE);

    // update UI
    asmdbg_update_assembly() ;

    simcore_reset();
    return true;
}

export function wepsim_compile_firmware(textToMCompile)
{
    var ret = simcore_compile_firmware(textToMCompile) ;
    if (false === ret.ok)
    {
        showError(ret.msg, 'inputfirm') ;
        return false;
    }

    // update UI
    wepsim_notify_success('<strong>INFO</strong>',
                          'Microcode was compiled and loaded.') ;

    simcore_reset() ;
    return true;
}

