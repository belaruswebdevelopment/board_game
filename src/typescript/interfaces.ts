import type { ActionPayload, ActivePlayersArg, AiEnumerate, ChatMessage, DefaultPluginAPIs, FilteredMetadata, LobbyAPI, LogEntry, Plugin, PluginState, Store, TurnOrderConfig, Undo } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import type { ClientOpts, DebugOpt } from "boardgame.io/dist/types/src/client/client";
// eslint-disable-next-line import/no-unresolved
import { Transport, type TransportOpts } from "boardgame.io/dist/types/src/client/transport/transport";
// eslint-disable-next-line import/no-unresolved
import { Flow } from "boardgame.io/dist/types/src/core/flow";
// eslint-disable-next-line import/no-unresolved
import { ProcessGameConfig } from "boardgame.io/dist/types/src/core/game";
// eslint-disable-next-line import/no-unresolved
import { GameComponent } from "boardgame.io/dist/types/src/lobby/connection";
// eslint-disable-next-line import/no-unresolved
import { MatchOpts } from "boardgame.io/dist/types/src/lobby/match-instance";
import { ActivateGiantAbilityOrPickCardSubMoveValidatorNames, ActivateGiantAbilityOrPickCardSubStageNames, ActivateGodAbilityOrNotSubMoveValidatorNames, ActivateGodAbilityOrNotSubStageNames, ArtefactDescriptionNames, ArtefactNames, ArtefactScoringFunctionNames, AutoActionFunctionNames, AutoBotsMoveNames, BidsDefaultStageNames, BidsMoveValidatorNames, BidUlineDefaultStageNames, BidUlineMoveValidatorNames, BrisingamensEndGameDefaultStageNames, BrisingamensEndGameMoveValidatorNames, ButtonMoveNames, ButtonNames, CampBuffNames, CardMoveNames, CardTypeRusNames, CardWithoutSuitAndWithActionCssTDClassNames, ChooseDifficultySoloModeAndvariDefaultStageNames, ChooseDifficultySoloModeAndvariMoveValidatorNames, ChooseDifficultySoloModeDefaultStageNames, ChooseDifficultySoloModeMoveValidatorNames, ChooseDifficultySoloModeStageNames, CoinCssClassNames, CoinMoveNames, CoinRusNames, CoinTypeNames, CommonBuffNames, CommonMoveValidatorNames, CommonStageNames, ConfigNames, DistinctionAwardingFunctionNames, DistinctionCardMoveNames, DistinctionDescriptionNames, DrawNames, EmptyCardMoveNames, EnlistmentMercenariesDefaultStageNames, EnlistmentMercenariesMoveValidatorNames, EnlistmentMercenariesStageNames, GameModeNames, GameNames, GetMjollnirProfitDefaultStageNames, GetMjollnirProfitMoveValidatorNames, GiantBuffNames, GiantDescriptionNames, GiantNames, GiantScoringFunctionNames, GodBuffNames, GodDescriptionNames, GodNames, HeroBuffNames, HeroCardCssSpanClassNames, HeroDescriptionNames, HeroNames, HeroScoringFunctionNames, LobbyPhases, LogTypeNames, MultiSuitCardNames, MythicalAnimalBuffNames, MythicalAnimalDescriptionNames, MythicalAnimalNames, MythicalAnimalScoringFunctionNames, PhaseNames, PickCardValidatorNames, PickHeroCardValidatorNames, PlaceYludDefaultStageNames, PlaceYludMoveValidatorNames, RoyalOfferingNames, SoloBotAndvariCommonMoveValidatorNames, SoloBotAndvariCommonStageNames, SoloBotCommonCoinUpgradeMoveValidatorNames, SoloBotCommonCoinUpgradeStageNames, SoloBotCommonMoveValidatorNames, SoloBotCommonStageNames, SoloGameAndvariStrategyNames, SpecialCardNames, StageRusNames, SuitCssBGColorClassNames, SuitDescriptionNames, SuitMoveNames, SuitNames, SuitRusNames, SuitScoringFunctionNames, TavernNames, TavernsResolutionDefaultStageNames, TavernsResolutionMoveValidatorNames, TavernsResolutionStageNames, TavernsResolutionWithSubStageNames, TroopEvaluationDefaultStageNames, TroopEvaluationMoveValidatorNames, TroopEvaluationStageNames, ValkyryBuffNames, ValkyryDescriptionNames, ValkyryNames, ValkyryScoringFunctionNames } from "./enums";
// eslint-disable-next-line import/no-unresolved
import { Client } from "boardgame.io/dist/types/packages/react";

// TODO Check all number/string types here!
// Secret Data Start
/**
 * <h3>Все скрытые от всех игроков данные в `G`.</h3>
 */
export interface AllSecretData {
    readonly campDecks: SecretAllCampDecks;
    readonly decks: SecretAllDwarfDecksArray;
    mythologicalCreatureDeck: SecretMythologicalCreatureDeck;
    mythologicalCreatureNotInGameDeck: SecretMythologicalCreatureNotInGameDeck;
}

/**
 * <h3>Скрытые от всех игроков данные всех колод карт лагеря со всех эпох в `G`.</h3>
 */
export type SecretAllCampDecks = [SecretCampDeckTier0, SecretCampDeckTier1];

/**
 * <h3>Скрытые от всех игроков данные колоды карт лагеря 1 эпохи в `G`.</h3>
 */
export type SecretCampDeckTier0 = CampDeckCardType[];

/**
* <h3>Скрытые от всех игроков данные колоды карт лагеря 2 эпохи в `G`.</h3>
*/
export type SecretCampDeckTier1 = CampDeckCardType[];

/**
 * <h3>Объединение скрытых от всех игроков данных колоды карт лагеря каждой конкретной эпохи в `G`.</h3>
 */
export type SecretCampDeckType = SecretCampDeckTier0 | SecretCampDeckTier1;

/**
 * <h3>Скрытые от всех игроков данные всех колод карт дворфов со всех эпох в `G`.</h3>
 */
export type SecretAllDwarfDecksArray = [SecretDwarfDeckTier0, SecretDwarfDeckTier1];

export type SecretAllDwarfDecksArrayIndex = IndexOf<SecretAllDwarfDecksArray>;

/**
 * <h3>Скрытые от всех игроков данные колоды карт дворфов 1 эпохи в `G`.</h3>
 */
export type SecretDwarfDeckTier0 = DwarfDeckCardType[];

/**
 * <h3>Скрытые от всех игроков данные колоды карт дворфов 2 эпохи в `G`.</h3>
 */
export type SecretDwarfDeckTier1 = DwarfDeckCardType[];

/**
 * <h3>Объединение скрытых от всех игроков данных колоды карт дворфов каждой конкретной эпохи в `G`.</h3>
 */
export type SecretDwarfDeckType = SecretDwarfDeckTier0 | SecretDwarfDeckTier1;

/**
 * <h3>Скрытые от всех игроков данные колоды карт мифических существ в `G`.</h3>
 */
export type SecretMythologicalCreatureDeck = MythologicalCreatureCardType[];

/**
 * <h3>Скрытые от всех игроков данные отложенной колоды карт мифических существ в `G`.</h3>
 */
export type SecretMythologicalCreatureNotInGameDeck = MythologicalCreatureCardType[];
// Secret Data End

// Secret Deck Public Length Start
/**
 * <h3>Количество карт в колодах карт лагеря по каждой эпохе.</h3>
 */
export type CampDecksLength = [SecretCampDeckTier0[`length`], SecretCampDeckTier1[`length`]];

/**
 * <h3>Количество карт в колодах карт дворфов по каждой эпохе.</h3>
 */
export type DwarfDecksLength = [SecretDwarfDeckTier0[`length`], SecretDwarfDeckTier1[`length`]];
// Secret Deck Public Length End

// AI Start
/**
 * <h3>Данные для бота.</h3>
 */
export interface AIBotData {
    readonly allCoinsOrder: number[][];
    readonly allPicks: readonly number[][];
    readonly deckLength: DwarfDecksLength[0];
    readonly maxIter: number;
}

/**
 * <h3>Вес для различных действий ботов.</h3>
 */
interface AIWeight {
    readonly weight: number;
}

export type TavernsHeuristicArrayIndex = IndexOf<TavernsHeuristicArray>;

export type TavernsHeuristicArray = [number, number, number];

export type AICardCharacteristicsArray = [AICardCharacteristics, AICardCharacteristics, AICardCharacteristics];

/**
 * <h3>Эвристика для ботов.</h3>
 */
export interface AIHeuristic<T extends readonly unknown[]> extends AIWeight {
    readonly heuristic: (array: T) => boolean;
}

/**
 * <h3>Цель для ботов.</h3>
 */
interface AIObjective extends AIWeight {
    readonly checker: (G: MyGameState, ctx: Ctx) => boolean;
}

/**
 * <h3>Все цели для ботов.</h3>
 */
export interface AIAllObjectives {
    readonly isEarlyGame: AIObjective;
    readonly isFirst: AIObjective;
    readonly isStronger: AIObjective;
}

/**
 * <h3>Характеристики карты для ботов.</h3>
 */
export interface AICardCharacteristics {
    readonly mean: number;
    readonly variation: number;
}
// AI End

// Debug Start
/**
 * <h3>Данные для панели дебага.</h3>
 */
export interface DebugData {
    readonly G: Partial<Record<KeyofType<MyGameState>, MyGameState[KeyofType<MyGameState>]>>;
    readonly ctx: Partial<Record<KeyofType<Ctx>, Ctx[KeyofType<Ctx>]>>;
}

/**
 * <h3>Объект данных для отрисовки панели дебага.</h3>
 */
export type DebugDrawDataType = {
    readonly [key in KeyofType<DrawDebugObjectDataType>]: DrawDebugObjectDataType[key];
};

/**
 * <h3>Объединение данных для отрисовки панели дебага.</h3>
 */
export type DrawDebugObjectDataType = DebugData | DebugData[KeyofType<DebugData>];

/**
* <h3>Тип для ключ/значение по ключу объекта ctx.</h3>
*/
export type ObjectEntriesCtxType = [KeyofType<Ctx>, Ctx[KeyofType<Ctx>]];
// Debug End

// Suit Start
/**
 * <h3>Конфиг всех фракций дворфов.</h3>
 */
export type SuitConfig = {
    readonly [suit in SuitNames]: Suit;
};

/**
 * <h3>Фракция дворфов.</h3>
 */
export interface Suit {
    readonly description: SuitDescriptionNames;
    readonly distinction: Distinction;
    readonly scoringRule: Action<SuitScoringFunctionNames>;
    readonly suit: SuitNames;
    readonly suitColor: SuitCssBGColorClassNames;
    readonly suitName: SuitRusNames;
    readonly pointsValues: () => PointsValues;
}

/**
 * <h3>Типы данных для типов свойств фракционных объектов.</h3>
 */
type SuitPropertyArgType = DwarfCard | Distinctions | CanBeNullType<boolean> | readonly number[]
    | readonly PlayerBoardCardType[] | VariantType<MercenaryRankType | HeroRankType | MultiSuitRankType>;

/**
 * <h3>Типы данных для свойств фракционных объектов.</h3>
 */
export type SuitPropertyType<T extends SuitPropertyArgType> = {
    -readonly [Property in SuitNames]: T;
};
//Suit End

// Dwarf Cards Start
/**
 * <h3>Объединение данных для колоды карт дворфов.</h3>
 */
export type DwarfDeckCardType = DwarfCard | RoyalOfferingCard;

// DwarfCard Start
/**
 * <h3>Карта дворфа.</h3>
 */
export interface DwarfCard extends PlayerSuitableNonNullableCardInfo<DwarfRankType> {
    // TODO Rework all cards name in Enums
    readonly name: string;
    readonly type: CardTypeRusNames.DwarfCard;
}

/**
 * <h3>Создание карты дворфа.</h3>
 */
export type CreateDwarfCardFromData = Omit<PartialByType<DwarfCard, `type` | `rank`>, `points`> & {
    readonly points: CanBeUndefType<PlayerSuitableNonNullableCardInfo<DwarfRankType>[`points`]>;
};
// DwarfCard End

// DwarfPlayerCard Start
/**
 * <h3>Карта дворфа на поле игрока.</h3>
 */
export interface DwarfPlayerCard extends Pick<DwarfCard, `name`>, BasicSuitableNonNullableCardInfo<DwarfRankType> {
    readonly type: CardTypeRusNames.DwarfPlayerCard;
}

/**
 * <h3>Создание карты дворфа на поле игрока.</h3>
 */
export type CreateDwarfPlayerCardFromData = PartialByType<DwarfPlayerCard, `type` | `rank` | `points`>;
// DwarfPlayerCard End
// Dwarf Cards End

// RoyalOfferingCard Start
/**
 * <h3>Конфиг всех карт королевских наград по каждой эпохе.</h3>
 */
export type RoyalOfferingsConfig = readonly [RoyalOfferingCardData, RoyalOfferingCardData];

/**
 * <h3>Данные карты королевской награды.</h3>
 */
export interface RoyalOfferingCardData extends Omit<RoyalOfferingCard, `type`> {
    readonly amount: () => RoyalOfferingCardPlayersAmount;
}

/**
 * <h3>Карта королевской награды.</h3>
 */
export interface RoyalOfferingCard extends Required<StackCardInfo> {
    readonly name: RoyalOfferingNames;
    readonly type: CardTypeRusNames.RoyalOfferingCard;
    readonly upgradeValue: RoyalOfferingCardValueType;
}

/**
 * <h3>Создание карты королевской награды.</h3>
 */
export type CreateRoyalOfferingCardFromData = PartialByType<RoyalOfferingCard, `type`>;

export type RoyalOfferingCardPlayersAmountType = 0 | 1 | 2 | 3;

/**
 * <h3>Количество карт королевской награды в каждой эпохе в зависимости от количества игроков.</h3>
 */
export type RoyalOfferingCardPlayersAmount = {
    readonly [index in NumPlayersWithBotType]: NumberTierValues<RoyalOfferingCardPlayersAmountType>;
};

/**
 * <h3>Объединение данных для значений карт королевской награды.</h3>
 */
type RoyalOfferingCardValueType = 3 | 5;
// RoyalOfferingCard End

// Hero Cards Start
export type AllHeroesForPlayerOrSoloBotAddToPlayerBoardPossibleCardIdType = AllHeroesPossibleCardIdType
    | AllHeroesForPlayerSoloModePossibleCardIdType | AllHeroesForSoloBotAndvariPossibleCardIdType;

export type AllHeroesPossibleCardIdType =
    AllBasicHeroesPossibleCardIdType | AllAddThingvellirHeroesToBasicPossibleCardIdType;

export type AllBasicHeroesPossibleCardIdType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17
    | 18 | 19 | 20 | 21 | 22;

export type AllAddThingvellirHeroesToBasicPossibleCardIdType = 23 | 24 | 25 | 26 | 27 | 28;

export type AllHeroesForPlayerSoloModePossibleCardIdType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type AllHeroesForPlayerSoloModeAndvariPossibleCardIdType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type AllHeroesForDifficultySoloModePossibleCardIdType = 1 | 2 | 3 | 4 | 5;

export type AllHeroesForSoloBotPossibleCardIdType = 1 | 2 | 3 | 4 | 5;

export type AllHeroesForSoloBotAndvariPossibleCardIdType = 1 | 2 | 3 | 4 | 5;

/**
 * Объединение данных всех типов карт героев.
 */
