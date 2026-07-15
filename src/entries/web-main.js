// WepSIM web entry — bootstrap

import { wepsim_web_register_components } from '../../wepsim_web/wepsim_web_register_elements.js';
import { simcore_init, simcore_init_hw } from '../../sim_core/sim_api_core.js';
import { get_cfg, upgrade_cfg } from '../../sim_core/sim_cfg.js';
import { wepsim_register_core } from '../../wepsim_core/wepsim_register_core.js';
import { i18n_init } from '../../wepsim_i18n/i18n.js';

try
{
    i18n_init();
    wepsim_register_core();
    simcore_init(true);
    upgrade_cfg();
    var ws_mode = get_cfg('ws_mode') ;
    await simcore_init_hw(ws_mode) ;
    wepsim_web_register_components();
}
catch (err)
{
    console.error('WepSIM init error:', err.message);
}
