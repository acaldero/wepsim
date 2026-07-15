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
import { ws_uielto } from './wepsim_uielto.js';
import { onChange, onClick } from './wepsim_web_actions.js';
import { simhw_active, simhw_internalState, simhw_internalState_reset } from '../sim_hw/sim_hw_index.js';
import { get_var, set_var } from '../sim_core/sim_core_values.js';
import { cache_memory_init, cache_memory_init_eltofromcfg, cache_memory_init_eltonextcache } from '../sim_core/sim_adt_cachememory.js';

/*
         *  Cache memory (configuration)
         */
/* jshint esversion: 6 */
export class ws_cache_config extends ws_uielto
{
    constructor ()
    {
        // parent
        super();
    }

    // render
    render (event_name)
    {
        // initialize render elements...
        super.render() ;

        // render current element
        this.render_skel() ;
        this.render_populate() ;
    }

    render_skel ()
    {
        var div_id = 'config_CACHE_sel' ;
        var style_dim = 'height:58vh; width:inherit; ' ;
        var style_ovf = 'overflow:auto; -webkit-overflow-scrolling:touch; ' ;

        // default content
        this.innerHTML = '<div id="' + div_id + '" ' +
            '     style="' + style_dim + style_ovf + '">' +
            '</div>' ;
    }

    render_populate ()
    {
        var div_hash = '#config_CACHE_sel' ;

        // if no active hardware -> empty
        if (simhw_active() === null)
        {
            $(div_hash).html('') ;
            return ;
        }

        // default content
        var curr_cfg = simhw_internalState('CM_cfg') ;
        if (typeof curr_cfg == 'undefined')
        {
            $(div_hash).html('') ;
            return ;
        }

        // html holder
        var o1 = wepsim_show_cache_memory_cfg(div_hash, curr_cfg) ;
        $(div_hash).html(o1) ;
    }
}
/*
         *  Cache config UI
         */

export function wepsim_show_cm_level_cfg_bits(memory_cfg, index)
{
    var memory_cfg_i = memory_cfg[index] ;

    var o = '' +
        "<table class='table table-hover table-sm m-0'>" +
        '<tbody>' +
        '<tr>' +
        "    <td align='center' class='border border-0 border-tertiary'>" +
        "    <div id='via_size_" + index + '_' + this.name_str + "'>Id.: " +
        "    <input type='number' " +
        "           value='" + get_var(memory_cfg_i.cfg.via_size) + "' " +
        "           data-bind='change' data-action='cm-update-cfg' data-index='" + index + "' data-field='via_size' " +
        "           min='0' max='32'>" +
        '    </div>' +
        '    # bits to identify line' +
        '    </td>' +
        '' +
        "    <td align='center' " +
        "        style='vertical-align: middle;' " +
        "        class='border border-2 border-tertiary'>" +
        "        <div class='w-100 mx-auto border'></div>" +
        '        line / via' +
        "        <div class='w-100 mx-auto border'></div>" +
        '    </td>' +
        '</tr>' +
        '<tr>' +
        "    <td align='center' class='border border-0 border-tertiary'>&nbsp;</td>" +
        '' +
        "    <td align='center' class='border border-0 border-tertiary'>" +
        "    <div id='off_size_" + index + '_' + this.name_str + "'>Offset: " +
        "    <input type='number' " +
        "           value='" + get_var(memory_cfg_i.cfg.off_size) + "' " +
        "           data-bind='change' data-action='cm-update-cfg' data-index='" + index + "' data-field='off_size' " +
        "           min='0' max='32'>" +
        '    </div>' +
        '    # bits to select byte inside line' +
        '    </td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' ;
    onChange('cm-update-cfg', (el) =>
    {
        wepsim_cm_update_cfg(parseInt(el.dataset.index), el.dataset.field, el.type === 'number' ? parseInt(el.value) : el.value);
    }) ;
    return o ;
}

