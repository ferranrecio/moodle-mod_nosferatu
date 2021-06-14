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
 * H5P activity external functions and service definitions.
 *
 * @package    mod_nosferatu
 * @copyright  2021 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

$functions = [
    'mod_nosferatu_get_state' => [
        'classname'     => 'mod_nosferatu\external\get_state',
        'classpath'     => '',
        'description'   => 'Return the activity state.',
        'type'          => 'read',
        'capabilities'  => 'mod/nosferatu:view',
    ],
    'mod_nosferatu_put_entry' => [
        'classname'     => 'mod_nosferatu\external\put_entry',
        'classpath'     => '',
        'description'   => 'Update or create a nosferatu activity entry.',
        'type'          => 'write',
        'capabilities'  => 'mod/nosferatu:view',
    ],
];
