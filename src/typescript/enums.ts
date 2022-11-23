/**
 * <h3>Перечисление для названий режимов игры.</h3>
 */
export const enum GameModeNames {
    Basic = `Basic`,
    Multiplayer = `Multiplayer`,
    Solo = `Solo`,
    SoloAndvari = `Solo Andvari`,
}

/**
 * <h3>Перечисление для названий действий по получению преимущества по фракции.</h3>
 */
export const enum DistinctionAwardingFunctionNames {
    BlacksmithDistinctionAwarding = `BlacksmithDistinctionAwarding`,
    ExplorerDistinctionAwarding = `ExplorerDistinctionAwarding`,
    HunterDistinctionAwarding = `HunterDistinctionAwarding`,
    MinerDistinctionAwarding = `MinerDistinctionAwarding`,
    WarriorDistinctionAwarding = `WarriorDistinctionAwarding`,
}

/**
 * <h3>Перечисление для названий автоматических действий.</h3>
 */
export const enum AutoActionFunctionNames {
    AddMythologyCreatureCardsSkymirAction = `AddMythologyCardSkymirAction`,
    AddPickHeroAction = `AddPickHeroAction`,
    DiscardTradingCoinAction = `DiscardTradingCoinAction`,
    FinishOdroerirTheMythicCauldronAction = `FinishOdroerirTheMythicCauldronAction`,
    GetClosedCoinIntoPlayerHandAction = `GetClosedCoinIntoPlayerHandAction`,
    StartDiscardSuitCardAction = `StartDiscardSuitCardAction`,
    StartVidofnirVedrfolnirAction = `StartVidofnirVedrfolnirAction`,
    UpgradeMinCoinAction = `UpgradeMinCoinAction`,
}

/**
 * <h3>Перечисление для названий действий по получению победных очков по фракции дворфа.</h3>
 */
export const enum SuitScoringFunctionNames {
    BlacksmithScoring = `BlacksmithScoring`,
    ExplorerScoring = `ExplorerScoring`,
    HunterScoring = `HunterScoring`,
    MinerScoring = `MinerScoring`,
    WarriorScoring = `WarriorScoring`,
}

/**
 * <h3>Перечисление для названий действий по получению победных очков по артефакту.</h3>
 */
export const enum ArtefactScoringFunctionNames {
    BasicArtefactScoring = `BasicArtefactScoring`,
    DraupnirScoring = `DraupnirScoring`,
    HrafnsmerkiScoring = `HrafnsmerkiScoring`,
    MjollnirScoring = `MjollnirScoring`,
    OdroerirTheMythicCauldronScoring = `OdroerirTheMythicCauldronScoring`,
    SvalinnScoring = `SvalinnScoring`,
}

/**
 * <h3>Перечисление для названий действий по получению победных очков по герою.</h3>
 */
export const enum HeroScoringFunctionNames {
    BasicHeroScoring = `BasicHeroScoring`,
    AstridScoring = `AstridScoring`,
    IdunnScoring = `IdunnScoring`,
}

/**
 * <h3>Перечисление для названий действий по получению победных очков по мифическому животному.</h3>
 */
export const enum MythicalAnimalScoringFunctionNames {
    BasicMythicalAnimalScoring = `BasicMythicalAnimalScoring`,
    GarmScoring = `GarmScoring`,
    NidhoggScoring = `NidhoggScoring`,
}

/**
 * <h3>Перечисление для названий действий по получению победных очков по гиганту.</h3>
 */
export const enum GiantScoringFunctionNames {
    BasicGiantScoring = `BasicGiantScoring`,
    GymirScoring = `GymirScoring`,
    SurtScoring = `SurtScoring`,
}

/**
 * <h3>Перечисление для названий действий по получению победных очков по валькирии.</h3>
 */
export const enum ValkyryScoringFunctionNames {
    BrynhildrScoring = `BrynhildrScoring`,
    HildrScoring = `HildrScoring`,
    OlrunScoring = `OlrunScoring`,
    SigrdrifaScoring = `SigrdrifaScoring`,
    SvafaScoring = `SvafaScoring`,
}

/**
 * <h3>Перечисление для названий артефактов.</h3>
 */
export const enum ArtefactNames {
    Brisingamens = `Brisingamens`,
    Draupnir = `Draupnir`,
    Fafnir_Baleygr = `Fafnir_Baleygr`,
    Gjallarhorn = `Gjallarhorn`,
    Hofud = `Hofud`,
    Hrafnsmerki = `Hrafnsmerki`,
    Jarnglofi = `Jarnglofi`,
    Megingjord = `Megingjord`,
    Mjollnir = `Mjollnir`,
    Odroerir_The_Mythic_Cauldron = `Odroerir_The_Mythic_Cauldron`,
    Svalinn = `Svalinn`,
    Vegvisir = `Vegvisir`,
    Vidofnir_Vedrfolnir = `Vidofnir_Vedrfolnir`,
}

/**
 * <h3>Перечисление для русских названий артефактов.</h3>
 */
export const enum RusArtefactNames {
    Brisingamens = `Брисингамен`,
    Draupnir = `Драупнир`,
    Fafnir_Baleygr = `Фафнир Баулейгр`,
    Gjallarhorn = `Гьяллархорн`,
    Hofud = `Хёфуд`,
    Hrafnsmerki = `Храфнсмерки`,
    Jarnglofi = `Ярнгрейпр`,
    Megingjord = `Мегингьорд`,
    Mjollnir = `Мьёлльнир`,
    Odroerir_The_Mythic_Cauldron = `Одрерир, мифический котел`,
    Svalinn = `Свалинн`,
    Vegvisir = `Вегвисир`,
    Vidofnir_Vedrfolnir = `Видофнир и Ведрфёльнир`,
}

/**
 * <h3>Перечисление для общих бафов в конфиге.</h3>
 */
export const enum BuffNames {
    HasOneNotCountHero = `hasOneNotCountHero`,
    SuitIdForMjollnir = `suitIdForMjollnir`,
    SuitIdForOlrun = `suitIdForOlrun`,
}

/**
 * <h3>Перечисление для названия бафов карт Лагеря в конфиге.</h3>
 */
