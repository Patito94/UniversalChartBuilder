var LibraryStrategy = function () {
    this.library = "";
};

LibraryStrategy.prototype = {
    setStrategy: function (library) {
        this.library = library;
    },
    AddStart: function (posx, posy, text) { //param: position {posx,posy}, text
        return this.library.AddStart(posx, posy, text);
    },
    AddStop: function (posx, posy, text) {
        return this.library.AddStop(posx, posy, text);
    },
    Create: function () {
        return this.library.Create();
    }
};

var JSPlumbStrategy = function () {
    var thisid;
    var block_array = {
        blocks: []
    }
    jsPlumb.Defaults.Connector = ["Flowchart", { stub: [50, 50], midpoint: 0.5 }];
    var connections_array = {
        connections: []
    }
    var load_array = {
        loadblocks: [],
        loadconnections: []
    }
    var x = 0;
    //Modalthings
    var modal = document.getElementById('myModal');
    // Get the button that opens the modal
    var btn = document.getElementById("modalbtn");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    this.Create = function () {

    }

    this.AddStart = function (posx, posy, text) {
        var Div = $('<div>', {
            id: "flowchartWindow" + x,
            class: 'window jtk-node',
            name: "flowchartWindow"
        })
.css(
    {
        top: posy,
        left: posx,
        height: '100px',
        width: '100px',
        border: 'solid 1px'
    });
        Div.appendTo("#canvas");
        document.getElementById("flowchartWindow" + x).innerHTML = text;
        jsPlumb.draggable($(Div));
        $(Div).addClass('window');
        jsPlumb.addEndpoint($(Div), { anchor: "BottomCenter" }, { isSource: true, isTarget: false });
        block_array.blocks.push({
            "name": text,
            "id": "flowchartWindow" + x,
            "type": "start",
            "position": {
                "posX": posx,
                "posY": posy
            }
        });
        x++;
        document.getElementById("startbtn").disabled = true;
    }

    this.AddStop = function (posx, posy, text) {

        var Div = $('<div>', {
            id: "flowchartWindow" + x,
            class: 'window jtk-node',
            name: "flowchartWindow"
        })
    .css(
        {
            top: posy,
            left: posx,
            height: '100px',
            width: '100px',
            border: 'solid 1px'
        });
        Div.appendTo("#canvas");
        document.getElementById("flowchartWindow" + x).innerHTML = text;
        jsPlumb.draggable($(Div));
        $(Div).addClass('window');
        jsPlumb.addEndpoint($(Div), { anchor: "TopCenter" }, { isSource: false, isTarget: true, maxConnections: -1 });
        block_array.blocks.push({
            "name": text,
            "id": "flowchartWindow" + x,
            "type": "stop",
            "position": {
                "posX": posx,
                "posY": posy
            }
        });
        x++;
        document.getElementById("stopbtn").disabled = true;
    }
}

var GoJsStrategy = function () {
    this.AddStart = function (posx, posy, text) {
        console.log("GoJS");
    }

}
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

    this.Create = function () {
        var container = document.getElementById('canvas');
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error('Browser is not supported!', 200, false);
        }
        else {
            graph = new mxGraph(container);
            graph.setConnectable(true);
            graph.setPortsEnabled(false);
            style = new Object();
            style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
            graph.getStylesheet().putCellStyle('port', style);
            graph.getStylesheet().getDefaultEdgeStyle()['edgeStyle'] = 'orthogonalEdgeStyle';

            new mxRubberband(graph);

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
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, null, text, posx, posy, 100, 50);
            v1.setConnectable(false);
            var port = graph.insertVertex(v1, null, '', 0.5, 1.0, 16, 16, 'port;image=/Content/dot.gif', true);
            port.geometry.offset = new mxPoint(-6, -6);
        }
        finally {
            graph.getModel().endUpdate();
        }
    }
}