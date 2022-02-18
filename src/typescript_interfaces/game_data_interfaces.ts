import { LogTypes } from "../typescript_enums/enums";
import { CampCardTypes, CampDeckCardTypes } from "../typescript_types/camp_card_types";
import { DeckCardTypes, DiscardCardTypes, TavernCardTypes } from "../typescript_types/card_types";
import { IAverageCard, IBotData } from "./bot_interfaces";
import { ICard } from "./card_interfaces";
import { ICoin } from "./coin_interfaces";
import { IDistinctions } from "./distinction_interfaces";
import { IHeroCard } from "./hero_card_interfaces";
import { IPlayers, IPublicPlayer } from "./player_interfaces";

interface IExpansion {
    readonly active: boolean,
}

/**
 * <h3>Интерфейс для дополнений к игре.</h3>
 */
export interface IExpansions {
    readonly [name: string]: IExpansion,
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
    readonly discardCampCardsDeck: CampDeckCardTypes[],
    readonly discardCardsDeck: DiscardCardTypes[],
    readonly distinctions: IDistinctions,
    drawProfit: string,
    readonly drawSize: number,
    exchangeOrder: (number | undefined)[],
    readonly expansions: IExpansions,
    readonly heroes: IHeroCard[],
    readonly log: boolean,
    readonly logData: ILogData[],
    readonly marketCoins: ICoin[],
    readonly marketCoinsUnique: ICoin[],
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
