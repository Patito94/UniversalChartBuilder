var LibraryStrategy = function () {
    this.library = "";
};

LibraryStrategy.prototype = {
    setStrategy: function (library) {
        this.library = library;
    },
    AddStart: function (posx, posy, text) { //param: position {posx,posy}, text
        return this.library.AddStart(posx, posy, text);
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
}

var GoJsStrategy = function () {
    this.AddStart = function (posx, posy, text) {
        console.log("GoJS");
    }

}
var mxGraphStrategy = function () {
    this.AddStart = function (posx, posy, text) {
        console.log("mxGraph");
    }
}