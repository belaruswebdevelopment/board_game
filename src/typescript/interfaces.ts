import type { Ctx } from "boardgame.io";
import { ArtefactNames, CardNames, CoinTypes, GameNames, HeroNames, LogTypes, MoveNames, RusCardTypes, RusSuitNames, TavernNames } from "./enums";

export interface ISecret {
    readonly campDecks: CampDeckCardTypes[][];
    readonly decks: DeckCardTypes[][];
}

export interface IObjective {
    readonly weight: number;
    readonly checker: (G: IMyGameState, ctx: Ctx) => boolean;
}

export interface IObjectives {
    readonly isEarlyGame: IObjective;
    readonly isFirst: IObjective;
    readonly isStronger: IObjective;
}

export interface IDebugData {
    readonly G: Record<string, unknown>;
    readonly ctx: Record<string, unknown>;
}

export interface IDebugDrawData {
    // TODO Rework 'any'?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly [key: string]: any,
}

export interface ICardCharacteristics {
    readonly variation: number;
    readonly mean: number;
}

export interface IHeuristic<T> {
    readonly heuristic: (array: T) => boolean;
    readonly weight: number;
}

/**
 * <h3>Интерфейс для конфига дек.</h3>
 */
export interface IDeckConfig {
    readonly suits: ISuitConfig;
    readonly actions: IActionCardConfig[];
}

/**
 * <h3>Интерфейс для карты улучшения монеты.</h3>
 */
export interface IActionCard {
    readonly name: string;
    readonly stack: IStack[];
    readonly type: RusCardTypes.ACTION;
    readonly value: number;
}

/**
 * <h3>Интерфейс для конфига карт обновления монет.</h3>
 */
export interface IActionCardConfig extends Pick<IActionCard, `stack` | `value`> {
    readonly amount: () => IActionCardValues;
}

/**
 * <h3>Интерфейс для значения; на которое обновляется монета.</h3>
 */
export interface IActionCardValues {
    readonly [index: number]: INumberValues;
}

/**
 * <h3>Интерфейс для действия.</h3>
 */
export interface IAction {
    readonly name: string;
    readonly params?: AutoActionArgsTypes;
}

/**
 * <h3>Интерфейс для конфига у карт.</h3>
 */
export interface IConfig {
    readonly number?: number;
    readonly coinId?: number;
    readonly coinValue?: number;
    readonly suit?: SuitTypes | null;
    readonly value?: number;
    readonly drawName?: string;
    readonly stageName?: string;
    readonly name?: string;
}

/**
 * <h3>Интерфейс для стэка у карт.</h3>
 */
export interface IStack {
    readonly variants?: SuitPropertyTypes<IVariant>;
    readonly config?: IConfig;
    readonly playerId?: number;
}

/**
 * <h3>Интерфейс для параметров отрисовки игрового поля.</h3>
 */
export interface IDrawBoardOptions {
    readonly boardCols: number;
    readonly lastBoardCol: number;
    readonly boardRows: number;
}

/**
 * <h3>Интерфейс "средней" карты фракции.</h3>
 */
export interface IAverageSuitCardData {
    readonly players: number;
    readonly tier: number;
}

/**
 * <h3>Интерфейс для данных бота.</h3>
 */
export interface IBotData {
    readonly allCoinsOrder: number[][];
    readonly allPicks: number[][];
    readonly maxIter: number;
    readonly deckLength: number;
}

/**
 * <h3>Интерфейс для возможных мувов у ботов.</h3>
 */
export interface IMoves {
    readonly move: string;
    readonly args: MoveArgsTypes;
}

/**
 * <h3>Интерфейс для данных карт лагеря артефакт.</h3>
 */
export interface IArtefact extends PartialBy<Omit<IArtefactCampCard, `game` | `type` | `path`>, `suit` | `rank`
    | `points`> {
    readonly scoringRule: (G?: IMyGameState, player?: IPublicPlayer) => number;
}

/**
 * <h3>Интерфейс для карты лагеря артефакта.</h3>
 */
export interface IArtefactCampCard extends IBasicSuitableNullableCardInfo, ISecondaryCardInfo, ICardWithActionInfo {
    readonly type: RusCardTypes.ARTEFACT;
    readonly name: ArtefactNames;
}

