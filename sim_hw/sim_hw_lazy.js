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

import { board_base_register } from './hw_items/board_base.js';

/*
 *  Lazy processor registry.
 *  Each processor is dynamically imported only when first selected.
 */

var processorRegistry = {
    'ep': () => import('./hw_ep.js').then((m) =>
    {
        board_base_register(m.sim_hw_get_def());
        m.sim_hw_register_EP();
    }),
    'ep2': () => import('./hw_ep2.js').then((m) =>
    {
        board_base_register(m.sim_hw_get_def());
        m.sim_hw_register_EP2();
    }),
    'poc': () => import('./hw_poc.js').then((m) =>
    {
        board_base_register(m.sim_hw_get_def());
        m.sim_hw_register_POC();
    }),
    'rv': () => import('./hw_rv.js').then((m) =>
    {
        board_base_register(m.sim_hw_get_def());
        m.sim_hw_register_RV();
    }),
    'rvpipe': () => import('./hw_rvpipe.js').then((m) =>
    {
        board_base_register(m.sim_hw_get_def());
        m.sim_hw_register_RVPIPE();
    }),
};

var loaded = new Set();

export function simhw_get_processor_names()
{
    return Object.keys(processorRegistry);
}

export async function simhw_ensure_processor_loaded(name)
{
    if (loaded.has(name)) return true;

    var loader = processorRegistry[name];
    if (typeof loader === 'undefined') return false;

    await loader();
    loaded.add(name);
    return true;
}
