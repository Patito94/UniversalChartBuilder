var LibraryStrategy = function () {
    this.library = "";
};

//Színek
var startcolor = '#36BA45';
var altstartcolor = '#36BA45';
var stopcolor = '#FF1D23';
var actcolor = '#6CCFFF';
var deccolor = '#7FB2F0';
var gatecolor = '#7FB2FF';
//Betűszín
var fontcolor = '#000000';
//Méretek
var startwidth = 100;
var startheight = 100;
var altstartwidth = 100;
var altstartheight = 100;
var stopwidth = 100;
var stopheight = 100;
var actwidth = 100;
var actheight = 100;
var decwidth = 100;
var decheight = 100;
var gatewidth = 100;
var gateheight = 100;

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
    AddAltStart: function (posx, posy, text) {
        return this.library.AddAltStart(posx, posy, text);
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
    AddGate: function (posx, posy, text) {
        return this.library.AddGate(posx, posy, text);
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