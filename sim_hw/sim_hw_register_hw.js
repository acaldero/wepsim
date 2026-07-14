// Centralized registration of all WepSIM hardware systems
// No more module-level side effects — call registerHardware() during bootstrap

import { sim_hw_register_EP } from './hw_ep.js';
import { sim_hw_register_EP2 } from './hw_ep2.js';
import { sim_hw_register_POC } from './hw_poc.js';
import { sim_hw_register_RV } from './hw_rv.js';
import { sim_hw_register_RVPIPE } from './hw_rvpipe.js';

export function sim_hw_register_hw()
{
    sim_hw_register_EP();
    sim_hw_register_EP2();
    sim_hw_register_POC();
    sim_hw_register_RV();
    sim_hw_register_RVPIPE();
}
