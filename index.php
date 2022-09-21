<?php

/**
 * Display information about all the mod_nosferatu modules in the requested course.
 *
 * @package     mod_nosferatu
 * @copyright   2020 Ferran Recio <ferran@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

use mod_nosferatu\manager;

require(__DIR__ . '/../../config.php');
require_once(__DIR__ . '/lib.php');

$id = required_param('id', PARAM_INT);

$course = $DB->get_record('course', ['id' => $id], '*', MUST_EXIST);
require_course_login($course);

$coursecontext = context_course::instance($course->id);

$event = \mod_nosferatu\event\course_module_instance_list_viewed::create(['context' => $coursecontext]);
$event->add_record_snapshot('course', $course);
$event->trigger();

$PAGE->set_url('/mod/' . manager::MODULE . '/index.php', ['id' => $id]);
$PAGE->set_title(format_string($course->fullname));
$PAGE->set_heading(format_string($course->fullname));
$PAGE->set_context($coursecontext);

echo $OUTPUT->header();

$modulenameplural = get_string('modulenameplural', manager::PLUGIN);
echo $OUTPUT->heading($modulenameplural);

$activities = get_all_instances_in_course(manager::MODULE, $course);

if (empty($activities)) {
    notice(get_string('thereareno', 'moodle'), new moodle_url('/course/view.php', ['id' => $course->id]));
    exit;
}

$table = new html_table();
$table->attributes['class'] = 'generaltable mod_index';

$align = ['center', 'left'];
if ($course->format == 'weeks') {
    $table->head  = [get_string('week'), get_string('name')];
    $table->align = ['center', 'left'];
} else if ($course->format == 'topics') {
    $table->head  = [get_string('topic'), get_string('name')];
    $table->align = ['center', 'left'];
} else {
    $table->head  = [get_string('name')];
    $table->align = ['left'];
}

foreach ($activities as $activity) {
    $attributes = [];
    if (!$activity->visible) {
        $attributes['class'] = 'dimmed';
    }
    $link = html_writer::link(
        new moodle_url('/mod/' . manager::MODULE . '/view.php', ['id' => $activity->coursemodule]),
        format_string($activity->name, true),
        $attributes
    );

    if ($course->format == 'weeks' or $course->format == 'topics') {
        $table->data[] = [$activity->section, $link];
    } else {
        $table->data[] = [$link];
    }
}

echo html_writer::table($table);
echo $OUTPUT->footer();
