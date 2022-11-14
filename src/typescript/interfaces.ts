import type { ActionPayload, ActivePlayersArg, AiEnumerate, ChatMessage, DefaultPluginAPIs, FilteredMetadata, LogEntry, PlayerID, Plugin, PluginState, Store, TurnOrderConfig, Undo } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import type { ClientOpts, DebugOpt } from "boardgame.io/dist/types/src/client/client";
// eslint-disable-next-line import/no-unresolved
import { Transport, type TransportOpts } from "boardgame.io/dist/types/src/client/transport/transport";
// eslint-disable-next-line import/no-unresolved
import { Flow } from "boardgame.io/dist/types/src/core/flow";
// eslint-disable-next-line import/no-unresolved
import { ProcessGameConfig } from "boardgame.io/dist/types/src/core/game";
import { ArtefactNames, ArtefactScoringFunctionNames, AutoActionFunctionNames, AutoBotsMoveNames, BuffNames, ButtonMoveNames, ButtonNames, CampBuffNames, CardMoveNames, CoinMoveNames, CoinTypeNames, ConfigNames, DistinctionAwardingFunctionNames, DrawNames, EmptyCardMoveNames, GameModeNames, GameNames, GiantBuffNames, GiantNames, GiantScoringFunctionNames, GodNames, HeroBuffNames, HeroNames, HeroScoringFunctionNames, LogTypeNames, MoveValidatorNames, MultiSuitCardNames, MythicalAnimalBuffNames, MythicalAnimalNames, MythicalAnimalScoringFunctionNames, PhaseNames, PickCardValidatorNames, PickHeroCardValidatorNames, RoyalOfferingNames, RusCardTypeNames, RusStageNames, RusSuitNames, SoloGameAndvariStrategyNames, SpecialCardNames, StageNames, SuitMoveNames, SuitNames, SuitScoringFunctionNames, TavernNames, ValkyryBuffNames, ValkyryNames, ValkyryScoringFunctionNames } from "./enums";

/**
 * <h3>Интерфейс для скрытых от всех игроков данных.</h3>
 */
export interface ISecret {
    readonly campDecks: SecretCampDecksType;
    readonly decks: SecretDecksType;
    mythologicalCreatureDeck: MythologicalCreatureDeckCardType[];
    mythologicalCreatureNotInGameDeck: MythologicalCreatureDeckCardType[];
}

/**
 * <h3>Интерфейс для веса цели ботов.</h3>
 */
interface IWeight {
    readonly weight: number;
}

/**
 * <h3>Интерфейс для эвристики для ботов.</h3>
 */
export interface IHeuristic<T extends unknown[]> extends IWeight {
    readonly heuristic: (array: T) => boolean;
}

/**
 * <h3>Интерфейс для цели ботов.</h3>
 */
interface IObjective extends IWeight {
    readonly checker: ({ G, ctx, playerID, ...rest }: MyFnContext) => boolean;
}

/**
 * <h3>Интерфейс для всех цели ботов.</h3>
 */
export interface IObjectives {
    readonly isEarlyGame: IObjective;
    readonly isFirst: IObjective;
    readonly isStronger: IObjective;
}

/**
 * <h3>Интерфейс для данных дебага.</h3>
 */
export interface IDebugData {
    readonly G: Partial<Record<KeyofType<IMyGameState>, IMyGameState[KeyofType<IMyGameState>]>>;
    readonly ctx: Partial<Record<KeyofType<Ctx>, Ctx[KeyofType<Ctx>]>>;
}

/**
 * <h3>Интерфейс для характеристик карты для ботов.</h3>
 */
