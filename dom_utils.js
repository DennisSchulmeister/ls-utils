/*
 * ls-utils (https://www.wpvs.de)
 * © 2017 – 2022 Dennis Schulmeister-Zimolong <dennis@pingu-mail.de>
 * Licensed under the 2-Clause BSD License.
 */
"use strict";

/**
 * Replacement for jQuery's parseHtml function. Takes a html string as input
 * and returns a NodeList of the parsed DOM nodes. For this a temporary dummy
 * element whose `innerHTML` is set is used.
 *
 * Note, that this function only works browser-side. Also note, that only
 * trusted content should be used with this function. If the HTML code is
 * comming from an external source, don't use this function, as the HTML code
 * could execute harmful JavaScript code!
 *
 * @param {String} html HTML string to be parsed
 * @return {NodeList} Static list of the parsed DOM nodes
 */
export function parseHtml(html) {
    let element = document.createElement("div");
    element.innerHTML = html;
    return element.querySelectorAll(":scope > *");
}

export default {
    parseHtml,
}
