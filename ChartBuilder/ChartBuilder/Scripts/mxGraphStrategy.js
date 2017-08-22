var mxGraphStrategy = function () {
    mxPolyline.prototype.constraints = null;
    // Program starts here. Creates a sample graph in the
    // DOM node with the specified ID. This function is invoked
    // from the onLoad event handler of the document (see below).
    var graph;
    //var palette;
    var parent;
    var paletteparent;
    var sourceNode;
    var targetNode;
    var font_size = 6;

    var parser = new JSONParseChart();

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
        //Gombok Látszódása
        //document.getElementById("buttons").style.visibility = "visible";
        var container = document.getElementById('canvas');
        //var pal = document.getElementById('palette');
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error('Browser is not supported!', 200, false);
        }
        else {
            graph = new mxGraph(container);
            //palette = new mxGraph(pal);
            graph.setConnectable(true);
            graph.setPortsEnabled(false);
            //edgek (vonalak) ne legyenek mozgathatóak
            graph.setAllowDanglingEdges(false);
            graph.setDisconnectOnMove(false);


            style = new Object();
            style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
            //port label ne látszódjon
            style[mxConstants.STYLE_NOLABEL] = 1;

            graph.getStylesheet().putCellStyle('port', style);
            graph.getStylesheet().getDefaultEdgeStyle()['edgeStyle'] = 'orthogonalEdgeStyle';

            var stylefornode = new Object();
            stylefornode[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
            stylefornode[mxConstants.STYLE_NOLABEL] = 0;
            //var styleimage = new Object();
            //styleimage[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
            graph.getStylesheet().putCellStyle('picture', stylefornode);

            var xmlDocument = mxUtils.createXmlDocument();
            sourceNode = xmlDocument.createElement('Source');
            targetNode = xmlDocument.createElement('Target');

            //style = new Object();
            //style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
            //graph.getStylesheet().putCellStyle('node', style);

            //Áthelyeztük a hibakidobást más változóba, így ha rossz helyre/helyről húzunk nyilat, nem fog alertet dobni
            window.nativeAlert = window.alert;
            window.alert = function () { };
            //Próba hibaüzenet
            //window.nativeAlert("Próba");

            // Source node does not want any incoming connections
            graph.multiplicities.push(new mxMultiplicity(
                false, 'Source', null, null, 0, 0, null,
                'Source Must Have No Incoming Edge',
                null));

            // Target node does not want any outgoing connections
            graph.multiplicities.push(new mxMultiplicity(
                true, 'Target', null, null, 0, 0, null,
                'Target Must Have No Outgoing edge',
                null));

            new mxRubberband(graph);
            // Removes cells when [DELETE] is pressed
            var keyHandler = new mxKeyHandler(graph);
            keyHandler.bindKey(46, function (evt) {
                if (graph.isEnabled()) {
                    RemCells();
                }
            });
            parent = graph.getDefaultParent();
            //paletteparent = palette.getDefaultParent();
            OverrideAnchors();

            //A node-ok a szöveg méretével együtt nőnek
            graph.setAutoSizeCells(true);
            graph.setCellsResizable(true);

            var style = graph.getStylesheet().getDefaultVertexStyle();
            style[mxConstants.STYLE_FONTCOLOR] = fontcolor;
            graph.getStylesheet().putCellStyle('vertexesDefault', style);

            //palette.cellsMovable = false;
            //palette.cellsEditable = false;
            //palette.cellsResizable = false;
        }
    }

    RemCells = function () {
        selection = graph.getSelectionCells();
        for (var i = 0; i < graph.getSelectionCells().length; i++) {
            if (selection[i] != null) {
                if (selection[i].parent != parent) graph.removeCells([selection[i].parent]);
                else graph.removeCells([selection[i]]);
            }
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

    //Minimum width és height
    var vertexHandlerUnion = mxVertexHandler.prototype.union;
    mxVertexHandler.prototype.union = function (bounds, dx, dy, index, gridEnabled, scale, tr) {
        var result = vertexHandlerUnion.apply(this, arguments);

        result.width = Math.max(result.width, mxUtils.getNumber(this.state.style, 'minWidth', 100));
        result.height = Math.max(result.height, mxUtils.getNumber(this.state.style, 'minHeight', 50));

        return result;
    };

    this.AddStart = function (posx, posy, text) {
        LoadStart(null, posx, posy, text);
    }

    LoadStart = function (id, posx, posy, text) {
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, id, text, posx, posy, startwidth, startheight, 'picture;editable=0;'/*shape=ellipse;*/ + 'fillColor=' + startcolor + ';image=/Content/Images/protocol_start_small.png'); //vagy 'doubleEllipse'
            v1.setConnectable(false); /*'picture;editable=0;fillColor=' + altstartcolor + ';image=/Content/Images/protocol_start_alternative_small.png'*/
            v1.scale = false;

            var port = graph.insertVertex(v1, null, sourceNode, 0.5, 1.0, 16, 16, 'port;image=/Content/dot.gif', true);
            port.geometry.offset = new mxPoint(-6, -6);
            v1.type = "Start";
        }
        finally {
            graph.getModel().endUpdate();
        }
    }

    //this.AddPaletteStart = function () {
    //    palette.getModel().beginUpdate();
    //    try {
    //        var v1 = palette.insertVertex(paletteparent, null, "Start", 0, 0, 100, 50, 'editable=0;shape=ellipse;fillColor=' + startcolor); //vagy 'doubleEllipse'
    //        v1.setConnectable(false);
    //        v1.scale = false;
    //        v1.type = "Start";
    //    }
    //    finally {
    //        palette.getModel().endUpdate();
    //    }
    //}

    createStartDiv = function (id, posx, posy, text, category) {
        var Div = $('<div>', {
            id: String(id),
            class: 'window jtk-node',
            text: text,
            category: category,

        })
            .css(
            {
                top: posy,
                left: posx,
                'min-height': startheight + 'px',
                'min-width': startwidth + 'px',
                width: startheight + 'px',
                height: startwidth + 'px',
                //width: 'auto',
                //height: 'auto',
                //border: 'solid 0px',
                background: startcolor,
                'line-height': (startheight-11) + 'px',
                'border-color': 'black',
                color: fontcolor,
                'border-radius': startheight + 'px',
                'background-image': 'url("/Content/Images/protocol_start_small.png")',
                'background-size': 'cover',
                'background-repeat': 'no-repeat',
                'background-position': 'center center',
            });
        return Div;
    }

    this.AddPaletteStart = function (posx, posy, text) {
        var Div = createStartDiv("palettestart", posx, posy, "Start", "PaletteItem");
        Div.appendTo("#palette").draggable({ helper: 'clone' });;
    }

    this.AddAltStart = function (posx, posy, text) {
        LoadAltStart(null, posx, posy, text);
    }

    LoadAltStart = function (id, posx, posy, text) {
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, id, text, posx, posy, altstartwidth, altstartheight, 'picture;editable=0;fillColor=' + altstartcolor + ';image=/Content/Images/protocol_start_alternative_small.png'); //vagy 'doubleEllipse'
            v1.setConnectable(false);
            v1.scale = false;

            var port = graph.insertVertex(v1, null, sourceNode, 0.5, 1.0, 16, 16, 'port;image=/Content/dot.gif', true);
            port.geometry.offset = new mxPoint(-6, -6);

            v1.type = "AltStart";
        }
        finally {
            graph.getModel().endUpdate();
        }
    }

    createAltStartDiv = function (id, posx, posy, text, category) {
        var Div = $('<div>', {
            id: String(id),
            class: 'window jtk-node',
            text: text,
            category: category,
        })
            .css(
            {
                top: posy,
                left: posx,
                'min-height': altstartheight + 'px',
                'min-width': altstartwidth + 'px',
                width: altstartheight + 'px',
                height: altstartwidth + 'px',
                //width: 'auto',
                //height: 'auto',
                //border: 'solid 0px',
                background: altstartcolor,
                'border-color': 'black',
                color: fontcolor,
                'line-height': (altstartheight-11) + 'px',
                'border-radius': altstartheight + 'px',
                'background-image': 'url("/Content/Images/protocol_start_alternative_small.png")',
                'background-size': 'cover',
                'background-repeat': 'no-repeat',
                'background-position': 'center center',
            });
        return Div;
    }

    this.AddPaletteAltStart = function (posx, posy, text) {
        var Div = createAltStartDiv("palettealtstart", posx, posy, "AltStart", "PaletteItem");
        Div.appendTo("#palette").draggable({ helper: 'clone' });;
    }


    this.AddTimerStart = function (posx, posy, text) {
        LoadTimerStart(null, posx, posy, text);
    }

    LoadTimerStart = function (id, posx, posy, text) {
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, id, text, posx, posy, altstartwidth, altstartheight, 'picture;editable=0;fillColor=' + timerstartcolor + ';image=/Content/Images/protocol_start_timed_small.png'); //vagy 'doubleEllipse'
            v1.setConnectable(false);
            v1.scale = false;

            var port = graph.insertVertex(v1, null, sourceNode, 0.5, 1.0, 16, 16, 'port;image=/Content/dot.gif', true);
            port.geometry.offset = new mxPoint(-6, -6);

            v1.type = "TimerStart";
        }
        finally {
            graph.getModel().endUpdate();
        }
    }

    createTimerStartDiv = function (id, posx, posy, text, category) {
        var Div = $('<div>', {
            id: String(id),
            class: 'window jtk-node',
            text: text,
            category: category,
        })
            .css(
            {
                top: posy,
                left: posx,
                'min-height': timerstartheight + 'px',
                'min-width': timerstartwidth + 'px',
                width: timerstartheight + 'px',
                height: timerstartwidth + 'px',
                //width: 'auto',
                //height: 'auto',
                //border: 'solid 0px',
                background: timerstartcolor,
                'border-color': 'black',
                color: fontcolor,
                'line-height': (timerstartheight-11) + 'px',
                'border-radius': timerstartheight + 'px',
                'background-image': 'url("/Content/Images/protocol_start_timed_small.png")',
                'background-size': 'cover',
                'background-repeat': 'no-repeat',
                'background-position': 'center center',
            });
        return Div;
    }

    this.AddPaletteTimerStart = function (posx, posy, text) {
        var Div = createTimerStartDiv("palettetimerstart", posx, posy, "TimerStart", "PaletteItem");
        Div.appendTo("#palette").draggable({ helper: 'clone' });;
    }

    this.AddStop = function (posx, posy, text) {
        LoadStop(null, posx, posy, text);
    }

    LoadStop = function (id, posx, posy, text) {
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, id, text, posx, posy, stopwidth, stopheight, "picture;editable=0;"/*shape=ellipse;*/ + "fillColor=" + stopcolor + ';image=/Content/Images/protocol_end_small.png');
            v1.setConnectable(false);/*'picture;editable=0;fillColor=' + altstartcolor + ';image=/Content/Images/protocol_start_alternative_small.png'*/

            var port = graph.insertVertex(v1, null, targetNode, 0.5, 0, 16, 16, 'port;image=/Content/dot.gif', true);
            port.geometry.offset = new mxPoint(-6, -8);
            v1.type = "Stop";
        }
        finally {
            // Updates the display
            graph.getModel().endUpdate();
        }
    }

    createStopDiv = function (id, posx, posy, text, category) {
        var Div = $('<div>', {
            id: String(id),
            class: 'window jtk-node',
            text: text,
            category: category,
        })
            .css(
            {
                top: posy,
                left: posx,
                'min-height': stopheight + 'px',
                'min-width': stopwidth + 'px',
                width: stopheight + 'px',
                height: stopwidth + 'px',
                //width: 'auto',
                //height: 'auto',
                //border: 'solid 0px',
                background: stopcolor,
                raius: '2',
                'border-color': 'black',
                color: fontcolor,
                'line-height': (stopheight-11) + 'px',
                'border-radius': stopheight + 'px',
                'background-image': 'url("/Content/Images/protocol_end_small.png")',
                'background-size': 'cover',
                'background-repeat': 'no-repeat',
                'background-position': 'center center',
            });
        return Div;
    }

    this.AddPaletteStop = function (posx, posy, text) {
        var Div = createStopDiv("palettestop", posx, posy, "Stop", "PaletteItem");
        Div.appendTo("#palette").draggable({ helper: 'clone' });;
    }

    this.AddDec = function (posx, posy, text) {
        LoadDec(null, posx, posy, text);
    }

    LoadDec = function (id, posx, posy, text) {
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, id, text, posx, posy, (text.length * font_size) + 40, decheight, /*shape=ellipse;*//*"picture;fillColor=" + deccolor + ';image=/Content/Images/decision_small.png'*/"shape=rectangle;fillColor=" + deccolor);
            v1.setConnectable(false);

            var icon = graph.insertVertex(v1, null, null, 0, 0.13, 50, 50, 'picture;image=/Content/Images/decision_small.png', true);
            icon.geometry.offset = new mxPoint(-50, -6);
            icon.setConnectable(false);

            var label = graph.insertVertex(v1, null, "Decision", 0.5, 0.13, 46, 10, 'fillColor=' + deccolor, true);
            label.geometry.offset = new mxPoint(-23, 3);
            label.setConnectable(false);

            var rightlabel = graph.insertVertex(v1, null, 'True', 1.1, 0.3, 0, 0, null, true);
            rightlabel.setConnectable(false);
            var leftlabel = graph.insertVertex(v1, null, 'False', 0, 0.3, 0, 0, null, true);
            leftlabel.setConnectable(false);

            var port = graph.insertVertex(v1, null, targetNode, 0.5, 0, 16, 16, 'port;image=/Content/dot.gif', true);
            var port2 = graph.insertVertex(v1, null, sourceNode, 0, 0.5, 16, 16, 'port;image=/Content/dot.gif', true);
            var port3 = graph.insertVertex(v1, null, sourceNode, 1, 0.5, 16, 16, 'port;image=/Content/dot.gif', true);
            port.geometry.offset = new mxPoint(-8, -8);
            port2.geometry.offset = new mxPoint(-8, -8);
            port3.geometry.offset = new mxPoint(-8, -8);

            rightlabel.geometry.offset = new mxPoint(-8, -8);
            leftlabel.geometry.offset = new mxPoint(-8, -8);

            v1.type = "Dec";
        }
        finally {
            // Updates the display
            graph.getModel().endUpdate();
        }
    }

    createDecDiv = function (id, posx, posy, text, category) {
        if (text == null) {
            text = prompt("Decision name: ", "Some Decision");
        }
        if (text != null) {
            var Div = $('<div>',
                {
                    id: String(id),
                    class: 'window jtk-node',
                    text: text,
                    category: category
                })
                .css(
                {
                    top: posy,
                    left: posx,
                    'min-height': decheight + 'px',
                    'min-width': decwidth + 'px',
                    width: 'auto',
                    height: 'auto',
                    //border: 'solid 1px',
                    background: deccolor,
                    //'background-image': 'url("/Content/Images/decision_small.png")',
                    'border-color': 'black',
                    color: fontcolor,
                    //'line-height': (decheight / 2) + 'px',
                    //'border-radius': decheight + 'px'
                }
                );
            return Div;
        }
    }

    this.AddPaletteDec = function (posx, posy, text) {
        var Div = createDecDiv("palettedecision", posx, posy, "Decision", "PaletteItem");
        Div.appendTo("#palette").draggable({ helper: 'clone' });;
    }

    this.AddAct = function (posx, posy, text) {
        LoadAct(null, posx, posy, text);
    }

    LoadAct = function (id, posx, posy, text) {
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, id, text, posx, posy, (text.length * font_size) + 40, actheight, "shape=rectangle;fillColor=" + actcolor);
            v1.setConnectable(false);

            var icon = graph.insertVertex(v1, null, null, 0, 0.13, 50, 50, 'picture;image=/Content/Images/command_small.png', true);
            icon.geometry.offset = new mxPoint(-50, -6);
            icon.setConnectable(false);

            var label = graph.insertVertex(v1, null, "Action", 0.5, 0.13, 30, 10, 'fillColor=' + actcolor, true);
            label.geometry.offset = new mxPoint(-15, 3);
            label.setConnectable(false);

            var port = graph.insertVertex(v1, null, targetNode, 0.5, 0, 16, 16, 'port;image=/Content/dot.gif', true);
            var port2 = graph.insertVertex(v1, null, sourceNode, 0.5, 1, 16, 16, 'port;image=/Content/dot.gif', true);
            port.geometry.offset = new mxPoint(-8, -8);
            port2.geometry.offset = new mxPoint(-8, -8);

            v1.type = "Act";
        }
        finally {
            // Updates the display
            graph.getModel().endUpdate();
        }
    }

    createActDiv = function (id, posx, posy, text, category) {
        if (text == null) {
            text = prompt("Action name: ", "Some Action");
        }
        if (text != null) {
            var Div = $('<div>', {
                id: String(id),
                class: 'window jtk-node',
                text: text,
                category: category
            })
                .css(
                {
                    top: posy,
                    left: posx,
                    'min-height': actheight + 'px',
                    'min-width': actwidth + 'px',
                    width: 'auto',
                    height: 'auto',
                    //border: 'solid 0px',
                    'border-color': 'black',
                    color: fontcolor,
                    'line-height': (actheight-11) + 'px',
                    background: actcolor
                });
            return Div;
        }
    }

    this.AddPaletteAct = function (posx, posy, text) {
        var Div = createActDiv("paletteaction", posx, posy, "Action", "PaletteItem");
        Div.appendTo("#palette").draggable({ helper: 'clone' });
    }

    this.AddGate = function (posx, posy, text) {
        LoadGate(null, posx, posy, text);
    }

    LoadGate = function (id, posx, posy, text) {
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, id, text, posx, posy, (text.length * font_size) + 40, gateheight, "shape=rectangle;fillColor=" + gatecolor); //shape=rhombus
            v1.setConnectable(false);

            var icon = graph.insertVertex(v1, null, null, 0, 0.13, 50, 50, 'picture;image=/Content/Images/gateway_small.png', true);
            icon.geometry.offset = new mxPoint(-50, -6);
            icon.setConnectable(false);

            var label = graph.insertVertex(v1, null, "Gateway", 0.5, 0.13, 48, 10, 'fillColor=' + gatecolor, true);
            label.geometry.offset = new mxPoint(-24, 3);
            label.setConnectable(false);

            var port = graph.insertVertex(v1, null, targetNode, 0.5, 0, 16, 16, 'port;image=/Content/dot.gif', true);
            var port2 = graph.insertVertex(v1, null, sourceNode, 0, 0.5, 16, 16, 'port;image=/Content/dot.gif', true);
            var port3 = graph.insertVertex(v1, null, sourceNode, 1, 0.5, 16, 16, 'port;image=/Content/dot.gif', true);
            port.geometry.offset = new mxPoint(-8, -8);
            port2.geometry.offset = new mxPoint(-8, -8);
            port3.geometry.offset = new mxPoint(-8, -8);

            v1.type = "Gate";
        }
        finally {
            // Updates the display
            graph.getModel().endUpdate();
        }
    }

    createGateDiv = function (id, posx, posy, text, category) {
        if (text == null) {
            text = prompt("Gateway name: ", "Some Gateway");
        }
        if (text != null) {
            var Div = $('<div>',
                {
                    id: String(id),
                    class: 'window jtk-node',
                    text: text,
                    category: category
                })
                .css(
                {
                    top: posy,
                    left: posx,
                    'min-height': gateheight + 'px',
                    'min-width': gatewidth + 'px',
                    width: 'auto',
                    height: 'auto',
                    //border: 'solid 0px',
                    background: gatecolor,
                    'border-color': 'black',
                    color: fontcolor,
                    'line-height': (gateheight-11) + 'px',
                    //'transform': 'rotate(45deg)'
                }
                );
            return Div;
        }
    }

    this.AddPaletteGate = function (posx, posy, text) {
        var Div = createGateDiv("palettegateway", posx, posy, "GateWay", "PaletteItem");
        Div.appendTo("#palette").draggable({ helper: 'clone' });
        //document.getElementById("palettegateway").innerHTML = "<p style='transform: rotate(-45deg)'>" + "Gateway" + "</p>";
    }

    this.Save = function () {
        var encoder = new mxCodec();
        nodeData = [];

        nodes = graph.getChildVertices(graph.getDefaultParent())


        for (var i = 0; i < nodes.length; i++) {
            item = nodes[i];
            nodeData[i] = { id: String(item.id), type: item.type, text: item.value, position: { posX: item.geometry.x, posY: item.geometry.y } };
        }

        linkData = [];

        edges = graph.getChildEdges(graph.getDefaultParent());

        for (var i = 0; i < edges.length; i++) {
            link = edges[i];
            linkData[i] = { sourceId: String(link.source.parent.id), targetId: String(link.target.parent.id), anchors: [[link.source.geometry.x, link.source.geometry.y], [link.target.geometry.x, link.target.geometry.y]] };
        }

        var parser = new JSONParseChart();

        parser.Encode(nodeData, linkData);

    }

    this.Load = function () {
        this.Clear();
        parser.Decode();
    }

    jsonToCanvas = function (load_array) {
        var length = load_array.loadblocks.length;
        for (var i = 0; i < length; i++) {
            switch (load_array.loadblocks[i].type) {
                case "Dec":
                    LoadDec(load_array.loadblocks[i].id, load_array.loadblocks[i].position.posX, load_array.loadblocks[i].position.posY, load_array.loadblocks[i].text);
                    break;
                case "Start":
                    LoadStart(load_array.loadblocks[i].id, load_array.loadblocks[i].position.posX, load_array.loadblocks[i].position.posY, "Start");
                    break;
                case "AltStart":
                    LoadAltStart(load_array.loadblocks[i].id, load_array.loadblocks[i].position.posX, load_array.loadblocks[i].position.posY, "AltStart");
                    break;
                case "TimerStart":
                    LoadTimerStart(load_array.loadblocks[i].id, load_array.loadblocks[i].position.posX, load_array.loadblocks[i].position.posY, "TimerStart");
                    break;
                case "Act":
                    LoadAct(load_array.loadblocks[i].id, load_array.loadblocks[i].position.posX, load_array.loadblocks[i].position.posY, load_array.loadblocks[i].text);
                    break;
                case "Gate":
                    LoadGate(load_array.loadblocks[i].id, load_array.loadblocks[i].position.posX, load_array.loadblocks[i].position.posY, load_array.loadblocks[i].text);
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