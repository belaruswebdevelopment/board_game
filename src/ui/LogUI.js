import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LogCssClassNames, LogTypeNames } from "../typescript/enums";
/**
 * <h3>Отрисовка лог панели.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @returns Поле для вывода логов.
 */
export const DrawLogData = ({ G }) => {
    if (G.log) {
        const loggingData = [];
        for (let i = G.logData.length - 1; i >= 0; i--) {
            const log = G.logData[i];
            if (log !== undefined) {
                let className, _exhaustiveCheck;
                switch (log.type) {
                    case LogTypeNames.Private:
                        className = LogCssClassNames.Private;
                        break;
                    case LogTypeNames.Game:
                        className = LogCssClassNames.Game;
                        break;
                    case LogTypeNames.Public:
                        className = LogCssClassNames.Public;
                        break;
                    default:
                        _exhaustiveCheck = log.type;
                        throw new Error(`Попытка отобразить недопустимый тип логов.`);
                        return _exhaustiveCheck;
                }
                loggingData.push(_jsx("li", { className: className, children: log.text }, `Log ${i}`));
            }
        }
        return (_jsxs("div", { className: "log ml-3 w-1/4 border overflow-y-auto", children: [_jsx("h3", { children: "Log data:" }), _jsx("ul", { className: "list-none p-0 ml-5", children: loggingData })] }));
    }
    else {
        return null;
    }
};
//# sourceMappingURL=LogUI.js.map