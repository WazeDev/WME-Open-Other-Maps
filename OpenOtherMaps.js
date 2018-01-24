// ==UserScript==
// @name         WME Open Other Maps
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2018.01.24.02
// @description  Links for opening external resources at the WME location
// @author       JustinS83
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com*
// @include      https://www.google.com/maps*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @resource     jqUI_CSS  https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

(function() {
    'use strict';
    var jqUI_CssSrc = GM_getResourceText("jqUI_CSS");
    GM_addStyle(jqUI_CssSrc);

    var settings = {};

    function initInterface(){
        var $section = $("<div>");
        $section.html([
            '<div>',
            "<p>The below maps are for <span style='color:red; font-weight:bold;'>reference only</span> and <b>no data</b> should be copied from them as it violates copyright.</br>",
            '<div><input type="checkbox" id="chkGMaps" class="OOMchk"><label for="chkGMaps"><img src="http://i.imgur.com/whsQQFE.png" height="18" width="18">Google Maps</label></div>',
            '<div><input type="checkbox" id="chkMapillary" class="OOMchk"><label for="chkMapillary"><img src="https://i.imgur.com/vG2qieS.png" height="18" width="18">Mapillary</label></div>',
            '<div><input type="checkbox" id="chkTerraserver" class="OOMchk"><label for="chkTerraserver"><img src="https://imgur.com/IPUFNnR.png" height="18" width="18">Terraserver</label></div>',
            '<div><input type="checkbox" id="chkWikimapia" class="OOMchk"><label for="chkWikimapia"><img src="https://imgur.com/UsOwmvT.png" height="18" width="18">Wikimapia</label></div>',
            '<div><input type="checkbox" id="chkBing" class="OOMchk"><label for="chkBing"><img src="https://imgur.com/CF430d2.png" height="18" width="18">Bing Maps</label></div>',
            '<div><input type="checkbox" id="chkOSM" class="OOMchk"><label for="chkOSM"><img src="https://imgur.com/xVqNdmm.png" height="18" width ="18">Open Street Map</label></div>',
            '<div><input type="checkbox" id="chkYandex" class="OOMchk"><label for="chkYandex"><img src="https://imgur.com/wpoUA1E.png" height="18" width ="18">Yandex</label></div>',
            '<div><input type="checkbox" id="chkHere" class="OOMchk"><label for="chkHere"><img src="https://imgur.com/6XGwxUg.png" height="18" width ="18">Here</label></div>',
            '</br><div>',
            '<fieldsetstyle="border: 1px solid silver; padding: 8px; border-radius: 4px;">',
            '<legend style="margin-bottom:0px; border-bottom-style:none;width:auto;"><h4>Map Language (where applicable)</h4></legend>',
            '<input type="radio" name="radOOMLanguage" id="radOOMNoLang">Do not set a language</br>',
            '<input type="radio" name="radOOMLanguage" id="radOOMWMELang">Use WME language</br>',
            '<input type="radio" name="radOOMLanguage" id="radOOMCustomLang">Custom language <input type="text" name="txtOOMLanguage" id="txtOOMLanguage" style="border: 1px solid #000000;" size="4"/>',
            '</fieldset>',
            '</div>',
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
        setChecked('chkBing', settings.Bing);
        setChecked('chkOSM', settings.OSM);
        setChecked('chkYandex', settings.Yandex);
        setChecked('chkHere', settings.Here);

        if(settings.LangSetting == 0)
            setChecked("radOOMNoLang", true);
        else if(settings.LangSetting == 1)
            setChecked("radOOMWMELang", true);
        else
            setChecked("radOOMCustomLang", true);

        $('#txtOOMLanguage')[0].value = settings.CustLang;

        $('.olControlAttribution').css("right", "400px");

        LoadMapButtons();
        $('.OOMchk').change(function() {
             var settingName = $(this)[0].id.substr(3);
            settings[settingName] = this.checked;
            saveSettings();
            LoadMapButtons();
        });
        $("[id^='rad']").change(function() {
            if(isChecked("radOOMNoLang"))
                settings.LangSetting = 0;
            else if(isChecked("radOOMWMELang"))
                settings.LangSetting = 1;
            else
                settings.LangSetting = 2;
            saveSettings();
        });
        $('#txtOOMLanguage').focusout(function(){
            settings.CustLang = $('#txtOOMLanguage').val();
            saveSettings();
        });
    }

    function GetLanguage()
    {
        if(isChecked("radOOMNoLang"))
            return "";
        else if(isChecked("radOOMWMELang"))
            return I18n.currentLocale().replace("en-US", "en");
        else //Custom Language
            return $('#txtOOMLanguage').val();
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
                let lang = GetLanguage();

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
            let $sectionWikimapia = $("<div>", {style:"padding:8px 16px"});
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
                let lang = GetLanguage();
                if(lang === "")
                    lang = "en";
                window.open(`http://wikimapia.org/#${(lang !== "" ? "lang=" + lang : "")}&lat=${lat}&lon=${lon}&z=${( W.map.zoom + 12)}&m=b`);
            });
        }

        $('#OOMBing').remove();
        if(settings.Bing)
        {
            let $sectionBing = $("<div>", {style:"padding:8px 16px"});
            $sectionBing.html([
                '<span id="OOMBing">',
                '<img src="https://imgur.com/CF430d2.png" alt="Bing Maps" width="18" height="18" id="OOMBingImg" title="Open in Bing Maps" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">',
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionBing.html());

            $('#OOMBingImg').click(function(){
                let projI = new OpenLayers.Projection("EPSG:900913");
                let projE = new OpenLayers.Projection("EPSG:4326");
                let center_lonlat = (new OpenLayers.LonLat(Waze.map.center.lon, Waze.map.center.lat)).transform(projI,projE);
                let lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
                let lon = Math.round(center_lonlat.lon * 1000000) / 1000000;
                //let lang = I18n.currentLocale().replace("en-US", "en");

                window.open(`https://www.bing.com/maps?&cp=${lat}~${lon}&lvl=${( W.map.zoom + 12)}`);
            });
        }

        $('#OOMOSM').remove();
        if(settings.OSM){
            //https://www.openstreetmap.org/#map=16/39.5588/-84.2365
            let $sectionOSM = $("<div>", {style:"padding:8px 16px"});
            $sectionOSM.html([
                '<span id="OOMOSM">',
                '<img src="https://imgur.com/xVqNdmm.png" alt="Open Street Map" width="18" height="18" id="OOMOSMImg" title="Open in Open Street Maps" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">',
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionOSM.html());

            $('#OOMOSMImg').click(function(){
                let projI = new OpenLayers.Projection("EPSG:900913");
                let projE = new OpenLayers.Projection("EPSG:4326");
                let center_lonlat = (new OpenLayers.LonLat(Waze.map.center.lon, Waze.map.center.lat)).transform(projI,projE);
                let lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
                let lon = Math.round(center_lonlat.lon * 1000000) / 1000000;
                //let lang = I18n.currentLocale().replace("en-US", "en");

                window.open(`https://www.openstreetmap.org/#map=${(W.map.zoom + 12)}/${lat}/${lon}`);
            });
        }

        $('#OOMYandex').remove();
        if(settings.Yandex){
            //https://n.maps.yandex.ru/#!/?z=14&ll=46.019795%2C51.505120&l=nk%23sat
            let $sectionYandex = $("<div>", {style:"padding:8px 16px"});
            $sectionYandex.html([
                '<span id="OOMYandex">',
                '<img src="https://imgur.com/wpoUA1E.png" alt="Yandex" width="18" height="18" id="OOMYandexImg" title="Open in Yandex" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">',
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionYandex.html());

            $('#OOMYandexImg').click(function(){
                let projI = new OpenLayers.Projection("EPSG:900913");
                let projE = new OpenLayers.Projection("EPSG:4326");
                let center_lonlat = (new OpenLayers.LonLat(Waze.map.center.lon, Waze.map.center.lat)).transform(projI,projE);
                let lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
                let lon = Math.round(center_lonlat.lon * 1000000) / 1000000;
                //let lang = I18n.currentLocale().replace("en-US", "en");

                window.open(`https://n.maps.yandex.ru/#!/?z=${(W.map.zoom + 12)}&ll=${lon}%2C${lat}&l=nk%23sat`);
            });
        }

        $('#OOMHere').remove();
        if(settings.Here){
            //https://wego.here.com/?map=39.56508,-84.26224,16,normal&x=ep
            let $sectionHere = $("<div>", {style:"padding:8px 16px"});
            $sectionHere.html([
                '<span id="OOMHere">',
                '<img src="https://imgur.com/6XGwxUg.png" alt="Here" width="18" height="18" id="OOMHereImg" title="Open in Here" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">',
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionHere.html());

            $('#OOMHereImg').click(function(){
                let projI = new OpenLayers.Projection("EPSG:900913");
                let projE = new OpenLayers.Projection("EPSG:4326");
                let center_lonlat = (new OpenLayers.LonLat(Waze.map.center.lon, Waze.map.center.lat)).transform(projI,projE);
                let lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
                let lon = Math.round(center_lonlat.lon * 1000000) / 1000000;
                //let lang = I18n.currentLocale().replace("en-US", "en");

                window.open(`https://wego.here.com/?map=${lat},${lon},${(W.map.zoom + 12)},satellite&x=ep`);
            });
        }
    }

    function loadSettings() {
        var loadedSettings = $.parseJSON(localStorage.getItem("OOM_Settings"));
        var defaultSettings = {
            GMaps: true,
            Mapillary: true,
            Terraserver: true,
            Wikimapia: false,
            Bing: false,
            OSM: false,
            LangSetting: 1,
            CustLang: "",
            Yandex: false,
            Here: false
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
                Wikimapia: settings.Wikimapia,
                Bing: settings.Bing,
                OSM: settings.OSM,
                LangSetting: settings.LangSetting,
                CustLang: settings.CustLang,
                Yandex: settings.Yandex,
                Here: settings.Here
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

        if(location.href.indexOf("google.com/maps") > -1)
            bootstrapGM();
        else{
            if (W &&
                W.map &&
                W.model &&
                $ && WazeWrap.Interface) {
                initInterface();
            } else if (tries < 1000) {
                setTimeout(function () {bootstrap(tries++);}, 200);
            }}
    }

    function initGoogleMaps(){
        let $OOMWazeButton = document.createElement("div");
        $OOMWazeButton.innerHTML = '<div id="OOMWazeButtonDiv" style="height:30px; width:34px; position: fixed; right:30px; top:75px; cursor: pointer; background-image: url(https://imgur.com/NTLWfFz.png); background-repeat: no-repeat;" title="Open in WME"></div>';
        let parent = document.getElementById("content-container");
        parent.appendChild($OOMWazeButton);

        document.getElementById("OOMWazeButtonDiv").addEventListener("click", GMToWaze);
    }

    function GMToWaze(){
        let lon, lat, zoom;
        let curURL = location.href.split('@').pop().split(',');
        lon = curURL[1];
        lat = curURL[0];
        zoom = parseInt(curURL[2]);
        window.open(`https://www.waze.com/en-US/editor/?lon=${lon}&lat=${lat}&zoom=${(Math.max(0,Math.min(10,(zoom - 12))))}`);
    }

    function bootstrapGM(tries = 1){
        if(document.readyState !== 'complete' )
            setTimeout(function() {bootstrapGM(tries++);}, 200);
        else
            initGoogleMaps();
    }


    bootstrap();
})();
