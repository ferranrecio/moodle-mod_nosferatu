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
 * This file is just an example to illustrate how to create a reactive app in Moodle.
 * For didactic purposes, all the logic of this app is in the same file. However, in a real
 * scenario, you should split the logic in different files and import them here. We will see
 * how to do this after the introduction samples.
 *
 * @module     mod_nosferatu/local/templatecomponents/intro01
 * @copyright  2024 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// First thing first. We need to import all the necessary dependencies. All of them
// are provided by core/reactive.
import {BaseComponent, Reactive} from 'core/reactive';

// Reactivity is based on browser events. Moodle coding style forces us to declare all
// plugin events and dispatchers in a specific way. This is not unique to reactive apps
// but to all plugins with custom events.
import {eventTypes, notifyModNosferatuStateUpdated} from 'mod_nosferatu/events';

// Usually modules have a single init method. However, this will go against the example narrative
// because it will require to go scroll up and down at a certain steps. I want you focused in the
// reactive part so we will push here any logic we want to execute on the init method.
const onInit = [];

/**
 * Dirty trick to have a dynamic init method.
 *
 * This is just an easy way to use a dynamic init method. It is not realted to reactivity at all.
 * Think of it as a way to keep the narrative clean.
 */
export const init = function() {
    onInit.forEach(
        method => method()
    );
};


// Now we have everything we need to start creating our first reactive component.

// In this example you will learn how to:
// - Instantiate a reactive module to store the frontend state data
// - Delegate UI logic to components that react to the state changes
// - Implement mutations to alter the state from the components.
// - Capture user interactions to trigger mutations.

// === STEP 1: building our initial state ===

// This is the most abstract part of the process. In a reactive pattern, all related UI component uses
// the same data structure to decide how to present things. This data structure is called reactive "state".
// Any change on that structure will be notified to the components so they can alter a part of the UI.
//
// Working with a reactive state has many advantages over the traditional approach:
//
// - More than one component can represent the same part of the state but they don't need to be
//   aware each other.
// - User interactions won't change the HTML elements but only will request state data changes. We will
//   call those requests "mutations" from now on.
// - We can add more components at any moment, even adding alternative ways to do the same mutation
//   because the refreshing logic and the mutation one are independent.

// Ok, enough theory for not. Let's build our first state. For this first example will be use a simple
// counter. For technical reasons, our state data can only store:
// - Sets of objects with id attributes
// - Objects with attributes

// So, we will use an object to store the counter value.

const state = {
    'info': {
        counter: 0,
    },
};

// === STEP 2: the reactive instance ===

// Many reactive components may coexist in the same page. In our example, the course editor has it's own
// reactive components, while our two components has their own. However, each components watches a specific
// state data so they won't interfere with one another.

// To ensure each component works as expected. All components must be "registered" in a specfici reactive
// instance. A reactive instance is an object that handle all the watchers logic and contains the current
// state data.

// No matter how small your applications is, it is almost sure you will need shared methods between components.
// For this reason, it is highly recommended you create your own reactive class that extends the base one.

class MyReactive extends Reactive {
    // Here you can add your own methods.
}

const myReactiveInstance = new MyReactive({
    // The name of the instance is used to identify the instance in debugging tools.
    name: 'mod_nosferatu_example',

    // As mentioned before, we need to use the plugin custom events.
    eventName: eventTypes.modNosferatuStateUpdated,
    eventDispatch: notifyModNosferatuStateUpdated,

    // In our case we also include the initial state, but it is not required to create an instance because, in
    // most cases we will need to call the backend to get the initial state when the page is already served.
    state,

    // The are other options you can use in creation. A few lines below you will see we add state mutations
    // to allow components to ask for state changes. In most cases the available mutations are clear from the
    // beginning, so it is common to pass the "mutations" at the moment we create the reactive instance.
    // You will se how to do this in the next examples. Future examples will show you other options.
});

// === STEP 3: the first component ===

// Now we have everything ready to build our first component. That component will watch any change in the
// the state data and update the UI.

// For this first compoment we will use the base component class. This class is the most basic one and
// it is used to create components that only need to watch the state data. Don't worry if you find
// some of the details of this class a bit confusing. In next example we will simplify the process
// by using TemplateComponents.

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
//               is loaded. For all purposes, this method is the equivalent of page ready for components.
//
// - unregister: if the component is unregistered from the reactive instance
//
// - destroy: if the component is removed form the page

class FirstComponent extends BaseComponent {
    /**
     * It is important to follow some conventions while you write components. This way all components
     * will be implemented in a similar way and anybody will be able to understand how it works.
     *
     * All the component definition should be initialized on the "create" method.
     */
    create() {
        // This is an optional name for the debugging messages.
        this.name = 'mod_nosferatu_FirstComponent';
        // If you need local attributes like ids os something it should be initialized here.
    }

    /**
     * We want to update the counter every time the value change. To do this we need
     * to define a watcher.
     *
     * @returns {Array} of watchers
     */
    getWatchers() {
        return [
            // For this first example we will watch the whole state. This means that any change in the state
            // will trigger the handler. In a real scenario, you should watch only the part of the state that
            // affects the component. But we will see this in the compoment optimization example.
            {watch: `state:updated`, handler: this._refreshCounter},
        ];
    }

    /**
     * We will trigger that method any time a person data changes. This method is used by stateReady
     * but, most important, to watch the state. Any watcher receive an object with:
     * - element: the afected element
     * - state: the full state object
     *
     * @param {object} param the watcher param.
     * @param {object} param.state the person structure.
     */
    _refreshCounter({state}) {
        // The base compoment class provides a method to get any internal element
        // having data-mdl-ref attribute. The method also guarantees that the element
        // is owned by the component and it is not part of any sub component.
        this.getReference('count').innerHTML = state.info.counter;
    }
}

