/*
 *  Copyright 2015-2020 Felix Garcia Carballeira, Alejandro Calderon Mateos, Javier Prieto Cepeda, Saul Alonso Monsalve
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
         * Memory (configuration)
         */

        /* jshint esversion: 6 */
        class ws_mem_config extends HTMLElement
        {
	      constructor ()
	      {
		    // parent
		    super();
	      }

	      render ( msg_default )
	      {
		    // html holder
		    var o1 = "<div id='config_MP' style='height:58vh; width: inherit; overflow-y: auto;' " +
			     "     class='container container-fluid'>" +
		             "<div class='container-fluid'>" +
			     "<div class='row'>" +
		             "<div class='col-12' style='padding:0 0 10 0;'>" +
			     "<div class='card bg-light'>" +
			     "<div class='card-body p-0' id='mempanel'>" +
			     "<table class='table table-hover table-sm table-bordered' " +
			     "       style='margin:0'>" +
			     "<tbody class='no-ui-mini'>" +
			     "<tr><td align=center'>Wait cycles (<b>0</b> - &infin;)</td>" +
			     "    <td align=center'>" +
			     "<div id='mp_wc'>" +
			     "<input type=number data-bind='value: simhw_internalState(\"MP_wc\")' min='0' max='99999999'>" +
			     "</div>" +
			     "    </td></tr>" +
			     "</tbody>" +
			     "</table>" +
			     "</div>" +
			     "</div>" +
			     "</div>" +
			     "</div>" ;

		    this.innerHTML = o1 ;

		    // knockout binding
		    simhw_internalState_reset('MP_wc', ko_observable(0)) ;
		    var ko_context = document.getElementById('mp_wc');
		    ko.applyBindings(simhw_internalState('MP_wc'), ko_context);
	      }

	      connectedCallback ()
	      {
		    this.render('') ;
	      }
        }

        if (typeof window !== "undefined")
            window.customElements.define('ws-mem-config', ws_mem_config) ;
