"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@mui+utils@6.4.8_@types+react@19.0.4_react@19.0.0";
exports.ids = ["vendor-chunks/@mui+utils@6.4.8_@types+react@19.0.4_react@19.0.0"];
exports.modules = {

/***/ "(ssr)/../../node_modules/.pnpm/@mui+utils@6.4.8_@types+react@19.0.4_react@19.0.0/node_modules/@mui/utils/esm/exactProp/exactProp.js":
/*!*************************************************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/@mui+utils@6.4.8_@types+react@19.0.4_react@19.0.0/node_modules/@mui/utils/esm/exactProp/exactProp.js ***!
  \*************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ exactProp)\n/* harmony export */ });\n// This module is based on https://github.com/airbnb/prop-types-exact repository.\n// However, in order to reduce the number of dependencies and to remove some extra safe checks\n// the module was forked.\n\nconst specialProperty = 'exact-prop: \\u200b';\nfunction exactProp(propTypes) {\n  if (false) {}\n  return {\n    ...propTypes,\n    [specialProperty]: props => {\n      const unsupportedProps = Object.keys(props).filter(prop => !propTypes.hasOwnProperty(prop));\n      if (unsupportedProps.length > 0) {\n        return new Error(`The following props are not supported: ${unsupportedProps.map(prop => `\\`${prop}\\``).join(', ')}. Please remove them.`);\n      }\n      return null;\n    }\n  };\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BtdWkrdXRpbHNANi40LjhfQHR5cGVzK3JlYWN0QDE5LjAuNF9yZWFjdEAxOS4wLjAvbm9kZV9tb2R1bGVzL0BtdWkvdXRpbHMvZXNtL2V4YWN0UHJvcC9leGFjdFByb3AuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNlO0FBQ2YsTUFBTSxLQUFxQyxFQUFFLEVBRTFDO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUFtRSxrQ0FBa0MsS0FBSyxnQkFBZ0I7QUFDMUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxpbmZvXFxEZXNrdG9wXFxib3RcXFB5cm9cXG5vZGVfbW9kdWxlc1xcLnBucG1cXEBtdWkrdXRpbHNANi40LjhfQHR5cGVzK3JlYWN0QDE5LjAuNF9yZWFjdEAxOS4wLjBcXG5vZGVfbW9kdWxlc1xcQG11aVxcdXRpbHNcXGVzbVxcZXhhY3RQcm9wXFxleGFjdFByb3AuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBtb2R1bGUgaXMgYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wcm9wLXR5cGVzLWV4YWN0IHJlcG9zaXRvcnkuXG4vLyBIb3dldmVyLCBpbiBvcmRlciB0byByZWR1Y2UgdGhlIG51bWJlciBvZiBkZXBlbmRlbmNpZXMgYW5kIHRvIHJlbW92ZSBzb21lIGV4dHJhIHNhZmUgY2hlY2tzXG4vLyB0aGUgbW9kdWxlIHdhcyBmb3JrZWQuXG5cbmNvbnN0IHNwZWNpYWxQcm9wZXJ0eSA9ICdleGFjdC1wcm9wOiBcXHUyMDBiJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGV4YWN0UHJvcChwcm9wVHlwZXMpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgICByZXR1cm4gcHJvcFR5cGVzO1xuICB9XG4gIHJldHVybiB7XG4gICAgLi4ucHJvcFR5cGVzLFxuICAgIFtzcGVjaWFsUHJvcGVydHldOiBwcm9wcyA9PiB7XG4gICAgICBjb25zdCB1bnN1cHBvcnRlZFByb3BzID0gT2JqZWN0LmtleXMocHJvcHMpLmZpbHRlcihwcm9wID0+ICFwcm9wVHlwZXMuaGFzT3duUHJvcGVydHkocHJvcCkpO1xuICAgICAgaWYgKHVuc3VwcG9ydGVkUHJvcHMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKGBUaGUgZm9sbG93aW5nIHByb3BzIGFyZSBub3Qgc3VwcG9ydGVkOiAke3Vuc3VwcG9ydGVkUHJvcHMubWFwKHByb3AgPT4gYFxcYCR7cHJvcH1cXGBgKS5qb2luKCcsICcpfS4gUGxlYXNlIHJlbW92ZSB0aGVtLmApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xufSJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/.pnpm/@mui+utils@6.4.8_@types+react@19.0.4_react@19.0.0/node_modules/@mui/utils/esm/exactProp/exactProp.js\n");

/***/ })

};
;