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
import {mutations} from 'mod_nosferatu/mutations';
import {eventTypes, notifyModNosferatuStateUpdated} from 'mod_nosferatu/events';
import log from 'core/log';
import ajax from 'core/ajax';
import config from 'core/config';

/**
 * Load the current course state from the server.
 *
 * @param {int} activityid the activity id
 * @returns {Object} the current course state
 */
const getServerState = async(activityid) => {
    const stateData = await ajax.call([{
        methodname: 'mod_nosferatu_get_state',
        args: {
            activityid
        }
    }])[0];

    return stateData;
};

/**
 * Set up the course editor when the page is ready.
 *
 * The course can only be loaded once per instance. Otherwise an error is thrown.
 *
 * @param {int} activityid the activity id
 * @param {Reactive} reactive the reactive instance
 */
const loadState = async(activityid, reactive) => {

    let stateData;

    try {
        stateData = await getServerState(activityid);
    } catch (error) {
        log.error("EXCEPTION RAISED WHILE INIT STATE");
        log.error(error);
        return;
    }

    reactive.setInitialState(stateData);
};

/**
 * Main modfule module reactive class.
 *
 *
 * @module     core_courseformat/mod/nosferatu/nosferatu
 * @class     core_courseformat/mod/nosferatu/nosferatu
 * @copyright  2021 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class Nosferatu extends Reactive {

}

export const nosferatu = new Nosferatu({
    name: 'mod_nosferatu',
    eventName: eventTypes.modNosferatuStateUpdated,
    eventDispatch: notifyModNosferatuStateUpdated,
    mutations: mutations,
});

// Load initial state.
export const init = (cmid) => {
    loadState(cmid, nosferatu);
};

// While we don't have dev tools, save reactive globally.
config.nosferatu = nosferatu;


