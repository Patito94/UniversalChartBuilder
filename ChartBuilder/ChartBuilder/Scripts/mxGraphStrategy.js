var mxGraphStrategy = function () {
    mxPolyline.prototype.constraints = null;
    // Program starts here. Creates a sample graph in the
    // DOM node with the specified ID. This function is invoked
    // from the onLoad event handler of the document (see below).
    var graph;
    var parent;

    //Set Anchors:
    var topCenter = new mxConnectionConstraint(new mxPoint(0.5, 0), true);
    var leftCenter = new mxConnectionConstraint(new mxPoint(0, 0.5), true);
    var rightCenter = new mxConnectionConstraint(new mxPoint(1, 0.5), true);
    var bottomCenter = new mxConnectionConstraint(new mxPoint(0.5, 1), true);

    var load_array = {
        loadblocks: [],
        loadconnections: []
    }

    this.Create = function () {
        document.getElementById("buttons").style.visibility = "visible";
        var container = document.getElementById('canvas');
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error('Browser is not supported!', 200, false);
        }
        else {


            graph = new mxGraph(container);
            graph.setConnectable(true);
            graph.setPortsEnabled(false);
            //edgek (vonalak) ne legyenek mozgathatóak
            graph.setAllowDanglingEdges(false);
            graph.setDisconnectOnMove(false);

            style = new Object();
            style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
            graph.getStylesheet().putCellStyle('port', style);
            graph.getStylesheet().getDefaultEdgeStyle()['edgeStyle'] = 'orthogonalEdgeStyle';

            new mxRubberband(graph);
            // Removes cells when [DELETE] is pressed
            var keyHandler = new mxKeyHandler(graph);
            keyHandler.bindKey(46, function (evt) {
                if (graph.isEnabled()) {
                    graph.removeCells();
                }
            });
            parent = graph.getDefaultParent();
            OverrideAnchors();
        }
    }

    OverrideAnchors = function () {
        mxGraph.prototype.getAllConnectionConstraints = function (terminal, source) {
            if (terminal != null && terminal.shape != null) {
                if (terminal.shape.stencil != null) {
                    if (terminal.shape.stencil != null) {
                        return terminal.shape.stencil.constraints;
                    }
                }
                else if (terminal.shape.constraints != null) {
                    return terminal.shape.constraints;
                }
            }
            return null;
        };
    }

    this.AddStart = function (posx, posy, text) {
        LoadStart(null,posx,posy,text);
    }

    var vertexHandlerUnion = mxVertexHandler.prototype.union;
    mxVertexHandler.prototype.union = function (bounds, dx, dy, index, gridEnabled, scale, tr) {
        var result = vertexHandlerUnion.apply(this, arguments);

        result.width = Math.max(result.width, mxUtils.getNumber(this.state.style, 'minWidth', 100));
        result.height = Math.max(result.height, mxUtils.getNumber(this.state.style, 'minHeight', 50));

        return result;
    };

    LoadStart = function (id, posx, posy, text) {
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, id, text, posx, posy, 100, 50);
            v1.setStyle("Start");
            v1.setConnectable(false);
            
            var port = graph.insertVertex(v1, null, '', 0.5, 1.0, 16, 16, 'port;image=/Content/dot.gif', true);
            port.geometry.offset = new mxPoint(-6, -6);
            port.setTerminal(v1, true);
            
        }
        finally {
            graph.getModel().endUpdate();
        }
    }

    this.AddStop = function (posx, posy, text) {
        LoadStop(null,posx,posy,text);
    }

    LoadStop = function (id, posx, posy, text) {
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, id, text, posx, posy, 100, 50);
            v1.setStyle("Stop");
            v1.setConnectable(false);
            var port = graph.insertVertex(v1, null, '', 0.5, 0, 16, 16, 'port;image=/Content/dot.gif', true);
            port.geometry.offset = new mxPoint(-6, -8);
        }
        finally {
            // Updates the display
            graph.getModel().endUpdate();
        }
    }

    this.AddDec = function (posx, posy, text) {
        LoadDec(null,posx,posy,text);
    }

    LoadDec = function (id, posx, posy, text) {
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, id, text, posx, posy, 100, 50);
            v1.setStyle("Dec");
            v1.setConnectable(false);
            var port = graph.insertVertex(v1, null, '', 0.5, 0, 16, 16, 'port;image=/Content/dot.gif', true);
            var port2 = graph.insertVertex(v1, null, '', 0, 0.5, 16, 16, 'port;image=/Content/dot.gif', true);
            var port3 = graph.insertVertex(v1, null, '', 1, 0.5, 16, 16, 'port;image=/Content/dot.gif', true);
            port.geometry.offset = new mxPoint(-8, -8);
            port2.geometry.offset = new mxPoint(-8, -8);
            port3.geometry.offset = new mxPoint(-8, -8);
        }
        finally {
            // Updates the display
            graph.getModel().endUpdate();
        }
    }

    this.AddAct = function (posx, posy, text) {
        LoadAct(null,posx,posy,text);
    }

    LoadAct = function (id, posx, posy, text) {
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, id, text, posx, posy, 100, 50);
            v1.setConnectable(false);
            v1.setStyle("Act");

            var port = graph.insertVertex(v1, null, '', 0.5, 0, 16, 16, 'port;image=/Content/dot.gif', true);
            var port2 = graph.insertVertex(v1, null, '', 0.5, 1, 16, 16, 'port;image=/Content/dot.gif', true);
            port.geometry.offset = new mxPoint(-8, -8);
            port2.geometry.offset = new mxPoint(-8, -8);
        }
        finally {
            // Updates the display
            graph.getModel().endUpdate();
        }
    }

    this.Save = function () {
        var encoder = new mxCodec();
        nodeData = [];

        nodes = graph.getChildVertices(graph.getDefaultParent())

        console.log(nodes);

        for (var i = 0; i < nodes.length; i++) {
            item = nodes[i];
            nodeData[i] = { id: String(item.id), type: item.style, text: item.value, position: { posX: item.geometry.x, posY: item.geometry.y } };
        }

        linkData = [];

        edges = graph.getChildEdges(graph.getDefaultParent());

        for (var i = 0; i < edges.length; i++) {
            link = edges[i];
            linkData[i] = { sourceId: String(link.source.parent.id), targetId: String(link.target.parent.id), anchors: [[link.source.geometry.x, link.source.geometry.y], [link.target.geometry.x, link.target.geometry.y]] };
        }


        var JSONObj = "";
        JSONObj += "{\"loadblocks\":";
        JSONObj += JSON.stringify(nodeData);
        JSONObj += ",\"loadconnections\":";
        JSONObj += JSON.stringify(linkData);
        JSONObj += "}";


        $.ajax({
            type: "POST",
            url: "/Home/SaveChart",
            data: { path: "Charts/jsplumChart.txt", chartJson: JSONObj }
        });

    }

    this.Load = function () {
        this.Clear();

        $.ajax({
            dataType: "json",
            url: "/Home/GetChart",
            data: { path: "Charts/jsplumChart.txt" },
            success: function (json) {
                load_array = JSON.parse(json);
                jsonToCanvas();
            }
        });
    }

    jsonToCanvas = function () {
        var length = load_array.loadblocks.length;
        for (var i = 0; i < length; i++) {
            switch (load_array.loadblocks[i].type) {
                case "Dec":
                    LoadDec(load_array.loadblocks[i].id, load_array.loadblocks[i].position.posX, load_array.loadblocks[i].position.posY, load_array.loadblocks[i].text);
                    break;
                case "Start":
                    LoadStart(load_array.loadblocks[i].id, load_array.loadblocks[i].position.posX, load_array.loadblocks[i].position.posY, "Start");
                    break;
                case "Act":
                    LoadAct(load_array.loadblocks[i].id, load_array.loadblocks[i].position.posX, load_array.loadblocks[i].position.posY, load_array.loadblocks[i].text);
                    break;
                case "Stop":
                    LoadStop(load_array.loadblocks[i].id, load_array.loadblocks[i].position.posX, load_array.loadblocks[i].position.posY, "Stop");
                    break;
            }
        }

        for (var i = 0; i < load_array.loadconnections.length; i++) {
            source = graph.getModel().getCell(load_array.loadconnections[i].sourceId);
            target = graph.getModel().getCell(load_array.loadconnections[i].targetId);
            var sourceCell, targetCell;
            //megkeresi a source a megfelelő pontjának indexét
            for (var j = 0; j < source.children.length; j++) {
                if (
                    source.children[j].geometry.x == load_array.loadconnections[i].anchors[0][0]
                    && source.children[j].geometry.y == load_array.loadconnections[i].anchors[0][1]
                  )
                    sourceCell = j;
            }
            //megkeresi a target a megfelelő pontjának indexét
            for (var j = 0; j < target.children.length; j++) {
                if (
                    target.children[j].geometry.x == load_array.loadconnections[i].anchors[1][0]
                    && target.children[j].geometry.y == load_array.loadconnections[i].anchors[1][1]
                  )
                    targetCell = j;
            }

            //beilleszti a vonalat
            graph.getModel().beginUpdate();
            try {
                var e1 = graph.insertEdge(parent, null, "", source.children[sourceCell], target.children[targetCell]);
            }
            finally {
                graph.getModel().endUpdate();
            }
        }

    }

    this.Clear = function () {
        var v1 = graph.removeCells(graph.getChildVertices(graph.getDefaultParent()))
        nodes = [];
    }
}