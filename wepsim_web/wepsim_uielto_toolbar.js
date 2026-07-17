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
import { ws_uielto } from './wepsim_uielto.js';
import { onClick } from './wepsim_web_actions.js';
import { get_cfg, is_cfg_empty } from '../sim_core/sim_cfg.js';
import { sim } from '../sim_hw/sim_hw_index.js';
import { simhw_get_processor_names } from '../sim_hw/sim_hw_lazy.js';
import { ws_info } from '../sim_core/sim_adt_core.js';
import * as api from './wepsim_web_api.js';
import { wepsim_tooltips_hide } from './wepsim_web_ui_tooltip.js';
import { wepsim_example_reset, wepsim_example_load } from '../wepsim_core/wepsim_example.js';
import { wait_if_uievents } from '../sim_core/sim_core_ctrl.js';
import { inputasm, inputfirm } from '../wepsim_web/wepsim_web_simulator.js';

/*
         *  Action toolbar
         */

/*
         *  Toolbar
         */

/* jshint esversion: 6 */
export class ws_toolbar extends ws_uielto
{
    constructor ()
    {
        // parent
        super();

        this.render_hash = {
            'switch_microcode':  this.render_switch_microcode,
            'switch_assembly':   this.render_switch_assembly,
            'switch_simulator':  this.render_switch_simulator,
            'slider_cpucu':      this.render_slider_cpucu,
            'slider_c1c2':       this.render_slider_c1c2,
            'btn_help':          this.render_btn_help,
            'btn_config':        this.render_btn_config,
            'btn_notifications': this.render_btn_notifications,
            'btn_recordbar':     this.render_btn_recordbar,
            'btn_microcandc':    this.render_btn_microcandc,
            'btn_states':        this.render_btn_states,
            'btn_checkpoint':    this.render_btn_checkpoint,
            'btndd_action':      this.render_btndd_action,
            'btndd_mode':        this.render_btndd_mode,
            'btn_examples':      this.render_btndd_examples,
            '[':                 this.render_delimiter_begin,
            ']':                 this.render_delimiter_end,
        };
    }

    render (event_name)
    {
        // get updated attributes
        super.render() ;

        // render current element
        this.render_skel() ;
        this.render_populate() ;
    }

    render_skel ()
    {
        // load the initial HTML code
        this.innerHTML = '' ;
    }

    render_populate ()
    {
        // get HTML code for toolbar elements
        var o1 = '' ;
        for (var i = 0; i < this.components.length; i++)
        {
            var elto            = this.components_arr[i] ;
            var render_function = this.render_hash[elto] ;

            if (typeof render_function !== 'undefined')
            {
                o1 += render_function(this) ;
            }
        }

        // load HTML code
        this.innerHTML = o1 ;

        // initialize elements
        if (is_cfg_empty())
        {
            return ;
        }
        var opt ;
        if (this.components.indexOf('btndd_mode') != -1)
        {
            opt = get_cfg('ws_mode') ;
            webui_toolbar_updateMode(opt) ;
        }
        if (this.components.indexOf('btndd_action') != -1)
        {
            opt = get_cfg('ws_action') ;
            webui_toolbar_updateAction(opt) ;
        }
        if (this.components.indexOf('btn_examples') != -1)
        {
            webui_toolbar_updateExampleSet() ;
        }
    }

    //
    // switch
    //

    render_switch_microcode (robj)
    {
        var o = '<button ' +
            '    class="btn bg-body-tertiary shadow-sm col-auto wsx_microcode mx-1 px-2 border border-secondary"' +
            '    id="btn_micro1"' +
            '    data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '    title="This button switches into the \'Microcode\' editor."' +
            '    data-bind="click" data-action="switch-microcode"' +
            '><strong><span class="d-none d-sm-inline-flex" ' +
            ' data-langkey=\'MicroCode\'>MicroCode</span><span class="d-sm-none">&#181;code</span></strong></button>' ;
        onClick('switch-microcode', () =>
        {
            api.wsweb_change_workspace_microcode() ; wepsim_tooltips_hide('[data-bs-toggle=tooltip]') ;
        }) ;
        return o ;
    }