export type AllHeroCardType = HeroCard | HeroPlayerCard;

/**
 * <h3>Массив данных для создания всех массивов карт героев.</h3>
 */
export type BuildHeroesArray = readonly [HeroCard[], CanBeNullType<HeroesForSoloGameArrayType>,
    CanBeNullType<HeroCard[]>, CanBeNullType<HeroesInitialForSoloGameForBotAndvariArray>];

/**
 * <h3>Массив данных всех карт героев для стратегий соло бота Андвари в соло игре.</h3>
 */
export type HeroesForSoloGameForStrategyBotAndvariArray = [HeroCard, HeroCard, HeroCard, HeroCard, HeroCard];

/**
 * <h3>Массив данных всех карт героев для соло бота.</h3>
 */
export type HeroesForSoloGameArrayType = [HeroCard, HeroCard, HeroCard, HeroCard, HeroCard];

/**
 * <h3>Массив данных всех карт героев для выбора уровня сложности для соло бота.</h3>
 */
export type HeroesInitialForSoloGameForBotAndvariArray =
    [HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard];

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
* <h3>Тип для конфига уровня сложности для соло игры.</h3>
*/
export type SoloGameDifficultyLevelHeroesConfigType =
    Pick<HeroConfig, `Astrid` | `Grid` | `Skaa` | `Thrud` | `Uline` | `Ylud`>;

/**
* <h3>Тип для конфига лёгких стратегий соло бота Андвари для соло игры.</h3>
*/
export type SoloGameAndvariEasyStrategyHeroesConfigType =
    Pick<HeroConfig, `Bonfur` | `Hourya` | `Kraal` | `Zoral` | `Dagda`>;

/**
* <h3>Тип для конфига сложных стратегий соло бота Андвари для соло игры.</h3>
*/
export type SoloGameAndvariHardStrategyHeroesConfigType =
    Pick<HeroConfig, `Lokdur` | `Idunn` | `Tarah` | `Aral` | `Aegur`>;

export type SoloGameAndvariHeroesForPlayersConfigType = Pick<HeroConfig, `Astrid` | `DwergAesir` | `DwergBergelmir`
    | `DwergJungir` | `DwergSigmir` | `DwergYmir` | `Grid` | `Skaa` | `Thrud` | `Uline` | `Ylud`>;

/**
* <h3>Тип для конфига героев для соло бота для соло игры.</h3>
*/
export type SoloGameHeroesForBotConfigType =
    Pick<HeroConfig, `DwergAesir` | `DwergBergelmir` | `DwergJungir` | `DwergSigmir` | `DwergYmir`>;

/**
* <h3>Тип для конфига героев для игрока для соло игры.</h3>
*/
export type SoloGameHeroesForPlayerConfigType = Pick<HeroConfig, `Kraal` | `Tarah` | `Aral` | `Dagda` | `Lokdur`
    | `Zoral` | `Aegur` | `Bonfur` | `Hourya` | `Idunn`>;

// HeroCard Start
/**
 * <h3>Конфига всех карт героев по каждой эпохе.</h3>
 */
export type HeroConfig = {
    readonly [Property in KeyofType<typeof HeroNames>]: HeroCardData;
};

/**
 * <h3>Данные карты героя.</h3>
 */
export interface HeroCardData extends ExpansionCardInfo, PartialByType<Omit<HeroCard, `type` | `active`>,
    `playerSuit` | `rank` | `points` | `buff` | `actions` | `stack` | `pickValidators` | `validators`> {
    readonly scoringRule: Action<HeroScoringFunctionNames, HeroScoringArgsCanBeUndefType>;
}

/**
 * <h3>Карта героя.</h3>
 */
export interface HeroCard extends PlayerSuitableNullableCardInfo<HeroRankType>, AutoActionCardInfo, StackCardInfo {
    active: boolean;
    readonly buff: CanBeUndefType<HeroBuff>;
    readonly description: HeroDescriptionNames;
    readonly name: HeroNames;
    readonly pickValidators: CanBeUndefType<PickValidatorsConfig>;
    readonly type: CardTypeRusNames.HeroCard;
}

/**
 * <h3>Создание карты героя.</h3>
 */
export type CreateHeroCardFromData = Omit<PartialByType<Omit<HeroCard, `active`>
    & ReadonlyByType<HeroCard, `active`>, `type` | `active`>, `playerSuit` | `points` | `rank`>
    & PlayerSuitableNullableCanBeUndefCardInfo<HeroRankType>;

// HeroCard End

// HeroPlayerCard Start
/**
 * <h3>Карта героя на поле игрока.</h3>
 */
export interface HeroPlayerCard extends Pick<HeroCard, `name` | `description`>,
    BasicSuitableNonNullableCardInfo<HeroRankType> {
    readonly type: CardTypeRusNames.HeroPlayerCard;
}

/**
 * <h3>Создание карты героя на поле игрока.</h3>
 */
export type CreateHeroPlayerCardFromData = PartialByType<HeroPlayerCard, `type` | `rank` | `points`>;
// HeroPlayerCard End
// Hero Cards End

// Special Cards Start
/**
 * <h3>Типы данных для ключей перечислений названий особых карт.</h3>
 */
export type SpecialCardNamesKeyofTypeofType = KeyofType<typeof SpecialCardNames>;

// SpecialCard Start
/**
 * <h3>Конфиг всех особых карт по каждой эпохе.</h3>
 */
export type SpecialCardsConfig = {
    readonly [Property in KeyofType<typeof SpecialCardNames>]: SpecialCardData;
};

/**
 * <h3>Данные особой карты.</h3>
 */
export type SpecialCardData = PartialByType<Omit<SpecialCard, `type`>, `points`>;

/**
 * <h3>Особая карта.</h3>
 */
export interface SpecialCard extends PlayerSuitableNullableCardInfo<SpecialRankType> {
    readonly type: CardTypeRusNames.SpecialCard;
    readonly name: SpecialCardNames;
}

/**
* <h3>Создание особой карты.</h3>
*/
export type CreateSpecialCardFromData = Omit<PartialByType<SpecialCard, `type`>, `points` | `rank`>
    & Omit<PlayerSuitableNullableCanBeUndefCardInfo<SpecialRankType>, `placedSuit`>;
// SpecialCard End
// Special Cards End

// MultiSuit Cards Start
/**
 * <h3>Типы данных для ключей перечислений названий мультифракционных карт.</h3>
 */
export type MultiSuitCardNamesKeyofTypeofType = KeyofType<typeof MultiSuitCardNames>;

// MultiSuitPlayerCard Start
/**
 * <h3>Особая карта на поле игрока.</h3>
 */
export interface SpecialPlayerCard extends Pick<SpecialCard, `name`>,
    BasicSuitableNonNullableCardInfo<SpecialRankType> {
    readonly type: CardTypeRusNames.SpecialPlayerCard;
}

/**
 * <h3>Создание особой карты на поле игрока.</h3>
 */
export type CreateSpecialPlayerCardFromData = PartialByType<SpecialPlayerCard, `type` | `rank` | `points`>;
// MultiSuitPlayerCard End

// MultiSuitCard Start
/**
 * <h3Конфиг всех мультифракционных карт по каждой эпохе.</h3>
 */
export type MultiSuitCardsConfig = {
    readonly [Property in KeyofType<typeof MultiSuitCardNames>]: MultiSuitCardData;
};

/**
 * <h3>Данные мультифракционной карты.</h3>
 */
export type MultiSuitCardData = Pick<MultiSuitCard, `name`> & ExpansionCardInfo;

/**
 * <h3>Мультифракционная карта.</h3>
 */
export interface MultiSuitCard extends PlayerSuitableNullableCardInfo<MultiSuitRankType> {
    readonly name: MultiSuitCardNames;
    readonly type: CardTypeRusNames.MultiSuitCard;
}

/**
* <h3>Создание мультифракционной карты.</h3>
*/
export type CreateMultiSuitCardFromData = PartialByType<MultiSuitCard, `type` | `playerSuit` | `rank` | `points`>;
// MultiSuitCard End

// MultiSuitPlayerCard Start
/**
 * <h3>Мультифракционная карта на поле игрока.</h3>
 */
export interface MultiSuitPlayerCard extends Pick<MultiSuitCard, `name`>,
    BasicSuitableNonNullableCardInfo<MultiSuitRankType> {
    readonly type: CardTypeRusNames.MultiSuitPlayerCard;
}

/**
 * <h3>Создание мультифракционной карты на поле игрока.</h3>
 */
export type CreateMultiSuitPlayerCardFromData = PartialByType<MultiSuitPlayerCard, `type` | `rank` | `points`>;
// MultiSuitPlayerCard End
// MultiSuit Cards End

// Camp Cards Start
/**
 * <h3>Объединение данных для всех карт лагеря.</h3>
 */
export type AllCampCardType = CampDeckCardType | ArtefactPlayerCard | MercenaryPlayerCard;

/**
 * <h3>Объединение данных для карт в лагере.</h3>
 */
export type CampCardType = CanBeNullType<CampDeckCardType>;

/**
 * <h3>Объединение данных для карт колоды лагеря.</h3>
 */
export type CampDeckCardType = ArtefactCard | MercenaryCard;

/**
 * <h3>Объединение данных для карт колоды лагеря в командной зоне игрока.</h3>
 */
export type CampCreatureCommandZoneCardType = CampDeckCardType;

/**
 * <h3>Массив данных всех карт в лагере.</h3>
 */
export type CampCardArray = [CanBeNullType<CampCardType>, CanBeNullType<CampCardType>,
    CanBeNullType<CampCardType>, CanBeNullType<CampCardType>, CanBeNullType<CampCardType>];

export type CampCardArrayIndex = IndexOf<CampCardArray>;

// Artefact Cards Start
/**
 * <h3>Типы данных для ключей перечислений названий артефактов.</h3>
 */
export type ArtefactNamesKeyofTypeofType = KeyofType<typeof ArtefactNames>;

// ArtefactCard Start
/**
 * <h3>Конфиг всех карт артефактов по каждой эпохе.</h3>
 */
export type ArtefactConfig = {
    readonly [Property in KeyofType<typeof ArtefactNames>]: ArtefactCardData;
};

/**
 * <h3>Данные карты артефакта.</h3>
 */
export interface ArtefactCardData extends TierInfo, PartialByType<Omit<ArtefactCard, `type` | `path`>,
    `playerSuit` | `points` | `rank` | `actions` | `buff` | `stack` | `validators`> {
    readonly scoringRule: Action<ArtefactScoringFunctionNames, ArtefactScoringArgsCanBeUndefType>;
}

/**
 * <h3>Карта артефакта.</h3>
 */
export interface ArtefactCard extends PlayerSuitableNullableCardInfo<ArtefactRankType>, PathCardInfo,
    AutoActionCardInfo, StackCardInfo {
    readonly buff: CanBeUndefType<ArtefactBuff>;
    readonly description: ArtefactDescriptionNames;
    readonly name: ArtefactNames;
    readonly type: CardTypeRusNames.ArtefactCard;
}

/**
 * <h3>Создание карты артефакта.</h3>
 */
export type CreateArtefactCardFromData = Omit<PartialByType<ArtefactCard, `type`>, `playerSuit` | `points` | `rank`>
    & PlayerSuitableNullableCanBeUndefCardInfo<ArtefactRankType>;
// ArtefactCard End

// ArtefactPlayerCard Start
/**
 * <h3>Карта артефакта на поле игрока.</h3>
 */
export interface ArtefactPlayerCard extends Pick<ArtefactCard, `name`>,
    BasicSuitableNonNullableCardInfo<ArtefactRankType>, PathCardInfo {
    readonly description: ArtefactDescriptionNames;
    readonly type: CardTypeRusNames.ArtefactPlayerCard;
}

/**
 * <h3>Создание карты артефакта на поле игрока.</h3>
 */
export type CreateArtefactPlayerCardFromData = PartialByType<ArtefactPlayerCard, `type` | `rank` | `points`>;
// ArtefactPlayerCard End
// Artefact Cards End

// MercenaryCard Start
/**
 * <h3>Конфиг всех карт наёмников по каждой эпохе.</h3>
 */
export type MercenariesConfig = readonly [MercenariesConfigTier0, MercenariesConfigTier1];

export type MercenariesConfigIndex = IndexOf<MercenariesConfig>;

/**
 * <h3>Данные конфига карт наёмников 1 эпохи.</h3>
 */
export type MercenariesConfigTier0 =
    readonly [MercenaryData, MercenaryData, MercenaryData, MercenaryData, MercenaryData, MercenaryData];

/**
 * <h3>Данные конфига карт наёмников 2 эпохи.</h3>
 */
export type MercenariesConfigTier1 =
    readonly [MercenaryData, MercenaryData, MercenaryData, MercenaryData, MercenaryData, MercenaryData];

/**
* <h3>Объединение данных конфигов карт наёмников каждой конкретной эпохи.</h3>
*/
export type MercenariesConfigType = MercenariesConfigTier0 | MercenariesConfigTier1;

/**
 * <h3>Данные для создания карты наёмника.</h3>
 */
export type MercenaryData = Partial<SuitPropertyType<VariantType<MercenaryRankType>>>;

/**
 * <h3>Карта наёмника.</h3>
 */
export interface MercenaryCard extends PlayerSuitableNullableCardInfo<MercenaryRankType>, PathCardInfo {
    // TODO Rework all cards name in Enums
    readonly name: string;
    readonly type: CardTypeRusNames.MercenaryCard;
    readonly variants: Partial<SuitPropertyType<VariantType<MercenaryRankType>>>;
}

/**
 * <h3>Создание карты наёмника.</h3>
 */
export type CreateMercenaryCardFromData = PartialByType<MercenaryCard, `type` | `playerSuit` | `points` | `rank`>;
// MercenaryCard End

// MercenaryPlayerCard Start
/**
 * <h3>Карты наёмника на поле игрока.</h3>
 */
export interface MercenaryPlayerCard extends VariantType<MercenaryRankType>, PathCardInfo {
    // TODO Rework all cards name in Enums
    readonly name: string;
    readonly type: CardTypeRusNames.MercenaryPlayerCard;
}

/**
 * <h3>Создание карты наёмника на поле игрока.</h3>
 */
export type CreateMercenaryPlayerCardFromData = PartialByType<MercenaryPlayerCard, `type` | `rank` | `points`>;
// MercenaryPlayerCard End
// Camp Cards End

// MythologicalCreature Cards Start
/**
 * <h3>Объединение данных для всех карт колоды мифических существ.</h3>
 */
export type MythologicalCreatureCardType = GodCard | GiantCard | ValkyryCard | MythicalAnimalCard;

/**
 * <h3>Объединение данных для карт мифических существ в командной зоне игрока.</h3>
 */
export type MythologicalCreatureCommandZoneCardType = GodCard | GiantCard | ValkyryCard;

/**
 * <h3>Данные всех колод карт мифических существ.</h3>
 */
export type MythologicalCreatureDecks = readonly [MythologicalCreatureCardType[], MythologicalCreatureCardType[]];

/**
 * <h3>Массив всех карт мифических существ для выбора по способности карты Skymir.</h3>
 */
export type MythologicalCreatureCardsForGiantSkymirArray = [MythologicalCreatureCardType, MythologicalCreatureCardType,
    MythologicalCreatureCardType, MythologicalCreatureCardType?, MythologicalCreatureCardType?];

