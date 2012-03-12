bui.grid = { 
    nodes:[], 
    edges:[], 
    width:0,
    height:0,
    matrix_nodes: [],
    grid_space: 80//px
}
//=====================================================
bui.grid.spiral = function(length){
    //--------------------------------------
    var spiral_count4 = 0;
    var spiral_cur_edge_len = 1;
    var sprial_cur_edge_steps = 0;
    var spiral_add_x_abs = 0;
    var spiral_add_y_abs = 1;
    var mulitplierx = ['x',1,1,-1,1];
    var mulitpliery = ['x',1,-1,1,1];
    var spiral_setps = [];
    var counter = 0;
    //--------------------------------------
    while(true){
        //-----------------------
        if (sprial_cur_edge_steps%spiral_cur_edge_len==0){
            tmp = spiral_add_y_abs;
            spiral_add_y_abs = spiral_add_x_abs;
            spiral_add_x_abs = tmp;
            if(spiral_count4>3) spiral_count4=0;
            ++spiral_count4;
        }
        if (sprial_cur_edge_steps+1>2*spiral_cur_edge_len){
            sprial_cur_edge_steps = 0;
            ++spiral_cur_edge_len; 
        }
        ++sprial_cur_edge_steps;
        spiral_setps.push([spiral_add_x_abs*mulitplierx[spiral_count4], spiral_add_y_abs*mulitpliery[spiral_count4]]);
        ++counter;
        if(counter>=length) break
    }
    return spiral_setps

}
//=====================================================
bui.grid.add_padding = function(){
    var nodes = bui.grid.nodes;
    var matrix_nodes = bui.grid.matrix_nodes;
    var move = 0;
    var i;
    console.log(JSON.stringify(matrix_nodes));
    for(i=0;i<bui.grid.width; ++i){
        if(matrix_nodes[i][0] != undefined){
            console.log('check1i '+bui.grid.width);
            for(i=0; i<bui.grid.width; ++i) matrix_nodes[i].push(undefined);
            ++bui.grid.width;
            console.log('check2i');
            for(i=0; i<nodes.length; ++i){
                matrix_nodes[nodes[i].x][nodes[i].y] = undefined;
                ++nodes[i].x;
                matrix_nodes[nodes[i].x][nodes[i].y] = 1;
            } 
            break;
        }
    } 
    console.log('now height');
    console.log(JSON.stringify(matrix_nodes));
    for(i=0;i<bui.grid.height; ++i){
        if(matrix_nodes[0][i] != undefined){
            matrix_nodes.push([]);
            ++bui.grid.height;
            console.log('check1');
            for(i=0; i<bui.grid.height; ++i) matrix_nodes[bui.grid.width-1].push(undefined);
            console.log('check2');
            for(i=0; i<nodes.length; ++i){
                matrix_nodes[nodes[i].x][nodes[i].y] = undefined;
                ++nodes[i].y;
                matrix_nodes[nodes[i].x][nodes[i].y] = 1;
            } 
            break;
        }
    } 
    bui.grid.render_current();
};
//=====================================================
bui.grid.init = function(nodes, edges, width, height){
    //-------------------------------------------------------
    var node_id2node_idx = {};
    for(var i=0; i<nodes.length; ++i) node_id2node_idx[nodes[i].id()]=i;
    for(var i=0; i<edges.length; ++i){
        edges[i].source_idx = node_id2node_idx[edges[i].source().id()];
        edges[i].target_idx = node_id2node_idx[edges[i].target().id()];
    }
    //-------------------------------------------------------
    bui.grid.nodes = nodes;
    bui.grid.edges = edges;
    bui.grid.spiral_setps = bui.grid.spiral(10000);
    var spiral_setps = bui.grid.spiral_setps;
    if(width==undefined || height==undefined){
        width = 2*Math.sqrt(nodes.length)
            height = 3*Math.sqrt(nodes.length)
    }
    var max_x = Math.round(width);
    var max_y = Math.round(height);
    var grid_space = bui.grid.grid_space;
    var pos,i;
    //-------------------------------------------------------
    //check if max_x is smaller than the max_x pos of the max x node pos
    //same for max_y
    for(i=0; i<nodes.length; ++i){
        pos = nodes[i].absolutePositionCenter();
        if(pos.x>max_x*grid_space) max_x = Math.round(pos.x/grid_space);
        if(pos.y>max_y*grid_space) max_y = Math.round(pos.y/grid_space);
    }
    bui.grid.width = max_x+1;
    bui.grid.height = max_y+1;
    //-------------------------------------------------------
    //init node matrix
    var matrix_nodes = [];
    for (var x=0; x<=max_x; ++x){
        matrix_nodes.push([]);
        for (var y=0; y<=max_y; ++y)
            matrix_nodes[x].push(undefined);
    }
    //-------------------------------------------------------
    //position elements on grid, only one element is allowed on each grid point
    var cp,cur_x,cur_y,loop;
    for(i=0; i<nodes.length; ++i){
        pos = nodes[i].absolutePositionCenter();
        cur_x = Math.round(pos.x/grid_space);
        cur_y = Math.round(pos.y/grid_space);
        //----------------------------
        var count = 0;
        while(true){
            if(cur_x>=0 && cur_x<=max_x && cur_y>=0 && cur_y<=max_y && matrix_nodes[cur_x][cur_y] == undefined){
                matrix_nodes[cur_x][cur_y] = 1;
                nodes[i].x = cur_x;
                nodes[i].y = cur_y;
                break;
            }
            spiral_setp = spiral_setps[count];
            cur_x += spiral_setp[0];
            cur_y += spiral_setp[1];
            ++count;
        }
    }
    bui.grid.render_current();
    // insert empty padding around matrix
    bui.grid.matrix_nodes = matrix_nodes;
    //------------------------------------------------
    bui.grid.set_nodes_as_edges();
}
//=====================================================
bui.grid.layout = function(){
    var nodes = bui.grid.nodes;
    var edges = bui.grid.edges;
    var grid_space = bui.grid.grid_space;
    var matrix_nodes = bui.grid.matrix_nodes;
    var i;
    var spiral_setps = bui.grid.spiral_setps;
    var num_empty_fields = bui.grid.width*bui.grid.height - nodes.length;
    node_idx2nodes_idx = {};
    node_idx2edges_idx = {};
    //-----------------------
    //important init buckets!
    //bui.grid.init_buckets();//FIXME this crashes from time to time
    //-----------------------
    for(var ce=0; ce<edges.length; ++ce){
        var s = edges[ce].source_idx;
        var t = edges[ce].target_idx;
        if(s in node_idx2nodes_idx){
            node_idx2nodes_idx[s].push(t);
            node_idx2edges_idx[s][ce] = 1;
        } else{
            node_idx2nodes_idx[s] = [t];
            node_idx2edges_idx[s] = {};
            node_idx2edges_idx[s][ce] = 1;
        } 
        if(t in node_idx2nodes_idx){
            node_idx2nodes_idx[t].push(s);
            node_idx2edges_idx[t][ce] = 1;
        } else{
            node_idx2nodes_idx[t] = [s];
            node_idx2edges_idx[t] = {};
            node_idx2edges_idx[t][ce] = 1;
        }
    }
    //------------------------------------------------
    //------------------------------------------------
    var cni = 0;//current node index
    var tmp_ni,min_ni;
    var step = 0;
    console.log('line crossings before: '+bui.grid.num_intersections());
    console.log('node crossings before: '+bui.grid.num_node_intersections());
    while(true){
        var node = nodes[cni];
        //console.log('step '+step+' curnode'+cni+'/'+nodes.length+'---'+node.id());
        //--------------------------------------
        ++step;
        if(step>nodes.length) break;
        if (node_idx2nodes_idx[cni] == undefined){
            for(var cx=0;cx<bui.grid.width; ++cx){
                for(var cy=0;cy<bui.grid.height; ++cy){
                    if(matrix_nodes[cx][cy]==undefined){
                        matrix_nodes[cx][cy] = 1;
                        matrix_nodes[node.x][node.y] = undefined;
                        node.x=cx;
                        node.y=cy;
                    }
                }
            }
            continue
        }
        //----------------------------------------
        //----------------------------------------
        //edge intersections
        min_ni = bui.grid.edge_intersections_fromto(node, node_idx2nodes_idx[cni], node_idx2edges_idx[cni]);
        //node intersections
        min_ni += bui.grid.node_intersections_fromto(cni, node, node_idx2nodes_idx[cni]);
        //distance
        min_ni += 0.1*bui.grid.edge_distance(node, node_idx2nodes_idx[cni]);
        //----------------------------------------
        var cx = node.x;
        var cy = node.y;
        var counter = 0;
        var best_x = undefined;
        var best_y = undefined;
        var taxi_x, taxi_y;
        var stop_distance = undefined;
        var fields_visited = 0;
        while(true){
            //-----------------------
            if ( num_empty_fields==fields_visited ) break;
            cx += spiral_setps[counter][0];
            cy += spiral_setps[counter][1];
            ++counter;
            //-----------------------
            if(cx>=0 && cx<bui.grid.width && cy>=0 && cy<bui.grid.height && matrix_nodes[cx][cy] == undefined){
                ++fields_visited;
                tmp_ni = bui.grid.edge_intersections_fromto({ x : cx, y : cy }, node_idx2nodes_idx[cni], node_idx2edges_idx[cni]);
                tmp_ni += bui.grid.node_intersections_fromto(cni, { x : cx, y : cy}, node_idx2nodes_idx[cni]);
                tmp_ni += 0.1*bui.grid.edge_distance({ x : cx, y : cy }, node_idx2nodes_idx[cni]);
                //--------------------------------------
                if(tmp_ni<min_ni){
                    node.x>cx ? taxi_x = node.x-cx : taxi_x = cx-node.x;
                    node.y>cy ? taxi_y = node.y-cy : taxi_y = cx-node.y;
                    min_ni = tmp_ni;
                    best_x = cx;
                    best_y = cy;
                    stop_distance = taxi_x+taxi_y; 
                }
                if (stop_distance != undefined){
                    node.x>cx ? taxi_x = node.x-cx : taxi_x = cx-node.x
                    node.y>cy ? taxi_y = node.y-cy : taxi_y = cx-node.y
                    if((taxi_x+taxi_y)*2>stop_distance){
                        //console.log('taxi stop');
                        break
                    }
                }
                if(tmp_ni==0){
                    break;
                }
            }
        }
        //--------------------------------------
        if(best_x != undefined){
            matrix_nodes[best_x][best_y] = 1;
            matrix_nodes[node.x][node.y] = undefined;
            node.x=best_x;
            node.y=best_y;
            bui.grid.set_nodes_as_edges(cni);
            //for(var i=0; i<node_idx2edges_idx[cni].length; ++i) bui.grid.set_buckets(node_idx2edges_idx[cni][i],'clear');
        }
        //--------------------------------------
        ++cni;
        if (cni>=nodes.length-1) cni=0;
        //--------------------------------------
    }
    bui.grid.render_current();
    console.log('line crossings after: '+bui.grid.num_intersections());
    console.log('node crossings after: '+bui.grid.num_node_intersections());
}
//=====================================================
bui.grid.render_current = function(){
    var nodes = bui.grid.nodes;
    var grid_space = bui.grid.grid_space;
    for(i=0; i<nodes.length; ++i) 
        nodes[i].absolutePositionCenter(nodes[i].x*grid_space,nodes[i].y*grid_space); 
}
//=====================================================
bui.grid.edge_distance = function(from_node, to_nodes){
    distance = 0;
    var nodes = bui.grid.nodes;
    var taxi_x, taxi_y;
    for(var i=0;i<to_nodes.length; ++i){
        cx = nodes[to_nodes[i]].x;
        cy = nodes[to_nodes[i]].y;
        from_node.x>cx ? taxi_x = from_node.x-cx : taxi_x = cx-from_node.x;
        from_node.y>cy ? taxi_y = from_node.y-cy : taxi_y = cx-from_node.y;
        distance += taxi_x+taxi_y; 
    }
    return distance;
}
//=====================================================
bui.grid.edge_intersections_fromto = function(from_node, to_nodes, to_edges){
    var counter = 0;
    var edges = bui.grid.edges;
    var nodes = bui.grid.nodes;
    for(var i=0;i<to_nodes.length; ++i){
        for(var j=0; j<edges.length; ++j){
            if(!(j in to_edges)){
                /*if ('id' in from_node)
                console.log(JSON.stringify([
                            {x:from_node.x,y:from_node.y},from_node.id(),
                            {x:nodes[to_nodes[i]].x,y:nodes[to_nodes[i]].y},nodes[to_nodes[i]].id(),
                            {x:edges[j].lsource.x,y:edges[j].lsource.y},
                            {x:edges[j].ltarget.x,y:edges[j].ltarget.y}]))
                */
                if( bui.grid.intersect(from_node, nodes[to_nodes[i]], edges[j].lsource, edges[j].ltarget) ){
                    ++counter;
                }
            }
        }
    }
    for(var i=0;i<to_nodes.length; ++i){
        for(var j=i+1;j<to_nodes.length; ++j){
            if( bui.grid.intersect(from_node, nodes[to_nodes[i]], from_node, nodes[to_nodes[j]]) ){
                ++counter;
            }
        }
    }
    return counter;
}
//=====================================================
bui.grid.num_intersections = function(edges_index, mark){
    var counter = 0;
    var crossing_edges = [];
    for(var i=0; i<bui.grid.edges.length; ++i){
        for(var j=i+1; j<bui.grid.edges.length; ++j){
            if(bui.grid.intersect(bui.grid.edges[i].lsource,bui.grid.edges[i].ltarget,bui.grid.edges[j].lsource,bui.grid.edges[j].ltarget, mark) == true){
                if(edges_index != undefined){
                    if(i in edges_index){
                        crossing_edges.push(j);
                        if(mark != undefined){
                            /*console.log(JSON.stringify([
                            {x:bui.grid.edges[i].lsource.x,y:bui.grid.edges[i].lsource.y},
                            {x:bui.grid.edges[i].ltarget.x,y:bui.grid.edges[i].ltarget.y},
                            {x:bui.grid.edges[j].lsource.x,y:bui.grid.edges[j].lsource.y},
                            {x:bui.grid.edges[j].ltarget.x,y:bui.grid.edges[j].ltarget.y},
                            ]));*/
                            bui.grid.edges[j].addPoint(1,1,'Outcome');
                            bui.grid.edges[j].recalculatePoints();
                        }
                    }else if (j in edges_index){
                        crossing_edges.push(i);
                        if(mark != undefined){
                            bui.grid.edges[i].addPoint(1,1,'Outcome');
                            bui.grid.edges[i].recalculatePoints();
                        }
                    }
                }
                ++counter;
            }
        }
    }
    if(edges_index != undefined){
        return crossing_edges;
    } 
    return counter
}
//=====================================================
bui.grid.num_node_intersections = function(edges_index, mark){
    var counter = 0;
    var edges = bui.grid.edges;
    for(var i=0; i<edges.length; ++i){
        for(var j=0; j<bui.grid.nodes.length; ++j){
            if(j != edges[i].source_idx && j != edges[i].target_idx){
                var nae = bui.grid.nodes_as_edges[j];
                if(bui.grid.intersect(edges[i].source(), edges[i].target(), nae[0].source, nae[0].target)){
                    ++counter;
                }else if(bui.grid.intersect(edges[i].source(), edges[i].target(), nae[1].source, nae[1].target)){
                    ++counter;
                }
            }
        }
    }
    return counter
}
//=====================================================
bui.grid.node_intersections_fromto = function(from_node_index, from_node, to_nodes){
    var counter = 0;
    var nodes = bui.grid.nodes;
    for(var i=0;i<to_nodes.length; ++i){
        for(var j=0; j<nodes.length; ++j){
            if(j!=from_node_index && j != to_nodes[i]){
                var nae = bui.grid.nodes_as_edges[j];
                if(bui.grid.intersect(from_node, nodes[to_nodes[i]], nae[0].source, nae[0].target)){
                    ++counter;
                }else if(bui.grid.intersect(from_node, nodes[to_nodes[i]], nae[1].source, nae[1].target)){
                    ++counter;
                }
            }
        }
    }
    return counter;
}
//=====================================================
bui.grid.set_nodes_as_edges = function(node_index){
    var nodes = bui.grid.nodes;
    var node_edges = [];
    var grid_space = bui.grid.grid_space;
    if (node_index == undefined){
        for(var i=0; i<nodes.length; ++i){
            var node = nodes[i];
            var size = node.size();
            var width = size.width/grid_space/2;
            var height = size.height/grid_space/2;
            var A = {x:node.x-width, y:node.y+height};
            var B = {x:node.x+width, y:node.y-height};
            var C = {x:node.x-width, y:node.y-height};
            var D = {x:node.x+width, y:node.y+height};
            node_edges.push([
                    {source: A, target: B },
                    {source: C, target: D }
                    ]);
        }
        bui.grid.nodes_as_edges = node_edges;
    }else{
        var node = nodes[node_index];
        var size = node.size();
        var width = size.width/grid_space/2;
        var height = size.height/grid_space/2;
        var A = {x:node.x-width, y:node.y+height};
        var B = {x:node.x+width, y:node.y-height};
        var C = {x:node.x-width, y:node.y-height};
        var D = {x:node.x+width, y:node.y+height};
        bui.grid.nodes_as_edges[node_index] = [
                {source: A, target: B },
                {source: C, target: D }
                ];
    }
}

