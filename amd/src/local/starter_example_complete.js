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
 * Test component example.
 *
 * This file will be your first reactive example. All the code is structures to support the learning
 * path, not to be optimal or canonical. The exercice is divided into incremental steps and each step
 * adds new code. When one step is implemented, you don't need to modify that code anymore, you will
 * only need to add more code below.
 *
 * In a real scenario, most of the code will be located in
 * different modules in a more logical way. However, as a first example it guide you through most of
 * the reactive high concepts.
 *
 * Later in the course you will reimplement the same example but with the correct module structure
 * so don't worry too much about not following the Moodle conventions right now.
 *
 * @module     mod_nosferatu/local/starter_example_complete
 * @package    core_course
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {Reactive, BaseComponent} from 'core/reactive';
import {eventTypes, notifyModNosferatuStateUpdated} from 'mod_nosferatu/events';

// Usually modules have a single init method. However, this will go against the example narrative
// because it will forces you to go scroll up and down at a certain steps. I want you focused in the
// reactive part so you can push here any logic you want to execute on the init method.
const onInit = [];

/**
 * Init the example.
 *
 * You don't need to alter this method in this example. You can add any init logic by pushing
 * directly into the onInit array.
 *
 * @param {element|string} target the DOM main element or its ID
 */
export const init = function(target) {
    const element = document.getElementById(target);
    onInit.forEach(
        method => method(element)
    );
};

// YOUR CODE STARTS HERE!!!

// Let's build our first reactive components. In later examples we will see how to split the logic
// in a more mantainable structure but first you need to understand the masin elements involed.

// Our story starts in a small city in Transilvania. The citizen of this town live their lives happy
// but they don't know a vampire is stalking them in the dark. The component you are going to build
// displays the list of citizens and has a button on each one of them to mark what of them have been
// bitten by the vampire. Finally, you will add an extra button to cure all the citizens.

// In this example you will learn how to:
// - Instantiate a reactive module to store the frontend state data
// - Delegate UI logic to components that react to the state changes
// - Implement mutations to alter the state fom the components.

// === STEP 1: building our initial state ===

// This is the most abstract part of the process. In a reactive pattern, all related UI component uses
// the same data structure to decide how to present things. This data structure is called reactive "state".
// Any change on that structure will be notified to the components so they can alter a part of the UI.
//
// Working with a reactive state has many advantages over the traditional approach:
//
// - More than one component can represent the same part of the state but they don't need to be
//   aware each other.
// - User interactions won't change the HTML elements but only will change data from the state so
//   any state watcher will get notified (this is called mutations and we will see it ina few minutes).
// - We can add more components at any moment, even adding alternative ways to do the same mutation
//   because the refreshing logic and the mutation one are independent.

// Ok, enough theory for not. Let's talk about our city. In our case, the reactive state will be the list
// of citizens. Each citizen will have: id (int), name (string) and bitten (bool) attributes. Something like:

const state = {
    'people': [
        {
            id: 1,
            name: 'Carlos',
            bitten: false,
        },
        {
            id: 2,
            name: 'Amaia',
            bitten: false,
        },
        {
            id: 3,
            name: 'Sara',
            bitten: false,
        },
        {
            id: 4,
            name: 'Ilya',
            bitten: true,
        },
        {
            id: 5,
            name: 'Ferran',
            bitten: false,
        },
    ],
};

// As you can see, ony the user with ID 4 is bitten.

// Implementing a deep reactive state is complex and will require many frontend resources.To keep
// the state fast and simple, our library can ONLY store two kind of data at the ROOT level:
//  - Object with attributes
//  - Sets of objects with id attributes.
//
// This means following cases are NOT allowed at a state ROOT level(throws an exception):
// - Simple values(strings, boolean...).
// - Arrays of simple values.
// - Array of objects without ID attribute(all arrays will be converted to maps and requires an ID).

// === STEP 2: the reactive instance ===

// Many reactive components may coexist in the same page. In our example, the course editor has it's own
// reactive components, while our mod_nosferatu has their own. However, each components watches a specific
// state data so they won't interfiere whith one another.
//
// To ensure each component works as expected. Each component must be "registered" in a specfici reactive
// instance. A reactive instance is an object that handle all the watchers logic and contains the current
// state data.

// Later we will see a better way of creating a reactive instance but, for now, we only need a reactive
// instance to store our state.

const city = new Reactive({
    name: 'mod_nosferatu_city',
    eventName: eventTypes.modNosferatuStateUpdated,
    eventDispatch: notifyModNosferatuStateUpdated,
    state,
});

