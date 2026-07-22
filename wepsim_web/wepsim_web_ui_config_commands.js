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

import $ from 'jquery';
import { get_cfg, update_cfg } from '../sim_core/sim_cfg.js';
import { ws_info } from '../sim_core/sim_adt_core.js';
import { i18n_get_select, i18n_get_selectcfg } from '../wepsim_i18n/i18n.js';
import { refresh, show_memories_values } from '../sim_core/sim_core_ui.js';
import { wepsim_activeview } from './wepsim_web_simulator.js';
import { wepsim_svg_start_drawing, wepsim_svg_stop_drawing } from './wepsim_uielto_cpusvg.js';
import { ws_uielto } from './wepsim_uielto.js';
import { get_var } from '../sim_core/sim_core_values.js';
import { cfg_show_asmdbg_pc_delay, cfg_show_dbg_ir_delay } from '../sim_core/sim_cfg.js';
import { get_simware } from '../sim_core/sim_adt_core.js';
import { get_value } from '../sim_core/sim_core_values.js';
import { simhw_internalState, simhw_sim_ctrlStates_get, simhw_sim_state } from '../sim_hw/sim_hw_index.js';
import { simhw_sim_signals } from '../sim_hw/sim_hw_index.js';
import { i18n_get, i18n_get_TagFor } from '../wepsim_i18n/i18n.js';
import { quickcfg_html_header, quickcfg_html_onoff } from './wepsim_web_ui_quickcfg.js';
import { sim_core_breakpointicon_get } from '../wepsim_core/wepsim_dbg_breakpointicons.js';
import { simcore_record_append_new } from '../sim_core/sim_core_record.js';
import { wepsim_execute_toggle_breakpoint } from '../wepsim_core/wepsim_execute.js';
import { wepsim_config_button_pretoggle, wepsim_config_button_toggle, wepsim_show_breakpoint_icon_list, wepsim_show_breakpoint_icon_template, wepsim_config_button_html_onoff, wepsim_config_button_html_2options, wepsim_config_button_html_color, wepsim_config_color_initial, wepsim_config_button_pretoggle_val2, wepsim_config_button_toggle2 } from './wepsim_web_ui_config.js';
import { wepsim_quickcfg_init } from './wepsim_web_ui_quickcfg.js';
import { wepsim_toggle_history_ui, wepsim_uicfg_apply, wepsim_restore_darkmode, wepsim_keepsync_darkmode_start, wepsim_keepsync_darkmode_stop } from './wepsim_web_simulator.js';
import { WORD_BYTES } from '../sim_sw/assembly/datatypes.js';
import { main_memory_getsrc, main_memory_getsrcbin } from '../sim_core/sim_adt_mainmemory.js';
import { simhw_active } from '../sim_hw/sim_hw_index.js';
import { simhwelto_describe_component, simhwelto_prepare_hash } from '../sim_hw/sim_hw_eltos.js';
import { value_toString } from '../sim_core/sim_core_values.js';
import { wepsim_popovers_hide, wepsim_popovers_init, wepsim_popover_init } from './wepsim_web_ui_popover.js';
import { popover_cfg_make } from './wepsim_uielto_registers.js';
import { wepsim_update_signal_dialog } from '../wepsim_core/wepsim_signal.js';

