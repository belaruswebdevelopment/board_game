import type { ActionPayload, ActivePlayersArg, AiEnumerate, ChatMessage, DefaultPluginAPIs, FilteredMetadata, LogEntry, Plugin, PluginState, Store, TurnOrderConfig, Undo } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import type { ClientOpts, DebugOpt } from "boardgame.io/dist/types/src/client/client";
// eslint-disable-next-line import/no-unresolved
import { Transport, type TransportOpts } from "boardgame.io/dist/types/src/client/transport/transport";
// eslint-disable-next-line import/no-unresolved
import { Flow } from "boardgame.io/dist/types/src/core/flow";
// eslint-disable-next-line import/no-unresolved
import { ProcessGameConfig } from "boardgame.io/dist/types/src/core/game";
import { ActivateGiantAbilityOrPickCardSubMoveValidatorNames, ActivateGiantAbilityOrPickCardSubStageNames, ActivateGodAbilityOrNotSubMoveValidatorNames, ActivateGodAbilityOrNotSubStageNames, ArtefactDescriptionNames, ArtefactNames, ArtefactScoringFunctionNames, AutoActionFunctionNames, AutoBotsMoveNames, BidsDefaultStageNames, BidsMoveValidatorNames, BidUlineDefaultStageNames, BidUlineMoveValidatorNames, BrisingamensEndGameDefaultStageNames, BrisingamensEndGameMoveValidatorNames, ButtonMoveNames, ButtonNames, CampBuffNames, CardMoveNames, CardTypeRusNames, ChooseDifficultySoloModeAndvariDefaultStageNames, ChooseDifficultySoloModeAndvariMoveValidatorNames, ChooseDifficultySoloModeDefaultStageNames, ChooseDifficultySoloModeMoveValidatorNames, ChooseDifficultySoloModeStageNames, CoinMoveNames, CoinTypeNames, CommonBuffNames, CommonMoveValidatorNames, CommonStageNames, ConfigNames, DistinctionAwardingFunctionNames, DistinctionCardMoveNames, DistinctionDescriptionNames, DrawNames, EmptyCardMoveNames, EnlistmentMercenariesDefaultStageNames, EnlistmentMercenariesMoveValidatorNames, EnlistmentMercenariesStageNames, GameModeNames, GameNames, GetMjollnirProfitDefaultStageNames, GetMjollnirProfitMoveValidatorNames, GiantBuffNames, GiantDescriptionNames, GiantNames, GiantScoringFunctionNames, GodBuffNames, GodDescriptionNames, GodNames, HeroBuffNames, HeroDescriptionNames, HeroNames, HeroScoringFunctionNames, LogTypeNames, MultiSuitCardNames, MythicalAnimalBuffNames, MythicalAnimalDescriptionNames, MythicalAnimalNames, MythicalAnimalScoringFunctionNames, PhaseNames, PickCardValidatorNames, PickHeroCardValidatorNames, PlaceYludDefaultStageNames, PlaceYludMoveValidatorNames, RoyalOfferingNames, SoloBotAndvariCommonMoveValidatorNames, SoloBotAndvariCommonStageNames, SoloBotCommonCoinUpgradeMoveValidatorNames, SoloBotCommonCoinUpgradeStageNames, SoloBotCommonMoveValidatorNames, SoloBotCommonStageNames, SoloGameAndvariStrategyNames, SpecialCardNames, StageRusNames, SuitBGColorNames, SuitDescriptionNames, SuitMoveNames, SuitNames, SuitRusNames, SuitScoringFunctionNames, TavernNames, TavernsResolutionDefaultStageNames, TavernsResolutionMoveValidatorNames, TavernsResolutionStageNames, TavernsResolutionWithSubStageNames, TroopEvaluationDefaultStageNames, TroopEvaluationMoveValidatorNames, TroopEvaluationStageNames, ValkyryBuffNames, ValkyryDescriptionNames, ValkyryNames, ValkyryScoringFunctionNames } from "./enums";

// Secret Data Start
/**
 * <h3>Все скрытые от всех игроков данные в `G`.</h3>
 */
export interface AllSecretData {
    readonly campDecks: SecretAllCampDecks;
    readonly decks: SecretAllDwarfDecks;
    mythologicalCreatureDeck: SecretMythologicalCreatureDeck;
    mythologicalCreatureNotInGameDeck: MythologicalCreatureCardType[];
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
export type SecretAllDwarfDecks = [SecretDwarfDeckTier0, SecretDwarfDeckTier1];

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
    readonly allPicks: number[][];
    readonly maxIter: number;
    readonly deckLength: DwarfDecksLength[0];
}

/**
 * <h3>Вес для различных действий ботов.</h3>
 */
interface AIWeight {
    readonly weight: number;
}

/**
 * <h3>Эвристика для ботов.</h3>
 */
export interface AIHeuristic<T extends unknown[]> extends AIWeight {
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
    readonly variation: number;
    readonly mean: number;
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
    readonly [K in KeyofType<DrawDebugObjectDataType>]: DrawDebugObjectDataType[K];
};

/**
 * <h3>Объединение данных для отрисовки панели дебага.</h3>
 */
export type DrawDebugObjectDataType = DebugData | DebugData[KeyofType<DebugData>];
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
    readonly suit: SuitNames;
    readonly suitName: SuitRusNames;
    readonly suitColor: SuitBGColorNames;
    readonly description: SuitDescriptionNames;
    readonly pointsValues: () => PointsValues;
    readonly scoringRule: Action<SuitScoringFunctionNames>;
    readonly distinction: Distinction;
}
//Suit End

// DwarfCard Start
/**
 * <h3>Карта дворфа.</h3>
 */
export interface DwarfCard extends BasicSuitableNonNullableCardInfo {
    // TODO Rework all cards name in Enums
    readonly name: string;
    readonly type: CardTypeRusNames.Dwarf_Card;
}

/**
 * <h3>Создание карты дворфа.</h3>
 */
export type CreateDwarfCardFromData = PartialByType<DwarfCard, `type` | `rank` | `points`>;
// DwarfCard End

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
    readonly type: CardTypeRusNames.Royal_Offering_Card;
    readonly value: RoyalOfferingCardValueType;
}

/**
 * <h3>Создание карты королевской награды.</h3>
 */
export type CreateRoyalOfferingCardFromData = PartialByType<RoyalOfferingCard, `type`>;

/**
 * <h3>Количество карт королевской награды в каждой эпохе в зависимости от количества игроков.</h3>
 */
export type RoyalOfferingCardPlayersAmount = {
    readonly [index in NumPlayersWithBotType]: NumberTierValues;
};

/**
 * <h3>Объединение данных для значений карт королевской награды.</h3>
 */
