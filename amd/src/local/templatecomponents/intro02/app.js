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
 * TODO describe module app
 *
 * @module     mod_nosferatu/local/templatecomponents/intro02/app
 * @copyright  2024 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {Reactive} from 'core/reactive';
import {eventTypes, notifyModNosferatuStateUpdated} from 'mod_nosferatu/events';

// All your reactive components will share the same reactive APP instance.
// This file is a simple example of how a reactive APP module can be created.

// This is out initial state. All components will watch those data and react to any change.
// For more complex aplications this state will be loaded using a webservice but, for now,
// we will use some lists.
const state = {
    todo: [
        {
            id: 1,
            name: 'Create a new Template Component',
        },
        {
            id: 2,
            name: 'Understand state mutations',
        },
    ],
    done: [
        {
            id: 3,
            name: 'Learn the basics of the Reactive API',
        },
    ],
    // You can add more arrays or objects in the first level, but not simple values.
};

// It is recommended to use your own reactive class extending the base one.
// By having your own class you will be able to add global methods to you application
// because all components will inherit the main reactive instance.
class TodoList extends Reactive {
    /**
     * Check if has some task.
     *
     * @returns {boolean}
     */
    hasTasks() {
        return this.state.todo.size > 0 || this.state.done.size > 0;
    }
}

// In next examples we will see that having having mutation methods in its own
// class is a good practice. However, for this simple example we will keep them here.

class Mutations {
    /**
     * Add a new task to the todo list.
     *
     * @param {StateManager} stateManager State manager.
     * @param {string} taskName Task name.
     */
    addTask(stateManager, taskName) {
        const state = stateManager.state;
        const task = {
            id: this._getNextId(state),
            name: taskName,
        };
        stateManager.setReadOnly(false);
        state.todo.add(task);
        stateManager.setReadOnly(true);
    }

    /**
     * Remove a task from the lists.
     *
     * @param {StateManager} stateManager State manager.
     * @param {number} taskId Task id.
     * @throws {Error} If the task is not removed.
     */
    removeTask(stateManager, taskId) {
        const state = stateManager.state;
        stateManager.setReadOnly(false);
        if (!state.todo.delete(taskId) && !state.done.delete(taskId)) {
            throw new Error('Task ' + taskId + ' not found');
        }
        stateManager.setReadOnly(true);
    }

    /**
     * Move a task to the done list.
     *
     * @param {StateManager} stateManager State manager.
     * @param {number} taskId Task id.
     */
    markDone(stateManager, taskId) {
        const state = stateManager.state;
        const task = state.todo.get(taskId);
        if (!task) {
            throw new Error('Task ' + taskId + ' not found');
        }
        stateManager.setReadOnly(false);
        state.todo.delete(taskId);
        state.done.add(task);
        stateManager.setReadOnly(true);
    }

    /**
     * Move a task to the todo list.
     *
     * @param {StateManager} stateManager State manager.
     * @param {number} taskId Task id.
     */
    markTodo(stateManager, taskId) {
        const state = stateManager.state;
        const task = state.done.get(taskId);
        if (!task) {
            throw new Error('Task ' + taskId + ' not found');
        }
        stateManager.setReadOnly(false);
        state.done.delete(taskId);
        state.todo.add(task);
        stateManager.setReadOnly(true);
    }

    /**
     * Calculate the first free id.
     *
     * In most cases, we don't need to calculate the next id because the
     * server will provide it. However, in this case, we are implementing a
     * full frontend application and we don't send the data to the server.
     *
     * @param {Object} state the state data
     * @returns
     */
    _getNextId(state) {
        return Math.max(...state.todo.keys(), ...state.done.keys()) + 1;
    }
}

// The reactive instance requires an event (eventNamer and eventDispatch method)
export const reactive = new TodoList({
    name: 'mod_nosferatu_example',
    eventName: eventTypes.modNosferatuStateUpdated,
    eventDispatch: notifyModNosferatuStateUpdated,
    state,
    mutations: new Mutations(),
});
