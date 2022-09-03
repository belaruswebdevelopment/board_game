/**
 * <h3>Перечисление для названий режимов игры.</h3>
 */
export var GameModeNames;
(function (GameModeNames) {
    GameModeNames["Basic"] = "Basic";
    GameModeNames["Multiplayer"] = "Multiplayer";
    GameModeNames["Solo1"] = "Solo1";
    GameModeNames["SoloAndvari"] = "Solo Andvari";
})(GameModeNames || (GameModeNames = {}));
/**
 * <h3>Перечисление для названий действий по получению преимущества по фракции.</h3>
 */
export var DistinctionAwardingFunctionNames;
(function (DistinctionAwardingFunctionNames) {
    DistinctionAwardingFunctionNames["BlacksmithDistinctionAwarding"] = "BlacksmithDistinctionAwarding";
    DistinctionAwardingFunctionNames["ExplorerDistinctionAwarding"] = "ExplorerDistinctionAwarding";
    DistinctionAwardingFunctionNames["HunterDistinctionAwarding"] = "HunterDistinctionAwarding";
    DistinctionAwardingFunctionNames["MinerDistinctionAwarding"] = "MinerDistinctionAwarding";
    DistinctionAwardingFunctionNames["WarriorDistinctionAwarding"] = "WarriorDistinctionAwarding";
})(DistinctionAwardingFunctionNames || (DistinctionAwardingFunctionNames = {}));
/**
 * <h3>Перечисление для названий автоматических действий.</h3>
 */
export var AutoActionFunctionNames;
(function (AutoActionFunctionNames) {
    AutoActionFunctionNames["AddPickHeroAction"] = "AddPickHeroAction";
    AutoActionFunctionNames["DiscardTradingCoinAction"] = "DiscardTradingCoinAction";
    AutoActionFunctionNames["FinishOdroerirTheMythicCauldronAction"] = "FinishOdroerirTheMythicCauldronAction";
    AutoActionFunctionNames["GetClosedCoinIntoPlayerHandAction"] = "GetClosedCoinIntoPlayerHandAction";
    AutoActionFunctionNames["StartDiscardSuitCardAction"] = "StartDiscardSuitCardAction";
    AutoActionFunctionNames["StartVidofnirVedrfolnirAction"] = "StartVidofnirVedrfolnirAction";
    AutoActionFunctionNames["UpgradeMinCoinAction"] = "UpgradeMinCoinAction";
})(AutoActionFunctionNames || (AutoActionFunctionNames = {}));
/**
 * <h3>Перечисление для названий действий по получению победных очков по фракции дворфа.</h3>
 */
export var SuitScoringFunctionNames;
(function (SuitScoringFunctionNames) {
    SuitScoringFunctionNames["BlacksmithScoring"] = "BlacksmithScoring";
    SuitScoringFunctionNames["ExplorerScoring"] = "ExplorerScoring";
    SuitScoringFunctionNames["HunterScoring"] = "HunterScoring";
    SuitScoringFunctionNames["MinerScoring"] = "MinerScoring";
    SuitScoringFunctionNames["WarriorScoring"] = "WarriorScoring";
})(SuitScoringFunctionNames || (SuitScoringFunctionNames = {}));
/**
 * <h3>Перечисление для названий действий по получению победных очков по артефакту.</h3>
 */
export var ArtefactScoringFunctionNames;
(function (ArtefactScoringFunctionNames) {
    ArtefactScoringFunctionNames["BasicArtefactScoring"] = "BasicArtefactScoring";
    ArtefactScoringFunctionNames["DraupnirScoring"] = "DraupnirScoring";
    ArtefactScoringFunctionNames["HrafnsmerkiScoring"] = "HrafnsmerkiScoring";
    ArtefactScoringFunctionNames["MjollnirScoring"] = "MjollnirScoring";
    ArtefactScoringFunctionNames["OdroerirTheMythicCauldronScoring"] = "OdroerirTheMythicCauldronScoring";
    ArtefactScoringFunctionNames["SvalinnScoring"] = "SvalinnScoring";
})(ArtefactScoringFunctionNames || (ArtefactScoringFunctionNames = {}));
/**
 * <h3>Перечисление для названий действий по получению победных очков по герою.</h3>
 */
export var HeroScoringFunctionNames;
(function (HeroScoringFunctionNames) {
    HeroScoringFunctionNames["BasicHeroScoring"] = "BasicHeroScoring";
    HeroScoringFunctionNames["AstridScoring"] = "AstridScoring";
    HeroScoringFunctionNames["IdunnScoring"] = "IdunnScoring";
})(HeroScoringFunctionNames || (HeroScoringFunctionNames = {}));
/**
 * <h3>Перечисление для названий действий по получению победных очков по мифическому животному.</h3>
 */
export var MythicalAnimalScoringFunctionNames;
(function (MythicalAnimalScoringFunctionNames) {
    MythicalAnimalScoringFunctionNames["BasicMythicalAnimalScoring"] = "BasicMythicalAnimalScoring";
    MythicalAnimalScoringFunctionNames["GarmScoring"] = "GarmScoring";
    MythicalAnimalScoringFunctionNames["NidhoggScoring"] = "NidhoggScoring";
})(MythicalAnimalScoringFunctionNames || (MythicalAnimalScoringFunctionNames = {}));
/**
 * <h3>Перечисление для названий действий по получению победных очков по гиганту.</h3>
 */
export var GiantScoringFunctionNames;
(function (GiantScoringFunctionNames) {
    GiantScoringFunctionNames["BasicGiantScoring"] = "BasicGiantScoring";
    GiantScoringFunctionNames["GymirScoring"] = "GymirScoring";
    GiantScoringFunctionNames["SurtScoring"] = "SurtScoring";
})(GiantScoringFunctionNames || (GiantScoringFunctionNames = {}));
/**
 * <h3>Перечисление для названий действий по получению победных очков по валькирии.</h3>
 */
export var ValkyryScoringFunctionNames;
(function (ValkyryScoringFunctionNames) {
    ValkyryScoringFunctionNames["BrynhildrScoring"] = "BrynhildrScoring";
    ValkyryScoringFunctionNames["HildrScoring"] = "HildrScoring";
    ValkyryScoringFunctionNames["OlrunScoring"] = "OlrunScoring";
    ValkyryScoringFunctionNames["SigrdrifaScoring"] = "SigrdrifaScoring";
    ValkyryScoringFunctionNames["SvafaScoring"] = "SvafaScoring";
})(ValkyryScoringFunctionNames || (ValkyryScoringFunctionNames = {}));
/**
 * <h3>Перечисление для названий артефактов.</h3>
 */
export var ArtefactNames;
(function (ArtefactNames) {
    ArtefactNames["Brisingamens"] = "Brisingamens";
    ArtefactNames["Draupnir"] = "Draupnir";
    ArtefactNames["Fafnir_Baleygr"] = "Fafnir_Baleygr";
    ArtefactNames["Gjallarhorn"] = "Gjallarhorn";
    ArtefactNames["Hofud"] = "Hofud";
    ArtefactNames["Hrafnsmerki"] = "Hrafnsmerki";
    ArtefactNames["Jarnglofi"] = "Jarnglofi";
    ArtefactNames["Megingjord"] = "Megingjord";
    ArtefactNames["Mjollnir"] = "Mjollnir";
    ArtefactNames["Odroerir_The_Mythic_Cauldron"] = "Odroerir_The_Mythic_Cauldron";
    ArtefactNames["Svalinn"] = "Svalinn";
    ArtefactNames["Vegvisir"] = "Vegvisir";
    ArtefactNames["Vidofnir_Vedrfolnir"] = "Vidofnir_Vedrfolnir";
})(ArtefactNames || (ArtefactNames = {}));
/**
 * <h3>Перечисление для русских названий артефактов.</h3>
 */
