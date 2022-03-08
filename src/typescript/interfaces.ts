import type { Ctx } from "boardgame.io";
import { LogTypes } from "./enums";

export interface IDebugData {
    G: Record<string, unknown>,
    ctx: Record<string, unknown>,
}

export interface ICardCharacteristics {
    variation: number,
    mean: number,
}

export interface IHeuristic<T> {
    heuristic: (array: T) => boolean,
    weight: number,
}

/**
 * <h3>Интерфейс для конфига дек.</h3>
 */
export interface IDeckConfig {
    readonly suits: ISuitConfig,
    readonly actions: IActionCardConfig[],
}

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

/**
 * <h3>Интерфейс для действия.</h3>
 */
export interface IAction {
    readonly name: string,
    readonly params?: ArgsTypes,
}

/**
 * <h3>Интерфейс для конфига у карт.</h3>
 */
export interface IConfig {
    readonly number?: number,
    readonly coinId?: number,
    readonly suit?: SuitTypes,
    readonly value?: number,
    // TODO Do we need it!?!?!?
    readonly drawName?: string,
    readonly stageName?: string,
    readonly name?: string,
}

/**
 * <h3>Интерфейс для стэка у карт.</h3>
 */
export interface IStack {
    readonly variants?: RequiredSuitPropertyTypes<IVariant>,
    readonly config?: IConfig,
    readonly playerId?: number,
}

/**
 * <h3>Интерфейс для варианта карты героя.</h3>
 */
export interface IVariant {
    readonly suit: SuitTypes,
    readonly rank: number,
    readonly points: number | null,
}

/**
 * <h3>Интерфейс для параметров отрисовки игрового поля.</h3>
 */
export interface IDrawBoardOptions {
    readonly boardCols: number,
    readonly lastBoardCol: number,
    readonly boardRows: number,
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
    readonly allPicks: number[][],
    readonly maxIter: number,
    readonly deckLength: number,
}

/**
 * <h3>Интерфейс для возможных мувов у ботов.</h3>
 */
export interface IMoves {
    readonly move: string,
    readonly args: MoveArgsTypes,
}

/**
 * <h3>Интерфейс для данных карт кэмпа артефакт.</h3>
 */
export interface IArtefact {
    readonly name: string,
    readonly description: string,
    readonly game: string,
    readonly tier: number,
    readonly suit: SuitTypes | null,
    readonly rank: number | null,
    readonly points: number | null,
    readonly buff?: IBuff,
    readonly validators?: IValidatorsConfig,
    readonly actions?: IAction,
    readonly stack?: IStack[],
    readonly scoringRule: (player?: IPublicPlayer) => number,
}

/**
 * <h3>Интерфейс для карты кэмпа артефакта.</h3>
 */
export interface IArtefactCampCard {
    readonly type: string,
    readonly tier: number,
    readonly path: string,
    readonly name: string,
    readonly description: string,
    readonly game: string,
    readonly suit: SuitTypes | null,
    readonly rank: number | null,
    readonly points: number | null,
    readonly buff?: IBuff,
    readonly validators?: IValidatorsConfig,
    readonly actions?: IAction,
    readonly stack?: IStack[],
}

/**
 * <h3>Интерфейс для конфига данных карт кэмпа артефакт.</h3>
 */
export interface IArtefactConfig {
    readonly Brisingamens: IArtefact,
    readonly Draupnir: IArtefact,
    readonly Fafnir_Baleygr: IArtefact,
    readonly Gjallarhorn: IArtefact,
    readonly Hofud: IArtefact,
    readonly Hrafnsmerki: IArtefact,
    readonly Jarnglofi: IArtefact,
    readonly Megingjord: IArtefact,
    readonly Mjollnir: IArtefact,
    readonly Svalinn: IArtefact,
    readonly Vegvisir: IArtefact,
    readonly Vidofnir_Vedrfolnir: IArtefact,
}

/**
 * <h3>Интерфейс для создания карты кэмпа артефакта.</h3>
 */
