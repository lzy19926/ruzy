"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = exports.isFunction = void 0;
function isFunction(fn) {
    return typeof fn === 'function';
}
exports.isFunction = isFunction;
function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null)
        return false;
    let proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    // proto = null
    return Object.getPrototypeOf(obj) === proto;
}
exports.isPlainObject = isPlainObject;
