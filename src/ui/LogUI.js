import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LogTypes } from "../Logging";
/**
 * <h3>Отрисовка лог панели.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @returns {JSX.Element | null} Поле для вывода логов.
 * @constructor
 */
export var DrawLogData = function (data) {
    if (data.props.G.log) {
        var loggingData = [];
        for (var i = data.props.G.logData.length - 1; i >= 0; i--) {
            if (data.props.G.logData[i].type === LogTypes.PRIVATE) {
                loggingData.push(_jsx("li", __assign({ className: "text-red-500" }, { children: data.props.G.logData[i].value }), "Log ".concat(i)));
            }
            else if (data.props.G.logData[i].type === LogTypes.GAME) {
                loggingData.push(_jsx("li", __assign({ className: "text-blue-500" }, { children: data.props.G.logData[i].value }), "Log ".concat(i)));
            }
            else if (data.props.G.logData[i].type === LogTypes.PUBLIC) {
                loggingData.push(_jsx("li", __assign({ className: "text-green-500" }, { children: data.props.G.logData[i].value }), "Log ".concat(i)));
            }
        }
        return (_jsxs("div", __assign({ className: "log ml-3 w-1/4 border overflow-y-auto" }, { children: [_jsx("h3", { children: "Log data:" }, void 0), _jsx("ul", __assign({ className: "list-none p-0 ml-5" }, { children: loggingData }), void 0)] }), void 0));
    }
    else {
        return null;
    }
};
