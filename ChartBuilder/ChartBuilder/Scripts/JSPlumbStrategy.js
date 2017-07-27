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

    var indexer = 0;
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
    $(document).on("dblclick", "div[text='flowchartWindow']", function () {
        thisid = this.id;
        openModal();
    });
    //End Modalthings

    this.Create = function () {
        document.getElementById("buttons").style.visibility = "visible";
    }

    this.AddStart = function (posx, posy, text) {
        LoadStart("flowchartWindow" + indexer, posx, posy, text);
        indexer++;
    }

    LoadStart = function (id, posx, posy, text) {
        id = String(id);
        var Div = $('<div>', {
            id: id,
            class: 'window jtk-node',
            text: "flowchartWindow"
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
        document.getElementById(id).innerHTML = text;
        jsPlumb.draggable($(Div));
        $(Div).addClass('window');
        jsPlumb.addEndpoint($(Div), { anchor: "BottomCenter" }, { isSource: true, isTarget: false });
        block_array.blocks.push({
            "id": id,
            "type": "Start",
            "text": text,
            "position": {
                "posX": posx,
                "posY": posy
            }
        });
    }

    this.AddStop = function (posx, posy, text) {
        LoadStop("flowchartWindow" + indexer, posx, posy, text);
        indexer++;
    }

    LoadStop = function (id, posx, posy, text) {
        id = String(id);
        var Div = $('<div>', {
            id: id,
            class: 'window jtk-node',
            text: "flowchartWindow"
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
        document.getElementById(id).innerHTML = text;
        jsPlumb.draggable($(Div));
        $(Div).addClass('window');
        jsPlumb.addEndpoint($(Div), { anchor: "TopCenter" }, { isSource: false, isTarget: true, maxConnections: -1 });
        block_array.blocks.push({
            "id": id,
            "type": "Stop",
            "text": text,
            "position": {
                "posX": posx,
                "posY": posy
            }
        });
    }

    this.AddDec = function (posx, posy, text) {
        LoadDec("flowchartWindow" + indexer,posx,posy,text);
        indexer++;
    }

    LoadDec = function (id, posx, posy, text) {
        id = String(id);
        if (text == null) {
            text = prompt("Decision name: ", "Some Decision");
            if (text != null) {
                var Div = $('<div>',
            {
                id: id,
                class: 'window jtk-node',
                text: "flowchartWindow"
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
                document.getElementById(id).innerHTML = text;
                jsPlumb.draggable($(Div));
                $(Div).addClass('window');
                jsPlumb.addEndpoint($(Div), { anchor: "TopCenter" }, { isSource: false, isTarget: true, maxConnections: -1 });
                jsPlumb.addEndpoint($(Div), { anchor: "Right" }, { isSource: true, isTarget: false });
                jsPlumb.addEndpoint($(Div), { anchor: "Left" }, { isSource: true, isTarget: false });
                block_array.blocks.push({
                    "id": id,
                    "type": "Dec",
                    "text": text,
                    "position": {
                        "posX": posx,
                        "posY": posy
                    }
                });
            }
        }
        else if (text != null) {
            var Div = $('<div>',
        {
            id: id,
            class: 'window jtk-node',
            text: "flowchartWindow"
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
            document.getElementById(id).innerHTML = text;
            jsPlumb.draggable($(Div));
            $(Div).addClass('window');
            jsPlumb.addEndpoint($(Div), { anchor: "TopCenter" }, { isSource: false, isTarget: true, maxConnections: -1 });
            jsPlumb.addEndpoint($(Div), { anchor: "Right" }, { isSource: true, isTarget: false });
            jsPlumb.addEndpoint($(Div), { anchor: "Left" }, { isSource: true, isTarget: false });
            block_array.blocks.push({
                "id": id,
                "type": "Dec",
                "text": text,
                "position": {
                    "posX": posx,
                    "posY": posy
                }
            });
        }
    }

    this.AddAct = function (posx, posy, text) {
        LoadAct("flowchartWindow" + indexer,posx,posy,text);
        indexer++;
    }

    LoadAct = function (id, posx, posy, text) {
        id = String(id);
        if (text == null) {
            text = prompt("Action name: ", "Some Action");
            if (text != null) {
                var Div = $('<div>', {
                    id: id,
                    class: 'window jtk-node',
                    text: "flowchartWindow"
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
                document.getElementById(id).innerHTML = text;
                jsPlumb.draggable($(Div));
                $(Div).addClass('window');
                jsPlumb.addEndpoint($(Div), { anchor: "TopCenter" }, { isSource: false, isTarget: true, maxConnections: -1 });
                jsPlumb.addEndpoint($(Div), { anchor: "BottomCenter" }, { isSource: true, isTarget: false });
                block_array.blocks.push({
                    "id": id,
                    "type": "Act",
                    "text": text,
                    "position": {
                        "posX": posx,
                        "posY": posy
                    }
                });
            }
        }
        else if (text != null) {
            var Div = $('<div>', {
                id: id,
                class: 'window jtk-node',
                text: "flowchartWindow"
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
            document.getElementById(id).innerHTML = text;
            jsPlumb.draggable($(Div));
            $(Div).addClass('window');
            jsPlumb.addEndpoint($(Div), { anchor: "TopCenter" }, { isSource: false, isTarget: true, maxConnections: -1 });
            jsPlumb.addEndpoint($(Div), { anchor: "BottomCenter" }, { isSource: true, isTarget: false });
            block_array.blocks.push({
                "id": id,
                "type": "Act",
                "text": text,
                "position": {
                    "posX": posx,
                    "posY": posy
                }
            });
        }
    }

    this.Save = function () {
        for (i = 0; i < block_array.blocks.length; i++) {
            block_array.blocks[i].position.posX = document.getElementById(block_array.blocks[i].id).offsetLeft;
            block_array.blocks[i].position.posY = document.getElementById(block_array.blocks[i].id).offsetTop;
        }
        $.each(jsPlumb.getConnections(), function (idx, connection) {
            connections_array.connections.push({
                sourceId: connection.sourceId,
                targetId: connection.targetId,
                anchors: $.map(connection.endpoints, function (endpoint) {

                    return [[endpoint.anchor.x,
                    endpoint.anchor.y,
                    ]];

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
        $.each(load_array.loadconnections, function (index, elem) {
            var connection1 = jsPlumb.connect({
                source: elem.sourceId,
                target: elem.targetId,
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
        indexer = 0;
    }
}