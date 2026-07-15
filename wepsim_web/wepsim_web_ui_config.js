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
import { get_cfg, set_cfg, update_cfg, save_cfg } from '../sim_core/sim_cfg.js';
import { ws_info } from '../sim_core/sim_adt_core.js';
import { i18n_get_select } from '../wepsim_i18n/i18n.js';
import { refresh } from '../sim_core/sim_core_ui.js';
import { wepsim_activeview, wepsim_uicfg_apply } from './wepsim_web_simulator.js';
import { wepsim_svg_start_drawing, wepsim_svg_stop_drawing } from './wepsim_uielto_cpusvg.js';
import { wepsim_popover_hide, wepsim_popovers_hide } from './wepsim_web_ui_popover.js';
import { onClick, onChange } from './wepsim_web_actions.js';

/*
     * Config management
     */

export function wepsim_show_breakpoint_icon_list()
{
    var o = "<div class='container' style='max-height:65vh; overflow:auto; -webkit-overflow-scrolling:touch;'>" +
        "<div class='row'>" ;

    var prev_type = '' ;
    for (var elto in ws_info.breakpoint_icon_list)
    {
        if (ws_info.breakpoint_icon_list[elto].type != prev_type)
        {
            o = o + '</div>' +
                "<div class='row p-1'>" +
                "<div class='float-none text-left text-capitalize font-weight-bold col-12 border-bottom border-secondary'>" + ws_info.breakpoint_icon_list[elto].type + '</div>' +
                '</div>' +
                "<div class='row'>" ;
            prev_type = ws_info.breakpoint_icon_list[elto].type ;
        }

        o = o + "<img src='images/stop/stop_" + elto + ".gif' alt='" + elto + " icon' " +
            "     class='img-thumbnail col-3 mx-2 d-block " + ws_info.breakpoint_icon_list[elto].addclass + "'" +
            "     style='height:6vh; min-height:30px;'" +
            '     data-bind="click" data-action="breakpoint-icon-select">' ;
    }

    o = o + '</div>' +
        '</div>';
    onClick('breakpoint-icon-select', (el) =>
    {
        var src = el.getAttribute('src');
        var iconMatch = src.match(/stop_(.+)\.gif/);
        if (!iconMatch) return;
        var iconName = iconMatch[1];
        $('#img_select1').attr('src', src);
        $('#img_select1').attr('class', el.getAttribute('class'));
        $('#img_select1').attr('data-bs-theme', '');
        set_cfg('ICON_theme', iconName);
        save_cfg();
        wepsim_popover_hide('breakpointicon1');
        wepsim_uicfg_apply();
    }) ;

    return o ;
}

export function wepsim_show_breakpoint_icon_template()
{
    var o = '<div class="popover" role="tooltip">' +
        '<div class="arrow"></div><h3 class="popover-header"></h3>' +
        '<div class="popover-body"></div>' +
        '<div class="popover-footer">' +
        '  <div class="m-0 p-2" style="background-color: #f7f7f7">' +
        '  <button type="button" id="close" data-role="none" ' +
        '          class="btn btn-sm btn-danger w-100 p-0" ' +
        '          data-bind="click" data-action="wepsim_popover_hide_breakpoint" data-popoverid="breakpointicon1"><span data-langkey="Close">Close</span></button>' +
        '  </div>' +
        '</div>' +
        '</div>' ;
    onClick('wepsim_popover_hide_breakpoint', (el) =>
    {
        if (el.dataset.popoverid)
        {
            wepsim_popover_hide(el.dataset.popoverid);
        }
        else
        {
            $('[data-bs-toggle="popover"]').popover('hide');
        }
    }) ;
    return o ;
}

export function wepsim_config_dialog_title(name, color, extra_components)
{
    var o = "<div class='dropdown btn-group'>" +
        "<button type='button' " +
        "   class='btn btn-outline-" + color + " px-3 py-1 dropdown-toggle' " +
        "   data-bs-toggle='dropdown' id='dropdown-title1' " +
        "   aria-expanded='false' aria-haspopup='true'>" +
        "<span class='font-weight-bold' data-langkey='" + name + "'>" + name + '</span>' +
        '</button>' +
        "<div class='dropdown-menu mb-2' " +
        "     style='overflow-y:auto; max-height:55vh; z-index:100000;' " +
        "     aria-labelledby='dropdown-title1'>" +
    // details
        " <form class='px-3 m-0'><div class='form-group m-0'>" +
        " <label for='wsdt" + name + "'><span data-langkey='details'>details</span></label>" +
        " <button class='btn btn-outline-secondary btn-block py-1' " +
        "         type='button' id='wsdt" + name + "' " +
        "         data-bind='click' data-action='collapse_toggle_descr'>" +
        " <span class='text-truncate'>&plusmn; <span data-langkey='Description'>Description</span></span>" +
        ' </button>' +
        ' </div></form>' +
    // idioms
        "<div class='dropdown-divider m-1'></div>" +
        " <form class='px-3 m-0'><div class='form-group m-0'>" +
        " <label for='dd2'><span data-langkey='idiom'>idiom</span></label>" +
        i18n_get_select('select7b' + name, extra_components) +
        ' </div></form>' +
        '</div>' +
        '</div>' ;
    onClick('collapse_toggle_descr', (el, component, event) =>
    {
        $('.collapse7').collapse('toggle');
    }) ;
    return o ;
}

