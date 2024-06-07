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
 * The simplfied main app component.
 *
 * @module     mod_nosferatu/local/simplified
 * @class      mod_nosferatu/local/simplified
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {TemplateComponent} from 'core/reactive';

export default class extends TemplateComponent {

    /**
     * All the component definition should be initialized on the "create" method.
     */
    create() {
        // This is an optional name for the debugging messages.
        this.name = 'nosferatu-app-container';
    }

    getTemplateName() {
        return 'mod_nosferatu/simplified';
    }

    getTemplateData() {
        return {
            people: this.reactive.state.people,
            haspeople: this.reactive.hasPeople(),
        };
    }

    /**
     * Initial state ready method.
     */
    stateReady() {
        this.refreshTemplate();
    }
}
