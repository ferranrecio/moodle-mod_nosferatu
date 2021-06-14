<?php
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
 * This is the external method for getting the information needed to present an attempts report.
 *
 * @package    mod_h5pactivity
 * @since      Moodle 3.9
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace mod_h5pactivity\external;

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->libdir . '/externallib.php');

use mod_nosferatu\manager;
use external_api;
use external_function_parameters;
use external_value;
use external_multiple_structure;
use external_single_structure;
use external_warnings;
use moodle_exception;
use context_module;
use stdClass;

/**
 * Get the initial state.
 *
 * @copyright  2021 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class get_state extends external_api {

    /**
     * Webservice parameters.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters(
            [
                'activityid' => new external_value(PARAM_INT, 'The activity instance id'),
            ]
        );
    }

    /**
     * Return user attempts information in an activity.
     *
     * @throws  moodle_exception if the user cannot see the report
     * @param  int $activityid The activity id
     * @return stdClass report data
     */
    public static function execute(int $activityid): stdClass {
        global $USER;

        $params = external_api::validate_parameters(self::execute_parameters(), [
            'activityid' => $activityid,
        ]);
        $activityid = $params['activityid'];

        $warnings = [];

        // Request and permission validation.
        list($course, $cm) = get_course_and_cm_from_instance($activityid, manager::FOLDER);

        $context = context_module::instance($cm->id);
        self::validate_context($context);

        $manager = manager::create_from_coursemodule($cm);

        return $manager->get_state();
    }

    /**
     * Describes the get_h5pactivity_access_information return value.
     *
     * @return external_single_structure
     */
    public static function execute_returns(): external_single_structure {
        return manager::get_state_structure();
    }

}