/**
* <h3>Объединение всех имён для карт мифологических существ.</h3>
*/
export type MythologicalCreatureNameType = GiantNames | GodNames | MythicalAnimalNames | ValkyryNames;

// Giant Cards Start
/**
 * <h3>Типы данных для ключей перечислений названий гигантов.</h3>
 */
export type GiantNamesKeyofTypeofType = KeyofType<typeof GiantNames>;

// Giant Start
/**
 * <h3>Конфиг всех карт гигантов по каждой эпохе.</h3>
 */
export type GiantConfig = {
    readonly [Property in KeyofType<typeof GiantNames>]: GiantData;
};

/**
 * <h3>Данные карты гиганта.</h3>
 */
export interface GiantData extends PartialByType<Omit<GiantCard, `type` | `capturedCard` | `isActivated`>, `actions`> {
    readonly scoringRule: Action<GiantScoringFunctionNames, GiantScoringArgsCanBeUndefType>;
}

/**
 * <h3>Карта гиганта.</h3>
 */
export interface GiantCard extends Pick<AutoActionCardInfo, `actions`>, ActivatedCardInfo {
    readonly buff: GiantBuff;
    capturedCard: CanBeNullType<DwarfCard>;
    readonly description: GiantDescriptionNames;
    readonly name: GiantNames;
    readonly placedSuit: SuitNames;
    readonly type: CardTypeRusNames.GiantCard;
}

/**
 * <h3>Создание карты гиганта.</h3>
 */
export type CreateGiantCardFromData = PartialByType<Omit<GiantCard, `capturedCard`>
    & ReadonlyByType<GiantCard, `capturedCard`>, `type` | `capturedCard` | `isActivated`>;
// Giant End
// Giant Cards End

// God Cards Start
/**
 * <h3>Типы данных для ключей перечислений названий богов.</h3>
 */
export type GodNamesKeyofTypeofType = KeyofType<typeof GodNames>;

// God Start
/**
 * <h3>Конфиг всех карт богов по каждой эпохе.</h3>
 */
export type GodConfig = {
    readonly [Property in KeyofType<typeof GodNames>]: GodData;
};

/**
 * <h3>Данные карты бога.</h3>
 */
export type GodData = Omit<GodCard, `type` | `isActivated`>;

type GodPointsType = 0 | 8 | 12 | 15;

/**
 * <h3>Карта бога.</h3>
 */
export interface GodCard extends ActivatedCardInfo {
    readonly buff: GodBuff;
    readonly description: GodDescriptionNames;
    readonly name: GodNames;
    readonly points: GodPointsType;
    readonly type: CardTypeRusNames.GodCard;
}

/**
 * <h3>Создание карты бога.</h3>
 */
export type CreateGodCardFromData = PartialByType<GodCard, `type` | `isActivated`>;
// God End
// God Cards End

// MythologicalCreature Start
export type MythologicalCreaturePlayersAmountType = 9 | 12 | 15;
/**
 * <h3>Конфиг всех карт мифических существ.</h3>
 */
export type MythologicalCreatureConfig = {
    readonly [index in NumPlayersType]: MythologicalCreaturePlayersAmountType;
};
// MythologicalCreature End

// MythicalAnimal Cards Start
/**
 * <h3>Типы данных для ключей перечислений названий мифических животных.</h3>
 */
export type MythicalAnimalNamesKeyofTypeofType = KeyofType<typeof MythicalAnimalNames>;

// MythicalAnimal Start
/**
 * <h3>Конфиг всех карт мифических животных по каждой эпохе.</h3>
 */
export type MythicalAnimalConfig = {
    readonly [Property in KeyofType<typeof MythicalAnimalNames>]: MythicalAnimalData;
};

/**
 * <h3>Данные карты мистического животного.</h3>
 */
export interface MythicalAnimalData extends
    PartialByType<Omit<MythicalAnimalCard, `type`>, `rank` | `points` | `stack` | `buff`> {
    readonly scoringRule: Action<MythicalAnimalScoringFunctionNames, MythicalAnimalScoringArgsCanBeUndefType>;
}

/**
 * <h3>Карта мистического животного.</h3>
 */
export interface MythicalAnimalCard extends PlayerSuitableNonNullableCardInfo<MythicalAnimalRankType>, StackCardInfo {
    readonly buff: CanBeUndefType<MythicalAnimalBuff>;
    readonly description: MythicalAnimalDescriptionNames;
    readonly name: MythicalAnimalNames;
    readonly type: CardTypeRusNames.MythicalAnimalCard;
}

/**
 * <h3>Создание карты мистического животного.</h3>
 */
export type CreateMythicalAnimalCardFromData = Omit<PartialByType<MythicalAnimalCard, `type`>, `points` | `rank`>
    & Pick<PlayerSuitableNullableCanBeUndefCardInfo<MythicalAnimalRankType>, `points`> & {
        readonly rank: CanBeUndefType<BasicSuitableNonNullableCardInfo<MythicalAnimalRankType>[`rank`]>;
    };
// MythicalAnimal End

// MythicalAnimalPlayerCard Start
/**
 * <h3>Карта мифического животного на поле игрока.</h3>
 */
export interface MythicalAnimalPlayerCard extends Pick<MythicalAnimalCard, `name` | `description`>,
    BasicSuitableNonNullableCardInfo<MythicalAnimalRankType> {
    readonly type: CardTypeRusNames.MythicalAnimalPlayerCard;
}

/**
 * <h3>Создание карты мифического животного на поле игрока.</h3>
 */
export type CreateMythicalAnimalPlayerCardFromData =
    PartialByType<MythicalAnimalPlayerCard, `type` | `rank` | `points`>;
// MythicalAnimalPlayerCard End
// MythicalAnimal Cards End

// Valkyry Cards Start
/**
 * <h3>Типы данных для ключей перечислений названий валькирий.</h3>
 */
export type ValkyryNamesKeyofTypeofType = KeyofType<typeof ValkyryNames>;

// Valkyry Start
/**
 * <h3>Конфиг всех карт валькирий по каждой эпохе.</h3>
 */
export type ValkyryConfig = {
    readonly [Property in KeyofType<typeof ValkyryNames>]: ValkyryData;
};

/**
 * <h3>Данные карты валькирии.</h3>
 */
export interface ValkyryData extends PartialByType<Omit<ValkyryCard, `type` | `strengthTokenNotch`>, `stack`> {
    readonly scoringRule: Action<ValkyryScoringFunctionNames>;
}

/**
 * <h3>Карта валькирии.</h3>
 */
export interface ValkyryCard extends StackCardInfo {
    readonly buff: ValkyryBuff;
    readonly description: ValkyryDescriptionNames;
    readonly name: ValkyryNames;
    // TODO Rework in 0 | 1 | 2 | 3 | 4 || 0 | 1 | 2 | 3
    strengthTokenNotch: CanBeNullType<number>;
    readonly type: CardTypeRusNames.ValkyryCard;
}

/**
 * <h3>Создание карты валькирии.</h3>
 */
export type CreateValkyryCardFromData = PartialByType<Omit<ValkyryCard, `strengthTokenNotch`>
    & ReadonlyByType<ValkyryCard, `strengthTokenNotch`>, `type` | `strengthTokenNotch`>;
// Valkyry End
// Valkyry Cards End
// // MythologicalCreature Cards End

// Card Info Start
type DwarfRankType = 1;

export type MultiSuitRankType = 1;

type ArtefactRankType = 1;

export type HeroRankType = 1 | 2 | 3;

export type MercenaryRankType = 1;

type MythicalAnimalRankType = 1 | 2;

type SpecialRankType = 2;

type RankType = ArtefactRankType | DwarfRankType | HeroRankType | MercenaryRankType | MultiSuitRankType
    | MythicalAnimalRankType | SpecialRankType;

/**
 * <h3>Данные карты с основными характеристиками, которые могут и не присутствовать.</h3>
 */
export interface BasicSuitableNullableCardInfo<T extends RankType> {
    // TODO Can be 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | ...heroes points too!?
    readonly points: CanBeNullType<number>;
    readonly rank: CanBeNullType<T>;
    readonly suit: CanBeNullType<SuitNames>;
}

/**
 * <h3>Данные карты с основными характеристиками, которые должны присутствовать.</h3>
 */
interface BasicSuitableNonNullableCardInfo<T extends RankType> extends
    Pick<BasicSuitableNullableCardInfo<T>, `points`> {
    readonly rank: NonNullable<BasicSuitableNullableCardInfo<T>[`rank`]>;
    readonly suit: SuitNames;
}

/**
 * <h3>Данные карты на поле игрока с основными характеристиками, которые могут и не присутствовать.</h3>
 */
interface PlayerSuitableNullableCardInfo<T extends RankType> extends
    Pick<BasicSuitableNullableCardInfo<T>, `rank` | `points`> {
    playerSuit: CanBeNullType<SuitNames>;
    points: BasicSuitableNullableCardInfo<T>[`points`];
    rank: BasicSuitableNullableCardInfo<T>[`rank`];
}

interface PlayerSuitableNullableCanBeUndefCardInfo<T extends RankType> {
    readonly playerSuit: CanBeUndefType<PlayerSuitableNullableCardInfo<T>[`playerSuit`]>;
    readonly points: CanBeUndefType<PlayerSuitableNullableCardInfo<T>[`points`]>;
    readonly rank: CanBeUndefType<PlayerSuitableNullableCardInfo<T>[`rank`]>;
}

/**
 * <h3>Данные карты на поле игрока с основными характеристиками, которые должны присутствовать.</h3>
 */
interface PlayerSuitableNonNullableCardInfo<T extends RankType> extends
    Pick<BasicSuitableNonNullableCardInfo<T>, `rank` | `points`> {
    readonly playerSuit: SuitNames;
}

/**
 * <h3>Данные путей отрисовки карты.</h3>
 */
interface PathCardInfo {
    // TODO Add to enum!?
    readonly path: string;
}

/**
 * <h3>Данные базы/дополнения игры.</h3>
 */
interface ExpansionCardInfo {
    readonly game: GameNamesKeyofTypeofType;
}

/**
 * <h3>Данные карты с возможными автоматическими действиями и возможной валидацией.</h3>
 */
interface AutoActionCardInfo {
    readonly actions: CanBeUndefType<Action<AutoActionFunctionNames, AutoActionArgsType>>;
    readonly validators: CanBeUndefType<ValidatorsConfigType>;
}

/**
 * <h3>Данные карты с переключением активации.</h3>
 */
interface ActivatedCardInfo {
    isActivated: CanBeNullType<boolean>;
}

/**
 * <h3>Данные карты со стеком.</h3>
 */
interface StackCardInfo {
    readonly stack: CanBeUndefType<StackCard>;
}

/**
 * <h3>Стек у карты.</h3>
 */
interface StackCard {
    readonly player?: Stack[];
    readonly soloBot?: Stack[];
    readonly soloBotAndvari?: Stack[];
}
// Card Info End

// Buff Start
/**
 * <h3>Баф карты артефакта.</h3>
 */
interface ArtefactBuff {
    readonly name: CampBuffNames;
}

/**
 * <h3>Баф карты героя.</h3>
 */
interface HeroBuff {
    readonly name: HeroBuffNames;
}

/**
 * <h3>Баф карты гиганта.</h3>
 */
interface GiantBuff {
    readonly name: GiantBuffNames;
}

/**
 * <h3>Баф карты бога.</h3>
 */
interface GodBuff {
    readonly name: GodBuffNames;
}

/**
 * <h3>Баф карты мифического животного.</h3>
 */
interface MythicalAnimalBuff {
    readonly name: MythicalAnimalBuffNames;
}

/**
 * <h3>Баф карты валькирии.</h3>
 */
interface ValkyryBuff {
    readonly name: ValkyryBuffNames;
}

/**
 * <h3>Остальные бафы.</h3>
 */
interface CommonBuff {
    readonly name: CommonBuffNames;
}

/**
 * <h3>Объединение данных всех бафов.</h3>
 */
export type BuffType = GiantBuff | ValkyryBuff | MythicalAnimalBuff | ArtefactBuff | HeroBuff | CommonBuff;

/**
* <h3>Объединение данных названий всех бафов.</h3>
*/
export type AllBuffNames = CommonBuffNames | CampBuffNames | GodBuffNames | GiantBuffNames | HeroBuffNames
    | MythicalAnimalBuffNames | ValkyryBuffNames;

/**
* <h3>Объединение данных значений бафов.</h3>
*/
export type BuffValueType = SuitNames | true;

/**
 * <h3>Виды бафов у игрока.</h3>
 */
export interface PlayerBuffs {
    readonly countBettermentAmount?: true;
    readonly countBidWinnerAmount?: true;
    readonly countDistinctionAmount?: true;
    readonly countPickedCardClassRankAmount?: true;
    readonly countPickedHeroAmount?: true;
    readonly dagdaDiscardOnlyOneCards?: true;
    readonly discardCardEndGame?: true;
    readonly endTier?: true;
    readonly everyTurn?: true;
    readonly explorerDistinctionGetSixCards?: true;
    readonly hasOneNotCountHero?: true;
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
    readonly playerHasActiveGodFreyja?: true;
    readonly playerHasActiveGodFrigg?: true;
    readonly playerHasActiveGodLoki?: true;
    readonly playerHasActiveGodOdin?: true;
    readonly playerHasActiveGodThor?: true;
    readonly ratatoskFinalScoring?: true;
    readonly suitIdForMjollnir?: SuitNames;
    readonly suitIdForOlrun?: SuitNames | true;
    readonly upgradeCoin?: true;
    readonly upgradeNextCoin?: true;
}
// Buff End

// Distinction Start
/**
 * <h3>Знак отличия по фракции дворфов и его награды.</h3>
 */
interface Distinction {
    readonly awarding: Action<DistinctionAwardingFunctionNames>;
    readonly description: DistinctionDescriptionNames;
}

/**
 * <h3>Данные всех преимуществ по знакам отличия всех фракций дворфов.</h3>
 */
export type Distinctions = CanBeUndefType<CanBeNullType<PlayerID>>;

// TODO Check it because we have splice from this array in code! Add to all DwarfDeckCardType?
/**
 * <h3>Массив всех карт для выбора преимущества по знаку отличия фракции разведчиков.</h3>
 */
export type ExplorerDistinctionCards = readonly [DwarfDeckCardType] | readonly [DwarfDeckCardType, DwarfDeckCardType,
    DwarfDeckCardType] | readonly [DwarfDeckCardType, DwarfDeckCardType, DwarfDeckCardType, DwarfDeckCardType,
        DwarfDeckCardType, DwarfDeckCardType];

export type ExplorerDistinctionCardsLength = 1 | 3 | 6;

export type ExplorerDistinctionCardIdType = 0 | 1 | 2 | 3 | 4 | 5;

export type PlayerRanksForDistinctionsArray = [number] | [number, number]
    | [number, number, number] | [number, number, number, number]
    | [number, number, number, number, number];

export type MaxCurrentSuitDistinctionPlayersType = 0 | 1 | 2 | 3 | 4;

export type MaxCurrentSuitDistinctionPlayersArray = Permutation<MaxCurrentSuitDistinctionPlayersType>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 0>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 1>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 2>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 3>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 4>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 0 | 1>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 0 | 2>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 0 | 3>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 0 | 4>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 1 | 2>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 1 | 3>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 1 | 4>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 2 | 3>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 2 | 4>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 3 | 4>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 0 | 1 | 2>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 0 | 1 | 3>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 0 | 1 | 4>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 0 | 2 | 3>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 0 | 2 | 4>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 0 | 3 | 4>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 1 | 2 | 3>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 1 | 2 | 4>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 1 | 3 | 4>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 2 | 3 | 4>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 0 | 1 | 2 | 3>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 0 | 1 | 2 | 4>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 0 | 1 | 3 | 4>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 0 | 2 | 3 | 4>>
    | Permutation<Exclude<MaxCurrentSuitDistinctionPlayersType, 1 | 2 | 3 | 4>>;