export const enum CampBuffNames {
    DiscardCardEndGame = `discardCardEndGame`,
    GetMjollnirProfit = `getMjollnirProfit`,
    GoCamp = `goCamp`,
    NoHero = `noHero`,
}

/**
 * <h3>Перечисление для названия бафов Героев в конфиге.</h3>
 */
export const enum HeroBuffNames {
    EndTier = `endTier`,
    EveryTurn = `everyTurn`,
    GoCampOneTime = `goCampOneTime`,
    MoveThrud = `moveThrud`,
    UpgradeCoin = `upgradeCoin`,
    UpgradeNextCoin = `upgradeNextCoin`,
}

/**
 * <h3>Перечисление для названия бафов Гигантов в конфиге.</h3>
 */
export const enum GiantBuffNames {
    PlayerHasActiveGiantGymir = `playerHasActiveGiantGymir`,
    PlayerHasActiveGiantHrungnir = `playerHasActiveGiantHrungnir`,
    PlayerHasActiveGiantSkymir = `playerHasActiveGiantSkymir`,
    PlayerHasActiveGiantSurt = `playerHasActiveGiantSurt`,
    PlayerHasActiveGiantThrivaldi = `playerHasActiveGiantThrivaldi`,
}

/**
 * <h3>Перечисление для названия бафов Мистических животных в конфиге.</h3>
 */
export const enum MythicalAnimalBuffNames {
    DagdaDiscardOnlyOneCards = `dagdaDiscardOnlyOneCards`,
    ExplorerDistinctionGetSixCards = `explorerDistinctionGetSixCards`,
    RatatoskFinalScoring = `ratatoskFinalScoring`,
}

/**
 * <h3>Перечисление для названия бафов Валькирий в конфиге.</h3>
 */
export const enum ValkyryBuffNames {
    CountBettermentAmount = `countBettermentAmount`,
    CountBidWinnerAmount = `countBidWinnerAmount`,
    CountDistinctionAmount = `countDistinctionAmount`,
    CountPickedCardClassRankAmount = `countPickedCardClassRankAmount`,
    CountPickedHeroAmount = `countPickedHeroAmount`,
}

/**
 * <h3>Перечисление для названия кнопок.</h3>
 */
export const enum ButtonNames {
    NoHeroEasyStrategy = `Без стартовых героев (лёгкая стратегия)`,
    NoHeroHardStrategy = `Без стартовых героев (сложная стратегия)`,
    WithHeroEasyStrategy = `Со стартовыми героями (лёгкая стратегия)`,
    WithHeroHardStrategy = `Со стартовыми героями (сложная стратегия)`,
    Pass = `Пас`,
    Start = `Старт`,
}

/**
 * <h3>Перечисление для названия мультифракционных карт.</h3>
 */
export const enum MultiSuitCardNames {
    Gullinbursti = `Gullinbursti`,
    OlwinsDouble = `OlwinsDouble`,
}

/**
 * <h3>Перечисление для русских названий мультифракционных карт.</h3>
 */
export const enum RusMultiSuitCardNames {
    Gullinbursti = `Гуллинбурсти`,
    OlwinsDouble = `Двойник Ольвюна`,
}

/**
 * <h3>Перечисление для названия особых карт.</h3>
 */
export const enum SpecialCardNames {
    ChiefBlacksmith = `ChiefBlacksmith`,
}

/**
 * <h3>Перечисление для русских названий особых карт.</h3>
 */
export const enum RusSpecialCardNames {
    ChiefBlacksmith = `Главный кузнец`,
}

/**
 * <h3>Перечисление для названия типов монет.</h3>
 */
export const enum CoinTypeNames {
    Hand = `Рука`,
    Board = `Стол`,
}

/**
 * <h3>Перечисление для названия отображения действий в конфиге.</h3>
 */
export const enum ConfigNames {
    ActivateGiantAbilityOrPickCard = `ActivateGiantAbilityOrPickCard`,
    ChooseGetMythologyCard = `ChooseGetMythologyCard`,
    ChooseCoinValueForVidofnirVedrfolnirUpgrade = `ChooseCoinValueForVidofnirVedrfolnirUpgrade`,
    ChooseStrategyLevelForSoloModeAndvari = `ChooseStrategyLevelForSoloModeAndvari`,
    ChooseStrategyVariantLevelForSoloModeAndvari = `ChooseStrategyVariantLevelForSoloModeAndvari`,
    ExplorerDistinction = `ExplorerDistinction`,
    GetDifficultyLevelForSoloMode = `GetDifficultyLevelForSoloMode`,
    GetHeroesForSoloMode = `GetHeroesForSoloMode`,
    StartOrPassEnlistmentMercenaries = `StartOrPassEnlistmentMercenaries`,
}

/**
 * <h3>Перечисление для описаний отображения действий.</h3>
 */
