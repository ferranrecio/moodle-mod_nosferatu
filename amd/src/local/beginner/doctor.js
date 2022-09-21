// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * The doctor component.
 *
 * @module     mod_nosferatu/local/beginner/doctor
 * @class      mod_nosferatu/local/beginner/doctor
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BaseComponent} from 'core/reactive';
import {nosferatu} from 'mod_nosferatu/local/beginner/nosferatu';

export default class extends BaseComponent {

    /**
     * One last timte: all the component definition should be initialized on the "create" method.
     */
    create() {
        this.name = 'doctor';

        this.selectors = {
            SUBMIT: `button`,
        };
    }

    /**
     * Static method to create a component instance form the mustahce template.
     *
     * @param {string} target the DOM main element or its ID
     * @param {object} selectors optional css selector overrides
     * @return {Component}
     */
    static init(target, selectors) {
        return new this({
            element: document.querySelector(target),
            selectors,
            reactive: nosferatu,
        });
    }

    /**
     * Initial state ready method.
     *
     * Remember: this is our equivalent of document ready for components.
     */
    stateReady() {
        // Remember: bind events using this.addEventListener.
        this.addEventListener(
            this.getElement(),
            'click',
            this._cureAllCitizens
        );
        // Note: this.getElement(string query, [int id]) will find specific DOM elements inside the
        //       component main element. However, calling this.getElement() without params is an alias
        //       for this.element.
    }

    /**
     * Our submit handler.
     *
     * Repeat after me: only mutations can alter the state.
     *
     * @param {Event} event the click event
     */
    _cureAllCitizens(event) {
        event.preventDefault();
        this.reactive.dispatch('cureAll');
    }
}