/**
* <h3>Данные для количества и максимального значения шевронов для получения преимущества по знаку отличия фракции дворфов.</h3>
*/
export type PlayerRanksAndMaxRanksForDistinctionsArray = readonly [PlayerRanksForDistinctionsArray, number];
// Distinction End

// Stack Start
/**
 * <h3>Интерфейс для данных стека у карт.</h3>
 */
export interface StackData {
    readonly activateGiantAbilityOrPickCard: (giantName: GiantNames, card: DwarfCard) => Stack;
    readonly activateGodAbilityOrNot: (godName: GodNames, card?: DwarfDeckCardType) => Stack;
    readonly addCoinToPouch: () => Stack;
    readonly brisingamensEndGameAction: () => Stack;
    readonly chooseStrategyLevelForSoloModeAndvari: () => Stack;
    readonly chooseStrategyVariantLevelForSoloModeAndvari: () => Stack;
    readonly chooseSuitOlrun: () => Stack;
    readonly discardCardFromBoardBonfur: () => Stack;
    readonly discardCardFromBoardCrovaxTheDoppelganger: () => Stack;
    readonly discardCardFromBoardDagda: (pickedSuit?: SuitNames) => Stack;
    readonly discardSuitCard: (playerId: PlayerID) => Stack;
    readonly discardSuitCardHofud: () => Stack;
    readonly discardTavernCard: () => Stack;
    readonly enlistmentMercenaries: () => Stack;
    readonly getDifficultyLevelForSoloMode: () => Stack;
    readonly getDistinctions: () => Stack;
    readonly getHeroesForSoloMode: () => Stack;
    readonly getMjollnirProfit: () => Stack;
    // TODO Make types for priority numbers!
    readonly getMythologyCardSkymir: (priority?: 3) => Stack;
    readonly pickCampCardHolda: () => Stack;
    readonly pickCard: () => Stack;
    readonly pickCardSoloBot: () => Stack;
    readonly pickCardSoloBotAndvari: () => Stack;
    readonly pickConcreteCoinToUpgrade: (coinValue: UpgradableCoinValueType, value: UpgradableCoinValueType) => Stack;
    readonly pickDiscardCardAndumia: () => Stack;
    readonly pickDiscardCardBrisingamens: (priority?: 3) => Stack;
    readonly pickDistinctionCard: () => Stack;
    readonly pickDistinctionCardSoloBot: () => Stack;
    readonly pickDistinctionCardSoloBotAndvari: () => Stack;
    readonly placeMultiSuitsCards: (name: MultiSuitCardNames, pickedSuit?: SuitNames, priority?: 3) => Stack;
    readonly placeThrudHero: () => Stack;
    readonly placeThrudHeroSoloBot: () => Stack;
    readonly placeThrudHeroSoloBotAndvari: () => Stack;
    readonly placeTradingCoinsUline: () => Stack;
    readonly placeYludHero: () => Stack;
    readonly placeYludHeroSoloBot: () => Stack;
    readonly placeYludHeroSoloBotAndvari: () => Stack;
    readonly pickHero: (priority: OneOrTwoType) => Stack;
    readonly pickHeroSoloBot: (priority: OneOrTwoType) => Stack;
    readonly pickHeroSoloBotAndvari: (priority: OneOrTwoType) => Stack;
    readonly placeEnlistmentMercenaries: (card: MercenaryCard) => Stack;
    readonly startAddPlusTwoValueToAllCoinsUline: (coinId: PlayerCoinIdType) => Stack;
    readonly startChooseCoinValueForVidofnirVedrfolnirUpgrade: (valueArray: VidofnirVedrfolnirUpgradeValueType,
        coinId?: PlayerPouchCoinIdType, priority?: 3) => Stack;
    readonly startOrPassEnlistmentMercenaries: () => Stack;
    readonly upgradeCoin: (value: BasicUpgradeCoinValueType) => Stack;
    readonly upgradeCoinSoloBot: (value: BasicUpgradeCoinValueType) => Stack;
    readonly upgradeCoinSoloBotAndvari: (value: BasicUpgradeCoinValueType) => Stack;
    readonly upgradeCoinVidofnirVedrfolnir: (value: UpgradableCoinValueType, coinId?: PlayerPouchCoinIdType,
        priority?: 3) => Stack;
    readonly upgradeCoinWarriorDistinction: () => Stack;
    readonly upgradeCoinWarriorDistinctionSoloBot: () => Stack;
    readonly upgradeCoinWarriorDistinctionSoloBotAndvari: () => Stack;
}

/**
 * <h3>Интерфейс для стека действия.</h3>
 */
export interface Stack {
    readonly giantName?: GiantNames;
    readonly godName?: GodNames;
    readonly card?: CanBeUndefType<StackCardType>;
    readonly coinId?: CanBeUndefType<PlayerCoinIdType>;
    readonly coinValue?: UpgradableCoinValueType;
    readonly configName?: ConfigNames;
    readonly drawName?: DrawNames;
    readonly name?: StackNamesType;
    readonly pickedSuit?: CanBeUndefType<SuitNames>;
    readonly playerId?: PlayerID;
    priority?: CanBeUndefType<StackPriorityType>;
    readonly stageName?: ActiveStageNames;
    readonly suit?: SuitNames;
    readonly value?: UpgradableCoinValueType;
    readonly valueArray?: VidofnirVedrfolnirUpgradeValueType;
}

export type PlayerStack = Omit<Stack, `priority`> & RequiredByType<Stack, `priority`>;

type StackPriorityType = 0 | 1 | 2 | 3;

/**
 * Объединение данных карт, которые могут передаваться в значения в стеке.
 */
export type StackCardType = MercenaryCard | DwarfDeckCardType;

// TODO Rework to + Enlistment mercenaries names - string
/**
 * <h3>Объединение данных названий, которые могут передаваться в значения в стеке.</h3>
 */
export type StackNamesType = HeroNames | MultiSuitCardNames | string;

/**
 * <h3>Объединение данных всех карт со стеком.</h3>
 */
export type CardsHasStackType = HeroCard | ArtefactCard | RoyalOfferingCard | MythicalAnimalCard | ValkyryCard;

/**
 * <h3>Объединение данных всех карт для валидаторов добавления в стек.</h3>
 */
export type CardsHasStackValidatorsType = HeroCard | ArtefactCard;
// Stack End

// Priority Start
// TODO Add PriorityTypes = ExchangeablePriorities | UnexchangeablePriorities & their values types!?
/**
 * <h3>Кристалл.</h3>
 */
export interface Priority {
    readonly isExchangeable: boolean;
    readonly value: AllPriorityValueType;
}

/**
 * <h3>Создание кристалла.</h3>
 */
export type CreatePriorityFromData = PartialByType<Priority, `isExchangeable`>;

/**
 * <h3>Типы данных для конфига всех кристаллов.</h3>
 */
export type PrioritiesConfig = readonly [readonly Priority[], readonly Priority[], readonly Priority[],
    readonly Priority[], readonly Priority[]];

type BasicPriorityValueType = 1 | 2 | 3 | 4 | 5;

type NonExchangeablePriorityValueType = 6;

type SoloBotPlayerPriorityValueType = -1 | 0;

type HumanPlayerPriorityValueType = BasicPriorityValueType | NonExchangeablePriorityValueType;

export type AllPriorityValueType = SoloBotPlayerPriorityValueType | HumanPlayerPriorityValueType;
// Priority End

// Coin Start
/**
 * <h3>Интерфейс опций для создания монет.</h3>
 */
export interface BuildRoyalCoinsOptions {
    readonly count: RoyalCoin[];
    readonly players: NumPlayersType;
}

interface CommonCoinData {
    isOpened: boolean;
}

export interface RoyalCoin extends CommonCoinData {
    readonly type: CoinRusNames.Royal;
    readonly value: RoyalCoinValueType;
}

export interface InitialNotTriggerTradingCoin extends CommonCoinData {
    readonly type: CoinRusNames.InitialNotTriggerTrading;
    readonly value: InitialNotTriggerTradingCoinValueType;
}

export interface InitialTriggerTradingCoin extends CommonCoinData {
    readonly type: CoinRusNames.InitialTriggerTrading;
    readonly value: InitialTriggerTradingCoinValueType;
}

export interface SpecialTriggerTradingCoin extends CommonCoinData {
    readonly type: CoinRusNames.SpecialTriggerTrading;
    readonly value: SpecialTriggerTradingCoinValueType;
}

export type AllInitialCoins = [InitialTriggerTradingCoin, InitialNotTriggerTradingCoin, InitialNotTriggerTradingCoin,
    InitialNotTriggerTradingCoin, InitialNotTriggerTradingCoin];

/**
 * <h3>Тип для создания монеты.</h3>
 */
export type CreateInitialNotTradingCoinFromData = PartialByType<Omit<InitialNotTriggerTradingCoin, `isOpened`>
    & ReadonlyByType<InitialNotTriggerTradingCoin, `isOpened`>, `type` | `isOpened`>;

/**
 * <h3>Создания базовой монеты, активирующей обмен монет.</h3>
 */
export type CreateInitialTradingCoinFromData = PartialByType<Omit<InitialTriggerTradingCoin, `isOpened`>
    & ReadonlyByType<InitialTriggerTradingCoin, `isOpened`>, `type` | `isOpened`>;

/**
 * <h3>Создание королевской монеты.</h3>
 */
export type CreateRoyalCoinFromData = PartialByType<Omit<RoyalCoin, `isOpened`> & ReadonlyByType<RoyalCoin, `isOpened`>,
    `type` | `isOpened`>;

/**
 * <h3>Создание королевской монеты.</h3>
 */
export type CreateSpecialTriggerTradingCoinFromData = PartialByType<Omit<SpecialTriggerTradingCoin, `isOpened`>
    & ReadonlyByType<SpecialTriggerTradingCoin, `isOpened`>, `type` | `isOpened`>;

export type AllInitialTradingCoinConfig = [InitialTradingCoinConfigType, InitialTradingCoinConfigType,
    InitialTradingCoinConfigType, InitialTradingCoinConfigType, InitialTradingCoinConfigType];

/**
* <h3>Тип для конфига базовых монет.</h3>
*/
export type InitialTradingCoinConfigType =
    Pick<InitialTriggerTradingCoin, `value`> | Pick<InitialNotTriggerTradingCoin, `value`>;

export type InitialCoinType = InitialTriggerTradingCoin | InitialNotTriggerTradingCoin;

export type TriggerTradingCoinType = InitialTriggerTradingCoin | SpecialTriggerTradingCoin;

export type UpgradableCoinType = InitialNotTriggerTradingCoin | RoyalCoin;

export type AllCoinsType = TriggerTradingCoinType | UpgradableCoinType;

export type AllCoinsValueType = InitialCoinValueType | RoyalCoinValueType;

export type UpgradableCoinValueType = Exclude<AllCoinsValueType, 0>;

export type CoinCanBeUpgradedByValueType = 1 | UpgradableCoinValueType;

type SpecialTriggerTradingCoinValueType = 3;

export type InitialTriggerTradingCoinValueType = 0;

export type InitialNotTriggerTradingCoinValueType = 2 | 3 | 4 | 5;

export type InitialCoinValueType = InitialTriggerTradingCoinValueType | InitialNotTriggerTradingCoinValueType;

export type RoyalCoinValueType =
    5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25;

export type UpgradingCoinsArrayLengthType = UpgradingCoinsArrayType[`length`];

export type UpgradingCoinsArrayType = [UpgradableCoinType] | [UpgradableCoinType, UpgradableCoinType]
    | [UpgradableCoinType, UpgradableCoinType, UpgradableCoinType]
    | [UpgradableCoinType, UpgradableCoinType, UpgradableCoinType, UpgradableCoinType];

export type TradingCoinsValueType = [UpgradableCoinValueType] | [UpgradableCoinValueType, UpgradableCoinValueType];

export type TradingCoinsArrayLength = 1 | 2;

export type BasicUpgradeCoinValueType = RoyalOfferingCardValueType | 7;

export type CoinUpgradeBuffValue = 0 | 2;

export type BettermentMinMaxType = -46 | -45 | -44 | -43 | -42 | 41 | -40 | -39 | -38 | -37 | -36 | -35 | -34 | -33 | -32 | -31 | -30 | -29 | -28 | -27 | -26 | -25 | -24 | -23 | -22 | -21 | -20 | -19 | -18 | -17 | -16 | -15 | -14 | -13 | -12 | -11 | -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

export type CoinUpgradePossibleMaxValue = 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
    | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42
    | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51;

export type TradingCoinsType = [UpgradableCoinType] | [UpgradableCoinType, UpgradableCoinType];

/**
 * <h3>Типы данных для конфигов монет.</h3>
 */
export type CoinConfigType = RoyalCoinConfig | InitialTradingCoinConfigType;

export type AllRoyalCoinConfig = readonly [RoyalCoinConfig, RoyalCoinConfig, RoyalCoinConfig, RoyalCoinConfig,
    RoyalCoinConfig, RoyalCoinConfig, RoyalCoinConfig, RoyalCoinConfig, RoyalCoinConfig, RoyalCoinConfig,
    RoyalCoinConfig, RoyalCoinConfig, RoyalCoinConfig, RoyalCoinConfig, RoyalCoinConfig, RoyalCoinConfig, RoyalCoinConfig, RoyalCoinConfig, RoyalCoinConfig, RoyalCoinConfig, RoyalCoinConfig];

/**
 * <h3>Конфиг создания королевских монет.</h3>
 */
export interface RoyalCoinConfig {
    readonly count: () => NumberPlayersValues;
    value: RoyalCoinValueType;
}
// Coin End

// Player Coins Start
export type PlayerHandCoinsType = PublicPlayerHandCoins | PrivatePlayerHandCoins;

export type PlayerBoardCoinsType = PublicPlayerBoardCoins | PrivatePlayerBoardCoins;

/**
 * <h3>Типы данных для монет на столе или в руке.</h3>
 */
export type CoinType = CanBeNullType<AllCoinsType>;

/**
 * <h3>Типы данных для закрытых монет.</h3>
 */
type ClosedCoinType = Record<never, never>;

// PublicPlayer Coins Start
export type PlayerCoinsNumber = 0 | 1 | 2 | 3 | 4 | 5;

export type NoCoinsOnPouchNumber = 0 | 1 | 2;

export type PublicPlayerBoardCoins =
    [PublicPlayerCoinType, PublicPlayerCoinType, PublicPlayerCoinType, PublicPlayerCoinType, PublicPlayerCoinType];

export type PublicPlayerHandCoins =
    [PublicPlayerCoinType, PublicPlayerCoinType, PublicPlayerCoinType, PublicPlayerCoinType, PublicPlayerCoinType];

export type PublicPlayerCoinsType = PublicPlayerHandCoins | PublicPlayerBoardCoins;

/**
 * <h3>Типы данных для публичных монет.</h3>
 */
export type PublicPlayerCoinType = CoinType | ClosedCoinType;
// PublicPlayer Coins End