export const enum DrawNames {
    // TODO Give normal names to all?!
    ActivateGiantAbilityOrPickCard = `Activate Giant ability or pick card`,
    AddCoinToPouchVidofnirVedrfolnir = `Add coin to pouch Vidofnir Vedrfolnir`,
    Andumia = `Andumia`,
    Bonfur = `Bonfur`,
    Brisingamens = `Brisingamens`,
    BrisingamensEndGame = `Brisingamens end game`,
    ChooseSuitOlrun = `Choose suit Olrun`,
    ChooseStrategyLevelForSoloModeAndvari = `Choose strategy level for solo mode Andvari`,
    ChooseStrategyVariantLevelForSoloModeAndvari = `Choose strategy variant level for solo mode Andvari`,
    CrovaxTheDoppelganger = `Crovax the Doppelganger`,
    Dagda = `Dagda`,
    DiscardTavernCard = `Discard tavern card`,
    EnlistmentMercenaries = `Enlistment Mercenaries`,
    Mjollnir = `Mjollnir`,
    GetDifficultyLevelForSoloMode = `Get difficulty level for Solo mode`,
    GetMythologyCardSkymir = `Get Mythology card Skymir`,
    GetHeroesForSoloMode = `Get heroes for Solo mode`,
    GetMjollnirProfit = `Get Mjollnir profit`,
    Hofud = `Hofud`,
    Holda = `Holda`,
    PlaceMultiSuitsCards = `Place multi suits cards`,
    PickCard = `Pick card or camp card`,
    PickCardSoloBot = `Pick card or camp card Solo Bot`,
    PickCardSoloBotAndvari = `Pick card or camp card Solo Bot Andvari`,
    PickCardByExplorerDistinction = `Pick card by Explorer distinction`,
    PickCardByExplorerDistinctionSoloBot = `Pick card by Explorer distinction Solo Bot`,
    PickCardByExplorerDistinctionSoloBotAndvari = `Pick card by Explorer distinction Solo Bot Andvari`,
    PickConcreteCoinToUpgrade = `Pick concrete coin to upgrade`,
    PickHero = `Pick hero card`,
    PickHeroSoloBot = `Pick hero card Solo Bot`,
    PickHeroSoloBotAndvari = `Pick hero card Solo Bot Andvari`,
    PlaceEnlistmentMercenaries = `Place Enlistment Mercenaries`,
    PlaceTradingCoinsUline = `Place Trading Coins Uline`,
    PlaceYludHero = `Place Ylud`,
    PlaceYludHeroSoloBot = `Place Ylud Solo Bot`,
    PlaceYludHeroSoloBotAndvari = `Place Ylud Solo Bot Andvari`,
    StartChooseCoinValueForVidofnirVedrfolnirUpgrade = `Start choose coin value for Vidofnir Vedrfolnir upgrade`,
    StartOrPassEnlistmentMercenaries = `Start or Pass Enlistment Mercenaries`,
    PlaceThrudHero = `Place Thrud Hero`,
    PlaceThrudHeroSoloBot = `Place Thrud Hero Solo Bot`,
    PlaceThrudHeroSoloBotAndvari = `Place Thrud Hero Solo Bot Andvari`,
    StartAddPlusTwoValueToAllCoinsUline = `Start add plus two value to all coins Uline`,
    UpgradeCoin = `Upgrade coin`,
    UpgradeCoinSoloBot = `Upgrade coin Solo Bot`,
    UpgradeCoinSoloBotAndvari = `Upgrade coin Solo Bot Andvari`,
    UpgradeCoinVidofnirVedrfolnir = `Upgrade coin Vidofnir Vedrfolnir`,
    UpgradeCoinWarriorDistinction = `Upgrade coin Warrior distinction`,
    UpgradeCoinWarriorDistinctionSoloBot = `Upgrade coin Warrior distinction Solo Bot`,
    UpgradeCoinWarriorDistinctionSoloBotAndvari = `Upgrade coin Warrior distinction Solo Bot Andvari`,
}

/**
 * <h3>Перечисление для названий ошибок.</h3>
 */
export const enum ErrorNames {
    CurrentMoveArgumentIsUndefined = `CurrentMoveArgumentIsUndefined`,
    CurrentTierDeckIsUndefined = `CurrentTierDeckIsUndefined`,
    CurrentPrivatePlayerIsUndefined = `CurrentPrivatePlayerIsUndefined`,
    CurrentPublicPlayerIsUndefined = `CurrentPublicPlayerIsUndefined`,
    CurrentSuitDistinctionPlayerIndexIsUndefined = `CurrentSuitDistinctionPlayerIndexIsUndefined`,
    DeckIsUndefined = `DeckIsUndefined`,
    DoNotDiscardCardFromCurrentTavernIfCardWithCurrentIdIsUndefined =
    `DoNotDiscardCardFromCurrentTavernIfCardWithCurrentIdIsUndefined`,
    DoNotDiscardCardFromCurrentTavernIfNoCardInTavern = `DoNotDiscardCardFromCurrentTavernIfNoCardInTavern`,
    DoNotDiscardCardFromTavernInSoloOrTwoPlayersGame = `DoNotDiscardCardFromTavernInSoloOrTwoPlayersGame`,
    FirstStackActionIsUndefined = `FirstStackActionIsUndefined`,
    FunctionParamIsUndefined = `FunctionParamIsUndefined`,
    NoCardsToDiscardWhenNoWinnerInExplorerDistinction = `NoCardsToDiscardWhenNoWinnerInExplorerDistinction`,
    OnlyInSoloOrTwoPlayersGame = `OnlyInSoloOrTwoPlayersGame`,
    PlayersCurrentSuitCardsMustHaveCardsForDistinction = `PlayersCurrentSuitCardsMustHaveCardsForDistinction`,
    PlayersCurrentSuitRanksArrayMustHavePlayerWithMostRankCount =
    `PlayersCurrentSuitRanksArrayMustHavePlayerWithMostRankCount`,
    PrivatePlayerWithCurrentIdIsUndefined = `PrivatePlayerWithCurrentIdIsUndefined`,
    PublicPlayerWithCurrentIdIsUndefined = `PublicPlayerWithCurrentIdIsUndefined`,
    SuitDistinctionMustBePresent = `SuitDistinctionMustBePresent`,
    TavernCanNotBeRefilledBecauseNotEnoughCards = `TavernCanNotBeRefilledBecauseNotEnoughCards`,
}

/**
 * <h3>Перечисление для названия игры и дополнений.</h3>
 */
export const enum GameNames {
    Basic = `Basic`,
    Idavoll = `Idavoll`,
    Thingvellir = `Thingvellir`,
}

/**
 * <h3>Перечисление для названия Гигантов.</h3>
 */
export const enum GiantNames {
    Gymir = `Gymir`,
    Hrungnir = `Hrungnir`,
    Skymir = `Skymir`,
    Surt = `Surt`,
    Thrivaldi = `Thrivaldi`,
}

/**
 * <h3>Перечисление для русских названия Гигантов.</h3>
 */
export const enum RusGiantNames {
    Gymir = `Гюмир`,
    Hrungnir = `Грунгнир`,
    Skymir = `Скаймир`,
    Surt = `Сурт`,
    Thrivaldi = `Тривальди`,
}

/**
 * <h3>Перечисление для названия Богов.</h3>
 */
export const enum GodNames {
    Freyja = `Freyja`,
    Frigg = `Frigg`,
    Loki = `Loki`,
    Odin = `Odin`,
    Thor = `Thor`,
}

/**
 * <h3>Перечисление для русских названий Богов.</h3>
 */