export var RusArtefactNames;
(function (RusArtefactNames) {
    RusArtefactNames["Brisingamens"] = "\u0411\u0440\u0438\u0441\u0438\u043D\u0433\u0430\u043C\u0435\u043D";
    RusArtefactNames["Draupnir"] = "\u0414\u0440\u0430\u0443\u043F\u043D\u0438\u0440";
    RusArtefactNames["Fafnir_Baleygr"] = "\u0424\u0430\u0444\u043D\u0438\u0440 \u0411\u0430\u0443\u043B\u0435\u0439\u0433\u0440";
    RusArtefactNames["Gjallarhorn"] = "\u0413\u044C\u044F\u043B\u043B\u0430\u0440\u0445\u043E\u0440\u043D";
    RusArtefactNames["Hofud"] = "\u0425\u0451\u0444\u0443\u0434";
    RusArtefactNames["Hrafnsmerki"] = "\u0425\u0440\u0430\u0444\u043D\u0441\u043C\u0435\u0440\u043A\u0438";
    RusArtefactNames["Jarnglofi"] = "\u042F\u0440\u043D\u0433\u0440\u0435\u0439\u043F\u0440";
    RusArtefactNames["Megingjord"] = "\u041C\u0435\u0433\u0438\u043D\u0433\u044C\u043E\u0440\u0434";
    RusArtefactNames["Mjollnir"] = "\u041C\u044C\u0451\u043B\u043B\u044C\u043D\u0438\u0440";
    RusArtefactNames["Odroerir_The_Mythic_Cauldron"] = "\u041E\u0434\u0440\u0435\u0440\u0438\u0440, \u043C\u0438\u0444\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043A\u043E\u0442\u0435\u043B";
    RusArtefactNames["Svalinn"] = "\u0421\u0432\u0430\u043B\u0438\u043D\u043D";
    RusArtefactNames["Vegvisir"] = "\u0412\u0435\u0433\u0432\u0438\u0441\u0438\u0440";
    RusArtefactNames["Vidofnir_Vedrfolnir"] = "\u0412\u0438\u0434\u043E\u0444\u043D\u0438\u0440 \u0438 \u0412\u0435\u0434\u0440\u0444\u0451\u043B\u044C\u043D\u0438\u0440";
})(RusArtefactNames || (RusArtefactNames = {}));
/**
 * <h3>Перечисление для названия бафов в конфиге.</h3>
 */
export var BuffNames;
(function (BuffNames) {
    BuffNames["CountDistinctionAmount"] = "countDistinctionAmount";
    BuffNames["CountPickedHeroAmount"] = "countPickedHeroAmount";
    BuffNames["DagdaDiscardOnlyOneCards"] = "dagdaDiscardOnlyOneCards";
    BuffNames["DiscardCardEndGame"] = "discardCardEndGame";
    BuffNames["EndTier"] = "endTier";
    BuffNames["EveryTurn"] = "everyTurn";
    BuffNames["GetMjollnirProfit"] = "getMjollnirProfit";
    BuffNames["GoCamp"] = "goCamp";
    BuffNames["GoCampOneTime"] = "goCampOneTime";
    BuffNames["MoveThrud"] = "moveThrud";
    BuffNames["NoHero"] = "noHero";
    BuffNames["RatatoskFinalScoring"] = "ratatoskFinalScoring";
    BuffNames["SuitIdForMjollnir"] = "suitIdForMjollnir";
    BuffNames["UpgradeCoin"] = "upgradeCoin";
    BuffNames["UpgradeNextCoin"] = "upgradeNextCoin";
})(BuffNames || (BuffNames = {}));
/**
 * <h3>Перечисление для названия кнопок.</h3>
 */
export var ButtonNames;
(function (ButtonNames) {
    ButtonNames["NoHeroEasyStrategy"] = "\u0411\u0435\u0437 \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u0445 \u0433\u0435\u0440\u043E\u0435\u0432 (\u043B\u0451\u0433\u043A\u0430\u044F \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F)";
    ButtonNames["NoHeroHardStrategy"] = "\u0411\u0435\u0437 \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u0445 \u0433\u0435\u0440\u043E\u0435\u0432 (\u0441\u043B\u043E\u0436\u043D\u0430\u044F \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F)";
    ButtonNames["WithHeroEasyStrategy"] = "\u0421\u043E \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u043C\u0438 \u0433\u0435\u0440\u043E\u044F\u043C\u0438 (\u043B\u0451\u0433\u043A\u0430\u044F \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F)";
    ButtonNames["WithHeroHardStrategy"] = "\u0421\u043E \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u043C\u0438 \u0433\u0435\u0440\u043E\u044F\u043C\u0438 (\u0441\u043B\u043E\u0436\u043D\u0430\u044F \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F)";
    ButtonNames["Pass"] = "\u041F\u0430\u0441";
    ButtonNames["Start"] = "\u0421\u0442\u0430\u0440\u0442";
})(ButtonNames || (ButtonNames = {}));
/**
 * <h3>Перечисление для названия мультифракционных карт.</h3>
 */
export var MultiSuitCardNames;
(function (MultiSuitCardNames) {
    MultiSuitCardNames["Gullinbursti"] = "Gullinbursti";
    MultiSuitCardNames["OlwinsDouble"] = "OlwinsDouble";
})(MultiSuitCardNames || (MultiSuitCardNames = {}));
/**
 * <h3>Перечисление для русских названий мультифракционных карт.</h3>
 */
export var RusMultiSuitCardNames;
(function (RusMultiSuitCardNames) {
    RusMultiSuitCardNames["Gullinbursti"] = "\u0413\u0443\u043B\u043B\u0438\u043D\u0431\u0443\u0440\u0441\u0442\u0438";
    RusMultiSuitCardNames["OlwinsDouble"] = "\u0414\u0432\u043E\u0439\u043D\u0438\u043A \u041E\u043B\u044C\u0432\u044E\u043D\u0430";
})(RusMultiSuitCardNames || (RusMultiSuitCardNames = {}));
/**
 * <h3>Перечисление для названия особых карт.</h3>
 */
export var SpecialCardNames;
(function (SpecialCardNames) {
    SpecialCardNames["ChiefBlacksmith"] = "ChiefBlacksmith";
})(SpecialCardNames || (SpecialCardNames = {}));
/**
 * <h3>Перечисление для русских названий особых карт.</h3>
 */
export var RusSpecialCardNames;
(function (RusSpecialCardNames) {
    RusSpecialCardNames["ChiefBlacksmith"] = "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u043A\u0443\u0437\u043D\u0435\u0446";
})(RusSpecialCardNames || (RusSpecialCardNames = {}));
/**
 * <h3>Перечисление для названия типов монет.</h3>
 */
export var CoinTypeNames;
(function (CoinTypeNames) {
    CoinTypeNames["Hand"] = "\u0420\u0443\u043A\u0430";
    CoinTypeNames["Board"] = "\u0421\u0442\u043E\u043B";
})(CoinTypeNames || (CoinTypeNames = {}));
/**
 * <h3>Перечисление для названия отображения действий в конфиге.</h3>
 */
export var ConfigNames;
(function (ConfigNames) {
    ConfigNames["ChooseCoinValueForVidofnirVedrfolnirUpgrade"] = "chooseCoinValueForVidofnirVedrfolnirUpgrade";
    ConfigNames["ChooseStrategyLevelForSoloModeAndvari"] = "ChooseStrategyLevelForSoloModeAndvari";
    ConfigNames["ChooseStrategyVariantLevelForSoloModeAndvari"] = "ChooseStrategyVariantLevelForSoloModeAndvari";
    ConfigNames["ExplorerDistinction"] = "explorerDistinction";
    ConfigNames["GetDifficultyLevelForSoloMode"] = "getDifficultyLevelForSoloMode";
    ConfigNames["GetHeroesForSoloMode"] = "getHeroesForSoloMode";
    ConfigNames["StartOrPassEnlistmentMercenaries"] = "startOrPassEnlistmentMercenaries";
})(ConfigNames || (ConfigNames = {}));
/**
 * <h3>Перечисление для описаний отображения действий.</h3>
 */