export interface ICardCharacteristics {
    readonly variation: number;
    readonly mean: number;
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
export interface IGodCard extends Pick<ICardWithActionInfo, `actions`>, ICardWithStackAndBuffs {
    readonly name: GodNames;
    readonly points: number;
    readonly type: RusCardTypeNames.God_Card;
    isPowerTokenUsed: CanBeNullType<boolean>;
}

// TODO Check actions
/**
 * <h3>Интерфейс для данных карты Гиганта.</h3>
 */
export interface IGiantData extends Omit<IGiantCard, `type` | `capturedCard`> {
    readonly scoringRule: IAction<GiantScoringFunctionNames, ScoringArgsType>;
}

/**
 * <h3>Интерфейс для карты Гиганта.</h3>
 */
export interface IGiantCard extends Pick<ICardWithActionInfo, `actions`>, ICardWithStackAndBuffs {
    readonly name: GiantNames;
    readonly type: RusCardTypeNames.Giant_Card;
    readonly buff: IGiantBuff;
    readonly placedSuit: SuitNames;
    capturedCard: CanBeNullType<IDwarfCard>;
}

/**
 * <h3>Интерфейс для данных карты Мистическое животное.</h3>
 */
export interface IMythicalAnimalData extends PartialByType<Omit<IMythicalAnimalCard, `type`>, `rank` | `points`> {
    readonly scoringRule: IAction<MythicalAnimalScoringFunctionNames, ScoringArgsType>;
}

/**
 * <h3>Интерфейс для карты Мистическое животное.</h3>
 */
export interface IMythicalAnimalCard extends Pick<ICardWithActionInfo, `actions`>, IBasicSuitableNonNullableCardInfo,
    ICardWithStackAndBuffs {
    readonly name: MythicalAnimalNames;
    readonly buff?: IMythicalAnimalBuff;
    readonly type: RusCardTypeNames.Mythical_Animal_Card;
}

/**
 * <h3>Интерфейс для данных карты Валькирия.</h3>
 */
export interface IValkyryData extends Omit<IValkyryCard, `type` | `strengthTokenNotch`> {
    readonly scoringRule: IAction<ValkyryScoringFunctionNames, undefined>;
}

/**
 * <h3>Интерфейс для карты Валькирия.</h3>
 */
export interface IValkyryCard extends Pick<ICardWithActionInfo, `actions`>, ICardWithStackAndBuffs {
    readonly name: ValkyryNames;
    readonly type: RusCardTypeNames.Valkyry_Card;
    readonly buff?: IValkyryBuff;
    strengthTokenNotch: CanBeNullType<number>;
}

/**
 * <h3>Интерфейс для особой карты.</h3>
 */
export interface ISpecialCard extends IBasicSuitableNonNullableCardInfo {
    readonly type: RusCardTypeNames.Special_Card;
    readonly name: SpecialCardNames.ChiefBlacksmith;
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
    // TODO Move to InitialCoinValueType/MarketCoinValueType in all places?
    readonly value: number;
}

/**
 * <h3>Интерфейс для значения на которое обновляется монета.</h3>
 */
export interface IRoyalOfferingCardValues {
    readonly [index: number]: INumberValues;
}

/**
 * <h3>Интерфейс для данных карт лагеря артефакт.</h3>
 */
export interface IArtefactData extends ITierInfo, Omit<IArtefactCampCard, `type` | `path`>,
    PartialByType<Omit<IArtefactPlayerCampCard, `type` | `path`>, `suit` | `rank` | `points`> {
    readonly scoringRule: IAction<ArtefactScoringFunctionNames, ScoringArgsType>;
}

/**
 * <h3>Интерфейс для карты лагеря артефакта.</h3>
 */
export interface IArtefactCampCard extends IPathCardInfo, ICardWithActionInfo {
    readonly type: RusCardTypeNames.Artefact_Card;
    readonly name: ArtefactNames;
    readonly buff?: IArtefactBuff;
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
export interface IMercenaryPlayerCampCard extends MercenaryType, IPathCardInfo {
    // TODO Rework all cards name in Enums
    readonly name: string;
    readonly type: RusCardTypeNames.Mercenary_Player_Card;
}

/**
 * <h3>Интерфейс для данных карты героя.</h3>
 */
export interface IHeroData extends PartialByType<Omit<IHeroCard, `type` | `active`>, `suit` | `rank` | `points`>,
    IExpansionCardInfo {
    readonly scoringRule: IAction<HeroScoringFunctionNames, ScoringArgsType>;
}

/**
 * <h3>Интерфейс для карты героя.</h3>
 */
export interface IHeroCard extends IBasicSuitableNullableCardInfo, ICardWithActionInfo {
    readonly type: RusCardTypeNames.Hero_Card;
    readonly name: HeroNames;
    readonly buff?: IHeroBuff;
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
export interface IAction<TName extends ActionNamesType, TParams extends ActionParamsType> {
    readonly name: TName;
    readonly params?: TParams;
}

/**
 * <h3>Интерфейс для данных стека у карт.</h3>
 */
export interface IStackData {
    readonly activateGiantAbilityOrPickCard: (card: IDwarfCard) => IStack;
    readonly addCoinToPouch: () => IStack;
    readonly brisingamensEndGameAction: () => IStack;
    readonly chooseSuitOlrun: () => IStack;
    readonly chooseStrategyLevelForSoloModeAndvari: () => IStack;
    readonly chooseStrategyVariantLevelForSoloModeAndvari: () => IStack;
    readonly discardCardFromBoardBonfur: () => IStack;
    readonly discardCardFromBoardCrovaxTheDoppelganger: () => IStack;
    readonly discardCardFromBoardDagda: (pickedSuit?: SuitNames) => IStack;
    readonly discardSuitCard: (playerId: number) => IStack;
    readonly discardSuitCardHofud: () => IStack;
    readonly discardTavernCard: () => IStack;
    readonly enlistmentMercenaries: () => IStack;
    readonly getDifficultyLevelForSoloMode: () => IStack;
    readonly getMythologyCardSkymir: (priority?: 3) => IStack;
    readonly getHeroesForSoloMode: () => IStack;
    readonly getDistinctions: () => IStack;
    readonly getMjollnirProfit: () => IStack;
    readonly pickCampCardHolda: () => IStack;
    readonly pickCard: () => IStack;
    readonly pickCardSoloBot: () => IStack;
    readonly pickCardSoloBotAndvari: () => IStack;
    // TODO Add types for coinValue & value
    readonly pickConcreteCoinToUpgrade: (coinValue: number, value: number) => IStack;
    readonly pickDiscardCardAndumia: () => IStack;
    readonly pickDiscardCardBrisingamens: (priority?: 3) => IStack;
    readonly pickDistinctionCard: () => IStack;
    readonly pickDistinctionCardSoloBot: () => IStack;
    readonly pickDistinctionCardSoloBotAndvari: () => IStack;
    readonly placeMultiSuitsCards: (name: MultiSuitCardNames, pickedSuit?: SuitNames, priority?: 3) => IStack;
    readonly placeThrudHero: () => IStack;
    readonly placeThrudHeroSoloBot: () => IStack;
    readonly placeThrudHeroSoloBotAndvari: () => IStack;
    readonly placeTradingCoinsUline: () => IStack;
    readonly placeYludHero: () => IStack;
    readonly placeYludHeroSoloBot: () => IStack;
    readonly placeYludHeroSoloBotAndvari: () => IStack;
    readonly pickHero: (priority: OneOrTwoType) => IStack;
    readonly pickHeroSoloBot: (priority: OneOrTwoType) => IStack;
    readonly pickHeroSoloBotAndvari: (priority: OneOrTwoType) => IStack;
    readonly placeEnlistmentMercenaries: (card: IMercenaryCampCard) => IStack;
    readonly startChooseCoinValueForVidofnirVedrfolnirUpgrade: (valueArray: VidofnirVedrfolnirUpgradeValueType,
        coinId?: number, priority?: 3) => IStack;
    readonly startOrPassEnlistmentMercenaries: () => IStack;
    readonly upgradeCoin: (value: number) => IStack;
    readonly upgradeCoinSoloBot: (value: number) => IStack;
    readonly upgradeCoinSoloBotAndvari: (value: number) => IStack;
    readonly upgradeCoinVidofnirVedrfolnir: (value: number, coinId?: number, priority?: 3) => IStack;
    readonly upgradeCoinWarriorDistinction: () => IStack;
    readonly upgradeCoinWarriorDistinctionSoloBot: () => IStack;
    readonly upgradeCoinWarriorDistinctionSoloBotAndvari: () => IStack;
}

/**
 * <h3>Интерфейс для стека действия.</h3>
 */
export interface IStack {
    priority?: number;
    readonly playerId?: number;
    readonly coinId?: number;
    readonly coinValue?: number;
    readonly suit?: SuitNames;
    readonly pickedSuit?: SuitNames;
    readonly value?: number;
    readonly valueArray?: VidofnirVedrfolnirUpgradeValueType;
    readonly configName?: ConfigNames;
    readonly drawName?: DrawNames;
    readonly stageName?: StageNames;
    readonly name?: StackNamesType;
    readonly card?: IMercenaryCampCard | IDwarfCard;
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

/**
 * <h3>Интерфейс для данных карты с основными характеристиками, которые могут и не присутствовать.</h3>
 */
export interface IBasicSuitableNullableCardInfo {
    readonly suit: CanBeNullType<SuitNames>;
    readonly rank: CanBeNullType<number>;
    readonly points: CanBeNullType<number>;
}

/**
 * <h3>Интерфейс для данных карты с основными характеристиками, которые могут должны присутствовать.</h3>
 */
interface IBasicSuitableNonNullableCardInfo extends Pick<IBasicSuitableNullableCardInfo, `points`> {
    readonly suit: SuitNames;
    readonly rank: NonNullable<IBasicSuitableNullableCardInfo[`rank`]>;
}

/**
 * <h3>Интерфейс для данных путей карты.</h3>
 */
interface IPathCardInfo {
    readonly path: string;
}

/**
 * <h3>Интерфейс для данных эпохи карты.</h3>
 */
interface ITierInfo {
    readonly tier: TierType;
}

/**
 * <h3>Интерфейс для данных базы/дополнения игры.</h3>
 */
interface IExpansionCardInfo {
    readonly game: GameNamesKeyofTypeofType;
}

/**
 * <h3>Интерфейс для данных карты с возможными действиями.</h3>
 */
interface ICardWithActionInfo extends ICardWithStackAndBuffs {
    readonly validators?: ValidatorsConfigType;
    readonly actions?: IAction<AutoActionFunctionNames, AutoActionArgsType>;
}

/**
 * <h3>Интерфейс для данных карты со стеком и бафом.</h3>
 */
interface ICardWithStackAndBuffs {
    readonly description: string;
    readonly stack?: IStackCard;
}

/**
 * <h3>Интерфейс для стека у карт.</h3>
 */
interface IStackCard {
    player?: IStack[];
    soloBot?: IStack[];
    soloBotAndvari?: IStack[];
}

/**
 * <h3>Интерфейс для бафа карт Лагеря.</h3>
 */
interface IArtefactBuff {
    readonly name: CampBuffNames;
}

/**
 * <h3>Интерфейс для бафа карт Героев.</h3>
 */
interface IHeroBuff {
    readonly name: HeroBuffNames;
}

/**
 * <h3>Интерфейс для бафа карт Гигантов.</h3>
 */
interface IGiantBuff {
    readonly name: GiantBuffNames;
}

/**
 * <h3>Интерфейс для бафа карт Мифических животных.</h3>
 */
interface IMythicalAnimalBuff {
    readonly name: MythicalAnimalBuffNames;
}

/**
 * <h3>Интерфейс для бафа карт Валькирий.</h3>
 */
interface IValkyryBuff {
    readonly name: ValkyryBuffNames;
}

/**
 * <h3>Интерфейс для остальных бафов карт.</h3>
 */
interface IBuff {
    readonly name: BuffNames;
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

/**
 * <h3>Интерфейс для автоматических действий с параметрами.</h3>
 */
interface IAutoActionFunction {
    (context: MyFnContext, ...params: AutoActionArgsType): void;
}

/**
 * <h3>Интерфейс для действий без параметров.</h3>
 */
export interface IActionFunctionWithoutParams {
    (context: MyFnContext): void;
}

/**
 * <h3>Интерфейс для функций подсчёта очков по фракциям дворфов.</h3>
 */
export interface ISuitScoringFunction {
    (...params: SuitScoringArgsType): number;
}

/**
 * <h3>Интерфейс для функций подсчёта очков по артефактам.</h3>
 */
export interface IArtefactScoringFunction {
    ({ G, ctx, playerID, ...rest }: MyFnContext, ...params: ScoringArgsCanBeUndefType): number;
}

// TODO Rework common ScoringFunction interfaces!?
/**
 * <h3>Интерфейс для функций подсчёта очков по героям.</h3>
 */
export interface IHeroScoringFunction {
    ({ G, ctx, playerID, ...rest }: MyFnContext, ...params: ScoringArgsCanBeUndefType): number;
}

/**
 * <h3>Интерфейс для функций подсчёта очков по мифическим животным.</h3>
 */
export interface IMythicalAnimalScoringFunction {
    ({ G, ctx, playerID, ...rest }: MyFnContext, ...params: ScoringArgsType): number;
}

/**
 * <h3>Интерфейс для функций подсчёта очков по гигантам.</h3>
 */
export interface IGiantScoringFunction {
    ({ G, ctx, playerID, ...rest }: MyFnContext, ...params: ScoringArgsType): number;
}

/**
 * <h3>Интерфейс для функций подсчёта очков по валькириям.</h3>
 */
export interface IValkyryScoringFunction {
    (...params: ScoringArgsType): number;
}

/**
 * <h3>Интерфейс для функций получения преимущества по фракциям дворфов.</h3>
 */
export interface IDistinctionAwardingFunction {
    ({ G, ctx, playerID, ...rest }: MyFnContext): number;
}

/**
 * <h3>Интерфейс для функций мувов.</h3>
 */
interface IMoveFunction {
    (...args: ArgsType): void;
}

/**
 * <h3>Интерфейс для статуса дополнения игры.</h3>
 */
interface IExpansion {
    readonly active: boolean;
}

/**
 * <h3>Интерфейс для логирования данных.</h3>
 */
export interface ILogData {
    readonly type: LogTypeNames;
    // TODO Move to Log enums
    readonly value: string;
}

/**
 * <h3>Интерфейс для игровых пользовательских данных G.</h3>
 */
export interface IMyGameState {
    readonly mode: GameModeNames;
    soloGameDifficultyLevel: CanBeNullType<SoloGameDifficultyLevelType>;
    soloGameAndvariStrategyVariantLevel: CanBeNullType<SoloGameAndvariStrategyVariantLevelType>;
    soloGameAndvariStrategyLevel: CanBeNullType<SoloGameAndvariStrategyNames>;
    odroerirTheMythicCauldron: boolean;
    readonly odroerirTheMythicCauldronCoins: ICoin[];
    readonly averageCards: SuitPropertyType<IDwarfCard>;
    readonly botData: IBotData;
    readonly deckLength: [number, number];
    readonly campDeckLength: [number, number];
    mythologicalCreatureDeckForSkymir: CanBeNullType<MythologicalCreatureCardsArrayType>;
    mythologicalCreatureDeckLength: number;
    mythologicalCreatureNotInGameDeckLength: number;
    explorerDistinctionCardId: CanBeNullType<number>,
    explorerDistinctionCards: CanBeNullType<ExplorerDistinctionCardsArrayType>;
    readonly camp: CampCardArrayType;
    readonly secret: ISecret;
    readonly campNum: 5;
    mustDiscardTavernCardJarnglofi: CanBeNullType<boolean>;
    campPicked: boolean;
    currentTavern: CurrentTavernType;
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
    readonly drawSize: DrawSizeType;
    exchangeOrder: CanBeUndefType<number>[];
    readonly expansions: ExpansionsType;
    readonly heroes: IHeroCard[];
    readonly heroesForSoloBot: CanBeNullType<HeroesForSoloGameArrayType>;
    heroesForSoloGameDifficultyLevel: CanBeNullType<IHeroCard[]>;
    heroesInitialForSoloGameForBotAndvari: CanBeNullType<HeroesInitialForSoloGameForBotAndvariArrayType>;
    heroesForSoloGameForStrategyBotAndvari: CanBeNullType<HeroesForSoloGameForStrategyBotAndvariArrayType>;
    strategyForSoloBotAndvari: IStrategyForSoloBotAndvari;
    readonly log: boolean;
    readonly logData: ILogData[];
    readonly marketCoins: ICoin[];
    readonly marketCoinsUnique: ICoin[];
    // TODO Move number => type
    round: number;
    readonly suitsNum: 5;
    tavernCardDiscarded2Players: boolean;
    readonly taverns: TavernsType;
    readonly tavernsNum: 3;
    tierToEnd: TierToEndType;
    readonly totalScore: number[];
    readonly players: IPlayers;
    readonly publicPlayers: IPublicPlayers;
    publicPlayersOrder: string[];
    readonly winner: number[];
}

/**
 * <h3>Интерфейс для стратегий соло бота Андвари.</h3>
 */
export interface IStrategyForSoloBotAndvari {
    readonly general: {
        0?: SuitNames;
        1?: SuitNames;
        2?: SuitNames;
    },
    readonly reserve: {
        1?: SuitNames;
        2?: SuitNames;
        3?: SuitNames;
        4?: SuitNames;
    };

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
export interface ICondition {
    readonly suit: SuitNames;
    readonly value: number;
}

/**
 * <h3>Интерфейс для условий карты героя.</h3>
 */
export interface IConditions {
    readonly suitCountMin: ICondition;
}

/**
 * <h3>Интерфейс для карты сброса для валидатора выбора карт.</h3>
 */
interface IDiscardCard {
    readonly suit: CanBeNullType<SuitNames>;
    readonly number?: number;
}

/**
 * <h3>Интерфейс для возможных мувов у ботов.</h3>
 */
export interface IMoves {
    readonly move: MoveNamesType;
    readonly args: MoveArgsType;
}

/**
 * <h3>Интерфейс для аргументов монет у мува.</h3>
 */
export interface IMoveCoinsArguments {
    readonly coinId: number;
    readonly type: CoinTypeNames;
}

/**
 * <h3>Интерфейс для аргументов id карты у мува.</h3>
 */
interface ICardId {
    readonly cardId: number;
}

/**
 * <h3>Интерфейс для выбранного аргумента мувов с фракциями для ботов.</h3>
 */
export interface IMoveSuitCardCurrentId extends ICardId {
    readonly suit: SuitNames;
}

/**
 * <h3>Интерфейс для аргументов карт и id игрока у мува.</h3>
 */
export interface IMoveCardsArguments {
    readonly cards: number[];
}

/**
 * <h3>Интерфейс для возможных валидаторов у мувов.</h3>
 */
export interface IMoveBy {
    readonly default: null;
    readonly chooseDifficultySoloModeAndvari: IMoveByChooseDifficultySoloModeAndvariOptions;
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

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByChooseDifficultySoloModeOptions {
    readonly default1: IMoveValidators[MoveValidatorNames.ChooseDifficultyLevelForSoloModeMoveValidator];
    readonly chooseHeroesForSoloMode: IMoveValidators[MoveValidatorNames.ChooseHeroesForSoloModeMoveValidator];
    readonly upgradeCoinSoloBot: IMoveValidators[MoveValidatorNames.SoloBotClickCoinToUpgradeMoveValidator];
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByChooseDifficultySoloModeAndvariOptions {
    readonly default1: IMoveValidators[MoveValidatorNames.ChooseStrategyVariantForSoloModeAndvariMoveValidator];
    readonly default2: IMoveValidators[MoveValidatorNames.ChooseStrategyForSoloModeAndvariMoveValidator];
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByBidOptions {
    readonly default1: IMoveValidators[MoveValidatorNames.ClickHandCoinMoveValidator];
    readonly default2: IMoveValidators[MoveValidatorNames.ClickBoardCoinMoveValidator];
    readonly default3: IMoveValidators[MoveValidatorNames.BotsPlaceAllCoinsMoveValidator];
    readonly default4: IMoveValidators[MoveValidatorNames.SoloBotPlaceAllCoinsMoveValidator];
    readonly default5: IMoveValidators[MoveValidatorNames.SoloBotAndvariPlaceAllCoinsMoveValidator];
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByBidUlineOptions {
    readonly default1: IMoveValidators[MoveValidatorNames.ClickHandCoinUlineMoveValidator];
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
interface IMoveBySoloBotCommonOptions {
    readonly pickHeroSoloBot: IMoveValidators[MoveValidatorNames.SoloBotClickHeroCardMoveValidator];
    readonly placeThrudHeroSoloBot: IMoveValidators[MoveValidatorNames.SoloBotPlaceThrudHeroMoveValidator];
    readonly upgradeCoinSoloBot: IMoveValidators[MoveValidatorNames.SoloBotClickCoinToUpgradeMoveValidator];
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
interface IMoveBySoloBotAndvariCommonOptions {
    readonly pickHeroSoloBotAndvari: IMoveValidators[MoveValidatorNames.SoloBotAndvariClickHeroCardMoveValidator];
    readonly placeThrudHeroSoloBotAndvari:
    IMoveValidators[MoveValidatorNames.SoloBotAndvariPlaceThrudHeroMoveValidator];
    readonly upgradeCoinSoloBotAndvari:
    IMoveValidators[MoveValidatorNames.SoloBotAndvariClickCoinToUpgradeMoveValidator];
}

/**
 * <h3>Интерфейс для возможных общих валидаторов у мува.</h3>
 */
interface IMoveByCommonOptions {
    readonly addCoinToPouch: IMoveValidators[MoveValidatorNames.AddCoinToPouchMoveValidator];
    readonly chooseCoinValueForVidofnirVedrfolnirUpgrade:
    IMoveValidators[MoveValidatorNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator];
    readonly discardBoardCard: IMoveValidators[MoveValidatorNames.DiscardCardMoveValidator];
    readonly discardSuitCard: IMoveValidators[MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator];
    readonly pickCampCardHolda: IMoveValidators[MoveValidatorNames.ClickCampCardHoldaMoveValidator];
    readonly clickConcreteCoinToUpgrade: IMoveValidators[MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator];
    readonly pickDiscardCard: IMoveValidators[MoveValidatorNames.PickDiscardCardMoveValidator];
    readonly pickHero: IMoveValidators[MoveValidatorNames.ClickHeroCardMoveValidator];
    readonly placeMultiSuitsCards: IMoveValidators[MoveValidatorNames.PlaceMultiSuitCardMoveValidator];
    readonly placeThrudHero: IMoveValidators[MoveValidatorNames.PlaceThrudHeroMoveValidator];
    readonly upgradeCoin: IMoveValidators[MoveValidatorNames.ClickCoinToUpgradeMoveValidator];
    readonly upgradeVidofnirVedrfolnirCoin:
    IMoveValidators[MoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator];
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByTavernsResolutionOptions extends IMoveByCommonOptions, IMoveBySoloBotCommonOptions,
    IMoveBySoloBotAndvariCommonOptions {
    readonly default1: IMoveValidators[MoveValidatorNames.ClickCardMoveValidator];
    readonly default2: IMoveValidators[MoveValidatorNames.ClickCampCardMoveValidator];
    readonly default3: IMoveValidators[MoveValidatorNames.SoloBotClickCardMoveValidator];
    readonly default4: IMoveValidators[MoveValidatorNames.SoloBotAndvariClickCardMoveValidator];
    readonly chooseSuitOlrun: IMoveValidators[MoveValidatorNames.ChooseSuitOlrunMoveValidator];
    readonly discardCard: IMoveValidators[MoveValidatorNames.DiscardCard2PlayersMoveValidator];
    readonly getMythologyCard: IMoveValidators[MoveValidatorNames.DiscardCard2PlayersMoveValidator];
    readonly placeTradingCoinsUline: IMoveValidators[MoveValidatorNames.ClickHandTradingCoinUlineMoveValidator];
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByEnlistmentMercenariesOptions extends IMoveByCommonOptions {
    readonly default1: IMoveValidators[MoveValidatorNames.StartEnlistmentMercenariesMoveValidator];
    readonly default2: IMoveValidators[MoveValidatorNames.PassEnlistmentMercenariesMoveValidator];
    readonly default3: IMoveValidators[MoveValidatorNames.GetEnlistmentMercenariesMoveValidator];
    readonly placeEnlistmentMercenaries: IMoveValidators[MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator];
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPlaceYludOptions extends IMoveByCommonOptions, IMoveBySoloBotCommonOptions,
    IMoveBySoloBotAndvariCommonOptions {
    readonly default1: IMoveValidators[MoveValidatorNames.PlaceYludHeroMoveValidator];
    readonly default2: IMoveValidators[MoveValidatorNames.SoloBotPlaceYludHeroMoveValidator];
    readonly default3: IMoveValidators[MoveValidatorNames.SoloBotAndvariPlaceYludHeroMoveValidator];
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByTroopEvaluationOptions extends IMoveByCommonOptions, IMoveBySoloBotCommonOptions,
    IMoveBySoloBotAndvariCommonOptions {
    readonly default1: IMoveValidators[MoveValidatorNames.ClickDistinctionCardMoveValidator];
    readonly pickDistinctionCard: IMoveValidators[MoveValidatorNames.ClickCardToPickDistinctionMoveValidator];
    readonly pickDistinctionCardSoloBot:
    IMoveValidators[MoveValidatorNames.SoloBotClickCardToPickDistinctionMoveValidator];
    readonly pickDistinctionCardSoloBotAndvari:
    IMoveValidators[MoveValidatorNames.SoloBotAndvariClickCardToPickDistinctionMoveValidator];
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByBrisingamensEndGameOptions {
    readonly default1: IMoveValidators[MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator];
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByGetMjollnirProfitOptions {
    readonly default1: IMoveValidators[MoveValidatorNames.GetMjollnirProfitMoveValidator];
}

/**
 * <h3>Интерфейс для валидатора мувов.</h3>
 */
export interface IMoveValidator<GetRangeType extends MoveValidatorGetRangeType> {
    readonly getRange: ({ G, ctx, playerID }: MyFnContext) => GetRangeType;
    readonly getValue: ({ G, ctx }: MyFnContext, moveRangeData: GetRangeType) =>
        GetRangeType extends Partial<SuitPropertyType<number[]>> ? IMoveSuitCardCurrentId
        : GetRangeType extends IMoveCardsArguments ? MoveCardIdType
        : GetRangeType extends IMoveCoinsArguments[] ? IMoveCoinsArguments
        : GetRangeType extends SuitNames[] ? SuitNames
        : GetRangeType extends SoloGameAndvariStrategyNames[] ? SoloGameAndvariStrategyNames
        : GetRangeType extends number[][] ? number[]
        : GetRangeType extends number[] ? number
        : GetRangeType extends null ? null
        : never;
    readonly moveName: MoveNamesType;
    readonly validate: ({ G, ctx }: MyFnContext, id:
        GetRangeType extends Partial<SuitPropertyType<number[]>> ? IMoveSuitCardCurrentId
        : GetRangeType extends IMoveCardsArguments ? MoveCardIdType
        : GetRangeType extends IMoveCoinsArguments[] ? IMoveCoinsArguments
        : GetRangeType extends SuitNames[] ? SuitNames
        : GetRangeType extends SoloGameAndvariStrategyNames[] ? SoloGameAndvariStrategyNames
        : GetRangeType extends number[][] ? number[]
        : GetRangeType extends number[] ? number
        : GetRangeType extends null ? null
        : never) => boolean;
}

/**
 * <h3>Интерфейс для объекта валидаторов мувов.</h3>
 */
export interface IMoveValidators {
    readonly ChooseSuitOlrunMoveValidator: IMoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly ClickBoardCoinMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickCampCardMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickCardMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickCardToPickDistinctionMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickDistinctionCardMoveValidator: IMoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly ClickHandCoinMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickHandCoinUlineMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickHandTradingCoinUlineMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly DiscardCardFromPlayerBoardMoveValidator:
    IMoveValidator<MoveArgumentsType<Partial<SuitPropertyType<number[]>>>>;
    readonly DiscardCard2PlayersMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly GetEnlistmentMercenariesMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly GetMjollnirProfitMoveValidator: IMoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly GetMythologyCardMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly PassEnlistmentMercenariesMoveValidator: IMoveValidator<MoveArgumentsType<null>>;
    readonly PlaceEnlistmentMercenariesMoveValidator: IMoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly PlaceYludHeroMoveValidator: IMoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly StartEnlistmentMercenariesMoveValidator: IMoveValidator<MoveArgumentsType<null>>;
    // Bots
    readonly BotsPlaceAllCoinsMoveValidator: IMoveValidator<MoveArgumentsType<number[][]>>;
    // Solo Bot
    readonly SoloBotClickCardMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly SoloBotPlaceAllCoinsMoveValidator: IMoveValidator<MoveArgumentsType<number[][]>>;
    readonly SoloBotClickHeroCardMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly SoloBotClickCardToPickDistinctionMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly SoloBotPlaceThrudHeroMoveValidator: IMoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly SoloBotPlaceYludHeroMoveValidator: IMoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly SoloBotClickCoinToUpgradeMoveValidator: IMoveValidator<MoveArgumentsType<IMoveCoinsArguments[]>>;
    // Solo Mode
    readonly ChooseDifficultyLevelForSoloModeMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly ChooseHeroesForSoloModeMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    // Solo Mode Andvari
    readonly SoloBotAndvariClickCardMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly ChooseStrategyForSoloModeAndvariMoveValidator:
    IMoveValidator<MoveArgumentsType<SoloGameAndvariStrategyNames[]>>;
    readonly ChooseStrategyVariantForSoloModeAndvariMoveValidator:
    IMoveValidator<MoveArgumentsType<SoloGameAndvariStrategyVariantLevelType[]>>;
    readonly SoloBotAndvariPlaceAllCoinsMoveValidator: IMoveValidator<MoveArgumentsType<number[][]>>;
    readonly SoloBotAndvariClickHeroCardMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly SoloBotAndvariClickCardToPickDistinctionMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly SoloBotAndvariPlaceThrudHeroMoveValidator: IMoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly SoloBotAndvariPlaceYludHeroMoveValidator: IMoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly SoloBotAndvariClickCoinToUpgradeMoveValidator: IMoveValidator<MoveArgumentsType<IMoveCoinsArguments[]>>;
    // start
    readonly AddCoinToPouchMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickCampCardHoldaMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickConcreteCoinToUpgradeMoveValidator: IMoveValidator<MoveArgumentsType<IMoveCoinsArguments[]>>;
    readonly ClickCoinToUpgradeMoveValidator: IMoveValidator<MoveArgumentsType<IMoveCoinsArguments[]>>;
    readonly ClickHeroCardMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly DiscardCardMoveValidator: IMoveValidator<MoveArgumentsType<Partial<SuitPropertyType<number[]>>>>;
    readonly DiscardSuitCardFromPlayerBoardMoveValidator:
    IMoveValidator<MoveArgumentsType<IMoveCardsArguments>>;
    readonly PickDiscardCardMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly PlaceMultiSuitCardMoveValidator: IMoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly PlaceThrudHeroMoveValidator: IMoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly UpgradeCoinVidofnirVedrfolnirMoveValidator: IMoveValidator<MoveArgumentsType<IMoveCoinsArguments[]>>;
    // end
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
interface INumberArrayValues {
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
    readonly [index: number]: PointsValuesType;
}

export type MythologicalCreatureConfigType = {
    readonly [index: number]: number;
};

/**
 * <h3>Интерфейс для видов бафов у карт.</h3>
 */
export interface IBuffs {
    readonly countDistinctionAmount?: true;
    readonly countPickedHeroAmount?: true;
    readonly countBettermentAmount?: true;
    readonly countBidWinnerAmount?: true;
    readonly countPickedCardClassRankAmount?: true;
    readonly dagdaDiscardOnlyOneCards?: true;
    readonly discardCardEndGame?: true;
    readonly endTier?: true;
    readonly hasOneNotCountHero?: true;
    readonly everyTurn?: true;
    readonly explorerDistinctionGetSixCards?: true;
    readonly getMjollnirProfit?: true;
    readonly goCamp?: true;
    readonly goCampOneTime?: true;
    readonly moveThrud?: SuitNames;
    readonly noHero?: true;
    readonly playerHasActiveGiantGymir?: true;
    readonly playerHasActiveGiantHrungnir?: true;
    readonly playerHasActiveGiantSkymir?: true;
    readonly playerHasActiveGiantSurt?: true;
    readonly playerHasActiveGiantThrivaldi?: true;
    readonly ratatoskFinalScoring?: true;
    readonly suitIdForMjollnir?: SuitNames;
    readonly suitIdForOlrun?: SuitNames | true;
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
    readonly campCards: CampCreatureCommandZoneCardType[];
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
    readonly CampBack: (tier: TierType) => IBackground;
    readonly CampCard: (cardPath: string) => IBackground;
    readonly CardBack: (tier: TierType) => IBackground;
    readonly Card: (suit: SuitNames, name: CardNamesForStylesType, points: CanBeNullType<number>) => IBackground;
    readonly Coin: (value: number, initial: boolean) => IBackground;
    readonly CoinSmall: (value: number, initial: boolean) => IBackground;
    readonly CoinBack: () => IBackground;
    readonly Distinction: (distinction: SuitNames) => IBackground;
    readonly DistinctionsBack: () => IBackground;
    readonly Exchange: () => IBackground;
    readonly Hero: (heroName: HeroNames) => IBackground;
    readonly HeroBack: () => IBackground;
    readonly MythologicalCreature: (name: MythologicalCreatureNameType) => IBackground;
    readonly Priorities: (priority: number) => IBackground;
    readonly Priority: () => IBackground;
    readonly RoyalOffering: (name: RoyalOfferingNames) => IBackground;
    readonly Suit: (suit: SuitNames) => IBackground;
    readonly Tavern: (tavernId: IndexOf<TavernsConfigType>) => IBackground;
}

/**
 * <h3>Интерфейс для фракций.</h3>
 */
export interface ISuit {
    readonly suit: SuitNames;
    readonly suitName: RusSuitNames;
    readonly suitColor: string;
    readonly description: string;
    readonly pointsValues: () => IPointsValues;
    readonly scoringRule: IAction<SuitScoringFunctionNames, undefined>;
    readonly distinction: IDistinction;
}

/**
 * <h3>Интерфейс для преимущества по фракции дворфов.</h3>
 */
interface IDistinction {
    readonly description: string;
    readonly awarding: IAction<DistinctionAwardingFunctionNames, undefined>;
}

/**
 * <h3>Интерфейс для конфига конкретной таверны.</h3>
 */
export interface ITavernInConfig {
    readonly name: TavernNames;
}

/**
 * <h3>Типы данных для всех бафов.</h3>
 */
export type BuffTypes = IGiantBuff | IValkyryBuff | IMythicalAnimalBuff | IArtefactBuff | IHeroBuff | IBuff;

/**
 * <h3>Типы данных для названий всех бафов.</h3>
 */
export type AllBuffNames =
    BuffNames | CampBuffNames | GiantBuffNames | HeroBuffNames | MythicalAnimalBuffNames | ValkyryBuffNames;

/**
 * <h3>Типы данных для всех названий мувов.</h3>
 */
export type MoveNamesType =
    ButtonMoveNames | CardMoveNames | EmptyCardMoveNames | CoinMoveNames | SuitMoveNames | AutoBotsMoveNames;

/**
 * <h3>Типы данных для конфига всех таверн.</h3>
 */
export type TavernsConfigType = readonly [ITavernInConfig, ITavernInConfig, ITavernInConfig];

/**
 * <h3>Типы данных для количества всех игроков.</h3>
 */
export type NumPlayersType = 2 | ThreeOrFourOrFiveType;

/**
 * <h3>Типы данных для конфига всех Королевских наград.</h3>
 */
export type RoyalOfferingsConfigType = readonly [IRoyalOfferingCardConfig, IRoyalOfferingCardConfig];

/**
 * <h3>Типы данных для конфига всех кристаллов.</h3>
 */
export type PrioritiesConfigType = [IPriority[], IPriority[], IPriority[], IPriority[], IPriority[]];

/**
 * <h3>Типы данных для всех таверн.</h3>
 */
export type TavernsType = [CanBeNullType<DeckCardType>[], TavernAllCardType, CanBeNullType<DeckCardType>[]];

/**
 * <h3>Типы данных для скрытых для всех игроков данных всех дек.</h3>
 */
export type SecretDecksType = [DeckCardType[], DeckCardType[]];

export type SecretCampDecksType = [CampDeckCardType[], CampDeckCardType[]];

/**
 * <h3>Типы данных для дебага.</h3>
 */
export type DebugDrawDataType = {
    readonly [K in KeyofType<DrawObjectDataType>]: DrawObjectDataType[K];
};

/**
 * <h3>Типы данных для базовых значений обмена монеты по артефакту 'Vidofnir Vedrfolnir'.</h3>
 */
export type BasicVidofnirVedrfolnirUpgradeValueType = 2 | 3 | 5;

export type AllHeroCardType = IHeroCard | IHeroPlayerCard;

/**
 * <h3>Типы данных для значений обмена монеты по артефакту 'Vidofnir Vedrfolnir' для стека.</h3>
 */
export type VidofnirVedrfolnirUpgradeValueType = [BasicVidofnirVedrfolnirUpgradeValueType]
    | [BasicVidofnirVedrfolnirUpgradeValueType, Exclude<BasicVidofnirVedrfolnirUpgradeValueType, 5>];

/**
* <h3>Типы данных для значений бафов.</h3>
*/
export type BuffValueType = SuitNames | true;

/**
 * <h3>Типы данных для значений '1' или '2' приоритетов для стека.</h3>
 */
export type OneOrTwoType = 1 | 2;

/**
 * <h3>Типы данных для аргументов id карты и id игрока у мува.</h3>
 */
export type MoveCardIdType = ICardId;

// TODO Rework to + Enlistment mercenaries names - string
/**
 * <h3>Типы данных для названий стеков.</h3>
 */
type StackNamesType = HeroNames | MultiSuitCardNames | string;

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

/**
 * <h3>Типы данных для карт колоды лагеря в командной зоне игрока.</h3>
 */
export type CampCreatureCommandZoneCardType = IArtefactCampCard | IMercenaryCampCard;

/**
 * <h3>Типы данных для закрытых монет.</h3>
 */
type ClosedCoinType = Record<string, never>;

/**
 * <h3>Типы данных для публичных монет.</h3>
 */
export type PublicPlayerCoinType = CoinType | ClosedCoinType;

/**
 * <h3>Типы данных для дек карт.</h3>
 */
export type DeckCardType = IDwarfCard | IRoyalOfferingCard;

/**
 * <h3>Типы данных для карт колоды сброса.</h3>
 */
export type DiscardDeckCardType = DeckCardType;

/**
 * <h3>Типы данных для сброса карт лагеря.</h3>
 */
export type DiscardCampCardType = CampDeckCardType | IMercenaryPlayerCampCard;

/**
 * <h3>Типы данных для карт со стеком.</h3>
 */
export type CardsHasStackType = IHeroCard | IArtefactCampCard | IRoyalOfferingCard | MythologicalCreatureDeckCardType;

/**
 * <h3>Типы данных для карт для валидаторов добавления в стек.</h3>
 */
export type CardsHasStackValidatorsType = IHeroCard | IArtefactCampCard;

/**
 * <h3>Типы данных для очков у карт.</h3>
 */
export type PointsType = number | number[];

/**
 * <h3>Типы данных для эпох.</h3>
 */
export type TierType = ZeroOrOneType;

/**
 * <h3>Типы данных для эпох до завершения игры.</h3>
 */
type TierToEndType = ZeroOrOneOrTwoType;

/**
 * <h3>Типы данных для 0 | 1.</h3>
 */
type ZeroOrOneType = 0 | 1;

/**
 * <h3>Типы данных для 0 | 1 | 2.</h3>
 */
export type ZeroOrOneOrTwoType = ZeroOrOneType | 2;

/**
 * <h3>Типы данных для 3 | 4 | 5.</h3>
 */
type ThreeOrFourOrFiveType = 3 | 4 | 5;

export type TwoOrThreeOrFourOrFive = 2 | ThreeOrFourOrFiveType;

/**
 * <h3>Типы данных для 0 | 1 | 2 | 3 | 4.</h3>
 */
export type ZeroOrOneOrTwoOrThreeOrFour = ZeroOrOneOrTwoType | Exclude<ThreeOrFourOrFiveType, 5>;

/**
 * <h3>Типы данных для 1 | 2 | 3 | 4.</h3>
 */
export type OneOrTwoOrThreeOrFour = Exclude<ZeroOrOneOrTwoOrThreeOrFour, 0>;

/**
 * <h3>Типы данных для карт на планшете игрока.</h3>
 */
export type PlayerCardType = IDwarfCard | ISpecialCard | IMultiSuitPlayerCard | IArtefactPlayerCampCard
    | IHeroPlayerCard | IMercenaryPlayerCampCard | IMythicalAnimalCard;

// TODO CanBeUndef<DeckCardType>[] and CanBeUndef<MythologicalCreatureDeckCardType>[]?
/**
 * <h3>Типы данных для карт таверн.</h3>
 */
export type TavernCardType = CanBeNullType<DeckCardType | MythologicalCreatureDeckCardType>;

/**
 * <h3>Типы данных для номера текущей таверны.</h3>
 */
type CurrentTavernType = ZeroOrOneOrTwoType;

/**
 * <h3>Типы данных для отрисовки количества карт в таверне.</h3>
 */
export type DrawSizeType = ThreeOrFourOrFiveType;

/**
 * <h3>Типы данных для значений уровня сложности соло режима.</h3>
 */
export type SoloGameDifficultyLevelType = ZeroOrOneOrTwoType | ThreeOrFourOrFiveType | 6;

/**
 * <h3>Типы данных для значений аргументов уровня сложности соло режима.</h3>
 */
export type SoloGameDifficultyLevelArgType = Exclude<SoloGameDifficultyLevelType, 6>;

/**
 * <h3>Типы данных для вариантов значений уровня сложности стратегий соло бота Андвари для соло режима.</h3>
 */
export type SoloGameAndvariStrategyVariantLevelType = 1 | 2 | 3;

/**
 * <h3>Типы данных для всех типов карт.</h3>
 */
export type AllCardType = PlayerCardType | IHeroCard | IRoyalOfferingCard | IMercenaryCampCard
    | IArtefactCampCard | MythologicalCreatureDeckCardType;

/**
* <h3>Типы данных для значений очков карт.</h3>
*/
export type PointsValuesType = INumberValues | INumberArrayValues;

/**
 * <h3>Типы данных для конфигов монет.</h3>
 */
export type CoinConfigType = IMarketCoinConfig | InitialTradingCoinConfigType;

/**
 * <h3>Типы данных для массивов конфигов монет.</h3>
 */
export type CoinConfigArraysType = IMarketCoinConfig[] | InitialTradingCoinConfigType[];

/**
 * <h3>Типы данных для стадий игры для ботов.</h3>
 */
export type ActiveStageAIType = StageNames | `default`;

/**
 * <h3>Типы данных для монет на столе или в руке.</h3>
 */
export type CoinType = CanBeNullType<ICoin>;

/**
 * <h3>Типы данных для отрисовки профита.</h3>
 */
export type DrawProfitType = CanBeNullType<ConfigNames>;

// TODO Can rework "| string"?
/**
 * <h3>Типы данных для названий кнопок.</h3>
 */
export type ButtonNameType = ButtonNames | string;

/**
 * <h3>Типы данных для всех автоматических действий.</h3>
 */
export type AutoActionFunctionType = IActionFunctionWithoutParams | IAutoActionFunction;

/**
 * <h3>Типы данных для всех мувов.</h3>
 */
export type MoveFunctionType = CanBeNullType<IMoveFunction>;

/**
 * <h3>Типы данных для количества и максимального значения шевронов для получения преимуществ по фракциям дворфов.</h3>
 */
export type PlayerRanksAndMaxRanksForDistinctionsType = [number[], number];

/**
 * <h3>Типы данных для значений дебага.</h3>
 */
export type DrawObjectDataType = IDebugData | IDebugData[KeyofType<IDebugData>];

/**
 * <h3>Типы данных для ключей перечислений названий валидаторов выбора карт.</h3>
 */
export type PickCardValidatorNamesKeyofTypeofType = KeyofType<typeof PickCardValidatorNames>;

/**
 * <h3>Типы данных для ключей перечислений названий валидаторов выбора карт героев.</h3>
 */
export type PickHeroCardValidatorNamesKeyofTypeofType = KeyofType<typeof PickHeroCardValidatorNames>;

/**
 * <h3>Типы данных для ключей перечислений названий артефактов.</h3>
 */
export type ArtefactNamesKeyofTypeofType = KeyofType<typeof ArtefactNames>;

/**
 * <h3>Типы данных для ключей перечислений названий базы/дополнений игры.</h3>
 */
export type GameNamesKeyofTypeofType = KeyofType<typeof GameNames>;

/**
 * <h3>Типы данных для ключей перечислений названий героев.</h3>
 */
export type HeroNamesKeyofTypeofType = KeyofType<typeof HeroNames>;

/**
 * <h3>Типы данных для ключей перечислений названий героев для лёгкого уровня сложности стратегий соло бота Андвари.</h3>
 */
export type HeroNamesForEasyStrategyAndvariKeyofTypeofType = KeyofType<SoloGameAndvariEasyStrategyHeroesConfigType>;

/**
 * <h3>Типы данных для ключей перечислений названий героев для сложного уровня сложности стратегий соло бота Андвари.</h3>
 */
export type HeroNamesForHardStrategyAndvariKeyofTypeofType = KeyofType<SoloGameAndvariHardStrategyHeroesConfigType>;

/**
 * <h3>Типы данных для ключей перечислений названий особых карт.</h3>
 */
export type SpecialCardNamesKeyofTypeofType = KeyofType<typeof SpecialCardNames>;

/**
 * <h3>Типы данных для ключей перечислений названий гигантов.</h3>
 */
export type GiantNamesKeyofTypeofType = KeyofType<typeof GiantNames>;

/**
 * <h3>Типы данных для ключей перечислений названий богов.</h3>
 */
export type GodNamesKeyofTypeofType = KeyofType<typeof GodNames>;

/**
 * <h3>Типы данных для ключей перечислений названий мифических животных.</h3>
 */
export type MythicalAnimalNamesKeyofTypeofType = KeyofType<typeof MythicalAnimalNames>;

/**
 * <h3>Типы данных для ключей перечислений названий валькирий.</h3>
 */
export type ValkyryNamesKeyofTypeofType = KeyofType<typeof ValkyryNames>;

/**
 * <h3>Типы данных для ключей перечислений названий мультифракционных карт.</h3>
 */
export type MultiSuitCardNamesKeyofTypeofType = KeyofType<typeof MultiSuitCardNames>;

/**
 * <h3>Типы данных для ключей любого объекта.</h3>
 */
export type KeyofType<T> = keyof T;

/**
 * <h3>Типы данных для аргументов мува.</h3>
 */
export type MoveArgumentsType<T extends MoveArgumentsArgsType> =
    T extends Partial<SuitPropertyType<number[]>> ? Partial<SuitPropertyType<number[]>>
    : T extends IMoveCardsArguments ? IMoveCardsArguments
    : T extends IMoveCoinsArguments[] ? IMoveCoinsArguments[]
    : T extends SuitNames[] ? SuitNames[]
    : T extends SoloGameAndvariStrategyNames[] ? SoloGameAndvariStrategyNames[]
    : T extends number[][] ? number[][]
    : T extends number[] ? number[]
    : T extends null ? null
    : never;

/**
 * <h3>Типы данных для валидаторов значений для мувов.</h3>
 */
export type MoveValidatorGetRangeType = MoveArgumentsType<Partial<SuitPropertyType<number[]>>>
    | MoveArgumentsType<IMoveCardsArguments>
    | MoveArgumentsType<IMoveCoinsArguments[]>
    | MoveArgumentsType<SuitNames[]>
    | MoveArgumentsType<SoloGameAndvariStrategyNames[]>
    | MoveArgumentsType<number[][]>
    | MoveArgumentsType<number[]>
    | MoveArgumentsType<null>;

/**
* <h3>Типы данных для типов аргументов мува.</h3>
*/
type MoveArgumentsArgsType = CanBeNullType<Partial<SuitPropertyType<number[]>> | IMoveCardsArguments
    | IMoveCoinsArguments[] | SuitNames[] | SoloGameAndvariStrategyNames[] | number[][] | number[]>;

/**
* <h3>Типы данных для валидации значений для мувов.</h3>
*/
export type ValidMoveIdParamType = CanBeNullType<number | SuitNames | number[] | IMoveSuitCardCurrentId
    | MoveCardIdType | IMoveCoinsArguments | SoloGameAndvariStrategyNames>;

/**
 * <h3>Типы данных для конфига валидаторов карт.</h3>
 */
export type ValidatorsConfigType = {
    readonly [Property in KeyofType<typeof PickCardValidatorNames>]?: Record<string, never>;
};

/**
 * <h3>Типы данных для дополнений к игре.</h3>
 */
export type ExpansionsType = {
    readonly [Property in KeyofType<typeof GameNames>]: IExpansion;
};

/**
 * <h3>Типы данных для конфига карты Гиганта.</h3>
 */
export type GiantConfigType = {
    readonly [Property in KeyofType<typeof GiantNames>]: IGiantData;
};

/**
 * <h3>Типы данных для конфига карты Бога.</h3>
 */
export type GodConfigType = {
    readonly [Property in KeyofType<typeof GodNames>]: IGodData;
};

/**
 * <h3>Типы данных для конфига карты Мистическое животное.</h3>
 */
export type MythicalAnimalConfigType = {
    readonly [Property in KeyofType<typeof MythicalAnimalNames>]: IMythicalAnimalData;
};

/**
 * <h3>Типы данных для конфига карты Валькирия.</h3>
 */
export type ValkyryConfigType = {
    readonly [Property in KeyofType<typeof ValkyryNames>]: IValkyryData;
};

/**
 * <h3>Тип данных для конфига мультифракционной карты.</h3>
 */
export type MultiCardsConfigType = {
    readonly [Property in KeyofType<typeof MultiSuitCardNames>]: MultiSuitCardDataType;
};

/**
 * <h3>Типы данных для конфига особой карты.</h3>
 */
export type SpecialCardsConfigType = {
    readonly [Property in KeyofType<typeof SpecialCardNames>]: SpecialCardDataType;
};

/**
 * <h3>Типы данных для типов свойств фракционных объектов.</h3>
 */
type SuitPropertyArgType =
    VariantType | IDwarfCard | DistinctionType | number[] | PlayerCardType[] | CanBeNullType<boolean> | MercenaryType;

/**
 * <h3>Типы данных для свойств фракционных объектов.</h3>
 */
export type SuitPropertyType<T extends SuitPropertyArgType> = {
    -readonly [Property in SuitNames]: T;
};

export type MercenariesConfigType = Partial<SuitPropertyType<MercenaryType>>[][];

/**
 * <h3>Типы данных для конфига карт героев.</h3>
 */
export type HeroConfigType = {
    readonly [Property in KeyofType<typeof HeroNames>]: IHeroData;
};

/**
 * <h3>Типы данных для конфига данных карт лагеря артефакт.</h3>
 */
export type ArtefactConfigType = {
    readonly [Property in KeyofType<typeof ArtefactNames>]: IArtefactData;
};

/**
 * <h3>Типы данных для конфига фракций.</h3>
 */
export type SuitConfigType = {
    readonly [Property in SuitNames]: ISuit;
};

/**
 * <h3>Типы данных для всех имён мифологических существ.</h3>
 */
export type MythologicalCreatureNameType = GiantNames | GodNames | MythicalAnimalNames | ValkyryNames;

/**
 * <h3>Типы данных для остаточных аргументов функций.</h3>
 */
export type ArgsType = (CoinTypeNames | SuitNames | number | SoloGameAndvariStrategyNames)[];

/**
 * <h3>Типы данных для аргументов автоматических действий.</h3>
 */
export type AutoActionArgsType = [number/*  | OneOrTwoType */];

/**
 * <h3>Типы данных для аргументов функций подсчёта очков.</h3>
 */
export type ScoringArgsType = [number];

/**
 * <h3>Типы данных для аргументов функций подсчёта очков, которые могут отсутствовать.</h3>
 */
type ScoringArgsCanBeUndefType = [number?];

/**
 * <h3>Типы данных для аргументов функций подсчёта очков по фракциям.</h3>
 */
export type SuitScoringArgsType = [PlayerCardType[], number?, boolean?];

/**
 * <h3>Типы данных для преимуществ.</h3>
 */
export type DistinctionType = CanBeUndefType<CanBeNullType<string>>;

/**
 * <h3>Типы данных для аргументов ошибок.</h3>
 */
export type ErrorArgsType = (string | number)[];

/**
 * <h3>Типы данных для аргументов мувов.</h3>
 */
export type MoveArgsType = [SoloGameAndvariStrategyNames] | number[][] | [SuitNames] | [number] | [SuitNames, number]
    | [number, CoinTypeNames];

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
export type CreateMercenaryPlayerCampCardType = PartialByType<IMercenaryPlayerCampCard, `rank` | `type`>;

/**
 * <h3>Тип для создания карты дворфа.</h3>
 */
export type CreateDwarfCardType = PartialByType<IDwarfCard, `rank` | `type`>;

/**
 * <h3>Типы данных для всех карт сброса.</h3>
 */
export type DiscardCardType =
    PlayerCardType | IRoyalOfferingCard | IArtefactCampCard | MythologicalCreatureDeckCardType;

/**
* <h3>Типы данных для карт, которые добавляются на стол игрока.</h3>
*/
export type AddCardToPlayerType = NonNullable<TavernCardType> | IMercenaryPlayerCampCard | ISpecialCard
    | IMultiSuitPlayerCard | IArtefactPlayerCampCard;

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
export type CreateCoinType = PartialByType<Omit<ICoin, `isOpened`> & ReadonlyByType<ICoin, `isOpened`>,
    `isInitial` | `isOpened` | `isTriggerTrading`>;

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

/**
 * <h3>Тип для данных особых карт.</h3>
 */
export type SpecialCardDataType = Omit<ISpecialCard, `type`>;

/**
 * <h3>Тип для данных мультифракционных карт.</h3>
 */
export type MultiSuitCardDataType = Omit<IMultiSuitCard, `type`> & IExpansionCardInfo;

/**
 * <h3>Тип для варианта карты героя.</h3>
 */
export type VariantType = IBasicSuitableNonNullableCardInfo;

/**
 * <h3>Тип для `INVALID_MOVE`.</h3>
 */
export type InvalidMoveType = `INVALID_MOVE`;

/**
 * <h3>Тип для текстового отображения названий стадии игры.</h3>
 */
export type StageNameTextType = RusStageNames | `none`;

export type MythologicalCreatureDecksType = [MythologicalCreatureDeckCardType[], MythologicalCreatureDeckCardType[]];

// TODO Add Dwarf names to enum!
/**
 * <h3>Тип для названий карт для стилизации обычных карт на столе игрока.</h3>
 */
export type CardNamesForStylesType = SpecialCardNames | MultiSuitCardNames | string;

// TODO Fix it!
/**
 * <h3>Тип для подсчёта очков по положению токена силы валькирии.</h3>
 */
export type StrengthTokenNotchPointsType = [number, number, number, number, number?];

/**
 * <h3>Тип для данных создания всех массивов карт героев.</h3>
 */
export type BuildHeroesArraysType = [IHeroCard[], CanBeNullType<HeroesForSoloGameArrayType>, CanBeNullType<IHeroCard[]>,
    CanBeNullType<HeroesInitialForSoloGameForBotAndvariArrayType>];

/**
 * <h3>Тип для данных массива всех карт героев для стратегий соло бота Андвари в соло игре.</h3>
 */
export type HeroesForSoloGameForStrategyBotAndvariArrayType = [IHeroCard, IHeroCard, IHeroCard, IHeroCard, IHeroCard];

/**
 * <h3>Тип для данных массива всех карт героев для соло бота.</h3>
 */
export type HeroesForSoloGameArrayType = [IHeroCard, IHeroCard, IHeroCard, IHeroCard, IHeroCard];

/**
 * <h3>Тип для данных массива всех карт мифических существ для Skymir.</h3>
 */
export type MythologicalCreatureCardsArrayType = [MythologicalCreatureDeckCardType, MythologicalCreatureDeckCardType,
    MythologicalCreatureDeckCardType, MythologicalCreatureDeckCardType?, MythologicalCreatureDeckCardType?];

/**
 * <h3>Тип для данных массива всех карт героев для соло бота.</h3>
 */
export type ExplorerDistinctionCardsArrayType =
    [DeckCardType, DeckCardType?, DeckCardType?, DeckCardType?, DeckCardType?, DeckCardType?];

/**
 * <h3>Тип для данных массива всех карт лагеря.</h3>
 */
export type CampCardArrayType = [CanBeNullType<CampCardType>, CanBeNullType<CampCardType>, CanBeNullType<CampCardType>,
    CanBeNullType<CampCardType>, CanBeNullType<CampCardType>];

/**
 * <h3>Тип для данных массива всех карт героев для выбора уровня сложности для соло бота.</h3>
 */
export type HeroesInitialForSoloGameForBotAndvariArrayType =
    [IHeroCard, IHeroCard, IHeroCard, IHeroCard, IHeroCard, IHeroCard, IHeroCard, IHeroCard, IHeroCard, IHeroCard];

/**
 * <h3>Тип для названий действий.</h3>
 */
type ActionNamesType = GiantScoringFunctionNames | MythicalAnimalScoringFunctionNames | ValkyryScoringFunctionNames
    | ArtefactScoringFunctionNames | HeroScoringFunctionNames | AutoActionFunctionNames | SuitScoringFunctionNames
    | DistinctionAwardingFunctionNames;

/**
* <h3>Тип для аргументов действий.</h3>
*/
type ActionParamsType = CanBeUndefType<ScoringArgsType | AutoActionArgsType>;

/**
 * <h3>Тип для создания публичных данных игрока.</h3>
 */
export type CreatePublicPlayerType =
    PartialByType<Omit<IPublicPlayer, `pickedCard` | `priority` | `selectedCoin` | `stack`>
        & ReadonlyByType<IPublicPlayer, `priority` | `selectedCoin` | `stack`>,
        `heroes` | `campCards` | `mythologicalCreatureCards` | `stack` | `buffs` | `selectedCoin`>;

/**
* <h3>Тип для конфига уровня сложности для соло игры.</h3>
*/
export type SoloGameDifficultyLevelHeroesConfigType =
    Pick<HeroConfigType, `Astrid` | `Grid` | `Skaa` | `Thrud` | `Uline` | `Ylud`>;

/**
* <h3>Тип для конфига лёгких стратегий соло бота Андвари для соло игры.</h3>
*/
export type SoloGameAndvariEasyStrategyHeroesConfigType =
    Pick<HeroConfigType, `Bonfur` | `Hourya` | `Kraal` | `Zoral` | `Dagda`>;

/**
* <h3>Тип для конфига сложных стратегий соло бота Андвари для соло игры.</h3>
*/
export type SoloGameAndvariHardStrategyHeroesConfigType =
    Pick<HeroConfigType, `Lokdur` | `Idunn` | `Tarah` | `Aral` | `Aegur`>;

export type SoloGameAndvariHeroesForPlayersConfigType = Pick<HeroConfigType, `Astrid` | `Dwerg_Aesir` | `Dwerg_Bergelmir` | `Dwerg_Jungir` | `Dwerg_Sigmir` | `Dwerg_Ymir` | `Grid` | `Skaa` | `Thrud` | `Uline` | `Ylud`>;

/**
* <h3>Тип для конфига героев для соло бота для соло игры.</h3>
*/
export type SoloGameHeroesForBotConfigType =
    Pick<HeroConfigType, `Dwerg_Aesir` | `Dwerg_Bergelmir` | `Dwerg_Jungir` | `Dwerg_Sigmir` | `Dwerg_Ymir`>;

/**
* <h3>Тип для конфига героев для игрока для соло игры.</h3>
*/
export type SoloGameHeroesForPlayerConfigType = Pick<HeroConfigType, `Kraal` | `Tarah` | `Aral` | `Dagda` | `Lokdur`
    | `Zoral` | `Aegur` | `Bonfur` | `Hourya` | `Idunn`>;

/**
* <h3>Тип для ключ/значение по ключу объекта ctx.</h3>
*/
export type ObjectEntriesCtxType = [KeyofType<Ctx>, Ctx[KeyofType<Ctx>]];

/**
* <h3>Тип для всех карт таверн.</h3>
*/
export type TavernAllCardType = CanBeNullType<DeckCardType>[] | CanBeNullType<MythologicalCreatureDeckCardType>[];

// My Utilities types
/**
 * <h3>Тип для того, чтобы сделать дополнительный union тип undefined.</h3>
 */
export type CanBeUndefType<T> = T | undefined;

/**
 * <h3>Тип для того, чтобы сделать дополнительный union тип void.</h3>
 */
export type CanBeVoidType<T> = T | void;

/**
 * <h3>Тип для того, чтобы сделать дополнительный union тип null.</h3>
 */
export type CanBeNullType<T> = T | null;

/**
 * <h3>Тип для того, чтобы получить типы пары [ключ, значение] у Object.entries.</h3>
 */
export type ObjectEntriesType<T extends object> = {
    [K in KeyofType<T>]: [K, T[K]];
}[KeyofType<T>][];

/**
 * <h3>Тип для того, чтобы сделать некоторые поля объекта опциональными.</h3>
 */
type PartialByType<T extends object, K extends KeyofType<T>> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * <h3>Тип для того, чтобы сделать некоторые поля объекта только для чтения.</h3>
 */
type ReadonlyByType<T extends object, K extends KeyofType<T>> = Omit<T, K> & Readonly<Pick<T, K>>;

/**
 * <h3>Тип для того, чтобы чтобы получать индексы кортежей.</h3>
 */
export type IndexOf<T extends readonly unknown[], S extends number[] = []> =
    T[`length`] extends S[`length`] ? S[number] : IndexOf<T, [S[`length`], ...S]>;

// My Implementations
export type GameSetupDataType = DefaultPluginAPIs & {
    ctx: Ctx;
};

export type MyFnContext = FnContext & {
    playerID: PlayerID;
};

export interface Game<SetupData = unknown> {
    name?: string;
    minPlayers?: 2;
    maxPlayers?: 5;
    deltaState?: boolean;
    disableUndo?: boolean;
    seed?: string | number;
    setup?: (context: GameSetupDataType, setupData?: SetupData) => IMyGameState;
    validateSetupData?: (setupData: SetupData | undefined, numPlayers: TwoOrThreeOrFourOrFive) => string | undefined;
    moves?: MoveMap;
    phases?: PhaseMap;
    turn?: TurnConfig<null>;
    events?: {
        endGame?: boolean;
        endPhase?: boolean;
        endTurn?: boolean;
        setPhase?: boolean;
        endStage?: boolean;
        setStage?: boolean;
        pass?: boolean;
        setActivePlayers?: boolean;
    };
    endIf?: (context: FnContext) => unknown;
    onEnd?: (context: FnContext) => void | IMyGameState;
    playerView?: (context: { G: IMyGameState; ctx: Ctx; playerID: PlayerID | null; }) => unknown;
    plugins?: Array<Plugin<unknown, unknown, IMyGameState>>;
    ai?: {
        enumerate: ({ G, ctx, playerID }: MyFnContext) => AiEnumerate;
    };
    processMove?: (state: State, action: ActionPayload.MakeMove) => State | typeof INVALID_MOVE;
    flow?: ReturnType<typeof Flow>;
}

export type PhaseMap = {
    [key in KeyofType<IMoveBy> as key extends `default` ? never : key]: PhaseConfig<key>;
};

export interface PhaseConfig<phase extends CanBeNullType<KeyofType<IMoveBy>> = null> {
    start?: boolean;
    next?: ((context: FnContext) => PhaseNames | void) | PhaseNames;
    onBegin?: (context: FnContext) => void | IMyGameState;
    onEnd?: (context: FnContext) => void | IMyGameState;
    endIf?: (context: FnContext) => boolean | void | {
        next: PhaseNames;
    };
    moves?: MoveMap;
    turn?: TurnConfig<phase>;
    wrapped?: {
        endIf?: (state: State) => boolean | void | {
            next: string;
        };
        onBegin?: (state: State) => void | IMyGameState;
        onEnd?: (state: State) => void | IMyGameState;
        next?: (state: State) => PhaseNames | void;
    };
}

export type MoveMap = {
    // TODO it!
    [moveName: string]: Move;
};

export type Move = MoveFn | LongFormMove;

export interface LongFormMove {
    move: MoveFn;
    redact?: boolean | ((context: {
        G: IMyGameState;
        ctx: Ctx;
    }) => boolean);
    noLimit?: boolean;
    client?: boolean;
    undoable?: boolean | ((context: {
        G: IMyGameState;
        ctx: Ctx;
    }) => boolean);
    ignoreStaleStateID?: boolean;
}

export type FnContext = DefaultPluginAPIs & {
    G: IMyGameState;
    ctx: Ctx;
};

export type MoveFn =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (context: MyFnContext, ...args: any[]) => void | IMyGameState | typeof INVALID_MOVE;

export interface TurnConfig<phase extends CanBeNullType<KeyofType<IMoveBy>> = null> {
    activePlayers?: ActivePlayersArg;
    minMoves?: number;
    maxMoves?: number;
    /** @deprecated Use `minMoves` and `maxMoves` instead. */
    moveLimit?: number;
    onBegin?: (context: FnContext) => void | IMyGameState;
    onEnd?: (context: FnContext) => void | IMyGameState;
    endIf?: (context: FnContext) => boolean | void | {
        next: PlayerID;
    };
    onMove?: (context: FnContext & {
        playerID: PlayerID;
    }) => void | IMyGameState;
    stages?: StageMap<phase>;
    order?: TurnOrderConfig<IMyGameState>;
    wrapped?: {
        endIf?: (state: State) => boolean | void | {
            next: PlayerID;
        };
        onBegin?: (state: State) => void | IMyGameState;
        onEnd?: (state: State) => void | IMyGameState;
        onMove?: (state: State & {
            playerID: PlayerID;
        }) => void | IMyGameState;
    };
}

export type StageMap<phase extends CanBeNullType<KeyofType<IMoveBy>> = null> = {
    [key in KeyofType<IMoveBy[phase extends null ? `default` : phase]> as
    key extends `${`default`}${string}` ? never : key]: StageConfig;
};

export interface StageConfig {
    moves?: MoveMap;
    next?: PhaseNames;
}

export interface Ctx {
    numPlayers: TwoOrThreeOrFourOrFive;
    playOrder: Array<PlayerID>;
    playOrderPos: number;
    activePlayers: null | ActivePlayers;
    currentPlayer: PlayerID;
    numMoves?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gameover?: any;
    turn: number;
    phase: PhaseNames;
    _activePlayersMinMoves?: Record<PlayerID, number>;
    _activePlayersMaxMoves?: Record<PlayerID, number>;
    _activePlayersNumMoves?: Record<PlayerID, number>;
    _prevActivePlayers?: Array<{
        activePlayers: null | ActivePlayers;
        _activePlayersMinMoves?: Record<PlayerID, number>;
        _activePlayersMaxMoves?: Record<PlayerID, number>;
        _activePlayersNumMoves?: Record<PlayerID, number>;
    }>;
    _nextActivePlayers?: ActivePlayersArg;
    _random?: {
        seed: string | number;
    };
}

export interface ActivePlayers {
    [playerID: string]: StageNames;
}

export type BoardProps = ClientState & Omit<WrappedBoardProps, keyof ExposedClientProps> & ExposedClientProps & {
    isMultiplayer: boolean;
};

export declare class _ClientImpl<PluginAPIs extends Record<string, unknown> = Record<string, unknown>> {
    private gameStateOverride?;
    private initialState;
    readonly multiplayer: (opts: TransportOpts) => Transport;
    private reducer;
    private _running;
    private subscribers;
    private transport;
    private manager;
    readonly debugOpt?: DebugOpt | boolean;
    readonly game: ReturnType<typeof ProcessGameConfig>;
    readonly store: Store;
    log: State['deltalog'];
    matchID: string;
    playerID: PlayerID | null;
    credentials: string;
    matchData?: FilteredMetadata;
    moves: Record<MoveNamesType, (...args: ArgsType) => void>;
    events: {
        endGame?: (gameover?: unknown) => void;
        endPhase?: () => void;
        endTurn?: (arg?: {
            next: PlayerID;
        }) => void;
        setPhase?: (newPhase: PhaseNames) => void;
        endStage?: () => void;
        setStage?: (newStage: StageNames) => void;
        setActivePlayers?: (arg: ActivePlayersArg) => void;
    };
    plugins: Record<string, (...args: unknown[]) => void>;
    reset: () => void;
    undo: () => void;
    redo: () => void;
    sendChatMessage: (message: unknown) => void;
    chatMessages: ChatMessage[];
    constructor({ game, debug, numPlayers, multiplayer, matchID, playerID, credentials, enhancer, }:
        ClientOpts<PluginAPIs>);
    /** Handle incoming match data from a multiplayer transport. */
    private receiveMatchData;
    /** Handle an incoming chat message from a multiplayer transport. */
    private receiveChatMessage;
    /** Handle all incoming updates from a multiplayer transport. */
    private receiveTransportData;
    private notifySubscribers;
    overrideGameState(state: unknown): void;
    start(): void;
    stop(): void;
    subscribe(fn: (state: ClientState) => void): () => void;
    getInitialState(): State;
    getState(): ClientState;
    private createDispatchers;
    updatePlayerID(playerID: PlayerID | null): void;
    updateMatchID(matchID: string): void;
    updateCredentials(credentials: string): void;
}

export type ClientState = CanBeNullType<State & {
    isActive: boolean;
    isConnected: boolean;
    log: LogEntry[];
}>;

export interface State {
    G: IMyGameState;
    ctx: Ctx;
    deltalog?: Array<LogEntry>;
    plugins: {
        [pluginName: string]: PluginState;
    };
    _undo: Array<Undo>;
    _redo: Array<Undo>;
    _stateID: number;
}

type WrappedBoardProps = Pick<ClientOpts, WrappedBoardDelegates | 'debug'>;

type ExposedClientProps = Pick<_ClientImpl, 'log' | 'moves' | 'events' | 'reset' | 'undo' | 'redo' | 'playerID'
    | 'matchID' | 'matchData' | 'sendChatMessage' | 'chatMessages'>;

type WrappedBoardDelegates = 'matchID' | 'playerID' | 'credentials';