export const enum RusGodNames {
    Freyja = `Фрейя`,
    Frigg = `Фригг`,
    Loki = `Локи`,
    Odin = `Один`,
    Thor = `Тор`,
}

/**
 * <h3>Перечисление для названия Мифических животных.</h3>
 */
export const enum MythicalAnimalNames {
    Durathor = `Durathor`,
    Garm = `Garm`,
    Hraesvelg = `Hraesvelg`,
    Nidhogg = `Nidhogg`,
    Ratatosk = `Ratatosk`,
}

/**
 * <h3>Перечисление для русских названий Мифических животных.</h3>
 */
export const enum RusMythicalAnimalNames {
    Durathor = `Дуратор`,
    Garm = `Гарм`,
    Hraesvelg = `Хрэсвелг`,
    Nidhogg = `Нидхогг`,
    Ratatosk = `Рататоск`,
}

/**
 * <h3>Перечисление для названия Мифических животных.</h3>
 */
export const enum ValkyryNames {
    Brynhildr = `Brynhildr`,
    Hildr = `Hildr`,
    Olrun = `Olrun`,
    Sigrdrifa = `Sigrdrifa`,
    Svafa = `Svafa`,
}

/**
 * <h3>Перечисление для русских названия Мифических животных.</h3>
 */
export const enum RusValkyryNames {
    Brynhildr = `Брюнхильда`,
    Hildr = `Хильд`,
    Olrun = `Ольрун`,
    Sigrdrifa = `Сигрдрива`,
    Svafa = `Свава`,
}

/**
 * <h3>Перечисление для названий героев.</h3>
 */
export const enum HeroNames {
    Aegur = `Aegur`,
    Andumia = `Andumia`,
    Aral = `Aral`,
    Astrid = `Astrid`,
    Bonfur = `Bonfur`,
    Crovax_The_Doppelganger = `Crovax_The_Doppelganger`,
    Dagda = `Dagda`,
    Dwerg_Aesir = `Dwerg_Aesir`,
    Dwerg_Bergelmir = `Dwerg_Bergelmir`,
    Dwerg_Jungir = `Dwerg_Jungir`,
    Dwerg_Sigmir = `Dwerg_Sigmir`,
    Dwerg_Ymir = `Dwerg_Ymir`,
    Grid = `Grid`,
    Holda = `Holda`,
    Hourya = `Hourya`,
    Idunn = `Idunn`,
    Jarika = `Jarika`,
    Khrad = `Khrad`,
    Kraal = `Kraal`,
    Lokdur = `Lokdur`,
    Olwin = `Olwin`,
    Skaa = `Skaa`,
    Tarah = `Tarah`,
    Thrud = `Thrud`,
    Uline = `Uline`,
    Ylud = `Ylud`,
    Zolkur = `Zolkur`,
    Zoral = `Zoral`,
}

/**
 * <h3>Перечисление для русских названий героев.</h3>
 */
export const enum RusHeroNames {
    Aegur = `Эгур Стальной кулак`,
    Andumia = `Аннумия Некромант`,
    Aral = `Арал Орлиный коготь`,
    Astrid = `Астрид Богатая`,
    Bonfur = `Бонфур Жестокий`,
    Crovax_The_Doppelganger = `Кровакс Двойник`,
    Dagda = `Дагда Вспыльчивая`,
    Dwerg_Aesir = `Дверг Эсир`,
    Dwerg_Bergelmir = `Дверг Бергельмир`,
    Dwerg_Jungir = `Дверг Юмгир`,
    Dwerg_Sigmir = `Дверг Сигмир`,
    Dwerg_Ymir = `Дверг Имир`,
    Grid = `Грид Расчётливая`,
    Holda = `Хольда Менестрель`,
    Hourya = `Хурия Неуловимая`,
    Idunn = `Идунн Незаметная`,
    Jarika = `Ярика Шельма`,
    Khrad = `Крад Плут`,
    Kraal = `Крол Наёмник`,
    Lokdur = `Локдур Корыстолюбивый`,
    Olwin = `Ольвюн Многоликий`,
    Skaa = `Ско Непостижимая`,
    Tarah = `Тара Смертоносная`,
    Thrud = `Труд Охотница за головами`,
    Uline = `Улина Ясновидящая`,
    Ylud = `Илуд Непредсказуемая`,
    Zolkur = `Солькур Жадный`,
    Zoral = `Зорал Мастер`,
}

/**
 * <h3>Перечисление для типов логов.</h3>
 */
export const enum LogTypeNames {
    Game = `Game`,
    Private = `Private`,
    Public = `Public`,
}

/**
 * <h3>Перечисление для описаний отображения действий на кнопках.</h3>
 */
export const enum ButtonMoveNames {
    PassEnlistmentMercenariesMove = `PassEnlistmentMercenariesMove`,
    StartEnlistmentMercenariesMove = `StartEnlistmentMercenariesMove`,
    // start
    ChooseCoinValueForVidofnirVedrfolnirUpgradeMove = `ChooseCoinValueForVidofnirVedrfolnirUpgradeMove`,
    // Solo Mode
    ChooseDifficultyLevelForSoloModeMove = `ChooseDifficultyLevelForSoloModeMove`,
    // Solo Mode Andvari
    ChooseStrategyForSoloModeAndvariMove = `ChooseStrategyForSoloModeAndvariMove`,
    ChooseStrategyVariantForSoloModeAndvariMove = `ChooseStrategyVariantForSoloModeAndvariMove`,
}

/**
 * <h3>Перечисление для описаний отображения действий на картах.</h3>
 */
