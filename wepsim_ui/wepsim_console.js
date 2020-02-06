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

        class ws_console extends HTMLElement
        {
	      constructor ()
	      {
		    // parent
		    super();
	      }

	      render ( msg_default )
	      {
		    var o1 = '<label class="my-0" for="kdb_con" style="min-width:95%">' +
			     '   <img alt="monitor" height="55" src="images/monitor2.png" />' +
			     '</label>' +
			     '<textarea aria-label="monitor"' +
			     '          style="width:100%; overflow-y:auto; -webkit-overflow-scrolling: touch; margin:0 0 8 0"' +
			     '          placeholder="WepSIM" id="kdb_con" rows="8" readonly></textarea>' +
                             '' +
                             '<label class="my-0" for="kdb_key" style="min-width:95%">' +
                             '   <img alt="keyboard" height="35" src="images/keyboard1.png" />' +
                             '</label>' +
                             '<textarea aria-label="keyboard"' +
                             '          style="min-width:100%; overflow-y:auto; -webkit-overflow-scrolling: touch; margin:0 0 0 0"' +
                             '          placeholder="WepSIM" id="kdb_key" rows="2"></textarea>' ;

		    this.innerHTML = o1 ;
	      }

	      connectedCallback ()
	      {
		    this.render('') ;
	      }
        }

        window.customElements.define('ws-console', ws_console);

