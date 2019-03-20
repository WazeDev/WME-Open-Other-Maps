// ==UserScript==
// @name         WME Open Other Maps
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2019.03.20.01
// @description  Links for opening external resources at the WME location and WME from external resources
// @author       JustinS83
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com*
// @exclude      https://www.waze.com/user/editor*
// @include      https://www.google.com/maps*
// @include      *wv511.org/*
// @include      http://www.511virginia.org/mobile/?menu_id=incidents
// @include      https://mdotjboss.state.mi.us/MiDrive/map*
// @include      http://pkk5.rosreestr.ru*
// @include      /https?:\/\/www\.511pa\.com\/Traffic\.aspx.*/
// @include      http://newengland511.org*
// @include      https://www.mdottraffic.com*
// @include      http://www.511nj.org/trafficmap*
// @include      http://nmroads.com/mapIndex.html*
// @include      https://gis.transportation.wv.gov/measures*
// @include      https://www.mapwv.gov/flood/map*
// @include      https://roadworks.org/*
// @include      https://www.idrivearkansas.com*
// @exclude      https://www.waze.com/*/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://greasyfork.org/scripts/13097-proj4js/code/Proj4js.js
// @grant        none
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// ==/UserScript==

/* global $ */
/* global OL */
/* global WazeWrap */
/* global I18n */
/* global W */
/* global Proj4js */
/* ecmaVersion 2017 */
/* eslint curly: ["warn", "multi-or-nest"] */