type RoyalOfferingCardValueType = 3 | 5;
// RoyalOfferingCard End

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
export interface HeroCardData extends PartialByType<Omit<HeroCard, `type` | `active`>, `suit` | `rank` | `points`>,
    ExpansionCardInfo {
    readonly scoringRule: Action<HeroScoringFunctionNames, ScoringArgsType>;
}

/**
 * <h3>Карта героя.</h3>
 */
export interface HeroCard extends BasicSuitableNullableCardInfo, AutoActionCardInfo, StackCardInfo {
    readonly type: CardTypeRusNames.Hero_Card;
    readonly name: HeroNames;
    readonly description: HeroDescriptionNames;
    readonly buff?: HeroBuff;
    readonly pickValidators?: IPickValidatorsConfig;
    active: boolean;
}

/**
 * <h3>Создание карты героя.</h3>
 */
export type CreateHeroCardFromData = PartialByType<Omit<HeroCard, `active`>
    & ReadonlyByType<HeroCard, `active`>, `type` | `suit` | `rank` | `points` | `active`>;
// HeroCard End

// HeroPlayerCard Start
/**
 * <h3>Карта героя на поле игрока.</h3>
 */
export interface HeroPlayerCard extends BasicSuitableNonNullableCardInfo {
    readonly type: CardTypeRusNames.Hero_Player_Card;
    readonly name: HeroNames;
    readonly description: HeroDescriptionNames;
}

/**
 * <h3>Создание карты героя на поле игрока.</h3>
 */
export type CreateHeroPlayerCardFromData = PartialByType<HeroPlayerCard, `type` | `rank` | `points`>;
// HeroPlayerCard End

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
export type SpecialCardData = Omit<SpecialCard, `type`>;

/**
 * <h3>Особая карта.</h3>
 */
export interface SpecialCard extends BasicSuitableNonNullableCardInfo {
    readonly type: CardTypeRusNames.Special_Card;
    readonly name: SpecialCardNames;
}

/**
* <h3>Создание особой карты.</h3>
*/
export type CreateSpecialCardFromData = PartialByType<SpecialCard, `type`>;
// SpecialCard End

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
export type MultiSuitCardData = Omit<MultiSuitCard, `type`> & ExpansionCardInfo;

/**
 * <h3>Мультифракционная карта.</h3>
 */
export interface MultiSuitCard {
    readonly type: CardTypeRusNames.Multi_Suit_Card;
    readonly name: MultiSuitCardNames;
}

/**
* <h3>Создание мультифракционной карты.</h3>
*/
export type CreateMultiSuitCardFromData = PartialByType<MultiSuitCard, `type`>;
// MultiSuitCard End

// MultiSuitPlayerCard Start
/**
 * <h3>Мультифракционная карта на поле игрока.</h3>
 */
export interface MultiSuitPlayerCard extends BasicSuitableNonNullableCardInfo {
    readonly type: CardTypeRusNames.Multi_Suit_Player_Card;
    readonly name: MultiSuitCardNames;
}

/**
 * <h3>Создание мультифракционной карты на поле игрока.</h3>
 */
export type CreateMultiSuitPlayerCardFromData = PartialByType<MultiSuitPlayerCard, `type` | `rank` | `points`>;
// MultiSuitPlayerCard End

// ArtefactCampCard Start
/**
 * <h3>Конфиг всех карт лагеря артефактов по каждой эпохе.</h3>
 */
export type ArtefactConfig = {
    readonly [Property in KeyofType<typeof ArtefactNames>]: ArtefactCampCardData;
};

/**
 * <h3>Данные карты лагеря артефакта.</h3>
 */
export interface ArtefactCampCardData extends TierInfo,
    Pick<ArtefactCampCard, `buff` | `actions` | `validators` | `stack`>,
    PartialByType<Omit<ArtefactPlayerCampCard, `type` | `path`>, `suit` | `rank` | `points`> {
    readonly scoringRule: Action<ArtefactScoringFunctionNames, ScoringArgsType>;
}

/**
 * <h3>Карта лагеря артефакта.</h3>
 */
export interface ArtefactCampCard extends PathCardInfo, AutoActionCardInfo, StackCardInfo {
    readonly type: CardTypeRusNames.Artefact_Card;
    readonly name: ArtefactNames;
    readonly description: ArtefactDescriptionNames;
    readonly buff?: ArtefactBuff;
}

/**
 * <h3>Создание карты лагеря артефакта.</h3>
 */
export type CreateArtefactCampCardFromData = PartialByType<ArtefactCampCard, `type`>;
// ArtefactCampCard End

// ArtefactPlayerCampCard Start
/**
 * <h3>Карта лагеря артефакта на столе игрока.</h3>
 */
export interface ArtefactPlayerCampCard extends BasicSuitableNonNullableCardInfo, PathCardInfo {
    readonly type: CardTypeRusNames.Artefact_Player_Card;
    readonly name: ArtefactNames;
    readonly description: ArtefactDescriptionNames;
}

/**
 * <h3>Создание карты лагеря артефакта на столе игрока.</h3>
 */
export type CreateArtefactPlayerCampCardFromData = PartialByType<ArtefactPlayerCampCard, `type` | `rank` | `points`>;
// ArtefactPlayerCampCard End

// MercenaryCampCard Start
/**
 * <h3>Конфиг всех карт лагеря наёмников по каждой эпохе.</h3>
 */
export type MercenariesConfig = [MercenariesConfigTier0, MercenariesConfigTier1];

/**
 * <h3>Данные конфига карт лагеря наёмников 1 эпохи.</h3>
 */
export type MercenariesConfigTier0 =
    [MercenaryData, MercenaryData, MercenaryData, MercenaryData, MercenaryData, MercenaryData];

/**
 * <h3>Данные конфига карт лагеря наёмников 2 эпохи.</h3>
 */
export type MercenariesConfigTier1 =
    [MercenaryData, MercenaryData, MercenaryData, MercenaryData, MercenaryData, MercenaryData];

/**
* <h3>Объединение данных конфигов карт лагеря наёмников каждой конкретной эпохи.</h3>
*/
export type MercenariesConfigType = MercenariesConfigTier0 | MercenariesConfigTier1;

/**
 * <h3>Данные для создания карты лагеря наёмника.</h3>
 */
export type MercenaryData = Partial<SuitPropertyType<MercenaryType>>;

/**
 * <h3>Карта лагеря наёмника.</h3>
 */
export interface MercenaryCampCard extends PathCardInfo {
    // TODO Rework all cards name in Enums
    readonly name: string;
    readonly type: CardTypeRusNames.Mercenary_Card;
    readonly variants: Partial<SuitPropertyType<VariantType>>;
}

/**
 * <h3>Создание карты лагеря наёмника.</h3>
 */
export type CreateMercenaryCampCardFromData = PartialByType<MercenaryCampCard, `type`>;
// MercenaryCampCard End