    render_switch_assembly (robj)
    {
        var o = '<button class="btn bg-body-tertiary shadow-sm col-auto mx-1 px-2 border border-secondary"' +
            '        id="btn_asm1"' +
            '        data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '        title="This button switches into the \'Assembly\' editor."' +
            '        data-bind="click" data-action="switch-assembly"' +
            '><strong><span class="d-none d-sm-inline-flex" data-langkey=\'Assembly\'>Assembly</span><span class="d-sm-none" data-langkey=\'Assembly\'>Assembly</span></strong></button>' ;
        onClick('switch-assembly', () =>
        {
            api.wsweb_change_workspace_assembly() ; wepsim_tooltips_hide('[data-bs-toggle=tooltip]') ;
        }) ;
        return o ;
    }

    render_switch_simulator (robj)
    {
        var o = '<button class="btn bg-body-tertiary shadow-sm col-auto mx-1 px-2 border border-secondary"' +
            '        data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '        data-transition="none" data-inline="true"' +
            '        title="This button switches into the \'Simulator\' workspace."' +
            '        data-bind="click" data-action="switch-simulator"' +
            '><strong><span data-langkey=\'Simulator\'>Simulator</span></strong></button>' ;
        onClick('switch-simulator', () =>
        {
            api.wsweb_change_workspace_simulator() ; wepsim_tooltips_hide('[data-bs-toggle=tooltip]') ;
        }) ;
        return o ;
    }

    //
    // delimiter
    //

    render_delimiter_begin (robj)
    {
        return '<div class="btn-toolbar btn-block" role="toolbar">' ;
    }

    render_delimiter_end (robj)
    {
        return '</div>' ;
    }

    //
    // slider
    //

    render_slider_cpucu (robj)
    {
        return '<ws-slider-cpucu   name="slider2b"></ws-slider-cpucu>' ;
    }

    render_slider_c1c2 (robj)
    {
        return '<ws-slider-details name="slider2a"></ws-slider-details>' ;
    }

    //
    // button
    //

    render_btn_help (robj)
    {
        var o = '<button class="btn shadow-sm col-auto my-1 mx-1 px-2 border border-secondary bg-help"' +
            '        style="flex-grow:1;"' +
            '        id="btn_help1"' +
            '        data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '        title="This button opens the \'Help\' dialog."' +
            '        data-bind="click" data-action="btn-help">' ;
        o    += (robj.icons_str == 'no') ? '' : '<em class="fas fa-info d-none d-sm-inline text-secondary"></em>' ;
        o    += (robj.icons_str == 'up') ? '<br>' : '&nbsp;' ;
        o    += '<strong><span data-langkey=\'Help\'>Help</span></strong></button>' ;
        onClick('btn-help', () => api.wsweb_dialog_open('help')) ;

        return o ;
    }

    render_btn_config (robj)
    {
        var o = '<button class="btn bg-body-tertiary shadow-sm my-1 mx-1 px-2 border border-secondary"' +
            '        id="btn_cfg1"' +
            '        data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '        title="This button opens the \'Configuration\' dialog."' +
            '        data-bind="click" data-action="btn-config">' ;
        o    += (robj.icons_str == 'no') ? '' : '<em class="fas fa-cogs d-none d-sm-inline text-secondary"></em>&nbsp;' ;
        o    += (robj.icons_str == 'up') ? '<br>' : '&nbsp;' ;
        o    += '<strong><span class="d-none d-sm-inline-flex" data-langkey=\'Configuration\'>Configuration</span><span class="d-sm-none">Cfg.</span></strong></button>' ;
        onClick('btn-config', () => api.wsweb_dialog_open('config')) ;

        return o ;
    }

