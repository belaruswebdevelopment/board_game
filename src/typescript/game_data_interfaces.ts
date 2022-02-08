import { Ctx } from "boardgame.io";
import { IAverageCard, IBotData } from "./bot_interfaces";
import { CampCardTypes, CampDeckCardTypes, DeckCardTypes, DiscardCardTypes, TavernCardTypes } from "./card_types";
import { ICoin } from "./coin_interfaces";
import { IDistinctions } from "./distinction_interfaces";
import { LogTypes } from "./enums";
import { IHero } from "./hero_card_interfaces";
import { IPlayers, IPublicPlayer } from "./player_interfaces";

/**
 * <h3>Интерфейс для дополнений к игре.</h3>
 */
export interface IExpansion {
    [name: string]: {
        active: boolean,
    },
}

/**
 * <h3>Интерфейс для логирования данных.</h3>
 */
export interface ILogData {
    type: LogTypes,
    value: string,
}

/**
 * <h3>Интерфейс для игровых пользовательских данных G.</h3>
 */
export interface IMyGameState {
    actionsNum: number,
    averageCards: IAverageCard,
    botData: IBotData,
    camp: CampCardTypes[],
    campDecks: CampDeckCardTypes[][],
    campNum: number,
    campPicked: boolean,
    currentTavern: number,
    debug: boolean,
    decks: DeckCardTypes[][],
    discardCampCardsDeck: CampDeckCardTypes[],
    discardCardsDeck: DiscardCardTypes[],
    distinctions: IDistinctions,
    drawProfit: string,
    drawSize: number,
    exchangeOrder: (number | undefined)[],
    expansions: IExpansion,
    heroes: IHero[],
    log: boolean,
    logData: ILogData[],
    marketCoins: ICoin[],
    marketCoinsUnique: ICoin[],
    suitIdForMjollnir: null | string,
    suitsNum: number,
    taverns: TavernCardTypes[][],
    tavernsNum: number,
    tierToEnd: number,
    totalScore: number[],
    players: IPlayers,
    publicPlayers: IPublicPlayer[],
    publicPlayersOrder: string[],
    winner: number[],
}

/**
 * <h3>Интерфейс для следующей фазы.</h3>
 */
export interface INext {
    next: string,
}

/**
 * <h3>Интерфейс для порядка ходов.</h3>
 */
export interface IOrder {
    next: (G: IMyGameState, ctx: Ctx) => number;
    first: () => number;
    playOrder: (G: IMyGameState) => string[];
}

/**
 * <h3>Интерфейс для распределения монет на столе.</h3>
 */
export interface IResolveBoardCoins {
    playersOrder: string[],
    exchangeOrder: number[],
}
