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
 * Activity manager class
 *
 * @package    mod_nosferatu
 * @copyright  2021 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace mod_nosferatu;

use context_module;
use cm_info;
use stdClass;
use mod_nosferatu\event\course_module_viewed;
use external_single_structure;
use external_multiple_structure;
use external_value;
use moodle_exception;

/**
 * Class manager for nosferatu activity
 *
 * @package    mod_nosferatu
 * @since      Moodle 3.9
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class manager {

    /** The plugin name. */
    public const PLUGIN = 'mod_nosferatu';

    /** The folder name. */
    public const MODULE = 'nosferatu';

    /** @var stdClass course_module record. */
    private $instance;

    /** @var context_module the current context. */
    private $context;

    /** @var cm_info course_modules record. */
    private $coursemodule;

    /**
     * Class contructor.
     *
     * @param cm_info $coursemodule course module info object
     * @param stdClass $instance instance object.
     */
    public function __construct(cm_info $coursemodule, stdClass $instance) {
        $this->coursemodule = $coursemodule;
        $this->instance = $instance;
        $this->context = context_module::instance($coursemodule->id);
        $this->instance->cmidnumber = $coursemodule->idnumber;
    }

    /**
     * Create a manager instance from an instance record.
     *
     * @param stdClass $instance the module record
     * @return manager
     */
    public static function create_from_instance(stdClass $instance): self {
        $coursemodule = get_coursemodule_from_instance(self::MODULE, $instance->id);
        // Ensure that $this->coursemodule is a cm_info object.
        $coursemodule = cm_info::create($coursemodule);
        return new self($coursemodule, $instance);
    }

    /**
     * Create a manager instance from an course_modules record.
     *
     * @param stdClass|cm_info $coursemodule a h5pactivity record
     * @return manager
     */
    public static function create_from_coursemodule($coursemodule): self {
        global $DB;
        // Ensure that $this->coursemodule is a cm_info object.
        $coursemodule = cm_info::create($coursemodule);
        $instance = $DB->get_record(self::MODULE, ['id' => $coursemodule->instance], '*', MUST_EXIST);
        return new self($coursemodule, $instance);
    }

    /**
     * Check if a user can see the activity attempts list.
     *
     * @param stdClass|null $user user record (default $USER)
     * @return bool if the user can see the attempts link
     */
    public function can_edit_entries(stdClass $user = null): bool {
        global $USER;
        if (!$this->instance->enabletracking) {
            return false;
        }
        if (empty($user)) {
            $user = $USER;
        }
        return has_capability('mod/nosferatu:editentries', $this->context, $user);
    }

    /**
     * Return the current context.
     *
     * @return context_module
     */
    public function get_context(): context_module {
        return $this->context;
    }

    /**
     * Return the current instance.
     *
     * @return stdClass the instance record
     */
    public function get_instance(): stdClass {
        return $this->instance;
    }

    /**
     * Return the current cm_info.
     *
     * @return cm_info the course module
     */
    public function get_coursemodule(): cm_info {
        return $this->coursemodule;
    }

    /**
     * Trigger module viewed event and set the module viewed for completion.
     *
     * @param stdClass $course course object
     * @return void
     */
    public function set_module_viewed(stdClass $course): void {
        global $CFG;
        require_once($CFG->libdir . '/completionlib.php');

        // Trigger module viewed event.
        $event = course_module_viewed::create([
            'objectid' => $this->instance->id,
            'context' => $this->context
        ]);
        $event->add_record_snapshot('course', $course);
        $event->add_record_snapshot('course_modules', $this->coursemodule);
        $event->add_record_snapshot(self::MODULE, $this->instance);
        $event->trigger();

        // Completion.
        $completion = new \completion_info($course);
        $completion->set_module_viewed($this->coursemodule);
    }

    /**
     * Create or update an entry.
     */
    public function put_entry($data) {
        global $USER, $DB;
        if (!isset($data->userid)) {
            $data->userid = $USER->id;
        }
        if ($data->userid != $USER->id && !$this->can_edit_entries()) {
            throw new moodle_exception('Cannot post as this user');
        }

        // Check if it is editing an existing entry.
        if (empty($data->id)) {
            $record = (object)[
                'nosferatuid' => $this->instance->id,
                'userid' => $USER->id,
                'timecreated' => time(),
                'timemodified' => time(),
                'current' => $data->current ?? 0,
                'content' => $data->content ?? 0,
            ];
            $record->id = $DB->insert_record('nosferatu_entries', $record);
            return $record;
        }

        // Update the entry.
        $record = $DB->get_record(
            'nosferatu_entries',
            [
                'id' => $data->id,
                'nosferatuid' => $this->instance->id,
            ]
        );
        if (empty($record)) {
            throw new moodle_exception("Invalid entry {$data->id}");
        }

        $record->timemodified = time();
        $record->current = $data->current ?? $record->current;
        $record->content = $data->content ?? $record->content;

        if (!$DB->update_record('nosferatu_entries', $record)) {
            throw new moodle_exception("Error updating entry {$data->id}");
        }

        return $record;
    }

    /**
     * Return the current instance state object.
     *
     * @return stdClass the activity state.
     */
    public function get_state(): stdClass {
        global $DB;

        $activity = (object)[
            'id' => $this->instance->id,
            'cmid' => $this->coursemodule->id,
            'canedit' => $this->can_edit_entries(),
        ];

        $entries = [];
        $records = $DB->get_records('nosferatu_entries', ['nosferatuid' => $this->instance->id]);
        foreach ($records as $record) {
            $entries[] = $this->get_entry_state($record);
        }

        return (object)[
            'activity' => $activity,
            'entries' => $entries,
        ];
    }

    /**
     * Generate a entry state object.
     *
     * @param stdClass the entry record
     * @return stdClass the entry state object.
     */
    public function get_entry_state(stdClass $record): stdClass {
        return (object)[
            'id' => $record->id,
            'userid' => $record->userid,
            'current' => $record->current,
            'content' => $record->content,
        ];
    }

    /**
     * Generate a entry update object.
     *
     * @param stdClass the entry record
     * @return stdClass the entry update object.
     */
    public function get_entry_state_update(stdClass $record): stdClass {
        return (object)[
            'name' => 'entries',
            'action' => 'put',
            'fields' => $this->get_entry_state($record),
        ];
    }

    /**
     * Generate a entry delete object.
     *
     * @param int the entry id
     * @return stdClass the entry update object.
     */
    public function get_entry_state_delete(int $recordid): stdClass {
        return (object)[
            'name' => 'entries',
            'action' => 'delete',
            'fields' => (object)['id' => $recordid],
        ];
    }

    /**
     * Get the state structure.
     *
     * @return external_single_structure
     */
    public static function get_state_structure(): external_single_structure {
        return new external_single_structure([
            'activity' => new external_single_structure(
                [
                    'id' => new external_value(PARAM_INT, 'Activity ID'),
                    'cmid' => new external_value(PARAM_INT, 'Activity course module ID'),
                    'canedit' => new external_value(PARAM_BOOL, 'If the user can edit any entry'),
                ],
                'Activity general data'
            ),
            'entries' => new external_multiple_structure(
                self::get_entry_structure(),
                'The activity entries list'
            ),
        ], 'Module state');
    }

    /**
     * Get the state structure.
     *
     * @return external_single_structure
     */
    public static function get_entry_structure(): external_single_structure {
        return new external_single_structure(
            [
                'id' => new external_value(PARAM_INT, 'Entry ID'),
                'userid' => new external_value(PARAM_INT, 'The user id'),
                'current' => new external_value(PARAM_INT, 'If it is a current entry'),
                'content' => new external_value(PARAM_RAW, 'The content itself'),
            ]
        );
    }

    /**
     * Get the state structure.
     *
     * @return external_single_structure
     */
    public static function get_update_structure(): external_multiple_structure {
        return new external_multiple_structure(
            new external_single_structure(
                [
                    'name' => new external_value(PARAM_INT, 'The state element to update'),
                    'action' => new external_value(PARAM_INT, 'The action to perform'),
                    'fields' => manager::get_entry_structure(),
                ]
            ),
            'The activity entries list'
        );
    }
}
