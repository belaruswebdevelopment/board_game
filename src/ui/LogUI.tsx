import { BoardProps } from "boardgame.io/react";
import { LogTypes } from "../typescript/enums";
import { MyGameState } from "../typescript/game_data_interfaces";

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
export const DrawLogData = (data: BoardProps<MyGameState>): JSX.Element | null => {
    if (data.G.log) {
        const loggingData: JSX.Element[] = [];
        for (let i: number = data.G.logData.length - 1; i >= 0; i--) {
            if (data.G.logData[i].type === LogTypes.PRIVATE) {
                loggingData.push(
                    <li key={`Log ${i}`} className="text-black">
                        {data.G.logData[i].value}
                    </li>
                );
            } else if (data.G.logData[i].type === LogTypes.GAME) {
                loggingData.push(
                    <li key={`Log ${i}`} className="text-blue-500">
                        {data.G.logData[i].value}
                    </li>
                );
            } else if (data.G.logData[i].type === LogTypes.PUBLIC) {
                loggingData.push(
                    <li key={`Log ${i}`} className="text-green-500">
                        {data.G.logData[i].value}
                    </li>
                );
            } else if (data.G.logData[i].type === LogTypes.ERROR) {
                loggingData.push(
                    <li key={`Log ${i}`} className="text-red-500">
                        {data.G.logData[i].value}
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