export function wepsim_config_dialog_dropdown(color, base_buttons, extra_components)
{
    var o = "<div class='dropdown btn-group'>" +
        base_buttons +
        "<button type='button' " +
        "   data-bs-toggle='dropdown' id='dropdown-title1' " +
        "   aria-expanded='false' aria-haspopup='true' " +
        "   class='btn btn-" + color + " dropdown-toggle dropdown-toggle-split'" +
        "><span class='visually-hidden sr-only'>Toggle Dropdown</span>" +
        '</button>' +
        "<div class='dropdown-menu' " +
        "     style='overflow-y:auto; max-height:55vh; z-index:100000;' " +
        "     aria-labelledby='dropdown-title1'>" +
    // details
        " <form class='px-3 m-0'><div class='form-group m-0'>" +
        " <label for='wsdt" + name + "'>details</label>" +
        " <button class='btn btn-outline-secondary btn-block py-1' " +
        "         type='button' id='wsdt" + name + "' " +
        "         data-bind='click' data-action='collapse_toggle_dd'>" +
        " <span>&plusmn; <span data-langkey='Description'>Description</span></span>" +
        ' </button>' +
        ' </div></form>' +
    // idioms
        "<div class='dropdown-divider m-1'></div>" +
        " <form class='px-3 m-0'><div class='form-group m-0'>" +
        " <label for='dd2'>idiom</label>" +
        i18n_get_select('select7b' + name, extra_components) +
        ' </div></form>' +
        '</div>' +
        '</div>' ;
    onClick('collapse_toggle_dd', () => $('.collapse7').collapse('toggle')) ;
    return o ;
}

export function wepsim_config_button_html_onoff(id2, arial2, name_off, name_on, config_key)
{
    onClick('config_toggle_off', (el) =>
    {
        var setId = el.id.match(/^label(\d+)/)[1];
        wepsim_config_button_toggle(el.dataset.key, false, setId);
    });
    onClick('config_toggle_on', (el) =>
    {
        var setId = el.id.match(/^label(\d+)/)[1];
        wepsim_config_button_toggle(el.dataset.key, true, setId);
    });
    return "<div class='col-12 p-0 btn-group btn-group-toggle d-flex' data-bs-toggle='buttons'>" +
        "    <label id='label" + id2 + "-false' " +
        "           class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
        "           aria-label='" + arial2 + ": false' " +
        '           data-bind="click" data-action="config_toggle_off" data-key="' + config_key + '" data-value="false">' +
        "    <input type='radio' class='btn-check' name='options' id='radio" + id2 + "-false' " +
        "           aria-label='" + arial2 + ": false' autocomplete='off'>" + name_off + '</label>' +
        "    <label id='label" + id2 + "-true' " +
        "           class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
        "           aria-label='" + arial2 + ": true' " +
        '           data-bind="click" data-action="config_toggle_on" data-key="' + config_key + '" data-value="true">' +
        "    <input type='radio' class='btn-check' name='options' id='radio" + id2 + "-true' " +
        "           aria-label='" + arial2 + ": true' autocomplete='on'>" + name_on + '</label>' +
        '</div>' ;
}

export function wepsim_config_button_html_2options(id2, arial2,
    name_off, val_off,
    name_on, val_on,
    config_key)
{
    onClick('config_2opt_off', (el) =>
    {
        var setId = el.id.match(/^label(\d+)/)[1];
        wepsim_config_button_toggle(el.dataset.key, el.dataset.value, setId);
    });
    onClick('config_2opt_on', (el) =>
    {
        var setId = el.id.match(/^label(\d+)/)[1];
        wepsim_config_button_toggle(el.dataset.key, el.dataset.value, setId);
    });
    return "<div class='col-12 p-0 btn-group btn-group-toggle d-flex' data-bs-toggle='buttons'>" +
        "  <label id='label" + id2 + '-' + val_off + "' " +
        "         class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
        "         aria-label='" + arial2 + ': ' + val_off + "' " +
        '         data-bind="click" data-action="config_2opt_off" data-key="' + config_key + '" data-value="' + val_off + '">' +
        "  <input type='radio' class='btn-check' name='options' id='radio" + id2 + '-' + val_off + "' " +
        "         aria-label='" + arial2 + ': ' + val_off + "' autocomplete='off'>" + name_off + '</label>' +
        "  <label id='label" + id2 + '-' + val_on + "' " +
        "         class='btn btn-sm w-50 btn-outline-secondary p-1 fw-bold' " +
        "         aria-label='" + arial2 + ': ' + val_on + "' " +
        '         data-bind="click" data-action="config_2opt_on" data-key="' + config_key + '" data-value="' + val_on + '">' +
        "  <input type='radio' class='btn-check' name='options' id='radio" + id2 + '-' + val_on + "' " +
        "         aria-label='" + arial2 + ': ' + val_on + "' autocomplete='on'>" + name_on + '</label>' +
        '</div>' ;
}