// The reactive constructor get and object with the instance description. The only required attributes
// are "eventName" and "eventDispatch". All the reactive library uses native JS events and all components
// must provide their own.
//
// In our case we also include the initial state, but it is not required to create an instance because, in
// most cases we will need to call the backend to get the initial state when the page is already served.
// The name attribute is just to make more readable the debugging messages and it is optional, but recommended.

// === STEP 3: the main component ===

// Now we have everything ready to build our first component. That compoment will watch any change in a
// citizen and update the UI.


// This class will to the job. To understand how a component works you need to understand the component
// lifecycle.
// - create: before the component is registered. This method is used to define
//           the main component attributes.
//
// - getWatchers: at the moment the reactive instance is registering the watchers. This method
//                return a list of state changes handlers. We will see in a minute.
//
// - stateReady: when the reactive instance has the initial state state_loaded. Is important to note
//               that this method will be called even if the component is registered after the initial
//               is loaded. For all purposes, this method is the equivalent of page ready for compoments.
//
// - unregister: if the component is unregistered from the reactiv instance
// - destroy: if the component is removed form the page

class CitizenList extends BaseComponent {

    /**
     * It is important to follow some conventions while you write components. This way all components
     * will be implemented in a similar way and anybody will be able to understand how it works.
     *
     * All the component definition should be initialized on the "create" method.
     */
    create() {
        // This is an optional name for the debugging messages.
        this.name = 'CitizenList';
        // We will always define our component HTML selectors and classes this way so we only define
        // once and we don't contaminate our logic with tags and other stuff.
        this.selectors = {
            PERSON: `[data-for='person']`,
            PERSONNAME: `[data-for='personname']`,
        };
        this.classes = {
            BITTEN: `bitten`,
        };
        // If you need local attributes like ids os something it should be initialized here.
    }

    /**
     * Initial state ready method.
     *
     * Note in this case we want our stateReady to be async.
     *
     * @param {object} state the initial state
     */
    stateReady(state) {
        // At this poitn we have the initial state. This means we can update the component
        // in case some of the citizens is already bitten.
        state.people.forEach((person) => {
            this._refreshPerson({element: person});
        });
    }

    /**
     * We want to update the person every time something in its state change. To do this we need
     * to define a watcher.
     *
     * @returns {Array} of watchers
     */
    getWatchers() {
        return [
            {watch: `people:updated`, handler: this._refreshPerson},
        ];
    }

    /**
     * We will trigger that method any time a person data changes. This method is used by stateReady
     * but, most important, to watch the state. Any watcher receive an object with:
     * - element: the afected element (a person in this case)
     * - state: the full state object
     *
     * @param {object} element the person structure.
     */
    _refreshPerson({element}) {
        // We have a convenience method to locate elements inside the component.
        const target = this.getElement(this.selectors.PERSON, element.id);
        // Add or remove the bitten class.
        target.classList.toggle(this.classes.BITTEN, element.bitten ?? false);
        // Update the citizen name
        const name = target.querySelector(this.selectors.PERSONNAME);
        name.innerHTML = element.name;
    }
}

// At this point we still don't know where is the HTML element controled by this component.
// We add the creation logic to the "init" method.

onInit.push(
    element => {
        // The only mantadory defintion for ALL components is a main HTML element, if you try to create
        // a component without en element you will get an exception.
        // We also specify is the reactive instance to register to. Later in the example
        // you will see a component with a diferent creations definition, so keep this in mind ;-).
        new CitizenList({
            element: element,
            reactive: city,
        });
    }
);

// === STEP 4: access the reactive debug object ===

// At this point the main component updates the people state using the initial state (for example the
// user with ID 4 should appear as bitten). We also add a "people:updated" watcher to update the information
// if the vampire attack some of our citizens. However, it seems that we are still un daylight because
// we have no way to test the watchers, yet.
//
// In this step you will learrn how to use the reactive debug tools in the browser console. Some of the
// console commands I will ask you to execute may sound a bit strange at first, but you will get used to
// them quickly.
//
// First of all, enable the debug mode in your instance. The debug tools are only available when debug
// is enabled. If you use mdk just execute: mdk run mindev.php

// Great. Now if you open the console and refresh the page you should see some console logs like:
// - Debug module "M.reactive" loaded.
// - Registering new reactive instance "M.reactive.mod_nosferatu_city"

