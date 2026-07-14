// WepSIM web entry — bootstrap

import { wepsim_web_register_components } from '../../wepsim_web/wepsim_web_register_elements.js';
import { sim_hw_register_hw } from '../../sim_hw/sim_hw_register_hw.js';
import { simcore_init } from '../../sim_core/sim_api_core.js';
import { upgrade_cfg } from '../../sim_core/sim_cfg.js';
import { wepsim_register_core } from '../../wepsim_core/wepsim_register_core.js';
import { i18n_init } from '../../wepsim_i18n/i18n.js';

i18n_init();
sim_hw_register_hw();
wepsim_register_core();
wepsim_web_register_components();
try
{
    simcore_init(true);
    upgrade_cfg();
}
catch (err)
{
    console.error('WepSIM init error:', err.message);
}
