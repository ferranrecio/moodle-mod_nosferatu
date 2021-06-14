<?php

/**
 * Library of interface functions and constants.
 *
 * @package     mod_nosferatu
 * @copyright   2021 Ferran Recio <ferran@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

use mod_nosferatu\manager;

/**
 * Checks if the activity supports a specific feature.
 *
 * @param string $feature FEATURE_xx constant for requested feature
 * @return mixed True if module supports feature, false if not, null if doesn't know
 */
function nosferatu_supports(string $feature): ?bool {
    switch ($feature) {
        case FEATURE_MOD_INTRO:
            return true;
        case FEATURE_SHOW_DESCRIPTION:
            return true;
        default:
            return null;
    }
}

/**
 * Saves a new instance of the mod_nosferatu into the database.
 *
 * Given an object containing all the necessary data, (defined by the form
 * in mod_form.php) this function will create a new instance and return the id
 * number of the instance.
 *
 * @param stdClass $data An object from the form.
 * @param mod_nosferatu_mod_form $mform The form.
 * @return int The id of the newly inserted record.
 */
function nosferatu_add_instance(stdClass $data, mod_nosferatu_mod_form $mform = null): int {
    global $DB;

    $data->timecreated = time();
    $data->timemodified = $data->timecreated;
    $cmid = $data->coursemodule;

    $data->id = $DB->insert_record(manager::FOLDER, $data);

    // We need to use context now, so we need to make sure all needed info is already in db.
    $DB->set_field('course_modules', 'instance', $data->id, ['id' => $cmid]);

    // Extra fields required in grade related functions.
    $data->cmid = $data->coursemodule;
    return $data->id;
}

/**
 * Updates an instance of the mod_nosferatu in the database.
 *
 * Given an object containing all the necessary data (defined in mod_form.php),
 * this function will update an existing instance with new data.
 *
 * @param stdClass $data An object from the form in mod_form.php.
 * @param mod_nosferatu_mod_form $mform The form.
 * @return bool True if successful, false otherwise.
 */
function nosferatu_update_instance(stdClass $data, mod_nosferatu_mod_form $mform = null): bool {
    global $DB;

    $data->timemodified = time();
    $data->id = $data->instance;

    // Update gradings if grading method or tracking are modified.
    $data->cmid = $data->coursemodule;

    return $DB->update_record(manager::FOLDER, $data);
}

/**
 * Removes an instance of the mod_nosferatu from the database.
 *
 * @param int $id Id of the module instance.
 * @return bool True if successful, false on failure.
 */
function nosferatu_delete_instance(int $id): bool {
    global $DB;

    $activity = $DB->get_record(manager::FOLDER, ['id' => $id]);
    if (!$activity) {
        return false;
    }

    $DB->delete_records(manager::FOLDER, ['id' => $id]);

    return true;
}

/**
 * Return a list of page types
 *
 * @param string $pagetype current page type
 * @param stdClass|null $parentcontext Block's parent context
 * @param stdClass $currentcontext Current context of block
 * @return array array of page types and it's names
 */
function nosferatu_page_type_list(string $pagetype, ?stdClass $parentcontext, stdClass $currentcontext): array {
    $modulepagetype = [
        'mod-' . manager::FOLDER . '-*' => get_string('page-mod-' . manager::FOLDER . '-x', manager::FOLDER),
    ];
    return $modulepagetype;
}
