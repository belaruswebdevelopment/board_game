import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import type { IDebugData, IMyGameState } from "../typescript/interfaces";

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
export const DrawDebugData = (data: BoardProps<IMyGameState>): JSX.Element | null => {
    const debugData: IDebugData | undefined = GetDebugData(data);
    if (debugData === undefined) {
        return null;
    } else {
        return (
            <div>
                <h3>Debug info data:</h3>
                {DrawObjectData(debugData)}
            </div>
        );
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
const DrawObjectData = (obj: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any,
}): JSX.Element => {
    const values: JSX.Element[] = [];
    for (const [key, value] of Object.entries(obj)) {
        if (value instanceof Object) {
            const data: JSX.Element = DrawObjectData(value);
            if (Array.isArray(value)) {
                values.push(
                    <li key={key}>
                        <details>
                            <summary><b><span className="text-pink-500">{key}</span>: </b><i>Array({value.length})</i>
                            </summary>
                            <ul className="list-none p-0 ml-5">
                                {data}
                            </ul>
                        </details>
                    </li>
                );
            } else {
                values.push(
                    <li key={key}>
                        <details>
                            <summary><b><span className="text-pink-500">{key}</span>: </b><i>Object</i></summary>
                            <ul className="list-none p-0 ml-5">
                                {data}
                            </ul>
                        </details>
                    </li>
                );
            }
        } else {
            values.push(
                <li key={key}>
                    <b><span className="text-pink-500">{key}</span>:</b> <span
                        className="text-purple-500">{value}</span>
                </li>
            );
        }
    }
    return (
        <div>
            <ul className="list-none p-0 ml-5">
                {values}
            </ul>
        </div>
    );
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
const GetDebugData = (data: BoardProps<IMyGameState>): IDebugData | undefined => {
    if (data.G.debug) {
        const debugData: IDebugData = {
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
