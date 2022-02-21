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
 * Normaly, this element will be part of the root document which is fine, if
 * the HTML string is coming from a trusted source. If the string is potentialy
 * untrusted, the second parameter `sandbox` should be set to true, to create
 * a new temporary document to parse the HTML string. This way contained
 * JavaScript code will be sandboxed and may not harmfuly manipulate the root
 * document.
 *
 * Note, that this function only works browser-side.
 *
 * @param  {String} html HTML string to be parsed
 * @param  {Boolean} sandbox Sandox parsing in a temporary document
 * @return {NodeList} Static list of the parsed DOM nodes
 */
export function parseHtml(html, sandbox) {
    let doc = sandox ? document : new Document();
    let element = doc.createElement("div");

    element.innerHTML = html;
    let nodes = element.querySelectorAll("*");

    for (let node of nodes) {
        node.remove();
    }

    return nodes;
}

export default {
    parseHtml,
}
