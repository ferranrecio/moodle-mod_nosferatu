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
 * The city component.
 *
 * @module     mod_nosferatu/local/beginner/city
 * @class      mod_nosferatu/local/beginner/city
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BaseComponent} from 'core/reactive';

export default class extends BaseComponent {

    /**
     * It is important to follow some conventions while you write components. This way all components
     * will be implemented in a similar way and anybody will be able to understand how it works.
     *
     * All the component definition should be initialized on the "create" method.
     */
    create() {
        // This is an optional name for the debugging messages.
        this.name = 'city';
        // We will always define our component HTML selectors and classes this way so we only define
        // once and we don't contaminate our logic with tags and other stuff.
        this.selectors = {
            PERSON: `[data-for='person']`,
            PERSONNAME: `[data-for='personname']`,
        };
        this.classes = {
            BITTEN: `bitten`,
        };
        // If you need local attributes like ids os something it should be initialized here.
    }

    /**
     * Static method to create a component instance form the mustahce template.
     *
     * Child components will inherit the reactive instance from the parent so no
     * need to specify trhe reactive in the code.
     *
     * @param {string} target the DOM main element or its ID
     * @param {object} selectors optional css selector overrides
     * @return {Component}
     */
    static init(target, selectors) {
        return new this({
            element: document.querySelector(target),
            selectors,
        });
    }

    /**
     * Initial state ready method.
     *
     * Note in this case we want our stateReady to be async.
     *
     * @param {object} state the initial state
     */
    stateReady(state) {
        // At this point we have the initial state. This means we can update the component
        // in case some of the citizens is already bitten.
        state.people.forEach((person) => {
            this._refreshPerson({element: person});
        });
    }

    /**
     * We want to update the person every time something in its state change. To do this we need
     * to define a watcher.
     *
     * @returns {Array} of watchers
     */
    getWatchers() {
        return [
            {watch: `people:updated`, handler: this._refreshPerson},
        ];
    }

    /**
     * We will trigger that method any time a person data changes.
     *
     * This method is used by stateReady
     * but, most important, to watch the state. Any watcher receive an object with:
     * - element: the afected element (a person in this case)
     * - state: the full state object
     *
     * @param {Object} param the watcher param.
     * @param {Object} param.element the person structure.
     */
    _refreshPerson({element}) {
        // We have a convenience method to locate elements inside the component.
        const target = this.getElement(this.selectors.PERSON, element.id);
        if (!target) {
            return;
        }
        // Add or remove the bitten class.
        target.classList.toggle(this.classes.BITTEN, element.bitten ?? false);
        // Update the citizen name
        const name = target.querySelector(this.selectors.PERSONNAME);
        name.innerHTML = element.name;
    }
}
