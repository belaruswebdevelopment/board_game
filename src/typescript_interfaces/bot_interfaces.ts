import { ICard } from "./card_interfaces";
import { MoveArgsTypes } from "../typescript_types/types";

/**
 * <h3>Интерфейс для средней карты фракции.</h3>
 */
export interface IAverageCard {
    // TODO Rework [name: string] to typeof/keyof SUITS
    [index: string]: ICard,
}

/**
 * <h3>Интерфейс "средней" карты фракции.</h3>
 */
export interface IAverageSuitCardData {
    readonly players: number,
    readonly tier: number,
}

/**
 * <h3>Интерфейс для данных бота.</h3>
 */
export interface IBotData {
    readonly allCoinsOrder: number[][],
    readonly allPicks: unknown,
    readonly maxIter: number,
    readonly deckLength: number,
}

/**
 * <h3>Интерфейс для создания "средней" карты фракции.</h3>
 */
export interface ICreateAverageSuitCard {
    readonly suit: string,
    readonly rank: number,
    readonly points: number,
}

/**
 * <h3>Интерфейс для возможных мувов у ботов.</h3>
 */
export interface IMoves {
    readonly move: string,
    readonly args: MoveArgsTypes,
}