/**
 * <h3>Интерфейс для конфига данных карт лагеря артефакт.</h3>
 */
export interface IArtefactConfig {
    readonly Brisingamens: IArtefact;
    readonly Draupnir: IArtefact;
    readonly Fafnir_Baleygr: IArtefact;
    readonly Gjallarhorn: IArtefact;
    readonly Hofud: IArtefact;
    readonly Hrafnsmerki: IArtefact;
    readonly Jarnglofi: IArtefact;
    readonly Megingjord: IArtefact;
    readonly Mjollnir: IArtefact;
    readonly Odroerir_The_Mythic_Cauldron: IArtefact;
    readonly Svalinn: IArtefact;
    readonly Vegvisir: IArtefact;
    readonly Vidofnir_Vedrfolnir: IArtefact;
}

export interface IBasicSuitableNullableCardInfo {
    readonly suit: SuitTypes | null;
    readonly rank: number | null;
    readonly points: number | null;
}

export interface IBasicSuitableCardInfo extends Pick<IBasicSuitableNullableCardInfo, `points`> {
    readonly suit: NonNullable<IBasicSuitableNullableCardInfo[`suit`]>;
    readonly rank: NonNullable<IBasicSuitableNullableCardInfo[`rank`]>;
}

export interface ISecondaryCardInfo {
    readonly tier: number;
    readonly path: string;
    readonly game: GameNames;
}

export interface ICardWithActionInfo {
    readonly description: string;
    readonly buff?: IBuff;
    readonly validators?: IValidatorsConfig;
    readonly actions?: IAction;
    readonly stack?: IStack[];
}

/**
 * <h3>Интерфейс для карты лагеря наёмника.</h3>
 */
export interface IMercenaryCampCard extends ISecondaryCardInfo {
    // TODO Rework all cards name in Enums
    readonly name: string;
    readonly type: RusCardTypes.MERCENARY;
    readonly variants: Partial<SuitPropertyTypes<IVariant>>;
}

/**
 * <h3>Интерфейс для карты наёмника на столе игрока.</h3>
 */
export interface IMercenaryPlayerCard extends IMercenary, ISecondaryCardInfo {
    readonly name: string;
    readonly type: RusCardTypes.MERCENARYPLAYERCARD;
    readonly variants: Partial<SuitPropertyTypes<IVariant>>;
}

/**
 * <h3>Интерфейс для бафа карт.</h3>
 */
export interface IBuff {
    readonly name: BuffTypes;
}

export interface IAdditionalCardsConfig {
    readonly ChiefBlacksmith: ICard;
}

/**
 * <h3>Интерфейс для карты дворфа.</h3>
 */
export interface ICard extends IBasicSuitableCardInfo, ISecondaryCardInfo {
    readonly name: string;
    readonly type: RusCardTypes.BASIC;
}

/**
 * <h3>Интерфейс для карты Двойник Ольвюна.</h3>
 */
export interface IOlwinDoubleNonPlacedCard {
    readonly name: CardNames.OlwinsDouble;
    readonly suit: SuitTypes | null;
}

/**
 * <h3>Интерфейс опций для создания монет.</h3>
 */
export interface IBuildCoinsOptions {
    readonly isInitial?: boolean,
    readonly players?: number;
    readonly count?: Partial<ICoin>[];
}

/**
 * <h3>Интерфейс для монеты.</h3>
 */
export interface ICoin {
    readonly isInitial: boolean;
    isOpened: boolean;
    readonly isTriggerTrading: boolean;
    readonly value: number;
}

/**
 * <h3>Интерфейс для конфига монет рынка.</h3>
 */
export interface IMarketCoinConfig extends Pick<ICoin, `value`> {
    readonly count: () => INumberValues;
}

export interface IActionFunctionWithParams {
    (G: IMyGameState, ctx: Ctx, ...params: AutoActionArgsTypes): void;
}

export interface IActionFunction {
    (G: IMyGameState, ctx: Ctx): void;
}

export interface IMoveFunction {
    (...args: ArgsTypes): void;
}

interface IExpansion {
    readonly active: boolean;
}

/**
 * <h3>Интерфейс для дополнений к игре.</h3>
 */
export interface IExpansions {
    readonly thingvellir: IExpansion;
}

