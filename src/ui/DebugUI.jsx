"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawDebugData = void 0;
var react_1 = require("react");
/**
 * <h3>Собирает данные в объект для отрисовки дебаг информации.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в отрисовке дебаг панели.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns {{ctx: {}, G: {}}|undefined}
 * @constructor
 */
var GetDebugData = function (data) {
    if (data.props.G.debug) {
        var debugData = {
            G: {},
            ctx: {},
        };
        for (var _i = 0, _a = Object.entries(data.props.G); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            debugData.G[key] = value;
        }
        for (var _c = 0, _d = Object.entries(data.props.ctx); _c < _d.length; _c++) {
            var _e = _d[_c], key = _e[0], value = _e[1];
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
 * @param obj Информация.
 * @returns {JSX.Element}
 * @constructor
 */
var DrawObjectData = function (obj) {
    var values = [];
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value instanceof Object) {
            var data = DrawObjectData(value);
            if (Array.isArray(value)) {
                values.push(<li key={key}>
                        <details>
                            <summary><b><span className="text-pink-500">{key}</span>: </b><i>Array({value.length})</i>
                            </summary>
                            <ul className="list-none p-0 ml-5">
                                {data}
                            </ul>
                        </details>
                    </li>);
            }
            else {
                values.push(<li key={key}>
                        <details>
                            <summary><b><span className="text-pink-500">{key}</span>: </b><i>Object</i></summary>
                            <ul className="list-none p-0 ml-5">
                                {data}
                            </ul>
                        </details>
                    </li>);
            }
        }
        else {
            values.push(<li key={key}>
                    <b><span className="text-pink-500">{key}</span>:</b> <span className="text-purple-500">{value}</span>
                </li>);
        }
    }
    return (<div>
            <ul className="list-none p-0 ml-5">
                {values}
            </ul>
        </div>);
};
/**
 * <h3>Отрисовка дебаг панели.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns {JSX.Element|null}
 * @constructor
 */
var DrawDebugData = function (data) {
    var debugData = GetDebugData(data);
    if (debugData === undefined) {
        return null;
    }
    else {
        return (<div>
                <h3>Debug info data:</h3>
                {DrawObjectData(debugData)}
            </div>);
    }
};
exports.DrawDebugData = DrawDebugData;
