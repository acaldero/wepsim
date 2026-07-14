/*
 *  Copyright 2015-2026 The WepSIM Team (see docs/WEPSIM-TEAM.md)
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
import { get_cfg } from '../sim_core/sim_cfg.js';
import { i18n_get } from '../wepsim_i18n/i18n.js';
import { wepsim_execute_play, wepsim_execute_stop, wepsim_execute_toggle_play } from '../wepsim_core/wepsim_execute.js';
import { wsweb_execution_instruction, wsweb_execution_microinstruction, wsweb_execution_previous_microinstruction, wsweb_execution_reset, wsweb_execution_run, wsweb_dialog_open } from './wepsim_web_api.js';



        /*
         *  Execution toolbar
         */
        /* jshint esversion: 6 */
        export class ws_executionbar extends ws_uielto
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
                    this.innerHTML = '' ;
	      }

	      render_populate ( )
	      {
                    // render toolbar elements
                    var o1 = '' ;
                    for (var i=0; i<this.components_arr.length; i++)
                    {
                         var name = this.components_arr[i] ;
                         o1 += this.render_btns(name) ;
                    }

                    this.innerHTML = o1 ;
	      }

	      render_btns ( name )
	      {
                    var o = '' ;

                    // load html
                    switch (name)
                    {
                       case "btn_reset":
			     o += '<button id="btn_reset_' + this.name_str + '" ' +
				  '        class="btn bg-secondary-subtle col pb-1 px-1 me-1 border-secondary"' +
		                  '        accesskey="t" ' +
                                  '        data-bind="click" data-action="exec-reset">' ;
                             o += (this.icons_str == 'no') ? ''     : '<em class="fa fa-power-off"></em>' ;
                             o += (this.icons_str == 'up') ? '<br>' : '&nbsp;' ;
			     o += '<span class="fw-bold" data-langkey="Reset">Reset</span>' +
				  '</button>' ;
                                  break ;

                       case "btn_pm":
			     o += '<button id="btn_prev_microinstruction_' + this.name_str + '"' +
		                  '        class="btn bg-secondary-subtle col pb-1 px-1 me-1 border-secondary wsx_microcode wsx_history"' +
		                  '        accesskey="p" ' +
                                  '        data-bind="click" data-action="exec-prev-micro">' ;
                               o += (this.icons_str == 'no') ? ""     : '<em class="fa fa-step-backward"></em>' ;
                               o += (this.icons_str == 'up') ? '<br>' : '&nbsp;' ;
                               o += '<span class="d-none d-sm-inline-flex fw-bold" data-langkey="previousMicroinstruction">&#181;Back</span><span class="d-sm-none fw-bold">&#181;Bk</span>' +
                                    '</button>' ;
                                    break ;

                       case "btn_emins":
			     o += '<button id="btn_next_microinstruction_' + this.name_str + '"' +
		                  '        class="btn bg-secondary-subtle col pb-1 px-1 me-1 border-secondary wsx_microcode"' +
		                  '        accesskey="m" ' +
                                  '        data-bind="click" data-action="exec-next-micro">' ;
                              o += (this.icons_str == 'no') ? ""     : '<em class="fa fa-step-forward"></em>' ;
                              o += (this.icons_str == 'up') ? '<br>' : '&nbsp;' ;
                              o += '<span class="d-none d-sm-inline-flex fw-bold" data-langkey="microInstruction">&#181;Instruction</span><span class="d-sm-none fw-bold">&#181;Instr.</span>' +
                                   '</button>' ;
                                   break ;

                       case "btn_eins":
			     o += '<button id="btn_next_instruction_' + this.name_str + '"' +
		                  '        class="btn bg-secondary-subtle col pb-1 px-1 me-1 border-secondary"' +
		                  '        accesskey="i" ' +
                                  '        data-bind="click" data-action="exec-next-insn">' ;
                              o += (this.icons_str == 'no') ? ""     : '<em class="fa fa-fast-forward"></em>' ;
                              o += (this.icons_str == 'up') ? '<br>' : '&nbsp;' ;
                              o += '<span class="d-none d-sm-inline-flex fw-bold" data-langkey="Instruction">Instruction</span><span class="d-sm-none fw-bold">Instr.</span>' +
                                   '</button>' ;
                                   break ;

                       case "btn_run":
			     o += '<button id="btn_run_stop_' + this.name_str + '"' +
		                  '        class="btn bg-secondary-subtle col pb-1 px-1 me-1 border-secondary"' +
		                  '        accesskey="r" ' +
                                  '        data-bind="click" data-action="exec-run">' ;
                              o += (this.icons_str == 'no') ? ""     : '<em class="fa fa-play"></em>' ;
                              o += (this.icons_str == 'up') ? '<br>' : '&nbsp;' ;
                              o += '<span class="fw-bold" data-langkey="Run">Run</span>' +
                                   '</button>' ;
                                   break ;

                       case "btn_rnf":
			     o += '<div class="btn-group col py-0 pe-1" role="group">' +
                                  '<button id="btn_run_stop_' + this.name_str + '"' +
		                  '        class="btn bg-secondary-subtle border-secondary w-75"' +
		                  '        accesskey="r" ' +
                                  '        data-bind="click" data-action="exec-run" style="">' ;
                              o += (this.icons_str == 'no') ? ""     : '<em class="fa fa-play"></em>' ;
                              o += (this.icons_str == 'up') ? '<br>' : '&nbsp;' ;
                              o += '<span class="fw-bold" data-langkey="Run">Run</span>' +
                                   '</button>' +
                                   '' +
                                   '<button type="button" ' +
                                   '        class="btn dropdown-toggle dropdown-toggle-split border-secondary bg-secondary-subtle w-25" ' +
                                   '        data-bs-toggle="dropdown" aria-expanded="false">' +
                                   '  <span class="visually-hidden">Toggle Dropdown</span>' +
                                   '</button>' +
                                   '<ul class="dropdown-menu border border-secondary">' +
			          '' +
                                   '    <li><a  class="dropdown-item" ' +
                                   '            data-bind="click" data-action="exec-run">' +
                                   '<i class="fa-solid fa-person-running"></i>&nbsp;' +
			          '<span data-langkey="Run">Run</span>' +
                                    '</a></li>' +
			          '' +
                                   '    <li><hr class="dropdown-divider"></li>' +
                                   '    <li><a  class="dropdown-item" ' +
                                   '            data-bind="click" data-action="exec-flash-fpga">' +
                                   '<i class="fa-solid fa-bolt"></i>&nbsp;' +
			          '<span data-langkey="Flash">Flash FPGA</span>' +
			          '</a></li>' +
			          '' +
                                   '    <li class="wsx_esp32"><hr class="dropdown-divider"></li>' +
                                   '    <li class="wsx_esp32"><a  class="dropdown-item" ' +
                                   '            data-bind="click" data-action="exec-flash-asm">' +
                                   '<i class="fa-solid fa-bolt"></i>&nbsp;' +
			          '<span data-langkey="Flash">Flash ESP32</span>' +
			          '</a></li>' +
			          '' +
                                   '</ul>' +
                                   '</div>' ;
                                   break ;
                    }

                    return o ;
	      }

	      bindElements ()
	      {
		    this.addEventListener('click', (e) => {
			const el = e.target.closest('[data-bind="click"]') ;
			if (!el) return ;
			e.preventDefault() ;

			switch (el.dataset.action) {
			    case 'exec-reset':
				wsweb_execution_reset() ;
				break ;
			    case 'exec-prev-micro':
				wsweb_execution_previous_microinstruction() ;
				break ;
			    case 'exec-next-micro':
				wsweb_execution_microinstruction() ;
				break ;
			    case 'exec-next-insn':
				wsweb_execution_instruction() ;
				break ;
			    case 'exec-run':
				wsweb_execution_run() ;
				break ;
			    case 'exec-flash-fpga':
				wsweb_dialog_open('flash_fpga') ;
				break ;
			    case 'exec-flash-asm':
				wsweb_dialog_open('flash_assembly') ;
				break ;
			}
		    }) ;
	      }
        }



        /*
         *  Play/Stop button
         */

        export var webui_start_button_color = 'rgb(51, 136, 204)' ;
        export var webui_stop_button_color = '#CCCCCC' ;

        function get_icons_str ( name )
        {
            var elto = document.querySelector('ws-executionbar[name="' + name + '"]');
            if (elto && elto.icons_str !== undefined)
                return elto.icons_str;
            // fallback for non-ESM context (window.icons_str)
            if (typeof window.icons_str !== 'undefined')
                return window.icons_str;
            return 'no';
        }

        export function webui_button_set_stop( name )
        {
	    var wsi     = get_cfg('ws_idiom') ;
            var run_tag = i18n_get('gui',wsi,'Run') ;

	    var o = "<b>" + run_tag + "</b>" ;
            if (get_icons_str(name) !== 'no')
	        o = "<i class='fa fa-play'></i><br>" + o ;

	    $('#btn_run_stop_' + name).html(o) ;
	    $('#btn_run_stop_' + name).css("backgroundColor", webui_stop_button_color) ;
        }

        export function webui_button_set_start( name )
        {
	    var wsi      = get_cfg('ws_idiom') ;
            var stop_tag = i18n_get('gui',wsi,'Stop') ;

            var o = "<b>" + stop_tag + "</b>" ;
            if (get_icons_str(name) !== 'no')
                o = "<i class='fa fa-stop'></i><br>" + o ;

	    $('#btn_run_stop_' + name).css("backgroundColor", webui_start_button_color) ;
	    $('#btn_run_stop_' + name).html(o) ;
        }


        /*
         *  Start/Stop
         */

        export function webui_executionbar_start( name )
        {
            var executionbar_stop = function() {
                                       return webui_executionbar_stop(name) ;
                                    } ;

            var ret = wepsim_execute_play(executionbar_stop) ;
            if (ret !== false) {
                webui_button_set_start(name) ;
            }

            return ret ;
        }

        export function webui_executionbar_stop( name )
        {
            var ret = wepsim_execute_stop() ;
            if (ret !== false) {
                webui_button_set_stop(name) ;
            }

            return ret ;
        }

        export function webui_executionbar_toggle_play( name )
        {
            var executionbar_stop = function() {
                                       return webui_executionbar_stop(name) ;
                                    } ;

            var ret = wepsim_execute_toggle_play(executionbar_stop) ;

            if (ret == true)
                 webui_button_set_stop(name) ;
            else webui_button_set_start(name) ;
        }

