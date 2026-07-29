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
import { onClick } from './wepsim_web_actions.js';
import { get_cfg, update_cfg } from '../sim_core/sim_cfg.js';
import { show_memories_values } from '../sim_core/sim_core_ui.js';
import { i18n_get, i18n_get_TagFor, i18n_update_tags } from '../wepsim_i18n/i18n.js';
import { quick_config_rf, wepsim_show_rf_names, wepsim_refresh_rf_names } from './wepsim_uielto_registers.js';
import { showhideAsmHeader, wepsim_show_asm_columns_checked } from './wepsim_uielto_dbg_asm.js';
import { wepsim_config_button_html_close, wepsim_config_button_pretoggle, wepsim_config_button_pretoggle_val, wepsim_config_button_toggle } from './wepsim_web_ui_config.js';
import { wepsim_popover_init } from './wepsim_web_ui_popover.js';
import { set_ws_signals_show_inactive, set_ws_states_show_inactive, ws_signals_show_inactive } from './wepsim_uielto_hw.js';
import { wepsim_restore_darkmode, wepsim_keepsync_darkmode_stop, wepsim_keepsync_darkmode_start } from './wepsim_web_simulator.js';
import { wsweb_dialog_open, wsweb_quickslider_close, wsweb_cpuview_as_text, wsweb_cpuview_as_graph } from './wepsim_web_api.js';
import { wepsim_refresh_registers } from './wepsim_uielto_registers.js';

//
// WepSIM quickcfg
//

