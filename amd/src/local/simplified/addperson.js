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

import {TemplateComponent} from 'core/reactive';

/**
 * Add person component.
 *
 * This is an example of an static component. It does not allow injection
 * and only watches for the person limit to disable the form.
 *
 * @module     mod_nosferatu/local/simplified/addperson
 * @copyright  2024 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
export default class extends TemplateComponent {

    /**
     * All the component definition should be initialized on the "create" method.
     */
    create() {
        this.name = 'nosferatu-app-addperson';
    }

    /**
     * Get the watchers for the component.
     *
     * In this case, we only need to control the limit of people.
     *
     * @returns {array} array of watchers.
     */
    getWatchers() {
        // By default, all TemplateComponents will watch for any state changes.
        // However, the add person form only needs to watch for the people limit.
        // By explicitly defining the watchers, we can reduce the number of updates.
        return [
            {watch: `people:created`, handler: this.refreshTemplate},
            {watch: `people:deleted`, handler: this.refreshTemplate},
        ];
    }

    getTemplateName() {
        return 'mod_nosferatu/local/simplified/addperson';
    }

    getTemplateData() {
        return {
            limitreached: this.reactive.getAll('people').size > 10,
        };
    }

    stateReady() {
        // You don't need to over-engineer components. In this case, we know
        // the comonent has only one form, so we simply delegate the submit
        // event.
        this.addEventListener(this.element, 'submit', (event) => {
            event.preventDefault();
            this.addPerson();
            return false;
        });
        this.addEventListener(this.element, 'keyup', () => {
            this.handleInputChange();
        });

        // We want to update the button disabled state when the component is ready.
        // As you may notice, we are not using the "handleInputChange" method directly
        // in both addEvenetListener and here. This is because the reactive library
        // will auto-bind the "this" value when we use the addEvenetListener.
        this.handleInputChange();
    }

    addPerson() {
        if (this.isInputEmpty()) {
            return;
        }
        // We add an data-mdl-ref to the input field to be able to reference it.
        const nameField = this.getReference('name');
        this.reactive.dispatch('putPerson', {
            name: nameField.value,
        });
        // The form itself is static, so we need to clear the input field manually.
        nameField.value = '';
        this.handleInputChange();
    }

    handleInputChange() {
        this.getReference('button').disabled = this.isInputEmpty();
    }

    /**
     * Check if the input is empty.
     *
     * We can create as many helper methods as we need to make our compoment more
     * readable. In this case, we want to check if the input field is empty.
     *
     * @returns {boolean}
     */
    isInputEmpty() {
        return this.getReference('name').value.trim() === '';
    }
}
