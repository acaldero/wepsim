import './web.css';

// Import order matters: jquery-global sets window.jQuery BEFORE bootstrap evaluates
import $ from './jquery-global.js';
import 'bootstrap';
import 'bootstrap-tokenfield';
import 'jquery-knob';
import 'dropify';

import { wepsim_web_register_components } from '../../wepsim_web/wepsim_web_register_elements.js';
import { simcore_init, simcore_init_hw } from '../../sim_core/sim_api_core.js';
import { get_cfg, upgrade_cfg } from '../../sim_core/sim_cfg.js';
import { wepsim_register_core } from '../../wepsim_core/wepsim_register_core.js';
import { i18n_init } from '../../wepsim_i18n/i18n.js';
import { simhw_get_processor_names } from '../../sim_hw/sim_hw_lazy.js';
import { wepsim_init_firefoxOS } from '../../wepsim_web/wepsim_web_simulator.js';
import { simcore_sound_init } from '../../sim_core/sim_core_sound.js';

try
{
    await i18n_init();
    wepsim_register_core();
    simcore_init(true);
    upgrade_cfg();
    var ws_mode      = get_cfg('ws_mode') ;
    const processors = simhw_get_processor_names();
    ws_mode          = processors.some((v)=>v == ws_mode) ? ws_mode : processors[0];
    await simcore_init_hw(ws_mode);
    wepsim_web_register_components();
}
catch (err)
{
    console.error('WepSIM init error:', err.message);
    console.error(err);
}

// UI init
$(document).ready(function ()
{
    $('#ws_loader').hide();
});

// TODO: think if necesary with electron
// if (typeof wepsim_init_PWA === 'function')
// {
//     if (!import.meta.env?.DEV)
//         wepsim_init_PWA();
// }
if (typeof wepsim_init_firefoxOS === 'function')
    wepsim_init_firefoxOS();
if (typeof simcore_sound_init === 'function')
    simcore_sound_init();
