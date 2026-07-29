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
import { update_cfg } from './sim_cfg.js';
import { wepsim_notify_close } from '../wepsim_core/wepsim_notify.js';
import { wepsim_update_signal_with_value, wepsim_update_signal_dialog } from '../wepsim_core/wepsim_signal.js';
import { load_from_example_assembly, load_from_example_firmware } from '../wepsim_core/wepsim_example.js';
import { wepsim_help_set } from '../wepsim_core/wepsim_help.js';
import { asmdbg_set_breakpoint } from '../wepsim_web/wepsim_uielto_dbg_asm.js';
import { dbg_set_breakpoint } from '../wepsim_web/wepsim_uielto_dbg_mc.js';
import {
    wsweb_change_workspace_simulator, wsweb_change_workspace_microcode,
    wsweb_change_workspace_assembly, wsweb_change_show_processor,
    wsweb_change_show_asmdbg, wsweb_execution_reset,
    wsweb_execution_microinstruction, wsweb_execution_instruction,
    wsweb_execution_run, wsweb_dialogbox_close_all,
    wsweb_dialog_open, wsweb_dialog_close,
    wsweb_dialogbox_close_updatesignal, wsweb_set_details_select,
    wsweb_set_details, wsweb_select_refresh, wsweb_select_main,
    wsweb_set_cpucu_size, wsweb_set_c1c2_size,
    wsweb_assembly_compile, wsweb_firmware_compile,
    wsweb_save_controlmemory_to_file,
    wsweb_quickmenu_show, wsweb_quickmenu_close, wsweb_quickmenu_toggle,
    wsweb_quickslider_show, wsweb_quickslider_close, wsweb_quickslider_toggle,
    wsweb_quickcpuview_show, wsweb_quickcpuview_close, wsweb_quickcpuview_toggle,
    wsweb_cpuview_as_graph, wsweb_cpuview_as_text,
    wsweb_quickrf_show, wsweb_quickrf_close, wsweb_quickrf_toggle,
    wsweb_recordbar_show, wsweb_recordbar_toggle, wsweb_recordbar_close,
    wsweb_notifyuser_show, wsweb_notifyuser_hide, wsweb_scroll_to,
    wsweb_select_action,
} from '../wepsim_web/wepsim_web_api.js';

