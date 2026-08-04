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
function wepsim_file_saveTo(textToWrite,fileNameToSaveAs){if(window.requestFileSystem=window.requestFileSystem||window.webkitRequestFileSystem,void 0===window.requestFileSystem)return!1;var koHandler=function(error){wepsim_notify_error("<strong>ERROR</strong>: failed file write","Failed file write. Error found "+error.toString())},okHandler=function(msg){wepsim_notify_success("<strong>INFO</strong>","Successful file write request: "+fileNameToSaveAs)},onWriteFile=function(fileWriter){var textFileAsBlob=new Blob([textToWrite],{type:"text/plain"});fileWriter.onerror=koHandler,fileWriter.onwriteend=okHandler,fileWriter.write(textFileAsBlob)},onCreatFile=function(fileEntry){fileEntry.createWriter(onWriteFile)},onInitFs=function(fs){fs.root.getFile(fileNameToSaveAs,{create:!0,exclusive:!1},onCreatFile,koHandler)};return navigator.webkitPersistentStorage.requestQuota(2097152,function(grantedBytes){window.requestFileSystem(PERSISTENT,2097152,onInitFs,koHandler)},koHandler),!0}function wepsim_file_loadFrom(fileToLoad,functionOnLoad){if(void 0===fileToLoad)return!1;var fileReader=new FileReader;return null!==fileReader&&(fileReader.onload=function(fileLoadedEvent){var textFromFileLoaded=fileLoadedEvent.target.result;null!==functionOnLoad&&functionOnLoad(textFromFileLoaded)},fileReader.onerror=function(e){wepsim_notify_error("<strong>ERROR</strong>","File could not be read. Error code "+e.target.error.code)},fileReader.readAsText(fileToLoad,"UTF-8"),!0)}function wepsim_file_downloadTo(textToWrite,fileNameToSaveAs){var windowURL=window.webkitURL||window.URL,textFileAsBlob=new Blob([textToWrite],{type:"text/plain"}),downloadLink=document.createElement("a");downloadLink.innerHTML="Download File",downloadLink.style.display="none",downloadLink.download=fileNameToSaveAs,downloadLink.href=windowURL.createObjectURL(textFileAsBlob),downloadLink.onclick=function(event){document.body.removeChild(event.target)},document.body.appendChild(downloadLink),downloadLink.click(),wepsim_notify_success("<strong>INFO</strong>","Successful opportunity for downloading: "+fileNameToSaveAs)}function getURLTimeStamp(){return Date.now()}function fetchURL(f_url){return navigator.onLine?fetch(f_url+"?time="+getURLTimeStamp()):caches.match(f_url)}function wepsim_save_to_file(textToWrite,fileNameToSaveAs){return is_cordova()?wepsim_file_saveTo(textToWrite,fileNameToSaveAs):wepsim_file_downloadTo(textToWrite,fileNameToSaveAs)}function wepsim_load_from_url(url,do_next){if(!1===is_mobile())fetchURL(url).then(function(response){void 0!==response?response.ok&&response.text().then(function(text){do_next(text)}):wepsim_notify_error("<strong>ERROR</strong>","File "+url+" could not be fetched:<br>\n * Please check that you are on-line.")});else{var xmlhttp=new XMLHttpRequest;xmlhttp.onreadystatechange=function(){if(4==xmlhttp.readyState&&(200==xmlhttp.status||0==xmlhttp.status)){var textFromFileLoaded=xmlhttp.responseText;null!==do_next&&do_next(textFromFileLoaded)}},xmlhttp.open("GET",url,!0),xmlhttp.send()}}function wepsim_url_getJSON(url_json){var jstr={},jobj=[];try{jstr=$.getJSON({url:url_json,async:!1}),jobj=JSON.parse(jstr.responseText)}catch(e){ws_alert("Unable to load '"+url_json+"': "+e+".\n"),jobj=[]}return jobj}function wepsim_url_json(json_url,do_after){var xhr=new XMLHttpRequest;xhr.open("HEAD",json_url,!0),xhr.onreadystatechange=function(){if(this.readyState==this.DONE){var size=0,content_length=xhr.getResponseHeader("Content-Length");null!==content_length&&(size=parseInt(content_length)),size<get_cfg("max_json_size")&&$.getJSON(json_url,do_after).fail(function(e){wepsim_notify_do_notify("getJSON","There was some problem for getting "+json_url,"warning",0)})}},xhr.send()}
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
 */function get_clipboard_copy(){return ws_info.clipboard_copy}function SelectText(element){var range,selection,doc=document,text=doc.getElementById(element);doc.body.createTextRange?((range=document.body.createTextRange()).moveToElementText(text),range.select()):window.getSelection&&(selection=window.getSelection(),(range=document.createRange()).selectNodeContents(text),selection.removeAllRanges(),selection.addRange(range))}function wepsim_clipboard_CopyFromDiv(element_name){var msg="unsuccessful";try{SelectText(element_name),document.execCommand("copy")&&(ws_info.clipboard_copy=$("#"+element_name).text(),msg="successful")}catch(e){msg+=msg+" because "+e}wepsim_notify_success("<strong>INFO</strong>","Copied "+msg+"!.")}function wepsim_clipboard_CopyFromTextarea(element_name){var msg="successful";try{document.getElementById(element_name).select(),document.execCommand("copy"),ws_info.clipboard_copy=$("#"+element_name).val()}catch(err){msg="unsuccessful"}wepsim_notify_success("<strong>INFO</strong>","Copied "+msg+"!.")}
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
function wepsim_preload_fromHash(hash){for(var key="",act=function(){},o="",i=0;i<ws_info.preload_tasks.length;i++)key=ws_info.preload_tasks[i].name,act=ws_info.preload_tasks[i].action,""!==hash[key]&&(o+=act(hash));return o}function wepsim_preload_get2hash(window_location,f_preload_fromHash){var hash={},hash_field="",uri_obj=null;if(void 0===window_location)return hash;var parameters=new URL(window_location).searchParams;for(i=0;i<ws_info.preload_tasks.length;i++)hash[hash_field=ws_info.preload_tasks[i].name]=parameters.get(hash_field),null===hash[hash_field]&&(hash[hash_field]="");if(""!==hash.preload)try{wepsim_url_json((uri_obj=new URL(hash.preload)).pathname,f_preload_fromHash)}catch(e){ws_alert('unable to preload json from "'+uri_obj.pathname+'"')}return hash}
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
 */function wepsim_checkpoint_get(tagName){var ws_mode=get_cfg("ws_mode"),history_obj=wepsim_state_history_get(),state_current=wepsim_state_get_clk(),state_obj=simcore_simstate_current2state();state_current.content=simcore_simstate_state2checklist(state_obj,"");var cache_cfg=simhw_internalState("CM_cfg");return{mode:ws_mode,firmware:inputfirm.getValue(),assembly:inputasm.getValue(),state_current:state_current,state_history:history_obj,record:simcore_record_get(),cache:cache_cfg,tag:tagName,notify:!0}}function wepsim_checkpoint_loadFromObj(checkpointObj,obj_fileToLoad){var o="",u="",i=0;if(null===checkpointObj)return"null checkpoint";for(void 0===checkpointObj.mode&&(checkpointObj.mode="ep"),void 0===checkpointObj.firmware&&(checkpointObj.firmware=""),void 0===checkpointObj.assembly&&(checkpointObj.assembly=""),void 0===checkpointObj.state_history&&(checkpointObj.state_history=[]),void 0===checkpointObj.record&&(checkpointObj.record=[]),void 0===checkpointObj.cache&&(checkpointObj.cache=[]),wepsim_state_history_reset(),i=0;i<checkpointObj.state_history.length;i++)ws_info.state_history.push(checkpointObj.state_history[i]);wepsim_state_history_list(),o+="<li>State: restored into the state history.</li>",wsweb_select_main(checkpointObj.mode),inputfirm.setValue(checkpointObj.firmware),inputasm.setValue(checkpointObj.assembly),o+="<li>Firmware and Assembly: Loaded",u="",""!==checkpointObj.firmware.trim()&&(wepsim_compile_firmware(checkpointObj.firmware),u+="Firmware"),""!==checkpointObj.assembly.trim()&&(wepsim_compile_assembly(checkpointObj.assembly),u+=" + Assembly"),""!==u&&(o+=" + Compiled"),o+=".</li>",simcore_record_set(checkpointObj.record),""!==o&&(o="WepSIM has been instructed to restore a checkpoint:<br><ul>"+o+'</ul>To close this notification please press in the <span class="btn btn-sm btn-info py-0" data-bs-dismiss="alert">X</span> mark. <br>'),!0===checkpointObj.notify&&wepsim_notify_do_notify("Restored Checkpoint",o,"info",get_cfg("NOTIF_delay"));var cm_cfg=[],cm_cfg_i={};for(i=0;i<checkpointObj.cache.length;i++)cm_cfg_i=cache_memory_init_eltofromcfg(checkpointObj.cache[i].cfg),cm_cfg.push(cm_cfg_i);var cm=cache_memory_init_cm(cm_cfg);return simhw_internalState_reset("CM_cfg",cm_cfg),simhw_internalState_reset("CM",cm),wepsim_show_cache_memory_config(),o}function wepsim_checkpoint_NB_concat_ws_cells(cells){return cells.push({cell_type:"markdown",source:"## wepsim_runner",metadata:{}}),cells.push({cell_type:"code",source:["from google.colab import _message\n","nb = _message.blocking_request('get_ipynb')\n","\n","type = ''\n","ws = {'firmware': '', 'assembly': ''}\n","for cell in nb['ipynb']['cells']:\n","  if '## firmware' in cell['source']:\n","     type = 'firmware'\n","     continue\n","  if '## assembly' in cell['source']:\n","     type = 'assembly'\n","     continue\n","  if type == 'firmware':\n","     ws['firmware'] = ' '.join(cell['source']) ;\n","     type = ''\n","     continue\n","  if type == 'assembly':\n","     ws['assembly'] = ' '.join(cell['source']) ;\n","     type = ''\n","     continue\n","\n","if ws['assembly'] != '' and ws['firmware'] != '':\n","   with open('/base.mc', 'w') as f:\n","       f.write(ws['firmware'])\n","   with open('/base.asm', 'w') as f:\n","       f.write(ws['assembly'])\n","\n","if ws['assembly'] != '' and ws['firmware'] != '':\n","   !npm install  terser jq jshint yargs clear inquirer >& /dev/null\n","   !wget https://github.com/wepsim/wepsim/releases/download/v2.3.8/wepsim-2.3.8.zip >& /dev/null\n","   !unzip -o wepsim-2.3.8.zip  >& /dev/null\n","   !rm -fr   wepsim-2.3.8.zip\n","   !./wepsim-2.3.8/wepsim.sh -a stepbystep -m ep -f /base.mc -s /base.asm > ./result.csv\n","\n","df = None\n","if ws['assembly'] != '' and ws['firmware'] != '':\n","   import pandas as pd\n","   import io\n","   df1 = pd.read_csv('./result.csv')\n","   df1.columns = df1.columns.str.strip()\n","   for item in df1.columns[:]:\n",'       df1[item].replace("\\t","",     inplace=True, regex=True)\n','       df1[item].replace("&nbsp;","", inplace=True, regex=True)\n',"\n","%load_ext google.colab.data_table\n","df1\n"],metadata:{name:"wepsim",type:"code",collapsed:!0,deletable:!1,editable:!0}}),cells}function wepsim_checkpoint_Obj2NB(elements){var val="",typ="",cells=[];for(var key in elements)"string"!==(typ=typeof(val=elements[key]))&&(val=JSON.stringify(val,null,2)),cells.push({cell_type:"markdown",source:"## "+key,metadata:{collapsed:!1,deletable:!1,editable:!1}}),cells.push({cell_type:"code",source:val,outputs:[],execution_count:1,metadata:{name:key,type:typ,collapsed:!1,deletable:!1,editable:!0}});return{metadata:{kernelspec:{name:"node_nteract",language:"javascript",display_name:"Node.js (nteract)"},kernel_info:{name:"node_nteract"},language_info:{name:"javascript",version:"8.2.1",mimetype:"application/javascript",file_extension:".js"},title:"WepSIM ",nteract:{version:"nteract-on-jupyter@2.0.0"}},nbformat:4,nbformat_minor:0,cells:cells=wepsim_checkpoint_NB_concat_ws_cells(cells)}}function wepsim_checkpoint_NB2Obj(nbObj){var elements={};if(void 0===nbObj.cells)return elements;if(void 0===nbObj.cells.length)return elements;for(var key="",type="",value="",i=0;i<nbObj.cells.length;i++)"code"===nbObj.cells[i].cell_type&&(key=nbObj.cells[i].metadata.name,type=nbObj.cells[i].metadata.type,value=nbObj.cells[i].source,0==["string","code"].includes(type)&&(value=JSON.parse(value)),elements[key]=value);return elements}function wepsim_checkpoint_save(id_filename,id_tagname,checkpointObj){var obj_fileName=document.getElementById(id_filename),obj_tagName=document.getElementById(id_tagname);if(null===obj_fileName||null===obj_tagName)return!1;var checkpointNB=wepsim_checkpoint_Obj2NB(checkpointObj);return wepsim_save_to_file(JSON.stringify(checkpointNB,null,2),obj_fileName.value),!0}function wepsim_checkpoint_afterLoad(textLoaded,obj_fileToLoad){try{var current_checkpoint=null;""!==textLoaded&&(current_checkpoint=wepsim_checkpoint_NB2Obj(current_checkpoint=JSON.parse(textLoaded))),wepsim_checkpoint_loadFromObj(current_checkpoint,obj_fileToLoad)}catch(e){ws_alert("Error on checkpoint file: "+e)}}function wepsim_checkpoint_load(id_file_to_load){var obj_fileToLoad=document.getElementById(id_file_to_load).files[0];if(null==obj_fileToLoad)return!1;return wepsim_file_loadFrom(obj_fileToLoad,function(textLoaded){wepsim_checkpoint_afterLoad(textLoaded,obj_fileToLoad)}),!0}function wepsim_checkpoint_loadURI(obj_uri){if(null==obj_uri)return!1;try{var filename=obj_uri.href.substring(obj_uri.href.lastIndexOf("/")+1);return wepsim_url_json(obj_uri.href,function(data){var obj_refName={name:filename};wepsim_checkpoint_loadFromObj(wepsim_checkpoint_NB2Obj(data),obj_refName)}),!0}catch(e){return!1}}function wepsim_checkpoint_loadExample(tutorial_name){var file_uri="repo/checkpoint/"+tutorial_name;wepsim_load_from_url(file_uri,function(data_text){wepsim_checkpoint_afterLoad(data_text,{name:file_uri})})}function wepsim_checkpoint_share(id_filename,id_tagname,checkpointObj){var obj_fileName=document.getElementById(id_filename),obj_tagName=document.getElementById(id_tagname);if(null===obj_fileName||null===obj_tagName)return!1;var checkpointNB=wepsim_checkpoint_Obj2NB(checkpointObj),share_title="WepSIM checkpoint backup",share_text=JSON.stringify(checkpointNB,null,2);return""!==obj_tagName.value.toString().trim()?share_title+=" ("+obj_tagName.value+")...":share_title+="...",share_information("checkpoint",share_title,share_text,share_text)}function wepsim_checkpoint_backup_load(){var obj_wsbackup=[];try{var json_wsbackup=localStorage.getItem("wepsim_backup");obj_wsbackup=JSON.parse(json_wsbackup)}catch(e){obj_wsbackup=null}return null==obj_wsbackup&&(obj_wsbackup=[]),obj_wsbackup}function wepsim_checkpoint_backup_save(obj_wsbackup){var json_wsbackup=JSON.stringify(obj_wsbackup);return localStorage.setItem("wepsim_backup",json_wsbackup),obj_wsbackup}function wepsim_checkpoint_listCache(id_listdiv){var o='<span class="bg-warning text-dark bg-opacity-75">&lt;<span data-langkey="Empty">Empty</span>&gt;</span>',obj_wsbackup=wepsim_checkpoint_backup_load();if(0==obj_wsbackup.length)return $("#"+id_listdiv).html(o),!0;for(o='<div class="btn-group btn-group-toggle list-group m-1" data-bs-toggle="buttons">',obj_wsbackup=obj_wsbackup.reverse(),i=0;i<obj_wsbackup.length;i++)o+='<label data-bs-toggle="list"        class="list-group-item btn btn-white border-dark text-truncate rounded-1">   <input type="radio" name="browserCacheElto"           id="'+i+'" autocomplete="off" class="btn-check" >'+obj_wsbackup[i].tag+"</label>";return o+="</div>",$("#"+id_listdiv).html(o),!0}function wepsim_checkpoint_loadFromCache(id_backupname){var ret={error:!0,msg:""},browserCacheElto=$("input[name="+id_backupname+"]:checked");if(void 0===browserCacheElto[0])return ret.msg="Invalid arguments",ret;var id_backupcache=browserCacheElto[0].id,obj_wsbackup=wepsim_checkpoint_backup_load(),current_checkpoint=(obj_wsbackup=obj_wsbackup.reverse())[id_backupcache];if(void 0===current_checkpoint)return ret.msg="Backup id is not valid",ret;return wepsim_checkpoint_loadFromObj(current_checkpoint,{name:""}),ret.error=!1,ret.msg="Processing load request...",ret}function wepsim_checkpoint_addCurrentToCache(){var obj_wsbackup=wepsim_checkpoint_backup_load(),current_checkpoint=wepsim_checkpoint_get(Date().toString());return""!==current_checkpoint.firmware.trim()&&""!==current_checkpoint.assembly.trim()&&obj_wsbackup.push(current_checkpoint),wepsim_checkpoint_backup_save(obj_wsbackup),!0}function wepsim_checkpoint_clearCache(){return wepsim_checkpoint_backup_save([]),!0}
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
 */function wepsim_update_signal_dialog_title(key){return wepsim_config_dialog_dropdown("success",key+': <button onclick="$(\'#bot_signal\').carousel(0);"         type="button" class="btn btn-info">Value</button><button onclick="$(\'#bot_signal\').carousel(1);                  var shval = $(\'#ask_shard\').val();                  var shkey = $(\'#ask_skey\').val();                  update_signal_loadhelp(\'#help2\', shval, shkey);"         type="button" class="btn btn-success">Help</button>',"var shval = $('#ask_shard').val(); var shkey = $('#ask_skey').val(); update_signal_loadhelp('#help2', shval, shkey);\"")}function wepsim_update_signal_dialog_body(key,signal_obj){var checkvalue=signal_obj.value>>>0,str_bolded="",str_checked="",input_help="",behav_raw="",behav_str="",notif="",n10=0,nvalues=1<<signal_obj.nbits;if(signal_obj.behavior.length==nvalues){input_help='<ol start="0" class="list-group list-group-flush">';for(var k=0;k<signal_obj.behavior.length;k++)str_checked=" ",k==checkvalue&&(str_checked=' checked="checked" '),str_bolded=" ",k==signal_obj.default_value&&(str_bolded='<span class="badge bg-info">default value</span>'),behav_raw=signal_obj.behavior[k],""==(behav_str=compute_signal_verbals(key,k)).trim()&&(behav_str="&lt;without main effect&gt;"),n10=k.toString(10),2!=nvalues&&(notif='<span class="position-absolute top-100 start-100 translate-middle badge rounded-pill bg-success">'+n10+"</span>"),input_help+='<li class="list-group-item p-1"><label class="m-1 btn-like" id="'+key+"_"+n10+'">  <input aria-label="value '+n10+'" type="radio" name="ask_svalue"          value="'+n10+'" '+str_checked+'/><span class="badge bg-secondary badge-pill position-relative mx-2">'+k.toString(2).padStart(signal_obj.nbits,"0")+notif+"</span>  <span>"+behav_str+"</span>&nbsp;"+str_bolded+'<p class="m-0 ml-3 bg-body-tertiary collapse collapse7"><small>'+behav_raw+"</small></p></label></li>";input_help+="</ol>"}else input_help+='<ol start="0"><span><center><label><input aria-label="value for '+key+'" type="number" size=4 min=0 max='+(nvalues-1)+' class=dial        name="ask_svalue" value="'+signal_obj.value+'"/>&nbsp;&nbsp; 0 - '+(nvalues-1)+"</center></label></span>\n</ol>";var curr_hw=simhw_short_name();return""==curr_hw&&(curr_hw="ep"),'<div id="bot_signal" class="carousel" data-ride="carousel" data-interval="false">  <div class="carousel-inner" role="listbox">    <div class="carousel-item active">    <div id="scroller-signal"          style="max-height:70vh; width:inherit; overflow:auto; -webkit-overflow-scrolling:touch;">         <form class="form-horizontal" style="white-space:wrap;">         <input aria-label="value for '+key+'" id="ask_skey"  name="ask_skey"  type="hidden" value="'+key+'" class="form-control input-md">          <input aria-label="value for '+curr_hw+'" id="ask_shard" name="ask_shard" type="hidden" value="'+curr_hw+'" class="form-control input-md"> '+input_help+'         </form>    </div>    </div>    <div class="carousel-item">         <div id=help2 style="max-height:65vh; width:inherit; overflow:auto; -webkit-overflow-scrolling:touch;">Loading...</div>    </div>  </div></div>'}function wepsim_update_signal_dialog(key){var signal_obj=simhw_sim_signal(key);return void 0===signal_obj?null:wsweb_dlg_open({id:"dlg_updatesignal",title:function(){var name=key;return void 0!==signal_obj.name&&(name=signal_obj.name),wepsim_update_signal_dialog_title(name)},body:function(){return wepsim_update_signal_dialog_body(key,signal_obj)},value:signal_obj.value,buttons:{success:{label:'<i class="fas fa-screwdriver"></i> <span data-langkey="Save">Save</span>',className:"btn-info btn-sm col col-md-3 float-right",callback:function(){key=$("#ask_skey").val(),user_input=$("input[name='ask_svalue']:checked").val(),"undefined"==typeof user_input&&(user_input=$("input[name='ask_svalue']").val()),user_input=parseInt(user_input),wepsim_update_signal_with_value(key,user_input),wsweb_dialogbox_close_updatesignal()}},close:{label:'<i class="fa fa-times me-2"></i><span data-langkey="Close">Close</span>',className:"btn-primary btn-sm col col-md-3 float-right",callback:function(){wsweb_dialogbox_close_updatesignal()}}},onshow:function(){if(void 0!==$(".dial").knob){var nvalues=1<<signal_obj.nbits;$(".dial").knob({min:0,max:nvalues-1}).val(signal_obj.value).trigger("change")}var bb=$("#dlg_updatesignal");bb.find(".modal-title").addClass("mx-auto"),bb.find(".bootbox-close-button").addClass("mx-1 btn-close border-0"),bb.modal("handleUpdate"),wsweb_scroll_record("#scroller-signal"),simcore_record_captureInit()},size:"large"})}function wepsim_update_signal_quick(key){if(void 0!==simhw_sim_signal(key)){var nvalues=1<<simhw_sim_signal(key).nbits,user_input=simhw_sim_signal(key).value;wepsim_update_signal_with_value(key,user_input=(user_input+1)%nvalues)}}function wepsim_update_signal_with_value(key,value){simhw_sim_signal(key).value=value,propage_signal_update(key),simcore_record_append_new("Update signal "+key+" with value "+value,'wepsim_update_signal_with_value("'+key+'", '+value+");\n")}ws_info.clipboard_copy="",ws_info.preload_tasks=[{name:"mode",action:function(hash){var ws_mode=get_cfg("ws_mode");return hash.mode!==ws_mode&&wsweb_select_main(hash.mode),"<li>Mode set to <strong>"+hash.mode+"</strong>.</li> "}},{name:"config_set",action:function(hash){return cfgset_load(hash.config_set),wepsim_uicfg_restore(),"<li>Configuration set titled <strong>"+hash.config_set+"</strong> loaded.</li>"}},{name:"examples_set",action:function(hash){var ret=wepsim_example_loadSet(get_cfg("example_url"));wepsim_example_reset(),wepsim_example_load(hash.examples_set);var result_txt=" has been loaded";return null==ret&&(result_txt=" could not be loaded"),"<li>Examples set titled <strong>"+hash.examples_set+"</strong>"+result_txt+".</li>"}},{name:"example",action:function(hash){var example_obj=null,example_index=parseInt(hash.example);if(0==isNaN(example_index))example_obj=ws_info.examples[example_index];else for(var i=0;i<ws_info.examples.length;i++)ws_info.examples[i].id==hash.example&&(example_obj=ws_info.examples[i]);return void 0===example_obj?"":(load_from_example_firmware(example_obj.hardware+":"+example_obj.microcode+":"+example_obj.assembly,""==hash.asm),"<li>Example titled <strong>"+example_obj.title+"</strong> has been loaded.</li> ")}},{name:"mc",action:function(hash){var result_txt="",mc_code="";try{if("cache"==hash.mc){var cpts=wepsim_checkpoint_backup_load();0!=cpts.length&&(mc_code=cpts[0].firmware)}else if(null==(mc_code=LZString.decompressFromEncodedURIComponent(hash.mc)))throw new Error("null decompressed data from hash.mc :-(");result_txt=" has been loaded"}catch(e){mc_code="",result_txt=" could not be loaded"}return""!=mc_code&&(inputfirm.setValue(mc_code),inputfirm.refresh()),"<li><b>Microcode from URI</b> "+result_txt+".</li>"}},{name:"asm",action:function(hash){var result_txt="",asm_code="";try{if("cache"==hash.asm){var cpts=wepsim_checkpoint_backup_load();0!=cpts.length&&(asm_code=cpts[0].assembly)}else if(null==(asm_code=LZString.decompressFromEncodedURIComponent(hash.asm)))throw new Error("null decompressed data from hash.asm :-(");result_txt=" has been loaded"}catch(e){asm_code="",result_txt=" could not be loaded"}return""!=asm_code&&(inputasm.setValue(asm_code),inputasm.refresh(),""!=hash.example&&setTimeout(function(){wsweb_firmware_compile(),wsweb_assembly_compile()},500)),"<li><b>Assembly from URI</b> "+result_txt+".</li>"}},{name:"simulator",action:function(hash){var panels=hash.simulator.split(":");return void 0!==panels[0]&&("microcode"===panels[0]&&wsweb_change_show_processor(),"assembly"===panels[0]&&wsweb_change_show_asmdbg()),void 0!==panels[1]&&wsweb_set_details(panels[1].toUpperCase()),void 0!==panels[2]&&wsweb_do_action(panels[2].toLowerCase()),"<li>User interface has been adapted.</li> "}},{name:"cache",action:function(hash){var result_txt="",cm_cfg_json="[]";try{if("cache"==hash.asm){var cpts=wepsim_checkpoint_backup_load();0!=cpts.length&&(cm_cfg_json=cpts[0].cache)}else if(null==(cm_cfg_json=LZString.decompressFromEncodedURIComponent(hash.cache)))throw new Error("null decompressed data from hash.cache :-(");result_txt=" has been loaded"}catch(e){cm_cfg_json="[]",result_txt=" could not be loaded"}var cm=[],cm_cfg=[];return"[]"!=cm_cfg_json&&(cm_cfg=JSON.parse(cm_cfg_json),cm=cache_memory_init_cm(cm_cfg),simhw_internalState_reset("CM_cfg",cm_cfg),simhw_internalState_reset("CM",cm),wepsim_show_cache_memory_config()),"<li><b>Cache configuration from URI</b> "+result_txt+".</li>"}},{name:"checkpoint",action:function(hash){uri_obj=new URL(hash.checkpoint),wepsim_checkpoint_loadURI(uri_obj)}},{name:"notify",action:function(hash){return""}},{name:"preload",action:function(hash){return""}}];var jit_dep_network=null;function show_visgraph(jit_fire_dep,jit_fire_order){var sig={},tmp_hash={},tmp_nodes=[],tmp_id=0;for(sig in simhw_sim_signals())tmp_hash[sig]=tmp_id,tmp_nodes.push({id:tmp_id,label:sig,title:sig}),tmp_id++;for(var i=0;i<jit_fire_order.length;i++)tmp_nodes[tmp_hash[jit_fire_order[i]]].color="#7BE141";var jit_dep_nodes=new vis.DataSet(tmp_nodes),tmp_edges=[];for(sig in simhw_sim_signals())for(var sigorg in jit_fire_dep[sig])tmp_edges.push({from:tmp_hash[sigorg],to:tmp_hash[sig],arrows:"to"});var jit_dep_edges=new vis.DataSet(tmp_edges),jit_dep_container=document.getElementById("depgraph1c"),jit_dep_data={nodes:jit_dep_nodes,edges:jit_dep_edges};jit_dep_network=new vis.Network(jit_dep_container,jit_dep_data,{interaction:{hover:!0},height:"255px",nodes:{borderWidth:2,shadow:!0},edges:{width:2,shadow:!0}})}
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
 */function wepsim_state_get_clk(){var reg_maddr=get_value(simhw_sim_state("REG_MICROADDR")),reg_clk=get_value(simhw_sim_state("CLK"));return{time:(new Date).getTime(),title:"clock "+reg_clk+" @ &#181;address "+reg_maddr,title_short:"clock "+reg_clk+",<br>&#181;add "+reg_maddr}}function wepsim_state_history_get(){return ws_info.state_history}function wepsim_state_history_reset(){ws_info.state_history=[]}function wepsim_state_history_add(){var ret=wepsim_state_get_clk(),state_obj=simcore_simstate_current2state();ret.content=simcore_simstate_state2checklist(state_obj,""),ws_info.state_history.push(ret)}
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
 */function wepsim_execute_reset(reset_cpu,reset_memory){if(wepsim_state_history_reset(),!0===reset_memory){var SIMWARE=get_simware();0!==SIMWARE.firmware.length&&update_memories(SIMWARE)}!0===reset_cpu&&simcore_reset()}function wepsim_execute_instruction(){var ret=simcore_check_if_can_execute();if(!1===ret.ok)return wsweb_dlg_alert(ret.msg),!1;var options={verbosity:0,cycles_limit:get_cfg("DBG_limitick")};return!1!==(ret=simcore_execute_microprogram(options)).ok||(wepsim_show_stopbyevent("Info",ret.msg),!1)}function wepsim_execute_microinstruction(){var ret=simcore_check_if_can_execute();return!1===ret.ok?(wsweb_dlg_alert(ret.msg),!1):!1!==(ret=simcore_execute_microinstruction()).ok||(wepsim_show_stopbyevent("Info",ret.msg),!1)}function wepsim_execute_microinstruction_backwards(){var ret=simcore_check_if_can_execute();return!1===ret.ok?(wsweb_dlg_alert(ret.msg),!1):!1!==(ret=simcore_execute_microinstruction_backwards()).ok||(wepsim_show_stopbyevent("Info",ret.msg),!1)}function wepsim_execute_set_breakpoint(hexaddr,is_set){var SIMWARE=get_simware(),curr_mp=simhw_internalState("MP"),curr_addr=parseInt(hexaddr,16);return void 0!==curr_mp[curr_addr]&&(curr_mp[curr_addr].breakpoint=is_set),void 0!==SIMWARE.mp[hexaddr]&&(SIMWARE.mp[hexaddr].breakpoint=is_set),!0}function wepsim_execute_toggle_breakpoint(hexaddr){var SIMWARE=get_simware(),curr_mp=simhw_internalState("MP"),curr_addr=parseInt(hexaddr,16),is_set=!1;return void 0!==curr_mp[curr_addr]&&(is_set=curr_mp[curr_addr].breakpoint,curr_mp[curr_addr].breakpoint=!is_set),void 0!==SIMWARE.mp[hexaddr]&&(is_set=SIMWARE.mp[hexaddr].breakpoint,SIMWARE.mp[hexaddr].breakpoint=!is_set),is_set}function wepsim_execute_toggle_microbreakpoint(hexaddr){var curr_mc=simhw_internalState("MC"),curr_addr=parseInt(hexaddr,16),is_set=!1;return void 0!==curr_mc[curr_addr]&&(is_set=curr_mc[curr_addr].breakpoint,curr_mc[curr_addr].breakpoint=!is_set),is_set}ws_info.state_history=[];var DBG_stop=!0,DBG_limit_instruction=0;function wepsim_execute_stop(){DBG_stop=!0,DBG_limit_instruction=0,webui_button_set_stop("exebar1");var o="CLK-"+Math.trunc(get_value(simhw_sim_state("CLK")))+"+INS-"+Math.trunc(get_value(simhw_sim_state("DECO_INS")))+"+AT-"+Math.trunc(get_value(simhw_sim_state("ACC_TIME")));return simcore_ga("exec","exec.cpu","exec.cpu."+o),!0}function wepsim_execute_play(wepsim_execute_stop){var ret=simcore_check_if_can_execute();return!1===ret.ok?(wsweb_dlg_alert(ret.msg),!1):(DBG_stop=!1,DBG_limit_instruction=0,webui_button_set_start("exebar1"),wepsim_execute_chainplay(wepsim_execute_stop),!0)}function wepsim_execute_toggle_play(wepsim_execute_stop){return!1===DBG_stop?DBG_stop=!0:wepsim_execute_play(wepsim_execute_stop),DBG_stop}function wepsim_check_stopbybreakpoint(dash_memaddr){return void 0!==dash_memaddr&&dash_memaddr.breakpoint}function wepsim_show_stopbyevent(msg1,msg2){var buttons={};buttons.states={label:"<span data-langkey='States'>States</span>",className:"btn btn-secondary col float-left shadow-none mr-auto",callback:function(){return wsweb_dlg_close(dlg_obj),wsweb_dialog_open("state"),!0}},simcore_check_if_can_continue().ok&&(buttons.continue={label:"<span data-langkey='Continue'>Continue</span>",className:"btn btn-secondary col float-left shadow-none mr-auto",callback:function(){return wsweb_dlg_close(dlg_obj),wsweb_execution_run(),!0}}),buttons.close={label:"<span data-langkey='Close'>Close</span>",className:"btn-primary col float-right shadow-none"};var dlg_obj={id:"current_state2",title:function(){var maddr_name=simhw_sim_ctrlStates_get().mpc.state,curr_maddr="0x"+get_value(simhw_sim_state(maddr_name)).toString(16),pc_name=simhw_sim_ctrlStates_get().pc.state,curr_addr="0x"+get_value(simhw_sim_state(pc_name)).toString(16);return'<span id="dlg_title2">'+(msg1+" @ pc="+curr_addr+"+mpc="+curr_maddr)+"</span>"},body:function(){return'<div class="card card-info border-light m-2"><div class="card-body">     <div class="row"> \t  <div class="col-auto">\t       <em class="fas fa-comment-alt"></em>\t  </div>\t  <div class="col">\t       <h5><span id="dlg_body2">'+msg2+"</span></h5>\t  </div>     </div></div></div>"},buttons:buttons,size:"",onshow:function(){}};return wsweb_dlg_open(dlg_obj),!0}function wepsim_memdashboard_notify_offcanvas(ref_mdash,notif_origin,notifications,skip1st){let k=0,lineuc="";for(;k<notifications&&(lineuc=ref_mdash.notify[k].toUpperCase(),k++,!lineuc.includes("SKIP1ST")););k>=notifications&&(k=0);let title_info="";void 0!==ref_mdash.notify[k]&&(title_info=ref_mdash.notify[k],1==skip1st&&k++);for(var dialog_title="Notify @ 0x"+parseInt(notif_origin).toString(16)+":<br>"+title_info,dialog_msg='<div style="max-height:80vh; width:inherit; overflow:auto; -webkit-overflow-scrolling:touch;">';k<notifications;)dialog_msg+=ref_mdash.notify[k]+"\n",0==ref_mdash.notify[k].includes("<html>")&&(dialog_msg+="<br>"),k++;dialog_msg+="</div>";return wepsim_offcanvas_set_content("offcvs3",dialog_title,!1,dialog_msg,'<span class="row m-2"><button class="btn btn-danger col me-2"        onclick="wepsim_execute_stop();                 wepsim_offcanvas_hide(\'offcvs3\');                 return false;"><span data-langkey="Stop">Stop</span></button><button class="btn btn-success col"        onclick="wepsim_offcanvas_hide(\'offcvs3\');                 setTimeout(wepsim_execute_chainplay,                            get_cfg(\'DBG_delay\'),                            wepsim_execute_stop);                 return false;"><span data-langkey="Continue">Continue</span></button></span>'),wepsim_offcanvas_show("offcvs3"),!1}function wepsim_memdashboard_notify_dialogbox(ref_mdash,notif_origin,notifications,skip1st){var k=1;skip1st&&k++;for(var dialog_title="Notify @ 0x"+parseInt(notif_origin).toString(16)+": "+ref_mdash.notify[k],dialog_msg='<div style="max-height:70vh; width:inherit; overflow:auto; -webkit-overflow-scrolling:touch;">';k<notifications;)dialog_msg+=ref_mdash.notify[k]+"\n<br>",k++;return dialog_msg+="</div>",bootbox.confirm({title:dialog_title,message:dialog_msg,buttons:{cancel:{label:"Stop",className:"btn-danger  btn-sm"},confirm:{label:"Continue",className:"btn-primary btn-sm"}},callback:function(result){result?setTimeout(wepsim_execute_chainplay,get_cfg("DBG_delay"),wepsim_execute_stop):wepsim_execute_stop()}}),!1}function wepsim_check_getnotifyoptions(firstline){var ret={showas:"offcanvas",skip1stline:!1,scroll2current:!1,skipme:!1,panel2view:[],detail2view:[],eltos2glow:[]},firstline_uppercase=firstline.toUpperCase();firstline_uppercase.includes("SHOWAS:DIALOGBOX")&&(ret.showas="dialogbox"),firstline_uppercase.includes("SKIP1ST:TRUE")&&(ret.skip1stline=!0),firstline_uppercase.includes("SCROLL2CURRENT:TRUE")&&(ret.scroll2current=!0),firstline_uppercase.includes("SKIPME:TRUE")&&(ret.skipme=!0);var eltos2glow=firstline.match(/glow:\S+/g);null!=eltos2glow&&(ret.eltos2glow=eltos2glow[0].split(":")[1].split(","));var panel2view=firstline.match(/showpanel:\S+/g);null!=panel2view&&(ret.panel2view=panel2view[0].split(":")[1]);var detail2view=firstline.match(/showdetails:\S+/g);return null!=detail2view&&(ret.detail2view=detail2view[0].split(":")[1]),ret}function wepsim_check_donotifyoptions(options){for(var i=0;i<options.eltos2glow.length;i++)simcore_record_glowing("#"+options.eltos2glow[i]);return options.scroll2current&&wsweb_change_show_asmdbg(),""!=options.panel2view&&("microcode"===options.panel2view&&wsweb_change_show_processor(),"assembly"===options.panel2view&&wsweb_change_show_asmdbg()),""!=options.detail2view&&wsweb_set_details(options.detail2view.toUpperCase()),!1}function wepsim_check_memdashboard(ref_mdash,notif_origin){var ret=!0;if(void 0===ref_mdash)return!1;ref_mdash.state&&(wepsim_state_history_add(),wepsim_state_history_list());var notifications=ref_mdash.notify.length;return!(notifications>1)||(!!(ret=get_cfg("DBG_skip_notifycolon"))||(!!(ret=wepsim_check_getnotifyoptions(ref_mdash.notify[1])).skipme||("offcanvas"==ret.showas?wepsim_memdashboard_notify_offcanvas(ref_mdash,notif_origin,notifications,ret.skip1stline):wepsim_memdashboard_notify_dialogbox(ref_mdash,notif_origin,notifications,ret.skip1stline),wepsim_check_donotifyoptions(ret))))}function pack_ret2(p_ok,p_level,p_msg){return{ok:p_ok,msg_level:p_level,msg:p_msg}}function wepsim_execute_chunk(options,chunk){var ret2={},curr_firm=(simhw_internalState("MP"),simhw_internalState("FIRMWARE")),pc_name=simhw_sim_ctrlStates_get().pc.state,ref_pc=simhw_sim_state(pc_name),reg_pc=get_value(ref_pc),maddr_name=simhw_sim_ctrlStates_get().mpc.state,ref_maddr=simhw_sim_state(maddr_name),reg_maddr=get_value(ref_maddr),ref_mdash=null,fetch_maddr=0,i_clks=0,i=0;for(var k in fetch_maddr=0,curr_firm.labels_firm)"fetch"==curr_firm.labels_firm[k]&&(fetch_maddr=k);for(;i<chunk;){if(!1===(ret2=simcore_execute_microinstruction2(reg_maddr,reg_pc)).ok)return pack_ret2(!1,"Info",ret2.msg);if(i_clks++,options.cycles_limit>0&&i_clks>=options.cycles_limit)return pack_ret2(!1,"Info","WARNING: clock cycles limit reached in a single instruction.");if(reg_maddr=get_value(ref_maddr),reg_pc=get_value(ref_pc),!1===wepsim_check_memdashboard(ref_mdash=simhw_internalState_get("MC",reg_maddr),reg_maddr))return pack_ret2(!1,"","ERROR: microaddress not within defined control memory.");if(!0===wepsim_check_stopbybreakpoint(ref_mdash))return pack_ret2(!1,"Breakpoint","INFO: Microinstruction is going to be issue.");if(fetch_maddr==reg_maddr&&0==ref_mdash.is_native||fetch_maddr!=reg_maddr&&1==ref_mdash.is_native){if(!1===wepsim_check_memdashboard(ref_mdash=simhw_internalState_get("MP",reg_pc),reg_pc))return pack_ret2(!1,"Info","INFO: The program has finished because the PC register points outside .ktext/.text code segments");if(!0===wepsim_check_stopbybreakpoint(ref_mdash))return pack_ret2(!1,"Breakpoint","INFO: Instruction is going to be fetched.");i++,i_clks=0}}return pack_ret2(!0,"","INFO: number of instruction executed: "+i+" (limited to "+options.instruction_limit+")")}function wepsim_execute_chunk_atlevel(chunk,wepsim_execute_stop){var options={},ret=!1;if("instruction"!==get_cfg("DBG_level"))return 0==(ret=wepsim_execute_chunk(options={verbosity:0,cycles_limit:get_cfg("DBG_limitick")},chunk)).ok&&""!=ret.msg.trim()&&(wepsim_show_stopbyevent(ret.msg_level,ret.msg),wepsim_execute_stop()),ret.ok;simhw_internalState("FIRMWARE");var pc_name=simhw_sim_ctrlStates_get().pc.state,ref_pc=simhw_sim_state(pc_name),maddr_name=simhw_sim_ctrlStates_get().mpc.state;simhw_sim_state(maddr_name);options={verbosity:0,cycles_limit:get_cfg("DBG_limitick")},ret=!1;for(var reg_pc=0,i=0;i<chunk;i++){if(!1===(ret=simcore_execute_microprogram(options)).ok)return wepsim_show_stopbyevent("Info",ret.msg),wepsim_execute_stop(),!1;if(reg_pc=get_value(ref_pc),!0===(ret=wepsim_check_stopbybreakpoint(simhw_internalState_get("MP",reg_pc))))return wepsim_show_stopbyevent("Breakpoint","Instruction is going to be fetched."),wepsim_execute_stop(),!1}return!0}var max_turbo=5;function wepsim_reset_max_turbo(){max_turbo=5}function wepsim_execute_chainplay(wepsim_execute_stop){var t0=1,t1=1;if(DBG_stop)wepsim_execute_stop();else{var turbo=1;get_cfg("DBG_delay")<100&&(turbo=Math.trunc(max_turbo)),5===max_turbo&&(t0=performance.now());var ret=wepsim_execute_chunk({verbosity:0,cycles_limit:get_cfg("DBG_limitick")},turbo);if(0!=ret.ok){5===max_turbo&&(t1=performance.now()),5===max_turbo&&(max_turbo=5e3/(t1-t0)+1),DBG_limit_instruction+=turbo;var dbg_limit_ins=get_cfg("DBG_limitins");if(DBG_limit_instruction>dbg_limit_ins&&dbg_limit_ins>0)return wepsim_show_stopbyevent("Limit","Number of executed instructions limit reached.<br><br>See related configuration options about limits:<br><img height='100vw' src='./images/simulator/simulator018.jpg'>"),void wepsim_execute_stop();wait_uievents_and_settimeout(function(){wepsim_execute_chainplay(wepsim_execute_stop)},1)}else""!=ret.msg.trim()&&(wepsim_show_stopbyevent(ret.msg_level,ret.msg),wepsim_execute_stop())}}
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
 */function wepsim_notify_show_notify(ntf_title,ntf_message,ntf_type,ntf_delay){var ac=$("#alerts-container");0===ac.length&&(ac=$('<div id="alerts-container"      class="col-10 offset-1  col-md-8 offset-md-2  col-lg-6 offset-lg-3"      style="position:fixed; top:10%; z-index:1024;">'),$("body").append(ac));var ale1_div_class="alert alert-"+ntf_type+" shadow border border-tertiary",btn1=$('<button type="button" class="btn-close border border-secondary float-end alert-dismissible" onclick="wepsim_notify_close(); return false;">'),alert1=$('<div class="'+ale1_div_class+'">');ac.prepend(alert1.append(btn1.append("")).append(ntf_message)),0!=ntf_delay&&window.setTimeout(function(){alert1.alert("close")},ntf_delay);var msg="Notification type "+ntf_type+" and title "+ntf_title+":"+ntf_message+". ";msg=$("</p>").html(msg).text(),simcore_voice_speak(msg)}function wepsim_notify_do_notify(ntf_title,ntf_message,ntf_type,ntf_delay){if("undefined"==typeof document)return simcore_notifications_add(ntf_title,ntf_message,ntf_type,ntf_delay),console.log(" *********************"),console.log(" Notification type '"+ntf_type+"' and title '"+ntf_title+"': "+ntf_message+"."),console.log(" *********************"),console.trace(),void console.log(" *********************");var title_text=$("<p>").html(ntf_title).text(),mesg_text=$("<p>").html(ntf_message).text();simcore_notifications_add(title_text,mesg_text,ntf_type,ntf_delay),wepsim_notify_show_notify(ntf_title,ntf_message,ntf_type,ntf_delay)}function wepsim_notify_success(ntf_title,ntf_message){return wepsim_notify_do_notify(ntf_title,ntf_message,"success",get_cfg("NOTIF_delay"))}function wepsim_notify_error(ntf_title,ntf_message){return wepsim_notify_do_notify(ntf_title,ntf_message,"danger",0)}function wepsim_notify_warning(ntf_title,ntf_message){return wepsim_notify_do_notify(ntf_title,ntf_message,"warning",get_cfg("NOTIF_delay"))}function wepsim_notify_close(){$(".alert").alert("close"),simcore_record_append_new("Close all notifications","wepsim_notify_close();\n")}
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
 */function wepsim_mode_getBaseMode(derive_model){return null==derive_model||ws_info.modes_ep.includes(derive_model)?"ep":ws_info.modes_ep2.includes(derive_model)?"ep2":derive_model}function wepsim_mode_change(optValue){var bm=wepsim_mode_getBaseMode(optValue),hwid=simhw_getIdByName(bm);-1!=hwid&&wepsim_activehw(hwid);var eset_name=get_cfg("ws_examples_set");return wepsim_example_load("Empty"!=eset_name?eset_name:ws_info.default_example[optValue]),wepsim_activeview("extra_mcode",!0),optValue.startsWith("asm_")||optValue.startsWith("ep2_asm_")?(wepsim_activeview("extra_mcode",!1),load_from_example_firmware(ws_info.default_example[optValue],!1),!0):"intro"==optValue?(wsweb_recordbar_show(),wepsim_checkpoint_loadExample("tutorial_2.txt"),!0):"newbie"!=optValue||(wepsim_newbie_tour("tour2"),!0)}
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
 */function share_information(info_shared,share_title,share_text,share_url){if(void 0!==navigator.share)return share_uri(info_shared,share_title,share_text,share_url);wsweb_dlg_alert('<div id="qrcode1" class="mx-auto"></div><br>You can use the following link:<br><textarea id="qrcode2" class="form-control" row="5"           style="width: 100%; height:100%"          onclick="navigator.clipboard.writeText(this.value);">'+share_url+'</textarea><span class="btn btn-sm btn-success"       onclick="var c = document.getElementById(\'qrcode2\').value;               navigator.clipboard.writeText(c);">Copy to clipboard</span><br>');try{$("#qrcode1").html("You can use the following QR-code:<br>");var qrcode=new QRCode("qrcode1");qrcode.clear(),qrcode.makeCode(share_url)}catch(e){$("#qrcode1").html("")}return!0}function share_as_uri(share_eltos){var url_to_share="";try{if(url_to_share=get_cfg("base_url")+"?mode="+get_cfg("ws_mode"),share_eltos.includes("mc")&&(url_to_share=url_to_share+"&mc="+LZString.compressToEncodedURIComponent(inputfirm.getValue())),share_eltos.includes("asm")&&(url_to_share=url_to_share+"&asm="+LZString.compressToEncodedURIComponent(inputasm.getValue())),share_eltos.includes("cache")){for(var cm_cfg=[],curr_cfg=simhw_internalState("CM_cfg"),i=0;i<curr_cfg.length;i++){var cm_cfg_i={cfg:curr_cfg[i].cfg};cm_cfg.push(cm_cfg_i)}json_enc=JSON.stringify(cm_cfg),url_to_share=url_to_share+"&cache="+LZString.compressToEncodedURIComponent(json_enc)}}catch(e){url_to_share=""}return url_to_share}function load_from_uri(url_to_share){var elto_shared={asm:null,mc:null,cmc:null};try{for(var a=url_to_share.split("&"),i=1;i<a.length;i++){var b=a[i].split("=");if("asm"==b[0]&&(elto_shared.asm=LZString.decompressFromEncodedURIComponent(b[1]),null!=elto_shared.asm&&inputasm.setValue(elto_shared.asm)),"mc"==b[0]&&(elto_shared.mc=LZString.decompressFromEncodedURIComponent(b[1]),null!=elto_shared.mc&&inputfirm.setValue(elto_shared.mc)),"cache"==b[0]){elto_shared.cmc=LZString.decompressFromEncodedURIComponent(b[1]);var cm_cfg=JSON.parse(elto_shared.cmc),cm=cache_memory_init_cm(cm_cfg);simhw_internalState_reset("CM_cfg",cm_cfg),simhw_internalState_reset("CM",cm),wepsim_show_cache_memory_config()}}}catch(e){console.log("ERROR on load_from_uri: "+e+"\n")}return elto_shared}function share_uri(info_shared,share_title,share_text,share_url){var data={};data.title=share_title,data.text=share_text,data.url=share_url;try{navigator.share(data)}catch(err){wsweb_dlg_alert("Sorry, unsuccessful share: "+err.message)}return simcore_ga("ui","ui.share","ui.share."+info_shared),!0}
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
 */function wsweb_dlg_open(dialog_obj){if("object"!=typeof dialog_obj)return null;var ext_dlg_obj={title:dialog_obj.title(),message:dialog_obj.body(),value:dialog_obj.value,scrollable:!0,size:dialog_obj.size,centerVertical:!0,backdrop:!0,onEscape:!0,keyboard:!0,animate:!1,onShow:function(){dialog_obj.onshow();var ws_idiom=get_cfg("ws_idiom");i18n_update_tags("dialogs",ws_idiom),i18n_update_tags("gui",ws_idiom),setTimeout(wepsim_tooltips_closeAll,500)},buttons:dialog_obj.buttons},d1=bootbox.dialog(ext_dlg_obj);return d1.init(function(){d1.attr("id",dialog_obj.id)}),d1.one("hidden.bs.modal",function(){wsweb_dialog_close(dialog_obj)}),d1.find(".modal-header").addClass("bg-body-secondary"),d1.find(".modal-footer").addClass("bg-body-secondary"),d1.find(".modal-title").addClass("mx-auto"),d1.find(".bootbox-close-button").addClass("mx-1 btn-close border-0"),d1.modal("handleUpdate"),d1.modal("show"),d1}function wsweb_dlg_close(dialog_obj){if("object"!=typeof dialog_obj)return null;var d1=$("#"+dialog_obj.id);return d1.modal("hide"),d1}function wsweb_dlg_alert(msg){var a_obj={title:'<i class="fas fa-exclamation"></i> <span data-langkey="Alert">Alert</span>',message:'<div class="p-2">'+msg+"</div>",scrollable:!0,centerVertical:!0,backdrop:!0,onEscape:!0,keyboard:!0,animate:!1,buttons:{cancel:{label:'<i class="fa fa-times me-2"></i><span data-langkey="Close">Close</span>',className:"btn btn-primary btn-sm col col-sm-3 float-right shadow-none"}},size:""},d1=bootbox.dialog(a_obj);return d1.find(".modal-header").addClass("bg-body-secondary"),d1.find(".modal-footer").addClass("bg-body-secondary"),d1.find(".modal-title").addClass("ml-auto"),d1.modal("handleUpdate"),d1.modal("show"),d1}
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
 */function wepsim_example_reset(){ws_info.examples=[],ws_info.example_active=-1,webui_toolbar_updateExampleSet()}function wepsim_example_load(e_name){var jobj=null;ws_info.examples=[];for(var i=0;i<ws_info.example_set.length;i++)0!=ws_info.example_set[i].aliases.includes(e_name)&&void 0!==ws_info.example_set[i].url&&(jobj=wepsim_url_getJSON(ws_info.example_set[i].url),ws_info.examples=ws_info.examples.concat(jobj),ws_info.example_active=i,set_cfg("ws_examples_set",e_name));return webui_toolbar_updateExampleSet(),ws_info.examples}function wepsim_example_loadSet(url_example_set,set_name){return ws_info.example_set=wepsim_url_getJSON(url_example_set),ws_info.example_set}function wepsim_example_getSet(){return ws_info.example_set}function example_id2hash(example_id){var eltos={sample_hw:"",sample_mc:"",sample_asm:""},sid=example_id.split(":");return sid.length>0?eltos.sample_hw=sid[0]:console.log("warning: example without hardware id\n * example  id: "+example_id+"\n * expected id: *ep*:microcode_X:assembly_Y\n"),sid.length>1?eltos.sample_mc=sid[1]+".mc":console.log("warning: example without microcode id\n * example  id: "+example_id+"\n * expected id: ep:*microcode_X*:assembly_Y\n"),sid.length>2?eltos.sample_asm=sid[2]+".asm":console.log("warning: example without assembly id\n * example  id: "+example_id+"\n * expected id: ep:microcode_X:*assembly_Y*\n"),eltos}function load_from_example_assembly(example_id,chain_next_step){if(-1!=ws_info.example_active){inputasm.setValue("Please wait..."),inputasm.refresh();var eltos=example_id2hash(example_id);wepsim_load_from_url(ws_info.example_set[ws_info.example_active].url_base_asm+"/"+eltos.sample_asm,function(mcode){inputasm.setValue(mcode),inputasm.refresh();var ok=!1;0!==get_simware().firmware.length&&(ok=wepsim_compile_assembly(mcode),inputasm.is_compiled=ok),!1!==ok?(!0===chain_next_step&&setTimeout(function(){wsweb_change_workspace_simulator()},50),setTimeout(function(){show_memories_values()},500),wepsim_notify_success("<strong>INFO</strong>","Example ready to be used.")):wsweb_change_workspace_assembly()}),simcore_record_append_new("Load assembly from example "+example_id,'load_from_example_assembly("'+example_id+'", '+chain_next_step+");\n"),simcore_ga("example","example.assembly","example.assembly."+eltos.sample_hw+"."+eltos.sample_asm)}else ws_alert("Warning: no active example set by default.\nPlease select your examples first.")}function load_from_example_firmware(example_id,chain_next_step){if(-1!=ws_info.example_active){inputfirm.setValue("Please wait..."),inputfirm.refresh(),inputfirm.setOption("readOnly",!1);var eltos=example_id2hash(example_id);wepsim_load_from_url(ws_info.example_set[ws_info.example_active].url_base_mc+"/"+eltos.sample_mc,function(mcode){inputfirm.setValue(mcode),inputfirm.refresh();var ok=wepsim_compile_firmware(mcode);inputfirm.is_compiled=ok,!1!==ok?(wepsim_show_rf_names(),!0===chain_next_step?setTimeout(function(){load_from_example_assembly(example_id,chain_next_step)},50):(setTimeout(function(){show_memories_values(),asmdbg_update_assembly()},50),wepsim_notify_success("<strong>INFO</strong>","Example ready to be used."))):wsweb_change_workspace_microcode()}),simcore_record_append_new("Load firmware from example "+example_id,'load_from_example_firmware("'+example_id+'", false);\n'),simcore_ga("example","example.firmware","example.firmware."+eltos.sample_hw+"."+eltos.sample_mc)}else ws_alert("Warning: no active example set by default.\nPlease select your examples first.")}function share_example(m,base_url){var e_description=ws_info.examples[m].description;e_description=e_description.replace(/<[^>]+>/g,"");var e_id=ws_info.examples[m].id;return share_information("example_"+m,"WepSIM example "+e_id+"...","This is a link to the WepSIM example "+e_id+" ("+e_description+"):\n",base_url+"?mode="+ws_info.examples[m].hardware+"&examples_set="+ws_info.example_set[ws_info.example_active].name+"&example="+m)}
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
 */function wepsim_help_set(type,ref){$("#help1_ref").attr("components",type+":"+ref),simcore_record_append_new("Update help content",'wepsim_help_set("'+type+'", "'+ref+'");\n')}function request_html_url(r_url){return!1===is_mobile()?navigator.onLine?fetch(r_url):caches.match(r_url).then():$.ajax(r_url,{type:"GET",dataType:"html"})}function update_div_frompartialhtml(helpdiv,key,data){var default_content="<br>Sorry, No more details available for this element.<p>\n";if(""===data?$(helpdiv).html(default_content):$(helpdiv).html(data),""!==data&&""!==key&&"#"!==key){var help_content=$(helpdiv).filter(key).html();void 0===help_content&&(help_content=$(helpdiv).find(key).html()),void 0===help_content&&(help_content=default_content),$(helpdiv).html(help_content)}}function resolve_html_url(helpdiv,r_url,key,update_div){return request_html_url(r_url).then(function(data){"object"==typeof data?data.text().then(function(res){update_div_frompartialhtml(helpdiv,key,res),update_div()}):(update_div_frompartialhtml(helpdiv,key,data),update_div())})}function update_signal_loadhelp(helpdiv,simhw,key){var curr_idiom=get_cfg("ws_idiom");resolve_html_url(helpdiv,"repo/hardware/"+simhw+"/help/signals-"+curr_idiom+".html","#"+key,function(){$(helpdiv).trigger("create")}),simcore_ga("help","help.signal","help.signal."+simhw+"."+key)}function update_checker_loadhelp(helpdiv,key){var curr_idiom=get_cfg("ws_idiom");resolve_html_url(helpdiv,"help/simulator-"+curr_idiom+".html","#"+key,function(){$(helpdiv).trigger("create")}),simcore_ga("help","help.checker","help.checker."+key)}
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
 */function sim_tutorial_goframe(tutorial_name,from_step,to_step){var tutorial=ws_info.tutorials[tutorial_name];void 0!==tutorial&&(tutorial[from_step].code_post(),"undefined"!=typeof tutbox&&tutbox.modal("hide"),setTimeout(function(){sim_tutorial_showframe(tutorial_name,to_step)},tutorial[from_step].wait_next),simcore_voice_canSpeak()&&window.speechSynthesis.cancel())}function sim_tutorial_cancelframe(){var ws_mode=get_cfg("ws_mode");wsweb_select_main(ws_mode),tutbox.modal("hide"),simcore_voice_canSpeak()&&window.speechSynthesis.cancel()}function sim_tutorial_showframe(tutorial_name,step){var tutorial=ws_info.tutorials[tutorial_name];if(void 0!==ws_info.tutorials&&step!=tutorial.length&&!(step<0)){simcore_ga("help","help.tutorial","help.tutorial="+tutorial_name+",step="+step),tutorial[step].code_pre();var wsi=get_cfg("ws_idiom"),bbbt={};bbbt.cancel={label:i18n_get("gui",wsi,"Disable tutorial mode"),className:"btn-danger col float-right",callback:function(){sim_tutorial_cancelframe()}},0!=step&&(bbbt.prev={label:i18n_get("gui",wsi,"Prev."),className:"btn-success col float-right",callback:function(){sim_tutorial_goframe(tutorial_name,step,step-1)}}),step!=tutorial.length-1?bbbt.next={label:i18n_get("gui",wsi,"Next"),className:"btn-success col float-right",callback:function(){sim_tutorial_goframe(tutorial_name,step,step+1)}}:bbbt.end={label:i18n_get("gui",wsi,"End"),className:"btn-success col float-right",callback:function(){sim_tutorial_goframe(tutorial_name,step,step+1)}},tutbox=bootbox.dialog({title:tutorial[step].title,message:tutorial[step].message,buttons:bbbt,size:"large",animate:!1}),simcore_voice_speak(tutorial[step].title.replace(/<[^>]*>/g,"")+". "+tutorial[step].message.replace(/<[^>]*>/g,"")),i18n_update_tags("tutorial_"+tutorial_name)}}
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
 */ws_info.modes=["ep","ep2","rv","poc","newbie","intro","asm_mips","asm_rv32","asm_z80","ep2_asm_mips","ep2_asm_rv32","ep2_asm_z80"],ws_info.default_example={ep:"Default-MIPS",ep2:"Default-RISCV",poc:"Default-MIPS",rv:"Default-RISCV",rvpipe:"Default-RISCV",asm_mips:"ep:ep_mix1_l3:mips_s4e1",asm_rv32:"ep:ep_js1_l10:rv32_s7e2",asm_z80:"ep:ep_js1_l3:z80_s7e3",ep2_asm_mips:"ep2:ep2_sig1_l10:mips_s4e1",ep2_asm_rv32:"ep2:ep2_sig1_l10:rv32_s7e2",ep2_asm_z80:"ep2:ep2_js2_l3:z80_s7e3"},ws_info.modes_ep=["newbie","intro","asm_mips","asm_rv32","asm_z80"],ws_info.modes_ep2=["newbie","intro","ep2_asm_mips","ep2_asm_rv32","ep2_asm_z80"],ws_info.examples=[],ws_info.example_set=[{name:"Empty",url:"",url_base_asm:"",url_base_mc:""}],ws_info.example_active=-1,ws_info.help=[{id:"simulator",title:"Execute example",u_type:"tutorial",u_class:"",reference:"wsweb_dialog_close('help'); wsweb_recordbar_show(); wepsim_checkpoint_loadExample('tutorial_2.txt') ; setTimeout(wsweb_record_play, 1000);",description:"<span data-langkey='help_01_03'>Play the execute example tutorial</span>.<br>"},{id:"simulator",title:"Welcome tutorial",u_type:"tutorial",u_class:"",reference:"wsweb_dialog_close('help'); sim_tutorial_showframe('welcome', 0);",description:"<span data-langkey='help_01_01'>Open the welcome tutorial</span>.<br>"},{id:"simulator",title:"Simple usage tutorial",u_type:"tutorial",u_class:"",reference:"wsweb_dialog_close('help'); sim_tutorial_showframe('simpleusage', 0);",description:"<span data-langkey='help_01_02'>Open the simple usage tutorial, for microprogramming and assembly programming</span>.<br>"},{id:"simulator",title:"Simulator: firmware",u_type:"simulator",u_class:"wsx_microcode",reference:"wepsim_help_set('relative', 'simulator#help_simulator_firmware');",description:"<span data-langkey='help_02_01'>How to work with the firmware to be loaded into the control memory</span>.<br>"},{id:"microcode",title:"Microcode format",u_type:"simulator",u_class:"wsx_microcode",reference:"wepsim_help_set('relative', 'simulator#help_firmware_format');",description:"<span data-langkey='help_02_02'>Syntax of the microcode used</span>.<br>"},{id:"simulator",title:"Simulator: assembly",u_type:"simulator",u_class:"",reference:"wepsim_help_set('relative', 'simulator#help_simulator_assembly');",description:"<span data-langkey='help_02_03'>How to work with the assembly that use the aforementioned firmware</span>.<br>"},{id:"assembly",title:"Assembly format",u_type:"simulator",u_class:"",reference:"wepsim_help_set('relative', 'simulator#help_assembly_format');",description:"<span data-langkey='help_02_04'>Syntax of the assembly elements</span>.<br>"},{id:"simulator",title:"Simulator: execution",u_type:"simulator",u_class:"",reference:"wepsim_help_set('relative', 'simulator#help_simulator_execution');",description:"<span data-langkey='help_02_05'>How the simulator can execute the assembly and firmware</span>.<br>"},{id:"simulator",title:"Simulator: states",u_type:"simulator",u_class:"",reference:"wepsim_help_set('relative', 'simulator#help_dumper');",description:"<span data-langkey='help_02_06'>How the simulator can show the current state, and the difference between two states</span>.<br>"},{id:"architecture",title:"Simulated architecture",u_type:"simulated processor",u_class:"",reference:"wepsim_help_set('absolute', 'hardware');",description:"<span data-langkey='help_03_01'>Description of the simulated processor architecture</span>.<br>"},{id:"architecture",title:"Simulated signals",u_type:"simulated processor",u_class:"wsx_microcode",reference:"wepsim_help_set('absolute', 'signals');",description:"<span data-langkey='help_03_02'>Main signals summary of the simulated elemental processor</span>.<br>"},{id:"architecture",title:"Hardware summary",u_type:"simulated processor",u_class:"wsx_microcode",reference:"wepsim_help_set('code', 'hardware_summary');",description:"<span data-langkey='help_03_03'>Reference card for the simulated elemental processor hardware</span>.<br>"},{id:"architecture",title:"Assembly summary",u_type:"simulated processor",u_class:"",reference:"wepsim_help_set('code', 'assembly_summary');",description:"<span data-langkey='help_03_04'>Reference card for the simulated elemental processor instruction set</span>.<br>"},{id:"about",title:"License, platforms, etc.",u_type:"info",u_class:"",reference:"wepsim_help_set('relative', 'about#help_about');",description:"<span data-langkey='help_04_01'>WepSIM license, supported platforms, technologies used</span>.<br>"},{id:"wepsim_team",title:"WepSIM Team",u_type:"info",u_class:"",reference:"wsweb_dialog_close('help'); wsweb_dialog_open('about');",description:"<span data-langkey='help_04_02'>WepSIM Team</span>.<br>"}],
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
ws_info.tutorials={},ws_info.tutorials.welcome=[{id:"welcome",title:"<span data-langkey='title_0'>title 0</span>",message:"<span data-langkey='message_0'>message 0</span>",code_pre:simcore_do_nothing_handler,code_post:simcore_do_nothing_handler,wait_next:100},{id:"welcome",title:"<span data-langkey='title_1'>title 1</span>",message:"<span data-langkey='message_1'>message 1</span>",code_pre:simcore_do_nothing_handler,code_post:simcore_do_nothing_handler,wait_next:100},{id:"welcome",title:"<span data-langkey='title_2'>title 2</span>",message:"<span data-langkey='message_2'>message 2</span>",code_pre:simcore_do_nothing_handler,code_post:simcore_do_nothing_handler,wait_next:100},{id:"welcome",title:"<span data-langkey='title_3'>title 3</span>",message:"<span data-langkey='message_3'>message 3</span>",code_pre:simcore_do_nothing_handler,code_post:simcore_do_nothing_handler,wait_next:100},{id:"welcome",title:"<span data-langkey='title_4'>title 4</span>",message:"<span data-langkey='message_4'>message 4</span>",code_pre:simcore_do_nothing_handler,code_post:simcore_do_nothing_handler,wait_next:100},{id:"welcome",title:"<span data-langkey='title_5'>title 5</span>",message:"<span data-langkey='message_5'>message 5</span>",code_pre:function(){},code_post:function(){load_from_example_firmware("ep:mips/ep_sig1_base:mips/s1e1",!0)},wait_next:100}],
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
ws_info.tutorials.simpleusage=[{id:"simpleusage",title:"<span data-langkey='title_0'>title 0</span>",message:"<span data-langkey='message_0'>message 0</span>",code_pre:simcore_do_nothing_handler,code_post:simcore_do_nothing_handler,wait_next:100},{id:"simpleusage",title:"<span data-langkey='title_1'>title 1</span>",message:"<span data-langkey='message_1'>message 1</span>",code_pre:simcore_do_nothing_handler,code_post:simcore_do_nothing_handler,wait_next:100},{id:"simpleusage",title:"<span data-langkey='title_2'>title 2</span>",message:"<span data-langkey='message_2'>message 2</span>",code_pre:simcore_do_nothing_handler,code_post:simcore_do_nothing_handler,wait_next:100},{id:"simpleusage",title:"<span data-langkey='title_3'>title 3</span>",message:"<span data-langkey='message_3'>message 3</span>",code_pre:simcore_do_nothing_handler,code_post:simcore_do_nothing_handler,wait_next:100},{id:"simpleusage",title:"<span data-langkey='title_4'>title 4</span>",message:"<span data-langkey='message_4'>message 4</span>",code_pre:simcore_do_nothing_handler,code_post:simcore_do_nothing_handler,wait_next:100},{id:"simpleusage",title:"<span data-langkey='title_5'>title 5</span>",message:"<span data-langkey='message_5'>message 5</span>",code_pre:simcore_do_nothing_handler,code_post:simcore_do_nothing_handler,wait_next:100}],
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
ws_info.tours={};var ws_tour=null,ws_tour_name="tour1";function wepsim_newbie_tour(tour_name){var newbie_tour1=ws_info.tours[tour_name];if(void 0!==newbie_tour1){var ws_idiom=get_cfg("ws_idiom");wepsim_newbie_tour_setLang(tour_name,ws_idiom),(ws_tour=introJs.tour()).setOptions({steps:newbie_tour1,keyboardNavigation:!0,tooltipClass:"tooltip-large",showProgress:!0,showStepNumbers:!0,scrollToElement:!0,nextLabel:i18n_get("gui",ws_idiom,"Next"),prevLabel:i18n_get("gui",ws_idiom,"Prev."),overlayOpacity:"0.2"}),ws_tour.onbeforechange(function(){newbie_tour1[this.currentStep()].do_before()}),ws_tour.onexit(function(){return $("#help1").modal("hide"),wsweb_dialog_close("examples"),wsweb_dialog_close("config"),"ep"!=get_cfg("ws_mode")&&wsweb_select_main("ep"),!0}),ws_tour_name=tour_name,ws_tour.start(),simcore_ga("ui","ui.tour","ui.tour.newbie")}}function wepsim_newbie_tour_setLang(tour_name,lang){var newbie_tour1=ws_info.tours[tour_name];if(void 0!==newbie_tour1)for(var step="",i=0;i<newbie_tour1.length;i++)""!==(step=newbie_tour1[i].step)&&(newbie_tour1[i].intro=i18n.eltos.tour_intro[lang][step])}function wepsim_newbie_tour_reload(lang){set_cfg("ws_idiom",lang),save_cfg(),i18n_update_tags("gui")}
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
function wepsim_voice_init(){return!!annyang&&(annyang.addCommands(ws_info.voice_commands),annyang.addCallback("errorNetwork",function(){annyang.abort(),alert("Sorry but some network connection is needed in order to use the voice recognition engine.")}),SpeechKITT.annyang(),SpeechKITT.setStylesheet("external/speechkitt/themes/flat.css"),SpeechKITT.setInstructionsText("What can I help you with? (list)"),SpeechKITT.vroom(),!0)}function wepsim_voice_start(){return annyang?(SpeechKITT.show(),!0):(wepsim_notify_error("<h4>Warning:<br/>annyang not available</h4>","Voice support is not available in this platform."),!1)}function wepsim_voice_stop(){return!!annyang&&(SpeechKITT.hide(),!0)}
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
 */ws_info.tours.tour1=[{title:"WepSIM",intro:i18n_get_welcome(),step:"",position:"auto",do_before:function(){return!0}},{title:"WepSIM",intro:"<span data-langkey='step1'>Step 1</span>",step:"step1",position:"auto",do_before:function(){return ws_tour.refresh(),!0}},{title:"WepSIM",element:"#select4",intro:"<span data-langkey='step2'>Step 2</span>",step:"step2",position:"auto",do_before:function(){return wsweb_select_main("ep"),ws_tour.refresh(),!0}},{title:"WepSIM",element:"#btn_help1",intro:"<span data-langkey='step3'>Step 3</span>",step:"step3",position:"auto",do_before:function(){return ws_tour.refresh(),!0}},{title:"WepSIM",element:"#btn_example1",intro:"<span data-langkey='step4'>Step 4</span>",step:"step4",position:"auto",do_before:function(){return ws_tour.refresh(),!0}},{title:"WepSIM",element:"#btn_cfg1",intro:"<span data-langkey='step5'>Step 5</span>",step:"step5",position:"auto",do_before:function(){return ws_tour.refresh(),!0}},{title:"WepSIM",intro:"<span data-langkey='step6'>Step 6</span>",step:"step6",position:"auto",do_before:function(){return ws_tour.refresh(),!0}}],ws_info.tours.tour2=[{title:"WepSIM",intro:i18n_get_welcome(),step:"",position:"auto",do_before:function(){return wsweb_select_main("ep"),ws_tour.refresh(),!0}},{title:"WepSIM",element:"#btn_help1",intro:"<span data-langkey='step3'>Step 3</span>",step:"step3",position:"auto",do_before:function(){return ws_tour.refresh(),!0}},{title:"WepSIM",element:"#btn_cfg1",intro:"<span data-langkey='step5'>Step 5</span>",step:"step5",position:"auto",do_before:function(){return ws_tour.refresh(),!0}},{title:"WepSIM",intro:"<span data-langkey='step6'>Step 6</span>",step:"step6",position:"auto",do_before:function(){return ws_tour.refresh(),!0}}],ws_info.voice_commands={};var wepsim_voice_dialog=null;function sim_core_breakpointicon_get(icon_name){var icon_obj=null;return void 0===(icon_obj=ws_info.breakpoint_icon_list[icon_name])&&(icon_name="classic",icon_obj=ws_info.breakpoint_icon_list[icon_name]),"<img alt='stop icon' height=22      class='"+icon_obj.addclass+"'      src='images/stop/stop_"+icon_name+".gif'>"}ws_info.voice_commands.hello=function(){simcore_voice_speak("Hello, I am WepSIM, nice to meet you. ")},ws_info.voice_commands["(show) configuration"]=function(){wsweb_dialog_open("config")},ws_info.voice_commands["(show) examples"]=function(){wsweb_dialog_open("examples")},ws_info.voice_commands["load example :mc_name (from) :asm_name"]=function(mc_name,asm_name){load_from_example_firmware("ep:"+mc_name+":"+asm_name,!0)},ws_info.voice_commands["(show) help"]=function(){wsweb_dialog_open("help")},ws_info.voice_commands.close=function(){wsweb_dialog_close("help"),wsweb_dialog_close("config"),wsweb_dialog_close("examples"),null!==wepsim_voice_dialog&&wepsim_voice_dialog.modal("hide")},ws_info.voice_commands.reset=function(){wepsim_execute_reset(!0,!0);simcore_voice_speak("Current processor has been reset.")},ws_info.voice_commands.next=function(){wepsim_execute_instruction();simcore_voice_speak("Next executed.")},ws_info.voice_commands["next micro(instruction)"]=function(){wepsim_execute_microinstruction();simcore_voice_speak("Next microinstruction executed. ")},ws_info.voice_commands.play=function(){wepsim_execute_play()},ws_info.voice_commands.stop=function(){wepsim_execute_stop()},ws_info.voice_commands["describe micro(instruction)"]=function(){var msg=get_verbal_from_current_mpc();simcore_voice_speak(msg)},ws_info.voice_commands["describe instruction"]=function(){var msg=get_verbal_from_current_pc();simcore_voice_speak(msg)},ws_info.voice_commands.list=function(){var vc_list="available commands:<br>";for(var vc in ws_info.voice_commands)vc_list=vc_list+" * '"+vc+"'<br>";(wepsim_voice_dialog=bootbox.alert(vc_list)).modal("show");var msg=$("</p>").html(vc_list).text();simcore_voice_speak(msg)},ws_info.voice_commands.silence=function(){simcore_voice_stopSpeak()},
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
ws_info.breakpoint_icon_list={classic:{type:"classic",addclass:"no-dark-mode",origin:"https://www.optikunde.de/farbe/rot.php"},pushpin:{type:"classic",addclass:"no-dark-mode",origin:"http://clipart-library.com/red-push-pin.html"},cat1:{type:"pets",addclass:"no-dark-mode",origin:""},dog1:{type:"pets",addclass:"no-dark-mode",origin:""},halloween1:{type:"halloween",addclass:"no-dark-mode",origin:"https://es.vexels.com/svg-png/halloween/"},halloween2:{type:"halloween",addclass:"no-dark-mode",origin:"https://es.vexels.com/png-svg/vista-previa/153871/casa-de-halloween-de-miedo"},xmas1:{type:"christmas",addclass:"",origin:"https://week-of-icons-2018.netlify.com/data/5/animations/1.gif"},xmas2:{type:"christmas",addclass:"",origin:"https://week-of-icons-2018.netlify.com/data/5/animations/3.gif"},xmas3:{type:"christmas",addclass:"",origin:"https://peaceartsite.com/images/stained-glass-snowy-peace-t.gif"},r2d2:{type:"star wars",addclass:"",origin:"https://imgur.com/gallery/gKSmy"},sw:{type:"star wars",addclass:"",origin:"https://i2.wp.com/icons.iconarchive.com/icons/sensibleworld/starwars/1024/Death-Star-icon.png"},bb8:{type:"star wars",addclass:"no-dark-mode",origin:""},vader1:{type:"star wars",addclass:"",origin:""},ds1:{type:"star wars",addclass:"",origin:"https://media0.giphy.com/media/SVhnmDDdOzrZC/source.gif"},lotr4:{type:"lotr",addclass:"no-dark-mode",origin:"http://www.cinecollectibles.com/gentle-giant-c-1_62.html"},lotr2:{type:"lotr",addclass:"no-dark-mode",origin:"https://www.forbes.com/sites/adrianbridgwater/2016/01/15/microsoft-r-one-big-data-tool-to-rule-them-all/"},lotr6:{type:"lotr",addclass:"no-dark-mode",origin:"https://pm1.narvii.com/5903/f831ee80d012b8a8ba7156c39505cc4824889901_128.jpg"},hp1:{type:"harry potter",addclass:"no-dark-mode",origin:"http://www.logosclicks.com/logos/harry-potter-name-logo-46a93c.html"},hp2:{type:"harry potter",addclass:"no-dark-mode",origin:"https://www.flaticon.com/free-icon/harry-potter_86485"},hp3:{type:"harry potter",addclass:"no-dark-mode",origin:"https://lafrikileria.com/es/cosas-de-harry-potter-regalos/20569-funko-pop-patronus-harry-potter-889698469944.html"},super:{type:"films",addclass:"no-dark-mode",origin:"https://worldvectorlogo.com/logo/superman-3"},batman:{type:"films",addclass:"",origin:"http://getwallpapers.com/collection/black-and-white-batman-wallpaper"},grail:{type:"films",addclass:"no-dark-mode",origin:"http://3png.com/a-31243892.html"},despicable:{type:"films",addclass:"no-dark-mode",origin:"https://www.helloforos.com/t/cerrado/350821/81"},t800b:{type:"films",addclass:"no-dark-mode",origin:"https://www.pngegg.com/en/png-buhsk"},t1000a:{type:"films",addclass:"no-dark-mode",origin:"https://i0.pngocean.com/files/328/174/569/the-terminator-sticker-t-1000-telegram-world-of-tanks-suren-mnatsakanyan-street.jpg"},mate1:{type:"cars",addclass:"no-dark-mode",origin:"https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2FzdjZlMGI4Z2Qwb2V6c2RlajV2eng4N2E0dmw5Z3pnM3AybWw2cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/tSUlOkeoYH5Pep0SAD/giphy.gif"},mate2:{type:"cars",addclass:"no-dark-mode",origin:"https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExem5yMDduZnd0dm8za2NobXliNWNqb21rOTZveXNqZTlqODBpazM0MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Fj0bSHCzyhYL0kTzWP/giphy.gif"},lightningmcqueen1:{type:"cars",addclass:"no-dark-mode",origin:"https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmxmb3gyNjJ3ZjE1aDI1dmExZjFobW1mZ25hZHR2OWVxZnB1eTR4MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/lOo1pIV7kKrWwecbs6/giphy.gif"},lightningmcqueen2:{type:"cars",addclass:"no-dark-mode",origin:"https://tenor.com/es/view/ka-chow-lightning-mcqueen-cars-oh-yeah-cars-on-the-road-gif-26641273.gif"}};