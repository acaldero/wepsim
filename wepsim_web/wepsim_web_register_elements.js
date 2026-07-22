// Centralized registration of all WepSIM custom elements
// No more module-level side effects — call registerWebComponents() during bootstrap

import { register_uielto } from './wepsim_uielto.js';

import { ws_about } from './wepsim_uielto_about.js';
import { ws_bin_asm } from './wepsim_uielto_bin_asm.js';
import { ws_bin_mc } from './wepsim_uielto_bin_mc.js';
import { ws_cachememory } from './wepsim_uielto_cache.js';
import { ws_cache_config } from './wepsim_uielto_cache_config.js';
import { ws_compilationbar } from './wepsim_uielto_compilationbar.js';
import { ws_config } from './wepsim_uielto_index_config.js';
import { ws_console } from './wepsim_uielto_console.js';
import { ws_cpu } from './wepsim_uielto_cpu.js';
import { ws_cpucu_got } from './wepsim_uipacker_cpu_cu.js';
import { ws_cpusvg } from './wepsim_uielto_cpusvg.js';
import { ws_ctoasm } from './wepsim_uipacker_cto_asm.js';
import { ws_dbg_mc } from './wepsim_uielto_dbg_mc.js';
import { ws_dbg_mp } from './wepsim_uielto_dbg_asm.js';
import { ws_ddown_info } from './wepsim_uipacker_ddown_info.js';
import { ws_ddown_sel } from './wepsim_uipacker_ddown_sel.js';
import { ws_edit_as } from './wepsim_uielto_editas.js';
import { ws_edit_mc } from './wepsim_uielto_editmc.js';
import { ws_executionbar } from './wepsim_uielto_executionbar.js';
import { ws_examples } from './wepsim_uielto_index_examples.js';
import { ws_flash_asm } from './wepsim_uielto_flash_asm.js';
import { ws_flash_fpga } from './wepsim_uielto_flash_fpga.js';
import { ws_help } from './wepsim_uielto_index_help.js';
import { ws_help_hweltos } from './wepsim_uielto_help_hweltos.js';
import { ws_help_swset } from './wepsim_uielto_help_swset.js';
import { ws_hw } from './wepsim_uielto_hw.js';
import { ws_io_config } from './wepsim_uielto_timer_config.js';
import { ws_io_info } from './wepsim_uielto_timer_info.js';
import { ws_l3d } from './wepsim_uielto_l3d.js';
import { ws_ledm } from './wepsim_uielto_ldm.js';
import { ws_list_cfg } from './wepsim_uielto_listcfg.js';
import { ws_list_example } from './wepsim_uielto_listexample.js';
import { ws_list_processor } from './wepsim_uielto_listprocessor.js';
import { ws_load_file } from './wepsim_uielto_loadfile.js';
import { ws_load_link } from './wepsim_uielto_loadlink.js';
import { ws_mainmemory } from './wepsim_uielto_mem.js';
import { ws_mem_config } from './wepsim_uielto_mem_config.js';
import { ws_notifications } from './wepsim_uielto_notifications.js';
import { ws_recordbar } from './wepsim_uielto_recordbar.js';
import { ws_registers } from './wepsim_uielto_registers.js';
import { ws_save_file } from './wepsim_uielto_savefile.js';
import { ws_save_files } from './wepsim_uielto_savefiles.js';
import { ws_save_files_option } from './wepsim_uielto_savefiles.js';
import { ws_segments } from './wepsim_uielto_segments.js';
import { ws_share_link } from './wepsim_uielto_sharelink.js';
import { ws_simmicasm } from './wepsim_uipacker_sim_mic_asm.js';
import { ws_slider_cpucu } from './wepsim_uielto_slider_cpucu.js';
import { ws_slider_details } from './wepsim_uielto_slider_details.js';
import { ws_sound } from './wepsim_uielto_sound.js';
import { ws_states } from './wepsim_uielto_states.js';
import { ws_toolbar } from './wepsim_uielto_toolbar.js';
import { ws_topbar } from './wepsim_uielto_topbar.js';
import { ws_uiscreen_classic } from './wepsim_uiscreen_classic.js';
import { ws_uiscreen_compact } from './wepsim_uiscreen_compact.js';
import { ws_web_main } from './wepsim_uiscreen_main.js';

var WSL_COMPONENTS = [
    ['ws-about', ws_about],
    ['ws-bin-asm', ws_bin_asm],
    ['ws-bin-mc', ws_bin_mc],
    ['ws-cachememory', ws_cachememory],
    ['ws-cache-config', ws_cache_config],
    ['ws-compilationbar', ws_compilationbar],
    ['ws-config', ws_config],
    ['ws-console', ws_console],
    ['ws-cpu', ws_cpu],
    ['ws-cpucu_got', ws_cpucu_got],
    ['ws-cpusvg', ws_cpusvg],
    ['ws-ctoasm', ws_ctoasm],
    ['ws-dbg-mc', ws_dbg_mc],
    ['ws-dbg-mp', ws_dbg_mp],
    ['ws-ddown-info', ws_ddown_info],
    ['ws-ddown-sel', ws_ddown_sel],
    ['ws-edit-as', ws_edit_as],
    ['ws-edit-mc', ws_edit_mc],
    ['ws-executionbar', ws_executionbar],
    ['ws-examples', ws_examples],
    ['ws-flash-asm', ws_flash_asm],
    ['ws-flash-fpga', ws_flash_fpga],
    ['ws-help', ws_help],
    ['ws-help-hweltos', ws_help_hweltos],
    ['ws-help-swset', ws_help_swset],
    ['ws-hw', ws_hw],
    ['ws-io-config', ws_io_config],
    ['ws-io-info', ws_io_info],
    ['ws-l3d', ws_l3d],
    ['ws-ledm', ws_ledm],
    ['ws-list-cfg', ws_list_cfg],
    ['ws-list-example', ws_list_example],
    ['ws-list-processor', ws_list_processor],
    ['ws-load-file', ws_load_file],
    ['ws-load-link', ws_load_link],
    ['ws-mainmemory', ws_mainmemory],
    ['ws-mem-config', ws_mem_config],
    ['ws-notifications', ws_notifications],
    ['ws-recordbar', ws_recordbar],
    ['ws-registers', ws_registers],
    ['ws-save-file', ws_save_file],
    ['ws-save-files', ws_save_files],
    ['ws-save-files-option', ws_save_files_option],
    ['ws-segments', ws_segments],
    ['ws-share-link', ws_share_link],
    ['ws-simmicasm', ws_simmicasm],
    ['ws-slider-cpucu', ws_slider_cpucu],
    ['ws-slider-details', ws_slider_details],
    ['ws-sound', ws_sound],
    ['ws-states', ws_states],
    ['ws-toolbar', ws_toolbar],
    ['ws-topbar', ws_topbar],
    ['ws-screen-classic', ws_uiscreen_classic],
    ['ws-screen-compact', ws_uiscreen_compact],
    ['ws-web-main', ws_web_main],
];

export const WSL_COMPONENTS_LENGTH = WSL_COMPONENTS.length;

export async function wepsim_web_register_components(on_each)
{
    for (let i = 0; i < WSL_COMPONENTS.length; i++)
    {
        const pair = WSL_COMPONENTS[i];
        register_uielto(pair[0], pair[1]);
        if (on_each) await on_each(i, WSL_COMPONENTS.length);
    }
}
