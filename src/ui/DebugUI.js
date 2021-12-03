"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.DrawDebugData = void 0;
var react_1 = __importDefault(require("react"));
/**
 * <h3>Собирает данные в объект для отрисовки дебаг информации.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в отрисовке дебаг панели.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @constructor
 */
var GetDebugData = function (data) {
    if (data.props.G.debug) {
        var debugData = {
            G: {},
            ctx: {}
        };
        for (var _i = 0, _a = Object.entries(data.props.G); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            debugData.G[key] = value;
        }
        for (var _c = 0, _d = Object.entries(data.props.ctx); _c < _d.length; _c++) {
            var _e = _d[_c], key = _e[0], value = _e[1];
            debugData.ctx[key] = value;
        }
        return debugData;
    }
    return undefined;
};
/**
 * <h3>Отрисовка информации в дебаг панели.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param obj Информация.
 * @constructor
 */
var DrawObjectData = function (obj) {
    var values = [];
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value instanceof Object) {
            var data = DrawObjectData(value);
            if (Array.isArray(value)) {
                values.push(react_1["default"].createElement("li", { key: key },
                    react_1["default"].createElement("details", null,
                        react_1["default"].createElement("summary", null,
                            react_1["default"].createElement("b", null,
                                react_1["default"].createElement("span", { className: "text-pink-500" }, key),
                                ": "),
                            react_1["default"].createElement("i", null,
                                "Array(",
                                value.length,
                                ")")),
                        react_1["default"].createElement("ul", { className: "list-none p-0 ml-5" }, data))));
            }
            else {
                values.push(react_1["default"].createElement("li", { key: key },
                    react_1["default"].createElement("details", null,
                        react_1["default"].createElement("summary", null,
                            react_1["default"].createElement("b", null,
                                react_1["default"].createElement("span", { className: "text-pink-500" }, key),
                                ": "),
                            react_1["default"].createElement("i", null, "Object")),
                        react_1["default"].createElement("ul", { className: "list-none p-0 ml-5" }, data))));
            }
        }
        else {
            values.push(react_1["default"].createElement("li", { key: key },
                react_1["default"].createElement("b", null,
                    react_1["default"].createElement("span", { className: "text-pink-500" }, key),
                    ":"),
                " ",
                react_1["default"].createElement("span", { className: "text-purple-500" }, value)));
        }
    }
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("ul", { className: "list-none p-0 ml-5" }, values)));
};
/**
 * <h3>Отрисовка дебаг панели.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @constructor
 */
var DrawDebugData = function (data) {
    var debugData = GetDebugData(data);
    if (debugData === undefined) {
        return null;
    }
    else {
        return (react_1["default"].createElement("div", null,
            react_1["default"].createElement("h3", null, "Debug info data:"),
            DrawObjectData(debugData)));
    }
};
exports.DrawDebugData = DrawDebugData;
