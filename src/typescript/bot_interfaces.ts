import { ICard } from "./card_interfaces";
import { MoveArgsTypes } from "./types";

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
    players: number,
    tier: number,
}

/**
 * <h3>Интерфейс для данных бота.</h3>
 */
export interface IBotData {
    allCoinsOrder: number[][],
    allPicks: unknown,
    maxIter: number,
    deckLength: number,
}

/**
 * <h3>Интерфейс для создания "средней" карты фракции.</h3>
 */
export interface ICreateAverageSuitCard {
    suit: string,
    rank: number,
    points: number,
}

/**
 * <h3>Интерфейс для возможных мувов у ботов.</h3>
 */
export interface IMoves {
    move: string,
    args: MoveArgsTypes,
}
