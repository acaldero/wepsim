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

import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { StreamLanguage, syntaxHighlighting, HighlightStyle, indentUnit } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';

import { indentLess, indentMore, toggleComment } from '@codemirror/commands';
import { autocompletion, startCompletion } from '@codemirror/autocomplete';
import { linter, setDiagnosticsEffect } from '@codemirror/lint';
import { tags } from '@lezer/highlight';

import { showMinimap } from '@replit/codemirror-minimap';

import { oneDark } from '@codemirror/theme-one-dark';

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
import { ws_directives } from '../sim_sw/assembly/directives.js';
import { dt_get_imm_value } from '../sim_sw/assembly/datatypes.js';

var themeCompartment    = new Compartment();
var keymapCompartment   = new Compartment();
var readOnlyCompartment = new Compartment();
var languageCompartment = new Compartment();

function get_theme(themeName)
{
    if (themeName === 'one-dark')
        return oneDark;
    if (themeName === 'default')
        return EditorView.theme({ '&': { backgroundColor: '#FFF' } });
    return [];
}

export function sim_cfg_editor_theme(wrapper)
{
    wrapper.editor_view.dispatch({
        effects: themeCompartment.reconfigure(get_theme(get_cfg('editor_theme'))),
    });
}

export async function sim_cfg_editor_mode(wrapper)
{
    var edt_mode = get_cfg('editor_mode');
    var ext      = [];
    if (edt_mode === 'vim')
    {
        var m = await import('@replit/codemirror-vim');
        ext   = [m.vim()];
    }
    else if (edt_mode === 'emacs')
    {
        var m = await import('@replit/codemirror-emacs');
        ext   = [m.emacs()];
    }
    wrapper.editor_view.dispatch({
        effects: keymapCompartment.reconfigure(ext),
    });
}

// Lint: enables CM6 lint infrastructure; diagnostics set via setDiagnostics effect
var wepsimLint = linter(function()
{
    return [];
}, { needsRefresh: () => false });

function createEditorWrapper(textareaId, extensions)
{
    var textarea            = document.getElementById(textareaId);
    var container           = document.createElement('div');
    container.className     = 'cm-editor-container';
    container.style.cssText = 'flex:1;min-height:0;overflow:auto';
    if (textarea && textarea.parentNode)
    {
        textarea.parentNode.insertBefore(container, textarea.nextSibling);
        textarea.style.display = 'none';
    }

    var extArray = [
        themeCompartment.of([]),
        keymapCompartment.of([]),
        readOnlyCompartment.of([]),
        EditorView.theme({
            '&':            { height: '100%' },
            '.cm-scroller': { overflow: 'auto' },
            '.cm-content':  { 'white-space': 'pre-wrap', 'word-break': 'normal', 'font-weight': 'bold' },
        }),
        showMinimap.compute(['doc'], () => ({ create: (v) => ({ dom: document.createElement('div') }) })),
    ].concat(extensions);

    var view = new EditorView({
        doc:        '\n\n\n\n\n\n\n\n\n\n',
        extensions: extArray,
        parent:     container,
    });

    var wrapper          = {};
    wrapper.editor_view  = view;
    wrapper.is_modified  = true;
    wrapper.is_compiled  = false;
    wrapper.is_refreshed = false;

    wrapper.getValue = function()
    {
        return view.state.doc.toString();
    };

    wrapper.setValue = function(text)
    {
        view.dispatch({
            changes: { from: 0, to: view.state.doc.length, insert: text },
        });
    };

    wrapper.setOption = function(option, value)
    {
        if (option === 'readOnly')
        {
            view.dispatch({
                effects: readOnlyCompartment.reconfigure(
                    value ? EditorState.readOnly.of(true) : [],
                ),
            });
        }
        else if (option === 'theme')
        {
            view.dispatch({
                effects: themeCompartment.reconfigure(get_theme(value)),
            });
        }
    };

    wrapper.refresh = function()
    {
        view.requestMeasure();
    };

    wrapper.setCursor = function(pos)
    {
        var line   = (typeof pos === 'object') ? pos : view.state.doc.line(pos.line + 1);
        var anchor = (typeof pos === 'object' && pos.ch !== undefined) ?
            view.state.doc.line(pos.line + 1).from + pos.ch :
            line.from;
        view.dispatch({
            selection:      { anchor: anchor, head: anchor },
            scrollIntoView: true,
        });
    };

    wrapper.getCursor = function()
    {
        var head = view.state.selection.main.head;
        var line = view.state.doc.lineAt(head);
        return { line: line.number - 1, ch: head - line.from };
    };

    wrapper.charCoords = function(pos, mode)
    {
        var line   = view.state.doc.line(pos.line + 1);
        var offset = line.from + (pos.ch || 0);
        var coords = view.coordsAtPos(offset);
        return coords || { top: 0, left: 0 };
    };

    wrapper.getScrollerElement = function()
    {
        return view.scrollDOM;
    };

    wrapper.scrollTo = function(x, y)
    {
        view.scrollDOM.scrollTo(x, y);
    };

    wrapper.getWrapperElement = function()
    {
        return view.dom;
    };

    wrapper.setSize = function(w, h)
    {
        view.dom.style.width   = w;
        view.dom.style.height  = h;
        container.style.height = h;
    };

    wrapper.execCommand = function(cmd)
    {
        if (cmd === 'toggleComment')
            toggleComment(view);
    };

    return wrapper;
}

