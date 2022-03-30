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
    Coin = `coin`,
    DiscardCardEndGame = `discardCardEndGame`,
    EndTier = `endTier`,
    EveryTurn = `everyTurn`,
    GetMjollnirProfit = `getMjollnirProfit`,
    GoCamp = `goCamp`,
    GoCampOneTime = `goCampOneTime`,
    NoHero = `noHero`,
    SuitIdForMjollnir = `suitIdForMjollnir`,
    UpgradeCoin = `upgradeCoin`,
    UpgradeNextCoin = `upgradeNextCoin`,
}

export const enum ButtonNames {
    Start = `Старт`,
    Pass = `Пас`,
}

export const enum CardNames {
    ChiefBlacksmith = `Главный кузнец`,
    OlwinsDouble = `Двойник Ольвюна`,
}

export const enum CoinTypes {
    Hand = `hand`,
    Board = `board`,
}

/**
 * <h3>Перечисление для названия отображения действий в конфиге.</h3>
 */
export const enum ConfigNames {
    ExplorerDistinction = `explorerDistinction`,
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
    GetMjollnirProfit = `Get Mjollnir profit`,
    Hofud = `Hofud`,
    Holda = `Holda`,
    Olwin = `Olwin`,
    PickCard = `Pick card or camp card`,
    PickCardByExplorerDistinction = `Pick card by Explorer distinction`,
    PickConcreteCoinToUpgrade = `Pick concrete coin to upgrade`,
    PickHero = `Pick hero card`,
    PlaceEnlistmentMercenaries = `Place Enlistment Mercenaries`,
    PlaceTradingCoinsUline = `Place Trading Coins Uline`,
    StartOrPassEnlistmentMercenaries = `Start or Pass Enlistment Mercenaries`,
    Thrud = `Thrud`,
    UpgradeCoin = `Upgrade coin`,
    UpgradeCoinVidofnirVedrfolnir = `Upgrade coin Vidofnir Vedrfolnir`,
    UpgradeCoinWarriorDistinction = `Upgrade coin Warrior distinction`,
    Ylud = `Ylud`,
}

