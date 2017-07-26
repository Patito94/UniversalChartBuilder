var LibraryStrategy = function () {
    this.library = "";
};

LibraryStrategy.prototype = {
    setStrategy: function (library) {
        this.library = library;
    },
    Create: function () {
        return this.library.Create();
    },
    AddStart: function (posx, posy, text) { //param: position {posx,posy}, text
        return this.library.AddStart(posx, posy, text);
    },
    AddStop: function (posx, posy, text) {
        return this.library.AddStop(posx, posy, text);
    },
    AddDec: function (posx, posy, text) {
        return this.library.AddDec(posx, posy, text);
    },
    AddAct: function (posx, posy, text) {
        return this.library.AddAct(posx, posy, text);
    },

    Save: function () {
        return this.library.Save();
    },
    Load: function () {
        return this.library.Load();
    },
    Clear: function () {
        return this.library.Clear();
    },

    EditNode: function () {
        return this.library.EditNode();
    },
    DeleteNode: function () {
        return this.library.DeleteNode();
    },
    jsonToCanvas: function () {
        return this.library.jsonToCanvas();
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
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    function openModal() {
        modal.style.display = "block";
    }
    this.EditNode = function () {
        modal.style.display = "none";
        var text = prompt("Action name: ", document.getElementById(thisid).innerHTML);
        document.getElementById(thisid).innerHTML = text;
    }

    this.DeleteNode = function () {
        modal.style.display = "none";

        jsPlumb.remove(thisid);
        for (i = 0; i < block_array.blocks.length; i++) {
            if (thisid == block_array.blocks[i].id) {
                block_array.blocks.splice(i, 1);
            }
        }
    }
    $(document).on("dblclick", "div[name='flowchartWindow']", function () {
        thisid = this.id;
        openModal();
    });
    //End Modalthings

    this.Create = function () {
        document.getElementById("buttons").style.visibility = "visible";
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

    this.AddDec = function (posx, posy, text) {
        if (text == null) {
            text = prompt("Decision name: ", "Some Decision");
            if (text != null) {
                var Div = $('<div>',
            {
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
            }
            );
                Div.appendTo("#canvas");
                document.getElementById("flowchartWindow" + x).innerHTML = text;
                jsPlumb.draggable($(Div));
                $(Div).addClass('window');
                jsPlumb.addEndpoint($(Div), { anchor: "TopCenter" }, { isSource: false, isTarget: true, maxConnections: -1 });
                jsPlumb.addEndpoint($(Div), { anchor: "Right" }, { isSource: true, isTarget: false });
                jsPlumb.addEndpoint($(Div), { anchor: "Left" }, { isSource: true, isTarget: false });
                block_array.blocks.push({
                    "name": text,
                    "id": "flowchartWindow" + x,
                    "type": "dec",
                    "position": {
                        "posX": posx,
                        "posY": posy
                    }
                });
                x++;
            }
        }
        else if (text != null) {
            var Div = $('<div>',
        {
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
        }
        );
            Div.appendTo("#canvas");
            document.getElementById("flowchartWindow" + x).innerHTML = text;
            jsPlumb.draggable($(Div));
            $(Div).addClass('window');
            jsPlumb.addEndpoint($(Div), { anchor: "TopCenter" }, { isSource: false, isTarget: true, maxConnections: -1 });
            jsPlumb.addEndpoint($(Div), { anchor: "Right" }, { isSource: true, isTarget: false });
            jsPlumb.addEndpoint($(Div), { anchor: "Left" }, { isSource: true, isTarget: false });
            block_array.blocks.push({
                "name": text,
                "id": "flowchartWindow" + x,
                "type": "dec",
                "position": {
                    "posX": posx,
                    "posY": posy
                }
            });
            x++;
        }
    }

    this.AddAct = function (posx, posy, text) {
        if (text == null) {
            text = prompt("Action name: ", "Some Action");
            if (text != null) {
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
                jsPlumb.addEndpoint($(Div), { anchor: "BottomCenter" }, { isSource: true, isTarget: false });
                block_array.blocks.push({
                    "name": text,
                    "id": "flowchartWindow" + x,
                    "type": "div",
                    "position": {
                        "posX": posx,
                        "posY": posy
                    }
                });
                x++;
            }
        }
        else if (text != null) {
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
            jsPlumb.addEndpoint($(Div), { anchor: "BottomCenter" }, { isSource: true, isTarget: false });
            block_array.blocks.push({
                "name": text,
                "id": "flowchartWindow" + x,
                "type": "div",
                "position": {
                    "posX": posx,
                    "posY": posy
                }
            });
            x++;
        }
    }

    this.Save = function () {
        for (i = 0; i < block_array.blocks.length; i++) {
            block_array.blocks[i].position.posX = document.getElementById(block_array.blocks[i].id).offsetLeft;
            block_array.blocks[i].position.posY = document.getElementById(block_array.blocks[i].id).offsetTop;
        }
        $.each(jsPlumb.getConnections(), function (idx, connection) {
            connections_array.connections.push({
                connectionId: connection.id,
                pageSourceId: connection.sourceId,
                pageTargetId: connection.targetId,
                anchors: $.map(connection.endpoints, function (endpoint) {

                    return [[endpoint.anchor.x,
                    endpoint.anchor.y,
                    endpoint.anchor.orientation[0],
                    endpoint.anchor.orientation[1],
                    endpoint.anchor.offsets[0],
                    endpoint.anchor.offsets[1]]];

                })
            });
        });
        var JSONObj = "";
        JSONObj += "{\"loadblocks\":";
        JSONObj += JSON.stringify(block_array.blocks);
        JSONObj += ",\"loadconnections\":";
        JSONObj += JSON.stringify(connections_array.connections);
        JSONObj += "}";

        $.ajax({
            type: "POST",
            url: "/Home/SaveChart",
            data: { path: "Charts/jsplumChart.txt", chartJson: JSONObj }
        });
    }

    this.Load = function () {
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
        this.Clear();
        var length = load_array.loadblocks.length;
        for (i = 0; i < length; i++) {
            switch (load_array.loadblocks[i].type) {
                case "dec":
                    this.AddDec(load_array.loadblocks[i].position.posX, load_array.loadblocks[i].position.posY, load_array.loadblocks[i].name);
                    break;
                case "start":
                    this.AddStart(load_array.loadblocks[i].position.posX, load_array.loadblocks[i].position.posY, "Start");
                    break;
                case "div":
                    this.AddAct(load_array.loadblocks[i].position.posX, load_array.loadblocks[i].position.posY, load_array.loadblocks[i].name);
                    break;
                case "stop":
                    this.AddStop(load_array.loadblocks[i].position.posX, load_array.loadblocks[i].position.posY, "Stop");
                    break;
            }
        }
        $.each(load_array.loadconnections, function (index, elem) {
            var connection1 = jsPlumb.connect({
                source: elem.pageSourceId,
                target: elem.pageTargetId,
                anchors: elem.anchors
            });
        });
    }

    Clear = function () {
        var i = block_array.blocks.length - 1;
        while (i >= 0) {
            jsPlumb.remove(block_array.blocks[i].id);
            i--;
        }
        block_array.blocks.splice(0, block_array.blocks.length);
        connections_array.connections.splice(0, connections_array.connections.length);
        document.getElementById("startbtn").removeAttribute("disabled");
        document.getElementById("stopbtn").removeAttribute("disabled");
        x = 0;
    }

}
var GoJsStrategy = function () {
    var JSONObj;
    this.Create = function () {
        var $ = go.GraphObject.make;  // for conciseness in defining templates
        document.getElementById("palette").style.visibility = "visible";
        myDiagram =
          $(go.Diagram, "canvas",  // must name or refer to the DIV HTML element
            {
                initialContentAlignment: go.Spot.Center,
                allowDrop: true,  // must be true to accept drops from the Palette
                "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
                "LinkRelinked": showLinkLabel,
                "animationManager.duration": 800, // slightly longer than default (600ms) animation
                "undoManager.isEnabled": true  // enable undo & redo
            });

        // when the document is modified, add a "*" to the title and enable the "Save" button
        myDiagram.addDiagramListener("Modified", function (e) {
            var button = document.getElementById("SaveButton");
            if (button) button.disabled = !myDiagram.isModified;
            var idx = document.title.indexOf("*");
            if (myDiagram.isModified) {
                if (idx < 0) document.title += "*";
            } else {
                if (idx >= 0) document.title = document.title.substr(0, idx);
            }
        });


        // helper definitions for node templates

        function nodeStyle() {
            return [
              // The Node.location comes from the "loc" property of the node data,
              // converted by the Point.parse static method.
              // If the Node.location is changed, it updates the "loc" property of the node data,
              // converting back using the Point.stringify static method.
              new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
              {
                  // the Node.location is at the center of each node
                  locationSpot: go.Spot.Center,
                  //isShadowed: true,
                  //shadowColor: "#888",
                  // handle mouse enter/leave events to show/hide the ports
                  mouseEnter: function (e, obj) { showPorts(obj.part, true); },
                  mouseLeave: function (e, obj) { showPorts(obj.part, false); }
              }
            ];
        }

        // Define a function for creating a "port" that is normally transparent.
        // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
        // and where the port is positioned on the node, and the boolean "output" and "input" arguments
        // control whether the user can draw links from or to the port.
        function makePort(name, spot, output, input) {
            // the port is basically just a small circle that has a white stroke when it is made visible
            return $(go.Shape, "Circle",
                     {
                         fill: "transparent",
                         stroke: null,  // this is changed to "white" in the showPorts function
                         desiredSize: new go.Size(8, 8),
                         alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                         portId: name,  // declare this object to be a "port"
                         fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                         fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                         cursor: "pointer"  // show a different cursor to indicate potential link point
                     });
        }

        // define the Node templates for regular nodes

        var lightText = 'whitesmoke';

        myDiagram.nodeTemplateMap.add("",  // the default category
          $(go.Node, "Spot", nodeStyle(),
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(go.Panel, "Auto",
              $(go.Shape, "Rectangle",
                { fill: "#00A9C9", stroke: null },
                new go.Binding("figure", "figure")),
              $(go.TextBlock,
                {
                    font: "bold 11pt Helvetica, Arial, sans-serif",
                    stroke: lightText,
                    margin: 8,
                    maxSize: new go.Size(160, NaN),
                    wrap: go.TextBlock.WrapFit,
                    editable: true
                },
                new go.Binding("text").makeTwoWay())
            ),
            // four named ports, one on each side:
            makePort("T", go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, false)
          ));



        myDiagram.nodeTemplateMap.add("Start",

          $(go.Node, "Spot", nodeStyle(),
            $(go.Panel, "Auto",
              $(go.Shape, "Circle",
                { minSize: new go.Size(40, 40), fill: "#79C900", stroke: null }),
              $(go.TextBlock, "Start",
                { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
                new go.Binding("text"))
            ),
            // three named ports, one on each side except the top, all output only:
            makePort("B", go.Spot.Bottom, true, false)
          ));

        myDiagram.nodeTemplateMap.add("Action",
          $(go.Node, "Spot", nodeStyle(),
            $(go.Panel, "Auto",
              $(go.Shape, "Rectangle",{ fill: "#00A9C9", stroke: null }),
              $(go.TextBlock, "Action",
                {
                    font: "bold 11pt Helvetica, Arial, sans-serif",
                    stroke: lightText,
                    margin: 8,
                    maxSize: new go.Size(160, NaN),
                    wrap: go.TextBlock.WrapFit,
                    editable: true
                },
                new go.Binding("text"))
            ),
            makePort("T", go.Spot.Top, false, true),
            makePort("B", go.Spot.Bottom, true, false)
          ));

        myDiagram.nodeTemplateMap.add("Decision",
          $(go.Node, "Spot", nodeStyle(),
            $(go.Panel, "Auto",
              $(go.Shape, "Diamond",
                { fill: "#00A9C9", stroke: null }),
              $(go.TextBlock, "Decision",
                {
                    font: "bold 11pt Helvetica, Arial, sans-serif",
                    stroke: lightText,
                    margin: 8,
                    maxSize: new go.Size(160, NaN),
                    wrap: go.TextBlock.WrapFit,
                    editable: true
                },
                new go.Binding("text"))
            ),
            makePort("T", go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, true, false),
            makePort("R", go.Spot.Right, true, false),
          ));

        myDiagram.nodeTemplateMap.add("End",
          $(go.Node, "Spot", nodeStyle(),
            $(go.Panel, "Auto",
              $(go.Shape, "Circle",
                { minSize: new go.Size(40, 40), fill: "#DC3C00", stroke: null }),
              $(go.TextBlock, "End",
                { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
                new go.Binding("text"))
            ),
            // three named ports, one on each side except the bottom, all input only:
            makePort("T", go.Spot.Top, false, true)
          ));

        //myDiagram.nodeTemplateMap.add("Comment",
        //  $(go.Node, "Auto", nodeStyle(),
        //    $(go.Shape, "File",
        //      { fill: "#EFFAB4", stroke: null }),
        //    $(go.TextBlock,
        //      {
        //          margin: 5,
        //          maxSize: new go.Size(200, NaN),
        //          wrap: go.TextBlock.WrapFit,
        //          textAlign: "center",
        //          editable: true,
        //          font: "bold 12pt Helvetica, Arial, sans-serif",
        //          stroke: '#454545'
        //      },
        //      new go.Binding("text").makeTwoWay())
        //    // no ports, because no links are allowed to connect with a comment
        //  ));

            //A port ne ugráljon
            myDiagram.model =  $(go.GraphLinksModel,
          { linkFromPortIdProperty: "fromPort",  // required information:
          linkToPortIdProperty: "toPort"});

        // replace the default Link template in the linkTemplateMap
        myDiagram.linkTemplate =
           $(go.Link,
            { routing: go.Link.Orthogonal, corner: 3 },
            $(go.Shape),
            $(go.Shape, { toArrow: "Standard" })

          //$(go.Link,  // the whole link panel
          //  {
          //      routing: go.Link.AvoidsNodes,
          //      curve: go.Link.JumpOver,
          //      corner: 5, toShortLength: 4,
          //      relinkableFrom: true,
          //      relinkableTo: true,
          //      reshapable: true,
          //      resegmentable: true,
          //      // mouse-overs subtly highlight links:
          //      mouseEnter: function (e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
          //      mouseLeave: function (e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
          //  },
          //  new go.Binding("points").makeTwoWay(),
          //  $(go.Shape,  // the highlight shape, normally transparent
          //    { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
          //  $(go.Shape,  // the link path shape
          //    { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
          //  $(go.Shape,  // the arrowhead
          //    { toArrow: "standard", stroke: null, fill: "gray" }),
          //  $(go.Panel, "Auto",  // the link label, normally not visible
          //    { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
          //    new go.Binding("visible", "visible").makeTwoWay(),
          //    $(go.Shape, "RoundedRectangle",  // the label shape
          //      { fill: "#F8F8F8", stroke: null }),
          //    $(go.TextBlock, "Yes",  // the label
          //      {
          //          textAlign: "center",
          //          font: "10pt helvetica, arial, sans-serif",
          //          stroke: "#333333",
          //          editable: true
          //      },
          //      new go.Binding("text").makeTwoWay())
          //  )
          );

        // Make link labels visible if coming out of a "conditional" node.
        // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
        function showLinkLabel(e) {
            var label = e.subject.findObject("LABEL");
            if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
        }

        // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
        myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
        myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

        // initialize the Palette that is on the left side of the page
        myPalette =
          $(go.Palette, "palette",  // must name or refer to the DIV HTML element
            {
                "animationManager.duration": 800, // slightly longer than default (600ms) animation
                nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
                model: new go.GraphLinksModel([  // specify the contents of the Palette
                  { category: "Start", text: "Start" },
                  { category: "Action", text: "Step" },
                  { category: "Decision", text: "???", figure: "Diamond" },
                  { category: "End", text: "End" }
                  //{ category: "Comment", text: "Comment" }
                ])
            });

        // The following code overrides GoJS focus to stop the browser from scrolling
        // the page when either the Diagram or Palette are clicked or dragged onto.

        function customFocus() {
            var x = window.scrollX || window.pageXOffset;
            var y = window.scrollY || window.pageYOffset;
            go.Diagram.prototype.doFocus.call(this);
            window.scrollTo(x, y);
        }

        myDiagram.doFocus = customFocus;
        myPalette.doFocus = customFocus;
    },

    showPorts = function (node, show) {
        var diagram = node.diagram;
        if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
        node.ports.each(function (port) {
            port.stroke = (show ? "white" : null);
        });
    },

    this.AddStart = function (posx, posy, text) { }

    this.AddStop = function (posx, posy, text) { }

    this.AddDec = function (posx, posy, text) { }

    this.AddAct = function (posx, posy, text) { }

    this.Save = function () {
        //JSONObj = myDiagram.model.toJson();
        //$.ajax({
        //    type: "POST",
        //    url: "/Home/SaveChart",
        //    data: { path: "Charts/gojsChart.txt" , chartJson: JSONObj }
        //});
        //myDiagram.isModified = false;

        //console.log(myDiagram.model.linkDataArray);


        //myDiagram.model.nodeDataArray = [
        //{ key: "0", category: "", text: "kiskutya" },
        //{ key: "1", category: "Start", loc: "100 100" }

        //];

        //nodeData = {};

        //for (var i = 0; i < myDiagram.model.nodeDataArray.length; i++) {
        //    item = myDiagram.model.nodeDataArray[i];
        //    nodeData[i] = { id: item.key, category: item.category, x: +item.loc.split(" ")[0], y: item.loc.split(" ")[1] };
        //}

        //linkData = {};

        for (var i = 0; i < myDiagram.model.linkDataArray.length; i++) {
            link = myDiagram.model.linkDataArray[i];
            //linkData[i] = {from: link.from, to: link.to};
            console.log(link.fromSpot);
        }



        //var JSONObj = "";
        //JSONObj += "{\"blocks\":";
        //JSONObj += JSON.stringify(nodeData);
        //JSONObj += ",\"connections\":";
        //JSONObj += JSON.stringify(linkData);
        //JSONObj += "}";

        console.log(myDiagram.model.linkDataArray);
    }

    this.Load = function () {
        $.ajax({
            dataType: "json",
            url: "/Home/GetChart",
            data: { path: "Charts/gojsChart.txt" },
            success: function (json) {
                JSONObj = JSON.parse(json);
                myDiagram.model = go.Model.fromJson(JSONObj);
            }
        });

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
        document.getElementById("buttons").style.visibility = "visible";
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

    this.AddStop = function (posx, posy, text) {
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, null, text, posx, posy, 100, 50);
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
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, null, text, posx, posy, 100, 50);
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
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, null, text, posx, posy, 100, 50);
            v1.setConnectable(false);
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
        //var node = encoder.encode(graph.getModel());
        //var xmlString = mxUtils.getXml(node);
        //$.ajax({
        //    type: "POST",
        //    url: "/Home/SaveChart",
        //    data: { path: "Charts/mxgChart.txt", chartJson: xmlString },
        //});

        console.log(encoder.encode(graph.getModel()));

        //console.log(graph.getModel().getCell(0));
        //console.log(graph.getModel().getCell(2));

        nodeData = [];

        nodes = graph.getChildVertices(graph.getDefaultParent())

        for (var i = 0; i < nodes.length; i++) {
            item = graph.getModel().getCell(i);
            nodeData[i] = { id: item.id, category: item.value };
        }

        //linkData = [];

        //edges = graph.getChildEdges(graph.getDefaultParent());
        //for (var i = 0; i < edges.length; i++) {
        //    item = graph.getModel().getCell(nodes[i]);
        //    if (item.edge != null) {
        //        //console.log(item);
        //    }
        //}

        console.log(graph.getChildVertices(graph.getDefaultParent()));

        console.log(graph.getChildEdges(graph.getDefaultParent()));
        


        var JSONObj = "";
        JSONObj += "{\"blocks\":";
        JSONObj += JSON.stringify(nodeData);
        JSONObj += "}";
        console.log(JSONObj);

        //for (var i = 0; i < nodes.length; i++) {
        //    console.log(graph.getModel().getCell(nodes[i]).geometry.x);
        //}



    }

    this.Load = function () {
        graph.setChildEdges(null);
    }

    this.Clear = function () {
        graph.removeCells(graph.getChildVertices(graph.getDefaultParent()))
        nodes = [];
    }
}