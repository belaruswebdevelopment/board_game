import { INumberValues } from "./object_values_interfaces";

/**
 * <h3>Интерфейс опций для создания монет.</h3>
 */
export interface IBuildCoinsOptions {
    readonly isInitial: boolean,
    readonly isTriggerTrading: boolean,
    readonly players?: number,
    readonly count?: ICoin[],
}

/**
 * <h3>Интерфейс для монеты.</h3>
 */
export interface ICoin {
    readonly value: number,
    readonly isInitial: boolean,
    readonly isTriggerTrading: boolean,
}

/**
 * <h3>Интерфейс для создания монеты.</h3>
 */
export interface ICreateCoin {
    readonly value: number,
    readonly isInitial?: boolean,
    readonly isTriggerTrading?: boolean,
}

/**
 * <h3>Интерфейс для конфига базовых монет.</h3>
 */
export interface IInitialTradingCoinConfig {
    readonly value: number,
    readonly isTriggerTrading: boolean,
}

/**
 * <h3>Интерфейс для конфига монет рынка.</h3>
 */
export interface IMarketCoinConfig {
    readonly value: number,
    readonly count: () => INumberValues,
}