export const enum CardMoveNames {
    ClickCardNotGiantAbilityMove = `ClickCardNoyGiantAbilityMove`,
    ClickGiantAbilityNotCardMove = `ClickGiantAbilityNotCardMove`,
    ClickCardMove = `ClickCardMove`,
    ClickCardToPickDistinctionMove = `ClickCardToPickDistinctionMove`,
    ClickCampCardMove = `ClickCampCardMove`,
    ClickDistinctionCardMove = `ClickDistinctionCardMove`,
    DiscardCardFromPlayerBoardMove = `DiscardCardFromPlayerBoardMove`,
    GetEnlistmentMercenariesMove = `GetEnlistmentMercenariesMove`,
    GetMythologyCardMove = `GetMythologyCardMove`,
    // start
    ClickCampCardHoldaMove = `ClickCampCardHoldaMove`,
    ClickHeroCardMove = `ClickHeroCardMove`,
    DiscardCardMove = `DiscardCardMove`,
    DiscardCard2PlayersMove = `DiscardCard2PlayersMove`,
    DiscardSuitCardFromPlayerBoardMove = `DiscardSuitCardFromPlayerBoardMove`,
    PickDiscardCardMove = `PickDiscardCardMove`,
    // Solo Mode
    ChooseHeroForDifficultySoloModeMove = `ChooseHeroForDifficultySoloModeMove`,
    // Solo Bot
    SoloBotClickCardMove = `SoloBotClickCardMove`,
    SoloBotClickHeroCardMove = `SoloBotClickHeroCardMove`,
    SoloBotClickCardToPickDistinctionMove = `SoloBotClickCardToPickDistinctionMove`,
    // Solo Bot Andvari
    SoloBotAndvariClickCardMove = `SoloBotAndvariClickCardMove`,
    SoloBotAndvariClickHeroCardMove = `SoloBotAndvariClickHeroCardMove`,
    SoloBotAndvariClickCardToPickDistinctionMove = `SoloBotAndvariClickCardToPickDistinctionMove`,
}

/**
 * <h3>Перечисление для описаний отображения действий на монетах.</h3>
 */
export const enum CoinMoveNames {
    ClickBoardCoinMove = `ClickBoardCoinMove`,
    ChooseCoinValueForHrungnirUpgradeMove = `ChooseCoinValueForHrungnirUpgradeMove`,
    ClickHandCoinMove = `ClickHandCoinMove`,
    ClickHandCoinUlineMove = `ClickHandCoinUlineMove`,
    ClickHandTradingCoinUlineMove = `ClickHandTradingCoinUlineMove`,
    // Start
    AddCoinToPouchMove = `AddCoinToPouchMove`,
    ClickCoinToUpgradeMove = `ClickCoinToUpgradeMove`,
    ClickConcreteCoinToUpgradeMove = `ClickConcreteCoinToUpgradeMove`,
    UpgradeCoinVidofnirVedrfolnirMove = `UpgradeCoinVidofnirVedrfolnirMove`,
    // Solo Bot
    SoloBotClickCoinToUpgradeMove = `SoloBotClickCoinToUpgradeMove`,
    // Solo Bot Andvari
    SoloBotAndvariClickCoinToUpgradeMove = `SoloBotAndvariClickCoinToUpgradeMove`,
}

/**
 * <h3>Перечисление для описаний отображения действий на пустых ячейках для карт.</h3>
 */
export const enum EmptyCardMoveNames {
    PlaceEnlistmentMercenariesMove = `PlaceEnlistmentMercenariesMove`,
    PlaceYludHeroMove = `PlaceYludHeroMove`,
    // Start
    PlaceMultiSuitCardMove = `PlaceMultiSuitCardMove`,
    PlaceThrudHeroMove = `PlaceThrudHeroMove`,
    // Solo Bot
    SoloBotPlaceThrudHeroMove = `SoloBotPlaceThrudHeroMove`,
    SoloBotPlaceYludHeroMove = `SoloBotPlaceYludHeroMove`,
    // Solo Bot Andvari
    SoloBotAndvariPlaceThrudHeroMove = `SoloBotAndvariPlaceThrudHeroMove`,
    SoloBotAndvariPlaceYludHeroMove = `SoloBotAndvariPlaceYludHeroMove`,
}

/**
 * <h3>Перечисление для описаний отображения действий на фракциях дворфов.</h3>
 */
export const enum SuitMoveNames {
    ChooseSuitOlrunMove = `ChooseSuitOlrunMove`,
    GetMjollnirProfitMove = `GetMjollnirProfitMove`,
}

/**
 * <h3>Перечисление для описаний отображения действий.</h3>
 */
export const enum AutoBotsMoveNames {
    // Bots
    BotsPlaceAllCoinsMove = `BotsPlaceAllCoinsMove`,
    // Solo Bot
    SoloBotPlaceAllCoinsMove = `SoloBotPlaceAllCoinsMove`,
    //Solo Bot Andvari
    SoloBotAndvariPlaceAllCoinsMove = `SoloBotAndvariPlaceAllCoinsMove`,
}

/**
 * <h3>Перечисление для фаз игры.</h3>
 */
export const enum PhaseNames {
    Bids = `Bids`,
    BidUline = `BidUline`,
    BrisingamensEndGame = `BrisingamensEndGame`,
    ChooseDifficultySoloMode = `ChooseDifficultySoloMode`,
    ChooseDifficultySoloModeAndvari = `ChooseDifficultySoloModeAndvari`,
    EnlistmentMercenaries = `EnlistmentMercenaries`,
    GetMjollnirProfit = `GetMjollnirProfit`,
    PlaceYlud = `PlaceYlud`,
    TavernsResolution = `TavernsResolution`,
    TroopEvaluation = `TroopEvaluation`,
}

/**
 * <h3>Перечисление для фаз игры на русском.</h3>
 */
export enum RusPhaseNames {
    Bids = `Ставки`,
    BidUline = `Ставки Улина`,
    BrisingamensEndGame = `BrisingamensEndGame`,
    ChooseDifficultySoloMode = `Выбор сложности соло режима`,
    ChooseDifficultySoloModeAndvari = `Выбор сложности соло режима Андвари`,
    EnlistmentMercenaries = `enlistmentMercenaries`,
    GetMjollnirProfit = `getMjollnirProfit`,
    PlaceYlud = `Поместить Илуд`,
    TavernsResolution = `Посещение таверн`,
    TroopEvaluation = `Смотр войск`,
}

// TODO Add `card` to = card description `Карта 'Королевская награда'`?
/**
 * <h3>Перечисление для типов карт на русском.</h3>
 */