// MercenaryPlayerCampCard Start
/**
 * <h3>Карты наёмника на столе игрока.</h3>
 */
export interface MercenaryPlayerCampCard extends MercenaryType, PathCardInfo {
    // TODO Rework all cards name in Enums
    readonly name: string;
    readonly type: CardTypeRusNames.Mercenary_Player_Card;
}

/**
 * <h3>Создание карты наёмника на столе игрока.</h3>
 */
export type CreateMercenaryPlayerCampCardFromData = PartialByType<MercenaryPlayerCampCard, `type` | `rank` | `points`>;
// MercenaryPlayerCampCard End

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
export interface GiantData extends Omit<GiantCard, `type` | `capturedCard` | `isActivated`> {
    readonly scoringRule: Action<GiantScoringFunctionNames, ScoringArgsType>;
}

/**
 * <h3>Карта гиганта.</h3>
 */
export interface GiantCard extends Pick<AutoActionCardInfo, `actions`>, ActivatedCardInfo {
    readonly name: GiantNames;
    readonly type: CardTypeRusNames.Giant_Card;
    readonly description: GiantDescriptionNames;
    readonly buff: GiantBuff;
    readonly placedSuit: SuitNames;
    capturedCard: CanBeNullType<DwarfCard>;
}

/**
 * <h3>Создание карты гиганта.</h3>
 */
export type CreateGiantCardFromData = PartialByType<Omit<GiantCard, `capturedCard`>
    & ReadonlyByType<GiantCard, `capturedCard`>, `type` | `capturedCard` | `isActivated`>;
// Giant End

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

/**
 * <h3>Карта бога.</h3>
 */
export interface GodCard extends ActivatedCardInfo {
    readonly name: GodNames;
    readonly type: CardTypeRusNames.God_Card;
    readonly description: GodDescriptionNames;
    readonly buff: GodBuff;
    readonly points: number;
}

/**
 * <h3>Создание карты бога.</h3>
 */
export type CreateGodCardFromData = PartialByType<GodCard, `type` | `isActivated`>;
// God End

// MythologicalCreature Start
/**
 * <h3>Конфиг всех карт мифических существ.</h3>
 */
export type MythologicalCreatureConfig = {
    readonly [index in NumPlayersType]: number;
};
// MythologicalCreature End

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
export interface MythicalAnimalData extends PartialByType<Omit<MythicalAnimalCard, `type`>, `rank` | `points`> {
    readonly scoringRule: Action<MythicalAnimalScoringFunctionNames, ScoringArgsType>;
}

/**
 * <h3>Карта мистического животного.</h3>
 */
export interface MythicalAnimalCard extends BasicSuitableNonNullableCardInfo, StackCardInfo {
    readonly name: MythicalAnimalNames;
    readonly description: MythicalAnimalDescriptionNames;
    readonly buff?: MythicalAnimalBuff;
    readonly type: CardTypeRusNames.Mythical_Animal_Card;
}

/**
 * <h3>Создание карты мистического животного.</h3>
 */
export type CreateMythicalAnimalCardFromData = PartialByType<MythicalAnimalCard, `type` | `rank` | `points`>;
// MythicalAnimal End

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
export interface ValkyryData extends Omit<ValkyryCard, `type` | `strengthTokenNotch`> {
    readonly scoringRule: Action<ValkyryScoringFunctionNames>;
}

/**
 * <h3>Карта валькирии.</h3>
 */
export interface ValkyryCard extends StackCardInfo {
    readonly name: ValkyryNames;
    readonly description: ValkyryDescriptionNames;
    readonly type: CardTypeRusNames.Valkyry_Card;
    readonly buff: ValkyryBuff;
    strengthTokenNotch: CanBeNullType<number>;
}

/**
 * <h3>Создание карты валькирии.</h3>
 */
export type CreateValkyryCardFromData = PartialByType<Omit<ValkyryCard, `strengthTokenNotch`>
    & ReadonlyByType<ValkyryCard, `strengthTokenNotch`>, `type` | `strengthTokenNotch`>;
// Valkyry End

// Card Info Start
/**
 * <h3>Данные карты с основными характеристиками, которые могут и не присутствовать.</h3>
 */
export interface BasicSuitableNullableCardInfo {
    readonly suit: CanBeNullType<SuitNames>;
    readonly rank: CanBeNullType<number>;
    readonly points: CanBeNullType<number>;
}

/**
 * <h3>Данные карты с основными характеристиками, которые должны присутствовать.</h3>
 */
interface BasicSuitableNonNullableCardInfo extends Pick<BasicSuitableNullableCardInfo, `points`> {
    readonly suit: SuitNames;
    readonly rank: NonNullable<BasicSuitableNullableCardInfo[`rank`]>;
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
    readonly validators?: ValidatorsConfigType;
    readonly actions?: Action<AutoActionFunctionNames, AutoActionArgsType>;
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
    readonly stack?: StackCard;
}

/**
 * <h3>Стек у карты.</h3>
 */
interface StackCard {
    player?: Stack[];
    soloBot?: Stack[];
    soloBotAndvari?: Stack[];
}
// Card Info End

// Buff Start
/**
 * <h3>Баф карты лагеря артефакта.</h3>
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
 * <h3>Объединение всех бафов.</h3>
 */
export type BuffType = GiantBuff | ValkyryBuff | MythicalAnimalBuff | ArtefactBuff | HeroBuff | CommonBuff;

/**
* <h3>Объединение названий всех бафов.</h3>
*/
export type AllBuffNames = CommonBuffNames | CampBuffNames | GodBuffNames | GiantBuffNames | HeroBuffNames
    | MythicalAnimalBuffNames | ValkyryBuffNames;

/**
* <h3>Объединение значений бафов.</h3>
*/
export type BuffValueType = SuitNames | true;

/**
 * <h3>Виды бафов у игрока.</h3>
 */
export interface PlayerBuffs {
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
    readonly description: DistinctionDescriptionNames;
    readonly awarding: Action<DistinctionAwardingFunctionNames>;
}

/**
 * <h3>Данные всех преимуществ по знакам отличия всех фракций дворфов.</h3>
 */
export type Distinctions = CanBeUndefType<CanBeNullType<PlayerID>>;

/**
 * <h3>Массив всех карт для выбора преимущества по знаку отличия фракции разведчиков.</h3>
 */
export type ExplorerDistinctionCards = [DwarfDeckCardType, DwarfDeckCardType?, DwarfDeckCardType?, DwarfDeckCardType?,
    DwarfDeckCardType?, DwarfDeckCardType?];

/**
* <h3>Данные для количества и максимального значения шевронов для получения преимущества по знаку отличия фракции дворфов.</h3>
*/
export type PlayerRanksAndMaxRanksForDistinctionsType = [number[], number];
// Distinction End

/**
 * <h3>Интерфейс для данных эпохи карты.</h3>
 */