var wsweb_quickcfg = {

    pop1: {
        quick_id:    '#po1',
        val_trigger: 'manual',
        fun_content: function()
        {
            var o = '<ul class="list-group list-group-flush">' ;

            o += '<li class="list-group-item px-0 pt-2"> ' +
                "<span class='container px-0'>" +
                "<span class='row p-2'>" +
                "<span class='col-6'>" +
                '<em class="fas fa-wrench col-1 me-2 mt-1 float-start"></em>&nbsp;' +
                "<span data-langkey='QuickConfig'>Quick Cfg.</span>" +
                '</span>' +
                quickcfg_html_btntoggle('.multi-collapse-3', 'col-6') +
                '</span>' ;

            o += "<span class='row p-2'>" +
                "<span class='col-6'>" +
                '<em class="fas fa-bars col-1 me-2 mt-1 float-start"></em>&nbsp;' +
                "<span data-langkey='ActionBar'>ActionBar</span>" +
                '</span>' +
                quickcfg_html_btntoggle('.multi-collapse-1', 'col-6') +
                '</span>' ;

            o += "<span class='row p-2'>" +
                "<span class='col-6'>" +
                '<em class="fas fa-sliders-h col-1 me-2 mt-1 float-start"></em>&nbsp;' +
                "<span data-langkey='Sliders'>Sliders</span>" +
                '</span>' +
                quickcfg_html_btntoggle('.multi-collapse-2', 'col-6') +
                '</span>' +
                '</span>' +
                '</li>' ;

            o += quickcfg_html_close('po1') +
                '</ul>' ;

            return o ;
        },
        fun_ownshown: function()
        { },
    },

    slidercfg: {
        quick_id:    '#popover-slidercfg',
        val_trigger: 'click',
        fun_content: function()
        {

            var o = '<ul class="list-group list-group-flush">' ;

            o += '<li class="list-group-item px-0 d-grid"> ' +
                '     <div id="slider_cpucu" class="col-sm p-0 collapse show wsx_microcode">' +
                '         <ws-slider-cpucu name="slider3b"></ws-slider-cpucu>' +
                '     </div>' +
                '</li>' ;

            o += '<li class="list-group-item px-0 d-grid"> ' +
                '     <div class="col-sm p-0 ms-1 collapse show">' +
                '         <ws-slider-details name="slider3a"></ws-slider-details>' +
                '     </div>' +
                '</li>' ;

            o += '<li class="list-group-item px-0 d-grid"> ' +
                '<label><span data-langkey="dark mode">dark mode</span>:</label>' +
                "   <div class='btn-group d-flex'>" +
                "     <input type='radio' name='options' id='radio18-off'   autocomplete='off' class='btn-check'>" +
                "     <label id='label18-off' for='radio18-off' data-bs-toggle='buttons' " +
                "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
                "           aria-label='Dark mode: Off'" +
                "           data-bind=\"click\" data-action=\"wepsim_config_button_toggle_off\"><span data-langkey='Off'>Off</span>" +
                '     </label>' +
                "     <input type='radio' name='options' id='radio18-on'    autocomplete='off' class='btn-check'>" +
                "     <label id='label18-on' for='radio18-on' data-bs-toggle='buttons' " +
                "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
                "           aria-label='Dark mode: On'" +
                "           data-bind=\"click\" data-action=\"wepsim_config_button_toggle_on\"><span data-langkey='On'>On</span>" +
                '     </label>' +
                "     <input type='radio' name='options' id='radio18-auto'   autocomplete='off' class='btn-check'>" +
                "     <label id='label18-auto' for='radio18-auto' data-bs-toggle='buttons' " +
                "           class='btn btn-sm w-50 btn-outline-secondary fw-bold' style='padding:2 2 2 2;'" +
                "           aria-label='Dark mode: Auto'" +
                "           data-bind=\"click\" data-action=\"wepsim_config_button_toggle_auto\"><span data-langkey='Auto'>Auto</span>" +
                '     </label>' +
                '   </div>' +
                '</li>' ;

            o += '<li class="list-group-item px-0 d-grid"> ' +
                '<label class="w-100"><span data-langkey="Reload">Reload</span>...:</label>' +
                "   <div class='btn btn-sm btn-outline-secondary p-1 col-8 mx-start' " +
                "        aria-label='open the reload dialog box' " +
                '        data-bind="click" data-action="wsweb_dialog_open_reload">' +
                "<i class='fas fa-redo'></i>&nbsp;<span data-langkey='Reload'>Reload</span></div>" +
                '</li>' ;

            o += quickcfg_html_close('popover-slidercfg') +
                '</ul>' ;

            onClick('wepsim_config_button_toggle_off', () =>
            {
                wepsim_config_button_toggle('ws_skin_dark_mode', 'off', '18');
                wepsim_restore_darkmode();
                wepsim_keepsync_darkmode_stop();
            });
            onClick('wepsim_config_button_toggle_on', () =>
            {
                wepsim_config_button_toggle('ws_skin_dark_mode', 'on', '18');
                wepsim_restore_darkmode();
                wepsim_keepsync_darkmode_stop();
            });
            onClick('wepsim_config_button_toggle_auto', () =>
            {
                wepsim_config_button_toggle('ws_skin_dark_mode', 'auto', '18');
                wepsim_restore_darkmode();
                wepsim_keepsync_darkmode_start();
            });
            onClick('wsweb_dialog_open_reload', () =>
            {
                wsweb_quickslider_close();
                wsweb_dialog_open('reload');
            });

            return o ;
        },
        fun_ownshown: function(shownEvent)
        {
            $('#slider3a').val(get_cfg('C1C2_size')) ;
            $('#slider3b').val(get_cfg('CPUCU_size')) ;

            var optValue ;
            var skinUser = get_cfg('ws_skin_user') ;
            optValue     = (skinUser.split(':')[1] == 'on') ? true : false ;
            $('#label16-' + optValue).button('toggle') ;
            optValue = (skinUser.split(':')[3] == 'on') ? true : false ;
            $('#label17-' + optValue).button('toggle') ;

            wepsim_config_button_pretoggle('ws_skin_dark_mode', '18') ;
        },
    },

    popover2: {
        quick_id:    '#popover2_asm',
        val_trigger: 'click',
        fun_content: function(shownEvent)
        {
            return wepsim_show_asm_columns_checked('#popover2_asm') ;
        },
        fun_ownshown: function(shownEvent)
        {
            showhideAsmHeader() ;
        },
    },

    pomem1: {
        quick_id:    '[data-bs-toggle=popover-mem]',
        val_trigger: 'click',
        fun_content: function(shownEvent)
        {
            var o = "<div class='container mt-1'>" +
                "<div class='row'>" +
                quickcfg_html_header('Display format') +
                quickcfg_html_btn('(*) 0x3B<sub>16</sub>', 'col-6', 'MEM_display_format', 'unsigned_16_nofill') +
                quickcfg_html_btn('073<sub>8</sub>', 'col-6', 'MEM_display_format', 'unsigned_8_nofill') +
                quickcfg_html_btn('59<sub>10</sub>', 'col-6', 'MEM_display_format', 'unsigned_10_nofill') +
                quickcfg_html_btn(';<sub>ascii</sub>', 'col-6', 'MEM_display_format', 'char_ascii_nofill') +
                quickcfg_html_br() +
                quickcfg_html_header('Display direction') +
                quickcfg_html_btn('(*) 04 -> 00', 'col-6', 'MEM_display_direction', 'h2l') +
                quickcfg_html_btn('00 -> 04', 'col-6', 'MEM_display_direction', 'l2h') +
                quickcfg_html_br() +
                quickcfg_html_header('Display segments') +
                quickcfg_html_onoff('19', 'show segments', '(*) ' + i18n_get_TagFor('cfg', 'Off'), i18n_get_TagFor('cfg', 'On'), 'mem-segments') +
                quickcfg_html_header('Display origin') +
                quickcfg_html_onoff('20', 'show origin', '(*) ' + i18n_get_TagFor('cfg', 'Off'), i18n_get_TagFor('cfg', 'On'), 'mem-source') +
                quickcfg_html_br() +
                quickcfg_html_header('Number of words') +
                quickcfg_html_btn('(*) 1', 'col-4', 'MEM_show_nwords', '1') +
                quickcfg_html_btn('2', 'col-4', 'MEM_show_nwords', '2') +
                quickcfg_html_btn('3', 'col-4', 'MEM_show_nwords', '3') +
                quickcfg_html_br() +
                quickcfg_html_close('popover-mem') +
                '</div>' +
                '</div>' ;

            onClick('mem-segments', (el) =>
            {
                var value = el.dataset.value === 'true';
                update_cfg('MEM_show_segments', value, '19');
                if (value) $('#lst_seg1').collapse('show');
                else $('#lst_seg1').collapse('hide');
                wepsim_config_button_pretoggle('MEM_show_segments', '19');
            });

            onClick('mem-source', (el) =>
            {
                var value = el.dataset.value === 'true';
                update_cfg('MEM_show_source', value, '20');
                if (value) $('.mp_tooltip').collapse('show');
                else $('.mp_tooltip').collapse('hide');
                wepsim_config_button_pretoggle('MEM_show_source', '20');
            });

            return o;
        },
        fun_ownshown: function(shownEvent)
        {
            wepsim_config_button_pretoggle('MEM_show_segments', '19') ;
            wepsim_config_button_pretoggle('MEM_show_source', '20') ;
        },
    },

    popreg1: {
        quick_id:    '[data-bs-toggle=popover-rfcfg]',
        val_trigger: 'click',
        fun_content: function(shownEvent)
        {
            return quick_config_rf();
        },
        fun_ownshown: function(shownEvent)
        {
            wepsim_config_button_pretoggle('RF_vertical_pack', '20') ;
        },
    },

    pocpucu1: {
        quick_id:    '[data-bs-toggle=popover-cpuview]',
        val_trigger: 'click',
        fun_content: function(shownEvent)
        {
            var got        = get_cfg('CPUCU_show_graph') ;
            var show_text  = '' ;
            var show_graph = '' ;
            if (got)
                show_graph = 'show' ;
            else show_text  = 'show' ;

            var o = "<div class='container mt-1 p-1'>" +
                "<div class='row'>" +
                '<ul class="list-group list-group-flush px-0">' +
                '<li class="list-group-item px-2 pt-0 pb-3"> ' +
            // <display format>
                quickcfg_html_header('Display format') +
                quickcfg_html_onoff('QD', 'display format', '' + i18n_get_TagFor('cfg', 'Text'), '(*) ' + i18n_get_TagFor('cfg', 'Graph'), 'cpucu-graph') +
                '</li> ' +
            // <sliders>
                '<div class="collapse ' + show_graph + '" id="collapse_graph">' +
                '<li class="list-group-item px-2 pt-0 pb-3"> ' +
                quickcfg_html_header('Split view') +
                '<ws-slider-cpucu   name="slider4b" class="col-12"></ws-slider-cpucu>' +
            // '<ws-slider-details name="slider4a" class="col-12"></ws-slider-details>' +
            // <interactive>
                quickcfg_html_br() +
                quickcfg_html_header('Interactive mode') +
                quickcfg_html_onoff('QI', 'is interactive', i18n_get_TagFor('cfg', 'Off'), '(*) ' + i18n_get_TagFor('cfg', 'On'), 'cpucu-interactive') +
                '</li> ' +
                '</div>' +

            // <filter>
                '<div class="collapse ' + show_text + '" id="collapse_text">' +
                '<li class="list-group-item px-2 pt-0 pb-3"> ' +
                quickcfg_html_br() +
                quickcfg_html_header('Show states+signals') +
                quickcfg_html_onoff('Q2', 'Text shows inactive elements', i18n_get_TagFor('cfg', 'Only active'), '(*) ' + i18n_get_TagFor('cfg', 'All'), 'quickcfg-hw-filter') +

            // <advanced>
            // quickcfg_html_br() +
            // quickcfg_html_header('Text: advanced mode') +
            // quickcfg_html_btn("On",
            //                   "cpucu_show_table(\"summary,elements,states,signals,behaviors\");",
            //                   "col-6") +
            // quickcfg_html_btn("(*) Off",
            //                   "cpucu_show_table(\"elements\");",
            //                   "col-6") +
                '</li> ' +
                '</div>' +
            // </advanced>
                quickcfg_html_br() +
                quickcfg_html_close('popover-cpuview') +
                '</ul>' +
                '</div>' +
                '</div>' ;

            onClick('quickcfg-hw-filter', (el) =>
            {
                var showInactive = el.dataset.value === 'true';
                if (showInactive)
                {
                    var ov = ws_signals_show_inactive;
                    set_ws_signals_show_inactive(true); $('.s-ina').show();
                    set_ws_states_show_inactive(true); $('.t-ina').show();
                    $('#labelQ2-' + ov).button('toggle');
                    $('#labelQ2-true').button('toggle');
                }
                else
                {
                    var ov = ws_signals_show_inactive;
                    set_ws_signals_show_inactive(false); $('.s-ina').hide();
                    set_ws_states_show_inactive(false); $('.t-ina').hide();
                    $('#labelQ2-' + ov).button('toggle');
                    $('#labelQ2-false').button('toggle');
                }
            });

            onClick('cpucu-graph', (el) =>
            {
                var value = el.dataset.value === 'true';
                wepsim_config_button_toggle('CPUCU_show_graph', value, 'QD');
                if (value)
                {
                    wsweb_cpuview_as_graph();
                    $('#collapse_text').hide(); $('#collapse_graph').show();
                }
                else
                {
                    wsweb_cpuview_as_text();
                    $('#collapse_text').show(); $('#collapse_graph').hide();
                }
            });

            onClick('cpucu-interactive', (el) =>
            {
                var value = el.dataset.value === 'true';
                wepsim_config_button_toggle('is_interactive', value, 'QI');
            });

            return o ;
        },
        fun_ownshown: function(shownEvent)
        {
            $('#slider4b').val(get_cfg('CPUCU_size')) ;
            wepsim_config_button_pretoggle('is_interactive', 'QI') ;
            wepsim_config_button_pretoggle('CPUCU_show_graph', 'QD') ;
            wepsim_config_button_pretoggle_val('', 'Q2', ws_signals_show_inactive) ;
        },
    },

} ;

