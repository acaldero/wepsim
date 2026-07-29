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
 *  Memory
 */

import { get_value, set_value, get_var, set_var } from '../../sim_core/sim_core_values.js';
import { get_reference } from '../sim_hw_values.js';
import { get_cfg } from '../../sim_core/sim_cfg.js';
import { show_main_memory } from '../../sim_core/sim_core_ui.js';
import { main_memory_getvalue, main_memory_set, main_memory_get_program_counter, main_memory_extractvalues, main_memory_updatevalues } from '../../sim_core/sim_adt_mainmemory.js';
import { cache_memory_access } from '../../sim_core/sim_adt_cachememory.js';

export function mem_rvpipe_register(sim_p: Simulator): Simulator
{
    const DEBUG             = false;
    sim_p.components.MEMORY = {
        name:      'MEMORY',
        version:   '1',
        abilities: ['MEMORY'],

        // ui: details
        details_name: ['MEMORY', 'MEMORY_CONFIG'],
        details_fire: [['svg_p:text7483'], []],

        // state: write_state, read_state, get_state
        write_state: function (vec: any)
        {
            if (typeof vec.MEMORY == 'undefined')
                vec.MEMORY = {};

            let key: any   = 0;
            let value: any = 0;
            for (const index in sim_p.internal_states.MP)
            {
                value = main_memory_getvalue(sim_p.internal_states.MP,
                                             index);
                if (typeof value === 'undefined') value = 0;
                if (value != 0)
                {
                    key                    = parseInt(index).toString(16);
                    vec.MEMORY['0x' + key] = {
                        'type':          'memory',
                        'default_value': 0x0,
                        'id':            '0x' + key,
                        'op':            '=',
                        'value':         '0x' + value.toString(16),
                    };
                }
            }

            return vec;
        },
        read_state: function (vec, check)
        {
            if (typeof vec.MEMORY == 'undefined')
                vec.MEMORY = {};

            const key = parseInt(check.id).toString(16);
            const val = parseInt(check.value).toString(16);
            if ('MEMORY' == check.type.toUpperCase().trim())
            {
                vec.MEMORY['0x' + key] = {
                    'type':          'memory',
                    'default_value': 0x0,
                    'id':            '0x' + key,
                    'op':            check.condition,
                    'value':         '0x' + val,
                };
                return true;
            }

            return false;
        },
        get_state: function (pos: any)
        {
            const index = parseInt(pos);
            const value = main_memory_getvalue(sim_p.internal_states.MP,
                                               index);
            if (typeof value === 'undefined')
            {
                return null;
            }
            return '0x' + value.toString(16);
        },

        // native: get_value, set_value
        get_value: function (elto: any)
        {
            const value = main_memory_getvalue(sim_p.internal_states.MP,
                                               elto);
            show_main_memory(sim_p.internal_states.MP, elto, false, false);
            return ((value || 0) >>> 0);
        },
        set_value: function (elto, value)
        {
            // PC
            let origin    = '';
            const r_value = main_memory_get_program_counter();
            if (r_value != null)
            {
                origin = 'PC=0x' + r_value.toString(16);
            }

            const melto  = {
                'value':           (value >>> 0),
                'source_tracking': [origin],
                'comments':        null,
            };
            const valref = main_memory_set(sim_p.internal_states.MP,
                                           elto,
                                           melto);

            show_main_memory(sim_p.internal_states.MP,
                             elto,
                             (typeof valref === 'undefined'),
                             true);

            return value;
        },
    };

    /*
     *  Internal States
     */

    sim_p.internal_states.segments = {};
    sim_p.internal_states.MP       = {};
    sim_p.internal_states.MP_wc    = { read: { value: 0 }, write: { value: 0 } };

    sim_p.internal_states.CM_cfg = [];
    sim_p.internal_states.CM     = [];

    /*
     *  States
     */

    /* INSTRUCTION (RELATED) STATES */
    sim_p.states['RDATA'] = {
        name:          'RDATA', verbal:        'Read data form Instruction Memory (Input Instruction Register)',
        visible:       false, nbits:         '32', value:         0, default_value: 0,
        draw_data:     [],
    };

    /* DATA (RELATED) STATES */
    sim_p.states['RDATAM'] = {
        name:          'RDATAM', verbal:        'Read data form Data Memory (Input OUT Register)',
        visible:       false, nbits:         '32', value:         0, default_value: 0,
        draw_data:     [],
    };

    /*
     *  Syntax of behaviors
     */

    sim_p.behaviors.MEM_READ = {
        nparameters: 6,
        types:       ['E', 'E', 'E', 'E', 'E'],
        operation:   function (s_expr: string[]): void
        {
            const addr_val     = get_value(sim_p.states[s_expr[1]]) >>> 0;
            const address: any = '0x' + addr_val.toString(16);
            let dbvalue        = get_value(sim_p.states[s_expr[2]]);
            const bw           = get_value(sim_p.states[s_expr[3]]);
            const se           = get_value(sim_p.states[s_expr[4]]);
            const clk          = get_value(sim_p.states[s_expr[5]]);
            if (DEBUG) console.log(s_expr, 'address', address, 'dbvalue', dbvalue, 'bw', bw, 'se', se, 'clk', clk);

            let remain = get_value(sim_p.internal_states.MP_wc.read);
            if (
                (typeof sim_p.events.mem[clk - 1] != 'undefined') &&
                (sim_p.events.mem[clk - 1] > 0)
            )
            {
                remain = sim_p.events.mem[clk - 1] - 1;
            }
            const first_time      = typeof sim_p.events.mem[clk] == 'undefined';
            sim_p.events.mem[clk] = remain;
            if (remain > 0)
            {
                return;
            }

            const align_address = addr_val & 0xFFFFFFFC;
            if (DEBUG) console.log('MEM_READ: aligned address=0x' + address.toString(16));
            let value       = main_memory_getvalue(sim_p.internal_states.MP,
                                                   align_address);
            let full_redraw = false;
            if (typeof value === 'undefined')
            {
                value       = 0;
                full_redraw = true;
                if (DEBUG) console.log('MEM_READ: address 0x' + address.toString(16) + ' undefined, default 0');
            }

            // BW -> See Tables in Help
            // 0 -> byte
            // 1 -> half
            // 2 -> 3-bytes
            // 3 -> word
            dbvalue = main_memory_extractvalues(value, bw, (address & 0x00000003), se);

            if (DEBUG) console.log('MEM_READ: result=0x' + (dbvalue >>> 0).toString(16) + ' bw=' + bw);
            set_value(sim_p.states[s_expr[2]], dbvalue >>> 0);
            show_main_memory(sim_p.internal_states.MP, address, full_redraw, false);

            // cache
            if (first_time)
            {
                for (let i = 0; i < sim_p.internal_states.CM.length; i++)
                {
                    if (1 == get_var(sim_p.internal_states.CM[i].cfg.level))
                    {
                        if (DEBUG) console.log('MEM_READ: cache[' + i + '] read addr=0x' + address.toString(16));
                        cache_memory_access(sim_p.internal_states.CM[i], address, 'read', clk);
                    }
                }
            }
        },
        verbal: function (s_expr: string[]): string
        {
            let verbal = '';

            const address = '0x' + get_value(sim_p.states[s_expr[1]]).toString(16);
            const dbvalue = get_value(sim_p.states[s_expr[2]]);
            const bw      = get_value(sim_p.states[s_expr[3]]);
            const clk     = get_value(sim_p.states[s_expr[4]]);

            let bw_type = 'word';
            if (bw == 1)
                bw_type = 'byte';
            else if (bw == 2)
                bw_type = 'half';

            let value = main_memory_getvalue(sim_p.internal_states.MP,
                                             address);
            if (typeof value === 'undefined')
                value = 0;

            const verbose = get_cfg('verbal_verbose');
            if (verbose !== 'math')
            {
                verbal = 'Try to read a ' + bw_type + ' from memory ' +
                    'at address ' + address + ' with value 0x' + value.toString(16) + '. ';
            }

            verbal = 'Memory output = 0x' + value.toString(16) +
                ' (Read a ' + bw_type + ' from ' + address + '). ';

            return verbal;
        },
    };

    sim_p.behaviors.MEM_WRITE = {
        nparameters: 6,
        types:       ['E', 'E', 'E', 'E', 'E'],
        operation:   function (s_expr: string[]): void
        {
            const addr_val   = get_value(sim_p.states[s_expr[1]]) >>> 0;
            let address: any = '0x' + addr_val.toString(16);
            const dbvalue    = get_value(sim_p.states[s_expr[2]]);
            const bw         = get_value(sim_p.states[s_expr[3]]);
            const se         = get_value(sim_p.states[s_expr[4]]);
            const clk        = get_value(sim_p.states[s_expr[5]]);
            if (DEBUG) console.log(s_expr, 'address', address, 'dbvalue', dbvalue, 'bw', bw, 'clk', clk);

            let remain = get_value(sim_p.internal_states.MP_wc.write);
            if (
                (typeof sim_p.events.mem[clk - 1] != 'undefined') &&
                (sim_p.events.mem[clk - 1] > 0)
            )
            {
                remain = sim_p.events.mem[clk - 1] - 1;
            }
            const first_time      = typeof sim_p.events.mem[clk] == 'undefined';
            sim_p.events.mem[clk] = remain;
            if (remain > 0)
            {
                return;
            }

            address = addr_val & 0xFFFFFFFC;
            if (DEBUG) console.log('MEM_WRITE: aligned address=0x' + address.toString(16) + ' dbvalue=0x' + (dbvalue >>> 0).toString(16) + ' bw=' + bw);
            let value       = main_memory_getvalue(sim_p.internal_states.MP,
                                                   address) ?? 0;
            let full_redraw = false;
            if (typeof value === 'undefined')
            {
                value       = 0;
                full_redraw = true;
                if (DEBUG) console.log('MEM_WRITE: address 0x' + address.toString(16) + ' undefined, default 0');
            }

            // BW -> See Tables in Help
            // 0 -> byte
            // 1 -> half
            // 2 -> 3-bytes
            // 3 -> word
            value = main_memory_updatevalues(value, dbvalue, bw, (addr_val & 0x00000003));

            // PC
            let origin    = '';
            const r_value = main_memory_get_program_counter();
            if (r_value != null)
            {
                origin = 'PC=0x' + r_value.toString(16);
            }

            // set memory value+source
            const melto  = {
                'value':           (value >>> 0),
                'source_tracking': [origin],
                'comments':        null,
            };
            const valref = main_memory_set(sim_p.internal_states.MP,
                                           address,
                                           melto);
            if (DEBUG) console.log('MEM_WRITE: set addr=0x' + address.toString(16) + ' value=0x' + (value >>> 0).toString(16) + ' origin=' + origin);

            show_main_memory(sim_p.internal_states.MP, address, full_redraw, true);

            // cache
            if (first_time)
            {
                for (let i = 0; i < sim_p.internal_states.CM.length; i++)
                {
                    if (1 == get_var(sim_p.internal_states.CM[i].cfg.level))
                    {
                        if (DEBUG) console.log('MEM_WRITE: cache[' + i + '] write addr=0x' + address.toString(16));
                        cache_memory_access(sim_p.internal_states.CM[i], address, 'write', clk);
                    }
                }
            }
        },
        verbal: function (s_expr: string[]): string
        {
            let verbal = '';

            const address = '0x' + get_value(sim_p.states[s_expr[1]]).toString(16);
            const dbvalue = get_value(sim_p.states[s_expr[2]]);
            const bw      = get_value(sim_p.states[s_expr[3]]);
            const clk     = get_value(sim_p.states[s_expr[4]]);

            let bw_type = 'word';
            if (bw == 0)
                bw_type = 'byte';
            else if (bw == 1)
                bw_type = 'half';
            else if (bw == 2)
                bw_type = '3-bytes';

            let value = main_memory_getvalue(sim_p.internal_states.MP,
                                             address);
            if (typeof value === 'undefined')
                value = 0;

            const verbose = get_cfg('verbal_verbose');
            if (verbose !== 'math')
            {
                verbal = 'Try to write a ' + bw_type + ' to memory ' +
                    'at address ' + address + ' with value ' + value.toString(16) + '. ';
            }

            verbal = 'Memory[' + address + '] = ' + '0x' + value.toString(16) +
                ' (Write a ' + bw_type + ' to ' + address + '). ';

            return verbal;
        },
    };

    sim_p.behaviors.MEMORY_RESET = {
        nparameters: 1,
        operation:   function (s_expr: string[]): void
        {
            if (DEBUG) console.log(s_expr);
            // reset events.mem
            sim_p.events.mem = {};
        },
        verbal: function (s_expr: string[]): string
        {
            return 'Reset main memory (all values will be zeroes). ';
        },
    };

    /*
     *  Model (see docs/WEPSIM-TEAM.md)
     */

    sim_p.elements.memory = {
        name:        'Main memory',
        description: 'Main memory subsystem',
        type:        'subcomponent',
        belongs:     'MEMORY',
        states:      {
            'addr': {
                ref: 'M3_ALU',
            },
            'wdata': {
                ref: 'REG_OUT',
            },
            'rdata': {
                ref: 'RDATAM',
            },
        },
        signals: {
            'wbe': {
                ref: 'WBE',
            },
            'dmr': {
                ref: 'DMR',
            },
            'dmw': {
                ref: 'DMW',
            },
        },
        states_inputs:  ['addr', 'wdata'],
        states_outputs: ['rdata'],
        signals_inputs: ['wbe', 'dmr', 'dmw'],
        signals_output: [],
        states_mapping: [],
    };

    return sim_p;
}

