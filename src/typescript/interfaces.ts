import type { Ctx } from "boardgame.io";
import { ArtefactNames, CoinTypeNames, ConfigNames, DrawNames, GameNames, GiantNames, GodNames, HeroNames, LogTypeNames, MoveNames, MultiSuitCardNames, MythicalAnimalNames, RoyalOfferingNames, RusCardTypeNames, RusSuitNames, SpecialCardNames, StageNames, TavernNames, ValkyryNames } from "./enums";

export interface ISecret {
    readonly campDecks: CampDeckCardTypes[][];
    readonly decks: DeckCardTypes[][];
    mythologicalCreatureDecks: MythologicalCreatureDeckCardTypes[];
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
    readonly G: Partial<Record<keyof IMyGameState, IMyGameState[keyof IMyGameState]>>;
    readonly ctx: Record<string, unknown>;
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
 * <h3>Интерфейс для конфига карты Бога.</h3>
 */
export interface IGodConfig {
    readonly Freyja: IGodData;
    readonly Frigg: IGodData;
    readonly Loki: IGodData;
    readonly Odin: IGodData;
    readonly Thor: IGodData;
}

/**
 * <h3>Интерфейс для данных карты Бога.</h3>
 */
export interface IGodData extends Omit<IGodCard, `type` | `isPowerTokenUsed`> {
    readonly godPower: () => void;
}

/**
 * <h3>Интерфейс для карты Бога.</h3>
 */
export interface IGodCard {
    readonly name: GodNames;
    readonly points: number;
    readonly type: RusCardTypeNames.God_Card;
    isPowerTokenUsed: CanBeNull<boolean>;
}

/**
 * <h3>Интерфейс для конфига карты Гиганта.</h3>
 */
export interface IGiantConfig {
    readonly Gymir: IGiantData;
    readonly Hrungnir: IGiantData;
    readonly Skymir: IGiantData;
    readonly Surt: IGiantData;
    readonly Thrivaldi: IGiantData;
}

/**
 * <h3>Интерфейс для данных карты Гиганта.</h3>
 */
export interface IGiantData extends Omit<IGiantCard, `type` | `capturedCard`> {
    readonly actions?: IAction;
    readonly scoringRule: (player?: IPublicPlayer, giantName?: GiantNames) => number;
}

/**
 * <h3>Интерфейс для карты Гиганта.</h3>
 */
export interface IGiantCard {
    readonly name: GiantNames;
    readonly type: RusCardTypeNames.Giant_Card;
    readonly placedSuit: SuitTypes;
    capturedCard: CanBeNull<IDwarfCard>;
}

/**
 * <h3>Интерфейс для конфига карты Мистическое животное.</h3>
 */
export interface IMythicalAnimalConfig {
    readonly Durathor: IMythicalAnimalData;
    readonly Garm: IMythicalAnimalData;
    readonly Hraesvelg: IMythicalAnimalData;
    readonly Nidhogg: IMythicalAnimalData;
    readonly Ratatosk: IMythicalAnimalData;
}

/**
 * <h3>Интерфейс для данных карты Мистическое животное.</h3>
 */
export interface IMythicalAnimalData extends PartialBy<Omit<IMythicalAnimalCard, `type`>, `rank` | `points`> {
    readonly buff?: IBuff;
    readonly scoringRule?: (player: IPublicPlayer, mythicalAnimalName: MythicalAnimalNames) => number;
    readonly ability?: () => void;
}

/**
 * <h3>Интерфейс для карты Мистическое животное.</h3>
 */
export interface IMythicalAnimalCard extends IBasicSuitableCardInfo {
    readonly name: MythicalAnimalNames;
    readonly type: RusCardTypeNames.Mythical_Animal_Card;
}

/**
 * <h3>Интерфейс для конфига карты Валькирия.</h3>
 */
export interface IValkyryConfig {
    readonly Brynhildr: IValkyryData;
    readonly Hildr: IValkyryData;
    readonly Olrun: IValkyryData;
    readonly Sigrdrifa: IValkyryData;
    readonly Svafa: IValkyryData;
}

/**
 * <h3>Интерфейс для данных карты Валькирия.</h3>
 */
export interface IValkyryData extends Omit<IValkyryCard, `type` | `strengthTokenNotch`> {
    readonly buff: IBuff;
    readonly scoringRule: (strengthTokenNotch: number, valkyryName: ValkyryNames) => number;
}

/**
 * <h3>Интерфейс для карты Валькирия.</h3>
 */
export interface IValkyryCard {
    readonly name: ValkyryNames;
    readonly type: RusCardTypeNames.Valkyry_Card;
    strengthTokenNotch: CanBeNull<number>;
}

/**
 * <h3>Интерфейс для конфига особой карты.</h3>
 */
export interface ISpecialCardsConfig {
    readonly ChiefBlacksmith: SpecialCardDataType;
}

/**
 * <h3>Интерфейс для особой карты.</h3>
 */
export interface ISpecialCard extends IBasicSuitableCardInfo {
    readonly type: RusCardTypeNames.Special_Card;
    readonly name: SpecialCardNames.ChiefBlacksmith;
}

/**
 * <h3>Интерфейс для конфига мультифракционной карты.</h3>
 */
export interface IMultiCardsConfig {
    readonly Gullinbursti: MultiSuitCardDataType;
    readonly OlwinsDouble: MultiSuitCardDataType;
}

/**
 * <h3>Интерфейс для мультифракционной карты.</h3>
 */
export interface IMultiSuitCard {
    readonly type: RusCardTypeNames.Multi_Suit_Card;
    readonly name: MultiSuitCardNames;
}

/**
 * <h3>Интерфейс для мультифракционной карты на поле игрока.</h3>
 */
export interface IMultiSuitPlayerCard extends IBasicSuitableCardInfo {
    readonly type: RusCardTypeNames.Multi_Suit_Player_Card;
    readonly name: MultiSuitCardNames;
}

/**
 * <h3>Интерфейс для конфига карт королевских наград.</h3>
 */
export interface IRoyalOfferingCardConfig extends Pick<IRoyalOfferingCard, `stack` | `value` | `name`> {
    readonly amount: () => IRoyalOfferingCardValues;
}

/**
 * <h3>Интерфейс для карты улучшения монеты.</h3>
 */
export interface IRoyalOfferingCard {
    readonly name: RoyalOfferingNames;
    readonly stack: IStack[];
    readonly type: RusCardTypeNames.Royal_Offering_Card;
    readonly value: number;
}

/**
 * <h3>Интерфейс для значения на которое обновляется монета.</h3>
 */
export interface IRoyalOfferingCardValues {
    readonly [index: number]: INumberValues;
}

/**
 * <h3>Интерфейс для конфига данных карт лагеря артефакт.</h3>
 */
export interface IArtefactConfig {
    readonly Brisingamens: IArtefactData;
    readonly Draupnir: IArtefactData;
    readonly Fafnir_Baleygr: IArtefactData;
    readonly Gjallarhorn: IArtefactData;
    readonly Hofud: IArtefactData;
    readonly Hrafnsmerki: IArtefactData;
    readonly Jarnglofi: IArtefactData;
    readonly Megingjord: IArtefactData;
    readonly Mjollnir: IArtefactData;
    readonly Odroerir_The_Mythic_Cauldron: IArtefactData;
    readonly Svalinn: IArtefactData;
    readonly Vegvisir: IArtefactData;
    readonly Vidofnir_Vedrfolnir: IArtefactData;
}

/**
 * <h3>Интерфейс для данных карт лагеря артефакт.</h3>
 */
export interface IArtefactData extends ISecondaryCardInfo,
    PartialBy<Omit<IArtefactCampCard, `type` | `path`>, `suit` | `rank` | `points`> {
    readonly scoringRule: (G?: IMyGameState, player?: IPublicPlayer, artefactName?: ArtefactNames) => number;
}

/**
 * <h3>Интерфейс для карты лагеря артефакта.</h3>
 */
export interface IArtefactCampCard extends IBasicSuitableNullableCardInfo, ICampCardInfo,
    ICardWithActionInfo {
    readonly type: RusCardTypeNames.Artefact_Card;
    readonly name: ArtefactNames;
}

/**
 * <h3>Интерфейс для карты лагеря наёмника.</h3>
 */
export interface IMercenaryCampCard extends ICampCardInfo {
    // TODO Rework all cards name in Enums
    readonly name: string;
    readonly type: RusCardTypeNames.Mercenary_Card;
    readonly variants: Partial<SuitPropertyTypes<VariantType>>;
}

/**
 * <h3>Интерфейс для карты наёмника на столе игрока.</h3>
 */
export interface IMercenaryPlayerCard extends MercenaryType, ICampCardInfo {
    // TODO Rework all cards name in Enums
    readonly name: string;
    readonly type: RusCardTypeNames.Mercenary_Player_Card;
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
 * <h3>Интерфейс для данных карты героя.</h3>
 */
export interface IHeroData extends PartialBy<Omit<IHeroCard, `type` | `active`>, `suit` | `rank` | `points`>,
    IExpansionCardInfo {
    readonly scoringRule: (player?: IPublicPlayer, heroName?: HeroNames) => number;
}

/**
 * <h3>Интерфейс для карты героя.</h3>
 */
export interface IHeroCard extends IBasicSuitableNullableCardInfo, ICardWithActionInfo {
    readonly type: RusCardTypeNames.Hero_Card;
    readonly name: HeroNames;
    active: boolean;
}

/**
 * <h3>Интерфейс для карты героя на поле игрока.</h3>
 */
export interface IHeroPlayerCard extends IBasicSuitableCardInfo, Pick<ICardWithActionInfo, `description`> {
    readonly type: RusCardTypeNames.Hero_Player_Card;
    readonly name: HeroNames;
}

/**
 * <h3>Интерфейс для карты дворфа.</h3>
 */
export interface IDwarfCard extends IBasicSuitableCardInfo {
    // TODO Rework all cards name in Enums
    readonly name: string;
    readonly type: RusCardTypeNames.Dwarf_Card;
}

/**
 * <h3>Интерфейс для действия.</h3>
 */
export interface IAction {
    readonly name: string;
    readonly params?: AutoActionArgsTypes;
}

/**
 * <h3>Интерфейс для данных стека у карт.</h3>
 */
export interface IStackData {
    readonly addCoinToPouch: () => IStack;
    readonly brisingamensEndGameAction: () => IStack;
    readonly discardCardFromBoardBonfur: () => IStack;
    readonly discardCardFromBoardCrovaxTheDoppelganger: () => IStack;
    readonly discardCardFromBoardDagda: (pickedSuit?: SuitTypes) => IStack;
    readonly discardSuitCard: (playerId: number) => IStack;
    readonly discardSuitCardHofud: () => IStack;
    readonly discardTavernCard: () => IStack;
    readonly enlistmentMercenaries: () => IStack;
    readonly getDifficultyLevelForSoloMode: () => IStack;
    readonly getHeroesForSoloMode: () => IStack;
    readonly getDistinctions: () => IStack;
    readonly getMjollnirProfit: () => IStack;
    readonly pickCampCardHolda: () => IStack;
    readonly pickCard: () => IStack;
    readonly pickConcreteCoinToUpgrade: (coinValue: number, value: number) => IStack;
    readonly pickDiscardCardAndumia: () => IStack;
    readonly pickDiscardCardBrisingamens: (priority?: number) => IStack;
    readonly pickDistinctionCard: () => IStack;
    readonly pickDistinctionCardSoloBot: () => IStack;
    readonly placeMultiSuitsCards: (name: MultiSuitCardNames, pickedSuit?: SuitTypes, priority?: number) => IStack;
    readonly placeThrudHero: () => IStack;
    readonly placeTradingCoinsUline: () => IStack;
    readonly placeYludHero: () => IStack;
    readonly pickHero: () => IStack;
    readonly pickHeroSoloBot: () => IStack;
    readonly placeEnlistmentMercenaries: (card: IMercenaryCampCard) => IStack;
    readonly startOrPassEnlistmentMercenaries: () => IStack;
    readonly upgradeCoin: (value: number) => IStack;
    readonly upgradeCoinVidofnirVedrfolnir: (value: number, coinId?: number) => IStack;
    readonly upgradeCoinWarriorDistinction: () => IStack;
}

/**
 * <h3>Интерфейс для стека у карт.</h3>
 */
export interface IStack {
    priority?: number;
    readonly playerId?: number;
    readonly number?: number;
    readonly coinId?: number;
    readonly coinValue?: number;
    readonly suit?: SuitTypes;
    readonly pickedSuit?: SuitTypes;
    readonly value?: number;
    readonly configName?: ConfigNames;
    readonly drawName?: DrawNames;
    readonly stageName?: StageNames;
    readonly name?: StackNamesTypes;
    readonly card?: IMercenaryCampCard;
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
 * <h3>Интерфейс для количества игроков и эпох.</h3>
 */
export interface IPlayersNumberTierCardData {
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

export interface IBasicSuitableNullableCardInfo {
    readonly suit: CanBeNull<SuitTypes>;
    readonly rank: CanBeNull<number>;
    readonly points: CanBeNull<number>;
}

export interface IBasicSuitableCardInfo extends Pick<IBasicSuitableNullableCardInfo, `points`> {
    readonly suit: NonNullable<IBasicSuitableNullableCardInfo[`suit`]>;
    readonly rank: NonNullable<IBasicSuitableNullableCardInfo[`rank`]>;
}

export interface ICampCardInfo {
    readonly path: string;
}

export interface ISecondaryCardInfo {
    readonly tier: number;
}

export interface IExpansionCardInfo {
    readonly game: GameNames;
}

export interface ICardWithActionInfo {
    readonly description: string;
    readonly buff?: IBuff;
    readonly pickValidators?: IPickValidatorsConfig;
    readonly validators?: IValidatorsConfig;
    readonly actions?: IAction;
    readonly stack?: IStack[];
}

/**
 * <h3>Интерфейс для бафа карт.</h3>
 */
export interface IBuff {
    readonly name: BuffTypes;
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
    readonly idavoll: IExpansion;
}

/**
 * <h3>Интерфейс для логирования данных.</h3>
 */
export interface ILogData {
    readonly type: LogTypeNames;
    readonly value: string;
}

/**
 * <h3>Интерфейс для игровых пользовательских данных G.</h3>
 */
export interface IMyGameState {
    readonly multiplayer: boolean;
    readonly solo: boolean;
    soloGameDifficultyLevel: CanBeNull<number>;
    odroerirTheMythicCauldron: boolean;
    readonly odroerirTheMythicCauldronCoins: ICoin[];
    readonly averageCards: SuitPropertyTypes<IDwarfCard>;
    readonly botData: IBotData;
    readonly deckLength: [number, number];
    readonly campDeckLength: [number, number];
    mythologicalCreatureDeckLength: number;
    explorerDistinctionCardId: CanBeNull<number>,
    readonly explorerDistinctionCards: DeckCardTypes[];
    readonly camp: CampCardTypes[];
    readonly secret: ISecret;
    readonly campNum: number;
    mustDiscardTavernCardJarnglofi: CanBeNull<boolean>;
    campPicked: boolean;
    currentTavern: number;
    readonly debug: boolean;
    readonly multiCardsDeck: IMultiSuitCard[];
    readonly specialCardsDeck: ISpecialCard[];
    readonly discardCampCardsDeck: DiscardCampCardTypes[];
    readonly discardCardsDeck: DiscardDeckCardTypes[];
    readonly discardMythologicalCreaturesCards: MythologicalCreatureDeckCardTypes[];
    readonly discardMultiCards: IMultiSuitPlayerCard[];
    readonly discardSpecialCards: ISpecialCard[];
    readonly distinctions: SuitPropertyTypes<DistinctionTypes>;
    drawProfit: DrawProfitTypes;
    readonly drawSize: number;
    exchangeOrder: CanBeUndef<number>[];
    readonly expansions: IExpansions;
    readonly heroes: IHeroCard[];
    readonly heroesForSoloBot: IHeroCard[];
    heroesForSoloGameDifficultyLevel: CanBeNull<IHeroCard[]>;
    readonly log: boolean;
    readonly logData: ILogData[];
    readonly marketCoins: ICoin[];
    readonly marketCoinsUnique: ICoin[];
    round: number;
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
    readonly suit: CanBeNull<SuitTypes>;
    readonly number?: number;
}

/**
 * <h3>Интерфейс для возможных мувов у ботов.</h3>
 */
export interface IMoves {
    readonly move: MoveNames;
    readonly args: MoveArgsTypes;
}

export interface IMoveArgumentsStage<T> {
    readonly args: T;
}

export interface IMoveCoinsArguments {
    readonly coinId: number;
    readonly type: CoinTypeNames;
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
    readonly cards: number[];
    readonly playerId: number;
}

/**
 * <h3>Интерфейс для возможных валидаторов у мувов.</h3>
 */
export interface IMoveBy {
    readonly chooseDifficultySoloMode: IMoveByChooseDifficultySoloModeOptions;
    readonly bids: IMoveByPlaceCoinsOptions;
    readonly bidUline: IMoveByPlaceCoinsUlineOptions;
    readonly tavernsResolution: IMoveByPickCardsOptions;
    readonly enlistmentMercenaries: IMoveByEnlistmentMercenariesOptions;
    readonly placeYlud: IMoveByEndTierOptions;
    readonly troopEvaluation: IMoveByGetDistinctionsOptions;
    readonly brisingamensEndGame: IMoveByBrisingamensEndGameOptions;
    readonly getMjollnirProfit: IMoveByGetMjollnirProfitOptions;
}

export interface IMoveByChooseDifficultySoloModeOptions {
    readonly default1: IMoveValidator;
    readonly chooseHeroesForSoloMode: IMoveValidator;
    readonly upgradeCoin: IMoveValidator;
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPlaceCoinsOptions {
    readonly default1: IMoveValidator;
    readonly default2: IMoveValidator;
    readonly default3: IMoveValidator;
    readonly default4: IMoveValidator;
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPlaceCoinsUlineOptions {
    readonly default1: IMoveValidator;
}

export interface IMoveBySoloBotOptions {
    readonly pickHeroSoloBot: IMoveValidator;
}

interface IMoveByCommonOptions {
    readonly addCoinToPouch: IMoveValidator;
    readonly discardBoardCard: IMoveValidator;
    readonly discardSuitCard: IMoveValidator;
    readonly pickCampCardHolda: IMoveValidator;
    readonly pickConcreteCoinToUpgrade: IMoveValidator;
    readonly pickDiscardCard: IMoveValidator;
    readonly pickHero: IMoveValidator;
    readonly placeMultiSuitsCards: IMoveValidator;
    readonly placeThrudHero: IMoveValidator;
    readonly upgradeCoin: IMoveValidator;
    readonly upgradeVidofnirVedrfolnirCoin: IMoveValidator;
    readonly useGodPower: IMoveValidator;
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPickCardsOptions extends IMoveByCommonOptions, IMoveBySoloBotOptions {
    readonly default1: IMoveValidator;
    readonly default2: IMoveValidator;
    readonly discardCard: IMoveValidator;
    readonly placeTradingCoinsUline: IMoveValidator;
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByEnlistmentMercenariesOptions extends IMoveByCommonOptions {
    readonly default1: IMoveValidator;
    readonly default2: IMoveValidator;
    readonly default3: IMoveValidator;
    readonly placeEnlistmentMercenaries: IMoveValidator;
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByEndTierOptions extends IMoveByCommonOptions {
    readonly default1: IMoveValidator;
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByGetDistinctionsOptions extends IMoveByCommonOptions, IMoveBySoloBotOptions {
    readonly default1: IMoveValidator;
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
    // Bots
    readonly BotsPlaceAllCoinsMoveValidator: IMoveValidator;
    // Solo Bot
    readonly SoloBotPlaceAllCoinsMoveValidator: IMoveValidator;
    readonly SoloBotClickHeroCardMoveValidator: IMoveValidator;
    // Solo Mode
    readonly ChooseDifficultyLevelForSoloModeMoveValidator: IMoveValidator;
    readonly ChooseHeroesForSoloModeMoveValidator: IMoveValidator;
    // start
    readonly AddCoinToPouchMoveValidator: IMoveValidator;
    readonly ClickCampCardHoldaMoveValidator: IMoveValidator;
    readonly PickConcreteCoinToUpgradeMoveValidator: IMoveValidator;
    readonly ClickCoinToUpgradeMoveValidator: IMoveValidator;
    readonly ClickHeroCardMoveValidator: IMoveValidator;
    readonly DiscardCardMoveValidator: IMoveValidator;
    readonly DiscardSuitCardFromPlayerBoardMoveValidator: IMoveValidator;
    readonly PickDiscardCardMoveValidator: IMoveValidator;
    readonly PlaceMultiSuitCardMoveValidator: IMoveValidator;
    readonly PlaceThrudHeroMoveValidator: IMoveValidator;
    readonly UpgradeCoinVidofnirVedrfolnirMoveValidator: IMoveValidator;
    readonly UseGodPowerMoveValidator: IMoveValidator;
    // end
}

/**
 * <h3>Интерфейс для конфига валидаторов карт.</h3>
 */
export interface IValidatorsConfig {
    readonly pickCampCardToStack?: Record<string, never>;
    readonly pickDiscardCardToStack?: Record<string, never>;
}

/**
 * <h3>Интерфейс для конфига валидаторов выбора карт.</h3>
 */
export interface IPickValidatorsConfig {
    readonly conditions?: IConditions;
    readonly discardCard?: IDiscardCard;
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
    readonly countDistinctionAmount?: true;
    readonly countPickedHeroAmount?: true;
    readonly dagdaDiscardOnlyOneCards?: true;
    readonly discardCardEndGame?: true;
    readonly endTier?: true;
    readonly everyTurn?: true;
    readonly getMjollnirProfit?: true;
    readonly goCamp?: true;
    readonly goCampOneTime?: true;
    readonly moveThrud?: true;
    readonly noHero?: true;
    readonly ratatoskFinalScoring?: true;
    readonly suitIdForMjollnir?: SuitTypes;
    readonly upgradeCoin?: true;
    readonly upgradeNextCoin?: true;
}

/**
 * <h3>Интерфейс для публичных данных игрока.</h3>
 */
export interface IPublicPlayer {
    readonly nickname: string;
    readonly cards: SuitPropertyTypes<PlayerCardTypes[]>;
    readonly heroes: IHeroCard[];
    readonly campCards: CampDeckCardTypes[];
    readonly mythologicalCreatureCards: MythologicalCreatureCommandZoneCardTypes[];
    readonly handCoins: PublicPlayerCoinTypes[];
    readonly boardCoins: PublicPlayerCoinTypes[];
    readonly giantTokenSuits: SuitPropertyTypes<CanBeNull<boolean>>;
    stack: IStack[];
    priority: IPriority;
    readonly buffs: IBuffs[];
    selectedCoin: CanBeNull<number>;
}

/**
 * <h3>Интерфейс для приватных данных игрока.</h3>
 */
export interface IPlayer {
    handCoins: CoinTypes[];
    readonly boardCoins: CoinTypes[];
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
    readonly CampCards: (cardPath: string) => IBackground;
    readonly CardBack: (tier: number) => IBackground;
    readonly Cards: (suit: CanBeNull<SuitTypes>, name: string, points: CanBeNull<number>) => IBackground;
    readonly Coin: (value: number, initial: boolean) => IBackground;
    readonly CoinSmall: (value: number, initial: boolean) => IBackground;
    readonly CoinBack: () => IBackground;
    readonly Distinctions: (distinction: SuitTypes) => IBackground;
    readonly DistinctionsBack: () => IBackground;
    readonly Exchange: () => IBackground;
    readonly Heroes: (heroName: HeroNames) => IBackground;
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
    readonly scoringRule: (cards: PlayerCardTypes[], suit: SuitTypes, potentialCardValue?: number,
        additionalScoring?: boolean) => number;
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

export type DebugDrawDataType<T> = {
    readonly [K in keyof T]: T[K];
};

// TODO Rework to + Enlistment mercenaries names - string
export type StackNamesTypes = HeroNames | MultiSuitCardNames | string;

// TODO Idavoll
/**
 * <h3>Типы данных для дек карт Idavoll.</h3>
 */
export type MythologicalCreatureDeckCardTypes = IGodCard | IGiantCard | IValkyryCard | IMythicalAnimalCard;

/**
 * <h3>Типы данных для карт Idavoll в командной зоне игрока.</h3>
 */
export type MythologicalCreatureCommandZoneCardTypes = IGodCard | IGiantCard | IValkyryCard;

/**
 * <h3>Типы данных для лагеря.</h3>
 */
export type CampCardTypes = CanBeNull<CampDeckCardTypes>;

/**
 * <h3>Типы данных для карт колоды лагеря.</h3>
 */
export type CampDeckCardTypes = IArtefactCampCard | IMercenaryCampCard;

export type ClosedCoinTypes = Record<string, never>;

export type PublicPlayerCoinTypes = CoinTypes | ClosedCoinTypes;

/**
 * <h3>Типы данных для дек карт.</h3>
 */
export type DeckCardTypes = IDwarfCard | IRoyalOfferingCard;

/**
 * <h3>Типы данных для карт колоды сброса.</h3>
 */
export type DiscardDeckCardTypes = DeckCardTypes;

export type DiscardCampCardTypes = CampDeckCardTypes | IMercenaryPlayerCard;

export type CardsHasStack = IHeroCard | IArtefactCampCard | IRoyalOfferingCard;

export type CardsHasStackValidators = IHeroCard | IArtefactCampCard;

/**
 * <h3>Типы данных для карт на планшете игрока.</h3>
 */
export type PlayerCardTypes = IDwarfCard | ISpecialCard | IMultiSuitPlayerCard | IArtefactCampCard | IHeroPlayerCard
    | IMercenaryPlayerCard | IMythicalAnimalCard;

// TODO (DeckCardTypes | null)[] and (MythologicalCreatureDeckCardTypes | null)[]?
/**
 * <h3>Типы данных для карт таверн.</h3>
 */
export type TavernCardTypes = CanBeNull<DeckCardTypes | MythologicalCreatureDeckCardTypes>;

// TODO Delete it?!
export type CanBeInTavernCardTypes = CanBeNull<DeckCardTypes | MythicalAnimalTypes>;

export type AllCardTypes =
    PlayerCardTypes | IHeroCard | IRoyalOfferingCard | IMercenaryCampCard | MythologicalCreatureDeckCardTypes;

/**
 * <h3>Типы данных для монет на столе или в руке.</h3>
 */
export type CoinTypes = CanBeNull<ICoin>;

export type DrawProfitTypes = ConfigNames | ``;

export type ActionFunctionTypes = IActionFunction | IActionFunctionWithParams;

export type MoveFunctionTypes = CanBeNull<IMoveFunction>;

export type ConditionTypes = keyof ICondition;

export type ConditionsTypes = keyof IConditions;

export type BasicSuitableNullableCardInfoTypes = keyof IBasicSuitableNullableCardInfo;

export type PickValidatorConfigTypes = keyof IPickValidatorsConfig;

export type ValidatorConfigTypes = keyof IValidatorsConfig;

export type BuffTypes = keyof IBuffs;

export type ArtefactTypes = keyof IArtefactConfig;

export type HeroTypes = keyof IHeroConfig;

export type GiantTypes = keyof IGiantConfig;

export type GodTypes = keyof IGodConfig;

export type MythicalAnimalTypes = keyof IMythicalAnimalConfig;

export type ValkyryTypes = keyof IValkyryConfig;

export type SpecialCardTypes = keyof ISpecialCardsConfig;

export type MultiSuitCardTypes = keyof IMultiCardsConfig;

export type MoveValidatorGetRangeTypes = IMoveArgumentsStage<Partial<SuitPropertyTypes<number[]>>>[`args`]
    | IMoveArgumentsStage<IMoveCardIdPlayerIdArguments>[`args`]
    | IMoveArgumentsStage<number[][]>[`args`]
    | IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]
    | IMoveArgumentsStage<null>[`args`]
    | IMoveArgumentsStage<number[]>[`args`]
    | IMoveArgumentsStage<SuitTypes[]>[`args`];

export type ValidMoveIdParamTypes = CanBeNull<number | SuitTypes | number[] | IMoveSuitCardCurrentId
    | IMoveCardPlayerCurrentId | IMoveCoinsArguments>;

export type SuitTypes = keyof ISuitConfig;

export type ExpansionTypes = keyof IExpansions;

export type SuitPropertyTypes<Type> = {
    [Property in SuitTypes]: Type;
};

/**
 * <h3>Типы данных для остаточных аргументов функций.</h3>
 */
export type ArgsTypes = (CoinTypeNames | SuitTypes | number)[];

export type AutoActionArgsTypes = [number] | [number, number, CoinTypeNames];

/**
 * <h3>Типы данных для преимуществ.</h3>
 */
export type DistinctionTypes = CanBeUndef<CanBeNull<string>>;

export type ErrorArgsTypes = (string | number)[];

export type MoveArgsTypes = number[][] | [SuitTypes] | [number] | [SuitTypes, number] | [number, CoinTypeNames];

/**
 * <h3>Тип для создания карты улучшения монеты.</h3>
 */
export type CreateRoyalOfferingCardType = PartialBy<IRoyalOfferingCard, `type`>;

/**
 * <h3>Тип для создания карты лагеря артефакта.</h3>
 */
export type CreateArtefactCampCardType = PartialBy<IArtefactCampCard, `points` | `rank` | `suit` | `type`>;

/**
 * <h3>Тип для создания карты лагеря наёмника.</h3>
 */
export type CreateMercenaryCampCardType = PartialBy<IMercenaryCampCard, `type`>;

/**
 * <h3>Тип для создания карты наёмника на столе игрока.</h3>
 */
export type CreateMercenaryPlayerCardType = PartialBy<IMercenaryPlayerCard, `rank` | `type`>;

/**
 * <h3>Тип для создания карты дворфа.</h3>
 */
export type CreateDwarfCardType = PartialBy<IDwarfCard, `rank` | `type`>;

export type DiscardCardTypes = PlayerCardTypes | DeckCardTypes | MythologicalCreatureDeckCardTypes;

export type AddCardToPlayerTypes =
    NonNullable<TavernCardTypes> | IMercenaryPlayerCard | ISpecialCard | IMultiSuitPlayerCard;

// TODO FIX ME!!
/**
 * <h3>Тип для создания Гиганта.</h3>
 */
export type CreateGiantCardType = PartialBy<Omit<IGiantCard, `capturedCard`>
    & ReadonlyBy<IGiantCard, `capturedCard`>, `type` | `capturedCard`>;

// TODO FIX ME!!
/**
 * <h3>Тип для создания Бога.</h3>
 */
export type CreateGodCardType = PartialBy<Omit<IGodCard, `isPowerTokenUsed`>
    & ReadonlyBy<IGodCard, `isPowerTokenUsed`>, `type` | `isPowerTokenUsed`>;

// TODO FIX ME!!
/**
 * <h3>Тип для создания Валькирии.</h3>
 */
export type CreateValkyryCardType = PartialBy<Omit<IValkyryCard, `strengthTokenNotch`>
    & ReadonlyBy<IValkyryCard, `strengthTokenNotch`>, `type` | `strengthTokenNotch`>;

// TODO FIX ME!!
/**
 * <h3>Тип для создания Валькирии.</h3>
 */
export type CreateMythicalAnimalCardType = PartialBy<IMythicalAnimalCard, `type` | `rank` | `points`>;

/**
 * <h3>Тип для создания героя.</h3>
 */
export type CreateHeroCardType = PartialBy<Omit<IHeroCard, `active`>
    & ReadonlyBy<IHeroCard, `active`>, `type` | `suit` | `rank` | `points` | `active`>;

/**
 * <h3>Тип для создания героя на поле игрока.</h3>
 */
export type CreateHeroPlayerCardType = PartialBy<IHeroPlayerCard, `type`>;

/**
 * <h3>Тип для создания героя на поле игрока.</h3>
 */
export type CreateMultiSuitPlayerCardType = PartialBy<IMultiSuitPlayerCard, `type`>;

/**
* <h3>Тип для создания особой карты.</h3>
*/
export type CreateSpecialCardType = PartialBy<ISpecialCard, `type`>;

/**
* <h3>Тип для создания мультифракционной карты.</h3>
*/
export type CreateMultiSuitCardType = PartialBy<IMultiSuitCard, `type`>;

/**
 * <h3>Тип для создания монеты.</h3>
 */
export type CreateCoinType =
    PartialBy<Omit<ICoin, `isOpened`> & ReadonlyBy<ICoin, `isOpened`>, `isInitial` | `isOpened` | `isTriggerTrading`>;

/**
* <h3>Тип для конфига базовых монет.</h3>
*/
export type InitialTradingCoinConfigType = Pick<ICoin, `isTriggerTrading` | `value`>;

/**
 * <h3>Тип для создания кристалла.</h3>
 */
export type CreatePriorityType = PartialBy<IPriority, `isExchangeable`>;

/**
 * <h3>Тип для данных карт лагеря наёмник.</h3>
 */
export type MercenaryType = IBasicSuitableCardInfo;

export type SpecialCardDataType = Omit<ISpecialCard, `type`>;

export type MultiSuitCardDataType = Omit<IMultiSuitCard, `type`> & IExpansionCardInfo;

/**
 * <h3>Тип для варианта карты героя.</h3>
 */
export type VariantType = IBasicSuitableCardInfo;

// TODO Fix it!
export type StrengthTokenNotchPointsType = [number, number, number, number, number?];

/**
 * <h3>Тип для создания публичных данных игрока.</h3>
 */
export type CreatePublicPlayerType = PartialBy<Omit<IPublicPlayer, `pickedCard` | `priority` | `selectedCoin` | `stack`>
    & ReadonlyBy<IPublicPlayer, `priority` | `selectedCoin` | `stack`>,
    `heroes` | `campCards` | `mythologicalCreatureCards` | `stack` | `buffs` | `selectedCoin`>;

export type SoloGameDifficultyLevelHeroesConfigType =
    Pick<IHeroConfig, `Astrid` | `Grid` | `Skaa` | `Thrud` | `Uline` | `Ylud`>;

export type SoloGameHeroesForBotConfigType =
    Pick<IHeroConfig, `Dwerg_Aesir` | `Dwerg_Bergelmir` | `Dwerg_Jungir` | `Dwerg_Sigmir` | `Dwerg_Ymir`>;

export type SoloGameHeroesForPlayerConfigType = Pick<IHeroConfig, `Kraal` | `Tarah` | `Aral` | `Dagda` | `Lokdur`
    | `Zoral` | `Aegur` | `Bonfur` | `Hourya` | `Idunn`>;

// My Utilities types
/**
 * <h3>Тип для того, чтобы сделать дополнительный union тип undefined.</h3>
 */
export type CanBeUndef<T> = T | undefined;

/**
 * <h3>Тип для того, чтобы сделать дополнительный union тип null.</h3>
 */
export type CanBeNull<T> = T | null;

/**
 * <h3>Тип для того, чтобы получить типы пары [ключ, значение] у Object.entries.</h3>
 */
export type ObjectEntries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];

/**
 * <h3>Тип для того, чтобы сделать некоторые поля объекта опциональными.</h3>
 */
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * <h3>Тип для того, чтобы сделать некоторые поля объекта только для чтения.</h3>
 */
type ReadonlyBy<T, K extends keyof T> = Omit<T, K> & Readonly<Pick<T, K>>;
