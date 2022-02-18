import { IStack } from "./action_interfaces";
import { INumberValues } from "./object_values_interfaces";

/**
 * <h3>Интерфейс для карты улучшения монеты.</h3>
 */
export interface IActionCard {
    readonly type: string,
    readonly value: number,
    readonly stack: IStack[],
    readonly name: string,
}

/**
 * <h3>Интерфейс для конфига карт обновления монет.</h3>
 */
export interface IActionCardConfig {
    readonly value: number,
    readonly stack: IStack[],
    readonly amount: () => IActionCardValues,
}

/**
 * <h3>Интерфейс для значения, на которое обновляется монета.</h3>
 */
export interface IActionCardValues {
    readonly [index: number]: INumberValues,
}

/**
 * <h3>Интерфейс для создания карты улучшения монеты.</h3>
 */
export interface ICreateActionCard {
    readonly type?: string,
    readonly value: number,
    readonly stack: IStack[],
    readonly name: string,
}