export var DrawNames;
(function (DrawNames) {
    // TODO Give normal names to all?!
    DrawNames["AddCoinToPouchVidofnirVedrfolnir"] = "Add coin to pouch Vidofnir Vedrfolnir";
    DrawNames["Andumia"] = "Andumia";
    DrawNames["Bonfur"] = "Bonfur";
    DrawNames["Brisingamens"] = "Brisingamens";
    DrawNames["BrisingamensEndGame"] = "Brisingamens end game";
    DrawNames["ChooseStrategyLevelForSoloModeAndvari"] = "Choose strategy level for solo mode Andvari";
    DrawNames["ChooseStrategyVariantLevelForSoloModeAndvari"] = "Choose strategy variant level for solo mode Andvari";
    DrawNames["CrovaxTheDoppelganger"] = "Crovax the Doppelganger";
    DrawNames["Dagda"] = "Dagda";
    DrawNames["DiscardTavernCard"] = "Discard tavern card";
    DrawNames["EnlistmentMercenaries"] = "Enlistment Mercenaries";
    DrawNames["Mjollnir"] = "Mjollnir";
    DrawNames["GetDifficultyLevelForSoloMode"] = "Get difficulty level for Solo mode";
    DrawNames["GetHeroesForSoloMode"] = "Get heroes for Solo mode";
    DrawNames["GetMjollnirProfit"] = "Get Mjollnir profit";
    DrawNames["Hofud"] = "Hofud";
    DrawNames["Holda"] = "Holda";
    DrawNames["PlaceMultiSuitsCards"] = "Place multi suits cards";
    DrawNames["PickCard"] = "Pick card or camp card";
    DrawNames["PickCardSoloBot"] = "Pick card or camp card Solo Bot";
    DrawNames["PickCardSoloBotAndvari"] = "Pick card or camp card Solo Bot Andvari";
    DrawNames["PickCardByExplorerDistinction"] = "Pick card by Explorer distinction";
    DrawNames["PickCardByExplorerDistinctionSoloBot"] = "Pick card by Explorer distinction Solo Bot";
    DrawNames["PickCardByExplorerDistinctionSoloBotAndvari"] = "Pick card by Explorer distinction Solo Bot Andvari";
    DrawNames["PickConcreteCoinToUpgrade"] = "Pick concrete coin to upgrade";
    DrawNames["PickHero"] = "Pick hero card";
    DrawNames["PickHeroSoloBot"] = "Pick hero card Solo Bot";
    DrawNames["PickHeroSoloBotAndvari"] = "Pick hero card Solo Bot Andvari";
    DrawNames["PlaceEnlistmentMercenaries"] = "Place Enlistment Mercenaries";
    DrawNames["PlaceTradingCoinsUline"] = "Place Trading Coins Uline";
    DrawNames["PlaceYludHero"] = "Place Ylud";
    DrawNames["PlaceYludHeroSoloBot"] = "Place Ylud Solo Bot";
    DrawNames["PlaceYludHeroSoloBotAndvari"] = "Place Ylud Solo Bot Andvari";
    DrawNames["StartChooseCoinValueForVidofnirVedrfolnirUpgrade"] = "Start choose coin value for Vidofnir Vedrfolnir upgrade";
    DrawNames["StartOrPassEnlistmentMercenaries"] = "Start or Pass Enlistment Mercenaries";
    DrawNames["PlaceThrudHero"] = "Place Thrud Hero";
    DrawNames["PlaceThrudHeroSoloBot"] = "Place Thrud Hero Solo Bot";
    DrawNames["PlaceThrudHeroSoloBotAndvari"] = "Place Thrud Hero Solo Bot Andvari";
    DrawNames["UpgradeCoin"] = "Upgrade coin";
    DrawNames["UpgradeCoinSoloBot"] = "Upgrade coin Solo Bot";
    DrawNames["UpgradeCoinSoloBotAndvari"] = "Upgrade coin Solo Bot Andvari";
    DrawNames["UpgradeCoinVidofnirVedrfolnir"] = "Upgrade coin Vidofnir Vedrfolnir";
    DrawNames["UpgradeCoinWarriorDistinction"] = "Upgrade coin Warrior distinction";
    DrawNames["UpgradeCoinWarriorDistinctionSoloBot"] = "Upgrade coin Warrior distinction Solo Bot";
    DrawNames["UpgradeCoinWarriorDistinctionSoloBotAndvari"] = "Upgrade coin Warrior distinction Solo Bot Andvari";
})(DrawNames || (DrawNames = {}));
/**
 * <h3>Перечисление для названий ошибок.</h3>
 */
export var ErrorNames;
(function (ErrorNames) {
    ErrorNames["CurrentTierDeckIsUndefined"] = "CurrentTierDeckIsUndefined";
    ErrorNames["CurrentPrivatePlayerIsUndefined"] = "CurrentPrivatePlayerIsUndefined";
    ErrorNames["CurrentPublicPlayerIsUndefined"] = "CurrentPublicPlayerIsUndefined";
    ErrorNames["CurrentSuitDistinctionPlayerIndexIsUndefined"] = "CurrentSuitDistinctionPlayerIndexIsUndefined";
    ErrorNames["DeckIsUndefined"] = "DeckIsUndefined";
    ErrorNames["DoNotDiscardCardFromCurrentTavernIfCardWithCurrentIdIsUndefined"] = "DoNotDiscardCardFromCurrentTavernIfCardWithCurrentIdIsUndefined";
    ErrorNames["DoNotDiscardCardFromCurrentTavernIfNoCardInTavern"] = "DoNotDiscardCardFromCurrentTavernIfNoCardInTavern";
    ErrorNames["DoNotDiscardCardFromTavernInSoloOrTwoPlayersGame"] = "DoNotDiscardCardFromTavernInSoloOrTwoPlayersGame";
    ErrorNames["FirstStackActionIsUndefined"] = "FirstStackActionIsUndefined";
    ErrorNames["NoCardsToDiscardWhenNoWinnerInExplorerDistinction"] = "NoCardsToDiscardWhenNoWinnerInExplorerDistinction";
    ErrorNames["OnlyInSoloOrTwoPlayersGame"] = "OnlyInSoloOrTwoPlayersGame";
    ErrorNames["PlayersCurrentSuitCardsMustHaveCardsForDistinction"] = "PlayersCurrentSuitCardsMustHaveCardsForDistinction";
    ErrorNames["PlayersCurrentSuitRanksArrayMustHavePlayerWithMostRankCount"] = "PlayersCurrentSuitRanksArrayMustHavePlayerWithMostRankCount";
    ErrorNames["PrivatePlayerWithCurrentIdIsUndefined"] = "PrivatePlayerWithCurrentIdIsUndefined";
    ErrorNames["PublicPlayerWithCurrentIdIsUndefined"] = "PublicPlayerWithCurrentIdIsUndefined";
    ErrorNames["SuitDistinctionMustBePresent"] = "SuitDistinctionMustBePresent";
    ErrorNames["TavernCanNotBeRefilledBecauseNotEnoughCards"] = "TavernCanNotBeRefilledBecauseNotEnoughCards";
})(ErrorNames || (ErrorNames = {}));
/**
 * <h3>Перечисление для названия игры и дополнений.</h3>
 */
export var GameNames;
(function (GameNames) {
    GameNames["basic"] = "basic";
    GameNames["idavoll"] = "idavoll";
    GameNames["thingvellir"] = "thingvellir";
})(GameNames || (GameNames = {}));
/**
 * <h3>Перечисление для названия Гигантов.</h3>
 */
export var GiantNames;
(function (GiantNames) {
    GiantNames["Gymir"] = "Gymir";
    GiantNames["Hrungnir"] = "Hrungnir";
    GiantNames["Skymir"] = "Skymir";
    GiantNames["Surt"] = "Surt";
    GiantNames["Thrivaldi"] = "Thrivaldi";
})(GiantNames || (GiantNames = {}));
/**
 * <h3>Перечисление для русских названия Гигантов.</h3>
 */
export var RusGiantNames;
(function (RusGiantNames) {
    RusGiantNames["Gymir"] = "\u0413\u044E\u043C\u0438\u0440";
    RusGiantNames["Hrungnir"] = "\u0413\u0440\u0443\u043D\u0433\u043D\u0438\u0440";
    RusGiantNames["Skymir"] = "\u0421\u043A\u0430\u0439\u043C\u0438\u0440";
    RusGiantNames["Surt"] = "\u0421\u0443\u0440\u0442";
    RusGiantNames["Thrivaldi"] = "\u0422\u0440\u0438\u0432\u0430\u043B\u044C\u0434\u0438";
})(RusGiantNames || (RusGiantNames = {}));
/**
 * <h3>Перечисление для названия Богов.</h3>
 */
export var GodNames;
(function (GodNames) {
    GodNames["Freyja"] = "Freyja";
    GodNames["Frigg"] = "Frigg";
    GodNames["Loki"] = "Loki";
    GodNames["Odin"] = "Odin";
    GodNames["Thor"] = "Thor";
})(GodNames || (GodNames = {}));
/**
 * <h3>Перечисление для русских названий Богов.</h3>
 */
