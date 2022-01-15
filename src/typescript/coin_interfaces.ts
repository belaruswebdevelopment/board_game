import { INumberValues } from "./object_values_interfaces";

/**
 * <h3>Интерфейс опций для создания монет.</h3>
 */
export interface IBuildCoinsOptions {
    isInitial: boolean,
    isTriggerTrading: boolean,
    players?: number,
    count?: ICoin[],
}

/**
 * <h3>Интерфейс для монеты.</h3>
 */
export interface ICoin {
    value: number,
    isInitial: boolean,
    isTriggerTrading: boolean,
}

/**
 * <h3>Интерфейс для создания монеты.</h3>
 */
export interface ICreateCoin {
    value: number,
    isInitial?: boolean,
    isTriggerTrading?: boolean,
}

/**
 * <h3>Интерфейс для конфига базовых монет.</h3>
 */
export interface IInitialTradingCoinConfig {
    value: number,
    isTriggerTrading: boolean,
}

/**
 * <h3>Интерфейс для конфига монет рынка.</h3>
 */
export interface IMarketCoinConfig {
    value: number,
    count: () => INumberValues,
}