/*
As I explain to to, your component is watching any state change so we need to access your reactive instance
debug object. To do so you just need to execute:

M.reactive;

This object contants objects to interact with the reactive instances. It is important to note
that this object is not the reactive instance but a wrapper optimized to be used from the JS console. In our
case we will interact with M.reactive.mod_nosferatu_city

Before we start changing your state like a true vampire, I want you to show some of the tools you can access
using the debug object. Please, execute:

M.reactive.mod_nosferatu_city.highlight = true;

If everything goes as it should, your people list will get highlighted with a horrendous blue border.
Use this attribute to highligh all the components registered into the reactive instance.

As you can imagine, you can turn off the highliting you just need to execute:

M.reactive.mod_nosferatu_city.highlight = false;

There are many more interesting options you can access using the debug object, but I am sure you in a hurry
to bite some necks so in the next step I will guide you through the state changes.
*/

// === STEP 5: manually update the state using the debug object ===

/*
I am quite sure that if I tell you that you can a person state doing
"M.reactive.mod_nosferatu_city.state.people.get(2)" you will inmidiatelly execute:

M.reactive.mod_nosferatu_city.state.people.get(2).bitten = true;

Am I right?

If you do it you most probably get a nice exception with a message like "State locked. Use mutations
to change bitten value in people". Nice try Count von Count. I will explain to you what just happen.

There are some good practices any component-based interface should respects to guarantee the independence
between components. One of the most important is that components cannot manipulate the state. Even if the
component has a button to perfom some actions. Components can only ask the reactive module de execute
something called "mutation" to alter the state and alert all the watchers. That is the reason why trying
to manipulate the state triggers an exception.

We will see how to program a mutation in the next step. However, using the debug object we can manipulate
the state to test your components. Before you alter some state value you need to disable the readOnly mode.
To do so execute the following commands:

M.reactive.mod_nosferatu_city.readOnly = false;

M.reactive.mod_nosferatu_city.state.people.get(2).bitten = true;

As you can see, now you don't get the exception anymore. Now, if you log the person object you will see that
it is bitten. To do so execute:

M.reactive.mod_nosferatu_city.state.people.get(2);

But I know what are you thinking. If the state is modified, why my component is not changing? To understand
what is happening execute the following:

M.reactive.mod_nosferatu_city.changes;

Now in the console you should see an array of several string like "people.bitten:updated",
"people[2].bitten:updated", "state:updated"... Those are the list of watchers that will
be executed when the state returns to read mode. This way the system can acumulate changes
and trigger whatchers all at once.

To trigger the watchers, just execute:

M.reactive.mod_nosferatu_city.readOnly = true;

Now the person with ID 2 should be updated and your blood thirst fullfilled.

Now that you understand how the state changes works, it is time to implement your first mutation.
*/

// === STEP 6: your first mutation ===

// As you may notice, components are quite limited if they cannot alter the state. That is because the component
// logic should be fully focussed in reacting to the state changes (and believe me, in some cases this could be
// a big issue by its own). If the components start messing around with the state as they pleased, you will end
// up with tens of components methods doing the same state modifications.
//
// To prevent this from happening, all state changes (and I mean ALL, even the smallest ones) are defined as
// "mutation" methods in the reactive instance. This way, when any component wants to trigger a state change
// it must do:
//
// this.reactive.dispatch('MUTATION_NAME', param1, param2....);
//
// In our case, this will be something like:
//
// this.reactive.dispatch('bute', person.id);
//
// This way when any component wants to "bite" a person, they will do it in the same exact way. Note the dispatch
// method is defined as async because it usually does ajax calls.

// Perfect, enough theory for now. Let's create our mutation class. In our case, we want the "bite" mutation which
// require an extra param "personId" to identify the person to bite. The code will introcude you to the stateManager
// a lcass mutations use to manipulate the state.

/**
 * Our mutation class.
 *
 * Keep all the mutations in a single class (in its own module) is a best practice. However, in next
 * steps we will see another way of registering extra mutations.
 *
 */
class Mutations {

    /**
     * Bite a person.
     *
     * All mutations recive a StateManager object as a first parameter. Whith this object the mutation
     * can acces the state (stateManager.state) but also set the read mode (statemanager.setReadOnly(true|false)).
     * In next steps we will see some other stateManager features. But for now you don't need them.
     *
     * @method bite
     * @param {StateManager} stateManager the current state
     * @param {int} personId the person id to bite
     */
    bite(stateManager, personId) {
        // The first thing we need to do is get the current state.
        const state = stateManager.state;
        // State is always on read mode. To change any value first we need to unlock it.
        stateManager.setReadOnly(false);
        // Now we do as many state changes as we need.
        state.people.get(personId).bitten = true;
        // All mutations should restore the read mode. This will trigger all the reactive events.
        stateManager.setReadOnly(true);
    }
}

