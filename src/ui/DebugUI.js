import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * <h3>Отрисовка дебаг панели.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Дебаг панель.
 */
export const DrawDebugData = (G, ctx) => {
    const debugData = GetDebugData(G, ctx);
    if (debugData === undefined) {
        return null;
    }
    else {
        return (_jsxs("div", { children: [_jsx("h3", { children: "Debug info data:" }), DrawObjectData(debugData)] }));
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
const DrawObjectData = (obj) => {
    const values = [];
    for (const [key, value] of Object.entries(obj)) {
        if (value instanceof Object) {
            const data = DrawObjectData(value);
            if (Array.isArray(value)) {
                values.push(_jsx("li", { children: _jsxs("details", { children: [_jsxs("summary", { children: [_jsxs("b", { children: [_jsx("span", { className: "text-pink-500", children: key }), ": "] }), _jsxs("i", { children: ["Array(", value.length, ")"] })] }), _jsx("ul", { className: "list-none p-0 ml-5", children: data })] }) }, key));
            }
            else {
                values.push(_jsx("li", { children: _jsxs("details", { children: [_jsxs("summary", { children: [_jsxs("b", { children: [_jsx("span", { className: "text-pink-500", children: key }), ": "] }), _jsx("i", { children: "Object" })] }), _jsx("ul", { className: "list-none p-0 ml-5", children: data })] }) }, key));
            }
        }
        else {
            values.push(_jsxs("li", { children: [_jsxs("b", { children: [_jsx("span", { className: "text-pink-500", children: key }), ":"] }), " ", _jsx("span", { className: "text-purple-500", children: value })] }, key));
        }
    }
    return (_jsx("div", { children: _jsx("ul", { className: "list-none p-0 ml-5", children: values }) }));
};
/**
 * <h3>Собирает данные в объект для отрисовки дебаг информации.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в отображении дебаг панели.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Данные для отрисовки дебаг информации.
 */
const GetDebugData = (G, ctx) => {
    if (G.debug) {
        const debugData = {
            G: {},
            ctx: {},
        };
        for (const [key, value] of Object.entries(G)) {
            debugData.G[key] = value;
        }
        for (const [key, value] of Object.entries(ctx)) {
            debugData.ctx[key] = value;
        }
        return debugData;
    }
    return undefined;
};
//# sourceMappingURL=DebugUI.js.map