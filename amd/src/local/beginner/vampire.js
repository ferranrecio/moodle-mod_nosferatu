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
 * The vampire component.
 *
 * @module     mod_nosferatu/local/beginner/vampire
 * @class      mod_nosferatu/local/beginner/vampire
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BaseComponent} from 'core/reactive';
import {nosferatu} from 'mod_nosferatu/local/beginner/nosferatu';

export default class extends BaseComponent {

    /**
     * All the component definition should be initialized on the "create" method.
     */
    create() {
        // This is an optional name for the debugging messages.
        this.name = 'vampire';
        // Remeber, we must always define our component selectors and stuff in the create method.
        this.selectors = {
            PERSON: `select`,
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
     * Remember, this is our equivalent of document ready for components.
     */
    stateReady() {
        // Add the event listeners.
        this.addEventListener(
            this.getElement(this.selectors.SUBMIT),
            'click',
            this._bitePersonListener
        );
        // As you may notice, we use "this.addEventListener" instead of
        // "this.getElement(this.selectors.SUBMIT).addEventListener" and there are a very good
        // reasons to do it that way:
        //
        // 1. A component is something that could be unregisterd at any moment (we will see later),
        //    when a component is unregisterd, all listeners added using this.addEventListener will
        //    be also removed automatically.
        //
        // 2. If at some point you need to stop listening an event, you can use this.removeEventListener
        //    without worring about binding problems (quite common when you use object oriented code
        //    with JS events).
        //
        // 3. The "this" inside your listeners will always the component instance, not a DOM element.
        //    this way you can reuse the same methods for other uses, not only as listeners. And more
        //    important, in all your component methods the "this" value will be consistent.
    }

    /**
     * Our submit handler.
     *
     * @param {Event} event the click event
     */
    _bitePersonListener(event) {
        // We don't want to submit the form.
        event.preventDefault();
        // Get the selected person id.
        const select = this.getElement(this.selectors.PERSON);
        const personId = select.value;
        this.reactive.dispatch('bite', personId);
    }
}
