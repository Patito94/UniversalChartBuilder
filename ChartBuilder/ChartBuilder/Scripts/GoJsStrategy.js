var GoJsStrategy = function () {

    var parser = new JSONParseChart();

    this.Create = function () {
        var $ = go.GraphObject.make;  // for conciseness in defining templates
        document.getElementById("palette").style.visibility = "visible";
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

        myDiagram.nodeTemplateMap.add("Act",
          $(go.Node, "Spot", nodeStyle(),
            $(go.Panel, "Auto",
              $(go.Shape, "Rectangle", { fill: "#00A9C9", stroke: null }),
              $(go.TextBlock, "Action",
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
            makePort("T", go.Spot.Top, false, true),
            makePort("B", go.Spot.Bottom, true, false)
          ));

        myDiagram.nodeTemplateMap.add("Dec",
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
                new go.Binding("text").makeTwoWay())
            ),
            makePort("T", go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, true, false),
            makePort("R", go.Spot.Right, true, false)
          ));

        myDiagram.nodeTemplateMap.add("Stop",
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
                  { category: "Act", text: "Action" },
                  { category: "Dec", text: "???", figure: "Diamond" },
                  { category: "Stop", text: "Stop" }
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

    this.AddStop = function (posx, posy, text) {
        CreateNode(posx, posy, text, "Stop");
    }

    this.AddDec = function (posx, posy, text) {
        CreateNode(posx, posy, text, "Dec");
    }

    this.AddAct = function (posx, posy, text) {
        CreateNode(posx, posy, text, "Act");
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
            console.log("text: "+item.text);
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




this.Clear = function()
{
    myDiagram.model.nodeDataArray = [];
    myDiagram.model.linkDataArray = [];
}

}