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
         *  I/O device
         */

        class ws_cpu extends HTMLElement
        {
	      constructor ()
	      {
		    // parent
		    super();
	      }

	      render ( msg_default )
	      {
		    // stats holder
		    var o1 = "<div class='col-12'>" +
			     "<table class='table table-hover table-sm table-bordered'>" +
			     "<tr>" +
			     "<td align=center width=50%>Instructions</td>" +
			     "<td align=center width=50%>" +
			     "<div id='ins_context'>" + "<span data-bind='text: value'>&nbsp;</span>" + "</div>" +
			     "</td>" +
			     "</tr>" +
			     "<tr>" +
			     "<td align=center width=50%>CLK ticks</td>" +
			     "<td align=center width=50%>" +
			     "<div id='clk_context'>" + "<span data-bind='text: value'>&nbsp;</span>" + "</div>" +
			     "</td>" +
			     "</tr>" +
			     "</table>" +
			     "</div>" ;

		    this.innerHTML = "<div class='row'>" + o1 + "</div>" ;

		    // knockout binding
		    ko_rebind_state('CLK',      'clk_context') ;
		    ko_rebind_state('DECO_INS', 'ins_context') ;
	      }

	      connectedCallback ()
	      {
		    this.render('') ;
	      }
        }

        window.customElements.define('ws-cpu', ws_cpu);

