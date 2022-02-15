import { IAverageCard, IBotData } from "./bot_interfaces";
import { CampCardTypes, CampDeckCardTypes } from "./camp_card_types";
import { ICard } from "./card_interfaces";
import { DeckCardTypes, DiscardCardTypes, TavernCardTypes } from "./card_types";
import { ICoin } from "./coin_interfaces";
import { IDistinctions } from "./distinction_interfaces";
import { LogTypes } from "./enums";
import { IHero } from "./hero_card_interfaces";
import { IPlayers, IPublicPlayer } from "./player_interfaces";

/**
 * <h3>Интерфейс для дополнений к игре.</h3>
 */
export interface IExpansion {
    readonly [name: string]: {
        readonly active: boolean,
    },
}

/**
 * <h3>Интерфейс для логирования данных.</h3>
 */
export interface ILogData {
    readonly type: LogTypes,
    readonly value: string,
}

/**
 * <h3>Интерфейс для игровых пользовательских данных G.</h3>
 */
export interface IMyGameState {
    actionsNum: number,
    readonly averageCards: IAverageCard,
    readonly botData: IBotData,
    readonly camp: CampCardTypes[],
    readonly campDecks: CampDeckCardTypes[][],
    readonly campNum: number,
    campPicked: boolean,
    currentTavern: number,
    readonly debug: boolean,
    readonly decks: DeckCardTypes[][],
    readonly additionalCardsDeck: ICard[],
    discardCampCardsDeck: CampDeckCardTypes[],
    readonly discardCardsDeck: DiscardCardTypes[],
    readonly distinctions: IDistinctions,
    drawProfit: string,
    readonly drawSize: number,
    exchangeOrder: (number | undefined)[],
    readonly expansions: IExpansion,
    readonly heroes: IHero[],
    readonly log: boolean,
    readonly logData: ILogData[],
    readonly marketCoins: ICoin[],
    readonly marketCoinsUnique: ICoin[],
    suitIdForMjollnir: null | string,
    readonly suitsNum: number,
    readonly taverns: TavernCardTypes[][],
    readonly tavernsNum: number,
    tierToEnd: number,
    readonly totalScore: number[],
    readonly players: IPlayers,
    readonly publicPlayers: IPublicPlayer[],
    publicPlayersOrder: string[],
    readonly winner: number[],
}