export var RusGodNames;
(function (RusGodNames) {
    RusGodNames["Freyja"] = "\u0424\u0440\u0435\u0439\u044F";
    RusGodNames["Frigg"] = "\u0424\u0440\u0438\u0433\u0433";
    RusGodNames["Loki"] = "\u041B\u043E\u043A\u0438";
    RusGodNames["Odin"] = "\u041E\u0434\u0438\u043D";
    RusGodNames["Thor"] = "\u0422\u043E\u0440";
})(RusGodNames || (RusGodNames = {}));
/**
 * <h3>Перечисление для названия Мифических животных.</h3>
 */
export var MythicalAnimalNames;
(function (MythicalAnimalNames) {
    MythicalAnimalNames["Durathor"] = "Durathor";
    MythicalAnimalNames["Garm"] = "Garm";
    MythicalAnimalNames["Hraesvelg"] = "Hraesvelg";
    MythicalAnimalNames["Nidhogg"] = "Nidhogg";
    MythicalAnimalNames["Ratatosk"] = "Ratatosk";
})(MythicalAnimalNames || (MythicalAnimalNames = {}));
/**
 * <h3>Перечисление для русских названий Мифических животных.</h3>
 */
export var RusMythicalAnimalNames;
(function (RusMythicalAnimalNames) {
    RusMythicalAnimalNames["Durathor"] = "\u0414\u0443\u0440\u0430\u0442\u043E\u0440";
    RusMythicalAnimalNames["Garm"] = "\u0413\u0430\u0440\u043C";
    RusMythicalAnimalNames["Hraesvelg"] = "\u0425\u0440\u044D\u0441\u0432\u0435\u043B\u0433";
    RusMythicalAnimalNames["Nidhogg"] = "\u041D\u0438\u0434\u0445\u043E\u0433\u0433";
    RusMythicalAnimalNames["Ratatosk"] = "\u0420\u0430\u0442\u0430\u0442\u043E\u0441\u043A";
})(RusMythicalAnimalNames || (RusMythicalAnimalNames = {}));
/**
 * <h3>Перечисление для названия Мифических животных.</h3>
 */
export var ValkyryNames;
(function (ValkyryNames) {
    ValkyryNames["Brynhildr"] = "Brynhildr";
    ValkyryNames["Hildr"] = "Hildr";
    ValkyryNames["Olrun"] = "Olrun";
    ValkyryNames["Sigrdrifa"] = "Sigrdrifa";
    ValkyryNames["Svafa"] = "Svafa";
})(ValkyryNames || (ValkyryNames = {}));
/**
 * <h3>Перечисление для русских названия Мифических животных.</h3>
 */
export var RusValkyryNames;
(function (RusValkyryNames) {
    RusValkyryNames["Brynhildr"] = "\u0411\u0440\u044E\u043D\u0445\u0438\u043B\u044C\u0434\u0430";
    RusValkyryNames["Hildr"] = "\u0425\u0438\u043B\u044C\u0434";
    RusValkyryNames["Olrun"] = "\u041E\u043B\u044C\u0440\u0443\u043D";
    RusValkyryNames["Sigrdrifa"] = "\u0421\u0438\u0433\u0440\u0434\u0440\u0438\u0432\u0430";
    RusValkyryNames["Svafa"] = "\u0421\u0432\u0430\u0432\u0430";
})(RusValkyryNames || (RusValkyryNames = {}));
/**
 * <h3>Перечисление для названий героев.</h3>
 */
export var HeroNames;
(function (HeroNames) {
    HeroNames["Aegur"] = "Aegur";
    HeroNames["Andumia"] = "Andumia";
    HeroNames["Aral"] = "Aral";
    HeroNames["Astrid"] = "Astrid";
    HeroNames["Bonfur"] = "Bonfur";
    HeroNames["Crovax_The_Doppelganger"] = "Crovax_The_Doppelganger";
    HeroNames["Dagda"] = "Dagda";
    HeroNames["Dwerg_Aesir"] = "Dwerg_Aesir";
    HeroNames["Dwerg_Bergelmir"] = "Dwerg_Bergelmir";
    HeroNames["Dwerg_Jungir"] = "Dwerg_Jungir";
    HeroNames["Dwerg_Sigmir"] = "Dwerg_Sigmir";
    HeroNames["Dwerg_Ymir"] = "Dwerg_Ymir";
    HeroNames["Grid"] = "Grid";
    HeroNames["Holda"] = "Holda";
    HeroNames["Hourya"] = "Hourya";
    HeroNames["Idunn"] = "Idunn";
    HeroNames["Jarika"] = "Jarika";
    HeroNames["Khrad"] = "Khrad";
    HeroNames["Kraal"] = "Kraal";
    HeroNames["Lokdur"] = "Lokdur";
    HeroNames["Olwin"] = "Olwin";
    HeroNames["Skaa"] = "Skaa";
    HeroNames["Tarah"] = "Tarah";
    HeroNames["Thrud"] = "Thrud";
    HeroNames["Uline"] = "Uline";
    HeroNames["Ylud"] = "Ylud";
    HeroNames["Zolkur"] = "Zolkur";
    HeroNames["Zoral"] = "Zoral";
})(HeroNames || (HeroNames = {}));
/**
 * <h3>Перечисление для русских названий героев.</h3>
 */
export var RusHeroNames;
(function (RusHeroNames) {
    RusHeroNames["Aegur"] = "\u042D\u0433\u0443\u0440 \u0421\u0442\u0430\u043B\u044C\u043D\u043E\u0439 \u043A\u0443\u043B\u0430\u043A";
    RusHeroNames["Andumia"] = "\u0410\u043D\u043D\u0443\u043C\u0438\u044F \u041D\u0435\u043A\u0440\u043E\u043C\u0430\u043D\u0442";
    RusHeroNames["Aral"] = "\u0410\u0440\u0430\u043B \u041E\u0440\u043B\u0438\u043D\u044B\u0439 \u043A\u043E\u0433\u043E\u0442\u044C";
    RusHeroNames["Astrid"] = "\u0410\u0441\u0442\u0440\u0438\u0434 \u0411\u043E\u0433\u0430\u0442\u0430\u044F";
    RusHeroNames["Bonfur"] = "\u0411\u043E\u043D\u0444\u0443\u0440 \u0416\u0435\u0441\u0442\u043E\u043A\u0438\u0439";
    RusHeroNames["Crovax_The_Doppelganger"] = "\u041A\u0440\u043E\u0432\u0430\u043A\u0441 \u0414\u0432\u043E\u0439\u043D\u0438\u043A";
    RusHeroNames["Dagda"] = "\u0414\u0430\u0433\u0434\u0430 \u0412\u0441\u043F\u044B\u043B\u044C\u0447\u0438\u0432\u0430\u044F";
    RusHeroNames["Dwerg_Aesir"] = "\u0414\u0432\u0435\u0440\u0433 \u042D\u0441\u0438\u0440";
    RusHeroNames["Dwerg_Bergelmir"] = "\u0414\u0432\u0435\u0440\u0433 \u0411\u0435\u0440\u0433\u0435\u043B\u044C\u043C\u0438\u0440";
    RusHeroNames["Dwerg_Jungir"] = "\u0414\u0432\u0435\u0440\u0433 \u042E\u043C\u0433\u0438\u0440";
    RusHeroNames["Dwerg_Sigmir"] = "\u0414\u0432\u0435\u0440\u0433 \u0421\u0438\u0433\u043C\u0438\u0440";
    RusHeroNames["Dwerg_Ymir"] = "\u0414\u0432\u0435\u0440\u0433 \u0418\u043C\u0438\u0440";
    RusHeroNames["Grid"] = "\u0413\u0440\u0438\u0434 \u0420\u0430\u0441\u0447\u0451\u0442\u043B\u0438\u0432\u0430\u044F";
    RusHeroNames["Holda"] = "\u0425\u043E\u043B\u044C\u0434\u0430 \u041C\u0435\u043D\u0435\u0441\u0442\u0440\u0435\u043B\u044C";
    RusHeroNames["Hourya"] = "\u0425\u0443\u0440\u0438\u044F \u041D\u0435\u0443\u043B\u043E\u0432\u0438\u043C\u0430\u044F";
    RusHeroNames["Idunn"] = "\u0418\u0434\u0443\u043D\u043D \u041D\u0435\u0437\u0430\u043C\u0435\u0442\u043D\u0430\u044F";
    RusHeroNames["Jarika"] = "\u042F\u0440\u0438\u043A\u0430 \u0428\u0435\u043B\u044C\u043C\u0430";
    RusHeroNames["Khrad"] = "\u041A\u0440\u0430\u0434 \u041F\u043B\u0443\u0442";
    RusHeroNames["Kraal"] = "\u041A\u0440\u043E\u043B \u041D\u0430\u0451\u043C\u043D\u0438\u043A";
    RusHeroNames["Lokdur"] = "\u041B\u043E\u043A\u0434\u0443\u0440 \u041A\u043E\u0440\u044B\u0441\u0442\u043E\u043B\u044E\u0431\u0438\u0432\u044B\u0439";
    RusHeroNames["Olwin"] = "\u041E\u043B\u044C\u0432\u044E\u043D \u041C\u043D\u043E\u0433\u043E\u043B\u0438\u043A\u0438\u0439";
    RusHeroNames["Skaa"] = "\u0421\u043A\u043E \u041D\u0435\u043F\u043E\u0441\u0442\u0438\u0436\u0438\u043C\u0430\u044F";
    RusHeroNames["Tarah"] = "\u0422\u0430\u0440\u0430 \u0421\u043C\u0435\u0440\u0442\u043E\u043D\u043E\u0441\u043D\u0430\u044F";
    RusHeroNames["Thrud"] = "\u0422\u0440\u0443\u0434 \u041E\u0445\u043E\u0442\u043D\u0438\u0446\u0430 \u0437\u0430 \u0433\u043E\u043B\u043E\u0432\u0430\u043C\u0438";
    RusHeroNames["Uline"] = "\u0423\u043B\u0438\u043D\u0430 \u042F\u0441\u043D\u043E\u0432\u0438\u0434\u044F\u0449\u0430\u044F";
    RusHeroNames["Ylud"] = "\u0418\u043B\u0443\u0434 \u041D\u0435\u043F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u0443\u0435\u043C\u0430\u044F";
    RusHeroNames["Zolkur"] = "\u0421\u043E\u043B\u044C\u043A\u0443\u0440 \u0416\u0430\u0434\u043D\u044B\u0439";
    RusHeroNames["Zoral"] = "\u0417\u043E\u0440\u0430\u043B \u041C\u0430\u0441\u0442\u0435\u0440";
})(RusHeroNames || (RusHeroNames = {}));
/**
 * <h3>Перечисление для типов логов.</h3>
 */
