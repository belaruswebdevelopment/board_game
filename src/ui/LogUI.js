import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LogTypes } from "../typescript/enums";
/**
 * <h3>Отрисовка лог панели.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @returns Поле для вывода логов.
 */
export const DrawLogData = (G) => {
    if (G.log) {
        const loggingData = [];
        for (let i = G.logData.length - 1; i >= 0; i--) {
            const log = G.logData[i];
            if (log !== undefined) {
                if (log.type === LogTypes.Private) {
                    loggingData.push(_jsx("li", { className: "text-black", children: log.value }, `Log ${i}`));
                }
                else if (log.type === LogTypes.Game) {
                    loggingData.push(_jsx("li", { className: "text-blue-500", children: log.value }, `Log ${i}`));
                }
                else if (log.type === LogTypes.Public) {
                    loggingData.push(_jsx("li", { className: "text-green-500", children: log.value }, `Log ${i}`));
                }
                else {
                    throw new Error(`Попытка отобразить недопустимый тип логов '${log.type}'.`);
                }
            }
        }
        return (_jsxs("div", { className: "log ml-3 w-1/4 border overflow-y-auto", children: [_jsx("h3", { children: "Log data:" }), _jsx("ul", { className: "list-none p-0 ml-5", children: loggingData })] }));
    }
    else {
        return null;
    }
};
//# sourceMappingURL=LogUI.js.map