//=====================================================
bui.grid.ccw = function(A,B,C){
    return (C.y-A.y)*(B.x-A.x) > (B.y-A.y)*(C.x-A.x)
}
bui.grid.collinear = function(A,B,C) {
  return (A.y - B.y) * (A.x - C.x) == (A.y - C.y) * (A.x - B.x);
}
bui.grid.point_on_segment = function(A,B,C){
    if (A.x == B.x){
        if(A.y<B.y){
            if(A.y<C.y && B.y>C.y) return true
            else return false
        }else{
            if(B.y<C.y && A.y>C.y) return true
            else return false
        }
    }else if (A.x<B.x){
        if(A.x<C.x && B.x>C.x) return true
        else return false
    }else{
        if(B.x<C.x && A.x>C.x) return true
        else return false
    }
}
bui.grid.intersect = function(A,B,C,D, mark){
    //if (mark!=undefined) console.log('check this '+JSON.stringify([A.id(),{x:A.x,y:A.y},B.id(),{x:B.x,y:B.y},C.id(),{x:C.x,y:C.y},D.id(),{x:D.x,y:D.y}]));
    if (bui.grid.collinear(A,B,C)){
        if (bui.grid.collinear(A,B,D)){
            if (A.x == B.x){
                if( (A.y>=C.y&&B.y>=C.y &&A.y>=D.y&&B.y>=D.y) || (A.y<=C.y&&B.y<=C.y &&A.y<=D.y&&B.y<=D.y) ) return false
                else return true // collinear horizontal overlapping
            }else{
                if( (A.x>=C.x&&B.x>=C.x &&A.x>=D.x&&B.x>=D.x) || (A.x<=C.x&&B.x<=C.x &&A.x<=D.x&&B.x<=D.x) ) return false;
                else return true;//colinear and overlapping
            }
        }else{
            //console.log('ABC  col')
            return bui.grid.point_on_segment(A,B,C)
        }
    }else if (bui.grid.collinear(A,B,D)){ 
        //console.log('ABD  col')
        return bui.grid.point_on_segment(A,B,D)
    }else if (bui.grid.collinear(C,D,A)){ 
        //console.log('CDA  col')
        return bui.grid.point_on_segment(C,D,A)
    }else if (bui.grid.collinear(C,D,B)){ 
        //console.log('CDB  col')
        return bui.grid.point_on_segment(C,D,B)
    }else{
        //console.log('ccw')
        return bui.grid.ccw(A,C,D) != bui.grid.ccw(B,C,D) && bui.grid.ccw(A,B,C) != bui.grid.ccw(A,B,D);
    }

}