/*
* Record function registry.
*
* All functions that can be called during record playback must be
* registered in this map.  When adding a new recorded action, add
* the callback function here.
*/
var record_fns = {
    'simcore_record_glowing':             simcore_record_glowing,
    'update_cfg':                         update_cfg,
    'wepsim_notify_close':                wepsim_notify_close,
    'wepsim_update_signal_with_value':    wepsim_update_signal_with_value,
    'wepsim_update_signal_dialog':        wepsim_update_signal_dialog,
    'load_from_example_assembly':         load_from_example_assembly,
    'load_from_example_firmware':         load_from_example_firmware,
    'wepsim_help_set':                    wepsim_help_set,
    'asmdbg_set_breakpoint':              asmdbg_set_breakpoint,
    'dbg_set_breakpoint':                 dbg_set_breakpoint,
    'wsweb_change_workspace_simulator':   wsweb_change_workspace_simulator,
    'wsweb_change_workspace_microcode':   wsweb_change_workspace_microcode,
    'wsweb_change_workspace_assembly':    wsweb_change_workspace_assembly,
    'wsweb_change_show_processor':        wsweb_change_show_processor,
    'wsweb_change_show_asmdbg':           wsweb_change_show_asmdbg,
    'wsweb_execution_reset':              wsweb_execution_reset,
    'wsweb_execution_microinstruction':   wsweb_execution_microinstruction,
    'wsweb_execution_instruction':        wsweb_execution_instruction,
    'wsweb_execution_run':                wsweb_execution_run,
    'wsweb_dialogbox_close_all':          wsweb_dialogbox_close_all,
    'wsweb_dialog_open':                  wsweb_dialog_open,
    'wsweb_dialog_close':                 wsweb_dialog_close,
    'wsweb_dialogbox_close_updatesignal': wsweb_dialogbox_close_updatesignal,
    'wsweb_set_details_select':           wsweb_set_details_select,
    'wsweb_set_details':                  wsweb_set_details,
    'wsweb_select_refresh':               wsweb_select_refresh,
    'wsweb_select_main':                  wsweb_select_main,
    'wsweb_set_cpucu_size':               wsweb_set_cpucu_size,
    'wsweb_set_c1c2_size':                wsweb_set_c1c2_size,
    'wsweb_assembly_compile':             wsweb_assembly_compile,
    'wsweb_firmware_compile':             wsweb_firmware_compile,
    'wsweb_save_controlmemory_to_file':   wsweb_save_controlmemory_to_file,
    'wsweb_quickmenu_show':               wsweb_quickmenu_show,
    'wsweb_quickmenu_close':              wsweb_quickmenu_close,
    'wsweb_quickmenu_toggle':             wsweb_quickmenu_toggle,
    'wsweb_quickslider_show':             wsweb_quickslider_show,
    'wsweb_quickslider_close':            wsweb_quickslider_close,
    'wsweb_quickslider_toggle':           wsweb_quickslider_toggle,
    'wsweb_quickcpuview_show':            wsweb_quickcpuview_show,
    'wsweb_quickcpuview_close':           wsweb_quickcpuview_close,
    'wsweb_quickcpuview_toggle':          wsweb_quickcpuview_toggle,
    'wsweb_cpuview_as_graph':             wsweb_cpuview_as_graph,
    'wsweb_cpuview_as_text':              wsweb_cpuview_as_text,
    'wsweb_quickrf_show':                 wsweb_quickrf_show,
    'wsweb_quickrf_close':                wsweb_quickrf_close,
    'wsweb_quickrf_toggle':               wsweb_quickrf_toggle,
    'wsweb_recordbar_show':               wsweb_recordbar_show,
    'wsweb_recordbar_toggle':             wsweb_recordbar_toggle,
    'wsweb_recordbar_close':              wsweb_recordbar_close,
    'wsweb_notifyuser_show':              wsweb_notifyuser_show,
    'wsweb_notifyuser_hide':              wsweb_notifyuser_hide,
    'wsweb_scroll_to':                    wsweb_scroll_to,
    'wsweb_select_action':                wsweb_select_action,
};

/*
     * Record: private
     */

// Private data
export var ws_records = [] ;

export var ws_last_played = 0 ;
export var ws_last_toplay = 0 ;

export var ws_last_time = 0 ;
export var ws_last_timer = null ;

export var ws_is_recording = false ;
export var ws_is_playing = false ;

export var ws_record_msg_name = '' ;
export var ws_record_msg_obj = null ;
export var ws_record_pb_name = '' ;
export var ws_record_pb_obj = null ;

// Private API
export function simcore_record_pushElto (desc, elto, distance)
{
    // add a new record
    var record = {
        timestamp:   distance,
        description: desc,
        element:     elto,
    } ;

    ws_records.push(record) ;
}

export function simcore_record_showMsg (index, msg)
{
    if (ws_record_msg_obj !== null)
    {
        ws_record_msg_obj.html('<em>' + index + '/' + ws_records.length + '</em>&nbsp;' + msg) ;
    }

    if (ws_record_pb_obj !== null)
    {
        var next_pbval = (100 * index) / ws_records.length ;
        ws_record_pb_obj.css('width', next_pbval + '%').attr('aria-valuenow', next_pbval) ;
    }
}