export interface ICreateArtefactCampCard {
    readonly type?: string,
    readonly tier: number,
    readonly path: string,
    readonly name: string,
    readonly description: string,
    readonly game: string,
    readonly suit: SuitTypes | null,
    readonly rank: number | null,
    readonly points: number | null,
    readonly buff?: IBuff,
    readonly validators?: IValidatorsConfig,
    readonly actions?: IAction,
    readonly stack?: IStack[],
}

/**
 * <h3>Интерфейс для создания карты кэмпа наёмника.</h3>
 */
export interface ICreateMercenaryCampCard {
    readonly type?: string,
    readonly tier: number,
    readonly path: string,
    readonly name: string,
    readonly game?: string,
    readonly variants: OptionalSuitPropertyTypes<IVariant>,
}

/**
 * <h3>Интерфейс для данных карт кэмпа наёмник.</h3>
 */
export interface IMercenary {
    readonly suit: SuitTypes,
    readonly rank: number,
    readonly points: number | null,
}

/**
 * <h3>Интерфейс для карты кэмпа наёмника.</h3>
 */
export interface IMercenaryCampCard {
    readonly type: string,
    readonly tier: number,
    readonly path: string,
    readonly name: string,
    readonly game: string,
    readonly variants: OptionalSuitPropertyTypes<IVariant>,
}

/**
 * <h3>Интерфейс для бафа карт.</h3>
 */
export interface IBuff {
    readonly name: BuffTypes,
}

export interface IAdditionalCardsConfig {
    readonly ChiefBlacksmith: ICard,
}

/**
 * <h3>Интерфейс для карты дворфа.</h3>
 */
export interface ICard {
    readonly type: string,
    readonly suit: SuitTypes,
    readonly rank: number,
    readonly points: number | null,
    readonly name: string,
    readonly game: string,
    readonly tier: number,
    readonly path: string,
}

/**
 * <h3>Интерфейс для создания карты дворфа.</h3>
 */
export interface ICreateCard {
    readonly type?: string,
    readonly suit: SuitTypes,
    readonly rank: number,
    readonly points: number | null,
    readonly name: string,
    readonly game: string,
    readonly tier?: number,
    readonly path?: string,
}

/**
 * <h3>Интерфейс опций для создания монет.</h3>
 */
export interface IBuildCoinsOptions {
    readonly isInitial: boolean,
    readonly isTriggerTrading: boolean,
    readonly players?: number,
    readonly count?: ICoin[],
}

/**
 * <h3>Интерфейс для монеты.</h3>
 */
export interface ICoin {
    readonly value: number,
    readonly isInitial: boolean,
    readonly isTriggerTrading: boolean,
}

/**
 * <h3>Интерфейс для создания монеты.</h3>
 */
export interface ICreateCoin {
    readonly value: number,
    readonly isInitial?: boolean,
    readonly isTriggerTrading?: boolean,
}

/**
 * <h3>Интерфейс для конфига базовых монет.</h3>
 */
export interface IInitialTradingCoinConfig {
    readonly value: number,
    readonly isTriggerTrading: boolean,
}

/**
 * <h3>Интерфейс для конфига монет рынка.</h3>
 */
export interface IMarketCoinConfig {
    readonly value: number,
    readonly count: () => INumberValues,
}

export interface IActionFunction {
    (G: IMyGameState, ctx: Ctx, ...params: ArgsTypes): void,
}

export interface IMoveFunction {
    (...args: ArgsTypes): void,
}

interface IExpansion {
    readonly active: boolean,
}

/**
 * <h3>Интерфейс для дополнений к игре.</h3>
 */
