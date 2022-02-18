/**
 * <h3>Интерфейс для создания кристалла.</h3>
 */
export interface ICreatePriority {
    readonly value: number,
    readonly isExchangeable?: boolean,
}

/**
 * <h3>Интерфейс для конфига всех кристаллов.</h3>
 */
export interface IPrioritiesConfig {
    readonly [index: number]: IPriority[],
}

/**
 * <h3>Интерфейс для кристалла.</h3>
 */
export interface IPriority {
    readonly value: number,
    readonly isExchangeable: boolean,
}