function insertIndentUnit({ state, dispatch })
{
    if (state.selection.ranges.some((r) => !r.empty))
        return indentMore({ state, dispatch });

    dispatch(state.update(state.replaceSelection(state.facet(indentUnit)), { scrollIntoView: true, userEvent: 'input' }));
    return true;
}

export function sim_cm_get_firmcfg()
{
    return [
        basicSetup,
        wepsimLint,
        javascript(),
        EditorView.lineWrapping,
        indentUnit.of('    '),
        keymap.of([
            { key: 'Ctrl-/', run: toggleComment },
            { key: 'Tab', run: insertIndentUnit, shift: indentLess },
        ]),
    ];
}

// --- Custom assembly language based on get_simware() ---

// Return true if word matches any register alias (case-sensitive)
function asm_is_register(word)
{
    var sw = get_simware();
    for (var rf in sw.registers)
    {
        var regFile = sw.registers[rf];
        if (!regFile || !regFile.registers) continue;
        for (const key of Object.keys(regFile.registers))
        {
            var aliases = regFile.registers[key];
            if (!Array.isArray(aliases)) continue;
            for (const alias of aliases)
                if (alias === word) return true;
        }
    }
    return false;
}

// Return true if word is a known instruction or pseudo-instruction (case-sensitive)
function asm_is_instruction(word)
{
    var sw = get_simware();
    for (const inst of sw.firmware)
        if (inst.name === word) return true;
    for (const pi of sw.pseudoInstructions)
        if (pi.initial && pi.initial.name === word) return true;
    return false;
}

// Build autocomplete list of all instruction names (excluding 'begin')
function asm_get_instruction_options()
{
    var sw     = get_simware();
    var result = [];
    for (const inst of sw.firmware)
    {
        if (inst.name != 'begin')
            result.push({
                label:  inst.name,
                type:   'keyword',
                detail: inst.signatureUser || '',
                info:   inst.help || '',
            });
    }
    for (const pi of sw.pseudoInstructions)
    {
        if (pi.initial && pi.initial.name != 'begin')
            result.push({
                label:  pi.initial.name,
                type:   'keyword',
                detail: pi.initial.signature || '',
                info:   '',
            });
    }
    return result;
}

// Build autocomplete list of register aliases
function asm_get_register_options()
{
    var sw     = get_simware();
    var result = [];
    for (var rf in sw.registers)
    {
        var regFile = sw.registers[rf];
        if (!regFile || !regFile.registers || !Array.isArray(regFile.registers)) continue;
        for (const aliases of regFile.registers)
        {
            if (!Array.isArray(aliases)) continue;
            for (const alias of aliases)
                result.push({ label: alias, type: 'variable', detail: '' });
        }
    }
    return result;
}

// Build autocomplete list of all assembly directives (.word, .data, ...)
function asm_get_directives_options()
{
    var result = [];
    for (const d of Object.keys(ws_directives))
        result.push({ label: d, type: 'keyword', detail: '', info: '' });
    return result;
}

