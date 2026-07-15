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

import { get_cfg, update_cfg } from '../sim_core/sim_cfg.js';
import { onChange, onClick } from '../wepsim_web/wepsim_web_actions.js';
import { wepsim_newbie_tour_reload } from '../wepsim_core/wepsim_tour.js';
import { i18n_de_register } from './de/register.js' ;
import { i18n_en_register } from './en/register.js' ;
import { i18n_es_register } from './es/register.js' ;
import { i18n_fr_register } from './fr/register.js' ;
import { i18n_hi_register } from './hi/register.js' ;
import { i18n_it_register } from './it/register.js' ;
import { i18n_ja_register } from './ja/register.js' ;
import { i18n_kr_register } from './kr/register.js' ;
import { i18n_pt_register } from './pt/register.js' ;
import { i18n_ru_register } from './ru/register.js' ;
import { i18n_sv_register } from './sv/register.js' ;
import { i18n_zh_cn_register } from './zh_cn/register.js' ;

/*
     * Initialize...
     */

export var i18n = {
    lang: {
        en:    'English',
        es:    'Espa&ntilde;ol',
        it:    "L'italiano - Google-translate",
        kr:    '한국어 - Google-translate',
        hi:    'हिन्दी - Google-translate',
        fr:    'Fran&ccedil;ais - Google-translate',
        pt:    'Portugu&ecirc;s - Google-translate',
        ja:    '日本語 - Google-translate',
        zh_cn: '汉语 - Thanks to shiptux@github',
        ru:    'русский язык - Google-translate',
        sv:    'Svenska - Google-translate',
        de:    'Deutsch - Google-translate',
    },
    eltos: {
        // main-screen user interface
        gui:                  {},
        // configuration dialog
        cfg:                  {},
        // examples dialog
        examples:             {},
        // states dialog
        states:               {},
        // help dialog
        help:                 {},
        // other dialogs-popovers-tooltips
        dialogs:              {},
        // compiler messages
        compiler:             {},
        // hw description
        hw:                   {},
        // tutorials
        tutorial_welcome:     {},
        tutorial_simpleusage: {},
        // welcome tour
        tour_intro:           {},
    },
} ;

/*
     *  i18n Private Interface
     */

export function i18n_init ()
{
    for (var l in i18n.lang)
    {
        for (var e in i18n.eltos)
        {
            i18n.eltos[e][l] = {} ;
        }
    }

    i18n_de_register(i18n) ;
    i18n_en_register(i18n) ;
    i18n_es_register(i18n) ;
    i18n_fr_register(i18n) ;
    i18n_hi_register(i18n) ;
    i18n_it_register(i18n) ;
    i18n_ja_register(i18n) ;
    i18n_kr_register(i18n) ;
    i18n_pt_register(i18n) ;
    i18n_ru_register(i18n) ;
    i18n_sv_register(i18n) ;
    i18n_zh_cn_register(i18n) ;

    return true ;
}

/*
     *  i18n Public Interface
     */

export function i18n_update_tags (component)
{
    var ws_idiom = get_cfg('ws_idiom') ;

    i18n_update_tagsFor(component, ws_idiom) ;
}

export function i18n_update_tagsFor (component, lang)
{
    if (typeof i18n.eltos[component] == 'undefined')
    {
        return ;
    }

    var tags = document.querySelectorAll('span') ;

    Array.from(tags).forEach(function(value, index)
    {
        var key = value.dataset.langkey ;
        if (i18n.eltos[component][lang][key])
        {
            value.innerHTML = i18n.eltos[component][lang][key] ;
        }
    }) ;
}

export function i18n_get (component, lang, key)
{
    if (typeof i18n.eltos[component] === 'undefined')
    {
        return key ;
    }

    var translation = i18n.eltos[component][lang][key] ;

    if (typeof translation === 'undefined')
    {
        return key ;
    }

    return translation ;
}

export function i18n_get_TagFor (component, key)
{
    var ws_idiom ;
    try
    {
        ws_idiom = get_cfg('ws_idiom') ;
    }
    catch (e)
    {
        ws_idiom = 'en' ;
    }

    var translation = key + ' ' ;
    if (typeof i18n.eltos[component][ws_idiom][key] !== 'undefined')
    {
        translation = i18n.eltos[component][ws_idiom][key] ;
    }

    return translation ;
}

export function i18n_get_select (div_name, extra_components)
{
    var curr_val = get_cfg('ws_idiom') ;

    var o = " <select name='" + div_name + "' id='" + div_name + "' " +
        "         class='form-control form-control-sm custom-select'" +
        "     aria-label='idiom for examples and help' " +
        "     data-bind='change' data-action='idiom-change'" +
        "     data-extra='" + (extra_components || '') + "'" +
        "     data-native-menu='false'>" ;
    for (var l in i18n.lang)
    {
        if (curr_val == l)
            o += "  <option value='" + l + "' selected>" + i18n.lang[l] + '</option>' ;
        else o += " <option value='" + l + "'>" + i18n.lang[l] + '</option>' ;
    }
    o += ' </select>' ;
    onChange('idiom-change', (el, comp, event) => i18n_handle_idiom_change(event)) ;

    return o ;
}

export function i18n_get_selectcfg ()
{
    var o = " <select name='select7' id='select7' class='form-control form-control-sm custom-select border-secondary'" +
        "       aria-label='idiom for examples and help' " +
        "       data-bind='change' data-action='idiom-change'" +
        "       data-extra='cfg'" +
        "       data-native-menu='false'>" ;
    for (var l in i18n.lang)
    {
        o += "  <option value='" + l + "'>" + i18n.lang[l] + '</option>' ;
    }
    o += ' </select>' ;
    onChange('idiom-change', (el, comp, event) => i18n_handle_idiom_change(event)) ;

    return o ;
}

export function i18n_handle_idiom_change (ev)
{
    var el = ev.target.closest('[data-action="idiom-change"]');
    if (!el) return;

    var optValue = el.value;
    update_cfg('ws_idiom', optValue);
    i18n_update_tagsFor('gui', optValue);
    i18n_update_tagsFor('hw', optValue);

    var extra = el.dataset.extra;
    if (extra)
    {
        extra.split(',').forEach(function(c)
        {
            c = c.trim();
            if (c)
            {
                i18n_update_tagsFor(c, optValue);
            }
        });
    }
}

export function i18n_get_welcome ()
{
    var o = '<div  class="container">' +
        '<span class="row">' ;
    for (var key in i18n.lang)
    {
        o += '<a class="btn btn-sm btn-outline-secondary mx-2 my-2 col-auto" href="#" ' +
            '   data-bind="click" data-action="newbie-tour-reload" data-lang="' + key + '">' +
            i18n_get('gui', key, 'Welcome') +
            '</a>' ;
    }
    o += '</span>' +
        '</div>' ;
    onClick('newbie-tour-reload', (el) => wepsim_newbie_tour_reload(el.dataset.lang)) ;

    return o ;
}

