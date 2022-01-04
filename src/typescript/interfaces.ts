import { Ctx } from "boardgame.io";
import { IActionCardConfig } from "./action_card_intarfaces";
import { CampCardTypes, CampDeckCardTypes, DeckCardTypes, PlayerCardsType, TavernCardTypes } from "./card_types";
import { ICoin } from "./coin_interfaces";
import { LogTypes } from "./enums";
import { IHero } from "./hero_card_interfaces";
import { IPlayers, IPublicPlayer } from "./player_interfaces";
import { DistinctionTypes } from "./types";

/**
 * <h3>Интерфейс для данных карт кэмпа артефакт.</h3>
 */
export interface IArtefact {
    name: string,
    description: string,
    game: string,
    tier: number,
    suit: null | string,
    rank: null | number,
    points: null | number,
    stack: IStack[],
    scoringRule: (player?: IPublicPlayer, suit?: string) => number,
}

/**
 * <h3>Интерфейс для данных карт кэмпа наёмник.</h3>
 */
export interface IMercenary {
    suit: string,
    rank: number,
    points: null | number,
}

/**
 * <h3>Интерфейс для перечня данных карт кэмпа наёмники.</h3>
 */
export interface IMercenaries {
    [name: string]: IMercenary,
}

/**
 * <h3>Интерфейс для конфига данных карт кэмпа артефакт.</h3>
 */
export interface IArtefactConfig {
    [name: string]: IArtefact,
}

/**
 * <h3>Интерфейс для резолвинга монет на столе.</h3>
 */
export interface IResolveBoardCoins {
    playersOrder: number[],
    exchangeOrder: number[],
}

/**
 * <h3>Интерфейс для параметров отрисовки игрового поля.</h3>
 */
export interface IDrawBoardOptions {
    boardCols: number,
    lastBoardCol: number,
    boardRows: number,
}

/**
 * <h3>Интерфейс для конфига базовых монет.</h3>
 */
export interface IInitialTradingCoinConfig {
    value: number,
    isTriggerTrading: boolean,
}

/**
 * <h3>Интерфейс для конфига монет рынка.</h3>
 */
export interface IMarketCoinConfig {
    value: number,
    count: () => INumberValues,
}

/**
 * <h3>Интерфейс для баффа карты героя.</h3>
 */
export interface IBuff {
    name: string,
    value: string | number | boolean,
}

/**
 * <h3>Интерфейс для варианта карты героя.</h3>
 */
export interface IVariant {
    suit: string,
    rank: number,
    points: null | number,
}

/**
 * <h3>Интерфейс для вариантов карты героя.</h3>
 */
export interface IVariants {
    [name: string]: IVariant,
}

/**
 * <h3>Интерфейс для условия карты героя.</h3>
 */
export interface ICondition {
    suit: string,
    [name: string]: string | number | boolean,
}

/**
 * <h3>Интерфейс для условий карты героя.</h3>
 */
export interface IConditions {
    [name: string]: ICondition,
}

/**
 * <h3>Интерфейс для отрисовки бэкграунда в стилях.</h3>
 */
export interface IBackground {
    background: string,
}

/**
 * <h3>Интерфейс для всех стилей.</h3>
 */
export interface IStyles {
    Camp: () => IBackground,
    CampCards: (tier: number, cardPath: string) => IBackground,
    Cards: (suit: string | null, name: string, points: number | null) => IBackground,
    Coin: (value: number, initial: boolean) => IBackground,
    CoinBack: () => IBackground,
    Distinctions: (distinction: string) => IBackground,
    DistinctionsBack: () => IBackground,
    Exchange: () => IBackground,
    Heroes: (game: string, heroName: string) => IBackground,
    HeroBack: () => IBackground,
    Priorities: (priority: number) => IBackground,
    Priority: () => IBackground,
    Suits: (suit: string) => IBackground,
    Taverns: (tavernId: number) => IBackground,
}

/**
 * <h3>Интерфейс для числовых индексов и числовых значений.</h3>
 */
export interface INumberValues {
    [index: number]: number,
}

/**
 * <h3>Интерфейс для числовых индексов и массивов числовых значений.</h3>
 */
export interface IArrayValuesForTiers {
    [index: number]: number[],
}

/**
 * <h3>Интерфейс для значений шевронов карт.</h3>
 */
export interface IRankValues {
    [index: number]: INumberValues,
}

/**
 * <h3>Интерфейс для значений очков карт.</h3>
 */
export interface IPointsValues {
    [index: number]: INumberValues | IArrayValuesForTiers,
}

/**
 * <h3>Интерфейс для преимуществ по фракциям.</h3>
 */
export interface IDistinction {
    description: string,
    awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer) => number,
}

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

/**
 * <h3>Интерфейс для возможных мувов у ботов.</h3>
 */
export interface IMoves {
    move: string,
    args: number[][] | (string | number | boolean)[] | number,
}

/**
 * <h3>Интерфейс для карты кэмпа артефакта.</h3>
 */
export interface IArtefactCampCard {
    type: string,
    tier: number,
    path: string,
    name: string,
    description: string,
    game: string,
    suit: null | string,
    rank: null | number,
    points: null | number,
    stack: IStack[],
}

/**
 * <h3>Интерфейс для создания карты кэмпа артефакта.</h3>
 */
export interface ICreateArtefactCampCard {
    type?: string,
    tier: number,
    path: string,
    name: string,
    description: string,
    game: string,
    suit: null | string,
    rank: null | number,
    points: null | number,
    stack: IStack[],
}