export function wepsim_show_cm_level_cfg_splitunify(memory_cfg, index)
{
    var o = "  <div class='row mb-3'>" +
        "    <label for='su_pol_" + index + '_' + this.name_str + "' " +
        "           class='col-xs-12 col-md-4 col-form-label' " +
        "    ><span data-langkey='Split/unified'>Split/unified</span></label>" +
        "    <div class='col-xs-12 col-md-8'>" +
        "    <select class='form-select form-control' " +
        "            id='su_pol_" + index + '_' + this.name_str + "' " +
        "            data-bind='change' data-action='cm-update-cfg' data-index='" + index + "' data-field='su_pol'" +
        "            aria-label='Replace policy'>" +
        "      <option value='unify' selected>Unified</option>" +
        "      <option value='split_i'>Split (instruction)</option>" +
        "      <option value='split_d'>Split (data)</option>" +
        '    </select>' +
        '    </div>' +
        '  </div>' ;
    onChange('cm-update-cfg', (el) =>
    {
        wepsim_cm_update_cfg(parseInt(el.dataset.index), el.dataset.field, el.type === 'number' ? parseInt(el.value) : el.value);
    }) ;
    return o ;
}

export function wepsim_show_cm_level_cfg_replacepol(memory_cfg, index)
{
    var o = "  <div class='row mb-3'>" +
        "    <label for='replace_pol_" + index + '_' + this.name_str + "' " +
        "           class='col-xs-12 col-md-4 col-form-label' " +
        "    ><span data-langkey='Replace policy'>Replace policy</span></label>" +
        "    <div class='col-xs-12 col-md-8'>" +
        "    <select class='form-select' " +
        "            id='replace_pol_" + index + '_' + this.name_str + "' " +
        "            data-bind='change' data-action='cm-update-cfg' data-index='" + index + "' data-field='replace_pol'" +
        "            aria-label='Replace policy'>" +
        "      <option value='lfu' selected>LFU</option>" +
        "      <option value='fifo'>FIFO</option>" +
        '    </select>' +
        '    </div>' +
        '  </div>' ;
    onChange('cm-update-cfg', (el) =>
    {
        wepsim_cm_update_cfg(parseInt(el.dataset.index), el.dataset.field, el.type === 'number' ? parseInt(el.value) : el.value);
    }) ;
    return o ;
}

