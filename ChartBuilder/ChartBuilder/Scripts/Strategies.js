var LibraryStrategy = function () {
    this.library = "";
};

LibraryStrategy.prototype = {
    setStrategy: function (library) {
        this.library = library;
    },
    AddStart: function (posx,posy, text) { //param: position {posx,posy}, text
        return this.library.AddStart(posx,posy,text);
    }
};

var GoJsStrategy = function () {
    this.AddStart = function (posx, posy, text) {
        console.log("GoJS");
    }
}
var JSPlumbStrategy = function () {
    this.AddStart = function (posx,posy, text) {
        console.log("JSPlumb");
    }
}
var mxGraphStrategy = function () {
    this.AddStart = function (posx,posy, text) {
        console.log("mxGraph");
    }
}