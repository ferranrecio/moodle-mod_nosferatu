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
 * Example of a non-injectable template component.
 *
 * @module     mod_nosferatu/local/simplified/doctor
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
        this.name = 'nosferatu-app-doctor';
    }

    /**
     * Get the template name.
     *
     * In this case, we are using a non-injectable component. This means the parent content
     * will not inject the template and the component itself is responsible for rendering.
     * This can happen when the component has especial template data the parent is not aware of.
     *
     * @returns {string}
     */
    getTemplateName() {
        return 'mod_nosferatu/local/simplified/doctor';
    }

    /**
     * Get the data to be used in the template.
     *
     * In this case, the component calculates a different data attributes that the one
     * the parent component can provide so it needs to be calculated using the state.
     *
     * @returns {Object}
     */
    getTemplateData() {
        return {
            // We will use the showdoctor property to show the doctor only when it is refreshed,
            // not when the template is included via another template.
            // In a real case, we could use this to show a loading spinner
            // while the doctor is loaded.
            showdoctor: true,
            hasbitten: this.reactive.isSomeoneBitten(),
        };
    }

    stateReady() {
        // We want to load the doctor asynchronously, so we will refresh the template now.
        this.refreshTemplate();

        // Even w3ith the refresh in progress, the main element is also ready to be used
        // and add the event listener. It is important to delegate as much evenets to the
        // main element as possible to simplify the logic.
        this.addEventListener(this.element, 'click', this.processClick);
    }

    // Note that we don't have any allowTemplateInjection method. This is because we
    // do not allow our parent component to inject the content because it does not
    // have the knowledge to calculate our template data.

    /**
     * Process the click event.
     *
     * It is important to delegate as much events as possible to the main element
     * because any inner element can be replaced when the template is reloaded.
     *
     * @param {Event} event
     */
    processClick(event) {
        const clickedElement = event.target.closest('[data-mdl-nosferatu-action]');
        if (!clickedElement) {
            return;
        }
        if (clickedElement.getAttribute('data-mdl-nosferatu-action') === 'cureAll') {
            event.preventDefault();
            // Any state change must be done dispatching mutations.
            this.reactive.dispatch('cureAll');
        }
    }
}
