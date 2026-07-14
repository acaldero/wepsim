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

import { wepsim_notify_error } from './wepsim_notify.js';
import { ws_info } from '../sim_core/sim_adt_core.js';
import * as annyang from 'annyang';
import SpeechKITT from '../src/lib/speechkitt.js';

export function wepsim_voice_init ( )
{
     if (!annyang || !SpeechKITT) {
         return false ;
     }

     // SpeechKITT expects annyang as a global, not a module-scoped import
     window.annyang = annyang;

     annyang.addCommands(ws_info.voice_commands);
     annyang.addCallback('errorNetwork',
                         function () {
                             annyang.abort() ;
                             alert('Sorry but some network connection is needed in order to use the voice recognition engine.');
                         });

     SpeechKITT.annyang();
     SpeechKITT.setInstructionsText('What can I help you with? (list)');
     SpeechKITT.vroom();

     return true ;
}

export function wepsim_voice_start ( )
{
     if (!annyang) {
          wepsim_notify_error('<h4>Warning:<br/>' + 'annyang not available' + '</h4>',
                              'Voice support is not available in this platform.') ;
         return false ;
     }

     SpeechKITT.show();
     return true ;
}

export function wepsim_voice_stop ( )
{
     if (!annyang) {
         return false ;
     }

     SpeechKITT.hide();
     return true ;
}