export const enum RusCardTypeNames {
    Royal_Offering_Card = `Королевская награда`,
    Artefact_Card = `Артефакт`,
    Artefact_Player_Card = `Артефакт на поле игрока`,
    Dwarf_Card = `Дворф`,
    Giant_Card = `Гигант`,
    God_Card = `Бог`,
    Hero_Card = `Герой`,
    Hero_Player_Card = `Герой на поле игрока`,
    Mercenary_Card = `Наёмник`,
    Mercenary_Player_Card = `Наёмник на поле игрока`,
    Multi_Suit_Card = `Мультифракционная`,
    Multi_Suit_Player_Card = `Мультифракционная карта на поле игрока`,
    Mythical_Animal_Card = `Мифическое животное`,
    Special_Card = `Особая`,
    Valkyry_Card = `Валькирия`,
    // Common
    Player_Board_Card = `Карта на поле игрока`,
    Command_Zone_Hero_Card = `Карта героя в командной зоне игрока`,
    Command_Zone_Camp_Card = `Карта лагеря в командной зоне игрока`,
    Command_Zone_Mythological_Creature_Card = `Карта мифического существа в командной зоне игрока`,
}

/**
 * <h3>Перечисление для русских названий фракций.</h3>
 */
export enum RusSuitNames {
    blacksmith = `Кузнецы`,
    explorer = `Разведчики`,
    hunter = `Охотники`,
    miner = `Горняки`,
    warrior = `Воины`,
}

/**
 * <h3>Перечисление для типов мувов.</h3>
 */
export const enum MoveTypeNames {
    default = `default`,
    clickCardNotGiantAbilityMove = `clickCardNotGiantAbilityMove`,
    clickGiantAbilityNotCardMove = `clickGiantAbilityNotCardMove`,
}

/**
 * <h3>Перечисление для дефолтных стадий игры `chooseDifficultySoloMode`.</h3>
 */
export const enum ChooseDifficultySoloModeDefaultStageNames {
    ChooseDifficultyLevelForSoloMode = `ChooseDifficultyLevelForSoloMode`,
}

/**
 * <h3>Перечисление для стадий игры `chooseDifficultySoloMode`.</h3>
 */
export const enum ChooseDifficultySoloModeStageNames {
    ChooseHeroesForSoloMode = `ChooseHeroesForSoloMode`,
    // TODO Rework in Common
    UpgradeCoinSoloBot = `UpgradeCoinSoloBot`,
}

/**
 * <h3>Перечисление для дефолтных стадий игры `chooseDifficultySoloModeAndvari`.</h3>
 */
export const enum ChooseDifficultySoloModeAndvariDefaultStageNames {
    ChooseStrategyVariantForSoloModeAndvari = `ChooseStrategyVariantForSoloModeAndvari`,
    ChooseStrategyForSoloModeAndvari = `ChooseStrategyForSoloModeAndvari`,
}

/**
 * <h3>Перечисление для дефолтных стадий игры `bids`.</h3>
 */
export const enum BidsDefaultStageNames {
    ClickHandCoin = `ClickHandCoin`,
    ClickBoardCoin = `ClickBoardCoin`,
    BotsPlaceAllCoins = `BotsPlaceAllCoins`,
    SoloBotPlaceAllCoins = `SoloBotPlaceAllCoins`,
    SoloBotAndvariPlaceAllCoins = `SoloBotAndvariPlaceAllCoins`,
}

/**
 * <h3>Перечисление для дефолтных стадий игры `bidUline`.</h3>
 */
export const enum BidUlineDefaultStageNames {
    ClickHandCoinUline = `ClickHandCoinUline`,
}

/**
 * <h3>Перечисление для стадий игры `brisingamensEndGame`.</h3>
 */
export const enum BrisingamensEndGameDefaultStageNames {
    DiscardCardFromPlayerBoard = `DiscardCardFromPlayerBoard`,
}

/**
 * <h3>Перечисление для стадий игры `getMjollnirProfit`.</h3>
 */
export const enum GetMjollnirProfitDefaultStageNames {
    GetMjollnirProfit = `GetMjollnirProfit`,
}

/**
 * <h3>Перечисление для дефолтных стадий игры `enlistmentMercenaries`.</h3>
 */
export const enum EnlistmentMercenariesDefaultStageNames {
    StartEnlistmentMercenaries = `StartEnlistmentMercenaries`,
    PassEnlistmentMercenaries = `PassEnlistmentMercenaries`,
    GetEnlistmentMercenaries = `GetEnlistmentMercenaries`,
}

/**
 * <h3>Перечисление для стадий игры `enlistmentMercenaries`.</h3>
 */
export const enum EnlistmentMercenariesStageNames {
    PlaceEnlistmentMercenaries = `PlaceEnlistmentMercenaries`,
}

/**
 * <h3>Перечисление для стадий игры `placeYlud`.</h3>
 */
export const enum PlaceYludDefaultStageNames {
    PlaceYludHero = `PlaceYludHero`,
    SoloBotPlaceYludHero = `SoloBotPlaceYludHero`,
    SoloBotAndvariPlaceYludHero = `SoloBotAndvariPlaceYludHero`,
}

/**
 * <h3>Перечисление для дефолтных стадий игры `troopEvaluation`.</h3>
 */
export const enum TroopEvaluationDefaultStageNames {
    ClickDistinctionCard = `ClickDistinctionCard`,
}

/**
 * <h3>Перечисление для стадий игры `troopEvaluation`.</h3>
 */
export const enum TroopEvaluationStageNames {
    PickDistinctionCard = `PickDistinctionCard`,
    PickDistinctionCardSoloBot = `PickDistinctionCardSoloBot`,
    PickDistinctionCardSoloBotAndvari = `PickDistinctionCardSoloBotAndvari`,
}

/**
 * <h3>Перечисление для дефолтных стадий игры `tavernsResolution`.</h3>
 */
export const enum TavernsResolutionDefaultStageNames {
    ClickCard = `ClickCard`,
    ClickCampCard = `ClickCampCard`,
    SoloBotClickCard = `SoloBotClickCard`,
    SoloBotAndvariClickCard = `SoloBotAndvariClickCard`,
}

/**
 * <h3>Перечисление для стадий игры `tavernsResolution`.</h3>
 */
