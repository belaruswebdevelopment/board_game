/**
 * <h3>Перечисление для названий артефактов.</h3>
 */
export const enum ArtefactNames {
    Brisingamens = `Brisingamens`,
    Draupnir = `Draupnir`,
    Fafnir_Baleygr = `Fafnir Baleygr`,
    Gjallarhorn = `Gjallarhorn`,
    Hofud = `Hofud`,
    Hrafnsmerki = `Hrafnsmerki`,
    Jarnglofi = `Jarnglofi`,
    Megingjord = `Megingjord`,
    Mjollnir = `Mjollnir`,
    Svalinn = `Svalinn`,
    Vegvisir = `Vegvisir`,
    Vidofnir_Vedrfolnir = `Vidofnir Vedrfolnir`,
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

export const enum CardNames {
    ChiefBlacksmith = `Chief blacksmith`,
    Olwin = `Olwin`,
}

/**
 * <h3>Перечисление для названия отображения действий в конфиге.</h3>
 */
export const enum ConfigNames {
    AddCoinToPouchVidofnirVedrfolnir = `AddCoinToPouchVidofnirVedrfolnir`,
    AndumiaAction = `AndumiaAction`,
    BonfurAction = `BonfurAction`,
    BrisingamensAction = `BrisingamensAction`,
    BrisingamensEndGameAction = `BrisingamensEndGameAction`,
    DagdaAction = `DagdaAction`,
    DiscardCard = `discardCard`,
    EnlistmentMercenaries = `enlistmentMercenaries`,
    ExplorerDistinction = `explorerDistinction`,
    GetMjollnirProfit = `getMjollnirProfit`,
    HofudAction = `HofudAction`,
    HoldaAction = `HoldaAction`,
    PlaceEnlistmentMercenaries = `placeEnlistmentMercenaries`,
    PlaceOlwinCards = `placeOlwinCards`,
    PlaceThrudHero = `placeThrudHero`,
    PlaceYludHero = `placeYludHero`,
    StartOrPassEnlistmentMercenaries = `startOrPassEnlistmentMercenaries`,
    UpgradeCoin = `upgradeCoin`,
    VidofnirVedrfolnirAction = `VidofnirVedrfolnirAction`,
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
    PickHero = `Pick hero card`,
    PlaceEnlistmentMercenaries = `Place Enlistment Mercenaries`,
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
    Aegur = `Aegur`,
    Andumia = `Andumia`,
    Aral = `Aral`,
    Astrid = `Astrid`,
    Bonfur = `Bonfur`,
    Dagda = `Dagda`,
    Dwerg_Aesir = `Dwerg Aesir`,
    Dwerg_Bergelmir = `Dwerg Bergelmir`,
    Dwerg_Jungir = `Dwerg Jungir`,
    Dwerg_Sigmir = `Dwerg Sigmir`,
    Dwerg_Ymir = `Dwerg Ymir`,
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
    ShiningHorse = `«Весёлый гоблин»`,
}
