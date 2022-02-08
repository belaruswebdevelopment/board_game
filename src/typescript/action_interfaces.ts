import { ArgsTypes } from "./types";

/**
 * <h3>Интерфейс для действия.</h3>
 */
export interface IAction {
    name: string,
    params?: ArgsTypes,
}

/**
 * <h3>Интерфейс для конфига у карт.</h3>
 */
export interface IConfig {
    number?: number,
    coinId?: number,
    suit?: string,
    value?: number,
    drawName?: string,
    stageName?: string,
    name?: string,
}

/**
 * <h3>Интерфейс для стэка у карт.</h3>
 */
export interface IStack {
    variants?: IVariants,
    config?: IConfig,
    playerId?: number,
}

/**
 * <h3>Интерфейс для варианта карты героя.</h3>
 */
interface IVariant {
    suit: string,
    rank: number,
    points: null | number,
}

/**
 * <h3>Интерфейс для вариантов карты героя.</h3>
 */
export interface IVariants {
    // TODO Rework [name: string] to typeof/keyof SUITS
    [name: string]: IVariant,
}
