/**
 * <h3>Интерфейс для числовых индексов и массивов числовых значений.</h3>
 */
interface INumberArrayValues {
    [index: number]: number[],
}

/**
 * <h3>Интерфейс для числовых индексов и числовых значений.</h3>
 */
export interface INumberValues {
    [index: number]: number,
}

/**
 * <h3>Интерфейс для значений очков карт.</h3>
 */
export interface IPointsValues {
    [index: number]: INumberValues | INumberArrayValues,
}

/**
 * <h3>Интерфейс для значений шевронов карт.</h3>
 */
export interface IRankValues {
    [index: number]: INumberValues,
}
