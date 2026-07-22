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
import $ from 'jquery';
import { ws_uielto, register_uielto } from './wepsim_uielto.js';
import { simcore_init, simcore_welcome } from '../sim_core/sim_api_core.js';
import { upgrade_cfg } from '../sim_core/sim_cfg.js';
import { wepsim_example_reset } from '../wepsim_core/wepsim_example.js';
import { wepsim_general_exception_handler, wepsim_init_default, wepsim_init_ui } from './wepsim_web_simulator.js';

/*
         *  Simulation main
         */

/* jshint esversion: 6 */
export class ws_web_main extends ws_uielto
{
    // constructor
    constructor ()
    {
        // parent
        super();
    }

    // render
    render (event_name)
    {
        // initialize render elements...
        super.render() ;

        // render current element
        this.render_skel() ;
        this.render_populate(event_name) ;
    }

    render_skel ()
    {
        // make HTML code
        var o1 = '<h2>ws-web-main:<br>' +
            '<li>Valid values for the "layout" attribute are: classic or compact</li>' +
            '</h2>' ;

        // load HTML
        this.innerHTML = o1 ;
    }

    render_populate (event_name)
    {
        // get layout value
        var ly = 'classic' ;
        if (this.layout != null)
        {
            ly = this.layout.trim() ;
        }

        // make HTML code
        var o1 = '' ;

        if ('classic' == ly)
        {
            o1 += '<ws-topbar style="flex-shrink:0"></ws-topbar>' +
                '<ws-screen-classic style="flex:1;min-height:0;overflow:auto"></ws-screen-classic>' +
                '<ws-recordbar style="flex-shrink:0"></ws-recordbar>' ;
        }
        if ('compact' == ly)
        {
            o1 += '<ws-topbar style="flex-shrink:0"></ws-topbar>' +
                '<ws-screen-compact style="flex:1;min-height:0;overflow:auto"></ws-screen-compact>' +
                '<ws-recordbar style="flex-shrink:0"></ws-recordbar>' ;
        }

        // load HTML
        this.innerHTML = o1 ;

        // (if empty HTML then return)
        if ('' == o1)
        {
            this.render_skel() ;
            return ;
        }

        // initialization only on "connectedCallback"
        if ('connectedCallback' != event_name)
        {
            return ;
        }

        // ...and full initialization after jquery-ready
        $(document).ready(async function()
        {
            // try
            // {
            await wepsim_init_ui() ;
            wepsim_example_reset() ;
            await wepsim_init_default() ;
            // }
            // catch(err)
            // {
            // wepsim_general_exception_handler(err) ;
            // }
        }) ;
    }
}

