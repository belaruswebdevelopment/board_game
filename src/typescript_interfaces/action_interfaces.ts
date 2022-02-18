import { ArgsTypes } from "../typescript_types/types";

/**
 * <h3>Интерфейс для действия.</h3>
 */
export interface IAction {
    readonly name: string,
    readonly params?: ArgsTypes,
}

/**
 * <h3>Интерфейс для конфига у карт.</h3>
 */
export interface IConfig {
    readonly number?: number,
    readonly coinId?: number,
    readonly suit?: string,
    readonly value?: number,
    readonly drawName?: string,
    readonly stageName?: string,
    readonly name?: string,
}

/**
 * <h3>Интерфейс для стэка у карт.</h3>
 */
export interface IStack {
    readonly variants?: IVariants,
    readonly config?: IConfig,
    readonly playerId?: number,
}

/**
 * <h3>Интерфейс для варианта карты героя.</h3>
 */
interface IVariant {
    readonly suit: string,
    readonly rank: number,
    readonly points: null | number,
}

/**
 * <h3>Интерфейс для вариантов карты героя.</h3>
 */
export interface IVariants {
    // TODO Rework [name: string] to typeof/keyof SUITS
    readonly [name: string]: IVariant,
}