// PrivatePlayer Coins Start
export type PrivatePlayerBoardCoins = [CoinType, CoinType, CoinType, CoinType, CoinType];

export type PrivatePlayerHandCoins = [CoinType, CoinType, CoinType, CoinType, CoinType];
// PrivatePlayer Coins End
// Player Coins End

// Players Start
// TODO index is ?: PlayersNum not good for undefined?!
/**
 * <h3>Интерфейс для объекта; хранящего скрытые (secret) данные всех игроков.</h3>
 */
export interface Players {
    [index: number]: PrivatePlayer;
}

// TODO index is ?: PlayersNum not good for undefined?!
/**
 * <h3>Интерфейс для объекта; хранящего открытые данные всех игроков.</h3>
 */
export interface PublicPlayers {
    [index: number]: PublicPlayer;
}

// PublicPlayer Start
export type CurrentPlayerCoinsScoreType = 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29
    | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51
    | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73
    | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95
    | 96 | 97;

type CurrentPlayerMaxCoinValueType = RoyalCoinValueType;

/**
 * <h3>Интерфейс для публичных данных игрока.</h3>
 */
export interface PublicPlayer {
    readonly boardCoins: PublicPlayerBoardCoins;
    readonly buffs: PlayerBuffs[];
    readonly campCards: CampCreatureCommandZoneCardType[];
    readonly cards: SuitPropertyType<PlayerBoardCardType[]>;
    currentCoinsScore: CurrentPlayerCoinsScoreType;
    currentMaxCoinValue: CurrentPlayerMaxCoinValueType;
    readonly giantTokenSuits: SuitPropertyType<CanBeNullType<boolean>>;
    readonly handCoins: PublicPlayerHandCoins;
    readonly heroes: HeroCard[];
    readonly mythologicalCreatureCards: MythologicalCreatureCommandZoneCardType[];
    readonly nickname: string;
    priority: Priority;
    selectedCoin: CanBeNullType<PlayerCoinIdType>;
    stack: PlayerStack[];
}

/**
 * <h3>Тип для создания публичных данных игрока.</h3>
 */
export type CreatePublicPlayerFromData =
    PartialByType<Omit<PublicPlayer, `pickedCard` | `priority` | `selectedCoin` | `stack`>
        & ReadonlyByType<PublicPlayer, `priority` | `selectedCoin` | `stack`>, `currentCoinsScore`
        | `currentMaxCoinValue` | `heroes` | `campCards` | `mythologicalCreatureCards` | `stack` | `buffs`
        | `selectedCoin`>;
// PublicPlayer End

// PrivatePlayer Start
/**
 * <h3>Интерфейс для приватных данных игрока.</h3>
 */
export interface PrivatePlayer {
    readonly boardCoins: PrivatePlayerBoardCoins;
    handCoins: PrivatePlayerHandCoins;
}
// PrivatePlayer End
// Players End

/**
 * <h3>Интерфейс для данных эпохи карты.</h3>
 */
interface TierInfo {
    readonly tier: TierType;
}

/**
 * <h3>Интерфейс для действия.</h3>
 */
export interface Action<TName extends ActionNamesType, TParams extends ActionParamsType = undefined> {
    readonly name: TName;
    readonly params?: TParams;
}

/**
 * <h3>Тип для названий действий.</h3>
 */
type ActionNamesType = GiantScoringFunctionNames | MythicalAnimalScoringFunctionNames | ValkyryScoringFunctionNames
    | ArtefactScoringFunctionNames | HeroScoringFunctionNames | AutoActionFunctionNames | SuitScoringFunctionNames
    | DistinctionAwardingFunctionNames;

/**
* <h3>Тип для аргументов действий.</h3>
*/
type ActionParamsType = CanBeUndefType<ValkyryScoringArgsType | HeroScoringArgsCanBeUndefType | AutoActionArgsType
    | MythologicalCreatureScoringArgsCanBeUndefType | ArtefactScoringArgsCanBeUndefType>;

/**
 * <h3>Интерфейс для автоматических действий с параметрами.</h3>
 */
export interface AutoActionFunction {
    (context: MyFnContextWithMyPlayerID, ...params: AutoActionArgsType): void;
}

/**
 * <h3>Интерфейс для действий без параметров.</h3>
 */
export interface ActionFunctionWithoutParams {
    (context: MyFnContextWithMyPlayerID): void;
}

/**
 * <h3>Типы данных для всех автоматических действий.</h3>
 */
export type AutoActionFunctionType = ActionFunctionWithoutParams | AutoActionFunction;

export type BasicArtefactScoringType = 0 | 24 | 28;

export type BasicGiantScoringType = 0;

export type BasicHeroScoringType = 0 | 1 | 4 | 7 | 8 | 9 | 10 | 12 | 13 | 17 | 25;

export type BasicMythicalAnimalScoringType = 0;

export type DwergBrothersScoringType = 0 | 13 | 40 | 81 | 108 | 135;

export type DwergBrothersScoringArray = readonly [0, 13, 40, 81, 108, 135];

// TODO Rework common ScoringFunction interfaces!?
/**
 * <h3>Интерфейс для функций подсчёта очков по фракциям дворфов.</h3>
 */
export interface SuitScoringFunction {
    (...params: SuitScoringArgsType): number;
}

export type MinerDistinctionsScoringType = 0 | 3;

/**
 * <h3>Интерфейс для функций подсчёта очков по артефактам.</h3>
 */
export interface ArtefactScoringFunction {
    ({ G, ctx, myPlayerID }: MyFnContextWithMyPlayerID, isFinal?: boolean,
        ...params: ArtefactScoringArgsCanBeUndefType): number;
}

/**
 * <h3>Интерфейс для функций подсчёта очков по героям.</h3>
 */
export interface HeroScoringFunction {
    ({ G, ctx, myPlayerID }: MyFnContextWithMyPlayerID, ...params: HeroScoringArgsCanBeUndefType): number;
}

/**
 * <h3>Интерфейс для функций подсчёта очков по мифическим животным.</h3>
 */
export interface MythicalAnimalScoringFunction {
    ({ G, ctx, myPlayerID }: MyFnContextWithMyPlayerID, ...params: MythicalAnimalScoringArgsCanBeUndefType): number;
}

/**
 * <h3>Интерфейс для функций подсчёта очков по гигантам.</h3>
 */
export interface GiantScoringFunction {
    ({ G, ctx, myPlayerID }: MyFnContextWithMyPlayerID, ...params: GiantScoringArgsCanBeUndefType): number;
}

/**
 * <h3>Интерфейс для функций подсчёта очков по валькириям.</h3>
 */
export interface ValkyryScoringFunction {
    (...params: ValkyryScoringArgsType): ValkyryScoringType;
}

export type ValkyryScoringType = 0 | 3 | 4 | 6 | 8 | 10 | 16;

/**
 * <h3>Интерфейс для функций получения преимущества по фракциям дворфов.</h3>
 */
export interface DistinctionAwardingFunction {
    ({ G, ctx, myPlayerID }: MyFnContextWithMyPlayerID): MinerDistinctionsScoringType | RoyalCoinValueType;
}

/**
 * <h3>Типы данных для остаточных аргументов функций.</h3>
 */
export type ArgsType = readonly (CanBeNullType<CoinTypeNames | DwarfCard | SuitNames | GodNames | number
    | SoloGameAndvariStrategyNames>)[];

/**
 * <h3>Типы данных для аргументов автоматических действий.</h3>
 */
export type AutoActionArgsType = readonly [OneOrTwoType | UpgradableCoinValueType];

// TODO  TODO Fix number (strengthTokenNotch...)
/**
 * <h3>Типы данных для аргументов функций подсчёта очков.</h3>
 */
export type ValkyryScoringArgsType = readonly [number];

/**
 * <h3>Типы данных для аргументов функций подсчёта очков героев, которые могут отсутствовать.</h3>
 */
export type HeroScoringArgsCanBeUndefType = readonly [BasicHeroScoringType?];

/**
 * <h3>Типы данных для аргументов функций подсчёта очков артефактов, которые могут отсутствовать.</h3>
 */
export type ArtefactScoringArgsCanBeUndefType = readonly [BasicArtefactScoringType?];

/**
 * <h3>Типы данных для аргументов функций подсчёта очков гигантов, которые могут отсутствовать.</h3>
 */
export type GiantScoringArgsCanBeUndefType = readonly [BasicGiantScoringType?];

/**
 * <h3>Типы данных для аргументов функций подсчёта очков мифических животных, которые могут отсутствовать.</h3>
 */
export type MythicalAnimalScoringArgsCanBeUndefType = readonly [BasicMythicalAnimalScoringType?];

/**
 * <h3>Типы данных для аргументов функций подсчёта очков мифологических существ, которые могут отсутствовать.</h3>
 */
type MythologicalCreatureScoringArgsCanBeUndefType =
    GiantScoringArgsCanBeUndefType | MythicalAnimalScoringArgsCanBeUndefType;

/**
 * <h3>Типы данных для аргументов функций подсчёта очков по фракциям.</h3>
 */
export type SuitScoringArgsType = readonly [PlayerBoardCardType[], CanBeUndefType<number>?, boolean?];

/**
 * <h3>Типы данных для аргументов ошибок.</h3>
 */
export type ErrorArgsType = readonly (string | number)[];

/**
 * <h3>Типы данных для всех мувов.</h3>
 */
export type MoveFunctionType = CanBeNullType<MoveFunction>;

export type PossibleReturnMaxCoinValue = 0 | RoyalCoinValueType;

/**
 * <h3>Интерфейс для функций мувов.</h3>
 */
interface MoveFunction {
    (...args: ArgsType): void;
}

/**
 * <h3>Типы данных для аргументов мувов.</h3>
 */
export type MoveArgsType = readonly [SoloGameAndvariStrategyNames] | readonly number[][] | readonly [SuitNames]
    | readonly [number] | readonly [SuitNames, number] | readonly [number, CoinTypeNames] | readonly [DwarfCard]
    | readonly [GodNames];

/**
 * <h3>Интерфейс для возможных мувов у ботов.</h3>
 */
export interface Moves {
    readonly args: MoveArgsType;
    readonly move: MoveNamesType;
}

/**
 * <h3>Интерфейс для аргументов монет у мува.</h3>
 */
export interface MoveCoinsArguments {
    readonly coinId: PlayerCoinIdType;
    readonly type: CoinTypeNames;
}

/**
 * <h3>Интерфейс для выбранного аргумента мувов с фракциями для ботов.</h3>
 */
export interface MoveSuitCardCurrentId extends CardId {
    readonly suit: SuitNames;
}

/**
 * <h3>Интерфейс для аргументов карт и id игрока у мува.</h3>
 */
export interface MoveCardsArguments {
    readonly cards: number[];
}

/**
 * <h3>Интерфейс для параметров отрисовки игрового поля.</h3>
 */
export interface DrawBoardOptions {
    readonly boardCols: number;
    readonly boardRows: number;
    readonly lastBoardCol: number;
}

/**
 * <h3>Интерфейс для количества игроков и эпох.</h3>
 */
export interface PlayersNumberTierCardData extends TierInfo {
    readonly players: NumPlayersType;
}

/**
 * <h3>Интерфейс для статуса дополнения игры.</h3>
 */
interface Expansion {
    readonly active: boolean;
}

export type HandBorderedCoinCssClasses = CoinCssClassNames.BorderedCoin | CoinCssClassNames.BorderedCoinPicked;

export type SuitCssClasses = `${SuitCssBGColorClassNames}`
    | `${SuitCssBGColorClassNames} ${CardWithoutSuitAndWithActionCssTDClassNames.CursorPointer}`;

// TODO Move all css classes to enums!
export type DistinctionCardCssTDClasses =
    `bg-green-500` | `bg-green-500 ${CardWithoutSuitAndWithActionCssTDClassNames.CursorPointer}`;

export type CoinCssTDClasses =
    `bg-yellow-300` | `bg-yellow-300 ${CardWithoutSuitAndWithActionCssTDClassNames.CursorPointer}`;

export type CoinCssSpanClasses = `` | `bg-market-coin` | `bg-coin` | `bg-coin ${CoinCssClassNames}`;

type CardWithSuitAndActionCssTDClasses = `${SuitCssBGColorClassNames}`
    | `${SuitCssBGColorClassNames} ${CardWithoutSuitAndWithActionCssTDClassNames.CursorPointer}`;

export type EmptyCardCssTDClasses = `` | `${CardWithoutSuitAndWithActionCssTDClassNames.CursorPointer}`
    | `${SuitCssBGColorClassNames} ${CardWithoutSuitAndWithActionCssTDClassNames.CursorPointer}`
    | `${SuitCssBGColorClassNames}`;

export type CardCssTDClasses = `` | `${CardWithSuitAndActionCssTDClasses}` | `bg-gray-600` | `bg-yellow-200`
    | `${CardWithoutSuitAndWithActionCssTDClassNames.CursorPointer}`
    | `bg-gray-600 ${CardWithoutSuitAndWithActionCssTDClassNames.CursorPointer}`
    | `bg-yellow-200 ${CardWithoutSuitAndWithActionCssTDClassNames.CursorPointer}`;

export type CardCssSpanClasses = `` | `${HeroCardCssSpanClassNames}` | `bg-camp` | `bg-card` | `bg-royal-offering`
    | `bg-mythological-creature-inactive` | `bg-mythological-creature`;

export type DrawCoinIdParamType = PlayerCoinIdType | IndexOf<RoyalCoinsUniqueArray>;

export type DrawCoinAdditionalParamType = MarketCoinNumberValuesType | PlayerCoinIdType;

/**
 * <h3>Интерфейс для логирования данных.</h3>
 */
export interface LogData {
    // TODO Move to Log enums
    readonly text: string;
    readonly type: LogTypeNames;
}

export type AllCardsDescriptionNamesType = ArtefactDescriptionNames | HeroDescriptionNames
    | MythicalAnimalDescriptionNames | GodDescriptionNames | GiantDescriptionNames | ValkyryDescriptionNames;

type RoundType = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * <h3>Интерфейс для игровых пользовательских данных G.</h3>
 */
