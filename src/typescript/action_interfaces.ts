/**
 * <h3>Интерфейс для конфига у карт.</h3>
 */
export interface IConfig {
    conditions?: IConditions,
    buff?: IBuff,
    number?: number,
    coinId?: number,
    suit?: string,
    coin?: string,
    value?: number,
    drawName?: string,
    stageName?: string,
    isTrading?: boolean,
    name?: string,
}

/**
 * <h3>Интерфейс для экшена.</h3>
 */
interface IAction {
    name: string,
    type: string,
}

/**
 * <h3>Интерфейс для стэка у карт.</h3>
 */
export interface IStack {
    action: IAction,
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
    [name: string]: IVariant,
}

/**
 * <h3>Интерфейс для условия карты героя.</h3>
 */
interface ICondition {
    suit: string,
    [name: string]: string | number | boolean,
}

/**
 * <h3>Интерфейс для условий карты героя.</h3>
 */
export interface IConditions {
    [name: string]: ICondition,
}

/**
 * <h3>Интерфейс для баффа карты героя.</h3>
 */
interface IBuff {
    name: string,
    value: string | number | boolean,
}
