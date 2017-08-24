var LibraryStrategy = function () {
    this.library = "";
};

//Színek
//var startcolor = '#36BA45';
//var altstartcolor = '#36BA45';
//var timerstartcolor = '#36BA45';
//var stopcolor = '#FF1D23';
var actcolor = '#6CCFFF';
var deccolor = '#7FB2F0';
var gatecolor = '#7FB2FF';
var informcolor = '#7FB2FF';
var startcolor = '#FFFFFF';
var altstartcolor = '#FFFFFF';
var timerstartcolor = '#FFFFFF';
var stopcolor = '#FFFFFF';
//var actcolor = '#FFFFFF';
//var deccolor = '#FFFFFF';
//var gatecolor = '#FFFFFF';
//Betűszín
var fontcolor = '#000000';
//Méretek
var startwidth = 50;
var startheight = 50;
var altstartwidth = 50;
var altstartheight = 50;
var timerstartwidth = 50;
var timerstartheight = 50;
var stopwidth = 50;
var stopheight = 50;
var actwidth = 50;
var actheight = 50;
var decwidth = 50;
var decheight = 50;
var gatewidth = 50;
var gateheight = 50;
var informwidth = 50;
var informheight = 50;

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
    AddTimerStart: function (posx, posy, text) {
        return this.library.AddTimerStart(posx, posy, text);
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
    AddInform: function (posx, posy, text) {
        return this.library.AddInform(posx, posy, text);
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