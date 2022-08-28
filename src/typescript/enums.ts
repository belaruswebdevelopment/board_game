/**
 * <h3>Перечисление для названий режимов игры.</h3>
 */
export const enum GameModeNames {
    Basic = `Basic`,
    Multiplayer = `Multiplayer`,
    Solo1 = `Solo1`,
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
 * <h3>Перечисление для названия бафов в конфиге.</h3>
 */
export const enum BuffNames {
    CountDistinctionAmount = `countDistinctionAmount`,
    CountPickedHeroAmount = `countPickedHeroAmount`,
    DagdaDiscardOnlyOneCards = `dagdaDiscardOnlyOneCards`,
    DiscardCardEndGame = `discardCardEndGame`,
    EndTier = `endTier`,
    EveryTurn = `everyTurn`,
    GetMjollnirProfit = `getMjollnirProfit`,
    GoCamp = `goCamp`,
    GoCampOneTime = `goCampOneTime`,
    MoveThrud = `moveThrud`,
    NoHero = `noHero`,
    RatatoskFinalScoring = `ratatoskFinalScoring`,
    SuitIdForMjollnir = `suitIdForMjollnir`,
    UpgradeCoin = `upgradeCoin`,
    UpgradeNextCoin = `upgradeNextCoin`,
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
    ChooseCoinValueForVidofnirVedrfolnirUpgrade = `chooseCoinValueForVidofnirVedrfolnirUpgrade`,
    ChooseStrategyLevelForSoloModeAndvari = `ChooseStrategyLevelForSoloModeAndvari`,
    ChooseStrategyVariantLevelForSoloModeAndvari = `ChooseStrategyVariantLevelForSoloModeAndvari`,
    ExplorerDistinction = `explorerDistinction`,
    GetDifficultyLevelForSoloMode = `getDifficultyLevelForSoloMode`,
    GetHeroesForSoloMode = `getHeroesForSoloMode`,
    StartOrPassEnlistmentMercenaries = `startOrPassEnlistmentMercenaries`,
}

/**
 * <h3>Перечисление для описаний отображения действий.</h3>
 */
export const enum DrawNames {
    // TODO Give normal names to all?!
    AddCoinToPouchVidofnirVedrfolnir = `Add coin to pouch Vidofnir Vedrfolnir`,
    Andumia = `Andumia`,
    Bonfur = `Bonfur`,
    Brisingamens = `Brisingamens`,
    BrisingamensEndGame = `Brisingamens end game`,
    ChooseStrategyLevelForSoloModeAndvari = `Choose strategy level for solo mode Andvari`,
    ChooseStrategyVariantLevelForSoloModeAndvari = `Choose strategy variant level for solo mode Andvari`,
    CrovaxTheDoppelganger = `Crovax the Doppelganger`,
    Dagda = `Dagda`,
    DiscardTavernCard = `Discard tavern card`,
    EnlistmentMercenaries = `Enlistment Mercenaries`,
    Mjollnir = `Mjollnir`,
    GetDifficultyLevelForSoloMode = `Get difficulty level for Solo mode`,
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
    basic = `basic`,
    idavoll = `idavoll`,
    thingvellir = `thingvellir`,
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
    Game = `game`,
    Private = `private`,
    Public = `public`,
}

/**
 * <h3>Перечисление для описаний отображения действий.</h3>
 */
export const enum MoveNames {
    ClickBoardCoinMove = `ClickBoardCoinMove`,
    ClickCampCardMove = `ClickCampCardMove`,
    ClickCardMove = `ClickCardMove`,
    ClickCardToPickDistinctionMove = `ClickCardToPickDistinctionMove`,
    ClickDistinctionCardMove = `ClickDistinctionCardMove`,
    ClickHandCoinMove = `ClickHandCoinMove`,
    ClickHandCoinUlineMove = `ClickHandCoinUlineMove`,
    ClickHandTradingCoinUlineMove = `ClickHandTradingCoinUlineMove`,
    DiscardCardFromPlayerBoardMove = `DiscardCardFromPlayerBoardMove`,
    DiscardCard2PlayersMove = `DiscardCard2PlayersMove`,
    GetEnlistmentMercenariesMove = `GetEnlistmentMercenariesMove`,
    GetMjollnirProfitMove = `GetMjollnirProfitMove`,
    PassEnlistmentMercenariesMove = `PassEnlistmentMercenariesMove`,
    PlaceYludHeroMove = `PlaceYludHeroMove`,
    PlaceEnlistmentMercenariesMove = `PlaceEnlistmentMercenariesMove`,
    StartEnlistmentMercenariesMove = `StartEnlistmentMercenariesMove`,
    // Bots
    BotsPlaceAllCoinsMove = `BotsPlaceAllCoinsMove`,
    // Solo Bot
    SoloBotClickCardMove = `SoloBotClickCardMove`,
    SoloBotClickHeroCardMove = `SoloBotClickHeroCardMove`,
    SoloBotPlaceAllCoinsMove = `SoloBotPlaceAllCoinsMove`,
    SoloBotClickCardToPickDistinctionMove = `SoloBotClickCardToPickDistinctionMove`,
    SoloBotPlaceThrudHeroMove = `SoloBotPlaceThrudHeroMove`,
    SoloBotPlaceYludHeroMove = `SoloBotPlaceYludHeroMove`,
    SoloBotClickCoinToUpgradeMove = `SoloBotClickCoinToUpgradeMove`,
    // Solo Mode
    ChooseDifficultyLevelForSoloModeMove = `ChooseDifficultyLevelForSoloModeMove`,
    ChooseHeroForDifficultySoloModeMove = `ChooseHeroForDifficultySoloModeMove`,
    //Solo Mode Andvari
    SoloBotAndvariClickCardMove = `SoloBotAndvariClickCardMove`,
    ChooseStrategyForSoloModeAndvariMove = `ChooseStrategyForSoloModeAndvariMove`,
    ChooseStrategyVariantForSoloModeAndvariMove = `ChooseStrategyVariantForSoloModeAndvariMove`,
    SoloBotAndvariPlaceAllCoinsMove = `SoloBotAndvariPlaceAllCoinsMove`,
    SoloBotAndvariClickHeroCardMove = `SoloBotAndvariClickHeroCardMove`,
    SoloBotAndvariClickCardToPickDistinctionMove = `SoloBotAndvariClickCardToPickDistinctionMove`,
    SoloBotAndvariPlaceThrudHeroMove = `SoloBotAndvariPlaceThrudHeroMove`,
    SoloBotAndvariPlaceYludHeroMove = `SoloBotAndvariPlaceYludHeroMove`,
    SoloBotAndvariClickCoinToUpgradeMove = `SoloBotAndvariClickCoinToUpgradeMove`,
    // start
    AddCoinToPouchMove = `AddCoinToPouchMove`,
    ChooseCoinValueForVidofnirVedrfolnirUpgradeMove = `ChooseCoinValueForVidofnirVedrfolnirUpgradeMove`,
    ClickCampCardHoldaMove = `ClickCampCardHoldaMove`,
    ClickCoinToUpgradeMove = `ClickCoinToUpgradeMove`,
    ClickHeroCardMove = `ClickHeroCardMove`,
    DiscardCardMove = `DiscardCardMove`,
    DiscardSuitCardFromPlayerBoardMove = `DiscardSuitCardFromPlayerBoardMove`,
    ClickConcreteCoinToUpgradeMove = `ClickConcreteCoinToUpgradeMove`,
    PickDiscardCardMove = `PickDiscardCardMove`,
    PlaceMultiSuitCardMove = `PlaceMultiSuitCardMove`,
    PlaceThrudHeroMove = `PlaceThrudHeroMove`,
    UpgradeCoinVidofnirVedrfolnirMove = `UpgradeCoinVidofnirVedrfolnirMove`,
    // TODO Is it here?
    UseGodCardPowerMove = `UseGodCardPowerMove`,
}

/**
 * <h3>Перечисление для фаз игры.</h3>
 */
export const enum PhaseNames {
    BrisingamensEndGame = `brisingamensEndGame`,
    ChooseDifficultySoloMode = `chooseDifficultySoloMode`,
    ChooseDifficultySoloModeAndvari = `chooseDifficultySoloModeAndvari`,
    PlaceYlud = `placeYlud`,
    EnlistmentMercenaries = `enlistmentMercenaries`,
    TroopEvaluation = `troopEvaluation`,
    GetMjollnirProfit = `getMjollnirProfit`,
    TavernsResolution = `tavernsResolution`,
    Bids = `bids`,
    BidUline = `bidUline`,
}

/**
 * <h3>Перечисление для фаз игры на русском.</h3>
 */
export enum RusPhaseNames {
    brisingamensEndGame = `brisingamensEndGame`,
    chooseDifficultySoloMode = `Выбор сложности соло режима`,
    chooseDifficultySoloModeAndvari = `Выбор сложности соло режима Андвари`,
    placeYlud = `Поместить Илуд`,
    enlistmentMercenaries = `enlistmentMercenaries`,
    troopEvaluation = `Смотр войск`,
    getMjollnirProfit = `getMjollnirProfit`,
    tavernsResolution = `Посещение таверн`,
    bids = `Ставки`,
    bidUline = `Ставки Улина`,
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
 * <h3>Перечисление для стадий игры.</h3>
 */
export const enum StageNames {
    addCoinToPouch = `addCoinToPouch`,
    chooseCoinValueForVidofnirVedrfolnirUpgrade = `chooseCoinValueForVidofnirVedrfolnirUpgrade`,
    default1 = `default1`,
    default2 = `default2`,
    default3 = `default3`,
    default4 = `default4`,
    default5 = `default5`,
    discardCard = `discardCard`,
    discardBoardCard = `discardBoardCard`,
    discardSuitCard = `discardSuitCard`,
    pickCampCardHolda = `pickCampCardHolda`,
    pickConcreteCoinToUpgrade = `pickConcreteCoinToUpgrade`,
    pickDiscardCard = `pickDiscardCard`,
    pickDistinctionCard = `pickDistinctionCard`,
    pickDistinctionCardSoloBot = `pickDistinctionCardSoloBot`,
    pickDistinctionCardSoloBotAndvari = `pickDistinctionCardSoloBotAndvari`,
    pickHero = `pickHero`,
    pickHeroSoloBot = `pickHeroSoloBot`,
    pickHeroSoloBotAndvari = `pickHeroSoloBotAndvari`,
    placeEnlistmentMercenaries = `placeEnlistmentMercenaries`,
    placeMultiSuitsCards = `placeMultiSuitsCards`,
    placeTradingCoinsUline = `placeTradingCoinsUline`,
    placeThrudHero = `placeThrudHero`,
    placeThrudHeroSoloBot = `placeThrudHeroSoloBot`,
    placeThrudHeroSoloBotAndvari = `placeThrudHeroSoloBotAndvari`,
    chooseHeroesForSoloMode = `chooseHeroesForSoloMode`,
    upgradeCoin = `upgradeCoin`,
    upgradeCoinSoloBot = `upgradeCoinSoloBot`,
    upgradeCoinSoloBotAndvari = `upgradeCoinSoloBotAndvari`,
    upgradeVidofnirVedrfolnirCoin = `upgradeVidofnirVedrfolnirCoin`,
}

/**
 * <h3>Перечисление для русских названий стадий игры.</h3>
 */
export enum RusStageNames {
    addCoinToPouch = `addCoinToPouch`,
    chooseCoinValueForVidofnirVedrfolnirUpgrade = `chooseCoinValueForVidofnirVedrfolnirUpgrade`,
    default1 = `default1`,
    default2 = `default2`,
    default3 = `default3`,
    default4 = `default4`,
    default5 = `default5`,
    discardCard = `discardCard`,
    discardBoardCard = `discardBoardCard`,
    discardSuitCard = `discardSuitCard`,
    pickCampCardHolda = `pickCampCardHolda`,
    pickConcreteCoinToUpgrade = `pickConcreteCoinToUpgrade`,
    pickDiscardCard = `pickDiscardCard`,
    pickDistinctionCard = `pickDistinctionCard`,
    pickDistinctionCardSoloBot = `pickDistinctionCardSoloBot`,
    pickDistinctionCardSoloBotAndvari = `pickDistinctionCardSoloBotAndvari`,
    pickHero = `pickHero`,
    pickHeroSoloBot = `pickHeroSoloBot`,
    pickHeroSoloBotAndvari = `pickHeroSoloBotAndvari`,
    placeEnlistmentMercenaries = `placeEnlistmentMercenaries`,
    placeMultiSuitsCards = `placeMultiSuitsCards`,
    placeTradingCoinsUline = `placeTradingCoinsUline`,
    placeThrudHero = `placeThrudHero`,
    placeThrudHeroSoloBot = `placeThrudHeroSoloBot`,
    placeThrudHeroSoloBotAndvari = `placeThrudHeroSoloBotAndvari`,
    chooseHeroesForSoloMode = `chooseHeroesForSoloMode`,
    upgradeCoin = `upgradeCoin`,
    upgradeCoinSoloBot = `upgradeCoinSoloBot`,
    upgradeCoinSoloBotAndvari = `upgradeCoinSoloBotAndvari`,
    upgradeVidofnirVedrfolnirCoin = `upgradeVidofnirVedrfolnirCoin`,
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
    ClickConcreteCoinToUpgradeMoveValidator = `ClickConcreteCoinToUpgradeMoveValidator`,
    ClickHeroCardMoveValidator = `ClickHeroCardMoveValidator`,
    DiscardCardMoveValidator = `DiscardCardMoveValidator`,
    DiscardSuitCardFromPlayerBoardMoveValidator = `DiscardSuitCardFromPlayerBoardMoveValidator`,
    PickDiscardCardMoveValidator = `PickDiscardCardMoveValidator`,
    PlaceMultiSuitCardMoveValidator = `PlaceMultiSuitCardMoveValidator`,
    PlaceThrudHeroMoveValidator = `PlaceThrudHeroMoveValidator`,
    UpgradeCoinVidofnirVedrfolnirMoveValidator = `UpgradeCoinVidofnirVedrfolnirMoveValidator`,
    // TODO Is it here?
    UseGodPowerMoveValidator = `UseGodPowerMoveValidator`,
}
