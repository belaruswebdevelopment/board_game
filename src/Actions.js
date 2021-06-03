import {UpgradeCoin} from "./Coin";

export const ActionDispatcher = (data, ...args) => {
    let action;
    switch (data.actionName) {
        case "UpgradeCoinAction":
            action = UpgradeCoinAction;
            break;
        default:
            action = null;
    }
    return action?.(data.config, ...args);
}

export const UpgradeCoinAction = (config, ...args) => {
    UpgradeCoin(config, ...args);
}