export function simcore_record_playAt (index_current, index_last)
{
    // 1.- stop playing...
    if (ws_is_playing === false)
    {
        simcore_record_showMsg(ws_last_played, 'Stopped by user.') ;
        return ;
    }
    ws_last_played = index_current ;
    if (index_current >= index_last)
    {
        simcore_record_showMsg(index_last, 'Done.') ;
        return ;
    }

    // 2.- ignore pending events...
    if (ws_records[index_current].description === '_pending event_')
    {
        simcore_record_playAt(index_current + 1, index_last) ;
        return ;
    }

    // 2.- execute current step, show message, and set last played
    new Function(...Object.keys(record_fns), ws_records[index_current].element)(...Object.values(record_fns)) ;

    var index_next = index_current + 1 ;
    simcore_record_showMsg(index_next, ws_records[index_current].description) ;

    // 3.- set next one
    var wait_time = 500 ;
    if (index_next < index_last)
    {
        wait_time = ws_records[index_next].timestamp ;
    }

    if (wait_time !== 0)
    {
        wait_time = (wait_time < 500) ? 500 : wait_time ;
    }

    ws_last_timer = setTimeout(function()
    {
        simcore_record_playAt(index_next, index_last) ;
    }, wait_time);
}

export var ws_glowing_time = 250 ;

export function simcore_record_glowing (ui_id)
{
    // check params
    var ui_obj = $(ui_id) ;
    if (ui_obj === null)
    {
        return ;
    }

    // add class and...
    ui_obj.addClass('bg-glow') ;

    // ...remove it after 'ws_glowing_time' ms.
    setTimeout(function()
    {
        ui_obj.removeClass('bg-glow') ;
    }, ws_glowing_time) ;
}

export function simcore_record_glowAdd ()
{
    var ui_obj = $(this) ;
    var ui_id  = ui_obj.attr('id') ;

    // check params
    if (typeof ui_id === 'undefined')
    {
        return ;
    }
    if (ws_is_recording === false)
    {
        return ;
    }

    // reload the event handler
    ui_obj.one('click', simcore_record_glowAdd) ;

    // add a new record
    simcore_record_resolve_pending('Click on UI element ' + ui_id,
                                   'simcore_record_glowing("#' + ui_id + '");\n') ;
}

/*
     * Record: public API
     */

// init

export function simcore_record_init (div_msg_id, div_pb_id)
{
    ws_records = [] ;

    ws_last_played = 0 ;
    ws_last_time   = 0 ;

    ws_is_playing   = false ;
    ws_is_recording = false ;

    ws_record_msg_name = div_msg_id ;
    ws_record_msg_obj  = $('#' + div_msg_id) ;
    if (typeof ws_record_msg_obj.html === 'undefined')
    {
        ws_record_msg_obj = null ;
    }

    ws_record_pb_name = div_pb_id ;
    ws_record_pb_obj  = $('#' + div_pb_id) ;
    if (typeof ws_record_pb_obj.html === 'undefined')
    {
        ws_record_pb_obj = null ;
    }
}

export function simcore_record_captureInit ()
{
    $('.nav-link').off('click', simcore_record_glowAdd) ;
    $('.btn-like').off('click', simcore_record_glowAdd) ;
    $('.btn').off('click', simcore_record_glowAdd) ;

    $('.nav-link').one('click', simcore_record_glowAdd) ;
    $('.btn-like').one('click', simcore_record_glowAdd) ;
    $('.btn').one('click', simcore_record_glowAdd) ;
}

// recording (on, off, ...)

export function simcore_record_start ()
{
    ws_is_playing   = false ;
    ws_is_recording = true ;

    ws_last_played = 0 ;
    ws_last_time   = Date.now() ;

    simcore_record_showMsg(ws_last_played, 'Recording...') ;
}

export function simcore_record_stop ()
{
    ws_is_playing   = false ;
    ws_is_recording = false ;

    ws_last_played = 0 ;
    ws_last_toplay = ws_records.length ;

    simcore_record_showMsg(ws_last_played, 'Stopped by user.') ;
}

export function simcore_record_isRecording ()
{
    return ws_is_recording ;
}

