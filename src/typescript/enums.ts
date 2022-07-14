/**
 * <h3>Перечисление для названий артефактов.</h3>
 */
export const enum ArtefactNames {
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
    Start = `Старт`,
    Pass = `Пас`,
}

/**
 * <h3>Перечисление для названия мультифракционных карт.</h3>
 */
export const enum MultiSuitCardNames {
    Gullinbursti = `Гуллинбурсти`,
    OlwinsDouble = `Двойник Ольвюна`,
}

/**
 * <h3>Перечисление для названия особых карт.</h3>
 */
export const enum SpecialCardNames {
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
    PickCardByExplorerDistinction = `Pick card by Explorer distinction`,
    PickCardByExplorerDistinctionSoloBot = `Pick card by Explorer distinction Solo Bot`,
    PickConcreteCoinToUpgrade = `Pick concrete coin to upgrade`,
    PickHero = `Pick hero card`,
    PickHeroSoloBot = `Pick hero card Solo Bot`,
    PlaceEnlistmentMercenaries = `Place Enlistment Mercenaries`,
    PlaceTradingCoinsUline = `Place Trading Coins Uline`,
    PlaceYludHero = `Place Ylud`,
    StartOrPassEnlistmentMercenaries = `Start or Pass Enlistment Mercenaries`,
    PlaceThrudHero = `Place Thrud Hero`,
    UpgradeCoin = `Upgrade coin`,
    UpgradeCoinVidofnirVedrfolnir = `Upgrade coin Vidofnir Vedrfolnir`,
    UpgradeCoinWarriorDistinction = `Upgrade coin Warrior distinction`,
}

export const enum ErrorNames {
    CurrentTierDeckIsUndefined = `CurrentTierDeckIsUndefined`,
    CurrentPublicPlayerIsUndefined = `CurrentPublicPlayerIsUndefined`,
    CurrentSuitDistinctionPlayerIndexIsUndefined = `CurrentSuitDistinctionPlayerIndexIsUndefined`,
    CurrentTavernConfigIsUndefined = `CurrentTavernConfigIsUndefined`,
    CurrentTavernIsUndefined = `CurrentTavernIsUndefined`,
    DeckIsUndefined = `DeckIsUndefined`,
    DoNotDiscardCardFromCurrentTavernIfCardWithCurrentIdIsUndefined =
    `DoNotDiscardCardFromCurrentTavernIfCardWithCurrentIdIsUndefined`,
    DoNotDiscardCardFromCurrentTavernIfNoCardInTavern = `DoNotDiscardCardFromCurrentTavernIfNoCardInTavern`,
    DoNotDiscardCardFromTavernInSoloOrTwoPlayersGame = `DoNotDiscardCardFromTavernInSoloOrTwoPlayersGame`,
    NoCardsToDiscardWhenNoWinnerInExplorerDistinction = `NoCardsToDiscardWhenNoWinnerInExplorerDistinction`,
    OnlyInSoloOrTwoPlayersGame = `OnlyInSoloOrTwoPlayersGame`,
    PlayersCurrentSuitCardsMustHaveCardsForDistinction = `PlayersCurrentSuitCardsMustHaveCardsForDistinction`,
    PlayersCurrentSuitRanksArrayMustHavePlayerWithMostRankCount =
    `PlayersCurrentSuitRanksArrayMustHavePlayerWithMostRankCount`,
    PublicPlayerWithCurrentIdIsUndefined = `PublicPlayerWithCurrentIdIsUndefined`,
    SuitDistinctionMustBePresent = `SuitDistinctionMustBePresent`,
    TavernCanNotBeRefilledBecauseNotEnoughCards = `TavernCanNotBeRefilledBecauseNotEnoughCards`,
    TavernConfigWithCurrentIdIsUndefined = `TavernConfigWithCurrentIdIsUndefined`,
    TavernWithCurrentIdIsUndefined = `TavernWithCurrentIdIsUndefined`,
}

