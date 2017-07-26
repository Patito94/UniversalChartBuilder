JSONParseChart = function (blocks, connections) {
    this.Encode = function () {
        //id, type, x, y, text 

        var JSONObj = "";
        JSONObj += "{\"loadblocks\":";
        JSONObj += JSON.stringify(blocks);
        JSONObj += ",\"loadconnections\":";
        JSONObj += JSON.stringify(connections);
        JSONObj += "}";

        $.ajax({
            type: "POST",
            url: "/Home/SaveChart",
            data: { path: "Charts/jsplumChart.txt", chartJson: JSONObj }
        });

    }



    this.Decode = function () {

    }



}