export interface IExpansions {
    readonly thingvellir: IExpansion,
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
    readonly averageCards: RequiredSuitPropertyTypes<ICard>,
    readonly botData: IBotData,
    readonly camp: CampCardTypes[],
    readonly campDecks: CampDeckCardTypes[][],
    readonly campNum: number,
    mustDiscardTavernCardJarnglofi: boolean | null,
    campPicked: boolean,
    currentTavern: number,
    readonly debug: boolean,
    readonly decks: DeckCardTypes[][],
    readonly additionalCardsDeck: ICard[],
    readonly discardCampCardsDeck: CampDeckCardTypes[],
    readonly discardCardsDeck: DiscardCardTypes[],
    readonly distinctions: RequiredSuitPropertyTypes<DistinctionTypes>,
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

/**
 * <h3>Интерфейс для следующей фазы.</h3>
 */
export interface INext {
    readonly next: string,
}

/**
 * <h3>Интерфейс для порядка ходов.</h3>
 */
export interface IOrder {
    readonly next: (G: IMyGameState, ctx: Ctx) => number;
    readonly first: () => number;
    readonly playOrder: (G: IMyGameState) => string[];
}

/**
 * <h3>Интерфейс для распределения монет на столе.</h3>
 */
export interface IResolveBoardCoins {
    readonly playersOrder: string[],
    readonly exchangeOrder: number[],
}

/**
 * <h3>Интерфейс для создания героя.</h3>
 */
export interface ICreateHero {
    readonly type: string,
    readonly name: string,
    readonly description: string,
    readonly game: string,
    readonly suit: SuitTypes | null,
    readonly rank: number | null,
    readonly points: number | null,
    readonly active?: boolean,
    readonly buff?: IBuff,
    readonly validators?: IValidatorsConfig,
    readonly actions?: IAction,
    readonly stack?: IStack[],
}

/**
 * <h3>Интерфейс для героя.</h3>
 */
export interface IHeroCard {
    readonly type: string,
    readonly name: string,
    readonly description: string,
    readonly game: string,
    readonly suit: SuitTypes | null,
    readonly rank: number | null,
    readonly points: number | null,
    active: boolean,
    readonly buff?: IBuff,
    readonly validators?: IValidatorsConfig,
    readonly actions?: IAction,
    readonly stack?: IStack[],
}

/**
 * <h3>Интерфейс для конфига карт героев.</h3>
 */
export interface IHeroConfig {
    readonly Kraal: IHeroData,
    readonly Tarah: IHeroData,
    readonly Aral: IHeroData,
    readonly Dagda: IHeroData,
    readonly Lokdur: IHeroData,
    readonly Zoral: IHeroData,
    readonly Aegur: IHeroData,
    readonly Bonfur: IHeroData,
    readonly Hourya: IHeroData,
    readonly Idunn: IHeroData,
    readonly Astrid: IHeroData,
    readonly Dwerg_Aesir: IHeroData,
    readonly Dwerg_Bergelmir: IHeroData,
    readonly Dwerg_Jungir: IHeroData,
    readonly Dwerg_Sigmir: IHeroData,
    readonly Dwerg_Ymir: IHeroData,
    readonly Grid: IHeroData,
    readonly Skaa: IHeroData,
    readonly Thrud: IHeroData,
    readonly Uline: IHeroData,
    readonly Ylud: IHeroData,
    readonly Jarika: IHeroData,
    readonly Andumia: IHeroData,
    readonly Holda: IHeroData,
    readonly Khrad: IHeroData,
    readonly Olwin: IHeroData,
    readonly Zolkur: IHeroData,
}

/**
 * <h3>Интерфейс для данных карты героя.</h3>
 */
export interface IHeroData {
    readonly name: string,
    readonly description: string,
    readonly game: string,
    readonly suit: SuitTypes | null,
    readonly rank: number | null,
    readonly points: number | null,
    readonly buff?: IBuff,
    readonly validators?: IValidatorsConfig,
    readonly actions?: IAction,
    readonly stack?: IStack[],
    readonly scoringRule: (player?: IPublicPlayer) => number,
}

/**
 * <h3>Интерфейс для условия карты героя.</h3>
 */
interface ICondition {
    readonly suit: SuitTypes,
    readonly value: number,
}

/**
 * <h3>Интерфейс для условий карты героя.</h3>
 */
export interface IConditions {
    readonly suitCountMin: ICondition,
}

interface IDiscardCard {
    readonly suit: SuitTypes,
    readonly number?: number,
}

/**
 * <h3>Интерфейс для конфига валидаторов героев.</h3>
 */
export interface IValidatorsConfig {
    readonly conditions?: IConditions,
    readonly discardCard?: IDiscardCard,
    readonly pickCampCardToStack?: Record<string, never>,
    readonly pickDiscardCardToStack?: Record<string, never>,
}

export interface IMoveArgumentsStage<T> {
    readonly args: T,
}

export interface IMoveCoinsArguments {
    readonly coinId: number,
    readonly type: string,
    readonly isInitial: boolean,
}

/**
 * <h3>Интерфейс для выбранного аргумента мувов с фракциями для ботов.</h3>
 */
export interface IMoveSuitCardCurrentId {
    readonly suit: SuitTypes,
    readonly cardId: number,
}

export interface IMoveSuitCardPlayerCurrentId extends IMoveSuitCardCurrentId {
    readonly playerId: number,
}

export interface IMoveSuitCardPlayerIdArguments {
    readonly playerId: number,
    readonly suit: SuitTypes,
    readonly cards: number[],
}

/**
 * <h3>Интерфейс для возможных валидаторов у мувов.</h3>
 */
export interface IMoveBy {
    readonly placeCoins: IMoveByPlaceCoinsOptions,
    readonly placeCoinsUline: IMoveByPlaceCoinsUlineOptions,
    readonly pickCards: IMoveByPickCardsOptions,
    readonly enlistmentMercenaries: IMoveByEnlistmentMercenariesOptions,
    readonly endTier: IMoveByEndTierOptions,
    readonly getDistinctions: IMoveByGetDistinctionsOptions,
    readonly brisingamensEndGame: IMoveByBrisingamensEndGameOptions,
    readonly getMjollnirProfit: IMoveByGetMjollnirProfitOptions,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPlaceCoinsOptions {
    readonly default1: IMoveValidator,
    readonly default2: IMoveValidator,
    readonly default3: IMoveValidator,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPlaceCoinsUlineOptions {
    readonly default1: IMoveValidator,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPickCardsOptions {
    readonly default1: IMoveValidator,
    readonly default2: IMoveValidator,
    // start
    readonly addCoinToPouch: IMoveValidator,
    readonly discardBoardCard: IMoveValidator,
    readonly discardSuitCard: IMoveValidator,
    readonly pickCampCardHolda: IMoveValidator,
    readonly pickDiscardCard: IMoveValidator,
    readonly pickHero: IMoveValidator,
    readonly placeOlwinCards: IMoveValidator,
    readonly placeThrudHero: IMoveValidator,
    readonly upgradeCoin: IMoveValidator,
    readonly upgradeVidofnirVedrfolnirCoin: IMoveValidator,
    // end
    readonly discardCard: IMoveValidator,
    readonly placeTradingCoinsUline: IMoveValidator,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByEnlistmentMercenariesOptions {
    readonly default1: IMoveValidator,
    readonly default2: IMoveValidator,
    readonly default3: IMoveValidator,
    readonly default4: IMoveValidator,
    // start
    readonly addCoinToPouch: IMoveValidator,
    readonly discardBoardCard: IMoveValidator,
    readonly discardSuitCard: IMoveValidator,
    readonly pickCampCardHolda: IMoveValidator,
    readonly pickDiscardCard: IMoveValidator,
    readonly pickHero: IMoveValidator,
    readonly placeOlwinCards: IMoveValidator,
    readonly placeThrudHero: IMoveValidator,
    readonly upgradeCoin: IMoveValidator,
    readonly upgradeVidofnirVedrfolnirCoin: IMoveValidator,
    // end
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByEndTierOptions {
    readonly default1: IMoveValidator,
    // start
    readonly addCoinToPouch: IMoveValidator,
    readonly discardBoardCard: IMoveValidator,
    readonly discardSuitCard: IMoveValidator,
    readonly pickCampCardHolda: IMoveValidator,
    readonly pickDiscardCard: IMoveValidator,
    readonly pickHero: IMoveValidator,
    readonly placeOlwinCards: IMoveValidator,
    readonly placeThrudHero: IMoveValidator,
    readonly upgradeCoin: IMoveValidator,
    readonly upgradeVidofnirVedrfolnirCoin: IMoveValidator,
    // end
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByGetDistinctionsOptions {
    readonly default1: IMoveValidator,
    // start
    readonly addCoinToPouch: IMoveValidator,
    readonly discardBoardCard: IMoveValidator,
    readonly discardSuitCard: IMoveValidator,
    readonly pickCampCardHolda: IMoveValidator,
    readonly pickDiscardCard: IMoveValidator,
    readonly pickHero: IMoveValidator,
    readonly placeOlwinCards: IMoveValidator,
    readonly placeThrudHero: IMoveValidator,
    readonly upgradeCoin: IMoveValidator,
    readonly upgradeVidofnirVedrfolnirCoin: IMoveValidator,
    // end
    readonly pickDistinctionCard: IMoveValidator,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByBrisingamensEndGameOptions {
    readonly default1: IMoveValidator,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByGetMjollnirProfitOptions {
    readonly default1: IMoveValidator,
}

/**
 * <h3>Интерфейс для валидатора мувов.</h3>
 */
export interface IMoveValidator {
    readonly getRange: (G?: IMyGameState, ctx?: Ctx, playerId?: number) => MoveValidatorGetRangeTypes,
    readonly getValue: (G: IMyGameState, ctx: Ctx, moveRangeData: MoveValidatorGetRangeTypes) =>
        ValidMoveIdParamTypes,
    readonly moveName: string,
    readonly validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes) => boolean,
}

/**
 * <h3>Интерфейс для объекта валидаторов мувов.</h3>
 */
export interface IMoveValidators {
    readonly BotsPlaceAllCoinsMoveValidator: IMoveValidator,
    readonly ClickBoardCoinMoveValidator: IMoveValidator,
    readonly ClickCampCardMoveValidator: IMoveValidator,
    readonly ClickCardMoveValidator: IMoveValidator,
    readonly ClickCardToPickDistinctionMoveValidator: IMoveValidator,
    readonly ClickDistinctionCardMoveValidator: IMoveValidator,
    readonly ClickHandCoinMoveValidator: IMoveValidator,
    readonly ClickHandCoinUlineMoveValidator: IMoveValidator,
    readonly ClickHandTradingCoinUlineMoveValidator: IMoveValidator,
    readonly DiscardCardFromPlayerBoardMoveValidator: IMoveValidator,
    readonly DiscardCard2PlayersMoveValidator: IMoveValidator,
    readonly GetEnlistmentMercenariesMoveValidator: IMoveValidator,
    readonly GetMjollnirProfitMoveValidator: IMoveValidator,
    readonly PassEnlistmentMercenariesMoveValidator: IMoveValidator,
    readonly PlaceEnlistmentMercenariesMoveValidator: IMoveValidator,
    readonly PlaceYludHeroMoveValidator: IMoveValidator,
    readonly StartEnlistmentMercenariesMoveValidator: IMoveValidator,
    // start
    readonly AddCoinToPouchMoveValidator: IMoveValidator,
    readonly ClickCampCardHoldaMoveValidator: IMoveValidator,
    readonly ClickCoinToUpgradeMoveValidator: IMoveValidator,
    readonly ClickHeroCardMoveValidator: IMoveValidator,
    readonly DiscardCardMoveValidator: IMoveValidator,
    readonly DiscardSuitCardFromPlayerBoardMoveValidator: IMoveValidator,
    readonly PickDiscardCardMoveValidator: IMoveValidator,
    readonly PlaceOlwinCardMoveValidator: IMoveValidator,
    readonly PlaceThrudHeroMoveValidator: IMoveValidator,
    readonly UpgradeCoinVidofnirVedrfolnirMoveValidator: IMoveValidator,
    // end
}

/**
 * <h3>Интерфейс для числовых индексов и массивов числовых значений.</h3>
 */
export interface INumberArrayValues {
    readonly [index: number]: number[],
}

/**
 * <h3>Интерфейс для числовых индексов и числовых значений.</h3>
 */
export interface INumberValues {
    [index: number]: number,
}

/**
 * <h3>Интерфейс для значений очков карт.</h3>
 */
export interface IPointsValues {
    readonly [index: number]: INumberValues | INumberArrayValues,
}

/**
 * <h3>Интерфейс для видов бафов у карт.</h3>
 */
export interface IBuffs {
    readonly coin?: true,
    readonly discardCardEndGame?: true,
    readonly endTier?: true,
    readonly everyTurn?: true,
    readonly getMjollnirProfit?: true,
    readonly goCamp?: true,
    readonly goCampOneTime?: true,
    readonly noHero?: true,
    readonly suitIdForMjollnir?: SuitTypes,
    readonly upgradeCoin?: true,
    readonly upgradeNextCoin?: true,
}

/**
 * <h3>Интерфейс для создания публичных данных игрока.</h3>
 */
export interface ICreatePublicPlayer {
    readonly actionsNum?: number,
    readonly nickname: string,
    readonly cards: RequiredSuitPropertyTypes<PlayerCardsType[]>,
    readonly heroes?: IHeroCard[],
    readonly campCards?: CampDeckCardTypes[],
    readonly handCoins: ICoin[],
    readonly boardCoins: ICoin[],
    readonly stack?: IStack[],
    readonly priority: IPriority,
    readonly buffs?: IBuffs[],
    readonly selectedCoin?: number | null,
    readonly pickedCard?: PickedCardType,
}

/**
 * <h3>Интерфейс для приватных данных игрока.</h3>
 */
export interface IPlayer {
    readonly handCoins: ICoin[],
    readonly boardCoins: ICoin[],
}

/**
 * <h3>Интерфейс для объекта, хранящего скрытые (secret) данные всех игроков.</h3>
 */
export interface IPlayers {
    [index: number]: IPlayer,
}

/**
 * <h3>Интерфейс для публичных данных игрока.</h3>
 */
export interface IPublicPlayer {
    actionsNum: number,
    readonly nickname: string,
    readonly cards: RequiredSuitPropertyTypes<PlayerCardsType[]>,
    readonly heroes: IHeroCard[],
    readonly campCards: CampDeckCardTypes[],
    readonly handCoins: CoinType[],
    readonly boardCoins: CoinType[],
    stack: IStack[],
    priority: IPriority,
    readonly buffs: IBuffs[],
    selectedCoin: number | null,
    pickedCard: PickedCardType,
}

/**
 * <h3>Интерфейс для создания кристалла.</h3>
 */
export interface ICreatePriority {
    readonly value: number,
    readonly isExchangeable?: boolean,
}

/**
 * <h3>Интерфейс для конфига всех кристаллов.</h3>
 */
export interface IPrioritiesConfig {
    readonly [index: number]: IPriority[],
}

/**
 * <h3>Интерфейс для кристалла.</h3>
 */
export interface IPriority {
    readonly value: number,
    readonly isExchangeable: boolean,
}

/**
 * <h3>Интерфейс для отрисовки бэкграунда в стилях.</h3>
 */
export interface IBackground {
    readonly background: string,
}

/**
 * <h3>Интерфейс для всех стилей.</h3>
 */
export interface IStyles {
    readonly Camp: () => IBackground,
    readonly CampCards: (tier: number, cardPath: string) => IBackground,
    readonly Cards: (suit: SuitTypes | null, name: string, points: number | null) => IBackground,
    readonly Coin: (value: number, initial: boolean) => IBackground,
    readonly CoinBack: () => IBackground,
    readonly Distinctions: (distinction: string) => IBackground,
    readonly DistinctionsBack: () => IBackground,
    readonly Exchange: () => IBackground,
    readonly Heroes: (game: string, heroName: string) => IBackground,
    readonly HeroBack: () => IBackground,
    readonly Priorities: (priority: number) => IBackground,
    readonly Priority: () => IBackground,
    readonly Suits: (suit: SuitTypes) => IBackground,
    readonly Taverns: (tavernId: number) => IBackground,
}

/**
 * <h3>Интерфейс для фракций.</h3>
 */
export interface ISuit {
    readonly suit: SuitTypes,
    readonly suitName: string,
    readonly suitColor: string,
    readonly description: string,
    readonly pointsValues: () => IPointsValues,
    readonly scoringRule: (cards: PlayerCardsType[], potentialCardValue?: number) => number,
    readonly distinction: IDistinction,
}

export interface IDistinction {
    readonly description: string,
    readonly awarding: (G: IMyGameState, ctx: Ctx, player: IPublicPlayer) => number,
}

/**
 * <h3>Интерфейс для конфига фракций.</h3>
 */
export interface ISuitConfig {
    readonly warrior: ISuit,
    readonly hunter: ISuit,
    readonly miner: ISuit,
    readonly blacksmith: ISuit,
    readonly explorer: ISuit,
}

/**
 * <h3>Интерфейс для конфига конкретной таверны.</h3>
 */
export interface ITavernInConfig {
    readonly name: string,
}

/**
 * <h3>Интерфейс для конфига всех таверн.</h3>
 */
export interface ITavernsConfig {
    readonly [index: number]: ITavernInConfig,
}

export type StageTypes = keyof IMoveByPlaceCoinsOptions | keyof IMoveByPlaceCoinsUlineOptions
    | keyof IMoveByPickCardsOptions | keyof IMoveByEnlistmentMercenariesOptions | keyof IMoveByEndTierOptions
    | keyof IMoveByGetDistinctionsOptions | keyof IMoveByBrisingamensEndGameOptions
    | keyof IMoveByGetMjollnirProfitOptions;

/**
 * <h3>Типы данных для кэмпа.</h3>
 */
export type CampCardTypes = CampDeckCardTypes | null;

/**
 * <h3>Типы данных для карт колоды кэмпа.</h3>
 */
export type CampDeckCardTypes = IArtefactCampCard | IMercenaryCampCard;

/**
 * <h3>Типы данных для дек карт.</h3>
 */
export type DeckCardTypes = ICard | IActionCard;

/**
 * <h3>Типы данных для карт колоды сброса.</h3>
 */
export type DiscardCardTypes = DeckCardTypes | IArtefactCampCard;

export type CardsHasStack = IHeroCard | IArtefactCampCard | IActionCard;

export type CardsHasStackValidators = IHeroCard | IArtefactCampCard;

/**
 * <h3>Типы данных для карт выбранных игроком.</h3>
 */
export type PickedCardType = DeckCardTypes | CampDeckCardTypes | IHeroCard | null;

/**
 * <h3>Типы данных для карт на планшете игрока.</h3>
 */
export type PlayerCardsType = ICard | IArtefactCampCard | IHeroCard;

/**
 * <h3>Типы данных для карт таверн.</h3>
 */
export type TavernCardTypes = DeckCardTypes | null;

export type AllCardTypes = DeckCardTypes | CampDeckCardTypes | IHeroCard;

/**
 * <h3>Типы данных для монет на столе или в руке.</h3>
 */
export type CoinType = ICoin | null;

export type IActionFunctionTypes = IActionFunction | null;

export type IMoveFunctionTypes = IMoveFunction | null;

export type MoveByTypes = keyof IMoveBy;

export type BuffTypes = keyof IBuffs;

export type IArtefactTypes = keyof IArtefactConfig;

export type IHeroTypes = keyof IHeroConfig;

export type AdditionalCardTypes = keyof IAdditionalCardsConfig;

export type MoveValidatorGetRangeTypes = IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`]
    | IMoveArgumentsStage<IMoveSuitCardPlayerIdArguments>[`args`]
    | IMoveArgumentsStage<number[][]>[`args`]
    | IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]
    | IMoveArgumentsStage<null>[`args`]
    | IMoveArgumentsStage<number[]>[`args`]
    | IMoveArgumentsStage<string[]>[`args`];

export type ValidMoveIdParamTypes = number | SuitTypes | number[] | IMoveSuitCardCurrentId
    | IMoveSuitCardPlayerCurrentId | IMoveCoinsArguments | null;

export type SuitTypes = keyof ISuitConfig;

export type ExpansionTypes = keyof IExpansions;

export type OptionalSuitPropertyTypes<Type> = {
    [Property in SuitTypes]?: Type;
};

export type RequiredSuitPropertyTypes<Type> = {
    [Property in SuitTypes]: Type;
};

/**
 * <h3>Типы данных для остаточных аргументов функций.</h3>
 */
export type ArgsTypes = (string | number | boolean | object | null)[];

/**
 * <h3>Типы данных для преимуществ.</h3>
 */
export type DistinctionTypes = string | null | undefined;

export type MoveArgsTypes = number[][] | [string] | [number] | [string, number] | [string, number, number]
    | [number, string, boolean];
