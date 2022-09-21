<?php

/**
 * Prints an instance of mod_nosferatu.
 *
 * @package     mod_nosferatu
 * @copyright   2021 Ferran Recio <ferran@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

use mod_nosferatu\manager;

require(__DIR__ . '/../../config.php');
require_once(__DIR__ . '/lib.php');

$id = required_param('id', PARAM_INT);
$section = optional_param('section', 'starter', PARAM_ALPHA);

list($course, $cm) = get_course_and_cm_from_cmid($id, 'nosferatu');

require_login($course, true, $cm);

$manager = manager::create_from_coursemodule($cm);

$instance = $manager->get_instance();

$context = $manager->get_context();

// Trigger module viewed event and completion.
$manager->set_module_viewed($course);

$url = new moodle_url('/mod/nosferatu/view.php', ['id' => $cm->id, 'section' => $section]);
$PAGE->set_url($url);

$shortname = format_string($course->shortname, true, ['context' => $context]);
$pagetitle = strip_tags($shortname . ': ' . format_string($instance->name));
$PAGE->set_title(format_string($pagetitle));

$PAGE->set_heading(format_string($course->fullname));
$PAGE->set_context($context);

echo $OUTPUT->header();
echo $OUTPUT->heading(format_string($instance->name));

// Render the activity information.
$completiondetails = \core_completion\cm_completion_details::get_instance($cm, $USER->id);
$activitydates = \core\activity_dates::get_dates_for_module($cm, $USER->id);
echo $OUTPUT->activity_information($cm, $completiondetails, $activitydates);

$instance = $manager->get_instance();
if (!empty($instance->intro)) {
    echo $OUTPUT->box(format_module_intro('nosferatu', $instance, $cm->id), 'generalbox', 'intro');
}

$navigation = new mod_nosferatu\output\action_bar($manager, $url);
echo $navigation->get_view_bar();

switch ($section) {
    case 'beginner':
        $widget = new mod_nosferatu\output\beginner($manager, $section);
        break;
    default:
        $widget = new mod_nosferatu\output\starter($manager, $section);
        break;
}
echo $OUTPUT->render($widget);

echo $OUTPUT->footer();
