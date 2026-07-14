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

import fs from 'fs';
import { performance } from 'perf_hooks';
import clear from 'clear';
import yargs from 'yargs';
import { wepsim_nodejs_regiter_action, wepsim_nodejs_doAction, wepsim_nodejs_loadCheckpoint } from './wepsim_node_action.js';

var ws_cl_ver = 'WepSIM-cl v2.0.2' ;

function ws_header ()
{
     var o = '\n' +
            ws_cl_ver + '\n' +
            '> WepSIM simulator interface for command line.\n' +
            '\n' ;

     return o ;
}

function ws_help_usage ()
{
    var o = ws_header() ;

    o += 'For more details please use:\n' +
         ' ./wepsim.sh -h\n' +
         '\n' +
         'For common examples please use:\n' +
         ' ./wepsim.sh --examples basic\n' +
         ' ./wepsim.sh --examples help\n' +
         ' ./wepsim.sh --examples checker\n' +
         ' ./wepsim.sh --examples checkpoint\n' +
         ' ./wepsim.sh --examples more\n' +
         ' ./wepsim.sh --examples developers' ;

    return o ;
}

function ws_open_file ( filename )
{
    var ret = {} ;
        ret.data   = '' ;
        ret.status = false ;

    try
    {
        fs.accessSync(filename, fs.constants.R_OK) ;
    }
    catch (err)
    {
        ret.status = false ;
        ret.data   = 'ERROR: file "' + filename + '" doesn\'t exits\n\n' ;
        return ret ;
    }

    ret.data   = fs.readFileSync(filename, 'utf8') ;
    ret.status = true ;
    return ret ;
}

function ws_help_examples_basic ()
{
    var o = ws_header() ;
    o += 'Examples for running some work and show the...:\n' +
         ' * ...final state:\n' +
         '   ./wepsim.sh -a run -m ep -f ./repo/microcode/mips/ep_sig1_base.mc -s ./repo/assembly/mips/s1e1.asm\n' +
         ' * ...modified state on each assembly instruction executed:\n' +
         '   ./wepsim.sh -a stepbystep -m ep -f ./repo/microcode/mips/ep_sig1_base.mc -s ./repo/assembly/mips/s1e1.asm\n' +
         ' * ...modified state on each microinstruction executed:\n' +
         '   ./wepsim.sh -a microstepbymicrostep -m ep -f ./repo/microcode/mips/ep_sig1_base.mc -s ./repo/assembly/mips/s1e1.asm\n' +
         '\n' +
         'In previous examples you can use the "-m ep -f <firmware> -s <assembly>" or some equivalent checkpoint:\n' +
         '   ./wepsim.sh -a run        --checkpoint ./repo/checkpoint/tutorial_1.txt\n' +
         '   ./wepsim.sh -a stepbystep --checkpoint ./repo/checkpoint/tutorial_1.txt\n' +
         '\n' +
         'Example for running in an interactive mode...:\n' +
         '   ./wepsim.sh -a interactive --checkpoint ./repo/checkpoint/tutorial_1.txt\n' +
         '' ;
    return o ;
}

