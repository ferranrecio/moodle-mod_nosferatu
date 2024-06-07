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

import {Reactive} from 'core/reactive';
import {mutations} from 'mod_nosferatu/local/simplified/mutations';
import {eventTypes, notifyModNosferatuStateUpdated} from 'mod_nosferatu/events';

// All your reactive components will share the same reactive APP instance.
// This file is a simple example of how a reactive APP module can be created.

// This is out initial state. All components will wathc those data and react to any change.
// For more complex aplications this state will be loaded using a webservice but, for now,
// we will use a simple object.
const state = {
    'people': [
        {
            // For arrays, it is important each item has an unique id.
            // Otherwise you will get an exception.
            id: 1,
            name: 'Carlos',
            bitten: false,
        },
        {
            id: 2,
            name: 'Amaia',
            bitten: false,
        },
        {
            id: 3,
            name: 'Sara',
            bitten: false,
        },
        {
            id: 4,
            name: 'Ilya',
            bitten: true,
        },
        {
            id: 5,
            name: 'Ferran',
            bitten: false,
        },
    ],
    // You can add more arrays or objects in the first level, but not simple values.
};

// It is recommended to use your own reactive class extending the base one.
// By having your own class you will be able to add global methods to you application
// because all components will inherit the main reactive instance.
class Nosferatu extends Reactive {
    /**
     * Check is someone has been bitten.
     *
     * @returns {boolean}
     */
    isSomeoneBitten() {
        return this.state.people.values().some((person) => person.bitten == true);
    }

    /**
     * Check if there are people.
     *
     * @returns {boolean}
     */
    hasPeople() {
        return this.state.people.size > 0;
    }
}

// The reactive instance requires an event (eventNamer and eventDispatch method)
export const reactive = new Nosferatu({
    name: 'mod_nosferatu_simplified',
    eventName: eventTypes.modNosferatuStateUpdated,
    eventDispatch: notifyModNosferatuStateUpdated,
    state,
    mutations,
});

/**
 * Load the initial state.
 *
 * For now the state only exists in the frontend but in more complex scenarios
 * the state data will be generated using a webservice.
 */
export const init = () => {
    // In this example we don't need to set anything because it is only a frontend
    // aplication. In future examples the initial state will be loaded asynchronous
    // and the init method will to all the initializing work.
};
