/*
 *  Copyright 2015-2019 Felix Garcia Carballeira, Alejandro Calderon Mateos, Javier Prieto Cepeda, Saul Alonso Monsalve
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
     * Checkpointing
     */

    function wepsim_checkpoint_save ( id_filename, id_tagname )
    {
	    // get & check params
            var obj_fileName = document.getElementById(id_filename) ;
	    var obj_tagName  = document.getElementById(id_tagname) ;

	    if ( (obj_fileName === null) || (obj_tagName === null) )
	    {
		return false ;
	    }

	    // build checkpoint as json
	    var ret       = wepsim_state_get_clk() ;
	    var state_obj = simcore_simstate_current2state() ;
	      ret.content = simcore_simstate_state2checklist(state_obj) ;

	    var checkpointObj = { 
		                  firmware: inputfirm.getValue(), 
				  assembly: inputasm.getValue(), 
				  state:    ret,
				  tag:      obj_tagName.value
	                        } ;
	    var checkpointStr = JSON.stringify(checkpointObj, null, 2) ;

	    // save checkpoint
	    wepsim_save_to_file(checkpointStr, obj_fileName.value) ;
	    return true ;
    }

    function wepsim_checkpoint_load ( id_filename, id_tagname, id_file_to_load )
    {
	    // get & check params
            var obj_fileName   = document.getElementById(id_filename) ;
	    var obj_tagName    = document.getElementById(id_tagname) ;
	    var obj_fileToLoad = document.getElementById(id_file_to_load).files[0] ;

	    if ( (obj_fileName === null) || (obj_tagName === null) || (obj_fileToLoad === null) )
	    {
		return false ;
	    }

	    // lambda (auxiliar) function
	    var function_after_loaded = function (textLoaded)
	                                {
				           var checkpointObj = JSON.parse(textLoaded) ;

                                           wepsim_checkpoint_load_aux(checkpointObj, 
						                      obj_fileName, obj_tagName, obj_fileToLoad) ;
			                } ;

	    // load checkpoint
	    wepsim_load_from_file(obj_fileToLoad, function_after_loaded) ;
    }

    function wepsim_checkpoint_load_aux ( checkpointObj, obj_fileName, obj_tagName, obj_fileToLoad )
    {
	   var o = '' ;
	   var u = '' ;

	   // check params
	   if (checkpointObj === null) 
	       return o ;

	   // load tag
	   obj_fileName.value = obj_fileToLoad.name ;
	   obj_tagName.value  = checkpointObj.tag ;

	   o += '<li>Tag: <strong>' + checkpointObj.tag + '</strong></li>' ;

	   // firmware + assembly: load into editor
	   inputfirm.setValue(checkpointObj.firmware) ;
	    inputasm.setValue(checkpointObj.assembly) ;

	   o += '<li>Firmware and Assembly: Loaded' ;

	   // firmware + assembly: compile
	   u = '' ;
	   if (checkpointObj.firmware.trim() !== "") {
	       wepsim_compile_firmware(checkpointObj.firmware) ;
	       u += 'Firmware' ;

	   }
	   if (checkpointObj.assembly.trim() !== "") {
	       wepsim_compile_assembly(checkpointObj.assembly) ;
	       u += ' + Assembly' ;
	   }

	   if (u !== '') {
	       o += ' + Compiled' ;
	   }
	   o += '.</li>' ;

	   // restore saved checkpoint
	   wepsim_state_history_reset() ;
	   state_history.push(checkpointObj.state) ;
	   wepsim_state_history_list() ;

	   o += '<li>State: Saved into the state history.</li>' ;

	   // Future Works:
	   // + update internal state based on txt_checklist

	   // notify
	   if (o !== '') {
	       o = 'WepSIM has been instructed to restore a checkpoint:<br>' +
		   '<ul>' + 
		   o + 
		   '</ul>' +
		   'To close this notification please press in the ' +
		   '<span class="btn btn-sm btn-info py-0" data-dismiss="alert">X</span> mark. <br>' +
		   'In order to execute please press the ' +
		   '<span class="btn btn-sm btn-info py-0" onclick="wepsim_execute_toggle_play(\'#qbp\',false);">Run</span> button.<br>' ;
	   }

	   simcoreui_notify('Restored Checkpoint', o, 'info', 0) ;
    }
