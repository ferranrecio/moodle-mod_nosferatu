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
 * This is an example of a versatile template component.
 *
 * This component can be used as stand alone element that will
 * refresh itself when the state changes or as a component that
 * will be injected into a parent template.
 *
 * @module     mod_nosferatu/local/simplified/person
 * @copyright  2024 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {TemplateComponent} from 'core/reactive';

export default class extends TemplateComponent {

    /**
     * All the component definition should be initialized on the "create" method.
     */
    create() {
        // This is an optional name for the debugging messages.
        this.name = 'nosferatu-app-person';

        this.id = parseInt(this.element.getAttribute('data-mdl-nosferatu-personid'));
    }

    getTemplateName() {
        return 'mod_nosferatu/local/simplified/person';
    }

    getTemplateData() {
        return this.reactive.get('people', this.id);
    }

    /**
     * Allowing injection of the template.
     *
     * Using this method we allow the parent component to inject the template
     * directly, without the need of the component to render it again.
     *
     * This can be done when the template data si compatible with the parent data.
     * In this case, the parent render a list of persons and the data of each person
     * will be the same we use in this component, so we can trust the injected content.
     *
     * @returns {boolean}
     */
    allowTemplateInjection() {
        return true;
    }

    stateReady() {
        this.element.addEventListener('click', (event) => {
            const clickedElement = event.target.closest('[data-mdl-nosferatu-action]');
            if (!clickedElement) {
                return;
            }
            if (clickedElement.getAttribute('data-mdl-nosferatu-action') === 'removeperson') {
                this.reactive.dispatch('removePerson', this.id);
            }
        });
    }
}
