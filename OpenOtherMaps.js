// ==UserScript==
// @name         WME Open Other Maps
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2018.02.09.02
// @description  Links for opening external resources at the WME location and WME from external resources
// @author       JustinS83
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com*
// @include      https://www.google.com/maps*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //var jqUI_CssSrc = GM_getResourceText("jqUI_CSS");
    //GM_addStyle(jqUI_CssSrc);

    var settings = {};
    var gmapsIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAIAAADZrBkAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHiSURBVDhPY/hPCPx+9eLjtg3vVy/9evr4vz9/IIIEtL1fteSev9NdbzsIepwV/+v5U6A4SNvR59fW3TuGic5uXATXAEePMuOAdjIA9SguScKKtsS5AdXd8bZbbGEw0Uj7mLMFRCfQtQxr7h4FqnDZWLX37tmTD68m7emHazsX5AhUdMbVqkFXHYjmmulBtH3YsBqq7fD9i+6baoxW5VmuLVJemgLRtiPWFajotpfdbDO9TgPNA07mEG1fjh+Garv45Lby0uTp5zfffP4gaFsLRFtRXRBEHTJ6EBv07+dPqLbe02tWXt3fdHzJqYfXNJdnAEW0liUeOe39KM0eTdvnQ3tBIQnRBkRROzvzD0w3WJUL0XP0nPffO87fDrveQYqAJ211oGhB1gZHcD1/brtdOTX7XE8bRM+tMK9bFy9g1wbX8/d+4M9PV06dOnXowIGbMYFAbWcn9d68eROLNrien7fc3r+9CpT+8eMHUOe5vo7bIR6H9+/Dog1ZT9v8udnTzr799BOi89zO7VeKsw8dOoSuDU1PYMtRIELo/P798uL56Nqw6kHXCXYtQtu2+4dx6YEgZJ0PHz6Eavv7+QAePRAE1wkHDP///fr3du7RM1smbbqNB605+vgfVMv/////AwB1kYZCu5TA6gAAAABJRU5ErkJggg==";
    var mapillaryIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABGdBTUEAALGPC/xhBQAAAatJREFUOE+tlFtLAkEUx/er9CEyA+sbRM9BH8EuWhL0oC8h9B7dFAIXoqe8RGgP9RDkipoSZkJpeQk1N8swldW108ywa3uZLKKFH7sz/3P+c2Z2Zhj8GPzmEYN3jh31mkvoLSDgBwQplsW5XyaHZl4T+HtwLjZDDVYnSiyGt8CdCVE1DSwjlUgTIViMQafXhekTB1WXwR64IuqaTASs0BQ60O9/wHEhqtM1CNiIJoCNcxGTJJ8DUezD7Nk6NU5GZ2RCldgiLsi8FCHXKIPJb4HHJg/h6o0qTsvACC9ssBBD02mTSrLIZCXiJtpqdA8SfBbGfQuqZCUDI1cmCO2uQEyunu9JZcpAe8wD5+UUjCn6lKimNhWyQyDPQU8UofxeBwdKljVLeJsMIlephbrYM6dOMnqqngdH3ANWbof0x2u38PBWpU6RaiSDE7AhruSydgcXlTT5diYPdLFDjWSWuV30ByvEBPPUasBkYEkVg41+c0hJdWuJfai2XonZZvpIqQtDjwgNvOM3rv1QQnvLKK2VfES+PbTDMPrmlW32/66RwZ2EXKVp/uFiY5hPR2AhGcMUotsAAAAASUVORK5CYII=";
    var terraIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAACSUlEQVQ4T6XUzW/SYBwHcLLEg8aTmVdv/gV6EJ6Wlj6FQV0NFhEQeRMGpmgW0BnjxlB8O0iixpdMmS5ZiB58iWMzvmRZFjfRbOyw+HryoIlZYjyRqLvsZwvPRGIHbH6T76F52s/T9tdU10qy2Wx7NBqVyOH/RRCE/YwRLXAdLIiiOOl0OreQpdUlHo9vt9lscwf26eHjOIKjU3fBcrwPDAiVWZZNFgqFDeTUxpFleaPJZDpjxmjpzhUEv95TsPiBgp7XD8A5PQv2eyPAuD1A0/S8JElGcpl2XEqU3b8mDhrgy8sqtNxlsNKpGbBlLwHCGDDGuXA4vIkQtQSDQZfQoYdnw6gO0gRJpacTwHXFQHnPbwlTSyAQCF49q42p1QLVikN5FfxEmFqagYdu9EHnwC2Qxp7XgZ0Dg2sDAx496PXVMi4PiLfzVfD6zdWDP5RJx2QEgpsC6x4ENGOowJbefth5+Vrr4Lc3NIy+MMG5xxj6R/k/TY3wELvAAi+iyt02BX8qnXzFwqmxGqLV1CMedofpxmD5HQXDE5wmoNXQSWZl8OJpBLnx1jG1K4J+v3+XzY6WErnWwWN5DIILgcPhmCFMfbxer8Vs5j/vPUzDifv1g/i76lACKUaZNlpECHUXi8X1hNBMm9VqzdB4R7nrPPsPlhjkwGJXPiFBmM1kMtvINc2j/Em28jw/rT7SkSEOeh9icHcbgaKp75FIpCedTreRU1tPqVRa5/P5ZCNDL7BmAyibPAmFQpvJ8tqTTCbblfeLyWGD6HS/AREwNmot2NXWAAAAAElFTkSuQmCC";
    var wikimapiaIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAACeklEQVQ4T5VUTWgTQRRebf2v9Te0m5nNJjuzaRuxl4LoQUMPCnoRKcWjUD14K+LFm+LFS6ngD57Eo6AXEdGDQsSDilQP2oOK6EHSmN2djaFYawrZfm+yYlpCbB88mJ33vW++997sGM0WDQ2tUzyzN2DynOJOwWeiGnL5OA6vzD5LuUFxcSVgohhwWQfZHL5fY30xhvzf6pxvUklxHyQ1xcQfkNzw2IAbSNkd2fbGGNbeYiWT8FrAxdfAkkciw1gbOs62kGUHg153IIa2txJ394HAC5gzD5LDRFJhYhj9eQplPxSTD2Joe1OWe5l6goTrROJx9xDKm1FcRuQgexJD2xuAb6mxZUuKes/gFqh7pIlXTyTmAZ6inlSZ4+L7y1+SVRHpBCae+7v6tipL7EHTvzcTIaagsNDsZStNA1kTsMxIY885QYpCnPrpZyq1Y6Y3bWP9YQnRMkd8zmPOURIRWnJC7yezJw3dEyYXAhMT0zdbXMXewnKCfy6mvFS/GeXznRjQRyierfT0pUEkx+BRyMUrmlrRzO4G+EUrEhz4m66GLivpnkIepi0elhO5LqOUymZQ3nsNZuJS0TQ3R7nc+pDJCwC+RPI0FL7Dvbrt29l+kHRgPYw9HwfOhpY4TsQGqQB4xGdOlQKKOdcC7jJ96k7ZTWtSeQ8E0ehoBzBncOA3UgMBN0u4MnpqZAUj30nMANCPWvOTooxbPhFa7kH8g1bjRXDGEX9DzW6UKe6WE4mumGKpAbQfgGeQ7en6m/rTcPFLt8GSZ6dRfpzW2iq2vR0qDoDoNBInMZk7IL6F9XmUfSw0nZTuyUqNelfHy0BPDD0lVH4camGGsQj+znJFw2F9rQAAAABJRU5ErkJggg==";
    var bingIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAAB70lEQVQ4T62TOUtDURCFn/uuiCIIojYWKhZi7y+w8S9obS1iYmJcUQIuQSsRQWy10SJErFxQ0UKwECxMXELAECMhhMQc51xzJS/kaaEXJu/lzcx3z70zYwD4F1M/1dPTqJqaAp8lTieKHA7UyHv295/MBKKVTU6id20NfevrKBZgZQZSlfFbmQlUK2aMj8N1dIREKoWt62s0zs2hwuXKm5xtJlDdzAwMmw02n48OROJxtLvdSiWP+dMRyTAryoDS6TQCkQhaFhfVfXGTWjGdmAs1gbQi++EhHQi8vaFzZQVN8/MosNthiFXKMRmXq5AMS5BfFPV4PDi4u8Pm1RUGtrfRIHfGGFaWORpGhiUo+P6O+tlZuI+P1X+um2AQy6en6F5dRanAdIvIsga9RKNoXlhAlySd+P2IJRLqO9eExLDCzPkV9CygNqmaMTqKjqUlXD49qbZIfnyoFlGgfIpyq/Ygd8TyD+/t4TYUQkoAaolvaHdXxTInvyLZhbKZ9BqL4TwQYND3unh8xODODsqlepZV04rGvF46TOs+HMbI/v7XZtIG1RlI3qrROA68YJuoCouieDIJz9kZWnlXsgn7SDempSLtKJeRYBIHt39jQyngmOgKMS4bQjOBdBCfTOL0F8p4UIHu5FyAtm/Q3w3GJ+jeRjZzKMG3AAAAAElFTkSuQmCC";
    var osmIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAAEAUlEQVQ4T32Ue0xTVwDGL1vYw7kty+YykJAtY2FuIYASgyzBGTNn1Lm4ZE83idPJssUZ1i0ukT8U2YZBNGGMAUJb2tIHUAqUR73lJX15y20F2gJFkL54tLS08hLd49tpQaPZ40u+nD/O+X73O+eee6m+kORldlZmMfqkDYxHnMWy5eus3u4X7MGeA9qpBq50+MKQyFZQr/cKs/qnBU9c8ys3WgOqT2yBDvlwsKuUul/GWWkvAcE4Wo0+b+3KUIgG42uG2iWBYqwMSmsp5L0S0IxmpdvUBxXThTptNWx+tQ9A1BqGgHySE4xXAsbKg8EhgNmnADMjR5uDB4GhBDqrBd6l25hdvoPpxRW452/BOhOErFMBs1v5yhqGimpiS9OZGQn0k0LoBypxdUoMk68eV8ZroDYZI+GwJxdW7bp5C8P+RZinQ/iprOLkGoeiWJfy4EioE9bAZQxOtcDkrkWXswpc9a+RYIA08RMHV34nrW5jIrSMfu98xA0ao3sNQ1GWuTaxNajCoL8Vg7MtMAxXQ2j7mYAkcJBQuEF4dNxcxo3gMgZ9C/dA2jEPUlMzYimAihoINHuII2dzzS5Dnb0Ichsfks4W2AOLkXDYo3NLBLIKuGvd+CSSk9M3Urxu3mOGyZpl44wMrEsKZkyILlcV6AkxqhrrMUCCQ/4FWO5rcdcj5CEqAzudkJDwaHhn0fRIBW2YroHeTt7amACmmWbQTikq6ppQLKz9B2CAeDy4BDfZ6qlzRXnx8UnPREB8+myefkoE/XU+dKN8GJw0cS+qlT3YtWc/uI3tD0DCZ+WYW4CovfGPdz98+8XY2FefDYOiCkWc93QeATQuPrpZEQwWGU4XfIuiH49h74G9+Or7wxC0i9FqNEBlNpGxE0KVFHIND+crc/cnJiY+GQZR3TbZp+wUaeFug8ZZh29ys/HWzl3Yt2c7fhOVkrtUhdreYojpQkhVhbioOoXyjrNQmiV/fnxs3zaCeDgC6vP0CLvccjCTCnx98gu8mbkD6ekZ+JJzCJfJp6EbUqP/uhysvQ5X+rmoYM/gkvkMyrR5dhJ/LgIhekg1XuPQORTIzvkcGelvIC1tK45zskBrfkHvjWZoJzpw1UVgPiUUoyWo7M8D15KP8/R3fJJfbXPw+O6nmmy80JETn/21ZXMaklNSwcnPhtp+CS10iVPSU8honTWLOmc7GE8r5MMXwbXmo9x0ev4H/pHDEciaooleF5YcZTenbLqTtm1rHyf/qPCdj3Z8QOZeIn5+w4anU3IvZOdUKouk5wQ5xe9zdmetX//Ia2RuXRhwT3FxcY9nZm45tHN7SsGmpKTMmJiYBxesKvy7iCZe3cp/KQyLT4pcrP9f+K+iqL8B4XkGClAVarkAAAAASUVORK5CYII=";
    var yandexIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAABa0lEQVQ4T62TPc8BQRSF/SdfER8FFZH4ASoSnYpCIkGCjoRGpaHS04iWUqHS+0hQoxPHnR12dnauxvtu8uTOPfecm9lN1gPgX2HFv8CKGpsNMJkAg4Gs6zXJjO8NK1qcz0CzCaTTQCQC+P2yJpNS5zIEK1rUakAgAHi9JkLvdMhm5gzBYrmUtxFhcbNMBshmZQ0GpR6LwfK5slpjUyqp24jX2++BxwM4HIB2W82Ez5XVGptEQoUuF5Icz+mkZsLnymqNTTSqQvc7SY7ndlMzgSurNTaFggqMx3LJ8wlcr8BopGa5HNn1rNbYzGZAKCRDolYqQLcLlMtAOKwWDodk17Nao1EsqiCH+H7bLVn1nNYY5POAz8cvbLXIYmYMwWCxAOp1IJVSy+JxYLWisek3hK/0empho0ES4yFYkeWzUPxBxyNJjIdgRZbPwumUWmb+hhVZ+n2gWqUjM3PAiizzObDb0ZGZOWDF34HnBbQcm5EIFazJAAAAAElFTkSuQmCC";
    var hereIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAAB0klEQVQ4T62RSy9DURSF+69U79XWq9p6NDEgMRAxEI1XQjqQGBATP8AjaElJKxGPlqLCmDAyEI8IpYKqViJ+wLLPuXo5vSclavDl7L3W2evs5JgA/CtSsRikYjFIxWIwCGvrG1iLbFIp6oyd+B4dRv07QrOyGkFpWQ3hQHRjiyRNj25uw+FuhFmt5l5f/6Du5SM03X0+KHYXVIKd8d19kmFivZmCzIoWqNhc8HYPcC8fg+Dt6ofF6oTF5kSFw4NO6tlmJUoVGhpbeG2x1vA7zMufF5oc7HU2wLYxq9pGg0MjSKfTCIWXea/a6VG609Xro5GvWSHoOzyUtrRV1vGA4dExkjUvEo19hrp4aGu7V/eEkHy00K/B9UiMZM1jn5b7wPGpWV0XAmR0UKhSXouycjffNrYVJ1nzVlajmA+G9J6hF4UY6PFBpVDV7ubnwuISyfK7erH4lIQ/dY/Awy38j3cIMO4TmMs+IZy4wow/iIkpP2dyOkAjxjCGXsSeH+C6O4fn7RF1qRviGp73FOpvTnH0mqErxmEZQnOcSaMpecFDaom25CUuXrNkiUOFMAgHLyk03J6hOXGG0+zvN8shFQ8p9CTzQqXR+wmpWAxS8e/A9AGMrnKfuSpKAAAAAABJRU5ErkJggg==";
    var midriveIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAASCAYAAABfJS4tAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QsdDy4g/1qyDQAAA1JJREFUOMt1lH9oVnUUxj/n+saS/lhSkBNKKJL+yCAiaQNtP2KBLgyMChuIe0P/qEgsMymzbNnmyKgIjLUpLDShpKJgQriEBhKD0IxCAyMhoyhyi7Xe+z3n6Y/37nU/6gvn3vu9nOe55/uc5x5rebSvif9fGRFnRwa3/9rS1QOIkcEdtJR7F4HdCgTw18jAM6daynu7gIcAAT+UQKM1Gs2gNEAC0zctXT0dI4PP/gTQ0rVnMdJRjMYi8xywDMVyzNqrGJaWiJhTpKoXYRKYsVziQHP51TUCJ9gv1Giq4f4AkGIS4QXFeEkKTEIGJhA2CjoPdGJGFa9WkvYaXJTZWiRUPVJxNGBqaidmL05XVyKcwGTimGBY8qNm1g38I1FXqOKCTUAdClBBahQywxeHd0dtA5QkATEmRfnE0Es/N2/sziLysikbBjYCh2T2iaS7gcdBqwQlapzVxqzs3PUAqKPgPV8KOcCdwIWVnS8Me6WyW8bpL9/bdRg43LT++frM7Fqhr0x0mWWHMOY5SYpGYEOx/baky83LgNXAakKDTet3bDGyVzDaJd0IXBFwAPl1VJs6y0QKpemuA3nJw+e7V2wA+13oEUwDkrYZ9hRm/ZZpYbheAzpnQrzKWzNWofE85gUSW0BNiOOGvS40cPL9nglgYsWD23+zOYiI2TyZh+PuuCfcE8kTyQMPfy653+wRYyeP9Gz92338jnVPFyR+IoUzHQApEikKjkiU3H2OCgIY//rDfX23r9vab7I9AKc+6KuVlIe/a9gvwOKaFB7UrA1kKYL/iI8AkseVleRjMz+8/P4tL0eod3Li0vXJ/VxeNN8lkl/mKKWiYrPqaCjW6SqxfwdWD/x5U8dmFl11NWNHendOJ91y3xNnkJYUuczs1yxXzHg/VeyHUuRDQHNlEqYWTM2SLfdkVmDy5DN/PLLcndydSnEvnpcAfP/pWxc8dHDpvZu7Lxx/hzMfv0HDPWUAbmjf9HCefG2lsEMlEhWPWmR5cvIU5MnJowhPrQDL1jzG+eH9Bz38UkNbeVtDW7nu4ucDXLNqo6WIJ1OEJU8G4Mnrqu5ykvvCUpo3NgFY0dBWbj372dvHq6DYR2a3Af0NbeU3gXpJd80ZtqNAfTHufvwXtm8nDnLoEBMAAAAASUVORK5CYII=";

    function initInterface(){
        var $section = $("<div>");
        $section.html([
            '<div>',
            '<p>The below maps are legal to use and do not violate copyright</p>',
            `<div><input type="checkbox" id="chkMiDrive" class="OOMchk"><label for="chkMiDrive"><img src="${midriveIcon}" height="18" width="18">MiDrive</label></div>`,
            '</br>',
            "<p>The below maps are for <span style='color:red; font-weight:bold;'>reference only</span> and <b>no data</b> should be copied from them as it violates copyright.</p>",
            `<div><input type="checkbox" id="chkGMaps" class="OOMchk"><label for="chkGMaps"><img src="${gmapsIcon}" height="18" width="18">Google Maps</label></div>`,
            `<div><input type="checkbox" id="chkMapillary" class="OOMchk"><label for="chkMapillary"><img src="${mapillaryIcon}" height="18" width="18">Mapillary</label></div>`,
            `<div><input type="checkbox" id="chkTerraserver" class="OOMchk"><label for="chkTerraserver"><img src="${terraIcon}" height="18" width="18">Terraserver</label></div>`,
            `<div><input type="checkbox" id="chkWikimapia" class="OOMchk"><label for="chkWikimapia"><img src="${wikimapiaIcon}" height="18" width="18">Wikimapia</label></div>`,
            `<div><input type="checkbox" id="chkBing" class="OOMchk"><label for="chkBing"><img src="${bingIcon}" height="18" width="18">Bing Maps</label></div>`,
            `<div><input type="checkbox" id="chkOSM" class="OOMchk"><label for="chkOSM"><img src="${osmIcon}" height="18" width ="18">Open Street Map</label></div>`,
            `<div><input type="checkbox" id="chkYandex" class="OOMchk"><label for="chkYandex"><img src="${yandexIcon}" height="18" width ="18">Yandex</label></div>`,
            `<div><input type="checkbox" id="chkHere" class="OOMchk"><label for="chkHere"><img src="${hereIcon}" height="18" width ="18">Here</label></div>`,
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
        setChecked('chkMiDrive', settings.MiDrive);

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
        $('#OOMMiDrive').remove();
        if(settings.MiDrive)
        {
            let $section = $("<div>", {style:"padding:8px 16px"});
            $section.html([
                '<span id="OOMMiDrive">',
                `<img src="${midriveIcon}" alt="MiDrive" width="18" height="18" id="OOMMiDriveImg" title="Open in MiDrive" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($section.html());

            $('#OOMMiDriveImg').click(function(){
                var topleft= (new OpenLayers.LonLat(Waze.map.getExtent().left,Waze.map.getExtent().top));
                var bottomright= (new OpenLayers.LonLat(Waze.map.getExtent().right,Waze.map.getExtent().bottom));
                var xmin = topleft.lon;
                var xmax = bottomright.lon;
                var ymin = bottomright.lat;
                var ymax = topleft.lat;

                window.open('http://mdotnetpublic.state.mi.us/drive/Default.aspx?xmin=' + xmin + '&xmax=' + xmax + '&ymin=' + ymin + '&ymax=' + ymax + '&lc=true&cam=true&tb=false&bc=false&bh1=false&bh2=false&sensor=false&inc=true&mp=false&sign=false&mb=false&cps=false&aps=false&bing=false&source=social&rsp=false&rest=false&park=false&plow=false', 'MiDrive');
            });
        }

        $('#OOMGMaps').remove();
        if(settings.GMaps)
        {
            let $section = $("<div>", {style:"padding:8px 16px"});
            $section.html([
                '<span id="OOMGMaps">',
                `<img src="${gmapsIcon}" alt="Google Maps" width="18" height="18" id="OOMGMapsImg" title="Open in Google Maps" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
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
            let $sectionMapillary = $("<div>", {style:"padding:8px 16px"});
            $sectionMapillary.html([
                '<span id="OOMMapillary">',
                `<img src="${mapillaryIcon}" alt="Mapillary" width="18" height="18" id="OOMMapillaryImg" title="Open in Mapillary" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
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
                `<img src="${terraIcon}" alt="Terraserver" width="18" height="18" id="OOMTerraserverImg" title="Open in Terraserver" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
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
                `<img src="${wikimapiaIcon}" alt="Wikimapia" width="18" height="18" id="OOMWikimapiaImg" title="Open in Wikimapia" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
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
                `<img src="${bingIcon}" alt="Bing Maps" width="18" height="18" id="OOMBingImg" title="Open in Bing Maps" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
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
                `<img src="${osmIcon}" alt="Open Street Map" width="18" height="18" id="OOMOSMImg" title="Open in Open Street Maps" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
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
                `<img src="${yandexIcon}" alt="Yandex" width="18" height="18" id="OOMYandexImg" title="Open in Yandex" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
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
                `<img src="${hereIcon}" alt="Here" width="18" height="18" id="OOMHereImg" title="Open in Here" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
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
            Here: false,
            MiDrive: false
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
                Here: settings.Here,
                MiDrive: settings.MiDrive
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
                $ && WazeWrap.Ready) {
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

        document.getElementById("OOMWazeButtonDiv").addEventListener("click", function(){
            window.open(GMToWaze());
        });

        document.getElementById('OOMWazeButtonDiv').addEventListener("mouseenter",function(e) {
            document.addEventListener('keydown', copyPLHotkeyEvent);
            document.getElementsByClassName('widget-scene-canvas')[0].addEventListener('keydown', copyPLHotkeyEvent);
        });

        document.getElementById('OOMWazeButtonDiv').addEventListener('mouseleave', function() {
            document.removeEventListener('keydown', copyPLHotkeyEvent);
            document.getElementsByClassName('widget-scene-canvas')[0].removeEventListener('keydown', copyPLHotkeyEvent);
        });
    }

    var copyToClipboard = function(str) {
        var temp = document.createElement("input");
        document.body.append(temp);
        temp.value = str;
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
    };

    var copyPLHotkeyEvent = function(e) {
        if ((e.metaKey || e.ctrlKey) && (e.which === 67))
            copyToClipboard(GMToWaze());
    };

    function GMToWaze(){
        let lon, lat, zoom;
        let curURL = location.href.split('@').pop().split(',');
        lon = curURL[1];
        lat = curURL[0];
        zoom = parseInt(curURL[2]);
        return `https://www.waze.com/en-US/editor/?lon=${lon}&lat=${lat}&zoom=${(Math.max(0,Math.min(10,(zoom - 12))))}`;
    }

    function bootstrapGM(tries = 1){
        if(document.readyState !== 'complete' )
            setTimeout(function() {bootstrapGM(tries++);}, 200);
        else
            initGoogleMaps();
    }


    bootstrap();
})();
