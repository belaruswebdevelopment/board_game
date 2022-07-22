import type { Ctx } from "boardgame.io";
import { ArtefactNames, AutoActionFunctionNames, CoinTypeNames, ConfigNames, DrawNames, GameNames, GiantNames, GodNames, HeroNames, LogTypeNames, MoveNames, MultiSuitCardNames, MythicalAnimalNames, RoyalOfferingNames, RusCardTypeNames, RusSuitNames, SpecialCardNames, StageNames, TavernNames, ValkyryNames } from "./enums";

export interface ISecret {
    readonly campDecks: CampDeckCardType[][];
    readonly decks: DeckCardTypes[][];
    mythologicalCreatureDecks: MythologicalCreatureDeckCardType[];
}

export interface IWeight {
    readonly weight: number;
}

export interface IHeuristic<T> extends IWeight {
    readonly heuristic: (array: T) => boolean;
}

export interface IObjective extends IWeight {
    readonly checker: (G: IMyGameState, ctx: Ctx) => boolean;
}

export interface IObjectives {
    readonly isEarlyGame: IObjective;
    readonly isFirst: IObjective;
    readonly isStronger: IObjective;
}

export interface IDebugData {
    readonly G: Partial<Record<MyGameStateKeyofType, IMyGameState[MyGameStateKeyofType]>>;
    readonly ctx: Partial<Record<CtxKeyofType, Ctx[CtxKeyofType]>>;
}