export interface MyGameState {
    readonly averageCards: SuitPropertyType<DwarfCard>;
    readonly botData: AIBotData;
    readonly camp: CampCardArray;
    readonly campDecksLength: CampDecksLength;
    readonly campNum: 5;
    campPicked: boolean;
    currentTavern: TavernsArrayIndex;
    readonly debug: boolean;
    readonly decksLength: DwarfDecksLength;
    readonly discardCampCardsDeck: DiscardCampCardType[];
    readonly discardCardsDeck: DiscardDeckCardType[];
    readonly discardMultiCards: MultiSuitPlayerCard[];
    readonly discardMythologicalCreaturesCards: DiscardMythologicalCreatureCardType[];
    readonly discardSpecialCards: SpecialPlayerCard[];
    readonly distinctions: SuitPropertyType<Distinctions>;
    drawProfit: DrawProfitType;
    readonly drawSize: DrawSizeType;
    exchangeOrder: readonly CanBeUndefType<number>[];
    readonly expansions: ExpansionsType;
    explorerDistinctionCardId: CanBeNullType<ExplorerDistinctionCardIdType>,
    explorerDistinctionCards: CanBeNullType<ExplorerDistinctionCards>;
    readonly heroes: HeroCard[];
    readonly heroesForSoloBot: CanBeNullType<HeroCard[]>;
    heroesForSoloGameDifficultyLevel: CanBeNullType<HeroCard[]>;
    heroesForSoloGameForStrategyBotAndvari: CanBeNullType<HeroesForSoloGameForStrategyBotAndvariArray>;
    heroesInitialForSoloGameForBotAndvari: CanBeNullType<HeroesInitialForSoloGameForBotAndvariArray>;
    readonly log: boolean;
    readonly logData: LogData[];
    readonly mode: GameModeNames;
    readonly multiCardsDeck: readonly MultiSuitCard[];
    mustDiscardTavernCardJarnglofi: CanBeNullType<boolean>;
    mythologicalCreatureDeckForSkymir: CanBeNullType<MythologicalCreatureCardsForGiantSkymirArray>;
    mythologicalCreatureDeckLength: SecretMythologicalCreatureDeck[`length`];
    mythologicalCreatureNotInGameDeckLength: SecretMythologicalCreatureNotInGameDeck[`length`];
    odroerirTheMythicCauldron: boolean;
    readonly odroerirTheMythicCauldronCoins: RoyalCoin[];
    readonly players: Players;
    readonly publicPlayers: PublicPlayers;
    publicPlayersOrder: PlayerID[];
    round: RoundType;
    readonly royalCoins: RoyalCoin[];
    readonly royalCoinsUnique: RoyalCoinsUniqueArray;
    readonly secret: AllSecretData;
    soloGameAndvariStrategyLevel: CanBeNullType<SoloGameAndvariStrategyNames>;
    soloGameAndvariStrategyVariantLevel: CanBeNullType<SoloGameAndvariStrategyVariantLevelType>;
    soloGameDifficultyLevel: CanBeNullType<SoloGameDifficultyLevelType>;
    readonly specialCardsDeck: readonly SpecialCard[];
    strategyForSoloBotAndvari: CanBeNullType<StrategyForSoloBotAndvari>;
    readonly suitsNum: 5;
    tavernCardDiscarded2Players: boolean;
    readonly taverns: TavernsArray;
    readonly tavernsNum: TavernsNumType;
    tierToEnd: TierToEndType;
    totalScore: CanBeNullType<TotalScoreArray>;
    winner: CanBeNullType<WinnerArray>;
}

export type TotalScoreArray = [number, number] | [number, number, number] | [number, number, number, number]
    | [number, number, number, number, number];

export type MaxPlyersWithTotalScoreType = TotalScoreArray[`length`];

export type WinnerArray = [number] | [number, number] | [number, number, number] | [number, number, number, number]
    | [number, number, number, number, number];

export type RoyalCoinsUniqueArray = [RoyalCoin, RoyalCoin, RoyalCoin, RoyalCoin, RoyalCoin, RoyalCoin, RoyalCoin,
    RoyalCoin, RoyalCoin, RoyalCoin, RoyalCoin, RoyalCoin, RoyalCoin, RoyalCoin, RoyalCoin, RoyalCoin, RoyalCoin,
    RoyalCoin, RoyalCoin, RoyalCoin, RoyalCoin];

/**
 * <h3>Интерфейс для стратегий соло бота Андвари.</h3>
 */
export interface StrategyForSoloBotAndvari {
    readonly general: {
        0: CanBeNullType<SuitNames>;
        1?: CanBeNullType<SuitNames>;
        2?: CanBeNullType<SuitNames>;
    },
    readonly reserve: {
        1?: CanBeNullType<SuitNames>;
        2?: CanBeNullType<SuitNames>;
        3: CanBeNullType<SuitNames>;
        4: CanBeNullType<SuitNames>;
    };
}

/**
 * <h3>Интерфейс для распределения монет на столе.</h3>
 */
export interface ResolveBoardCoins {
    readonly exchangeOrder: number[];
    readonly playersOrder: PlayerID[];
}

/**
 * <h3>Интерфейс для условия карты героя.</h3>
 */
export interface Condition {
    readonly count: 5;
    readonly suit: SuitNames;
}

/**
 * <h3>Интерфейс для условий карты героя.</h3>
 */
export interface Conditions {
    readonly suitCountMin: Condition;
}

/**
 * <h3>Интерфейс для карты сброса для валидатора выбора карт.</h3>
 */
interface DiscardCard {
    readonly amount?: 2;
    readonly suit: CanBeNullType<SuitNames>;
}

/**
 * <h3>Интерфейс для аргументов id карты у мува.</h3>
 */
interface CardId {
    readonly cardId: number;
}

export type MoveValidatorNamesTypes = BidUlineMoveValidatorNames | ChooseDifficultySoloModeMoveValidatorNames
    | ChooseDifficultySoloModeMoveValidatorNames | ChooseDifficultySoloModeAndvariMoveValidatorNames
    | BidsMoveValidatorNames | TavernsResolutionMoveValidatorNames | EnlistmentMercenariesMoveValidatorNames
    | PlaceYludMoveValidatorNames | TroopEvaluationMoveValidatorNames | BrisingamensEndGameMoveValidatorNames
    | GetMjollnirProfitMoveValidatorNames | CommonMoveValidatorNames | SoloBotCommonMoveValidatorNames
    | SoloBotAndvariCommonMoveValidatorNames | SoloBotCommonCoinUpgradeMoveValidatorNames | SubMoveValidatorNames;

export type PlayerTavernCoinIdType = 0 | 1 | 2;

export type PlayerPouchCoinIdType = 3 | 4;

export type PlayerCoinIdType = PlayerTavernCoinIdType | PlayerPouchCoinIdType;

type SubMoveValidatorNames =
    ActivateGiantAbilityOrPickCardSubMoveValidatorNames | ActivateGodAbilityOrNotSubMoveValidatorNames;

export type GetValidatorStageNames = ActiveStageNames | FakeSubStageNames;

type FakeSubStageNames = ActivateGiantAbilityOrPickCardSubStageNames | ActivateGodAbilityOrNotSubStageNames;

/**
 * Тип для всех активных стадий игры.
 */
export type ActiveStageNames = ChooseDifficultySoloModeStageNames | EnlistmentMercenariesStageNames
    | TroopEvaluationStageNames | TavernsResolutionStageNames | CommonStageNames | SoloBotCommonStageNames
    | SoloBotAndvariCommonStageNames | SoloBotCommonCoinUpgradeStageNames | StageWithSubStageNames;

/**
* Тип для всех стадий с суб стадиями игры.
*/
type StageWithSubStageNames = TavernsResolutionWithSubStageNames;

/**
* Тип для всех стадий без суб стадий игры.
*/
type StageWithoutSubStageNames = DefaultStageNames | ActiveStageNames;

/**
* Тип для всех стадий игры.
*/
export type StageNames = StageWithoutSubStageNames | StageWithSubStageNames;

/**
* Тип для всех дефолтных стадий игры.
*/
type DefaultStageNames = BidsDefaultStageNames | BidUlineDefaultStageNames
    | ChooseDifficultySoloModeAndvariDefaultStageNames | ChooseDifficultySoloModeDefaultStageNames
    | BrisingamensEndGameDefaultStageNames | GetMjollnirProfitDefaultStageNames
    | EnlistmentMercenariesDefaultStageNames | PlaceYludDefaultStageNames | TroopEvaluationDefaultStageNames
    | TavernsResolutionDefaultStageNames;

/**
* Тип для всех стадий игры 'ChooseDifficultySoloMode'.
*/
export type ChooseDifficultySoloModeAllStageNames =
    ChooseDifficultySoloModeDefaultStageNames | ChooseDifficultySoloModeStageNames;

/**
* Тип для всех стадий игры 'EnlistmentMercenaries'.
*/
export type EnlistmentMercenariesAllStageNames =
    EnlistmentMercenariesDefaultStageNames | EnlistmentMercenariesStageNames;

/**
* Тип для всех стадий игры 'TroopEvaluation'.
*/
export type TroopEvaluationAllStageNames = TroopEvaluationStageNames | TroopEvaluationDefaultStageNames;

/**
* Тип для всех стадий игры 'TavernsResolution'.
*/
export type TavernsResolutionAllStageNames =
    TavernsResolutionStageNames | TavernsResolutionDefaultStageNames | TavernsResolutionWithSubStageNames;

// TODO Can we make it more common!?
/**
 * <h3>Интерфейс для возможных валидаторов у мувов.</h3>
 */
export type MoveBy = {
    readonly [key in PhaseNames | `default`]:
    key extends PhaseNames.Bids
    ? MoveByOptions<BidsDefaultStageNames, BidsMoveValidatorNames>
    : key extends PhaseNames.BidUline
    ? MoveByOptions<BidUlineDefaultStageNames, BidUlineMoveValidatorNames>
    : key extends PhaseNames.BrisingamensEndGame
    ? MoveByOptions<BrisingamensEndGameDefaultStageNames, BrisingamensEndGameMoveValidatorNames>
    : key extends PhaseNames.ChooseDifficultySoloModeAndvari
    ? MoveByOptions<ChooseDifficultySoloModeAndvariDefaultStageNames,
        ChooseDifficultySoloModeAndvariMoveValidatorNames>
    : key extends PhaseNames.ChooseDifficultySoloMode
    ? MoveByOptions<ChooseDifficultySoloModeAllStageNames, ChooseDifficultySoloModeMoveValidatorNames>
    & MoveByOptions<SoloBotCommonCoinUpgradeStageNames, SoloBotCommonCoinUpgradeMoveValidatorNames>
    : key extends PhaseNames.EnlistmentMercenaries
    ? MoveByOptions<EnlistmentMercenariesAllStageNames, EnlistmentMercenariesMoveValidatorNames>
    & MoveByOptions<CommonStageNames, CommonMoveValidatorNames>
    : key extends PhaseNames.GetMjollnirProfit
    ? MoveByOptions<GetMjollnirProfitDefaultStageNames, GetMjollnirProfitMoveValidatorNames>
    : key extends PhaseNames.PlaceYlud
    ? MoveByOptions<PlaceYludDefaultStageNames, PlaceYludMoveValidatorNames>
    & MoveByOptions<CommonStageNames, CommonMoveValidatorNames>
    & MoveByOptions<SoloBotCommonStageNames, SoloBotCommonMoveValidatorNames>
    & MoveByOptions<SoloBotCommonCoinUpgradeStageNames, SoloBotCommonCoinUpgradeMoveValidatorNames>
    & MoveByOptions<SoloBotAndvariCommonStageNames, SoloBotAndvariCommonMoveValidatorNames>
    : key extends PhaseNames.TavernsResolution
    ? MoveByOptions<TavernsResolutionAllStageNames, TavernsResolutionMoveValidatorNames>
    & MoveByOptions<CommonStageNames, CommonMoveValidatorNames>
    & MoveByOptions<SoloBotCommonStageNames, SoloBotCommonMoveValidatorNames>
    & MoveByOptions<SoloBotCommonCoinUpgradeStageNames, SoloBotCommonCoinUpgradeMoveValidatorNames>
    & MoveByOptions<SoloBotAndvariCommonStageNames, SoloBotAndvariCommonMoveValidatorNames>
    : key extends PhaseNames.TroopEvaluation
    ? MoveByOptions<TroopEvaluationAllStageNames, TroopEvaluationMoveValidatorNames>
    & MoveByOptions<CommonStageNames, CommonMoveValidatorNames>
    & MoveByOptions<SoloBotCommonStageNames, SoloBotCommonMoveValidatorNames>
    & MoveByOptions<SoloBotCommonCoinUpgradeStageNames, SoloBotCommonCoinUpgradeMoveValidatorNames>
    & MoveByOptions<SoloBotAndvariCommonStageNames, SoloBotAndvariCommonMoveValidatorNames>
    : null;
};

// TODO Can we make it more common!?
/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export type MoveByOptions<CurrentStageNames extends StageNames,
    CurrentValidatorNames extends MoveValidatorNamesTypes> = {
        readonly [key in CurrentStageNames]: `${key}MoveValidator` extends KeyofType<MoveValidators> ? {
            readonly [k in key as `${k}Move` extends `${MoveNamesType}` ? `${k}Move` : never]:
            `${k}MoveValidator` extends KeyofType<MoveValidators>
            ? `${k}MoveValidator` extends `${CurrentValidatorNames}`
            ? MoveValidators[`${k}MoveValidator`] : never : never;
        } : key extends StageWithSubStageNames
        ? key extends TavernsResolutionWithSubStageNames.ActivateGiantAbilityOrPickCard
        ? MoveBySubOptions<ActivateGiantAbilityOrPickCardSubStageNames,
            ActivateGiantAbilityOrPickCardSubMoveValidatorNames>
        : key extends TavernsResolutionWithSubStageNames.ActivateGodAbilityOrNot
        ? MoveBySubOptions<ActivateGodAbilityOrNotSubStageNames, ActivateGodAbilityOrNotSubMoveValidatorNames>
        : never : never;
    };

/**
* <h3>Интерфейс для возможных суб валидаторов у мува.</h3>
*/
export type MoveBySubOptions<CurrentSubStageNames extends FakeSubStageNames,
    CurrentSubValidatorNames extends SubMoveValidatorNames> = {
        readonly [key in CurrentSubStageNames as `${key}Move` extends `${MoveNamesType}` ? `${key}Move` : never]:
        `${key}MoveValidator` extends KeyofType<MoveValidators>
        ? `${key}MoveValidator` extends `${CurrentSubValidatorNames}`
        ? MoveValidators[`${key}MoveValidator`] : never : never;
    };

type MoveValidatorValueType<GetRangeType extends MoveValidatorGetRangeType> =
    GetRangeType extends Partial<SuitPropertyType<readonly number[]>> ? MoveSuitCardCurrentId
    : GetRangeType extends MoveCardsArguments ? MoveCardIdType
    : GetRangeType extends readonly MoveCoinsArguments[] ? MoveCoinsArguments
    : GetRangeType extends readonly SuitNames[] ? SuitNames
    : GetRangeType extends readonly GodNames[] ? GodNames
    : GetRangeType extends readonly SoloGameAndvariStrategyNames[] ? SoloGameAndvariStrategyNames
    : GetRangeType extends readonly number[][] ? number[]
    : GetRangeType extends readonly number[] ? number
    : GetRangeType extends DwarfCard ? DwarfCard
    : GetRangeType extends null ? null
    : never;

/**
 * <h3>Интерфейс для валидатора мувов.</h3>
 */
export interface MoveValidator<GetRangeType extends MoveValidatorGetRangeType> {
    readonly getRange: ({ G, ctx, myPlayerID }: MyFnContextWithMyPlayerID) => GetRangeType;
    readonly getValue: ({ G, ctx, myPlayerID }: MyFnContextWithMyPlayerID, moveRangeData: GetRangeType) =>
        MoveValidatorValueType<GetRangeType>;
    readonly moveName: MoveNamesType;
    readonly validate: ({ G, ctx, myPlayerID }: MyFnContextWithMyPlayerID, id: MoveValidatorValueType<GetRangeType>) =>
        boolean;
}

/**
 * <h3>Интерфейс для объекта валидаторов мувов.</h3>
 */
