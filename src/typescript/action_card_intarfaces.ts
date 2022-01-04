import { IStack } from "./action_interfaces";
import { INumberValues } from "./object_values_interfaces";

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

/**
 * <h3>Интерфейс для карты улучшения монеты.</h3>
 */
export interface IActionCard {
    type: string,
    value: number,
    stack: IStack[],
    name: string,
}

/**
 * <h3>Интерфейс для создания карты улучшения монеты.</h3>
 */
export interface ICreateActionCard {
    type?: string,
    value: number,
    stack: IStack[],
    name: string,
}
