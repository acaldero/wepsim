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

    /* jshint esversion: 8 */

    // Web Components
    globalThis.HTMLElement = class HTMLElement {};
    globalThis.customElements = { define: function() {}, get: function() {}, whenDefined: function() { return Promise.resolve(); } };
    globalThis.document = {
        getElementById: function() { return null; },
        createElement: function() { return { appendChild: function() {}, setAttribute: function() {}, style: {}, contentDocument: null, querySelector: function() { return null; }, querySelectorAll: function() { return []; }, addEventListener: function() {}, removeEventListener: function() {} }; },
        createTextNode: function() { return {}; },
        body: { appendChild: function() {}, style: {} },
        head: { appendChild: function() {} },
        querySelector: function() { return null; },
        querySelectorAll: function() { return []; },
        addEventListener: function() {},
        removeEventListener: function() {},
        documentElement: { style: {} },
    };
    globalThis.window = globalThis;

    // Vue + Vuex
    globalThis.Vue = class Vue {};

    globalThis.Vuex = class Vuex {};

    globalThis.Vuex.Store = class {} ;
