// ==UserScript==
// @name         WME Open Other Maps
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2019.02.28.02
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
/* ecmaVersion 2017 */
/* eslint curly: ["warn", "multi-or-nest"] */

(function() {
    'use strict';
    //var jqUI_CssSrc = GM_getResourceText("jqUI_CSS");
    //GM_addStyle(jqUI_CssSrc);

    const updateMessage = "Small fix for some MyMaps that came with an extra offset - would cause the pins to shift positions based on the WME zoom level.<br><br><h3>.01</h3>Added support to load a Google MyMap data into WME.  This is a one-way load - it is not possible to delete the MyMap pins from WME.  Don't ask.<br><br>Scroll to the bottom of the OOM tab and paste a Google MyMap URL into the box and press Load MyMap.  The MyMap must be publicly accessible.";

    var settings = {};
    var wazerIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAACehJREFUeNrtXOlTVFcWpzJTU/kwf8F8nI8TNSGaVGKWSpllxkQzM2WcSWIq7IsoEhFlXyVgszVKs0QRmi0EBGUxLCLQsi8NzdaA0IhLEhNDAspoghHP3HObfnRLd9PvvdvQpNqqU1Y93rvvnF/fs593HRzW8B8APCUf02zNU0+6ykc0klz1ZIV8ZGJQrp6YJjRDaGGJZug18jftPRoJfYY8i2s4/J7+FY/f/EuuWuOrFXRyNndkAsQQXYOshWvi2hsSlNzp6afl6sl9RJh6IsyiWFBMElkb34HvwnfaPDCl6jt/lqs1AYTh21YDxdTOIu/EdyMPNgdMM8AfiY3wR9ux1sCsBGpiBnlBnmwCnHz11Ktkqw+tNzBG1G8IeVtHdYI/5aknTpGt/djmwFlWu8fII/K6puAUTdz4K3m50laBMQKUEnleI5XS7CDbd26jgKOncnPIu3Xdt3pyLwZyGw6cZQO+gDJYB5wRjYdVY5q120mLKAvznfO7AEcfJFY7CfV2I6uVOXUTbZPQ8m9Ig8zDcAv2bhg7WMOVJ17pgUMFlfBxihzeDpHCK37x8ML+aNjmHQVvBCTAruh0+Cg5F3zzK0Da2rcmIYCgOAkDLFZMpLb3gZOsCF72/Rz+9mkQL3r1s3hwOlVIgbUWSCgr7/SBRYScRIR6/3gmPOMUbCD0v8NOQcjZcsip74CLPSOgGNbAlZEpKGtVQUaVAiLzKmF3cOoKsN6PyYC4S+1WibgtTkswyRObW32hUsM+aR5scg4xAKXgcjfc+Pke3F8Ei2jqxznIb+iCj45nGQC1m6ihrHuAee5mUYKLmbCYF0mauohdiVv+1UNSoXX0msWgmKKO8evglZzHrbvVMxICy+oYq9qkvwX1HOEli9ALDbDZRbtrnnUNhZMXGuHuw0XR4OhTOwHqnYBEDijn9CKmpRKz9SQsOAld/GhJLWdr9kalw8g3d5gCo08zvzykNkwHEqozO5A0AebKpIIqgVE1Vzh745Ekh59//c1q4OiTtPwyB9LHUjmzyqTR8i2t6wp04WgPkEm3hBzmKrUana5p5UAKLm9gBdK+lQBhgV3AYu9GplHmdh5Lhu/nf1lTcHQUlnOe8vC8ZxSkdYn3boiFkdYM/2Q0qKyeMoa2Rzn1zbqAo7NJfz+aRHn5V2wWk2TWoKVEDNMhvovkDF+Flw7GUqYwsFsvcHTUNjrNqVpySy8DkDS++vanUohLp9vaPRy+u/dg3QFC+jAmk/LklFbIYhdVLLeDBXQ8d4afosyguzXGbIv6GsQUVsMl1fiqgv1EVARTjJSyBrg19z/BABU2dlOetvt9zsIOzdI2N/a7eacS/Wou5unV3FrB6PCtH2Czc+jSlg+mUbA5wfRjGkwrhAKEaYxuHWmbUjxIBBtMLVz5PhhR3USZeMk72iijVV3DBrkT/rLmBPsgMp2790WvKFFq9vaRBLoOOhAGqYerA52y4PmgW9ZXlAlvab5RJn98sAC7gqX0nrf8E1ZVm/L2AdjkpA00MfgTA5BvWhFdxzWjmIGaaSQOdFKC54P/SThLmYgvrjHJ6PyjxzB88weYW3hkkWA3Z+dh6s6saEOdWKoNPfbEn2FjqOkMDs8HseqHTGRdbLEJ76VPeQ2dlLd3QlIZ7KCJQQccVOL7IL4cmcD6jq0BVKscpbxh9ZJBdj/tIKS8gZU9ZEJW2WyW2W/v3oejX5TC9Mxdk/dgRVGs3dGnvmvfUt42u4YyKX84CGnpfJiUS5mILbpoltnrBBhHt3Bav6nuHqF2Sfc3DC4RmC0uoeBKklxWAKFD0HnETOWw6NaQIIA8z5RqPYUFgmGtecdhCb0fwUA3/Dot3gdz5ZHv7t1nqmbPuoZpf8D6NiYA8VaxmNoWbdnTPcKi8sa93xapK8cdtz+1AI5kltCo2ViQyYL+G61NObzPljFRMd5GOntwnOo4MtE+Nm1zhhpLvcgb9tyQV3FGWoCbp64+Suvqg86U2RxAaIcc3bRq9l6kDE52qIS7eSGBIs3mK7TlTmSEtQ1hQXX9Y8TmLbednnMPh/eiZJDCJ0fTBor8Uw1dPUjXKY3Kr7I5gJAaBq7Sfpx+Xvia/wl+qYaQZFVH2JeiMYdzCAze+N4mQdJm+fNQrFByIGFj0/JkVUC5wyCqXkpK/3E0Ge7c/9UmAUK+dgVp+dxxLIlfuUNowcxYV8MrJW/NuxqWgKNz+44e4ZDS2suvYCa05GpYH2rmCmjY+sEiujFm5x4+grq+MRJBN0B6lQIUJIgUIjSmMOdJXCUpqYXc+g5QXb9t9L7x2zOcDdpCwpLorxX8S65Ci/YrO6s1XPNwT0Tais4qCmFsYsPpRDZNSSwFB3O37T7Hn1gnmDYOZpcalpjSFDb1wDbPCG0bnHhabG4KLtoLbfus2ElVTZQZyhRJK5LLLlGmb88/gNcPxZmcAcJWtX6eZop6Jm9xhTVjhN60snMI3g1M4a5hsJio6BbX9hHTOHySEpq74c2g5OUBqAOxBACZgSDPE5v1HEli9a+hl1kNoL1RGQbPvLA/hhuWeJKwJu6S/iWcVo2KbxyKaT2bipH8CqrAcWmL69MbJFn1K6yiI3Yv+sRw1wNPnzMLDvb7N+kNYv3zeCZZp5okzudomLEMTAgdZkDnwbT1LGZ4wdwg1eEvqw0E0AmGpL/TthOw/GTF4J/xFa0rY1LrTOwTqh92TTEx1gfaWVbErbPVK5K77iayFm1yeEHs+IslJVqqXh4RsC81j9a1l1tD/OkVYtM+TSvkckIdhVY0Wmf8hcUAlSk6dq7WrLDPEC/0yckCcMksBheyA9yySsAr+xwckJ+Hz4qqad4X19AGH0jOmF0HVRZ7dlYboBI7gpczPAFZqjFI7VWDhHiT2LZBiGzph5DmPngrQmZSsJ2SXPD+utM81XSCV3UbbDsQa3QNDDEOltRBMgkDZP2jkD10lf0InpAhzgziJaJbByDgci/41HSZFvBiB+yWFoKjd/TynKFPLOzJKl8dHD3yqGyFN2OyYIt7+NJkSQi87J8InxTWrbjXr74HQhX9FDR0HEyGOPmOAQc29fESEMm1TAHuF1p4P/ckuZQ2gmdV26r3+dR20V3FZAxYyCA5vjyeqBT+WkfITjpY1y1aeKGEYBy+1ANB5IeLaVVBCtk92UPjbAfJWXyKgDYgc2AMTvap6RaXdA1DXMcQxJAcClUy/IoKwhRa+4QUhESECmpU0v8Dm5T0WvAShTX3k2f6iU1T0edjyTonOgchkawrVaohnaj66cHx1VWJ1acI9o9Z7J9DLTD7RNP+QZ39k0z7R71W/6jX/lm4/WAB+9EU9sNNbOlwE/vxOPYDluxHdNnMIW/Yd8PmJKtD3mijcyMf8mZSBQH+sNGOCfw/CkKxncyBj/UAAAAASUVORK5CYII=";
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
        WazeWrap.Interface.ShowScriptUpdate("WME Open Other Maps", GM_info.script.version, updateMessage);
    }

    async function getKML(url){
        return await $.get(url);
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
        let color = "deepskyblue";
        /*var layerStyle = {
            externalGraphic: 'http://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png',
            graphicOpacity: 1,
            strokeColor: color,
            strokeOpacity: 0.1,
            strokeWidth: 3,
            fillColor: color,
            //fillOpacity: 0.1,
            pointRadius: 15,
            fontColor: 'white',
            labelOutlineColor: color,
            labelOutlineWidth: 4,
            labelAlign: 'left'
        };*/
        OOMMyMapLayer.setZIndex(-9999);
        // load geometry files
        var features = parser.read(new XMLSerializer().serializeToString(mapKML.documentElement));

        // check which attribute can be used for labels
        /*let maxlabels = 5000;
        var labelname = /^description|description$/;
        if (features.length <= maxlabels) {
            for (var attrib in features[0].attributes) {
                if (labelname.test(attrib.toLowerCase()) === true) {
                    if (typeof features[0].attributes[attrib] == 'string') {
                        //layerStyle.label = '${'+attrib+'}';
                        break;
                    }
                }
            }
        }*/
        //OOMMyMapLayer.styleMap = new OL.StyleMap(layerStyle);

        // add data to the map
        OOMMyMapLayer.addFeatures(features);
        W.map.addLayer(OOMMyMapLayer);
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
            OHGO: false
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
                OHGO: settings.OHGO
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
        else if(location.href.indexOf("https://gis.transportation.wv.gov/measures") > -1){
            bootstrapGeneral(initWVGIS, 1);
        }
        else if(location.href.indexOf("http://nmroads.com/mapIndex.html") > -1){
            bootstrapNM511(1);
        }
        else if(location.href.indexOf("https://www.mapwv.gov/flood/map") > -1){
            bootstrapGeneral(initWVFlood, 1);
        }
        else if(location.href.indexOf("https://roadworks.org/") > -1){
            bootstrapRoadworks(1);
        }
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
            OL.Format.MyMapKML = OL.Class(OL.Format.XML,{namespaces:{kml:"http://www.opengis.net/kml/2.2",gx:"http://www.google.com/kml/ext/2.2"},kmlns:"http://earth.google.com/kml/2.0",placemarksDesc:"No description available",foldersName:"OpenLayers export",foldersDesc:"Exported on "+new Date(),extractAttributes:!0,kvpAttributes:!1,extractStyles:!1,extractTracks:!1,trackAttributes:null,internalns:null,features:null,styles:null,styleBaseUrl:"",fetched:null,maxDepth:0,iconColorMap:{"#880e4f":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC3klEQVRYR8WWT0gUYRjGn3dWK4SdrWNXPdQhAk2oi0WaUYEzi2LQpbJkI1APIfmtSW2YuWt0KiuS/h2KslC/jSIjwUqK6twfIgSPHaJ2xoOFzhuz/kFkd3ZmtvS7zvs+z+975v3mG4KHVV9fHygd/lOuEKoALmZWCoisaWJlgplHnm1JvR8dHZ32IAlyW9y9Visli+KAbY5Ahj4LjJcWIdpuyHdudV0BJILaISa6DmCVC+EZEDWL1NBVF7W5E0gE9QYm3HQjtqSmSRiyN1efYwKJkFbOTG8AFOYSyvCcFcaOk6Z87dTrCBBX9WEAu32Yz7Xw2NSJsp2xWCzrYGYF6AnqFRbhlX/zhc49wpD2RjKurABxVesAqDNfAAZ3Ro3kac8AiZDex4zGfAFAfEOkkll1HBLQbwE4nDcAcFsYssFzAvGgfg2EY3kDMPqEKSN+AFpBuJAvABE62lKyyzNAT6imzGLlrcuvXzZ9BivbhTk45hnAbkio2j0GHfCbAgPJqCF13x+inlC4xGL+AGCdD4hJy8LW9kn5yTeA3dgd0ncR4zGANR4gpsGoFaa0+xyXq9uwOxSuI+ZHucTmnxPjSJsp7WOcc7kCSCehhmMEPpNTEegVhmxyUZcucQ3Q398fGG+8a0/ztuziPI7A6jLx82HqnwPMzkNNJbEykvXMMR+NmklP/w6uE5g3Taj6Ewb2ZYD4WnSuanNLS8tvt7v39AoWAEJaNTM9X2rCTK1Rc+iiF3NfAJFIpLD4/vfPAEoWmU0VKIGNrb8GJv47wNyJuETgRZPOY8JIVng195WA3RRXw3sBfrpgSDglUvL8sgF0FdWuDxTMfANQlDZlpcLpwnEC83wK5sXiqv4FwAYAKYuVknZz8MeyJZB+DcHwCIgrAXwUhtzkx9z3DMzOgfYAoP0AXghDVq8EwBWAjoNpQJhDdSsAoNu/2mfh8fJZCprPEB4EcIfAzW1G8rLfBP4CaiP1ITiPxC8AAAAASUVORK5CYII=","#a52714":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC7ElEQVRYR72WT0gUYRjGn3c2I7rVzkpdU3bWiCAR6mKSZlSXQFFwZ8us2Aj/nLxEYhtSBNGp7J+UhbtrSXgoCowMraWoLl3K2VUEr81sJXVI3J03Zs1YxNmdmbX9bsO8z/P85p13vm8INlZTU5Or4dOrKt0l1IF5GzGtY+IUgDmBhPHbW7Z/mJiYMK4tL7JaOVzu2aW7cBngOgCuVXQ6gElB57Mt08n3Vn0tAYR97lZiugNgvQXjNMCdcjx500It8gJEJU8bg+9ZMcuuYeaOQCLZn0+XE2BYEqt04C2AknxGq9xnnanmaEJ9k0ubEyAiecYAPuAgfFkSm27p2BcKhUwH0xRgyOupFohfFxC+JCXhoKx8HTPzMQWISJ4egPsKBgD65LjW6wBAHABwag0A7spxzdTHvANe9yCIjhcMwHxfTiTbbHcgLIm3CDhdKAARBvyKFrQNEPGJ3WBcKRgA1OOPqxdtAwxViJWCjncWdz8zfyamvf6EGrMNYAjCXjFKhBanXSDgiT+uHXG8ET0sLy1Lu/SPADY5gPjFaX13YObbF8cAhjDide8H0VMAG2xApIjQ4Fc0Q5dz5T2MDHXUV9rIrD/OZ7Z8n0An/HF10Eq9JYBMJ3xiCIzzeU2J+mVF7chb97fAMsDIyIhrsac9BuI9OcxnSxbTlc2z3+fXHCDzKiR3LYPGTb850MlAXLX172C5A8uhEUl8BuDwKhCJZHvvzq6urgWrT2/U2QaIVmyuZ114sTKECd0BRbtqJ9wRQDAYLKmZHJ0CUJYV9htCyidP/Zj77wBLe4PnGoizJz0mx7Vqu+GOOmCIwl7PISJ+/i+Q6JysqJeKBjBUIW4VdMwA2Jh5CqbqXAdOLjDbQ5j1NSgAJADzKVooa1V+JovWgcwcSKKxH9SC8VlOaDuchDuegcwcSOIjAppBeCkrWn3RASKSeAPAGTCNygm1segAUa/Yy4QLsHn4rAR1PoRe9zEQPQBxp6wkrzvtwB+R+fEhWAoa8wAAAABJRU5ErkJggg==","#e65100":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACsElEQVRYR72WT0gUYRjGf6+rId3q1M50ykMdokiEgrDSMqqLO7soRFBZsRGoJy+R2IYUQXTJrFDKuhSp7ewWBUWC1VJU5/4QIXjY3UI6CB36o/PFbq5Y7c7OzNp+1+99n+f3PbzzfSO4WC0tLb6+HyN1lo/twCoUlQgzApPWLGP7pre9Gh8fn3EhiTgtTobYIBZnIWvuy9NnAU8qLI6viPPSqa4jgLTBAQUDwBIHwrOi6PDHuOygtngCSYM2gWtOxBbWCLT7TfqL9dkmkApRpyyeC1QVE8qzr7DYqsV5ZtdrD2DwENjpwTzXkhhYH2mIRCIFB7MgQKqZeip4WoL579YKdml3sgfJuwoDBOhG6C0VQCl69Rg97gEMBoEjpQIgXNWihXUKJpAMMiSKg6UCKOG6HqXNSwJXgKOlAgCDmknYNUDaoEvBuUUA6NZMTrsGSAWpRfHC4e1XSF8BWzSThGuATEPK4Caw12sKAnf9Js2eL6LPAWpmhdfAMg8QX8Vioz/OW88AmcZkiB1icQ+odgExoyyCejzbZ7scvYapACGE0WJiuX0Fh3STISf1jgCySQSJiOJkMVEF/bpJe7G63L5jgOHhYd/mW60JgU024hPVldQuH2F60QEygp8MGi0Ys/nmDuumu38HxwnkTFMB7iPsyQPxYbThwrrOzs7vTk+fqXMNkDRoEnj0t4kIXf4o592YewIIh8NVkamBd0DNArNvCGu0KJP/HSBjkA7Sp9Qfk57QTOrdmntKIAsQYLcSHswbCie0KGfKBjAVxP9T8RFYOmdab/fg2IG5HsL5r8HgPbAamLagZqXJl7IlkL0ZDcYEGoE3mslaL+aeZ2AO4LZAK4rHWoym8gMEuSSKY0BUMwmVHSBt0KPglNvH558LzCt52mC/ghtK0aHHuOhV5xc84cQhfHokFwAAAABJRU5ErkJggg==","#f9a825":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC7ElEQVRYR72WT0gUYRjGn3fWnZm6dezQJXfWgggSoS4WaUZ1ERR3ZxEqKzYC3ZMXUWxDCiE6mZVJ/4jcWYkORUGRZCVFdelS2cxgeA06CEWz2zpvjKUs5u78WdrvOu/zPL955/2+bwg+VkdHR+hO2/sGBjUzYTMx1zBRgZjnBdhTLWOb3k5PTxd8WIK8FuczkR1MNAygGUBoDZ1NoOdg7hMTxhuvvp4A8tnoEWa+CkD0YLxI4B5RNS97qHXvQF5Tuhi47sWsuIaZuuWEPuqmK9uBfKaugcl+BSDsZrTGcxaY9oQT+sty2rIAOU15DGB/gPAlCTNmhj937k2n0yUHsyTAr0y00SZ+ETR8WcfEB+S46bzImqskQC6rDIAxVCkACENS3Bj0DWBpkXECnagUgEHXZFUv6VO6A5pyA8DRSgEA3JRUoytAB5QrBJysFICZx+WEmfQPkFF6iXC+UgAAA5JqnPUNkNci9Qx67fH0K+XPgkC7wzF9xjeAI8hllAkQEoG7QLgvxY3WwAeRpUVqCcI7gDcEgPgOgXdKMfNjYABHaGWj+4j5AQDZB0SBidvkuOnoyi5Pt2Euq7SDcdfNbPk5AcdE1XC2sevyBPBnHqJpEJ92cyTiUTFudrvVFcF6K52cnAy12v3ONO8qo5gThcV6is0teHOF+/9AsdHPibomQbCnSm4p4uNi3PT17+D5EyyH5jTlIYBD/0KwPvY1tT2VSuW8vr1T5xvAmlBaSMCT1SFM1CvH9Qt+wgMBJJPJ8EjTs08AaovCLHuxsGVd55f5/w7gBOS1yAiDVibd+fORE0aj3/BAHXBElhY9SOBHK4FM/VJCP1c1gB+3t26sCRdMAOudUEGgxnIXTjkw30NYtBtmAdQBWBDFUC21zX6rWgeW5iAbmWKmJgAfJNXYFiQ88Az8PZqzII4R8FRUjZaqA1iacomAUwDuSarRXnWAnBYZBOiM38tnNWjgIcxr0cMMvsWgHlnVLwbtwG9K/vgh3KOHXAAAAABJRU5ErkJggg==","#ffd600":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACgUlEQVRYR72WTWsTURSGn0OsFHcu3ZqFzkwRLAXdRG39QN0IlhTcqFWJFNrgohux1ClFEcSNtX60aHUjGMWFoqC0EDUo6lJmUkSE/gAXBRcKtbdkTCXGZHLvTe3dDXPO+z733HM/BIORTqcTOf9hB7AbYSOwBlgA5hBmOvt2fcjn86Vv7SG6kSpgK8KlyBwSNfIWUbwCzorHe11dLQBV5BiKCWCthvAvYEBcbmjE0hBABfQi3NERq4rpF5fxRnmxAGqWDhZ5C7Q0EqrxX6HYKR5v4nLjAUJeAPsszJdTCiM5v9P3/bqNWRdABaQQXjdh/jtV2C9ONJGaoz5AyBAw2jQAjIrLsA3AJHBqBQBui1tfJ24JphCONw2guCseveYVKHITxemmAWBSXDLmAAGDCJdXAGBIXC6YA4S0A+80T796+qWzYId4FIwBSgkq5D5wxLoKwhNxOGR/EH0iSYKPwHoLiO8otolHaA1QrsIe4CnQagCxgHBYnCgvdjS8jCKIIt0oHjUS+/NfcUI8pnTitQAiiAAf4byG6Li49GvERSHaALlcLpFu6yl18/a64oqvtNIuSeZXHKBcha7S0ysG4KR4Zm8H7Qosm6qQZ8DBGhCfx6avbslmsz91Z2+0BBUAe4GX/5gIg+JwxcTcCiCTybTcOjNRBJIVZj+AzeIy998Byr0whvzV6QVxSZmaW1WgDHAA4XnFvj8nHhdXDyBkA/AFWBeZKlJxF04cmPEuqGjGWWATMI+QFIdvq1aBaNJFZlB0AYG4tNmYW/dABBDyAOgBpsWltDWtRjNLcB3oAx6LS7eVu8ldUG2gigyjGAGMLp9qnWYqcBS4hzAgDtdsK7AEdcerIfed9FQAAAAASUVORK5CYII=","#817717":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC5klEQVRYR72WT0gUYRjGn3dW+3cTambNWwZFVJAIdbFIM6pLkBh0qazYCtST7mwmM7Mj5n6Kp7IiKesSJBFUFBgJm0lh0dGMiMBDuLMRIXSoWOeNNVcsnd2Z2dq5fu/7PL955/m+bwgenvr6+sCW9SOVsFHDwDoQF4EpBeZJJgzHxza9isfjKQ+SILfFZmTNNrAUY6AGQGCJPhvAM5JwTuuyxtzqugKIhoPHQHwNwDIXwjMAN+kiecVFbe4JRMPBBhDfcCP2Zw016iLRl6sv6wT0cGmlRPYLAMW5hJZYZ7KlXVrP1PNsvVkBTFUZYmCvD/O5FhrllWd2G4bhGExHALO1tIole8S/eaaT9+kiOeSk4wygKu0MdOQNQNShxxKaZwAjrPQT4VTeAMB1XViOOo4TMFR5gEDH8wVg8E1DJBs8TyCqKlcBnM4XAEC/LqyQZwBTlVsY1JM3AKNd77Y6PQMYrWsrSJp56fL0c9Jnhr3TEJ9HPQOkG6Jh5TYIR/xOgQgPtJh10PdB1NEql9sSvQZQ4gPiG0u03ehKvPUNkG40IsoeYjwEsMIDRPrkO6QLK92X9XF3G0bkOjDdzSU2v850Qu9ODLipdwUwm4dI0ACznluU+3SRbMxd97vCNcDg4GBg4k1TOs07soh/XI6fFRHxdfqfA8zloZoYw45binBSi1me/h1cTyBjaoaVR0w4sBiC3peUtW1tbm7+4fbtPX2CjGg0LNeC6MkiE+IWPZbs9WLuCyAUChWXldyfAFC+wOx7ICVtbO+dmvzvAHNZuEiMBUmnUV0kqrya+5rA7JZUg/sBfpwxJOC8JqwLBQPobFtdmpoJfACwKm3KsKuyXTjZwDzvgvkwqvI7gDYAmC6Wisrbuj59KdgE0kamqgwzUA1gXBfWZj/mvjMwG0RVuUPAYQKeasKqLThAVA1eBvgsge5pIlFXcABTlTUGRQFvl8/foL5DaKryUQbdIqYmrTtxye8EfgG9Eeoh9YnXxwAAAABJRU5ErkJggg==","#558b2f":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC40lEQVRYR72WT0gUYRjGn3dXMzrVsWsSBdnMalJdtkgzqkvk7qx0qczYCNLTzNIfsQ0xamalQ1mRlHUJmtkMkoIiwUqKjNBZ6C8ReS9CKCha543RtkR2dmdma7/r9z7P+5uH9/u+IXhYkiQFrbVv64OERmZaxuAKAmUJmLQCNPxpaPHYyMhI1oMlyG1xpFesDVg4BaARQDCPzgLhocV85KaSeebW1xVALBXaw8yXACxwYTwN5nYjkbngorZ4AlFNbCXgihuzuTXEdEhPTPQV0xVMIHK6tj4QsJ4AqCxmlGefmXljOpF5XEhbEEDSxHsAtvhonpOMrvq2c1MymXQcTEeAqCqEiehRCc1npETYqsum/SF5lzNASuwkRnepAAx0pxWzyzNATA31M/H+UgEAXDYU09HHMQEpJQ6AsbdkAMJVQzZbvSegiRcZOFAqAIP700om7h1AFWQm0koFAKjTUCZ6PAO0qEKdRfTU5e3n5M8gbDBkc9QzgC2IqqHrRLzLdwpMt43ExA7fF1GLWlNtUfA5gCU+IL6CAusMefyVbwBbGNNqNzOsIQALPUBkCdysKxlbV3C5ew1VIcJE6WJmuX0G9qUVc8BNvSuA2SRCSQYfL2bKhL60bB4qVpfbdw2g63rQ+NgzCsJ6R3PGB1gVdcbhF1P/HMA2lDShAaBhxyPFaNMTpqd/B9cJ5JpKmnAHoO15IN6Fq9qEjo6OH26/3q7zDpAKNYH5/vwmTJDTstnrpbkvgHg8Xvll+dhrgKvnNPs+TYGVg/L45H8HmJ0F8SyAuZM+aihm2GtzXwnYomhq9TbiwN0/R4n4mC5nTpYNoPnMmqXBbPY9gEUzTQnhQg9OITDPQ/j3NIhvAKwAMJX9WVV96+jY57Il8HsO7PugAYSXhmzW+GnuewZm5kATbxAQA/iBoWSayg4gaaHzAB8EMGgoZqT8ACmxC4wTXh+f+aC+hzCqCruJ6BqAdkMxz/lN4BdqAfMhnOWTRQAAAABJRU5ErkJggg==","#097138":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC5klEQVRYR72WT0gUYRjGn3fUnN1THetWHuoQQSbObGCRZliXIDGoQ2bFRqCysxkRiW1IkcTurJQVSVkEQRId+gdGgpU4s0Ydgv4QEUjnCKl2JlnnjVkVpZzdmdnaOQ187/s8v3l5vu8bgoenqamp5OGKL1UsoE4AVgEoBZCxmCdIEIal1+XjIyMjGQ+SILfFwWhoPRjnGFwHoGSRPgvAM1g4YfTqKbe6rgBERW4m4CqAJS6Ep4nQlk7ol13U5p+AqEgtBLruRmxhDTG3ppOpvnx9OScQVKqrGMIYgLJ8QousM8PabKrjL3L15gEIDTF4mw/zmRbG6PGlDVtisZhjMB0BRKW6hiA8920+2yhY1PCzVxty0skBIHcS0F0oABF1pxNal3eAqNxPjEMFAwDX0qruqOM4gWBEHmDC/oIBGDfSSb3F+wQi0hUiOlwoAAP9pqqHPQMEIlIHiM4XDEDoNBP6Gc8AwYhcyQTN5ennpM8QeJMRT416BrAbAlHpNpj2+J4C476R1Hf6PojKj22sEDLWSwDLfED8mBZYmoqn3vkGsBtFRd5KwAP71QNEhoBdaVW3+3I+rm7DQFRqBNPdfGJz6ww+YKqpATf1rgBsoWBUjjHjVF5Roj4jobXmrZstcA0wODhY0qwl7DTLzuL0WVwyVfmt59XkPwfI5iFSXUskDDvuOaaDZlLz9O/gegJzpqIiPyJgxyIQH3tW7l3X3t7+y+3X23WeAcqPSvWCRU/+NuEOQ03FvZj7AgiHw2W3gm/eg1CxwMxkQVhjxscm/jtA9oRU5AsA5pPOGDWSeo1Xc18TyG7JiLydCY/n9z1Omqp+togAG5YzlX2yWbKmAtfkunBygXkO4ZxYQJE+ALQawGTplFXxvW/8a9EmMJOD0DDAtQx6a6raWj/mvjMwG8Q7AHYT8DSt6vVFBxAj8iUiHAFwz1D1xuIDKKEuAp+Gx8vnT1DfIRSjoX3EfBOgNkPVLvqdwG+L3uwhDBmaYQAAAABJRU5ErkJggg==","#006064":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACuElEQVRYR72Wz0sUYRjHP++sSkQXjx06lIc6hJAIdbEf9oPqEiQKQbg7u7MbgXryEoltSBFEl8qKdcaZ9RBk0aFIUBKspKjO/aCi8A/oIHQo0XliVjItd/adWeu57c7zfL+fed7nfd9RRIj29vbE3Q31zYi/H9gC1ADzwAxKTe798vHV1NRU8Fs7lHZmZ2YHhnEJJDBPrFLno9QTUGdwCy91dfUAzEwSUQWgTkN4AUU3rn1TI5fKAKZlIgzriK3IEboo2oOV6sIB0ulmfOM5UFtJaJXnAuzBs5+F1YYDpLLjIIdimC+WiEznN2/al8/nyw5meYCU1QI8jW3+q1Cpw7hD4+V0ygOY2T5EBqoGgAE8uz86QNIaQmGtAYCDZ5fVCVmCjAsqVT2AeHiOGb0DqewtkFNrADCE5+SiA5iZXkRdrhpA6KNoX4gBkGtC/Beap185fcEwdjNcmI4OEFQkrdsoTsTugpIHuM6x+AdRMteA8l8D9ZEhhG8YCztx3bfxAYLKdPYAvjwE1mlDCPMoOY7nBHWhUfkyKi1Ftg0l9yqJLT1XpHFtVydfDyBQSll54JyG6CCe3aWRV0rRBhgdHU10jE0E07wrRPwzdUYThcLsmgOUBE2rFWGyvLhk8JxI3w7aHVgyTVmPgKOrQHy42tTY2NPT80P37SMtwTKAg8DEXyZCL0X7ShTzWAC5XK62MOe/AxqWmX0nIdtwnJl/DlAySGavoeT3pItMU3SCD5jIEX0GAovO7BEMGVvmdhbPvhjZPco2XCF+MreRGv8TsL70v2G0hF04YWDxOhAopqz3wFZgFn+ugZGRr/+vA4sAwXnQCrzBs7fHMY+1C5aMTOsOQgfCY4p2sDVjRfwlSFo3UJwG7uPZbbHcYw9haStm+lHqPBDp8vkTtJoOdKIooqQb17ketwM/AU0txSH0/vZJAAAAAElFTkSuQmCC","#01579b":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACvklEQVRYR72WTUgUYRjHf89sRnTr2DUPeYigMArCvtSoLkHizgqRaTMrgXrqEokaUgTRIcrKnTXrIjtjH1AUGAlWUlTnPogIgg5dOghBX/Y+sVom4u7OzJbv9X2e//83f573fUeIsBobGxMjibpqsGotZRXCEpQpI7wHHdv2cfjZ+Pj4VARJJHRxKrtO1JwCqQUSC/QZ0AcqepRc29OwuuEAktlmEc0AS0MI/1TowHcvhqgNkYDttQhcDiM2t0aFdnJuf6m+4gmkBqtFzWOgopTQAvuqwlZy7qNivUUBxM6MguyMYT7TIjLRU/Vhe29vb8HBLAyQ8mpEeRjb/Hejqu4iSI8W0ikMkMx0iUhfuQCi9JnA7Y4MYNmep+CUDQCDxncL6hRMwLKzQ4oeLB9ArhjfaYmRQOaSIm1lA4h4JuekIwOQyh4R1dPlAih04bsnogPYA+sF60nI26+QvqoxWxhpm4gOAFgpb1iVptgpqNzSwNkb+yLCHqgUrOfAihgQn9UkNjLS+jI+QL4zmakTkdvAsggQU6qyj8DJ9xVdIV/DTIOIXCsl9mdfoRXfHQpTHw5gZh56VekpJSpKvwnc9lJ1f/ZDAwRBkLCvT+aneVMR8XdqzHpG2ib/OcC0YJO3Qwxjhc+cHCJwIv07hE5gNjLbuwPsWQDizdnNX9Z2dnZ+C/v1+brIADR59WK4N99ElSME7pko5rEA0ul0hTe54RVQOcfsqyakimHn/X8HyBtYduacIn8nXWRCc05NVPNYCUyb2JndgtydPffCMXLuycUD2D+wUn5Yb4HleVM1pqbYg1MMLPoQ/lYT23sNrAYm9fvSSm42f1q8BPLHJ+mNIewAXqjvroljHn8GZq5mX5UkcF99t37xAWzvgsJh4Ib6bsOiA2BnuwU9HvXxmQ8aewixvQMCVxXpwHfOx03gFymx6CFkK7DbAAAAAElFTkSuQmCC","#1a237e":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC5UlEQVRYR72WTUgUcRjGn3fUim5BB3cWEXeW8hBBItTFIs2oLkFi0KEPKzYCtQ4espzZcQb7IDqVFUlZlyCJDn2B0cJWklSXDpVSOyNCO9ulg9Ah0Z03dnXDYmd3Zrb2f/2/7/P85uHl/Q/Bw2lvb68Yf1/fmGa0kE0hECrBmCfCNEOIramJv43H4/MeJEFui8WwvAE2zoOoBUBFnj4bwAtB4N6vX/Q3bnVdAQQl5SADNwAscyGcJkZX0tSuuagtnoAYUjpAuOVG7I8aQqeV0AaL9RVMIBCKNoL4NQFVxYTy3DPbvCU1pb8q1FsQQAzJoyDa7sM81zIW2S9sVVXVcTAdAQJ1chMJ9LIE82wrE3akEtqok44jQFCS+xiklwwA6ClDUzwDiFJ0COCjpQKAcdMyNUcdxwREKToM8KGSAUC3LaO/w3MCAUm5TsCx0gEwZBlaxDOAKMk9AF0sFYCAvqShDXgHCKsNYHvc5fZz0mewsNky1THPAJkGUVLuAtjnPwV+aBn6bt+LqCbcJ6VZeAdglQ+IHzYJG78l1E++AbIphNRtIPsRgBUeIOZB2GMltExfwePqNQyElDYi3C8m9vuecdgytWE39a4AskmEFRWMaFFRxqBlap1F6xYLXAOMjIxUnOz9kJnmTQUm2lzOsw2meWHmnwNkBIOS2sywY47izEcsU/f07+A6gZxpQJKfEGhXHojPp06sXt/d3T3r9uszdZ4BxDqlFQKe/W1CQE/S0C55MfcFEIlEqh7HqicASEvMfrKdrk9NDUz/d4CFDRm9DPDSSR+zDK3Jq7mvBDJN1ZKyUwCe5gyZ+EwqoZ8tG0Bt7enAXGVlAsDKrCkLTYUenEJgnocwJyZKyiSAtQBmqGpOSk6e+162BBbmQI4B1Azgo2Vo6/yY+56BxUG8B/BegJ9bht5adoBAWLlKjOMEfpA09LayA4ghWQFRPzw+PnkWmD/2oCQfYNAdgLssQ7/iTwX4BXI06yFPOGfLAAAAAElFTkSuQmCC","#673ab7":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC4UlEQVRYR72WS2gTURSG/zNJVQQXXXZrFwqKYCnYzBDFvphJF6Klohttfcyk0HbVjVhqpPgAEQSNzUzxtREs4kLpTCoWqk0mtOLOF7YIXblyUXBhIc2RqRZDSSYzE83dzjn//92fc+8dgo/V09MTqv/W2wwOtVGBdxIQZiDPoGUGzSxuvbYwOzub9yEJ8locj5j7meg6gDYAoRJ9BQCvWShcMDJd8151PQGoknWaGAaALR6E1xg8aNixcQ+1lRPQxHQfwPe9iBXXMNOAkZOTlfpcE9CkqWawYAOoqyRU4jsLRIfGs/KcW687gGhNA+gMYL7RkmnonD+cSCTKDmZZgH4pHS0wv6nCfL2VGHIqpzgbKbnKAmiiNQJgrGoA4rFUNjbqGyAuWhMMnKsWAIx7ek4pq+OWwAMAvVUDAA91W+nznYAqWSliaNUD0IRuy6pvAC1iDoPoRrUABB5J2bErvgHUlnQTCZzzePuV02cWcNDIKBnfAE6DJlqPAZwMmgIDzw1bORL4IlJFs5FAbwHUB4D4gRAf0OdiHwMDOI3nW9LtgsAvAGzzAZGHwMf0TMzpc12eXsO4mO5m8NNKYn+/0xndlp1jXHF5AnBU4qKVYOCSB8WknlUGKtb9KfAMMDk5GZq5tcOZ5hYX8a+8Gm4y3nWs/HOA3ymYrc6vV9kjxXw2lYv5+nfwnMCGqSZaUwBiJSC+7DmxuG9oaGjV6+6dOv8A0nQHuPByswmDhg1bvunHPBCAqqp19P7oJwCNRWY/wyjsTtpdy/8dwDFQI+ZtIiqe9IxuK1G/5oESWL+cJFMRmMwNQya6aGTlqzUDUKPpBlrjJQDbHVMWEHV7cNzAfA9h0Wn4DGAXgJVwvq4xudD+vWYJOEaaaDn3QSuAD7qt7A1iHngG1gEi1hMQjhPhVSqrdNQcIC6m7zK4H4xnek7prjmAJpmjYLoMgq/HZzNo8CGMmKdA9IiIBlNZ+U7QBH4Be4DsISzZE90AAAAASUVORK5CYII=","#4e342e":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC4klEQVRYR72WT0gUYRjGn3cmK+oUdOmahzrszNLObHWxyD9R0e6GYtDFsmQjSE9eIrENKwLpVFYkZUEEWRQzkmAkWC2V7oyys1QWIXjr0kHoULbuG7u2JOXszp/auX7v8zy/eb/3m28ILp7m5mZxfuaDmiPUEbARhBVgZME0S8LC6Nza9RNjY2NZF5Ygp8VRNbiFkLvIoDoA4jK6HIDnxDilmda4U19HAFFFPgzCDQArHRgvgNGum9Y1B7XlOxALS63MdMuJ2dIaAp/UjExfOV3JDkS3BlTkhFcAqsoZLbPOlMNObdJ6WUpbEiCmSiMM2u0hvChJhvY37kokEraDaQsQC8k1LOCFj/CClHK0R5tMj9j52AJEFakLRD1+AUDco6cy3a4BImG5nxhtvgGAm7ph2frYb4ESHGDiI34BiOm2ZqZb3XdAla4T6LhfADD6ddOKuwcIy53E6PULQECXZljn3QMocogIrx1+/ez8mZl2DJnppGuAvCCqyvcAHPLRBV03rJjnD9EBJVCdE4QUGOs8QHwlUdymjU+98wyQF8bCUj0zDQFY7QIiS4RGLWXldSUfR7dhRJWbCHhYzqy4TsRHtVRmwEm9I4Bf85AAcKa8KfXpRvpk+brFCscAg4OD4t3ec0kwtpcwn1nFVaEHpjn3zwHyhpGQXEsCRu3N6ZhupF39OzjuQDE0ospPCNi3DMTH+pY2uaOj47vTt3e1BUXTqBpoAISnf4Uwdepm+pKbcE8A8Xi86vPkm/cAqpeEfcsuiJuHp6Zm/zvA4okIXgZ46aQndcOqcRvuqQOFYVSlvQQaLgYycHrIsC5UDKBRUTZk6ccnAGvyocxUU+rCKQXm+hT8HkZ5GsAmAHOiMF/9eGL6S8U6UJiDsDwKRi2At7phBbyEe56BAoAi3QfRQQDPdMNqqDxAWL4KxgkAj3TDaqo4QCwc7Gbms4C7y+dPUM9DGFPlFgbuANyuG5krXjvwEz6W6iGbyUorAAAAAElFTkSuQmCC","#c2185b":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC70lEQVRYR8WWXUgUYRSG3zOrId0F4c56mUERESRCQs1Y/kR1EyT2szNWVmwFulfeVJIbUgTRVVmR9L+zkkWQUWBk7M5uhXXTTT9EBEK1sxcRQkSKzokBzcWcnZ8l+27nvO/7zJnzzfcRPKzm5uZAVC+rZnA9CVjCzCVENMGMETYx1LXi88tkMjnhwRLktjhVsXM1TQZOg1APIDCHziQgBRaOSLlbw259XQGkRGUPAZcBLHBhPAlwu2wkLrqode5AWlRbGXzVjVl+DQNttYbW46Qr2IFMqKXaZPM5gFInozmes0lUuz4bTxfSFgTQg8ogCBt9hE9JKPP00NINsVjMdjBtAZIhVRKYdf/h0wy8Sc4mBu18bAFSoXAnMXUXDQDulo3Ecc8AeijcC6YDxQIQ0RUpG7f1se2ALirXAOwtFgDAddnQWj13IB1ULjHhYNEAjF45p0U8A6TEcAeBzhQLQIROKaud9AygV6hVMPmFy7+fnT8Lgimv+9qX8QxgCfSQkgBjVxFdGJANbavvH9Gz8h2Vk0LJKwCLfED8ALBGNrS3vgEsYToYbmCiBwDKPEBMEJvbpFyfpSu4XJ2GekhtAvNdJ7Pp5wTaJxlxaxs7LlcAlktKVGME7nJyJKBHMrQ2p7oZWJeV/f39gWD0foaAmgKST2Nj41WN3++MurR1vg/kG6WCLXVE5pDtlmLsl3Kap7uD608wHaqL6kOAt/wNwR9eH61ZFY1Gx9y+vVXnGSBZrjYKAj+eHcJAR62hnfUS7gsgEomUqgM/3wFcmRf2K0C8fG02MfLPAawAXQyfAyhv0ikjG3HJa7ivDliijKhsNoFHfwKZjsm5+Kl5A9AXqyGU8EcAC61QQTClQgdOITDPQzizG5T3AJYBGB0PBCobvtz8Nm8dmJqDIYDqALyRDW2ln3DfM2AJ06Jym4HtIDyRs1rjvAPoonoB4MME3JMMrek/ACjWVfuE18NnNqjvIUyL6m4G3wCoXTbi5/124DctxfIhsLFWDgAAAABJRU5ErkJggg==","#ff5252":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACnUlEQVRYR72XO2gUURSG/3/HiNhZ2ppCCwkYBG1Wk2hEbdyZyQo2alRWhJgqjRjihqAIYhXjK/hqJO7uvQOKQsRA1KCotQ9EhPRrEbBQiHNk1kmIsvPcdU83zDn//82Zc++dIRJEPp83Sq67FSK7AGyAyCqQiwDmkcnMdFerb2dnZ73r2MG4mWLbW+C6F0F65kadOhfAc5BnqNSbuLqxAMS2j0DkJoDVMYR/gTxNpa7FyEUkgJhmP8jbccT+yhEZoONMRNWFAohte+/7FYC2KKE69wWZzE5WKi/DasMBTHMa5J4U5kslc6MdHd3FYjFwMAMBpK8vC9d90YD5n1JyL5WaDtIJBrCsYQBjDQMAY9R6JA3AJIATTQC4Ra0DdcI6cAfA0SYA3KXW/Wk6cB3AyYYByEkqVUgOYJpDIC81AWCYSp1PDmBZnQBex9z9gvQFIjvoOHOJAbwCMc37IA810IWH1PpA+o0ol2uHYbyDyLoUEN9hGNtYLn9IDVDrgm3vhsgjAGsSQCyCtKiUVxcakYeRD2FDpBIltnxf5Bgdx1vGkRELoAZhWUUA56IVOUGlBiLz/ITYAKVSychPTXnTvD1E/CsMo5Pl8kLTAfxV0QNyJlCcPE6lEn07xO7AkqlY1mMA++tAfB7v6uoYHBz8GffpvbzkAKbZC/JpHZMhan05iXkqgEKh0HajWv0IoH2F2Q8Am6j1/H8H8FfEOICVkz5HrbNJzVN1oAaQy+1DJvNkheFZan2hdQCWtR7AFwBra6Yi2bADJwws8RAurwbT/ARyI4AFiLTTcb61rAP+HHj7QQ+A99R6cxrz1DPgb0oPQB4E8Ixa97YewLKuAjgFUlMpu/UAtj0CkVEw2eHzL2gjQ3gY5D3/R/RK2g78Bqvb2CEgaRjZAAAAAElFTkSuQmCC","#f57c00":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACq0lEQVRYR72Wz0sUYRjHP++okb4WFBR0zUMeIkiEumw/NKPsECQKXSorNgL15CVntK2dzUIiqKxQ0rwEWXQoCooEKyuqW9APIgL/gA7SjCm4+8YsbZQ5s+/M2r63YZ7v9/t5n3lm3hGEWM3NzSUj1bdrVYZ6BGuBUmAOmBSKscYX296Mj49719pL6Fa63WxEcRaoB0oW0GWE4ikGJyqSvNb11QJwTA4KwQCwRMM4DbRLm6sateQFcCxaBQzpmM2raZM2/fl0gQCuSS2Cl0BZPqMF7itDsLU8yfMgbTCAxSNgZ4TwnGSirzSxPZFI+A6mL8CPbmIZxbMCwrNSZbCr8nR2IwsuXwDXxEKQLBQASEqbnigAgwiOLgLAdWn7+wR1YBjBoYIBFDdkitbwHbC4BhwrGAAGpU08NIBj0ikEfYsAYEmbVGgAt4saDF5pfv38/JWh2FKeYiI0gCdwLG4K2F9AF+5Jm72RP0QzFlVpeAusiADhZNJsWtbLh8gAv7qwQ8B9YGkIiDkU+2QqqwtceQ8jTz1t0qQEd/KZ5e4rOFxpM6xTrwXgGbkWCeCkhmm/tGnTqMuWaAOMjo6W7HnX4k3zZl9zxdfZOWpWnmNq0QE8w+8WdQaM+ZoLjshkuH8H7Q7kQl2LB0DjfAgl+Dy06uKGjo6OWd3dh3oEOVOnhwaR4fE/ANBZaXM+THgkgHg8XnZh9cBHoOqPsBlDUV2eYvK/A2TfCJNLiL8mfULaxMKGR+pAFqCL3Rg8/B2oMGWKM8UEWIPBF6DCCzUUsaADJwgs9FuQM5u2+KRgHTCVTlO1vJdvReuAFzRtMaagDngvbdZHCY88A57QsbgloAV4Im0aig7gWlwBjgN3pU1T8QFMehCcAkIdPvNBIw+h080BoRgRgvaKJJejduAnWhe4Iac52H0AAAAASUVORK5CYII=","#fbc02d":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC3UlEQVRYR72Wz0sUYRjHv8/szBTdggi65qGCnYlEqIvu7OpGdYkygzpU9mNDME9eIskNMYLoVGokZR0KkuhQFBTZvmuSVHRwRtMiAv+ADkIH2xnnidmUltofM7O27/V9vs/383555n2HEGC1tbVF7nd8biAJzcTY7IJlCeQw8TyIx5K9G94LIZwALUF+i3PZ7TuI3SsAmgFEiuhcgLLs4ryaMN/57esLwMnqx5n5FgDVR+MlBp1TDXPIR23lBHJCayfgjp9mhTVM6FRj1kAlXdkEcploAxG9BaBUalRknwGKKYb5ppy2LIAttBcAdocwX5bwRL84FE+n0yUHsySALfRGgMfDmy8rXWmPkpjyDlJ0lQbIaD0g9FUNAPQphnUxMIAjosMMOl0tADHdluNmyT4lE3CENsLAiaoBgLuyYbUHTyCj3WTC2VUAGJYNKxUYwM5Eu0F0tVoAEPUoMbM/MEBuXK8nlyd93n6l+jNYalLiUxOBATxBTmgPCDhSRQpPFMPaH/oiWhyL1kUi9AHA+hAQP1zJ3bmmaeZTaABPaGe0FhCeAlgbAMIh0EHZMD1d2eXvNXytt7LEjyo1W9ln4KRqWCN+6n0B/E5CT4O4t1JTYgzIcauzUt3Kvm+A0dHRyIGNfd407yoz0d8itlpPyY8Lqw6QTyGrJ8A8VvKbIz6lxqYD/Tv4TmDF1BbaMwD7ikB8GTLP6F1dXT/9nt6rCwEQTQL08h8T4m4lNn0tiHkogFQqpQwenZxloK7AbFFecrZS8+z8fwfwDJysdp0ZBZPOE4ox3RjUPFQCeQCh7WXg+R9DuqAY5uWaAfD4tk2OK38FsC5vylJjuQenHFjgISz4GuYAbAGwIDt2HbXMfa9ZAvk7QWjefZAAMKMYVjSMeegZ8IQ5oT0k4DCAV4phJWsO4IjoIIM6AHqsGGZrzQFsoXm/2peCPj5/g4YeQierH2Pme8w4p8atG2ET+AXG6PEhMv/xEAAAAABJRU5ErkJggg==","#ffea00":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAChElEQVRYR8WWTWxMURTHf8e0InbI3EGszIKFSDRN2JS2VLCRaKZi4zsjkrarbhpNTVNEIjZGiza+NsIQC0JCNCkagrWPiEi6nDcsmlggY67MM5VRM2/uvTPqLt+7539+7//OOfcKFisWi4VSyZuNzGEjsByoA7IIk+QYa9nZ/HJ8fDxrIYmYbtYea4CT4CcPlYjLAY/J0SuLeWGqawSgPfagGUGYayD8A02XRDhnsLeyA9pjH3DJRGzGnk5RDFWKC3RAZ2hE8wyoryRU4r0GNojiaVBsMIDHA2CzQ/LpkImB4URLIpEoW5hlAbRHE/CkiuS/QjVbJOJ/SMkVBNAHDNYAYFAi9LsAjAIHqwaAi6LK6wQ5cBnYWwOAK6L8TrL8BWnOIxyqGkAzKhHiLgA9CKeqBoA+URy3B8jQQI7nhtOvnH5+FqwXxYQ1gN9Baa4h7HJ2QXNHImx3H0RpogivgAUOEF8IsVYW8cYZoODCJoS7wDwLiPwRvUPCflzgMjsN07Qj3KokVvR+vyjybVxxGQEUnEggHK2oCEOi6DTY528xBkilUqFYc0e+mtcFiH+kjgZZyFTNAXwXPtGav3oFiB8QZXd3MHZgOqn2uAdsKwHxPnn9zOru7u5vpl9v9Qt+A6RpQ3j4VxKhR8KctknuBBCPx+svHBt5C0SLkn0ly0pZyuQ/B/BrwSMJf1T6hCj/AmO9rGugALAVuF+U7YgoTlhnt2nDYnGdYQmaD8D8wvOmoAMnCMzJgYIL74AVwBTficoyPs+aA4XJOIbQivBawqxySe7UBUXz4AbQgfBIwrTNPkCGYTSHgduiaP8fAP1oBrA8fGaCuhdhmt0IV4EuUZx1deAngYerIbdnUKcAAAAASUVORK5CYII=","#afb42b":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC30lEQVRYR8WWTUgUcRjGn3fMsm5Bl655KHeGIBHqYpFmpP63ZkZWiKC0QgnUk5dIbEuKoIKgrEj6ugRJ7q7N7JKRYLUVfR2CnVUiBOncQejQxzpvrGZJOTsfSzbXeZ/n/c3D+3//Q/DxRCKRkn0tVhVYqmXY6wBaBnAOoCkCjV44t+bV2NhYzoclyGvxcCq0yWY6A0YtgJJFdDYDjyXio2pj9qVXX08AMVM+QMA1AMs9GM8A1KmJzBUPte4JJIxQKxPd8GK2sIYJHXqj1e+mK5jAcFKpspmfAyh1M1rkPRN4myqyTwtpCwLEk/IIGDsDNJ+XpN+9iWyPRqOOg+kIkDBD1Qx6UkTzWSkBu1RhjTj5OALEk3IPGH3FAgDo04TV6xsgZsgDRDhcPABf10TW0cc5AVO+CaCleADc0oTV6j8BU7lK4PZiAQgYUIXV5hsgYSrdDD5bLACDenSROeUbYMioqJRIeuFx+zn5MzO26mEr7RsgL4ib8h0Ae4OmwMB9XVh7gi+ilFIOm18DWB0A4jNJ2Kw2WNnAAHlhwqzYAUgGA2U+IHLE0NWwZbhpPN2G8aTcBMY9N7P598R8UA1n88fY9fEEMDsPhhIF8XE3R2L0q2Grw63uF6zXwsHBwZLlK0+mmXhLAc3k9xVllc11b6e9+npOIG8YS8k1ZGPU8cyBDuki4+vfwRfA3NFUkgA3LALx/uNk+8aurq6vXr8+X+cbIJZU6oj54d9NuFsT2fN+mgcCaGtrK63f/WwcQPmCQfoyQ/aGpsbxqX8O8HNDXgSwcNLTmrCq/TYPlMAsQCpUD5tSvxOgY6rInF4ygKEHFWulnPQBwKp8U2ZUF7pwCoH5HsJ5s7ghT4CwHsA0f5sp1/WJT0uWwNxmlEdBqGHA0oWlBGkeeAbmBjF0F6BmgB5pIlP3PwAuA3QkvyA1YTUtOUDMlHsJOOH38vkTNPAQJgx5PxNug7lTC2cvBU3gB8o98iFAJBKTAAAAAElFTkSuQmCC","#7cb342":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC5UlEQVRYR72WTUgUYRjH/8+oYd06FHRtD3mIIBHqstm+q1E5Y6IYdCn7YCNQT15yV9va2SyqU9mXlHUJkgjcWaXCmbXaioouQR+EFN7rIHQodOeJWRW22tn52Nr3Nszz/P+/95n3ed4heFidnZ1VdV1fG0yWwgRzPRjVICwAmGWQ/uy8+Wp6etp6dr3IbeTAeNNmlswzAMIAqorkmQw8liQ+nmjJvHSr6wogmg4fIObrAFa4EM6B0KPKxhUXsXAEiGniIICbbsR+j6FuVdGHnfJKAkQntjdQTnoOQo2TUJH3TESNCVl/Wiq3JEBMEw8B7PBhvpTC2eo3jaF4PG57MG0BBtLhIDM/8W++mCkR7zwlZ6yNFF22AFFNxAhIlAsApoTaqg/6ARgh4EjZAMQ3VDljq2NfgbQYJUZXuQBMuJWUDauTvH2CWDp0FUxHywUAMKIqRsQzQDQl+ohwrmwARkxtNZKeAfo1US8BL1xOPzt9ZkjbkspU1jOAlRBLiztg7CujCilVMfb4H0STIoAcXgNY7QPiey5HW4ba9Pe+ARar0NQENjUAtR4gFhhoTyqGlVdyOV5GVnY0FeogontOYgXvD6mKMeom3hVAvhKaiAM44SzKw6qS6XaOW4xwDTA2Nlb1duW1LMBbbY888HmhVqo/2zw1988B8lVICQGCbttSxIcTcsbTv4PrCiybxjQxAWD3nxAEfFrzpW1Tb2/vT7e79/QJlkUHx8PNpsSP/jIh6lNl/YIXc18AkUikZq0y8wFAoMDsB0uoS7YYs/8dIN+WmrhIQMFJ56yqZIJezX1VwErqT4ldEmFy2ZCJoklZP105gAfBddJ8zQyAVZYpQwqWunBKgXnugoJu+AhgA4C53DwFhtr1bxWrwNJktOaBAPBOVYyNfsx9n4E8QFrcBWMvwFOqkmmuPEBKXAbhGBj31Vajo+IA0VR4kIhPAt4unyIT1B/7gBbaz6DbBPQkFOOSPxXgFyMK6yEBhKArAAAAAElFTkSuQmCC","#0f9d58":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC4UlEQVRYR72WT0gUYRjGn3dWJTy467FrHvIQQSYVgUWWkV2CRGcWInNmWwl0D+ElEtuQIohOZf+cWc2DO6vhoSgwEqykqM79ISKQLl1idyaDgt19Y7YUqZ3d+WZpv+u8z/P8vpf3+74hCKzu7u7AfGeglRj7AWxiQg0xsgwsM2Fh+9SXV4uLi1kBS5DX4pCubGPCJaAQHiiiywP0hInP2Kr50quvJ4CQHu5l4tsA6jwY50A8aKmpGx5qy3cglJD7mCnhxWx9DQMDtmaOldOV7EDQUFoBPAdQW86oyHeWJOxN95nPSmnLAcwDOOgjvCBhYOn05+Z98XjcdTBdARonlLZ8Hk/9hq/qmKRDtjrtbKTocgVo0JVhIoxWCkDAaEYzR4QBgro8DqJIpQAADEszXX3cO2AoEwScqBSAgUlbM/vEO5CQb4Kpv1IAAOOWZkbFAXRlCITLFQMQD1tq6oI4QEJuAdMLj7efmz9LoD1pLbkkDOAIgoYyDSDstwsM3LM184j/i2hSbkKeXoPR6ANiJUe5nSvq7FvfAIUuJHoOgKX7ADYIQGQlpqPpSNLRlVyeXsOgEe4C+G45s9XvRKxm1NSEl3pPAI5RyFDiDJwrZ0rAWEYzB8rVrcF6LZyZmQmcXJlbAmNXCc0nKZtrSffPWl59PXfg9zyE28G84HqkGFomYgr9OwgBFCB0+QGIDheB+DD6fffWWCz20+vunTpxgPFwByR+9HcIgYYyWvKKSLgvgGg0WpvaYb8DoWld2A9iqTkTmV7+7wCFE5FQrjJjbdKdPx9bM9tEw311wBE1GHIngR6uCzxraebFqgHU3zq2sbYm+xFAvRMqgdpKPTilwISHcNUsaITfA7wZgJWvqWv61jv1tWodKBxHQ3Hug3YmvLFVc4ufcN8z8AcgBaAHoMeWluyoPoCuXAfhFAhzlmp2VR2gISGPENN50cfn3wvMJ3rIkI8z6A4zD9qR1DWfNvgFf5LtIfbh8+sAAAAASUVORK5CYII=","#0097a7":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACoUlEQVRYR8WXT0gUYRjGf5+rEd06ds1DHSJQhLpYaRrVJVAUvxUyK3Z3ls2Tl0hsQ4ogulTu7Cr9I9gdNToUBUaClRTVub9E4LXwIHSo2J03dte00p2dmTX7rt/7Ps9vHt75vhmFh9XR0RGYaGlrIMdeYDOKaoQsillspvZMpF5OT09nPUiiXBebmToU55GCeWCFPhslj1HqJGH9wq2uO4BEugelRoB1LoRzoE5gdJkual0kkLB6UXLNjdgfNUKMqB4u1+ecQDLTgPAMqCkntMK+IOwmqp869ZYDmETY58O82CLMxD+/b4rH4yUHszRAItOI4olv88VGez9G92QpHSeAARRDlQMwhKEHvQOY1ijI8YoBhKtEdUmd0gmYmevAkYoB4AaG7vWTQBIkvAoAoxg65B0gmelHuFA5gBrA6DrrHSBl1WPLc5enXyl9oUp2EQ7OeAfId5iZNKArSOEuhj7k/yBKWbXY8grY6APiKyqwg0jnG/8A+c7EWAvKvges9wCRRUkbkWC+z3G5uw3NdDuo2+XEFvdFHSXalX+Nyy53AMV5iAOnXSgOE9GxsnULBa4BxsfHA51zufw073QQ/0RVoJ5w5/yqAxQEzXQzqCkH8WMY2tO3g+sEFk1N6z7IwWUQwodL2S/b+/r6vrt9+nydd4BkuhVRD5ebSD9G8KIXc18AoVCoZqSu6S1Q+5vZN3L2VmLds/8coDgLmcvA0qQLM0R1o1dzXwkUTBLWAZQ8WHrvOUVUn1s7gNStTdjVH4ENBdMqaXS6cJzAvA/hLzUz/Q7UFmCe3I9aYj1za5dAcQ7y50EzitdE9DY/5v5noAgwBnSCPMIItv4PgARgINwhqtvXHiBpDSJyBoWny+dvUP9DmLQOI3Jz4Uf0it8EfgI9/sghCgplgwAAAABJRU5ErkJggg==","#0288d1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC0ElEQVRYR8WWz0sUYRjHv8/MGuGtY1c9WBA76yLUxX5YRnUJEgMvlRUbkXqSfNfMNsR2xgiCsiIr6xJkUVAUGQlaUvTjsLPSDyIE/4AOQgej3eeJUVasnNmZ2dK5vs/z/X7mO8/7vkMI8DQ2Nup3q7tqNA1bAVRAEAEhB5IpFn1k89PWt6Ojo7kAkiDfxelMNZFmEsQx1xfpYwHGhJFEp/HGr64vAN2y94vgKoAVPoTzAFpZGZd91BZPQLeyzSJyw4/Y7zXUwiraX6zPOwFrokYTfgWgrJjQIuvCGjbhuPHSq9cTgMzsMEG2hzCfbSFg/OTMgy2pVMp1MN0B+uxajfEirHmhT4PsyKnYsJuOK4BmZrsA6SkVAEI9nIx2Bwew7AEIDpcMAFxnZbjqeCSQGQToQOkAcpNVrDl4Amb2CiBHSgfAACsjEQLAbgdwtmQAQhd3GL2BAdBnxzXGa5+nn5u+MGQjVGw8OAAAzbJvQ9AUNgURPJSksTv0QYS+iUqN+R2AVSEgvjPn16Mz/jE8AIBIOruNSR4BWBkAIkfAnrwynD7Px99tmLYbhHCvmFhhnYgO5juig37qfQE4QlraToFwqrio9LOKtRSvm6vwDTA0NKQ3TVaNC7DBQ3yS8TMOVTP9zwEcwUjarmPCiOuWEjmUT8YC/Tv4TmD++1r2YxLsWgTiy/nysWhbW9sPv28f6BMURCPWRD0LP/vLRKSdk7FzQcxDASQSibJrFcc+AahcYDbDkfwatMen/jvA3I7IXADR/KQ7fz55ZdQGNQ+VgNOkm9mdAnmywPAEK+PMkgGg9/1qTS/7CqDcMWVIrdeF4wUWeBcUxDTT/gygCsA084pKdK79tnQJOCeYaY8QUAfgAytjXRjz0DMwO4hm9g4gewV4LsqoXwYA+xKAowLcF2U0LANAphug00Cwy+dP0NBDqJv2PgFugaiVO6IXwybwC6zx8CErd+QIAAAAAElFTkSuQmCC","#3949ab":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC4klEQVRYR72WT0gUYRjGn3c2K7p17JqHOkRQCO6sbJGmuzOXQGemulRWbATqyUsktiFFEHUpK5KyLlEzY4eiGQ0FK9tZjU5hRUQgQrcOQkLZOm/M1kp/9s/MbO13nfd9nt/38PJ+QwhwVFWNzC/ubQBzCxFtBPMqEOXAPAcBE2sWB2cmJydzASRBfotFydwG8DkALQAiRfpcZn4CQTiRtZRpv7q+AKJJ8yARXwew2ofwMoO7s7Z21Udt5QRistHJjJt+xH6rIepyLGWwUl/ZBJpks8FlzgCoqyRU5DsLLnY+H1OflestCyBKxhiAthDm+RYCptoaZ3el0+mSg1kSoClhxF0BT8Oar/QxJZ1RxbtI0VMSIJY0+pgwUDUAMODYan8YgCEmHK0agOiGYykldUonIJvDzHyoWgAiupWxlM7ACYiycQ2MY9UCMDCUtdVUcADJ6AVwvnoA7sva2pnAANHEyHYSXMfn9iulzy7zjulRbSowgNcgysYdMPaHTYGABxlb3RN6EcWku/WMyAsA60NAfHbBjdO29jo0gNcYTYzsJsF9CGBtAIgcg9qztuL1lT2+XsOYbHYws1lJrPCdCIczljrsp94XgCcUk400M05VFGUMOqNqV8W6nwW+AXRdj1wcxhSBomXEPyx94+0vx7WFfw6QT0HSmxk0UVqcjji2EujfwXcCBdOopD8ikPwnBIHe7ZM+bu3p6fnq9/ZeXWCARllvFZge/w2A3oytXghiHgoglUrVvZpvewNw/S9mX4iEzRmrY+6/A+Q3pGReAnhl0r0/n4ytxoOah0ogv5wkQyLAKhgycDJrq2drBhBPjGzICe57AOs8U5c5Xu7BKQcWeAgLYqJkvAWwCcDC8lKkfmai/VPNEvgxB4a3D5oBzDq2uiWMeegZyAMkjXsgaCAedyytteYAMcm8wuDjINx3LLWj5gCipPcDdBoBH58iCywcuygZBwDcBrjbsbXL4VSA7z4J+yGaqCavAAAAAElFTkSuQmCC","#9c27b0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC40lEQVRYR72WT0gUYRjGn3cnJbp1q2vKzAoRJFJdLNKM9LKjoiBBpjuzEqknL5HYhhRBBEFZ2c5qXYSk2hmloEjQWorqUJdyZhPB6NrBiEhy543RjEX2z8xs7Xf93ud5f9+z73zfEjystrY2ofH98RoWUG8z7SK2tzAFVgF7iYlmJnZcfTM7O7vqwRLktlirNPZC4EsA6gEIWXQ2gLmAjTPdn+TXbn1dAWhBoxPMtwGUuzBOM7hPtZpvuqgtnEBM0rsIGHNjllnDjF41JY8U0uVNIC4ZNQx+CaCskFGWfWbGITUlv8inzQugSfoTAEd9NP8joeSXjneHo9FozsHMCRAT9VoiPPfffF1pE45FTNk5SNaVE0CTjEGAh4sFINBw2AoN+QDQYwCUYgEYFFetUE6f3AmI+jgIJ4sFAOOOkpK7/CRwC0BP0QCEmGLKEe8AQX0AjMvFAjAwqFryBc8AY1XT1badfuXy9svlz8T2wXCqJekZwBHERWOCiTuKSGFKseSQ74totDJRIQj0FsB2HxDfA2ns716QP/oGcIRjon7EJkwD2OoBYhWEFsWUHV3e5eo1jAcTrcx0v5DZxj4D3aolj7updwXgGMWCiSgxnStkSoSRsCn3Fqrb2HcNMDk5KXwbLE+CcCC3OS2mf61U9yy2L/9zgLUUpKk6gj2TByCsWCFP/x1cJ7DRVJP0RwCaskCkfpz+vKe/v3/F7emdOs8AsSqjgWx+urkJEw+oZvMVL819AUQikbJ9c03zACoymv1EIB1U5luX/juA00ATE9dAlDHplFSsUK3X5r4ScERxMdHIRI//fkqEs2FTvlgygNGqBzsFW1gAsG3tFGzX5ntw8oF5HsKMr8EEIAFYLiO7otNs+VqyBNZ+Bikxw6A6MD4oKXm3n+a+Z2D9UjLuEbidCc9UU24oOYAmGTcAPgXmh0qqubX0AKI+BMJ5r4/PZlDfQxgX9RNMuAuiPsUMXfebwG+QMPYhtajfDgAAAABJRU5ErkJggg==","#795548":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC4UlEQVRYR8WWT2gTURDGv0lsEW/iqVcrKCiCpWAvUWxtd7cXocmmeFGrEhHannrIpqFGSndTxJNWxWKrF8HdWEGx2ZUWqlZFBW/+QUSoZ0UKCv5JdmSjLUWTze5G67u+me/7vWHevEfwsWRZDm+yPzcjXGwD00Yw1oBQYOKFsM2zD95/ezI3N1fwIQnyGpyMSjsoxFkAbQDCZfJsAHdhhxTt+vRjr7qeAJS4eBCMiwDqPQgXAerTjPx5D7HVK6DEhB4QTXgRWxlDxL2qbo1Vy3OtwGC0s9kO2Q8B1FUTKrPPYN6t5az7brmuAIosWgA6ApiXUgiYr9/asieTyVRszIoASkyIgOheUPOlPCKIqm46Bym7XADENAjDNQMwDau5/JBvgFRcHGfG0VoBAFzSDLOiTsUKJGVxkoBDtQIwcDlrmD2+K6DExQtgHKsVAMzjWs5KBACQBsB8qlYABqWzRn7EN0CqW2himx55nH6V9NkGdo0a5rxvACdBiYlXQdhfQxVuaoa5L/AgSndLjUWbnwJYHwDiE0A7NSP/IjCAk5iMC3uJ6RaAtT4gCiGirhE97+S5Lk+vYTIuRIkpV01seZ/5sJazJr3EewJwhFJxMcOME1VFGWNazuytGvcrwDOAruvhZ8bEPAEtLuJvbRSaRo2Zxb8OUOoHWWol8GzFK0V0RNXzvv4OniuwZKrI4m0AnWUgXjdEOrf39/d/9Xp6J843QEruaGeE7vxuQswDas467cc8EEAikajb8PHdSwCNK8y+hIqhLSNT0wv/HKA0IWXpDMDLne78fFTDjPg1D1SB0pWMSRITTy8bEg9quqWuHkCX0MBhegNgnWNqAxG3B8cNzHcTLoklZfEVAZsBLKLwvVG7Mfth1Srwsw9EZx60AniuGea2IOaBe6AEEBOvgRAHMKMZZvvqA8jCOYCOA5jSDDP6HwCkIYBPwufj88cAC0qeikkHmPgKg/uyhnU2qM4PGPX0IXjnNc4AAAAASUVORK5CYII=","#bdbdbd":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACrklEQVRYR8WXv2tUQRDHv3MxInamszWFFiIYBG2iuLNP1EYwxGDjb04OYqo0YognhyKIlT8x+KsRDGKhKGh2X+IzKGp9KiJC/gCLgIUS3ZGVdxLC3ft1MU732Pnx2dmZ2X2EHNLf399RqVQ2Oee4VCqtAbAMwE8AMyJia7Xa26mpKf+dWSir5sTExMZSqXQeAAPoaGLnALwgopNKqTdZ/WYCMMYcJKIbAJZncPwLwAlmvpZBF6kA1trDAG5lcTZfR0QGtdZX0uwSASYnJ/15vwLQmeaoybqIyDat9csk20QAa+0zADsKBP9jQkTTURRtr1arLQuzJYAxppeIoqLBG3ZEtFMp5TfSVFoCWGtHANTaBRCRmtZ6tAjAGIBj7QIQ0U2lVEs/SRm4DeBQuwAA7jCz76R8RxCG4XUROb4IAGPMXM4NYK0dBnBhEQBGmPlsEYAeAK8zTr9W/sU5tzUIguncAN7AWnsPwP42svCImfe0M4i6AbwDsKoAxDcR2ay1fl8YwBsaYzQRPQawIgeEn3x7mdnbJUrqZeStwzDsE5EHac7mrR9hZt/GqZIJIK6HKoDTaR6J6IpSajBNr7GeGWB8fLyjq6trmoi2JDj/4pzrCYJgdtEB4iwo3xwtW4roqFIq19shcwYaQa21TwDsbgLxqV6vbxgaGvqRdfdeLzeAMSYgoucLg4jIsNb6Yp7ghQDK5XLnwMDABwB+RjTkO4B1zDzzzwHiWrgE4G+l+5ePUqo3b/BCGYgBdgF42ggoIqe01ueWDCCKotVzc3OfAaz0QZ1zvUkXThJY7iKc1w0fAawFMCsi3Vrrr0uWgfgY/Dzwc6HOzOuLBC9cAzHAfQD7iMgopYL/AXAVQAXAQ2buW3IAY8woEZ3Je/ksBC1chGEYHhCRu/GP6OWiGfgNjS3rIdaJCqYAAAAASUVORK5CYII=","#757575":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACyUlEQVRYR72WTWsUQRCG3+rZFZFA8CgEAuagBxEMAb1EMTGiXgQlghc1KitCEkKyPSAGXQkap2vmpFEx+HURDOJBUVAMRA3Kumc/EBHyAzwEPCjEKWnNSoi7szOzMXWcrnrr6Zrq6iYksO7ubqe5ubmNiDqJaG0Yhhml1FwYhjOO40wWi8W3U1NTcwkkQXGdBwcHNzmOcxFAJwCnQlwI4IWInPJ9vxhXNxaA67qHReQ6gBUxhH8C6GPmqzF8a1fAdd0eEbkZR2yRTy8zj9WKi6yA67ptIvIaQLaWUIV1AbCNmV9FxUYCaK2fAtiZIvnvEBGZbmho2F4oFKo2ZlUArXU7gJdpk5fjlFK7PM+zG6loUQDDAEbqBSCiEWPMmTQA4wCOLwHADWNMVZ2oCtwCcKReAAC3mbknTQWuAThRLwARjRtjcmkA8gC4XgARGfZ9/3wagFYAb2JOv2r6opTa6nnedGIAG6C1vgvgYB1VeMjMe+sZRC0ASgBWJ4UQkW8isjkIgvepAWxgPp/fQUSPAKxMADEnIvt837dxkRbrNtRa7wdwv5ZYeZ2Ijhpj7DGuabEArIrrugUROVtTERhj5t4Yfr9dYgNMTEw4pVLJdvOWCPEvSqlWz/Nmlxxgvh86iGgyQvwYMyd6O8SuQDmp1voxgD2LIYjoU1NT08b+/v4fcXef6BeURV3X7RKRZxUA8saYIEnyVAC5XC7b2Nj4AYCdEWX7Hobh+iAIZv47wHwvXCKiv51uXz6+79sHTGJL3AM2w9DQ0G6l1JMF2U4z84XE2ZMcw4XiAwMDa7LZ7GcAq+x3pVR71IUTBZaqAlZQa/0RwDoAs5lMpmV0dPTrslVgHsDOgw4A75h5Q5rkqU7BguN4T0QOAHjOzF3LDqC1vgLgpIg88H3fXlaprJ4esE/tc0h4+fwzwFJh/2nCQwDuEFGfMeZyWp1fvefoIasVHgoAAAAASUVORK5CYII=","#424242":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACsElEQVRYR8WXPWgUURDH/7PxROwsbU2hhQgGQZvzsu9tRG0Mhgg2fnMixFRpxBBPgiKIlUaNwa9GMIiFoqDsmxc1KGrtB3II6WMRsFDQHXmyF4Le7dfFON3yZv7z23nz5u0Sclh/f3/H7OzsJs/zdBRFawAsA/ADwAwRmSiK3kxNTbnnzEZZPYMg2BhF0TkAGkBHk7gIwDMROWGtfZ1VNxOA1nq/iFwDsDyD8E8Ax5n5SgZfpAIopQ4CuJFFbKEPEQ0YY8bS4hIBuru73X6/BFBKE2qyLkRUMca8SIpNBFBKPQGwrUDy3yEiMl2pVPxardayMVsCaK3LIvK8aPJGnIhst9a6F2lqLQGUUsMARtsFIKJRY8xIEYAJAEfaBRCR69baljpJFbgJ4EC7AABuMbM7Sfm2wPf9q0R0dBEAJpi5mhtAKTUE4PwiAAwz85kiAF0AXmWcfq30xfO8rWEYTucGcAFKqTsA9rZRhQfMvKudQdQJ4C2AVQUgvhLRZmPM+8IALjAIgiCKoocAVuSAcJNvNzO7uERLvYxctO/7fUR0L01swfohZnbHONUyAcT9UANwKk1RRMastQNpfo31zACTk5Md4+Pj0yKyJUH8s+d5XWEYzi06QFwFBcC0PHMih621ub4dMlegkVQp9QjAziYQn3p7ezcMDg5+z/r2zi83gNa6R0Se/pmEiIaMMRfyJC8EUK1WS/V6/QMANyMa9g3AOmae+ecAcS9cBDDf6e7Lx1pbzpu8UAVigB0AHs8fJaKTxpizSwZQLpdXl0qlOoCVLqnneeWkCycJLHcTLjgNHwGsBTBHRJ3GmC9LVoF4G9w8cHPhHTOvL5K8cA/EAHcB7BGR0Frb8z8ALgM4BuA+M/ctOYDWekRETue9fP4aYEXJfd/fR0S34x/RS0V1fgGIK+4htLr46QAAAABJRU5ErkJggg==","#000000":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACN0lEQVRYR73Xz4vNYRTH8dc0RrKztGXBQooUG4yfYaNobtn43ZViVjYirkRKNuNnI782yowsiCJqMBHWfiQpf4CFsqD8PLlTt+nO9z7f596c3e0+53zez3nOc57z7VLC+vr6uoeHhxdgBWZgEn7gEx719va+HBkZid/J1pW8knk4URfvbuL3C4+xHy9S46YCbMEgJicE/om9OJ+wVgrANlxOCTZuzR6cbeXXCiDO+xl6WgVq8v9vLMXTIt9WAPexOkN8zGW0Vqstq9VqExZmEcBiPGlDfMx1DWIjTa0I4CCOdgAgYhzKAbiInR0AuFQUpygDV7C1AwBXETep9BFcwK4OAEQmqzkA+3CyAwBRS8dyAObjeWL3myh+9IIlGM0BCJ/r2NRGFm5jfTuNaCZeYVoGxFcsxJt2AMJ3Je5gSgmI6Hwb6n6Fbq1a8ZjzRtwsAbAdcY1bWipABKrhcMuI/17AeAmTLBlgaGiou1KpRDUvKoj8EXF7viSpkzQPNMZaHqNXQfAdZWeH5Aw0iN7FuiYQ7wcGBub29/d/T919rMsBWIUHTUSic54qI54FUK1WewYHB98iesSYfcPs+nRciiEnAyFwelylR3HGAFPacgHW4l6D2gEcL62eWQOhMx0fMLUuGruf8MEpAsvNQMR8h1n1Ox/18Pl/ZiC0oh9EX3iNOTniWbegQegGKniIuJpZ1s4RnMNu3EI8VlnWDkCM2kfqn1/Jj894ynYANuNa/UP0TNb2/zr9AX22YSHkSY4cAAAAAElFTkSuQmCC"},initialize:function(options){this.regExes={trimSpace:(/^\s*|\s*$/g),removeSpace:(/\s*/g),splitSpace:(/\s+/),trimComma:(/\s*,\s*/g),kmlColor:(/(\w{2})(\w{2})(\w{2})(\w{2})/),kmlIconPalette:(/root:\/\/icons\/palette-(\d+)(\.\w+)/),straightBracket:(/\$\[(.*?)\]/g)};this.externalProjection=new OpenLayers.Projection("EPSG:4326");OpenLayers.Format.XML.prototype.initialize.apply(this,[options])},read:function(data){this.features=[];this.styles={};this.fetched={};var options={depth:0,styleBaseUrl:this.styleBaseUrl};return this.parseData(data,options)},parseData:function(data,options){if(typeof data=="string")
data=OpenLayers.Format.XML.prototype.read.apply(this,[data]);var types=["Link","NetworkLink","Style","StyleMap","Placemark"];for(var i=0,len=types.length;i<len;++i){var type=types[i];var nodes=this.getElementsByTagNameNS(data,"*",type);if(nodes.length==0)
continue;switch(type.toLowerCase()){case "link":case "networklink":this.parseLinks(nodes,options);break;case "style":if(this.extractStyles)
this.parseStyles(nodes,options);break;case "stylemap":if(this.extractStyles)
this.parseStyleMaps(nodes,options);break;case "placemark":this.parseFeatures(nodes,options);break}}
return this.features},parseLinks:function(nodes,options){if(options.depth>=this.maxDepth)
return!1;var newOptions=OpenLayers.Util.extend({},options);newOptions.depth++;for(var i=0,len=nodes.length;i<len;i++){var href=this.parseProperty(nodes[i],"*","href");if(href&&!this.fetched[href]){this.fetched[href]=!0;var data=this.fetchLink(href);if(data)
this.parseData(data,newOptions)}}},fetchLink:function(href){var request=OpenLayers.Request.GET({url:href,async:!1});if(request)
return request.responseText},parseStyles:function(nodes,options){for(var i=0,len=nodes.length;i<len;i++){var style=this.parseStyle(nodes[i]);if(style){var styleName=(options.styleBaseUrl||"")+"#"+style.id;this.styles[styleName]=style}}},parseKmlColor:function(kmlColor){var color=null;if(kmlColor){var matches=kmlColor.match(this.regExes.kmlColor);if(matches){color={color:'#'+matches[4]+matches[3]+matches[2],opacity:parseInt(matches[1],16)/255,r:parseInt(matches[4],16),g:parseInt(matches[3],16),b:parseInt(matches[2],16)}}}
return color},parseStyle:function(node){var style={};var types=["LineStyle","PolyStyle","IconStyle","BalloonStyle","LabelStyle"];var type,styleTypeNode,nodeList,geometry,parser;for(var i=0,len=types.length;i<len;++i){type=types[i];styleTypeNode=this.getElementsByTagNameNS(node,"*",type)[0];if(!styleTypeNode)
continue;var kmlColor=this.parseProperty(styleTypeNode,"*","color");var color=this.parseKmlColor(kmlColor);switch(type.toLowerCase()){case "linestyle":if(color){style.strokeColor=color.color;style.strokeOpacity=color.opacity}
var width=this.parseProperty(styleTypeNode,"*","width");if(width)
style.strokeWidth=width;break;case "polystyle":if(color){style.fillOpacity=color.opacity;style.fillColor=color.color}
var fill=this.parseProperty(styleTypeNode,"*","fill");if(fill=="0"){style.fillColor="none"}
var outline=this.parseProperty(styleTypeNode,"*","outline");if(outline=="0"){style.strokeWidth="0"}
break;case "iconstyle":var scale=parseFloat(this.parseProperty(styleTypeNode,"*","scale")||1);var width=32*scale;var height=32*scale;var iconNode=this.getElementsByTagNameNS(styleTypeNode,"*","Icon")[0];if(iconNode){var href=this.parseProperty(iconNode,"*","href");if(href){var w=this.parseProperty(iconNode,"*","w");var h=this.parseProperty(iconNode,"*","h");var google="http://maps.google.com/mapfiles/kml";if(OpenLayers.String.startsWith(href,google)&&!w&&!h){w=64;h=64;scale=scale/2}
w=w||h;h=h||w;if(w)
width=parseInt(w)*scale;if(h)
height=parseInt(h)*scale;var matches=href.match(this.regExes.kmlIconPalette);if(matches){var palette=matches[1];var file_extension=matches[2];var x=this.parseProperty(iconNode,"*","x");var y=this.parseProperty(iconNode,"*","y");var posX=x?x/32:0;var posY=y?(7-y/32):7;var pos=posY*8+posX;href="http://maps.google.com/mapfiles/kml/pal"+palette+"/icon"+pos+file_extension}
style.graphicOpacity=1;style.externalGraphic=this.iconColorMap[color.color];style.graphicYOffset=-32}}
style.graphicWidth=width;style.graphicHeight=height;break;case "balloonstyle":var balloonStyle=OpenLayers.Util.getXmlNodeValue(styleTypeNode);if(balloonStyle)
style.balloonStyle=balloonStyle.replace(this.regExes.straightBracket,"${$1}");break;case "labelstyle":var kmlColor=this.parseProperty(styleTypeNode,"*","color");var color=this.parseKmlColor(kmlColor);if(color){style.fontColor=color.color;style.fontOpacity=color.opacity}
break;default:}}
if(!style.strokeColor&&style.fillColor)
style.strokeColor=style.fillColor;var id=node.getAttribute("id");if(id&&style)
style.id=id;return style},parseStyleMaps:function(nodes,options){for(var i=0,len=nodes.length;i<len;i++){var node=nodes[i];var pairs=this.getElementsByTagNameNS(node,"*","Pair");var id=node.getAttribute("id");for(var j=0,jlen=pairs.length;j<jlen;j++){var pair=pairs[j];var key=this.parseProperty(pair,"*","key");var styleUrl=this.parseProperty(pair,"*","styleUrl");if(styleUrl&&key=="normal")
this.styles[(options.styleBaseUrl||"")+"#"+id]=this.styles[(options.styleBaseUrl||"")+styleUrl]}}},parseFeatures:function(nodes,options){var features=[];for(var i=0,len=nodes.length;i<len;i++){var featureNode=nodes[i];var feature=this.parseFeature.apply(this,[featureNode]);if(feature){if(this.extractStyles&&feature.attributes&&feature.attributes.styleUrl)
feature.style=this.getStyle(feature.attributes.styleUrl,options);if(this.extractStyles){var inlineStyleNode=this.getElementsByTagNameNS(featureNode,"*","Style")[0];if(inlineStyleNode){var inlineStyle=this.parseStyle(inlineStyleNode);if(inlineStyle)
feature.style=OpenLayers.Util.extend(feature.style,inlineStyle)}}
if(this.extractTracks){var tracks=this.getElementsByTagNameNS(featureNode,this.namespaces.gx,"Track");if(tracks&&tracks.length>0){var track=tracks[0];var container={features:[],feature:feature};this.readNode(track,container);if(container.features.length>0)
features.push.apply(features,container.features)}}else{features.push(feature)}}else{throw "Bad Placemark: "+i}}
this.features=this.features.concat(features)},readers:{"kml":{"when":function(node,container){container.whens.push(OpenLayers.Date.parse(this.getChildValue(node)))},"_trackPointAttribute":function(node,container){var name=node.nodeName.split(":").pop();container.attributes[name].push(this.getChildValue(node))}},"gx":{"Track":function(node,container){var obj={whens:[],points:[],angles:[]};if(this.trackAttributes){var name;obj.attributes={};for(var i=0,ii=this.trackAttributes.length;i<ii;++i){name=this.trackAttributes[i];obj.attributes[name]=[];if(!(name in this.readers.kml))
this.readers.kml[name]=this.readers.kml._trackPointAttribute}}
this.readChildNodes(node,obj);if(obj.whens.length!==obj.points.length){throw new Error("gx:Track with unequal number of when ("+obj.whens.length+") and gx:coord ("+obj.points.length+") elements.")}
var hasAngles=obj.angles.length>0;if(hasAngles&&obj.whens.length!==obj.angles.length){throw new Error("gx:Track with unequal number of when ("+obj.whens.length+") and gx:angles ("+obj.angles.length+") elements.")}
var feature,point,angles;for(var i=0,ii=obj.whens.length;i<ii;++i){feature=container.feature.clone();feature.fid=container.feature.fid||container.feature.id;point=obj.points[i];feature.geometry=point;if("z" in point){feature.attributes.altitude=point.z}
if(this.internalProjection&&this.externalProjection)
feature.geometry.transform(this.externalProjection,this.internalProjection);if(this.trackAttributes){for(var j=0,jj=this.trackAttributes.length;j<jj;++j){var name=this.trackAttributes[j];feature.attributes[name]=obj.attributes[name][i]}}
feature.attributes.when=obj.whens[i];feature.attributes.trackId=container.feature.id;if(hasAngles){angles=obj.angles[i];feature.attributes.heading=parseFloat(angles[0]);feature.attributes.tilt=parseFloat(angles[1]);feature.attributes.roll=parseFloat(angles[2])}
container.features.push(feature)}},"coord":function(node,container){var str=this.getChildValue(node);var coords=str.replace(this.regExes.trimSpace,"").split(/\s+/);var point=new OpenLayers.Geometry.Point(coords[0],coords[1]);if(coords.length>2){point.z=parseFloat(coords[2])}
container.points.push(point)},"angles":function(node,container){var str=this.getChildValue(node);var parts=str.replace(this.regExes.trimSpace,"").split(/\s+/);container.angles.push(parts)}}},parseFeature:function(node){var order=["MultiGeometry","Polygon","LineString","Point"];var type,nodeList,geometry,parser;for(var i=0,len=order.length;i<len;++i){type=order[i];this.internalns=node.namespaceURI?node.namespaceURI:this.kmlns;nodeList=this.getElementsByTagNameNS(node,this.internalns,type);if(nodeList.length>0){var parser=this.parseGeometry[type.toLowerCase()];if(parser){geometry=parser.apply(this,[nodeList[0]]);if(this.internalProjection&&this.externalProjection)
geometry.transform(this.externalProjection,this.internalProjection)}else throw new TypeError("Unsupported geometry type: "+type);break}}
var attributes;if(this.extractAttributes)
attributes=this.parseAttributes(node);var feature=new OpenLayers.Feature.Vector(geometry,attributes);var fid=node.getAttribute("id")||node.getAttribute("name");if(fid!=null)
feature.fid=fid;return feature},getStyle:function(styleUrl,options){var styleBaseUrl=OpenLayers.Util.removeTail(styleUrl);var newOptions=OpenLayers.Util.extend({},options);newOptions.depth++;newOptions.styleBaseUrl=styleBaseUrl;if(!this.styles[styleUrl]&&!OpenLayers.String.startsWith(styleUrl,"#")&&newOptions.depth<=this.maxDepth&&!this.fetched[styleBaseUrl]){var data=this.fetchLink(styleBaseUrl);if(data)
this.parseData(data,newOptions)}
var style=OpenLayers.Util.extend({},this.styles[styleUrl]);return style},parseGeometry:{point:function(node){var nodeList=this.getElementsByTagNameNS(node,this.internalns,"coordinates");var coords=[];if(nodeList.length>0){var coordString=nodeList[0].firstChild.nodeValue;coordString=coordString.replace(this.regExes.removeSpace,"");coords=coordString.split(",")}
var point=null;if(coords.length>1){if(coords.length==2)
coords[2]=null;point=new OpenLayers.Geometry.Point(coords[0],coords[1],coords[2])}else throw "Bad coordinate string: "+coordString;return point},linestring:function(node,ring){var nodeList=this.getElementsByTagNameNS(node,this.internalns,"coordinates");var line=null;if(nodeList.length>0){var coordString=this.getChildValue(nodeList[0]);coordString=coordString.replace(this.regExes.trimSpace,"");coordString=coordString.replace(this.regExes.trimComma,",");var pointList=coordString.split(this.regExes.splitSpace);var numPoints=pointList.length;var points=new Array(numPoints);var coords,numCoords;for(var i=0;i<numPoints;++i){coords=pointList[i].split(",");numCoords=coords.length;if(numCoords>1){if(coords.length==2)
coords[2]=null;points[i]=new OpenLayers.Geometry.Point(coords[0],coords[1],coords[2])}else throw "Bad LineString point coordinates: "+pointList[i]}
if(numPoints){if(ring)
line=new OpenLayers.Geometry.LinearRing(points);else line=new OpenLayers.Geometry.LineString(points)}else throw "Bad LineString coordinates: "+coordString}
return line},polygon:function(node){var nodeList=this.getElementsByTagNameNS(node,this.internalns,"LinearRing");var numRings=nodeList.length;var components=new Array(numRings);if(numRings>0){var ring;for(var i=0,len=nodeList.length;i<len;++i){ring=this.parseGeometry.linestring.apply(this,[nodeList[i],!0]);if(ring)
components[i]=ring;else throw "Bad LinearRing geometry: "+i}}
return new OpenLayers.Geometry.Polygon(components)},multigeometry:function(node){var child,parser;var parts=[];var children=node.childNodes;for(var i=0,len=children.length;i<len;++i){child=children[i];if(child.nodeType==1){var type=(child.prefix)?child.nodeName.split(":")[1]:child.nodeName;var parser=this.parseGeometry[type.toLowerCase()];if(parser)
parts.push(parser.apply(this,[child]))}}
return new OpenLayers.Geometry.Collection(parts)}},parseAttributes:function(node){var attributes={};var edNodes=node.getElementsByTagName("ExtendedData");if(edNodes.length)
attributes=this.parseExtendedData(edNodes[0]);var child,grandchildren,grandchild;var children=node.childNodes;for(var i=0,len=children.length;i<len;++i){child=children[i];if(child.nodeType==1){grandchildren=child.childNodes;if(grandchildren.length>=1&&grandchildren.length<=3){var grandchild;switch(grandchildren.length){case 1:grandchild=grandchildren[0];break;case 2:var c1=grandchildren[0];var c2=grandchildren[1];grandchild=(c1.nodeType==3||c1.nodeType==4)?c1:c2;break;case 3:default:grandchild=grandchildren[1];break}
if(grandchild.nodeType==3||grandchild.nodeType==4){var name=(child.prefix)?child.nodeName.split(":")[1]:child.nodeName;var value=OpenLayers.Util.getXmlNodeValue(grandchild);if(value){value=value.replace(this.regExes.trimSpace,"");attributes[name]=value}}}}}
return attributes},parseExtendedData:function(node){var attributes={};var i,len,data,key;var dataNodes=node.getElementsByTagName("Data");for(i=0,len=dataNodes.length;i<len;i++){data=dataNodes[i];key=data.getAttribute("name");var ed={};var valueNode=data.getElementsByTagName("value");if(valueNode.length)
ed.value=this.getChildValue(valueNode[0]);if(this.kvpAttributes)
attributes[key]=ed.value;else{var nameNode=data.getElementsByTagName("displayName");if(nameNode.length)
ed.displayName=this.getChildValue(nameNode[0]);attributes[key]=ed}}
var simpleDataNodes=node.getElementsByTagName("SimpleData");for(i=0,len=simpleDataNodes.length;i<len;i++){var ed={};data=simpleDataNodes[i];key=data.getAttribute("name");ed.value=this.getChildValue(data);if(this.kvpAttributes)
attributes[key]=ed.value;else{ed.displayName=key;attributes[key]=ed}}
return attributes},parseProperty:function(xmlNode,namespace,tagName){var value;var nodeList=this.getElementsByTagNameNS(xmlNode,namespace,tagName);try{value=OpenLayers.Util.getXmlNodeValue(nodeList[0])}catch(e){value=null}
return value},write:function(features){if(!(OpenLayers.Util.isArray(features)))
features=[features];var kml=this.createElementNS(this.kmlns,"kml");var folder=this.createFolderXML();for(var i=0,len=features.length;i<len;++i){folder.appendChild(this.createPlacemarkXML(features[i]))}
kml.appendChild(folder);return OpenLayers.Format.XML.prototype.write.apply(this,[kml])},createFolderXML:function(){var folder=this.createElementNS(this.kmlns,"Folder");if(this.foldersName){var folderName=this.createElementNS(this.kmlns,"name");var folderNameText=this.createTextNode(this.foldersName);folderName.appendChild(folderNameText);folder.appendChild(folderName)}
if(this.foldersDesc){var folderDesc=this.createElementNS(this.kmlns,"description");var folderDescText=this.createTextNode(this.foldersDesc);folderDesc.appendChild(folderDescText);folder.appendChild(folderDesc)}
return folder},createPlacemarkXML:function(feature){var placemarkName=this.createElementNS(this.kmlns,"name");var label=(feature.style&&feature.style.label)?feature.style.label:feature.id;var name=feature.attributes.name||label;placemarkName.appendChild(this.createTextNode(name));var placemarkDesc=this.createElementNS(this.kmlns,"description");var desc=feature.attributes.description||this.placemarksDesc;placemarkDesc.appendChild(this.createTextNode(desc));var placemarkNode=this.createElementNS(this.kmlns,"Placemark");if(feature.fid!=null)
placemarkNode.setAttribute("id",feature.fid);placemarkNode.appendChild(placemarkName);placemarkNode.appendChild(placemarkDesc);var geometryNode=this.buildGeometryNode(feature.geometry);placemarkNode.appendChild(geometryNode);if(feature.attributes){var edNode=this.buildExtendedData(feature.attributes);if(edNode)
placemarkNode.appendChild(edNode)}
return placemarkNode},buildGeometryNode:function(geometry){var className=geometry.CLASS_NAME;var type=className.substring(className.lastIndexOf(".")+1);var builder=this.buildGeometry[type.toLowerCase()];var node=null;if(builder)
node=builder.apply(this,[geometry]);return node},buildGeometry:{point:function(geometry){var kml=this.createElementNS(this.kmlns,"Point");kml.appendChild(this.buildCoordinatesNode(geometry));return kml},multipoint:function(geometry){return this.buildGeometry.collection.apply(this,[geometry])},linestring:function(geometry){var kml=this.createElementNS(this.kmlns,"LineString");kml.appendChild(this.buildCoordinatesNode(geometry));return kml},multilinestring:function(geometry){return this.buildGeometry.collection.apply(this,[geometry])},linearring:function(geometry){var kml=this.createElementNS(this.kmlns,"LinearRing");kml.appendChild(this.buildCoordinatesNode(geometry));return kml},polygon:function(geometry){var kml=this.createElementNS(this.kmlns,"Polygon");var rings=geometry.components;var ringMember,ringGeom,type;for(var i=0,len=rings.length;i<len;++i){type=(i==0)?"outerBoundaryIs":"innerBoundaryIs";ringMember=this.createElementNS(this.kmlns,type);ringGeom=this.buildGeometry.linearring.apply(this,[rings[i]]);ringMember.appendChild(ringGeom);kml.appendChild(ringMember)}
return kml},multipolygon:function(geometry){return this.buildGeometry.collection.apply(this,[geometry])},collection:function(geometry){var kml=this.createElementNS(this.kmlns,"MultiGeometry");var child;for(var i=0,len=geometry.components.length;i<len;++i){child=this.buildGeometryNode.apply(this,[geometry.components[i]]);if(child)
kml.appendChild(child)}
return kml}},buildCoordinatesNode:function(geometry){var coordinatesNode=this.createElementNS(this.kmlns,"coordinates");var path;var points=geometry.components;if(points){var point;var numPoints=points.length;var parts=new Array(numPoints);for(var i=0;i<numPoints;++i){point=points[i];parts[i]=this.buildCoordinates(point)}
path=parts.join(" ")}else{path=this.buildCoordinates(geometry)}
var txtNode=this.createTextNode(path);coordinatesNode.appendChild(txtNode);return coordinatesNode},buildCoordinates:function(point){if(this.internalProjection&&this.externalProjection){point=point.clone();point.transform(this.internalProjection,this.externalProjection)}
return point.x+","+point.y},buildExtendedData:function(attributes){var extendedData=this.createElementNS(this.kmlns,"ExtendedData");for(var attributeName in attributes){if(attributes[attributeName]&&attributeName!="name"&&attributeName!="description"&&attributeName!="styleUrl"){var data=this.createElementNS(this.kmlns,"Data");data.setAttribute("name",attributeName);var value=this.createElementNS(this.kmlns,"value");if(typeof attributes[attributeName]=="object"){if(attributes[attributeName].value){value.appendChild(this.createTextNode(attributes[attributeName].value))}
if(attributes[attributeName].displayName){var displayName=this.createElementNS(this.kmlns,"displayName");displayName.appendChild(this.getXMLDoc().createCDATASection(attributes[attributeName].displayName));data.appendChild(displayName)}}else value.appendChild(this.createTextNode(attributes[attributeName]));data.appendChild(value);extendedData.appendChild(data)}}
if(this.isSimpleContent(extendedData))
return null;else return extendedData},changeImageColor:function(img,r,g,b){function rgbToHsl(r,g,b){r/=255;g/=255;b/=255;let max=Math.max(r,g,b),min=Math.min(r,g,b);let h,s,l=(max+min)/2;if(max==min)
h=s=0;else{let d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break}
h/=6}
return({h:h,s:s,l:l,})};let canvas=document.createElement('canvas');let ctx=canvas.getContext("2d");ctx.drawImage(img,0,0);let imgData=ctx.getImageData(0,0,32,32);let data=imgData.data;for(var i=0;i<data.length;i+=4){let red=data[i+0];let green=data[i+1];let blue=data[i+2];let alpha=data[i+3];if(alpha<10)
continue;let hsl=rgbToHsl(red,green,blue);let hue=hsl.h*360;if(hue<20){data[i+0]=r;data[i+1]=g;data[i+2]=b}}
let mycanvas=document.createElement('canvas');$(mycanvas).attr('width',32);$(mycanvas).attr('height',32);let newctx=mycanvas.getContext('2d');newctx.putImageData(imgData,0,0);return mycanvas.toDataURL()},CLASS_NAME:"OpenLayers.Format.KML"})
        }
    }

 bootstrap();
})();