export const enum TavernsResolutionStageNames {
    ActivateGiantAbilityOrPickCard = `ActivateGiantAbilityOrPickCard`,
    ChooseCoinValueForHrungnirUpgrade = `ChooseCoinValueForHrungnirUpgrade`,
    ChooseSuitOlrun = `ChooseSuitOlrun`,
    DiscardCard = `DiscardCard`,
    GetMythologyCard = `GetMythologyCard`,
    PlaceTradingCoinsUline = `PlaceTradingCoinsUline`,
}

/**
 * <h3>Перечисление для общих стадий игры `SoloBotCommon`.</h3>
 */
export const enum SoloBotCommonStageNames {
    PickHeroSoloBot = `PickHeroSoloBot`,
    PlaceThrudHeroSoloBot = `PlaceThrudHeroSoloBot`,
    UpgradeCoinSoloBot = `UpgradeCoinSoloBot`,
}

/**
 * <h3>Перечисление для общих стадий игры `SoloBotAndvariCommon`.</h3>
 */
export const enum SoloBotAndvariCommonStageNames {
    PickHeroSoloBotAndvari = `PickHeroSoloBotAndvari`,
    PlaceThrudHeroSoloBotAndvari = `PlaceThrudHeroSoloBotAndvari`,
    UpgradeCoinSoloBotAndvari = `UpgradeCoinSoloBotAndvari`,
}

/**
 * <h3>Перечисление для общих стадий игры `Common`.</h3>
 */
export const enum CommonStageNames {
    AddCoinToPouch = `AddCoinToPouch`,
    ChooseCoinValueForVidofnirVedrfolnirUpgrade = `ChooseCoinValueForVidofnirVedrfolnirUpgrade`,
    DiscardBoardCard = `DiscardBoardCard`,
    DiscardSuitCard = `DiscardSuitCard`,
    PickCampCardHolda = `PickCampCardHolda`,
    PickConcreteCoinToUpgrade = `PickConcreteCoinToUpgrade`,
    PickDiscardCard = `PickDiscardCard`,
    PickHero = `PickHero`,
    PlaceMultiSuitsCards = `PlaceMultiSuitsCards`,
    PlaceThrudHero = `PlaceThrudHero`,
    UpgradeCoin = `UpgradeCoin`,
    UpgradeVidofnirVedrfolnirCoin = `UpgradeVidofnirVedrfolnirCoin`,
}

/**
 * <h3>Перечисление для русских названий стадий игры.</h3>
 */
export enum RusStageNames {
    ActivateGiantAbilityOrPickCard = `ActivateGiantAbilityOrPickCard`,
    AddCoinToPouch = `AddCoinToPouch`,
    ChooseSuitOlrun = `ChooseSuitOlrun`,
    ChooseCoinValueForVidofnirVedrfolnirUpgrade = `ChooseCoinValueForVidofnirVedrfolnirUpgrade`,
    ChooseHeroesForSoloMode = `ChooseHeroesForSoloMode`,
    ChooseCoinValueForHrungnirUpgrade = `ChooseCoinValueForHrungnirUpgrade`,
    DiscardCard = `DiscardCard`,
    DiscardBoardCard = `DiscardBoardCard`,
    DiscardSuitCard = `DiscardSuitCard`,
    GetMythologyCard = `GetMythologyCard`,
    PickCampCardHolda = `PickCampCardHolda`,
    PickConcreteCoinToUpgrade = `PickConcreteCoinToUpgrade`,
    PickDiscardCard = `PickDiscardCard`,
    PickDistinctionCard = `PickDistinctionCard`,
    PickDistinctionCardSoloBot = `PickDistinctionCardSoloBot`,
    PickDistinctionCardSoloBotAndvari = `PickDistinctionCardSoloBotAndvari`,
    PickHero = `PickHero`,
    PickHeroSoloBot = `PickHeroSoloBot`,
    PickHeroSoloBotAndvari = `PickHeroSoloBotAndvari`,
    PlaceEnlistmentMercenaries = `PlaceEnlistmentMercenaries`,
    PlaceMultiSuitsCards = `PlaceMultiSuitsCards`,
    PlaceTradingCoinsUline = `PlaceTradingCoinsUline`,
    PlaceThrudHero = `PlaceThrudHero`,
    PlaceThrudHeroSoloBot = `PlaceThrudHeroSoloBot`,
    PlaceThrudHeroSoloBotAndvari = `PlaceThrudHeroSoloBotAndvari`,
    UpgradeCoin = `UpgradeCoin`,
    UpgradeCoinSoloBot = `UpgradeCoinSoloBot`,
    UpgradeCoinSoloBotAndvari = `UpgradeCoinSoloBotAndvari`,
    UpgradeVidofnirVedrfolnirCoin = `UpgradeVidofnirVedrfolnirCoin`,
}

/**
 * <h3>Перечисление для названий фракций.</h3>
 */
export const enum SuitNames {
    blacksmith = `blacksmith`,
    explorer = `explorer`,
    hunter = `hunter`,
    miner = `miner`,
    warrior = `warrior`,
}

/**
 * <h3>Перечисление для названия валидаторов для выбора карты героя.</h3>
 */
export const enum PickHeroCardValidatorNames {
    conditions = `conditions`,
    discardCard = `discardCard`,
}

/**
 * <h3>Перечисление для названия валидаторов для выбора карты героя.</h3>
 */
export const enum SoloGameAndvariStrategyNames {
    NoHeroEasyStrategy = `Без стартовых героев (лёгкая стратегия)`,
    NoHeroHardStrategy = `Без стартовых героев (сложная стратегия)`,
    WithHeroEasyStrategy = `Со стартовыми героями (лёгкая стратегия)`,
    WithHeroHardStrategy = `Со стартовыми героями (сложная стратегия)`,
}

/**
 * <h3>Перечисление для названия валидаторов для выбора карты при выборе героя.</h3>
 */
export const enum PickCardValidatorNames {
    pickDiscardCardToStack = `pickDiscardCardToStack`,
    pickCampCardToStack = `pickCampCardToStack`,
}

/**
 * <h3>Перечисление для названия карт 'Королевская награда'.</h3>
 */
export const enum RoyalOfferingNames {
    PlusThree = `+3`,
    PlusFive = `+5`,
}

/**
 * <h3>Перечисление для названия таверн.</h3>
 */
