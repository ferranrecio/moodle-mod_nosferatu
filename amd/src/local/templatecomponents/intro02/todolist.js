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
 * Component to show how to do a basic todo list using template components.
 *
 * As you may notice, there is no HTML updated in this module. All the HTML changes
 * are handled by the Template Component Virtual DOM.
 *
 * @module     mod_nosferatu/local/templatecomponents/intro02/todolist
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
        this.name = 'nosferatu-app-todolist';
        // Any extra object attribute can be defined here.
    }

    /**
     * Get the template name.
     *
     * @returns {string}
     */
    getTemplateName() {
        return 'mod_nosferatu/local/templatecomponents/intro02/todolist';
    }

    /**
     * Get the data to be used in the template.
     *
     * This method is called every time the template must be updated.
     * However, the Viirtual DOM diff is costly. To prevent unnecesary updates
     * the Template Component won't update the template if the data is the same
     * as the last update.
     *
     * @returns {Object}
     */
    getTemplateData() {
        const result = {
            todo: this.reactive.state.todo,
            done: this.reactive.state.done,
            hastasks: this.reactive.hasTasks(),
            hastodo: this.reactive.state.todo.size > 0,
            hasdone: this.reactive.state.done.size > 0,
        };
        return result;
    }

    stateReady() {
        // We want to reload the template when the state is ready. This is quite common
        // when the state is loaded using webservices instead of rendered in the server.
        this.refreshTemplate();

        // Even with the refresh in progress, the main element is also ready to be used
        // and add the event listener. It is important to delegate as much events to the
        // main element as possible to simplify the logic.
        this.addEventListener(this.element, 'submit', this.processSubmission);
        this.addEventListener(this.element, 'click', this.processClick);
    }

    /**
     * Process a submission event.
     *
     * We only have one form in this component, so we can process all the submissions here.
     *
     * @param {Event} event
     */
    processSubmission(event) {
        event.preventDefault();
        // We add an data-mdl-ref to the input field to be able to reference it.
        const nameInput = this.getReference('name');
        if (nameInput.value.trim() === '') {
            return;
        }
        this.reactive.dispatch('addTask', nameInput.value,);
        // All forms input are static (they won't refresh when the new HTML is loaded),
        // so we need to clear the input field manually.
        nameInput.value = '';
    }

    /**
     * Process component click events.
     *
     * We add special attributes for action (the mutation name) and id (the task id) to the elements.
     * This is a typical pattern to identify the action to be executed and simplify handlers.
     *
     * @param {Event} event
     */
    processClick(event) {
        const clickedElement = event.target.closest('[data-mdl-nosferatu-action]');
        if (!clickedElement) {
            return;
        }

        event.preventDefault();

        const taskid = parseInt(clickedElement.getAttribute('data-mdl-nosferatu-id'));
        const action = clickedElement.getAttribute('data-mdl-nosferatu-action');

        this.reactive.dispatch(action, taskid);
    }
}