//
// Quick Config
//

export function wepsim_init_quickcfg(quick_id, val_trigger, fun_content, fun_ownshown)
{
    var cfg1 = {
        trigger:   val_trigger,
        html:      true,
        placement: 'auto',
        animation: false,
        container: 'body',
        template:  '<div class="popover shadow border border-secondary w-100" role="tooltip">' +
            '<div class="arrow"></div>' +
            '<h3  class="popover-header"></h3>' +
            '<div class="popover-body"></div>' +
            '</div>',
        content:    fun_content,
        sanitize:   false,
        sanitizeFn: function (content)
        {
            return content ; // DOMPurify.sanitize(content) ;
        },
    } ;

    return wepsim_popover_init(quick_id,
                               cfg1,
                               function(shownEvent)
                               {
                                   fun_ownshown(shownEvent) ;
                                   i18n_update_tags('dialogs') ;
                                   i18n_update_tags('gui') ;
                                   i18n_update_tags('cfg') ;
                               }) ;
}

export function wepsim_quickcfg_init(qh_id)
{
    return wepsim_init_quickcfg(wsweb_quickcfg[qh_id].quick_id,
                                wsweb_quickcfg[qh_id].val_trigger,
                                wsweb_quickcfg[qh_id].fun_content,
                                wsweb_quickcfg[qh_id].fun_ownshown) ;
}