(function() {
    'use strict';
    //var jqUI_CssSrc = GM_getResourceText("jqUI_CSS");
    //GM_addStyle(jqUI_CssSrc);

    const updateMessage = "Added support for opening IDrive Arkansas at the same location as WME";

    var settings = {};
    var wazerIcon = "data:image/png;base64,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";
    var gmapsIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAIAAADZrBkAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHiSURBVDhPY/hPCPx+9eLjtg3vVy/9evr4vz9/IIIEtL1fteSev9NdbzsIepwV/+v5U6A4SNvR59fW3TuGic5uXATXAEePMuOAdjIA9SguScKKtsS5AdXd8bZbbGEw0Uj7mLMFRCfQtQxr7h4FqnDZWLX37tmTD68m7emHazsX5AhUdMbVqkFXHYjmmulBtH3YsBqq7fD9i+6baoxW5VmuLVJemgLRtiPWFajotpfdbDO9TgPNA07mEG1fjh+Garv45Lby0uTp5zfffP4gaFsLRFtRXRBEHTJ6EBv07+dPqLbe02tWXt3fdHzJqYfXNJdnAEW0liUeOe39KM0eTdvnQ3tBIQnRBkRROzvzD0w3WJUL0XP0nPffO87fDrveQYqAJ211oGhB1gZHcD1/brtdOTX7XE8bRM+tMK9bFy9g1wbX8/d+4M9PV06dOnXowIGbMYFAbWcn9d68eROLNrien7fc3r+9CpT+8eMHUOe5vo7bIR6H9+/Dog1ZT9v8udnTzr799BOi89zO7VeKsw8dOoSuDU1PYMtRIELo/P798uL56Nqw6kHXCXYtQtu2+4dx6YEgZJ0PHz6Eavv7+QAePRAE1wkHDP///fr3du7RM1smbbqNB605+vgfVMv/////AwB1kYZCu5TA6gAAAABJRU5ErkJggg==";
    var mapillaryIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABGdBTUEAALGPC/xhBQAAAatJREFUOE+tlFtLAkEUx/er9CEyA+sbRM9BH8EuWhL0oC8h9B7dFAIXoqe8RGgP9RDkipoSZkJpeQk1N8swldW108ywa3uZLKKFH7sz/3P+c2Z2Zhj8GPzmEYN3jh31mkvoLSDgBwQplsW5XyaHZl4T+HtwLjZDDVYnSiyGt8CdCVE1DSwjlUgTIViMQafXhekTB1WXwR64IuqaTASs0BQ60O9/wHEhqtM1CNiIJoCNcxGTJJ8DUezD7Nk6NU5GZ2RCldgiLsi8FCHXKIPJb4HHJg/h6o0qTsvACC9ssBBD02mTSrLIZCXiJtpqdA8SfBbGfQuqZCUDI1cmCO2uQEyunu9JZcpAe8wD5+UUjCn6lKimNhWyQyDPQU8UofxeBwdKljVLeJsMIlephbrYM6dOMnqqngdH3ANWbof0x2u38PBWpU6RaiSDE7AhruSydgcXlTT5diYPdLFDjWSWuV30ByvEBPPUasBkYEkVg41+c0hJdWuJfai2XonZZvpIqQtDjwgNvOM3rv1QQnvLKK2VfES+PbTDMPrmlW32/66RwZ2EXKVp/uFiY5hPR2AhGcMUotsAAAAASUVORK5CYII=";
    var terraIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAACSUlEQVQ4T6XUzW/SYBwHcLLEg8aTmVdv/gV6EJ6Wlj6FQV0NFhEQeRMGpmgW0BnjxlB8O0iixpdMmS5ZiB58iWMzvmRZFjfRbOyw+HryoIlZYjyRqLvsZwvPRGIHbH6T76F52s/T9tdU10qy2Wx7NBqVyOH/RRCE/YwRLXAdLIiiOOl0OreQpdUlHo9vt9lscwf26eHjOIKjU3fBcrwPDAiVWZZNFgqFDeTUxpFleaPJZDpjxmjpzhUEv95TsPiBgp7XD8A5PQv2eyPAuD1A0/S8JElGcpl2XEqU3b8mDhrgy8sqtNxlsNKpGbBlLwHCGDDGuXA4vIkQtQSDQZfQoYdnw6gO0gRJpacTwHXFQHnPbwlTSyAQCF49q42p1QLVikN5FfxEmFqagYdu9EHnwC2Qxp7XgZ0Dg2sDAx496PXVMi4PiLfzVfD6zdWDP5RJx2QEgpsC6x4ENGOowJbefth5+Vrr4Lc3NIy+MMG5xxj6R/k/TY3wELvAAi+iyt02BX8qnXzFwqmxGqLV1CMedofpxmD5HQXDE5wmoNXQSWZl8OJpBLnx1jG1K4J+v3+XzY6WErnWwWN5DIILgcPhmCFMfbxer8Vs5j/vPUzDifv1g/i76lACKUaZNlpECHUXi8X1hNBMm9VqzdB4R7nrPPsPlhjkwGJXPiFBmM1kMtvINc2j/Em28jw/rT7SkSEOeh9icHcbgaKp75FIpCedTreRU1tPqVRa5/P5ZCNDL7BmAyibPAmFQpvJ8tqTTCbblfeLyWGD6HS/AREwNmot2NXWAAAAAElFTkSuQmCC";
    var wikimapiaIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAACeklEQVQ4T5VUTWgTQRRebf2v9Te0m5nNJjuzaRuxl4LoQUMPCnoRKcWjUD14K+LFm+LFS6ngD57Eo6AXEdGDQsSDilQP2oOK6EHSmN2djaFYawrZfm+yYlpCbB88mJ33vW++997sGM0WDQ2tUzyzN2DynOJOwWeiGnL5OA6vzD5LuUFxcSVgohhwWQfZHL5fY30xhvzf6pxvUklxHyQ1xcQfkNzw2IAbSNkd2fbGGNbeYiWT8FrAxdfAkkciw1gbOs62kGUHg153IIa2txJ394HAC5gzD5LDRFJhYhj9eQplPxSTD2Joe1OWe5l6goTrROJx9xDKm1FcRuQgexJD2xuAb6mxZUuKes/gFqh7pIlXTyTmAZ6inlSZ4+L7y1+SVRHpBCae+7v6tipL7EHTvzcTIaagsNDsZStNA1kTsMxIY885QYpCnPrpZyq1Y6Y3bWP9YQnRMkd8zmPOURIRWnJC7yezJw3dEyYXAhMT0zdbXMXewnKCfy6mvFS/GeXznRjQRyierfT0pUEkx+BRyMUrmlrRzO4G+EUrEhz4m66GLivpnkIepi0elhO5LqOUymZQ3nsNZuJS0TQ3R7nc+pDJCwC+RPI0FL7Dvbrt29l+kHRgPYw9HwfOhpY4TsQGqQB4xGdOlQKKOdcC7jJ96k7ZTWtSeQ8E0ehoBzBncOA3UgMBN0u4MnpqZAUj30nMANCPWvOTooxbPhFa7kH8g1bjRXDGEX9DzW6UKe6WE4mumGKpAbQfgGeQ7en6m/rTcPFLt8GSZ6dRfpzW2iq2vR0qDoDoNBInMZk7IL6F9XmUfSw0nZTuyUqNelfHy0BPDD0lVH4camGGsQj+znJFw2F9rQAAAABJRU5ErkJggg==";
    var bingIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAAB70lEQVQ4T62TOUtDURCFn/uuiCIIojYWKhZi7y+w8S9obS1iYmJcUQIuQSsRQWy10SJErFxQ0UKwECxMXELAECMhhMQc51xzJS/kaaEXJu/lzcx3z70zYwD4F1M/1dPTqJqaAp8lTieKHA7UyHv295/MBKKVTU6id20NfevrKBZgZQZSlfFbmQlUK2aMj8N1dIREKoWt62s0zs2hwuXKm5xtJlDdzAwMmw02n48OROJxtLvdSiWP+dMRyTAryoDS6TQCkQhaFhfVfXGTWjGdmAs1gbQi++EhHQi8vaFzZQVN8/MosNthiFXKMRmXq5AMS5BfFPV4PDi4u8Pm1RUGtrfRIHfGGFaWORpGhiUo+P6O+tlZuI+P1X+um2AQy6en6F5dRanAdIvIsga9RKNoXlhAlySd+P2IJRLqO9eExLDCzPkV9CygNqmaMTqKjqUlXD49qbZIfnyoFlGgfIpyq/Ygd8TyD+/t4TYUQkoAaolvaHdXxTInvyLZhbKZ9BqL4TwQYND3unh8xODODsqlepZV04rGvF46TOs+HMbI/v7XZtIG1RlI3qrROA68YJuoCouieDIJz9kZWnlXsgn7SDempSLtKJeRYBIHt39jQyngmOgKMS4bQjOBdBCfTOL0F8p4UIHu5FyAtm/Q3w3GJ+jeRjZzKMG3AAAAAElFTkSuQmCC";
    var osmIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAAEAUlEQVQ4T32Ue0xTVwDGL1vYw7kty+YykJAtY2FuIYASgyzBGTNn1Lm4ZE83idPJssUZ1i0ukT8U2YZBNGGMAUJb2tIHUAqUR73lJX15y20F2gJFkL54tLS08hLd49tpQaPZ40u+nD/O+X73O+eee6m+kORldlZmMfqkDYxHnMWy5eus3u4X7MGeA9qpBq50+MKQyFZQr/cKs/qnBU9c8ys3WgOqT2yBDvlwsKuUul/GWWkvAcE4Wo0+b+3KUIgG42uG2iWBYqwMSmsp5L0S0IxmpdvUBxXThTptNWx+tQ9A1BqGgHySE4xXAsbKg8EhgNmnADMjR5uDB4GhBDqrBd6l25hdvoPpxRW452/BOhOErFMBs1v5yhqGimpiS9OZGQn0k0LoBypxdUoMk68eV8ZroDYZI+GwJxdW7bp5C8P+RZinQ/iprOLkGoeiWJfy4EioE9bAZQxOtcDkrkWXswpc9a+RYIA08RMHV34nrW5jIrSMfu98xA0ao3sNQ1GWuTaxNajCoL8Vg7MtMAxXQ2j7mYAkcJBQuEF4dNxcxo3gMgZ9C/dA2jEPUlMzYimAihoINHuII2dzzS5Dnb0Ichsfks4W2AOLkXDYo3NLBLIKuGvd+CSSk9M3Urxu3mOGyZpl44wMrEsKZkyILlcV6AkxqhrrMUCCQ/4FWO5rcdcj5CEqAzudkJDwaHhn0fRIBW2YroHeTt7amACmmWbQTikq6ppQLKz9B2CAeDy4BDfZ6qlzRXnx8UnPREB8+myefkoE/XU+dKN8GJw0cS+qlT3YtWc/uI3tD0DCZ+WYW4CovfGPdz98+8XY2FefDYOiCkWc93QeATQuPrpZEQwWGU4XfIuiH49h74G9+Or7wxC0i9FqNEBlNpGxE0KVFHIND+crc/cnJiY+GQZR3TbZp+wUaeFug8ZZh29ys/HWzl3Yt2c7fhOVkrtUhdreYojpQkhVhbioOoXyjrNQmiV/fnxs3zaCeDgC6vP0CLvccjCTCnx98gu8mbkD6ekZ+JJzCJfJp6EbUqP/uhysvQ5X+rmoYM/gkvkMyrR5dhJ/LgIhekg1XuPQORTIzvkcGelvIC1tK45zskBrfkHvjWZoJzpw1UVgPiUUoyWo7M8D15KP8/R3fJJfbXPw+O6nmmy80JETn/21ZXMaklNSwcnPhtp+CS10iVPSU8honTWLOmc7GE8r5MMXwbXmo9x0ev4H/pHDEciaooleF5YcZTenbLqTtm1rHyf/qPCdj3Z8QOZeIn5+w4anU3IvZOdUKouk5wQ5xe9zdmetX//Ia2RuXRhwT3FxcY9nZm45tHN7SsGmpKTMmJiYBxesKvy7iCZe3cp/KQyLT4pcrP9f+K+iqL8B4XkGClAVarkAAAAASUVORK5CYII=";
    var yandexIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAABa0lEQVQ4T62TPc8BQRSF/SdfER8FFZH4ASoSnYpCIkGCjoRGpaHS04iWUqHS+0hQoxPHnR12dnauxvtu8uTOPfecm9lN1gPgX2HFv8CKGpsNMJkAg4Gs6zXJjO8NK1qcz0CzCaTTQCQC+P2yJpNS5zIEK1rUakAgAHi9JkLvdMhm5gzBYrmUtxFhcbNMBshmZQ0GpR6LwfK5slpjUyqp24jX2++BxwM4HIB2W82Ez5XVGptEQoUuF5Icz+mkZsLnymqNTTSqQvc7SY7ndlMzgSurNTaFggqMx3LJ8wlcr8BopGa5HNn1rNbYzGZAKCRDolYqQLcLlMtAOKwWDodk17Nao1EsqiCH+H7bLVn1nNYY5POAz8cvbLXIYmYMwWCxAOp1IJVSy+JxYLWisek3hK/0empho0ES4yFYkeWzUPxBxyNJjIdgRZbPwumUWmb+hhVZ+n2gWqUjM3PAiizzObDb0ZGZOWDF34HnBbQcm5EIFazJAAAAAElFTkSuQmCC";
    var hereIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAAB0klEQVQ4T62RSy9DURSF+69U79XWq9p6NDEgMRAxEI1XQjqQGBATP8AjaElJKxGPlqLCmDAyEI8IpYKqViJ+wLLPuXo5vSclavDl7L3W2evs5JgA/CtSsRikYjFIxWIwCGvrG1iLbFIp6oyd+B4dRv07QrOyGkFpWQ3hQHRjiyRNj25uw+FuhFmt5l5f/6Du5SM03X0+KHYXVIKd8d19kmFivZmCzIoWqNhc8HYPcC8fg+Dt6ofF6oTF5kSFw4NO6tlmJUoVGhpbeG2x1vA7zMufF5oc7HU2wLYxq9pGg0MjSKfTCIWXea/a6VG609Xro5GvWSHoOzyUtrRV1vGA4dExkjUvEo19hrp4aGu7V/eEkHy00K/B9UiMZM1jn5b7wPGpWV0XAmR0UKhSXouycjffNrYVJ1nzVlajmA+G9J6hF4UY6PFBpVDV7ubnwuISyfK7erH4lIQ/dY/Awy38j3cIMO4TmMs+IZy4wow/iIkpP2dyOkAjxjCGXsSeH+C6O4fn7RF1qRviGp73FOpvTnH0mqErxmEZQnOcSaMpecFDaom25CUuXrNkiUOFMAgHLyk03J6hOXGG0+zvN8shFQ8p9CTzQqXR+wmpWAxS8e/A9AGMrnKfuSpKAAAAAABJRU5ErkJggg==";
    var midriveIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAASCAYAAABfJS4tAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QsdDy4g/1qyDQAAA1JJREFUOMt1lH9oVnUUxj/n+saS/lhSkBNKKJL+yCAiaQNtP2KBLgyMChuIe0P/qEgsMymzbNnmyKgIjLUpLDShpKJgQriEBhKD0IxCAyMhoyhyi7Xe+z3n6Y/37nU/6gvn3vu9nOe55/uc5x5rebSvif9fGRFnRwa3/9rS1QOIkcEdtJR7F4HdCgTw18jAM6daynu7gIcAAT+UQKM1Gs2gNEAC0zctXT0dI4PP/gTQ0rVnMdJRjMYi8xywDMVyzNqrGJaWiJhTpKoXYRKYsVziQHP51TUCJ9gv1Giq4f4AkGIS4QXFeEkKTEIGJhA2CjoPdGJGFa9WkvYaXJTZWiRUPVJxNGBqaidmL05XVyKcwGTimGBY8qNm1g38I1FXqOKCTUAdClBBahQywxeHd0dtA5QkATEmRfnE0Es/N2/sziLysikbBjYCh2T2iaS7gcdBqwQlapzVxqzs3PUAqKPgPV8KOcCdwIWVnS8Me6WyW8bpL9/bdRg43LT++frM7Fqhr0x0mWWHMOY5SYpGYEOx/baky83LgNXAakKDTet3bDGyVzDaJd0IXBFwAPl1VJs6y0QKpemuA3nJw+e7V2wA+13oEUwDkrYZ9hRm/ZZpYbheAzpnQrzKWzNWofE85gUSW0BNiOOGvS40cPL9nglgYsWD23+zOYiI2TyZh+PuuCfcE8kTyQMPfy653+wRYyeP9Gz92338jnVPFyR+IoUzHQApEikKjkiU3H2OCgIY//rDfX23r9vab7I9AKc+6KuVlIe/a9gvwOKaFB7UrA1kKYL/iI8AkseVleRjMz+8/P4tL0eod3Li0vXJ/VxeNN8lkl/mKKWiYrPqaCjW6SqxfwdWD/x5U8dmFl11NWNHendOJ91y3xNnkJYUuczs1yxXzHg/VeyHUuRDQHNlEqYWTM2SLfdkVmDy5DN/PLLcndydSnEvnpcAfP/pWxc8dHDpvZu7Lxx/hzMfv0HDPWUAbmjf9HCefG2lsEMlEhWPWmR5cvIU5MnJowhPrQDL1jzG+eH9Bz38UkNbeVtDW7nu4ucDXLNqo6WIJ1OEJU8G4Mnrqu5ykvvCUpo3NgFY0dBWbj372dvHq6DYR2a3Af0NbeU3gXpJd80ZtqNAfTHufvwXtm8nDnLoEBMAAAAASUVORK5CYII=";
    var NYFCIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAADL0lEQVQ4T2VUSUtjQRDObRzw7kSdgyKiiCIo7stBPMw4MyB4M4mDB8E/oF48eBJUPImIDqIgiOKCJ3HfsrgkuB4EBb0paojGLC8Jz5rva19EZxrqdb+q+r6upbtN/w4R+QKxQIZ1XXdrmuaDPGLtgW4EYn15eUk23P8fMH6C0/doNDp9c3Nzd3x87He73ZrdbtcpBwcHGnW0hcPhOfj/gH+CAX8dV1dXCVBaYLT7fL7gxcWFnJycCIBydHSkhP+np6dCG3xC8HUAY/tAhp9vANknJiai/f390tPT8ya9vb3S19enhGvquB4dHY3t7+87ga2LkyR7vd7ptra2SHFxseTk5EhBQYEUFhZKSUmJVFVVSXV1tZSVlSldfn6+ZGdnS2Njo2xubkaBn0V0KSSyoAZ39fX1kpeXp8ClpaUKSMKMjAxJS0uTrKwsKSoqUmQVFRXS0dGhUkeaDyCymtCN4fn5ef/g4KAMDAzI0NAQw1Zr7pqZmanImpqa3uxjY2OyvLwsaADJArFYbMQUDAbdq6ur2u7urng8HlVY7jQ5OalSSk9Pl5qaGsFmynZ4eCiojSALRba0tKSFQiG36enpybeysqJDZGNjQ/b29mRmZkYaGhokKSlJpdXd3a2A29vbgk1lbW1N+XJeX1/X/X6/z4TPI5Q6FGqnra0t6ezsVCnl5uZKc3OzIiARbSiwEuqIIRGCeWRqHkSj0ciwWQcW3Gw2q4IzJZfLpYD0iZPx34hKIweLPQJWP0kIslgskpqaqtrc1dWl6razs/MmJIjPJMLMYv/h1bBeX1/fcZfW1lZ1RtglpuRwOATXRJxOp4qKM3WcScYGXV5eesFhI9FXnKU5FDhSWVkpiYmJUltbK+Pj43J2dqZqQ/B74aZsCq5LNBAILJAjfrrrAHC0tLTEysvLpb29XTkyfNaEM8HxTpHs/Pw89vz87AL2pyLhwA8vrQ2hOqempkKLi4sqJXaFYJLEC8wUEUkY3SbJb0Tz2aB5HcYLwKdh9v7+/oEnFic3gnroiEAHcYS629vbBzw1C/D7Bfn4jLwf2MEMBytEPWx4e3yQ9w+bDT4phrsxTKa/NeZmq7YI4fAAAAAASUVORK5CYII=";
    var rosreestrIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAABy0lEQVQ4T2PABdbvPy+w//R1h+v3nzvsP3/d4fz1+w7r9592gEoTD05evLG/b+rc/8Xldf93HDjxv6656//ClZv+3338sgGqhDC4dOvetcTU7P/Wdq7/za0c/2/ZdeC/pY3zfztHj/8tnf2/rtx+6AdVihvsO3lhVUpm4X8zSwc4BhkEYzs4e/2fv3z9//X7zwRAtWAHdU0dq2zs3XAaBMJpWYX/dxy78B+qBRPcfvLSqrii7gfIO8gat+5GNcjBxev/6cu3cBt0/PJth92HT4E1IuNDZ6+h8LfsOvj/4LkbuA26//y1Q15xJYrtIAzSjMz3C4r8f/zCTXIMOojCb2zr/r/lwHFNqDZMgMugbXsQBgWFxfxv6ZoQCtWCHYAMyi+uQjEEhHfsPfzf2y/0f2Vty/+d+49cvfX4sQxUC3ZwGBjY567f+3/55n0UfOLK3f8nL936v+Xwhf/3778XgCrHDbC5yMs35P/p6w/fz15/mPh8hs2gvkkzgAY9Ji2zohsUFpXwv6OjH3fs4AIggwpKq8H5KTYx439Ley/+2MEFjgPLnC17Dv9fvXnX/43b94Y+fvMGf+zgAmfO/Ge9deuZ6DkghgoRCRgYAAGFe4VDwIAnAAAAAElFTkSuQmCC";
    var PA511Icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACClBMVEX//vz//vv8+/r4+Pj7+vn9/Pr///709vfn6u7U2+Td4ei/ydmotc/r7fBziLHHz92+x9qsuc/y9Pf////29/fX2+b9/f7+/v79/v18j7Q9WZPO1eH//v7n6u3+///AydpbcaG5xNfO1eS2wdiyvtavu9TFzt7m6e6/x9j///3p7fDDzdu+yNkML3kaPIDk6PD5+fktSokWOYBMZpxBXZeDlLbd4us6V5EkRYTY3uhFYJUYPH/7/PtziLMzUpKRo8Pi5u0QNYA1VJOTo8Wgrsjv8/aRpMEAH25je6mltc0CKXU4V5O4w9Zddqdrgq3R1uQaPIE8WpROap8AJXJofqzGzt0AJnOFmb73+foWO4BIZJnd4u1Rap9cdKbK0d6Aj7Xr7vH8/vwZPYRHYZuotc0AJHWntM8CJ3NyiLDM1OJacqNfeKiTpMEAHnC0v9avutIAI3N6jrKYqMcAHm7Aydumss0AG22frsqKnb5feKZxhbDl6e5FYJYpSYgnSIlAXJjl6fCClLgdP4Lh5OqOn8AbPYLV3ebs7/NlfKpOaJy9x9r+/vzr7fPt7/Tz9Pbx8/b09/b29/h9kLRMZ5p/k7jZ3+l6j7ZOZ5uNn775+/v//v35+vrJ0d/t8PPu8fXd4uqvu9OMnb1Sa6F5j7XCzN78/fzQ1+K9x9m1wNaksc6aqMart8/X3ef+//0JSeH9AAAAAWJLR0QTDLtclgAAAAd0SU1FB+IDCA8HAr9f8sAAAAD7SURBVBjTY2BgYGBkZGJmZGFlgAA2dg5OLm4eXj5+AUEhYWFhBhFRTjFxYWEJYTZJKWlhYRkGWWEokBMWlldQFGZgU1JWUVUTVtfQ1NLW0dXTZzAwNDI2MTUzt7C0sraxtbNncHB0cnZxdXP38PTyFvbx9WPwDwgMCg4JDQuPiIwSjo6JZYiLT0hMSk5JTeNMzxDOzMpmyMnNyy8oLCouKS0rF66orGKorqmtq29obGpuaW1r7+jsYmDr7ullE+7rl5gQMXHS5CnCDJowhwlPnTZ9xkxhhlnCs+eYzZ03f8HCRYuXgPwyi23psuUrVq5aLb9mLRsQAP2OCgBLzD+TNb5HDAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wMy0wOFQxNTowNzowMi0wNTowMAebKzMAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDMtMDhUMTU6MDc6MDItMDU6MDB2xpOPAAAAAElFTkSuQmCC";
    var Miss511Icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAABjUlEQVQ4T2MYWsClYXM+Q/CcEoZAVGxfvakkpHWbKFQZflA272iXXOqyXwxBs/+jY8eaTf+jenfpQpXiBpuP356uV7j6B1PwHAxDQNivdfv/7BkHCBtkULTmElvYXKyGgHDipL3/21eexm/Q2iM3luHyEgwXzz3yf96u6/gNOnLlwQ6zsnX/JRKX4MT9G8/9P3DxEX6Dbj58saNvw7n/dUtP4sRHrzz8/+jFW/wGXbr7bEf+nMP/I3v34MY9u9yhynGDG0AX1S498T91yv7/KVhwzsxD/4vmHcRv0K2HL90qFx2/IZm05D9H+DysWClj+X+jojX4DVp96MZMy4oN/3GlHxCWSVn6Xy+fgEEJk/bOlAYqxGYADIvEL/qvkLEUv0Hz91yd2bP+7P+GZSf/1y87AcfiwCiHGcQdOf+/YOxC/AbtPnOXf9mus1JzNqBihfTlcIOYQ+b8Zw6bh98gXGD2jkv/PZu2/m9ddfp/84pT/6sWHiXPoFWrVjGHhq5iBtEgzPD/PyNUCgoYGACx+Fztt2VvAQAAAABJRU5ErkJggg==";
    var LAFCIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAARCAYAAADQWvz5AAABgWlDQ1BzUkdCIElFQzYxOTY2LTIuMQAAKM+Vkc8rRFEUxz/MiBhRLCiLScPKyI8SG2WkoSZNY5TBZuZ5b0bNjNd7T5Ktsp2ixMavBX8BW2WtFJGShZU1sUHPeZ6aSc3Cvd1zPvd77zndcy5UxrNKzvT2QC5vGbFwyD+TmPVXP+HBRzNeWpOKqY9EoxHKjvdbKhx/HXRy8b9Rt6CaClTUCA8rumEJjwtHVizd4S3hZiWTXBA+Ee4y5IHCN46ecvnZ4bTLnw4b8dio1NYo7E+XcKqElYyRE5bKCeSyy8rve5xKfGp+ekp8u6w2TGKECeFngjFGGaCXIbEDBOmjW3aUie/5iZ9kSWIVsTqrGCySJoNFl6jLkl0Vr4muysyy6vT/b19Nrb/Pze4LQdWjbb92QPUmfBVs++PAtr8OwfMA5/li/NI+DL6JXihqgT1oWIfTi6KW2oazDWi515NG8kfyyKrUNHg5hvoENF1B7Zzbs99zju4gviZfdQk7u9Ap9xvmvwH7o2e1G6/3lQAAAAlwSFlzAAALEgAACxIB0t1+/AAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xOdTWsmQAAAJJSURBVDhPlZRPSBRRHMfX3Zm34+JCFFoKHqIuHTxnoVSUUJAX0xWL3Cz6Y6ZphZm5TMm6amnrzJt/C3rpWl4K6iDU0Q5CaAYRdQhvarf+0AZO3zd/lhl3GegLX2YO3+9n3r73exviCLkHf208cnReVrUVWdXf3R2+/0ZS1AXm0fTYa04Q5iLR6PFQkBB4AtC3vv6BTarqJvPk42nrySxR1dxVVfWRi0ZvOJXSihBi7K6uXsxKtFDuvdlfeGduOnnqE0DziIftVglhRTNn2to/eIsp8YEPdL23bxMf1BHn7FYJCRUVjSnxYd5bzEw88oHGxifz8Xj8oFMpLdM0y6iqffEWL1256gPBEqJldiNACE55i8mui4V3WdH+SIaxz4kGi1KjDqW/bnng9h0PSF8SRbGwN2bQyrLZ7A6UfrllnxVtDasampGVoZ2VlRfY3OGARuFMKBbb4yBsUU07jdKWWx7Zdmqu6w83rGIM8rAJ4DqqxCY4wldfuGE2Ty1tiSIIc8f5zh9YyWcLxICC0OAgbCH0yg2zqW5NtBdBmDEmJsrvHRDzS9QjNgXCHVt1w+nMhJnoOFsEYWbXpaa2dtmB/AwLQpLn+ToLoijKfsyRgeAUTuj58Ejq97nOJCt+lzV9ml1kL+zYiaYN7M8Gg+FnLnPl5fUWaLuam1v3dvf03MK/wGAul4tROltDVeMZTs46jMvXurcAWsCVWcRzDhX/hgfJmn6qdgG2lM6Mz2I1TwkhBwAahN+GeT7hRP9bAsyzF2z+oQghLf8AAjyYhRxw+xIAAAAASUVORK5CYII=";
    var RoadworksIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMjHxIGmVAAACFElEQVQ4T7VTzYtpcRieLOxY2tiIzZQFykJkIkRGoixEkjSlCFkoSzv+AhulLKxmp2wpKWY7avYsuMpH+dio+9zzvhzjXuY2d3Gfejq/834853nfc87DfwGAGxJ+CqDrYrHYrdfrHxz8G+4J7fd7zGYz9Pt9zOdzDAYDHA4HIfX5oBuISZGbzYZFGo0GhsMhptMpWq2WkPqsucF1krjb7TAej1GtVtFutzGZTPD6+opKpSKkvym0XC7x/v6OYrHIjSTU6/X4XC6XsVqthLJvCBEjkQgKhQKP8vb2hmQyiVKpxGNe192AgtRACIVCyOVySKVS3ExOstkswuEwut0ubfq+COGcRL1eRyAQwMvLC2q1Go+RSCSQz+fh8/moRKw9d/6B0WhERXh6emI3NArto9lsIh6PI5PJwOVyUcl9ITFIC6ZvxWKx8EjpdJqdOZ1OPpNDk8kklH7hRkwcj0d24Pf72YHBYOBv6OPjAzqdDtFoFGazmd+g2EO84CrI1skFLVuj0bAQUa1WIxgMwuPxcP6Mr4VUKhW8Xi+en5/5SmO53W4miRDlcjmEX4/KL72/CVGSiux2OxwOB7uzWq3QarW8NxKj+OPjI2KxmNDCuBWiHUmlUt4DCRDpTM20LzFGD5JIJCRCOIkQ6IZIjmQyGWw224UKhQLb7RadTgdKpfLiVq/Xw2g0spKAkyvx8K8UcbrHwy9Ba5ZwWKd5ZwAAAABJRU5ErkJggg==";
    //var NJ511Icon = "";
    var NM511Icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAACg0lEQVQ4T6WTX0iTURjGF10k3QVO56CLQPKmDBUMUbEyDYUwXSOFlQqCf6AIIyhRWtIwRBGCJPVCqzUyNrzKNGem3yRJpvvC5qbml6bln/VtTTedzvdp06+CZGDrB4fznvc87wPnPeeI9gIg3y+EwUPzjck0WdAgLIMDXEoIfa1XkPXKMzDHDwnpfwNAKFlzMmn6qo4m8nVkjGoRtvbGB40mvFcuVzIymXKmuWiQ7yoy/xjIN6+8STSaKio1/nxvWVmpIA+MsbY2eioiAjZJOFZLJPCOFGHLfBPe/mzwcaFYCgvDYFbWW0EeGL8RJ5VivToGWJv1nRDY9G6ByDe4J+CTxOhNO6cU5H8gonD/DK41hNjEDMfr9NKFi2IQz8Lp8mCBd2N81g7rDA+Hcw2eV9dga481kim+hSzZZ/y1vyG+I5mW2xX0+ZbOM35D71LLoHrO4tFLC0obh1D1dBTlLe8x882B9SkGdl1KOxlEMnonyiHGN+bqDu8YWfMqyHJJTZZcrddcqHe35uGuhkV9x0dcrmNQ2GDYNhyfsoE3MXB0Ksw0fV1Hs1WVxN3OIffkjpEfzN85SOzJBxsjSTpXUzoswywu3OvDC4bDxBc7+kbn0GmYhrvtPha0ijYyHDhNXHmMUL6b7WZHSOGUncX64iJca5uwOXy98Wxio78Hy5FS9KSl7W723/y6NbtEAvuxKLgfVsP9uAmrykIsRR7BnFiM7tTUvRlN+N7RWELC/HBsNOvsPu+wd2WMrRjkDpNK1cAUFyuZmppTgjwwAyqVeCA3l/mk18f71zR6QkvWAjWxcdptQbDQ985M36dV01LzUSEVPDRZohbC/wMQ7RPCAIhEPwGmF45ZgI9RNAAAAABJRU5ErkJggg==";
    var WVFloodIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAIAAADZrBkAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMjHxIGmVAAACvElEQVQ4T42T3W/SUBTA+88oDCjQUr636OY+oGtH+Sg4YLBNmPsQaEtpESWbiQ/G/8DsxT27aNziXLI5xxKzrYx9RxPjHoxPJkYTE2OicvEy0Omi0eT3dHN+59xz7rmI1sXp3LyW5LXujM6VQd0cSnL6XkFP1THQ2QZGWsRo4SdNDe3lUZJHXRm9mzOQvIEWrX6pLSzjXtlURyL8sonJmb0ShGByiI7k6g5M6cnhjGRiZMKbt7Ly3Ky8W+I7orIjlC/enpq8VRCmblgY0XIsIzAaa6ZsYgvKCw8EsGMFW9jB6khgNPflRT/YsR2uTZjotMUrQhDoNGjcxxHMP5nnwLYFKCpItWJ4Xer7WiFqivpwOWZwjRB+iQjkm1q9jg86culRurptrimqmnK2yaa6jqI+WB7QdV8ifDlzQG5oEuzKGcw9e5wC22ZY5MQ5QX2wFNG0x7E+3sSICErxeoq3s+L64jiowDqnon+wqXq7TncGhzCKM1I8Ah1nUCwvjVYrpuOIP5aC2llQ1r/ZiFODPEbzCO4RpmduvlM8f7nbb3za6rw3W3R4U4gBbgOZXrk/DMr/1FSvnobOOFm0O4kYaNgbt/pwBJThuE7FnUJ1tBZWn49gvRNQg4vHl+YuV5X/0SIt7VGcSiPGPhHz5ErzY0BpgeP6dSSgTuOkgRpqmo4BjE4h0IGPtrJY/LgbAHvnQFlXd8oasGP/vEdV97trW3jDARX8aGNc2zVI+HioiTgjtrE84YolM8nNheS3lwPPV4eLkwk7GWFiQzPTo+/3Yh/243fvJMlQVN+TIHwCQvgkSyBvYSWzTzB7OZwaM3bF0M640Z0gPFesfp7wpIyuYbQjrLkQRXsSJk/a7BcQW7BgZfO2YN4eKthDV+E3sbEixBmSW/uvtYavt4YLjouy1Z+1BrIWVjQHsoRf+A79jNM0D/QKqgAAAABJRU5ErkJggg==";
    var GMDMIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAINSURBVDhPnZPfS1NhGMcf6A8QgpIVpczN82vKCCyoLvpxWdRutMn5uTGhvJEoiIl0kxeDLOqiKBqSsKCrrIyCJhGlIl14IavAMFs4IU3BmIUz9+054w3GcKF94L047/t8v+f7Puc5VBVZ95Bih0ixukhxoiQ7+8TJJtCcTvLpX8lrgBrcZYJ2t6+SbKZI7vCIqipoVjf5LHiOX8SlW4MYHn+P/icjOBS7CpKjIMmaoGZjp6iuQLWDVNe+5j8Rx0xuHuX8LhYRS6RAfhukmNeFogLF6CPJwY1HI3g9vYJnk9+R/rCIpZVCySRfKMB/qgdU3zZHgXCtUJXREE5vP3oBw5lZJMe+4Vo6i97nMxiaXCgZ/FoDTncnQXtD66TpLUJVhi/8quZwF95+nMXSz3VkcnlcfjqNHl73x+fwYuoHQvF7oLpqBrJ50+347cE3pTe6vPuyjP6xHB5OLCC7mId0Ms4JwvMkRXcJVRmqtZ/8erH2yHmMZj4Li78UEe0dAPm4iaqVFIoN0OyE2+mag504m3iAgaFR9KVeosW4wmKeh0b7E8/JHlG9Aa2t29jkMckRvmsbd/yM23WQVwfvL/OXOiAq/0EwsoM0c4qaYm5cFjqgAA+RauuiYhOozjFq1AsU4CTNHWxi3BEnW0Ax71LwnJsgW0q1ZSS7nqOv8jXiYuc/0Ph3bop4xVMFRH8AgigQaceEwpQAAAAASUVORK5CYII=";
    var PennDOTIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAQXRFWHREZXNjcmlwdGlvbgBjaHJvbWUKNi8xMy8yMDE4ICwgOTowMTo1NCBBTQpPbmUgTWFwIC0gR29vZ2xlIENocm9tZYnkUN8AAANFSURBVDhPpZPfb5NVGMd74YXxTh3grf+CXbuhkHUrqXZZMWgEg8lUYFXSICPbiEw0c0F0vwoUN+THZlZr0ETmiIYpdOuK7WCsQFiHrLRAu7qBLf2xMsYce/14+p4u0Wsvnve85znP8/l+z/Pm1eRyOf5vaPKPIrODolcccq2wU7Sug6LKQzJXeZiV5oOsqmjlGdMhnjD1oCl3saryKJtsO+k/aZCQFTXf8Ow2JytrXDz51gmequ5mhdWl5p6zOnl6qwvN6yfRbPqZ599zUmPfjvuSjnj8Bb78caOEVHWMYLGPYG6/gP6TYUqbvFS2+7Ec8GNsuYa2aQLTvn7sfbsJ3TbAYz3hmBnrVy5e/HhAQtY7rqlhOnCVdW0BEZcpa5ukwh7F2v0r33tsxOJr1Oa5bCldZ/aztiXMtqPfEYwYJcTs+J2XHdfZcOQGrx6JYu76g3e6/biG6rj/52q1OR8TEQtbenxov0jSOdAsgCXwl05CNvfG2Nh7l6oTs9R8G6J3uI3pGWF7Uac2P8rq6R9txHIsw4bjdxm8ugUWxNnDYpjVSsiO04vs/GmBLs8PhO5UycN80SMdmeRaOgdPUX58idpTQW7G1ktnc6Imq1XrVEi7J8zoZB2P50pVe2qBiPi0hcPeMd7tU9h3dpTpeyYJyGklQIjlMmsk5H7SKJUfFMsQhzdjb9N6PsoHvyj0XPSSShmlwDJAiCgP9fRdOSYhy3dTAfM6AhEbzd4EDUMKzoCPdKpciuRrlkPsL4et1A48kJC/swWImMFYpJ4P3Wm2nlHoujgmAEY1/x+A2CcSRlq8IerOKhKylJVz8IXq2Ts0yw5xhc88EaIz5oKDwhDza66YpTk9rjEXtQLQNFyAKAJyJbKL+nM53hcO9rqTTESrVcW8gJLRqTVKRg58/I6NBvc8u9wKewYLkEB4D+3+NB95FOrOLTB8o1FVXEiXMJ9eLddUiepmNllG96Ugn3oVGsXM8m5UiH0kSfN5hf2+JU6PO0knysgkDKTuVYh3A+mkgVzyJRYzJbivd9IkAK1+8dl/+5eTz31iBiLxdSDI+K3tTMY2c2uqmujUm+KfeYOp+GvMTJsI3rZxUAjmmztG5DwaBOQfz4NsOxz77pAAAAAASUVORK5CYII=";
    var BogotaIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMjHxIGmVAAADAUlEQVQ4T7WTW0hTcRzHz/8w6CUKISiioIhKikCbzpk3VApvky6ardK2uU3nZc7NzbnUxGvO27zmLUPEa5luriP24AnqIXywAjOhHpTwpad6jfLb/xwHIpOe6gc/DvzP+X7O7/f9/37MPw+p2lMn07ob5LoXt8Oy55LC9V69XOful2o8qyHZnpUQjbtVluNVRufORUXkcZFheo86Mp9z+uQ7kWga5EubrZDrplDblYfGR3pUdRQiu6oeiUWDsDjtqHCZYGwoh1Qzg6wKJ2Q6z6pPvhOV7Ua+hgLiC4ZxufAJYgyjMDeW4V5Fo/i0NdlwxTiEtNIOFNRVimdKR48/6Jq1mxf+aKq3Yu2VBN9WDonJDbN4/YzFj7UD2PxwBMvz+zA+lYLWATUicqb9QeG6Sd7RakGJ04qwIIL0ZIK3syw0GQQPTARvplkkxRHcUhCMTSlQ121AqHaP1oJUbl6qeQ7Bp2oLQcBBBoGnGBgyCZSpBMHnGRzYz8CoJhidVIB+T0Fz/qCbdhd/v82MMlrVMsfiwlkG9HhXHj3MYGFku6I0W+feFVmbbXzH4yyUtxXj+woLrZJAItkNyrxOsLnEYnEhHEX09vLq6v1BqeYe0SOhNWywWFtkYcslOH2CwcnjDO5cJXhHK8UXVjT7IR2P2PxJf1CwapbPqa4WQVvdVNDJormcgPiqEQzfaqPZwoqttfRr6K3N+IMu6Sf4YPXsNqiHRVMCwbCNRVQoQbycYLySoC+Rgvq3QaHZ03ubbW8pESdbGMDf6xJ86qNVUXG9jaDZQQEqgo1xekbbFrwUJjvBNOIPynC0v3T26nC3vEn86OlYIj5yZ7A0J8H7eRbr3DFw7hg4Ws3i2ghmKyxDyz75TtAlTZfrJn419WnFFaGeIcPuQk1XvlilMDdCKsy96B1WIqW4/2eIxnPDJ98dsQavVKbzChv/+SL1S9gn14AKrkEVDLVVIijaMPGVzk9nXCF3zif7eyTbvQERBk5BRSOhWjcn13tyU8x8oO/1/wqG+QNiJs5Og1W2+gAAAABJRU5ErkJggg==";
    var ZoomEarthIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMjHxIGmVAAADhElEQVQ4T32TXWgUVxTHB0F8FTO7Mzs7mcl+RY3GBk1VTPwINcGvULFqQPoira1t1RC1+CTxQaTUtulO8SEPbUBsaUFpQrKmrK0sWY3ZZTfRzc4StjHFRNeNawyJlkBY8/fcu5NW0fYPl7kz957fnHv+5wpvUktLy+Lh4eFKM2Ua09PTxtT0lDFwZ8DIZDJlbM3a9v9KJBMHR++Pjl1pv4yPjhzCrr07seu9Hfik8TA6utoxMnJ3LJ1O11vb36zB5GDw2vVrz8vXlUNy2SC77ZBddth1kQ+HS8K6TZXoi97Kx+LRoBX2qkwzGfzh4vdweGWIJSJsNOwlBGMgNicQmztK7NCXqfjpl0swU4Mdfv/RRRZCEKgeBwPdXc8VjwRRLyKIjUMkykiiYIm9ayJ/OticoKpXQncwgHg82sAhbW1ti7PZh2MVdBwGESlALVXh9Cn/QihQ0m0oLnXCtUzj32SXiJrtG/Hg4QOztbV1IcumMtDdCZkWRY2BilC9tQrZ8SzOf3se67eshcMtYdXalXgy+QRb6jYRROIwp09CNB5B1x9dutDfHzNOnmqiP1JdOEjkoHnNzMwg1BNC0+eNmJ2dxebaan48B5mh+mR8891XuB763RBYj+zZX2+BxNdA85qbm+PPmtoNUEqWQNGXwLNcxbETn+FR7pEh5HI5Y0/Du1TMQjZsbCQQC8zn8zz4Ze3etw0Vb5eifLUHZRVuHG06jEw2YwjhcMg4TmkXjkWOMVBtFa/H+x8eQEegHc+ePbUwwDvbq+FbrmDVGi8Hffn1OXR2thsCa/urvwUKR6PBHGIg6m743vLxHmKF9l9owcTEY2yu2wDNbYPus6PYa0M01odIJFLE7b83em9sTdXqf0DFZL+2lNkscYcUt8ybUSP73WUaij02aORYXX0NRv4aKdjPlL6brg/3hvNqqVLoGcpCpr5RCMIcclJjKpSF4hahL3UQRIZ3pY6emz1/307eruaQefVFeoM//nwJikcudDUBVZqrHnYEyooaUKVMGMi7QqML/CsischlK/xVpYZSHaxezH6ZmtBJ945dBY2GTlm46Y7t3F2HnhshJM3EFSvsdfn9/kVDfw415CZy5o3eMJrPnsbHRz7Ap42HcPaLM4hE+zA+njUTZmJHc3PzAivsvxWLxRbG43F94E6/MTU1aUxOThjkjpFKpYrYmrXtJQnCCzP4PmtswqUfAAAAAElFTkSuQmCC";
    var WI511Icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAIAAADZrBkAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMjHxIGmVAAACoUlEQVQ4T52SXUhTYRzG3yUUCRJS2IWWJEFFRjcRFXXTldRFRBB1UURmTptzQy2dpmuZmoIKlvNGrGnbzjZ3tjPnx+bIY9b82Jluc87NpWtz8yvzYyjzC/vHkVF4lS8//jz/h+d5DxxehDKJvYAy1XsBsVV/s59LnCrufNhIFbU6snBbhWFMbJqMztUeK+z4J4ky8DAnBbp7DQMHuOqww2Dj+zJV+ZqRbvfPxBJD2IeakuZonja2oC287qauZ9w1G0zgd/xZEas5gd/umF6+WkVeqyJdM8HR6WWgTOc8W6wH/259H48YHg4sJb7RzwZDKkuAwYLaM0WXa257e7tIO/JSYwcBM01ijsvXWv2LsDIl5rXNLahBUjnkr+lyny/pRChdbg8sDfoWIjnK96R7yLdQqBle39wS9f0o1zuhcOS5emY5JB7wQrLS4BJ2f79Z2wM1GUZ5VRY/iBZb4AVujeIqg6GNBuNEm31qbDYYX6CFb/LUNggQVr+o13NG0I5QGna/3hja2DrNb6vQja6ub3rmV36trF0q7/QvrsJFSTUk1G7V9Vws00tNXuXgJFQQYmIR6bIv7jn4DderPr9utd94132QrWCkYfE8zeFsPIrTfKKg5UKpTk755JQ3Lo+ACtSkQEw27phaglvhmDzztElznEdwZGatzV+hc8Tmqnd8lCqhOcRRCMmxSv1ohtT0qsVWbXB+NI7jgz5Jv4eNUecErVfe6thSaiePnop3w0gVR3MU8bmqmKzmCKaENkFEsrCdDEr5tBdQShPAEvfnKMwP6r9yMdPl0naYt2tJtmTgUcO3O0Ly8QdjUrWBT1hB0HmEnjQCxJCvqXec2dgr7HLCLFJbsmQmgcbKJyzS/gkQOXIKXo2S8tJ5hJJF/02y6DfOCv0wOzejpgAAAABJRU5ErkJggg==";
    var OHGOIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAAmCAYAAABkpNNFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAuBJREFUeNrsWL9rFEEUnjsXRUE4iI2icE1io5gggrHJna0Ec6BljDaG2Oj+BWpje2djjM0laaOQYCxswqYxKQxusDI2GxRtDKwIijZxvvHeMrfZH5M4k3iDD4abH7fvzbfz3vfeToFNjG0yy6TILBSACm0E5f93vw4BFdgIat0yTKGj+s/KsR420nOelQ93sfDndza1tsxmg9Vo/XprLfi2wSb5WtoczV8un2GlA4fE2v2VF+I3y94ctyXryBDfUSEKbKJZudY2N8Q31Xi7wNylp2I8crKfVY52M+/z+8h40hz0QF8kfB3j6nyDeZ/WMu0NcKA3vGk9lF6/cDXqY4Phrx+if+f0RdbbdVzZL7AxAgQd/sbHaK05MJxrD88q2AtyQcENSvsPij5Opfq8Lpq8UVWRN9T37IFocD0I3AxNg731IhsdV85T9GblN7xToRjCSZAAlA57zl5TFeKo8ORWm2f8rUpKvlblKkcCVdahEGy3efOR0n/vnb3UNlakbH15yoTcjYGS42vHwjmC3E9bUYugRs5BywtwMJ+m00ksaL9qq1F4TkHwo1F+SXU/DmpKLyjfxio9lEF5e7ULSrQ6QeUSBYpJktunqmIsZ/V4IaoqKLEQczJZ+F8+iCI3y16OS6/GKT018MFKoGoojxuQK/U8ASkQiHr/lS1r0CdiMsPe5LslRaIYHc9MvrWXj7cwGQygJssjg3hphCo7/gxAuK9mdNgTOArRUOGqTC5h6DNBLlbhOnAX2lDSHMVR75ETkXunUT89n2QvRar8gDwZ1Bvo6XD2E6CKceboaOGArL5NIlm0IfHadlJ+EihrvqmcGFId5VJpmywaaHqhc9QpGHlVE2NNXP4oAurjrBWaIgqd4ip+o9V0AzIH6s9Gazm5z93OTda/cFJUT9bSalu+3tiNPGUqw7sJ1OuaNLvPOL/Ov15mg+fKLUYMW3FkNH3s1m2S2wL10FQcyfJbgAEAoYVrOr+EMnkAAAAASUVORK5CYII=";
    var ArkDOTIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAKTSURBVDhPrVJLTBNRFH1R40ITY1y4ceGaxMSFiTs3blwgM6ALFIzGxIWxMSZ+NsakLEgM0YSN/DrTlk5bW/qhxVoopdAP/UorxBAEi6n4oTZUiImClc5c3+tMh6nAjjM5effde8/Jm/se2jPo08Nurz+QHguGvzmTgWRL4Nnkfm1TDDFUHLF0FLFUDK+Jyl4mncScwvkMrl8RnVjKetb9UOCiXsHidMOA6xXYQr5N1UR36SjXsombYVcyVAlp6HOiEUO3keQB7SXoeGPnbUMeMFjt8NLhAteYv/wowm4c1jeXt5mInEUa6jleHxOjZmWRmxvnjTYH9BmM8NofAI3BBMOpyN8LI20lZZ9MhhYQ03ANIW39aWWhzqHi3y9koUvbDwxnBpd3pBL7g2HhQUL3R9krkkqjvouHEOqpP6EsHNRdFoqrqxUxoc3tgW6doRInpjJwPdT539yo2+KM2KZTykKd/Q6//L0gG2lNFgiEJytxj56DpZU8HDO2iv0MvYE0DVdFIzJ1hdHTGQefzLyVjQg1+BercXrmHdxLMNV+G1Kr90lGDXTV5KTllvDj109Ba7bIQpPdCaMTIXmPZwXOXBz3UwXRoAqGuklMyPVHlmf5UCwhiwjJjHRmq7z3jQchlp/DN4UfZA1Y6j4x6p0b4Rdzn2pMCKuDrjKSSMH82tePiGs6LjlIYOn29umBcmGlWHkzSlEoFgfLoLsmN59dBEEQOiX1Fnxf0h2ra2s1xyfkBhyQykzX5Mjpfq+vE6MbknwLOHlkdDx8HjfqlSKzfRB6+401Rh7fGAj4aw12Sle+A16w/WqlaCfmlj5DsrDAI7bxiSTbji7WcBc3Z3ej1TWU53m+qIr2fkBM4xlJttdA6B91DG9ioRI2mgAAAABJRU5ErkJggg==";

    function initInterface(){
        var $section = $("<div>");
        $section.html([
            '<div>',
            "<p>The below maps are legal to use and do not violate Waze's external sources policy</p>",
            `<div><input type="checkbox" id="chkMiDrive" class="OOMchk"><label for="chkMiDrive"><img src="${midriveIcon}" height="18" width="18">MiDrive</label></div>`,
            `<div><input type="checkbox" id="chkNYFC" class="OOMchk"><img src="${NYFCIcon}" height="18" width="18">NY FC</div>`,
            `<div><input type="checkbox" id="chkrosreestr" class="OOMchk"><label for="chkrosreestr"><img src="${rosreestrIcon}" height ="18" width="18">Rosreestr</label></div>`,
            `<div><input type="checkbox" id="chkPA511" class="OOMchk"><label for="chkPA511"><img src="${PA511Icon}" height = 18 width="18">511PA</label></div>`,
            `<div><input type="checkbox" id="chkMiss511" class="OOMchk"><label for="chkMiss511"><img src="${Miss511Icon}" height=18 width="18">Mississippi 511</label></div>`,
            `<div><input type="checkbox" id="chkLAFC" class="OOMchk"><label for="chkLAFC"><img src="${LAFCIcon}" height="18" width="18">Louisiana FC</label></div>`,
            //`<div><input type="checkbox" id="chkNJ511" class="OOMchk"><label for="chkNJ511"><img src="${NJ511Icon}" height="18" width="18">New Jersey 511</label></div>`,//NJ does not directly use the map at this time
            `<div><input type="checkbox" id="chkNM511" class="OOMchk"><label for="chkNM511"><img src="${NM511Icon}" height="18" width="18">New Mexico 511</label></div>`,
            `<div><input type="checkbox" id="chkWVFlood" class="OOMchk"><label for="chkWVFlood"><img src="${WVFloodIcon}" height="18" width="18">WV Flood</label></div>`,
            `<div><input type="checkbox" id="chkGMDM" class="OOMchk"><label for="chkGMDM"><img src="${GMDMIcon}" height="18" width="18">Gaia - Mexico</label></div>`,
            `<div><input type="checkbox" id="chkPennDOT" class="OOMchk"><label for="chkPennDOT"><img src="${PennDOTIcon}" height="18" width="18">PennDOT One Map</label></div>`,
            `<div><input type="checkbox" id="chkBogota" class="OOMchk"><label for="chkBogota"><img src="${BogotaIcon}" height="18" width ="18">Bogota</label></div>`,
            `<div><input type="checkbox" id="chkWI511" class="OOMchk"><label for="chkWI511"><img src=${WI511Icon} height="18" width="18">WI 511</label></div>`,
            `<div><input type="checkbox" id="chkArkDOT" class="OOMchk"><label for="chkArkDOT"><img src=${ArkDOTIcon} height="18" width="18">IDrive Arkansas</label></div>`,
            '</br>',
            "<p>The below maps are for <span style='color:red; font-weight:bold;'>reference only</span> and <b>no data</b> should be copied from them as it violates Waze's external sources policy.</p>",
            `<div><input type="checkbox" id="chkGMaps" class="OOMchk"><label for="chkGMaps"><img src="${gmapsIcon}" height="18" width="18">Google Maps</label></div>`,
            `<div><input type="checkbox" id="chkMapillary" class="OOMchk"><label for="chkMapillary"><img src="${mapillaryIcon}" height="18" width="18">Mapillary</label></div>`,
            `<div><input type="checkbox" id="chkTerraserver" class="OOMchk"><label for="chkTerraserver"><img src="${terraIcon}" height="18" width="18">Terraserver</label></div>`,
            `<div><input type="checkbox" id="chkWikimapia" class="OOMchk"><label for="chkWikimapia"><img src="${wikimapiaIcon}" height="18" width="18">Wikimapia</label></div>`,
            `<div><input type="checkbox" id="chkBing" class="OOMchk"><label for="chkBing"><img src="${bingIcon}" height="18" width="18">Bing Maps</label></div>`,
            `<div><input type="checkbox" id="chkOSM" class="OOMchk"><label for="chkOSM"><img src="${osmIcon}" height="18" width ="18">Open Street Map</label></div>`,
            `<div><input type="checkbox" id="chkYandex" class="OOMchk"><label for="chkYandex"><img src="${yandexIcon}" height="18" width ="18">Yandex</label></div>`,
            `<div><input type="checkbox" id="chkHere" class="OOMchk"><label for="chkHere"><img src="${hereIcon}" height="18" width ="18">Here</label></div>`,
            `<div><input type="checkbox" id="chkZoomEarth" class="OOMchk"><label for="chkZoomEarth"><img src="${ZoomEarthIcon}" height="18" width ="18">Zoom Earth</label></div>`,
            `<div title='Roadworks (https://roadworks.org/)'><input type="checkbox" id="chkRoadworks" class="OOMchk"><label for="chkRoadworks"><img src="${RoadworksIcon}" height="18" width ="18">Roadworks</label></div>`,
            `<div><input type="checkbox" id="chkOHGO" class="OOMchk"><label for="chkOHGO"><img src="${OHGOIcon}" height="18" width="18">OHGO</label></div>`,
            '</br><div>',
            '<fieldset style="border: 1px solid silver; padding: 8px; border-radius: 4px;">',
            '<legend style="margin-bottom:0px; border-bottom-style:none; width:auto;"><h4>Map Language (where applicable)</h4></legend>',
            '<input type="radio" name="radOOMLanguage" id="radOOMNoLang">Do not set a language</br>',
            '<input type="radio" name="radOOMLanguage" id="radOOMWMELang">Use WME language</br>',
            '<input type="radio" name="radOOMLanguage" id="radOOMCustomLang">Custom language <input type="text" name="txtOOMLanguage" id="txtOOMLanguage" style="border: 1px solid #000000;" size="4"/>',
            '</fieldset>',
            '</div>',
            '<div><fieldset style="border: 1px solid silver; padding: 8px; border-radius: 4px;">',
            '<legend style="margin-bottom: 0px; border-bottom-style:none; width: auto;"><h4>Overlay Google MyMap markers</h4></legend>',
            'MyMap link: <input type="text" name="txtOOMMyMapLink" id="txtOOMMyMapLink"/>',
            '<button id="OOMLoadMyMap">Load MyMap</button>',
            '</fieldset></div>',
            '</div>'
        ].join(' '));

        new WazeWrap.Interface.Tab('OOM', $section.html(), init);
    }

    function getolControlAttributionDivRightValue(){
        return parseInt($('.olControlAttribution').css("right").slice(0,-2));;
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
        setChecked('chkNYFC', settings.NYFC);
        setChecked('chkrosreestr', settings.rosreestr);
        setChecked('chkPA511', settings.PA511);
        setChecked('chkMiss511', settings.Miss511);
        setChecked('chkLAFC', settings.LAFC);
        setChecked('chkNM511', settings.NM511);
        //setChecked('chkNJ511', settings.NJ511);
        setChecked('chkWVFlood', settings.WVFlood);
        setChecked('chkGMDM', settings.GMDM);
        setChecked('chkBogota', settings.Bogota);
        setChecked('chkZoomEarth', settings.ZoomEarth);
        setChecked('chkRoadworks', settings.Roadworks);
        setChecked('chkWI511', settings.WI511);
        setChecked('chkOHGO', settings.OHGO);
        setChecked('chkArkDOT', settings.ArkDOT);

        if(settings.LangSetting == 0)
            setChecked("radOOMNoLang", true);
        else if(settings.LangSetting == 1)
            setChecked("radOOMWMELang", true);
        else
            setChecked("radOOMCustomLang", true);

        $('#txtOOMLanguage')[0].value = settings.CustLang;

        let annoyingDivRight = getolControlAttributionDivRightValue();
        $('.olControlAttribution').css("right", `${annoyingDivRight+100}px`);
        annoyingDivRight = getolControlAttributionDivRightValue();
        let checkedBoxes = $('.OOMchk:Checked');
        let totalButtonsWidth = 0;
        for(let i=0; i<checkedBoxes.length;i++){
            totalButtonsWidth += parseInt($(`label[for='${$(checkedBoxes[i]).attr('id')}'] img`).css('width').slice(0,-2));
        }
        $('.olControlAttribution').css("right", `${annoyingDivRight+totalButtonsWidth}px`);

        LoadMapButtons();
        $('.OOMchk').change(function() {
            var settingName = $(this)[0].id.substr(3);
            settings[settingName] = this.checked;
            saveSettings();
            LoadMapButtons();

            let btnWidth = parseInt($(`label[for='${$(this).attr('id')}'] img`).css('width').slice(0,-2));
            if(this.checked){ //add button width
                let annoyingDivRight = getolControlAttributionDivRightValue();
                $('.olControlAttribution').css("right", `${annoyingDivRight+btnWidth}px`);
            }
            else{ //subtract button width
                let annoyingDivRight = getolControlAttributionDivRightValue();
                $('.olControlAttribution').css("right", `${annoyingDivRight-btnWidth}px`);
            }
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

        $('#OOMLoadMyMap').click(loadMyMap);
        injectOLMyMapKML();
        WazeWrap.Interface.ShowScriptUpdate("WME Open Other Maps", GM_info.script.version, updateMessage, "https://greasyfork.org/en/scripts/32758-wme-open-other-maps");
    }

    async function getKML(url){
        try{
            return await $.get(url);
        }
        catch(err){
            let patt = new RegExp(/^<\?xml(?:.|\n)*<\/kml>/);
            let res = patt.test(err.responseText);
            if(res)
                return err.responseText;
            else
                console.log("Error retrieving the MyMap data\n\n" + err);
        }
    }

    async function loadMyMap(){
        let url = $('#txtOOMMyMapLink')[0].value;
        if(!url.length > 0)
            return;
        let patt = new RegExp(/^(?:http(s)?:\/\/)?www.google.com\/maps+[\w\-\._~:\/?#[\]%@!\$&\'\(\)\*\+,;=.]+$/);
        let res = patt.test(url);
        if(!res){ //not a google mymap url
            alert("This is not a valid Google MyMap URL");
            return;
        }

        let mid = url.match(/mid=(.*?)(&|$)/)[1];
        let mapKML = await getKML(`https://www.google.com/maps/d/kml?mid=${mid}&forcekml=1`);
        let parser = new OL.Format.MyMapKML();
        parser.extractStyles = true;
        parser.internalProjection = W.map.getProjectionObject();
        parser.externalProjection = new OL.Projection("EPSG:4326");

        if(W.map.getLayersByName("Google MyMap").length > 0)
            W.map.removeLayer(W.map.getLayersByName("Google MyMap")[0]);
        var OOMMyMapLayer = new OL.Layer.Vector("Google MyMap", { rendererOptions: { zIndexing: true }, uniqueName: "wme_oommymap", layerGroup: 'wme_oommymap'});
        OOMMyMapLayer.setZIndex(-9999);

        var features;
        if(mapKML.documentElement)
            features = parser.read(new XMLSerializer().serializeToString(mapKML.documentElement));
        else
            features = parser.read(mapKML);

        // check which attribute can be used for labels
        /*let maxlabels = 5000;
        var labelname = /^description|description$/;
        if (features.length <= maxlabels) {
            for (var attr in features[0].attributes) {
                if (labelname.test(attr.toLowerCase()) === true) {
                    if (typeof features[0].attributes[attr] == 'string') {
                        //layerStyle.label = '${'+attr+'}';
                        break;
                    }
                }
            }
        }*/

        OOMMyMapLayer.addFeatures(features);
        W.map.addLayer(OOMMyMapLayer);
        WazeWrap.Interface.AddLayerCheckbox("display", "Google MyMap", true, function(visible){OOMMyMapLayer.setVisibility(visible);});
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

    function get4326CenterPoint(){
        let projI = new OL.Projection("EPSG:900913");
        let projE = new OL.Projection("EPSG:4326");
        let center_lonlat = (new OL.LonLat(W.map.center.lon, W.map.center.lat)).transform(projI,projE);
        let lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
        let lon = Math.round(center_lonlat.lon * 1000000) / 1000000;
        return new OL.LonLat(lon, lat);
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
                var center = W.map.getCenter().transform(W.map.projection, W.map.displayProjection);
                window.open(`https://mdotjboss.state.mi.us/MiDrive/map?constZone=true&incidents=true&lat=${center.lat}&lon=${center.lon}&zoom=${W.map.zoom + 12}`, 'MiDrive');
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
                let latlon = get4326CenterPoint();
                let lang = GetLanguage();

                window.open('https://www.google.com/maps/@' + latlon.lat + ',' + latlon.lon + ',' + ( W.map.zoom + 12) + 'z' + (lang != "" ? "?hl=" + lang : ""), 'Google Maps');
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
                let latlon = get4326CenterPoint();

                window.open(`https://www.mapillary.com/app/?lat=${latlon.lat}&lng=${latlon.lon}&z=${( W.map.zoom + 11)}`, 'Mapillary');
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
                var center_lonlat=OL.Layer.SphericalMercator.inverseMercator(W.map.getCenter().lon,W.map.getCenter().lat);
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
                let latlon = get4326CenterPoint();
                let lang = GetLanguage();
                if(lang === "")
                    lang = "en";
                window.open(`http://wikimapia.org/#${(lang !== "" ? "lang=" + lang : "")}&lat=${latlon.lat}&lon=${latlon.lon}&z=${( W.map.zoom + 12)}&m=b`);
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
                let latlon = get4326CenterPoint();
                //let lang = I18n.currentLocale().replace("en-US", "en");

                window.open(`https://www.bing.com/maps?&cp=${latlon.lat}~${latlon.lon}&lvl=${( W.map.zoom + 12)}`);
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
                let latlon = get4326CenterPoint();
                //let lang = I18n.currentLocale().replace("en-US", "en");

                window.open(`https://www.openstreetmap.org/#map=${(W.map.zoom + 12)}/${latlon.lat}/${latlon.lon}`);
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
                let latlon = get4326CenterPoint();
                //let lang = I18n.currentLocale().replace("en-US", "en");

                window.open(`https://n.maps.yandex.ru/#!/?z=${(W.map.zoom + 12)}&ll=${latlon.lon}%2C${latlon.lat}&l=nk%23sat`);
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
                let latlon = get4326CenterPoint();

                window.open(`https://wego.here.com/?map=${latlon.lat},${latlon.lon},${(W.map.zoom + 12)},satellite&x=ep`);
            });
        }

        $('#OOMNYFC').remove();
        if(settings.NYFC){
            let $sectionNYFC = $("<div>", {style:"padding:8px 16px"});
            $sectionNYFC.html([
                '<span id="OOMNYFC">',
                `<img src="${NYFCIcon}" alt="NY FC" width="18" height="18" id="OOMNYFCImg" title="Open in NY FC" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionNYFC.html());

            $('#OOMNYFCImg').click(function(){
                let e=W.map.getExtent();
                let geoNW=new OL.Geometry.Point(e.left,e.top);
                let geoSE=new OL.Geometry.Point(e.right,e.bottom);

                Proj4js.defs["EPSG:26918"] = "+proj=utm +zone=18 +ellps=GRS80 +datum=NAD83 +units=m +no_defs";

                let source = new Proj4js.Proj('EPSG:900913');
                let dest = new Proj4js.Proj('EPSG:26918');

                geoNW = new Proj4js.Point(geoNW.x,geoNW.y);
                geoSE = new Proj4js.Point(geoSE.x,geoSE.y);

                Proj4js.transform(source, dest, geoNW);
                Proj4js.transform(source, dest, geoSE);

                let mapScale = 36111.909643;

                switch (W.map.zoom) {
                    case 0:
                    case 1:
                        mapScale = 72223.819286;
                        break;
                    case 2:
                        mapScale = 36111.909643;
                        break;
                    case 3:
                        mapScale = 18055.954822;
                        break;
                    default:
                        mapScale = 9027.977411;
                        break;
                }

                let URL='http://gis3.dot.ny.gov/html5viewer/?viewer=FC&scale='+mapScale+'&extent='+geoNW.x+'%2C'+geoNW.y+'%2C'+geoSE.x+'%2C'+geoSE.y;
                window.open(URL,"_blank");
            });
        }

        $('#OOMrosreestr').remove();
        if(settings.rosreestr){
            let $sectionRosreestr = $("<div>", {style:"padding:8px 16px"});
            $sectionRosreestr.html([
                '<span id="OOMrosreestr">',
                `<img src="${rosreestrIcon}" alt="Rosreestr" width="18" height="18" id="OOMrosreestrImg" title="Open in Rosreestr" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionRosreestr.html());

            $('#OOMrosreestrImg').click(function(){
                window.open(`http://pkk5.rosreestr.ru/#x=${W.map.center.lon}&y=${W.map.center.lat}&z=${(W.map.zoom + 12)}`);
            });
        }

        $('#OOMPA511').remove();
        if(settings.PA511){
            let $sectionPA511 = $("<div>", {style:"padding:8px 16px"});
            $sectionPA511.html([
                '<span id="OOMPA511">',
                `<img src="${PA511Icon}" alt="511PA" width="18" height="18" id="OOMPA511Img" title="Open in 511PA" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionPA511.html());

            $('#OOMPA511Img').click(function(){
                let latlon = get4326CenterPoint();
                window.open(`http://www.511pa.com/Traffic.aspx?${latlon.lat},${latlon.lon},${(W.map.zoom + 12)}z`);
            });
        }

        $('#OOMMiss511').remove();
        if(settings.Miss511)
        {
            let $section = $("<div>", {style:"padding:8px 16px"});
            $section.html([
                '<span id="OOMMiss511">',
                `<img src="${Miss511Icon}" alt="Mississippi 511" width="18" height="18" id="OOMMiss511Img" title="Open in Mississippi 511" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($section.html());

            $('#OOMMiss511Img').click(function(){
                let latlon = get4326CenterPoint();
                let lang = GetLanguage();

                window.open(`https://www.mdottraffic.com/default.aspx?lat=${latlon.lat}&lon=${latlon.lon}&zoom=${(W.map.zoom + 12)}`, 'Mississippi 511');
            });
        }

        $('#OOMLAFC').remove();
        if(settings.LAFC){
            let $sectionLAFC = $("<div>");
            $sectionLAFC.html([
                '<span id="OOMLAFC">',
                `<img src="${LAFCIcon}" alt="LAFC" width="18" height="18" id="OOMLAFCImg" title="Open in Louisiana FC Map" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionLAFC.html());
            $('#OOMLAFCImg').click(function(){
                let latlon = get4326CenterPoint();
                window.open(`http://www.arcgis.com/home/webmap/viewer.html?webmap=a37461260bec43dea7bcbf6b710a662e&center=${latlon.lon},${latlon.lat}&level=${(W.map.zoom + 12)}`);
            });
        }

        /*$('#OOMNJ511').remove();
        if(settings.NJ511){
            let $sectionNJ511 = $("<div>");
            $sectionNJ511.html([
                '<span id="OOMNJ511">',
                `<img src="${LAFCIcon}" alt="LAFC" width="18" height="18" id="OOMNJ511Img" title="Open in New Jersey 511 Map" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionNJ511.html());
            $('#OOMNJ511Img').click(function(){
                let latlon = get4326CenterPoint();
                window.open(`http://www.511nj.org/trafficmap.aspx?X=${latlon.lat}&Y=${latlon.lon}&zoom=${(W.map.zoom + 12)}`);
            });
        }*/

        $('#OOMNM511').remove();
        if(settings.NM511){
            let $sectionNM511 = $("<div>");
            $sectionNM511.html([
                '<span id="OOMNM511">',
                `<img src="${NM511Icon}" alt="New Mexico 511" width="18" height="18" id="OOMNM511Img" title="Open in New Mexico 511 Map" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionNM511.html());
            $('#OOMNM511Img').click(function(){
                let latlon = W.map.center;

                //http://nmroads.com/mapIndex.html?
                window.open(`http://nmroads.com/mapIndex.html?X=${latlon.lon}&Y=${latlon.lat}&zoom=${(W.map.zoom + 12)}`);
            });
        }

        $('#OOMWVFlood').remove();
        if(settings.WVFlood){
            let $sectionWVFlood = $("<div>");
            $sectionWVFlood.html([
                '<span id="OOMWVFlood">',
                `<img src="${WVFloodIcon}" alt="WV Flood" width="18" height="18" id="OOMWVFloodImg" title="Open in WV Flood map" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionWVFlood.html());
            $('#OOMWVFloodImg').click(function(){
                let latlon = W.map.center;

                //https://www.mapwv.gov/flood/map/?x=-8915274&y=4681300&l=4&v=0
                window.open(`https://www.mapwv.gov/flood/map/?x=${latlon.lon}&y=${latlon.lat}&l=${(W.map.zoom+4)}`);
            });
        }

        $('#OOMGMDM').remove();
        if(settings.GMDM){
            let $sectionGMDM = $("<div>");
            $sectionGMDM.html([
                '<span id="OOMGMDM">',
                `<img src="${GMDMIcon}" alt="Gaia Mexico" width="18" height="18" id="OOMGMDMImg" title="Open in Gaia Digital Mapa de Mexico" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionGMDM.html());
            $('#OOMGMDMImg').click(function(){
                let latlon = W.map.center.transform(W.map.projection, W.map.displayProjection);

                window.open(`http://gaia.inegi.org.mx/mdm6/?v=${btoa("lat:"+latlon.lat+",lon:"+latlon.lon+",z:"+(W.map.zoom+8))}`);
            });
        }

        $('#OOMPennDOT').remove();
        if(settings.PennDOT){
            let $sectionPennDOT = $("<div>");
            $sectionPennDOT.html([
                '<span id="OOMPennDOT">',
                `<img src="${PennDOTIcon}" alt="Pennsylvania OneMap" width="18" height="18" id="OOMPennDOTImg" title="Open in Pennsylvania OneMap" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionPennDOT.html());
            $('#OOMPennDOTImg').click(function(){
                let latlon = W.map.center.transform(W.map.projection, W.map.displayProjection);
                window.open(`https://www.dot7.state.pa.us/OneMap?longitude=${latlon.lon}&latitude=${latlon.lat}`);
            });
        }

        $('#OOMBogota').remove();
        if(settings.Bogota){
            let $sectionBogota = $("<div>");
            $sectionBogota.html([
                '<span id="OOMBogota">',
                `<img src="${BogotaIcon}" alt="Bogota" width="18" height="18" id="OOMBogotaImg" title="Open in Mapas Bogota" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionBogota.html());
            $('#OOMBogotaImg').click(function(){
                var topleft= (new OL.LonLat(W.map.getExtent().left,W.map.getExtent().top));
                var bottomright= (new OL.LonLat(W.map.getExtent().right,W.map.getExtent().bottom));

                let source = new Proj4js.Proj('EPSG:900913');
                var topleft4686 = new Proj4js.Point(parseFloat(topleft.lon), parseFloat(topleft.lat));
                var bottomright4686 = new Proj4js.Point(parseFloat(bottomright.lon), parseFloat(bottomright.lat));
                Proj4js.transform(source, Proj4js.WGS84, topleft4686);
                Proj4js.transform(source, Proj4js.WGS84, bottomright4686);

                let latlon = W.map.center.transform(W.map.projection, W.map.displayProjection);
                window.open(`http://mapas.bogota.gov.co/?&e=${topleft4686.x},${bottomright4686.y},${bottomright4686.x},${topleft4686.y},4686&b=261`);
            });
        }

        $('#OOMZoomEarth').remove();
        if(settings.ZoomEarth)
        {
            let $section = $("<div>", {style:"padding:8px 16px"});
            $section.html([
                '<span id="OOMZoomEarth">',
                `<img src="${ZoomEarthIcon}" alt="Zoom Earth" width="18" height="18" id="OOMZoomEarthImg" title="Open in Zoom Earth" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($section.html());

            $('#OOMZoomEarthImg').click(function(){
                let latlon = get4326CenterPoint();
                let lang = GetLanguage();
                window.open(`https://zoom.earth/#${latlon.lat},${latlon.lon},${( W.map.zoom + 12)}z,map`, 'Zoom Earth');
            });
        }

        $('#OOMRoadworks').remove();
        if(settings.Roadworks)
        {
            let $section = $("<div>", {style:"padding:8px 16px"});
            $section.html([
                '<span id="OOMRoadworks">',
                `<img src="${RoadworksIcon}" alt="Roadworks" width="18" height="18" id="OOMRoadworksImg" title="Open in Roadworks" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($section.html());

            $('#OOMRoadworksImg').click(function(){
                let latlon = get4326CenterPoint();
                window.open(`https://roadworks.org/?lng=${latlon.lon}&lat=${latlon.lat}&zoom=${( W.map.zoom + 12)}`, 'Roadworks');
            });
        }

        $('#OOMWI511').remove();
        if(settings.WI511){
            let $sectionWI511 = $("<div>", {style:"padding:8px 16px"});
            $sectionWI511.html([
                '<span id="OOMWI511">',
                `<img src="${WI511Icon}" alt="511WI" width="18" height="18" id="OOMWI511Img" title="Open in 511WI" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionWI511.html());

            $('#OOMWI511Img').click(function(){
                let latlon = get4326CenterPoint();
                window.open(`https://511wi.gov/?Latitude=${latlon.lat}&Longitude=${latlon.lon}&Zoom=${(W.map.zoom + 12)}&SelectedLayers=WeatherAlerts,Incidents#:Alerts`);
            });
        }

        $('#OOMOHGO').remove();
        if(settings.OHGO){
            let $sectionOHGO = $("<div>", {style:"padding:8px 16px"});
            $sectionOHGO.html([
                '<span id="OOMOHGO">',
                `<img src="${OHGOIcon}" alt="511WI" width="18" height="18" id="OOMOHGOImg" title="Open in OHGO" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionOHGO.html());

            $('#OOMOHGOImg').click(function(){
                let latlon = get4326CenterPoint();
                window.open(`http://www.ohgo.com/central-ohio?lt=${latlon.lat}&ln=${latlon.lon}&z=${(W.map.zoom + 12)}&ls=incident,construction,camera`);
            });
        }

        $('#OOMArkDOT').remove();
        if(settings.ArkDOT){
            let $sectionArkDOT = $("<div>", {style:"padding:8px 16px"});
            $sectionArkDOT.html([
                '<span id="OOMArkDOT">',
                `<img src="${ArkDOTIcon}" alt="IDrive Arkansas" width="18" height="18" id="OOMArkDOTImg" title="Open in IDrive Arkansas" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>'
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink').append($sectionArkDOT.html());

            $('#OOMArkDOTImg').click(function(){
                let latlon = get4326CenterPoint();
                window.open(`https://www.idrivearkansas.com/?lat=${latlon.lat}&lon=${latlon.lon}&zoom=${(W.map.zoom + 12)}`);
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
            MiDrive: false,
            NYFC: false,
            rosreestr: false,
            PA511: false,
            Miss511: false,
            LAFC: false,
            NM511: false,
            WVFlood: false,
            GMDM: false,
            PennDOT: false,
            Bogota: false,
            ZoomEarth: false,
            Roadworks: false,
            WI511: false,
            OHGO: false,
            ArkDOT: false
            //NJ511: false
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
                MiDrive: settings.MiDrive,
                NYFC: settings.NYFC,
                rosreestr: settings.rosreestr,
                PA511: settings.PA511,
                Miss511: settings.Miss511,
                LAFC: settings.LAFC,
                NM511: settings.NM511,
                WVFlood: settings.WVFlood,
                GMDM: settings.GMDM,
                PennDOT: settings.PennDOT,
                Bogota: settings.Bogota,
                ZoomEarth: settings.ZoomEarth,
                Roadworks: settings.Roadworks,
                WI511: settings.WI511,
                OHGO: settings.OHGO,
                ArkDOT: settings.ArkDOT
                //NJ511: settings.NJ511
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

    function bootstrapGeneral(initdelegate, tries = 1){
        if(document.readyState !== 'complete' )
            setTimeout(function() {bootstrapGeneral(initdelegate, tries++);}, 200);
        else
            initdelegate();
    }

    let is511PAloaded = false;
    function bootstrap511PA(tries = 1){
        if(iFrameVar.map){
            iFrameVar.map.addListener('tilesloaded', function() {
                //http://www.511pa.com/Traffic.aspx?40.85,-77.6,12z
                if(!is511PAloaded){
                    if(location.search.indexOf("?") > -1){
                        let params = location.search.split("?")[1].slice(0,-1);
                        iFrameVar.recenterMap(params);
                    }
                    is511PAloaded = true;
                }
            });
        }
        else{
            setTimeout(function(){bootstrap511PA(tries +=1);}, 100);
        }

        $(document).ready(function(){
            init511PA();
        });
    }

    function bootstrapNM511(tries = 1){
        if(map && map.extent && map.loaded)
            initNM511();
        else
            setTimeout(function() {bootstrapNM511(tries++);}, 100);
    }

    function bootstrapRoadworks(tries = 1){
        if(Elgin && Elgin.map && Elgin.map.tilesloading === false)
            initRoadworks();
        else
            setTimeout(function(){bootstrapRoadworks(tries++);}, 100);
    }

    function bootstrap(tries = 1) {
        if(location.href.indexOf("google.com/maps") > -1)
            bootstrapGeneral(initGoogleMaps, 1);
        else if(location.href.indexOf("wv511.org") > -1)
            bootstrapGeneral(initWV511, 1);
        else if(location.href.indexOf("511virginia.org") > -1)
            bootstrapGeneral(init511virginia, 1);
        else if(location.href.indexOf("https://mdotjboss.state.mi.us") > -1)
            bootstrapGeneral(initmiDrive, 1);
        else if(location.href.indexOf("http://pkk5.rosreestr.ru") > -1)
            bootstrapRosreestr(1);
        else if(location.href.indexOf("http://www.511pa.com/Traffic") > -1 || location.href.indexOf("https://www.511pa.com/Traffic") > -1)
            bootstrap511PA(1);//bootstrapGeneral(init511PA, 1);
        else if(location.href.indexOf("http://newengland511.org") > -1)
            bootstrapGeneral(initNE511, 1);
        else if(location.href.indexOf("https://www.mdottraffic.com") > -1){
            if(document.getElementById("map_canvas") != null)
                initMississipie511();
            else if(tries < 1000)
                setTimeout(function () {bootstrap(tries++);}, 200);
        }
        else if(location.href.indexOf("https://gis.transportation.wv.gov/measures") > -1)
            bootstrapGeneral(initWVGIS, 1);
        else if(location.href.indexOf("http://nmroads.com/mapIndex.html") > -1)
            bootstrapNM511(1);
        else if(location.href.indexOf("https://www.mapwv.gov/flood/map") > -1)
            bootstrapGeneral(initWVFlood, 1);
        else if(location.href.indexOf("https://roadworks.org/") > -1)
            bootstrapRoadworks(1);
        else if(location.href.indexOf("https://www.idrivearkansas.com") > -1)
                bootstrapGeneral(initArkDOT, 1);
        /*else if(location.href.indexOf("http://www.511nj.org/trafficmap") > -1){
            bootstrapGeneral(initNJ511, 1);
        }*/
        else{
            if (W &&
                W.map &&
                W.model &&
                $ && WazeWrap.Ready) {
                initInterface();
            } else if (tries < 1000) {
                setTimeout(function () {bootstrap(tries++);}, 200);
            }
        }
    }

    function RosreestrToWaze(){
        let lon, lat, zoom;
        let curURL = location.href.match(/x=(\d*.\d*)&y=(\d*.\d*)&z=(\d+)/);
        lon = curURL[1];
        lat = curURL[2];
        zoom = parseInt(curURL[3]);

        let source = new Proj4js.Proj('EPSG:900913');

        var point = new Proj4js.Point(parseFloat(lon), parseFloat(lat));
        Proj4js.transform(source, Proj4js.WGS84, point);
        return `https://www.waze.com/en-US/editor/?lon=${point.x}&lat=${point.y}&zoom=${(Math.max(0,Math.min(10,(zoom - 12))))}`;
    }

    function initRosreestr(){
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === "attributes" && mutation.target == document.getElementsByClassName("btn btn-default btn-tool-lg js-showList")[0]) insertWMELinkRosreestr();
            });
        });

        observer.observe(document.getElementById("sidebar-region"), { childList: true, subtree: true, attributes:true});

        insertWMELinkRosreestr();
    }

    function insertWMELinkRosreestr(){
        if(document.getElementById("OOMWazeButton") !== null)
            document.getElementById("OOMWazeButton").remove();

        let $OOMWazeButton = document.createElement("div");

        $OOMWazeButton.innerHTML = `<button type="button" class="btn btn-default btn-tool-lg" data-toggle="tooltip" data-placement="right" title="" id="OOMWazeButton" style="background-image: url(${wazerIcon}); background-size: 36px 36px; background-repeat: no-repeat; background-position: center;"></button>`; //'<div id="OOMWazeButtonDiv" style="height:30px; width:34px; position: fixed; right:30px; top:75px; cursor: pointer; ></div>';
        document.getElementsByClassName('btn-group-vertical js-appList')[0].appendChild($OOMWazeButton);

        document.getElementById("OOMWazeButton").addEventListener("click", function(){
            window.open(RosreestrToWaze());
        });
    }

    function bootstrapRosreestr(tries=1){
        if (document.getElementsByClassName('btn-group-vertical js-appList').length > 0) {
            initRosreestr();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrapRosreestr(tries++);}, 200);
        }
    }

    function initGoogleMaps(){
        let $OOMWazeButton = document.createElement("div");
        $OOMWazeButton.innerHTML = `<div id="OOMWazeButtonDiv" style="height:36px; width:36px; position: fixed; right:30px; top:75px; cursor: pointer; background-image: url(${wazerIcon}); background-size: 36px 36px; background-repeat: no-repeat;" title="Open in WME"></div>`;
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

    let isArkDOTLoaded = false;
    function initArkDOT(){
        map.addListener('tilesloaded', function() {
            //https://www.mdottraffic.com/default.aspx?lat=32.36435&lon=-88.70366&zoom=15
            if(!isArkDOTLoaded){
                if(location.search.indexOf("?") > -1 && location.search.indexOf("loadAlertid") === -1){
                    let params = location.search.match(/lat=(-?\d*.\d*)&lon=(-?\d*.\d*)&zoom=(\d+)/);
                    map.setCenter({lat: parseFloat(params[1]), lng: parseFloat(params[2])});
                    map.setZoom(parseInt(params[3]));
                }
                isArkDOTLoaded = true;
            }
        });

        let $OOMWazeButton = document.createElement("div");
        $OOMWazeButton.innerHTML = `<li><div class="layer_page lean_right layer_page_hidden"></div><span class="tab_container"><span class="tab"><div id="OOMWazeButtonDiv" style="height:36px; width:36px; cursor: pointer; position:absolute; top:7px; left:11px; background-image: url(${wazerIcon}); background-size: 36px 36px; background-repeat: no-repeat;" title="Open in WME"></div></span></span></li>`;
        $('#default_tabs > ul').append($OOMWazeButton);

        $('#OOMWazeButtonDiv').click(function(){
            let center = map.getCenter();
            window.open(`https://www.waze.com/en-US/editor/?lon=${center.lng()}&lat=${center.lat()}&zoom=${(Math.max(0,Math.min(10,(map.getZoom() - 12))))}`);
        });
    }

    let isMiss511Loaded = false;
    function initMississipie511(){
        map.addListener('tilesloaded', function() {
            //https://www.mdottraffic.com/default.aspx?lat=32.36435&lon=-88.70366&zoom=15
            if(!isMiss511Loaded){
                if(location.search.indexOf("?") > -1 && location.search.indexOf("loadAlertid") === -1){
                    let params = location.search.match(/lat=(-?\d*.\d*)&lon=(-?\d*.\d*)&zoom=(\d+)/);
                    map.setCenter({lat: parseFloat(params[1]), lng: parseFloat(params[2])});
                    map.setZoom(parseInt(params[3]));
                }
                isMiss511Loaded = true;
            }
        });

        let $OOMWazeButton = document.createElement("div");
        $OOMWazeButton.innerHTML = `<div id="OOMWazeButtonDiv" style="height:36px; width:36px; position: fixed; right:40px; top:83px; cursor: pointer; background-image: url(${wazerIcon}); background-size: 36px 36px; background-repeat: no-repeat;" title="Open in WME"></div>`;
        //let parent = document.getElementById("content-container");
        document.getElementById("map_canvas").appendChild($OOMWazeButton);

        document.getElementById("OOMWazeButtonDiv").addEventListener("click", function(){
            let center = map.getCenter();
            window.open(`https://www.waze.com/en-US/editor/?lon=${center.lng()}&lat=${center.lat()}&zoom=${(Math.max(0,Math.min(10,(map.getZoom() - 12))))}`);
        });
    }

    /*    function initNJ511(){
        $(document).ready(function() {
                if(location.search.indexOf("?") > -1){
                    let params = location.search.match(/X=(-?\d*.\d*)&Y=(-?\d*.\d*)&zoom=(\d+)/);
                    $("#EvetnsMap").attr('src', `http://icx1-map21x.lan.511nj.org/mapwidget/mapwidget.aspx?FullScreen=false&fss=0&njlegend=1&search=0&X=${parseFloat(params[1])}Y=${parseFloat(params[2])}&zoom=${parseFloat(params[3])}&maplegend=2&Weather=1&Congestion=1&Construction=1&Incident=1&Detour=1&SpecialEvents=1&AirportParking=0&height=100&width=100&ispercent=1&WinkCamera=2&zoom=14&refershcamera=1&refershevent=1&refershspeed=1`);
                }
        });
    }*/

    function insertWMELinkNM511(){
        if(document.getElementById("OOMWazeButton") !== null)
            document.getElementById("OOMWazeButton").remove();

        let $OOMWazeButton = document.createElement("li");

        $OOMWazeButton.innerHTML = `<span id="OOMWazeButton" style="background-image: url(${wazerIcon}); background-size: 36px 36px;"></span>`;
        document.getElementsByClassName('mapSettingsList')[0].appendChild($OOMWazeButton);

        document.getElementById("OOMWazeButton").addEventListener("click", function(){
            let source = new Proj4js.Proj('EPSG:900913');
            let center = map.extent.getCenter();
            var point = new Proj4js.Point(parseFloat(center.x), parseFloat(center.y));
            Proj4js.transform(source, Proj4js.WGS84, point);
            window.open(`https://www.waze.com/en-US/editor/?lon=${point.x}&lat=${point.y}&zoom=${(Math.max(0,Math.min(10,(map.getZoom() - 12))))}`);
        });
    }

    function initNM511(){
        if(location.search.indexOf("?") > -1){
            let params = location.search.match(/X=(-?\d*.\d*)&Y=(-?\d*.\d*)&zoom=(\d+)/);
            setTimeout(function(){
                try{
                    map.centerAt({x:parseFloat(params[1]), y:parseFloat(params[2])});
                    setTimeout(function(){map.setLevel(parseInt(params[3]));}, 500);
                }
                catch(err) {
                    console.log(err);
                }
            }, 1000);
        }

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === "attributes" && mutation.target == document.getElementsByClassName("mapSettingsList")[0]) insertWMELinkNM511();
            });
        });

        observer.observe(document.getElementsByClassName('mapSettings')[0], { childList: true, subtree: true, attributes:true});

        insertWMELinkNM511();
    }

    function insertWMELinkRoadworks(){
        if(document.getElementById("OOMWazeButton") !== null)
            document.getElementById("OOMWazeButton").remove();

        let $OOMWazeButton = document.createElement("li");
        $OOMWazeButton.style.minHeight = "60px";
        $OOMWazeButton.id = "OOMWazeButton";
        $OOMWazeButton.innerHTML = `<a href="#"><span style="background-image: url(${wazerIcon}); background-size: 36px 36px; background-repeat:no-repeat; background-position:center;"></span></a>`;
        document.getElementById('nav-main').getElementsByTagName('ul')[0].appendChild($OOMWazeButton);

        document.getElementById("OOMWazeButton").addEventListener("click", function(){
            let source = new Proj4js.Proj('EPSG:900913');
            let center = Elgin.map.getCenter();
            window.open(`https://www.waze.com/en-US/editor/?lon=${center.lng()}&lat=${center.lat()}&zoom=${(Math.max(0,Math.min(10,(Elgin.map.zoom - 12))))}`);
        });
    }

    function initRoadworks(){
        if(location.search.indexOf("?") > -1){
            let params = location.search.match(/lng=(-?\d*.\d*)&lat=(-?\d*.\d*)&zoom=(\d+)/);
            setTimeout(function(){
                try{
                    Elgin.map.setCenter({lng:parseFloat(params[1]), lat:parseFloat(params[2])});
                    setTimeout(function(){Elgin.map.setZoom(parseInt(params[3]));}, 500);
                }
                catch(err) {
                    console.log(err);
                }
            }, 1000);
        }
        insertWMELinkRoadworks();
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

    function init511PA(){
        $('#OOMWazeButtonDiv').remove();
        let $wazer = $("<div>", {style:"padding:8px 16px"});
        $wazer.html([
            '<li>',
            `<div id="OOMWazeButtonDiv" style="height:36px; width:36px;  cursor: pointer; background-image: url(${wazerIcon}); background-size: 36px 36px; background-repeat: no-repeat;" title="Open in WME"></div>`,
            '</li>'
        ].join(' '));

        $('#optMain').append($wazer.html());

        $('#OOMWazeButtonDiv').click(function(){
            let lon, lat, zoom;
            let latlon = iFrameVar.getCenterOfMap().split(',');
            lon = latlon[1];
            lat = latlon[0];
            zoom = iFrameVar.zoom;
            window.open(`https://www.waze.com/en-US/editor/?lon=${lon}&lat=${lat}&zoom=${(Math.max(0,Math.min(10,(zoom - 12))))}`);
        });
    }

    function init511virginia(){
        $('#incident_table_paginate > a').click(insertWazeLinks511Virginia);
        insertWazeLinks511Virginia();
    }

    function insertWazeLinks511Virginia(){
        $('#incident_table > tbody > tr > td > a').parent().append(function(){
            if($(this).find("a").length === 1){
                let latlons = $(this).find("a")[0].href.match(/lon1=(.*)&lat1=(.*)&lon2=(.*)&lat2=(.*)/);

                let lonCenter = Math.min(latlons[1],latlons[3]) + (Math.abs(latlons[1] - latlons[3])/2);
                let latCenter = Math.min(latlons[2], latlons[4]) + (Math.abs(latlons[2] - latlons[4])/2);
                return ` <a href='https://www.waze.com/editor/?env=usa&lon=${lonCenter}&lat=${latCenter}&zoom=4' target='_blank'>Open in WME</a>`;
            }
            return "";
        });
    }

    function initNE511(){
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if ($(mutation.target)[0] == $('.ol-overlay-container.ol-selectable')[0] && $(mutation.target).css('display') == "block") {
                    insertWMELinkNE511();
                }
            });
        });

        observer.observe($('.ol-overlay-container.ol-selectable').parent()[0], { childList: true, subtree: true, attributes:true});
    }

    function insertWMELinkNE511(){
        //http://newengland511.org/
        let selectedIncident = $('.popover-content > [data-ng-bind="item.Description"]')[0];
        let incidentDesc = selectedIncident.innerHTML;
        let incidents = Leidos.Traffic.Data.events.find(function(e){ return e.Description == incidentDesc;});

        $(selectedIncident).append(`<br><a href='https://www.waze.com/en-US/editor/?env=usa&lon=${incidents.StartLongitude}&lat=${incidents.StartLatitude}&zoom=6' target="_blank">Open in WME</a>`);
    }

    function initmiDrive(){
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if ($(mutation.target).hasClass('esri-popup__content')) insertWMELinkMiDrive(mutation.target);
            });
        });

        observer.observe($('.esri-component.esri-popup')[0], { childList: true, subtree: true });

        $('#layerContainer').append(`<button tabindex="0" class="legendIcon layerIcon clickableLegendIcon ui-btn ui-btn-inline" title="Open in WME" id="oomOpenWME"><img tabindex="-1" class="focusRem" src="${wazerIcon}" alt="icons"></button>`);
        $('#legendIconContainer').css('width', (325));
        $('#oomOpenWME').click(function(){
            window.open(`https://www.waze.com/en-US/editor/?lon=${mapView.center.longitude}&lat=${mapView.center.latitude}&zoom=${Math.max(mapView.zoom-12,0)}`);
        });
    }

    function insertWMELinkMiDrive(changedDiv){
        for(let i=0; i<incidents.graphics.items.length; i++){
            let location = incidents.graphics.items[i].attributes.Message.match(/<strong>Location: <\/strong>(.*?)<\/div>/)[1];
            if($(changedDiv).html().indexOf(location) > -1 && $(changedDiv).html().indexOf("Open in WME") === -1){
                $('#newItemAdded').append(`<div><a href='https://www.waze.com/en-US/editor/?env=usa&lon=${incidents.graphics.items[i].attributes.XCoord}&lat=${incidents.graphics.items[i].attributes.YCoord}&zoom=6' target="_blank">Open in WME</a></div>`);
                break;
            }
        }
    }

    function initWV511(){
        if(document.getElementById("OOMWazeButtonDiv") !== null)
            document.getElementById("OOMWazeButtonDiv").remove();

        let $OOMWazeButton = document.createElement("div");
        $OOMWazeButton.setAttribute("id", "OOMWazeButtonDiv");
        $OOMWazeButton.setAttribute("style", `position:absolute; right:15px; top:190px; height:36px; width:36px; cursor:pointer; background-image: url(${wazerIcon}); background-size: 36px 36px; background-repeat:no-repeat;`);
        $OOMWazeButton.setAttribute("title", "Open in WME");
        document.body.appendChild($OOMWazeButton);

        document.getElementById("OOMWazeButtonDiv").addEventListener("click", function(){
            let lon1, lon2, lonCenter, lat1, lat2, latCenter;
            let latlon = location.href.split(":");
            lon1 = latlon[2];
            lat1 = latlon[3];
            lon2 = latlon[4];
            lat2 = latlon[5];

            lonCenter = Math.min(lon1,lon2) + (Math.abs(lon1 - lon2)/2);
            latCenter = Math.min(lat1, lat2) + (Math.abs(lat1 - lat2)/2);
            window.open(`https://www.waze.com/en-US/editor/?lon=${lonCenter}&lat=${latCenter}&zoom=5`);
        });
    }

    function initWVGIS(){
        if(document.getElementById("OOMWazeButtonDiv") !== null)
            document.getElementById("OOMWazeButtonDiv").remove();
        $('#RoadLayerList').prepend(`<li><div id="OOMWazeButtonDiv" aria-hidden="true" style="cursor:pointer; margin-top:8px; height:36px; width:36px; background-image: url(${wazerIcon}); background-size: 36px 36px; background-repeat:no-repeat;"></div></li>`);
        $('#OOMWazeButtonDiv').click(function(){
            let source = new Proj4js.Proj('EPSG:900913');
            var point = new Proj4js.Point(parseFloat(view.center.x), parseFloat(view.center.y));
            Proj4js.transform(source, Proj4js.WGS84, point);

            window.open(`https://www.waze.com/en-US/editor/?lon=${point.x}&lat=${point.y}&zoom=${view.zoom-5}`);
        });
    }

    function initWVFlood(){
        if($("#OOMWazeButtonDiv") !== null)
            $("#OOMWazeButtonDiv").remove();

        $('#tools').prepend(`<button type="button" id="btnOpenWaze" class="btn btn-default btn-lg bootstrap_btn2" style="cursor:pointer; margin-left: 0px; min-width:32px; height=32px; background-image: url(${wazerIcon}); background-size: 32px 32px; background-repeat:no-repeat; background-size:100%;" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="click to open in Waze Map Editor"><span ></span></button>`);

        $('#btnOpenWaze').click(function(){
            let source = new Proj4js.Proj('EPSG:900913');
            var point = new Proj4js.Point(parseFloat(Flood.map.extent.getCenter().x), parseFloat(Flood.map.extent.getCenter().y));
            Proj4js.transform(source, Proj4js.WGS84, point);
            let zoom = Flood.map.getLevel() - 4;
            if(zoom < 0)
                zoom = 0;

            window.open(`https://www.waze.com/en-US/editor/?lon=${point.x}&lat=${point.y}&zoom=${zoom}`);
        });
    }

    function injectOLMyMapKML(){
        if(!OL.Format.MyMapKML){
            OL.Format.MyMapKML = OL.Class(OL.Format.XML,{namespaces:{kml:"http://www.opengis.net/kml/2.2",gx:"http://www.google.com/kml/ext/2.2"},kmlns:"http://earth.google.com/kml/2.0",placemarksDesc:"No description available",foldersName:"OpenLayers export",foldersDesc:"Exported on "+new Date,extractAttributes:!0,kvpAttributes:!1,extractStyles:!1,extractTracks:!1,trackAttributes:null,internalns:null,features:null,styles:null,styleBaseUrl:"",fetched:null,maxDepth:0,iconColorMap:{"#880e4f":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAUySURBVHhe5ZuvT1xLFMdxuIZkJaKi4jn6B1T0T1hTgXgCUYFEvIQVTaioIKFiRROeRCJeAgKBWIF4AZI6EIgmVDQBgWjCJpCAuD2fw8y+6c3sj7k7M/ey75t8w+buved8Z++dc86cucxlRGthYeG1/H1j2C5Rj5tzWsKZgB10ebAT8Tn/GIj+7S5vbW19OD4+3r28vDy5vb29vru76z8+PhaQzxzjO87hXPdaIbaexw/h3vGNjY3OxcVFryiKvjAUfa7FhrVnbDcW3KHBwK+urs7NQBQ359+Lk+5+sb+yWey8/avovvyz+Nx6p+Qzx/iOczjXBbbcH8L4ahR08EtLS8vmjivuf/Z1QH+/Xi02X7SDyDVciw0LbOMDX8ZnI6CD73Q6a8xjhDKv/93cLbqLy97BhRAb2MImwAe+8Gl81wod/Pb29uZ9/14F/jg5r3THxxGb2Ab4wie+jYZaMBi8qhKc7/Z0TvsGEIPYxodF3T/CG9KVfTR5TH2iUxBfAN8mZZIms6LVbrffk78RQrDyCU1JfAI0oAVNT9LyoG3T3LeDE6/AHMQ3QAuanqQlBsXI3t5eF8c/v11rDveJy0F82zSJpiyFEnlY/KlXChefsJxEg0Hf1AhJ0er1ejt4IyX5BNVBmx7RhsYnqQnAIyZ+tNjZfffRK6YOosXgOuk0IOXghbnvEzIJbYlLvU9BA+06YZoCCk3ApMU0ODs7O8RJ1Zx/9GFnUNL6wHec47t2HG1tgEYjNzpattZn5eYTMYo2b0+CKnUFmgAa0fokOSLW19eZ//rI+gSM4j/Ln1RcCLjGZ2sU7XoErUZ2PJyenrYxXiX631z8UGEh4BqfrVG02QCtRnY8iN0VjLMY8TkfRvtoVkHoVHMWSitGdjxIzd3Bcuj8PFz7ooqqgGt9NofRxhm0GtnxIHY1BYZmAKJ6VYRmBJsJBPFT4f/+CXh4eFjF+HOIAWg1suNB7GoWqLL8zZUF7PJYkCQLvMIyy0+f81HMVgf810F+ZWTHhRi+wfqXP1a8AkbRzs9JEBpnIJoMbozc+BDjOoqqfYCUawGnL7Bv5MaHGF/DQ2ggdJlqNegUQewZpIEYH8SBlO3vUKIl+fy3EAdacDe0IUJzNC3EiVaE00yD2HQe/3TNEAtxsognAladHWFLNDiBddHITAtxpNmgasSOSWetkS76lyHOtCqkD1dnMMS37QUK8myMWIhDDYYHq12vuBzEt0H64FeGONXSq0rNHovOGiN+A2QcxOm8bZLW8RTYu280zBtZeSGO9SnIHQtKcz//3bcQ5/NCjQWhzYtp6DRZ8F3P3bcQAZoRKEVz1AXujrAgb+QfBhFyhJoqy9hQOsvqI+O+fogY3TShIgttY4UQ207V16yXJkWQhuWU2+Z240PQNW6bAxHVEmpoThEQncCHj1reChsLETYIiFXaZsOIrcYFvmEQgRqlYr485XR78y14qkJEslzW2xWjQnTqfWzmWe5OCxGqFSL9vmn6fFxrt7wF9VV8VSCCdSpMkxWcqN/8R78MEU1W0H2EKq/UOBud2Ghm1B8HEa5ZIbRAKhU8zY764yADCHqrlHOclV7zCp5QyCBYMX5lNJOkRiflcU29K71YkIGwoaKpcVQj1Wlwcm7aDY7ckAEN4oFvU4VjMzPvh0EGpjuY5VK5VOryXyCzCRkc8UB7B+R4WlvQyfd8NxvzfhhkgIM3TtnSstta5tjzzPehkIHSQBk88wI+N/q/QqNDBqxB0WA2g944yMB54SLdCw1jMTf3CzIzOHE/5senAAAAAElFTkSuQmCC","#a52714":"data:image/png;base64,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","#e65100":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAU1SURBVHhe3VqvTyNBFK5BkwpEJQ6DOHEeewKSGiQCwR+AOJIjQeBAIBHIihOXgOAPqFxxkgTEJZwgoaaiCU2oqNj7vjcz3blm+mOHmdktX/LChu6+983OzPs120iI5vr6+hcKrncg7SnZsX5vQj4FZND4Oz3YpWSVXwZJT2Z5a2urfXFxcZZl2a/n5+fs7e2t9/7+PszHo5zCa/6Pv/Ee3stnzPNa12q8CHvGT09Pjx8fH7t5ng8hZTHks9Rh9GndtcVk1kn69fX1SQ9EMH55yod3l/ngcj/vH2/nvYNm3ttfU4Jr/o+/8R7ea4O6rBdRy9XQgshS1zOuMBrKgPpHm3mv3SglfIbPUocBdVtbgzZrARk8Z4j7WJhiXw9/nqlZdgyulEAHdYm/AGjDWg2VvwQuxfbNzc25manxn8xrxhcJdVK3ALZok7Y1h0ogg+90OlinClyysqcdAwgi0C3bQoO2yUFzSY4dhiuzNGXJu0hHENkSBGyTA7koSunQ2tvbO5RYDsjMO4jGFLMSyIFcyElRS4O2CXOj3/dOgimEtglyISdFLT5at7e31zQ87r+E8fS+AtvkQJATuSmKEcE4DHsDGmXi4iSWUMhBY6BzhKhodrvdDq0xJLkIVSEmPJIbOSqqEcBcHHYk2emff3OSqULIRaMXtV6QsAcwV3cRWUZMiiv5PpMniKkTPpJAmfpBh8U4MHm+b8wfdn5I7J4JptC4x/XsIjG5ATlqusHRNLl+//tXJ4l5Ymdwi+CTV5ATQY7kqigHxMnJCfe/LFkXgXli7dGl4eNjTD1Crpp2OGRZxvDn5f2n6/tl4ONnTDQgV007HKD3gMpHiIIu47OEjQ5fSOPEoXOWkJvGgaYdDlB6TM1l9+fg+oiPeYHPunTOEsvPsF8QFlAqbrZsBBDP74myEWFSJYKrph0OVErNK7ICorwA2QIr4gOibIFdavYpf1NFAVMeA7uadjhA6SY1jwd9p/F5kioPIDeNTU07LKBYZYIeObu1PxeirJ+hkJMGM8E4gHJZY759gJi1gNUXuNd0wwPKvRyhLbGqwagO0ADKCz8Qs/1dVsAl+v43gIEHWvFxUrHEcrIPmmY8wIgkRFV2g6fFCn/xmiEGMKLcLRxWpR1hI+BgOda4y98AhuSV+3rskGLVGvG8/zRgTLJCOReo0hnS+elzASB89jcPMCjOsGzBElKsQiu+85sGjEqDxCdnDyVWjRG+AbIIMLoG+UvrVZwQWZkfOaxpWmkBw2oVpPYF/+/99LNvAONcBcl9gb33IdXMvgEIqIjA9DhFXsAT4SLtTev5ZwFE1ImRRxlbVqyyOtoJUGmAjOp7ISMr28YqI9JeK7K+bW2+HgChK7KKeWxuDj6AK222PgCpDYh0jGI4RMvx0caGNlsvgJgcn7HJ0T9sOQfiI9Rlzv2AZN8CeQEE78gyZLlslbt32kx9AZLcCuobogBbwVr61FnPpT8NEJUMUbbCB/p80uktln51GZ8PQFi2wkeiguX167/0pwHSk6jg80mNddBZX6+/CCAuabIkSCU+q5HPXYqEpx7pri8wAJUgsWJcplZgrl9UevVLeMoCg5hUjMuERivkVV/phQIGwk6yhMZ5jVSrwcl703R4UwEDUlki/YHjUEUON4p9X+9szxcYmPIHqOftVJnXVo2/+vt+FjA4+gPpHUh+wDYa21tFvOdvn2PfzwIGyPxAmqk80bVOdfm/1Yz3ZYGBsoEyyXEBXterwREbGLByigqf0+ktAgbODy7ifdCwEI3GPyuT4jTSECnGAAAAAElFTkSuQmCC","#f9a825":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAUASURBVHhe3VqvTyNBFMbwB2AICleBrDiJOE/F/QEI/AnEJSDuDyDhBOLkiUoECMQJRAWiApITJypONEFwouIEgoSGTfa+783Mdrps253pzO62X/KSprv73vd2Zt6Pmd2oEDuQFqQN2Yd0csL/eI338N61wBaETuWdLSt8ljpWDiQ9Ncrn5+df+/3+5ePj432apoPX19fnt7e3MYW/+R+v8R7eaz8Loa6VeRHZiJ+enn4ZDAa3dBIOOoHP8FnqMPq07saCI5Q5/vT0NNC+KPz7nSZ/fqRJ/3M6vv2Ujq8/pOPLlhL+xn+8xnt4rw3qyr2Ixs0GBq1Ou90+5Khp3mk6fhaHxj8/TpwtK3hGXgZ0GFA3bdCWttkIiPMcoZeXl5HmmiaDi+lR9hXooC4D2rBmQ+0vQZzvdrvfsnWO6es14osEOs3SoC3apG3NoRbImicRYQUkw+ti8gGFNgysl1BLTNhnujIjL1O+gHAMMUuCtnXKZJqsFK2Dg4Mjnb9VoCsgGlMkQALkQC7kpKhVg45Jc8nfXiHBKoS2CXIhJ0UtPlpXV1ffxTJSVJBI7yuwbdIkOZGbohgRzMPZ1GdRU0SsQiEHgpx0jRAVO71erysWR/eFhOoQciHIjRwV1Thom2InuTsqJFOHkAtBbuSoqEYAU45Yeh4WEiklN/sqgkOHrF8KfksmwbXCZ0qI6AN0WowDU+f75ny7pJ2FZXWTo6YbHFvQL69ZurkCEvPE5O0y8KorwEljSK6KckCcnJy0RT1TXxGBOWIitQt8MoxJieSqaYfDw8NDR7Sz2SkwPk/M+nSCR5wxzRK5atrhMBqNZBidG57J1HSG61IzjRK5atrhAL3HVO66PpN7lTh8wGeLdM4SK84ca9rhAKXiiWuULhP5Z2EJW+FTIZVS84rMgCgvQC2BFYgBQJQloLKARw9QWRbQPQEQPgtA6a6oXoE6ANjVtMMCiqUR8qnZrfW5EK5xRgScNNgQxQGU39CCz+hQymQE18hvxJplN5pueEC5XyC0JVI3GDUAGkD5npjwiAOxxVr/e5puHMCA2gxt4IYIwM3RuIARVRDVuBucF7M7DMTbDDGAkV1zGFLrjrAR7gwDmlOc9JcHDKls4BmxQ4qVWeJF/zxgTFWFHtVaaLGqzMoORgQwqIKhY8MSUqxGK37wywNGD8V0jbPAGv3oByLvAKObEGFQxyywRp8cNjWtagHDKgHXMAus0efJcD2Acc6CymOBvfYh9Yy+AQiojMDyuIq6wDoRBqqN/LMAIndk49XGOorVVt9p8/UDZPay6tBxG8tJ9PaathW36XEFCKmSLOKxubXldaHNNgcgtQ1RR+cRAqIV+GhjW5ttFkBMFUcMiEtsbrwTbndNAl/1RY8LQFA1SgHbZavdra7h8QVIcinIcIVYCtbUp85mTv08QFRViFwKy3w2y89jJ1O/vorPByAsS2GZrGBF/eZP/TxAepIVPDZOrI2O5kb9RQBxVSYDTgXS9HliM8pdX8ABNZTsGMv0Cqz1J51e8woeV8AJdoy/6E2Z1GilPD5Tb6cXCnCEByoqNc6JB9a6573NqvWXBRzK4kHRoYp1uEGs9rqfBTh2Ju7lS+XpUvdM375+gHOMB7J3YH9uZz5vA3htPdb9LMBB1gdqM3V4bZ/q8r/VzPeugKNZUNRYv6C3CHA4C4rAega9RYDj/OAi3gcNC7Gx8R9yb8QXRqBgvgAAAABJRU5ErkJggg==","#ffd600":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAATfSURBVHhe5VuvTxxBFL4/4iSiAknIif4BSAw5UVGJrKwkoX9AEypQVCArm2CQFafISRIEGBIqECcQiEu4BMT0++a93dm7DNzO3MzuHv2Sl2y4nfe+tzPzfswuvQbRhwxUdiDDBeHfit9577tA4fSis3VlbR8GSc/N8tHR0bfxePz77u5ubIy5eXp6mhozw+XMyLW54W+8h/dWx0Koa20eRDnjh4eHB9fX16Pn52d6GgSO4VjqKPSp7s6inHWSnkwmN+qLYIaJf/hhzP0nY/5+NOa2jznvifCaf+NvvIf3VkBdlQfRydVAQsPt7e3PnDXlbczLozh0u+mcrSscw7HUoaBu2qAttdkJWOc5Q9Pp9EGoYsVPDuZnOVaog7psvDCGNiqrofWHYJ0/PT39Xu5zLt+YGV8m1Klbg7Zok7aVQ2uwzltWxOMvP/mUQhuKykNoBTtMV8XStMvURziH2C1BzIymTAbGRtHf29vb1/wtwcpHNKfQJkAO5EJOQq0ZDMs0Nz33E2xCaBsgF3ISavkxODs7+2ktv9ynifSxQtvkAJATuQnFjGAehj1JzixcfMSaFHIQPGqNkBX90WgkYZgpyUeoDdH0SG7kKFTzYFAWO12Y/UJ0FZAbOQrVDDg5OflqLc0Q/3xE6sjtB633oYNlLoXXtmTGb74xdYQ6AHJUuulxdXX1x1qJzfmVktYPLaF9Y5eJ1gbkqHSTo18uf3ZuPhJviebtWoipK8gJ0G2QPg6gARlYC1yyPgJviYvU9RETY7RzJFelnQ4XFxdDqz0m+uv+DEJMnNFsQK5KOx2gd99qD214dGlGIXSruUaJpXFaQKlkgND9Oflih0WBY306XxMXZ9JnAihF5wcEP4Cic4tAaEZwD4AdYlpQqVW9HisgywP472OAZIGY9repLKDtMZAlC2xa1WtQBwCbSjstoFgqwZia3e3P5QiNMxRyErASzAMolzUWMzuUnL2AW2XnSjc9oFwyQWggrEqubtAFwPQZoACUx8eB3JJ7/xeAAQnpsdsgh7jlz8PRvICR1bdBamli+ReAkQ2xhYDV5olwIeTgAuuG0swLGNID+ciInVJcr5Ev+i8CxnatSZ7J+0g1KfpeANhVes0ABiUYTtAi+Ig1IbQtyB/8FgGjYj2mZk8lrsdI3/zUAQy3twranP0CMC4s2ogFbu+3M/sFQEBXQeDhxSriDlnam/0CICHnBCxFm6gL7Bvhsuxt7euQOYCIfBkW08aGimurR2q+fYDMlnACQo+xQmT+eG1LzXcDIHRsaeV8ba4vPoBjNdsdgBSLcjkxyhEQXeCjjVY/jXsVIMavRzQgomfyORIj1OUCX/avQFYCCEqjlPLjKXfa21zDEwuQZLss05WiQnQVH3U20+6uChDVCpFbYYVzPo51S7/dii8UICzrdpWs4KJ+95f+IkC6khUiDk7cQUd3o/4ygLgcnBAhBdJ8wdPsQUdqwAEtkNAz1ekVeI/r87tX8MQAjlxad+qkRpfyLnX4+gPO8IWKpsY34oHb97w37wuOpgGHpG0mfPFgft93o81NDTgm8YCnOdVS2Za65QnP+9j3rwEOytlBtT5w+b47PX4uwEn3xSlfaelrLf3beub7UMDRrep/k+p1tw44cgMOu6D4XoPeMsBxfnyZ7/P2pej1/gHRsvi/VbCMCgAAAABJRU5ErkJggg==","#817717":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAU3SURBVHhe5ZuvbxtLEMeD+ic0ILAgLIGBDxYaFhYUFgYYNCABBQEPBFSKwZNSUFApUgoKCgwCHjAoeMCSwQMBkVIQUCmWUikB9+Yz3o2m1vrHrXf3LnkfaSQrvpv5rm9vdmbvslaQdbFNsR2xzgzjO47h2CcBA9kWCw12GePcR/ljIPq3K72/v98dDAafLy4uBjc3N5e3t7fj+/v7CuMzf+M7juFYe64Yvh7ND/FwxRnIaDTqV1U1FqvLmHOnfgx8txau0MPAr66uhm4gyo/LYfX3+Yfq9NObqnf0R3V4sFm9f7ehxmf+xnccw7EWfE39EK2bDTr4ra2tV+6KK79+jXVAR4c71UF3vZZxDufiw4NvYhDLxWwFOvhut7s7Ho+vEcp9jXiubGhwdQwf+MInEINYxHSxG0UHf3x8fOCv1OXl96grvsjwiW8gFjGJ7TQ0Rufk5ORQVQn/fP+s93RoACkM38TwEBsNEynl2en1ert+ava/HgRF5zBiAbHRgJaJpHJsdjqdN6zfCOEeDQnNacQENKAFTRNpZej4ZW40+hYUWMKIDWhB00RafjbPzs6OCEzST5HpY43YbuGp0IS2icSMsA4zdoJSuISElTQ0OMauRsjKer/f/0g0KduDgpowtADa0DiRmodtX+x8+utVUEwThhZAGxonUjPAkkOgn9cXQSHLmC9xqfcpaDDfJ6xSQKEJ3LKYh+FwqGk3ds3nPF83hOC7VXwDGp3c5Kz76d87ehkUMc/8ur0MMXUFmsDdBunzwN7e3jYBmLIhAfPMZOqliVlhfD+CVic7HYPBoINzGpJQ8Hl2ff2vCqsD54R8zTPfLKHVyU6H+H2Nc5qRUPBZ5qdmDHVvNdMovXay03F3d9fFc9378+upLhxRcG7I5yzzeQatTnY6xK+m2bo/gM/OMdRdEUyiZa8gLf/7GSBO3+L8MeQAtDrZ6RC/ugrE9AClVgHfEwhZVoEXeKYWCgWfZ6XqAFenwQsnOy3iWCP8+X47KGCemQS1kLp5BkOTg0owD+L8CxFirg6Wsxcws+yLk5sevxLUTYTWcnWDJgGmXwE84l/zAKJzbn/XNbT4PkDIc/97JIBuhrZxQ0RgczQvEkRLu1Vug9Tmp7+QvgKcRoJsEImE1eSOsDc0mMS64WTmRQLpahCbsVOa6TXyZf9pJJjWt+zDNZkMie33AoWXTl4ZJKAmw7oNS0ozjVb+5DeNBNUNkpiaPZWZHiP9BsgiJOgzMZ1/TcwCc/XR8MzJKosE1llQOhdM3fvlr75HgjMLNBeUXBFM5id2M1ffIwJ0n4BWtERdYJ8IC429HfIbIuQcNTFtbF0zbfW5C988IkabcSoy3vcLCU9h+DZVX7temhRB+tJEzsfmZsuLlyHahYh6LvYDdTmWRbPsEeO5C9suRJgmRHrzmG2zWYYv0++3I/HNQgRqo5Ty5Sn/MpRQruGJRUTSLuvlSnErmKmPzzLt7qqIUK0Qmbar7PNxrpn6zVV8MYhgvRVWWRVM1m//1J9GRLMqaMkWUyabchcf7cz6ixDhunEyKZCWf87HsabgKbvRkRoZgBZIdG/L9AocYzq99hU8dZFB0DHquyvLLI1myeOcZju9VMhAeKCi6XxePjD3PcfmfcBRGhmQVokQeqhiHm5Au6u9WGRg+t8l9PO2VOaz6fH5L5CniQyOfKB7B7zSxtYW5l9vE/juadz3s5ABUh9omueRlnmsxd8e53pfFxkoGygPNa7A51b/V2hyZMAPSVF4mklvEbzNleWNrqVZW/sP1WARXHe4T5YAAAAASUVORK5CYII=","#558b2f":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAUgSURBVHhe5ZqvTyNBFMdR/AlINA6S88hLSKhEnMQhTpxAXHIkFSQYBAJRcQKBOIFAIBAViEuKQCAQFSScIAGBuIQmIBB77/M600z2pj92OrO7hW/yTZp2573vdGfej9mdKxELwiXDVWEjR76zv3Ptu4CddH6yk3Jm/wxED+7yysrKxt7e3o9Op/Pr7u7u8vn5+fHl5aX39vaWQT7zHb9xDdcyxo43tmbmjxjc8Waz+b3b7bazLOsJi6LHWGxYe8Z2bcEdGkz84eHhxkxE8efpNju7OsoOzraz7eMv2ebhavbl4JOSz3zHb1zDtS6wlfsjarcadPIsW3PHFa+vvezkdyv7+rORbewvFyJjGIsNC2w7W6M2f4JOnjvEPkYo+xrx3Fnf5IoQG9jCJsCHsxoq/xN08q1Wa9feqe79ddAdH0dsYhvgC5/4NhoqQ+Po6GhfVQna1ye6p30TiEFs48MC32joSykfq6QruzRZpj7RKYgvgG80oKUvqTwsra+vb5K/EULk9glNSXwCNKAFTX1p5aBh09zV7YVXYBnEN0ALmvrS0mPp9PT0EMdPvccokT6U+EYDQBPa+hITgjws/nTpU7j4hJVJNBj0TI2QFAvtdls3HynJJ6gK2vSINjT2pabBkvjRNbd7suUVUwXRYvCIxr7UBJDiQ9fb4997r5BJSEFj630KGmj7hGkKKDQBNBq58WHr/NCcf3xxMChpfeA3rvGNHUdbG6DRyI2OBVvr07n5RIyizduTIKSuQBNAI1r7kiNiZ2dnGQcsWZ+AUdw//abiioAxPlujaPsRtBrZ8dDpdBoYD4n++f5+EjDGZ2sUbTZAq5EdD2J3E+MXN2de58Nol2YIim41tBlQGseFGNUMUHR/ts53GRYExvpsDqMTZ+JnAjHaxHLRDGCjcwim8NU0suNBjH74FfDhY8AalkPa37KygG2PBWtGdjyI0UUsz0IdIFg0suNCDGsluNX67BUwis7+HIuicQaiyYBKMA3EuG6y0HOAlL2Acy5wZuTGhxhXL5fdc6+ISZiqG0STQbpuUIxzHqCiUx5/FyVanP2f9lhMHOhhaE0PRDgcTQtxohXhNNsgNp3lH78CzEOcaDokYFV5ImyJBiewpkl/eYgjzQahETsm0WCQLvrnIc60KuRMvspgiG/7XEAQv/obBXGowbBowxKTTqOVPvjlIU55QBJUs8ei02MkfyDyH8TpvD0kreIJka38jIZ5I6tciGNtkTmTLzMW4Ms+BxDEb30nhTifF2osKDMjOJEf39XcfQsRoBmBUrSMugAfTtlbbuQfBhGiJxG8vuITHZPOKzIXxn31EDHaJFGRFT3GKkJsO1VfvV6aFEG6MVM+NrcPPgQHxm19IKIWhJoWUxRHTtGDj8rfD/RChGlxRJAKOTYbRmw5ga/8oqcIRKA2SjFfnnJOe8treEIhImmX9XbF2ArO0sdmOe3utBChWiGybKc552Oss/Srq/hCIIJ1K0yTFZyoX/+ln4eIHmSFog85ofOgs75RfxxEuJbJRQukXMFTj3I3FDIBfZuc7m2SXoFrnE6Pt8FnGzIJOsYrZjNJanRSHmOq7fRiQSZCr6DhfFQ8cPY919ar1p8WMiGtEtnbvocqfOfs+3pXe6GQiWk84CTXLZX57Jzuzv6+HwaZHPFANzk5nqMt6OR7fnsf+34YZIKDN0453LAHHOa72cz3RSETHQRFg/cX9MZBJqxFksFsFzuhkIlzuJ/uhYaxmJv7B7drEditHtO/AAAAAElFTkSuQmCC","#097138":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAUvSURBVHhe3ZovTBxBFMaxFQhEE07gkBWICkxlBQknERUVFZUVCMSJCkQTECcqKiqa0ARRUYFAIE4gGnKiCsTJE01AVDThEioQ2/d7N3OZbIbjZm5md69f8pLL3s573+zOvH+zSxViRWRDZNNIuyT2Ovdw738BO+nyZGeVhX0YkJ685dXV1Z2Dg4P3/X7/23A47N/e3t7c3d2N7u/vC4TfXOM/7uFextjxRtfCPIjJG+90OruDwaBXFMVIJBQjxqLD6jO6GwvekBLlDV5fX1+ZiSj6w6ui2zsuXn3tFM8PXxetzstiee+FCr+5xn/cw70u0IVOq9/YahRaIrrUzRtXjP6OdELPPuwUT3Y3g4QxjEWHBbqdrYHNRkAnz1JlH0OUff3h7LO+Wd/kQgQd6EInwIazLWp/CLrsj46ODu2bYvnGvPHHBJ12a2ALm9g2HGrBZPLKSvDx/Jvuad8EUgi6sWFR90PYxDHZpcky9ZHOIdgC2DbOkTBZKVrb29tviN8QwVn5iOYUbAI4wAVOY2rVoG3D3OnVDy/BKgTbAC5wGlPLj9bJycknDP8e/Uni6WMF23AAcILbmGJGEIfFni59EhcfsSoFDgYjkyNkxUqv1/uCNUKSj1AdYsMj3OA4ppoHG2JHk532510vmToELgY3cBxTzQBCDlaGv395icwi6/tt9eCDm6EmNAi/ucZ/vjGzCJyACYtZsHJ5eXmGkdiY3xHfafMGH/iPe3xjHxObG8ARrmPKabFic/0X3TdeEtPExu1ZEJNXwAnAEa5jygkhBcgzDLBkQ9PdnS97Si4EjPHpekjgZOsRuBra6XBxcdFGeYz3Z4+HgjE+XdPERgO4GtrpIHp1jR3/PPUaf0js0oxB6FaDmwGpcVqIUo01VGM+4w/Ju++TYjEYjPXpfEicSpF+QVqIUg2BoREArx6L0IhgI4EgfShEKZoXZAVkeQC6BRbEB2TZAhoFYsrfqqKALY8FWaLAGpopP33Gp0kVeQBiS2PBmqGdFqJYM8GYnD13JggnAzLBPBDlusli+wA5awGnL3Bq6KaHKI9yhK7kqgazOkALUb6OhZh6IKe4dYBg3dDNAzGgCXdDGyI0R/NCjGhCVGc3uCxO+MvWDJlAjGg4xGHV2RG2AgfHseYJf2WIIfU4sR47pTi1Rj7vX4YY28Iifbg6nSG2bS9QsGXoVQMxqM7w7fG+l1wVgm2D/M6vDDGqVU5Mzp5KnBojfQNkFohhZVDHKnDe/tDQqR5iXFdB1b6gtPfrefsWQkB9QWjzYh5xmizV7/0yhISWYVWdFLsnwoLKjsSnQoicwya0XRYjTtvr3JivH0JGD03IyPjez0c8haDbyfrSH37MAyHUhVXOY3N78CHoGrPNgZBaFtGOUQ6H6Dg+bCwbs82CEOPrEa3N52lulAVdTr2f/SuQuSAEtVBKWS475W51BU8shORTEX1dKTJEJ+ND51NjptkQopohsmzn+WyWsc7SrzfjC4UQ1q2A545JkxnjeP3mL/0yhDRbQaNCzCc1zkEnOhZj6ZchxDVNJnkJOefjXifhaUa6GwuZgCZIVG+z1Arc41R6zUt4QiGTIEHSzTxLaHRCHmOamfCEQibCgYq682mNVKfByb15DziqhkxIs0T2tu9QhWvOvm92thcLmZj6A+p5N1Xmt1PjL/6+nwaZoPYObH5QivfNqfFzQSZJfqDNVE50nVNdri1mvA+FTJQGyiTHFfC7WQ2O3JAJTz7pECx2shMLmTjn2vk+aHgUS0v/ACITHVbhDhmiAAAAAElFTkSuQmCC","#006064":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAUTSURBVHhe3ZohTxxBFMcRiH6Ak4iKygpI+gH4ACcQiEoEsqICQcAgEAgEgoSTJxFNIKloQkUFAWRFBaIJpgmIOi6BBMT2/ebeu0wvA7c7zOzu8Utecrnbfe8/t7PvvZndmRrpiM2rLYp1x4zv7HeOfRXYoMcHW9am9s9A9H9X+eDgYO38/Pzw6urq4vb29ubu7m7w+PhYYHzmO37jGI71zxXD19T8EaMrvrm5uX55efm9KIqBWFUGnIsP86e+W8voqiP6+vr6lw7E8evPn2L327dieb9XfNjaLjqfPhczK6vO+Mx3/MYxHOuDL++PaOVsQFB3YWHho15xx9/BoNg6Pi7erq2PBlvWOIdz8WHgmxjE0pitwA2eK8R9jNB7ua8R71/lWMMHvvAJxPBmQ+N/ght8r9fbHtzfO4Gnv39HXfFJhk98A7GISWzV0Bjdfr+/61QJvR8/guJTGjEMYqNhKKV+FilXlDFgmoYE5zBiAbG1ZJIYa6XT7XZXqd8IIXOHhOY0YgIa0IKmobR66FqZ+/rzZ1BgHUZsQAuahtLyM390dLRPYEpUikwfa8S2MokmtA0lZoQ6LPFcVBqXkLA6DQ3KQHuErHROTk76RKMkhQQ1YVYe0YbGodQ8zEsc1+ws7e0HxTRhaFFu0DiUmgFKDlEub26CQsoYDY31+zQ0mK0TXtJAoQm0LObB+vzYmr92+GXU0obgN44JnTvJrDdAo8pNTsd6fVZuIRHPmdXtMsT0FWgCNKJ1KDkhGxsb3P9uyoYEPGfePVqamBxj6xG0qux0nJ2dLeE8Jvvb/VmFmDxj1QCtKjsd4ncF5/3Ti2Dwp8ymZgxVbzW0KSsqOx3Sc7sKUPX+XO27tiEKzg35fMosz6BVZadD/G7hvGoFIKvHUrUiWCUQtlR2Oh4eHtbxPA0zAK0qOx3i9BPOpyEHoFVlp0P8dnEes/ytqwrY8lhIvzQWp+/wzPIzFPw5q6sP8HaQ36nstIhjdyljena7P8tQNc9gaFLoBPMgzl2ajd0HyLkW8PYFjlVueqwSVE2EvuVaDXoJMH0FMMR/dB7Ibdnvf0MCuM3QxZ3doJAmDC0Km6N5kSCuI2xyN3jcvPKXvgMcR4LMEYmE1eSOsBkavMQ6pzLzIoFcNYjN2CnNW2vky/7jSDDXFcZ0a6nNS371PiOUgC4ZVl2wpDRvoZU/+Y0jQd0GSZOzwFtjpN8AmYQEnbVN0iaeEFnnpxpmVVa9SODGZkGjV9+Q4LNiLhfUWRG8zE/sZq6+IQJcRSAb19EX+E+EhcbeDvkPEeKeGNX8iky2J0CVETHvUcQrK1W3saoYvu2VHOG9hm8HImgPVTkfm9uDD2FPw7YHEdURc6k5R3PkNT3EaPTVuCcRYcsoZJNj7vNacCAxhi977icsa7h2IgLdQinlctlb7ta34IlFRLJcdnUqxa3gTX181rPcfSki1HWITNuX7PNxrjf1m+v4YhDB7lZ4SVXwsn77p/44InpUFWJeqfEedLY3609ChLs2uWqDNNbwtKPdjUUG4BokVm9l1goc46302tfwVEUG8Uas9HvFXsnjnDfqZrqRgfBAxZXG55bN3jKXY/M+4KgbGdAoH4QeqvDdq7nvn0IGtsPoWM/7rTKfvTX+jh7++pDBsYPk9g78/sCr9/zW7A5PbmSAozdO2dywDQ79bjrrfVVkoGygjOa8wOd2bXDkRgbskqLyOpPeJHihMctLjaWZmfkH3/CLsCPckZgAAAAASUVORK5CYII=","#01579b":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAT/SURBVHhe5ZqvTxxBFMfpn3ACAQqBRCD6B5BUIE8iKhEVFZUkVCCaUHECUYFAVCAQFSdOnkCQAAkScaIJFSQgEE24BARi+z7vZi7TzfRud25md49+k5ds9nbe+87uzPs1t1AhWiLrRjZENkXaRrjmnv2dZ18F7KTdyRYVxszty4A0X1Qns7y8vLW/v//5/Pz85Obm5uLx8fH+6elp+PzykiFcc4/feIZnGWPHG11z8yL4akp8d3d3ZzAY9LMsG4qUxZCx6LD6jO7Ggi+kSx3Sd3d312YiisHt76zTu862DvrZ251u1to+zt5sHalwzT1+4xmedYEu50Vgo3GrYUlEl7r54oqH4bNOaOXjyXiyRYUxjEWHBbqdrYHNRkAnzxdiH0OUfb334+qvrxwq6EAXOgE2nNVQ+0tgKbYPDw+/ikdTgmeD+6AvPk3QiW6ALWxi23CoBbrnIaKsBN9Pf3rJxxRsWJiXUJtP2CBc2aXJMvURTiHYAtiGA1xGlKrDUrvd3iZ+QwRn5SOaUrAJ4AAXOI2oVYNNG+Z6V7+8BKsQbAO4wGlELT2Wut3uNwzfPgyjePpQwTYcAJzgNqKYEMRhsadWSVx8xKoUOBgMTY6QFK1+v3+ENUKSj1AdYsMj3OA4opoG62JHrb370vOSqUPgYnAPxxHVBJC4+wkr5Oo+IkXEprjoIKFBbJ0wSwJl6wc4GrrxYfP80Ji/c3wxTml94Dee8Y2dJjY3gKOhGx0tm+tTuflITBIbt4sgJK+AE4AjXEeUI0IKEPa/LlkfgUnS7ow9dWEwxqdrkth6BK6GdjxcXl62UR7i/fP1fRGE+BkbDeBqaMeD6N1GedmCxy7NEJTdak6hRGocF6J0B80HJffnh6MzhgWBsT6d/xK4GdAviAuUorlsBLDeOQQz2Er3Av7nFaBJ0Jz4gPjJkCidmyggSBIFVtBMl9ZnfJJUlQc4HeQVQzsuRLG+4pCcPXUmCCcDMsE0EOVadoX2AVLWAk5foGfoxoco10hQ1hG6kqoadBxg/AhgIcpXsRDiB1KLs/9XDd00EAO6mRvaEKE5mhZiZA9LdXaD82K7w4I9QzMdxIiGQxxWnR1hK3BwHGua8JeHGNI1F+qxYwocDNJ5/zzE2CYW6cn7SFUp9lxAUNnBiEIMqjMsW7DEFKfQSu/88hCjHJAE5eyxxKkxkh+IeGGbpO+/nXoJphRsAtMErQdiX9tkdfgCZ+/Hb3+VgRBQX1BlRHA8f/V7Pw8hoX0CUtEq8gJsOGlv/Lo/BEJEN2TZdlmIOG2vU2O+fgiZNRiRkZVtY5URdDtZ35ox3wwIoQNYhbTMiorT8jowZpsDIbUoogxTJEdO0oONRWO2WRBimhzR5JiluZEXdNlzP0E9SU9RCEHtg8csl51yt2vMNBdCkq2gWUqMDNFmfAJ0NnPp5yFENUOcdSvkln69GV9ZCGHdCrNEBcfrN3/p5yGkx1Gh7CEn4hx0NtfrT4MQ18ZJ2QQpl/BU2+iIDZmAJkjU7kVqBZ5x6vzmJTwhkInoei4SGp2Qd2WGzz9kMhyoaGicVDY7ZS7Ppj3gqBoyIS2b2du+QxXuOfu+GWVubMjEOsyOet7ND7h2avyOefx1QiaoqZ2bHzjxvjk1firIJBdtM5UTXXuqa+7NZ7wvC5koDZRxV1PAdbMaHKkhE1anaPA6nd40yMT551m6v7dPxcLCH40AZl9ZZq03AAAAAElFTkSuQmCC","#1a237e":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAVLSURBVHhe5ZsvbCNHFMaDjh4JOJUEBBQENFJAQcDBgpNiFnAwoLCgoJEu0pGAAIOAAoMDBgUBBQYFBwwOVEoiBZyUgoCTUnBSCsKyUiIlYPt+zzPW1Bo7nvHM7Cb9pE+y1rvvfeOdeX9m10sFsSxcEW4IN4WdCXKM7ziHc58FGAiDmhzsvOTaJ/ljIPo/d7nb7b4/Pj4+ury8PLm5ufl6e3tbPTw81JDPHOM7zuFc91ohtp7MDzG+43t7ez9fXFwM67quhKGouBYb1p6x3VqM7zp38Orq6i8zEMXZ569178Of9c6PR/UPnV69tnFQr3y7r+Qzx/iOczjXBbacWdHK2UDg6qyvr781d1xRVXd19/BT/f3rw/qb1fdB5BquxYYFtvGBL+OzFdDBM1WrqrpG6N3dg4rnzvoGF0JsYAubAB/Osmj8R2Aqdnq93r4VyPSNueOPEZt2aeALn/g2GhpDp9/vd1WV4LejM13TvgGkILbxYYFvNIyklMcmgYk0BpimPtE5iC+AbxMcCYxFsbK1tbVD/kYIkdsnNCfxCdCAFjSNpJVBx6a54fDCK7AE8Q3QgqaRtPxYGQwGv+L4+rpKEuljiW80ADShbSQxI8jD4k+9Urj4hJUkGgwqUyNkxfJwOOzj7eTsb6+gJogWgDY0jqTmwYYtdtpw9y3tLEAbGkdSM4CUg6MvX669QuYhBQ0RHBuUuZDPHFukgMIGMGkxD87Pzz+qk8icv3/wcVzS+sB3nOO79jHa2gCNRm5yLNvpT+fmEzGLNm/Pg5i6Ak3ALIP0cWB3d/e7kYO74HLXidRzIzTGoMl2jmg1stPh9PS0g3EaEp+AWbTrMwQxccY2S2g1stNB7O5g/PfBZ6/zabRTMwahSw1tBpTGaXF/f/8Oyx/6J17n0/jLuz9UUQy41mdzGtEG0Gpkp4PY1RQYmgFsdI7BAr7Sp8L//QwQoz9h/CnEALQa2ekgdt9gPKb9LZUFbHsseGNkp4MYXcUy7afP+SyWqAOgbY0Fq0Z2WohhvZUbm12vgFnMXQnSRxhQCeaBGB/gIebuwJy9gDPLBkZuethMEBoIXebqBp0AmD4DWIh9jQMx/UBOun2AIM/6txAHuhm6/bbvFdME0WLA5mheiBOtCBdZBqlpp78g32aIhTh5hSceSjS5I2yJBvtwRvDKyMwLcaTZIDZipyQaDPJF/0mIM60KKTyaDIb4doqf9NXfLIhDDYahDUtKOo1W/uA3CXG6jeeYmj0VnR5j28gqB3H6QqhPJJqYBc7dR8MLI6ssxLFuk5WOBRNrP/3217wQ58wCjQUlM4IT+fHdzN23EAHjjFCiLnCfCAvKRv5pECG6GRe6XRZDu+0l+GTcNw8Rs4YiKrLQbawQYtup+taM+3ZABOmORM7H5vYxuODQuG0PRNRL4T+oy5EWnbSHj5fGbbsgwrQ4ojeP2TabRmw5/X75oicEIlAbpZQvTzm7veUanliISNplzVMploIz9bFZpt1dFCJUK0Sm7SL7fFzrTP3mKr4YiGBdCkTumDKZa5yo3/6pPwkRzVLQdi30ISd0HnRi42lM/UmIcC2TQwukiYKnHeVuLGQAWiDRu8/TK3CO0+e3r+AJhQyCjlHfcZ8nNTopj2ua7fRSQQbCAxVNjbPigbPuOTfvA47SkAHpS1asbd9DFY45676xP0FkhQzsgNHRz7ulMp+dHv/AnP78IIMjHug855U2cj20r7cJ+O55rPtpkAFSH2iFw/9/nP8Acexp5vtQyEDZQBnPeQGf27XBkRsyYA2KBs8z6D0G3ubK8kbX3Fha+he6K15mswQ14gAAAABJRU5ErkJggg==","#673ab7":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAUSSURBVHhe5ZqvTxxBFMdR/AngqmtBYipPnqioRCAqKhAIEkgwFSRUVCArEIiKihMViBMIEiCpaEJFBQmIJiCbcAkViO37vJu5vF72uJu5md296zf5Jpe73fe+czPzfszuQoVYFq46rglbwrYjn/nO/861cwE/aDvYSck9M/tnIJoZHQzo4OBg9/z8/PPNzc3Fw8PD/ePjY+/p6amAfOY7fuMarrX3CrE1M38Es6bC9/b2tq+urk6KougJQ9HjXmx4e852Y8EM6VJH9N3d3Q83EMWv617RPb4tDre+Fe/Xz4qtVrd49+pEyWe+4zeu4VoLbJk/Ah+NWw0Iaq+srLxxM67403sqvn66LnZfnxZv106CyD3ciw0PbOMDX85nI6CD397e3mIfI5R9jXhmtmxwIcQGtrAJ8IEvfDrftUIHf3R09MHP1PX331EzPo7YxDbAFz7x7TTUhhZCVJXg4uSX7umyAaQgtvHh4f4EYkItWCNd+aXJMi0TnYP4Avh2KZM0WSmW2+32BvkbIUTuMqE5iU+ABrSgqS+tGrR8mvt+dl8qsAriG6AFTX1p+bHa6XQOcdz7/SdJpI8lvtEA0IS2vsSMIA8zdpxSuJQJq5JocOi5GiErlrvd7hHeSEllguqgT49oQ2Nfah6sih/deE2YfU+zCu7R2JeaAaQc9XLbKxUyCSlofL1PQQN9nzBNAYUm4NJiHvg6Pzbnfzn8OShpy8BvXFN27zj62gCNTm5yLPtaf3/jolTEc/R5exLE1BVoAmhEa19yQuzs7LD/dcmGlrtmj06M0BiDJt+PoNXJTofLy8s2xmOiv9+fIYiJMz4boNXJTgexu45xmpEy56PIQUcsuLfM5iiaRmndyU4HMbqJ5dD9ebz/z8FQELi3zOYomjiz6WSngxjVFBiaAYjqsQjNCD4TCNKnQoxieUZWQJY/4L+PATOTBQRZssALLNN+ljl/jlXUAdC3xoIXTnZaiGGtBGNqdrM/xyI0zkA0OVAJ5oEY114gNDh55uwFTLDN1gvwB2gtEBoILXN1gyYApq8BPMT4SzzE9AM5afsAwUsnNw/Ega61mCCViybIcjiaF+JEC6JptkFqmuWf7zDEQ5xoOiRg1Xki7IkGE1jzpL9hiKMO3mIjdkqaXqPj5OWHOGvhkcKjzmCIb1P8VPuMUBxqMIytCVLQ5P78wW8Y4lSbo5iaPRVNj5G++RkHcbroD0nrWAV+9p2GRSerWojjwSqoMhbgq9bZ9xDni0Kdiiozgon8+K5n9j1EgJ4TEI2rqAvsE2FB+r4/BiJEe9GYNjaUpq0+de7rh4jRJomKLPQYK4TYNlVf3qYnFCLoI6pijswmpTny+ujcNgciakmYLS2aogcfS85tsyDCNCDSm09zuDFMbJl+vxmBbxREoDZKKV+e8i9DCapreGIhImmXtUpJsRXM0sdmNe3utBChWiFOuxWGln59FV8MRLBuBSJ3TJnMPSbqN3/pD0NED7JCzCs15kFnc6P+OIhwPTiheAl5rYZrTcFT28vQSSAD0AKJ7m2SXoFrTKfXvIInFDKIQcc4SWo0Ka/+Ti8VZCD0Cjqtz7XNps3l2mbV+tNCBqRVInu77KEK35l93+xqLxYysH1GRz9v6wM+mx5/310+f5DBEQ/07MDXB0P5nt/mY9+PggxwyR+m8kjLP9Zy381mvg+FDHQQFB3mL+iNgwxYg6LDfAa9cZCB88JFvhcaxmJh4S8dBYlvBXcEKgAAAABJRU5ErkJggg==","#4e342e":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAU3SURBVHhe3ZstTFxLFMdR1aiuq64qpuKJOpInXsIaREUlAvFEBaKBCgQCUYFowoonVlRUrqioQCBewoonmoBANAFBQiUJm0AC4r7zOzuzmV6G3Z3LzNy7+09OuLkf5/zP3pnzMXNZyIjW4uLiK0SOl0XaJVl2rrdE5gLqtPwtOzuVzPKP8cDx/f39jaOjo69nZ2f96+vrXzc3N4P7+/sC4ZhzXOMe7nWfnakfwnV8a2vrw+np6UFRFAORUAx4Fh1Wn9HdWPCGdG5D+vLy8sQ4ojg9OSl6X7rF7oeN4v3b1eLd8pti9Y/XKhxzjmvcw70u0OX8ENho3GiAUHtpaemdeeOK28Gg+PpPp1hf/atov34VJDzDs+iwQDc2sGVsNgLqPG+IeQzR+9tbJc+b9TkXIuhAFzoBNpzRUPuPoM53Op0dS5DhW+WNTxJ02qmBLWxi23CoDe1ut/tJWQmYv8xpnwMxBN3YsMA2HIZU8mOZdEUaAwxTH+kUgi2AbZMyCYxZ0VpZWVkjf0OEt+IjmlLsSIADXOA0pJYHbZvm+v8eegnmEGwDuMBpSC0xKEZ6vd5nDF9dXUWJ9FUF23AAcMpSKJGHxZ4OfQoXH7GcAgeDgakRkqJ1cHCgk+/kx39eQnUIXADc4DikmgAMMbGjxc723+teMnUIXAx+JZ0GpBy1cnHhJTKNrLX/1Ah+/vOnlrkIx5zjmu+ZaQROwKTFNDg+Pv6Okao5v/t5b1TS+sA17vE9O0lsbQBHQzc6WrbWp3PzkRgnbgU3CVXqCjgBOMJ1SDkiNjc3mf86ZH0ExsnOxnslFwKe8ekaJ7ZzhKuhHQ/9fr+NchoSn/FxcnF+rsRCwDM+XePENktwNbTjQfSS/4vD79+8xh8TOzSrIHSqwc0gfj0gSjUDhM7Pzu4Oj1UCz/p0PiZOnImfCe7u7j6iOTQDENWrIjQj2EwAV0M7HuwPMAsjINUPoOXWLMQAuBra8SB6NQtU6QFyZQHbEwiSZIEXaKb99BkfJ7nqANsaC14Y2nEhirUSrFKzOxF6IkLjDAInAyrBNBDlPSxUXQdI2Qs46wI9Qzc+RLlaCQ2ErqTqBp0iKF03KMpfYgHSKZe/QwUutg8QvDR000AMaMHd0AURFkfTQoxsY+kp0yC2OMN/29BMBzGi6ZBNiTpXhK3AwW7OCNKkvzLEkGaDqhE7pji9RrroX4YY06qQdbg6gyG27VqgIO8eoRjUYBjasMQUp9FKH/zKEKO6QFKlZo8lTo+RfEPkAcToMxFlUMcOkVP5weGZoZUXtkXOHQvcuZ+k9Z0WYp9RkD0WuHNfpJ63byEENCPQiuaoC9wdYUFtX4f8BiGiG/VV2thQcdrqQ2O+fggZ3TShIgtdxgoRdDtVX7M+mhRCWpKl3DZ3lrz2jNnmQEg9F9EVoxQB0Ql82HhuzDYLQkyLI3rzpyxulAVdTr+fv+gJgRDURinmx1P2YyhBvoanKoQk7XK0b4icig+dedrdp0KIRpkKMzX0yxDCOhWI3FXKZJ5xon7zh34ZQnqUFap8UmM3OgXNjfqTIMS1TA4tkEoFTzPK3aoQB7RAonubplfgHmeVp3kFTyjEiVHHOE1qdFJe/Z1eLIgjbKhoOB+3kOoscHJv2g2O3BCHRvHg4/raA+c5Nzfz/jGIY7t4Rz/v1gccc85g19w+fxDniAc6yfmkjVyP2M/bBFybj3n/GMRB6gNdTGVLy9nW4txs5vtQiKMsoIxqXAHHjf6v0OgQhzUoGsxn0JsEcZxWL90HDROxsPA/OxQnpNDD2v4AAAAASUVORK5CYII=","#c2185b":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAU2SURBVHhe5ZqvTxxBFMdR/AnNCSSiogknKvAVKIKorEAiKhAIEkgwFSRUkFQgKppQUdEEBKKi4gTmSBCIS0CQgCABgWjCJiAQ2/d5O3MdLnM/dm9md6Gf5CWXu933vnM7O/Pe250okYZY09is2EKP8Z39nWNfBHbQvYMd1Z7tn4HoJ1d5a2trvd1u/7y4uGjf3d1d3d/fJ6mBz3zHbxzDse65Yvh6Nn9E94pvbGysnp6etmSM3cHmIOFcfFh/xndt6V51RF9fX3fMQJTk/Cq92jlIz5a+pCfv1tP266X0cGpRjc98x28cw7Eu+HL+iFrOBgQtzMzMfDBXXHm8TXRAx2+X08PGh1zGOZyLDwu+iUEsE7MW6OBXV1dXkiS5Rehj8pBeft7PrrJncHkMH/jCJxCDWMQ0sStFB7+7u/u5K/D4vNAVH2b4xDcQi5jENhoqQwevqoSb763svvYMIIiJb2JYnD+hEmbZrowWnaZe0RGMWBazZbIwlkpjfn5+0e7lLFY+oTGNmIAGtKApk1YOC3abu/194hVYhhEb0IKmTFp8mnt7ezsEZosKsdIXNWLbbRJNaMskRoR9WOJpVBIXn7AyDQ2GxOQIUWm0Wq1vRPvTPvMKqsLQAmhDYyY1Dk2b7HTeb3rFVGFoAbShMZMaAbvtPVzeeIWMYjbFJd8nocFsnTBOAoUmMNtiHDqdzi+CFN3zLz/96Ka0PviNY3znDjObG6DRyA1Ow05/KjefiEFm9+1RKJJXoAnoK6A1kxyQtbW1JgG4SnnT3c7itorLA+f4fPU10WRnF1qN7HAcHR0t4JyCxCtggPXW96PAOT5fg8wWS2g1ssMhfhdxfvPz0Bu8n9mpWYS8txraDKTGYRGnK3jOe3+er2jaUAjO9fnsZ846Q78gLOJUL2XeHcCt3PIyRqzwWyFO8fxMZkCUP+C/XwN0FyhSA5S1C9iaQIiyC0zjmfLTF3yQlZIHiDkd5GkjOyziWDPBIjm7c38OJe86g6HJQEEUB3GuoyjaB4hZCzh9gQMjNzziXHOB24O2V8QoFqsaRJMhfA5gEef/1oGY7e+8Rh0Q+/63SABthtaxISLQHI2LBNGNfZzbILQ50z9eM8QiQaayWGmlHWFraHCYMjLjIoF0Nyi6Yoc0NBjirf69SLA5ImpvsMrFUGLbXqAwZ+SVgwTUxfBs+atfXAlGbEP8xa8XCarFUZGcPZQ5NUb44mcYEnRS7JLoVcwC5+qjYdLIKhcJrLOg9LXg6b1f/tW3SHBmga4FeZsX45jTZCF2NVffIgK0T0AqWkZe4D4RFip7O+QJIkRbMfqKjEd0SHNekTk04atHxLzJNBV7ajSq9bTX3pjw9UAEadsn5mNzp+W1bcLWBxH1SkyX5hgLorPwEeOVCVsvRFi2ICYPabv50TuQIoYvp5NUj4WvHyJQn06ELJedcnffhKkvIpJyOXuHKECG6GR8+Cyn3B0XEaoZItN2nD4f5zpTv7qMrwgiWG8FfZxeJE2Wc+zjbqH+U78XEc2uoM8R8j7kxJwHnfio56o/DBGujRPIkyD1JDzlNjpCIwPQBInqbZRagWOcSq9+CU9eZBBUjMeMZpT3iu37vwLnVFvphUIGwgMV3RoHrQfOfc+xcR9wlI0MSLNE8D1UcR5uQL2zvaLIwHSU2jtwUmVNdf/V+Jvm8JeHDI71QHsH3fzg6X7Pby/jvu+HDJD8QJupNDecBgffPc/9Pi8yUBoo3Tkv8LleDY7YyIC7i6LwMhe9YcjAeeEi3gsNQ5mY+AvRP9Yj6PMdSwAAAABJRU5ErkJggg==","#ff5252":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAUNSURBVHhe5VstUyNBEEWhURQKHcX9EhAYJOIE4iQi4igQOE4gTiAjkZGICBwROBBxIBCRVJEqqAIx9950byZJTT5mMrO74V5VV6XCbvfr7Ex/zbJWIjYhDZW9KVL8ndd+CxRO+5xdRFb2xyDpMWcuLi5+393dXT89PXXf3t767+/vA/P1ZSj8zO/4N17Dayfvh6zMDzF84qenp81er9cxxgwgoRjwXuoo9Knu2mL41Em63+/31BHB87Mx7bYxl5fGHB8bc3hozMGBCD/zO/6N1/DaEVDXxA9Ru9Vgnd/Z2TnQJy4Y4MFfXxtzdGTM/n6Y8B7eSx0K6qYN2lKbtYB1vtlsHnMfW6bc2yTPJ+tzLkSog7qoE6AN2qJNtV0prPOtVuuP+fiwBPGY4p74PKFO6iZgizZpWzlUBnG+wM2N7GmfAymEumlDMfIjVAKb2oqlaZepj3QOoS0CtkdSZqlo7O7u/rS5nGDk9hHNKbQJkAO5kJNQKwd7wzR3f+8nWIbQNkAu5CTU8qPRbrf/quU0kT5WaJscAHIiN6GYEczDsCdLn4WLj1iZQg6CgdYIWbHZ6XRa1hxTko9QFaLpkdzIUajmQQN2ZM2dn/vJVCHkIuiTo1DNAJv2rBn8Bj4iiwgLmqLeZ/FEKfqEZQoojQWaFvPg4eFBqpDYnD9S0npRlNC+e+eJ1gbkqHSTY3NY67Nz85GYJZq3F0JMXUFOADmSq1BOiJOTkx/WApesj8AscXt0ccTEGO1HyFVpp0O324UFICb6v7zYW4PAe3y6ZolmA3JV2ukAvag6gNtbv/FpokszCqFbjdwEh0o7HaBUPAndn1dX9rYo8F6fzmni4gznBWkBpWdWdWiU1ugchXhbZ0o7HaD0/14Bn5+fv6zqFYgB5Kq00wF696z2mPa3rCyg7TGQvjWG0m2r+vXVb3yWlFUHkJtgW2mnBRRLJRhTs7v9OR+hcYZCTgJWgnkA5eJF7ByAUTpXL+DmAm2lmx5QLhEtNBCOSq5u0BVB6TNAASjnPEBOa3KOv0OFXNwJUt6xGAw8WjMxQSqXuCD7qDTzAUakIlxmG6QWt/zTV4CTgBFJhwxYVU6ECyEHF1jzpL9JwJBkg9iInVJc/Z8v+k8CxqQq5ByuymBI2zoLBMo9HoNBmT6ENiwpxTVaPBkqFzAqA5KYmj2VuB4j/QBkHmB0HSLvslRxQuQqP3JYV1rlAoZlFZQdC8b3fvlPvwCMcxWUHwtG9j6kmqdfAAQkI7AVLaMuoA3X9lb2dsgYQETeDOPrKz7SKcW9ItNR89UDZOTQhBVZ6BgrRKjbVX3pDz+WAQhJWM55bK4HH8Clmq0PQGoDIqE5R0B0gY82NtRsvQBiYAqwN19muDEp1OX6/fTHXikBgtIopXx5yk17y2t4YgGSbJflcaXYCm7pU2c57e6yAFGpEDnvW2Yr8F498gaqq/hiAMKyFZbJCi7q13/pTwKktyCSFWIGJ27QQR1bqna1AOJSJocWSOMFTz3K3VjAASmQ2L0t0ivwGtfp1a/gCQWcYMcoeWyR1OhSHj9U2+mlAhzhgYqkxlnxwO17Xlvrf5AKBhyChwD3tu9Qhd+5fV/vai8WcEziAfv50fqAn12Pv/r7fhrgHOOBzA6Y4znaorh8z799j30/DXCQ9YEMU3mk5Y61+N1q5vtQwFEOUIbtHcDP9Rpw5AYcliJJsNrFTizgOF+4yPdCw1ysrf0DIS8PPXNlrd4AAAAASUVORK5CYII=","#f57c00":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAT/SURBVHhe3Vqvb9tAFA7sHxBYMFA4kEr7A/oHBAwUDBYMFhZEVcnAQEBh4aQWDEzqQMFApQ4URGpBYeCkViopGCiw2kiRvO+7e2dfsotjX+5sp5/0lCix3/vOd/d+nTs1ogvpiexA+nPC38z/vPZNwAx6frBlZW0fBknPzPJwODwajUY/7u/vb9M0Hb++vib4VJDvY/7Ha3itfS+EutbmQWQzPhgMDsbj8SUG96xGWg3PvJc6jD7R3Vpks84ZfHx8HMtAFKYPt+l0dJxOvn9Mk5MPafK1myZHHS38jt/4H6/htTaoy1oVrVwNJNTf3t7+JDOukTyl0+thmhy/ywdbVnAP76UOA+qmDdoSm62AGjyXapLkbCe/v8zOsq9AB3UZ0Ia1LRp/CGrwp6enmCq9z7l8vWZ8mXBF5FvjmTZpWzg0BjN4Be5fJ/mAQhsG1kNoBDt0TMJFL3kH4RhibwlxjnSMtaLb7/c/m1iuHJ2DaExRDhIgB3IhJ02tHvRNmJuOL5wE6xDaJsiFnDS1+Oidn5+fKMtw+kE8va/AtgmT5ERummJEMA6bpa+SGhexGoUcCHKSHCEquldXV2c0OH24dhJqQsiFIDdy1FTjoGeSnTbMvhGzCsiNHDXVCMjC3t8/TiKlxKS4T/ChE+ROFHz3TplFyImQsBgHJs/3jfmTy4EiWQRe47p3mZjcgByFbnB0zfJX1ZyDRJGYuF0GXnkFOBGyDcL7gcPDw56ygCXrJFAgZo9WgY+PUdsJIFehHQ43NzdqFKrYcRgvErXfqwL3uHQViSmWyFVohwP07lH59O7MaXyhyNL0QdWtRm6CPaEdDlB6QM1VK77JT/XcvMB7XToXiVUpsl8QFlCqQmBVB1XG8y9C1YhgOdrwoZBKqXlNVkD4B/Dy8rJPzevgA8hVaIcD9Pap3KcGqC8K6JoACF8aQ+mWUs0S2GG8SGrLA6Q0BraEdlhAsc4EPXL26JkgOAmYCcYBlKsWTFXnZCRqLZA72wuhGx5QrnOBqo7QlkjVoJUEhc8BDKDc2w/Eluj73wAGlEuffNtxEmlCyEXA5mhcwIhOiBrsBs+L6Q4D8ZohBjCyqW1h1TXZETbCznCOTaEZFzCko4Gnxw4pVmSJ5/3nAWMqK1ypNxhITC8QqPeMEAa1M/TMCUKIFfvjO795wKi27pGzhxKrxgjfACmD7IyggVVgZl+aoM0A9jWLBnyBtfebmX0DENC+4Ne+k2gMoS1B/Xt/HiChIwLT4zryAutEGGjs7ZAZgIjqRFRtl/mI1fa6FvPNA2Tea06YnIptrEoy2157L+bbARBSUxPz2NxqeR2L2fYApJiU67AYwSFajo82Gn01biFAbFdR5PnhCs2N/4TtLjn3A3bFXDsBgqpQClkuW+VufQWPL0CS5bKarhAZopXvU2c95e6qAFHNetWtMLv0m834qgKE9VbwOE43Yr0b3P6lPw+QzqOCxys11uuw7fX6ywDiOk0GKiVIswlPO9JdX2AAOndlxVimVmCun1d67Ut4qgKD2IDccTRlQqMV8njPhqhZb2AgPFDRobGgkWo1OHlt3AOOuoEBZf7AdahiHW4Q673vFwED0/6AvQM7P2C8z2v89d/3RcAAde/Ayg+seN+eGj8WMMjsjVOe6JpTXfltPeN9VWCgbKBkOS7A7+1qcMQGBpw5ReBtOr1lwMD5wkW8FxqWotP5B6vp+ls7SfB9AAAAAElFTkSuQmCC","#fbc02d":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAULSURBVHhe5VqxThtBEKXhA2gQNKndRIIP4AOQcJEiBSVlSiooIpGelPkAl+mgTEHhIkIUFBQuXESiSIFEikhYIhJXOO/tzN7axxp7l927A540EjK+mTe3uzNvd71UI9ZhHbUtWLdi/Mz+n999FViBMaFqsosan6WPFweSLkd5bW3t4/Hx8eeLi4vv4/H49O7u7ub+/n708PBQ0Pg3P+P/+B1+l8/Y59XXi3kR5YgfHR0dDofDPhIbwUIx4rP0Yf2p79aCI1Qmfnt7O9REBKPhuPjdGxeD/XFx+WFc/NwaF/1NMf7Nz/g/fIffnQR9VV5E62YDi1Z3Y2NjV0dcUIwk6YttJPo+zPgMXwZ8WNA3YzCWxmwFTPIHBwf7uo4l8etvOsqe5EKMPuDLvgjGYCzG1NiNwiTf6/W+spgZhn+v4kZ8nsEnfROMxZiMrRwagVnzJAJOJnkz3c269iSQxOCby0Iw+RIaqQlbbFd25M2U95LOYFwSAGOTA7kIpfrQ2dnZ2WP/NsmbkfcQzWk6E8iBXMhJqNWDbtnm/vT9BGswxibIhZyEWn50Tk5OZA7+u0lT6WMNscmBICdyE4oZQYmKeDL1KVx8xOo0cFCMVD5nxfrZ2ZksPrY7H6EGzLZHciNHoZoHHcQxc664+uQl04iBi+KGHIVqBrDlmDCjaz+RRcxKXOp9qjua3Sc8Q0CRE6FtMQ8Gg8EPBonu+b+gmSa0/SNQQuM73mfnmWoDclS6ybFitX5xuesn8ZQ5BTcXUboCnAhyJFehnBDYgGCeARylULnrKvXCCO8wm4YbQa5KOx3Oz8+7xntE9bfrMwgRdcZ2A3JV2ukAv3vG+82pN/hM06kZg9ClRm4KSuO0wMbjkJ6D1+fwi2EUAz7r9TnLtM6Qq9JOh/IFhHYArc4xiI2V9wW81RkAv2+7BsDptnEdsf2trQvo9hjYVtrpAKfvjGujA/wEZlotOgAvwKnMd0o7LeBYlGCMZtf1uQiC6wyNh6YCKsE8gHOzyGJGx1jOvYCbZadKNz1sJwguhJOWazeoBTBLB7CAf54HyEhlPf4ONbcPAPIeiyHAgFFaeiAyUJr5UC6DBk+Dq2bbX9bpb4E4bIdyGdLkibA1ngwLyClP+6sCgaQbxFbslMbOIshX/atAMGm6vBdotBii+Om9AJBe/T0FBJRiGLphSWluo5W/+FWBoLwgidLsqWxij5H9QuQREHQZZhg0Mgvc6JPDstKqFwgsW+Taa8HU2k+/9V0UCM5ZILWgzo7gKj9jNzP6FiAgHYHyuA5dwL7vZG+9lX8WQMRIsahtbKi5bXVfwzcPkOEmSdQhf+/nI57C4FvBWO360SQIycLMeG1uLz4A/jiqXQCpVZicGOVoi67tMcaqhm0XQEzEUeqCOF346hc9IQBBOZpJuF2eOO2tb8MTC5DkUjDDlWQpuKlPn+2c+lWAqChELoVnnPOZk1439ZtTfDEAYVkKpivEyGTIXVf12z/1qwBp1xVCLzlp7lK1vVV/HkC8vK0Iuuebvk9sh9yNBRIQgcQd4yKtkS3P7fTaJ3hCgSSWQ35XbFuePtPsTi8VkAj3CtIan6oHbt3zu+3S+s8FEhKVCHgvVdzlBtFutRcLJOavB69t3c8CkuMJkizyUh9M9Xv+73Ws+1lAgtQHcpzLG133sxZ+9jL7fSiQaFkUFa+v6M0DEqZI4skO7WWLnVjwNreWG92ZWFr6D5WecuQ+uP0fAAAAAElFTkSuQmCC","#ffea00":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAATxSURBVHhe5VuvTyNBFOaPqEScQBKCuD8AiSGVSORJ5CWcwHHiBLL+5CUY5IkqUkmCAAfiEgymoglNqNj7vnmvO9vN0O5MZ2a38CUvt6G7732zM/N+zd5WRvQg+yoHkH5N+Lf577z3Q2A+6Ppgm8rGvgySXpjli4uLH6PR6M/j4+OoKIqH19fXSVFMcTkt5Lp44G+8h/dWn4VQ18a8iHLGz87Ovt/f3w/f3t44Ui/wGT5LHXN9qruzKGedpJ+fnx90LIIZJn76qyjGx5CvRfHSg2yp4Jp/42+8h/dWQF2VF9HJ1UBC/b29vWPOmvIGxkUxOcc/XyqDbSh8hs9Sh4K6aYO21GYnYAbPGQLHJ6GKFU/yC7McKtBhXkS5i54qq6H1l2AGPxgMfpb7nMs3ZMZXCXXq1qAt2qRt5dAazOANK2L6200+ptCGovISWsEBw1W5NM2SdxBOIWZLENNCQyYdY1b0jo6OTjR+gwc8t4toSqFNgBzIhZyEWh70yzA3vXYTzCG0DZALOQm19Ni/uroaGMuzfyASw9OHCmyTA0BO5CYUE4JxGPYkODNxcRLLKOQgGGuOkBS94XAobpghyUWoDdHwSG7kKFTTYB92JNkZH7rJtCHkIngiR6GaAIi7p8bMDP7PRaSJMKEx+T59KEMohNemTlgjgTL6TG5wqnTj4+7u7q+xEhrzJ8yWy5TWAfzGe1zPrhLNDchR6UYHXO58+bOac5BYJhq3GyEkryAnAbdBfD+AAoT7H0AAcBFYJnaPNkeIj9HgRK5KOx5ubm76RnuI99f96YUQP6PRgFyVdjxA74nR7lvw2KXpD9+tZgslpsZxAaX0YP77c/LNPBYEPuvS+Z5YP8N+QVxAqbhZ3whQVm4BCLd1rrTjAUo//Qr49D5AokBI+ZsrCmh5DCSJAjtG9ezFbXyZ5MoDyE2wo7TjAorFQkjObvfnavj6GQo5CV6UbnxAuayx0D5AylrA9gWulW58QLlGAk9HWJVU1aB1gPEjwBxQLn4gpB5ILfYEKc3+nwMGxKWHOKlUYp0sm6NpASOSbrXZDa6LDX/xM8A6YGRbbGHvttoRngvbFKVj3VaaaQFD8spDPXZMMZHFIJ33rwPGZNOZc4Eaodyi5wLAodLLAxgUZzhBieAilkNoW5De+dUBo2I9JGePJbbGiF/8NAEMS5O0jVVgZ59N0HYA47oKWvAFdu+3M/tzgID6As/mxTpimyz5934dIKHdYpbJOfICngiXZW9rX4csAETky7CQMtZXbFk9VPPtA2R2hRPg28bykcX22q6a7wZA6NLQSnlsrgcfwKWa7Q5Aikm5bM4UDtE6Ptpo9dO4dwFi2pZBbb5Oc6Mupt1V1vvJvwJZCyAohVLMctmWu/kKnlCAJMtlma4YGaLN+KgzT7m7LkBUWaNOX2crmKVf1vrtZny+AGFZt+tEBev1u7/06wDpSlTwPOSk2IPO7nr9VQBxeyTkkyAtJjx5Gx2xgQFogsSKsUmtwFy/rPS6l/CEAAO5NcNpEhptyLvVxzcfGAwPVDQ0Lmmk2gYn7017wJEbGJCUzYTrUGXxBLkbZW5sYGDqD+DYq/kBr22N/zH2/XvAAKV3UM0PbLzvTo2fChgk8wNppvJE157q8m+bGe99gYHuVv83qV53q8GRGhiwdYof1emtAgbOz+/Tfd6+Eltb/wGuzWFMyaOCqgAAAABJRU5ErkJggg==","#afb42b":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAT+SURBVHhe5ZqvbhxJEMaN/AiGwZYseeGBwAOGCw7cAwQeDDjJspQHOBBwkqnhwSUGkWywIGCAgYElRzIwiOQFByJ5JRsE7NWvpntSnmt7t3u7Z2adTyppNTtT9dV0d/3pnq0OsSOyK/LWybgl/jr3cO+rgHe67eyqsrEvA9JPRvn4+Ph9VVX/3N7eVvf397OHh4f5woHfXOM/7uFe+6wIujbmRTQjfnh4+Of19fW5+Ng4G4E5z6LD63O6B4tm1CF9d3d35RxR/PvtcnFzc7K4uHi/OJ+OF6effllMTkcq/OYa/3EP91qgy7yIQc4GCI339/d/dyOu+P59rg6dTw/E0b0o4RmeRYcHurGBLWdzEFDnGSHWMUQh/eXmbzfKYQdXFXSgy78IbJjZ0PtLUOdPTk7+8gSZvikjvkzQ6ZcGtrCJbcehN6jzykrw9etEyLKuw06sLyO14WFeQi94S7pyXHSahknnF2x5uJRJYOwUu+Px+J3P5QSrENGSgk0AB7jAqabWDcY+zc1m0yDBLgTbAC5wqqmVx+5kMtE5+Pg4yxLpUwXbcABwgltNsSDIw2JPpz6FS4hYlwIHh7mrEYpi5+zsTBcfKSlEqA/x6RFucKyplsGu2NE597l6FyTTh8DFYQbHmmoB+LQ3n98Giawin85/1QiODgoahN9c47/QM6sIOoBLi2VwdXV1ipHUnG9L2hD4bx3dAI6Obnbs+Fp/+vm3IImXxOftVZBSV8AJwBGuNeWMODo62sMAoxRb7lYXfyi5GPBMSNfzMmpmF1wd7XyoqmqM8pTo79dnDFLijM8GcHW080H0aqitG54wgZD4qZmC2KVmGiVK47wQpZoBYtfn5eUHHksCz4Z0PicmzuTPBKJUPYmN0j46p2ANWx8c7XxAKZo3ZAYUeQE/fQzQLJDS/naVBXx7LCiSBd6g+fHxW9D4S9JNHbCn3BzeONp5IYq1Ekyp2c36XIrYOIPAyYFKsAxEuS6y1H0AonSpXsDsC0wc3fwQ5WolNhBaKdUNmgBYrhsU5ewHKOmy29+x8qMPEJTdFhMDuhk60A0RNkfLQoxoZdPnbnBbTPrLXwC1IUY0HYI+d4S9wMGgTPprQwxpxEmN2DnF1P/lon8bYuwAi+zJ9xsMR825gODA0esGYlCDYWzDklNMo1U++LUhRjkgSarZc4npMYofiPwPYnTbb5L2cULkKz/HYdvR6hZiWBNw97HgydrP3/quCjG+LdJ5LLBrX6Sf0fcQArpPQCvaRV1Qnwg3bW9vX4c8gRDRUiyljY0V01ZPnfn+IWS0SQJ87xcinkPQbTCsjyaF0EdYlTw29wcfgo/O7HAgpHZENDSXCIgm8GGj9+8DgxBiWhzRm6+zudEWdJl+v/uiJwZCUBulnO2yaXe7a3hSISRpl3W4ciwFM/XR2U27uy6EqFaI6y6F1tTvr+JLgRDWpVBnhZQyeWSj/vCnfhtCuskKKRsnZqNjuFF/GYS4bpyAmHO+1nlitxsduSEOaIFE775Kr8A9ps8fXsETC3GCjvECb1ZJjSbl8Uy/nV4uiCP0ChrOX4oHZt1z77Bq/XUhDjWdTOhQxRxugGG0ubkhjmk8oJ+39QG/TY+/+ev+OYhzxANd5D/qgyf5nv9ex7p/DuJg88UpJ7r+VNdd28x8HwtxtAmKDq8v6C2DOGy3d15n0FsGcZzN/XIfNCzF1tZ/N/ui4OZdBvwAAAAASUVORK5CYII=","#7cb342":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAUkSURBVHhe3ZotbxtBEIaD+hMSVlypJMoviAoCzQsCC8qrKKCgoCwFBQVBKQwMCCgwMKgUg4JIKTColIBKMSiIFEspCLjOM961ptb6Y8+7e+e80isl9t3Mu7e787G+jYLYEu447jp2HP3//nuufRLwg7aDXZb+gazlw0D0f4M+Ojp6f3FxcXp9fd2/v78fPjw8jB4fHyvI33zGd1zDtfZeIbbW5kEwayr88PDw3WAw6FZVNRLGYsS92PD2nO3WYjLriL69vf3pBqL4fTeovv86rU5/fKi+9N5UH791qg/ne0r+5jO+4xqutcCWeRCtXA0I6mxvb792M674+zjSAX3u7Vfvz19FkXu4Fxse2MYHvpzPVkAHzwyxjxHKvu4NvurMhgYXQ2xgC5sAH2Y1NP4QdPDHx8cf/UyxfOvM+CJi028NfOET305DY9g9OTn5pKoEP27OdU+HBpCC2MaHB77RMJZSHrukK780WaYh0TmIL4BvlzKLP4StTqfzhvyNEIJVSGhO4hOgAS1oGksrg12f5gbDflBgCeIboAVNY2n5sXN2dvYFx6O/d0kifV3iGw0ATWgbS8wI8jBjxymFS0hYSaLBYeRqhKzY6na7GoFu/vwMCmqCaAFoQ+NYah7siB8tdr723wXFNEG0OAzROJaaAaQcvNyNhkEhy/BT97VG8OHoRgsayN98xnehe5YhmoBLi3lwdXWlVUjdnG9L2hB8CR26dxF9bYBGJzc5tnytf/z9bVDEPPq8vQzq1BVoAmhE61hyQhwcHLzEAUs2JGAeTaReGnUyjO9H0Opkp0O/3+9gnIYk5Hwe2eOx4J6QrXn0zRJanex0ELv7GL/83Q06n0UOOuqCe0M2ZxFtDvtOdjqIUc01sfvz7HLSLEaDe0M2Z9HEGc4L0kKMagqMfQA+OtdBbEYwDyB9KsQoltdkBWR5ALqZ1yQG0B6nhRjVLFCn/S2VBXx7LMiSBZ5jmfYz5HweS9UBvjUWPHey00IMayVYp2Y3+3MhYuMMRJMDlWAeiHHtBerMDszZC5hVlq0X4AFoLRAbCC1zdYMmAKavATzE+As8IDrn8Xcs0eL7AMELJzcPxIEW3C09EBk4mfkgTrQgWmUbpKZZ/vkOQzzEiaZDAlaTJ8KeaDCBNU/6m4Y4WulkKCVNr5Ev+k9DnO3hkcKjyWCIb1P87Dl5ZSAONRjGNiwpaRqt/MFvGuJUD0jq1Oyp6E+CBekPQBZBnD4T6iqoWxmuQlP5oeGZk1UW4lh7XWaiZCzAl5n99K3vshDnk1VQMhbYvS9sZvY9RICeExCNS9QF9hdhQfq+vw5ESA81vL4SEp2S5hWZnnPfPESMNklUZLHHWDHEtqn68jY9sRBBujFz/mzufwYX8HJUuyCiNoUamnMERBP48LHp3LYLIkyLI3rzVQ43pokt0++XL3piIAI1SqV8ecqc9pZreOpCRNIu63Sl2Apm6WOzTLu7KkRokq2wVkt/GiJYt8IqWcFE/fYv/WmI6ElWqHNwYg462hv1F0GE68EJxUvMazVcawqesgcdqSED0ChG97ZMr8A1ptNrX8ETCxkEHeMlo1kmNZqUxz3NdnqpIAOhV9BwPi8emH3Pte2q9VeFDEjbZhD6UcX8uAHa0eamhgxM4wH9vK0P+Nv0+Ou/72dBBkc80LMDXmnjaAv619sEfPc09v0syAA3/RunHG74Aw732Xrm+1jIQCdB0eHpBb1FkAFPgqLgaQa9RZCBE/rzvdCwEBsb/wAtnArw9SqUOgAAAABJRU5ErkJggg==","#0f9d58":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAT9SURBVHhe5ZuhTxxBFMZRWMxJBH8AAjyif8CJSkxFRSWiogICsqISiSDBIJpQgUA0gQRRcSQVJDQB0eREEyoqmrAJFYjt+z1mLo/twu3Ozewu1y954XK3+943tzPvfW/mmGkQvbm5uSX5u+KsXzB9313TE5sK+EEXB1vJnvOXAekHT3lnZ+ftYDD4OBwOBzc3Nz9ub2+zu7u7HOM17/EZ13CtvVcMX8/ji7BPfHNzc/3y8vIkz/NMrC4y7sWH9+d8dxajpw7p6+vrb24giqvfP/Lt88P81cl2/uJwPV/Yf5PP7a6q8Zr3+IxruNYCX+aL6ORsgFB/eXl51T1xxa8/Wf7h/FO++HFtNNiqxj3ciw8PfBODWC5mJ6CD5wllWfYLoqxryNunHGr4wBc+ATHMbGj9S9DB7+3tfcju/ijBLz+vgp74OMMnvgGxiElsx6E16OCVlWD/+2kp+ZhGDA/zJbSCFcqVn5pM0zLCKYxYgNiuZJIYG0Wv3++/pn5DhMxdRjSlERPAAS5wuqfWDPq+zB0Nv5YSbMKIDeACp3tqiYEYOTg42CYwJSpGpg81YvsyCadGhBJ1WOJpVIRLGbEmDQ4OmdMISdE7Pj7eJRolqYxQG+bLI9zgeE81AZhiXuy8/Py+lEwbBhcAt6TLgJJDILR6GZEqhqDxeh9Bg/k+YRIB5fsHVxbT4OLi4oggoTV/a7A/krRl4DOuKbt3nHltAEdHNzp6fvrTuZWReMp83a6CEF0BJwBHuN5TjoiNjY0lDSBTtozAU2YydWWEVBjfj8DV0Y6Hs7OzPs5Dsn+xv6+CkDzjqwFcHe14EL+vcV634fFTMwR1l5pplJDGcSFO3+G57vpc+7LDbUHg3jKfj5nJM+8c7XgQp1t4rlsByOqhqFsRfCUQbDna8SBO//sZ8N/nAK0CIe1vU1XAt8eCJFVgAc+0n2XBn7KmdIDZQV5wtONCHKsSDNHsZn2ORd08g8HJASWYBuJcRxHydLCUvYCZZYeObnyIc60EdROhtVTdoEmA8SuAhzgPzgOpLfn695AAuhnaxQ0RAZujaSFBVBG2uRtcNFP+4ivAIiTIPJFIWG3uCHuDg0ms845mWkggrQahGTummV4jXfYvQoKpKuxCMjTJr9kzQgmoybBuwxLTTKOVPvkVIUE5IAnS7LHM9BjJD0T+gQSdFRsSPVQZTmJG+cFh1tFqFhJYW+Q2ZoF5+vFb36qQ4MwCzQVNVgST+YndztP3EAKjitCELrAnwoLWfh3yAEJEO5GQNraumbb61IVvH0JmEUYosrrbWHUM30b1Lbrw3YAQ0rSc8tjcH3wItl3Y7kBI9cR+wi6FODKihxit/jTuUQgxFUdsckyyuVE0fPlzP0HzoqcOhKBmqZjtsml3m2t4QiEkaZe1TsVYCmbq47OZdndSCFFViJMuhcLUb0/xhUAI61KYpCqYrN/9qV+EkKYq6DlCyE9qzEEnPrqZ9cdBiKtMriuQCoKnG3I3FDIAFUh0b1V6Ba4xnV73BE9dyCDoGLWOVSmNpuTxot1OLxZkIByoaGl8qm02bS7Xpj3gaBoyoFE+KDtU4b2pWfePQQam/11CP2/1Aa9Nj89/gUwnZHDkA907sPrA1Hs+m451/xhkgOgD3UzlRNec6vLe86z3dSEDZQNlNOcFvO7WBkdqyIA1KTpMZ9IbBxk4P7hI94OGsZiZ+QsYwNmvO9DwMwAAAABJRU5ErkJggg==","#0097a7":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAATlSURBVHhe5ZshTyNBFMf5EJWIE0hCKu4DIDEEceIk8uRJEhA4DAJZWYFAnKioQFQgSIAEQQKi4hIQJJxAkNAEEk7svd90XjNsBtidzuxuuV/yEtLuvvefnd333kyXuQppibWtLYut5YzP9HuO/RTooPODLWozezEQ/WqWd3Z2tk5OTg6ur69PHx8fb5+enkbPf/9mGH/zGd9xDMe654rha2YuxGTGNzc3N4bD4SDLspFYWUaciw/1Z303lsmsI/ru7u7KDsQwfHjIdi+G2bfBcfb112HW6vayuc6BMf7mM77jGI51wZdzIRp5NyBobWlp6budccP983O2fX6VLRz0J4MtapzDufhQ8E0MYtmYjcAMnhkajUb3COW5Rrw7y6GGD3zhE4jh3A21XwQz+G63u6sCj//cB834R4ZPfAOxiElsq6E2zOCNKqFz9dsrPqYRQ3EuQi0sU6505rlNfYJTGLGA2LZkkhgrpbW6urpO/UYImdsnNKURE9CAFjSNpVXDmpa5/s2tV2AVRmxAC5rG0tLT7vV6HQJTomJk+lAjtpZJNKFtLDEh1GGJZzoVGhefsCoNDZYH2yMkpTUYDLpEoyT5BNVhWh7Rhsax1DS0tdlZ7h95xdRhaAG0oXEsNQGdTucngejVfUKK2Jf9/qTfp4xhuk7gO985RUzXD2i0cuNzeXl5SJDQmr9xejFpaX3wHcf4zv3ItDdAo5UbnZbe/qzcfCLeM63bRQjpK9AE9jGInwdkAdImAGXHJ+A9czJ1YUIqjJZEtFrZ8Tg7O1vDeUj2z6/vixCSZ7QaoNXKjof4Xcf5/vDGG/wt01szhLKPGtostMZxkZ57A89ln88fR+dGUQic6/P5lmmeQauVHY+Xl5ctnJetAGT1UMpWBK0EaLWy46EXYBbugCQXQPz+3zlAnM5MFRCSVIEFPM9CHyAsWNlxEcfmEof07Pp8FqFsnsHQZKETTIM4N1FCZgdLuRZw7rK+lRsfrQRlE6FrqVaDmgCTVABF/AfngdSW/PlXJIDpNpq4ISKwOZoWCbJNpDp3g/Omu8PCtpWZDgkyTySe3Tp3hNXQgBbLvJWZFglkqkFoxo5pzlojXfbPI8FWiNiEZOgkvxUrrxokoEmG60enXmFVGLEt6ZNfHglqFkchPXssc9YY8Rc/ReDFJhO9hrtAZx8NVk71MHZE1HEX1D77iggwuaDs5sU05myyVP/s5xERZp+AbFxFX+D+IizU9nbIK0SI6UUrfkXmyIavHxGzONYU9qtRUcttry3a8M1ABO2hKmTLrKg5W157NmxzEFEtMaMwRUJ0Eh8xan017k1EGG+PmCQ1vx8vIeLLSXzJ3wKZChHYQ2XM5bKz3O3ZMM1FRLJcNl1KjA7R6ffxWc1yd1pEqOkQWadPs8/Huc5av96Orywi2DwK01QFJ+s3/9bPI6InVSHklRr9oVNobtb/CBFuNk64jcs0SBzr3PrVbnTERgZgGiRWb0XWChzjrPSa1/CEIAMx93OR0uiUvPpXerGQwfCDipnW9zZSnQ1Ojk37A0fVyIDMshl8P6o4P25AM5a5sZGBmXyQb5Vzre7neO7fQgZoptrtD5x635w1fipkkJM3Ttnc0A0O+9ls1vuyyEDZQHH/m5S/m7XBkRoZ8CQpCp8z6X0ELzQmeamxMHNz/wCQb+qogEaK4AAAAABJRU5ErkJggg==","#0288d1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAT/SURBVHhe5ZsvTxxBGMZJRT8A4gxJBaIavgEWcaICUYfsByABUVGJOVGBqEAgSahAklCBOAEOcQLRhCYkIBAXSEAgtu/vvZljspn7M3Mzu3vwJE9C7nbf95ndmffPzLFQIVrCVcM1YbtEPrPfc+2bwKKQAZUHOy25FxtzB0QP3/LS0tJGp9P53u12D6+vr88fHh7unp6eHp9figLyN5/xHddwLffY+42tuXkQwze+s7Oz1ev1Toqi6AtD0edebFh7xnZjMXzriL69vb00A1F0bx6LzvldsXH8r1jdvypaP3vFx86lkr/5jO+4hmtdYMt5EI2cDQSt9srKylfzxhV9md8/unfF519XxYfdyyByD/diwwLb+MCX8dkI6OB5Q6xjhKIZ8bxd3+BCiA1s2eeAD2c21P4QdPAHBwe79k0xfWPe+CRi0y4NfOET30ZDLWAd6uBVleDg8j7JWx9FbOPDwnkItcSENdKVnZpMU5/oHMQXwDca0DKQVB1a7XZ7k/yNECK3T2hO4hOgAS1oGkirBm2b5o6v+l6BVRDfAC1oGkjLj9bR0dEejm8eXzSH+8RVQXyjAaAJbQOJGUGJKv700VO4+IRVSTQY9E35nBWt09PTfbyRknyC6qBNj2hD40BqHqyKH40+64d/vWLqIFoM7tA4kJoBpBy8XN0/e4VMw+W9nkZwbFDQQP7mM77z3TMNsQFMWswDW+fH5vytPzfDktYHvuMa372TaGsDNBq5ybFoa306N5+IcbR5exrE1BVoAmhE60ByQmxvb7P+dcr6BIzjl9/DNTo1uMdnaxxtP4JWIzsdLi4u2hiPif52fYYgJs7YbIBWIzsdxO4mxmlGfM5H0U7NGIQuNadRojROCzG6heXQ9fnt5IbbosC9Ppuj6MQZ9gvSAqNYDs0ANjrHYAZf+R7Ae54B7z4GrGM5pv2tKgvY9liwbmSngxj9hOV5qAMEn4zstBDDushianZnfU5EaJyBaDKgEswDMX6Mh9h9gJy9gLMvcGzkpocY10wQGghd5uoGnQCYPgNYiPFlPMTEgdx01v+ykZsH4kA3Qxu6IcLmaF6IE10Gde4Gl+mkv3zT30KcaDpkxtW5I2yJhtfZnyn9lSGONBvERuyURINBvuhfhjjTqpA9+ZxngZOIb3suIEhf/Y2DONRgGNqwpKTTaOUPfmWIU22OYmr2VHR6jPTNzzSwm6R1nBDZys9sgtYD8T+cBVXGAnzV/vYtRIDGgiozghP5q1/7ZYgIzQiUolXUBfhwyt5qI/8oiJAz1MS0saF02uoz475+iBg9NAGh21ghLG2vNetHkyKog6qcx+b24EPQMW6bAxHVEur8zFEcOUUPPmr7adxYiDB+PaJBapbNjTKx5QS+7L8CmQkiUBullO2y0+5W1/DEQkTSLqviFEvBmfrYrKbdnRUiVCvEWZdCaerXW/GFQgTrUpglKzhRv/lTvwwRPcwKoYec0DnobG7UnwQRrmUyszikQOLa15nfkHI3FjIALZDo3qbpFbjG6fSaV/DEQAYy9e+KnZRXf6eXCjIYDlR0ZOPaZqfN5dq8BxxVQwakVSLwHao4hxug2dVeLGRgGg/YyXXrA/52dnffxrofBRmg7h2Q49nagk6+b06PnwsyyJbdTOVE157qms/mM9+HQgbKBsow3Av4u9H/FZocMmAtkgzmu9iJhQyck+b8J7ojsbDwH1AegL8uq02FAAAAAElFTkSuQmCC","#3949ab":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAUkSURBVHhe5ZuvTyRJFMcx/AG4waxei0ScPEECErkCf2IFCYhLOHFikxErSDArECtHjFiBGLGCZFacAzGOFSSsOLEJnTAC0fc+b15xlU4zM1VUdfew3+QlnZ6u977VVfV+VPWsNYieyJbItslORdx9nuHZV4ENETpU7eyyQlt0rBwg/TTKvV5vv9/v/zkejwc3Nzff7u/vfzw8PBSPj48lwjX3+I1neJY2rr3pWpkX8TTiJycnx5PJZFSWZSESioK26HD6THdnwQg9dfzu7u7aOqK4nvxbfh5MysO/LsuDP0bl7/vD8re9gQrX3OM3nuFZH+iqvIjOzQaclk51G3FFUTxqh/YPLsrtnUGQ0Ia26HBAt7c0OuMotfPHx8fvp9OpDh3r+tPnax3Zus6FCDrQhU6ADWxh02y3Cu382dnZ38V0RpDpGzPiiwSdbmlgC5vYNg6tQNf8+fl5X1kJmLKs6boOpBB0Y8MB23AwLo1jm3DlpibTtI50DsEWwDYc4DKj1Bx6u7u7B8RviDAqdURzipsJcIALnGbUmsGOC3OX325rCTYh2AZwgdOMWn5sDYfDUwz//DlN4uljBdtwAHCC24xiRhCHxZ5OfRKXOmJNChwMheUIWdEbjUbnWCMk1RFqQ1x4hBscZ1TzYMslO10YfSduFsANjjOqGUDIwdD326KWyDLiUlx0kNAgXHPvJQkUOoCFxTy4urq6wEhszD/99H9KWwd+45m6tovE5QZwNLrJsUHNjhEqtzoS88TP4BYhJq+AE4AjXGeUE+Lo6GgLA1RndQTmieepl0aMj3GVI1yNdjqMx+M9lMd4f7c+QxDjZ1w0gKvRTgfRe4Dyi6/fa40/J25qxiB0qcHNQGqcFqL0EM2h67N/+g/NokDbOp3PiednDo12OohSDYGhL8B55xiERhvvBaQPhaL0l58Bv7wP2EHzKkQBQfrSWJS+QTPlZ53xedJUHuBKY8Ebo50Wolhf8d67L7UE5om3Phci1M8gcDJQEOWBKFcrMaOD5KwFvFn2xeimhyjXSBDqCH3JVQ16DjB9BHAQ5W+xQM6dc/s7VODinSC9Nbp5IAY0s4ldBjnEm/5sjuaFGNGM8CXLILV40z/fZoiDGNFwiMOKiQapBQ6eY80T/qoQQ0OsxXrslAIHw9Do5YcY06zw9kfRqjPENhwMjR2MKMSgvvrQgiWleIVWfudXhRjV4igmZ08lXo2RvvhZBDG67jZJ25gFbvSNw7rRahZiWGdB076gsvabH30HMb4u0rgv8Ne+SDuj7yAENCI0dVLsnwgLmvX8z0GIaC4aU8aGildWX5r59iFk9NCEjCx0GytE0O1lfd36aFIIfYRVzJbZsuJteX00s92BkNpwR+c5HKJzfGajc1+KKoQYX49obZ6yUEKXV+9n/wrkRRCCWiil/HjKfQwlaK7giYWQ3BTRLCXFUvBiPjo3zUy3IUQ1Q2S/7yX7fLRFh6G9jC8GQngAazx3TJpMG8/rD0zt6kBIsxS0BzGf1HiHquhYjalfhRDXNDk0QaokPN1Id2MhHdAEieptmVqBZ7xKr3sJTyikE1SM6sqXCY1eyKNNu5VeKkhHOFDRYZ3nD7x1z7N5DziahnRIs0TWdt2hCve8dd/tbC8W0rEP9I563k+VufZq/A/2+OuDdA5/oJ+MuPygEu/57XWs++cgHdx0m6kcabljLbu3mvE+FNJRNlCeYp2A607/KzQ5pMOaJBlWO9mJhXScDy7yfdCwEGtr/wEKZKoqxqm2xgAAAABJRU5ErkJggg==","#9c27b0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAUWSURBVHhe5ZqvT2RJEMdRWBy4tWMu4cRJ5ElwyBMrVqxEQrIJfwArTyIQJxCXMOIECSMQiCFZsWISLkGMIAGxgoRJWLFirj413ZPaSc+P19Pd7w33TSq8MK+rvvXe66rq6l4riC2R1sbGxq/yd0dkd0J23G8tEe59E9hyTk06u5C4sSv5MCD901s+OTn51O12z/v9fvfl5eXp9fV1MHTgmv/xG/dwrx0rgq7VeBD2jR8fHx/e3d11xMexsxUwYCw6vD6nu7HgDY0df3x87DlHFN96z8Ovp/fDzkF3+PduZ/jXb/8MT1ttFa75H79xD/daoMs+CGerUVDnt7e3/3BvXPH9+bs6dP57Z+zsosIYxqLDA93YwJaz2Qio84eHhwfMY4j+GPxQ8vYtxwo60IVOgA1sYdPZrhXq/NnZ2WdPkM835o3PE3T6qYEtbGLbcagN6ryyEvx73g+STynY8DAPoRbskK4cF/1MQ4RzCLY8XMokTRZFa29v773P5SWd9+IfAhzgAqcRtTLY9Wmu33kKEiwh2AZwgdOIWn60Li4u/sTw4GGQJNLHCrbhAOAEtxHFjCAPiz0NxxQuIWIlBQ4Oz65GyIqtq6urU6w9ffkWJFSHwAXADY4jqhlALY7vGLv8cBMkU4fAxeEp63rBp73n+0GQyCJyvnOpERwdFDQI1/yP30JjFhF0AJcW86DX611iJDbtdT/3xiVtCPzGPaGx88SnRTg6usmx5Wv99v51kMQs8QQXQcwDhhOAI1xHlBPi6OjoFwzwlkIEZknn4zhSLwzGhHTNEv91wdXRTofb29tdlLMgCRmfJX5+VkFMnPGLJbg62ukget+j/L79EDQ+TfynGYOqUw1uDpTGaSFKD9BcdX7efPrKsCgwNqRzmpg4Q78gLUSppsCqD4CoHouqGcE8gPSpEKVoXpEvIMsD+N/HAM0CDzfV1wClsgDcHLJkgXdopksbMj5LStUBpoP8ztFOC1GslWBMzW7m51xUjTMInByoBPNAlLexENsHyLkWMH2BtqObHqJca4GqgdBKrtWgCYDpawAPUd7CQkwcyC1m/udti4kBrWwa2hChOZoXYkQLov5l/DRILXBxyNcM8RAjmg5BnR1hL3AwyJP+JiGGNBvERuyUYtYa+aL/JMSYVoX05EOkSorfFxCU3SMUg/rorw+/BImVEGw75A9+kxCjujiKqdlTiVljpF/8zIMYXfdN0jq+Av/2HYd1R6ssxLB+BXXEAjP3y799DzG+LqKxoGRGMJGfi3revocQ0IxAKVqiLsCGKXtrOx3yE4SItn0KH5G5dubrh5DRTRPAeb8Q8RSCboP0mx/LQAjpYamc2+Z+G1zA4ahmQUhtimharNrNXURMdxkbm85ssyDE9mFIk2OZ5sakoMt0kvaduWZCCOpCKeXhKX8YSlBuwRMLIclyWXcpU1SIpt5HZ5nl7rIQoloh6lRY4tgsY82nX1/FFwMhrFNhmaxgon7zP/1JCOlxVogpk02529yoPw9CXMtkUGWfb2I/sRnlbizEAS2QWL0tslbgHrPSa17BUxXiBCtGDeWLpEaT8hhT70ovFcQRNlQ0Nc6KB2bec2/R09/ZIQ6N40FoU8VsboDVnvfTII5pPGA9b0tlrs0af/Xn/TSIc8QDDfH2uJ0/3ibgt7cx76dBHNz0zVSaG77B4f63mvm+KsRRGij23AzXzWpw5IY4PA6KgrcZ9OZBHOfARb4DDXOxtvYfhcYXJnsdOnQAAAAASUVORK5CYII=","#795548":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAUoSURBVHhe5ZqvTxxBFMdR/ROaU9VI/owTIBGICkRFRWUFJIgKEhCICgQCgWhS0QRkxQkUOVFFxYkKBAkIBAmXQAJi+z7vZi7Ty9yPmZuZ3aPf5CWX2933vm935v2YmaWCaImsGGmPEXude18FrNM4txYo9oUs5MuA9NDpVqu1vre3t9Xtdr9fXV11Hx4ebh8fH/svLy8Vwm/+4xr3cC/P2OeNroV5EXw1Jb69vf251+t1qqrqi4Siz7PosPqM7sZi+NX5gjc3N7+NIwr5vNX52Y/q28Fudbj1qfqyuV7tbKyp8Jv/uMY93OsCXehEt7HRuNGgzjNszRdXPPX76tDBp81qa70dJDzDs+iwQLeZGo16Ceo8Q5V5DFHmdef7iX5Zn3Mhgg50oRNgw0yLRrwEdf7o6Gj36elJCV7/6UV98WmCTnQDbGET24ZDbVDnlZXg13lH57TPgRSCbmxYOC+hFrQJTHZoMkx9pHMItgC2TXAs/hJaq6urm+RviBCsfERzCjYBHOACpwG1MmjbNNf71fUSLCHYBnCB04Bafqycnp5+xfD93V2SSB8r2IYDgBPcBhQzgjws9nToU7j4iJUUOBj0TY2QFa1Op3OMtaveby+hOgQuAG5wHFDNgxWxo8XOyf4XL5k6BC4Gt3AcUM0AUg5W7q6vvURmkf2P74f1PgUNYvsErvmemUXgBExazIPLy8ufGInN+T9PjoclrQ9c4x7fs9PE1gZwNHSTo2VrfTo3H4lJYvP2LIipK+AE4AjXAeWEkAaE+a9D1kdgkjhzdGbExBjbj8DV0E6Hi4uLNZTTkPiMTxI7P0MQE2dsswRXQzsdRO8mymlGfMbHiR2aMQidak6jRGmcFqJ0B82h8/PsSIvGKPCsT+c4ceLMjqGdDihFc2gGIKrHIjQj2EwgyPcC/tsR8Pz8/BHNixAD4Gpop4PobaM8pv0tlQVseyxI3xqL0ndo7t/fe41PklJ1ANwM3hnaaSGKtRKMqdmd+TkVoXEGgZMBlWAeiPIzLMSuA+TsBZx1gTNDNz1EuWaC0EDoSq5u0CmC0mcAC1G+jAV2a3Iuf4cKXJwdpGVDNw/EgC6/xASpXOIEWRZH80KMzD0NUkuR4W8hRjQdErDqXBG2AgcnsOZJf6MQQ5oNYiN2SnF6jXzRfxRiTKtC1uTrDIbYtvsCgrLbY2JQVx9+HB54yZUQbBv0DK1yEKMbWI6p2VOJ02NsGFrlIEbfiOhZljp2iJzKDw5vDK2yEMO6TFY6FozM/fTLX7NCjDMKNBaELl7MI84iC7br+foWQkAzAq1oiboAG07bW9vpkH8gRM5hE9PGhorTVp8b8/VDyGiTREUWuowVIuh2qr68TU8ohJBOzJzb5nYbXMBhiGZBSL0V0RWjHAHRCXzYeGvMNgtCjNMj2pvvftjwOhIj6HL6/eynQOaCENRGKeXhKWe1t1zDEwshSbusnytFn+DU++gs0+7OCyGqFSLrffOs8/Gs3fIW1FfxxUAI61SYJys4Ub/5Q38UQnqYFWKO1Dgbnc2N+tMgxLVMDi2QRgqeZpS7sRAHNIHTu8/SK3CP0+c3r+AJhThBxzjzuWIn5fFMvZ1eKogj9AqaGictpDoLnNzbrFp/XohDWiWOiwcj877Z1V4sxLF9vKOfd0tlfjs9/r65/fVBnCMe6NoBR9pY2kLs8TYB117HvB8HcZD6QBdT2dJytrX4bzHzfSjE0WFQNHh9QW8axGE9eWqQ/mTnIoDTXFlOdM2MpaW/3B4zysNcAPUAAAAASUVORK5CYII=","#bdbdbd":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAATdSURBVHhe5ZutTiRBEMcxPACOINBn9z1Yf+IEAnHyBAkgeIDziMNxfnkDViAQS4LbBAQCuQmCBBIQiL361XZPKpPZj+np7pnl/kmFze501b+mu+ujZ9jIiG2RnpP+HPG/c+2XwJbIIoeXCWPRsXaAdOHIzs7O9/Pz8+Obm5vB09PTaDqdjt/f398+Pz+nCJ/5jt+4hmsZY3WIrM2NKGb85OTk+P7+fvj2hn/1wBjGosPrc7o7i2LWIT2ZTMbOFwUOyQxPx+PxdDQaTa+vr6fD4VCFz3zHb1xTvmHoKt2Izq0Ggla/1+v9YNYcb13eOCTLunB2VWEMY9HhgW5sYMvZ7ATUeWbo9fV1AlHvuJ3lUEGHvRHYMKuh9Zugzl9cXPz++PhQgi8vL0EzvkzQiW6ALWxi23FoBbrnIaKsBMxUFfmYgg0PcxNaiQl90pVfmo+Pj5WEUwi2ALbhAJcZpXzY3tvb++nyd5aZL4tfCXCAC5xm1PKg79Pc8/NzJcEcgm0AFzjNqKVHbzAY/MEwwShGpA8VbPvgCye4zSgmBCWq2NNwTOFSRSynwMHhxZXPSbF9dXX1V61JSqoi1Ib49Ag3OM6opkFP7Gix04XZ92JWwQSOM6oJQMrBCvuuisgq4ktc6n3SGOL7hCYFlI8FLi2mga/zQ3M+43zdUAV+a6IbwNHRjY4tX+vTuVWRWCS2gluGkLoCTgCOcJ1RjoijoyP2v85SFYFFYvboygiJMX51wdXRjofb29s+ykOif7m/XwWMqdK1SHw2gKujHQ9Sbf1CufytND5P/NIMQd2tBjcAV0c7HkTvIcrr7s+HhweGBYGxVTrniYkzh452PIjSUzTXvQE+OoegbkYwN+DU0Y4HUfrfrwC9AesQAwRJboBmgZD2N1cW8O2xIH4WEKW7aF6HOkCw62jHhSjWNRZSs5v9uRR14wwCJwcqwTQQ5doLhMwOkrIXMKssWS8QHAitpOoGkwZAD1H+DQuQriLRppiV9c3RTQMxoGvt7u6ukkgbAhcHDkfTQoxoRdhkG8QWs/zjV4BliBFNh6DNE2EvcDBIk/7KEEOXWAuN2DHF9BqXjl56iDGtCpucDcYSfxYoyPt4TAxqMAytCWKIyf3pg18ZYnQfyyE1eywxPca+o5UPYnTTH5K2sQr87DsOm45WXojhA0i0EQvM3j9wdPJDjG+K6FTUPbxoIuaQBdvtzL6HENCMQCmaoy7Ahil7s78YUQkhol1iSBtbV0xbna7rqwshow9NQN1jrDpSOl7r1kuTQugMVikfm/sHH4IzZ7Y7EFJbIpoWUwREE/iw0bk3RRVCTIsjglSTw42yoMsEvvxFTx0IQW2UYr48ZU578zU8oRCStMvR3iEy9T4687S7TSFEtUJsuhVKS7+9ii8EQli3QpOsYKJ+95d+GUKaraBZIeTgxBx0oGM9ln4ZQlzLZFCnQCoVPN0od0MhDmiBRPe2Sq/ANabT617BUxfiRNExrpIaTcprv9OLBXGEByoa0RbFA7PvuTbtA47cEIeKeFD1UMU83ADrve/nQRzT/y5hj9v6gM9m3/NfIF8T4hzxQM8ObH1g8j2/fY19Pw/iYPHGKYcb/oDDfdfNLi82xFEOUIppF/C50/8VGh3icBEUBV8z6C2DOM4LF+leaFiKjY1/W94NICQBL/8AAAAASUVORK5CYII=","#757575":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAURSURBVHhe5ZstTytBFIYx/AAcQaCx/R/UX4FE3D/QEEgqEE2oRCJxCBIQCEQFiiBQIBAIBAkGQUITEIi95zmdaSab6cdOZ2aX3jd5E9LunvNOd+Z8zCwrGbEubBm2J9B+z7VLgTXhtAHPIvdi49cB0eOBbGxs/Dk6Oure3d2dvby83H1+fr5+fX0Nf35+CsjffMZ3XMO13OPaEP6aH2L8xA8ODjpPT0+DoiiGwqoYci82rD1ju7EYP3VEv729PZqBKF5fX4ubm5vi9PS06Pf7xeHhYbG/v6/kbz7jO67hWhfYKv0QjZsNBK12q9XaMU9c8f39rQNicJ1OpxK5h3uxYYFtfODL+GwEdPA8oeFw+I5Q1jXiu92ud3BViA1sYRPgw5kNtf8IOviTk5OefVJM35AnPovYtEsDX/jEt9FQC3TNI0RVCe7v73VN+wYQg9jGh4XzI9QSE9qkKzs1r6+vvaJTEF8A32hAy0hSPqxvb2//JX8jhDXqE5qS+ARoQAuaRtLyoG3T3OPjo1dgDuIboAVNI2np0bq4uDjG8cfHR5RIH0p8owGgCW0jiQlBiSr+dOpTuPiE5SQaDIamfE6K9cFgoB6lbvcKqoNoAWhD40hqGrRssdOEp29pZwHa0DiSmgCkHBy9v797hczDXq+nEZyihoIG2j6B73z3zEM0AZMW0+Dh4UETcGjOv7q6Gpe0PvAd1/junUVbG6DRyI2ONTv9j4+PvSKm0ebteRBSV6AJmGUQvzLc29tr4YAp6xMwjU6knhshMcb2I2g1suPh9va2jfGQ6G/XZxWExBmbDdBqZMeD2N3FOM2Iz/kk2qkZgqpLzWmUdo3seJCau4Plquvz/PxcFYWAe302J9HGGbQa2fEgdjUFVv0BbHQOQdVs4wTa+Knwv58B9gf4DTEg1RLQLPD8/Ox1Po25sgDaDJJkgU0sS6HhdT6NueoAtBlsGtlxIYb1UYbU7E6AmomqcQaiyYBKMA3E+CUeQp4OTNkLOLPs0siNj9BA6DJVN5g0AFqI/S2cIDrl9ndVosX2AYItIzcNxIHuRIYugxR0pj+bo2khTrQirHM3uEy7OyxItxliIU40HRKwONX1CcpJNDiBNU36K0McaTYIjdgxiQaDdNG/DHGmVSF78nUGQ3zbcwFB3uMxcagL7+zszCsuB/FtkD74lSFOdYOEHO4Tl4NOjxF/A2QWxOmqUPeg6pgFztNHw6qRlRfiWGcBTyJnLMBXrU/fQpwzCzQWVN28WITOJgu+63n6FiJAMwKtaI6TYnw4bW/2FyO8ECHa64a0sVXptNU3xn39EDF6aEJFluIFKUtsO1Vfs16aFEG6+Zfy2NwefAh4GaJZEFFrQg3NKQKiE/jw0bg3RRUibAeF9OaLbG6UiS2n3+dN0eZCBGqjFLNddtrdfA1PKEQk7bLmqRgVolPxYTNPu7soRKhWiIsuhdLUr6/iC4EI1qWwSFZwon7zp34ZIpqloFkh5JUa51AVG79j6pchwrVMpnipcs7HtU7B04xyNxQyAC2Q6N7m6RW4xun0mlfwVIUMYtwxzpManZRXf6cXCzIQDlQ0NU6LB86659q0Bxy5IQMaxwPfoQqfLc26nwQZWJ/R0c+79QF/Oz1+31y+fJDBEQ+0oSfHs7UFnXzPd8ux7idBBkjXqCPmRNee6gr4rJldXmzIQNlAGc95AX83+r9Co0MGrEHRYDmD3izwMkPSFxpmYmXlH3HGrocZCNJGAAAAAElFTkSuQmCC","#424242":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAUjSURBVHhe5ZqtTitBFMdRPAJ1aJKr4AkIprKyD1DBA1TchJIgEQgcFQgEAoFAVFbgKMmVFThwIElogkHsPb/TmWbSO/3Y6czutvefnKTZ7pzzn52Z8zEzWwWiJnJg5FCkLtIwwm+e2f95dyNgO+12dlmhzdp+DEgzopMOXV1dtZ+enu5eX18HX19fH9/f36Ofn58M4TfP+I93eNdtK4KutfkQjJoSPzk5+f3y8tLPsmwkkhcj2qLD6jO6K4vJqEP6/f19aDqieHt7y+7v77Ozs7Os1WpljUYjq9frKvzmGf/xDu+6QJfzISo5GyBU39/fb5oRV4xGo+z29jZrNpvZ0dFRLqENbdFhgW5sYMvYrAQgoqPOOoYo6/rm5kZH1te5PIIOdKETYMOZDaV/BO28ELywIzUcDoNGfJGgE90AW9jEtuFQGuoQUVaCXq+na9rXgRiCbmxYmI/AcigFh4QrOzWZpj7SKQRbANsmZOIYC0VN1maL+A2Ru7s7L9GUgk0AB7jAaUytGNRtmBsMBl6CRQi2AVzgNKaWHgcPDw9dDH9+fkbx9KGCbTgAOMFtTDEhiMN26pO4+IgVKXAAcDI5QlLU+v2+eiBCko9QGWLDI9zgOKaaBgdiR5OddrvtJVOGwMXgA45jqglAyMEKubqPyDJCQoMHRwcJDcJvnq2SQNn6wYTFNLB5fmjM73a7k5TWB/7jHV/bRWJzAzgautFRs7n+8fGxl8Q8sXF7GYTkFXACcITrmHJEnJ6e/sIAU9ZHYJ50Oh0llwe08emaJ7YegauhHQ/Pz88NlId4/+n6fhmE+BkbDeBqaMeD6G2hXEKN1/gssVMzBHmXGtwMSI3jQpRqBGDHxmd8llxcTIrF3KCtT+csgZtB/EggSnUhs0vjMz5Lrq+vaRYE2vp0zhK4GXQM7XhAKZrXZAYk+QD/vQ/QKBBS/hYVBWx5LEgSBXbRTPnpMz5PisoDbGks2DW040IUayYYkrOnzgThZEAmmAaiXHckQ/cBUtYCdl9A0DN040OUay6Q1xG6kqoadBxgumpQlO9hAdIpt7/zClxsHSDYM3TTQAxowl3RDRE2R9NCjKhLX2UZxBZn+sdPgKYhRjQc4rBWWbOxBA6OY00T/qYhhjQahHrsmAIHg3TefxpirI5FEo8ynSG2neSn2DNCMajOMG/BElOcQiu985uGGNXUKyRnjyVOjZH8QOQfiNFtEWVQxixwRh8O24ZWsRDDWiJzLFWkL8CWPZ4TxC99l4UYZxaoLygyIjieH9vljL6FENB9ArxxESfF7omwIH7dHwIh8ggbrq/4SMcU54rMozFfPoSMFklkZNz38xGPIeh2sr60RU9eCKFLWKU8NrcHH4JLY7Y6EFI7IrpjlCIsOmEPGzvGbLUgxDQ5ojaPWSihy6n3i0968kAIqpeKeXnK2e0truAJhZCkXNbhirEUnKmPzmLK3VUhRDVDXHUpTE398jK+EAhhXQp47pA0mTaO16/+1J+GkJ5EhZArNfbKi6C6Xn8RhLhunJC85Dnn410n4SntMnQUSAc0QTJ3er0ddoV3nEqveglPXkgnqBj/0JtlQqMT8mhTbqUXC9IRagUd1XmXHpzLFLxbrVx/VUiHtGxmbfsOVXjmrPtqlLmxIR07p3fU825+wG+nxj83r28epHP4A907sPnBVLznv81Y97MgHSQ/0M1UNjecDQ6erWe8zwvp6MQpGmye01sE6bA6RYPNdHqLIB3nXDvdhYaF2Nr6C4hal94TuSfiAAAAAElFTkSuQmCC","#000000":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAU5SURBVHhe3ZsvTzNLFMYRCBwVlRWIfoCS8AEQiFcgKhDICiSygqBIrkQgrkAikAgEEkngfgAEggRDwhUVJJCAQOx9fic7zdxmSrvDzu6WJzlpZ3bnnGf2zzlnTqdLFaK9urraQ/R9U9KfkE3veFvyK2CT1ufkZOeSRb4YkP7fXT49PR3e3d1dPD09/fP29vbvx8fH+9fXV4bwnT6OcQ7n+mMl6FqMC+Hf8YODg+H9/f31+/t7VhSMYSw6nL5cd2MxvuuQfnl5uc/nYtBksuPj42xnZyfr9XpZu93OVlZWTPhOH8c4h3N9oMu7EI18GiDUX19f3+Wu5byz19fX7OjoKOt2u5mOFxLGMBYdDujGho5zIRpzEWzy3KHPz88RRPVp5FutVnByRQQd6EJnrnvkPQ21XwSbvJzWX47gzc1N1B2fJehEN8AWNtVf+0Xon52dHRsrQaSy5eXl4ATKEHRjwwHb6uci1IJNwhVhDPCYqq8SwRbANhzUh2OsFO3t7e094jdE8Nzqq1SwCeAAF/VV+ir0XZi7uroKEqxCsA3gonY1rwLJyOXl5d8Yfn5+thiu7loE23AAcKokUSIOy54FZxIXddUqcMjxmucISdG+vr4+wxohSe1GiAuPcFM7nS/gESMRwdjW1laQTB0CFwC3pK8BIQdDj4+PQSLzyNra2jjfZ8GTL3qsj2OhMfMInEAeFtPA5fmxMX84HI5T2hA4xjmhsbPE5QZwVDsJ2qzZMbKxsREk8Z24uD0PYvIKOAE4ql2+Hzg8POxhgNVZ0XS33+8buSJgTEjXNIGTWznCVX3l4vb21mYR4/0fHh6MWBEwJqTrO3HRAK5qlwvpHaD8/Pw8aHyaUOiIBWNDOqcJ3HIM1C4XyrktApycnASNT5O9vT1jFAPGhnROE7gBuKpdLqTX3GzRCIBXj0XRiOAigXCkdrmQ0oV5AoTynwD3CiyCD0j1CmyjfBGigLCtdrmQ0g6aR6NR0Ph3UkUegMAtR0ft8iHFZiEmZ0+dCcIpx0jtNJByK8Hs7u4GScySlGsBOOW4UjsNpDzKEfqSajXoJUHpVoNS3sVCzHogpfjrAKGrvnSQASuGNrEgIlAcTQsZsXTr4uIiSKYOgUuO8jPASciIhUMcVp0VYSdw8BxrmvA3CRmyaBDrscsUb62RzvtPQsb+YJGafJ3OENvudwHhj/qqgwyaMxwMBkFyVQi2c6R3fpOQUbMek7OXJd4ao/wCyDxwRdLYzPAn4jK/vAhaD2TfnoKqfQH7irx3v5677yAC5gv29/eDZFMItnJU/+5PQiSsTsBStIw9QbMEG96yt/x1fwxExCoRbF+hmVKwkeNG7WZAZKzuxZaVomWsIoJutyVHaNamSRGyikdMyWxe8UpebI5qFkSqJbGXM4VD9BwfNlrqax5EzLZrsDbvdDrBicQIurz1/o76mgsRvIRlmZun3GYo4VLtZkMkWS7b7SpjneDl++isZrn7U4iosabe95M6H2PRkaPejK8oRNheBTx3TJrMGM/rN//Rn4RItyUWFWK21Hg/dKKj1g3R0RBxS5NJXopsq+FcL+FpRrobC03AEiR2cc2zVuAct+NLaF7CEwNNZO59xV7Iq3+lVxY0GX5QsdD4XSHVK3BybtofOKqGJmRZIu926EcV+rz3vtnZXiw0MfMHVHP8VJnvXoXnd7z306AJ2m5TYrz725wX75Pt8mwMNMnxjlOKG67AkfctZrwvCk2UAsp4eSfwvdH/Ci0dmvD4nw7C73R6s6CJE/fSbWiYiaWl/wA9EIDwsojiIQAAAABJRU5ErkJggg=="},initialize:function(A){this.regExes={trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g,kmlColor:/(\w{2})(\w{2})(\w{2})(\w{2})/,kmlIconPalette:/root:\/\/icons\/palette-(\d+)(\.\w+)/,straightBracket:/\$\[(.*?)\]/g},this.externalProjection=new OL.Projection("EPSG:4326"),OL.Format.XML.prototype.initialize.apply(this,[A])},read:function(A){this.features=[],this.styles={},this.fetched={};var e={depth:0,styleBaseUrl:this.styleBaseUrl};return this.parseData(A,e)},parseData:function(A,e){"string"==typeof A&&(A=OL.Format.XML.prototype.read.apply(this,[A]));for(var t=["Link","NetworkLink","Style","StyleMap","Placemark"],a=0,i=t.length;a<i;++a){var s=t[a],n=this.getElementsByTagNameNS(A,"*",s);if(0!=n.length)switch(s.toLowerCase()){case"link":case"networklink":this.parseLinks(n,e);break;case"style":this.extractStyles&&this.parseStyles(n,e);break;case"stylemap":this.extractStyles&&this.parseStyleMaps(n,e);break;case"placemark":this.parseFeatures(n,e)}}return this.features},parseLinks:function(A,e){if(e.depth>=this.maxDepth)return!1;var t=OL.Util.extend({},e);t.depth++;for(var a=0,i=A.length;a<i;a++){var s=this.parseProperty(A[a],"*","href");if(s&&!this.fetched[s]){this.fetched[s]=!0;var n=this.fetchLink(s);n&&this.parseData(n,t)}}},fetchLink:function(A){var e=OL.Request.GET({url:A,async:!1});if(e)return e.responseText},parseStyles:function(A,e){for(var t=0,a=A.length;t<a;t++){var i=this.parseStyle(A[t]);if(i){var s=(e.styleBaseUrl||"")+"#"+i.id;this.styles[s]=i}}},parseKmlColor:function(A){var e=null;if(A){var t=A.match(this.regExes.kmlColor);t&&(e={color:"#"+t[4]+t[3]+t[2],opacity:parseInt(t[1],16)/255,r:parseInt(t[4],16),g:parseInt(t[3],16),b:parseInt(t[2],16)})}return e},parseStyle:function(A){for(var e,t,a={},i=["LineStyle","PolyStyle","IconStyle","BalloonStyle","LabelStyle"],s=0,n=i.length;s<n;++s)if(e=i[s],t=this.getElementsByTagNameNS(A,"*",e)[0]){var r=this.parseProperty(t,"*","color"),h=this.parseKmlColor(r);switch(e.toLowerCase()){case"linestyle":h&&(a.strokeColor=h.color,a.strokeOpacity=h.opacity),(g=this.parseProperty(t,"*","width"))&&(a.strokeWidth=g);break;case"polystyle":h&&(a.fillOpacity=h.opacity,a.fillColor=h.color),"0"==this.parseProperty(t,"*","fill")&&(a.fillColor="none"),"0"==this.parseProperty(t,"*","outline")&&(a.strokeWidth="0");break;case"iconstyle":var o=parseFloat(this.parseProperty(t,"*","scale")||1),g=32*o,l=32*o,E=this.getElementsByTagNameNS(t,"*","Icon")[0];if(E){var B=this.parseProperty(E,"*","href");if(B){var d=this.parseProperty(E,"*","w"),c=this.parseProperty(E,"*","h");!OL.String.startsWith(B,"http://maps.google.com/mapfiles/kml")||d||c||(d=64,c=64,o/=2),d=d||c,c=c||d,d&&(g=parseInt(d)*o),c&&(l=parseInt(c)*o);var Q=B.match(this.regExes.kmlIconPalette);if(Q){var C=Q[1],f=Q[2],N=this.parseProperty(E,"*","x"),R=this.parseProperty(E,"*","y");B="http://maps.google.com/mapfiles/kml/pal"+C+"/icon"+(8*(R?7-R/32:7)+(N?N/32:0))+f}a.graphicOpacity=1,a.externalGraphic=this.iconColorMap[h.color],a.graphicYOffset=-32}}a.graphicWidth=g,a.graphicHeight=l;break;case"balloonstyle":var v=OL.Util.getXmlNodeValue(t);v&&(a.balloonStyle=v.replace(this.regExes.straightBracket,"${$1}"));break;case"labelstyle":r=this.parseProperty(t,"*","color");(h=this.parseKmlColor(r))&&(a.fontColor=h.color,a.fontOpacity=h.opacity)}}!a.strokeColor&&a.fillColor&&(a.strokeColor=a.fillColor);var u=A.getAttribute("id");return u&&a&&(a.id=u),a},parseStyleMaps:function(A,e){for(var t=0,a=A.length;t<a;t++)for(var i=A[t],s=this.getElementsByTagNameNS(i,"*","Pair"),n=i.getAttribute("id"),r=0,h=s.length;r<h;r++){var o=s[r],g=this.parseProperty(o,"*","key"),l=this.parseProperty(o,"*","styleUrl");l&&"normal"==g&&(this.styles[(e.styleBaseUrl||"")+"#"+n]=this.styles[(e.styleBaseUrl||"")+l])}},parseFeatures:function(A,e){for(var t=[],a=0,i=A.length;a<i;a++){var s=A[a],n=this.parseFeature.apply(this,[s]);if(!n)throw"Bad Placemark: "+a;if(this.extractStyles&&n.attributes&&n.attributes.styleUrl&&(n.style=this.getStyle(n.attributes.styleUrl,e)),this.extractStyles){var r=this.getElementsByTagNameNS(s,"*","Style")[0];if(r){var h=this.parseStyle(r);h&&(n.style=OL.Util.extend(n.style,h))}}if(this.extractTracks){var o=this.getElementsByTagNameNS(s,this.namespaces.gx,"Track");if(o&&o.length>0){var g=o[0],l={features:[],feature:n};this.readNode(g,l),l.features.length>0&&t.push.apply(t,l.features)}}else t.push(n)}this.features=this.features.concat(t)},readers:{kml:{when:function(A,e){e.whens.push(OL.Date.parse(this.getChildValue(A)))},_trackPointAttribute:function(A,e){var t=A.nodeName.split(":").pop();e.attributes[t].push(this.getChildValue(A))}},gx:{Track:function(A,e){var t={whens:[],points:[],angles:[]};if(this.trackAttributes){t.attributes={};for(var a=0,i=this.trackAttributes.length;a<i;++a)l=this.trackAttributes[a],t.attributes[l]=[],l in this.readers.kml||(this.readers.kml[l]=this.readers.kml._trackPointAttribute)}if(this.readChildNodes(A,t),t.whens.length!==t.points.length)throw new Error("gx:Track with unequal number of when ("+t.whens.length+") and gx:coord ("+t.points.length+") elements.");var s,n,r,h=t.angles.length>0;if(h&&t.whens.length!==t.angles.length)throw new Error("gx:Track with unequal number of when ("+t.whens.length+") and gx:angles ("+t.angles.length+") elements.");for(a=0,i=t.whens.length;a<i;++a){if((s=e.feature.clone()).fid=e.feature.fid||e.feature.id,n=t.points[a],s.geometry=n,"z"in n&&(s.attributes.altitude=n.z),this.internalProjection&&this.externalProjection&&s.geometry.transform(this.externalProjection,this.internalProjection),this.trackAttributes)for(var o=0,g=this.trackAttributes.length;o<g;++o){var l=this.trackAttributes[o];s.attributes[l]=t.attributes[l][a]}s.attributes.when=t.whens[a],s.attributes.trackId=e.feature.id,h&&(r=t.angles[a],s.attributes.heading=parseFloat(r[0]),s.attributes.tilt=parseFloat(r[1]),s.attributes.roll=parseFloat(r[2])),e.features.push(s)}},coord:function(A,e){var t=this.getChildValue(A).replace(this.regExes.trimSpace,"").split(/\s+/),a=new OL.Geometry.Point(t[0],t[1]);t.length>2&&(a.z=parseFloat(t[2])),e.points.push(a)},angles:function(A,e){var t=this.getChildValue(A).replace(this.regExes.trimSpace,"").split(/\s+/);e.angles.push(t)}}},parseFeature:function(A){for(var e,t,a,i,s=["MultiGeometry","Polygon","LineString","Point"],n=0,r=s.length;n<r;++n)if(e=s[n],this.internalns=A.namespaceURI?A.namespaceURI:this.kmlns,(t=this.getElementsByTagNameNS(A,this.internalns,e)).length>0){var h;if(!(h=this.parseGeometry[e.toLowerCase()]))throw new TypeError("Unsupported geometry type: "+e);a=h.apply(this,[t[0]]),this.internalProjection&&this.externalProjection&&a.transform(this.externalProjection,this.internalProjection);break}this.extractAttributes&&(i=this.parseAttributes(A));var o=new OL.Feature.Vector(a,i),g=A.getAttribute("id")||A.getAttribute("name");return null!=g&&(o.fid=g),o},getStyle:function(A,e){var t=OL.Util.removeTail(A),a=OL.Util.extend({},e);if(a.depth++,a.styleBaseUrl=t,!this.styles[A]&&!OL.String.startsWith(A,"#")&&a.depth<=this.maxDepth&&!this.fetched[t]){var i=this.fetchLink(t);i&&this.parseData(i,a)}return OL.Util.extend({},this.styles[A])},parseGeometry:{point:function(A){var e=this.getElementsByTagNameNS(A,this.internalns,"coordinates"),t=[];if(e.length>0){var a=e[0].firstChild.nodeValue;t=(a=a.replace(this.regExes.removeSpace,"")).split(",")}if(!(t.length>1))throw"Bad coordinate string: "+a;return 2==t.length&&(t[2]=null),new OL.Geometry.Point(t[0],t[1],t[2])},linestring:function(A,e){var t=this.getElementsByTagNameNS(A,this.internalns,"coordinates"),a=null;if(t.length>0){for(var i,s=this.getChildValue(t[0]),n=(s=(s=s.replace(this.regExes.trimSpace,"")).replace(this.regExes.trimComma,",")).split(this.regExes.splitSpace),r=n.length,h=new Array(r),o=0;o<r;++o){if(!((i=n[o].split(",")).length>1))throw"Bad LineString point coordinates: "+n[o];2==i.length&&(i[2]=null),h[o]=new OL.Geometry.Point(i[0],i[1],i[2])}if(!r)throw"Bad LineString coordinates: "+s;a=e?new OL.Geometry.LinearRing(h):new OL.Geometry.LineString(h)}return a},polygon:function(A){var e=this.getElementsByTagNameNS(A,this.internalns,"LinearRing"),t=e.length,a=new Array(t);if(t>0)for(var i,s=0,n=e.length;s<n;++s){if(!(i=this.parseGeometry.linestring.apply(this,[e[s],!0])))throw"Bad LinearRing geometry: "+s;a[s]=i}return new OL.Geometry.Polygon(a)},multigeometry:function(A){for(var e,t=[],a=A.childNodes,i=0,s=a.length;i<s;++i)if(1==(e=a[i]).nodeType){var n,r=e.prefix?e.nodeName.split(":")[1]:e.nodeName;(n=this.parseGeometry[r.toLowerCase()])&&t.push(n.apply(this,[e]))}return new OL.Geometry.Collection(t)}},parseAttributes:function(A){var e,t,a={},i=A.getElementsByTagName("ExtendedData");i.length&&(a=this.parseExtendedData(i[0]));for(var s=A.childNodes,n=0,r=s.length;n<r;++n)if(1==(e=s[n]).nodeType&&(t=e.childNodes).length>=1&&t.length<=3){var h;switch(t.length){case 1:h=t[0];break;case 2:var o=t[0],g=t[1];h=3==o.nodeType||4==o.nodeType?o:g;break;case 3:default:h=t[1]}if(3==h.nodeType||4==h.nodeType){var l=e.prefix?e.nodeName.split(":")[1]:e.nodeName,E=OL.Util.getXmlNodeValue(h);E&&(E=E.replace(this.regExes.trimSpace,""),a[l]=E)}}return a},parseExtendedData:function(A){var e,t,a,i,s={},n=A.getElementsByTagName("Data");for(e=0,t=n.length;e<t;e++){i=(a=n[e]).getAttribute("name");var r={},h=a.getElementsByTagName("value");if(h.length&&(r.value=this.getChildValue(h[0])),this.kvpAttributes)s[i]=r.value;else{var o=a.getElementsByTagName("displayName");o.length&&(r.displayName=this.getChildValue(o[0])),s[i]=r}}var g=A.getElementsByTagName("SimpleData");for(e=0,t=g.length;e<t;e++){r={};i=(a=g[e]).getAttribute("name"),r.value=this.getChildValue(a),this.kvpAttributes?s[i]=r.value:(r.displayName=i,s[i]=r)}return s},parseProperty:function(A,e,t){var a,i=this.getElementsByTagNameNS(A,e,t);try{a=OL.Util.getXmlNodeValue(i[0])}catch(A){a=null}return a},write:function(A){OL.Util.isArray(A)||(A=[A]);for(var e=this.createElementNS(this.kmlns,"kml"),t=this.createFolderXML(),a=0,i=A.length;a<i;++a)t.appendChild(this.createPlacemarkXML(A[a]));return e.appendChild(t),OL.Format.XML.prototype.write.apply(this,[e])},createFolderXML:function(){var A=this.createElementNS(this.kmlns,"Folder");if(this.foldersName){var e=this.createElementNS(this.kmlns,"name"),t=this.createTextNode(this.foldersName);e.appendChild(t),A.appendChild(e)}if(this.foldersDesc){var a=this.createElementNS(this.kmlns,"description"),i=this.createTextNode(this.foldersDesc);a.appendChild(i),A.appendChild(a)}return A},createPlacemarkXML:function(A){var e=this.createElementNS(this.kmlns,"name"),t=A.style&&A.style.label?A.style.label:A.id,a=A.attributes.name||t;e.appendChild(this.createTextNode(a));var i=this.createElementNS(this.kmlns,"description"),s=A.attributes.description||this.placemarksDesc;i.appendChild(this.createTextNode(s));var n=this.createElementNS(this.kmlns,"Placemark");null!=A.fid&&n.setAttribute("id",A.fid),n.appendChild(e),n.appendChild(i);var r=this.buildGeometryNode(A.geometry);if(n.appendChild(r),A.attributes){var h=this.buildExtendedData(A.attributes);h&&n.appendChild(h)}return n},buildGeometryNode:function(A){var e=A.CLASS_NAME,t=e.substring(e.lastIndexOf(".")+1),a=this.buildGeometry[t.toLowerCase()],i=null;return a&&(i=a.apply(this,[A])),i},buildGeometry:{point:function(A){var e=this.createElementNS(this.kmlns,"Point");return e.appendChild(this.buildCoordinatesNode(A)),e},multipoint:function(A){return this.buildGeometry.collection.apply(this,[A])},linestring:function(A){var e=this.createElementNS(this.kmlns,"LineString");return e.appendChild(this.buildCoordinatesNode(A)),e},multilinestring:function(A){return this.buildGeometry.collection.apply(this,[A])},linearring:function(A){var e=this.createElementNS(this.kmlns,"LinearRing");return e.appendChild(this.buildCoordinatesNode(A)),e},polygon:function(A){for(var e,t,a,i=this.createElementNS(this.kmlns,"Polygon"),s=A.components,n=0,r=s.length;n<r;++n)a=0==n?"outerBoundaryIs":"innerBoundaryIs",e=this.createElementNS(this.kmlns,a),t=this.buildGeometry.linearring.apply(this,[s[n]]),e.appendChild(t),i.appendChild(e);return i},multipolygon:function(A){return this.buildGeometry.collection.apply(this,[A])},collection:function(A){for(var e,t=this.createElementNS(this.kmlns,"MultiGeometry"),a=0,i=A.components.length;a<i;++a)(e=this.buildGeometryNode.apply(this,[A.components[a]]))&&t.appendChild(e);return t}},buildCoordinatesNode:function(A){var e,t=this.createElementNS(this.kmlns,"coordinates"),a=A.components;if(a){for(var i,s=a.length,n=new Array(s),r=0;r<s;++r)i=a[r],n[r]=this.buildCoordinates(i);e=n.join(" ")}else e=this.buildCoordinates(A);var h=this.createTextNode(e);return t.appendChild(h),t},buildCoordinates:function(A){return this.internalProjection&&this.externalProjection&&(A=A.clone()).transform(this.internalProjection,this.externalProjection),A.x+","+A.y},buildExtendedData:function(A){var e=this.createElementNS(this.kmlns,"ExtendedData");for(var t in A)if(A[t]&&"name"!=t&&"description"!=t&&"styleUrl"!=t){var a=this.createElementNS(this.kmlns,"Data");a.setAttribute("name",t);var i=this.createElementNS(this.kmlns,"value");if("object"==typeof A[t]){if(A[t].value&&i.appendChild(this.createTextNode(A[t].value)),A[t].displayName){var s=this.createElementNS(this.kmlns,"displayName");s.appendChild(this.getXMLDoc().createCDATASection(A[t].displayName)),a.appendChild(s)}}else i.appendChild(this.createTextNode(A[t]));a.appendChild(i),e.appendChild(a)}return this.isSimpleContent(e)?null:e},changeImageColor:function(A,e,t,a){function i(A,e,t){A/=255,e/=255,t/=255;let a,i,s=Math.max(A,e,t),n=Math.min(A,e,t),r=(s+n)/2;if(s==n)a=i=0;else{let h=s-n;switch(i=r>.5?h/(2-s-n):h/(s+n),s){case A:a=(e-t)/h+(e<t?6:0);break;case e:a=(t-A)/h+2;break;case t:a=(A-e)/h+4}a/=6}return{h:a,s:i,l:r}}let s=document.createElement("canvas").getContext("2d");s.drawImage(A,0,0);let n=s.getImageData(0,0,32,32),r=n.data;for(var h=0;h<r.length;h+=4){let A=r[h+0],s=r[h+1],n=r[h+2];r[h+3]<10||360*i(A,s,n).h<20&&(r[h+0]=e,r[h+1]=t,r[h+2]=a)}let o=document.createElement("canvas");return $(o).attr("width",32),$(o).attr("height",32),o.getContext("2d").putImageData(n,0,0),o.toDataURL()},CLASS_NAME:"OpenLayers.Format.KML"});
        }
    }

 bootstrap();
})();