export interface MoveValidators {
    readonly ActivateGodAbilityMoveValidator: MoveValidator<MoveArgumentsType<GodNames[]>>;
    readonly ChooseCoinValueForHrungnirUpgradeMoveValidator: MoveValidator<MoveArgumentsType<MoveCoinsArguments[]>>;
    readonly ChooseSuitOlrunMoveValidator: MoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly ClickBoardCoinMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickCampCardMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickCardMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickCardNotGiantAbilityMoveValidator: MoveValidator<MoveArgumentsType<DwarfCard>>;
    readonly ClickCardToPickDistinctionMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickDistinctionCardMoveValidator: MoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly ClickGiantAbilityNotCardMoveValidator: MoveValidator<MoveArgumentsType<DwarfCard>>;
    readonly ClickHandCoinMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickHandCoinUlineMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickHandTradingCoinUlineMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly DiscardCardFromPlayerBoardMoveValidator:
    MoveValidator<MoveArgumentsType<Partial<SuitPropertyType<number[]>>>>;
    readonly DiscardCard2PlayersMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly GetEnlistmentMercenariesMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly GetMjollnirProfitMoveValidator: MoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly GetMythologyCardMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly NotActivateGodAbilityMoveValidator: MoveValidator<MoveArgumentsType<GodNames[]>>;
    readonly PassEnlistmentMercenariesMoveValidator: MoveValidator<MoveArgumentsType<null>>;
    readonly PlaceEnlistmentMercenariesMoveValidator: MoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly PlaceYludHeroMoveValidator: MoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly StartEnlistmentMercenariesMoveValidator: MoveValidator<MoveArgumentsType<null>>;
    // Bots
    readonly BotsPlaceAllCoinsMoveValidator: MoveValidator<MoveArgumentsType<number[][]>>;
    // Solo Bot
    readonly SoloBotClickCardMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly SoloBotClickCardToPickDistinctionMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly SoloBotClickCoinToUpgradeMoveValidator: MoveValidator<MoveArgumentsType<MoveCoinsArguments[]>>;
    readonly SoloBotClickHeroCardMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly SoloBotPlaceAllCoinsMoveValidator: MoveValidator<MoveArgumentsType<number[][]>>;
    readonly SoloBotPlaceThrudHeroMoveValidator: MoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly SoloBotPlaceYludHeroMoveValidator: MoveValidator<MoveArgumentsType<SuitNames[]>>;
    // Solo Mode
    readonly ChooseDifficultyLevelForSoloModeMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly ChooseHeroForDifficultySoloModeMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    // Solo Mode Andvari
    readonly ChooseStrategyForSoloModeAndvariMoveValidator:
    MoveValidator<MoveArgumentsType<SoloGameAndvariStrategyNames[]>>;
    readonly ChooseStrategyVariantForSoloModeAndvariMoveValidator:
    MoveValidator<MoveArgumentsType<SoloGameAndvariStrategyVariantLevelType[]>>;
    readonly SoloBotAndvariClickCardMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly SoloBotAndvariClickCardToPickDistinctionMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly SoloBotAndvariClickCoinToUpgradeMoveValidator: MoveValidator<MoveArgumentsType<MoveCoinsArguments[]>>;
    readonly SoloBotAndvariClickHeroCardMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly SoloBotAndvariPlaceAllCoinsMoveValidator: MoveValidator<MoveArgumentsType<number[][]>>;
    readonly SoloBotAndvariPlaceThrudHeroMoveValidator: MoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly SoloBotAndvariPlaceYludHeroMoveValidator: MoveValidator<MoveArgumentsType<SuitNames[]>>;
    // start
    readonly AddCoinToPouchMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickCampCardHoldaMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly ClickCoinToUpgradeMoveValidator: MoveValidator<MoveArgumentsType<MoveCoinsArguments[]>>;
    readonly ClickHeroCardMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly DiscardSuitCardFromPlayerBoardMoveValidator:
    MoveValidator<MoveArgumentsType<MoveCardsArguments>>;
    readonly DiscardTopCardFromSuitMoveValidator:
    MoveValidator<MoveArgumentsType<Partial<SuitPropertyType<number[]>>>>;
    readonly PickConcreteCoinToUpgradeMoveValidator: MoveValidator<MoveArgumentsType<MoveCoinsArguments[]>>;
    readonly PickDiscardCardMoveValidator: MoveValidator<MoveArgumentsType<number[]>>;
    readonly PlaceMultiSuitCardMoveValidator: MoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly PlaceThrudHeroMoveValidator: MoveValidator<MoveArgumentsType<SuitNames[]>>;
    readonly UpgradeCoinVidofnirVedrfolnirMoveValidator: MoveValidator<MoveArgumentsType<MoveCoinsArguments[]>>;
    // end
}

/**
 * <h3>Интерфейс для конфига валидаторов выбора карт.</h3>
 */
export interface PickValidatorsConfig {
    readonly conditions?: Conditions;
    readonly discardCard?: DiscardCard;
}

type NumberValuesForMinerArrayType = 0 | 1 | 2;

export type NumberValuesArrayType = NumberValuesForMinerArrayType | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type AllNumberValuesArraysType = [NumberValuesForMinerArrayType, NumberValuesForMinerArrayType,
    NumberValuesForMinerArrayType, NumberValuesForMinerArrayType, NumberValuesForMinerArrayType,
    NumberValuesForMinerArrayType] | [NumberValuesArrayType, NumberValuesArrayType, NumberValuesArrayType,
    NumberValuesArrayType, NumberValuesArrayType, NumberValuesArrayType, NumberValuesArrayType]
    | [NumberValuesArrayType, NumberValuesArrayType, NumberValuesArrayType, NumberValuesArrayType,
    NumberValuesArrayType, NumberValuesArrayType, NumberValuesArrayType, NumberValuesArrayType]
    | [NumberValuesArrayType, NumberValuesArrayType, NumberValuesArrayType, NumberValuesArrayType,
    NumberValuesArrayType, NumberValuesArrayType, NumberValuesArrayType, NumberValuesArrayType,
    NumberValuesArrayType];

export type AllNumberValuesArraysLengthType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * <h3>Интерфейс для числовых индексов и массивов числовых значений.</h3>
 */
type NumberArrayValues = {
    readonly [index in TierType]: AllNumberValuesArraysType;
};

type AllCoinNumberValuesType = MarketCoinNumberValuesType | PlayerCoinNumberValuesType;

export type MarketCoinNumberValuesType = 0 | 1 | 2 | 3;

export type PlayerCoinNumberValuesType = 1 | 2 | 3 | 4 | 5;

/**
 * <h3>Интерфейс для числовых индексов и числовых значений.</h3>
 */
export type CoinNumberValues<T extends AllCoinNumberValuesType> = {
    [value in AllCoinsValueType]?: T;
};

type PlayersAmountType = RoyalOfferingCardPlayersAmountType | DwarfPlayersAmountType;

/**
 * <h3>Интерфейс для индексов эпох и числовых значений.</h3>
 */
export type NumberTierValues<T extends PlayersAmountType> = {
    readonly [index in TierType]: T;
};

export type MarketCoinsAmountType = 1 | 2 | 3;

/**
 * <h3>Интерфейс для индексов по количеству игроков и числовых значений.</h3>
 */
export type NumberPlayersValues = {
    readonly [index in NumPlayersType]: MarketCoinsAmountType;
};

/**
 * <h3>Интерфейс для значений очков карт.</h3>
 */
export type PointsValues = {
    readonly [index in NumPlayersWithBotType]: PointsValuesType;
};

/**
 * <h3>Интерфейс для отрисовки бэкграунда в стилях.</h3>
 */
export interface Background {
    readonly background: string;
}

/**
 * <h3>Интерфейс для всех стилей.</h3>
 */
export interface Styles {
    readonly Camp: () => Background;
    readonly CampBack: (tier: TierType) => Background;
    readonly CampCard: (cardPath: string) => Background;
    // TODO Add type to number!
    readonly Card: (suit: SuitNames, name: CardNamesForStylesType, points: CanBeNullType<number>) => Background;
    readonly CardBack: (tier: TierType) => Background;
    readonly Coin: (value: AllCoinsValueType, isInitial: boolean) => Background;
    readonly CoinBack: () => Background;
    readonly Distinction: (distinction: SuitNames) => Background;
    readonly DistinctionsBack: () => Background;
    readonly Exchange: () => Background;
    readonly Hero: (heroName: HeroNames) => Background;
    readonly HeroBack: () => Background;
    readonly MythologicalCreature: (name: MythologicalCreatureNameType) => Background;
    readonly Priorities: (priority: AllPriorityValueType) => Background;
    readonly Priority: () => Background;
    readonly RoyalOffering: (name: RoyalOfferingNames) => Background;
    readonly Suit: (suit: SuitNames) => Background;
    readonly Tavern: (tavernId: TavernsArrayIndex) => Background;
}

/**
 * <h3>Интерфейс для конфига конкретной таверны.</h3>
 */
export interface TavernInConfig {
    readonly name: TavernNames;
}

/**
 * <h3>Типы данных для всех названий мувов.</h3>
 */
export type MoveNamesType = ButtonMoveNames | CardMoveNames | EmptyCardMoveNames | CoinMoveNames | SuitMoveNames
    | AutoBotsMoveNames | DistinctionCardMoveNames;

/**
 * <h3>Типы данных для конфига всех таверн.</h3>
 */
export type TavernsConfigType = readonly [TavernInConfig, TavernInConfig, TavernInConfig];

export type TavernsNumType = TavernsConfigType[`length`];

/**
 * <h3>Типы данных для количества всех игроков.</h3>
 */
export type NumPlayersType = 2 | 3 | 4 | 5;

/**
 * <h3>Типы данных для количества всех игроков.</h3>
 */
export type NumPlayersWithBotType = 1 | 2 | 3 | 4 | 5;

/**
 * <h3>Типы данных для всех таверн.</h3>
 */
export type TavernsArray = [TavernWithoutExpansionArray, TavernWithExpansionArray, TavernWithoutExpansionArray];

export type TavernsArrayIndex = IndexOf<TavernsArray>;

/**
 * <h3>Типы данных для базовых значений обмена монеты по артефакту 'Vidofnir Vedrfolnir'.</h3>
 */
export type BasicVidofnirVedrfolnirUpgradeValueType = 2 | RoyalOfferingCardValueType;

/**
 * <h3>Типы данных для значений обмена монеты по артефакту 'Vidofnir Vedrfolnir' для стека.</h3>
 */
export type VidofnirVedrfolnirUpgradeValueType = [BasicVidofnirVedrfolnirUpgradeValueType]
    | [BasicVidofnirVedrfolnirUpgradeValueType, Exclude<BasicVidofnirVedrfolnirUpgradeValueType, 5>];

/**
 * <h3>Типы данных для значений '1' или '2' приоритетов для стека.</h3>
 */
export type OneOrTwoType = 1 | 2;

/**
 * <h3>Типы данных для аргументов id карты и id игрока у мува.</h3>
 */
export type MoveCardIdType = CardId;

/**
 * <h3>Типы данных для карт колоды сброса.</h3>
 */
export type DiscardDeckCardType = DwarfDeckCardType | DwarfPlayerCard;

/**
 * <h3>Типы данных для карт колоды сброса.</h3>
 */
export type DiscardMythologicalCreatureCardType = MythologicalCreatureCardType | MythicalAnimalPlayerCard;

/**
 * <h3>Типы данных для сброса карт лагеря.</h3>
 */
export type DiscardCampCardType = CampDeckCardType | MercenaryPlayerCard | ArtefactPlayerCard;

/**
 * <h3>Типы данных для очков у карт.</h3>
 */
export type PointsType = DwarfPlayersAmountType | AllNumberValuesArraysType;

export type CompareTavernCardsType = -1 | 0 | 1;

/**
 * <h3>Типы данных для эпох.</h3>
 */
export type TierType = 0 | 1;

/**
 * <h3>Типы данных для эпох до завершения игры.</h3>
 */
type TierToEndType = 0 | 1 | 2;

/**
 * <h3>Типы данных для id главной стратегии соло бота Андвари.</h3>
 */
export type GeneralStrategyForSoloBotAndvariIdType = 0 | 1 | 2;

/**
 * <h3>Типы данных для id резервной стратегии соло бота Андвари.</h3>
 */
export type ReserveStrategyForSoloBotAndvariIdType = 1 | 2 | 3 | 4;

/**
 * <h3>Типы данных для короткого максимального значения токена силы Валькирии.</h3>
*/
export type StrengthTokenNotchShortMaxType = 0 | 1 | 2 | 3;

/**
 * <h3>Типы данных для длинного максимального значения токена силы Валькирии.</h3>
*/
export type StrengthTokenNotchLongMaxType = 0 | 1 | 2 | 3 | 4;

/**
 * <h3>Типы данных для количества кристаллов приоритета в игре.</h3>
*/
export type PrioritiesAmountType = 0 | 1 | 2 | 3 | 4;

export type VidofnirVedrfolnirCoinsValue = 1 | 2;

// TODO Check and make normal numbers types!
/**
 * <h3>Типы данных для 0 | 1.</h3>
 */
export type ZeroOrOneType = 0 | 1;

export type TavernCardIdPossibleType = 0 | 1 | 2 | 3 | 4;

/**
 * <h3>Типы данных для карт на планшете игрока.</h3>
 */
export type PlayerBoardCardType = DwarfPlayerCard | SpecialPlayerCard | MultiSuitPlayerCard | ArtefactPlayerCard
    | HeroPlayerCard | MercenaryPlayerCard | MythicalAnimalPlayerCard;

/**
 * <h3>Типы данных для карт таверн.</h3>
 */
export type TavernCardType = CanBeNullType<TavernCardWithExpansionType>;

type TavernWithExpansionArray = [TavernCardType, TavernCardType, TavernCardType]
    | [TavernCardType, TavernCardType, TavernCardType, TavernCardType]
    | [TavernCardType, TavernCardType, TavernCardType, TavernCardType, TavernCardType];

export type TavernWithoutExpansionArray =
    [CanBeNullType<TavernCardWithoutExpansionType>, CanBeNullType<TavernCardWithoutExpansionType>,
        CanBeNullType<TavernCardWithoutExpansionType>]
    | [CanBeNullType<TavernCardWithoutExpansionType>, CanBeNullType<TavernCardWithoutExpansionType>,
        CanBeNullType<TavernCardWithoutExpansionType>, CanBeNullType<TavernCardWithoutExpansionType>]
    | [CanBeNullType<TavernCardWithoutExpansionType>, CanBeNullType<TavernCardWithoutExpansionType>,
        CanBeNullType<TavernCardWithoutExpansionType>, CanBeNullType<TavernCardWithoutExpansionType>,
        CanBeNullType<TavernCardWithoutExpansionType>];

export type TavernAllCardsArray = [TavernCardType, TavernCardType, TavernCardType]
    | [TavernCardType, TavernCardType, TavernCardType, TavernCardType]
    | [TavernCardType, TavernCardType, TavernCardType, TavernCardType, TavernCardType];

/**
 * <h3>Типы данных для карт, которые должны быть в таверне.</h3>
 */
export type TavernCardWithExpansionType = TavernCardWithoutExpansionType | MythologicalCreatureCardType;

/**
 * <h3>Типы данных для карт, которые должны быть в таверне.</h3>
 */
type TavernCardWithoutExpansionType = DwarfDeckCardType;

type RefillDeckCardType = TavernCardWithoutExpansionType | TavernCardWithExpansionType;

export type RefillDeckCardsWithExpansionArray =
    [MythologicalCreatureCardType, MythologicalCreatureCardType, MythologicalCreatureCardType]
    | [MythologicalCreatureCardType, MythologicalCreatureCardType, MythologicalCreatureCardType,
        MythologicalCreatureCardType] | [MythologicalCreatureCardType, MythologicalCreatureCardType,
        MythologicalCreatureCardType, MythologicalCreatureCardType, MythologicalCreatureCardType];