export const enum GameNames {
    Basic = `basic`,
    Thingvellir = `thingvellir`,
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
export const enum LogTypes {
    GAME = `game`,
    PRIVATE = `private`,
    PUBLIC = `public`,
}

/**
 * <h3>Перечисление для описаний отображения действий.</h3>
 */
export const enum MoveNames {
    AddCoinToPouchMove = `AddCoinToPouchMove`,
    BotsPlaceAllCoinsMove = `BotsPlaceAllCoinsMove`,
    ClickBoardCoinMove = `ClickBoardCoinMove`,
    ClickCampCardHoldaMove = `ClickCampCardHoldaMove`,
    ClickCampCardMove = `ClickCampCardMove`,
    ClickCardMove = `ClickCardMove`,
    ClickCardToPickDistinctionMove = `ClickCardToPickDistinctionMove`,
    ClickCoinToUpgradeMove = `ClickCoinToUpgradeMove`,
    ClickConcreteCoinToUpgradeMove = `ClickConcreteCoinToUpgradeMove`,
    ClickDistinctionCardMove = `ClickDistinctionCardMove`,
    ClickHandCoinMove = `ClickHandCoinMove`,
    ClickHandCoinUlineMove = `ClickHandCoinUlineMove`,
    ClickHandTradingCoinUlineMove = `ClickHandTradingCoinUlineMove`,
    ClickHeroCardMove = `ClickHeroCardMove`,
    DiscardCardFromPlayerBoardMove = `DiscardCardFromPlayerBoardMove`,
    DiscardCardMove = `DiscardCardMove`,
    DiscardCard2PlayersMove = `DiscardCard2PlayersMove`,
    DiscardSuitCardFromPlayerBoardMove = `DiscardSuitCardFromPlayerBoardMove`,
    GetEnlistmentMercenariesMove = `GetEnlistmentMercenariesMove`,
    GetMjollnirProfitMove = `GetMjollnirProfitMove`,
    PassEnlistmentMercenariesMove = `PassEnlistmentMercenariesMove`,
    PickDiscardCardMove = `PickDiscardCardMove`,
    PlaceOlwinCardMove = `PlaceOlwinCardMove`,
    PlaceThrudHeroMove = `PlaceThrudHeroMove`,
    PlaceYludHeroMove = `PlaceYludHeroMove`,
    PlaceEnlistmentMercenariesMove = `PlaceEnlistmentMercenariesMove`,
    StartEnlistmentMercenariesMove = `StartEnlistmentMercenariesMove`,
    UpgradeCoinVidofnirVedrfolnirMove = `UpgradeCoinVidofnirVedrfolnirMove`,
}

/**
 * <h3>Перечисление для фаз игры.</h3>
 */
export const enum Phases {
    BrisingamensEndGame = `brisingamensEndGame`,
    EndTier = `endTier`,
    EnlistmentMercenaries = `enlistmentMercenaries`,
    GetDistinctions = `getDistinctions`,
    GetMjollnirProfit = `getMjollnirProfit`,
    PickCards = `pickCards`,
    PlaceCoins = `placeCoins`,
    PlaceCoinsUline = `placeCoinsUline`,
}

/**
 * <h3>Перечисление для типов карт.</h3>
 */
export const enum RusCardTypes {
    ACTION = `улучшение монеты`,
    ARTEFACT = `артефакт`,
    BASIC = `базовая`,
    HERO = `герой`,
    MERCENARY = `наёмник`,
    MERCENARYPLAYERCARD = `наёмник в руке игрока`,
}

/**
 * <h3>Перечисление для русских названий фракций.</h3>
 */
export const enum RusSuitNames {
    BLACKSMITH = `Кузнецы`,
    EXPLORER = `Разведчики`,
    HUNTER = `Охотники`,
    MINER = `Горняки`,
    WARRIOR = `Воины`,
}

/**
 * <h3>Перечисление для стадий игры.</h3>
 */
export const enum Stages {
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
    PickHero = `pickHero`,
    PlaceOlwinCards = `placeOlwinCards`,
    PlaceTradingCoinsUline = `placeTradingCoinsUline`,
    PlaceThrudHero = `placeThrudHero`,
    UpgradeCoin = `upgradeCoin`,
    UpgradeVidofnirVedrfolnirCoin = `upgradeVidofnirVedrfolnirCoin`,
}

/**
 * <h3>Перечисление для названий фракций.</h3>
 */
export const enum SuitNames {
    BLACKSMITH = `blacksmith`,
    EXPLORER = `explorer`,
    HUNTER = `hunter`,
    MINER = `miner`,
    WARRIOR = `warrior`,
}

export const enum ValidatorNames {
    Conditions = `conditions`,
    DiscardCard = `discardCard`,
    PickDiscardCardToStack = `pickDiscardCardToStack`,
    PickCampCardToStack = `pickCampCardToStack`,
}

export const enum TavernNames {
    LaughingGoblin = `«Весёлый гоблин»`,
    DancingDragon = `«Парящий дракон»`,
    ShiningHorse = `«Гарцующий конь»`,
}

export const enum MoveValidatorNames {
    BotsPlaceAllCoinsMoveValidator = `BotsPlaceAllCoinsMoveValidator`,
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
    // start
    AddCoinToPouchMoveValidator = `AddCoinToPouchMoveValidator`,
    ClickCampCardHoldaMoveValidator = `ClickCampCardHoldaMoveValidator`,
    PickConcreteCoinToUpgradeMoveValidator = `PickConcreteCoinToUpgradeMoveValidator`,
    ClickCoinToUpgradeMoveValidator = `ClickCoinToUpgradeMoveValidator`,
    ClickHeroCardMoveValidator = `ClickHeroCardMoveValidator`,
    DiscardCardMoveValidator = `DiscardCardMoveValidator`,
    DiscardSuitCardFromPlayerBoardMoveValidator = `DiscardSuitCardFromPlayerBoardMoveValidator`,
    PickDiscardCardMoveValidator = `PickDiscardCardMoveValidator`,
    PlaceOlwinCardMoveValidator = `PlaceOlwinCardMoveValidator`,
    PlaceThrudHeroMoveValidator = `PlaceThrudHeroMoveValidator`,
    UpgradeCoinVidofnirVedrfolnirMoveValidator = `UpgradeCoinVidofnirVedrfolnirMoveValidator`,
}
