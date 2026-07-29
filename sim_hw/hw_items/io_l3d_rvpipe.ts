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
 *  L3D (rvpipe style)
 */

import { get_value, set_value, get_var, set_var } from '../../sim_core/sim_core_values.js';
import { simhw_internalState_get, simhw_sim_signal, simhw_sim_state } from '../sim_hw_index.js';
import { signal_apply_behaviour } from '../sim_hw_signal.js';
import { simcore_rest_call } from '../../sim_core/sim_core_rest.js';

const IO_L3D_SR_ID = 0x2100;
const IO_L3D_CR_ID = 0x2104;
const IO_L3D_DR_ID = 0x2108;

export function io_l3d_rvpipe_register(sim_p: Simulator): Simulator
{
    const DEBUG             = false;
    sim_p.components['L3D'] = {
        name:      'L3D',
        version:   '1',
        abilities: ['3DLED'],

        details_name: ['3DLED'],
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
     *  States - L3D parameters
     */

    sim_p.internal_states.l3d_dim    = 4;
    sim_p.internal_states.l3d_neltos = Math.pow(sim_p.internal_states.l3d_dim, 3);
    sim_p.internal_states.l3d_state  = Array.from({ length: sim_p.internal_states.l3d_neltos }, () => ({ active: { value: false } }));
    sim_p.internal_states.l3d_frame  = '0'.repeat(sim_p.internal_states.l3d_neltos);

    sim_p.internal_states.io_hash[IO_L3D_SR_ID] = 'L3DSR';
    sim_p.internal_states.io_hash[IO_L3D_CR_ID] = 'L3DCR';
    sim_p.internal_states.io_hash[IO_L3D_DR_ID] = 'L3DDR';

    /*
     *  States
     */

    sim_p.states['L3DSR'] = {
        name:          'L3DSR', verbal:        'L3D State Register',
        visible:       false, nbits:         '32', value:         0, default_value: 0,
        draw_data:     [],
    };
    sim_p.states['L3DCR'] = {
        name:          'L3DCR', verbal:        'L3D Control Register',
        visible:       false, nbits:         '32', value:         0, default_value: 0,
        draw_data:     [],
    };
    sim_p.states['L3DDR'] = {
        name:          'L3DDR', verbal:        'L3D Data Register',
        visible:       false, nbits:         '32', value:         0, default_value: 0,
        draw_data:     [],
    };

    /*
     *  Behaviors
     */

    sim_p.behaviors['L3D_IOR'] = {
        nparameters: 7,
        types:       ['E', 'E', 'E', 'E', 'E', 'E'],
        operation:   function (s_expr: string[]): void
        {
            const bus_ab = get_value(sim_p.states[s_expr[1]]);
            const iocr   = get_value(sim_p.states[s_expr[4]]);
            const iodr   = get_value(sim_p.states[s_expr[5]]);

            if (bus_ab == IO_L3D_CR_ID)
            {
                set_value(sim_p.states[s_expr[2]], iocr);
            }
            if (bus_ab == IO_L3D_DR_ID)
            {
                set_value(sim_p.states[s_expr[2]], iodr);
            }
            if (bus_ab == IO_L3D_SR_ID)
            {
                const x = (iodr & 0xFF000000) >>> 24;
                const y = (iodr & 0x00FF0000) >>> 16;
                const z = (iodr & 0x0000FF00) >>> 8;

                const p = z * Math.pow(sim_p.internal_states.l3d_dim, 2) +
                    y * sim_p.internal_states.l3d_dim +
                    x;
                const s = get_var(sim_p.internal_states.l3d_state[p].active);
                set_value(sim_p.states[s_expr[2]], s);
            }
        },
        verbal: function (s_expr: string[]): string
        {
            const bus_ab = get_value(sim_p.states[s_expr[1]]);
            const iosr   = get_value(sim_p.states[s_expr[3]]);
            const iocr   = get_value(sim_p.states[s_expr[4]]);
            const iodr   = get_value(sim_p.states[s_expr[5]]);
            if (bus_ab == IO_L3D_SR_ID)
                return 'I/O device read at L3DSR of value ' + iosr + '. ';
            if (bus_ab == IO_L3D_CR_ID)
                return 'I/O device read at L3DCR of value ' + iocr + '. ';
            if (bus_ab == IO_L3D_DR_ID)
                return 'I/O device read at L3DDR of value ' + iodr + '. ';
            return '';
        },
    };

    sim_p.behaviors['L3D_IOW'] = {
        nparameters: 7,
        types:       ['E', 'E', 'E', 'E', 'E', 'E'],
        operation:   function (s_expr: string[]): void
        {
            const bus_ab = get_value(sim_p.states[s_expr[1]]);
            const bus_db = get_value(sim_p.states[s_expr[2]]);

            if ((bus_ab != IO_L3D_SR_ID) &&
                (bus_ab != IO_L3D_CR_ID) &&
                (bus_ab != IO_L3D_DR_ID))
            {
                return;
            }

            if (bus_ab == IO_L3D_SR_ID)
            {
                set_value(sim_p.states[s_expr[3]], bus_db);
            }
            if (bus_ab == IO_L3D_DR_ID)
            {
                set_value(sim_p.states[s_expr[5]], bus_db);
            }
            if (bus_ab == IO_L3D_CR_ID)
            {
                // update control register
                set_value(sim_p.states[s_expr[4]], bus_db);

                // update internal state
                const x = (bus_db & 0xFF000000) >>> 24;
                const y = (bus_db & 0x00FF0000) >>> 16;
                const z = (bus_db & 0x0000FF00) >>> 8;

                const p = z * Math.pow(sim_p.internal_states.l3d_dim, 2) +
                    y * sim_p.internal_states.l3d_dim +
                    x;
                const s = (bus_db & 0x000000FF) != 0;

                if (typeof sim_p.internal_states.l3d_state[p] != 'undefined')
                {
                    set_value(sim_p.states[s_expr[3]], 1);
                    set_var(sim_p.internal_states.l3d_state[p].active, s);
                }
                else
                {
                    set_value(sim_p.states[s_expr[3]], 0);
                }
            }

            // sync: internal state -> frame in REST
            const l3dstates = sim_p.internal_states.l3d_state;
            let o           = '';
            let p2          = 0;
            const n         = sim_p.internal_states.l3d_dim;
            for (let i = 0; i < n; i++)
            {
                for (let j = 0; j < n; j++)
                {
                    for (let k = 0; k < n; k++)
                    {
                        p2 = k * Math.pow(sim_p.internal_states.l3d_dim, 2) +
                            j * sim_p.internal_states.l3d_dim +
                            i;
                        if (get_var(l3dstates[p2].active))
                            o = o + '1';
                        else o = o + '0';
                    }
                }
            }

            if (sim_p.internal_states.l3d_frame != o)
            {
                sim_p.internal_states.l3d_frame = o;
                simcore_rest_call('L3D', 'POST', '/', { 'frame': o });
            }
        },
        verbal: function (s_expr: string[]): string
        {
            const bus_ab = get_value(sim_p.states[s_expr[1]]);
            const bus_db = get_value(sim_p.states[s_expr[2]]);
            if (bus_ab == IO_L3D_SR_ID)
                return 'I/O device write at L3DSR with value ' + bus_db + '. ';
            if (bus_ab == IO_L3D_CR_ID)
                return 'I/O device write at L3DCR with value ' + bus_db + '. ';
            if (bus_ab == IO_L3D_DR_ID)
                return 'I/O device write at L3DDR with value ' + bus_db + '. ';
            return '';
        },
    };

    sim_p.behaviors['L3D_RESET'] = {
        nparameters: 1,
        operation:   function (): void
        {
            if (DEBUG) console.log('[L3D_RESET] reset');
            sim_p.events.l3d = {};

            const n = sim_p.internal_states.l3d_state.length;
            for (let i = 0; i < n; i++)
            {
                set_var(sim_p.internal_states.l3d_state[i].active, false);
            }

            const n2                        = Math.pow(sim_p.internal_states.l3d_dim, 3);
            const o                         = '0'.repeat(n2);
            sim_p.internal_states.l3d_frame = o;
            simcore_rest_call('L3D', 'POST', '/', { 'frame': o });
        },
        verbal: function (): string
        {
            return 'Reset the I/O device. ';
        },
    };

    /*
     *  Element
     */

    sim_p.elements['l3d'] = {
        name:        'L3D',
        description: '3D Led Cube',
        type:        'subcomponent',
        belongs:     'L3D',
        states:      {
            'addr':      { ref: 'BUS_AB' },
            'data':      { ref: 'BUS_DB' },
            'control 1': { ref: IO_L3D_CR_ID },
            'data 1':    { ref: IO_L3D_DR_ID },
            'status 1':  { ref: IO_L3D_SR_ID },
        },
        signals: {
            'ior': { ref: 'L3D_IOR' },
            'iow': { ref: 'L3D_IOW' },
        },
        states_inputs:  ['addr', 'data'],
        states_outputs: ['data'],
        signals_inputs: ['ior', 'iow'],
        signals_output: [],
        states_mapping: ['control 1', 'data 1', 'status 1'],
    };

    return sim_p;
}