export const enum TavernNames {
    LaughingGoblin = `«Весёлый гоблин»`,
    DancingDragon = `«Парящий дракон»`,
    ShiningHorse = `«Гарцующий конь»`,
}

/**
 * <h3>Перечисление для названия валидаторов мувов.</h3>
 */
export const enum MoveValidatorNames {
    ChooseCoinValueForHrungnirUpgradeMoveValidator = `ChooseCoinValueForHrungnirUpgradeMoveValidator`,
    ClickCardNotGiantAbilityMoveValidator = `ClickCardNotGiantAbilityMoveValidator`,
    ClickGiantAbilityNotCardMoveValidator = `ClickGiantAbilityNotCardMoveValidator`,
    ChooseSuitOlrunMoveValidator = `ChooseSuitOlrunMoveValidator`,
    ClickBoardCoinMoveValidator = `ClickBoardCoinMoveValidator`,
    ClickCampCardMoveValidator = `ClickCampCardMoveValidator`,
    ClickCardMoveValidator = `ClickCardMoveValidator`,
    ClickCardToPickDistinctionMoveValidator = `ClickCardToPickDistinctionMoveValidator`,
    ClickDistinctionCardMoveValidator = `ClickDistinctionCardMoveValidator`,
    ClickHandCoinMoveValidator = `ClickHandCoinMoveValidator`,
    ClickHandCoinUlineMoveValidator = `ClickHandCoinUlineMoveValidator`,
    ClickHandTradingCoinUlineMoveValidator = `ClickHandTradingCoinUlineMoveValidator`,
    DiscardCardFromPlayerBoardMoveValidator = `DiscardCardFromPlayerBoardMoveValidator`,
    DiscardCard2PlayersMoveValidator = `DiscardCard2PlayersMoveValidator`,
    GetEnlistmentMercenariesMoveValidator = `GetEnlistmentMercenariesMoveValidator`,
    GetMjollnirProfitMoveValidator = `GetMjollnirProfitMoveValidator`,
    GetMythologyCardMoveValidator = `GetMythologyCardMoveValidator`,
    PassEnlistmentMercenariesMoveValidator = `PassEnlistmentMercenariesMoveValidator`,
    PlaceEnlistmentMercenariesMoveValidator = `PlaceEnlistmentMercenariesMoveValidator`,
    PlaceYludHeroMoveValidator = `PlaceYludHeroMoveValidator`,
    StartEnlistmentMercenariesMoveValidator = `StartEnlistmentMercenariesMoveValidator`,
    // Bots
    BotsPlaceAllCoinsMoveValidator = `BotsPlaceAllCoinsMoveValidator`,
    // Solo Bot
    SoloBotClickCardMoveValidator = `SoloBotClickCardMoveValidator`,
    SoloBotClickHeroCardMoveValidator = `SoloBotClickHeroCardMoveValidator`,
    SoloBotPlaceAllCoinsMoveValidator = `SoloBotPlaceAllCoinsMoveValidator`,
    SoloBotClickCardToPickDistinctionMoveValidator = `SoloBotClickCardToPickDistinctionMoveValidator`,
    SoloBotPlaceYludHeroMoveValidator = `SoloBotPlaceYludHeroMoveValidator`,
    SoloBotPlaceThrudHeroMoveValidator = `SoloBotPlaceThrudHeroMoveValidator`,
    SoloBotClickCoinToUpgradeMoveValidator = `SoloBotClickCoinToUpgradeMoveValidator`,
    // Solo Mode
    ChooseDifficultyLevelForSoloModeMoveValidator = `ChooseDifficultyLevelForSoloModeMoveValidator`,
    ChooseHeroesForSoloModeMoveValidator = `ChooseHeroesForSoloModeMoveValidator`,
    // Solo Mode Andvari
    SoloBotAndvariClickCardMoveValidator = `SoloBotAndvariClickCardMoveValidator`,
    ChooseStrategyForSoloModeAndvariMoveValidator = `ChooseStrategyForSoloModeAndvariMoveValidator`,
    ChooseStrategyVariantForSoloModeAndvariMoveValidator = `ChooseStrategyVariantForSoloModeAndvariMoveValidator`,
    SoloBotAndvariPlaceAllCoinsMoveValidator = `SoloBotAndvariPlaceAllCoinsMoveValidator`,
    SoloBotAndvariClickHeroCardMoveValidator = `SoloBotAndvariClickHeroCardMoveValidator`,
    SoloBotAndvariClickCardToPickDistinctionMoveValidator = `SoloBotAndvariClickCardToPickDistinctionMoveValidator`,
    SoloBotAndvariPlaceYludHeroMoveValidator = `SoloBotAndvariPlaceYludHeroMoveValidator`,
    SoloBotAndvariPlaceThrudHeroMoveValidator = `SoloBotAndvariPlaceThrudHeroMoveValidator`,
    SoloBotAndvariClickCoinToUpgradeMoveValidator = `SoloBotAndvariClickCoinToUpgradeMoveValidator`,
    // start
    AddCoinToPouchMoveValidator = `AddCoinToPouchMoveValidator`,
    ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator =
    `ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator`,
    ClickCampCardHoldaMoveValidator = `ClickCampCardHoldaMoveValidator`,
    ClickCoinToUpgradeMoveValidator = `ClickCoinToUpgradeMoveValidator`,
    PickConcreteCoinToUpgradeMoveValidator = `PickConcreteCoinToUpgradeMoveValidator`,
    ClickHeroCardMoveValidator = `ClickHeroCardMoveValidator`,
    DiscardCardMoveValidator = `DiscardCardMoveValidator`,
    DiscardSuitCardFromPlayerBoardMoveValidator = `DiscardSuitCardFromPlayerBoardMoveValidator`,
    PickDiscardCardMoveValidator = `PickDiscardCardMoveValidator`,
    PlaceMultiSuitCardMoveValidator = `PlaceMultiSuitCardMoveValidator`,
    PlaceThrudHeroMoveValidator = `PlaceThrudHeroMoveValidator`,
    UpgradeCoinVidofnirVedrfolnirMoveValidator = `UpgradeCoinVidofnirVedrfolnirMoveValidator`,
}