export var LogTypeNames;
(function (LogTypeNames) {
    LogTypeNames["Game"] = "game";
    LogTypeNames["Private"] = "private";
    LogTypeNames["Public"] = "public";
})(LogTypeNames || (LogTypeNames = {}));
/**
 * <h3>Перечисление для описаний отображения действий на кнопках.</h3>
 */
export var ButtonMoveNames;
(function (ButtonMoveNames) {
    ButtonMoveNames["PassEnlistmentMercenariesMove"] = "PassEnlistmentMercenariesMove";
    ButtonMoveNames["StartEnlistmentMercenariesMove"] = "StartEnlistmentMercenariesMove";
    // start
    ButtonMoveNames["ChooseCoinValueForVidofnirVedrfolnirUpgradeMove"] = "ChooseCoinValueForVidofnirVedrfolnirUpgradeMove";
    // Solo Mode
    ButtonMoveNames["ChooseDifficultyLevelForSoloModeMove"] = "ChooseDifficultyLevelForSoloModeMove";
    // Solo Mode Andvari
    ButtonMoveNames["ChooseStrategyForSoloModeAndvariMove"] = "ChooseStrategyForSoloModeAndvariMove";
    ButtonMoveNames["ChooseStrategyVariantForSoloModeAndvariMove"] = "ChooseStrategyVariantForSoloModeAndvariMove";
})(ButtonMoveNames || (ButtonMoveNames = {}));
/**
 * <h3>Перечисление для описаний отображения действий на картах.</h3>
 */
export var CardMoveNames;
(function (CardMoveNames) {
    CardMoveNames["ClickCardMove"] = "ClickCardMove";
    CardMoveNames["ClickCardToPickDistinctionMove"] = "ClickCardToPickDistinctionMove";
    CardMoveNames["ClickCampCardMove"] = "ClickCampCardMove";
    CardMoveNames["ClickDistinctionCardMove"] = "ClickDistinctionCardMove";
    CardMoveNames["DiscardCardFromPlayerBoardMove"] = "DiscardCardFromPlayerBoardMove";
    CardMoveNames["GetEnlistmentMercenariesMove"] = "GetEnlistmentMercenariesMove";
    // start
    CardMoveNames["ClickCampCardHoldaMove"] = "ClickCampCardHoldaMove";
    CardMoveNames["ClickHeroCardMove"] = "ClickHeroCardMove";
    CardMoveNames["DiscardCardMove"] = "DiscardCardMove";
    CardMoveNames["DiscardCard2PlayersMove"] = "DiscardCard2PlayersMove";
    CardMoveNames["DiscardSuitCardFromPlayerBoardMove"] = "DiscardSuitCardFromPlayerBoardMove";
    CardMoveNames["PickDiscardCardMove"] = "PickDiscardCardMove";
    // TODO Is it here?
    CardMoveNames["UseGodCardPowerMove"] = "UseGodCardPowerMove";
    // Solo Mode
    CardMoveNames["ChooseHeroForDifficultySoloModeMove"] = "ChooseHeroForDifficultySoloModeMove";
    // Solo Bot
    CardMoveNames["SoloBotClickCardMove"] = "SoloBotClickCardMove";
    CardMoveNames["SoloBotClickHeroCardMove"] = "SoloBotClickHeroCardMove";
    CardMoveNames["SoloBotClickCardToPickDistinctionMove"] = "SoloBotClickCardToPickDistinctionMove";
    // Solo Bot Andvari
    CardMoveNames["SoloBotAndvariClickCardMove"] = "SoloBotAndvariClickCardMove";
    CardMoveNames["SoloBotAndvariClickHeroCardMove"] = "SoloBotAndvariClickHeroCardMove";
    CardMoveNames["SoloBotAndvariClickCardToPickDistinctionMove"] = "SoloBotAndvariClickCardToPickDistinctionMove";
})(CardMoveNames || (CardMoveNames = {}));
/**
 * <h3>Перечисление для описаний отображения действий на монетах.</h3>
 */
export var CoinMoveNames;
(function (CoinMoveNames) {
    CoinMoveNames["ClickBoardCoinMove"] = "ClickBoardCoinMove";
    CoinMoveNames["ClickHandCoinMove"] = "ClickHandCoinMove";
    CoinMoveNames["ClickHandCoinUlineMove"] = "ClickHandCoinUlineMove";
    CoinMoveNames["ClickHandTradingCoinUlineMove"] = "ClickHandTradingCoinUlineMove";
    // Start
    CoinMoveNames["AddCoinToPouchMove"] = "AddCoinToPouchMove";
    CoinMoveNames["ClickCoinToUpgradeMove"] = "ClickCoinToUpgradeMove";
    CoinMoveNames["ClickConcreteCoinToUpgradeMove"] = "ClickConcreteCoinToUpgradeMove";
    CoinMoveNames["UpgradeCoinVidofnirVedrfolnirMove"] = "UpgradeCoinVidofnirVedrfolnirMove";
    // Solo Bot
    CoinMoveNames["SoloBotClickCoinToUpgradeMove"] = "SoloBotClickCoinToUpgradeMove";
    // Solo Bot Andvari
    CoinMoveNames["SoloBotAndvariClickCoinToUpgradeMove"] = "SoloBotAndvariClickCoinToUpgradeMove";
})(CoinMoveNames || (CoinMoveNames = {}));
/**
 * <h3>Перечисление для описаний отображения действий на пустых ячейках для карт.</h3>
 */
export var EmptyCardMoveNames;
(function (EmptyCardMoveNames) {
    EmptyCardMoveNames["PlaceEnlistmentMercenariesMove"] = "PlaceEnlistmentMercenariesMove";
    EmptyCardMoveNames["PlaceYludHeroMove"] = "PlaceYludHeroMove";
    // Start
    EmptyCardMoveNames["PlaceMultiSuitCardMove"] = "PlaceMultiSuitCardMove";
    EmptyCardMoveNames["PlaceThrudHeroMove"] = "PlaceThrudHeroMove";
    // Solo Bot
    EmptyCardMoveNames["SoloBotPlaceThrudHeroMove"] = "SoloBotPlaceThrudHeroMove";
    EmptyCardMoveNames["SoloBotPlaceYludHeroMove"] = "SoloBotPlaceYludHeroMove";
    // Solo Bot Andvari
    EmptyCardMoveNames["SoloBotAndvariPlaceThrudHeroMove"] = "SoloBotAndvariPlaceThrudHeroMove";
    EmptyCardMoveNames["SoloBotAndvariPlaceYludHeroMove"] = "SoloBotAndvariPlaceYludHeroMove";
})(EmptyCardMoveNames || (EmptyCardMoveNames = {}));
/**
 * <h3>Перечисление для описаний отображения действий на фракциях дворфов.</h3>
 */