// Once we have the class defined, we just need to register it in the reactive instance.
city.setMutations(new Mutations());

// Perfect. Now it is time to test it. Refresh the page and execute this command in the console:
//
// M.reactive.mod_nosferatu_city.dispatch('bite', 2);
//
// If all goes as expected, the person with ID 2 should be bitten by the vampire.

// === STEP 7: add a second component and bind the bite button mutation to it ===

class Vampire extends BaseComponent {

    /**
     * All the component definition should be initialized on the "create" method.
     */
    create() {
        // This is an optional name for the debugging messages.
        this.name = 'vampire';
        // Remeber, we must always define our component selectors and stuff in the create method.
        this.selectors = {
            PERSON: `select`,
            SUBMIT: `button`,
        };
    }

    /**
     * Initial state ready method.
     *
     * Remember, this is our equivalent of document ready for components.
     */
    stateReady() {
        // Add the event listeners.
        this.addEventListener(
            this.getElement(this.selectors.SUBMIT),
            'click',
            this._bitePersonListener
        );
        // As you may notice, we use "this.addEventListener" instead of
        // "this.getElement(this.selectors.SUBMIT).addEventListener" and there are a very good
        // reasons to do it that way:
        //
        // 1. A component is something that could be unregisterd at any moment (we will see later),
        //    when a component is unregisterd, all listeners added using this.addEventListener will
        //    be also removed automatically.
        //
        // 2. If at some point you need to stop listening an evenet, you can use this.removeEventListener
        //    without worring about binding problems (quite common when you use object oriented code
        //    with JS events).
        //
        // 3. The "this" inside your listeners will always the component instance, not a DOM element.
        //    this way you can reuse the same methods for other uses, not only as listeners. And more
        //    important, in all your component methods the "this" value will be consistent.
    }

    /**
     * Our submit handler.
     *
     * @param {Event} event the click event
     */
    _bitePersonListener(event) {
        // We don't want to submit the form.
        event.preventDefault();
        // Get the selected person id.
        const select = this.getElement(this.selectors.PERSON);
        const personId = select.value;
        this.reactive.dispatch('bite', personId);
    }
}

// We only need to create the element on init.
onInit.push(
    element => {
        new Vampire({
            element: element.querySelector(`[data-for='vampire']`),
        });
    }
);

// Do you remeber in step 3 when I tell you will see a diferent component creation?
// Well. That's the moment. When we created the CitizenList instance we specify what
// reactive instance should be used to get the state. We do that way because CitizenList
// is our main compoment. In this case, the Vampire main DOM element is inside another
// component (meaning it is a subcomponent). The reactive instance is inherited if we
// don't specify the reactive instance.

// === STEP 8: use a state updates message to batch edit the state ===

// We are almost done here. The only remaining feature is the "Cure All citizens" button.
// As you may imagine, we will create a 'cureAll' mutations to trigger it (remember, only mutations
// can modify the state).
//
// In fact, with the knowledge you have right now you should be able to implement it. You just add
// another method to the mutation class and then use state.people.foreEach to change all the bitten
// values. Of course that will work, and in most cases that will be the best solution.
// However I can show another way by using something called "state updates".
//
// Before continuing I must warn you that using state updates in this example is a little
// overengineered. But believe me, they are an important part of any reactive interface
// when you application needs communicate with the backend.

