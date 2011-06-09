(function(bui) {

    var placeholderClass = function(visible) {
        var klass = bui.settings.css.classes.placeholder;

        if (visible === false) {
            klass += ' ' + bui.settings.css.classes.invisible;
        }

        return klass;
    };

    /**
     * @private
     * Function used for the generation of listener identifiers
     * @param {bui.Node} node
     * @return {String} listener identifier
     */
    var listenerIdentifier = function(node) {
        return 'bui.Node' + node.id();
    };

    /**
     * @class
     * Base class for every drawable node. Please note that nodes shouldn't be
     * instantiated directly.
     *
     * @extends bui.Drawable
     * @constructor
     *
     * @param {String} id complete id
     * @param {bui.Graph} graph The graph which this drawable shall be
     *   part of.
     * @param {Number} [x] Position on the x-axis. Default is 0.
     * @param {Number} [y] Position on the y-axis. Default is 0.
     * @param {Number} [width] Width of the node. Default is 0.
     * @param {Number} [height] Height of the node. Default is 0.
     * @param {bui.Node} [container] SVG element which should be used as a
     *   a container for this node. Defaults to the SVG root element if not
     *   provided
     */
    bui.Node = function(id, graph, x, y, width, height, container) {
        id = bui.settings.idPrefix.node + id;
        bui.Drawable.call(this, id, graph);
        this.addType(bui.Node.ListenerType);

        this._customNodeContainer = container;

        this._x = x !== undefined ? x : 0;
        this._y = y !== undefined ? y : 0;
        this._width = width !== undefined ? width : this._minWidth;
        this._height = height !== undefined ? height : this._minHeight;
        this._width = Math.max(this._minWidth, this._width);
        this._height= Math.max(this._minHeight, this._height);

        this._initialPaintNode();

        this.bind(bui.Drawable.ListenerType.remove,
                this._nodeRemoved.createDelegate(this),
                listenerIdentifier(this));
        this.bind(bui.Drawable.ListenerType.visible,
                this._nodeVisibilityChanged.createDelegate(this),
                listenerIdentifier(this));

        if (this._customNodeContainer !== undefined) {
            this._customNodeContainer.bind(bui.Node.ListenerType.position,
                this._nodePositionChanged.createDelegate(this),
                listenerIdentifier(this));
        }
    };

    bui.Node.prototype = Object.create(bui.Drawable.prototype, {
        _customNodeContainer : bui.util.createPrototypeValue(null),
        _x : bui.util.createPrototypeValue(null),
        _y : bui.util.createPrototypeValue(null),
        _width : bui.util.createPrototypeValue(null),
        _minWidth : bui.util.createPrototypeValue(0),
        _height : bui.util.createPrototypeValue(null),
        _minHeight : bui.util.createPrototypeValue(0),
        _nodeGroup : bui.util.createPrototypeValue(null),
        _placeholder : bui.util.createPrototypeValue(null),
        _preserveAspectRatio : bui.util.createPrototypeValue(false),
        _allowResizing : bui.util.createPrototypeValue(true),

        /**
         * @private
         * Initial paint of the placeholder node and group node
         */
        _initialPaintNode : bui.util.createPrototypeValue(function() {
            this._nodeGroup = document.createElementNS(bui.svgns, 'g');
            this._nodeGroup.setAttributeNS(null, 'id', this.id());
            this._setTransformString();
            this._nodeVisibilityChanged(this, this.visible());
            if (this._customNodeContainer !== undefined) {
                this._customNodeContainer.nodeGroup()
                        .appendChild(this._nodeGroup);
            } else {
                this.graph().nodeGroup().appendChild(this._nodeGroup);
            }

            var placeholderContainer = this.graph().placeholderContainer();

            this._placeholder = document.createElement('div');
            this._placeholder.setAttribute('class', placeholderClass(false));
            placeholderContainer.appendChild(this._placeholder);
            this._nodeSizeChanged();
            this._nodePositionChanged();

            this.bind(bui.Node.ListenerType.position,
                    this._nodePositionChanged.createDelegate(this),
                    listenerIdentifier(this));
            this.bind(bui.Node.ListenerType.size,
                    this._nodeSizeChanged.createDelegate(this),
                    listenerIdentifier(this));

            jQuery(this._placeholder).draggable({
                stop : this._placeholderDragStop.createDelegate(this)
            });

            if (this._allowResizing === true) {
                jQuery(this._placeholder).resizable({
                    stop : this._placeholderResizeStop.createDelegate(this),
                    aspectRatio : this._preserveAspectRatio
                });
            }
        }),

        /**
         * @private
         * Initial paint of the placeholder node and group node
         */
        _setTransformString : bui.util.createPrototypeValue(function() {
            var attrValue = ['translate(',
                this._x.toString(),
                ',',
                this._y.toString(),
                ')'].join('');
            this._nodeGroup.setAttributeNS(null, 'transform', attrValue);
        }),

        /**
         * @private remove listener
         */
        _nodeRemoved : bui.util.createPrototypeValue(function() {
            this._nodeGroup.parentNode.removeChild(this._nodeGroup);
        }),

        /**
         * @private visibility listener
         */
        _nodeVisibilityChanged : bui.util.createPrototypeValue(function(node,
                                                            visible) {
            if (visible) {
                this._nodeGroup.setAttributeNS(null, 'class', '');
            } else {
                this._nodeGroup.setAttributeNS(null, 'class',
                        bui.settings.css.classes.invisible);
            }
        }),

        /**
         * @private size change listener
         */
        _nodeSizeChanged : bui.util.createPrototypeValue(function() {
            var rootOffset = this.graph().rootOffset();

            var correction = bui.settings.style.placeholderCorrection.size;

            this._placeholder.style.width = (this._width +
                    rootOffset.x + correction.width) +'px';
            this._placeholder.style.height = (this._height +
                    rootOffset.y + correction.height) + 'px';
        }),

        /**
         * @private position change listener
         */
        _nodePositionChanged : bui.util.createPrototypeValue(function() {
            var htmlPosition = this.absoluteHtmlPosition();

            var correction = bui.settings.style.placeholderCorrection.position;

            this._placeholder.style.left = (htmlPosition.x +
                    correction.x) + 'px';
            this._placeholder.style.top = (htmlPosition.y +
                    correction.y) + 'px';
            this._setTransformString();
        }),

        /**
         * @private placeholder drag stop listener
         */
        _placeholderDragStop : bui.util.createPrototypeValue(function() {
            var placeholderOffset = jQuery(this._placeholder).offset();
            var x = placeholderOffset.left;
            var y = placeholderOffset.top;

            if (this._customNodeContainer !== undefined) {
                var position = this._customNodeContainer
                        .absoluteHtmlPosition();
                x -= position.x;
                y -= position.y;
            } else {
                var rootOffset = this.graph().rootOffset();
                x = Math.max(x - rootOffset.x, 0);
                y = Math.max(y - rootOffset.y, 0);
            }

            var correction = bui.settings.style.placeholderCorrection.position;
            x += correction.x * -1;
            y += correction.y * -1;

            this.position(x, y);
        }),

        /**
         * @private placeholder resize stop listener
         */
        _placeholderResizeStop : bui.util.createPrototypeValue(function() {
            var width = jQuery(this._placeholder).width();
            var height = jQuery(this._placeholder).height();

            var correction = bui.settings.style.placeholderCorrection.size;

            width += correction.width * -1;
            height += correction.height * -1;

            this.size(width, height);
        }),

        /**
         * Use this function to retrieve this node's group. This function
         * is normally only required by sub classes.
         * 
         * @return {SVGGElement} node group
         */
        nodeGroup : bui.util.createPrototypeValue(function() {
            return this._nodeGroup;
        }),

        /**
         * @description
         * Set or retrieve the node's position on the x-axis.
         *
         * @param {Number} [x] The new x-axis position.
         * @return {bui.Node|Number} Fluent interface in case a parameter
         *   is given. The current x-axis position is returned otherwise.
         */
        x : bui.util.createPrototypeValue(function(x) {
            if (x !== undefined) {
                if (x !== this._x) {
                    this._x = x;
                    this.fire(bui.Node.ListenerType.position,
                            [this, this._x, this._y]);
                }
                return this;
            }
            return this._x;
        }),

        /**
         * @description
         * Set or retrieve the node's position on the y-axis.
         *
         * @param {Number} [y] The new y-axis position.
         * @return {bui.Node|Number} Fluent interface in case a parameter
         *   is given. The current y-axis position is returned otherwise.
         */
        y : bui.util.createPrototypeValue(function(y) {
            if (y !== undefined) {
                if (y !== this._y) {
                    this._y = y;
                    this.fire(bui.Node.ListenerType.position,
                            [this, this._x, this._y]);
                }
                return this;
            }
            return this._y;
        }),

        /**
         * @description
         * Set or retrieve the node's position.
         *
         * You can set the position by passing both, the x- and y-axis value
         * to this function. If you pass only one parameter or none, the
         * current position is returned.
         *
         * @param {Number} [x] The new x-axis position.
         * @param {Number} [y] The new y-axis position.
         * @return {bui.Node|Object} Fluent interface in case both parameters
         *   are given. If only one or no parameter is provided the current
         *   position will be returned as an object with x and y properties.
         */
        position : bui.util.createPrototypeValue(function(x, y) {
            if (x !== undefined && y !== undefined) {
                var changed = this._x !== x || this._y !== y;
                this._x = x;
                this._y = y;

                if (changed) {
                    this.fire(bui.Node.ListenerType.position,
                            [this, this._x, this._y]);
                }

                return this;
            }

            return {
                x : this._x,
                y : this._y
            };
        }),

        /**
         * Retrieve the absolute position of this node in the HTML document.
         *
         * @return {Object} Object with x and y properties.
         */
        absoluteHtmlPosition : bui.util.createPrototypeValue(function() {
            var offset = null;

            if (this._customNodeContainer !== undefined) {
                offset = this._customNodeContainer.absoluteHtmlPosition();
            } else {
                offset = this.graph().rootOffset();
            }

            return {
                x : offset.x + this._x,
                y : offset.y + this._y
            };
        }),

        /**
         * @description
         * Set or retrieve the node's width.
         *
         * @param {Number} [width] The new width.
         * @return {bui.Node|Number} Fluent interface in case a parameter
         *   is given. The current width is returned otherwise.
         */
        width : bui.util.createPrototypeValue(function(width) {
            if (width !== undefined) {
                width = Math.max(this._minWidth, width);
                if (width !== this._width) {
                    this._width = width;
                    this.fire(bui.Node.ListenerType.size,
                            [this, this._width, this._height]);
                }
                return this;
            }
            return this._width;
        }),

        /**
         * @description
         * Set or retrieve the node's height.
         *
         * @param {Number} [height] The new height.
         * @return {bui.Node|Number} Fluent interface in case a parameter
         *   is given. The current height is returned otherwise.
         */
        height : bui.util.createPrototypeValue(function(height) {
            if (height !== undefined) {
                height= Math.max(this._minHeight, height);
                if (height !== this._height) {
                    this._height = height;
                    this.fire(bui.Node.ListenerType.size,
                            [this, this._width, this._height]);
                }
                return this;
            }
            return this._height;
        }),

        /**
         * @description
         * Set or retrieve the node's size.
         *
         * You can set the size by passing both, the width and height value
         * to this function. If you pass only one parameter or none, the
         * current size is returned.
         *
         * @param {Number} [width] The new width.
         * @param {Number} [height] The new height.
         * @return {bui.Node|Object} Fluent interface in case both parameters
         *   are given. If only one or no parameter is provided the current
         *   size will be returned as an object with width and height
         *   properties.
         */
        size : bui.util.createPrototypeValue(function(width, height) {
            if (width !== undefined && height !== undefined) {
                width = Math.max(this._minWidth, width);
                height= Math.max(this._minHeight, height);
                var changed = this._width !== width || this._height !== height;
                this._width = width;
                this._height = height;

                if (changed) {
                    this.fire(bui.Node.ListenerType.size,
                            [this, this._width, this._height]);
                }

                return this;
            }

            return {
                width : this._width,
                height : this._height
            };
        }),

        /**
         * @description
         * Use this function to retrieve the top-left corner of the node.
         *
         * @return {Object} Object with x and y properties.
         */
        topLeft : bui.util.createPrototypeValue(function() {
            return {
                x : this._x,
                y : this._y
            };
        }),

        /**
         * @description
         * Use this function to retrieve the bottom-right corner of the node.
         *
         * @return {Object} Object with x and y properties.
         */
        bottomRight : bui.util.createPrototypeValue(function() {
            return {
                x : this._x + this._width,
                y : this._y + this._height
            };
        }),

        /**
         * @description
         * Use this function to retrieve the center of the node.
         *
         * @return {Object} Object with x and y properties.
         */
        center : bui.util.createPrototypeValue(function() {
            return {
                x : this._x + (this._width / 2),
                y : this._y + (this._height / 2)
            };
        }),

        /**
         * @description
         * Use this function to move the relative to its current position.
         *
         * @param {Number} x Relative change on the x-axis.
         * @param {Number} y Relative change on the y-axis.
         * @param {Boolean} [duration] Whether this movement should be animated
         *   and how long this animation should run. When omitted or a value
         *   <= 0 is passed the movement will be executed immediately.
         * @return {bui.Node} Fluent interface.
         */
        move : bui.util.createPrototypeValue(function(x, y, duration) {
            if (duration === undefined || duration <= 0) {
                this.position(this._x + x, this._y + y);
            } else {
                throw "Not implemented.";
            }

            return this;
        })
    });

    /**
     * @namespace
     * Observable properties which all nodes share
     */
    bui.Node.ListenerType = {
        /** @field */
        position : 'bui.Node.position',
        /** @field */
        size : 'bui.Node.size'
    };
})(bui);