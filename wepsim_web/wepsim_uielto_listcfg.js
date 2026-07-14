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
import { cfgset_getSet, cfgset_load } from '../sim_core/sim_cfg.js';
import { wepsim_notify_success } from '../wepsim_core/wepsim_notify.js';
import { wepsim_uicfg_restore } from './wepsim_web_simulator.js';

        /*
         *  Configuration list
         */

        /* jshint esversion: 6 */
        export class ws_list_cfg extends ws_uielto
        {
              // constructor
	      constructor ()
	      {
		    // parent
		    super();
	      }

              // render
	      render ( event_name )
	      {
                    // initialize render elements...
	            super.render() ;

                    // render current element
		    this.render_skel() ;
		    this.render_populate() ;
	      }

	      render_skel ( )
	      {
                    var o1  = '' ;

                    // build HTML
		    o1 += '<div class="card border-secondary h-100">' +
			  '<div class="card-header border-secondary text-white bg-secondary p-1 text-center">' +
			  '<h5 class="py-1 m-0">' +
			  '<em class="fas fa-cogs pe-2"></em>' +
                          '<span data-langkey="Configuration">Configuration</span>' +
                          '</h5>' +
			  '</div>' +
			  '<div class="card-body" id="list_cfgs_1"></div>' +
			  '</div>' ;

		    this.innerHTML = o1 ;
	      }

	      render_populate ( )
	      {
                    var o1  = '' ;

                    // check if exists any processor...
		    var e_cfgs = cfgset_getSet() ;
                    if (typeof e_cfgs === "undefined")
                    {
		        $('#list_cfgs_1').html(o1) ;
                        return ;
                    }

                    // build HTML
		    o1 += ' <div class="btn-group-vertical w-100" role="group" aria-label="Configuration">' ;
		    for (var e_cfg in e_cfgs)
                    {
			 o1 += '<button type="button" ' +
			       '    class="text-danger btn border-secondary m-1 btn-block" ' +
			       '    data-bind="click" data-action="cfg-load" ' +
			       '    data-cfg-name="' + e_cfg + '">' +
			       '<span data-langkey="' + e_cfg + '">' + e_cfg + '</span>' +
			       '</button>' ;
		    }
		    o1 += '</div>' ;

		    $('#list_cfgs_1').html(o1) ;
	      }

              bindElements ()
              {
                    this.addEventListener('click', (e) => {
                        const el = e.target.closest('[data-bind="click"]');
                        if (!el) return;
                        e.preventDefault();
                        switch (el.dataset.action) {
                            case 'cfg-load':
                                cfgset_load(el.dataset.cfgName);
                                wepsim_notify_success('<strong>INFO</strong>',
                                                     'Configuration loaded!.');
                                wepsim_uicfg_restore();
                                break;
                        }
                    });
              }
        }