/**
 * <h3>Интерфейс для логирования данных.</h3>
 */
export interface ILogData {
    readonly type: LogTypes;
    readonly value: string;
}

/**
 * <h3>Интерфейс для игровых пользовательских данных G.</h3>
 */
export interface IMyGameState {
    readonly multiplayer: boolean;
    readonly solo: boolean;
    soloGameDifficultyLevel: number | null;
    odroerirTheMythicCauldron: boolean;
    readonly odroerirTheMythicCauldronCoins: ICoin[];
    readonly averageCards: SuitPropertyTypes<ICard>;
    readonly botData: IBotData;
    readonly deckLength: [number, number];
    readonly campDeckLength: [number, number];
    explorerDistinctionCardId: number | null,
    readonly explorerDistinctionCards: DeckCardTypes[];
    readonly camp: CampCardTypes[];
    readonly secret: ISecret;
    readonly campNum: number;
    mustDiscardTavernCardJarnglofi: boolean | null;
    campPicked: boolean;
    currentTavern: number;
    readonly debug: boolean;
    readonly additionalCardsDeck: ICard[];
    readonly discardCampCardsDeck: DiscardCampCardTypes[];
    readonly discardCardsDeck: DiscardDeckCardTypes[];
    readonly distinctions: SuitPropertyTypes<DistinctionTypes>;
    drawProfit: string;
    readonly drawSize: number;
    exchangeOrder: (number | undefined)[];
    readonly expansions: IExpansions;
    readonly heroes: IHeroCard[];
    readonly heroesForSoloBot: IHeroCard[];
    readonly heroesForSoloGameDifficultyLevel: IHeroCard[];
    readonly log: boolean;
    readonly logData: ILogData[];
    readonly marketCoins: ICoin[];
    readonly marketCoinsUnique: ICoin[];
    readonly suitsNum: number;
    tavernCardDiscarded2Players: boolean;
    readonly taverns: TavernCardTypes[][];
    readonly tavernsNum: number;
    tierToEnd: number;
    readonly totalScore: number[];
    readonly players: IPlayers;
    readonly publicPlayers: IPublicPlayers;
    publicPlayersOrder: string[];
    readonly winner: number[];
}

/**
 * <h3>Интерфейс для следующей фазы.</h3>
 */
export interface INext {
    readonly next: string;
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
    readonly playersOrder: string[];
    readonly exchangeOrder: number[];
}

/**
 * <h3>Интерфейс для героя.</h3>
 */
export interface IHeroCard extends IBasicSuitableNullableCardInfo, Pick<ISecondaryCardInfo, `game`>,
    ICardWithActionInfo {
    readonly type: RusCardTypes.HERO;
    readonly name: HeroNames;
    active: boolean;
}

/**
 * <h3>Интерфейс для данных карты героя.</h3>
 */
export interface IHeroData extends PartialBy<Omit<IHeroCard, `type` | `active`>, `suit` | `rank` | `points`> {
    readonly scoringRule: (G?: IMyGameState, playerId?: number) => number;
}

/**
 * <h3>Интерфейс для конфига карт героев.</h3>
 */
export interface IHeroConfig {
    readonly Kraal: IHeroData;
    readonly Tarah: IHeroData;
    readonly Aral: IHeroData;
    readonly Dagda: IHeroData;
    readonly Lokdur: IHeroData;
    readonly Zoral: IHeroData;
    readonly Aegur: IHeroData;
    readonly Bonfur: IHeroData;
    readonly Hourya: IHeroData;
    readonly Idunn: IHeroData;
    readonly Astrid: IHeroData;
    readonly Dwerg_Aesir: IHeroData;
    readonly Dwerg_Bergelmir: IHeroData;
    readonly Dwerg_Jungir: IHeroData;
    readonly Dwerg_Sigmir: IHeroData;
    readonly Dwerg_Ymir: IHeroData;
    readonly Grid: IHeroData;
    readonly Skaa: IHeroData;
    readonly Thrud: IHeroData;
    readonly Uline: IHeroData;
    readonly Ylud: IHeroData;
    readonly Jarika: IHeroData;
    readonly Crovax_The_Doppelganger: IHeroData;
    readonly Andumia: IHeroData;
    readonly Holda: IHeroData;
    readonly Khrad: IHeroData;
    readonly Olwin: IHeroData;
    readonly Zolkur: IHeroData;
}