export function wepsim_show_cm_level_cfg_placepol(memory_cfg, index)
{
    var o = "  <div class='row mb-3'>" +
        "    <label for='replace_cpp_" + index + '_' + this.name_str + "' " +
        "           class='col-xs-12 col-md-4 col-form-label'" +
        "    ><span data-langkey='Cache placement policy'>Cache placement policy</span></label>" +
        "    <div class='col-xs-12 col-md-8'>" +
        "    <select class='form-select' " +
        "            id='replace_cpp_" + index + '_' + this.name_str + "' " +
        "            data-bind='change' data-action='cm-update-placement' data-index='" + index + "'" +
        "            aria-label='Cache placement policy'>" +
        "      <option value='fa' selected>Fully associative</option>" +
        "      <option value='sa'         >Set-associative</option>" +
        "      <option value='dm'         >Direct-mapped</option>" +
        '    </select>' +
        '    ' +
        "<div class='accordion-group'>" +
        "    <div class='collapse show' id='cpp_fa'>" +
        "      <table class='table table-hover table-sm table-bordered m-0'>" +
        '      <tbody>' +
        '      <tr>' +
        "          <td align='center' class='border border-dark w-50'>tag</td>" +
        "          <td align='center' class='border border-dark w-50'>offset</td>" +
        '      </tr>' +
        '      </tbody>' +
        '      </table>' +
        '    </div>' +
        "    <div class='collapse' id='cpp_sa'>" +
        "      <table class='table table-hover table-sm table-bordered m-0'>" +
        '      <tbody>' +
        '      <tr>' +
        "          <td align='center' class='border border-dark w-25'>tag</td>" +
        "          <td align='center' class='border border-dark w-25'><strong>set</strong></td>" +
        "          <td align='center' class='border border-dark w-50'>offset</td>" +
        '      </tr>' +
        '      <tr>' +
        "          <td align='center' colspan='3'>" +
        "          <input type='range' class='form-range pt-1' min='0' max='5' id='cmcfg_range' " +
        "             data-bind='change' data-action='cm-update-set' data-index='" + index + "'" +
        "          <label for='cmcfg_range' class='form-label my-0 pt-2 pb-0'><span id='rng_cmcfg'>#</span> bits for set in cache &nbsp;(0: full-assoc., max:direct)</label>" +
        '          </td>' +
        '      </tr>' +
        '      </tbody>' +
        '      </table>' +
        '    </div>' +
        "    <div class='collapse' id='cpp_dm'>" +
        "      <table class='table table-hover table-sm table-bordered m-0'>" +
        '      <tbody>' +
        '      <tr>' +
        "          <td align='center' class='border border-dark w-25'>tag</td>" +
        "          <td align='center' class='border border-dark w-25'>index</td>" +
        "          <td align='center' class='border border-dark w-50'>offset</td>" +
        '      </tr>' +
        '      </tbody>' +
        '      </table>' +
        '    </div>' +
        '</div>' +
        '    ' +
        '    </div>' +
        '  </div>' ;
    onChange('cm-update-placement', (el) =>
    {
        wepsim_cm_update_placement(parseInt(el.dataset.index), el.value);
    }) ;
    onChange('cm-update-set', (el) =>
    {
        wepsim_cm_update_cfg(parseInt(el.dataset.index), 'set_size', parseInt(el.value));
        var e2 = document.getElementById('rng_cmcfg');
        if (e2) e2.textContent = el.value;
    }) ;
    return o ;
}

export function wepsim_show_cm_level_cfg_nextcm(memory_cfg, index)
{
    var o = "<div class='row mb-3'>" +
        "  <label for='su_pol_" + index + '_' + this.name_str + "' " +
        "         class='col-xs-12 col-md-4 col-form-label' " +
        "  ><span data-langkey='Next Cache'>Next Cache</span></label>" +
        "  <div class='col-xs-12 col-md-8'>" +
        "  <select class='form-select form-control' " +
        "          id='su_next_" + index + '_' + this.name_str + "' " +
        "          data-bind='change' data-action='cm-update-next' data-index='" + index + "'" +
        "          aria-label='Next Cache'>" ;
    onChange('cm-update-next', (el) =>
    {
        wepsim_cm_update_cfg(parseInt(el.dataset.index), 'next_cache', el.value);
        wepsim_show_cache_memory_config();
    }) ;
    o += "<option value='-1'>None</option>" ;
    for (var i = 0; i < memory_cfg.length; i++)
    {
        // skip myself
        if (i == index)
        {
            continue ;
        }
        // skip lower levels pointing to other
        if (
            (memory_cfg[i].cfg.level < memory_cfg[index].cfg.level) &&
            (memory_cfg[i].cfg.next_cache != -1)
        )
        {
            continue ;
        }

        if (i != memory_cfg[index].cfg.next_cache)
            o += "<option value='" + i + "'         >" + (i + 1) + '</option>' ;
        else o += "<option value='" + i + "' selected>" + (i + 1) + '</option>' ;
    }

    o += '  </select>' +
        '  </div>' +
        '</div>' ;

    return o ;
}

