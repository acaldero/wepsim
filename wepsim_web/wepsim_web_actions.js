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

/*
 *  Centralized action registry for event delegation.
 *
 *  Usage:
 *    import { on, onClick } from './wepsim_web_actions.js';
 *
 *    onClick('exec-run', () => wsweb_execution_run());
 *    on('change', 'cfg-select', (el) => update_cfg(el.dataset.key, el.value));
 *
 *  The base ws_uielto class dispatches events through this registry.
 *  Handlers receive (el, component) where el is the matched element
 *  and component is the host web component instance.
 */

/* jshint esversion: 6 */
const action_registry = new Map() ;

function on (eventType, actionName, handler)
{
    var eventMap = action_registry.get(eventType) ;
    if (!eventMap)
    {
        eventMap = new Map() ;
        action_registry.set(eventType, eventMap) ;
    }

    eventMap.set(actionName, handler) ;
}

export function onClick (actionName, handler)
{
    on('click', actionName, handler) ;
}
export function onChange (actionName, handler)
{
    on('change', actionName, handler) ;
}
export function onKeyup (actionName, handler)
{
    on('keyup', actionName, handler) ;
}
export function onInput (actionName, handler)
{
    on('input', actionName, handler) ;
}

export function off (eventType, actionName)
{
    var eventMap = action_registry.get(eventType) ;
    if (eventMap) eventMap.delete(actionName) ;
}

export function dispatch (eventType, el, component, event)
{
    var action = el.dataset.action ;
    if (!action) return false ;

    var eventMap = action_registry.get(eventType) ;
    if (!eventMap) return false ;

    var handler = eventMap.get(action) ;
    if (handler)
    {
        handler(el, component, event) ;
        return true ;
    }

    return false ;
}

// Fallback: catch clicks on [data-bind="click"] elements outside any component
// (e.g., Bootstrap popovers appended to body). Component-level handlers
// call stopPropagation() on success, so this won't fire for already-handled clicks.
document.addEventListener('click', (e) =>
{
    const el = e.target.closest('[data-bind="click"]');
    if (!el) return;
    e.preventDefault();
    if (dispatch('click', el, null, e)) e.stopImmediatePropagation();
});
document.addEventListener('change', (e) =>
{
    const el = e.target.closest('[data-bind="change"]');
    if (!el) return;
    e.preventDefault();
    if (dispatch('change', el, null, e)) e.stopPropagation();
});
