import { LogCssClassNames, LogTypeNames } from "../typescript/enums";
import type { CanBeNullType, CanBeUndefType, FnContext, LogData } from "../typescript/interfaces";

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
export const DrawLogData = ({ G }: FnContext): CanBeNullType<JSX.Element> => {
    if (G.log) {
        const loggingData: JSX.Element[] = [];
        for (let i: number = G.logData.length - 1; i >= 0; i--) {
            const log: CanBeUndefType<LogData> = G.logData[i];
            if (log !== undefined) {
                let className: LogCssClassNames,
                    _exhaustiveCheck: never;
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
                loggingData.push(
                    <li key={`Log ${i}`} className={className}>
                        {log.text}
                    </li>
                );
            }
        }
        return (
            <div className="log ml-3 w-1/4 border overflow-y-auto">
                <h3>Log data:</h3>
                <ul className="list-none p-0 ml-5">
                    {loggingData}
                </ul>
            </div>
        );
    } else {
        return null;
    }
};