export function wepsim_show_cm_level_cfg(div_hash, memory_cfg, index)
{
    var o = '' ;

    o += "<div class='card container border mb-3'>" +
        '' +
        "<div class='card-header row mb-1'>" +
        "<div class='col-auto px-2 py-0'>" +
        '<h5>Cache-' + (index + 1) + '</h5>' +
        '</div>' +
        "<div class='col-auto px-2 py-0'>" +
        '<span class=\'btn btn-sm btn-warning text-white py-0\' ' +
        '      data-bind=\'click\' data-action=\'cm-rm-level\' data-divhash=\'' + div_hash + '\' data-index=\'' + index + '\'>Remove</span>' +
        '</div>' +
        '</div>' +
        '' +
        "<div class='row ms-1'>" +
        "<div class='col m-2'>" +
        wepsim_show_cm_level_cfg_bits(memory_cfg, index) +
        '</div>' +
        '</div>' +
        '' +
        wepsim_show_cm_level_cfg_placepol (memory_cfg, index) +
        wepsim_show_cm_level_cfg_replacepol(memory_cfg, index) +
        wepsim_show_cm_level_cfg_splitunify(memory_cfg, index) +
        wepsim_show_cm_level_cfg_nextcm (memory_cfg, index) +
        '</div>' ;
    onClick('cm-rm-level', (el) =>
    {
        wepsim_cm_rm_cachelevel(el.dataset.divhash, parseInt(el.dataset.index));
    }) ;

    return o ;
}

export function wepsim_show_cache_memory_cfg(div_hash, memory_cfg)
{
    var o = '' ;
    var i ;

    // header
    o += "<div class='container text-center mb-2 mb-3'>" +
        "<div class='row align-items-start'>" +
        "<span class='col h5 ps-1'>" +
        "  <span data-langkey='Processor'>Processor</span></span>" +
        "<span class='col border border-secondary border-2 opacity-75 align-middle mt-3'></span>" +
        "<span class='col h5 ps-1'>" +
        "  <span data-langkey='Cache'>Cache</span>" +
        '  <span class=\'btn btn-sm btn-success text-white py-0\' ' +
        '        data-bind=\'click\' data-action=\'cm-add-level\ data-divhash=\'' + div_hash + '\' data-memlength=\'' + memory_cfg.length + '\'>Add new</span>' +
        '</span>' +
        "<span class='col border border-secondary border-2 opacity-75 align-middle mt-3'></span>" +
        "<span class='col h5 ps-1'>" +
        "  <span data-langkey='Memory'>Memory</span></span>" +
        '</div>' +
        '</div>' ;
    onClick('cm-add-level', (el) =>
    {
        wepsim_cm_add_cachelevel(el.dataset.divhash, el.dataset.memlength);
    }) ;
    // cards
    o += "<span class='row mx-auto'>" ;
    for (i = 0; i < memory_cfg.length; i++)
    {
        o += "<span class='col-auto my-2'>" +
            wepsim_show_cm_level_cfg(div_hash, memory_cfg, i) +
            '</span>' ;
    }
    o += '</span>' ;

    return o ;
}

export function wepsim_cm_add_cachelevel(div_hash, cache_id)
{
    var curr_cm = simhw_internalState('CM') ;
    var curr_cfg = simhw_internalState('CM_cfg') ;

    // check arguments
    if (cache_id < 0)
    {
        return ;
    }
    if (typeof curr_cfg == 'undefined')
    {
        return ;
    }

    // update cm_cfg and cm
    curr_cfg[cache_id] = cache_memory_init(cache_id, 12, 5, 6, 'fifo', 'unified', 1, -1) ;
    curr_cm[cache_id] = cache_memory_init_eltofromcfg(curr_cfg[cache_id].cfg) ;
    cache_memory_init_eltonextcache(curr_cm, curr_cfg[cache_id], curr_cm[cache_id]) ;

    simhw_internalState_reset('CM_cfg', curr_cfg) ;
    simhw_internalState_reset('CM', curr_cm) ;

    // show new cache list
    var o1 = wepsim_show_cache_memory_cfg(div_hash, curr_cfg) ;
    $(div_hash).html(o1) ;
}

