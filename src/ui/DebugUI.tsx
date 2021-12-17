import { GameBoard } from "../GameBoard";

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
const GetDebugData = (data: GameBoard): { ctx: {}, G: {} } | undefined => {
    if (data.props.G.debug) {
        const debugData: { G: { [key: string]: any }, ctx: { [key: string]: any } } = {
            G: {},
            ctx: {},
        };
        for (let [key, value] of Object.entries(data.props.G)) {
            debugData.G[key] = value;
        }
        for (let [key, value] of Object.entries(data.props.ctx)) {
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
const DrawObjectData = (obj: { [key: string]: any }): JSX.Element => {
    const values: JSX.Element[] = [];
    for (let [key, value] of Object.entries(obj)) {
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
export const DrawDebugData = (data: GameBoard): JSX.Element | null => {
    const debugData: { G: { [key: string]: any }, ctx: { [key: string]: any } } | undefined = GetDebugData(data);
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
