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
        //var text = prompt("Action name: ", document.getElementById(thisid).getElementsByTagName('p')[1].innerHTML);
        var text = prompt("Action name: ", document.getElementById(thisid).getElementsByClassName('text')[0].innerHTML);
        //var text = $("#" + thisid).find(".actionName");
        //console.log("id: "+thisid);
        //console.log(text);
        document.getElementById(thisid).getElementsByClassName('text')[0].innerHTML = text;
        //document.getElementsByClassName('actionName').innerHTML = text;
        block_array.blocks[thisid].text = text;
        //console.log("bl text: " + block_array.blocks[thisid].text);
        //for (i = 0; i < block_array.blocks.length; i++) {
        //    if (thisid == block_array.blocks[i].id) {
        //        block_array.blocks[i].text = text;
        //        console.log("bl text: "+block_array.blocks[i].text);
        //        //block_array.blocks[i].text = text;
        //        //block_array.blocks[i].anchors.style = { anchor: "BottomCenter" };
        //        //jsPlumb.addEndpoint($(Div), { anchor: "BottomCenter" }, { isSource: true, isTarget: false });
        //        //jsPlumb.endpoints(block_array.blocks[i], { anchor: "BottomCenter" });
        //    }
        //}
        jsPlumb.repaintEverything();
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
    $(document).on("mousemove", function (e) {
        //if (document.getElementsByName('valami')[0] != undefined) document.getElementsByName('valami')[0].innerHTML = "Sas";
        //if (document.getElementsByName('valami')[1] != undefined) document.getElementsByName('valami')[1].innerHTML = "Lol";
        //if (document.getElementsByName('valami')[2] != undefined) document.getElementsByName('valami')[2].innerHTML = "Olvas";
        //for (i = 0; i < block_array.blocks.length; i++) {
        //    if ("Act" == block_array.blocks[i].type) {
        //        document.getElementsByName('valami')[i].innerHTML = block_array.blocks[i].text;
        //    }
        //}
    });
    //$(document).on("mouseup", function (e) {
    //    console.log(document.getElementById("canvas").getBoundingClientRect().left);
    //    var xx = document.getElementById("canvas").getBoundingClientRect().left;
    //    var yy = document.getElementById("canvas").getBoundingClientRect().top;
    //    var x = e.clientX-xx-50;
    //    var y = e.clientY-yy-50;
    //    //AddStart(x, y, "Start");
    //});

    $('html').keyup(function (e) {
        if (e.keyCode == 46 && thisid != null) {
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
        //PaletteStart(0, 500, "Start");
        //document.getElementById("buttons").style.visibility = "visible";
        //document.getElementById("Start");
    }

    this.AddStart = function (posx, posy, text) {
        LoadStart("" + indexer, posx, posy, text);
        indexer++;
    }

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
                //border: 'solid 1px',
                background: startcolor,
                'line-height': (startheight-11) + 'px',
                'border-color': 'black',
                color: fontcolor,
                'background-image': 'url("/Content/Images/protocol_start_small.png")',
                'background-size': 'cover',
                'background-repeat': 'no-repeat',
                'background-position': 'center center',
                'border-radius': startheight + 'px',
                //'background-image': 'url("Content/Images/ball.png")'
            });
        return Div;
    }

    LoadStart = function (id, posx, posy, text) {
        var Div = createStartDiv(id, posx, posy, text, "Deletable");
        Div.appendTo("#canvas");
        jsPlumb.draggable($(Div));
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

    this.AddPaletteStart = function (posx, posy, text) {
        var Div = createStartDiv("palettestart", posx, posy, "Start", "PaletteItem");
        Div.appendTo("#palette").draggable({ helper: 'clone' });;
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
                //border: 'solid 1px',
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

    this.AddAltStart = function (posx, posy, text) {
        LoadAltStart("" + indexer, posx, posy, text);
        indexer++;
    }

    LoadAltStart = function (id, posx, posy, text) {
        var Div = createAltStartDiv(id, posx, posy, text, "Deletable");
        Div.appendTo("#canvas");
        jsPlumb.draggable($(Div));
        jsPlumb.addEndpoint($(Div), { anchor: "BottomCenter" }, { isSource: true, isTarget: false });
        block_array.blocks.push({
            "id": id,
            "type": "AltStart",
            "text": text,
            "position": {
                "posX": posx,
                "posY": posy
            }
        });
    }

    this.AddPaletteAltStart = function (posx, posy, text) {
        var Div = createAltStartDiv("palettealtstart", posx, posy, "AltStart", "PaletteItem");
        Div.appendTo("#palette").draggable({ helper: 'clone' });;
    }

    this.AddTimerStart = function (posx, posy, text) {
        LoadTimerStart("" + indexer, posx, posy, text);
        indexer++;
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
                //border: 'solid 1px',
                background: timerstartcolor,
                'line-height': (timerstartheight-11) + 'px',
                'border-color': 'black',
                color: fontcolor,
                'background-image': 'url("/Content/Images/protocol_start_timed_small.png")',
                'background-size': 'cover',
                'background-repeat': 'no-repeat',
                'background-position': 'center center',
                'border-radius': timerstartheight + 'px',
                //'background-image': 'url("Content/Images/ball.png")'
            });
        return Div;
    }

    LoadTimerStart = function (id, posx, posy, text) {
        var Div = createTimerStartDiv(id, posx, posy, text, "Deletable");
        Div.appendTo("#canvas");
        jsPlumb.draggable($(Div));
        jsPlumb.addEndpoint($(Div), { anchor: "BottomCenter" }, { isSource: true, isTarget: false });
        block_array.blocks.push({
            "id": id,
            "type": "TimerStart",
            "text": text,
            "position": {
                "posX": posx,
                "posY": posy
            }
        });
    }

    this.AddPaletteTimerStart = function (posx, posy, text) {
        var Div = createTimerStartDiv("palettetimerstart", posx, posy, "TimerStart", "PaletteItem");
        Div.appendTo("#palette").draggable({ helper: 'clone' });;
    }

    this.AddStop = function (posx, posy, text) {
        LoadStop("" + indexer, posx, posy, text);
        indexer++;
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
                //border: 'solid 1px',
                background: stopcolor,
                raius: '2',
                'border-color': 'black',
                color: fontcolor,
                'background-image': 'url("/Content/Images/protocol_end_small.png")',
                'background-size': 'cover',
                'background-repeat': 'no-repeat',
                'background-position': 'center center',
                'line-height': (stopheight-11) + 'px',
                'border-radius': stopheight + 'px'
            });
        return Div;
    }

    LoadStop = function (id, posx, posy, text) {
        var Div = createStopDiv(id, posx, posy, "Stop", "Deletable");
        Div.appendTo("#canvas");
        jsPlumb.draggable($(Div));
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

    this.AddPaletteStop = function (posx, posy, text) {
        var Div = createStopDiv("palettestop", posx, posy, "Stop", "PaletteItem");
        Div.appendTo("#palette").draggable({ helper: 'clone' });;
    }

    this.AddDec = function (posx, posy, text) {
        LoadDec("" + indexer, posx, posy, text);
        indexer++;
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

    LoadDec = function (id, posx, posy, text) {
        var Div = createDecDiv(id, posx, posy, text, "Editable");
        Div.appendTo("#canvas");
        //document.getElementById(id).innerHTML = "<p class='text'>" + text + "</p>";
        document.getElementById(id).innerHTML = '<div style="display: inline - block; float:left"><img src="/Content/Images/decision_small.png" height="80" width="80"></div><div style="display: inline-block"><p class="title">Decision</p><p class="text">' + text + '</p></div>';
        jsPlumb.draggable($(Div));
        $(Div).addClass('window');
        jsPlumb.addEndpoint($(Div), { anchor: "TopCenter" }, { isSource: false, isTarget: true, maxConnections: -1 });
        var right = jsPlumb.addEndpoint($(Div), { anchor: "Right" }, { isSource: true, isTarget: false });
        var left = jsPlumb.addEndpoint($(Div), { anchor: "Left" }, { isSource: true, isTarget: false });
        left.addOverlay(["Label", { label: "False", location: [-0.5, -1] }]);
        right.addOverlay(["Label", { label: "True", location: [1.5, -1] }]);
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

    this.AddPaletteDec = function (posx, posy, text) {
        var Div = createDecDiv("palettedecision", posx, posy, "Decision", "PaletteItem");
        Div.appendTo("#palette").draggable({ helper: 'clone' });;
    }

    this.AddAct = function (posx, posy, text) {
        LoadAct("" + indexer, posx, posy, text);
        indexer++;
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
                    //border: 'solid 1px',
                    'border-color': 'black',
                    color: fontcolor,
                    background: actcolor
                });
            return Div;
        }
    }

    LoadAct = function (id, posx, posy, text) {
        var Div = createActDiv(id, posx, posy, text, "Editable");
        Div.appendTo("#canvas");
        //document.getElementById(id).innerHTML = "<p>" + text + "</p>";
        //console.log("id: " + id);
        //document.getElementById(id).innerHTML = '<img src="Content/Images/ball.png" height="42" width="42">';
        //console.log(Div);
        //Div.load('/Content/action.html');
        //$('#refresh').html(Div);
        //Div.style='<div style="display: inline - block"><img src="/Content/Images/command_small.png" height="80" width="80" ></div><div style="display: inline-block"><p class="title">Utasítás</p><p class="actionName">' + text + "Asd" + '</p></div>';
        document.getElementById(id).innerHTML = '<div style="display: inline - block; float:left"><img src="/Content/Images/command_small.png" height="80" width="80"></div><div style="display: inline-block"><p class="title">Action</p><p class="text">' + text + '</p></div>';
        //console.log(Div);
        //var x = Div;
        //console.log(x);
        jsPlumb.draggable($(Div));
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
        block_array.blocks[id].text = text;
        //console.log("bl text: " + block_array.blocks[id].text);
        //console.log("doc: " + document.getElementById(indexer).innerHTML);
        //document.getElementById(indexer).innerHTML = text;
        //console.log("docdocdoc: " + document.getElementById(indexer).getElementsByClassName("actionName"));
        //document.getElementById(indexer).getElementsByClassName("actionName").innerHTML = text;
        //document.getElementById(indexer).getElementsByClassName("actionName").innerHTML = text;
        //Div.getElementsByClassName = text;
        //console.log("Asd: "+Div.getElementsByClassName);
        //console.log("docdoc: " + document.getElementById(indexer)['title']);
        //document.getElementById(indexer).getElementsByClassName('actionName').innerHTML = text;
        //document.getElementById(id).getElementsByClassName('actionName')[0].innerHTML = text;
        //console.log("loadact: " + document.getElementById(id).getElementsByClassName('actionName'));
        //document.getElementById(id).getElementsByClassName('actionName').innerHTML = text;
        //console.log(document.getElementById(id).innerHTML);
        //document.getElementById(id).innerHTML = text;
        //document.getElementById(id).innerHTML = "<p class='actionName'>" + text + "</p>";
        //console.log(document.getElementsByClassName("actionName")[0]);
        //console.log();
        //document.getElementById(id).getElementsByClassName('actionName')[0].innerHTML = text;
        //console.log(document.getElementsByName('valami')[0]);
        //Div = '<div style="display: inline - block"><img src="/Content/Images/command_small.png" height="80" width="80" ></div><div style="display: inline-block"><p class="title">Utasítás</p><p class="actionName">' + text + '</p></div>';
        //console.log(Div);
        //Div += '<div name="valami"><img src="/Content/Images/command_small.png" height="80" width="80" ></div>';
        //document.getElementsByName('valami')[0].innerHTML = block_array.blocks[0].text;
    }

    this.AddPaletteAct = function (posx, posy, text) {
        var Div = createActDiv("paletteaction", posx, posy, "Action", "PaletteItem");
        Div.appendTo("#palette").draggable({ helper: 'clone' });
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
                    //'min-height': gateheight + 'px',
                    //'min-width': gatewidth + 'px',
                    //width: 'auto',
                    //height: 'auto',
                    'min-width': gatewidth + 'px',
                    'min-height': gateheight + 'px',
                    width: 'auto',
                    height: 'auto',
                    //border: 'solid 1px',
                    background: gatecolor,
                    'border-color': 'black',
                    color: fontcolor,
                    'line-height': ((gateheight) - 11) + 'px',
                    //'transform': 'rotate(45deg)'
                }
                );
            return Div;
        }
    }

    this.AddGate = function (posx, posy, text) {
        LoadGate("" + indexer, posx, posy, text);
        indexer++;
    }

    LoadGate = function (id, posx, posy, text) {
        var Div = createGateDiv(id, posx, posy, text, "Editable");
        Div.appendTo("#canvas");
        //document.getElementById(id).innerHTML = "<p class='text' style='transform: rotate(-45deg)'>" + text + "</p>";
        document.getElementById(id).innerHTML = '<div style="display: inline - block; float:left"><img src="/Content/Images/gateway_small.png" height="80" width="80"></div><div style="display: inline-block"><p class="title">Gateway</p><p class="text">' + text + '</p></div>';
        jsPlumb.draggable($(Div));
        jsPlumb.addEndpoint($(Div), { anchor: "TopCenter" }, { isSource: false, isTarget: true, maxConnections: -1 });
        jsPlumb.addEndpoint($(Div), { anchor: "Right" }, { isSource: true, isTarget: false });
        jsPlumb.addEndpoint($(Div), { anchor: "Left" }, { isSource: true, isTarget: false });
        block_array.blocks.push({
            "id": id,
            "type": "Gate",
            "text": text,
            "position": {
                "posX": posx,
                "posY": posy
            }
        });
    }

    this.AddPaletteGate = function (posx, posy, text) {
        var Div = createGateDiv("palettegateway", posx, posy, "GateWay", "PaletteItem");
        Div.appendTo("#palette").draggable({ helper: 'clone' });
        //document.getElementById("palettegateway").innerHTML = "<p style='transform: rotate(-45deg)'>" + "Gateway" + "</p>";
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
        //for (i = 0; i < block_array.blocks.length; i++) {
        //    if ("Act" == block_array.blocks[i].type) {
        //        document.getElementsByName('valami')[i].innerHTML = block_array.blocks[i].text;
        //    }
        //}
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