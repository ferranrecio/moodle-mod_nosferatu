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
 * Module to export parts of the state and transform them to be used in templates
 * and as draggable data.
 *
 * @module     mod_nosferatu/local/intermediate/exporter
 * @class      mod_nosferatu/local/intermediate/exporter
 * @copyright  2022 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
export default class {

    /**
     * Class constructor.
     *
     * It is recommended to store the reactive instance also in the exported.
     * For now it won't have any use but when the application get complex
     * it can be used to call extra methods.
     *
     * @param {Reactive} reactive the course editor object
     */
    constructor(reactive) {
        this.reactive = reactive;
    }

    /**
     * Generate the people export data from the state.
     *
     * @param {Object} state the current state.
     * @returns {Object}
     */
    people(state) {
        // Collect section information from the state.
        const data = {
            // State stores maps of key-values instead of simple arrays.
            people: [],
        };
        state.people.forEach(person => {
            data.people.push({...person});
        });
        data.haspeople = (data.people.length != 0);
        return data;
    }
}