//
// Get HTML code for quick-config elements
//

export function quickcfg_html_br()
{
    return "<div class='w-100 border border-tertiary'></div>" ;
}

export function quickcfg_html_header(label2)
{
    return "<div class='col-12 p-0 mt-2'>" +
        "<span data-langkey='" + label2 + "'>" + label2 + '</span>' +
        '</div>' ;
}

export function quickcfg_html_btn(label2, colwidth2, dataKey, dataValue)
{
    onClick('quickcfg_btn', (el) =>
    {
        update_cfg(el.dataset.key, el.dataset.value);
        if (el.dataset.key.startsWith('RF'))
        {
            wepsim_refresh_registers();
        }
        else // starts with MEM
        {
            show_memories_values();
        }
    });
    return "<div class='" + colwidth2 + " p-1 d-grid'>" +
        "<buttom class='btn btn-sm btn-outline-secondary col p-1 text-end float-end' " +
        "        data-bind='click' data-action='quickcfg_btn'" +
        "        data-key='" + dataKey + "' data-value='" + dataValue + "'>" +
        "<span class='mx-auto px-1 fw-bold rounded bg-info-subtle text-body' " +
        "      style=''>" + label2 + '</span></buttom>' +
        '</div>' ;
}

export function quickcfg_html_btnreg(label2, colwidth2, dataKey, dataValue, dataIndex)
{
    onClick('quickcfg_btnreg', (el) =>
    {
        update_cfg(el.dataset.key, el.dataset.value);
        if (el.dataset.index)
            wepsim_refresh_rf_names(parseInt(el.dataset.index));
        else
            wepsim_show_rf_names();
    });
    return "<div class='" + colwidth2 + " p-1 d-grid'>" +
        "<buttom class='btn btn-sm btn-outline-secondary col p-1 text-end float-end' " +
        "        data-bind='click' data-action='quickcfg_btnreg'" +
        "        data-key='" + dataKey + "' data-value='" + dataValue + "'" +
        (dataIndex ? " data-index='" + dataIndex + "'" : '') + '>' +
        "<span class='fw-bold font-monospace'>" + label2 + '</span>' + '&nbsp;' +
        "<span class='mx-auto px-1 rounded bg-info-subtle' style=''>0</span></buttom>" +
        '</div>' ;
}