// Given an instruction and argument index, return its expected type (reg/imm/address/offset)
// inParen=true looks for the inner type inside parentheses, e.g. imm(reg) -> reg
function asm_get_arg_type(instName, argIdx, inParen)
{
    var sw = get_simware();
    for (const inst of sw.firmware)
    {
        if (inst.name !== instName) continue;
        var sigParts = inst.signatureUser.split(' ');
        if (argIdx >= 0 && argIdx < sigParts.length)
        {
            var part = sigParts[argIdx];
            if (inParen)
            {
                var m = part.match(/\((\w+)\)/);
                if (m) return m[1];
            }
            else
            {
                var m = part.match(/^(\w+)\(/);
                if (m) return m[1];
                return part;
            }
        }
        break;
    }
    for (const pInst of sw.pseudoInstructions)
    {
        if (!pInst.initial || pInst.initial.name !== instName) continue;
        var fields   = pInst.initial.fields;
        var fieldIdx = argIdx - 1;
        if (fieldIdx >= 0 && fieldIdx < fields.length)
            return fields[fieldIdx].type;
        break;
    }
    return null;
}

function wepsim_get_asm_language()
{
    return {
        name:       'wepsim-asm',
        startState: function()
        {
            return { tokenize: null, curInst: null, argIdx: 0, inParen: 0 };
        },
        token: function(stream, state)
        {
            if (state.tokenize)
                return state.tokenize(stream, state);

            if (stream.eatSpace())
                return null;

            var ch = stream.next();

            if (ch === '#')
            {
                state.curInst = null;
                stream.skipToEnd();
                return 'comment';
            }

            if (ch === '"')
            {
                var escaped = false, next;
                while ((next = stream.next()) != null)
                {
                    if (next === '"' && !escaped) break;
                    escaped = !escaped && next === '\\';
                }
                return 'string';
            }

            if (ch === "'")
            {
                var next = stream.next();
                if (next != null)
                {
                    if (next === '\\')
                        stream.next();
                    if (stream.peek() === "'")
                        stream.next();
                }
                return 'character';
            }

            if (ch === '0' && (stream.eat('x') || stream.eat('X')))
            {
                stream.eatWhile(/[0-9a-fA-F]/);
                return 'number';
            }

            if (/\d/.test(ch))
            {
                stream.eatWhile(/\d/);
                if (stream.peek() === '.')
                {
                    stream.next();
                    if (stream.peek() && /\d/.test(stream.peek()))
                        stream.eatWhile(/\d/);
                }
                return 'number';
            }

            if (ch === ',')
            {
                return null;
            }

            if (ch === '(')
            {
                if (state.curInst) state.inParen++;
                return null;
            }

            if (ch === ')')
            {
                if (state.inParen > 0) state.inParen--;
                return null;
            }

            if (ch === '{' || ch === '}')
                return 'bracket';

            if (/\w/.test(ch) || ch === '$' || ch === '.')
            {
                stream.eatWhile(/[\w$.]/);

                if (stream.eat(':'))
                    return 'tag';

                var word = stream.current();

                if (ws_directives[word]) return 'builtin';

                if (asm_is_instruction(word))
                {
                    state.curInst = word;
                    state.argIdx  = 0;
                    state.inParen = 0;
                    return 'keyword';
                }

                if (state.curInst)
                {
                    if (asm_is_register(word))
                    {
                        state.argIdx++;
                        return 'variable';
                    }
                    var argType = asm_get_arg_type(state.curInst, state.argIdx + 1, state.inParen > 0);
                    state.argIdx++;
                    if (argType === 'reg') return null;
                    if (dt_get_imm_value(word).isDecimal) return 'number';
                    return 'tag';
                }
                return null;
            }

            return null;
        },
        languageData: {
            commentTokens: {
                line: '#',
            },
        },
    };
}

// Return 'instruction' if cursor is before any instruction, 'argument' if after one with pending args
function asm_completion_context(state, from)
{
    var line   = state.doc.lineAt(from);
    var before = line.text.slice(0, from - line.from);
    var idx    = before.indexOf('#');
    if (idx >= 0)
        before = before.slice(0, idx);
    if (before.trim().length === 0)
        return { mode: 'instruction' };

    var tokens = before.split(/[\s,()]+/).filter(function(t)
    {
        return t.length > 0 && !t.endsWith(':');
    });

    // Search from right to left for the last instruction
    for (var t = tokens.length - 1; t >= 0; t--)
    {
        if (!asm_is_instruction(tokens[t])) continue;

        var sw       = get_simware();
        var inst     = tokens[t];
        var args     = 0;
        var sigParts = 0;

        // Count non-instruction tokens after this instruction
        for (var a = t + 1; a < tokens.length; a++)
            if (!asm_is_instruction(tokens[a]) && !ws_directives[tokens[a]]) args++;

        // Get expected argument count from firmware signature
        for (const f of sw.firmware)
        {
            if (f.name === inst)
            {
                sigParts = f.signatureUser.split(' ').length - 1;
                break;
            }
        }
        if (!sigParts)
        {
            for (const p of sw.pseudoInstructions)
            {
                if (p.initial && p.initial.name === inst)
                {
                    sigParts = p.initial.signature.split(',').length - 1;
                    break;
                }
            }
        }

        return args < sigParts ? { mode: 'argument' } : { mode: 'instruction' };
    }

    return { mode: 'instruction' };
}

var asmHighlightStyle = HighlightStyle.define([
    { tag: tags.comment, color: '#888' },
    { tag: tags.string, color: '#a22' },
    { tag: tags.number, color: '#164' },
    { tag: tags.keyword, color: '#708' },
    { tag: tags.variableName, color: '#00f' },
    { tag: tags.standard, color: '#30a' },
    { tag: tags.tagName, color: '#170' },
    { tag: tags.bracket, color: '#888' },
]);

export function sim_cm_get_asmcfg()
{
    return [
        basicSetup,
        wepsimLint,
        languageCompartment.of(StreamLanguage.define(wepsim_get_asm_language())),
        syntaxHighlighting(asmHighlightStyle),
        EditorView.lineWrapping,
        autocompletion({
            override: [
                function(context)
                {
                    var word = context.matchBefore(/[\w$.]*/);
                    if (!word || (word.from === word.to && !context.explicit))
                        return null;

                    var ctx = asm_completion_context(context.state, word.from);
                    var result;

                    if (ctx.mode === 'instruction')
                    {
                        if (word && word.from !== word.to && word.text && word.text[0] === '.')
                            result = asm_get_directives_options();
                        else
                            result = asm_get_instruction_options();
                    }
                    else
                    {
                        result = asm_get_register_options();
                    }
                    return { from: word.from, to: word.to, options: result };
                },
            ],
        }),
        indentUnit.of('    '),
        keymap.of([
            { key: 'Ctrl-Space', run: startCompletion },
            { key: 'Ctrl-/', run: toggleComment },
            { key: 'Tab', run: insertIndentUnit, shift: indentLess },
        ]),
    ];
}

export async function sim_init_editor(editor_id, editor_cfg)
{
    var wrapper = createEditorWrapper(editor_id, editor_cfg);

    sim_cfg_editor_theme(wrapper);
    await sim_cfg_editor_mode(wrapper);

    wrapper.editor_view.requestMeasure();

    return wrapper;
}

export function goError(editor, pos)
{
    var line = editor.editor_view.state.doc.line(pos);
    editor.editor_view.dispatch({
        selection: { anchor: line.from, head: line.from },
        effects:   EditorView.scrollIntoView(line.from, { y: 'center' }),
    });
}

export function showError(Msg, editor)
{
    var errorMsg = Msg.replace(/\t/g, ' ').replace(/ {3}/g, ' ');

    // Set lint diagnostics
    var edtView = (editor === 'inputasm') ? inputasm.editor_view : inputfirm.editor_view;
    var diags   = parse_compile_errors(Msg, editor, edtView.state.doc);
    edtView.dispatch({
        effects: setDiagnosticsEffect.of(diags),
    });

    var pos     = errorMsg.match(/Problem around line \d+/);
    var lineMsg = '' ;
    if (null !== pos)
    {
        pos      = parseInt(pos[0].match(/\d+/)[0]);
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

// TODO: make the compiler export correct error object with separated fields
export function parse_compile_errors(Msg, editor, doc)
{
    var errorMsg = Msg.replace(/\t/g, ' ').replace(/ {3}/g, ' ');

    var diags = [];

    // Extract line number from pre block: *N\t or Problem around line N
    var m       = errorMsg.match(/\*(\d+)\t/);
    var lineNum = null;
    if (m) lineNum = parseInt(m[1]);

    if (!lineNum)
    {
        m = errorMsg.match(/Problem around line (\d+)/);
        if (m) lineNum = parseInt(m[1]);
    }

    // Extract error message
    var message ;
    m = errorMsg.match(/: <br>(.+)/);
    if (m)
    {
        message = m[1].replace(/<br>/gi, '\n').replace(/<[^>]*>/g, '').replace(/\.<br>.*$/, '').trim();
    }
    else
    {
        message = errorMsg.replace(/<br>/gi, '\n').replace(/<[^>]*>/g, '').trim();
    }

    if (lineNum && doc)
    {
        try
        {
            var line = doc.line(lineNum);
            diags.push({
                from:     line.from,
                to:       line.to,
                message:  message,
                severity: 'error',
            });
        }
        catch (ex)
        {
            diags.push({
                from:     0,
                to:       0,
                message:  message,
                severity: 'error',
            });
        }
    }
    else
    {
        diags.push({
            from:     0,
            to:       0,
            message:  message,
            severity: 'error',
        });
    }

    return diags;
}

export function wepsim_get_binary_code()
{
    // compile if needed
    if (false == inputasm.is_compiled)
    {
        var textToCompile    = inputasm.getValue() ;
        var ok               = wepsim_compile_assembly(textToCompile) ;
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
        var textToMCompile    = inputfirm.getValue() ;
        var ok                = wepsim_compile_firmware(textToMCompile) ;
        inputfirm.is_compiled = ok ;
        inputasm.is_compiled  = false ;
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

    // Quit previous errors
    inputasm.editor_view.dispatch({
        effects: setDiagnosticsEffect.of([]),
    });

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

    // Quit previous errors
    inputfirm.editor_view.dispatch({
        effects: setDiagnosticsEffect.of([]),
    });

    wepsim_notify_success('<strong>INFO</strong>',
                          'Microcode was compiled and loaded.') ;

    inputasm.editor_view.dispatch({
        effects: languageCompartment.reconfigure(StreamLanguage.define(wepsim_get_asm_language())),
    });

    simcore_reset() ;
    return true;
}

