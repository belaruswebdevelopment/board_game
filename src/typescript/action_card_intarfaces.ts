import { INumberValues, IStack } from "./interfaces";

/**
 * <h3>Интерфейс для значения, на которое обновляется монета.</h3>
 */
export interface IActionCardValues {
    [index: number]: INumberValues,
}

/**
 * <h3>Интерфейс для конфига карт обновления монет.</h3>
 */
export interface IActionCardConfig {
    value: number,
    stack: IStack[],
    amount: () => IActionCardValues,
}
