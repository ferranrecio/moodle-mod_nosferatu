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

import ajax from 'core/ajax';

/**
 * Default mutation manager
 *
 * @module     mod_nosferatu/mutations
 * @class     mod_nosferatu/mutations
 * @copyright  2021 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class Mutations {

    /**
     * Private method to call core_courseformat_update_course webservice.
     *
     * @method _callPutEntryWebservice
     * @param {Number} activityid the activity id
     * @param {Object} fields the entry fields
     * @return {Array} of state updates
     */
    async _callPutEntryWebservice(activityid, fields) {
        let ajaxresult = await ajax.call([{
            methodname: 'mod_nosferatu_put_entry',
            args: {
                activityid,
                fields,
            }
        }])[0];
        return ajaxresult;
    }

}

export const mutations = new Mutations();
