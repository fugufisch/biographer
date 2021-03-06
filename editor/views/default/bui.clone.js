bui.clone = function(degree, select_drawables){
        var suspendHandle = graph.suspendRedraw(20000);
        all_drawables = graph.drawables();
        // create a counting dictionary for the nodes
        var degree_count = {};
        var drawable, edge, old_node_id, new_node;
        for (var key in all_drawables) {
            drawable = all_drawables[key];
            if ((drawable.identifier()=='bui.UnspecifiedEntity')||(drawable.identifier()=='bui.SimpleChemical')||(drawable.identifier()=='bui.RectangularNode')||(drawable.identifier()=='bui.Phenotype')||(drawable.identifier()=='bui.NucleicAcidFeature')||(drawable.identifier()=='bui.Macromolecule')){
                degree_count[drawable.id()] = 0;
            }
        }
        // count edges connecting the relevant nodes
        for (var key in all_drawables) {
            drawable = all_drawables[key];
            if (drawable.identifier() == 'bui.Edge'){
                if (drawable.source().id() in degree_count){
                    degree_count[drawable.source().id()] = degree_count[drawable.source().id()] + 1;
                };
                if (drawable.target().id() in degree_count){
                    degree_count[drawable.target().id()] = degree_count[drawable.target().id()] + 1;
                };
            }
        }
        // go through all the nodes with a higher than appreciated degree
        var auto_indent = 1000;
        for (var key in degree_count) {
            if(select_drawables != undefined && !(key in select_drawables)) continue;
            drawable = all_drawables[key];
            if (degree_count[drawable.id()] > degree){
                old_node_id = drawable.id();

                // create a new node for every time the old node is referenced
                for (var edge_key in all_drawables){
		            edge = all_drawables[edge_key];
                    if ((edge.identifier() == 'bui.Edge')&&((edge.source().id() == old_node_id)||(edge.target().id() == old_node_id))){
			// create a new node
			++auto_indent;
			new_node = graph.add(bui[drawable.identifier().substr(4)]) 
			    .visible(true)
			    .label(drawable.label())
                .parent(drawable.parent())
			    //.addClass('cloneMarker')
			    .position(drawable.position().x, drawable.position().y)
			    .size(drawable.size().height, drawable.size().width);
			// reroute the edge
			if (edge.source().id() == old_node_id){
			    all_drawables[edge_key].source(new_node);
			} else {
			    all_drawables[edge_key].target(new_node);
			}
		    }
		};
            };
        };
        for (var key in all_drawables) {
            if(select_drawables != undefined && !(key in select_drawables)) continue;
            drawable = all_drawables[key];
            if (drawable.id() in degree_count){
                if (degree_count[drawable.id()] > degree){
                    drawable.remove();
                }
            }
        }
        graph.unsuspendRedraw(suspendHandle);
} 


bui.clombine = function(select_drawables){
        var suspendHandle = graph.suspendRedraw(20000);
        all_drawables = graph.drawables();
        // create new node
        var drawable = all_drawables[Object.keys(select_drawables)[0]];
        var new_node = graph.add(bui[drawable.identifier().substr(4)]) 
	                    .visible(true)
			    .label(drawable.label())
                            .parent(drawable.parent())
			    //.addClass('cloneMarker')
			    .position(drawable.position().x, drawable.position().y)
	                    .size(drawable.size().height, drawable.size().width);
        // redraw edges
        for (var edge_key in all_drawables){
	    edge = all_drawables[edge_key];
            if (edge.identifier() == 'bui.Edge'){
                for (var node_key in select_drawables){
                    if (edge.source().id() == all_drawables[node_key].id()){
                        all_drawables[edge_key].source(new_node);
                    }
                    if (edge.target().id() == all_drawables[node_key].id()){
                        all_drawables[edge_key].target(new_node);
                    }
                }
            }
        }
        // remove select_drawables
        for (var node_key in select_drawables){
            all_drawables[node_key].remove();
        }
        // redraw ALL THE NODES
        graph.unsuspendRedraw(suspendHandle);
} 
