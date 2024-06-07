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
 * The Nosferatu vampire component.
 *
 * @module     mod_nosferatu/local/simplified/vampire
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
        this.name = 'nosferatu-app-vampire';
    }

    /**
     * Allow template injection.
     *
     * This module depend always on the parent component so no need
     * for having a getTemplateName and getTemplateData methods.
     */
    allowTemplateInjection() {
        return true;
    }

    /**
     * This method is called when the state is ready.
     *
     * By all means, the stateReady is the equivalent of the dom ready state
     * but for components. It is used to add event listeners and other
     * component specific logic.
     */
    stateReady() {
        this.addEventListener(this.element, 'click', this.processClick);
    }

    /**
     * Process the click event.
     *
     * With template components, delegating the events as much as possible is
     * the best approach. Otherwise a template refresh can remove the event listeners.
     *
     * @param {Event} event
     */
    processClick(event) {
        const clickedElement = event.target.closest('[data-mdl-nosferatu-action]');
        const victim = this.getReference('victim');
        if (!clickedElement || !victim) {
            return;
        }
        if (clickedElement.getAttribute('data-mdl-nosferatu-action') === 'bite') {
            event.preventDefault();
            this.reactive.dispatch('bite', victim.value);
        }
    }
}
