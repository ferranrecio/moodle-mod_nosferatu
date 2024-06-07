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

namespace mod_nosferatu\output;

use moodle_url;
use cminfo;
use mod_nosferatu\manager;

/**
 * Class responsible for generating the action bar elements in the database module pages.
 *
 * @package    mod_data
 * @copyright  2021 Mihail Geshoski <mihail@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class action_bar {

    /** @var manager $manager The module manager. */
    private $manager;

    /** @var moodle_url $currenturl The URL of the current page. */
    private $currenturl;

    /**
     * The class constructor.
     *
     * @param manager $manager The module manager.
     * @param moodle_url $pageurl The URL of the current page.
     */
    public function __construct(manager $manager, moodle_url $currenturl) {
        $this->manager = $manager;
        $this->currenturl = $currenturl;
    }

    /**
     * Generate the output for the action selector in the presets page.
     *
     * @return string The HTML code for the action selector.
     */
    public function get_view_bar(): string {
        global $PAGE;

        $renderer = $PAGE->get_renderer('mod_data');
        $sections = [
            [
                'name' => 'Get started',
                'section' => 'starter',
            ],
            [
                'name' => 'Basics',
                'section' => 'templatecomponents',
            ],
            [
                'name' => 'Advanced',
                'section' => 'beginner',
            ],
        ];
        $currentsection = $this->get_current_section();
        foreach ($sections as $sectionnum => $section) {
            if ($section['section'] == $currentsection) {
                $section['iscurrent'] = true;
            }
            $section['url'] = $this->get_section_url($section['section'])->out(false);
            $sections[$sectionnum] = $section;
        }
        $data = ['sections' => $sections];

        return $renderer->render_from_template('mod_nosferatu/action_bar', $data);
    }

    /**
     * Generate a section moodle_url from a custom section name.
     *
     * @param string $sectionname the section Name
     * @return moodle_url the section url
     */
    protected function get_section_url(string $sectionname): moodle_url {
        $url = new moodle_url($this->currenturl);
        $url->param('section', $sectionname);
        return $url;
    }

    /**
     * Get the current url section.
     *
     * @return string the current section
     */
    protected function get_current_section(): string {
        return $this->currenturl->param('section') ?? 'starter';
    }
}
