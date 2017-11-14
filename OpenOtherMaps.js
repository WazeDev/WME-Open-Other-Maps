// ==UserScript==
// @name         WME Open Other Maps
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2017.11.07.01
// @description  Links for opening external resources at the WME location
// @author       JustinS83
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function init(){
        $('.olControlAttribution').css("right", "300px");
        var $section = $("<div>", {style:"padding:8px 16px"});
        $section.html([
            '<span id="GMaps">',
            '<img src="http://i.imgur.com/whsQQFE.png" alt="Google Maps" width="18" height="18" id="GMapsImg" title="Open in Google Maps" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">',
            '</span>'
        ].join(' '));

        $('.WazeControlPermalink').append($section.html());

        $('#GMapsImg').click(function(){
            let projI = new OpenLayers.Projection("EPSG:900913");
            let projE = new OpenLayers.Projection("EPSG:4326");
            let center_lonlat = (new OpenLayers.LonLat(Waze.map.center.lon, Waze.map.center.lat)).transform(projI,projE);
            let lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
            let lon = Math.round(center_lonlat.lon * 1000000) / 1000000;
            let lang = I18n.currentLocale().replace("en-US", "en");

			window.open('https://www.google.com/maps/@' + lat + ',' + lon + ',' + ( W.map.zoom + 12) + 'z' + (lang != "" ? "?hl=" + lang : ""), 'Google Maps');

        });

        var $sectionMapillary = $("<div>", {style:"padding:8px 16px"});
        $sectionMapillary.html([
            '<span id="Mapillary">',
            '<img src="https://i.imgur.com/vG2qieS.png" alt="Mapillary" width="18" height="18" id="MapillaryImg" title="Open in Mapillary" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">',
            '</span>'
        ].join(' '));

		$('.WazeControlPermalink').append($sectionMapillary.html());

		$('#MapillaryImg').click(function(){
			var projI=new OpenLayers.Projection("EPSG:900913");
            var projE=new OpenLayers.Projection("EPSG:4326");
			var center_lonlat = (new OpenLayers.LonLat(Waze.map.center.lon, Waze.map.center.lat)).transform(projI,projE);
			var lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
			var lon = Math.round(center_lonlat.lon * 1000000) / 1000000;

			window.open('https://www.mapillary.com/app/?lat=' + lat + '&lng=' + lon + '&z=' +( W.map.zoom + 11), 'Mapillary');
		});

        var $sectionTerraserver = $("<div>", {style:"padding:8px 16px"});
        $sectionTerraserver.html([
            '<span id="Terraserver">',
            '<img src="https://imgur.com/IPUFNnR.png" alt="Terraserver" width="18" height="18" id="TerraserverImg" title="Open in Terraserver" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">',
            '</span>'
        ].join(' '));

        $('.WazeControlPermalink').append($sectionTerraserver.html());

        $('#TerraserverImg').click(function(){
			var center_lonlat=OpenLayers.Layer.SphericalMercator.inverseMercator(Waze.map.getCenter().lon,Waze.map.getCenter().lat);
			window.open('http://www.terraserver.com/view?utf8=✓&searchLng='+center_lonlat.lon+'&searchLat='+center_lonlat.lat);
		});
    }

    function bootstrap(tries) {
        tries = tries || 1;

        if (window.W &&
            window.W.map &&
            window.W.model &&
            $) {
            init();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
        }
    }

    bootstrap();
})();