// As you may notice, we don't define any constructor method. This is because the base component class
// has a default constructor that will call the create method. Let's instantiate the component.

// To instantiate a new compoment you need to provide the following:
// - selector: ALL components must have a main element. The easiest way to do this is by passing
//             the element query selector as "selector".
// - reactive: the reactive instance to register to. In our case we will use the myReactiveInstance.

// Remember, we ure using the "onInit" for pedagogical reasons. In a real scenario you should
// the component instantiation will be done on the component  mustache file directly.
onInit.push(
    () => {
        new FirstComponent({
            selector: '#exampleApp [data-mdl-region="exampleComponent1"]',
            reactive: myReactiveInstance,
        });
    }
);

// === STEP 4: your first mutation ===

// As you may notice, components are quite limited if they cannot alter the state. That is because the component
// logic should be fully focussed in reacting to the state changes. If the components start messing around
// with the state as they pleased, you will end up with tons of components methods doing the same state
// modifications.
//
// To prevent this from happening, all state changes (and I mean ALL, even the smallest ones) are defined as
// "mutation" methods in the reactive instance. This way, when any component wants to trigger a state change
// it must do:
//
// this.reactive.dispatch('MUTATION_NAME', param1, param2....);
//
// In our case, this will be something like:
//
// this.reactive.dispatch('increment', number);
//
// When any component wants to "increment" the counter, they will do it in the same exact way.
// Note the dispatch method is defined as async because it usually does ajax calls.

// Perfect, enough theory for now. Let's create our mutation class. We only need an increment
// method. However, you will note the way to do it is quite peculiar.

/**
 * Our mutation class.
 *
 * Keep all the mutations in a single class (in its own module) is a best practice. However, for big projects
 * it is possible to split the mutations in different classes.
 */
class Mutations {
    /**
     * Increment the counter.
     *
     * All mutations receive a StateManager object as a first parameter. With this object the mutation
     * can access the state (stateManager.state) but also set the read mode (statemanager.setReadOnly(true|false)).
     * In next steps we will see some other stateManager features. But for now you don't need them.
     *
     * @param {StateManager} stateManager the current state
     * @param {int} amount the increment amount.
     */
    increment(stateManager, amount) {
        // The first thing we need to do is get the current state.
        const state = stateManager.state;
        // State is always on read mode. To change any value first we need to unlock it.
        stateManager.setReadOnly(false);
        // Now we do as many state changes as we need.
        state.info.counter += amount;
        // All mutations should restore the read mode. This will trigger all the reactive events.
        stateManager.setReadOnly(true);
    }
}

// Once we have the class defined, we just need to register it in the reactive instance.
// In a normal scenario, you will do this when you create the reactive instance by passing
// a "mutations" attribute.
myReactiveInstance.setMutations(new Mutations());

// Perfect. Now it is time to test it. Execute this command in the console:
//
// M.reactive.mod_nosferatu_example.dispatch('increment', 2);
//
// If all goes as expected, the counter on the first compoment should increase by 2.


// === STEP 5: add a second component to execute the mutation ===

// This is similar to the first component. The only difference is that this component will
// capture some user interaction and dispatch the mutation.

class SecondComponent extends BaseComponent {
    /**
     * All the component definition should be initialized on the "create" method.
     */
    create() {
        // This is an optional name for the debugging messages.
        this.name = 'mod_nosferatu_SecondComponent';
        // If necessary, you can add local attributes here.
    }

    /**
     * Initial state ready method.
     *
     * Remember, this is our equivalent of document ready for components.
     */
    stateReady() {
        // We can access the component main element at any time using this.element.
        this.addEventListener(
            this.element,
            'click',
            this._handleClick
        );
        // As you may notice, we use "this.addEventListener" instead of
        // "this.element.addEventListener" and there are a very good
        // reasons to do it that way:
        //
        // 1. A component is something that could be unregisterd at any moment (we will see later),
        //    when a component is unregisterd, all listeners added using this.addEventListener will
        //    be also removed automatically.
        //
        // 2. If at some point you need to stop listening an event, you can use this.removeEventListener
        //    without worring about binding problems (quite common when you use object oriented code
        //    with JS events).
        //
        // 3. The "this" inside your listeners will always the component instance, not a DOM element.
        //    this way you can reuse the same methods for other uses, not only as listeners. And more
        //    important, in all your component methods the "this" value will be consistent.
    }

    /**
     * Our click handler.
     *
     * We should delegate as much events as possible to the main element. In next examples we will see
     * how the component HTML can change at any moment using virtual DOM and how this can affect the
     * event listeners. Only the this.element is guaranteed to be always there.
     *
     * @param {Event} event the click event
     */
    _handleClick(event) {
        const clickedElement = event.target.closest('[data-mdl-nosferatu-action="increment"]');
        if (clickedElement) {
            event.preventDefault();
            this.reactive.dispatch(
                'increment',
                Number.parseInt(clickedElement.dataset.mdlNosferatuAmount),
            );
        }
    }

    // As you may notice, we don't implement the getWatchers method. That is because this component
    // does not need to watch the state. It's HTML is static.
}

// I know I already tell you, but the "onInit" is just a dirty trick to keep the narrative clean
// but it not how we will do in a real scenario. In a real scenario you will add the component
// instantiation in the component mustache file directly.
onInit.push(
    () => {
        new SecondComponent({
            selector: '#exampleApp [data-mdl-region="exampleComponent2"]',
            reactive: myReactiveInstance,
        });
    }
);

// That's it! Your first reactive app is ready. Refresh the page and test it.

// In the next example we will see how to use the TemplateComponent class to simplify
// even more the code. Return to the page to get more information about how works beneath the hood.
