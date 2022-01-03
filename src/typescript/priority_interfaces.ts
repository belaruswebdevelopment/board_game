/**
 * <h3>Интерфейс для кристалла.</h3>
 */
export interface IPriority {
    value: number,
    isExchangeable: boolean,
}

/**
 * <h3>Интерфейс для конфига всех кристаллов.</h3>
 */
export interface IPrioritiesConfig {
    [index: number]: IPriority[],
}

/**
 * <h3>Интерфейс для создания кристалла.</h3>
 */
export interface ICreatePriority {
    value: number,
    isExchangeable?: boolean,
}