// playing (play, pause)

export function simcore_record_play ()
{
    if (ws_is_playing === true)
    {
        clearTimeout(ws_last_timer) ;

        if (ws_last_played < ws_records.length)
            ws_last_played = ws_last_played + 1 ;
        else ws_last_played = 0 ;
    }
    else
    {
        ws_last_toplay = ws_records.length ;
    }

    ws_is_playing   = true ;
    ws_is_recording = false ;

    simcore_record_playAt(ws_last_played, ws_last_toplay) ;
}

export function simcore_record_playInterval (from, to)
{
    if (ws_is_playing === true)
    {
        clearTimeout(ws_last_timer) ;

        if (ws_last_played < to)
            ws_last_played = ws_last_played + 1 ;
        else ws_last_played = from ;
    }
    else
    {
        ws_last_played = from ;
    }

    ws_last_toplay = to ;

    ws_is_playing   = true ;
    ws_is_recording = false ;

    simcore_record_playAt(ws_last_played, ws_last_toplay) ;
}

export function simcore_record_pause ()
{
    ws_is_playing   = !ws_is_playing ;
    ws_is_recording = false ;

    if (ws_is_playing === true)
    {
        simcore_record_playAt(ws_last_played, ws_last_toplay) ;
    }
}

export function simcore_record_isPlaying ()
{
    return ws_is_playing ;
}

// recording object

export function simcore_record_length ()
{
    return ws_records.length ;
}

export function simcore_record_get ()
{
    return ws_records ;
}

export function simcore_record_set (records)
{
    ws_last_played = 0 ;
    ws_last_time   = 0 ;

    ws_is_playing   = false ;
    ws_is_recording = false ;

    ws_records = records ;
    simcore_record_showMsg(0, 'Record restored.') ;
}

export function simcore_record_reset ()
{
    ws_last_played = 0 ;
    ws_last_toplay = 0 ;
    ws_last_time   = 0 ;

    ws_is_playing   = false ;
    ws_is_recording = false ;

    ws_records = [] ;
    simcore_record_showMsg(0, 'Empty record') ;
}

export function simcore_record_append_new (description, elto)
{
    if (ws_is_recording === true)
    {
        var distance = Date.now() - ws_last_time ;
        ws_last_time = Date.now() ;

        simcore_record_pushElto(description, elto, distance) ;
        simcore_record_showMsg(0, 'Recording...') ;
    }
}

export function simcore_record_append_pending ()
{
    if (ws_is_recording === true)
    {
        // distance + update internal clock
        var distance = Date.now() - ws_last_time ;
        ws_last_time = Date.now() ;

        // min. distance -> glowing time
        if ((0 == distance) && (ws_records.length > 0) &&
            (ws_records[ws_records.length - 1].description === '_pending event_'))
        {
            distance = ws_glowing_time ;
        }

        // add event
        simcore_record_pushElto('_pending event_', ';', distance) ;
    }
}

export function simcore_record_resolve_pending (description, elto)
{
    if (ws_is_recording === true)
    {
        // find last pending
        var last_pending = ws_records.length ;
        while (last_pending > 0)
        {
            last_pending -- ;

            if (ws_records[last_pending].description === '_pending event_')
            {
                break ;
            }
        }

        // if there is not pending, insert together to the last one
        if (last_pending === 0)
        {
            simcore_record_setTimeBeforeNow(0) ;
            simcore_record_append_new(description, elto) ;
            return ;
        }

        // otherwise, update information for the last pending entry
        ws_records[last_pending].description = description ;
        ws_records[last_pending].element     = elto ;
        simcore_record_showMsg(0, 'Recording...') ;
    }
}

// recording time

export function simcore_record_setTimeBeforeNow (distance)
{
    ws_last_time = Date.now() - distance ;
}

export function simcore_record_addTimeAfterLast (distance)
{
    ws_last_time = ws_last_time + distance ;
}

