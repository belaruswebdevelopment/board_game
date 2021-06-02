import React from "react";

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
