import './web.css';

import $ from 'jquery';
window.$ = window.jQuery = $;

// Bootstrap: must load before web-main so its DOMContentLoaded listener
// (which registers jQuery plugins like $.fn.carousel) fires before
// jQuery's ready() callbacks registered by web-main/wepsim_uiscreen_main.
const bootstrapMod = await import('bootstrap');
// Workaround: Rolldown/Vite 8 optimizer drops Bootstrap's internal
// onDOMContentLoaded → getjQuery → $.fn registration chain.
// Manually register jQuery plugins from the module exports.
for (const name of Object.keys(bootstrapMod)) {
    const Plugin = bootstrapMod[name];
    if (typeof Plugin === 'function' && Plugin.NAME && Plugin.jQueryInterface) {
        $.fn[Plugin.NAME] = Plugin.jQueryInterface;
        $.fn[Plugin.NAME].Constructor = Plugin;
        $.fn[Plugin.NAME].noConflict = () => {
            $.fn[Plugin.NAME] = Plugin.jQueryInterface;
            return Plugin.jQueryInterface;
        };
    }
}

// bootstrap-tokenfield UMD uses `global` (Node global), not defined in browser
window.global = window;
await import('bootstrap-tokenfield');

await import('dropify');

// Main app — static import would hoist before bootstrap, breaking ordering
await import('./web-main.js');

// UI init
$(document).ready(function () {
    $("#ws_loader").hide();
});

import {wepsim_init_PWA, wepsim_init_firefoxOS} from '../../wepsim_web/wepsim_web_simulator.js'
import {simcore_sound_init} from '../../sim_core/sim_core_sound.js'

if (typeof wepsim_init_PWA === 'function')
{
    // Skip PWA init in dev: service worker file doesn't exist in the dev server
    if (!import.meta.env?.DEV)
        wepsim_init_PWA();
}
if (typeof wepsim_init_firefoxOS === 'function')
    wepsim_init_firefoxOS();
if (typeof simcore_sound_init === 'function')
    simcore_sound_init();