export function ws_main ()
{
    var argv = yargs(process.argv.slice(2))
               .usage(ws_help_usage())
               .option('examples', {
                   alias:    'e',
                   type:     'string',
                   describe: 'basic | more',
                   nargs:    1,
                   demand:   false,
                   default:  ''
                })
               .option('action', {
                   alias:    'a',
                   type:     'string',
                   describe: 'run | stepbystep | microstepbymicrostep | check |' +
                             ' show-console | microstepverbalized | show-binary |' +
                             ' show-record | show-microcode | show-assembly | build-checkpoint',
                   nargs:    1,
                   default:  'usage'
                })
               .option('mode', {
                   alias:    'm',
                   type:     'string',
                   describe: 'ep | poc',
                   nargs:    1,
                   demand:   false,
                   default:  'ep'
                })
               .option('firmware', {
                   alias:    'f',
                   type:     'string',
                   describe: 'Firmware file',
                   nargs:    1,
                   demand:   false,
                   default:  ''
                })
               .option('assembly', {
                   alias:    's',
                   type:     'string',
                   describe: 'Assembly file',
                   nargs:    1,
                   demand:   false,
                   default:  ''
                })
               .option('checkpoint', {
                   alias:    'c',
                   type:     'string',
                   describe: 'Checkpoint file',
                   nargs:    1,
                   demand:   false,
                   default:  ''
                })
               .option('resultok', {
                   alias:    'r',
                   type:     'string',
                   describe: 'OK result file',
                   nargs:    1,
                   demand:   false,
                   default:  ''
                })
               .option('maxi', {
                   type:     'string',
                   describe: 'Maximum number of instructions to be executed',
                   nargs:    1,
                   demand:   false,
                   default:  '1000'
                })
               .option('maxc', {
                   type:     'string',
                   describe: 'Maximum number of clock cycles to be executed',
                   nargs:    1,
                   demand:   false,
                   default:  '1024'
                })
               .option('verbal', {
                   type:     'string',
                   describe: 'text | math',
                   nargs:    1,
                   demand:   false,
                   default:  'text'
                })
               .option('idiom', {
                   type:     'string',
                   describe: 'en | es | it | pt | zh_cn | fr | hi | ja | kr | ru | sv | de',
                   nargs:    1,
                   demand:   false,
                   default:  'en'
                })
               .option('purify', {
                   alias:    'p',
                   type:     'string',
                   describe: 'Filter output',
                   nargs:    1,
                   demand:   false,
                   default:  ''
                })
               .help('h')
               .demandOption(['action'])
               .argv ;


    if ( (argv.examples !== "") || (argv.action === "usage") )
    {
        var o = ws_help_usage() + '\n' ;
        if ("basic" == argv.examples) {
            o = ws_help_examples_basic() ;
        }
        clear() ;
        console.log(o) ;
        return true ;
    }

    try
    {
        if (typeof argv.action.toUpperCase == "undefined")
        {
            console.log(ws_help_usage() + '\n\n' + 'unknown action "' + argv.action + '"\n') ;
            return false ;
        }

        var options = {} ;
        options.instruction_limit = parseInt(argv.maxi) ;
        options.cycles_limit      = parseInt(argv.maxc) ;
        options.verbalize         = (argv.verbal.toUpperCase() == "MATH") ? 'math' : 'text' ;
        options.purify            =  argv.purify ;

        var data = {} ;
        data.mode      = argv.mode ;
        data.action    = argv.action.toUpperCase() ;
        data.firmware  = '' ;
        data.assembly  = '' ;
        data.record    = '' ;
        data.result_ok = '' ;
        data.idiom     = argv.idiom ;

        var ret = {} ;
        ret.status = true ;
        ret.data   = '' ;

        if (argv.checkpoint !== "")
        {
            ret = ws_open_file(argv.checkpoint) ;
            if (ret.status)
            {
                var obj_checkpoint = wepsim_nodejs_loadCheckpoint(ret.data) ;
                data.mode     = obj_checkpoint.mode ;
                data.firmware = obj_checkpoint.firmware ;
                data.assembly = obj_checkpoint.assembly ;
                data.record   = obj_checkpoint.record ;
                data.obj_chk  = obj_checkpoint ;
                data.str_chk  = ret.data ;
            }
        }

        if (argv.firmware !== "")
        {
            ret = ws_open_file(argv.firmware) ;
            if (ret.status) {
                data.firmware = ret.data ;
            }
        }

        if (argv.assembly !== "")
        {
            if (argv.action === "help")
            {
                data.assembly = argv.assembly ;
            }
            else
            {
                ret = ws_open_file(argv.assembly) ;
                if (ret.status) {
                    data.assembly = ret.data ;
                }
            }
        }

        if (argv.resultok !== "")
        {
            ret = ws_open_file(argv.resultok) ;
            if (ret.status) {
                data.result_ok = ret.data ;
            }
        }

        if (ret.status) {
            wepsim_nodejs_regiter_action();
            return wepsim_nodejs_doAction(data, options) ;
        }

        console.log(ws_header() + ret.data) ;
        return false ;
    }
    catch (e)
    {
        console.log(ws_help_usage() + '\n\n' + e.stack + '\n') ;
        return false ;
    }
}
