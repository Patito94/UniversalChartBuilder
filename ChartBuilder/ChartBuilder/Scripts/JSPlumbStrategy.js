var JSPlumbStrategy = function () {
    var thisid;
    var block_array = {
        blocks: []
    }
    jsPlumb.Defaults.Connector = ["Flowchart", { stub: [50, 50], midpoint: 0.5 }];
    var connections_array = {
        connections: []
    }
    //var load_array = {
    //    loadblocks: [],
    //    loadconnections: []
    //}

    var parser = new JSONParseChart();

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
        //Előre hozom a Modal-t, így az a node-ok előtt jelenik meg
        modal.style.zIndex = 100001;
        modal.style.display = "block";
    }
    this.EditNode = function () {
        modal.style.display = "none";
        var text = prompt("Action name: ", document.getElementById(thisid).getElementsByTagName('p')[0].innerHTML);
        document.getElementById(thisid).getElementsByTagName('p')[0].innerHTML = text;

        for (i = 0; i < block_array.blocks.length; i++) {
            if (thisid == block_array.blocks[i].id) {
                block_array.blocks[i].text = text;
                //block_array.blocks[i].anchors.style = { anchor: "BottomCenter" };
                //jsPlumb.addEndpoint($(Div), { anchor: "BottomCenter" }, { isSource: true, isTarget: false });
                //jsPlumb.endpoints(block_array.blocks[i], { anchor: "BottomCenter" });
            }
        }
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
    $(document).on("dblclick", "div[category='Editable']", function () {
        thisid = this.id;
        openModal();
    });
    $(document).on("click", "div[category='Deletable']", function () {
        thisid = this.id;
    });

    $('html').keyup(function (e) {
        if (e.keyCode == 46 && thisid!=null) {
            jsPlumb.remove(thisid);
            for (i = 0; i < block_array.blocks.length; i++) {
                if (thisid == block_array.blocks[i].id) {
                    block_array.blocks.splice(i, 1);
                }
            }
            thisid = null;
        }
    });


    ///NYÍL LEGYEN
    jsPlumb.bind('connection', function (e) {
        jsPlumb.select(e).addOverlay(["Arrow", { width: 20, length: 20, location: 1 }]);
    });

    this.Create = function () {
        //document.getElementById("buttons").style.visibility = "visible";
    }

    this.AddStart = function (posx, posy, text) {
        LoadStart("" + indexer, posx, posy, text);
        indexer++;
    }

    LoadStart = function (id, posx, posy, text) {
        id = String(id);
        var Div = $('<div>', {
            id: id,
            class: 'window jtk-node',
            text: "flowchartWindow",
            category: "Deletable"
        })
.css(
    {
        top: posy,
        left: posx,
        //'min-height': '50px',
        height: '100px',
        width: '100px',
        //height: '50px',
        //width: '50px',
        border: 'solid 1px',
        background: startcolor,
        'border-color': 'black',
        color: fontcolor,
        'border-radius': '50px'
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
        LoadStop("" + indexer, posx, posy, text);
        indexer++;
    }

    LoadStop = function (id, posx, posy, text) {
        id = String(id);
        var Div = $('<div>', {
            id: id,
            class: 'window jtk-node',
            text: "flowchartWindow",
            category: "Deletable"
        })
    .css(
        {
            top: posy,
            left: posx,
            height: '100px',
            //'min-height': '50px',
            width: '100px',
            border: 'solid 1px',
            background: stopcolor,
            raius: '2',
            'border-color': 'black',
            color: fontcolor,
            'border-radius': '50px'
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
        LoadDec("" + indexer,posx,posy,text);
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
                text: "flowchartWindow",
                category: "Editable"
            })
            .css(
            {
                top: posy,
                left: posx,
                height: '100px',
                //'min-height': '50px',
                width: '100px',
                border: 'solid 1px',
                background: deccolor,
                'border-color': 'black',
                color: fontcolor,
                'transform': 'rotate(45deg)'
            }
            );
                Div.appendTo("#canvas");
                //document.getElementById(id).innerHTML = text;
                document.getElementById(id).innerHTML = "<p style='transform: rotate(-45deg)'>" + text + "</p>";
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
            text: "flowchartWindow",
            category: "Editable"
        })
        .css(
        {
            top: posy,
            left: posx,
            height: '100px',
            //'min-height': '50px',
            width: '100px',
            border: 'solid 1px',
            background: deccolor,
            'border-color': 'black',
            color: fontcolor,
            'transform': 'rotate(45deg)'
        }
        );
            Div.appendTo("#canvas");
            document.getElementById(id).innerHTML = "<p style='transform: rotate(-45deg)'>"+text+"</p>";
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
        LoadAct("" + indexer,posx,posy,text);
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
                    text: "flowchartWindow",
                    category: "Editable"
                })
            .css(
                {
                    top: posy,
                    left: posx,
                    //'min-height': '50px',
                    height: '100px',
                    //width: '100px',
                    width: 'auto',
                    'min-width': '100px',
                    border: 'solid 1px',
                    'border-color': 'black',
                    color: fontcolor,
                    background: actcolor
                });
                Div.appendTo("#canvas");
                //document.getElementById(id).innerHTML = text;
                document.getElementById(id).innerHTML = "<p>" + text + "</p>";
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
                text: "flowchartWindow",
                category: "Editable"
            })
        .css(
            {
                top: posy,
                left: posx,
                //'min-height': '50px',
                height: '100px',
                //width: '100px',
                width: 'auto',
                'min-width': '100px',
                border: 'solid 1px',
                'border-color': 'black',
                color: fontcolor,
                background: actcolor
            });
            Div.appendTo("#canvas");
            //document.getElementById(id).innerHTML = text;
            document.getElementById(id).innerHTML = "<p>" + text + "</p>";
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

        parser.Encode(block_array.blocks, connections_array.connections);
    }

    this.Load = function () {
        Clear();
        parser.Decode();
        //console.log("indexer: " + indexer);
    }

    jsonToCanvas = function () {
        
        //console.log(load_array.loadblocks);
        var length = load_array.loadblocks.length;
        var bestid = -100000;
        for (i = 0; i < length; i++) {
            if (parseInt(load_array.loadblocks[i].id) > parseInt(bestid)) { bestid = parseInt(load_array.loadblocks[i].id) };
            //console.log("id: " + load_array.loadblocks[i].id);
            //console.log("bestid after: "+bestid);
            //console.log("actualid: "+load_array.loadblocks[i].id);
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
        indexer = parseInt(bestid) + 1;
        //console.log("indexer:" + indexer);
        $.each(load_array.loadconnections, function (index, elem) {
            var connection1 = jsPlumb.connect({
                source: elem.sourceId,
                target: elem.targetId,
                anchors: elem.anchors
                //overlays: [
                //   ["Arrow", { width: 20, length: 20, location: 1 }]
                //]
            });
        });
        //console.log("fesfsefes");
    }

    Clear = function () {
        //jsPlumb.detachEveryConnection();
        var i = block_array.blocks.length - 1;
        while (i >= 0) {
            jsPlumb.remove(block_array.blocks[i].id);
            i--;
        }
        //jsPlumb.remove(block_array.blocks);
        block_array.blocks.splice(0, block_array.blocks.length);
        connections_array.connections.splice(0, connections_array.connections.length);
        document.getElementById("startbtn").removeAttribute("disabled");
        document.getElementById("stopbtn").removeAttribute("disabled");
        indexer = 0;
    }
}