export function wepsim_register_config_ui()
{
    ws_info.config_ui = [] ;

    //
    // General
    //

    ws_info.config_ui.push({
        id:       'select7',
        type:     'General',
        u_class:  '',
        code_cfg: "<div class='form-group m-0'>" +
            i18n_get_selectcfg() +
            '</div>',
        code_init: function()
        {
            $('#select7').val(get_cfg('ws_idiom'));
        },
        description: "<span data-langkey='Idiom for help, examples, etc.'>Idiom for help, examples, etc.</span>",
    });

    ws_info.config_ui.push({
        id:       'radio15',
        type:     'General',
        u_class:  '',
        code_cfg: "<div class='btn-group d-flex'>" +
            "        <input type='radio' name='options' id='radio15-off'   autocomplete='off' class='btn-check'>" +
            "        <label id='label15-off' for='radio15-off' data-bs-toggle='buttons' " +
            "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
            "           aria-label='Dark mode: Off'" +
            "           data-bind=\"click\" data-action=\"cfg-toggle\" data-key=\"ws_skin_dark_mode\" data-value=\"off\" data-extra=\"15\"><span data-langkey='Off'>Off</span>" +
            '        </label>' +
            "        <input type='radio' name='options' id='radio15-on'    autocomplete='off' class='btn-check'>" +
            "        <label id='label15-on' for='radio15-on' data-bs-toggle='buttons' " +
            "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
            "           aria-label='Dark mode: On'" +
            "           data-bind=\"click\" data-action=\"cfg-toggle\" data-key=\"ws_skin_dark_mode\" data-value=\"on\" data-extra=\"15\"><span data-langkey='On'>On</span>" +
            '        </label>' +
            "        <input type='radio' name='options' id='radio15-auto'   autocomplete='off' class='btn-check'>" +
            "        <label id='label15-auto' for='radio15-auto' data-bs-toggle='buttons' " +
            "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
            "           aria-label='Dark mode: Auto'" +
            "           data-bind=\"click\" data-action=\"cfg-toggle\" data-key=\"ws_skin_dark_mode\" data-value=\"auto\" data-extra=\"15\"><span data-langkey='Auto'>Auto</span>" +
            '        </label>' +
            '    </div>',
        code_init: function()
        {
            wepsim_config_button_pretoggle('ws_skin_dark_mode', '15') ;
            wepsim_restore_darkmode() ;
        },
        description: "<span data-langkey='Dark Mode'>Dark Mode</span>",
    });

    ws_info.config_ui.push({
        id:       'slider3',
        type:     'General',
        u_class:  '',
        code_cfg: "<div class='btn-group d-flex'>" +
            "        <input type='radio' name='options' id='radio8-2000'   autocomplete='off' class='btn-check'>" +
            "        <label id='label8-2000' for='radio8-2000' data-bs-toggle='buttons' " +
            "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
            "           aria-label='Notification delay: slow'" +
            "           data-bind=\"click\" data-action=\"cfg-toggle\" data-key=\"NOTIF_delay\" data-value=\"2000\" data-extra=\"8\"><span data-langkey='Slow'>Slow</span>" +
            '        </label>' +
            "        <input type='radio' name='options' id='radio8-1000'  autocomplete='off' class='btn-check'>" +
            "        <label id='label8-1000' for='radio8-1000' data-bs-toggle='buttons' " +
            "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
            "           aria-label='Notification delay: normal'" +
            "           data-bind=\"click\" data-action=\"cfg-toggle\" data-key=\"NOTIF_delay\" data-value=\"1000\" data-extra=\"8\"><span data-langkey='Normal'>Normal</span>" +
            '        </label>' +
            "        <input type='radio' name='options' id='radio8-100'  autocomplete='off' class='btn-check'>" +
            "        <label id='label8-100' for='radio8-100' data-bs-toggle='buttons' " +
            "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
            "           aria-label='Notification delay: fast'" +
            "           data-bind=\"click\" data-action=\"cfg-toggle\" data-key=\"NOTIF_delay\" data-value=\"100\" data-extra=\"8\"><span data-langkey='Fast'>Fast</span>" +
            '        </label>' +
            '    </div>',
        code_init: function()
        {
            wepsim_config_button_pretoggle('NOTIF_delay', '8') ;
        },
        description: "<span data-langkey='Notification speed: time before disapear'>Notification speed: time before disapear</span>",
    });

    //
    // Execution
    //

    ws_info.config_ui.push({
        id:       'radio12',
        type:     'Execution',
        u_class:  '',
        code_cfg: "<div class='btn-group btn-group-toggle d-flex' data-bs-toggle='buttons' >" +
            "        <input type='radio' name='options' id='radio12-200'   autocomplete='off' class='btn-check'>" +
            "        <label id='label12-200' for='radio12-200' " +
            "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
            "           aria-label='Speed: slow'" +
            "           data-bind=\"click\" data-action=\"cfg-toggle\" data-key=\"DBG_delay\" data-value=\"200\" data-extra=\"12\"><span data-langkey='Slow'>Slow</span>" +
            '        </label>' +
            "        <input type='radio' name='options' id='radio12-100'  autocomplete='off' class='btn-check'>" +
            "        <label id='label12-100' for='radio12-100' " +
            "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
            "           aria-label='Speed: normal'" +
            "           data-bind=\"click\" data-action=\"cfg-toggle\" data-key=\"DBG_delay\" data-value=\"100\" data-extra=\"12\"><span data-langkey='Normal'>Normal</span>" +
            '        </label>' +
            "        <input type='radio' name='options' id='radio12-1'  autocomplete='off' class='btn-check'>" +
            "        <label id='label12-1' for='radio12-1'" +
            "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
            "           aria-label='Speed: fast'" +
            "           data-bind=\"click\" data-action=\"cfg-toggle\" data-key=\"DBG_delay\" data-value=\"1\" data-extra=\"12\"><span data-langkey='Fast'>Fast</span>" +
            '        </label>' +
            '    </div>',
        code_init: function()
        {
            wepsim_config_button_pretoggle('DBG_delay', '12') ;
        },
        description: "<span data-langkey='Running speed: execution speed'>Running speed: execution speed</span>",
    });

    /*
    ws_info.config_ui.push({
                      id:          "radio1",
                      type:        "Execution",
                      u_class:     "wsx_morecfg",
                       code_cfg:    wepsim_config_button_html_2options('1', 'Execution unit',
                                                    "<span class='d-none d-sm-inline-flex' data-langkey='Instructions'>Instructions</span><span class='d-sm-none'>Instruc.</span>",
                                                    "instruction",
                                                    "<span class='d-none d-sm-inline-flex' data-langkey='&#181;instructions'>&#181;instructions</span><span class='d-sm-none'>&#183;instruc.</span>",
                                                    "microinstruction",
                                                    'DBG_level'),
              code_init:   function() {
                                       wepsim_config_button_pretoggle('DBG_level', '1') ;
                           },
                      description: "<span data-langkey='Step-by-step: element in run mode'>Step-by-step: element in run mode</span>"
                   });
*/

    ws_info.config_ui.push({
        id:       'select1',
        type:     'Execution',
        u_class:  '',
        code_cfg: "<a href='#' id='breakpointicon1' title='Please select breakpoint icon' tabindex='0'" +
            "   data-bs-toggle='popover' data-trigger='click'>" +
            "           <img alt='stop icon' id='img_select1' src='images/stop/stop_classic.gif' class='' " +
            "                 style='position:relative; left:10px; height:30px !important; width:30px !important;'>" +
            '</a>',
        code_init: function()
        {
            var elto = get_cfg('ICON_theme') ;
            $('#img_select1').attr('src', 'images/stop/stop_' + elto + '.gif');
            $('#img_select1').attr('class', ws_info.breakpoint_icon_list[elto].addclass);
            var popover_cfg = {
                html:       true,
                content:    wepsim_show_breakpoint_icon_list,
                template:   wepsim_show_breakpoint_icon_template(),
                sanitizeFn: function(content)
                {
                    return content;
                },
            };
            wepsim_popover_init('#breakpointicon1', popover_cfg,
                                function(shownEvent)
                                {
                                    wepsim_uicfg_apply();
                                });
        },
        description: "<span data-langkey='Breakpoint icon: icon to be used for breakpoints'>Breakpoint icon: icon to be used for breakpoints</span>",
    });

    ws_info.config_ui.push({
        id:       'select6',
        type:     'Execution',
        u_class:  '',
        code_cfg: " <div class='form-group m-0'>" +
            "        <select name='select6' id='select6' " +
            "                class='form-control form-control-sm form-select border-secondary'" +
            "            aria-label='max. ticks per instruction' " +
            '            data-bind="change" data-action="cfg-select" data-key="DBG_limitins"' +
            "            data-native-menu='false'>" +
            "        <option value='-1'>without limit</option>" +
            "        <option value='500'  >500</option>" +
            "        <option value='1000' >1000</option>" +
            "        <option value='2000' >2000</option>" +
            "        <option value='10000'>10000</option>" +
            "        <option value='50000'>50000</option>" +
            '        </select>' +
            '     </div>',
        code_init: function()
        {
            $('#select6').val(get_cfg('DBG_limitins'));
        },
        description: "<span data-langkey='Limit instructions: number of instructions to be executed'>Limit instructions: number of instructions to be executed</span>",
    });

    ws_info.config_ui.push({
        id:       'select3',
        type:     'Execution',
        u_class:  '',
        code_cfg: " <div class='form-group m-0'>" +
            "        <select name='select3' id='select3' " +
            "                class='form-control form-control-sm form-select border-secondary'" +
            "            aria-label='max. ticks per instruction' " +
            '            data-bind="change" data-action="cfg-select" data-key="DBG_limitick"' +
            "            data-native-menu='false'>" +
            "        <option value='-1'>without limit</option>" +
            "        <option value='500'  >500</option>" +
            "        <option value='1000' >1000</option>" +
            "        <option value='2000' >2000</option>" +
            "        <option value='10000'>10000</option>" +
            "        <option value='50000'>50000</option>" +
            '        </select>' +
            '     </div>',
        code_init: function()
        {
            $('#select3').val(get_cfg('DBG_limitick'));
        },
        description: "<span data-langkey='Limit instruction ticks: to limit clock ticks'>Limit instruction ticks: to limit clock ticks</span>",
    });

    ws_info.config_ui.push({
        id:       'radio4',
        type:     'Execution',
        u_class:  '',
        code_cfg: wepsim_config_button_html_onoff('4', 'Skip notify: comments',
                                                  i18n_get_TagFor('cfg', 'Off'),
                                                  i18n_get_TagFor('cfg', 'On'),
                                                  'DBG_skip_notifycolon'),
        code_init: function()
        {
            wepsim_config_button_pretoggle('DBG_skip_notifycolon', '4') ;
        },
        description: "<span data-langkey='Skip notify: comments'>Skip notify: comments</span>",
    });

    //
    // Editor
    //

    ws_info.config_ui.push({
        id:       'select5',
        type:     'Editor',
        u_class:  '',
        code_cfg: "<div class='form-group m-0'>" +
            "   <select name='select5' id='select5' " +
            "        class='form-control form-control-sm form-select border-secondary'" +
            "        aria-label='Editor theme'    " +
            '            data-bind="change" data-action="cfg-select" data-key="editor_theme"' +
            "        data-native-menu='false'>" +
            "    <option value='default'>(💡) default</option>" +
            "    <option value='one-dark'>(🔅) one-dark</option>" +
            '    </select>' +
            '</div>',
        code_init: function()
        {
            $('#select5').val(get_cfg('editor_theme'));
        },
        description: "<span data-langkey='Editor theme: light or dark'>Editor theme: light or dark</span>",
    });

    ws_info.config_ui.push({
        id:       'select2',
        type:     'Editor',
        u_class:  '',
        code_cfg: "<div class='form-group m-0'>" +
            "   <select name='select2' id='select2' " +
            "        class='form-control form-control-sm form-select border-secondary'" +
            "        aria-label='Editor mode'    " +
            '            data-bind="change" data-action="cfg-select" data-key="editor_mode"' +
            "        data-native-menu='false'>" +
            "    <option value='default'>default</option>" +
            "    <option value='vim'>VIM</option>" +
            "    <option value='emacs'>Emacs</option>" +
            '    </select>' +
            '</div>',
        code_init: function()
        {
            $('#select2').val(get_cfg('editor_mode'));
        },
        description: "<span data-langkey='Editor mode: vim, emacs, etc.'>Editor mode: vim, emacs, etc.</span>",
    });

    //
    // Register file
    //

    ws_info.config_ui.push({
        id:       'radio2',
        type:     'Register file',
        u_class:  'wsx_morecfg',
        code_cfg: "    <div class='btn-group-toggle' data-bs-toggle='buttons' >" +
            "    <div class='btn-group d-flex btn-group-justified'>" +
            "        <input type='radio' name='options' id='radio2-unsigned_16_nofill'  autocomplete='off' class='btn-check'>" +
            "        <label id='label2-unsigned_16_nofill' for='radio2-unsigned_16_nofill'" +
            "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
            "           aria-label='register file display format: hexadecimal'" +
            '           data-bind="click" data-action="cfg-toggle" data-key="RF_display_format" data-value="unsigned_16_nofill" data-extra="2">1A<sub>16</sub>' +
            '        </label>' +
            "        <input type='radio' name='options' id='radio2-unsigned_10_nofill'  autocomplete='off' class='btn-check'>" +
            "        <label id='label2-unsigned_10_nofill' for='radio2-unsigned_10_nofill'" +
            "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
            "           aria-label='register file display format: decimal'" +
            '           data-bind="click" data-action="cfg-toggle" data-key="RF_display_format" data-value="unsigned_10_nofill" data-extra="2">32<sub>10</sub>' +
            '        </label>' +
            "        <input type='radio' name='options' id='radio2-unsigned_8_nofill'   autocomplete='off' class='btn-check'>" +
            "        <label id='label2-unsigned_8_nofill' for='radio2-unsigned_8_nofill' " +
            "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
            "           aria-label='register file display format: octal'" +
            '           data-bind="click" data-action="cfg-toggle" data-key="RF_display_format" data-value="unsigned_8_nofill" data-extra="2">26<sub>8</sub>' +
            '        </label>' +
            '    </div>' +
            "    <div class='btn-group d-flex btn-group-justified'>" +
            "        <input type='radio' name='options' id='radio2-unsigned_16_fill'  autocomplete='off' class='btn-check'>" +
            "        <label id='label2-unsigned_16_fill' for='radio2-unsigned_16_fill' " +
            "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
            "           aria-label='register file display format: hexadecimal'" +
            '           data-bind="click" data-action="cfg-toggle" data-key="RF_display_format" data-value="unsigned_16_fill" data-extra="2">001A<sub>16</sub>' +
            '        </label>' +
            "        <input type='radio' name='options' id='radio2-unsigned_10_fill'  autocomplete='off' class='btn-check'>" +
            "        <label id='label2-unsigned_10_fill' for='radio2-unsigned_10_fill' " +
            "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
            "           aria-label='register file display format: decimal'" +
            '           data-bind="click" data-action="cfg-toggle" data-key="RF_display_format" data-value="unsigned_10_fill" data-extra="2">0032<sub>10</sub>' +
            '        </label>' +
            "        <input type='radio' name='options' id='radio2-unsigned_8_fill'   autocomplete='off' class='btn-check'>" +
            "        <label id='label2-unsigned_8_fill' for='radio2-unsigned_8_fill'" +
            "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
            "           aria-label='register file display format: octal'" +
            '           data-bind="click" data-action="cfg-toggle" data-key="RF_display_format" data-value="unsigned_8_fill" data-extra="2">0026<sub>8</sub>' +
            '        </label>' +
            '    </div>' +
            '    </div>',
        code_init: function()
        {
            wepsim_config_button_pretoggle('RF_display_format', '2') ;
        },
        description: "<span data-langkey='Display format'>Display format</span>&nbsp;" +
            "<a href='#' data-bs-toggle='popover1' title='Example of display formats' data-bs-html='true' " +
            "   data-bs-content='<img alt=\"register file example\" src=\"images/cfg-rf.gif\" class=\"img-fluid\">'><span <span data-langkey='(example)'>(example)</span></a>",
    });

    ws_info.config_ui.push({
        id:       'radio3',
        type:     'Register file',
        u_class:  'wsx_morecfg',
        code_cfg: wepsim_config_button_html_2options('3', 'register file display name',
                                                     "<span data-langkey='Numbers'>Numbers</span>",
                                                     'numerical',
                                                     "<span data-langkey='Labels'>Labels</span>",
                                                     'logical',
                                                     'RF_display_name'),
        code_init: function()
        {
            wepsim_config_button_pretoggle('RF_display_name', '3') ;
        },
        description: "<span data-langkey='Register file names'>Register file names</span>",
    });

    ws_info.config_ui.push({
        id:       'radio9',
        type:     'Register file',
        u_class:  'wsx_morecfg',
        code_cfg: wepsim_config_button_html_onoff('9', 'Is editable',
                                                  i18n_get_TagFor('cfg', 'Off'),
                                                  i18n_get_TagFor('cfg', 'On'),
                                                  'is_editable'),
        code_init: function()
        {
            wepsim_config_button_pretoggle('is_editable', '9') ;
        },
        description: "<span data-langkey='Editable registers: edit register file values'>Editable registers: edit register file values</span>",
    });

    //
    // Circuitry simulation
    //

    ws_info.config_ui.push({
        id:       'colorpicker1',
        type:     'Circuitry simulation',
        u_class:  'wsx_microcode',
        code_cfg: wepsim_config_button_html_color('colorpicker1',
                                                  'Color for active active data',
                                                  'color_data_active'),
        code_init: function()
        {
            wepsim_config_color_initial('color_data_active', '#colorpicker1') ;
        },
        description: "<span data-langkey='Data-path color'>Data-path color</span> <a href='#' data-bs-toggle='popover1' title='Example of data-path color' data-bs-html='true' data-bs-content='<img alt=\"register file example\" src=\"images/cfg-colors.gif\" class=\"img-fluid\">'><span <span data-langkey='(example)'>(example)</span></a>",
    });

    ws_info.config_ui.push({
        id:       'colorpicker2',
        type:     'Circuitry simulation',
        u_class:  'wsx_microcode',
        code_cfg: wepsim_config_button_html_color('colorpicker2',
                                                  'Color for active signal name',
                                                  'color_name_active'),
        code_init: function()
        {
            wepsim_config_color_initial('color_name_active', '#colorpicker2') ;
        },
        description: "<span data-langkey='Signal color'>Signal color</span>",
    });

    ws_info.config_ui.push({
        id:       'select9',
        type:     'Circuitry simulation',
        u_class:  'wsx_microcode',
        code_cfg: " <div class='form-group m-0'>" +
            "     <select name='select9' id='select9' " +
            "             class='form-control form-control-sm form-select border-secondary'" +
            "         aria-label='default thickness of circuit cables' " +
            '         data-bind="change" data-action="cfg-select" data-key="size_inactive"' +
            "         data-native-menu='false'>" +
            "       <option value='1.0'>1.0</option>" +
            "       <option value='1.5'>1.5</option>" +
            "       <option value='2.0'>2.0</option>" +
            '     </select>' +
            ' </div>',
        code_init: function()
        {
            $('#select9').val(get_cfg('size_inactive').toFixed(1));
        },
        description: "<span data-langkey='Default thickness of circuit cables'>Default thickness of circuit cables</span>",
    });

    ws_info.config_ui.push({
        id:       'select10',
        type:     'Circuitry simulation',
        u_class:  'wsx_microcode',
        code_cfg: " <div class='form-group m-0'>" +
            "     <select name='select10' id='select10' " +
            "             class='form-control form-control-sm form-select border-secondary'" +
            "         aria-label='thickness of active circuit cables' " +
            '         data-bind="change" data-action="cfg-select" data-key="size_active"' +
            "         data-native-menu='false'>" +
            "       <option value='1.0'>1.0</option>" +
            "       <option value='3.0'>3.0</option>" +
            "       <option value='5.0'>5.0</option>" +
            '     </select>' +
            ' </div>',
        code_init: function()
        {
            $('#select10').val(get_cfg('size_active').toFixed(1));
        },
        description: "<span data-langkey='Thickness of active circuit cables'>Thickness of active circuit cables</span>",
    });

    ws_info.config_ui.push({
        id:       'radio10',
        type:     'Circuitry simulation',
        u_class:  'wsx_morecfg wsx_microcode',
        code_cfg: wepsim_config_button_html_onoff('10', 'Is by value',
                                                  i18n_get_TagFor('cfg', 'Off'),
                                                  i18n_get_TagFor('cfg', 'On'),
                                                  'is_byvalue'),
        code_init: function()
        {
            wepsim_config_button_pretoggle('is_byvalue', '10') ;
        },
        description: "<span data-langkey='Show by value or by activation'>Show by value or by activation</span>",
    });

    ws_info.config_ui.push({
        id:       'radio5',
        type:     'Circuitry simulation',
        u_class:  'wsx_microcode',
        code_cfg: wepsim_config_button_html_onoff('5', 'Is interactive',
                                                  i18n_get_TagFor('cfg', 'Off'),
                                                  i18n_get_TagFor('cfg', 'On'),
                                                  'is_interactive'),
        code_init: function()
        {
            wepsim_config_button_pretoggle('is_interactive', '5') ;
        },
        description: "<span data-langkey='Interactive mode: signal value can be updated'>Interactive mode: signal value can be updated</span>",
    });

    ws_info.config_ui.push({
        id:       'radio6',
        type:     'Circuitry simulation',
        u_class:  'wsx_microcode',
        code_cfg: wepsim_config_button_html_onoff('6', 'Is quick interactive',
                                                  i18n_get_TagFor('cfg', 'Off'),
                                                  i18n_get_TagFor('cfg', 'On'),
                                                  'is_quick_interactive'),
        code_init: function()
        {
            wepsim_config_button_pretoggle('is_quick_interactive', '6') ;
        },
        description: "<span data-langkey='Quick interactive mode: quick update of signal value'>Quick interactive mode: quick update of signal value</span>",
    });

    //
    // Accesibility
    //

    ws_info.config_ui.push({
        id:       'radio11',
        type:     'Accesibility',
        u_class:  'wsx_morecfg',
        code_cfg: wepsim_config_button_html_onoff('11', 'Active voice',
                                                  i18n_get_TagFor('cfg', 'Off'),
                                                  i18n_get_TagFor('cfg', 'On'),
                                                  'use_voice'),
        code_init: function()
        {
            wepsim_config_button_pretoggle('use_voice', '11') ;
        },
        description: "<span data-langkey='Active voice: external voice control'>Active voice: external voice control</span>",
    });

    ws_info.config_ui.push({
        id:       'radio13',
        type:     'Accesibility',
        u_class:  'wsx_morecfg',
        code_cfg: wepsim_config_button_html_2options('13', 'Verbose',
                                                     i18n_get_TagFor('cfg', 'Text'),
                                                     'text',
                                                     i18n_get_TagFor('cfg', 'Math'),
                                                     'math',
                                                     'verbal_verbose'),
        code_init: function()
        {
            wepsim_config_button_pretoggle('verbal_verbose', '13') ;
        },
        description: "<span data-langkey='Verbalization: textual or mathematical'>Verbalization: textual or mathematical</span>",
    });

    ws_info.config_ui.push({
        id:       'select8',
        type:     'Accesibility',
        u_class:  '',
        code_cfg: "<div class='form-group m-0'>" +
            " <select name='select8' id='select8' " +
            "         class='form-control form-control-sm form-select border-secondary'" +
            "         aria-label='User Interface for WepSIM' " +
            '         data-bind="change" data-action="cfg-select" data-key="ws_skin_ui"' +
            "         data-native-menu='false'>" +
            "    <option value='classic'>Desktop</option>" +
            "    <option value='compact'>Mobile</option>" +
            ' </select>' +
            '</div>',
        code_init: function()
        {
            $('#select8').val(get_cfg('ws_skin_ui'));
        },
        description: "<span data-langkey='WepSIM User Interface skin'>WepSIM User Interface skin</span>",
    });

    ws_info.config_ui.push({
        id:       'radio16',
        type:     'Accesibility',
        u_class:  '',
        code_cfg: wepsim_config_button_html_onoff('16', 'AutoScrolling',
                                                  i18n_get_TagFor('cfg', 'Off'),
                                                  i18n_get_TagFor('cfg', 'On'),
                                                  'AS_enable'),
        code_init: function()
        {
            wepsim_config_button_pretoggle('AS_enable', '16') ;
        },
        description: "<span data-langkey='Auto-scroll while executing'>Auto-scroll while executing</span>",
    });

    //
    // Privacy
    //

    ws_info.config_ui.push({
        id:       'radio17',
        type:     'Privacy',
        u_class:  '',
        code_cfg: wepsim_config_button_html_onoff('17', 'Use Google Analytics',
                                                  i18n_get_TagFor('cfg', 'Off'),
                                                  i18n_get_TagFor('cfg', 'On'),
                                                  'use_ga'),
        code_init: function()
        {
            wepsim_config_button_pretoggle('use_ga', '17') ;
        },
        description: "<span data-langkey='Use of Google Analytics to obtain anonymous statistics on the use of the application'>Use of Google Analytics to obtain anonymous statistics on the use of the application</span>",
    });

    //
    // Extra Features
    //

    ws_info.config_ui.push({
        id:       'radio14a',
        type:     'Extra Features',
        u_class:  '',
        code_cfg: "<div class='btn-group btn-group-toggle d-flex' data-bs-toggle='buttons' >" +
            "        <input type='radio' name='options' id='radio14a-true'  aria-label='cache: true'  autocomplete='off' class='btn-check'>" +
            "        <label id='label14-beta_cache-false' for='radio14a-true' " +
            "          class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
            "              aria-label='User Interface set of features for WepSIM: true' " +
            '          data-bind="click" data-action="cfg-toggle2" data-key="beta_cache" data-value="false" data-extra="14">Off' +
            '        </label>' +
            "        <input type='radio' name='options' id='radio14a-false' aria-label='cache: false' autocomplete='off' class='btn-check'>" +
            "        <label id='label14-beta_cache-true' for='radio14a-false' " +
            "          class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
            "              aria-label='User Interface set of features for WepSIM: false' " +
            '          data-bind="click" data-action="cfg-toggle2" data-key="beta_cache" data-value="true" data-extra="14">On' +
            '        </label>' +
            '    </div>',
        code_init: function()
        {
            wepsim_config_button_pretoggle_val2('ws_skin_user', 'beta_cache', '14') ;
        },
        description: "<span data-langkey='Cache'>Cache</span>&nbsp;" +
            "<span class='badge text-bg-secondary py-0 px-1'>beta</span>",
    });

    ws_info.config_ui.push({
        id:       'radio14c',
        type:     'Extra Features',
        u_class:  '',
        code_cfg: "<div class='btn-group btn-group-toggle d-flex' data-bs-toggle='buttons' >" +
            "        <input type='radio' name='options' id='radio14c-true'  aria-label='ep2-cpu: true'  autocomplete='off' class='btn-check'>" +
            "        <label id='label14-beta_ep2-false' for='radio14c-true' " +
            "          class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
            "              aria-label='User Interface set of features for WepSIM: true' " +
            '          data-bind="click" data-action="cfg-toggle2" data-key="beta_ep2" data-value="false" data-extra="14">Off' +
            '        </label>' +
            "        <input type='radio' name='options' id='radio14c-false' aria-label='ep2-cpu: false' autocomplete='off' class='btn-check'>" +
            "        <label id='label14-beta_ep2-true' for='radio14c-false' " +
            "          class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
            "              aria-label='User Interface set of features for WepSIM: false' " +
            '          data-bind="click" data-action="cfg-toggle2" data-key="beta_ep2" data-value="true" data-extra="14">On' +
            '        </label>' +
            '    </div>',
        code_init: function()
        {
            wepsim_config_button_pretoggle_val2('ws_skin_user', 'beta_ep2', '14') ;
        },
        description: "<span data-langkey='EP2 CPU'>EP2 (Elemental Processor 2) CPU</span>&nbsp;",
    });

    ws_info.config_ui.push({
        id:       'radio14b',
        type:     'Extra Features',
        u_class:  '',
        code_cfg: "<div class='btn-group btn-group-toggle d-flex' data-bs-toggle='buttons' >" +
            "        <input type='radio' name='options' id='radio14b-true'  aria-label='poc-cpu: true'  autocomplete='off' class='btn-check'>" +
            "        <label id='label14-beta_poc-false' for='radio14b-true' " +
            "          class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
            "              aria-label='User Interface set of features for WepSIM: true' " +
            '          data-bind="click" data-action="cfg-toggle2" data-key="beta_poc" data-value="false" data-extra="14">Off' +
            '        </label>' +
            "        <input type='radio' name='options' id='radio14b-false' aria-label='poc-cpu: false' autocomplete='off' class='btn-check'>" +
            "        <label id='label14-beta_poc-true' for='radio14b-false' " +
            "          class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
            "              aria-label='User Interface set of features for WepSIM: false' " +
            '          data-bind="click" data-action="cfg-toggle2" data-key="beta_poc" data-value="true" data-extra="14">On' +
            '        </label>' +
            '    </div>',
        code_init: function()
        {
            wepsim_config_button_pretoggle_val2('ws_skin_user', 'beta_poc', '14') ;
        },
        description: "<span data-langkey='POC CPU'>POC (proof of concept) CPU</span>&nbsp;" +
            "<span class='badge text-bg-secondary py-0 px-1'>beta</span>",
    });

    ws_info.config_ui.push({
        id:       'radio14d',
        type:     'Extra Features',
        u_class:  '',
        code_cfg: "<div class='btn-group btn-group-toggle d-flex' data-bs-toggle='buttons' >" +
            "        <input type='radio' name='options' id='radio14d-true'  aria-label='rv-cpu: true'  autocomplete='off' class='btn-check'>" +
            "        <label id='label14-beta_rv-false' for='radio14d-true' " +
            "          class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
            "              aria-label='User Interface set of features for WepSIM: true' " +
            '          data-bind="click" data-action="cfg-toggle2" data-key="beta_rv" data-value="false" data-extra="14">Off' +
            '        </label>' +
            "        <input type='radio' name='options' id='radio14d-false' aria-label='rv-cpu: false' autocomplete='off' class='btn-check'>" +
            "        <label id='label14-beta_rv-true' for='radio14d-false' " +
            "          class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
            "              aria-label='User Interface set of features for WepSIM: false' " +
            '          data-bind="click" data-action="cfg-toggle2" data-key="beta_rv" data-value="true" data-extra="14">On' +
            '        </label>' +
            '    </div>',
        code_init: function()
        {
            wepsim_config_button_pretoggle_val2('ws_skin_user', 'beta_rv', '14') ;
        },
        description: "<span data-langkey='RV CPU'>RV CPU</span>&nbsp;",
    });

    ws_info.config_ui.push({
        id:       'radio14d',
        type:     'Extra Features',
        u_class:  '',
        code_cfg: "<div class='btn-group btn-group-toggle d-flex' data-bs-toggle='buttons' >" +
            "        <input type='radio' name='options' id='radio14d-true'  aria-label='more-cfg-options: true'  autocomplete='off' class='btn-check'>" +
            "        <label id='label14-extra_morecfg-false' for='radio14d-true' " +
            "          class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
            "              aria-label='User Interface set of features for WepSIM: true' " +
            '          data-bind="click" data-action="cfg-toggle2" data-key="extra_morecfg" data-value="false" data-extra="14">Off' +
            '        </label>' +
            "        <input type='radio' name='options' id='radio14d-false' aria-label='more-cfg-options: false' autocomplete='off' class='btn-check'>" +
            "        <label id='label14-extra_morecfg-true' for='radio14d-false' " +
            "          class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
            "              aria-label='User Interface set of features for WepSIM: false' " +
            '          data-bind="click" data-action="cfg-toggle2" data-key="extra_morecfg" data-value="true" data-extra="14">On' +
            '        </label>' +
            '    </div>',
        code_init: function()
        {
            wepsim_config_button_pretoggle_val2('ws_skin_user', 'extra_morecfg', '14') ;
        },
        description: "<span data-langkey='More configuration options'>More configuration options</span>&nbsp;",
    });

    ws_info.config_ui.push({
        id:       'radio14e',
        type:     'Extra Features',
        u_class:  '',
        code_cfg: "<div class='btn-group btn-group-toggle d-flex' data-bs-toggle='buttons' >" +
            "        <input type='radio' name='options' id='radio14e-true'  aria-label='more-share-options: true'  autocomplete='off' class='btn-check'>" +
            "        <label id='label14-extra_share-false' for='radio14e-true' " +
            "          class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
            "              aria-label='User Interface set of features for WepSIM: true' " +
            '          data-bind="click" data-action="cfg-toggle2" data-key="extra_share" data-value="false" data-extra="14">Off' +
            '        </label>' +
            "        <input type='radio' name='options' id='radio14e-false' aria-label='more-share-options: false' autocomplete='off' class='btn-check'>" +
            "        <label id='label14-extra_share-true' for='radio14e-false' " +
            "          class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
            "              aria-label='User Interface set of features for WepSIM: false' " +
            '          data-bind="click" data-action="cfg-toggle2" data-key="extra_share" data-value="true" data-extra="14">On' +
            '        </label>' +
            '    </div>',
        code_init: function()
        {
            wepsim_config_button_pretoggle_val2('ws_skin_user', 'extra_share', '14') ;
        },
        description: "<span data-langkey='More share options'>More share options</span>&nbsp;",
    });

    ws_info.config_ui.push({
        id:       'radio14f',
        type:     'Extra Features',
        u_class:  '',
        code_cfg: "<div class='btn-group btn-group-toggle d-flex' data-bs-toggle='buttons' >" +
            "        <input type='radio' name='options' id='radio14f-true'  aria-label='flash-esp32: true'  autocomplete='off' class='btn-check'>" +
            "        <label id='label14-flash_esp32-false' for='radio14f-true' " +
            "          class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
            "              aria-label='User Interface for Flashing on ESP32 from WepSIM: true' " +
            '          data-bind="click" data-action="cfg-toggle2" data-key="flash_esp32" data-value="false" data-extra="14">Off' +
            '        </label>' +
            "        <input type='radio' name='options' id='radio14f-false' aria-label='flash-esp32: false' autocomplete='off' class='btn-check'>" +
            "        <label id='label14-flash_esp32-true' for='radio14f-false' " +
            "          class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
            "              aria-label='User Interface for Flashing on ESP32 from WepSIM: false' " +
            '          data-bind="click" data-action="cfg-toggle2" data-key="flash_esp32" data-value="true" data-extra="14">On' +
            '        </label>' +
            '    </div>',
        code_init: function()
        {
            wepsim_config_button_pretoggle_val2('ws_skin_user', 'flash_esp32', '14') ;
        },
        description: "<span data-langkey='Flashing on ESP32 from WepSIM'>Flashing on ESP32 from WepSIM</span>&nbsp;",
    });

    ws_info.config_ui.push({
        id:       'radio14g',
        type:     'Extra Features',
        u_class:  '',
        code_cfg: wepsim_config_button_html_onoff('14g', 'History',
                                                  i18n_get_TagFor('cfg', 'Off'),
                                                  i18n_get_TagFor('cfg', 'On'),
                                                  'history_enable'),
        code_init: function()
        {
            wepsim_config_button_pretoggle('history_enable', '14g') ;
            wepsim_toggle_history_ui();
        },
        description: "<span data-langkey='History: save execution history to allow going back'>History: save execution history to allow going back</span>&nbsp;",
    });

    ws_info.config_ui.push({
        id:       'select15',
        type:     'Extra Features',
        u_class:  '',
        code_cfg: " <div class='form-group m-0'>" +
            "    <select name='select15' id='select15' " +
            "            class='form-control form-control-sm form-select border-secondary'" +
            "            aria-label='history limit' " +
            '            data-bind="change" data-action="cfg-select" data-key="history_size"' +
            "            data-native-menu='false'>" +
            "        <option value='10'>10</option>" +
            "        <option value='50'>50</option>" +
            "        <option value='100' selected>100</option>" +
            "        <option value='200'>200</option>" +
            "        <option value='500'>500</option>" +
            "        <option value='1000'>1000</option>" +
            '    </select>' +
            ' </div>',
        code_init: function()
        {
            $('#select15').val(get_cfg('history_size'));
        },
        description: "<span data-langkey='History limit: number of states to keep in history'>History limit: number of states to keep in history</span>",
    });
}