export function wepsim_config_button_html_close(btn2_id)
{
    var o = "<div class='col p-1 mt-2'>" +
        "<button type='button' id='close' data-role='none' " +
        "        class='btn btn-sm btn-danger w-100 p-0 mt-2' " +
        "        data-bind='click' data-action='wepsim_popover_hide' data-popoverid='" + btn2_id + "'>" +
        "<span data-langkey='Close'>Close</span>" +
        '</button>' +
        '</div>' ;
    onClick('wepsim_popover_hide', (el) =>
    {
        if (el.dataset.popoverid)
        {
            wepsim_popover_hide(el.dataset.popoverid);
        }
        else
        {
            $('[data-bs-toggle="popover"]').popover('hide');
        }
    }) ;
    return o ;
}

export function wepsim_config_button_pretoggle(config_name, set_id)
{
    var val_tag = get_cfg(config_name) ;

    var label_prefix = '#label' + set_id + '-' + val_tag ;
    if ($(label_prefix).hasClass('active') == false)
    {
        $(label_prefix).button('toggle');
    }
}

export function wepsim_config_button_pretoggle_val(config_name, set_id, val_tag)
{
    var label_prefix = '#label' + set_id + '-' + val_tag ;
    if ($(label_prefix).hasClass('active') == false)
    {
        $(label_prefix).button('toggle');
    }
}

export function wepsim_config_button_pretoggle_val2(cfg_id, value, set_id)
{
    var optValue = get_cfg(cfg_id).split(':') ;
    var index = optValue.indexOf(value) ;
    var active = (index > -1) ;

    var label_prefix = '#label' + set_id + '-' + value + '-' + active ;
    if ($(label_prefix).hasClass('active') == false)
    {
        $(label_prefix).button('toggle');
    }

    label_prefix = '#label' + set_id + '-' + value + '-' + (!active) ;
    if ($(label_prefix).hasClass('active') != false)
    {
        $(label_prefix).button('toggle');
    }
}

export function wepsim_config_button_toggle(config_name, val_new, set_id)
{
    var val_old = get_cfg(config_name) ;
    update_cfg(config_name, val_new) ;

    var label_prefix = '#label' + set_id + '-' ;
    if ($(label_prefix + val_old).hasClass('active') == true)
    {
        $(label_prefix + val_old).button('toggle') ;
    }
    if ($(label_prefix + val_new).hasClass('active') == false)
    {
        $(label_prefix + val_new).button('toggle') ;
    }
}

export function wepsim_config_select_toggle(config_name, val_new, set_id)
{
    $('#select' + set_id).val(val_new) ;
    update_cfg('editor_theme', val_new) ;
}

export function wepsim_config_button_toggle2(value, active, set_id)
{
    wepsim_activeview(value, active) ;

    var label_prefix = '#label' + set_id + '-' + value + active ;
    $(label_prefix).button('toggle');
    label_prefix = '#label' + set_id + '-' + value + (! active) ;
    $(label_prefix).button('toggle');
}

// color
export function wepsim_config_button_html_color(id2, arial2, cfg_name2)
{
    var o = "<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true' " +
        "          style='margin:0 0 0 0'>" +
        "   <input type='color' " +
        "       aria-label='" + arial2 + "'" +
        "          class='form-control form-control-color w-100' " +
        "          id='" + id2 + "' value='#000000' " +
        '       data-bind="change" data-action="cfg-color" data-key="' + cfg_name2 + '" data-id="' + id2 + '"' +
        "          title='Choose your color'>" +
        '</fieldset> ' ;
    onChange('cfg-color', (el) => wepsim_config_color_update(el.dataset.key, el.value, '#' + el.dataset.id)) ;
    return o ;
}

export function wepsim_config_color_initial(config_name, label_prefix)
{
    $(label_prefix)[0].value = get_cfg(config_name) ;
}

export function wepsim_config_color_update(config_name, val_new, label_prefix)
{
    update_cfg(config_name, val_new) ;

    wepsim_svg_stop_drawing() ;
    wepsim_svg_start_drawing() ;

    refresh() ;
}

