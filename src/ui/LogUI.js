"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.DrawLogData = void 0;
var react_1 = __importDefault(require("react"));
/**
 * <h3>Отрисовка лог панели.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @constructor
 */
var DrawLogData = function (data) {
    if (data.props.G.log) {
        var loggingData = [];
        for (var i = data.props.G.logData.length - 1; i >= 0; i--) {
            if (data.props.G.logData[i].type === "private" /* PRIVATE */) {
                loggingData.push(react_1["default"].createElement("li", { key: "Log ".concat(i), className: "text-red-500" }, data.props.G.logData[i].value));
            }
            else if (data.props.G.logData[i].type === "game" /* GAME */) {
                loggingData.push(react_1["default"].createElement("li", { key: "Log ".concat(i), className: "text-blue-500" }, data.props.G.logData[i].value));
            }
            else if (data.props.G.logData[i].type === "public" /* PUBLIC */) {
                loggingData.push(react_1["default"].createElement("li", { key: "Log ".concat(i), className: "text-green-500" }, data.props.G.logData[i].value));
            }
        }
        return (react_1["default"].createElement("div", { className: "log ml-3 w-1/4 border overflow-y-auto" },
            react_1["default"].createElement("h3", null, "Log data:"),
            react_1["default"].createElement("ul", { className: "list-none p-0 ml-5" }, loggingData)));
    }
    else {
        return null;
    }
};
exports.DrawLogData = DrawLogData;