export var SuitMoveNames;
(function (SuitMoveNames) {
    SuitMoveNames["GetMjollnirProfitMove"] = "GetMjollnirProfitMove";
})(SuitMoveNames || (SuitMoveNames = {}));
/**
 * <h3>Перечисление для описаний отображения действий.</h3>
 */
export var AutoBotsMoveNames;
(function (AutoBotsMoveNames) {
    // Bots
    AutoBotsMoveNames["BotsPlaceAllCoinsMove"] = "BotsPlaceAllCoinsMove";
    // Solo Bot
    AutoBotsMoveNames["SoloBotPlaceAllCoinsMove"] = "SoloBotPlaceAllCoinsMove";
    //Solo Bot Andvari
    AutoBotsMoveNames["SoloBotAndvariPlaceAllCoinsMove"] = "SoloBotAndvariPlaceAllCoinsMove";
})(AutoBotsMoveNames || (AutoBotsMoveNames = {}));
/**
 * <h3>Перечисление для фаз игры.</h3>
 */
export var PhaseNames;
(function (PhaseNames) {
    PhaseNames["BrisingamensEndGame"] = "brisingamensEndGame";
    PhaseNames["ChooseDifficultySoloMode"] = "chooseDifficultySoloMode";
    PhaseNames["ChooseDifficultySoloModeAndvari"] = "chooseDifficultySoloModeAndvari";
    PhaseNames["PlaceYlud"] = "placeYlud";
    PhaseNames["EnlistmentMercenaries"] = "enlistmentMercenaries";
    PhaseNames["TroopEvaluation"] = "troopEvaluation";
    PhaseNames["GetMjollnirProfit"] = "getMjollnirProfit";
    PhaseNames["TavernsResolution"] = "tavernsResolution";
    PhaseNames["Bids"] = "bids";
    PhaseNames["BidUline"] = "bidUline";
})(PhaseNames || (PhaseNames = {}));
/**
 * <h3>Перечисление для фаз игры на русском.</h3>
 */
export var RusPhaseNames;
(function (RusPhaseNames) {
    RusPhaseNames["brisingamensEndGame"] = "brisingamensEndGame";
    RusPhaseNames["chooseDifficultySoloMode"] = "\u0412\u044B\u0431\u043E\u0440 \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u0441\u043E\u043B\u043E \u0440\u0435\u0436\u0438\u043C\u0430";
    RusPhaseNames["chooseDifficultySoloModeAndvari"] = "\u0412\u044B\u0431\u043E\u0440 \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u0441\u043E\u043B\u043E \u0440\u0435\u0436\u0438\u043C\u0430 \u0410\u043D\u0434\u0432\u0430\u0440\u0438";
    RusPhaseNames["placeYlud"] = "\u041F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u0418\u043B\u0443\u0434";
    RusPhaseNames["enlistmentMercenaries"] = "enlistmentMercenaries";
    RusPhaseNames["troopEvaluation"] = "\u0421\u043C\u043E\u0442\u0440 \u0432\u043E\u0439\u0441\u043A";
    RusPhaseNames["getMjollnirProfit"] = "getMjollnirProfit";
    RusPhaseNames["tavernsResolution"] = "\u041F\u043E\u0441\u0435\u0449\u0435\u043D\u0438\u0435 \u0442\u0430\u0432\u0435\u0440\u043D";
    RusPhaseNames["bids"] = "\u0421\u0442\u0430\u0432\u043A\u0438";
    RusPhaseNames["bidUline"] = "\u0421\u0442\u0430\u0432\u043A\u0438 \u0423\u043B\u0438\u043D\u0430";
})(RusPhaseNames || (RusPhaseNames = {}));
// TODO Add `card` to = card description `Карта 'Королевская награда'`?
/**
 * <h3>Перечисление для типов карт на русском.</h3>
 */
export var RusCardTypeNames;
(function (RusCardTypeNames) {
    RusCardTypeNames["Royal_Offering_Card"] = "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u043A\u0430\u044F \u043D\u0430\u0433\u0440\u0430\u0434\u0430";
    RusCardTypeNames["Artefact_Card"] = "\u0410\u0440\u0442\u0435\u0444\u0430\u043A\u0442";
    RusCardTypeNames["Artefact_Player_Card"] = "\u0410\u0440\u0442\u0435\u0444\u0430\u043A\u0442 \u043D\u0430 \u043F\u043E\u043B\u0435 \u0438\u0433\u0440\u043E\u043A\u0430";
    RusCardTypeNames["Dwarf_Card"] = "\u0414\u0432\u043E\u0440\u0444";
    RusCardTypeNames["Giant_Card"] = "\u0413\u0438\u0433\u0430\u043D\u0442";
    RusCardTypeNames["God_Card"] = "\u0411\u043E\u0433";
    RusCardTypeNames["Hero_Card"] = "\u0413\u0435\u0440\u043E\u0439";
    RusCardTypeNames["Hero_Player_Card"] = "\u0413\u0435\u0440\u043E\u0439 \u043D\u0430 \u043F\u043E\u043B\u0435 \u0438\u0433\u0440\u043E\u043A\u0430";
    RusCardTypeNames["Mercenary_Card"] = "\u041D\u0430\u0451\u043C\u043D\u0438\u043A";
    RusCardTypeNames["Mercenary_Player_Card"] = "\u041D\u0430\u0451\u043C\u043D\u0438\u043A \u043D\u0430 \u043F\u043E\u043B\u0435 \u0438\u0433\u0440\u043E\u043A\u0430";
    RusCardTypeNames["Multi_Suit_Card"] = "\u041C\u0443\u043B\u044C\u0442\u0438\u0444\u0440\u0430\u043A\u0446\u0438\u043E\u043D\u043D\u0430\u044F";
    RusCardTypeNames["Multi_Suit_Player_Card"] = "\u041C\u0443\u043B\u044C\u0442\u0438\u0444\u0440\u0430\u043A\u0446\u0438\u043E\u043D\u043D\u0430\u044F \u043A\u0430\u0440\u0442\u0430 \u043D\u0430 \u043F\u043E\u043B\u0435 \u0438\u0433\u0440\u043E\u043A\u0430";
    RusCardTypeNames["Mythical_Animal_Card"] = "\u041C\u0438\u0444\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0436\u0438\u0432\u043E\u0442\u043D\u043E\u0435";
    RusCardTypeNames["Special_Card"] = "\u041E\u0441\u043E\u0431\u0430\u044F";
    RusCardTypeNames["Valkyry_Card"] = "\u0412\u0430\u043B\u044C\u043A\u0438\u0440\u0438\u044F";
    // Common
    RusCardTypeNames["Player_Board_Card"] = "\u041A\u0430\u0440\u0442\u0430 \u043D\u0430 \u043F\u043E\u043B\u0435 \u0438\u0433\u0440\u043E\u043A\u0430";
    RusCardTypeNames["Command_Zone_Hero_Card"] = "\u041A\u0430\u0440\u0442\u0430 \u0433\u0435\u0440\u043E\u044F \u0432 \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u043E\u0439 \u0437\u043E\u043D\u0435 \u0438\u0433\u0440\u043E\u043A\u0430";
    RusCardTypeNames["Command_Zone_Camp_Card"] = "\u041A\u0430\u0440\u0442\u0430 \u043B\u0430\u0433\u0435\u0440\u044F \u0432 \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u043E\u0439 \u0437\u043E\u043D\u0435 \u0438\u0433\u0440\u043E\u043A\u0430";
    RusCardTypeNames["Command_Zone_Mythological_Creature_Card"] = "\u041A\u0430\u0440\u0442\u0430 \u043C\u0438\u0444\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0430 \u0432 \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u043E\u0439 \u0437\u043E\u043D\u0435 \u0438\u0433\u0440\u043E\u043A\u0430";
})(RusCardTypeNames || (RusCardTypeNames = {}));
/**
 * <h3>Перечисление для русских названий фракций.</h3>
 */
