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
 * coming from an external source, don't use this function, as the HTML code
 * could execute harmful JavaScript code!
 *
 * @param {String} html HTML string to be parsed
 * @return {HTMLCollection} Static list of the parsed DOM nodes
 */
export function parseHtml(html) {
    let element = document.createElement("template");
    element.innerHTML = html;
    return element.content.children;
}

/**
 * Copy all attribute values from the source element to the destination
 * elements.
 *
 * @param {DOMElement} srcElement Source element
 * @param {DOMElement} dstElement Destination element
 */
export function copyAttributes(srcElement, dstElement) {
    for (let i = 0; i < srcElement.attributes.length; i++) {
        let attribute = srcElement.attributes[i];

        if (attribute.name.toLowerCase() === "class") {
            // Special treatment for class attribute
            for (let classname of attribute.value.split(" ")) {
                dstElement.classList.add(classname);
            }
        } else {
            // All other attributes can simply be overwritten
            dstElement.setAttribute(attribute.name, attribute.value);
        }
    }
}

/**
 * Moves all child nodes from one parent element to another, without
 * copying them.
 *
 * @param {DOMElement} srcElement Source element
 * @param {DOMElement} dstElement Destination element
 */
export function moveChildNodes(srcElement, dstElement) {
    let len = srcElement.childNodes.length;

    for (let i = 0; i < len; i++) {
        dstElement.append(srcElement.childNodes[0]);
    }
}

export default {
    parseHtml,
    copyAttributes,
    moveChildNodes,
}