/**
 * <h3>Перечисление для названия игры и дополнений.</h3>
 */
export const enum GameNames {
    Basic = `basic`,
    Idavoll = `idavoll`,
    Thingvellir = `thingvellir`,
}

/**
 * <h3>Перечисление для названия Гигантов.</h3>
 */
export const enum GiantNames {
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
    SoloBotClickHeroCardMove = `SoloBotClickHeroCardMove`,
    SoloBotPlaceAllCoinsMove = `SoloBotPlaceAllCoinsMove`,
    // Solo Mode
    ChooseDifficultyLevelForSoloModeMove = `ChooseDifficultyLevelForSoloModeMove`,
    ChooseHeroForDifficultySoloModeMove = `ChooseHeroForDifficultySoloModeMove`,
    // start
    AddCoinToPouchMove = `AddCoinToPouchMove`,
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
    UseGodPowerMove = `UseGodPowerMove`,
}

/**
 * <h3>Перечисление для фаз игры.</h3>
 */
export const enum PhaseNames {
    BrisingamensEndGame = `brisingamensEndGame`,
    ChooseDifficultySoloMode = `chooseDifficultySoloMode`,
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
    AddCoinToPouch = `addCoinToPouch`,
    Default1 = `default1`,
    Default2 = `default2`,
    Default3 = `default3`,
    Default4 = `default4`,
    DiscardCard = `discardCard`,
    DiscardBoardCard = `discardBoardCard`,
    DiscardSuitCard = `discardSuitCard`,
    PickCampCardHolda = `pickCampCardHolda`,
    PickConcreteCoinToUpgrade = `pickConcreteCoinToUpgrade`,
    PickDiscardCard = `pickDiscardCard`,
    PickDistinctionCard = `pickDistinctionCard`,
    PickDistinctionCardSoloBot = `pickDistinctionCardSoloBot`,
    PickHero = `pickHero`,
    PickHeroSoloBot = `pickHeroSoloBot`,
    PlaceEnlistmentMercenaries = `placeEnlistmentMercenaries`,
    PlaceMultiSuitsCards = `placeMultiSuitsCards`,
    PlaceTradingCoinsUline = `placeTradingCoinsUline`,
    PlaceThrudHero = `placeThrudHero`,
    ChooseHeroesForSoloMode = `chooseHeroesForSoloMode`,
    UpgradeCoin = `upgradeCoin`,
    UpgradeVidofnirVedrfolnirCoin = `upgradeVidofnirVedrfolnirCoin`,
}

/**
 * <h3>Перечисление для названий фракций.</h3>
 */
export const enum SuitNames {
    Blacksmith = `blacksmith`,
    Explorer = `explorer`,
    Hunter = `hunter`,
    Miner = `miner`,
    Warrior = `warrior`,
}

/**
 * <h3>Перечисление для названия валидаторов для выбора карты героя.</h3>
 */
export const enum PickHeroCardValidatorNames {
    Conditions = `conditions`,
    DiscardCard = `discardCard`,
}

/**
 * <h3>Перечисление для названия валидаторов для выбора карты при выборе героя.</h3>
 */
export const enum PickCardValidatorNames {
    PickDiscardCardToStack = `pickDiscardCardToStack`,
    PickCampCardToStack = `pickCampCardToStack`,
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
    SoloBotClickHeroCardMoveValidator = `SoloBotClickHeroCardMoveValidator`,
    SoloBotPlaceAllCoinsMoveValidator = `SoloBotPlaceAllCoinsMoveValidator`,
    // Solo Mode
    ChooseDifficultyLevelForSoloModeMoveValidator = `ChooseDifficultyLevelForSoloModeMoveValidator`,
    ChooseHeroesForSoloModeMoveValidator = `ChooseHeroesForSoloModeMoveValidator`,
    // start
    AddCoinToPouchMoveValidator = `AddCoinToPouchMoveValidator`,
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
