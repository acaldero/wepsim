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
 *  LEDM (rvpipe style)
 */

import { get_value, set_value, get_var, set_var } from '../../sim_core/sim_core_values.js';
import { simhw_internalState_get, simhw_sim_signal, simhw_sim_state } from '../sim_hw_index.js';
import { signal_apply_behaviour } from '../sim_hw_signal.js';
import { colors_clone, simcoreui_pack } from '../../sim_core/sim_core_ui.js';
import { simcore_native_get_value } from '../../sim_core/sim_api_native.js';
import { simcore_rest_call } from '../../sim_core/sim_core_rest.js';

const IO_LEDM_SR_ID = 0x3100;
const IO_LEDM_CR_ID = 0x3104;
const IO_LEDM_DR_ID = 0x3108;

export function io_ldm_rvpipe_register(sim_p: Simulator): Simulator
{
    const DEBUG              = false;
    sim_p.components['LEDM'] = {
        name:      'LEDM',
        version:   '1',
        abilities: ['LEDMATRIX'],

        details_name: ['LEDMATRIX'],
        details_fire: [[]],

        write_state: function (vec: any): any
        {
            return vec;
        },
        read_state: function (vec: any, check: any): boolean
        {
            return false;
        },
        get_state: function (reg: string): string | null
        {
            return null;
        },

        get_value: function (elto: any): number
        {
            const associated_state = simhw_internalState_get('io_hash', elto);
            if (typeof associated_state == 'undefined')
            {
                throw new Error('unknown element named ' + elto);
            }
            let value = (get_value(simhw_sim_state(associated_state)) >>> 0);

            set_value(simhw_sim_state('BUS_AB'), elto);
            set_value(simhw_sim_signal('IOR'), 1);
            signal_apply_behaviour('IOR');
            value = get_value(simhw_sim_state('BUS_DB'));

            return value;
        },
        set_value: function (elto: any, value: number): number
        {
            const associated_state = simhw_internalState_get('io_hash', elto);
            if (typeof associated_state == 'undefined')
            {
                throw new Error('unknown element named ' + elto);
            }
            set_value(simhw_sim_state(associated_state), value);

            set_value(simhw_sim_state('BUS_AB'), elto);
            set_value(simhw_sim_state('BUS_DB'), value);
            set_value(simhw_sim_signal('IOW'), 1);
            signal_apply_behaviour('IOW');

            return value;
        },
    };

    /*
     *  States - LEDM parameters
     */

    sim_p.internal_states.ledm_dim    = 24;
    sim_p.internal_states.ledm_neltos = Math.pow(sim_p.internal_states.ledm_dim, 2);
    sim_p.internal_states.ledm_state  = Array.from({ length: sim_p.internal_states.ledm_neltos }, () => ({ color: { value: 0 } }));
    sim_p.internal_states.ledm_colors = colors_clone('');
    sim_p.internal_states.ledm_frame  = '0'.repeat(sim_p.internal_states.ledm_neltos);
    sim_p.internal_states.ledm_sync   = false;

    sim_p.internal_states.io_hash[IO_LEDM_SR_ID] = 'LEDMSR';
    sim_p.internal_states.io_hash[IO_LEDM_CR_ID] = 'LEDMCR';
    sim_p.internal_states.io_hash[IO_LEDM_DR_ID] = 'LEDMDR';

    /*
     *  States
     */

    sim_p.states['LEDMSR'] = {
        name:          'LEDMSR', verbal:        'LEDM State Register',
        visible:       false, nbits:         '32', value:         0, default_value: 0,
        draw_data:     [],
    };
    sim_p.states['LEDMCR'] = {
        name:          'LEDMCR', verbal:        'LEDM Control Register',
        visible:       false, nbits:         '32', value:         0, default_value: 0,
        draw_data:     [],
    };
    sim_p.states['LEDMDR'] = {
        name:          'LEDMDR', verbal:        'LEDM Data Register',
        visible:       false, nbits:         '32', value:         0, default_value: 0,
        draw_data:     [],
    };

    /*
     *  Behaviors
     */

    sim_p.behaviors['LEDM_IOR'] = {
        nparameters: 7,
        types:       ['E', 'E', 'E', 'E', 'E', 'E'],
        operation:   function (s_expr: string[]): void
        {
            const bus_ab = get_value(sim_p.states[s_expr[1]]);
            const iocr   = get_value(sim_p.states[s_expr[4]]);
            const iodr   = get_value(sim_p.states[s_expr[5]]);

            if (bus_ab == IO_LEDM_CR_ID)
            {
                set_value(sim_p.states[s_expr[2]], iocr);
            }
            if (bus_ab == IO_LEDM_DR_ID)
            {
                set_value(sim_p.states[s_expr[2]], iodr);
            }
            if (bus_ab == IO_LEDM_SR_ID)
            {
                const x = (iodr & 0xFF000000) >>> 24;
                const y = (iodr & 0x00FF0000) >>> 16;

                const p = y * sim_p.internal_states.ledm_dim + x;
                const s = get_var(sim_p.internal_states.ledm_state[p].color);
                set_value(sim_p.states[s_expr[2]], s);
            }
        },
        verbal: function (s_expr: string[]): string
        {
            const bus_ab = get_value(sim_p.states[s_expr[1]]);
            const iosr   = get_value(sim_p.states[s_expr[3]]);
            const iocr   = get_value(sim_p.states[s_expr[4]]);
            const iodr   = get_value(sim_p.states[s_expr[5]]);
            if (bus_ab == IO_LEDM_SR_ID)
                return 'I/O device read at LEDMSR of value ' + iosr + '. ';
            if (bus_ab == IO_LEDM_CR_ID)
                return 'I/O device read at LEDMCR of value ' + iocr + '. ';
            if (bus_ab == IO_LEDM_DR_ID)
                return 'I/O device read at LEDMDR of value ' + iodr + '. ';
            return '';
        },
    };

    sim_p.behaviors['LEDM_IOW'] = {
        nparameters: 7,
        types:       ['E', 'E', 'E', 'E', 'E', 'E'],
        operation:   function (s_expr: string[]): void
        {
            const bus_ab = get_value(sim_p.states[s_expr[1]]);
            const bus_db = get_value(sim_p.states[s_expr[2]]);

            // update register...
            switch (bus_ab)
            {
                case IO_LEDM_SR_ID:
                    set_value(sim_p.states[s_expr[3]], bus_db);
                    break;
                case IO_LEDM_DR_ID:
                    set_value(sim_p.states[s_expr[5]], bus_db);
                    break;
                case IO_LEDM_CR_ID:
                    set_value(sim_p.states[s_expr[4]], bus_db);
                    break;
                default:
                    break;
            }

            // if command issued then ...
            if (IO_LEDM_CR_ID == bus_ab)
            {
                // apply command over data register and status register values
                const dr = get_value(sim_p.states[s_expr[5]]);
                const sr = get_value(sim_p.states[s_expr[3]]);

                // 0x10 -> set pixel
                if (0x10 & bus_db)
                {
                    const x = (dr & 0xFF000000) >>> 24;
                    const y = (dr & 0x00FF0000) >>> 16;
                    const s = (dr & 0x000000FF);

                    set_value(sim_p.states[s_expr[3]], 1);
                    if ((x >= sim_p.internal_states.ledm_dim) &&
                        (y >= sim_p.internal_states.ledm_dim))
                    {
                        set_value(sim_p.states[s_expr[3]], -1);
                        return;
                    }

                    // update internal state
                    const p = y * sim_p.internal_states.ledm_dim + x;
                    set_var(sim_p.internal_states.ledm_state[p].color, s);

                    sim_p.internal_states.ledm_sync = false;
                }

                // 0x20 -> DMA
                if (0x20 & bus_db)
                {
                    set_value(sim_p.states[s_expr[3]], 1);

                    // update internal states
                    const neltos = sim_p.internal_states.ledm_neltos;
                    for (let p = 0; p < neltos; p = p + 4)
                    {
                        const s = simcore_native_get_value('MEMORY', dr + p);
                        set_var(sim_p.internal_states.ledm_state[p + 0].color, (s & 0x000000FF) >>> 0);
                        set_var(sim_p.internal_states.ledm_state[p + 1].color, (s & 0x0000FF00) >>> 8);
                        set_var(sim_p.internal_states.ledm_state[p + 2].color, (s & 0x00FF0000) >>> 16);
                        set_var(sim_p.internal_states.ledm_state[p + 3].color, (s & 0xFF000000) >>> 24);
                    }

                    sim_p.internal_states.ledm_sync = false;
                }

                // 0x40 -> DMA colors
                if (0x40 & bus_db)
                {
                    set_value(sim_p.states[s_expr[3]], 1);

                    // update internal colors
                    let c       = '';
                    let neltos2 = sim_p.internal_states.ledm_colors.length;
                    for (let p = 0; p < neltos2; p++)
                    {
                        const s  = simcore_native_get_value('MEMORY', dr + p * 4);
                        const sv = (s & 0xFFFFFF00) >>> 8;
                        const s2 = sv.toString(16);
                        c        = '#' + simcoreui_pack(s2, 6);

                        sim_p.internal_states.ledm_colors[p] = c;
                    }

                    // update internal states
                    neltos2 = sim_p.internal_states.ledm_neltos;
                    for (let p = 0; p < neltos2; p++)
                    {
                        const s = get_var(sim_p.internal_states.ledm_state[p].color);
                        set_var(sim_p.internal_states.ledm_state[p].color, ~s);
                        set_var(sim_p.internal_states.ledm_state[p].color, s);
                    }

                    sim_p.internal_states.ledm_sync = false;
                }

                // 0x80 -> DMA for limited number of rows
                if (0x80 & bus_db)
                {
                    set_value(sim_p.states[s_expr[3]], 1);

                    // update internal states
                    let nrows = sr;
                    if (nrows > sim_p.internal_states.ledm_dim)
                    {
                        nrows = sim_p.internal_states.ledm_dim;
                    }
                    const neltos3 = nrows * sim_p.internal_states.ledm_dim;

                    for (let p = 0; p < neltos3; p = p + 4)
                    {
                        const s = simcore_native_get_value('MEMORY', dr + p);

                        set_var(sim_p.internal_states.ledm_state[p + 0].color, (s & 0x000000FF) >>> 0);
                        set_var(sim_p.internal_states.ledm_state[p + 1].color, (s & 0x0000FF00) >>> 8);
                        set_var(sim_p.internal_states.ledm_state[p + 2].color, (s & 0x00FF0000) >>> 16);
                        set_var(sim_p.internal_states.ledm_state[p + 3].color, (s & 0xFF000000) >>> 24);
                    }

                    sim_p.internal_states.ledm_sync = false;
                }
            }

            // sync: internal state -> frame in REST
            if (!sim_p.internal_states.ledm_sync)
            {
                const ledmstates = sim_p.internal_states.ledm_state;
                let o            = '';
                const n          = sim_p.internal_states.ledm_dim;
                for (let j = 0; j < n; j++)
                {
                    for (let k = 0; k < n; k++)
                    {
                        const p3 = j * sim_p.internal_states.ledm_dim + k;
                        o        = o + get_var(ledmstates[p3].color).toString(16);
                    }
                }

                if (sim_p.internal_states.ledm_frame != o)
                {
                    sim_p.internal_states.ledm_frame = o;
                    simcore_rest_call('LEDM', 'POST', '/', { 'frame': o });
                }

                sim_p.internal_states.ledm_sync = true;
            }
        },
        verbal: function (s_expr: string[]): string
        {
            const bus_ab = get_value(sim_p.states[s_expr[1]]);
            const bus_db = get_value(sim_p.states[s_expr[2]]);
            switch (bus_ab)
            {
                case IO_LEDM_SR_ID:
                    return 'I/O device write at LEDMSR with value ' + bus_db + '. ';
                case IO_LEDM_DR_ID:
                    return 'I/O device write at LEDMDR with value ' + bus_db + '. ';
                case IO_LEDM_CR_ID:
                {
                    const dr = get_value(sim_p.states[s_expr[5]]);
                    if (0x10 & bus_db)
                    {
                        const x = (dr & 0xFF000000) >>> 24;
                        const y = (dr & 0x00FF0000) >>> 16;
                        const s = (dr & 0x000000FF);
                        return 'I/O device write at LEDMCR with value ' + bus_db + ' (set pixel x:' + x + ', y:' + y + ', with color:' + s + '). ';
                    }
                    if (0x20 & bus_db)
                        return '';
                    if (0x40 & bus_db)
                        return 'I/O device write at LEDMCR with value ' + bus_db + ' (set color palette at:' + bus_db + '). ';
                    if (0x80 & bus_db)
                        return '';
                    return 'I/O device write at LEDMCR with value ' + bus_db + '. ';
                }
                default:
                    return '';
            }
        },
    };

    sim_p.behaviors['LEDM_RESET'] = {
        nparameters: 1,
        operation:   function (): void
        {
            if (DEBUG) console.log('[LEDM_RESET] reset');
            sim_p.events.ledm = {};

            sim_p.internal_states.ledm_colors = colors_clone('');
            for (let i = 0; i < sim_p.internal_states.ledm_state.length; i++)
            {
                set_var(sim_p.internal_states.ledm_state[i].color, 1);
                set_var(sim_p.internal_states.ledm_state[i].color, 0);
            }

            const n                          = Math.pow(sim_p.internal_states.ledm_dim, 2);
            const o                          = '0'.repeat(n);
            sim_p.internal_states.ledm_frame = o;
            simcore_rest_call('LEDM', 'POST', '/', { 'frame': o });

            sim_p.internal_states.ledm_sync = false;
        },
        verbal: function (): string
        {
            return 'Reset the I/O device. ';
        },
    };

    /*
     *  Element
     */

    sim_p.elements['ledm'] = {
        name:        'LEDM',
        description: 'LED Matrix',
        type:        'subcomponent',
        belongs:     'LEDM',
        states:      {
            'addr':      { ref: 'BUS_AB' },
            'data':      { ref: 'BUS_DB' },
            'control 1': { ref: IO_LEDM_CR_ID },
            'data 1':    { ref: IO_LEDM_DR_ID },
            'status 1':  { ref: IO_LEDM_SR_ID },
        },
        signals: {
            'ior': { ref: 'LEDM_IOR' },
            'iow': { ref: 'LEDM_IOW' },
        },
        states_inputs:  ['addr', 'data'],
        states_outputs: ['data'],
        signals_inputs: ['ior', 'iow'],
        signals_output: [],
        states_mapping: ['control 1', 'data 1', 'status 1'],
    };

    return sim_p;
}