export function quickcfg_html_btntoggle(label2, colwidth2)
{
    var wsi = get_cfg('ws_idiom') ;

    return '<span class="btn-group-toggle ' + colwidth2 + '" data-bs-toggle="buttons">' +
        '  <label class="btn btn-sm btn-outline-secondary p-1 text-start float-end" ' +
        '         data-bs-toggle="collapse" href="' + label2 + '">' +
        '<input type="checkbox" class="btn-check" checked="" autocomplete="off">' +
        '<span class="mx-auto px-1 fw-bold rounded bg-info-subtle text-body" ' +
        '      style="">' +
        i18n_get('dialogs', wsi, 'Show/Hide') +
        '</span>' +
        '  </label>' +
        '</span>' ;
}

export function quickcfg_html_onoff(id2, arial2, nm_off2, nm_on2, action_name)
{
    var dataAction = action_name;
    var dataKey    = action_name || id2;
    return "<div class='col-12 p-0 btn-group btn-group-toggle d-flex' data-bs-toggle='buttons'>" +
        "    <label id='label" + id2 + "-false' " +
        "           class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
        "           aria-label='" + arial2 + ": false' " +
        '           data-bind="click" data-action="' + dataAction + '" data-key="' + dataKey + '" data-id="' + id2 + '" data-value="false">' +
        "    <input type='radio' class='btn-check' name='options' id='radio" + id2 + "-false' " +
        "           aria-label='" + arial2 + ": false' autocomplete='off'>" + nm_off2 + '</label>' +
        "    <label id='label" + id2 + "-true' " +
        "           class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
        "           aria-label='" + arial2 + ": true' " +
        '           data-bind="click" data-action="' + dataAction + '" data-key="' + dataKey + '" data-id="' + id2 + '" data-value="true">' +
        "    <input type='radio' class='btn-check' name='options' id='radio" + id2 + "-true' " +
        "           aria-label='" + arial2 + ": true' autocomplete='on'>" + nm_on2 + '</label>' +
        '</div>' ;
}

export function quickcfg_html_close(btn2_id)
{
    return wepsim_config_button_html_close(btn2_id) ;
}

