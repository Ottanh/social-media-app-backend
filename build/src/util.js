"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayRemove = void 0;
const arrayRemove = (element, array) => {
    const copyArr = [...array];
    const index = copyArr.indexOf(element);
    copyArr.splice(index, 1);
    return copyArr;
};
exports.arrayRemove = arrayRemove;