export interface ICardCharacteristics {
    readonly variation: number;
    readonly mean: number;
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
    isPowerTokenUsed: CanBeNullType<boolean>;
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
    readonly placedSuit: SuitKeyofType;
    capturedCard: CanBeNullType<IDwarfCard>;
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
export interface IMythicalAnimalData extends PartialByType<Omit<IMythicalAnimalCard, `type`>, `rank` | `points`> {
    readonly buff?: IBuff;
    readonly scoringRule?: (player: IPublicPlayer, mythicalAnimalName: MythicalAnimalNames) => number;
    readonly ability?: () => void;
}

/**
 * <h3>Интерфейс для карты Мистическое животное.</h3>
 */
export interface IMythicalAnimalCard extends IBasicSuitableNonNullableCardInfo {
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
    strengthTokenNotch: CanBeNullType<number>;
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
export interface ISpecialCard extends IBasicSuitableNonNullableCardInfo {
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
export interface IMultiSuitPlayerCard extends IBasicSuitableNonNullableCardInfo {
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
export interface IRoyalOfferingCard extends Required<Pick<ICardWithActionInfo, `stack`>> {
    readonly name: RoyalOfferingNames;
    readonly type: RusCardTypeNames.Royal_Offering_Card;
    // TODO Move to CoinValueType in all places?
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
export interface IArtefactData extends ITierInfo, Omit<IArtefactCampCard, `type` | `path`>,
    PartialByType<Omit<IArtefactPlayerCampCard, `type` | `path`>, `suit` | `rank` | `points`> {
    readonly scoringRule: (G?: IMyGameState, player?: IPublicPlayer, artefactName?: ArtefactNames) => number;
}

/**
 * <h3>Интерфейс для карты лагеря артефакта.</h3>
 */
export interface IArtefactCampCard extends IPathCardInfo, ICardWithActionInfo {
    readonly type: RusCardTypeNames.Artefact_Card;
    readonly name: ArtefactNames;
}

/**
 * <h3>Интерфейс для карты лагеря артефакта.</h3>
 */
export interface IArtefactPlayerCampCard extends IBasicSuitableNonNullableCardInfo, IPathCardInfo,
    Pick<ICardWithActionInfo, `description`> {
    readonly type: RusCardTypeNames.Artefact_Player_Card;
    readonly name: ArtefactNames;
}

/**
 * <h3>Интерфейс для карты лагеря наёмника.</h3>
 */
export interface IMercenaryCampCard extends IPathCardInfo {
    // TODO Rework all cards name in Enums
    readonly name: string;
    readonly type: RusCardTypeNames.Mercenary_Card;
    readonly variants: Partial<SuitPropertyType<VariantType>>;
}

/**
 * <h3>Интерфейс для карты наёмника на столе игрока.</h3>
 */
export interface IMercenaryPlayerCard extends MercenaryType, IPathCardInfo {
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
export interface IHeroData extends PartialByType<Omit<IHeroCard, `type` | `active`>, `suit` | `rank` | `points`>,
    IExpansionCardInfo {
    readonly scoringRule: (player?: IPublicPlayer, heroName?: HeroNames) => number;
}

/**
 * <h3>Интерфейс для карты героя.</h3>
 */
export interface IHeroCard extends IBasicSuitableNullableCardInfo, ICardWithActionInfo {
    readonly type: RusCardTypeNames.Hero_Card;
    readonly name: HeroNames;
    readonly pickValidators?: IPickValidatorsConfig;
    active: boolean;
}

/**
 * <h3>Интерфейс для карты героя на поле игрока.</h3>
 */
export interface IHeroPlayerCard extends IBasicSuitableNonNullableCardInfo, Pick<ICardWithActionInfo, `description`> {
    readonly type: RusCardTypeNames.Hero_Player_Card;
    readonly name: HeroNames;
}

/**
 * <h3>Интерфейс для карты дворфа.</h3>
 */
export interface IDwarfCard extends IBasicSuitableNonNullableCardInfo {
    // TODO Rework all cards name in Enums
    readonly name: string;
    readonly type: RusCardTypeNames.Dwarf_Card;
}

/**
 * <h3>Интерфейс для действия.</h3>
 */
export interface IAction {
    readonly name: AutoActionFunctionNames;
    readonly params?: AutoActionArgsType;
}

/**
 * <h3>Интерфейс для данных стека у карт.</h3>
 */
export interface IStackData {
    readonly addCoinToPouch: () => IStack;
    readonly brisingamensEndGameAction: () => IStack;
    readonly discardCardFromBoardBonfur: () => IStack;
    readonly discardCardFromBoardCrovaxTheDoppelganger: () => IStack;
    readonly discardCardFromBoardDagda: (pickedSuit?: SuitKeyofType) => IStack;
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
    readonly placeMultiSuitsCards: (name: MultiSuitCardNames, pickedSuit?: SuitKeyofType, priority?: 3) => IStack;
    readonly placeThrudHero: () => IStack;
    readonly placeTradingCoinsUline: () => IStack;
    readonly placeYludHero: () => IStack;
    readonly pickHero: (priority: 1 | 2) => IStack;
    readonly pickHeroSoloBot: () => IStack;
    readonly placeEnlistmentMercenaries: (card: IMercenaryCampCard) => IStack;
    readonly startChooseCoinValueForVidofnirVedrfolnirUpgrade: (valueArray: VidofnirVedrfolnirUpgradeValueType,
        coinId?: number, priority?: 3) => IStack;
    readonly startOrPassEnlistmentMercenaries: () => IStack;
    readonly upgradeCoin: (value: number) => IStack;
    readonly upgradeCoinVidofnirVedrfolnir: (value: number, coinId?: number, priority?: 3) => IStack;
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
    readonly suit?: SuitKeyofType;
    readonly pickedSuit?: SuitKeyofType;
    readonly value?: number;
    readonly valueArray?: VidofnirVedrfolnirUpgradeValueType;
    readonly configName?: ConfigNames;
    readonly drawName?: DrawNames;
    readonly stageName?: StageNames;
    readonly name?: StackNamesType;
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
export interface IPlayersNumberTierCardData extends ITierInfo {
    readonly players: number;
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
    readonly suit: CanBeNullType<SuitKeyofType>;
    readonly rank: CanBeNullType<number>;
    readonly points: CanBeNullType<number>;
}

export interface IBasicSuitableNonNullableCardInfo extends Pick<IBasicSuitableNullableCardInfo, `points`> {
    readonly suit: NonNullable<IBasicSuitableNullableCardInfo[`suit`]>;
    readonly rank: NonNullable<IBasicSuitableNullableCardInfo[`rank`]>;
}

export interface IPathCardInfo {
    readonly path: string;
}

export interface ITierInfo {
    readonly tier: number;
}

export interface IExpansionCardInfo {
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
 * <h3>Интерфейс для бафа карт.</h3>
 */
export interface IBuff {
    readonly name: BuffKeyofType;
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

export interface IAutoActionFunctionWithParams {
    (G: IMyGameState, ctx: Ctx, ...params: AutoActionArgsType): void;
}

export interface IAutoActionFunction {
    (G: IMyGameState, ctx: Ctx): void;
}

export interface IMoveFunction {
    (...args: ArgsType): void;
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
    soloGameDifficultyLevel: CanBeNullType<number>;
    odroerirTheMythicCauldron: boolean;
    readonly odroerirTheMythicCauldronCoins: ICoin[];
    readonly averageCards: SuitPropertyType<IDwarfCard>;
    readonly botData: IBotData;
    readonly deckLength: [number, number];
    readonly campDeckLength: [number, number];
    mythologicalCreatureDeckLength: number;
    explorerDistinctionCardId: CanBeNullType<number>,
    readonly explorerDistinctionCards: DeckCardTypes[];
    readonly camp: CampCardType[];
    readonly secret: ISecret;
    readonly campNum: number;
    mustDiscardTavernCardJarnglofi: CanBeNullType<boolean>;
    campPicked: boolean;
    currentTavern: number;
    readonly debug: boolean;
    readonly multiCardsDeck: IMultiSuitCard[];
    readonly specialCardsDeck: ISpecialCard[];
    readonly discardCampCardsDeck: DiscardCampCardType[];
    readonly discardCardsDeck: DiscardDeckCardType[];
    readonly discardMythologicalCreaturesCards: MythologicalCreatureDeckCardType[];
    readonly discardMultiCards: IMultiSuitPlayerCard[];
    readonly discardSpecialCards: ISpecialCard[];
    readonly distinctions: SuitPropertyType<DistinctionType>;
    drawProfit: DrawProfitType;
    readonly drawSize: number;
    exchangeOrder: CanBeUndefType<number>[];
    readonly expansions: IExpansions;
    readonly heroes: IHeroCard[];
    readonly heroesForSoloBot: IHeroCard[];
    heroesForSoloGameDifficultyLevel: CanBeNullType<IHeroCard[]>;
    readonly log: boolean;
    readonly logData: ILogData[];
    readonly marketCoins: ICoin[];
    readonly marketCoinsUnique: ICoin[];
    round: number;
    readonly suitsNum: number;
    tavernCardDiscarded2Players: boolean;
    readonly taverns: TavernCardType[][];
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
    readonly suit: SuitKeyofType;
    readonly value: number;
}

/**
 * <h3>Интерфейс для условий карты героя.</h3>
 */
export interface IConditions {
    readonly suitCountMin: ICondition;
}

interface IDiscardCard {
    readonly suit: CanBeNullType<SuitKeyofType>;
    readonly number?: number;
}

/**
 * <h3>Интерфейс для возможных мувов у ботов.</h3>
 */
export interface IMoves {
    readonly move: MoveNames;
    readonly args: MoveArgsType;
}

export interface IMoveArgumentsStage<T> {
    readonly args: T;
}

export interface IMoveCoinsArguments {
    readonly coinId: number;
    readonly type: CoinTypeNames;
}

export interface ICardId {
    readonly cardId: number;
}

export interface IPlayerId {
    readonly playerId: number;
}

/**
 * <h3>Интерфейс для выбранного аргумента мувов с фракциями для ботов.</h3>
 */
export interface IMoveSuitCardCurrentId extends ICardId {
    readonly suit: SuitKeyofType;
}

export interface IMoveCardsPlayerIdArguments extends IPlayerId {
    readonly cards: number[];
}

/**
 * <h3>Интерфейс для возможных валидаторов у мувов.</h3>
 */
export interface IMoveBy {
    readonly chooseDifficultySoloMode: IMoveByChooseDifficultySoloModeOptions;
    readonly bids: IMoveByBidOptions;
    readonly bidUline: IMoveByBidUlineOptions;
    readonly tavernsResolution: IMoveByTavernsResolutionOptions;
    readonly enlistmentMercenaries: IMoveByEnlistmentMercenariesOptions;
    readonly placeYlud: IMoveByPlaceYludOptions;
    readonly troopEvaluation: IMoveByTroopEvaluationOptions;
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
export interface IMoveByBidOptions {
    readonly default1: IMoveValidator;
    readonly default2: IMoveValidator;
    readonly default3: IMoveValidator;
    readonly default4: IMoveValidator;
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByBidUlineOptions {
    readonly default1: IMoveValidator;
}

export interface IMoveBySoloBotOptions {
    readonly pickHeroSoloBot: IMoveValidator;
}

interface IMoveByCommonOptions {
    readonly addCoinToPouch: IMoveValidator;
    readonly chooseCoinValueForVidofnirVedrfolnirUpgrade: IMoveValidator;
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
export interface IMoveByTavernsResolutionOptions extends IMoveByCommonOptions, IMoveBySoloBotOptions {
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
export interface IMoveByPlaceYludOptions extends IMoveByCommonOptions {
    readonly default1: IMoveValidator;
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByTroopEvaluationOptions extends IMoveByCommonOptions, IMoveBySoloBotOptions {
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
    readonly getRange: (G?: IMyGameState, ctx?: Ctx, playerId?: number) => MoveValidatorGetRangeType;
    readonly getValue: (G: IMyGameState, ctx: Ctx, moveRangeData: MoveValidatorGetRangeType) =>
        ValidMoveIdParamType;
    readonly moveName: MoveNames;
    readonly validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamType) => boolean;
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
    readonly ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator: IMoveValidator;
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
    readonly suitIdForMjollnir?: SuitKeyofType;
    readonly upgradeCoin?: true;
    readonly upgradeNextCoin?: true;
}

/**
 * <h3>Интерфейс для публичных данных игрока.</h3>
 */
export interface IPublicPlayer {
    readonly nickname: string;
    readonly cards: SuitPropertyType<PlayerCardType[]>;
    readonly heroes: IHeroCard[];
    readonly campCards: CampDeckCardType[];
    readonly mythologicalCreatureCards: MythologicalCreatureCommandZoneCardType[];
    readonly handCoins: PublicPlayerCoinType[];
    readonly boardCoins: PublicPlayerCoinType[];
    readonly giantTokenSuits: SuitPropertyType<CanBeNullType<boolean>>;
    stack: IStack[];
    priority: IPriority;
    readonly buffs: IBuffs[];
    selectedCoin: CanBeNullType<number>;
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
    readonly CampCard: (cardPath: string) => IBackground;
    readonly CardBack: (tier: number) => IBackground;
    readonly Card: (suit: SuitKeyofType, name: string, points: CanBeNullType<number>) => IBackground;
    readonly Coin: (value: number, initial: boolean) => IBackground;
    readonly CoinSmall: (value: number, initial: boolean) => IBackground;
    readonly CoinBack: () => IBackground;
    readonly Distinction: (distinction: SuitKeyofType) => IBackground;
    readonly DistinctionsBack: () => IBackground;
    readonly Exchange: () => IBackground;
    readonly Hero: (heroName: HeroNames) => IBackground;
    readonly HeroBack: () => IBackground;
    readonly MythologicalCreature: (name: MythologicalCreatureNameTypes) => IBackground;
    readonly Priorities: (priority: number) => IBackground;
    readonly Priority: () => IBackground;
    readonly RoyalOffering: (name: RoyalOfferingNames) => IBackground;
    readonly Suit: (suit: SuitKeyofType) => IBackground;
    readonly Tavern: (tavernId: number) => IBackground;
}

/**
 * <h3>Интерфейс для фракций.</h3>
 */
export interface ISuit {
    readonly suit: SuitKeyofType;
    readonly suitName: RusSuitNames;
    readonly suitColor: string;
    readonly description: string;
    readonly pointsValues: () => IPointsValues;
    readonly scoringRule: (cards: PlayerCardType[], suit: SuitKeyofType, potentialCardValue?: number,
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

export type BasicVidofnirVedrfolnirUpgradeValueType = 2 | 3 | 5;

export type VidofnirVedrfolnirUpgradeValueType = [BasicVidofnirVedrfolnirUpgradeValueType]
    | [BasicVidofnirVedrfolnirUpgradeValueType, 2 | 3];

export type BuffValueType = CanBeUndefType<SuitKeyofType | true>;

export type MoveCardPlayerCurrentIdType = ICardId & IPlayerId;

// TODO Rework to + Enlistment mercenaries names - string
export type StackNamesType = HeroNames | MultiSuitCardNames | string;

// TODO Idavoll
/**
 * <h3>Типы данных для дек карт Idavoll.</h3>
 */
export type MythologicalCreatureDeckCardType = IGodCard | IGiantCard | IValkyryCard | IMythicalAnimalCard;

/**
 * <h3>Типы данных для карт Idavoll в командной зоне игрока.</h3>
 */
export type MythologicalCreatureCommandZoneCardType = IGodCard | IGiantCard | IValkyryCard;

/**
 * <h3>Типы данных для лагеря.</h3>
 */
export type CampCardType = CanBeNullType<CampDeckCardType>;

/**
 * <h3>Типы данных для карт колоды лагеря.</h3>
 */
export type CampDeckCardType = IArtefactCampCard | IArtefactPlayerCampCard | IMercenaryCampCard;

export type ClosedCoinType = Record<string, never>;

export type PublicPlayerCoinType = CoinType | ClosedCoinType;

/**
 * <h3>Типы данных для дек карт.</h3>
 */
export type DeckCardTypes = IDwarfCard | IRoyalOfferingCard;

/**
 * <h3>Типы данных для карт колоды сброса.</h3>
 */
export type DiscardDeckCardType = DeckCardTypes;

export type DiscardCampCardType = CampDeckCardType | IMercenaryPlayerCard;

export type CardsHasStackType = IHeroCard | IArtefactCampCard | IRoyalOfferingCard;

export type CardsHasStackValidatorsType = IHeroCard | IArtefactCampCard;

/**
 * <h3>Типы данных для карт на планшете игрока.</h3>
 */
export type PlayerCardType = IDwarfCard | ISpecialCard | IMultiSuitPlayerCard | IArtefactPlayerCampCard
    | IHeroPlayerCard | IMercenaryPlayerCard | IMythicalAnimalCard;

// TODO CanBeUndef<DeckCardTypes>[] and CanBeUndef<MythologicalCreatureDeckCardTypes>[]?
/**
 * <h3>Типы данных для карт таверн.</h3>
 */
export type TavernCardType = CanBeNullType<DeckCardTypes | MythologicalCreatureDeckCardType>;

export type AllCardType = PlayerCardType | IHeroCard | IRoyalOfferingCard | IMercenaryCampCard
    | IArtefactCampCard | MythologicalCreatureDeckCardType;

/**
 * <h3>Типы данных для монет на столе или в руке.</h3>
 */
export type CoinType = CanBeNullType<ICoin>;

// TODO Rework `` to null
export type DrawProfitType = ConfigNames | ``;

export type AutoActionFunctionType = IAutoActionFunction | IAutoActionFunctionWithParams;

export type MoveFunctionType = CanBeNullType<IMoveFunction>;

export type PlayerRanksAndMaxRanksForDistinctionsType = [number[], number];

export type DrawObjectDataType = IDebugData | IDebugData[DebugDataKeyofTypes];

export type DebugDataKeyofTypes = keyof IDebugData;

export type CtxKeyofType = keyof Ctx;

export type MyGameStateKeyofType = keyof IMyGameState;

export type ConditionKeyofType = keyof ICondition;

export type ConditionsKeyofType = keyof IConditions;

export type BasicSuitableNullableCardInfoKeyofType = keyof IBasicSuitableNullableCardInfo;

export type PickValidatorConfigKeyofType = keyof IPickValidatorsConfig;

export type ValidatorConfigKeyofType = keyof IValidatorsConfig;

export type BuffKeyofType = keyof IBuffs;

export type ArtefactKeyofType = keyof IArtefactConfig;

export type HeroKeyofType = keyof IHeroConfig;

export type GiantKeyofType = keyof IGiantConfig;

export type GodKeyofType = keyof IGodConfig;

export type MythicalAnimalKeyofType = keyof IMythicalAnimalConfig;

export type ValkyryKeyofTypes = keyof IValkyryConfig;

export type SpecialCardKeyofType = keyof ISpecialCardsConfig;

export type MultiSuitCardKeyofType = keyof IMultiCardsConfig;

export type SuitKeyofType = keyof ISuitConfig;

export type ExpansionKeyofType = keyof IExpansions;

export type MoveValidatorGetRangeType = IMoveArgumentsStage<Partial<SuitPropertyType<number[]>>>[`args`]
    | IMoveArgumentsStage<IMoveCardsPlayerIdArguments>[`args`]
    | IMoveArgumentsStage<number[][]>[`args`]
    | IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]
    | IMoveArgumentsStage<null>[`args`]
    | IMoveArgumentsStage<number[]>[`args`]
    | IMoveArgumentsStage<SuitKeyofType[]>[`args`];

export type ValidMoveIdParamType = CanBeNullType<number | SuitKeyofType | number[] | IMoveSuitCardCurrentId
    | MoveCardPlayerCurrentIdType | IMoveCoinsArguments>;

export type SuitPropertyType<Type> = {
    [Property in SuitKeyofType]: Type;
};

export type MythologicalCreatureNameTypes = GiantNames | GodNames | MythicalAnimalNames | ValkyryNames;

/**
 * <h3>Типы данных для остаточных аргументов функций.</h3>
 */
export type ArgsType = (CoinTypeNames | SuitKeyofType | number)[];

export type AutoActionArgsType = [number] | [number, number, CoinTypeNames];

/**
 * <h3>Типы данных для преимуществ.</h3>
 */
export type DistinctionType = CanBeUndefType<CanBeNullType<string>>;

export type ErrorArgsTypes = (string | number)[];

export type MoveArgsType = number[][] | [SuitKeyofType] | [number] | [SuitKeyofType, number] | [number, CoinTypeNames];

/**
 * <h3>Тип для создания карты улучшения монеты.</h3>
 */
export type CreateRoyalOfferingCardType = PartialByType<IRoyalOfferingCard, `type`>;

/**
 * <h3>Тип для создания карты лагеря артефакта.</h3>
 */
export type CreateArtefactCampCardType = PartialByType<IArtefactCampCard, `type`>;

/**
 * <h3>Тип для создания карты лагеря артефакта.</h3>
 */
export type CreateArtefactPlayerCampCardType = PartialByType<IArtefactPlayerCampCard, `type`>;

/**
 * <h3>Тип для создания карты лагеря наёмника.</h3>
 */
export type CreateMercenaryCampCardType = PartialByType<IMercenaryCampCard, `type`>;

/**
 * <h3>Тип для создания карты наёмника на столе игрока.</h3>
 */
export type CreateMercenaryPlayerCardType = PartialByType<IMercenaryPlayerCard, `rank` | `type`>;

/**
 * <h3>Тип для создания карты дворфа.</h3>
 */
export type CreateDwarfCardType = PartialByType<IDwarfCard, `rank` | `type`>;

export type DiscardCardType =
    PlayerCardType | IRoyalOfferingCard | IArtefactCampCard | MythologicalCreatureDeckCardType;

export type AddCardToPlayerType =
    NonNullable<TavernCardType> | IMercenaryPlayerCard | ISpecialCard | IMultiSuitPlayerCard | IArtefactPlayerCampCard;

// TODO FIX ME!!
/**
 * <h3>Тип для создания Гиганта.</h3>
 */
export type CreateGiantCardType = PartialByType<Omit<IGiantCard, `capturedCard`>
    & ReadonlyByType<IGiantCard, `capturedCard`>, `type` | `capturedCard`>;

// TODO FIX ME!!
/**
 * <h3>Тип для создания Бога.</h3>
 */
export type CreateGodCardType = PartialByType<Omit<IGodCard, `isPowerTokenUsed`>
    & ReadonlyByType<IGodCard, `isPowerTokenUsed`>, `type` | `isPowerTokenUsed`>;

// TODO FIX ME!!
/**
 * <h3>Тип для создания Валькирии.</h3>
 */
export type CreateValkyryCardType = PartialByType<Omit<IValkyryCard, `strengthTokenNotch`>
    & ReadonlyByType<IValkyryCard, `strengthTokenNotch`>, `type` | `strengthTokenNotch`>;

// TODO FIX ME!!
/**
 * <h3>Тип для создания Валькирии.</h3>
 */
export type CreateMythicalAnimalCardType = PartialByType<IMythicalAnimalCard, `type` | `rank` | `points`>;

/**
 * <h3>Тип для создания героя.</h3>
 */
export type CreateHeroCardType = PartialByType<Omit<IHeroCard, `active`>
    & ReadonlyByType<IHeroCard, `active`>, `type` | `suit` | `rank` | `points` | `active`>;

/**
 * <h3>Тип для создания героя на поле игрока.</h3>
 */
export type CreateHeroPlayerCardType = PartialByType<IHeroPlayerCard, `type`>;

/**
 * <h3>Тип для создания героя на поле игрока.</h3>
 */
export type CreateMultiSuitPlayerCardType = PartialByType<IMultiSuitPlayerCard, `type`>;

/**
* <h3>Тип для создания особой карты.</h3>
*/
export type CreateSpecialCardType = PartialByType<ISpecialCard, `type`>;

/**
* <h3>Тип для создания мультифракционной карты.</h3>
*/
export type CreateMultiSuitCardType = PartialByType<IMultiSuitCard, `type`>;

/**
 * <h3>Тип для создания монеты.</h3>
 */
export type CreateCoinType =
    PartialByType<Omit<ICoin, `isOpened`> & ReadonlyByType<ICoin, `isOpened`>, `isInitial` | `isOpened` | `isTriggerTrading`>;

/**
* <h3>Тип для конфига базовых монет.</h3>
*/
export type InitialTradingCoinConfigType = Pick<ICoin, `isTriggerTrading` | `value`>;

/**
 * <h3>Тип для создания кристалла.</h3>
 */
export type CreatePriorityType = PartialByType<IPriority, `isExchangeable`>;

/**
 * <h3>Тип для данных карт лагеря наёмник.</h3>
 */
export type MercenaryType = IBasicSuitableNonNullableCardInfo;

export type SpecialCardDataType = Omit<ISpecialCard, `type`>;

export type MultiSuitCardDataType = Omit<IMultiSuitCard, `type`> & IExpansionCardInfo;

/**
 * <h3>Тип для варианта карты героя.</h3>
 */
export type VariantType = IBasicSuitableNonNullableCardInfo;

// TODO Fix it!
export type StrengthTokenNotchPointsType = [number, number, number, number, number?];

/**
 * <h3>Тип для создания публичных данных игрока.</h3>
 */
export type CreatePublicPlayerType =
    PartialByType<Omit<IPublicPlayer, `pickedCard` | `priority` | `selectedCoin` | `stack`>
        & ReadonlyByType<IPublicPlayer, `priority` | `selectedCoin` | `stack`>,
        `heroes` | `campCards` | `mythologicalCreatureCards` | `stack` | `buffs` | `selectedCoin`>;

export type SoloGameDifficultyLevelHeroesConfigType =
    Pick<IHeroConfig, `Astrid` | `Grid` | `Skaa` | `Thrud` | `Uline` | `Ylud`>;

export type SoloGameHeroesForBotConfigType =
    Pick<IHeroConfig, `Dwerg_Aesir` | `Dwerg_Bergelmir` | `Dwerg_Jungir` | `Dwerg_Sigmir` | `Dwerg_Ymir`>;

export type SoloGameHeroesForPlayerConfigType = Pick<IHeroConfig, `Kraal` | `Tarah` | `Aral` | `Dagda` | `Lokdur`
    | `Zoral` | `Aegur` | `Bonfur` | `Hourya` | `Idunn`>;

export type ObjectEntriesCtxType = [CtxKeyofType, Ctx[CtxKeyofType]];

// My Utilities types
/**
 * <h3>Тип для того, чтобы сделать дополнительный union тип undefined.</h3>
 */
export type CanBeUndefType<T> = T | undefined;

/**
 * <h3>Тип для того, чтобы сделать дополнительный union тип null.</h3>
 */
export type CanBeNullType<T> = T | null;

/**
 * <h3>Тип для того, чтобы получить типы пары [ключ, значение] у Object.entries.</h3>
 */
export type ObjectEntriesType<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];

/**
 * <h3>Тип для того, чтобы сделать некоторые поля объекта опциональными.</h3>
 */
type PartialByType<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * <h3>Тип для того, чтобы сделать некоторые поля объекта только для чтения.</h3>
 */
type ReadonlyByType<T, K extends keyof T> = Omit<T, K> & Readonly<Pick<T, K>>;