interface TierInfo {
    readonly tier: TierType;
}

/**
 * <h3>Интерфейс для данных стека у карт.</h3>
 */
export interface StackData {
    readonly activateGiantAbilityOrPickCard: (giantName: GiantNames, card: DwarfCard) => Stack;
    readonly activateGodAbilityOrNot: (godName: GodNames) => Stack;
    readonly addCoinToPouch: () => Stack;
    readonly brisingamensEndGameAction: () => Stack;
    readonly chooseSuitOlrun: () => Stack;
    readonly chooseStrategyLevelForSoloModeAndvari: () => Stack;
    readonly chooseStrategyVariantLevelForSoloModeAndvari: () => Stack;
    readonly discardCardFromBoardBonfur: () => Stack;
    readonly discardCardFromBoardCrovaxTheDoppelganger: () => Stack;
    readonly discardCardFromBoardDagda: (pickedSuit?: SuitNames) => Stack;
    readonly discardSuitCard: (playerId: PlayerID) => Stack;
    readonly discardSuitCardHofud: () => Stack;
    readonly discardTavernCard: () => Stack;
    readonly enlistmentMercenaries: () => Stack;
    readonly getDifficultyLevelForSoloMode: () => Stack;
    readonly getMythologyCardSkymir: (priority?: 3) => Stack;
    readonly getHeroesForSoloMode: () => Stack;
    readonly getDistinctions: () => Stack;
    readonly getMjollnirProfit: () => Stack;
    readonly pickCampCardHolda: () => Stack;
    readonly pickCard: () => Stack;
    readonly pickCardSoloBot: () => Stack;
    readonly pickCardSoloBotAndvari: () => Stack;
    // TODO Add types for coinValue & value
    readonly pickConcreteCoinToUpgrade: (coinValue: number, value: number) => Stack;
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
    readonly placeEnlistmentMercenaries: (card: MercenaryCampCard) => Stack;
    readonly startAddPlusTwoValueToAllCoinsUline: (coinId: number) => Stack;
    readonly startChooseCoinValueForVidofnirVedrfolnirUpgrade: (valueArray: VidofnirVedrfolnirUpgradeValueType,
        coinId?: number, priority?: 3) => Stack;
    readonly startOrPassEnlistmentMercenaries: () => Stack;
    readonly upgradeCoin: (value: number) => Stack;
    readonly upgradeCoinSoloBot: (value: number) => Stack;
    readonly upgradeCoinSoloBotAndvari: (value: number) => Stack;
    readonly upgradeCoinVidofnirVedrfolnir: (value: number, coinId?: number, priority?: 3) => Stack;
    readonly upgradeCoinWarriorDistinction: () => Stack;
    readonly upgradeCoinWarriorDistinctionSoloBot: () => Stack;
    readonly upgradeCoinWarriorDistinctionSoloBotAndvari: () => Stack;
}

/**
 * <h3>Интерфейс для стека действия.</h3>
 */
export interface Stack {
    priority?: number;
    readonly giantName?: GiantNames;
    readonly godName?: GodNames;
    readonly playerId?: PlayerID;
    readonly coinId?: number;
    readonly coinValue?: number;
    readonly suit?: SuitNames;
    readonly pickedSuit?: SuitNames;
    readonly value?: number;
    readonly valueArray?: VidofnirVedrfolnirUpgradeValueType;
    readonly configName?: ConfigNames;
    readonly drawName?: DrawNames;
    readonly stageName?: ActiveStageNames;
    readonly name?: StackNamesType;
    readonly card?: StackCardType;
}

/**
 * <h3>Интерфейс для действия.</h3>
 */
