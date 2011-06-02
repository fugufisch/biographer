// can't make this variable private because of the JsDoc toolkit.
/**
 * @namespace The whole biographer-ui library can be accessed through this var.
 */
bui = {};

/**
 * @namespace SVG namespace definition
 */
bui.svgns = "http://www.w3.org/2000/svg";

/**
 * @namespace Settings are stored within this variable
 */
bui.settings = {
    /**
     * @field
     * Prefixes for various ids
     */
    idPrefix : {
        graph : 'graph',
        node : 'node',
        edge : 'edge'
    },
    /**
     * @field
     * The url from which the CSS file should be imported and CSS classes
     */
    css : {
        stylesheetUrl : 'resources/css/visualization-svg.css',
        classes : {
            invisible : 'hidden',
            selected : 'selected',
            placeholder : 'placeholder',
            rectangle : 'rect',
            textDimensionCalculation : {
                generic : 'textDimensionCalculation',
                standard : 'defaultText',
                small : 'smallText'
            }
        }
    },
    /**
     * @field
     * Various styles that can not be realized using CSS
     */
    style : {
        nodeCornerRadius : 35
    }
};