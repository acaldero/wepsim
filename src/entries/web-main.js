import './web.css';

// Import order matters: jquery-global sets window.jQuery BEFORE bootstrap evaluates
import $ from './jquery-global.js';
import 'bootstrap';
import 'bootstrap-tokenfield';
import 'jquery-knob';
import 'dropify';

import { wepsim_web_register_components, WSL_COMPONENTS_LENGTH } from '../../wepsim_web/wepsim_web_register_elements.js';
import { simcore_init, simcore_init_hw, simcore_welcome } from '../../sim_core/sim_api_core.js';
import { get_cfg, upgrade_cfg } from '../../sim_core/sim_cfg.js';
import { wepsim_register_core } from '../../wepsim_core/wepsim_register_core.js';
import { i18n_init } from '../../wepsim_i18n/i18n.js';
import { simhw_get_processor_names } from '../../sim_hw/sim_hw_lazy.js';
import { wepsim_init_firefoxOS } from '../../wepsim_web/wepsim_web_simulator.js';
import { simcore_sound_init } from '../../sim_core/sim_core_sound.js';

var WSL_TOTAL = 6 + WSL_COMPONENTS_LENGTH;

export async function wsl_update_progress(current, total)
{
    var pct = total > 0 ? Math.round((current / total) * 100) : 0;
    var bar = document.getElementById('wsl_progressbar');
    if (bar)
    {
        bar.style.width = pct + '%';
        bar.setAttribute('aria-valuenow', pct);
        bar.textContent = pct + '%';
    }
    // Force web UI update
    await new Promise((resolve) => setTimeout(resolve, 0));
}

try
{
    await wsl_update_progress(1, WSL_TOTAL);
    await i18n_init();

    await wsl_update_progress(2, WSL_TOTAL);
    wepsim_register_core();

    await wsl_update_progress(3, WSL_TOTAL);
    simcore_init(true);
    simcore_welcome() ;

    await wsl_update_progress(4, WSL_TOTAL);
    upgrade_cfg();

    await wsl_update_progress(5, WSL_TOTAL);
    var ws_mode      = get_cfg('ws_mode') ;
    const processors = simhw_get_processor_names();
    ws_mode          = processors.some((v)=>v == ws_mode) ? ws_mode : processors[0];

    await wsl_update_progress(6, WSL_TOTAL);
    await simcore_init_hw(ws_mode);

    await wepsim_web_register_components(async (i, total) => await wsl_update_progress(6 + i, WSL_TOTAL));
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