export function wepsim_cm_rm_cachelevel(div_hash, cache_id)
{
    var curr_cm = simhw_internalState('CM') ;
    var curr_cfg = simhw_internalState('CM_cfg') ;

    // check arguments
    if (cache_id < 0)
    {
        return ;
    }
    if (typeof curr_cfg == 'undefined')
    {
        return ;
    }

    // unlink from other cache levels...
    for (var i = 0; i < curr_cfg.length; i++)
    {
        if (curr_cfg[i].cfg.next_cache == cache_id)
        {
            curr_cm[i].cfg.next_cache = null ;
            curr_cfg[i].cfg.next_cache = -1 ;
        }
    }

    // remove this level...
    curr_cfg.splice(cache_id, 1) ;
    curr_cm.splice(cache_id, 1) ;

    simhw_internalState_reset('CM_cfg', curr_cfg) ;
    simhw_internalState_reset('CM', curr_cm) ;

    // show new cache list
    var o1 = wepsim_show_cache_memory_cfg(div_hash, curr_cfg) ;
    $(div_hash).html(o1) ;
}

export function wepsim_cm_update_cfg(index, field, value)
{
    var curr_cm = simhw_internalState('CM') ;
    var curr_cfg = simhw_internalState('CM_cfg') ;
    var actual_next = -1 ;

    if (0 == curr_cfg.length)
    {
        return ;
    }
    if ((('via_size' == field) || ('set_size' == field)) &&
        (get_var(curr_cfg[index].cfg.set_size) > get_var(curr_cfg[index].cfg.via_size)))
    {
        return ;
    }
    if ('via_size' == field)
    {
        document.getElementById('cmcfg_range').max = value ;
    }

    if ('next_cache' == field)
    {
        actual_next = curr_cfg[index].cfg.next_cache ;
        value = parseInt(value) ;
    }

    set_var(curr_cfg[index].cfg[field], value) ;

    curr_cm[index] = cache_memory_init_eltofromcfg(curr_cfg[index].cfg) ;
    cache_memory_init_eltonextcache(curr_cm, curr_cfg[index], curr_cm[index]) ;

    if ('next_cache' == field)
    {
        if (actual_next != -1)
        {
            curr_cfg[actual_next].cfg.level = 1 ; // TODO: if (...link_counter == 0)
        }
        if (value != -1)
        {
            curr_cfg[value].cfg.level = curr_cfg[index].cfg.level + 1 ;
        }
    }

    simhw_internalState_reset('CM_cfg', curr_cfg) ;
    simhw_internalState_reset('CM', curr_cm) ;
}

export function wepsim_cm_update_placement(index, value)
{
    $('#cpp_fa').hide();
    $('#cpp_sa').hide();
    $('#cpp_dm').hide();

    // Fully associative
    if ('fa' == value)
    {
        wepsim_cm_update_cfg(index, 'set_size', 0) ;
        $('#cpp_fa').show();
    }

    // Set-associative
    if ('sa' == value)
    {
        var curr_cfg = simhw_internalState('CM_cfg') ;
        curr_sz = parseInt(get_var(curr_cfg[index].cfg.via_size)) ;
        wepsim_cm_update_cfg(index, 'set_size', curr_sz) ;
        $('#cpp_sa').show();
    }

    // Direct-mapped
    if ('dm' == value)
    {
        curr_cfg = simhw_internalState('CM_cfg') ;
        var curr_sz = 0 ;
        if ((typeof curr_cfg != 'undefined') &&
            (typeof curr_cfg[index] != 'undefined'))
        {
            curr_sz = parseInt(get_var(curr_cfg[index].cfg.via_size)) ;
        }

        wepsim_cm_update_cfg(index, 'set_size', curr_sz) ;
        $('#cpp_dm').show();
    }
}

/*
         *  Cache config UI
         */

export function wepsim_show_cache_memory_config()
{
    var o1 = '' ;
    var div_hash = '#config_CACHE_sel' ;

    // default content
    var curr_cfg = simhw_internalState('CM_cfg') ;
    if (typeof curr_cfg != 'undefined')
    {
        o1 = wepsim_show_cache_memory_cfg(div_hash, curr_cfg) ;
    }

    // html holder
    $(div_hash).html(o1) ;
}

