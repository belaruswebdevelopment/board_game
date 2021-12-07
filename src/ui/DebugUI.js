var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * <h3>Собирает данные в объект для отрисовки дебаг информации.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в отрисовке дебаг панели.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @returns {{ctx: {}, G: {}} | undefined} Данные для отрисовки дебаг информации.
 * @constructor
 */
var GetDebugData = function (data) {
    if (data.props.G.debug) {
        var debugData = {
            G: {},
            ctx: {},
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
 * @param {{[p: string]: any}} obj Информация.
 * @returns {JSX.Element}
 * @constructor
 */
var DrawObjectData = function (obj) {
    var values = [];
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value instanceof Object) {
            var data = DrawObjectData(value);
            if (Array.isArray(value)) {
                values.push(_jsx("li", { children: _jsxs("details", { children: [_jsxs("summary", { children: [_jsxs("b", { children: [_jsx("span", __assign({ className: "text-pink-500" }, { children: key }), void 0), ": "] }, void 0), _jsxs("i", { children: ["Array(", value.length, ")"] }, void 0)] }, void 0), _jsx("ul", __assign({ className: "list-none p-0 ml-5" }, { children: data }), void 0)] }, void 0) }, key));
            }
            else {
                values.push(_jsx("li", { children: _jsxs("details", { children: [_jsxs("summary", { children: [_jsxs("b", { children: [_jsx("span", __assign({ className: "text-pink-500" }, { children: key }), void 0), ": "] }, void 0), _jsx("i", { children: "Object" }, void 0)] }, void 0), _jsx("ul", __assign({ className: "list-none p-0 ml-5" }, { children: data }), void 0)] }, void 0) }, key));
            }
        }
        else {
            values.push(_jsxs("li", { children: [_jsxs("b", { children: [_jsx("span", __assign({ className: "text-pink-500" }, { children: key }), void 0), ":"] }, void 0), " ", _jsx("span", __assign({ className: "text-purple-500" }, { children: value }), void 0)] }, key));
        }
    }
    return (_jsx("div", { children: _jsx("ul", __assign({ className: "list-none p-0 ml-5" }, { children: values }), void 0) }, void 0));
};
/**
 * <h3>Отрисовка дебаг панели.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @returns {JSX.Element | null} Дебаг панель.
 * @constructor
 */
export var DrawDebugData = function (data) {
    var debugData = GetDebugData(data);
    if (debugData === undefined) {
        return null;
    }
    else {
        return (_jsxs("div", { children: [_jsx("h3", { children: "Debug info data:" }, void 0), DrawObjectData(debugData)] }, void 0));
    }
};
