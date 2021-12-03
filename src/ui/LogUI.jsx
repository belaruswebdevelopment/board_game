"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawLogData = void 0;
var react_1 = require("react");
var Logging_1 = require("../Logging");
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
var DrawLogData = function (data) {
    if (data.props.G.log) {
        var loggingData = [];
        for (var i = data.props.G.logData.length - 1; i >= 0; i--) {
            if (data.props.G.logData[i].type === Logging_1.LogTypes.PRIVATE) {
                loggingData.push(<li key={"Log " + i} className="text-red-500">
                        {data.props.G.logData[i].value}
                    </li>);
            }
            else if (data.props.G.logData[i].type === Logging_1.LogTypes.GAME) {
                loggingData.push(<li key={"Log " + i} className="text-blue-500">
                        {data.props.G.logData[i].value}
                    </li>);
            }
            else if (data.props.G.logData[i].type === Logging_1.LogTypes.PUBLIC) {
                loggingData.push(<li key={"Log " + i} className="text-green-500">
                        {data.props.G.logData[i].value}
                    </li>);
            }
        }
        return (<div className="log ml-3 w-1/4 border overflow-y-auto">
                <h3>Log data:</h3>
                <ul className="list-none p-0 ml-5">
                    {loggingData}
                </ul>
            </div>);
    }
    else {
        return null;
    }
};
exports.DrawLogData = DrawLogData;
