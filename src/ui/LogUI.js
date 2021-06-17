import React from "react";

/**
 * Отрисовка лог панели.
 * Применения:
 * 1) Отрисовка игрового поля.
 *
 * @param data Глобальные параметры.
 * @returns {JSX.Element|null}
 * @constructor
 */
export const DrawLogData = (data) => {
    if (data.log) {
        const logData = [];
        for (let i = 0; i < data.logData; i++) {
            if (logData[i].type === "private") {
                logData.push(
                    <li key={`Log ${i}`} className="text-red-500">
                        {logData[i].value}
                    </li>
                );
            } else if (logData[i].type === "game") {
                logData.push(
                    <li key={`Log ${i}`} className="text-blue-500">
                        {logData[i].value}
                    </li>
                );
            } else if (logData[i].type === "public") {
                logData.push(
                    <li key={`Log ${i}`} className="text-blue-500">
                        {logData[i].value}
                    </li>
                );
            }
        }
        return (
            <div>
                <h3>Log data:</h3>
                <ul className="list-none p-0 ml-5">
                    {logData}
                </ul>
            </div>
        );
    } else {
        return null;
    }
};