    render_btn_notifications (robj)
    {
        var o = '<button class="btn bg-body-tertiary shadow-sm col-auto my-1 mx-1 px-2 border border-secondary"' +
            '        data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '        title="This button opens the \'Notifications\' dialog."' +
            '        data-bind="click" data-action="btn-notifications">' ;
        o    += (robj.icons_str == 'no') ? '' : '<em class="fas fa-comment-alt d-none d-sm-inline text-secondary"></em>&nbsp;' ;
        o    += (robj.icons_str == 'up') ? '<br>' : '&nbsp;' ;
        o    += '<strong><span class="d-none d-md-inline-flex" data-langkey=\'Notifications\'>Notifications</span><span class="d-md-none">Notif.</span></strong></button>' ;
        onClick('btn-notifications', () => api.wsweb_dialog_open('notifications')) ;

        return o ;
    }

    render_btn_recordbar (robj)
    {
        var o = '<button class="btn bg-body-tertiary shadow-sm my-1 mx-1 px-2 border border-secondary"' +
            '        data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '        title="This button toggles the \'Record\' bar."' +
            '        data-bind="click" data-action="btn-recordbar">' ;
        o    += (robj.icons_str == 'no') ? '' : '<em class="fas fa-circle d-none d-sm-inline text-secondary"></em>&nbsp;' ;
        o    += (robj.icons_str == 'up') ? '<br>' : '&nbsp;' ;
        o    += '<strong><span data-langkey=\'RecordBar\'>RecordBar</span></strong></button>' ;
        onClick('btn-recordbar', () => api.wsweb_recordbar_toggle()) ;

        return o ;
    }

    render_btn_microcandc (robj)
    {
        var o = '<button class="btn bg-body-tertiary shadow-sm my-1 mx-1 px-2 border border-secondary"' +
            '        data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '        title="This button microcompiles and compiles."' +
            '        data-bind="click" data-action="btn-microcandc">' ;
        o    += (robj.icons_str == 'no') ? '' : '<em class="fas fa-circle d-none d-sm-inline text-secondary"></em>&nbsp;' ;
        o    += (robj.icons_str == 'up') ? '<br>' : '&nbsp;' ;
        o    += '<strong><span data-langkey=\'microc + c\'>&micro;c + c</span></strong></button>' ;
        onClick('btn-microcandc', () => api.wsweb_select_action('microcandc')) ;

        return o ;
    }

    render_btn_states (robj)
    {
        var o = '<button class="btn bg-body-tertiary shadow-sm my-1 mx-1 px-2 border border-secondary"' +
            '        data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '        title="This button opens the \'state management\' dialog: it shows the current state, saves the current state, and shows the differences between two states."' +
            '        data-bind="click" data-action="btn-states">' ;
        o    += (robj.icons_str == 'no') ? '' : '<em class="fas fa-camera d-none d-sm-inline text-secondary"></em>&nbsp;' ;
        o    += (robj.icons_str == 'up') ? '<br>' : '&nbsp;' ;
        o    += '<strong><span data-langkey=\'States\'>States</span></strong></button>' ;
        onClick('btn-states', () =>
        {
            api.wsweb_dialog_open('state') ; $('#bot_check1').carousel(0) ;
        }) ;

        return o ;
    }

    render_btn_checkpoint (robj)
    {
        var o = '<button class="btn bg-body-tertiary shadow-sm my-1 mx-1 px-2 border border-secondary"' +
            '        id="s4_owncode" value="owncode"' +
            '        data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '        title="This button opens the \'Configuration\' dialog."' +
            '        data-bind="click" data-action="btn-checkpoint">' ;
        o    += (robj.icons_str == 'no') ? '' : '<em class="fas fa-stream d-none d-sm-inline text-secondary"></em>&nbsp;' ;
        o    += (robj.icons_str == 'up') ? '<br>' : '&nbsp;' ;
        o    += '<strong><span class="d-none d-md-inline-flex" data-langkey=\'Checkpoint\'>Checkpoint</span><span class="d-md-none">ChkPoint</span></strong></button>' ;
        onClick('btn-checkpoint', () => api.wsweb_select_action('checkpoint')) ;

        return o ;
    }

    //
    // button + dropdown
    //

