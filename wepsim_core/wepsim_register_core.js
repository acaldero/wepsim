import { wepsim_register_modes } from './wepsim_mode.js';
import { wepsim_register_breakpoint_icons } from './wepsim_dbg_breakpointicons.js';
import { wepsim_register_clipboard } from './wepsim_clipboard.js';
import { wepsim_register_help_commands } from './wepsim_help_commands.js';
import { wepsim_register_tour_commands } from './wepsim_tour_commands.js';
import { wepsim_register_tutorial_simple_usage } from './wepsim_tutorial_simpleusage.js';
import { wepsim_register_tutorial_welcome } from './wepsim_tutorial_welcome.js';
import { wepsim_register_voice_commands } from './wepsim_voice_commands.js';
import { wepsim_register_preload_tasks } from './wepsim_preload_commands.js';
import { wepsim_register_config_ui } from '../wepsim_web/wepsim_web_ui_config_commands.js';
import { wepsim_state_history_reset } from './wepsim_state.js';
import { wepsim_example_register } from './wepsim_example.js';

export function wepsim_register_core()
{
    wepsim_register_modes();
    wepsim_register_breakpoint_icons();
    wepsim_register_clipboard();
    wepsim_register_help_commands();
    wepsim_register_tour_commands();
    wepsim_register_tutorial_simple_usage();
    wepsim_register_tutorial_welcome();
    wepsim_register_voice_commands();
    wepsim_register_preload_tasks();
    wepsim_register_config_ui();
    wepsim_state_history_reset();
    wepsim_example_register();
}
