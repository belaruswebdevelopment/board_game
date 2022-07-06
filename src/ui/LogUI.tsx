import { LogTypeNames } from "../typescript/enums";
import type { CanBeUndef, ILogData, IMyGameState } from "../typescript/interfaces";

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
export const DrawLogData = (G: IMyGameState): JSX.Element | null => {
    if (G.log) {
        const loggingData: JSX.Element[] = [];
        for (let i: number = G.logData.length - 1; i >= 0; i--) {
            const log: CanBeUndef<ILogData> = G.logData[i];
            if (log !== undefined) {
                if (log.type === LogTypeNames.Private) {
                    loggingData.push(
                        <li key={`Log ${i}`} className="text-black">
                            {log.value}
                        </li>
                    );
                } else if (log.type === LogTypeNames.Game) {
                    loggingData.push(
                        <li key={`Log ${i}`} className="text-blue-500">
                            {log.value}
                        </li>
                    );
                } else if (log.type === LogTypeNames.Public) {
                    loggingData.push(
                        <li key={`Log ${i}`} className="text-green-500">
                            {log.value}
                        </li>
                    );
                } else {
                    throw new Error(`Попытка отобразить недопустимый тип логов '${log.type}'.`);
                }
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