    render_btndd_action (robj)
    {
        var o = '<div class="btn-group col-auto my-1 mx-1 p-0" >' +
            '   <button type="button" ' +
            '           class="col-12 btn bg-body-tertiary shadow-sm select6 border border-secondary"' +
            '           data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '           title="Dropdown on the right let you access to common actions."' +
            '           data-bind="click" data-action="do-action"' +
            '           id="select6a"' +
            '   ><strong><em class="fas fa-clone"></em>&nbsp;<span data-langkey="Actions">Actions</span></strong></button>' +
            '   <button id="dd2a" type="button" ' +
            '           class="btn bg-body-tertiary dropdown-toggle dropdown-toggle-split border border-secondary"' +
            '           data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
            '     <span class="visually-hidden sr-only">Toggle Dropdown</span>' +
            '   </button>' +
            '   <div id="action_menu1"' +
            '        class="dropdown-menu border border-secondary p-2">' +
            '\n' +
            '     <h6 class="text-white bg-secondary mt-2 mb-1 border border-secondary"' +
            '     ><span data-langkey="Pick firm/soft from">Pick firm/soft from</span>:</h6>' +
            '     <a class="dropdown-item py-2" href="#" id="selact_examples" value="examples"' +
            '        data-bind="click" data-action="sel-action" data-value="examples"><em class="fas fa-stream"></em>&nbsp;<span data-langkey="Examples">Examples</span></a>' +
            '     <a class="dropdown-item py-2" href="#" id="selact_checkpoint"  value="owncode"' +
            '        data-bind="click" data-action="sel-action" data-value="checkpoint"><em class="fas fa-stream"></em>&nbsp;<span data-langkey="Checkpoint">Checkpoint</span></a>' +
            '\n' +
            '     <h6 class="text-white bg-secondary mt-2 mb-0 border border-secondary"' +
            '     ><span data-langkey="Utilities">Utilities</span>:</h6>' +
            '     <a class="dropdown-item py-2" href="#" id="selact_notifications" value="notifications"' +
            '        data-bind="click" data-action="sel-action" data-value="notifications"><span data-langkey="Notifications">Notifications</span></a>' +
            '     <a class="dropdown-item py-2" href="#" id="selact_recordbar" value="recordbar"' +
            '        data-bind="click" data-action="sel-action" data-value="recordbar"><span data-langkey="RecordBar">RecordBar</span></a>' +
            '     <a class="dropdown-item py-2" href="#" id="selact_reload" value="reload"' +
            '        data-bind="click" data-action="sel-action" data-value="reload"><span data-langkey="Reload">Reload</span></a>' +
            '\n' +
            '     <h6 class="text-white bg-secondary mt-2 mb-0 border border-secondary"' +
            '     ><span data-langkey="Combinations">Combinations</span>:</h6>' +
            '     <a class="dropdown-item py-2" href="#" id="selact_microcandc" value="microcandc"' +
            '        data-bind="click" data-action="sel-action" data-value="microcandc"><span data-langkey="microc and c">&micro;c and c</span></a>' +
            '\n' +
            '     <h6 class="text-white bg-secondary mt-2 mb-0 border border-secondary"' +
            '     ><span data-langkey="Information from">Information from</span>:</h6>' +
            '     <a class="dropdown-item py-2" href="#" id="selact_help" value="help"' +
            '        data-bind="click" data-action="sel-action" data-value="help"><span data-langkey="Help">Help</span></a>' +
            '     <a class="dropdown-item py-2" href="#" id="selact_welcome" value="welcome"' +
            '        data-bind="click" data-action="sel-action" data-value="welcome"><span data-langkey="Welcome tutorial">Welcome tutorial</span>...</a>' +
            '     <a class="dropdown-item py-2" href="#" id="selact_intro" value="intro"' +
            '        data-bind="click" data-action="sel-action" data-value="intro"><span data-langkey="Initial intro">Initial intro</span>...</a>' +
            '\n' +
            '   </div>' +
            '</div>' ;
        onClick('do-action', (el) => api.wsweb_do_action(el.dataset.value)) ;
        onClick('sel-action', (el) =>
        {
            api.wsweb_select_action(el.dataset.value);
            $('[id="dd2a"].dropdown-toggle').dropdown('hide');
        }) ;
        return o ;
    }

