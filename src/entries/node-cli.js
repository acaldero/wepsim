// WepSIM Node.js CLI entry

// polyfill localStorage for Node.js
if (typeof localStorage === 'undefined' || localStorage === null)
{
    var store = {};
    globalThis.localStorage = {
        getItem: function (key)
        {
            return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
        },
        setItem: function (key, value)
        {
            store[key] = String(value);
        },
        removeItem: function (key)
        {
            delete store[key];
        },
        clear: function ()
        {
            store = {};
        },
        length: 0,
        key:    function ()
        {
            return null;
        },
    };
}

// WepSIM web entry — bootstrap
import { sim_hw_register_hw } from '../../sim_hw/sim_hw_register_hw.js';
import { simcore_init } from '../../sim_core/sim_api_core.js';
import { upgrade_cfg } from '../../sim_core/sim_cfg.js';
import { wepsim_register_core } from '../../wepsim_core/wepsim_register_core.js';
import { i18n_init } from '../../wepsim_i18n/i18n.js';

i18n_init();
sim_hw_register_hw();
wepsim_register_core();
try
{
    simcore_init(true);
    upgrade_cfg();
}
catch (err)
{
    console.error('WepSIM init error:', err.message);
}

// Run CLI
import { ws_main } from '../../wepsim_nodejs/wepsim_node_cli.mjs';

ws_main();
