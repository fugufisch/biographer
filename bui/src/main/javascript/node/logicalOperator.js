(function(bui) {
    var identifier = 'bui.LogicalOperator';

    /**
     * @private
     * Function used for the generation of listener identifiers
     * @param {bui.LogicalOperator} LogicalOperator
     * @return {String} listener identifier
     */
    var listenerIdentifier = function(LogicalOperator) {
        return identifier + LogicalOperator.id();
    };

    /**
     * @private size listener
     */
    var sizeChanged = function(node, width) {
        var r = width / 2;
        var privates = this._privates(identifier);
        privates.circle.setAttributeNS(null, 'cx', r);
        privates.circle.setAttributeNS(null, 'cy', r);
        privates.circle.setAttributeNS(null, 'r', r);
    };

    /**
     * @private
     */
    var initialPaint = function() {
        var privates = this._privates(identifier);

        privates.circle = document.createElementNS(bui.svgns, 'circle');
        sizeChanged.call(this, this, this.size().width);
        this.nodeGroup().appendChild(privates.circle);

        // create eventListener delegate functions
        var interactDragMove = (function (event) {
            var position = this.position(),
                scale = this.graph().scale();

            if ((event.type === 'interactdragmove' && this.graph().highPerformance()) ||
                (event.type === 'interactdragend' && !this.graph().highPerformance())) {
                this.position(position.x + event.detail.dx / scale, position.y + event.detail.dy / scale);
            }
        }).createDelegate(this);

        var interactResizeMove = (function (event) {
            var size = this.size(),
                scale = this.graph().scale();
            
            if ((event.type === 'interactresizemove' && this.graph().highPerformance()) ||
                (event.type === 'interactresizeend' && !this.graph().highPerformance())) {
                this.size(size.width + event.detail.dx / scale, size.height + event.detail.dy / scale);
            }
        }).createDelegate(this);

        // add event listeners
        privates.circle.addEventListener('interactresizemove', interactResizeMove);
        privates.circle.addEventListener('interactdragmove', interactDragMove);
        privates.circle.addEventListener('interactresizeend', interactResizeMove);
        privates.circle.addEventListener('interactdragend', interactDragMove);
        
        function interactUnset() {
            interact.unset(privates.circle);

            privates.circle.removeEventListener('interactresizemove', interactResizeMove);
            privates.circle.removeEventListener('interactdragmove', interactDragMove);
            privates.circle.removeEventListener('interactresizeend', interactResizeMove);
            privates.circle.removeEventListener('interactdragend', interactDragMove);
        }

        this.bind(bui.Drawable.ListenerType.remove,
                interactUnset,
                listenerIdentifier(this));
    };
    
    /**
     * @class
     * Drag handle node type which is useful for manipulation of edge shapes
     *
     * @extends bui.Node
     * @constructor
     */
    bui.LogicalOperator = function(type) {
        bui.LogicalOperator.superClazz.apply(this, arguments);

        this.bind(bui.Node.ListenerType.size,
                sizeChanged.createDelegate(this),
                listenerIdentifier(this));

        initialPaint.call(this);
        if (typeof(type) === 'string') {
            if(type == 'delay') this.label('τ');
            else this.label(type);
        }else if (typeof(type) === 'object') {
            if(type == 174) this.label('OR');
            else if (type == 173) this.label('AND');
            else if (type == 238) this.label('NOT');
            else if (type == 225) this.label('τ');
        }
        if(this.label() == 'τ'){
            this.addClass('delay');
        }
        this.addClass('LogicalOperator');


        var widthHeight = bui.settings.style.edgeHandleRadius * 2;
        this.size(widthHeight, widthHeight);
    };

    bui.LogicalOperator.prototype = {
        identifier : function() {
            return identifier;
        },
        _minWidth : 14,
        _minHeight : 14,
        includeInJSON : true,
        _circle : null,
        _forceRectangular : true,
        _enableResizing : false,
        _calculationHook : circularShapeLineEndCalculationHookWithoutPadding
    };

    bui.util.setSuperClass(bui.LogicalOperator, bui.Labelable);
})(bui);
