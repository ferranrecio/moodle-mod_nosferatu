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
 * Contains class mod_nosferatu\output\simplified
 *
 * @package   mod_nosferatu
 * @copyright 2020 Ferran Recio
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace mod_nosferatu\output;

defined('MOODLE_INTERNAL') || die();

use mod_nosferatu\manager;
use renderable;
use templatable;
use renderer_base;
use stdClass;

/**
 * Class to help display report link in mod_nosferatu.
 *
 * @copyright 2020 Ferran Recio
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class templatecomponents implements renderable, templatable {

    protected $manager;

    /**
     * Constructor.
     *
     */
    public function __construct(manager $manager) {
        global $PAGE;

        $this->manager = $manager;

        // This is our main aplication output component. This module is responsible for
        // initialize the state.
        // Init state object.
        // $instance = $manager->get_instance();
        // $PAGE->requires->js_call_amd('mod_nosferatu/local/simplified/nosferatu', 'init', [$instance->id]);
    }

    /**
     * Export this data so it can be used as the context for a mustache template.
     *
     * @param renderer_base $output
     * @return stdClass
     */
    public function export_for_template(renderer_base $output) {
        $activity = $this->manager->get_instance();

        $data = (object) [
            'id' => $activity->id,
            'name' => $activity->name,
            'baseurl' => $this->manager->get_view_url(),
        ];
        return $data;
    }
}
