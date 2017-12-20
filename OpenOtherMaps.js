// ==UserScript==
// @name         WME Open Other Maps
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2017.12.19.01
// @description  Links for opening external resources at the WME location
// @author       JustinS83
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js?version=229392
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var settings = {};

    function initInterface(){
        var $section = $("<div>");
        $section.html([
            '<div>',
            '<div><input type="checkbox" id="chkGMaps" class="OOMchk"><label for="chkGMaps"><img src="http://i.imgur.com/whsQQFE.png" height="18" width="18">Google Maps</label></div>',
            '<div><input type="checkbox" id="chkMapillary" class="OOMchk"><label for="chkMapillary"><img src="https://i.imgur.com/vG2qieS.png" height="18" width="18">Mapillary</label></div>',
            '<div><input type="checkbox" id="chkTerraserver" class="OOMchk"><label for="chkTerraserver"><img src="https://imgur.com/IPUFNnR.png" height="18" width="18">Terraserver</label></div>',
            '<div><input type="checkbox" id="chkWikimapia" class="OOMchk"><label for="chkWikimapia"><img src="https://imgur.com/UsOwmvT.png" height="18" width="18">Wikimapia</label></div>',
            '</div>'
        ].join(' '));

        new WazeWrap.Interface.Tab('OOM', $section.html(), init);
    }

    function init(){
        loadSettings();
        setChecked('chkGMaps', settings.GMaps);
        setChecked('chkMapillary', settings.Mapillary);
        setChecked('chkTerraserver', settings.Terraserver);
        setChecked('chkWikimapia', settings.Wikimapia);

        $('.olControlAttribution').css("right", "350px");

        LoadMapButtons();
        $('.OOMchk').change(function() {
             var settingName = $(this)[0].id.substr(3);
            settings[settingName] = this.checked;
            saveSettings();
            LoadMapButtons();
        });
    }

    function LoadMapButtons()
    {
        $('#OOMGMaps').remove();
        if(settings.GMaps)
        {
            var $section = $("<div>", {style:"padding:8px 16px"});
            $section.html([
                '<span id="OOMGMaps">',
                '<img src="http://i.imgur.com/whsQQFE.png" alt="Google Maps" width="18" height="18" id="OOMGMapsImg" title="Open in Google Maps" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">',
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($section.html());

            $('#OOMGMapsImg').click(function(){
                let projI = new OpenLayers.Projection("EPSG:900913");
                let projE = new OpenLayers.Projection("EPSG:4326");
                let center_lonlat = (new OpenLayers.LonLat(Waze.map.center.lon, Waze.map.center.lat)).transform(projI,projE);
                let lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
                let lon = Math.round(center_lonlat.lon * 1000000) / 1000000;
                let lang = I18n.currentLocale().replace("en-US", "en");

                window.open('https://www.google.com/maps/@' + lat + ',' + lon + ',' + ( W.map.zoom + 12) + 'z' + (lang != "" ? "?hl=" + lang : ""), 'Google Maps');
            });
        }


        //************** Mapillary *****************
        $('#OOMMapillary').remove();
        if(settings.Mapillary){
            var $sectionMapillary = $("<div>", {style:"padding:8px 16px"});
            $sectionMapillary.html([
                '<span id="OOMMapillary">',
                '<img src="https://i.imgur.com/vG2qieS.png" alt="Mapillary" width="18" height="18" id="OOMMapillaryImg" title="Open in Mapillary" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">',
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionMapillary.html());
            $('#OOMMapillaryImg').click(function(){
                var projI=new OpenLayers.Projection("EPSG:900913");
                var projE=new OpenLayers.Projection("EPSG:4326");
                var center_lonlat = (new OpenLayers.LonLat(Waze.map.center.lon, Waze.map.center.lat)).transform(projI,projE);
                var lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
                var lon = Math.round(center_lonlat.lon * 1000000) / 1000000;

                window.open(`https://www.mapillary.com/app/?lat=${lat}&lng=${lon}&z=${( W.map.zoom + 11)}`, 'Mapillary');
            });
        }


        //****************** Terraserver *********************
        $('#OOMTerraserver').remove();
        if(settings.Terraserver){
            var $sectionTerraserver = $("<div>", {style:"padding:8px 16px"});
            $sectionTerraserver.html([
                '<span id="OOMTerraserver">',
                '<img src="https://imgur.com/IPUFNnR.png" alt="Terraserver" width="18" height="18" id="OOMTerraserverImg" title="Open in Terraserver" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">',
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionTerraserver.html());
            $('#OOMTerraserverImg').click(function(){
                var center_lonlat=OpenLayers.Layer.SphericalMercator.inverseMercator(Waze.map.getCenter().lon,Waze.map.getCenter().lat);
                window.open(`http://www.terraserver.com/view?utf8=✓&searchLng=${center_lonlat.lon}&searchLat=${center_lonlat.lat}`);
            });
        }


        //********************* Wikimapia *********************
        $('#OOMWikimapia').remove();
        if(settings.Wikimapia){
            var $sectionWikimapia = $("<div>", {style:"padding:8px 16px"});
            $sectionWikimapia.html([
                '<span id="OOMWikimapia">',
                '<img src="https://imgur.com/UsOwmvT.png" alt="Wikimapia" width="18" height="18" id="OOMWikimapiaImg" title="Open in Wikimapia" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">',
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionWikimapia.html());
            $('#OOMWikimapiaImg').click(function(){
                //var center_lonlat=OpenLayers.Layer.SphericalMercator.inverseMercator(Waze.map.getCenter().lon,Waze.map.getCenter().lat);
                var projI=new OpenLayers.Projection("EPSG:900913");
                var projE=new OpenLayers.Projection("EPSG:4326");
                var center_lonlat = (new OpenLayers.LonLat(Waze.map.center.lon, Waze.map.center.lat)).transform(projI,projE);
                var lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
                var lon = Math.round(center_lonlat.lon * 1000000) / 1000000;
                window.open(`http://wikimapia.org/#lang=en&lat=${lat}&lon=${lon}&z=${( W.map.zoom + 12)}&m=b`);
            });
        }
    }

    function loadSettings() {
        var loadedSettings = $.parseJSON(localStorage.getItem("OOM_Settings"));
        var defaultSettings = {
            GMaps: true,
            Mapillary: true,
            Terraserver: true,
            Wikimapia: false
        };
        settings = loadedSettings ? loadedSettings : defaultSettings;
        for (var prop in defaultSettings) {
            if (!settings.hasOwnProperty(prop))
                settings[prop] = defaultSettings[prop];
        }
    }

    function saveSettings() {
        if (localStorage) {
            var localsettings = {
                GMaps: settings.GMaps,
                Mapillary: settings.Mapillary,
                Terraserver: settings.Terraserver,
                Wikimapia: settings.Wikimapia
            };

            localStorage.setItem("OOM_Settings", JSON.stringify(localsettings));
        }
    }

    function isChecked(checkboxId) {
        return $('#' + checkboxId).is(':checked');
    }

    function setChecked(checkboxId, checked) {
        $('#' + checkboxId).prop('checked', checked);
    }

    function bootstrap(tries) {
        tries = tries || 1;

        if (window.W &&
            window.W.map &&
            window.W.model &&
            $ && WazeWrap.Interface) {
            initInterface();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
        }
    }

    bootstrap();
})();
