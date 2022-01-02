import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LogTypes } from "../typescript/enums";
/**
 * <h3>Отрисовка лог панели.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле для вывода логов.
 */
export const DrawLogData = (data) => {
    if (data.props.G.log) {
        const loggingData = [];
        for (let i = data.props.G.logData.length - 1; i >= 0; i--) {
            if (data.props.G.logData[i].type === LogTypes.PRIVATE) {
                loggingData.push(_jsx("li", { className: "text-black", children: data.props.G.logData[i].value }, `Log ${i}`));
            }
            else if (data.props.G.logData[i].type === LogTypes.GAME) {
                loggingData.push(_jsx("li", { className: "text-blue-500", children: data.props.G.logData[i].value }, `Log ${i}`));
            }
            else if (data.props.G.logData[i].type === LogTypes.PUBLIC) {
                loggingData.push(_jsx("li", { className: "text-green-500", children: data.props.G.logData[i].value }, `Log ${i}`));
            }
            else if (data.props.G.logData[i].type === LogTypes.ERROR) {
                loggingData.push(_jsx("li", { className: "text-red-500", children: data.props.G.logData[i].value }, `Log ${i}`));
            }
        }
        return (_jsxs("div", { className: "log ml-3 w-1/4 border overflow-y-auto", children: [_jsx("h3", { children: "Log data:" }, void 0), _jsx("ul", { className: "list-none p-0 ml-5", children: loggingData }, void 0)] }, void 0));
    }
    else {
        return null;
    }
};
