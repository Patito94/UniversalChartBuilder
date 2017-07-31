JSONParseChart = function () {
    this.Encode = function (blocks, connections) {
        var JSONObj = "";
        JSONObj += "{\"loadblocks\":";
        JSONObj += JSON.stringify(blocks);
        JSONObj += ",\"loadconnections\":";
        JSONObj += JSON.stringify(connections);
        JSONObj += "}";

        $.ajax({
            type: "POST",
            url: "/Home/SaveChart",
            data: { path: "Charts/chart.json", chartJson: JSONObj }
        });

    }



    this.Decode = function () {
        $.ajax({
            dataType: "json",
            url: "/Home/GetChart",
            data: { path: "Charts/chart.json" },
            success: function (json) {
                load_array = JSON.parse(json);
                jsonToCanvas(load_array);
            }
        });
    }



}

