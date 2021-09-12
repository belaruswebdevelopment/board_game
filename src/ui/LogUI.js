import React from "react";

/**
 * <h3>Отрисовка лог панели.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns {JSX.Element|null}
 * @constructor
 */
export const DrawLogData = (data) => {
    if (data.props.G.log) {
        const loggingData = [];
        for (let i = data.props.G.logData.length - 1; i >= 0; i--) {
            if (data.props.G.logData[i].type === "private") {
                loggingData.push(
                    <li key={`Log ${i}`} className="text-red-500">
                        {data.props.G.logData[i].value}
                    </li>
                );
            } else if (data.props.G.logData[i].type === "game") {
                loggingData.push(
                    <li key={`Log ${i}`} className="text-blue-500">
                        {data.props.G.logData[i].value}
                    </li>
                );
            } else if (data.props.G.logData[i].type === "public") {
                loggingData.push(
                    <li key={`Log ${i}`} className="text-green-500">
                        {data.props.G.logData[i].value}
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
