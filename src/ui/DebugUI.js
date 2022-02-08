import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * <h3>Отрисовка дебаг панели.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Дебаг панель.
 */
export const DrawDebugData = (data) => {
    const debugData = GetDebugData(data);
    if (debugData === undefined) {
        return null;
    }
    else {
        return (_jsxs("div", { children: [_jsx("h3", { children: "Debug info data:" }, void 0), DrawObjectData(debugData)] }, void 0));
    }
};
/**
 * <h3>Отрисовка информации в дебаг панели.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param obj Информация.
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DrawObjectData = (obj) => {
    const values = [];
    for (const [key, value] of Object.entries(obj)) {
        if (value instanceof Object) {
            const data = DrawObjectData(value);
            if (Array.isArray(value)) {
                values.push(_jsx("li", { children: _jsxs("details", { children: [_jsxs("summary", { children: [_jsxs("b", { children: [_jsx("span", { className: "text-pink-500", children: key }, void 0), ": "] }, void 0), _jsxs("i", { children: ["Array(", value.length, ")"] }, void 0)] }, void 0), _jsx("ul", { className: "list-none p-0 ml-5", children: data }, void 0)] }, void 0) }, key));
            }
            else {
                values.push(_jsx("li", { children: _jsxs("details", { children: [_jsxs("summary", { children: [_jsxs("b", { children: [_jsx("span", { className: "text-pink-500", children: key }, void 0), ": "] }, void 0), _jsx("i", { children: "Object" }, void 0)] }, void 0), _jsx("ul", { className: "list-none p-0 ml-5", children: data }, void 0)] }, void 0) }, key));
            }
        }
        else {
            values.push(_jsxs("li", { children: [_jsxs("b", { children: [_jsx("span", { className: "text-pink-500", children: key }, void 0), ":"] }, void 0), " ", _jsx("span", { className: "text-purple-500", children: value }, void 0)] }, key));
        }
    }
    return (_jsx("div", { children: _jsx("ul", { className: "list-none p-0 ml-5", children: values }, void 0) }, void 0));
};
/**
 * <h3>Собирает данные в объект для отрисовки дебаг информации.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в отображении дебаг панели.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Данные для отрисовки дебаг информации.
 */
const GetDebugData = (data) => {
    if (data.G.debug) {
        const debugData = {
            G: {},
            ctx: {},
        };
        for (const [key, value] of Object.entries(data.G)) {
            debugData.G[key] = value;
        }
        for (const [key, value] of Object.entries(data.ctx)) {
            debugData.ctx[key] = value;
        }
        return debugData;
    }
    return undefined;
};
//# sourceMappingURL=DebugUI.js.map