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
import { wepsim_save_to_file } from '../wepsim_core/wepsim_url.js';
import { wepsim_notify_success } from '../wepsim_core/wepsim_notify.js';
import { get_simware } from '../sim_core/sim_adt_core.js';
import { mp2bin } from './wepsim_uielto_bin_asm.js';
import { inputasm, inputfirm } from './wepsim_web_simulator.js';
import { wepsim_checkpoint_get, wepsim_checkpoint_save } from '../wepsim_core/wepsim_checkpoint.js';
import { wsweb_save_controlmemory_to_file } from './wepsim_web_api.js';

var saveOptionHandlers = {
    'asm-save-editor': function(el, host)
    {
        var fid              = host.getAttribute('fid');
        var fileNameToSaveAs = document.getElementById(fid).value;
        var textToWrite      = inputasm.getValue();
        wepsim_save_to_file(textToWrite, fileNameToSaveAs);
        inputasm.is_modified = false;
    },
    'asm-save-binary': function(el, host)
    {
        var fid              = host.getAttribute('fid');
        var fileNameToSaveAs = document.getElementById(fid).value;
        var simware          = get_simware();
        if (simware == null) return;
        var textToWrite = mp2bin(simware.mp, simware.labels_asm, simware.seg);
        wepsim_save_to_file(textToWrite, fileNameToSaveAs);
    },
    'fir-save-editor': function(el, host)
    {
        var fid              = host.getAttribute('fid');
        var fileNameToSaveAs = document.getElementById(fid).value;
        var textToWrite      = inputfirm.getValue();
        wepsim_save_to_file(textToWrite, fileNameToSaveAs);
        inputfirm.is_modified = false;
    },
    'fir-save-cm2': function(el, host)
    {
        wsweb_save_controlmemory_to_file(2);
    },
    'fir-save-cm1': function(el, host)
    {
        wsweb_save_controlmemory_to_file(1);
    },
};

export class ws_save_files_option extends HTMLElement
{
    static get observedAttributes()
    {
        return ['fid', 'jsrc', 'label'] ;
    }

    constructor ()
    {
        super();
    }

    update_internal_attributes ()
    {
        var fid = this.getAttribute('fid') ;
        if (fid === null)
            this.setAttribute('fid', 'id58') ;

        var jsrc = this.getAttribute('jsrc') ;
        if (jsrc === null)
            this.setAttribute('jsrc', '') ;

        var label = this.getAttribute('label') ;
        if (label === null)
            this.setAttribute('label', 'Save') ;
    }

    render (event_name)
    {
        this.update_internal_attributes() ;

        var o1 = "  <h6 class='dropdown-header'>" + this.label + ':</h6>' +
            "  <a class='dropdown-item' href='#' " +
            "     data-bind='click' data-action='save-option' data-code='" + this.jsrc + "'><span data-langkey='" + this.label + "'>" +
            this.label + '</span></a>' ;

        this.innerHTML = o1 ;
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

    get label ()
    {
        return this.getAttribute('label') ;
    }

    set label (value)
    {
        this.setAttribute('label', value) ;
    }
}

//
// ws_save_files::ws_save_files_option
//

export class ws_save_files extends HTMLElement
{
    static get observedAttributes()
    {
        return ['fid'] ;
    }

    constructor ()
    {
        super();
    }

    update_internal_attributes ()
    {
        var fid = this.getAttribute('fid') ;
        if (fid === null)
            this.setAttribute('fid', 'id53') ;
    }

    render (event_name)
    {
        this.update_internal_attributes() ;

        var eltos = this.querySelectorAll('ws-save-files-option') ;

        var o1_list    = '' ;
        var opt_label ;
        var elto_src   = [] ;
        var elto_label = [] ;
        for (var i = 0; i < eltos.length; i++)
        {
            elto_src.push(eltos[i].getAttribute('jsrc')) ;
            elto_label.push(eltos[i].getAttribute('label')) ;

            if (null == elto_src[i]) continue ;
            if ('' == elto_src[i]) continue ;

            if (o1_list != '')
                o1_list += "  <div class='dropdown-divider'></div>" ;

            if (0 == i) opt_label = 'Default' ;
            else opt_label = 'Optional ' + i ;

            o1_list += "  <h6 class='dropdown-header'>" + opt_label + ':</h6>' +
                "  <a class='dropdown-item' href='#' " +
                "     data-bind='click' data-action='save-option' data-code='" + elto_src[i] + "'><span data-langkey='" + elto_label[i] + "'>" +
                elto_label[i] + '</span></a>' ;
        }

        var o1 = '' ;
        o1    += "<div class='card border-secondary h-100'>" +
            "<div class='card-header border-secondary text-white bg-secondary p-1'>" +
            "  <h5 class='m-0'>" +
            "  <span class='text-white bg-secondary' data-langkey='Output file'>Output file</span>" +
            "<div class='btn-group float-end'>" +
            "  <button class='btn bg-body-tertiary mx-1 float-end py-0 col-auto' " +
            "          data-bind='click' data-action='save-files' data-code='" + elto_src[0] + "'><span data-langkey='Save'>Save</span></button>" +
            "  <button type='button' " +
            "          class='btn bg-body-tertiary dropdown-toggle dropdown-toggle-split btn-sm' " +
            "          data-bs-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
            "    <span class='visually-hidden sr-only'>Toggle Dropdown</span>" +
            '  </button>' +
            "  <div class='dropdown-menu'>" +
            o1_list +
            '  </div>' +
            '</div>' +
            '  </h5>' +
            '</div>' +
            " <div class='card-body'>" +
            " <label for='" + this.fid + "' class='collapse7'>" +
            "<em><span data-langkey='Please write the file name'>Please write the file name</span>:</em>" +
            ' </label>' +
            " <p><input aria-label='filename to save content' id='" + this.fid + "' " +
            "           class='form-control btn-outline-secondary' " +
            "           placeholder='File name where information will be saved' " +
            "           style='min-width: 90%;'/></p>" +
            ' </div>' +
            '</div>' ;

        this.innerHTML = o1 ;

        onClick('save-files', (el) =>
        {
            var host = el.closest('ws-save-files');
            if (host)
            {
                var code    = el.getAttribute('data-code');
                var handler = saveOptionHandlers[code];
                if (handler) handler(el, host);
            }
        });

        onClick('save-option', (el) =>
        {
            var host = el.closest('ws-save-files');
            if (host)
            {
                var code    = el.getAttribute('data-code');
                var handler = saveOptionHandlers[code];
                if (handler) handler(el, host);
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
}