export var RusSuitNames;
(function (RusSuitNames) {
    RusSuitNames["blacksmith"] = "\u041A\u0443\u0437\u043D\u0435\u0446\u044B";
    RusSuitNames["explorer"] = "\u0420\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u0438";
    RusSuitNames["hunter"] = "\u041E\u0445\u043E\u0442\u043D\u0438\u043A\u0438";
    RusSuitNames["miner"] = "\u0413\u043E\u0440\u043D\u044F\u043A\u0438";
    RusSuitNames["warrior"] = "\u0412\u043E\u0438\u043D\u044B";
})(RusSuitNames || (RusSuitNames = {}));
/**
 * <h3>Перечисление для стадий игры.</h3>
 */
export var StageNames;
(function (StageNames) {
    StageNames["addCoinToPouch"] = "addCoinToPouch";
    StageNames["chooseCoinValueForVidofnirVedrfolnirUpgrade"] = "chooseCoinValueForVidofnirVedrfolnirUpgrade";
    StageNames["default1"] = "default1";
    StageNames["default2"] = "default2";
    StageNames["default3"] = "default3";
    StageNames["default4"] = "default4";
    StageNames["default5"] = "default5";
    StageNames["discardCard"] = "discardCard";
    StageNames["discardBoardCard"] = "discardBoardCard";
    StageNames["discardSuitCard"] = "discardSuitCard";
    StageNames["pickCampCardHolda"] = "pickCampCardHolda";
    StageNames["pickConcreteCoinToUpgrade"] = "pickConcreteCoinToUpgrade";
    StageNames["pickDiscardCard"] = "pickDiscardCard";
    StageNames["pickDistinctionCard"] = "pickDistinctionCard";
    StageNames["pickDistinctionCardSoloBot"] = "pickDistinctionCardSoloBot";
    StageNames["pickDistinctionCardSoloBotAndvari"] = "pickDistinctionCardSoloBotAndvari";
    StageNames["pickHero"] = "pickHero";
    StageNames["pickHeroSoloBot"] = "pickHeroSoloBot";
    StageNames["pickHeroSoloBotAndvari"] = "pickHeroSoloBotAndvari";
    StageNames["placeEnlistmentMercenaries"] = "placeEnlistmentMercenaries";
    StageNames["placeMultiSuitsCards"] = "placeMultiSuitsCards";
    StageNames["placeTradingCoinsUline"] = "placeTradingCoinsUline";
    StageNames["placeThrudHero"] = "placeThrudHero";
    StageNames["placeThrudHeroSoloBot"] = "placeThrudHeroSoloBot";
    StageNames["placeThrudHeroSoloBotAndvari"] = "placeThrudHeroSoloBotAndvari";
    StageNames["chooseHeroesForSoloMode"] = "chooseHeroesForSoloMode";
    StageNames["upgradeCoin"] = "upgradeCoin";
    StageNames["upgradeCoinSoloBot"] = "upgradeCoinSoloBot";
    StageNames["upgradeCoinSoloBotAndvari"] = "upgradeCoinSoloBotAndvari";
    StageNames["upgradeVidofnirVedrfolnirCoin"] = "upgradeVidofnirVedrfolnirCoin";
})(StageNames || (StageNames = {}));
/**
 * <h3>Перечисление для русских названий стадий игры.</h3>
 */
export var RusStageNames;
(function (RusStageNames) {
    RusStageNames["addCoinToPouch"] = "addCoinToPouch";
    RusStageNames["chooseCoinValueForVidofnirVedrfolnirUpgrade"] = "chooseCoinValueForVidofnirVedrfolnirUpgrade";
    RusStageNames["default1"] = "default1";
    RusStageNames["default2"] = "default2";
    RusStageNames["default3"] = "default3";
    RusStageNames["default4"] = "default4";
    RusStageNames["default5"] = "default5";
    RusStageNames["discardCard"] = "discardCard";
    RusStageNames["discardBoardCard"] = "discardBoardCard";
    RusStageNames["discardSuitCard"] = "discardSuitCard";
    RusStageNames["pickCampCardHolda"] = "pickCampCardHolda";
    RusStageNames["pickConcreteCoinToUpgrade"] = "pickConcreteCoinToUpgrade";
    RusStageNames["pickDiscardCard"] = "pickDiscardCard";
    RusStageNames["pickDistinctionCard"] = "pickDistinctionCard";
    RusStageNames["pickDistinctionCardSoloBot"] = "pickDistinctionCardSoloBot";
    RusStageNames["pickDistinctionCardSoloBotAndvari"] = "pickDistinctionCardSoloBotAndvari";
    RusStageNames["pickHero"] = "pickHero";
    RusStageNames["pickHeroSoloBot"] = "pickHeroSoloBot";
    RusStageNames["pickHeroSoloBotAndvari"] = "pickHeroSoloBotAndvari";
    RusStageNames["placeEnlistmentMercenaries"] = "placeEnlistmentMercenaries";
    RusStageNames["placeMultiSuitsCards"] = "placeMultiSuitsCards";
    RusStageNames["placeTradingCoinsUline"] = "placeTradingCoinsUline";
    RusStageNames["placeThrudHero"] = "placeThrudHero";
    RusStageNames["placeThrudHeroSoloBot"] = "placeThrudHeroSoloBot";
    RusStageNames["placeThrudHeroSoloBotAndvari"] = "placeThrudHeroSoloBotAndvari";
    RusStageNames["chooseHeroesForSoloMode"] = "chooseHeroesForSoloMode";
    RusStageNames["upgradeCoin"] = "upgradeCoin";
    RusStageNames["upgradeCoinSoloBot"] = "upgradeCoinSoloBot";
    RusStageNames["upgradeCoinSoloBotAndvari"] = "upgradeCoinSoloBotAndvari";
    RusStageNames["upgradeVidofnirVedrfolnirCoin"] = "upgradeVidofnirVedrfolnirCoin";
})(RusStageNames || (RusStageNames = {}));
/**
 * <h3>Перечисление для названий фракций.</h3>
 */
export var SuitNames;
(function (SuitNames) {
    SuitNames["blacksmith"] = "blacksmith";
    SuitNames["explorer"] = "explorer";
    SuitNames["hunter"] = "hunter";
    SuitNames["miner"] = "miner";
    SuitNames["warrior"] = "warrior";
})(SuitNames || (SuitNames = {}));
/**
 * <h3>Перечисление для названия валидаторов для выбора карты героя.</h3>
 */
export var PickHeroCardValidatorNames;
(function (PickHeroCardValidatorNames) {
    PickHeroCardValidatorNames["conditions"] = "conditions";
    PickHeroCardValidatorNames["discardCard"] = "discardCard";
})(PickHeroCardValidatorNames || (PickHeroCardValidatorNames = {}));
/**
 * <h3>Перечисление для названия валидаторов для выбора карты героя.</h3>
 */
export var SoloGameAndvariStrategyNames;
(function (SoloGameAndvariStrategyNames) {
    SoloGameAndvariStrategyNames["NoHeroEasyStrategy"] = "\u0411\u0435\u0437 \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u0445 \u0433\u0435\u0440\u043E\u0435\u0432 (\u043B\u0451\u0433\u043A\u0430\u044F \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F)";
    SoloGameAndvariStrategyNames["NoHeroHardStrategy"] = "\u0411\u0435\u0437 \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u0445 \u0433\u0435\u0440\u043E\u0435\u0432 (\u0441\u043B\u043E\u0436\u043D\u0430\u044F \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F)";
    SoloGameAndvariStrategyNames["WithHeroEasyStrategy"] = "\u0421\u043E \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u043C\u0438 \u0433\u0435\u0440\u043E\u044F\u043C\u0438 (\u043B\u0451\u0433\u043A\u0430\u044F \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F)";
    SoloGameAndvariStrategyNames["WithHeroHardStrategy"] = "\u0421\u043E \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u043C\u0438 \u0433\u0435\u0440\u043E\u044F\u043C\u0438 (\u0441\u043B\u043E\u0436\u043D\u0430\u044F \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F)";
})(SoloGameAndvariStrategyNames || (SoloGameAndvariStrategyNames = {}));
/**
 * <h3>Перечисление для названия валидаторов для выбора карты при выборе героя.</h3>
 */