    render_btndd_mode (robj)
    {
        var o = '' ;

        o += '<div class="btn-group col-auto my-1 mx-1 p-0 wsx_morecfg" style="flex-grow:6;">' +
            '   <button type="button"' +
            '           class="col-12 btn bg-body-tertiary shadow-sm border border-secondary"' +
            '           data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '           title="This button shows the current hardware used, <br>dropdown on the right let you access to common actions."' +
            '           id="select4"' +
            '           data-bind="click" data-action="toggle-mode-dropdown">HW</button>' +
            '\n' +
            '   <button id="dd1" type="button" ' +
            '           class="btn bg-body-tertiary dropdown-toggle dropdown-toggle-split border border-secondary"' +
            '        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"' +
            '   ><span class="visually-hidden">Toggle Dropdown</span></button>' +
            '\n' +
            '   <div id="mode_menu" ' +
            '        style="z-index:1200; " ' +
            '        class="dropdown-menu border border-secondary p-2">' +
            '\n' +
            '     <h6 class="text-white bg-secondary my-1 wsx_morecfg ms-auto border border-secondary"><span data-langkey="Micro & Assembly">Micro & Assembly</span>:</h6>' ;
        onClick('toggle-mode-dropdown', () =>
        {
            wait_if_uievents(function()
            {
                $('#dd1').dropdown('toggle');
            }, 50) ;
            wepsim_tooltips_hide('[data-bs-toggle=tooltip]') ;
        }) ;

        var item ;
        var wip_class ;
        var allProcs = simhw_get_processor_names() ;
        for (var i = 0; i < allProcs.length; i++)
        {
            item = allProcs[i] ;

            wip_class = '' ;
            if (item == 'poc') wip_class = 'wsx_poc' ;
            else if (item == 'ep2') wip_class = 'wsx_ep2' ;
            else if (item == 'rv') wip_class = 'wsx_rv' ;

            o += '     <a class="dropdown-item py-2 ' + wip_class + '" ' +
                '        href="#" id="s4_' + item + '" value="' + item + '" ' +
                '        data-bind="click" data-action="select-main" data-value="' + item + '"' +
                '     ><em class="fas fa-microchip"></em>&nbsp;' + item.toUpperCase() + '</a>' ;
        }
        onClick('select-main', (el) =>
        {
            $('[id="dd1"].dropdown-toggle').dropdown('hide');
            inputfirm.is_compiled = false ;
            inputasm.is_compiled  = false ;
            api.wsweb_select_main(el.dataset.value) ;
        }) ;

        o += '\n' +
            '     <h6 class="text-white bg-secondary mt-2 my-1 wsx_morecfg ms-auto border border-secondary"><span data-langkey="Assembly only">Assembly only</span>:</h6>' +
            '\n' +
            '     <a class="dropdown-item wsx_morecfg mb-0 py-2" ' +
            '        href="#" id="s4_asm_mips" value="asm_mips"' +
            '        data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '        title="MIPS<sub>32</sub> assembly only (integer instructions)."' +
            '        data-bind="click" data-action="select-main" data-value="asm_mips"' +
            '     ><em class="fas fa-microchip"></em>&nbsp;EP+MIPS<sub>int32</sub></a>' +
            '     <a class="dropdown-item wsx_morecfg mb-0 py-2" ' +
            '        href="#" id="s4_asm_rv32" value="asm_rv32"' +
            '        data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '        title="RISC-V<sub>32</sub> assembly only (i+m sets)."' +
            '        data-bind="click" data-action="select-main" data-value="asm_rv32"' +
            '     ><em class="fas fa-microchip"></em>&nbsp;EP+RV32<sub>i+m</sub></a>' +
            '\n' +
            '     <hr class="m-1 p-0 wsx_ep2">' +
            '     <a class="dropdown-item wsx_morecfg mb-0 py-2 wsx_ep2" ' +
            '        href="#" id="s4_ep2_asm_mips" value="ep2_asm_mips"' +
            '        data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '        title="MIPS<sub>32</sub> assembly only (integer instructions)."' +
            '        data-bind="click" data-action="select-main" data-value="ep2_asm_mips"' +
            '     ><em class="fas fa-microchip"></em>&nbsp;EP2+MIPS<sub>int32</sub></a>' +
            '     <a class="dropdown-item wsx_morecfg mb-0 py-2 wsx_ep2" ' +
            '        href="#" id="s4_ep2_asm_rv32" value="ep2_asm_rv32"' +
            '        data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '        title="RISC-V<sub>32</sub> assembly only (i+m sets)."' +
            '        data-bind="click" data-action="select-main" data-value="ep2_asm_rv32"' +
            '     ><em class="fas fa-microchip"></em>&nbsp;E2P+RV32<sub>i+m</sub></a>' +
            '\n' +
            '   </div>' +
            '</div>' ;

        return o ;
    }