/**
 * <h3>Интерфейс для карты кэмпа наёмника.</h3>
 */
export interface IMercenaryCampCard {
    type: string,
    tier: number,
    path: string,
    name: string,
    game: string,
    stack: IStack[],
}

/**
 * <h3>Интерфейс для создания карты кэмпа наёмника.</h3>
 */
export interface ICreateMercenaryCampCard {
    type?: string,
    tier: number,
    path: string,
    name: string,
    game?: string,
    stack: IStack[],
}

/**
 * <h3>Интерфейс для карты дворфа.</h3>
 */
export interface ICard {
    type: string,
    suit: string,
    rank: number,
    points: null | number,
    name: string,
    game: string,
    tier: number,
    path: string,
}

/**
 * <h3>Интерфейс для создания карты дворфа.</h3>
 */
export interface ICreateCard {
    type?: string,
    suit: string,
    rank: number,
    points: null | number,
    name?: string,
    game?: string,
    tier?: number,
    path?: string,
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

/**
 * <h3>Интерфейс для создания "средней" карты фракции.</h3>
 */
export interface ICreateAverageSuitCard {
    suit: string,
    rank: number,
    points: number,
}

/**
 * <h3>Интерфейс "средней" карты фракции.</h3>
 */
export interface IAverageSuitCardData {
    players: number,
    tier: number,
}

/**
 * <h3>Интерфейс для конфига дек.</h3>
 */
export interface IDeckConfig {
    suits: ISuitConfig,
    actions: IActionCardConfig[],
}

/**
 * <h3>Интерфейс для карт игрока.</h3>
 */
export interface IPlayerCards {
    [index: string]: PlayerCardsType[],
}

/**
 * <h3>Интерфейс для создания монеты.</h3>
 */
export interface ICreateCoin {
    value: number,
    isInitial?: boolean,
    isTriggerTrading?: boolean,
}

/**
 * <h3>Интерфейс опций для создания монет.</h3>
 */
export interface IBuildCoinsOptions {
    isInitial: boolean,
    isTriggerTrading: boolean,
    players?: number,
    count?: ICoin[],
}

/**
 * <h3>Интерфейс для преимуществ.</h3>
 */
export interface IDistinctions {
    [index: string]: DistinctionTypes,
}

/**
 * <h3>Интерфейс для порядка ходов.</h3>
 */
export interface IOrder {
    next: (G: MyGameState, ctx: Ctx) => number;
    first: () => number;
    playOrder: (G: MyGameState) => string[];
}

/**
 * <h3>Интерфейс для дополнений к игре.</h3>
 */
export interface IExpansion {
    [name: string]: {
        active: boolean,
    },
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
 * <h3>Интерфейс для средей карты фракции.</h3>
 */
export interface IAverageCard {
    [index: string]: ICard,
}

/**
 * <h3>Интерфейс для игровых пользовательских данных G.</h3>
 */
export interface MyGameState {
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
    discardCardsDeck: DeckCardTypes[],
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
    publicPlayersOrder: number[],
    winner: number[],
}

/**
 * <h3>Интерфейс для логирования данных.</h3>
 */
export interface ILogData {
    type: LogTypes,
    value: string,
}

/**
 * <h3>Интерфейс для параметров валидатора мувов.</h3>
 */
export interface IMoveValidatorParams {
    G: MyGameState,
    ctx?: Ctx,
    id?: number,
    type?: string,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByOption {
    [name: string]: string,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мувов.</h3>
 */
export interface IMoveBy {
    [name: string]: IMoveByOption,
}

/**
 * <h3>Интерфейс для проверки параметров валидатора мувов.</h3>
 */
export interface ICheckMoveParam {
    obj?: object | null,
    objId: number,
    range?: number[],
    values?: number[],
}

/**
 * <h3>Интерфейс для валидатора мувов.</h3>
 */
export interface IMoveValidator {
    getRange: (params: IMoveValidatorParams) => [number, number],
    getValue?: (params: IMoveValidatorParams) => number[],
    validate: (params: IMoveValidatorParams) => boolean,
}

/**
 * <h3>Интерфейс для объекта валидаторов мувов.</h3>
 */
export interface IMoveValidators {
    [name: string]: IMoveValidator,
}

/**
 * <h3>Интерфейс для видов бафов у карт.</h3>
 */
export interface IBuffs {
    // everyTurn?: string,
    // upgradeNextCoin?: string,
    // upgradeCoin?: number,
    // goCampOneTime?: boolean,
    // goCamp?: boolean,
    // noHero?: boolean,
    // getMjollnirProfit?: boolean,
    // discardCardEndGame?: boolean,
    [name: string]: string | number | boolean,
}

/**
 * <h3>Интерфейс для конфига у карт.</h3>
 */
export interface IConfig {
    conditions?: IConditions,
    buff?: IBuff,
    number?: number,
    coinId?: number,
    suit?: string,
    coin?: string,
    value?: number,
    drawName?: string,
    stageName?: string,
    isTrading?: boolean,
    name?: string,
}

/**
 * <h3>Интерфейс для экшена.</h3>
 */
export interface IAction {
    name: string,
    type: string,
}

/**
 * <h3>Интерфейс для стэка у карт.</h3>
 */
export interface IStack {
    action: IAction,
    variants?: IVariants,
    config?: IConfig,
    playerId?: number,
}
