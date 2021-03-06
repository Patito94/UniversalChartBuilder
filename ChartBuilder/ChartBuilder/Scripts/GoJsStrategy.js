﻿var GoJsStrategy = function () {

    var parser = new JSONParseChart();

    this.Create = function () {
        var $ = go.GraphObject.make;  // for conciseness in defining templates
        //document.getElementById("palette").style.visibility = "visible";
        //Gombok látszódása
        //document.getElementById("buttons").style.visibility = "visible";

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
            //var idx = document.title.indexOf("*");
            //if (myDiagram.isModified) {
            //    if (idx < 0) document.title += "*";
            //} else {
            //    if (idx >= 0) document.title = document.title.substr(0, idx);
            //}
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

        //myDiagram.nodeTemplateMap.add("",  // the default category
        //    $(go.Node, "Spot", nodeStyle(),
        //        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        //        $(go.Panel, "Auto",
        //            $(go.Shape, "Rectangle",
        //                { fill: "#00A9C9", stroke: null },
        //                new go.Binding("figure", "figure")),
        //            $(go.TextBlock,
        //                {
        //                    font: "bold 11pt Helvetica, Arial, sans-serif",
        //                    stroke: fontcolor,
        //                    margin: 8,
        //                    maxSize: new go.Size(160, NaN),
        //                    wrap: go.TextBlock.WrapFit,
        //                    editable: true
        //                },
        //                new go.Binding("text").makeTwoWay())
        //        ),
        //        // four named ports, one on each side:
        //        makePort("T", go.Spot.Top, false, true),
        //        makePort("L", go.Spot.Left, true, true),
        //        makePort("R", go.Spot.Right, true, true),
        //        makePort("B", go.Spot.Bottom, true, false)
        //    ));

        myDiagram.nodeTemplateMap.add("Start",
            $(go.Node, "Spot", nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Circle",
                        { minSize: new go.Size(/*40, 40*/startwidth, startheight), fill: /*"#79C900"*/startcolor, stroke: null }),
                    $(go.TextBlock, "Start",
                        { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: fontcolor },
                        new go.Binding("text"))
                ),
                $(go.Picture, {
                    source: "/Content/Images/protocol_start_small.png", column: 4,
                    width: startwidth, height: startheight, margin: 2
                }),
                // three named ports, one on each side except the top, all output only:
                makePort("B", go.Spot.Bottom, true, false)
            ));

        myDiagram.nodeTemplateMap.add("AltStart",
            $(go.Node, "Spot", nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Circle",
                        { minSize: new go.Size(/*40, 40*/altstartwidth, altstartheight), /*maxSize: new go.Size(40, 40),*/ fill: /*"#79C900"*/altstartcolor, stroke: null }),
                    $(go.Picture, {
                        source: "/Content/Images/protocol_start_alternative_small.png", column: 4,
                        minSize: new go.Size(/*40, 40*/altstartwidth, altstartheight), maxSize: new go.Size(/*40, 40*/altstartwidth, altstartheight), margin: 2
                    }),
                    $(go.TextBlock, "AltStart",
                        { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: fontcolor },
                        new go.Binding("text"))
                ),
                // three named ports, one on each side except the top, all output only:
                makePort("B", go.Spot.Bottom, true, false)
            ));

        myDiagram.nodeTemplateMap.add("TimerStart",
            $(go.Node, "Spot", nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Circle",
                        { minSize: new go.Size(/*40, 40*/timerstartwidth, timerstartheight), /*maxSize: new go.Size(timerstartwidth, timerstartheight),*/ fill: /*"#79C900"*/timerstartcolor, stroke: null }),
                    $(go.Picture, {
                        source: "/Content/Images/protocol_start_timed_small.png", column: 4,
                        minSize: new go.Size(/*40, 40*/timerstartwidth, timerstartheight), maxSize: new go.Size(/*40, 40*/timerstartwidth, timerstartheight), margin: 2
                    }),
                    $(go.TextBlock, "TimerStart",
                        { font: "bold 8pt Helvetica, Arial, sans-serif", stroke: fontcolor },
                        new go.Binding("text"))
                ),
                // three named ports, one on each side except the top, all output only:
                makePort("B", go.Spot.Bottom, true, false)
            ));

        myDiagram.nodeTemplateMap.add("Act",
            $(go.Node, "Spot", nodeStyle(),
                $(go.Panel, "Horizontal",
                    { background: actcolor, minSize: new go.Size(actwidth, actheight) },
                    //$(go.Shape, "Rectangle", { fill: /*"#00A9C9"*/actcolor, stroke: null }),
                    $(go.Picture,
                        { source: "/Content/Images/command_small.png", width: actwidth, height: actheight }),
                    $(go.Panel, "Vertical",
                        { margin: 5 },
                        $(go.TextBlock, "Utasítás",
                            {
                                editable: false
                            }),
                        $(go.TextBlock, "Action",
                            {
                                font: "bold 11pt Helvetica, Arial, sans-serif",
                                stroke: fontcolor,
                                width: 200,
                                //margin: 8,
                                //maxSize: new go.Size(160, NaN),
                                //minSize: new go.Size(/*40, 40*/actwidth, actheight),
                                wrap: go.TextBlock.WrapFit,
                                editable: true
                            },
                            new go.Binding("text").makeTwoWay())
                    )
                ),
                makePort("T", go.Spot.Top, false, true),
                makePort("B", go.Spot.Bottom, true, false)
            ));

        var righttext = "True";
        var lefttext = "False";

        myDiagram.nodeTemplateMap.add("Dec",
            $(go.Node, "Spot", nodeStyle(),
                $(go.Panel, /*"Auto"*//*go.Panel.Spot*/"Horizontal",
                    //$(go.Shape, "Circle",
                    //    { fill: /*"#00A9C9"*/deccolor, stroke: null }),
                    //$(go.Picture, {
                    //    source: "Content/Images/decision_small.png", column: 4,
                    //    width: decwidth+20, height: decheight+20, margin: 2
                    //}),
                    { background: deccolor, minSize: new go.Size(decwidth, decheight) },
                    //$(go.Shape, "Rectangle", { fill: /*"#00A9C9"*/actcolor, stroke: null }),
                    $(go.Picture,
                        { source: "/Content/Images/decision_small.png", width: decwidth, height: decheight }),
                    $(go.Panel, "Vertical",
                        { margin: 5 },
                        $(go.TextBlock, "Decision",
                            {
                                editable: false
                            }),
                        $(go.TextBlock, "Decision",
                            {
                                font: "bold 11pt Helvetica, Arial, sans-serif",
                                stroke: fontcolor,
                                margin: 8,
                                //maxSize: new go.Size(160, NaN),
                                //minSize: new go.Size(/*40, 40*/decwidth, decheight),
                                wrap: go.TextBlock.WrapFit,
                                editable: true
                            },
                            new go.Binding("text").makeTwoWay())
                    )
                ),
                makePort("T", go.Spot.Top, false, true),
                makePort("L", go.Spot.Left, true, false),
                makePort("R", go.Spot.Right, true, false),
                $(go.TextBlock,
                    { text: "False", alignment: go.Spot.TopLeft }),
                $(go.TextBlock,
                    { text: "True", alignment: go.Spot.TopRight }),
            ));

        myDiagram.nodeTemplateMap.add("Stop",
            $(go.Node, "Spot", nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Circle",
                        { minSize: new go.Size(stopwidth, stopheight), fill: /*"#DC3C00"*/stopcolor, stroke: null }),
                    $(go.TextBlock, "End",
                        { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: fontcolor },
                        new go.Binding("text"))
                ),
                $(go.Picture, {
                    source: "/Content/Images/protocol_end_small.png", column: 4,
                    width: stopwidth, height: stopheight, margin: 2
                }),
                // three named ports, one on each side except the bottom, all input only:
                makePort("T", go.Spot.Top, false, true)
            ));

        myDiagram.nodeTemplateMap.add("Collection",
            $(go.Node, "Spot", nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Rectangle",
                        { minSize: new go.Size(collectionwidth, collectionheight), fill: collectioncolor, stroke: null }),
                    $(go.Picture, {
                        source: "/Content/Images/collection_small.png", column: 4,
                        width: collectionwidth, height: collectionheight, margin: 2
                    }),
                    $(go.TextBlock, "Collection",
                        { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: fontcolor },
                        new go.Binding("text"))
                ),
                // three named ports, one on each side except the bottom, all input only:
                makePort("T", go.Spot.Top, false, true),
                makePort("B", go.Spot.Bottom, true, false),
            ));

        myDiagram.nodeTemplateMap.add("CompCollection",
            $(go.Node, "Spot", nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Rectangle",
                        { minSize: new go.Size(compcollectionwidth, compcollectionheight), fill: compcollectioncolor, stroke: null }),
                    $(go.Picture, {
                        source: "/Content/Images/collection_complex_small.png", column: 4,
                        width: compcollectionwidth, height: compcollectionheight, margin: 2
                    }),
                    $(go.TextBlock, "CompCollection",
                        { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: fontcolor },
                        new go.Binding("text"))
                ),
                // three named ports, one on each side except the bottom, all input only:
                makePort("T", go.Spot.Top, false, true),
                makePort("B", go.Spot.Bottom, true, false),
            ));

        myDiagram.nodeTemplateMap.add("Gate",
            $(go.Node, "Spot", nodeStyle(),
                $(go.Panel, /*"Auto"*/"Horizontal",
                    { background: gatecolor, minSize: new go.Size(gatewidth, gateheight) },
                    //$(go.Shape, "Diamond",
                    //    { fill: gatecolor, stroke: null }),
                    $(go.Picture,
                        { source: "/Content/Images/gateway_small.png", width: gatewidth, height: gateheight }),
                    $(go.Panel, "Vertical",
                        { margin: 5 },
                        $(go.TextBlock, "Gateway",
                            {
                                editable: false
                            }),
                        $(go.TextBlock, "Gateway",
                            {
                                font: "bold 11pt Helvetica, Arial, sans-serif",
                                stroke: fontcolor,
                                margin: 8,
                                //maxSize: new go.Size(160, NaN),
                                minSize: new go.Size(gatewidth / 2, gateheight / 2),
                                wrap: go.TextBlock.WrapFit,
                                editable: true
                            },
                            new go.Binding("text").makeTwoWay())
                    )
                ),
                makePort("T", go.Spot.Top, false, true),
                makePort("L", go.Spot.Left, true, false),
                makePort("R", go.Spot.Right, true, false)
            ));


        myDiagram.nodeTemplateMap.add("Inform",
            $(go.Node, "Spot", nodeStyle(),
                $(go.Panel, "Horizontal",
                    { background: informcolor, minSize: new go.Size(informwidth, informheight) },
                    $(go.Picture,
                        { source: "/Content/Images/information_task_small.png", width: informwidth, height: informheight }),
                    $(go.Panel, "Vertical",
                        { margin: 5 },
                        $(go.TextBlock, "Inform",
                            {
                                editable: false
                            }),
                        $(go.TextBlock, "Inform",
                            {
                                font: "bold 11pt Helvetica, Arial, sans-serif",
                                stroke: fontcolor,
                                width: 200,
                                //margin: 8,
                                //maxSize: new go.Size(160, NaN),
                                //minSize: new go.Size(/*40, 40*/actwidth, actheight),
                                wrap: go.TextBlock.WrapFit,
                                editable: true
                            },
                            new go.Binding("text").makeTwoWay())
                    )
                )
            ));

        myDiagram.nodeTemplateMap.add("SimpleForm",
            $(go.Node, "Spot", nodeStyle(),
                $(go.Panel, "Horizontal",
                    { background: actcolor, minSize: new go.Size(simpleformwidth, simpleformheight) },
                    //$(go.Shape, "Rectangle", { fill: /*"#00A9C9"*/actcolor, stroke: null }),
                    $(go.Picture,
                        { source: "/Content/Images/simple_form_small.png", width: simpleformwidth, height: simpleformheight }),
                    $(go.Panel, "Vertical",
                        { margin: 5 },
                        $(go.TextBlock, "SimpleForm",
                            {
                                editable: false
                            }),
                        $(go.TextBlock, "*Write Here*",
                            {
                                font: "bold 11pt Helvetica, Arial, sans-serif",
                                stroke: fontcolor,
                                width: 200,
                                //margin: 8,
                                //maxSize: new go.Size(160, NaN),
                                //minSize: new go.Size(/*40, 40*/actwidth, actheight),
                                wrap: go.TextBlock.WrapFit,
                                editable: true
                            },
                            new go.Binding("text").makeTwoWay())
                    )
                ),
                makePort("T", go.Spot.Top, false, true),
                makePort("B", go.Spot.Bottom, true, false)
            ));

        //A port ne ugráljon
        myDiagram.model = $(go.GraphLinksModel,
            {
                linkFromPortIdProperty: "fromPort",  // required information:
                linkToPortIdProperty: "toPort"
            });

        // replace the default Link template in the linkTemplateMap
        myDiagram.linkTemplate =
            $(go.Link,
                { routing: go.Link.Orthogonal, corner: 3 },
                $(go.Shape),
                $(go.Shape, { toArrow: "Standard" })
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
                        { category: "AltStart", text: "AltStart" },
                        { category: "TimerStart", text: "TimerStart" },
                        { category: "Stop", text: "Stop" },
                        { category: "Collection", text: "Collection" },
                        { category: "CompCollection", text: "CompCollection" },
                        { category: "Act", text: "Action" },
                        { category: "Dec", text: "???", figure: "Diamond" },
                        { category: "Gate", text: "Gate" },
                        { category: "Inform", text: "Inform" },
                        { category: "SimpleForm", text: "*Write Here*" }
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

        this.AddStart = function (posx, posy, text) {
            CreateNode(posx, posy, text, "Start");
        }

    this.AddAltStart = function (posx, posy, text) {
        CreateNode(posx, posy, text, "AltStart");
    }

    this.AddTimerStart = function (posx, posy, text) {
        CreateNode(posx, posy, text, "TimerStart");
    }

    this.AddCollection = function (posx, posy, text) {
        CreateNode(posx, posy, text, "Collection");
    }

    this.AddCompCollection = function (posx, posy, text) {
        CreateNode(posx, posy, text, "CompCollection");
    }

    this.AddStop = function (posx, posy, text) {
        CreateNode(posx, posy, text, "Stop");
    }

    this.AddDec = function (posx, posy, text) {
        CreateNode(posx, posy, text, "Dec");
    }

    this.AddAct = function (posx, posy, text) {
        CreateNode(posx, posy, text, "Act");
    }

    this.AddGate = function (posx, posy, text) {
        CreateNode(posx, posy, text, "Gate");
    }

    this.AddInform = function (posx, posy, text) {
        CreateNode(posx, posy, text, "Inform");
    }

    this.AddSimpleForm = function (posx, posy, text) {
        CreateNode(posx, posy, text, "SimpleForm");
    }

    CreateNode = function (posx, posy, text, cat) {
        var canvas = document.getElementById("canvas");
        //var locx = posx - (myDiagram.documentBounds.width / 2);
        //var locy = posy - (myDiagram.documentBounds.height / 2);
        var locx = posx - (canvas.offsetWidth / 2);
        var locy = posy - (canvas.offsetHeight / 2);
        myDiagram.model.addNodeData({
            category: cat,
            text: text,
            loc: locx + " " + locy
        });
        console.log("x: " + locx + ", y: " + locy);
    }

    portToCoordinate = function (s) {
        switch (s) {
            case "R": return [1, 0.5];
            case "L": return [0, 0.5];
            case "T": return [0.5, 0];
            case "B": return [0.5, 1];
        }
    }

    coordinateToPort = function (s) {
        switch (s) {
            case "1,0.5": return "R";
            case "0,0.5": return "L";
            case "0.5,0": return "T";
            case "0.5,1": return "B";
        }
    }

    this.Save = function () {
        nodeData = [];

        for (var i = 0; i < myDiagram.model.nodeDataArray.length; i++) {
            item = myDiagram.model.nodeDataArray[i];
            console.log("text: " + item.text);
            //a koordináta itt lehet negatív is, ezért eltoljuk
            var canvas = document.getElementById("canvas");
            var width = canvas.offsetWidth / 2;
            var height = canvas.offsetHeight / 2;
            //x = parseFloat(item.loc.split(" ")[0]) + (myDiagram.documentBounds.width/2);
            //y = parseFloat(item.loc.split(" ")[1]) + (myDiagram.documentBounds.height/2);
            x = parseFloat(item.loc.split(" ")[0]) + (width);
            y = parseFloat(item.loc.split(" ")[1]) + (height);
            nodeData[i] = { id: String(item.key), type: item.category, text: item.text, position: { posX: +x, posY: y } };
        }

        linkData = [];

        for (var i = 0; i < myDiagram.model.linkDataArray.length; i++) {
            link = myDiagram.model.linkDataArray[i];
            linkData[i] = { sourceId: String(link.from), targetId: String(link.to), anchors: [portToCoordinate(link.fromPort), portToCoordinate(link.toPort)] };
        }



        parser.Encode(nodeData, linkData);
    }

    this.Load = function () {
        Clear();
        parser.Decode();
    }


    jsonToCanvas = function (load_array) {
        myDiagram.model.nodeDataArray = [];
        var length = load_array.loadblocks.length;
        for (i = 0; i < length; i++) {
            var canvas = document.getElementById("canvas");
            var width = canvas.offsetWidth / 2;
            var height = canvas.offsetHeight / 2;
            //x = parseFloat(load_array.loadblocks[i].position.posX)-(myDiagram.documentBounds.width/2);
            //y = parseFloat(load_array.loadblocks[i].position.posY)-(myDiagram.documentBounds.height/2);
            x = parseFloat(load_array.loadblocks[i].position.posX) - (width);
            y = parseFloat(load_array.loadblocks[i].position.posY) - (height);

            myDiagram.model.addNodeData({
                key: load_array.loadblocks[i].id,
                category: load_array.loadblocks[i].type,
                text: load_array.loadblocks[i].text,
                loc: x + " " + y
            });
        }
        for (i = 0; i < load_array.loadconnections.length; i++) {
            myDiagram.model.addLinkData({
                from: load_array.loadconnections[i].sourceId,
                to: load_array.loadconnections[i].targetId,
                fromPort: coordinateToPort(String(load_array.loadconnections[i].anchors[0])),
                toPort: coordinateToPort(String(load_array.loadconnections[i].anchors[1]))
            });
        }
    }

    this.Clear = function () {
        myDiagram.model.nodeDataArray = [];
        myDiagram.model.linkDataArray = [];
    }
}