    render_btndd_examples (robj)
    {
        var o = '' ;

        o += '<div class="btn-group col-auto my-1 mx-1 p-0" style="flex-grow:6;">' +
            '   <button type="button"' +
            '           class="btn bg-body-tertiary col-12 shadow-sm border border-secondary"' +
            '           data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true"' +
            '           title="This button opens the \'Examples\' dialog."' +
            '           id="btn_example1"' +
            '           data-bind="click" data-action="btn-examples">' ;
        o += (robj.icons_str == 'no') ? '' : '<em class="fas fa-stream d-none d-sm-inline text-secondary"></em>' ;
        o += (robj.icons_str == 'up') ? '<br>' : '&nbsp;' ;
        o += '<strong><span data-langkey=\'Examples\'>Examples</span></strong></button>' ;
        onClick('btn-examples', () =>
        {
            wepsim_tooltips_hide('[data-bs-toggle=tooltip]') ;
            api.wsweb_dialog_open('examples') ;
        }) ;
        o += '\n' +
            '   <button id="dd3" type="button" ' +
            '           class="btn bg-body-tertiary shadow-sm dropdown-toggle dropdown-toggle-split border border-secondary"' +
            '        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"' +
            '   ><span class="visually-hidden">Toggle Dropdown</span></button>' +
            '\n' +
            '   <div id="example_menu" ' +
            '        style="z-index:1200; " ' +
            '        class="dropdown-menu border border-secondary p-2">' +
            '\n' ;
        o += '   </div>' +
            '</div>' ;

        return o ;
    }
}

export function webui_toolbar_updateMode(opt)
{
    // tutorial mode -> set green background
    // else          -> set #F6F6F6
    $('#select4').css('background-color', '#F6F6F6') ;

    // set button label...
    var ed = $('#s4_' + opt).html() ;
    $('#select4').html(ed) ;
}

export function webui_toolbar_updateAction(opt)
{
    // set button label...
    var ed = $('#selact_' + opt).html() ;
    $('.select6').html(ed) ;
    $('#select6a').attr('data-value', opt) ;
}

export function webui_toolbar_updateExampleSet()
{
    var item ;
    var o = '' ;

    for (var i = 0; i < ws_info.example_set.length; i++)
    {
        item = ws_info.example_set[i] ;
        if (item.visible == false) continue ;

        o += '<a class="dropdown-item py-2 " ' +
            '   href="#" id="exs_' + item.name + '" value="' + i + '" ' +
            '   data-bind="click" data-action="select-example" data-value="' + item.name + '"' +
            '><em class="fas fa-cube d-sm-inline d-xs-none text-secondary me-2"></em>' +
            item.name + '</a>\n' ;
    }

    $('#example_menu').html(o) ;
    onClick('select-example', async (el) =>
    {
        wepsim_example_reset() ;
        await wepsim_example_load(el.dataset.value) ;
        wepsim_tooltips_hide('[data-bs-toggle=tooltip]') ;
        api.wsweb_dialog_open('examples') ;
        $('[id="dd3"].dropdown-toggle').dropdown('hide');
    }) ;
}