export type RefillDeckCardsWithoutExpansionArray =
    [TavernCardWithoutExpansionType, TavernCardWithoutExpansionType, TavernCardWithoutExpansionType]
    | [TavernCardWithoutExpansionType, TavernCardWithoutExpansionType, TavernCardWithoutExpansionType,
        TavernCardWithoutExpansionType] | [TavernCardWithoutExpansionType, TavernCardWithoutExpansionType,
        TavernCardWithoutExpansionType, TavernCardWithoutExpansionType, TavernCardWithoutExpansionType];

export type RefillDeckCardsType = [RefillDeckCardType, RefillDeckCardType, RefillDeckCardType]
    | [RefillDeckCardType, RefillDeckCardType, RefillDeckCardType, RefillDeckCardType]
    | [RefillDeckCardType, RefillDeckCardType, RefillDeckCardType, RefillDeckCardType, RefillDeckCardType];

/**
 * <h3>Типы данных для отрисовки количества карт в таверне.</h3>
 */
export type DrawSizeType = 3 | 4 | 5;

/**
 * <h3>Типы данных для значений уровня сложности соло режима.</h3>
 */
export type SoloGameDifficultyLevelType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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
export type AllCardType = PlayerBoardCardType | AllPickedCardType;

/**
* <h3>Типы данных для всех типов карт, которые выбирает игрок.</h3>
*/
export type AllPickedCardType =
    DwarfDeckCardType | CampDeckCardType | HeroCard | MythologicalCreatureCardType | MultiSuitCard | SpecialCard;

export type RanksValueMultiplierType = 1 | 2;

export type AllDwarfPlayersAmountType = 6 | 7 | 8 | 9 | 10;

export type DwarfPlayersAmountType = 6 | 8 | 10;

/**
* <h3>Типы данных для значений очков карт.</h3>
*/
export type PointsValuesType = NumberTierValues<DwarfPlayersAmountType> | NumberArrayValues;

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
 * <h3>Типы данных для ключей перечислений названий валидаторов выбора карт.</h3>
 */
export type PickCardValidatorNamesKeyofTypeofType = KeyofType<typeof PickCardValidatorNames>;

/**
 * <h3>Типы данных для ключей перечислений названий валидаторов выбора карт героев.</h3>
 */
export type PickHeroCardValidatorNamesKeyofTypeofType = KeyofType<typeof PickHeroCardValidatorNames>;

/**
 * <h3>Типы данных для ключей перечислений названий базы/дополнений игры.</h3>
 */
export type GameNamesKeyofTypeofType = KeyofType<typeof GameNames>;

/**
 * <h3>Типы данных для аргументов мува.</h3>
 */
export type MoveArgumentsType<T extends MoveArgumentsArgsType> =
    T extends Partial<SuitPropertyType<readonly number[]>> ? Partial<SuitPropertyType<number[]>>
    : T extends MoveCardsArguments ? MoveCardsArguments
    : T extends readonly MoveCoinsArguments[] ? MoveCoinsArguments[]
    : T extends readonly SuitNames[] ? SuitNames[]
    : T extends readonly GodNames[] ? GodNames[]
    : T extends readonly SoloGameAndvariStrategyNames[] ? SoloGameAndvariStrategyNames[]
    : T extends readonly number[][] ? number[][]
    : T extends readonly number[] ? number[]
    : T extends DwarfCard ? DwarfCard
    : T extends null ? null
    : never;

/**
 * <h3>Типы данных для валидаторов значений для мувов.</h3>
 */
export type MoveValidatorGetRangeType = MoveArgumentsType<Partial<SuitPropertyType<number[]>>>
    | MoveArgumentsType<MoveCardsArguments>
    | MoveArgumentsType<MoveCoinsArguments[]>
    | MoveArgumentsType<MoveValidatorGetRangeStringArrayType>
    | MoveArgumentsType<number[][]>
    | MoveArgumentsType<number[]>
    | MoveArgumentsType<DwarfCard>
    | MoveArgumentsType<null>;

export type MoveValidatorGetRangeStringArrayType = SuitNames[] | GodNames[] | SoloGameAndvariStrategyNames[];

/**
* <h3>Типы данных для типов аргументов мува.</h3>
*/
type MoveArgumentsArgsType = CanBeNullType<MoveCardsArguments | DwarfCard | Partial<SuitPropertyType<readonly number[]>>
    | readonly number[][] | readonly number[] | readonly MoveCoinsArguments[] | readonly GodNames[]
    | readonly SuitNames[] | readonly SoloGameAndvariStrategyNames[]>;

/**
* <h3>Типы данных для валидации значений для мувов.</h3>
*/
export type ValidMoveIdParamType = CanBeNullType<DwarfCard | SuitNames | number[] | number
    | MoveSuitCardCurrentId | MoveCardIdType | MoveCoinsArguments | SoloGameAndvariStrategyNames | GodNames>;

/**
 * <h3>Типы данных для конфига валидаторов карт.</h3>
 */
export type ValidatorsConfigType = {
    readonly [Property in KeyofType<typeof PickCardValidatorNames>]?: Record<never, never>;
};

/**
 * <h3>Типы данных для дополнений к игре.</h3>
 */
export type ExpansionsType = {
    readonly [Property in KeyofType<typeof GameNames>]: Expansion;
};

/**
 * <h3>Типы данных для всех карт сброса.</h3>
 */
export type AllDiscardCardType =
    DwarfCard | PlayerBoardCardType | RoyalOfferingCard | ArtefactCard | MercenaryCard | MythologicalCreatureCardType;

/**
 * <h3>Тип для варианта карты героя.</h3>
 */
export type VariantType<T extends RankType> = BasicSuitableNonNullableCardInfo<T>;

/**
 * <h3>Тип для `INVALID_MOVE`.</h3>
 */
export type InvalidMoveType = `INVALID_MOVE`;

/**
 * <h3>Тип для текстового отображения названий стадии игры.</h3>
 */
export type StageNameTextType = StageRusNames | `none`;

// TODO Add Dwarf names to enum!
/**
 * <h3>Тип для названий карт для стилизации обычных карт на поле игрока.</h3>
 */
export type CardNamesForStylesType = SpecialCardNames | MultiSuitCardNames | string;

/**
 * <h3>Тип для подсчёта очков по положению токена силы валькирии при 4 значениях.</h3>
 */
export type StrengthTokenFourNotchPointsType = readonly [0, 0 | 4 | 8, 8 | 16, 0 | 16];

/**
 * <h3>Тип для подсчёта очков по положению токена силы валькирии при 5 значениях.</h3>
 */
export type StrengthTokenFiveNotchPointsType = readonly [0, 3, 6, 10, 16];

// My Utilities Start
/**
 * <h3>Типы данных для ключей любого объекта.</h3>
 */
export type KeyofType<T> = keyof T;

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
 * <h3>Получение значений типов у пары [ключ, значение] при вызове Object.entries.</h3>
 */
export type ObjectEntriesTypesForKeyValue<T extends object> = {
    readonly [K in KeyofType<T>]: [K, T[K]];
}[KeyofType<T>][];

/**
 * <h3>Тип для того, чтобы сделать некоторые поля объекта опциональными.</h3>
 */
type PartialByType<T extends object, K extends KeyofType<T>> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * <h3>Тип для того, чтобы сделать некоторые поля объекта только для чтения.</h3>
 */
type ReadonlyByType<T extends object, K extends KeyofType<T>> = Omit<T, K> & Readonly<Pick<T, K>>;

type RequiredByType<T extends object, K extends KeyofType<T>> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * <h3>Тип для того, чтобы чтобы получать индексы кортежей.</h3>
 */
export type IndexOf<T extends readonly unknown[], S extends number[] = []> =
    T[`length`] extends S[`length`] ? S[number] : IndexOf<T, [S[`length`], ...S]>;

type Permutation<T, C = T> = [T] extends [never]
    ? []
    : C extends infer U
    ? [U, ...Permutation<Exclude<T, U>>]
    : [];
// My Utilities End

// My Implementations Start
export type StripSecretsType = Game[`playerView`];

export type GameSetupDataType = DefaultPluginAPIs & {
    ctx: Ctx;
};

export type MyFnContext = FnContext & {
    playerID: PlayerID;
};

export type MyFnContextWithMyPlayerID = FnContext & {
    myPlayerID: PlayerID;
};

export interface Game<SetupData = unknown> {
    name?: string;
    minPlayers?: 2;
    maxPlayers?: 5;
    deltaState?: boolean;
    disableUndo?: boolean;
    seed?: string | number;
    setup?: (context: GameSetupDataType, setupData?: SetupData) => MyGameState;
    validateSetupData?: (setupData: CanBeUndefType<SetupData>, numPlayers: NumPlayersType) => CanBeUndefType<string>;
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
    onEnd?: (context: FnContext) => CanBeVoidType<void>;
    playerView?: (context: { G: MyGameState; ctx: Ctx; playerID: CanBeNullType<PlayerID>; }) => unknown;
    plugins?: Array<Plugin<unknown, unknown, MyGameState>>;
    ai?: {
        enumerate: (G: MyGameState, ctx: Ctx, playerID: PlayerID) => AiEnumerate;
    };
    processMove?: (state: State, action: ActionPayload.MakeMove) => State | typeof INVALID_MOVE;
    flow?: ReturnType<typeof Flow>;
}

type PhaseMap = {
    [phase in KeyofType<MoveBy> as phase extends `default` ? never : phase]: PhaseConfig<phase>;
};

interface PhaseConfig<phase extends CanBeNullType<KeyofType<MoveBy>> = null> {
    start?: boolean;
    next?: ((context: FnContext) => CanBeVoidType<PhaseNames>) | PhaseNames;
    onBegin?: (context: FnContext) => CanBeVoidType<MyGameState>;
    onEnd?: (context: FnContext) => CanBeVoidType<MyGameState>;
    endIf?: (context: FnContext) => CanBeVoidType<boolean | {
        next: PhaseNames;
    }>;
    moves?: MoveMap;
    turn?: TurnConfig<phase>;
    wrapped?: {
        endIf?: (state: State) => CanBeVoidType<boolean | {
            next: PhaseNames;
        }>;
        onBegin?: (state: State) => CanBeVoidType<MyGameState>;
        onEnd?: (state: State) => CanBeVoidType<MyGameState>;
        next?: (state: State) => CanBeVoidType<PhaseNames>;
    };
}

type MoveMap = {
    // TODO it for DefaultStageNames for current phase & stage! [moveName in MoveNames....]: Move
    [moveName: string]: Move;
};

export type Move = MoveFn | LongFormMove;

interface LongFormMove {
    move: MoveFn;
    redact?: boolean | ((context: {
        G: MyGameState;
        ctx: Ctx;
    }) => boolean);
    noLimit?: boolean;
    client?: boolean;
    undoable?: boolean | ((context: {
        G: MyGameState;
        ctx: Ctx;
    }) => boolean);
    ignoreStaleStateID?: boolean;
}

export type FnContext = DefaultPluginAPIs & {
    G: MyGameState;
    ctx: Ctx;
};

type MoveFn =
    // TODO Rework any!?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (context: MyFnContext, ...args: any[]) => CanBeVoidType<MyGameState | typeof INVALID_MOVE>;

interface TurnConfig<phase extends CanBeNullType<KeyofType<MoveBy>> = null> {
    activePlayers?: ActivePlayersArg;
    minMoves?: number;
    maxMoves?: number;
    /** @deprecated Use `minMoves` and `maxMoves` instead. */
    moveLimit?: number;
    onBegin?: (context: FnContext) => CanBeVoidType<MyGameState>;
    onEnd?: (context: FnContext) => CanBeVoidType<MyGameState>;
    endIf?: (context: FnContext) => CanBeVoidType<boolean | {
        next: PlayerID;
    }>;
    onMove?: (context: MyFnContext) => CanBeVoidType<MyGameState>;
    stages?: StageMap<phase>;
    order?: TurnOrderConfig<MyGameState>;
    wrapped?: {
        endIf?: (state: State) => CanBeVoidType<boolean | {
            next: PlayerID;
        }>;
        onBegin?: (state: State) => CanBeVoidType<MyGameState>;
        onEnd?: (state: State) => CanBeVoidType<MyGameState>;
        onMove?: (state: State & {
            playerID: PlayerID;
        }) => CanBeVoidType<MyGameState>;
    };
}

type StageMap<phase extends CanBeNullType<KeyofType<MoveBy>> = null> = {
    [key in KeyofType<MoveBy[phase extends null ? `default` : phase]> as
    key extends `${DefaultStageNames}` ? never : key]: StageConfig;
};

interface StageConfig {
    moves?: MoveMap;
    next?: PhaseNames;
}

export interface Ctx {
    numPlayers: NumPlayersType;
    playOrder: Array<PlayerID>;
    playOrderPos: number;
    activePlayers: CanBeNullType<ActivePlayers>;
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
        activePlayers: CanBeNullType<ActivePlayers>;
        _activePlayersMinMoves?: Record<PlayerID, number>;
        _activePlayersMaxMoves?: Record<PlayerID, number>;
        _activePlayersNumMoves?: Record<PlayerID, number>;
    }>;
    _nextActivePlayers?: ActivePlayersArg;
    _random?: {
        seed: string | number;
    };
}

interface ActivePlayers {
    [playerID: PlayerID]: ActiveStageNames;
}

export type BoardProps = ClientState & Omit<WrappedBoardProps, keyof ExposedClientProps> & ExposedClientProps & {
    isMultiplayer: boolean;
};

export type PlayerID = string;

export type StageArg = ActiveStageNames | {
    stage?: ActiveStageNames;
    /** @deprecated Use `minMoves` and `maxMoves` instead. */
    moveLimit?: number;
    minMoves?: number;
    maxMoves?: number;
};

declare class _ClientImpl<PluginAPIs extends Record<string, unknown> = Record<string, unknown>> {
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
    playerID: CanBeNullType<PlayerID>;
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
        setStage?: (newStage: ActiveStageNames) => void;
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
    updatePlayerID(playerID: CanBeNullType<PlayerID>): void;
    updateMatchID(matchID: string): void;
    updateCredentials(credentials: string): void;
}

type ClientState = CanBeNullType<State & {
    isActive: boolean;
    isConnected: boolean;
    log: LogEntry[];
}>;

export interface State {
    G: MyGameState;
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

// My Lobby Start
type RunningMatch = {
    app: ReturnType<typeof Client>;
    matchID: string;
    playerID: PlayerID;
    credentials?: string;
};

export interface LobbyRendererProps {
    errorMsg: string;
    gameComponents: GameComponent[];
    matches: LobbyAPI.MatchList['matches'];
    phase: LobbyPhases;
    playerName: string;
    runningMatch?: RunningMatch;
    handleEnterLobby: (playerName: string) => void;
    handleExitLobby: () => Promise<void>;
    handleCreateMatch: (gameName: string, numPlayers: NumPlayersType) => Promise<void>;
    handleJoinMatch: (gameName: string, matchID: string, playerID: PlayerID) => Promise<void>;
    handleLeaveMatch: (gameName: string, matchID: string) => Promise<void>;
    handleExitMatch: () => void;
    handleRefreshMatches: () => Promise<void>;
    handleStartMatch: (gameName: string, matchOpts: MatchOpts) => void;
}
// My Lobby End
// My Implementations Start
