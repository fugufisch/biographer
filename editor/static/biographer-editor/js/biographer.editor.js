function Editor(){
    //=========================
    this.graph = null;
    //=========================
    this.t;
    this.timer_is_on=0;
    this.intervall = 60000;//every 60 seconds
    this.last_save = '';
    this.cur_mode = false;
    //=========================
    //doHeartBeat();
    //=========================
    this.x = 1;
    this.canvaspos = $('#canvas').position();
    this.selected_nodes = [];
    this.loading_img = $('script[src*="js/biographer.editor.js"]').attr('src').replace('js/biographer.editor.js', 'img/loading.gif'); 
    this.init();
}
//-------------------------------------------
Editor.prototype = {
    save: function(action) {
        if (action == 'manual' || action == 'auto'){
            var now = new Date();
            var pretty_date = [ now.getFullYear(), '-', now.getMonth() + 1, '-', now.getDate(), ' ', now.getHours(), ':', now.getMinutes(), ':', now.getSeconds() ].join('');
            this.undoPush(action+' save '+pretty_date);
        }else if (action != undefined){
            this.undoPush(action);
        }
    },
    autosaveHeartBeat: function(no_save) {
        var this_editor = this;
        if (no_save != true){
            //autosave json graph if graph was modified
            this.save('auto');
        }
        this_editor.t=setTimeout("autosaveHeartBeat()",intervall);
    },
    doHeartBeat: function() {
        if (!this.timer_is_on) {
          this.timer_is_on=1;
          this.autosaveHeartBeat(true);
          }
    },
    //-------------------------------------------
    redrawGraph: function(graph_json){
        var all_drawables = this.graph.drawables(); 
        for (var key in all_drawables) {
            all_drawables[key].remove();
        }
        delete this.graph;
        $('#canvas').html(''); 
        this.graph = new bui.Graph($('#canvas')[0]);
        bui.importFromJSON(this.graph, graph_json);
        //add edge select listner to all nodes 
        var all_drawables = editor.graph.drawables();
        for (var key in all_drawables) {
                all_drawables[key].bind(bui.Node.ListenerType.click, editor.drawableSelect);
        }
        var this_editor = this;
        $('.Complex, .Compartment').droppable({ 
                hoverClass: 'drop_hover',
                over : function(){$('#canvas').droppable("disable");},
                out : function(){$('#canvas').droppable("enable");},
                drop: function(event, ui){this_editor.dropFkt(event, ui, this);},
        });
    },
    //-------------------------------------------
    showUndoRedo: function(){
        if(editor_config.history_undo.length > 0){
            $('#undo').removeClass('disabled');
            var newArray = editor_config.history_undo.slice();
            $('#undo>div').html(newArray.reverse().join('<br/>'));
        }else{
            $('#undo').addClass('disabled');
            $('#undo>div').html('undo');
        }
        if(editor_config.history_redo.length > 0){
            $('#redo').removeClass('disabled');
            $('#redo>div').html(editor_config.history_redo.join('<br/>'));
            var newArray = editor_config.history_redo.slice();
            $('#redo>div').html(newArray.reverse().join('<br/>'));
        }else{
            $('#redo').addClass('disabled');
            $('#redo>div').html('redo');
        } 
    },
    //-------------------------------------------
    undoPush: function(action){
        var editor = this;
        var jsong = JSON.stringify(this.graph.toJSON());
        if (jsong == this.last_save){
            $('.flash').html('Saved: nothing changed, woooah').fadeIn().delay(800).fadeOut();
            return false;
        }
        $.ajax({
            url: editor_config.url_undo_push,
            data : {
                graph: jsong,
                action: action,
            },
            success: function( data ) {
                $('.flash').html('Saved '+action).fadeIn().delay(800).fadeOut();
                editor.undoRegister(action, jsong)
                return true;
            }
        });
    },
    undoRegister: function(action, graph_str){
        editor_config.history_undo.push(action)
        editor_config.history_redo = [];
        this.showUndoRedo();
        this.last_save = graph_str;
    },
    //-------------------------------------------
    undo: function(){
        var this_editor = this;
        $.getJSON(editor_config.url_undo, function(data) {
            this_editor.redrawGraph(data);
            var action = editor_config.history_undo.pop();
            editor_config.history_redo.push(action);
            this_editor.showUndoRedo();

        });
    },
    redo: function(){
        var this_editor = this;
        $.getJSON(editor_config.url_redo, function(data) {
            var action = editor_config.history_redo.pop();
            editor_config.history_undo.push(action);
            this_editor.showUndoRedo();
            this_editor.redrawGraph(data.graph);
        });
    },
    //-------------------------------------------
    setMode: function(mode){
        if (mode == this.cur_mode) return 
        this.cur_mode = mode;
        $('#canvas').unbind('mousemove');
        $('.follow').hide();
        $('.active').removeClass('active');
        var mode2id = {'del':'cross', 'edit':'wrench', 'Edge':'edge', 'Spline':'spline', 'focus':'focus'}
        if ((mode == 'del')||(mode == 'edit')||(mode == 'Edge')||(mode == 'Spline')||(mode == 'focus')){
            $('#'+mode).addClass('active');
            $('#follow_'+mode2id[mode]).show();
            $("#canvas").mousemove(function(e){
                $('#follow_'+mode2id[mode]).css('top', e.clientY+15).css('left', e.clientX+15);
            });
        }else if (mode == false){
            $('#cursor').addClass('active');
        }
    },
    //-------------------------------------------
    drawableSelect: function(drawable, select_status) {
        //alert('drawableSelect');
        if ((this.cur_mode == 'Edge')||(this.cur_mode == 'Spline')){
            if(drawable.drawableType()=='node') selected_nodes.push(drawable);
            if (selected_nodes.length>=2){
                //draw edge now
                //new_edge = graph.add(bui[$('#select_edge_spline').val()])
                new_edge = this.graph.add(bui[this.cur_mode])
                        .source(selected_nodes[0])
                        .target(selected_nodes[1])
                        .visible(true);
                if(this.cur_mode=='Spline') new_edge.setSplineHandlePositions([
                    {x:selected_nodes[0].position().x-10,y:selected_nodes[0].position().y-20},
                    {x:selected_nodes[1].position().x-10,y:selected_nodes[1].position().y-20}
                    ], 300);
                //set click listener on new edge
            //FIXME this crashes, but it should work?
            //script.js:137Uncaught TypeError: Cannot read property 'ListenerType' of undefined
                //new_node.bind(bui.abstractLine.ListenerType.click, drawableSelect);

                edgeModal(new_edge, 'created '+this.cur_mode);
                selected_nodes = []
            }
        } else if (this.cur_mode == 'edit'){
            if(drawable.drawableType()=='edge'){
                edgeModal(drawable, 'edited edge');
            } else {
                var label = 'Complex';
                if(drawable.identifier()!='Complex') label = drawable.label();
                nodeModal(drawable, 'edited node '+label);
            } 
        } else if (this.cur_mode == 'del'){
            drawable.remove();
            undoPush('deleted '+drawable.drawableType());
        } else if (this.cur_mode == 'focus'){
            if(drawable.drawableType()=='node') bui.util.alignCanvas(this.graph, drawable.id());
        }
    },
    //-------------------------------------------
    nodeModal: function(drawable, action) {
        var this_editor = this;
        //do not add lable to complex but anything else
        $('#action').html(action);
        if((drawable.identifier()=='Complex') || (drawable.identifier()=="Association") || (drawable.identifier()=="Dissociation")){
            $('#node_label_row').hide()
        }else{
            $('#node_label_row').show();
            $('#node_label').val(drawable.label());
        }
        //-----------------
        $('.current_id').attr('id', drawable.id());
        $("#node_modal_input").modal({
            overlayClose:true,
            opacity:20,
            onClose: function(){
                if(drawable.identifier()!='Complex'){
                    if ( $('#node_label').val() != '' ) drawable.label($('#node_label').val()).adaptSizeToLabel();
                }
                if((drawable.identifier()=="Association") || (drawable.identifier()=="Dissociation")){
                    drawable.size(20,20)
                }
                $('.unit_of_information').each(function(){
                    if($(this).val()){
                        this_editor.graph.add(bui.UnitOfInformation)
                        //.position(-10, -10)//TODO do we need this
                        .parent(drawable)
                        .label($(this).val())
                        .adaptSizeToLabel(true)
                        .visible(true);
                    }
                }); 
                if(($('input[name="node_color"]:checked').val() != 'none')&&($('input[name="node_color"]:checked').val() != undefined)){
                    drawable.removeClass();
                    drawable.addClass($('input[name="node_color"]:checked').val());
                }
                this_editor.save($('#action').html());
                $.modal.close();
            }
        });
        //=========================
        $('#node_modal_input').keydown(function(event){
            if(event.keyCode == 13){
            $.modal.close();
                event.preventDefault();
                return false;
            }
        });
    },
    //-------------------------------------------
    edgeModal: function(drawable, action) {
        //do not add lable to complex but anything else
        $('#action').html(action);
        $('#marker_type').html('');
        //-----------------
        $('.current_id').attr('id', drawable.id());
        $("#edge_modal_input").modal({
            overlayClose:true,
            opacity:20,
            onClose: function(){
                if($('#marker_type').html() != ''){
                    if($('#edge_marker').val() !='none'){
                        drawable.marker(bui.connectingArcs[$('#marker_type').html()].id);
                    }
                }
                save($('#action').html());
                $.modal.close();
            }
        });
        //=========================
        /*$('#edge_modal_input').keydown(function(event){
            if(event.keyCode == 13){
            $.modal.close();
                event.preventDefault();
                return false;
            }
        });*/
    },
    //-------------------------------------------
    placeholdersVisible: function(visible){
        var all_drawables = this.graph.drawables();
        for (var key in all_drawables) {
            drawable = all_drawables[key]
                if (drawable.drawableType()=='node'){
                    drawable.placeholderVisible(visible);
                }
        }
    },
    //-------------------------------------------
    dropFkt: function(event, ui, element){
        if(ui.helper.hasClass('node_helper')){
            //calculate position of new node
            var pos_top = ui.offset.top-this.canvaspos.top;
            var pos_left = ui.offset.left-this.canvaspos.left;
            //set size of new node
            var size = {};
            if(ui.helper.attr('id')=='Process'){
                size = {h:20, w:20};
            }else if((ui.helper.attr('id')=='Compartment')||(ui.helper.attr('id')=='Complex')){
                size = {h:100, w:100};
            }else {
                size = {h:50, w:50};
            }
            //create new node
            new_node = this.graph.add(bui[ui.helper.attr('id')])
                .position(pos_left, pos_top)
                .size(size.h, size.w)
                .visible(true)
            //add parent if the drop is within a container like complex or compartment
            if ($(element).attr('id').indexOf('placeholder') == 0){
                var drawable_parent = this.graph.drawables()[$(element).attr('id').substring(12)]
                    new_node.parent(drawable_parent)
                    //alert('parent_id '+parent_id);
                    if (drawable_parent.identifier() == 'Complex'){
                        drawable_parent.tableLayout();
                    } else {
                        pos_top = pos_top-drawable_parent.position().y
                            pos_left = pos_left-drawable_parent.position().x
                            new_node.position(pos_left, pos_top)
                    }
            }
            //-----------------
            this.nodeModal(new_node, 'created '+ui.helper.attr('id'));
            //-----------------
            //set click listener on new node
            new_node.bind(bui.Node.ListenerType.click, this.drawableSelect, 'node_select');
            //set droppable listener on new node
            $('#placeholder_'+new_node.id()).droppable({ 
                hoverClass: 'drop_hover',
                over : function(){$('#canvas').droppable("disable");},
                out : function(){$('#canvas').droppable("enable");},
                drop: function(event, ui){dropFkt(event, ui, this);},
            });
            //make all drawables placeholders invisible
            this.placeholdersVisible(false);
            $('#canvas').droppable("enable");
        }
    },
    //-------------------------------------------
    get_nodes_edges: function(){
            var nodes = [], edges = [];
            var all_drawables = this.graph.drawables();
            var count = 0;
            for (var key in all_drawables) {
                drawable = all_drawables[key];
                drawable.index = count;
                ++count;
                if ((drawable.identifier()=='bui.EdgeHandle')||(drawable.identifier() == 'bui.Labelable')||(drawable.identifier() == 'Compartment')||(drawable.identifier() == 'bui.StateVariable')||(drawable.identifier() == 'bui.StateVariableER')){
                    //ignore
                }else if (drawable.drawableType()=='node'){
                    var dparent = drawable.parent();
                    if (('absolutePositionCenter' in drawable)&& (!('identifier' in dparent) || dparent.identifier() != 'Complex')){
                        var pos = drawable.absolutePositionCenter();
                        drawable.x = pos.x;
                        drawable.y = pos.y;
                        nodes.push(drawable);
                    }
                }else if(drawable.identifier() == 'bui.Edge'){
                    //----------------------------------
                    if (drawable.source().identifier() == 'bui.EdgeHandle'){
                        if(drawable.source().lparent.target().identifier() == 'bui.StateVariableER'){
                            drawable.lsource = drawable.source().lparent.target().parent();

                        }else if(drawable.source().lparent.target().identifier() == 'bui.EdgeHandle'){ 
                            if(drawable.source().lparent.target().lparent.target().identifier() == 'bui.StateVariableER'){
                                drawable.lsource = drawable.source().lparent.target().lparent.target().parent();
                            }else {
                                drawable.lsource = drawable.source().lparent.target().lparent.target();
                            }
                        }else {
                            drawable.lsource = drawable.source().lparent.target();
                        }
                    }else if(drawable.source().identifier() == 'bui.StateVariableER'){
                        drawable.lsource = drawable.source().parent();
                    }else {
                        drawable.lsource = drawable.source()
                    }
                    //----------------------------------
                    if (drawable.target().identifier() == 'bui.EdgeHandle'){
                        if(drawable.target().lparent.target().identifier() == 'bui.StateVariableER'){
                            drawable.ltarget = drawable.target().lparent.target().parent();

                        }else if(drawable.target().lparent.target().identifier() == 'bui.EdgeHandle'){ 
                            if(drawable.target().lparent.target().lparent.target().identifier() == 'bui.StateVariableER'){
                                drawable.ltarget = drawable.target().lparent.target().lparent.target().parent();
                            }else {
                                drawable.ltarget = drawable.target().lparent.target().lparent.target();
                            }

                        }else{
                            drawable.ltarget = drawable.target().lparent.target();
                        }

                    }else if(drawable.target().identifier() == 'bui.StateVariableER'){
                        drawable.ltarget = drawable.target().parent();
                    }else {
                        drawable.ltarget = drawable.target()
                    }
                    edges.push(drawable);
                }
            }
            return {nodes:nodes, edges:edges}
    },
    init: function(){
        var this_editor = this;
        //=========================
        var $_GET = {};

        document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
            function decode(s) { return decodeURIComponent(s.split("+").join(" ")); }
            $_GET[decode(arguments[1])] = decode(arguments[2]);
        });

        if('layout' in $_GET){
            $.ajax({
                url: editor_config.url_layout,
                data: {jsbgn: JSON.stringify(editor_config.graphData), layout: 'biographer', data:bui.layouter.makeLayouterFormat(editor_config.graphData), filename: $_GET['filename']}, 
                type: 'POST',
                success: function(data) {
                    //console.log(data);
                    bui.layouter.fromLayouterFormat(editor_config.graphData,data)
                    this_editor.undoRegister('applied automatic biographer layout', editor_config.graphData)
                    this_editor.redrawGraph(editor_config.graphData);
                    //bui.importUpdatedNodePositionsFromJSON(graph, editor_config.graphData, 300)
                    },
            });
        }
        this.showUndoRedo();
 
        $('#canvas').droppable({ 
                hoverClass: 'drop_hover',
                drop: function(event, ui){this_editor.dropFkt(event, ui, this);},
        });
        
        //=========================
        $('#hide_handles').click(function(){
            var all_drawables = this_editor.graph.drawables();
            for (var key in all_drawables) {
                drawable = all_drawables[key]
                if (drawable.identifier()=='bui.Edge'){
                    drawable.edgeHandlesVisible(false)
                }
                //drawable.recalculatePoints();
            }
        });
        //=========================
        $('#straighten_and_distribute').click(function(){
            if($(this).hasClass('fkt_active')){
                $(this).removeClass('fkt_active');
                bui.settings.straightenEdges = false;
            } else {
                $(this).addClass('fkt_active');
                bui.settings.straightenEdges = true;
            } 

        });
        //=========================
        $('#vertical_gaps_equal, #horizontal_gaps_equal').click(function(){
            // collect selected drawables
            var all_drawables = this_editor.graph.drawables();
            var selected_drawables = [];
            for (var key in all_drawables) {
                drawable = all_drawables[key]
                if ((drawable.drawableType()=='node')&&drawable.placeholderVisible()){
                    selected_drawables.push(drawable);
                }
            }
            // sort drawables
            var sorted_drawables = [];
            for(var i=0; i<selected_drawables.length; i++){
                sorted_drawables.push( { 
                x : selected_drawables[i].absolutePosition().x,
                y : selected_drawables[i].absolutePosition().y,
                drawable : selected_drawables[i]
                });
            }
            if($(this).attr('id')=='vertical_gaps_equal'){
                sorted_drawables.sort(function(a,b) { return a.y - b.y } );
            }else{
                sorted_drawables.sort(function(a,b) { return a.x - b.x } );
            }
            //calculate gap space
            var gap_space = 0;
            for (var i=0; i<sorted_drawables.length-1; i++){
                if($(this).attr('id')=='vertical_gaps_equal'){
                    gap_space += sorted_drawables[i+1].drawable.absolutePosition().y - sorted_drawables[i].drawable.absoluteBottomRight().y;
                }else{
                    gap_space += sorted_drawables[i+1].drawable.absolutePosition().x - sorted_drawables[i].drawable.absoluteBottomRight().x;
                }
            }
            //set equal gaps
            var gap_length = gap_space/(sorted_drawables.length-1)
            for (var i=1; i<sorted_drawables.length-1; i++){
                if($(this).attr('id')=='vertical_gaps_equal'){
                    sorted_drawables[i].drawable.absolutePosition(sorted_drawables[i].drawable.absolutePosition().x, sorted_drawables[i-1].drawable.absoluteBottomRight().y+gap_length)
                }else{
                    sorted_drawables[i].drawable.absolutePosition(sorted_drawables[i-1].drawable.absoluteBottomRight().x+gap_length, sorted_drawables[i].drawable.absolutePosition().y)
                }
            }

            var x_vals
            var max_x = Math.max()
        });
        //=========================
        $('#align_vertical, #align_hoizontal, #align_left, #align_top, #align_right, #align_bottom').click(function(){
            var all_drawables = this_editor.graph.drawables();
            var pos = undefined;
            for (var key in all_drawables) {
                drawable = all_drawables[key]
                var align_type = $(this).attr('id');
                if ((drawable.drawableType()=='node')&&drawable.placeholderVisible()){
                    if((align_type == 'align_hoizontal')||(align_type == 'align_vertical')){
                        if(pos === undefined){
                            pos = drawable.absolutePositionCenter();
                            //alert('horiz vert'+JSON.stringify(pos));
                        }else{
                            if(align_type=='align_hoizontal'){
                                drawable.absolutePositionCenter(drawable.absolutePositionCenter().x,pos.y);
                            }else if(align_type=='align_vertical'){
                                drawable.absolutePositionCenter(pos.x, drawable.absolutePositionCenter().y);
                            }
                        }
                    }else if((align_type == 'align_left')||(align_type == 'align_top')){
                        if(pos === undefined){
                            pos = drawable.absolutePosition();
                            //alert('left top'+JSON.stringify(pos));
                        }else{
                            if(align_type=='align_left'){
                                drawable.absolutePosition(pos.x, drawable.absolutePosition().y);
                            }else if(align_type=='align_top'){
                                drawable.absolutePosition(drawable.absolutePosition().x,pos.y);
                            }
                        }
                    }else if((align_type == 'align_right')||(align_type == 'align_bottom')){
                        if(pos === undefined){
                            pos = drawable.absoluteBottomRight();
                            //alert('right bottom'+JSON.stringify(pos));
                        }else{
                            if(align_type=='align_right'){
                                drawable.absoluteBottomRight(pos.x, drawable.absoluteBottomRight().y);
                            }else if(align_type=='align_bottom'){
                                drawable.absoluteBottomRight(drawable.absoluteBottomRight().x, pos.y);
                            }
                        }
                    }
                }
            }
        });
        $('#canvas').dblclick(function(){
                this_editor.placeholdersVisible(false);
        });
        //=========================
        $('#canvas').resizable();
        //=========================
        $('#clear').click(function(){
            this_editor.redrawGraph({nodes:[],edges:[]});
            //this_editor.graph.clear();//FIXME this does not work 
        });
        //=========================
        $('#layout_grid').click(function(evnt){
            nodes_edges = this_editor.get_nodes_edges();
            //orig_html = $('#layout_grid').html();
            //$('#layout_grid').html(this_editor.loading_img).ready(function(){
            bui.grid.init(nodes_edges.nodes,nodes_edges.edges);
            if (!evnt.ctrlKey){
                bui.grid.put_on_grid();
                bui.grid.layout();
            }else{
                bui.grid.put_on_grid();
                bui.grid.render_current();
            }
            //});
            //$('#layout_grid').html(orig_html);
        });
        //=========================
        $('#clone').click(function(){
            orig_html = $('#clone').html()
            $('#clone').html(this_editor.loading_img)
            var selected_drawables = {};
            var flag = false;
            var all_drawables = this_editor.graph.drawables();
            for (var key in all_drawables) {
                drawable = all_drawables[key]
                if ((drawable.drawableType()=='node')&&drawable.placeholderVisible()){
                    flag = true;
                    selected_drawables[drawable.id()] = 1;
                }
            }
            if(flag == false) bui.util.clone(this_editor.graph, 5);
            else bui.util.clone(this_editor, 2, selected_drawables)
            $('#clone').html(orig_html);
        });
        //=========================
        $('#combine').click(function(){
            var selected_drawables = {};
            var flag = false;
            var all_drawables = this_editor.graph.drawables();
            for (var key in all_drawables) {
                drawable = all_drawables[key]
                if ((drawable.drawableType()=='node')&&drawable.placeholderVisible()){
                    flag = true;
                    selected_drawables[drawable.id()] = 1;
                }
            }
            if(flag == true) bui.util.combine(this_editor.graph, selected_drawables);
        });
        //=========================
        $('#layout_force').click(function(){
         
            orig_html = $('#layout_force').html()
            $('#layout_force').html(this_editor.loading_img)
            nodes_edges = this_editor.get_nodes_edges();
            var nodes = [], links = [];
            //alert('in nodes '+nodes.length);
            bui.settings.straightenEdges = false;
            var force = d3.layout.force()
              .charge(-800)
              .linkDistance(150)
              .nodes(nodes_edges.nodes)
              .links(nodes_edges.edges)
              .size([$('#canvas').width(), $('#canvas').height()])
              .start();
            
        });
        //=========================
        $('#layout_grahviz').click(function(){
            $.getJSON(editor_config.url_layout+'.json?layout=graphviz', function(data) {
                editor_config.history_undo.push(data.action);
                this_editor.showUndoRedo();
                bui.importUpdatedNodePositionsFromJSON(this_editor.graph, data.graph, 300)
                //redrawGraph(data.graph);
            });
        });
        //=========================
        $('#layout_biographer').click(function(){
            var orig_html = $('#layout_biographer').html()
            $('#layout_biographer').html(this_editor.loading_img)
            editor_config.graphData=this_editor.graph.toJSON();
            $.ajax({
                url: editor_config.url_layout,
                data: {layout: 'biographer', data:bui.layouter.makeLayouterFormat(editor_config.graphData)}, 
                type: 'POST',
                success: function(data) {
                    //console.log(data);
                    bui.layouter.fromLayouterFormat(editor_config.graphData,data)
                    this_editor.undoRegister('applied automatic biographer layout', editor_config.graphData)
                    try{
                        this_editor.redrawGraph(editor_config.graphData);
                    }catch(e){
                        jQuery('.flash').html('FAILED '+e).fadeIn();
                    }
                    //bui.importUpdatedNodePositionsFromJSON(graph, editor_config.graphData, 300)
                    },
                complete: function(){
                $('#layout_biographer').html(orig_html);
                }
            });
        });
        //=========================
        $('#undo').click(function(){
            this_editor.undo();
        });
        //=========================
        $('#redo').click(function(){
            this_editor.redo();
        });
        //=========================
        $('#add_unit_of_information').click(function(){
            $('#uoi_group').append(' <br/><input type="text" placeholder="mt:prot" class="unit_of_information" /> ');
            $('#simplemodal-container').css('height', parseInt($('#simplemodal-container').css('height'))+20);
        });
        //=========================
        $('.load').click(function(){
            $.ajax({
                url: editor_config.url_import,
                type: 'POST',
                dataType: 'json',
                data : {
                    type : $(this).attr('id'), 
                    identifier : $('#'+$(this).attr('id')+'_input').val()
                },
                success: function( data ) {
                    this_editor.undoRegister(data.action, data.graph)
                    this_editor.redrawGraph(data.graph)
                    $.modal.close()
                    return true;
                },
                error: function(xhr, textStatus, errorThrown) {
                    $.modal.close();
                    jQuery('.flash').html(textStatus+' '+xhr.responseText).fadeIn();
                    return true;
                }
            });

        });
        //=========================
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
            $('#import_file_input').change(function(){
                var upload_element = $(this)[0]
                var file = upload_element.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.readAsText(file) //, "UTF-8");//TODO what encoding should be parsed???
                    reader.onload = function (evt) {
                        var content = evt.target.result;
                        //console.log('content: '+content);
                        var doc = sb.io.read(content);
                        if(doc == false){}
                        this_editor.redrawGraph(JSON.parse(sb.io.write(doc, 'jsbgn')));
                        this_editor.undoPush('loaded graph from JSON string');
                        $.modal.close();
                    }
                    reader.onerror = function (evt) {
                        console.log("error reading file");
                    }
                }
                return false;
            });
        } else {
            alert('The File APIs are not fully supported in this browser. You will not be able to upload jSBGN/SBGN-ML/SBML files. Please update your browser.');
        }
        $("#biomodel").change(function(){
            $(this).closest("form").submit();
        });
        //===
        $('#import_file').click(function() {
            modal = $("#import_file_modal_input").modal({
                overlayClose:true,
                opacity:20,
            });
        });
        //=========================
        $('#load_json_string').click(function(){
            this_editor.redrawGraph(JSON.parse($('#json_string').val()));
            this_editor.undoPush('loaded graph from JSON string');
            $.modal.close()
        });
        //===
        $('#import_str').click(function() {
            modal = $("#import_string_modal_input").modal({
                overlayClose:true,
                opacity:20,
            });
        });
        $('#canvas').bind('mousewheel', function(event,delta){
            var rate;
            if (delta > 0) {
                // mousewheel is going up; 
                rate = 0.1;
            } else {
                rate = -0.1;
                // mousewheel is going down 
            }
            this_editor.graph.scale(this_editor.graph.scale() + rate);
        });
        //=========================
        $('.scale').click(function() {
            var rate = bui.util.toNumber($(this).data('rate'));
            this_editor.graph.scale(this_editor.graph.scale() + rate);
            return false;
        });
        //=========================
        $('#scale1').click(function() {
            this_editor.graph.scale(1);
        });
        //=========================
        $('#fit_to_screen').click(function() {
            this_editor.graph.fitToPage();
            this_editor.graph.reduceTopLeftWhitespace(100);
            return false;
        });
        //=========================
        $('h3.section').click(function(){
            $(this).parent().find('table').slideToggle();
            if($(this).hasClass('up')){
                $(this).removeClass('up').addClass('down') 
            }else{
                $(this).removeClass('down').addClass('up');
            }
        });
        //=========================
        $('#edit_all_nodes, #edit_no_nodes').click(function(){
                var visible = $(this).attr('id')=='edit_all_nodes';
                this_editor.placeholdersVisible(visible);
        });
        //=========================
        $('.tools_click li').click(function(){
            if($(this).attr('id')=='cursor'){
                this_editor.setMode(false);
            }else{
                this_editor.setMode($(this).attr('id'));
            }
        });
        //=========================
        $('.marker_select').click(function(){
            $('#marker_type').html($(this).attr('id'))
        $.modal.close();
        });
        //=========================
        $('#close_modal_input').click(function(){
            $.modal.close(); 
        });
        //=========================
        $('#save_to_session').click(function(){
            this_editor.save('manual');
        });
        //=========================
        $('#export_json').click(function(){
            //alert(JSON.stringify(graph.toJSON()));
            $('#export_form').html('<input type="hidden" name="json" value=\''+JSON.stringify(this_editor.graph.toJSON())+'\' />').submit();
        });
        //=========================
        $('#export_svg').click(function(){
            //alert($('#canvas svg').parent().html());
            $('#export_form').html('<input type="hidden" name="svg" value=\''+$('#canvas svg').parent().html()+'\' />').submit();
        });
        //=========================
        $('#export_other').click(function() {
            modal = $("#export_file_modal_input").modal({
                overlayClose:true,
                opacity:20,
            });
        });
        //===
        $("#export_format_select").change(function(){
            if($('#export_format_select').val() != '... choose'){
                $('#export_form').html('<input type="hidden" name="format" value=\''+$('#export_format_select').val()+'\' /><input type="hidden" name="svg_data" value=\''+$('#canvas svg').parent().html()+'\' />').submit();
        }
        });
        //=========================
        $('.node').draggable({
            zIndex: 2,
            //revert: true, 
            //grid: [ 20,20 ],//does not work, need aling functions
            helper: function() {return '<img src="'+editor_config.images_base_path+$(this).attr('id')+'_helper.png" id="'+$(this).attr('id')+'" class="node_helper"/>'},
            start: function() {
                this_editor.setMode(false);
                //make all drawables placeholders visible
                var all_drawables = this_editor.graph.drawables();
                for (var key in all_drawables) {
                    drawable = all_drawables[key]
                    if (((drawable.identifier()=='Complex')&& !$(this).hasClass('no_drop_complex'))||(drawable.identifier()=='Compartment')){
                    drawable.placeholderVisible(true);
                    }else if (drawable.drawableType()=='node'){
                    drawable.placeholderVisible(false);
                    }
                }
            }, 
        });
    }
}