export var PickCardValidatorNames;
(function (PickCardValidatorNames) {
    PickCardValidatorNames["pickDiscardCardToStack"] = "pickDiscardCardToStack";
    PickCardValidatorNames["pickCampCardToStack"] = "pickCampCardToStack";
})(PickCardValidatorNames || (PickCardValidatorNames = {}));
/**
 * <h3>Перечисление для названия карт 'Королевская награда'.</h3>
 */
export var RoyalOfferingNames;
(function (RoyalOfferingNames) {
    RoyalOfferingNames["PlusThree"] = "+3";
    RoyalOfferingNames["PlusFive"] = "+5";
})(RoyalOfferingNames || (RoyalOfferingNames = {}));
/**
 * <h3>Перечисление для названия таверн.</h3>
 */
export var TavernNames;
(function (TavernNames) {
    TavernNames["LaughingGoblin"] = "\u00AB\u0412\u0435\u0441\u0451\u043B\u044B\u0439 \u0433\u043E\u0431\u043B\u0438\u043D\u00BB";
    TavernNames["DancingDragon"] = "\u00AB\u041F\u0430\u0440\u044F\u0449\u0438\u0439 \u0434\u0440\u0430\u043A\u043E\u043D\u00BB";
    TavernNames["ShiningHorse"] = "\u00AB\u0413\u0430\u0440\u0446\u0443\u044E\u0449\u0438\u0439 \u043A\u043E\u043D\u044C\u00BB";
})(TavernNames || (TavernNames = {}));
/**
 * <h3>Перечисление для названия валидаторов мувов.</h3>
 */
export var MoveValidatorNames;
(function (MoveValidatorNames) {
    MoveValidatorNames["ClickBoardCoinMoveValidator"] = "ClickBoardCoinMoveValidator";
    MoveValidatorNames["ClickCampCardMoveValidator"] = "ClickCampCardMoveValidator";
    MoveValidatorNames["ClickCardMoveValidator"] = "ClickCardMoveValidator";
    MoveValidatorNames["ClickCardToPickDistinctionMoveValidator"] = "ClickCardToPickDistinctionMoveValidator";
    MoveValidatorNames["ClickDistinctionCardMoveValidator"] = "ClickDistinctionCardMoveValidator";
    MoveValidatorNames["ClickHandCoinMoveValidator"] = "ClickHandCoinMoveValidator";
    MoveValidatorNames["ClickHandCoinUlineMoveValidator"] = "ClickHandCoinUlineMoveValidator";
    MoveValidatorNames["ClickHandTradingCoinUlineMoveValidator"] = "ClickHandTradingCoinUlineMoveValidator";
    MoveValidatorNames["DiscardCardFromPlayerBoardMoveValidator"] = "DiscardCardFromPlayerBoardMoveValidator";
    MoveValidatorNames["DiscardCard2PlayersMoveValidator"] = "DiscardCard2PlayersMoveValidator";
    MoveValidatorNames["GetEnlistmentMercenariesMoveValidator"] = "GetEnlistmentMercenariesMoveValidator";
    MoveValidatorNames["GetMjollnirProfitMoveValidator"] = "GetMjollnirProfitMoveValidator";
    MoveValidatorNames["PassEnlistmentMercenariesMoveValidator"] = "PassEnlistmentMercenariesMoveValidator";
    MoveValidatorNames["PlaceEnlistmentMercenariesMoveValidator"] = "PlaceEnlistmentMercenariesMoveValidator";
    MoveValidatorNames["PlaceYludHeroMoveValidator"] = "PlaceYludHeroMoveValidator";
    MoveValidatorNames["StartEnlistmentMercenariesMoveValidator"] = "StartEnlistmentMercenariesMoveValidator";
    // Bots
    MoveValidatorNames["BotsPlaceAllCoinsMoveValidator"] = "BotsPlaceAllCoinsMoveValidator";
    // Solo Bot
    MoveValidatorNames["SoloBotClickCardMoveValidator"] = "SoloBotClickCardMoveValidator";
    MoveValidatorNames["SoloBotClickHeroCardMoveValidator"] = "SoloBotClickHeroCardMoveValidator";
    MoveValidatorNames["SoloBotPlaceAllCoinsMoveValidator"] = "SoloBotPlaceAllCoinsMoveValidator";
    MoveValidatorNames["SoloBotClickCardToPickDistinctionMoveValidator"] = "SoloBotClickCardToPickDistinctionMoveValidator";
    MoveValidatorNames["SoloBotPlaceYludHeroMoveValidator"] = "SoloBotPlaceYludHeroMoveValidator";
    MoveValidatorNames["SoloBotPlaceThrudHeroMoveValidator"] = "SoloBotPlaceThrudHeroMoveValidator";
    MoveValidatorNames["SoloBotClickCoinToUpgradeMoveValidator"] = "SoloBotClickCoinToUpgradeMoveValidator";
    // Solo Mode
    MoveValidatorNames["ChooseDifficultyLevelForSoloModeMoveValidator"] = "ChooseDifficultyLevelForSoloModeMoveValidator";
    MoveValidatorNames["ChooseHeroesForSoloModeMoveValidator"] = "ChooseHeroesForSoloModeMoveValidator";
    // Solo Mode Andvari
    MoveValidatorNames["SoloBotAndvariClickCardMoveValidator"] = "SoloBotAndvariClickCardMoveValidator";
    MoveValidatorNames["ChooseStrategyForSoloModeAndvariMoveValidator"] = "ChooseStrategyForSoloModeAndvariMoveValidator";
    MoveValidatorNames["ChooseStrategyVariantForSoloModeAndvariMoveValidator"] = "ChooseStrategyVariantForSoloModeAndvariMoveValidator";
    MoveValidatorNames["SoloBotAndvariPlaceAllCoinsMoveValidator"] = "SoloBotAndvariPlaceAllCoinsMoveValidator";
    MoveValidatorNames["SoloBotAndvariClickHeroCardMoveValidator"] = "SoloBotAndvariClickHeroCardMoveValidator";
    MoveValidatorNames["SoloBotAndvariClickCardToPickDistinctionMoveValidator"] = "SoloBotAndvariClickCardToPickDistinctionMoveValidator";
    MoveValidatorNames["SoloBotAndvariPlaceYludHeroMoveValidator"] = "SoloBotAndvariPlaceYludHeroMoveValidator";
    MoveValidatorNames["SoloBotAndvariPlaceThrudHeroMoveValidator"] = "SoloBotAndvariPlaceThrudHeroMoveValidator";
    MoveValidatorNames["SoloBotAndvariClickCoinToUpgradeMoveValidator"] = "SoloBotAndvariClickCoinToUpgradeMoveValidator";
    // start
    MoveValidatorNames["AddCoinToPouchMoveValidator"] = "AddCoinToPouchMoveValidator";
    MoveValidatorNames["ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator"] = "ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator";
    MoveValidatorNames["ClickCampCardHoldaMoveValidator"] = "ClickCampCardHoldaMoveValidator";
    MoveValidatorNames["ClickCoinToUpgradeMoveValidator"] = "ClickCoinToUpgradeMoveValidator";
    MoveValidatorNames["ClickConcreteCoinToUpgradeMoveValidator"] = "ClickConcreteCoinToUpgradeMoveValidator";
    MoveValidatorNames["ClickHeroCardMoveValidator"] = "ClickHeroCardMoveValidator";
    MoveValidatorNames["DiscardCardMoveValidator"] = "DiscardCardMoveValidator";
    MoveValidatorNames["DiscardSuitCardFromPlayerBoardMoveValidator"] = "DiscardSuitCardFromPlayerBoardMoveValidator";
    MoveValidatorNames["PickDiscardCardMoveValidator"] = "PickDiscardCardMoveValidator";
    MoveValidatorNames["PlaceMultiSuitCardMoveValidator"] = "PlaceMultiSuitCardMoveValidator";
    MoveValidatorNames["PlaceThrudHeroMoveValidator"] = "PlaceThrudHeroMoveValidator";
    MoveValidatorNames["UpgradeCoinVidofnirVedrfolnirMoveValidator"] = "UpgradeCoinVidofnirVedrfolnirMoveValidator";
    // TODO Is it here?
    MoveValidatorNames["UseGodPowerMoveValidator"] = "UseGodPowerMoveValidator";
})(MoveValidatorNames || (MoveValidatorNames = {}));
//# sourceMappingURL=enums.js.map