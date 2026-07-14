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
import { wsweb_record_on, wsweb_record_off, wsweb_record_play, wsweb_record_pause, wsweb_record_confirmReset, wsweb_notifyuser_add } from './wepsim_web_api.js';



        /*
         *  Recordbar
         */
        /* jshint esversion: 6 */
        export class ws_recordbar extends ws_uielto
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

                    // load html
		    o1 += '<div class="row-fluid px-0 pb-3 pt-0 rounded w-100 collapse" id="record_div"' +
                          '     style="position:fixed; left:0; top: calc(100vh - 70px); z-index:1024; background-color:#EAEAEA; overflow:auto; -webkit-overflow-scrolling:touch;">' +
		          '' +
			  '     <div class="progress col-12" style="height:2px;">' +
			  '	  <div id="record_pb" class="progress-bar" role="progressbar" style="width:0%;"' +
			  '            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>' +
			  '     </div>' +
			  '     <div class="text-start col">' +
			  '<span id="record_msg" class="text-start text-truncate">' +
                          '<em>0/0</em>&nbsp;&lt;empty recording&gt;' +
                          '</span>' +
			  '     </div>' +
			  '     <div class="btn-group col-12" id="record_div_container">' +
                          '     </div>' +
                          '</div>' ;

                    this.innerHTML = o1 ;
	      }

	      render_populate ( )
	      {
                    var o1  = '' ;

                    // load html
		    o1 += '  <a class="btn btn-sm btn-outline-secondary btn-light shadow-sm rounded px-2 me-2" href="#"' +
                          '     data-bs-toggle="tooltip" data-bs-placement="top" data-boundary="window"' +
                          '     title="Remove recorded session"' +
                          '     data-bind="click" data-action="record-reset"><em class="fas fa-times text-danger"></em>' +
                          '     <span class="d-none d-md-inline-flex ps-1" ' +
                          '               data-langkey=\'Reset\'>Reset</span>' +
                          '  </a>' +
                          '  <a class="btn btn-sm btn-outline-secondary btn-light shadow-sm rounded px-2 mx-2" href="#"' +
                          '     data-bs-toggle="tooltip" data-bs-placement="top" data-boundary="window"' +
                          '     title="(While recording) add a new comment"' +
                          '     data-bind="click" data-action="record-comment"><em class="fas fa-comment"></em>' +
                          '     <span class="d-none d-md-inline-flex ps-1" data-langkey=\'Comment\'>Comment</span>' +
                          '  </a>' +
                          '  <a class="btn btn-sm btn-outline-secondary btn-light shadow-sm rounded px-2 mx-2" href="#"' +
                          '     data-bs-toggle="tooltip" data-bs-placement="top" data-boundary="window"' +
                          '     title="Pause/Continue playback"' +
                          '     data-bind="click" data-action="record-pause"><em class="fas fa-pause"></em>' +
                          '     <span class="d-none d-md-inline-flex ps-1" data-langkey=\'Pause\'>Pause</span>' +
                          '  </a>' +
                          '  <a class="btn btn-sm btn-outline-secondary btn-light shadow-sm rounded px-2 mx-2" href="#"' +
                          '     data-bs-toggle="tooltip" data-bs-placement="top" data-boundary="window"' +
                          '     title="Play"' +
                          '     data-bind="click" data-action="record-play"><em class="fas fa-play"></em>' +
                          '     <span class="d-none d-md-inline-flex ps-1" data-langkey=\'Play\'>Play</span>' +
                          '  </a>' +
                          '  <a class="btn btn-sm btn-outline-secondary btn-light shadow-sm rounded px-2 mx-2" href="#"' +
                          '     data-bs-toggle="tooltip" data-bs-placement="top" data-boundary="window" data-bs-html="true"' +
                          '     title="Stop recording /<br>Reset playback"' +
                          '     data-bind="click" data-action="record-stop"><em class="fas fa-square"></em>' +
                          '     <span class="d-none d-md-inline-flex ps-1" data-langkey=\'Stop\'>Stop</span>' +
                          '  </a>' +
                          '  <a class="btn btn-sm btn-outline-secondary btn-light shadow-sm rounded px-2 ms-2" href="#"' +
                          '     data-bs-toggle="tooltip" data-bs-placement="top" data-boundary="window"' +
                          '     title="Start recording session"' +
                          '     data-bind="click" data-action="record-on"><em class="fas fa-circle"></em>' +
                          '     <span class="d-none d-md-inline-flex ps-1" data-langkey=\'Record\'>Record</span>' +
                          '  </a>' ;

                    $('#record_div_container').html(o1) ;
	      }

	      bindElements ()
	      {
		    this.addEventListener('click', (e) => {
			const el = e.target.closest('[data-bind="click"]') ;
			if (!el) return ;
			e.preventDefault() ;

			switch (el.dataset.action) {
			    case 'record-reset':   wsweb_record_confirmReset() ; break ;
			    case 'record-comment': wsweb_notifyuser_add() ;      break ;
			    case 'record-pause':   wsweb_record_pause() ;       break ;
			    case 'record-play':    wsweb_record_play() ;        break ;
			    case 'record-stop':    wsweb_record_off() ;         break ;
			    case 'record-on':      wsweb_record_on() ;          break ;
			}
		    }) ;
	      }
        }


