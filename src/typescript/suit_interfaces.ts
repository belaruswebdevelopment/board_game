import { PlayerCardsType } from "./card_types";
import { IDistinction } from "./distinction_interfaces";
import { IPointsValues, IRankValues } from "./object_values_interfaces";

/**
 * <h3>Интерфейс для фракций.</h3>
 */
export interface ISuit {
    readonly suit: string,
    readonly suitName: string,
    readonly suitColor: string,
    readonly description: string,
    readonly ranksValues: () => IRankValues,
    readonly pointsValues: () => IPointsValues,
    readonly scoringRule: (cards: PlayerCardsType[], potentialCardValue?: number) => number,
    readonly distinction: IDistinction,
}

/**
 * <h3>Интерфейс для конфига фракций.</h3>
 */
export interface ISuitConfig {
    readonly [name: string]: ISuit,
}
