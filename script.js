
var Metal = 0;
var Crystal = 0;
var Deuterium = 0;

var MetalCapacity = 0;
var CrystalCapacity = 0;
var DeuteriumCapacity = 0;

var MetalProd = 0;
var CrystalProd = 0;
var DeuteriumProd = 0;

if(window.location.href.indexOf("fleet") == -1)
{
    $.get("/game/index.php?page=resourceSettings", function (data) {

        var time = Date.now();
        var capacity = $("tr:contains('Capacité de stockage') td.normalmark", data);
        var summary = $("tr.summary td.undermark", data);

        EvalCapacity(capacity);
        EvalSummary(summary);

        AutoUpdateInfo();
    });
    $(".detail_button").mouseup(function () {
        setTimeout( function(){ UpdateInfo();} , 200);
    });
}

function GetCurrentResources() {
    Metal = parseInt($("#resources_metal").text().replace(".", ""));
    Crystal = parseInt($("#resources_crystal").text().replace(".", ""));
    Deuterium = parseInt($("#resources_deuterium").text().replace(".", ""))
}

function EvalCapacity(capacity) {
    MetalCapacity = parseInt($("span", capacity)[0].textContent.replace(".", ""));
    CrystalCapacity = parseInt($("span", capacity)[1].textContent.replace(".", ""));
    DeuteriumCapacity = parseInt($("span", capacity)[2].textContent.replace(".", ""));
}

function EvalSummary(summary) {
    MetalProd = parseInt($("span", summary)[0].textContent.replace(".", ""));
    CrystalProd = parseInt($("span", summary)[1].textContent.replace(".", ""));
    DeuteriumProd = parseInt($("span", summary)[2].textContent.replace(".", ""));
}

function UpdateInfo() {
    GetCurrentResources();
    var costs = $("#costs");
    var metalcost = $(".metal .cost", costs).text();
    var crystalcost = $(".crystal .cost", costs).text();
    var deuteriumcost = $(".deuterium .cost", costs).text();

    metalcost = parseInt(metalcost.replace(".", ""));
    crystalcost = parseInt(crystalcost.replace(".", ""));
    deuteriumcost = parseInt(deuteriumcost.replace(".", ""));

    var detail = $("#detail");
    var content = $("#content", detail);

    timerestant = 0; // secondes

    if (!isNaN(metalcost) || !isNaN(crystalcost) || !isNaN(deuteriumcost)) {
        metalneed = metalcost - Metal;
        crystalneed = crystalcost - Crystal;
        deuteriumneed = deuteriumcost - Deuterium;

        if (isNaN(metalneed)) {
            metalneed = -1;
        }
        if (isNaN(crystalneed)) {
            crystalneed = -1;
        }
        if (isNaN(deuteriumneed)) {
            deuteriumneed = -1;
        }

        metaltime = metalneed / MetalProd;
        crystaltime = crystalneed / CrystalProd;
        deuteriumtime = deuteriumneed / DeuteriumProd;

        timerestant = Math.max(metaltime, crystaltime, deuteriumtime);
    }

    if (timerestant > 0) {
        week = (timerestant / 24) / 7;
        day = (timerestant / 24) % 7;
        hour = timerestant % 24;
        minutes = (timerestant % 1) * 60;
        secondes = (minutes % 1) * 60;

        week = Math.floor(week);
        day = Math.floor(day);
        hour = Math.floor(hour);
        minutes = Math.floor(minutes);
        secondes = Math.round(secondes);


        display = "";
        if (week > 0) {
            display += week + "s ";
        }
        if (day > 0) {
            display += day + "j ";
        }
        if (hour > 0) {
            display += hour + "h ";
        }
        if (week <= 0 && minutes > 0) {
            display += minutes + "m ";
            if (secondes > 0) {
                display += secondes + "s";
            }
        }
        
        if ($("ul.production_info li.restant", content).length) {
            $("ul.production_info li.restant", content).replaceWith(`<li class='restant'>Temps avant construction: <span class="time">` + display + `</span></li>`);
        }
        else {
            $("ul.production_info", content).append(`<li class='restant'>Temps avant construction: <span class="time">` + display + `</span></li>`);
        }
    }


}

function AutoUpdateInfo() {
    UpdateInfo();
    setTimeout(AutoUpdateInfo, 1000);
}

