import React from "react";

/**
 * СОбирает данные в объект для отрисовки дебаг информации.
 * Применения:
 * 1) Используется в отрисовке дебаг панели.
 *
 * @param data Глобальные параметры.
 * @returns {{ctx: {}, G: {}}|null}
 * @constructor
 */
const GetDebugData = (data) => {
    if (data.props.G.debug) {
        const debugData = {
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
    return null;
};

/**
 * Отрисовка информации в дебаг панели.
 * Применения:
 * 1) Отрисовка игрового поля.
 *
 * @param obj Информация.
 * @returns {JSX.Element}
 * @constructor
 */
const DrawObjectData = (obj) => {
    const values = [];
    for (let [key, value] of Object.entries(obj)) {
        if (value instanceof Object) {
            const data = DrawObjectData(value);
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
 * Отрисовка дебаг панели.
 * Применения:
 * 1) Отрисовка игрового поля.
 *
 * @param data Глобальные параметры.
 * @returns {JSX.Element|null}
 * @constructor
 */
export const DrawDebugData = (data) => {
    const debugData = GetDebugData(data);
    if (debugData === null) {
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
