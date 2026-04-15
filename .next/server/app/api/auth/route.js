"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/route";
exports.ids = ["app/api/auth/route"];
exports.modules = {

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Froute&page=%2Fapi%2Fauth%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Froute&page=%2Fapi%2Fauth%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_runner_workspace_app_api_auth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/route.ts */ \"(rsc)/./app/api/auth/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/route\",\n        pathname: \"/api/auth\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/route\"\n    },\n    resolvedPagePath: \"/home/runner/workspace/app/api/auth/route.ts\",\n    nextConfigOutput,\n    userland: _home_runner_workspace_app_api_auth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhdXRoJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYXV0aCUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNKO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmF1bHRhcHAvP2ExMTUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcHAvYXBpL2F1dGgvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hdXRoXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcHAvYXBpL2F1dGgvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2F1dGgvcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Froute&page=%2Fapi%2Fauth%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/route.ts":
/*!*******************************!*\
  !*** ./app/api/auth/route.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\nasync function POST(req) {\n    const { password } = await req.json();\n    if (!password || password !== (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.getVaultPassword)()) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            ok: false,\n            error: \"Invalid password\"\n        }, {\n            status: 401\n        });\n    }\n    const res = next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        ok: true\n    });\n    res.cookies.set(_lib_auth__WEBPACK_IMPORTED_MODULE_1__.sessionCookieName, (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.createSessionToken)(), {\n        httpOnly: true,\n        secure: \"development\" === \"production\",\n        sameSite: \"lax\",\n        path: \"/\",\n        maxAge: 60 * 60 * 24 * 30\n    });\n    return res;\n}\nasync function DELETE() {\n    const res = next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        ok: true\n    });\n    res.cookies.set(_lib_auth__WEBPACK_IMPORTED_MODULE_1__.sessionCookieName, \"\", {\n        httpOnly: true,\n        path: \"/\",\n        maxAge: 0\n    });\n    return res;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUEyQztBQUMwQztBQUU5RSxlQUFlSSxLQUFLQyxHQUFZO0lBQ3JDLE1BQU0sRUFBRUMsUUFBUSxFQUFFLEdBQUcsTUFBTUQsSUFBSUUsSUFBSTtJQUNuQyxJQUFJLENBQUNELFlBQVlBLGFBQWFKLDJEQUFnQkEsSUFBSTtRQUNoRCxPQUFPRixxREFBWUEsQ0FBQ08sSUFBSSxDQUFDO1lBQUVDLElBQUk7WUFBT0MsT0FBTztRQUFtQixHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUNuRjtJQUNBLE1BQU1DLE1BQU1YLHFEQUFZQSxDQUFDTyxJQUFJLENBQUM7UUFBRUMsSUFBSTtJQUFLO0lBQ3pDRyxJQUFJQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ1Ysd0RBQWlCQSxFQUFFRiw2REFBa0JBLElBQUk7UUFDdkRhLFVBQVU7UUFDVkMsUUFBUUMsa0JBQXlCO1FBQ2pDQyxVQUFVO1FBQ1ZDLE1BQU07UUFDTkMsUUFBUSxLQUFLLEtBQUssS0FBSztJQUN6QjtJQUNBLE9BQU9SO0FBQ1Q7QUFFTyxlQUFlUztJQUNwQixNQUFNVCxNQUFNWCxxREFBWUEsQ0FBQ08sSUFBSSxDQUFDO1FBQUVDLElBQUk7SUFBSztJQUN6Q0csSUFBSUMsT0FBTyxDQUFDQyxHQUFHLENBQUNWLHdEQUFpQkEsRUFBRSxJQUFJO1FBQUVXLFVBQVU7UUFBTUksTUFBTTtRQUFLQyxRQUFRO0lBQUU7SUFDOUUsT0FBT1I7QUFDVCIsInNvdXJjZXMiOlsid2VicGFjazovL3ZhdWx0YXBwLy4vYXBwL2FwaS9hdXRoL3JvdXRlLnRzPzllYjMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgY3JlYXRlU2Vzc2lvblRva2VuLCBnZXRWYXVsdFBhc3N3b3JkLCBzZXNzaW9uQ29va2llTmFtZSB9IGZyb20gJ0AvbGliL2F1dGgnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXE6IFJlcXVlc3QpIHtcbiAgY29uc3QgeyBwYXNzd29yZCB9ID0gYXdhaXQgcmVxLmpzb24oKTtcbiAgaWYgKCFwYXNzd29yZCB8fCBwYXNzd29yZCAhPT0gZ2V0VmF1bHRQYXNzd29yZCgpKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgb2s6IGZhbHNlLCBlcnJvcjogJ0ludmFsaWQgcGFzc3dvcmQnIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG4gIH1cbiAgY29uc3QgcmVzID0gTmV4dFJlc3BvbnNlLmpzb24oeyBvazogdHJ1ZSB9KTtcbiAgcmVzLmNvb2tpZXMuc2V0KHNlc3Npb25Db29raWVOYW1lLCBjcmVhdGVTZXNzaW9uVG9rZW4oKSwge1xuICAgIGh0dHBPbmx5OiB0cnVlLFxuICAgIHNlY3VyZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyxcbiAgICBzYW1lU2l0ZTogJ2xheCcsXG4gICAgcGF0aDogJy8nLFxuICAgIG1heEFnZTogNjAgKiA2MCAqIDI0ICogMzAsXG4gIH0pO1xuICByZXR1cm4gcmVzO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gREVMRVRFKCkge1xuICBjb25zdCByZXMgPSBOZXh0UmVzcG9uc2UuanNvbih7IG9rOiB0cnVlIH0pO1xuICByZXMuY29va2llcy5zZXQoc2Vzc2lvbkNvb2tpZU5hbWUsICcnLCB7IGh0dHBPbmx5OiB0cnVlLCBwYXRoOiAnLycsIG1heEFnZTogMCB9KTtcbiAgcmV0dXJuIHJlcztcbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJjcmVhdGVTZXNzaW9uVG9rZW4iLCJnZXRWYXVsdFBhc3N3b3JkIiwic2Vzc2lvbkNvb2tpZU5hbWUiLCJQT1NUIiwicmVxIiwicGFzc3dvcmQiLCJqc29uIiwib2siLCJlcnJvciIsInN0YXR1cyIsInJlcyIsImNvb2tpZXMiLCJzZXQiLCJodHRwT25seSIsInNlY3VyZSIsInByb2Nlc3MiLCJzYW1lU2l0ZSIsInBhdGgiLCJtYXhBZ2UiLCJERUxFVEUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createSessionToken: () => (/* binding */ createSessionToken),\n/* harmony export */   getVaultPassword: () => (/* binding */ getVaultPassword),\n/* harmony export */   isAuthenticated: () => (/* binding */ isAuthenticated),\n/* harmony export */   isValidSessionToken: () => (/* binding */ isValidSessionToken),\n/* harmony export */   sessionCookieName: () => (/* binding */ sessionCookieName)\n/* harmony export */ });\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst COOKIE_NAME = \"vault_session\";\nfunction getSecret() {\n    return process.env.VAULT_SESSION_SECRET || \"change-me-in-env\";\n}\nfunction sign(value) {\n    return crypto__WEBPACK_IMPORTED_MODULE_1___default().createHmac(\"sha256\", getSecret()).update(value).digest(\"hex\");\n}\nfunction createSessionToken() {\n    const payload = `${Date.now()}`;\n    return `${payload}.${sign(payload)}`;\n}\nfunction isValidSessionToken(token) {\n    if (!token) return false;\n    const [payload, sig] = token.split(\".\");\n    if (!payload || !sig) return false;\n    return crypto__WEBPACK_IMPORTED_MODULE_1___default().timingSafeEqual(Buffer.from(sig), Buffer.from(sign(payload)));\n}\nfunction getVaultPassword() {\n    return process.env.VAULT_PASSWORD || \"\";\n}\nasync function isAuthenticated() {\n    const token = (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)().get(COOKIE_NAME)?.value;\n    return isValidSessionToken(token);\n}\nconst sessionCookieName = COOKIE_NAME;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUF1QztBQUNYO0FBRTVCLE1BQU1FLGNBQWM7QUFFcEIsU0FBU0M7SUFDUCxPQUFPQyxRQUFRQyxHQUFHLENBQUNDLG9CQUFvQixJQUFJO0FBQzdDO0FBRUEsU0FBU0MsS0FBS0MsS0FBYTtJQUN6QixPQUFPUCx3REFBaUIsQ0FBQyxVQUFVRSxhQUFhTyxNQUFNLENBQUNGLE9BQU9HLE1BQU0sQ0FBQztBQUN2RTtBQUVPLFNBQVNDO0lBQ2QsTUFBTUMsVUFBVSxDQUFDLEVBQUVDLEtBQUtDLEdBQUcsR0FBRyxDQUFDO0lBQy9CLE9BQU8sQ0FBQyxFQUFFRixRQUFRLENBQUMsRUFBRU4sS0FBS00sU0FBUyxDQUFDO0FBQ3RDO0FBRU8sU0FBU0csb0JBQW9CQyxLQUFjO0lBQ2hELElBQUksQ0FBQ0EsT0FBTyxPQUFPO0lBQ25CLE1BQU0sQ0FBQ0osU0FBU0ssSUFBSSxHQUFHRCxNQUFNRSxLQUFLLENBQUM7SUFDbkMsSUFBSSxDQUFDTixXQUFXLENBQUNLLEtBQUssT0FBTztJQUM3QixPQUFPakIsNkRBQXNCLENBQUNvQixPQUFPQyxJQUFJLENBQUNKLE1BQU1HLE9BQU9DLElBQUksQ0FBQ2YsS0FBS007QUFDbkU7QUFFTyxTQUFTVTtJQUNkLE9BQU9uQixRQUFRQyxHQUFHLENBQUNtQixjQUFjLElBQUk7QUFDdkM7QUFFTyxlQUFlQztJQUNwQixNQUFNUixRQUFRakIscURBQU9BLEdBQUcwQixHQUFHLENBQUN4QixjQUFjTTtJQUMxQyxPQUFPUSxvQkFBb0JDO0FBQzdCO0FBRU8sTUFBTVUsb0JBQW9CekIsWUFBWSIsInNvdXJjZXMiOlsid2VicGFjazovL3ZhdWx0YXBwLy4vbGliL2F1dGgudHM/YmY3ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb29raWVzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJztcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcblxuY29uc3QgQ09PS0lFX05BTUUgPSAndmF1bHRfc2Vzc2lvbic7XG5cbmZ1bmN0aW9uIGdldFNlY3JldCgpIHtcbiAgcmV0dXJuIHByb2Nlc3MuZW52LlZBVUxUX1NFU1NJT05fU0VDUkVUIHx8ICdjaGFuZ2UtbWUtaW4tZW52Jztcbn1cblxuZnVuY3Rpb24gc2lnbih2YWx1ZTogc3RyaW5nKSB7XG4gIHJldHVybiBjcnlwdG8uY3JlYXRlSG1hYygnc2hhMjU2JywgZ2V0U2VjcmV0KCkpLnVwZGF0ZSh2YWx1ZSkuZGlnZXN0KCdoZXgnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNlc3Npb25Ub2tlbigpIHtcbiAgY29uc3QgcGF5bG9hZCA9IGAke0RhdGUubm93KCl9YDtcbiAgcmV0dXJuIGAke3BheWxvYWR9LiR7c2lnbihwYXlsb2FkKX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZFNlc3Npb25Ub2tlbih0b2tlbj86IHN0cmluZykge1xuICBpZiAoIXRva2VuKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IFtwYXlsb2FkLCBzaWddID0gdG9rZW4uc3BsaXQoJy4nKTtcbiAgaWYgKCFwYXlsb2FkIHx8ICFzaWcpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIGNyeXB0by50aW1pbmdTYWZlRXF1YWwoQnVmZmVyLmZyb20oc2lnKSwgQnVmZmVyLmZyb20oc2lnbihwYXlsb2FkKSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmF1bHRQYXNzd29yZCgpIHtcbiAgcmV0dXJuIHByb2Nlc3MuZW52LlZBVUxUX1BBU1NXT1JEIHx8ICcnO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNBdXRoZW50aWNhdGVkKCkge1xuICBjb25zdCB0b2tlbiA9IGNvb2tpZXMoKS5nZXQoQ09PS0lFX05BTUUpPy52YWx1ZTtcbiAgcmV0dXJuIGlzVmFsaWRTZXNzaW9uVG9rZW4odG9rZW4pO1xufVxuXG5leHBvcnQgY29uc3Qgc2Vzc2lvbkNvb2tpZU5hbWUgPSBDT09LSUVfTkFNRTtcbiJdLCJuYW1lcyI6WyJjb29raWVzIiwiY3J5cHRvIiwiQ09PS0lFX05BTUUiLCJnZXRTZWNyZXQiLCJwcm9jZXNzIiwiZW52IiwiVkFVTFRfU0VTU0lPTl9TRUNSRVQiLCJzaWduIiwidmFsdWUiLCJjcmVhdGVIbWFjIiwidXBkYXRlIiwiZGlnZXN0IiwiY3JlYXRlU2Vzc2lvblRva2VuIiwicGF5bG9hZCIsIkRhdGUiLCJub3ciLCJpc1ZhbGlkU2Vzc2lvblRva2VuIiwidG9rZW4iLCJzaWciLCJzcGxpdCIsInRpbWluZ1NhZmVFcXVhbCIsIkJ1ZmZlciIsImZyb20iLCJnZXRWYXVsdFBhc3N3b3JkIiwiVkFVTFRfUEFTU1dPUkQiLCJpc0F1dGhlbnRpY2F0ZWQiLCJnZXQiLCJzZXNzaW9uQ29va2llTmFtZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Froute&page=%2Fapi%2Fauth%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();