/**
 * <h3>Интерфейс для условия карты героя.</h3>
 */
interface ICondition {
    readonly suit: SuitTypes;
    readonly value: number;
}

/**
 * <h3>Интерфейс для условий карты героя.</h3>
 */
export interface IConditions {
    readonly suitCountMin: ICondition;
}

interface IDiscardCard {
    readonly suit: SuitTypes | null;
    readonly number?: number;
}

/**
 * <h3>Интерфейс для конфига валидаторов героев.</h3>
 */
export interface IValidatorsConfig {
    readonly conditions?: IConditions;
    readonly discardCard?: IDiscardCard;
    readonly pickCampCardToStack?: Record<string, never>;
    readonly pickDiscardCardToStack?: Record<string, never>;
}

export interface IMoveArgumentsStage<T> {
    readonly args: T;
}

export interface IMoveCoinsArguments {
    readonly coinId: number;
    readonly type: CoinTypes;
}

/**
 * <h3>Интерфейс для выбранного аргумента мувов с фракциями для ботов.</h3>
 */
export interface IMoveSuitCardCurrentId {
    readonly cardId: number;
    readonly suit: SuitTypes;
}

export interface IMoveCardPlayerCurrentId {
    readonly cardId: number;
    readonly playerId: number;
}

export interface IMoveCardIdPlayerIdArguments {
    readonly playerId: number;
    readonly cards: number[];
}

/**
 * <h3>Интерфейс для возможных валидаторов у мувов.</h3>
 */
