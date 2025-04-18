/*
 *  Copyright 2015-2025 Felix Garcia Carballeira, Alejandro Calderon Mateos, Javier Prieto Cepeda, Saul Alonso Monsalve
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
         *  Load link
         */

        /* jshint esversion: 6 */
        class ws_load_link extends HTMLElement
        {
              static get observedAttributes()
	      {
	            return [ 'fid', 'jload' ] ;
	      }

	      constructor ()
	      {
		    // parent
		    super();
	      }

	      update_internal_attributes ( )
	      {
                    // fid
                    var fid = this.getAttribute('fid') ;
                    if (fid === null)
                        this.setAttribute('fid', 'id58') ;

                    // jload
                    var jload = this.getAttribute('jload') ;
                    if (jload === null)
                        this.setAttribute('jload', '') ;
	      }

	      render ( event_name )
	      {
                    // update attributes
                    this.update_internal_attributes() ;

                    // save html
                    var o1 = '' ;
		    o1 += "<div class='card border-secondary h-100'>" +
			  "<div class='card-header border-secondary text-white bg-secondary p-1'>" +
			  " <h5 class='m-0'>" +
			  " <span class='text-white bg-secondary' data-langkey='Input link'>Input link</span>" +
			  " <button class='btn bg-body-tertiary mx-1 float-end py-0 col-auto' " +
                          "         onclick='" + this.jload + "'><span data-langkey='Load'>Load</span></button>" +
			  " </h5>" +
			  "</div>" +
			  "<div class='card-body'>" +
		          'Load from the following link:<br>' +
	                  '<textarea id="' + this.fid + '" class="form-control" ' +
	                  '          row="5" style="height:70%" ' +
                          '></textarea>' +
	                  '<br>' +
			  "</div>" +
			  "</div>" ;

                    this.innerHTML = o1 ;
	      }

	      connectedCallback ()
	      {
		    this.render('connectedCallback') ;
	      }

	      attributeChangedCallback (name, oldValue, newValue)
	      {
		    this.render('attributeChangedCallback') ;
	      }

	      get fid ( )
	      {
                   return this.getAttribute('fid') ;
	      }

	      set fid ( value )
	      {
                   this.setAttribute('fid', value) ;
	      }

	      get jload ( )
	      {
                   return this.getAttribute('jload') ;
	      }

	      set jload ( value )
	      {
                   this.setAttribute('jload', value) ;
	      }
        }

        if (typeof window !== "undefined") {
            window.customElements.define('ws-load-link', ws_load_link) ;
        }