export interface Action<TName extends ActionNamesType, TParams extends ActionParamsType = undefined> {
    readonly name: TName;
    readonly params?: TParams;
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
export interface IPlayersNumberTierCardData extends TierInfo {
    readonly players: NumPlayersType;
}

/**
 * <h3>Интерфейс опций для создания монет.</h3>
 */
export interface IBuildCoinsOptions {
    readonly isInitial?: boolean,
    readonly players?: NumPlayersType;
    readonly count?: Partial<ICoin>[];
}

/**
 * <h3>Интерфейс для монеты.</h3>
 */
export interface ICoin {
    readonly isInitial: boolean;
    isOpened: boolean;
    readonly isTriggerTrading: boolean;
    // TODO Move to InitialCoinValueType/MarketCoinValueType in all places?
    readonly value: number;
}

/**
 * <h3>Интерфейс для конфига монет рынка.</h3>
 */
export interface IMarketCoinConfig extends Pick<ICoin, `value`> {
    readonly count: () => NumberPlayersValues;
}

/**
 * <h3>Интерфейс для автоматических действий с параметрами.</h3>
 */
interface IAutoActionFunction {
    (context: MyFnContextWithMyPlayerID, ...params: AutoActionArgsType): void;
}

/**
 * <h3>Интерфейс для действий без параметров.</h3>
 */
export interface IActionFunctionWithoutParams {
    (context: MyFnContextWithMyPlayerID): void;
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
    ({ G, ctx, myPlayerID }: MyFnContextWithMyPlayerID, isFinal?: boolean, ...params: ScoringArgsCanBeUndefType):
        number;
}

// TODO Rework common ScoringFunction interfaces!?
/**
 * <h3>Интерфейс для функций подсчёта очков по героям.</h3>
 */
export interface IHeroScoringFunction {
    ({ G, ctx, myPlayerID }: MyFnContextWithMyPlayerID, ...params: ScoringArgsCanBeUndefType): number;
}

/**
 * <h3>Интерфейс для функций подсчёта очков по мифическим животным.</h3>
 */
export interface IMythicalAnimalScoringFunction {
    ({ G, ctx, myPlayerID }: MyFnContextWithMyPlayerID, ...params: ScoringArgsType): number;
}

/**
 * <h3>Интерфейс для функций подсчёта очков по гигантам.</h3>
 */
export interface IGiantScoringFunction {
    ({ G, ctx, myPlayerID }: MyFnContextWithMyPlayerID, ...params: ScoringArgsType): number;
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
    ({ G, ctx, myPlayerID }: MyFnContextWithMyPlayerID): number;
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
export interface MyGameState {
    readonly mode: GameModeNames;
    soloGameDifficultyLevel: CanBeNullType<SoloGameDifficultyLevelType>;
    soloGameAndvariStrategyVariantLevel: CanBeNullType<SoloGameAndvariStrategyVariantLevelType>;
    soloGameAndvariStrategyLevel: CanBeNullType<SoloGameAndvariStrategyNames>;
    odroerirTheMythicCauldron: boolean;
    readonly odroerirTheMythicCauldronCoins: ICoin[];
    readonly averageCards: SuitPropertyType<DwarfCard>;
    readonly botData: AIBotData;
    readonly decksLength: DwarfDecksLength;
    readonly campDecksLength: CampDecksLength;
    mythologicalCreatureDeckForSkymir: CanBeNullType<MythologicalCreatureCardsArrayType>;
    mythologicalCreatureDeckLength: SecretMythologicalCreatureDeck[`length`];
    mythologicalCreatureNotInGameDeckLength: SecretMythologicalCreatureNotInGameDeck[`length`];
    explorerDistinctionCardId: CanBeNullType<number>,
    explorerDistinctionCards: CanBeNullType<ExplorerDistinctionCards>;
    readonly camp: CampCardArrayType;
    readonly secret: AllSecretData;
    readonly campNum: 5;
    mustDiscardTavernCardJarnglofi: CanBeNullType<boolean>;
    campPicked: boolean;
    currentTavern: CurrentTavernType;
    readonly debug: boolean;
    readonly multiCardsDeck: MultiSuitCard[];
    readonly specialCardsDeck: SpecialCard[];
    readonly discardCampCardsDeck: DiscardCampCardType[];
    readonly discardCardsDeck: DiscardDeckCardType[];
    readonly discardMythologicalCreaturesCards: MythologicalCreatureCardType[];
    readonly discardMultiCards: MultiSuitPlayerCard[];
    readonly discardSpecialCards: SpecialCard[];
    readonly distinctions: SuitPropertyType<Distinctions>;
    drawProfit: DrawProfitType;
    readonly drawSize: DrawSizeType;
    exchangeOrder: CanBeUndefType<number>[];
    readonly expansions: ExpansionsType;
    readonly heroes: HeroCard[];
    readonly heroesForSoloBot: CanBeNullType<HeroesForSoloGameArrayType>;
    heroesForSoloGameDifficultyLevel: CanBeNullType<HeroCard[]>;
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
    publicPlayersOrder: PlayerID[];
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
    readonly playersOrder: PlayerID[];
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

export type MoveValidatorNamesTypes = BidUlineMoveValidatorNames | ChooseDifficultySoloModeMoveValidatorNames
    | ChooseDifficultySoloModeMoveValidatorNames | ChooseDifficultySoloModeAndvariMoveValidatorNames
    | BidsMoveValidatorNames | TavernsResolutionMoveValidatorNames | EnlistmentMercenariesMoveValidatorNames
    | PlaceYludMoveValidatorNames | TroopEvaluationMoveValidatorNames | BrisingamensEndGameMoveValidatorNames
    | GetMjollnirProfitMoveValidatorNames | CommonMoveValidatorNames | SoloBotCommonMoveValidatorNames
    | SoloBotAndvariCommonMoveValidatorNames | SoloBotCommonCoinUpgradeMoveValidatorNames | SubMoveValidatorNames;

type SubMoveValidatorNames =
    ActivateGiantAbilityOrPickCardSubMoveValidatorNames | ActivateGodAbilityOrNotSubMoveValidatorNames;

export type GetValidatorStageNames = ActiveStageNames | FakeSubStageNames;

type FakeSubStageNames = ActivateGiantAbilityOrPickCardSubStageNames | ActivateGodAbilityOrNotSubStageNames;

/**
 * Тип для всех активных стадий игры.
 */
export type ActiveStageNames = ChooseDifficultySoloModeStageNames
    | EnlistmentMercenariesStageNames | TroopEvaluationStageNames | TavernsResolutionStageNames
    | CommonStageNames | SoloBotCommonStageNames | SoloBotAndvariCommonStageNames | SoloBotCommonCoinUpgradeStageNames
    | StageWithSubStageNames;

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
export type IMoveBy = {
    readonly [key in PhaseNames | `default`]:
    key extends PhaseNames.Bids
    ? IMoveByOptions<BidsDefaultStageNames, BidsMoveValidatorNames>
    : key extends PhaseNames.BidUline
    ? IMoveByOptions<BidUlineDefaultStageNames, BidUlineMoveValidatorNames>
    : key extends PhaseNames.BrisingamensEndGame
    ? IMoveByOptions<BrisingamensEndGameDefaultStageNames, BrisingamensEndGameMoveValidatorNames>
    : key extends PhaseNames.ChooseDifficultySoloModeAndvari
    ? IMoveByOptions<ChooseDifficultySoloModeAndvariDefaultStageNames,
        ChooseDifficultySoloModeAndvariMoveValidatorNames>
    : key extends PhaseNames.ChooseDifficultySoloMode
    ? IMoveByOptions<ChooseDifficultySoloModeAllStageNames, ChooseDifficultySoloModeMoveValidatorNames>
    & IMoveByOptions<SoloBotCommonCoinUpgradeStageNames, SoloBotCommonCoinUpgradeMoveValidatorNames>
    : key extends PhaseNames.EnlistmentMercenaries
    ? IMoveByOptions<EnlistmentMercenariesAllStageNames, EnlistmentMercenariesMoveValidatorNames>
    & IMoveByOptions<CommonStageNames, CommonMoveValidatorNames>
    : key extends PhaseNames.GetMjollnirProfit
    ? IMoveByOptions<GetMjollnirProfitDefaultStageNames, GetMjollnirProfitMoveValidatorNames>
    : key extends PhaseNames.PlaceYlud
    ? IMoveByOptions<PlaceYludDefaultStageNames, PlaceYludMoveValidatorNames>
    & IMoveByOptions<CommonStageNames, CommonMoveValidatorNames>
    & IMoveByOptions<SoloBotCommonStageNames, SoloBotCommonMoveValidatorNames>
    & IMoveByOptions<SoloBotCommonCoinUpgradeStageNames, SoloBotCommonCoinUpgradeMoveValidatorNames>
    & IMoveByOptions<SoloBotAndvariCommonStageNames, SoloBotAndvariCommonMoveValidatorNames>
    : key extends PhaseNames.TavernsResolution
    ? IMoveByOptions<TavernsResolutionAllStageNames, TavernsResolutionMoveValidatorNames>
    & IMoveByOptions<CommonStageNames, CommonMoveValidatorNames>
    & IMoveByOptions<SoloBotCommonStageNames, SoloBotCommonMoveValidatorNames>
    & IMoveByOptions<SoloBotCommonCoinUpgradeStageNames, SoloBotCommonCoinUpgradeMoveValidatorNames>
    & IMoveByOptions<SoloBotAndvariCommonStageNames, SoloBotAndvariCommonMoveValidatorNames>
    : key extends PhaseNames.TroopEvaluation
    ? IMoveByOptions<TroopEvaluationAllStageNames, TroopEvaluationMoveValidatorNames>
    & IMoveByOptions<CommonStageNames, CommonMoveValidatorNames>
    & IMoveByOptions<SoloBotCommonStageNames, SoloBotCommonMoveValidatorNames>
    & IMoveByOptions<SoloBotCommonCoinUpgradeStageNames, SoloBotCommonCoinUpgradeMoveValidatorNames>
    & IMoveByOptions<SoloBotAndvariCommonStageNames, SoloBotAndvariCommonMoveValidatorNames>
    : null;
};

// TODO Can we make it more common!?
/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export type IMoveByOptions<CurrentStageNames extends StageNames,
    CurrentValidatorNames extends MoveValidatorNamesTypes> = {
        readonly [key in CurrentStageNames]: `${key}MoveValidator` extends KeyofType<IMoveValidators> ? {
            readonly [k in key as `${k}Move` extends `${MoveNamesType}` ? `${k}Move` : never]:
            `${k}MoveValidator` extends KeyofType<IMoveValidators>
            ? `${k}MoveValidator` extends `${CurrentValidatorNames}`
            ? IMoveValidators[`${k}MoveValidator`] : never : never;
        } : key extends StageWithSubStageNames
        ? key extends TavernsResolutionWithSubStageNames.ActivateGiantAbilityOrPickCard
        ? IMoveBySubOptions<ActivateGiantAbilityOrPickCardSubStageNames,
            ActivateGiantAbilityOrPickCardSubMoveValidatorNames>
        : key extends TavernsResolutionWithSubStageNames.ActivateGodAbilityOrNot
        ? IMoveBySubOptions<ActivateGodAbilityOrNotSubStageNames, ActivateGodAbilityOrNotSubMoveValidatorNames>
        : never : never;
    };

/**
* <h3>Интерфейс для возможных суб валидаторов у мува.</h3>
*/
export type IMoveBySubOptions<CurrentSubStageNames extends FakeSubStageNames,
    CurrentSubValidatorNames extends SubMoveValidatorNames> = {
        readonly [key in CurrentSubStageNames as `${key}Move` extends `${MoveNamesType}` ? `${key}Move` : never]:
        `${key}MoveValidator` extends KeyofType<IMoveValidators>
        ? `${key}MoveValidator` extends `${CurrentSubValidatorNames}`
        ? IMoveValidators[`${key}MoveValidator`] : never : never;
    };

type MoveValidatorValueType<GetRangeType extends MoveValidatorGetRangeType> =
    GetRangeType extends Partial<SuitPropertyType<number[]>> ? IMoveSuitCardCurrentId
    : GetRangeType extends IMoveCardsArguments ? MoveCardIdType
    : GetRangeType extends IMoveCoinsArguments[] ? IMoveCoinsArguments
    : GetRangeType extends SuitNames[] ? SuitNames
    : GetRangeType extends GodNames[] ? GodNames
    : GetRangeType extends SoloGameAndvariStrategyNames[] ? SoloGameAndvariStrategyNames
    : GetRangeType extends number[][] ? number[]
    : GetRangeType extends number[] ? number
    : GetRangeType extends DwarfCard ? DwarfCard
    : GetRangeType extends null ? null
    : never;

/**
 * <h3>Интерфейс для валидатора мувов.</h3>
 */
export interface IMoveValidator<GetRangeType extends MoveValidatorGetRangeType> {
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
export interface IMoveValidators {
    readonly ActivateGodAbilityMoveValidator: IMoveValidator<MoveArgumentsType<GodNames[]>>;
    readonly NotActivateGodAbilityMoveValidator: IMoveValidator<MoveArgumentsType<null>>;
    readonly ChooseCoinValueForHrungnirUpgradeMoveValidator: IMoveValidator<MoveArgumentsType<IMoveCoinsArguments[]>>;
    readonly ClickCardNotGiantAbilityMoveValidator: IMoveValidator<MoveArgumentsType<DwarfCard>>;
    readonly ClickGiantAbilityNotCardMoveValidator: IMoveValidator<MoveArgumentsType<DwarfCard>>;
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
    readonly ChooseHeroForDifficultySoloModeMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
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
    readonly PickConcreteCoinToUpgradeMoveValidator: IMoveValidator<MoveArgumentsType<IMoveCoinsArguments[]>>;
    readonly ClickCoinToUpgradeMoveValidator: IMoveValidator<MoveArgumentsType<IMoveCoinsArguments[]>>;
    readonly ClickHeroCardMoveValidator: IMoveValidator<MoveArgumentsType<number[]>>;
    readonly DiscardTopCardFromSuitMoveValidator:
    IMoveValidator<MoveArgumentsType<Partial<SuitPropertyType<number[]>>>>;
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
type NumberArrayValuesType = {
    readonly [index in TierType]: number[];
};

/**
 * <h3>Интерфейс для числовых индексов и числовых значений.</h3>
 */
export interface INumberValues {
    // index === coin.value(s) type => index in coinValues!
    [index: number]: number;
}

/**
 * <h3>Интерфейс для индексов эпох и числовых значений.</h3>
 */
export type NumberTierValues = {
    [index in TierType]: number;
};

/**
 * <h3>Интерфейс для индексов по количеству игроков и числовых значений.</h3>
 */
export type NumberPlayersValues = {
    [index in NumPlayersType]: number;
};

/**
 * <h3>Интерфейс для значений очков карт.</h3>
 */
export type PointsValues = {
    readonly [index in NumPlayersWithBotType]: PointsValuesType;
};

/**
 * <h3>Интерфейс для публичных данных игрока.</h3>
 */
export interface IPublicPlayer {
    readonly nickname: string;
    readonly cards: SuitPropertyType<PlayerCardType[]>;
    readonly heroes: HeroCard[];
    readonly campCards: CampCreatureCommandZoneCardType[];
    readonly mythologicalCreatureCards: MythologicalCreatureCommandZoneCardType[];
    readonly handCoins: PublicPlayerCoinType[];
    readonly boardCoins: PublicPlayerCoinType[];
    readonly giantTokenSuits: SuitPropertyType<CanBeNullType<boolean>>;
    stack: Stack[];
    priority: IPriority;
    readonly buffs: PlayerBuffs[];
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
    // TODO value => PriorityValues!
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
    // TODO Coin values to type!
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
 * <h3>Интерфейс для конфига конкретной таверны.</h3>
 */
export interface ITavernInConfig {
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
export type TavernsConfigType = readonly [ITavernInConfig, ITavernInConfig, ITavernInConfig];

/**
 * <h3>Типы данных для количества всех игроков.</h3>
 */
export type NumPlayersType = 2 | ThreeOrFourOrFiveType;

/**
 * <h3>Типы данных для количества всех игроков.</h3>
 */
export type NumPlayersWithBotType = 5 | OneOrTwoOrThreeOrFour;

/**
 * <h3>Типы данных для конфига всех кристаллов.</h3>
 */
export type PrioritiesConfigType = readonly [IPriority[], IPriority[], IPriority[], IPriority[], IPriority[]];

/**
 * <h3>Типы данных для всех таверн.</h3>
 */
export type TavernsType = [CanBeNullType<DwarfDeckCardType>[], TavernAllCardType, CanBeNullType<DwarfDeckCardType>[]];

/**
 * <h3>Типы данных для базовых значений обмена монеты по артефакту 'Vidofnir Vedrfolnir'.</h3>
 */
export type BasicVidofnirVedrfolnirUpgradeValueType = 2 | 3 | 5;

export type AllHeroCardType = HeroCard | HeroPlayerCard;

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
export type MoveCardIdType = ICardId;

// TODO Rework to + Enlistment mercenaries names - string
/**
 * <h3>Типы данных для названий стеков.</h3>
 */
type StackNamesType = HeroNames | MultiSuitCardNames | string;

/**
 * <h3>Типы данных для карт Idavoll в командной зоне игрока.</h3>
 */
export type MythologicalCreatureCommandZoneCardType = GodCard | GiantCard | ValkyryCard;

/**
 * <h3>Типы данных для лагеря.</h3>
 */
export type CampCardType = CanBeNullType<CampDeckCardType>;

/**
 * <h3>Типы данных для карт колоды лагеря.</h3>
 */
export type CampDeckCardType = ArtefactCampCard | ArtefactPlayerCampCard | MercenaryCampCard;

/**
 * <h3>Типы данных для карт колоды лагеря в командной зоне игрока.</h3>
 */
export type CampCreatureCommandZoneCardType = ArtefactCampCard | MercenaryCampCard;

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
export type DwarfDeckCardType = DwarfCard | RoyalOfferingCard;

/**
 * <h3>Типы данных для карт колоды сброса.</h3>
 */
export type DiscardDeckCardType = DwarfDeckCardType;

/**
 * <h3>Типы данных для сброса карт лагеря.</h3>
 */
export type DiscardCampCardType = CampDeckCardType | MercenaryPlayerCampCard;

/**
 * <h3>Типы данных для карт со стеком.</h3>
 */
export type CardsHasStackType = HeroCard | ArtefactCampCard | RoyalOfferingCard | MythologicalCreatureCardType;

/**
 * <h3>Типы данных для карт для валидаторов добавления в стек.</h3>
 */
export type CardsHasStackValidatorsType = HeroCard | ArtefactCampCard;

/**
 * <h3>Типы данных для очков у карт.</h3>
 */
export type PointsType = number | number[];

// TODO Check and make normal numbers types!
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
export type ZeroOrOneType = 0 | 1;

/**
 * <h3>Типы данных для 0 | 1 | 2.</h3>
 */
export type ZeroOrOneOrTwoType = ZeroOrOneType | 2;

/**
 * <h3>Типы данных для 3 | 4 | 5.</h3>
 */
type ThreeOrFourOrFiveType = 3 | 4 | 5;

type TwoOrThreeOrFourOrFive = 2 | ThreeOrFourOrFiveType;

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
export type PlayerCardType = DwarfCard | SpecialCard | MultiSuitPlayerCard | ArtefactPlayerCampCard
    | HeroPlayerCard | MercenaryPlayerCampCard | MythicalAnimalCard;

/**
 * <h3>Объединение для всех карт колоды мифических существ.</h3>
 */
export type MythologicalCreatureCardType = GodCard | GiantCard | ValkyryCard | MythicalAnimalCard;

// TODO CanBeUndef<DeckCardType>[] and CanBeUndef<MythologicalCreatureDeckCardType>[]?
/**
 * <h3>Типы данных для карт таверн.</h3>
 */
export type TavernCardType = CanBeNullType<TavernCardWithExpansionType>;

// TODO CHECK TavernAllCardType & TavernCardType === same!?!??!?!
/**
* <h3>Тип для всех карт таверн.</h3>
*/
export type TavernAllCardType = CanBeNullType<DwarfDeckCardType>[] | CanBeNullType<MythologicalCreatureCardType>[];

/**
 * <h3>Типы данных для карт, которые должны быть в таверне.</h3>
 */
export type TavernCardWithExpansionType = DwarfDeckCardType | MythologicalCreatureCardType;

/**
 * <h3>Типы данных для карт, которые должны быть в таверне.</h3>
 */
export type TavernCardWithoutExpansionType = DwarfDeckCardType;

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
export type AllCardType = PlayerCardType | HeroCard | RoyalOfferingCard | MercenaryCampCard
    | ArtefactCampCard | MythologicalCreatureCardType;

/**
* <h3>Типы данных для значений очков карт.</h3>
*/
export type PointsValuesType = NumberTierValues | NumberArrayValuesType;

/**
 * <h3>Типы данных для конфигов монет.</h3>
 */
export type CoinConfigType = IMarketCoinConfig | InitialTradingCoinConfigType;

/**
 * <h3>Типы данных для массивов конфигов монет.</h3>
 */
export type CoinConfigArraysType = IMarketCoinConfig[] | InitialTradingCoinConfigType[];

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
    : T extends GodNames[] ? GodNames[]
    : T extends SoloGameAndvariStrategyNames[] ? SoloGameAndvariStrategyNames[]
    : T extends number[][] ? number[][]
    : T extends number[] ? number[]
    : T extends DwarfCard ? DwarfCard
    : T extends null ? null
    : never;

/**
 * <h3>Типы данных для валидаторов значений для мувов.</h3>
 */
export type MoveValidatorGetRangeType = MoveArgumentsType<Partial<SuitPropertyType<number[]>>>
    | MoveArgumentsType<IMoveCardsArguments>
    | MoveArgumentsType<IMoveCoinsArguments[]>
    | MoveArgumentsType<MoveValidatorGetRangeStringArrayType>
    | MoveArgumentsType<number[][]>
    | MoveArgumentsType<number[]>
    | MoveArgumentsType<DwarfCard>
    | MoveArgumentsType<null>;

export type MoveValidatorGetRangeStringArrayType = SuitNames[] | GodNames[] | SoloGameAndvariStrategyNames[];

/**
* <h3>Типы данных для типов аргументов мува.</h3>
*/
type MoveArgumentsArgsType = CanBeNullType<Partial<SuitPropertyType<number[]>> | IMoveCardsArguments | GodNames[]
    | IMoveCoinsArguments[] | SuitNames[] | SoloGameAndvariStrategyNames[] | number[][] | number[] | DwarfCard>;

/**
* <h3>Типы данных для валидации значений для мувов.</h3>
*/
export type ValidMoveIdParamType = CanBeNullType<DwarfCard | SuitNames | number[] | number | IMoveSuitCardCurrentId
    | MoveCardIdType | IMoveCoinsArguments | SoloGameAndvariStrategyNames | GodNames>;

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
 * <h3>Типы данных для типов свойств фракционных объектов.</h3>
 */
type SuitPropertyArgType =
    VariantType | DwarfCard | Distinctions | number[] | PlayerCardType[] | CanBeNullType<boolean> | MercenaryType;

/**
 * <h3>Типы данных для свойств фракционных объектов.</h3>
 */
export type SuitPropertyType<T extends SuitPropertyArgType> = {
    -readonly [Property in SuitNames]: T;
};

/**
 * <h3>Типы данных для всех имён мифологических существ.</h3>
 */
export type MythologicalCreatureNameType = GiantNames | GodNames | MythicalAnimalNames | ValkyryNames;

/**
 * <h3>Типы данных для остаточных аргументов функций.</h3>
 */
export type ArgsType = (CanBeNullType<CoinTypeNames | DwarfCard | SuitNames | GodNames | number
    | SoloGameAndvariStrategyNames>)[];

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
 * <h3>Типы данных для аргументов ошибок.</h3>
 */
export type ErrorArgsType = (string | number)[];

/**
 * <h3>Типы данных для аргументов мувов.</h3>
 */
export type MoveArgsType = [SoloGameAndvariStrategyNames] | number[][] | [SuitNames] | [number] | [SuitNames, number]
    | [number, CoinTypeNames] | [DwarfCard] | [GodNames];

/**
 * <h3>Типы данных для всех карт сброса.</h3>
 */
export type DiscardCardType =
    PlayerCardType | RoyalOfferingCard | ArtefactCampCard | MercenaryCampCard | MythologicalCreatureCardType;

/**
* <h3>Типы данных для карт, которые добавляются на стол игрока.</h3>
*/
export type AddCardToPlayerType = TavernCardWithExpansionType | MercenaryPlayerCampCard | SpecialCard
    | MultiSuitPlayerCard | ArtefactPlayerCampCard;

export type StackCardType = MercenaryCampCard | DwarfCard;

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
export type MercenaryType = BasicSuitableNonNullableCardInfo;

/**
 * <h3>Тип для варианта карты героя.</h3>
 */
export type VariantType = BasicSuitableNonNullableCardInfo;

/**
 * <h3>Тип для `INVALID_MOVE`.</h3>
 */
export type InvalidMoveType = `INVALID_MOVE`;

/**
 * <h3>Тип для текстового отображения названий стадии игры.</h3>
 */
export type StageNameTextType = StageRusNames | `none`;

export type MythologicalCreatureDecksType =
    readonly [MythologicalCreatureCardType[], MythologicalCreatureCardType[]];

// TODO Add Dwarf names to enum!
/**
 * <h3>Тип для названий карт для стилизации обычных карт на столе игрока.</h3>
 */
export type CardNamesForStylesType = SpecialCardNames | MultiSuitCardNames | string;

// TODO Fix it!
/**
 * <h3>Тип для подсчёта очков по положению токена силы валькирии.</h3>
 */
export type StrengthTokenNotchPointsType = readonly [number, number, number, number, number?];

/**
 * <h3>Тип для данных создания всех массивов карт героев.</h3>
 */
export type BuildHeroesArraysType = readonly [HeroCard[], CanBeNullType<HeroesForSoloGameArrayType>,
    CanBeNullType<HeroCard[]>, CanBeNullType<HeroesInitialForSoloGameForBotAndvariArrayType>];

/**
 * <h3>Тип для данных массива всех карт героев для стратегий соло бота Андвари в соло игре.</h3>
 */
export type HeroesForSoloGameForStrategyBotAndvariArrayType = [HeroCard, HeroCard, HeroCard, HeroCard, HeroCard];

/**
 * <h3>Тип для данных массива всех карт героев для соло бота.</h3>
 */
export type HeroesForSoloGameArrayType = readonly [HeroCard, HeroCard, HeroCard, HeroCard, HeroCard];

/**
 * <h3>Тип для данных массива всех карт мифических существ для Skymir.</h3>
 */
export type MythologicalCreatureCardsArrayType = [MythologicalCreatureCardType, MythologicalCreatureCardType,
    MythologicalCreatureCardType, MythologicalCreatureCardType?, MythologicalCreatureCardType?];

/**
 * <h3>Тип для данных массива всех карт лагеря.</h3>
 */
export type CampCardArrayType = [CanBeNullType<CampCardType>, CanBeNullType<CampCardType>,
    CanBeNullType<CampCardType>, CanBeNullType<CampCardType>, CanBeNullType<CampCardType>];

/**
 * <h3>Тип для данных массива всех карт героев для выбора уровня сложности для соло бота.</h3>
 */
export type HeroesInitialForSoloGameForBotAndvariArrayType = readonly
    [HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard];

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

export type SoloGameAndvariHeroesForPlayersConfigType = Pick<HeroConfig, `Astrid` | `Dwerg_Aesir` | `Dwerg_Bergelmir` | `Dwerg_Jungir` | `Dwerg_Sigmir` | `Dwerg_Ymir` | `Grid` | `Skaa` | `Thrud` | `Uline` | `Ylud`>;

/**
* <h3>Тип для конфига героев для соло бота для соло игры.</h3>
*/
export type SoloGameHeroesForBotConfigType =
    Pick<HeroConfig, `Dwerg_Aesir` | `Dwerg_Bergelmir` | `Dwerg_Jungir` | `Dwerg_Sigmir` | `Dwerg_Ymir`>;

/**
* <h3>Тип для конфига героев для игрока для соло игры.</h3>
*/
export type SoloGameHeroesForPlayerConfigType = Pick<HeroConfig, `Kraal` | `Tarah` | `Aral` | `Dagda` | `Lokdur`
    | `Zoral` | `Aegur` | `Bonfur` | `Hourya` | `Idunn`>;

/**
* <h3>Тип для ключ/значение по ключу объекта ctx.</h3>
*/
export type ObjectEntriesCtxType = [KeyofType<Ctx>, Ctx[KeyofType<Ctx>]];

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
 * <h3>Получение значений типов у пары [ключ, значение] при вызове Object.entries.</h3>
 */
export type ObjectEntriesTypesForKeyValue<T extends object> = {
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
    [phase in KeyofType<IMoveBy> as phase extends `default` ? never : phase]: PhaseConfig<phase>;
};

interface PhaseConfig<phase extends CanBeNullType<KeyofType<IMoveBy>> = null> {
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
            next: string;
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

interface TurnConfig<phase extends CanBeNullType<KeyofType<IMoveBy>> = null> {
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

type StageMap<phase extends CanBeNullType<KeyofType<IMoveBy>> = null> = {
    [key in KeyofType<IMoveBy[phase extends null ? `default` : phase]> as
    key extends `${DefaultStageNames}` ? never : key]: StageConfig;
};

interface StageConfig {
    moves?: MoveMap;
    next?: PhaseNames;
}

export interface Ctx {
    numPlayers: TwoOrThreeOrFourOrFive;
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
    [playerID: string]: ActiveStageNames;
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