// I know you are eager to implement the last part of the exercice, but I must explain what
// state updates are. It won't take long, I pormise ;-)
//
// This example works only in the frontend. If you refresh the page all citizens resets to its
// initial state. However, in most cases when we modify the state we want to execute the changes
// in the backend. To do so we need to implement specific webservices and call them from the
// mutations. I can't help with that, naybe in the future the core could provide a generic webserice
// for reactive ajax calls (like in mobile) but, for now, every plugin must implement its
// own webservices to support the UI.
//
// In traditional frontend development the workflow is like:
//
// 1. The user do something smart
// 2. A JS module capture the action and invoke some method (a mutation in our case)
// 3. The action method do an ajax call to a webservice
// 4. The server do some magic and return something that only the action method understands
// 5. The action method parse the ajax return an send it to the JS module
// 6. The JS module update the interface
//
// With reactivity the process is quite different because the component will only ask for
// a mutation and then the UI will react ot the changes. However, the steps 4 and 5 has the
// same old problem. When the return type is not standard, both backend and frontend end up
// implementing a similar logic to create and parse the result. This is where the state updates
// can help.
//
// I will put you an example you see many times in the past. Imagine we implement a webservice
// called mod_nosferatu_bite_person. The service gets a personId as a param and returns true if the bite is
// successful. With this specification the mutation method must call the webservice, then check the returned
// value, remeber which person is modified (the return does not specify the id), and also remember that
// it needs to modifiy the bitten attribute (again, the return does not specify what has been changed)
// That would do the trick but then every single mutation will implement its own result parsing.
// Now imagine the code with 40~50 mutations. I guess you get the point.
//
// To solve the problem we can include the personID and the field modified in the return, but we can
// go a step further even. If we assume the webservice result will update part of the state, we can define
// a standard return that can be send directly to the stateManager. This way mutations don't need to
// parse the result because the backend will talk directly to the stateManager. This is what we call
// "state update"
//
// In our example the mod_nosferatu_bite_person will look like:
//
// [
//     {
//         name: 'person',
//         action: 'update',
//         fields: {
//             id: 2,
//             name: 'Amaia',
//             bitten: false,
//         }
//     }
// ]
//
// Note that the return type is an array, this means that the webservice can affect several
// parts of the state at once. Then stateManager.processUpdates(results) will do all the job for us.

// We will talk long about state updates when we start calling backend services but for now
// this is enough. Perfecte. Let's implement our "cureAll" mutation.

/**
 * We create a new object with the new mutation.
 *
 * We don't want to lose the previous mutations so we extend the class.
 */
class MoreMutations extends Mutations {
    /**
     * The cureAll mutation.
     *
     * @param {StateManager} stateManager
     */
    cureAll(stateManager) {
        // We call our hipotetical webservice.
        const result = this.callCureAll(stateManager.state);
        // And now we send the results to the stateManager.
        stateManager.processUpdates(result);
    }
    /**
     * Ok. we don't have a webservice yet, so we fake it.
     *
     * @param {object} state if this was a real webservice we probably won't need the full state.
     * @returns {array} the state updates object.
     */
    callCureAll(state) {
        const result = [];
        state.people.forEach(person => {
            result.push({
                name: 'people',
                action: 'update',
                fields: {
                    ...person,
                    bitten: false,
                }
            });
        });
        return result;
    }
}

// Now we replace the mutations class.
city.setMutations(new MoreMutations());

// To test is just dispatch the change directly into the console:
//
// M.reactive.mod_nosferatu_city.dispatch('cureAll');

// === LAST STEP 9: the cure all component ===

// Ok, that is the last step. We need to create a component to controll the "Cure all citizens".
// Once you have this done you will understand all the main reactivity concepts. So let's end this
// example right now.

/**
 * This is our Doctor Component to cure our citizens.
 */
class Doctor extends BaseComponent {

    /**
     * One last timte: all the component definition should be initialized on the "create" method.
     */
    create() {
        this.name = 'doctor';

        this.selectors = {
            SUBMIT: `button`,
        };
    }

    /**
     * Initial state ready method.
     *
     * Remember: this is our equivalent of document ready for components.
     */
    stateReady() {
        // Remember: bind events using this.addEventListener.
        this.addEventListener(
            this.getElement(),
            'click',
            this._cureAllCitizens
        );
        // Note: this.getElement(string query, [int id]) will find specific DOM elements inside the
        //       component main element. However, calling this.getElement() without params is an alias
        //       for this.element.
    }

    /**
     * Our submit handler.
     *
     * Repeat after me: only mutations can alter the state.
     *
     * @param {Event} event the click event
     */
    _cureAllCitizens(event) {
        event.preventDefault();
        this.reactive.dispatch('cureAll');
    }
}

// And, finally, we add the component to the page.
onInit.push(
    element => {
        new Doctor({
            element: element.querySelector(`[data-for='doctor']`),
        });
    }
);

// And that' all! Here ends the started example but there are many more things to learn
// about reactive interfaces. Even with our small reactive library there are an infinite
// number of possibilities.
//
// During the next lessons we will re-implement this example in a more realistic way, following
// all the good practices and aligned with the Moodle coding style. Then, we will start interacting
// with the backend to load the initial state and execute mutations. Once we start working with the
// backend data, we will incorporate an "add citizen button" and also a "kill citizen". Finally,
// I will teach you how easy es to add drag and drop capabilities to components.
//
// Stay tuned!
