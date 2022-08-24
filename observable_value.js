/*
 * ls-utils (https://www.wpvs.de)
 * © 2017 – 2022 Dennis Schulmeister-Zimolong <dennis@pingu-mail.de>
 * Licensed under the 2-Clause BSD License.
 */
"use strict";

import StringUtils from "./string_utils.js";

/**
 * This is a simple utility class which allows to define a simple kind of
 * one-way data-binding for variables and object attributes. Whenever the
 * observable value changes all bound observers will be called. Observers
 * in that regard can be:
 *
 *   * Plain functions, called like func(newValue, oldValue)
 *   * DOM elements whose innerHTML will be updated (with or without HTML escaping)
 *
 * Additionaly, validator functions can be attached to check whether a
 * changed value is allowed. If any validator rejects the change, the old
 * value will be kept and no observers will be called.
 */
class ObservableValue {
    /**
     * The constructor.
     * @param {Any} value Initial value
     */
    constructor(value) {
        this._value = value;
        this._bindings = [];
        this._validators = [];
    }

    /**
     * Get the current value.
     * @return {Any} Current value
     */
    get value() {
        return this._value;
    }

    /**
     * Set a new value and call all observers.
     * @param  {Any} newValue New value
     */
    set value(newValue) {
        let oldValue = this._value;

        if (!this._callValidators(newValue, oldValue)) return;
        this._value = newValue;
        this._callObservers(newValue, oldValue);
    }

    /**
     * This triggers a refresh by calling all bound observers again.
     */
    refresh() {
        this._callObservers(this._value, this._value);
    }

    /**
     * Add a validator function which will be called before the actual
     * update occurs. This function, which will be given the new and the
     * old value, must return true, if the update is allowed or false, if
     * the update is not allowed.
     *
     *   func(newValue, oldValue) --> true on success
     *
     * @param {Function} func Validator function, must return true on success
     */
    addValidator(func) {
        this._validators.push(func);
    }

    removeValidator(func) {
        this._validators = this._validators.filter(v => v != func);
    }

    /**
     * Bind a function to be called when the value changes. The function will
     * be called with the new and the old value, like this:
     *
     *   func(newValue, oldValue);
     *
     * @param {Function} func Function to be called
     */
    bindFunction(func) {
        this._bindings.push({
            type: "function",
            object: func,
        });
    }

    /**
     * Unbind a function again.
     * @param {Function} func Bound function
     */
    unbindFunction(func) {
        this._unbind("function", func);
    }

    /**
     * Bind a DOM element to be updated when the value changes. The update
     * will be done by setting element.innerHTML.
     *
     * @param {Element} element The element to be updated
     * @param {Boolean} escape Whether to escape HTML entities (default: true)
     */
    bindElement(element, escape) {
        this._bindings.push({
            type: "element",
            object: element,
            escape: escape == undefined ? true : escape,
        });
    }

    /**
     * Unbind a DOM element again.
     * @param {Element} element Bound element
     */
    unbindElement(element) {
        this._unbind("element", element);
    }

    /**
     * Unbind an observer given by its type and object.
     * @param  {String} type   Type of the observer
     * @param  {Object} object The bound observer
     */
    _unbind(type, object) {
        this._bindings = this._bindings.filter(binding => binding.type != type || binding.object != object);
    }

    /**
     * This calls all registered validator functions to check whether an update
     * is allowed or not.
     *
     * @param  {Any} newValue New value
     * @param  {Any} oldValue Old value
     * @return {Boolean} true when the update is allowed
     */
    _callValidators(newValue, oldValue) {
        for (let i = 0; i < this._validators.length; i++) {
            let validator = this._validators[i];
            if (!validator(newValue, oldValue)) return false;
        }

        return true;
    }

    /**
     * Call all observers in the order they were bound.
     *
     * @param  {Any} newValue New value
     * @param  {Any} oldValue Old value
     */
    _callObservers(newValue, oldValue) {
        this._bindings.forEach(binding => {
            switch (binding.type) {
                case "function":
                    binding.object(newValue, oldValue);
                    break;
                case "element":
                    if (binding.escape) newValue = StringUtils.escapeHTML(newValue);
                    element.innerHTML = newValue;
                    break;
            }
        });
    }
}

export default ObservableValue;
