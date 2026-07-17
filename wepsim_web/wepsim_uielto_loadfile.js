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
import { dispatch, onClick } from './wepsim_web_actions.js';
import { wepsim_file_loadFrom } from '../wepsim_core/wepsim_url.js';
import { wepsim_notify_success } from '../wepsim_core/wepsim_notify.js';
import { wsweb_dialog_close } from './wepsim_web_api.js';
import { inputasm, inputfirm } from './wepsim_web_simulator.js';
import { load_from_uri } from '../wepsim_core/wepsim_share.js';
import { wepsim_checkpoint_load } from '../wepsim_core/wepsim_checkpoint.js';

export class ws_load_file extends HTMLElement
{
    static get observedAttributes()
    {
        return ['fid', 'jload'] ;
    }

    constructor ()
    {
        super();
    }

    update_internal_attributes ()
    {
        var fid = this.getAttribute('fid') ;
        if (fid === null)
            this.setAttribute('fid', 'id55') ;

        var jload = this.getAttribute('jload') ;
        if (jload === null)
            this.setAttribute('jload', '') ;
    }

    render (elto)
    {
        this.update_internal_attributes() ;

        var o1 = "<div class='card border-secondary h-100'>" +
            "<div class='card-header border-secondary text-white bg-secondary p-1'>" +
            " <h5 class='m-0'>" +
            " <span class='text-white bg-secondary' data-langkey='Input file'>Input file</span>" +
            " <button class='btn bg-body-tertiary mx-1 float-end py-0 col-auto' " +
            "         data-bind='click' data-action='load'><span data-langkey='Load'>Load</span></button>" +
            ' </h5>' +
            '</div>' +
            "<div class='card-body'>" +
            "  <label for='" + this.fid + "' class='collapse7'><em><span data-langkey='Load from this File'>Load from this File</span>:</em></label>" +
            "  <p><input aria-label='file to load' data-max-height='20vh' " +
            "            type='file' id='" + this.fid + "' class='dropify'/></p>" +
            '</div>' +
            '</div>' ;

        this.innerHTML = o1 ;

        $('.dropify').dropify() ;

        onClick('load', (el) =>
        {
            var loadFile = el.closest('ws-load-file');
            var loadLink = el.closest('ws-load-link');
            if (loadFile)
            {
                var fid        = loadFile.getAttribute('fid');
                var mode       = loadFile.getAttribute('data-mode');
                var dialogName = loadFile.getAttribute('data-dialog');
                if (mode === 'checkpoint')
                {
                    var ret = wepsim_checkpoint_load(fid);
                    if (ret)
                    {
                        if (dialogName) wsweb_dialog_close(dialogName);
                        wepsim_notify_success('<strong>INFO</strong>',
                                              'Processing load request...');
                    }
                    return;
                }
                var editorName = loadFile.getAttribute('data-editor') || 'inputasm';
                var ftl        = document.getElementById(fid).files[0];
                if (!ftl) return;
                var editor = (editorName === 'inputfirm') ? inputfirm : inputasm;
                wepsim_file_loadFrom(ftl, function(txt)
                {
                    editor.setValue(txt);
                    if (dialogName) wsweb_dialog_close(dialogName);
                    wepsim_notify_success('<strong>INFO</strong>', 'Loaded!.');
                });
            }
            else if (loadLink)
            {
                var fid        = loadLink.getAttribute('fid');
                var dialogName = loadLink.getAttribute('data-dialog');
                var elto       = document.getElementById(fid);
                load_from_uri(elto.value);
                if (dialogName) wsweb_dialog_close(dialogName);
                wepsim_notify_success('<strong>INFO</strong>', 'Loaded!.');
            }
        });
    }

    bindElements ()
    {
        this.addEventListener('click', (e) =>
        {
            const el = e.target.closest('[data-bind="click"]');
            if (!el) return;
            e.preventDefault();
            if (dispatch('click', el, this, e)) e.stopPropagation();
        });
    }

    connectedCallback ()
    {
        this.render(this) ;
        this.bindElements();
    }

    attributeChangedCallback (name, oldValue, newValue)
    {
        this.render(this) ;
    }

    get fid ()
    {
        return this.getAttribute('fid') ;
    }

    set fid (value)
    {
        this.setAttribute('fid', value) ;
    }

    get jload ()
    {
        return this.getAttribute('jload') ;
    }

    set jload (value)
    {
        this.setAttribute('jload', value) ;
    }
}
