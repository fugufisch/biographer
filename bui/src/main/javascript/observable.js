(function(bui) {
    var identifier = 'bui.Observable';

    /**
     * @class
     * By inheriting from this class you can allow observers. Please note
     * that you have to add types using the {@link bui.Observable#addType}
     * function before listener can be added.
     *
     * @extends bui.Object
     */
    bui.Observable = function() {
        bui.Observable.superClazz.call(this);
        this._getPrivateMembers(identifier).listener = {};
    };

    var staticListeners = {};

    /**
     * @description
     * Get static listeners for the specific type
     *
     * @param {Object} type The type for which a collection of static listeners
     *   should be returned.
     *
     * @return {Object} Hash of static listeners.
     */
    var getStaticListeners = function(type) {
        return staticListeners[type] = staticListeners[type] || {};
    };

    /**
     * @description
     * Bind listeners to class-level events, i.e., receive the specific event
     * from all instances of the class.
     *
     * @param {String} type The type of event that should be observed
     * @param {Function} callback Method to be called
     * @param {Object} [identification] An identifier used to identify the
     *   listener in the list of all over listeners. Should be unique for
     *   the listener type. When ommited the callback will be used for
     *   identification purposes.
     */
    bui.Observable.bindStatic = function(type, callback, identification) {
        var listener = getStaticListeners(type);

        if (identification === undefined || identification === null) {
            identification = callback;
        }

        listener[identification] = callback;
    };

    /**
     * @description
     * Function which can be used to unbind ALL static listeners.
     * This method should seldomly be used and if used, it should only
     * be used with care.
     */
    bui.Observable._unbindAllStatic = function() {
        staticListeners = {};
    };

    bui.Observable.prototype = {
        /**
         * @description
         * Add a listener type to this observable object. An added listener
         * type allows to register listeners and fire events specific to
         * this type.
         *
         * @param {String|Object} type The new type - a string which describes
         *   it or an object (map) for which all values
         *   (please note it's values - not keys) are used and added as types.
         * @return {bui.Observable} Fluent interface
         */
        _addType : function(type) {
            var listener = this._getPrivateMembers(identifier).listener;

            if (typeof(type) === 'string') {
                listener[type] = {};
            } else {
                for (var i in type) {
                    if (type.hasOwnProperty(i)) {
                        listener[type[i]] = {};
                    }
                }
            }

            return this;
        },

        /**
         * @description
         * Bind listener to a specific type
         *
         * @param {String} type The type of event that should be observed
         * @param {Function} callback Method to be called
         * @param {Object} [identification] An identifier used to identify the
         *   listener in the list of all over listeners. Should be unique for
         *   the listener type. When ommited the callback will be used for
         *   identification purposes.
         * @return {bui.Observable} Fluent interface
         */
        bind : function(type, callback, identification) {
            var listener = this._getPrivateMembers(identifier).listener[type];

            // type not registered, fail silently
            if (listener === undefined) {
                return this;
            }

            if (identification === undefined || identification === null) {
                identification = callback;
            }

            listener[identification] = callback;

            return this;
        },

        /**
         * @description
         * Unbind a listener from a specific event.
         *
         * To unbind all listener, call this function without any parameter.
         * To unbind all listener just for a specific type call this method
         * with the type and omit the identification.
         *
         * @param {String} [type] listener type identification
         * @param {String} [identification] identifies the listener which
         *   should be unbound
         * @return {bui.Observable} Fluent interface
         */
        unbind : function(type, identification) {
            var listener = this._getPrivateMembers(identifier).listener;

            if (type === undefined) {
                for(var registeredType in listener) {
                    if (listener.hasOwnProperty(registeredType)) {
                        listener[registeredType] = {};
                    }
                }
            } else if (identification === undefined) {
                listener[type] = {};
            } else {
                delete listener[type][identification];
            }

            return this;
        },

        /**
         * Unbind all listeners with the provided identification.
         *
         * @param {String} identification Listener identification
         * @return {bui.Observable} Fluent interface
         */
        unbindAll : function(identification) {
            var listener = this._getPrivateMembers(identifier).listener;

            for(var type in listener) {
                if (listener.hasOwnProperty(type)) {
                    delete listener[type][identification];
                }
            }

            return this;
        },

        /**
         * @description
         * Fire an event
         *
         * @param {String} type listener type identification
         * @param {Object[]} [params] Parameters to be passed to the listener
         * @return {Boolean} True when every listener returned a value !==
         *   false, false otherwise.
         */
        fire : function(type, params) {
            var i, listener;

            if (params === undefined) {
                params = [];
            }

            listener = this._getPrivateMembers(identifier).listener[type];

            // fail silently when the listener type is not registered
            if (listener === undefined) {
                return true;
            }

            for (i in listener) {
                if (listener.hasOwnProperty(i)) {
                    var status = listener[i].apply(this, params);

                    if (status === false) {
                        return false;
                    }
                }
            }

            listener = getStaticListeners(type);

            if (params.length === 0) {
                params = [this];
            } else if (params[0] !== this) {
                params.unshift(this);
            }

            for (i in listener) {
                if (listener.hasOwnProperty(i)) {
                    var status = listener[i].apply(this, params);

                    if (status === false) {
                        return false;
                    }
                }
            }


            return true;
        }
    };

    bui.util.setSuperClass(bui.Observable, bui.Object);
})(bui);