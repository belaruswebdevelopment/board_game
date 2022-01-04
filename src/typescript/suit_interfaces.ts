import { PlayerCardsType } from "./card_types";
import { IDistinction } from "./distinction_interfaces";
import { IRankValues, IPointsValues } from "./object_values_interfaces";

/**
 * <h3>Интерфейс для фракций.</h3>
 */
export interface ISuit {
    suit: string,
    suitName: string,
    suitColor: string,
    description: string,
    ranksValues: () => IRankValues,
    pointsValues: () => IPointsValues,
    scoringRule: (cards: PlayerCardsType[]) => number,
    distinction: IDistinction,
}

/**
 * <h3>Интерфейс для конфига фракций.</h3>
 */
export interface ISuitConfig {
    [name: string]: ISuit,
}