export interface IMoveBy {
    readonly placeCoins: IMoveByPlaceCoinsOptions;
    readonly placeCoinsUline: IMoveByPlaceCoinsUlineOptions;
    readonly pickCards: IMoveByPickCardsOptions;
    readonly enlistmentMercenaries: IMoveByEnlistmentMercenariesOptions;
    readonly endTier: IMoveByEndTierOptions;
    readonly getDistinctions: IMoveByGetDistinctionsOptions;
    readonly brisingamensEndGame: IMoveByBrisingamensEndGameOptions;
    readonly getMjollnirProfit: IMoveByGetMjollnirProfitOptions;
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPlaceCoinsOptions {
    readonly default1: IMoveValidator;
    readonly default2: IMoveValidator;
    readonly default3: IMoveValidator;
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPlaceCoinsUlineOptions {
    readonly default1: IMoveValidator;
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPickCardsOptions {
    readonly default1: IMoveValidator;
    readonly default2: IMoveValidator;
    // start
    readonly addCoinToPouch: IMoveValidator;
    readonly discardBoardCard: IMoveValidator;
    readonly discardSuitCard: IMoveValidator;
    readonly pickCampCardHolda: IMoveValidator;
    readonly pickConcreteCoinToUpgrade: IMoveValidator;
    readonly pickDiscardCard: IMoveValidator;
    readonly pickHero: IMoveValidator;
    readonly placeOlwinCards: IMoveValidator;
    readonly placeThrudHero: IMoveValidator;
    readonly upgradeCoin: IMoveValidator;
    readonly upgradeVidofnirVedrfolnirCoin: IMoveValidator;
    // end
    readonly discardCard: IMoveValidator;
    readonly placeTradingCoinsUline: IMoveValidator;
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByEnlistmentMercenariesOptions {
    readonly default1: IMoveValidator;
    readonly default2: IMoveValidator;
    readonly default3: IMoveValidator;
    readonly default4: IMoveValidator;
    // start
    readonly addCoinToPouch: IMoveValidator;
    readonly discardBoardCard: IMoveValidator;
    readonly discardSuitCard: IMoveValidator;
    readonly pickCampCardHolda: IMoveValidator;
    readonly pickConcreteCoinToUpgrade: IMoveValidator;
    readonly pickDiscardCard: IMoveValidator;
    readonly pickHero: IMoveValidator;
    readonly placeOlwinCards: IMoveValidator;
    readonly placeThrudHero: IMoveValidator;
    readonly upgradeCoin: IMoveValidator;
    readonly upgradeVidofnirVedrfolnirCoin: IMoveValidator;
    // end
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByEndTierOptions {
    readonly default1: IMoveValidator;
    // start
    readonly addCoinToPouch: IMoveValidator;
    readonly discardBoardCard: IMoveValidator;
    readonly discardSuitCard: IMoveValidator;
    readonly pickCampCardHolda: IMoveValidator;
    readonly pickConcreteCoinToUpgrade: IMoveValidator;
    readonly pickDiscardCard: IMoveValidator;
    readonly pickHero: IMoveValidator;
    readonly placeOlwinCards: IMoveValidator;
    readonly placeThrudHero: IMoveValidator;
    readonly upgradeCoin: IMoveValidator;
    readonly upgradeVidofnirVedrfolnirCoin: IMoveValidator;
    // end
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByGetDistinctionsOptions {
    readonly default1: IMoveValidator;
    // start
    readonly addCoinToPouch: IMoveValidator;
    readonly discardBoardCard: IMoveValidator;
    readonly discardSuitCard: IMoveValidator;
    readonly pickCampCardHolda: IMoveValidator;
    readonly pickConcreteCoinToUpgrade: IMoveValidator;
    readonly pickDiscardCard: IMoveValidator;
    readonly pickHero: IMoveValidator;
    readonly placeOlwinCards: IMoveValidator;
    readonly placeThrudHero: IMoveValidator;
    readonly upgradeCoin: IMoveValidator;
    readonly upgradeVidofnirVedrfolnirCoin: IMoveValidator;
    // end
    readonly pickDistinctionCard: IMoveValidator;
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByBrisingamensEndGameOptions {
    readonly default1: IMoveValidator;
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByGetMjollnirProfitOptions {
    readonly default1: IMoveValidator;
}

/**
 * <h3>Интерфейс для валидатора мувов.</h3>
 */
export interface IMoveValidator {
    readonly getRange: (G?: IMyGameState, ctx?: Ctx, playerId?: number) => MoveValidatorGetRangeTypes;
    readonly getValue: (G: IMyGameState, ctx: Ctx, moveRangeData: MoveValidatorGetRangeTypes) =>
        ValidMoveIdParamTypes;
    readonly moveName: MoveNames;
    readonly validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes) => boolean;
}

/**
 * <h3>Интерфейс для объекта валидаторов мувов.</h3>
 */
export interface IMoveValidators {
    readonly BotsPlaceAllCoinsMoveValidator: IMoveValidator;
    readonly ClickBoardCoinMoveValidator: IMoveValidator;
    readonly ClickCampCardMoveValidator: IMoveValidator;
    readonly ClickCardMoveValidator: IMoveValidator;
    readonly ClickCardToPickDistinctionMoveValidator: IMoveValidator;
    readonly ClickDistinctionCardMoveValidator: IMoveValidator;
    readonly ClickHandCoinMoveValidator: IMoveValidator;
    readonly ClickHandCoinUlineMoveValidator: IMoveValidator;
    readonly ClickHandTradingCoinUlineMoveValidator: IMoveValidator;
    readonly DiscardCardFromPlayerBoardMoveValidator: IMoveValidator;
    readonly DiscardCard2PlayersMoveValidator: IMoveValidator;
    readonly GetEnlistmentMercenariesMoveValidator: IMoveValidator;
    readonly GetMjollnirProfitMoveValidator: IMoveValidator;
    readonly PassEnlistmentMercenariesMoveValidator: IMoveValidator;
    readonly PlaceEnlistmentMercenariesMoveValidator: IMoveValidator;
    readonly PlaceYludHeroMoveValidator: IMoveValidator;
    readonly StartEnlistmentMercenariesMoveValidator: IMoveValidator;
    // start
    readonly AddCoinToPouchMoveValidator: IMoveValidator;
    readonly ClickCampCardHoldaMoveValidator: IMoveValidator;
    readonly PickConcreteCoinToUpgradeMoveValidator: IMoveValidator;
    readonly ClickCoinToUpgradeMoveValidator: IMoveValidator;
    readonly ClickHeroCardMoveValidator: IMoveValidator;
    readonly DiscardCardMoveValidator: IMoveValidator;
    readonly DiscardSuitCardFromPlayerBoardMoveValidator: IMoveValidator;
    readonly PickDiscardCardMoveValidator: IMoveValidator;
    readonly PlaceOlwinCardMoveValidator: IMoveValidator;
    readonly PlaceThrudHeroMoveValidator: IMoveValidator;
    readonly UpgradeCoinVidofnirVedrfolnirMoveValidator: IMoveValidator;
    // end
}

/**
 * <h3>Интерфейс для числовых индексов и массивов числовых значений.</h3>
 */
export interface INumberArrayValues {
    readonly [index: number]: number[];
}

/**
 * <h3>Интерфейс для числовых индексов и числовых значений.</h3>
 */
export interface INumberValues {
    [index: number]: number;
}

/**
 * <h3>Интерфейс для значений очков карт.</h3>
 */
export interface IPointsValues {
    readonly [index: number]: INumberValues | INumberArrayValues;
}

/**
 * <h3>Интерфейс для видов бафов у карт.</h3>
 */
export interface IBuffs {
    readonly discardCardEndGame?: true;
    readonly endTier?: true;
    readonly everyTurn?: true;
    readonly getMjollnirProfit?: true;
    readonly goCamp?: true;
    readonly goCampOneTime?: true;
    readonly noHero?: true;
    readonly suitIdForMjollnir?: SuitTypes;
    readonly upgradeCoin?: true;
    readonly upgradeNextCoin?: true;
}

/**
 * <h3>Интерфейс для публичных данных игрока.</h3>
 */
export interface IPublicPlayer {
    actionsNum: number;
    readonly nickname: string;
    readonly cards: SuitPropertyTypes<PlayerCardsType[]>;
    readonly heroes: IHeroCard[];
    readonly campCards: CampDeckCardTypes[];
    readonly handCoins: PublicPlayerCoinTypes[];
    readonly boardCoins: PublicPlayerCoinTypes[];
    stack: IStack[];
    priority: IPriority;
    readonly buffs: IBuffs[];
    selectedCoin: number | null;
    pickedCard: PickedCardType;
}

/**
 * <h3>Интерфейс для приватных данных игрока.</h3>
 */
export interface IPlayer {
    handCoins: CoinType[];
    readonly boardCoins: CoinType[];
}

/**
 * <h3>Интерфейс для объекта; хранящего скрытые (secret) данные всех игроков.</h3>
 */
export interface IPlayers {
    [index: number]: IPlayer;
}

/**
 * <h3>Интерфейс для объекта; хранящего открытые данные всех игроков.</h3>
 */
export interface IPublicPlayers {
    [index: number]: IPublicPlayer;
}

/**
 * <h3>Интерфейс для конфига всех кристаллов.</h3>
 */
export interface IPrioritiesConfig {
    readonly [index: number]: IPriority[];
}

/**
 * <h3>Интерфейс для кристалла.</h3>
 */
export interface IPriority {
    readonly isExchangeable: boolean;
    readonly value: number;
}

/**
 * <h3>Интерфейс для отрисовки бэкграунда в стилях.</h3>
 */
export interface IBackground {
    readonly background: string;
}

/**
 * <h3>Интерфейс для всех стилей.</h3>
 */
export interface IStyles {
    readonly Camp: () => IBackground;
    readonly CampBack: (tier: number) => IBackground;
    readonly CampCards: (tier: number, cardPath: string) => IBackground;
    readonly CardBack: (tier: number) => IBackground;
    readonly Cards: (suit: SuitTypes | null, name: string, points: number | null) => IBackground;
    readonly Coin: (value: number, initial: boolean) => IBackground;
    readonly CoinSmall: (value: number, initial: boolean) => IBackground;
    readonly CoinBack: () => IBackground;
    readonly Distinctions: (distinction: SuitTypes) => IBackground;
    readonly DistinctionsBack: () => IBackground;
    readonly Exchange: () => IBackground;
    readonly Heroes: (game: GameNames, heroName: HeroNames) => IBackground;
    readonly HeroBack: () => IBackground;
    readonly Priorities: (priority: number) => IBackground;
    readonly Priority: () => IBackground;
    readonly Suits: (suit: SuitTypes) => IBackground;
    readonly Taverns: (tavernId: number) => IBackground;
}

/**
 * <h3>Интерфейс для фракций.</h3>
 */
export interface ISuit {
    readonly suit: SuitTypes;
    readonly suitName: RusSuitNames;
    readonly suitColor: string;
    readonly description: string;
    readonly pointsValues: () => IPointsValues;
    readonly scoringRule: (cards: PlayerCardsType[], potentialCardValue?: number) => number;
    readonly distinction: IDistinction;
}

export interface IDistinction {
    readonly description: string;
    readonly awarding: (G: IMyGameState, ctx: Ctx, playerId: number) => number;
}

/**
 * <h3>Интерфейс для конфига фракций.</h3>
 */
export interface ISuitConfig {
    readonly warrior: ISuit;
    readonly hunter: ISuit;
    readonly miner: ISuit;
    readonly blacksmith: ISuit;
    readonly explorer: ISuit;
}

/**
 * <h3>Интерфейс для конфига конкретной таверны.</h3>
 */
export interface ITavernInConfig {
    readonly name: TavernNames;
}

/**
 * <h3>Интерфейс для конфига всех таверн.</h3>
 */
export interface ITavernsConfig {
    readonly [index: number]: ITavernInConfig;
}

/**
 * <h3>Типы данных для лагеря.</h3>
 */
export type CampCardTypes = CampDeckCardTypes | null;

/**
 * <h3>Типы данных для карт колоды лагеря.</h3>
 */
export type CampDeckCardTypes = IArtefactCampCard | IMercenaryCampCard;

export type ClosedCoinType = Record<string, never>;

export type PublicPlayerCoinTypes = CoinType | ClosedCoinType;

/**
 * <h3>Типы данных для дек карт.</h3>
 */
export type DeckCardTypes = ICard | IActionCard;

/**
 * <h3>Типы данных для карт колоды сброса.</h3>
 */
export type DiscardDeckCardTypes = DeckCardTypes;

export type DiscardCampCardTypes = CampDeckCardTypes | IMercenaryPlayerCard;

export type CardsHasStack = IHeroCard | IArtefactCampCard | IActionCard;

export type CardsHasStackValidators = IHeroCard | IArtefactCampCard;

/**
 * <h3>Типы данных для карт выбранных игроком.</h3>
 */
export type PickedCardType = DeckCardTypes | CampDeckCardTypes | IHeroCard | IMercenaryPlayerCard
    | IOlwinDoubleNonPlacedCard | null;

/**
 * <h3>Типы данных для карт на планшете игрока.</h3>
 */
export type PlayerCardsType = ICard | IArtefactCampCard | IHeroCard | IMercenaryPlayerCard;

/**
 * <h3>Типы данных для карт таверн.</h3>
 */
export type TavernCardTypes = DeckCardTypes | null;

export type AllCardTypes = DeckCardTypes | CampDeckCardTypes | IHeroCard | IMercenaryPlayerCard;

/**
 * <h3>Типы данных для монет на столе или в руке.</h3>
 */
export type CoinType = ICoin | null;

export type IActionFunctionTypes = IActionFunction | IActionFunctionWithParams;

export type IMoveFunctionTypes = IMoveFunction | null;

export type BuffTypes = keyof IBuffs;

export type IArtefactTypes = keyof IArtefactConfig;

export type IHeroTypes = keyof IHeroConfig;

export type AdditionalCardTypes = keyof IAdditionalCardsConfig;

export type MoveValidatorGetRangeTypes = IMoveArgumentsStage<Partial<SuitPropertyTypes<number[]>>>[`args`]
    | IMoveArgumentsStage<IMoveCardIdPlayerIdArguments>[`args`]
    | IMoveArgumentsStage<number[][]>[`args`]
    | IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]
    | IMoveArgumentsStage<null>[`args`]
    | IMoveArgumentsStage<number[]>[`args`]
    | IMoveArgumentsStage<SuitTypes[]>[`args`];

export type ValidMoveIdParamTypes = number | SuitTypes | number[] | IMoveSuitCardCurrentId
    | IMoveCardPlayerCurrentId | IMoveCoinsArguments | null;

export type SuitTypes = keyof ISuitConfig;

export type ExpansionTypes = keyof IExpansions;

export type SuitPropertyTypes<Type> = {
    [Property in SuitTypes]: Type;
};

/**
 * <h3>Типы данных для остаточных аргументов функций.</h3>
 */
export type ArgsTypes = (CoinTypes | SuitTypes | number)[];

export type AutoActionArgsTypes = [number] | [number, number, CoinTypes];

/**
 * <h3>Типы данных для преимуществ.</h3>
 */
export type DistinctionTypes = string | null | undefined;

export type MoveArgsTypes = number[][] | [SuitTypes] | [number] | [SuitTypes, number] | [number, CoinTypes];

/**
 * <h3>Тип для создания карты улучшения монеты.</h3>
 */
export type ICreateActionCard = PartialBy<IActionCard, `type`>;

/**
 * <h3>Тип для создания карты лагеря артефакта.</h3>
 */
export type ICreateArtefactCampCard = PartialBy<IArtefactCampCard, `game` | `points` | `rank` | `suit` | `type`>;

/**
 * <h3>Тип для создания карты лагеря наёмника.</h3>
 */
export type ICreateMercenaryCampCard = PartialBy<IMercenaryCampCard, `game` | `type`>;

/**
 * <h3>Тип для создания карты наёмника на столе игрока.</h3>
 */
export type ICreateMercenaryPlayerCard = PartialBy<IMercenaryPlayerCard, `game` | `rank` | `type`>;

/**
 * <h3>Тип для создания карты дворфа.</h3>
 */
export type ICreateCard = PartialBy<ICard, `rank` | `type` | `tier` | `path`>;

/**
 * <h3>Тип для создания героя.</h3>
 */
export type ICreateHero = PartialBy<Omit<IHeroCard, `active`>
    & ReadonlyBy<IHeroCard, `active`>, `type` | `suit` | `rank` | `points` | `active`>;

/**
 * <h3>Тип для создания карты Двойник Ольвюна.</h3>
 */
export type ICreateOlwinDoubleNonPlacedCard = PartialBy<IOlwinDoubleNonPlacedCard, `name`>;

/**
 * <h3>Тип для создания монеты.</h3>
 */
export type ICreateCoin =
    PartialBy<Omit<ICoin, `isOpened`> & ReadonlyBy<ICoin, `isOpened`>, `isInitial` | `isOpened` | `isTriggerTrading`>;

/**
* <h3>Тип для конфига базовых монет.</h3>
*/
export type IInitialTradingCoinConfig = Pick<ICoin, `isTriggerTrading` | `value`>;

/**
 * <h3>Тип для создания кристалла.</h3>
 */
export type ICreatePriority = PartialBy<IPriority, `isExchangeable`>;

/**
 * <h3>Тип для данных карт лагеря наёмник.</h3>
 */
export type IMercenary = IBasicSuitableCardInfo;

/**
 * <h3>Тип для варианта карты героя.</h3>
 */
export type IVariant = IBasicSuitableCardInfo;

/**
 * <h3>Тип для создания публичных данных игрока.</h3>
 */
export type ICreatePublicPlayer =
    PartialBy<Omit<IPublicPlayer, `actionsNum` | `pickedCard` | `priority` | `selectedCoin` | `stack`>
        & ReadonlyBy<IPublicPlayer, `actionsNum` | `pickedCard` | `priority` | `selectedCoin` | `stack`>,
        `actionsNum` | `heroes` | `campCards` | `stack` | `buffs` | `selectedCoin` | `pickedCard`>;

export type ISoloGameDifficultyLevelHeroesConfig =
    Pick<IHeroConfig, `Astrid` | `Grid` | `Skaa` | `Thrud` | `Uline` | `Ylud`>;

export type ISoloGameHeroesForBotConfig =
    Pick<IHeroConfig, `Dwerg_Aesir` | `Dwerg_Bergelmir` | `Dwerg_Jungir` | `Dwerg_Sigmir` | `Dwerg_Ymir`>;

export type ISoloGameHeroesForPlayerConfig = Pick<IHeroConfig, `Kraal` | `Tarah` | `Aral` | `Dagda` | `Lokdur`
    | `Zoral` | `Aegur` | `Bonfur` | `Hourya` | `Idunn`>;

// My Utilities types
/**
 * <h3>Тип для того, чтобы сделать некоторые поля объекта опциональными.</h3>
 */
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * <h3>Тип для того, чтобы сделать некоторые поля объекта только для чтения.</h3>
 */
type ReadonlyBy<T, K extends keyof T> = Omit<T, K> & Readonly<Pick<T, K>>;
