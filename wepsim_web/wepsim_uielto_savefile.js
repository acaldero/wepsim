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

import { dispatch, onClick } from './wepsim_web_actions.js';
import { wepsim_checkpoint_get, wepsim_checkpoint_save } from '../wepsim_core/wepsim_checkpoint.js';
import { wepsim_notify_success } from '../wepsim_core/wepsim_notify.js';

export class ws_save_file extends HTMLElement
{
    static get observedAttributes()
    {
        return ['fid', 'jsave', 'jshare'] ;
    }

    constructor ()
    {
        super();
    }

    update_internal_attributes ()
    {
        var fid = this.getAttribute('fid') ;
        if (fid === null)
            this.setAttribute('fid', 'id52') ;

        var jsave = this.getAttribute('jsave') ;
        if (jsave === null)
            this.setAttribute('jsave', '') ;

        var jshare = this.getAttribute('jshare') ;
        if (jshare === null)
            this.setAttribute('jshare', '') ;
    }

    render (event_name)
    {
        this.update_internal_attributes() ;

        var o1 = '' ;
        o1 += "<div class='card border-secondary h-100'>" +
            "<div class='card-header border-secondary text-white bg-secondary p-1'>" +
            " <h5 class='m-0'>" +
            " <span class='text-white bg-secondary' data-langkey='Output file'>Output file</span>" +
            " <button class='btn bg-body-tertiary mx-1 float-end py-0 col-auto' " +
            "         data-bind='click' data-action='save-file'><span data-langkey='Save'>Save</span></button>" +
            ' </h5>' +
            '</div>' +
            "<div class='card-body'>" +
            " <label for='" + this.fid + "' class='collapse7'><em><span data-langkey='Please write the file name'>Please write the file name</span>:</em></label>" +
            " <p><input aria-label='filename to save content' id='" + this.fid + "' " +
            "           class='form-control btn-outline-secondary' " +
            "           placeholder='File name where information will be saved' " +
            "           style='min-width: 90%;'/></p>" +
            '</div>' +
            '</div>' ;

        this.innerHTML = o1 ;

        onClick('save-file', (el) =>
        {
            var host = el.closest('ws-save-file');
            if (host)
            {
                var fid = host.getAttribute('fid');
                var tagId = host.getAttribute('data-tag-id') || 'tagToSave1';
                wepsim_notify_success('<strong>INFO</strong>',
                                      'Processing save request...');
                var obj_tagName = document.getElementById(tagId);
                var checkpointObj = wepsim_checkpoint_get(obj_tagName.value);
                wepsim_checkpoint_save(fid, tagId, checkpointObj);
                return;
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
        this.render('connectedCallback') ;
        this.bindElements();
    }

    attributeChangedCallback (name, oldValue, newValue)
    {
        this.render('attributeChangedCallback') ;
    }

    get fid ()
    {
        return this.getAttribute('fid') ;
    }

    set fid (value)
    {
        this.setAttribute('fid', value) ;
    }

    get jsave ()
    {
        return this.getAttribute('jsave') ;
    }

    set jsave (value)
    {
        this.setAttribute('jsave', value) ;
    }

    get jshare ()
    {
        return this.getAttribute('jshare') ;
    }

    set jshare (value)
    {
        this.setAttribute('jshare', value) ;
    }
}
