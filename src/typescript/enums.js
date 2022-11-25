/**
 * <h3>Перечисление для названий режимов игры.</h3>
 */
export var GameModeNames;
(function (GameModeNames) {
    GameModeNames["Basic"] = "Basic";
    GameModeNames["Multiplayer"] = "Multiplayer";
    GameModeNames["Solo"] = "Solo";
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
    AutoActionFunctionNames["AddMythologyCreatureCardsSkymirAction"] = "AddMythologyCardSkymirAction";
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
 * <h3>Перечисление для общих бафов в конфиге.</h3>
 */
export var BuffNames;
(function (BuffNames) {
    BuffNames["HasOneNotCountHero"] = "hasOneNotCountHero";
    BuffNames["SuitIdForMjollnir"] = "suitIdForMjollnir";
    BuffNames["SuitIdForOlrun"] = "suitIdForOlrun";
})(BuffNames || (BuffNames = {}));
/**
 * <h3>Перечисление для названия бафов карт Лагеря в конфиге.</h3>
 */
export var CampBuffNames;
(function (CampBuffNames) {
    CampBuffNames["DiscardCardEndGame"] = "discardCardEndGame";
    CampBuffNames["GetMjollnirProfit"] = "getMjollnirProfit";
    CampBuffNames["GoCamp"] = "goCamp";
    CampBuffNames["NoHero"] = "noHero";
})(CampBuffNames || (CampBuffNames = {}));
/**
 * <h3>Перечисление для названия бафов Героев в конфиге.</h3>
 */
export var HeroBuffNames;
(function (HeroBuffNames) {
    HeroBuffNames["EndTier"] = "endTier";
    HeroBuffNames["EveryTurn"] = "everyTurn";
    HeroBuffNames["GoCampOneTime"] = "goCampOneTime";
    HeroBuffNames["MoveThrud"] = "moveThrud";
    HeroBuffNames["UpgradeCoin"] = "upgradeCoin";
    HeroBuffNames["UpgradeNextCoin"] = "upgradeNextCoin";
})(HeroBuffNames || (HeroBuffNames = {}));
/**
 * <h3>Перечисление для названия бафов Гигантов в конфиге.</h3>
 */
export var GiantBuffNames;
(function (GiantBuffNames) {
    GiantBuffNames["PlayerHasActiveGiantGymir"] = "playerHasActiveGiantGymir";
    GiantBuffNames["PlayerHasActiveGiantHrungnir"] = "playerHasActiveGiantHrungnir";
    GiantBuffNames["PlayerHasActiveGiantSkymir"] = "playerHasActiveGiantSkymir";
    GiantBuffNames["PlayerHasActiveGiantSurt"] = "playerHasActiveGiantSurt";
    GiantBuffNames["PlayerHasActiveGiantThrivaldi"] = "playerHasActiveGiantThrivaldi";
})(GiantBuffNames || (GiantBuffNames = {}));
/**
 * <h3>Перечисление для названия бафов Мистических животных в конфиге.</h3>
 */
export var MythicalAnimalBuffNames;
(function (MythicalAnimalBuffNames) {
    MythicalAnimalBuffNames["DagdaDiscardOnlyOneCards"] = "dagdaDiscardOnlyOneCards";
    MythicalAnimalBuffNames["ExplorerDistinctionGetSixCards"] = "explorerDistinctionGetSixCards";
    MythicalAnimalBuffNames["RatatoskFinalScoring"] = "ratatoskFinalScoring";
})(MythicalAnimalBuffNames || (MythicalAnimalBuffNames = {}));
/**
 * <h3>Перечисление для названия бафов Валькирий в конфиге.</h3>
 */
export var ValkyryBuffNames;
(function (ValkyryBuffNames) {
    ValkyryBuffNames["CountBettermentAmount"] = "countBettermentAmount";
    ValkyryBuffNames["CountBidWinnerAmount"] = "countBidWinnerAmount";
    ValkyryBuffNames["CountDistinctionAmount"] = "countDistinctionAmount";
    ValkyryBuffNames["CountPickedCardClassRankAmount"] = "countPickedCardClassRankAmount";
    ValkyryBuffNames["CountPickedHeroAmount"] = "countPickedHeroAmount";
})(ValkyryBuffNames || (ValkyryBuffNames = {}));
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
    ConfigNames["ActivateGiantAbilityOrPickCard"] = "ActivateGiantAbilityOrPickCard";
    ConfigNames["ChooseGetMythologyCard"] = "ChooseGetMythologyCard";
    ConfigNames["ChooseCoinValueForVidofnirVedrfolnirUpgrade"] = "ChooseCoinValueForVidofnirVedrfolnirUpgrade";
    ConfigNames["ChooseStrategyLevelForSoloModeAndvari"] = "ChooseStrategyLevelForSoloModeAndvari";
    ConfigNames["ChooseStrategyVariantLevelForSoloModeAndvari"] = "ChooseStrategyVariantLevelForSoloModeAndvari";
    ConfigNames["ExplorerDistinction"] = "ExplorerDistinction";
    ConfigNames["GetDifficultyLevelForSoloMode"] = "GetDifficultyLevelForSoloMode";
    ConfigNames["GetHeroesForSoloMode"] = "GetHeroesForSoloMode";
    ConfigNames["StartOrPassEnlistmentMercenaries"] = "StartOrPassEnlistmentMercenaries";
})(ConfigNames || (ConfigNames = {}));
/**
 * <h3>Перечисление для описаний отображения действий.</h3>
 */
export var DrawNames;
(function (DrawNames) {
    // TODO Give normal names to all?!
    DrawNames["ActivateGiantAbilityOrPickCard"] = "Activate Giant ability or pick card";
    DrawNames["AddCoinToPouchVidofnirVedrfolnir"] = "Add coin to pouch Vidofnir Vedrfolnir";
    DrawNames["Andumia"] = "Andumia";
    DrawNames["Bonfur"] = "Bonfur";
    DrawNames["Brisingamens"] = "Brisingamens";
    DrawNames["BrisingamensEndGame"] = "Brisingamens end game";
    DrawNames["ChooseSuitOlrun"] = "Choose suit Olrun";
    DrawNames["ChooseStrategyLevelForSoloModeAndvari"] = "Choose strategy level for solo mode Andvari";
    DrawNames["ChooseStrategyVariantLevelForSoloModeAndvari"] = "Choose strategy variant level for solo mode Andvari";
    DrawNames["CrovaxTheDoppelganger"] = "Crovax the Doppelganger";
    DrawNames["Dagda"] = "Dagda";
    DrawNames["DiscardTavernCard"] = "Discard tavern card";
    DrawNames["EnlistmentMercenaries"] = "Enlistment Mercenaries";
    DrawNames["Mjollnir"] = "Mjollnir";
    DrawNames["GetDifficultyLevelForSoloMode"] = "Get difficulty level for Solo mode";
    DrawNames["GetMythologyCardSkymir"] = "Get Mythology card Skymir";
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
    DrawNames["StartAddPlusTwoValueToAllCoinsUline"] = "Start add plus two value to all coins Uline";
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
    ErrorNames["CurrentMoveArgumentIsUndefined"] = "CurrentMoveArgumentIsUndefined";
    ErrorNames["CurrentTierDeckIsUndefined"] = "CurrentTierDeckIsUndefined";
    ErrorNames["CurrentPrivatePlayerIsUndefined"] = "CurrentPrivatePlayerIsUndefined";
    ErrorNames["CurrentPublicPlayerIsUndefined"] = "CurrentPublicPlayerIsUndefined";
    ErrorNames["CurrentSuitDistinctionPlayerIndexIsUndefined"] = "CurrentSuitDistinctionPlayerIndexIsUndefined";
    ErrorNames["DeckIsUndefined"] = "DeckIsUndefined";
    ErrorNames["DoNotDiscardCardFromCurrentTavernIfCardWithCurrentIdIsUndefined"] = "DoNotDiscardCardFromCurrentTavernIfCardWithCurrentIdIsUndefined";
    ErrorNames["DoNotDiscardCardFromCurrentTavernIfNoCardInTavern"] = "DoNotDiscardCardFromCurrentTavernIfNoCardInTavern";
    ErrorNames["DoNotDiscardCardFromTavernInSoloOrTwoPlayersGame"] = "DoNotDiscardCardFromTavernInSoloOrTwoPlayersGame";
    ErrorNames["FirstStackActionIsUndefined"] = "FirstStackActionIsUndefined";
    ErrorNames["FunctionParamIsUndefined"] = "FunctionParamIsUndefined";
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
    GameNames["Basic"] = "Basic";
    GameNames["Idavoll"] = "Idavoll";
    GameNames["Thingvellir"] = "Thingvellir";
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
    LogTypeNames["Game"] = "Game";
    LogTypeNames["Private"] = "Private";
    LogTypeNames["Public"] = "Public";
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
    CardMoveNames["ClickCardNotGiantAbilityMove"] = "ClickCardNoyGiantAbilityMove";
    CardMoveNames["ClickGiantAbilityNotCardMove"] = "ClickGiantAbilityNotCardMove";
    CardMoveNames["ClickCardMove"] = "ClickCardMove";
    CardMoveNames["ClickCardToPickDistinctionMove"] = "ClickCardToPickDistinctionMove";
    CardMoveNames["ClickCampCardMove"] = "ClickCampCardMove";
    CardMoveNames["ClickDistinctionCardMove"] = "ClickDistinctionCardMove";
    CardMoveNames["DiscardCardFromPlayerBoardMove"] = "DiscardCardFromPlayerBoardMove";
    CardMoveNames["GetEnlistmentMercenariesMove"] = "GetEnlistmentMercenariesMove";
    CardMoveNames["GetMythologyCardMove"] = "GetMythologyCardMove";
    // start
    CardMoveNames["ClickCampCardHoldaMove"] = "ClickCampCardHoldaMove";
    CardMoveNames["ClickHeroCardMove"] = "ClickHeroCardMove";
    CardMoveNames["DiscardTopCardFromSuitMove"] = "DiscardTopCardFromSuitMove";
    CardMoveNames["DiscardCard2PlayersMove"] = "DiscardCard2PlayersMove";
    CardMoveNames["DiscardSuitCardFromPlayerBoardMove"] = "DiscardSuitCardFromPlayerBoardMove";
    CardMoveNames["PickDiscardCardMove"] = "PickDiscardCardMove";
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
    CoinMoveNames["ChooseCoinValueForHrungnirUpgradeMove"] = "ChooseCoinValueForHrungnirUpgradeMove";
    CoinMoveNames["ClickHandCoinMove"] = "ClickHandCoinMove";
    CoinMoveNames["ClickHandCoinUlineMove"] = "ClickHandCoinUlineMove";
    CoinMoveNames["ClickHandTradingCoinUlineMove"] = "ClickHandTradingCoinUlineMove";
    // Start
    CoinMoveNames["AddCoinToPouchMove"] = "AddCoinToPouchMove";
    CoinMoveNames["ClickCoinToUpgradeMove"] = "ClickCoinToUpgradeMove";
    CoinMoveNames["PickConcreteCoinToUpgradeMove"] = "PickConcreteCoinToUpgradeMove";
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
    SuitMoveNames["ChooseSuitOlrunMove"] = "ChooseSuitOlrunMove";
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
    PhaseNames["Bids"] = "Bids";
    PhaseNames["BidUline"] = "BidUline";
    PhaseNames["BrisingamensEndGame"] = "BrisingamensEndGame";
    PhaseNames["ChooseDifficultySoloMode"] = "ChooseDifficultySoloMode";
    PhaseNames["ChooseDifficultySoloModeAndvari"] = "ChooseDifficultySoloModeAndvari";
    PhaseNames["EnlistmentMercenaries"] = "EnlistmentMercenaries";
    PhaseNames["GetMjollnirProfit"] = "GetMjollnirProfit";
    PhaseNames["PlaceYlud"] = "PlaceYlud";
    PhaseNames["TavernsResolution"] = "TavernsResolution";
    PhaseNames["TroopEvaluation"] = "TroopEvaluation";
})(PhaseNames || (PhaseNames = {}));
/**
 * <h3>Перечисление для фаз игры на русском.</h3>
 */
export var RusPhaseNames;
(function (RusPhaseNames) {
    RusPhaseNames["Bids"] = "\u0421\u0442\u0430\u0432\u043A\u0438";
    RusPhaseNames["BidUline"] = "\u0421\u0442\u0430\u0432\u043A\u0438 \u0423\u043B\u0438\u043D\u0430";
    RusPhaseNames["BrisingamensEndGame"] = "BrisingamensEndGame";
    RusPhaseNames["ChooseDifficultySoloMode"] = "\u0412\u044B\u0431\u043E\u0440 \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u0441\u043E\u043B\u043E \u0440\u0435\u0436\u0438\u043C\u0430";
    RusPhaseNames["ChooseDifficultySoloModeAndvari"] = "\u0412\u044B\u0431\u043E\u0440 \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u0441\u043E\u043B\u043E \u0440\u0435\u0436\u0438\u043C\u0430 \u0410\u043D\u0434\u0432\u0430\u0440\u0438";
    RusPhaseNames["EnlistmentMercenaries"] = "enlistmentMercenaries";
    RusPhaseNames["GetMjollnirProfit"] = "getMjollnirProfit";
    RusPhaseNames["PlaceYlud"] = "\u041F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u0418\u043B\u0443\u0434";
    RusPhaseNames["TavernsResolution"] = "\u041F\u043E\u0441\u0435\u0449\u0435\u043D\u0438\u0435 \u0442\u0430\u0432\u0435\u0440\u043D";
    RusPhaseNames["TroopEvaluation"] = "\u0421\u043C\u043E\u0442\u0440 \u0432\u043E\u0439\u0441\u043A";
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
// TODO DELETE!
/**
 * <h3>Перечисление для типов мувов.</h3>
 */
export var MoveTypeNames;
(function (MoveTypeNames) {
    MoveTypeNames["default"] = "default";
    MoveTypeNames["clickCardNotGiantAbilityMove"] = "clickCardNotGiantAbilityMove";
    MoveTypeNames["clickGiantAbilityNotCardMove"] = "clickGiantAbilityNotCardMove";
})(MoveTypeNames || (MoveTypeNames = {}));
/**
 * <h3>Перечисление для дефолтных стадий игры `chooseDifficultySoloMode`.</h3>
 */
export var ChooseDifficultySoloModeDefaultStageNames;
(function (ChooseDifficultySoloModeDefaultStageNames) {
    ChooseDifficultySoloModeDefaultStageNames["ChooseDifficultyLevelForSoloMode"] = "ChooseDifficultyLevelForSoloMode";
})(ChooseDifficultySoloModeDefaultStageNames || (ChooseDifficultySoloModeDefaultStageNames = {}));
/**
 * <h3>Перечисление для стадий игры `chooseDifficultySoloMode`.</h3>
 */
export var ChooseDifficultySoloModeStageNames;
(function (ChooseDifficultySoloModeStageNames) {
    ChooseDifficultySoloModeStageNames["ChooseHeroForDifficultySoloMode"] = "ChooseHeroForDifficultySoloMode";
})(ChooseDifficultySoloModeStageNames || (ChooseDifficultySoloModeStageNames = {}));
/**
 * <h3>Перечисление для дефолтных стадий игры `chooseDifficultySoloModeAndvari`.</h3>
 */
export var ChooseDifficultySoloModeAndvariDefaultStageNames;
(function (ChooseDifficultySoloModeAndvariDefaultStageNames) {
    ChooseDifficultySoloModeAndvariDefaultStageNames["ChooseStrategyVariantForSoloModeAndvari"] = "ChooseStrategyVariantForSoloModeAndvari";
    ChooseDifficultySoloModeAndvariDefaultStageNames["ChooseStrategyForSoloModeAndvari"] = "ChooseStrategyForSoloModeAndvari";
})(ChooseDifficultySoloModeAndvariDefaultStageNames || (ChooseDifficultySoloModeAndvariDefaultStageNames = {}));
/**
 * <h3>Перечисление для дефолтных стадий игры `bids`.</h3>
 */
export var BidsDefaultStageNames;
(function (BidsDefaultStageNames) {
    BidsDefaultStageNames["ClickHandCoin"] = "ClickHandCoin";
    BidsDefaultStageNames["ClickBoardCoin"] = "ClickBoardCoin";
    BidsDefaultStageNames["BotsPlaceAllCoins"] = "BotsPlaceAllCoins";
    BidsDefaultStageNames["SoloBotPlaceAllCoins"] = "SoloBotPlaceAllCoins";
    BidsDefaultStageNames["SoloBotAndvariPlaceAllCoins"] = "SoloBotAndvariPlaceAllCoins";
})(BidsDefaultStageNames || (BidsDefaultStageNames = {}));
/**
 * <h3>Перечисление для дефолтных стадий игры `bidUline`.</h3>
 */
export var BidUlineDefaultStageNames;
(function (BidUlineDefaultStageNames) {
    BidUlineDefaultStageNames["ClickHandCoinUline"] = "ClickHandCoinUline";
})(BidUlineDefaultStageNames || (BidUlineDefaultStageNames = {}));
/**
 * <h3>Перечисление для стадий игры `brisingamensEndGame`.</h3>
 */
export var BrisingamensEndGameDefaultStageNames;
(function (BrisingamensEndGameDefaultStageNames) {
    BrisingamensEndGameDefaultStageNames["DiscardCardFromPlayerBoard"] = "DiscardCardFromPlayerBoard";
})(BrisingamensEndGameDefaultStageNames || (BrisingamensEndGameDefaultStageNames = {}));
/**
 * <h3>Перечисление для стадий игры `getMjollnirProfit`.</h3>
 */
export var GetMjollnirProfitDefaultStageNames;
(function (GetMjollnirProfitDefaultStageNames) {
    GetMjollnirProfitDefaultStageNames["GetMjollnirProfit"] = "GetMjollnirProfit";
})(GetMjollnirProfitDefaultStageNames || (GetMjollnirProfitDefaultStageNames = {}));
/**
 * <h3>Перечисление для дефолтных стадий игры `enlistmentMercenaries`.</h3>
 */
export var EnlistmentMercenariesDefaultStageNames;
(function (EnlistmentMercenariesDefaultStageNames) {
    EnlistmentMercenariesDefaultStageNames["StartEnlistmentMercenaries"] = "StartEnlistmentMercenaries";
    EnlistmentMercenariesDefaultStageNames["PassEnlistmentMercenaries"] = "PassEnlistmentMercenaries";
    EnlistmentMercenariesDefaultStageNames["GetEnlistmentMercenaries"] = "GetEnlistmentMercenaries";
})(EnlistmentMercenariesDefaultStageNames || (EnlistmentMercenariesDefaultStageNames = {}));
/**
 * <h3>Перечисление для стадий игры `enlistmentMercenaries`.</h3>
 */
export var EnlistmentMercenariesStageNames;
(function (EnlistmentMercenariesStageNames) {
    EnlistmentMercenariesStageNames["PlaceEnlistmentMercenaries"] = "PlaceEnlistmentMercenaries";
})(EnlistmentMercenariesStageNames || (EnlistmentMercenariesStageNames = {}));
/**
 * <h3>Перечисление для стадий игры `placeYlud`.</h3>
 */
export var PlaceYludDefaultStageNames;
(function (PlaceYludDefaultStageNames) {
    PlaceYludDefaultStageNames["PlaceYludHero"] = "PlaceYludHero";
    PlaceYludDefaultStageNames["SoloBotPlaceYludHero"] = "SoloBotPlaceYludHero";
    PlaceYludDefaultStageNames["SoloBotAndvariPlaceYludHero"] = "SoloBotAndvariPlaceYludHero";
})(PlaceYludDefaultStageNames || (PlaceYludDefaultStageNames = {}));
/**
 * <h3>Перечисление для дефолтных стадий игры `troopEvaluation`.</h3>
 */
export var TroopEvaluationDefaultStageNames;
(function (TroopEvaluationDefaultStageNames) {
    TroopEvaluationDefaultStageNames["ClickDistinctionCard"] = "ClickDistinctionCard";
})(TroopEvaluationDefaultStageNames || (TroopEvaluationDefaultStageNames = {}));
/**
 * <h3>Перечисление для стадий игры `troopEvaluation`.</h3>
 */
export var TroopEvaluationStageNames;
(function (TroopEvaluationStageNames) {
    TroopEvaluationStageNames["ClickCardToPickDistinction"] = "ClickCardToPickDistinction";
    TroopEvaluationStageNames["SoloBotClickCardToPickDistinction"] = "SoloBotClickCardToPickDistinction";
    TroopEvaluationStageNames["SoloBotAndvariClickCardToPickDistinction"] = "SoloBotAndvariClickCardToPickDistinction";
})(TroopEvaluationStageNames || (TroopEvaluationStageNames = {}));
/**
 * <h3>Перечисление для дефолтных стадий игры `tavernsResolution`.</h3>
 */
export var TavernsResolutionDefaultStageNames;
(function (TavernsResolutionDefaultStageNames) {
    TavernsResolutionDefaultStageNames["ClickCard"] = "ClickCard";
    TavernsResolutionDefaultStageNames["ClickCampCard"] = "ClickCampCard";
    TavernsResolutionDefaultStageNames["SoloBotClickCard"] = "SoloBotClickCard";
    TavernsResolutionDefaultStageNames["SoloBotAndvariClickCard"] = "SoloBotAndvariClickCard";
})(TavernsResolutionDefaultStageNames || (TavernsResolutionDefaultStageNames = {}));
/**
 * <h3>Перечисление для стадий игры `tavernsResolution`.</h3>
 */
export var TavernsResolutionStageNames;
(function (TavernsResolutionStageNames) {
    TavernsResolutionStageNames["ActivateGiantAbilityOrPickCard"] = "ActivateGiantAbilityOrPickCard";
    TavernsResolutionStageNames["ChooseCoinValueForHrungnirUpgrade"] = "ChooseCoinValueForHrungnirUpgrade";
    TavernsResolutionStageNames["ChooseSuitOlrun"] = "ChooseSuitOlrun";
    TavernsResolutionStageNames["DiscardCard2Players"] = "DiscardCard2Players";
    TavernsResolutionStageNames["GetMythologyCard"] = "GetMythologyCard";
    TavernsResolutionStageNames["ClickHandTradingCoinUline"] = "ClickHandTradingCoinUline";
})(TavernsResolutionStageNames || (TavernsResolutionStageNames = {}));
/**
 * <h3>Перечисление для общих стадий игры `SoloBotCommon`.</h3>
 */
export var SoloBotCommonStageNames;
(function (SoloBotCommonStageNames) {
    SoloBotCommonStageNames["SoloBotClickHeroCard"] = "SoloBotClickHeroCard";
    SoloBotCommonStageNames["SoloBotPlaceThrudHero"] = "SoloBotPlaceThrudHero";
})(SoloBotCommonStageNames || (SoloBotCommonStageNames = {}));
/**
 * <h3>Перечисление для общих стадий игры `SoloBotCommonCoinUpgrade`.</h3>
 */
export var SoloBotCommonCoinUpgradeStageNames;
(function (SoloBotCommonCoinUpgradeStageNames) {
    SoloBotCommonCoinUpgradeStageNames["SoloBotClickCoinToUpgrade"] = "SoloBotClickCoinToUpgrade";
})(SoloBotCommonCoinUpgradeStageNames || (SoloBotCommonCoinUpgradeStageNames = {}));
/**
 * <h3>Перечисление для общих стадий игры `SoloBotAndvariCommon`.</h3>
 */
export var SoloBotAndvariCommonStageNames;
(function (SoloBotAndvariCommonStageNames) {
    SoloBotAndvariCommonStageNames["SoloBotAndvariClickHeroCard"] = "SoloBotAndvariClickHeroCard";
    SoloBotAndvariCommonStageNames["SoloBotAndvariPlaceThrudHero"] = "SoloBotAndvariPlaceThrudHero";
    SoloBotAndvariCommonStageNames["SoloBotAndvariClickCoinToUpgrade"] = "SoloBotAndvariClickCoinToUpgrade";
})(SoloBotAndvariCommonStageNames || (SoloBotAndvariCommonStageNames = {}));
/**
 * <h3>Перечисление для общих стадий игры `Common`.</h3>
 */
export var CommonStageNames;
(function (CommonStageNames) {
    CommonStageNames["AddCoinToPouch"] = "AddCoinToPouch";
    CommonStageNames["ChooseCoinValueForVidofnirVedrfolnirUpgrade"] = "ChooseCoinValueForVidofnirVedrfolnirUpgrade";
    CommonStageNames["DiscardTopCardFromSuit"] = "DiscardTopCardFromSuit";
    CommonStageNames["DiscardSuitCardFromPlayerBoard"] = "DiscardSuitCardFromPlayerBoard";
    CommonStageNames["ClickCampCardHolda"] = "ClickCampCardHolda";
    CommonStageNames["PickConcreteCoinToUpgrade"] = "PickConcreteCoinToUpgrade";
    CommonStageNames["PickDiscardCard"] = "PickDiscardCard";
    CommonStageNames["ClickHeroCard"] = "ClickHeroCard";
    CommonStageNames["PlaceMultiSuitCard"] = "PlaceMultiSuitCard";
    CommonStageNames["PlaceThrudHero"] = "PlaceThrudHero";
    CommonStageNames["ClickCoinToUpgrade"] = "ClickCoinToUpgrade";
    CommonStageNames["UpgradeCoinVidofnirVedrfolnir"] = "UpgradeCoinVidofnirVedrfolnir";
})(CommonStageNames || (CommonStageNames = {}));
/**
 * <h3>Перечисление для русских названий стадий игры.</h3>
 */
export var RusStageNames;
(function (RusStageNames) {
    RusStageNames["ActivateGiantAbilityOrPickCard"] = "ActivateGiantAbilityOrPickCard";
    RusStageNames["AddCoinToPouch"] = "AddCoinToPouch";
    RusStageNames["ChooseSuitOlrun"] = "ChooseSuitOlrun";
    RusStageNames["ChooseCoinValueForVidofnirVedrfolnirUpgrade"] = "ChooseCoinValueForVidofnirVedrfolnirUpgrade";
    RusStageNames["ChooseHeroForDifficultySoloMode"] = "ChooseHeroForDifficultySoloMode";
    RusStageNames["ChooseCoinValueForHrungnirUpgrade"] = "ChooseCoinValueForHrungnirUpgrade";
    RusStageNames["DiscardCard2Players"] = "DiscardCard2Players";
    RusStageNames["DiscardTopCardFromSuit"] = "DiscardTopCardFromSuit";
    RusStageNames["DiscardSuitCardFromPlayerBoard"] = "DiscardSuitCardFromPlayerBoard";
    RusStageNames["GetMythologyCard"] = "GetMythologyCard";
    RusStageNames["ClickCampCardHolda"] = "ClickCampCardHolda";
    RusStageNames["PickConcreteCoinToUpgrade"] = "PickConcreteCoinToUpgrade";
    RusStageNames["PickDiscardCard"] = "PickDiscardCard";
    RusStageNames["ClickCardToPickDistinction"] = "ClickCardToPickDistinction";
    RusStageNames["SoloBotClickCardToPickDistinction"] = "SoloBotClickCardToPickDistinction";
    RusStageNames["SoloBotAndvariClickCardToPickDistinction"] = "SoloBotAndvariClickCardToPickDistinction";
    RusStageNames["ClickHeroCard"] = "ClickHeroCard";
    RusStageNames["SoloBotClickHeroCard"] = "SoloBotAndvariClickHeroCard";
    RusStageNames["SoloBotAndvariClickHeroCard"] = "SoloBotAndvariClickHeroCard";
    RusStageNames["PlaceEnlistmentMercenaries"] = "PlaceEnlistmentMercenaries";
    RusStageNames["PlaceMultiSuitCard"] = "PlaceMultiSuitCard";
    RusStageNames["ClickHandTradingCoinUline"] = "ClickHandTradingCoinUline";
    RusStageNames["PlaceThrudHero"] = "PlaceThrudHero";
    RusStageNames["SoloBotPlaceThrudHero"] = "SoloBotPlaceThrudHero";
    RusStageNames["SoloBotAndvariPlaceThrudHero"] = "SoloBotAndvariPlaceThrudHero";
    RusStageNames["ClickCoinToUpgrade"] = "ClickCoinToUpgrade";
    RusStageNames["SoloBotClickCoinToUpgrade"] = "SoloBotClickCoinToUpgrade";
    RusStageNames["SoloBotAndvariClickCoinToUpgrade"] = "SoloBotAndvariClickCoinToUpgrade";
    RusStageNames["UpgradeCoinVidofnirVedrfolnir"] = "UpgradeCoinVidofnirVedrfolnir";
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
 * <h3>Перечисление для названия валидаторов мувов в фазу 'ChooseDifficultySoloMode'.</h3>
 */
export var ChooseDifficultySoloModeMoveValidatorNames;
(function (ChooseDifficultySoloModeMoveValidatorNames) {
    ChooseDifficultySoloModeMoveValidatorNames["ChooseDifficultyLevelForSoloModeMoveValidator"] = "ChooseDifficultyLevelForSoloModeMoveValidator";
    ChooseDifficultySoloModeMoveValidatorNames["ChooseHeroForDifficultySoloModeMoveValidator"] = "ChooseHeroForDifficultySoloModeMoveValidator";
})(ChooseDifficultySoloModeMoveValidatorNames || (ChooseDifficultySoloModeMoveValidatorNames = {}));
/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'ChooseDifficultySoloModeAndvari'.</h3>
 */
export var ChooseDifficultySoloModeAndvariMoveValidatorNames;
(function (ChooseDifficultySoloModeAndvariMoveValidatorNames) {
    ChooseDifficultySoloModeAndvariMoveValidatorNames["ChooseStrategyForSoloModeAndvariMoveValidator"] = "ChooseStrategyForSoloModeAndvariMoveValidator";
    ChooseDifficultySoloModeAndvariMoveValidatorNames["ChooseStrategyVariantForSoloModeAndvariMoveValidator"] = "ChooseStrategyVariantForSoloModeAndvariMoveValidator";
})(ChooseDifficultySoloModeAndvariMoveValidatorNames || (ChooseDifficultySoloModeAndvariMoveValidatorNames = {}));
/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'Bids'.</h3>
 */
export var BidsMoveValidatorNames;
(function (BidsMoveValidatorNames) {
    BidsMoveValidatorNames["ClickBoardCoinMoveValidator"] = "ClickBoardCoinMoveValidator";
    BidsMoveValidatorNames["ClickHandCoinMoveValidator"] = "ClickHandCoinMoveValidator";
    // Bots
    BidsMoveValidatorNames["BotsPlaceAllCoinsMoveValidator"] = "BotsPlaceAllCoinsMoveValidator";
    // Solo Bot
    BidsMoveValidatorNames["SoloBotPlaceAllCoinsMoveValidator"] = "SoloBotPlaceAllCoinsMoveValidator";
    // Solo Bot Andvari
    BidsMoveValidatorNames["SoloBotAndvariPlaceAllCoinsMoveValidator"] = "SoloBotAndvariPlaceAllCoinsMoveValidator";
})(BidsMoveValidatorNames || (BidsMoveValidatorNames = {}));
/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'BidUline'.</h3>
 */
export var BidUlineMoveValidatorNames;
(function (BidUlineMoveValidatorNames) {
    BidUlineMoveValidatorNames["ClickHandCoinUlineMoveValidator"] = "ClickHandCoinUlineMoveValidator";
})(BidUlineMoveValidatorNames || (BidUlineMoveValidatorNames = {}));
/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'TavernsResolution'.</h3>
 */
export var TavernsResolutionMoveValidatorNames;
(function (TavernsResolutionMoveValidatorNames) {
    TavernsResolutionMoveValidatorNames["ClickCardMoveValidator"] = "ClickCardMoveValidator";
    TavernsResolutionMoveValidatorNames["ClickCampCardMoveValidator"] = "ClickCampCardMoveValidator";
    // Solo Bot
    TavernsResolutionMoveValidatorNames["SoloBotClickCardMoveValidator"] = "SoloBotClickCardMoveValidator";
    // Solo Bot Andvari
    TavernsResolutionMoveValidatorNames["SoloBotAndvariClickCardMoveValidator"] = "SoloBotAndvariClickCardMoveValidator";
    TavernsResolutionMoveValidatorNames["ClickCardNotGiantAbilityMoveValidator"] = "ClickCardNotGiantAbilityMoveValidator";
    TavernsResolutionMoveValidatorNames["ClickGiantAbilityNotCardMoveValidator"] = "ClickGiantAbilityNotCardMoveValidator";
    // TODO Add `ChooseCoinValueForHrungnirUpgradeMoveValidator` to UI validate
    TavernsResolutionMoveValidatorNames["ChooseCoinValueForHrungnirUpgradeMoveValidator"] = "ChooseCoinValueForHrungnirUpgradeMoveValidator";
    TavernsResolutionMoveValidatorNames["ChooseSuitOlrunMoveValidator"] = "ChooseSuitOlrunMoveValidator";
    TavernsResolutionMoveValidatorNames["DiscardCard2PlayersMoveValidator"] = "DiscardCard2PlayersMoveValidator";
    TavernsResolutionMoveValidatorNames["GetMythologyCardMoveValidator"] = "GetMythologyCardMoveValidator";
    TavernsResolutionMoveValidatorNames["ClickHandTradingCoinUlineMoveValidator"] = "ClickHandTradingCoinUlineMoveValidator";
})(TavernsResolutionMoveValidatorNames || (TavernsResolutionMoveValidatorNames = {}));
/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'EnlistmentMercenaries'.</h3>
 */
export var EnlistmentMercenariesMoveValidatorNames;
(function (EnlistmentMercenariesMoveValidatorNames) {
    EnlistmentMercenariesMoveValidatorNames["StartEnlistmentMercenariesMoveValidator"] = "StartEnlistmentMercenariesMoveValidator";
    EnlistmentMercenariesMoveValidatorNames["PassEnlistmentMercenariesMoveValidator"] = "PassEnlistmentMercenariesMoveValidator";
    EnlistmentMercenariesMoveValidatorNames["GetEnlistmentMercenariesMoveValidator"] = "GetEnlistmentMercenariesMoveValidator";
    EnlistmentMercenariesMoveValidatorNames["PlaceEnlistmentMercenariesMoveValidator"] = "PlaceEnlistmentMercenariesMoveValidator";
})(EnlistmentMercenariesMoveValidatorNames || (EnlistmentMercenariesMoveValidatorNames = {}));
/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'PlaceYlud'.</h3>
 */
export var PlaceYludMoveValidatorNames;
(function (PlaceYludMoveValidatorNames) {
    PlaceYludMoveValidatorNames["PlaceYludHeroMoveValidator"] = "PlaceYludHeroMoveValidator";
    // Solo Bot
    PlaceYludMoveValidatorNames["SoloBotPlaceYludHeroMoveValidator"] = "SoloBotPlaceYludHeroMoveValidator";
    // Solo Bot Andvari
    PlaceYludMoveValidatorNames["SoloBotAndvariPlaceYludHeroMoveValidator"] = "SoloBotAndvariPlaceYludHeroMoveValidator";
})(PlaceYludMoveValidatorNames || (PlaceYludMoveValidatorNames = {}));
/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'TroopEvaluation'.</h3>
 */
export var TroopEvaluationMoveValidatorNames;
(function (TroopEvaluationMoveValidatorNames) {
    TroopEvaluationMoveValidatorNames["ClickDistinctionCardMoveValidator"] = "ClickDistinctionCardMoveValidator";
    TroopEvaluationMoveValidatorNames["ClickCardToPickDistinctionMoveValidator"] = "ClickCardToPickDistinctionMoveValidator";
    // Solo Bot
    TroopEvaluationMoveValidatorNames["SoloBotClickCardToPickDistinctionMoveValidator"] = "SoloBotClickCardToPickDistinctionMoveValidator";
    // Solo Bot Andvari
    TroopEvaluationMoveValidatorNames["SoloBotAndvariClickCardToPickDistinctionMoveValidator"] = "SoloBotAndvariClickCardToPickDistinctionMoveValidator";
})(TroopEvaluationMoveValidatorNames || (TroopEvaluationMoveValidatorNames = {}));
/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'BrisingamensEndGame'.</h3>
 */
export var BrisingamensEndGameMoveValidatorNames;
(function (BrisingamensEndGameMoveValidatorNames) {
    BrisingamensEndGameMoveValidatorNames["DiscardCardFromPlayerBoardMoveValidator"] = "DiscardCardFromPlayerBoardMoveValidator";
})(BrisingamensEndGameMoveValidatorNames || (BrisingamensEndGameMoveValidatorNames = {}));
/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'GetMjollnirProfit'.</h3>
 */
export var GetMjollnirProfitMoveValidatorNames;
(function (GetMjollnirProfitMoveValidatorNames) {
    GetMjollnirProfitMoveValidatorNames["GetMjollnirProfitMoveValidator"] = "GetMjollnirProfitMoveValidator";
})(GetMjollnirProfitMoveValidatorNames || (GetMjollnirProfitMoveValidatorNames = {}));
/**
 * <h3>Перечисление для названия общих валидаторов мувов.</h3>
 */
export var CommonMoveValidatorNames;
(function (CommonMoveValidatorNames) {
    CommonMoveValidatorNames["AddCoinToPouchMoveValidator"] = "AddCoinToPouchMoveValidator";
    CommonMoveValidatorNames["ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator"] = "ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator";
    CommonMoveValidatorNames["ClickCampCardHoldaMoveValidator"] = "ClickCampCardHoldaMoveValidator";
    CommonMoveValidatorNames["ClickCoinToUpgradeMoveValidator"] = "ClickCoinToUpgradeMoveValidator";
    CommonMoveValidatorNames["PickConcreteCoinToUpgradeMoveValidator"] = "PickConcreteCoinToUpgradeMoveValidator";
    CommonMoveValidatorNames["ClickHeroCardMoveValidator"] = "ClickHeroCardMoveValidator";
    CommonMoveValidatorNames["DiscardTopCardFromSuitMoveValidator"] = "DiscardTopCardFromSuitMoveValidator";
    CommonMoveValidatorNames["DiscardSuitCardFromPlayerBoardMoveValidator"] = "DiscardSuitCardFromPlayerBoardMoveValidator";
    CommonMoveValidatorNames["PickDiscardCardMoveValidator"] = "PickDiscardCardMoveValidator";
    CommonMoveValidatorNames["PlaceMultiSuitCardMoveValidator"] = "PlaceMultiSuitCardMoveValidator";
    CommonMoveValidatorNames["PlaceThrudHeroMoveValidator"] = "PlaceThrudHeroMoveValidator";
    CommonMoveValidatorNames["UpgradeCoinVidofnirVedrfolnirMoveValidator"] = "UpgradeCoinVidofnirVedrfolnirMoveValidator";
})(CommonMoveValidatorNames || (CommonMoveValidatorNames = {}));
/**
 * <h3>Перечисление для названия общих соло бот валидаторов мувов.</h3>
 */
export var SoloBotCommonMoveValidatorNames;
(function (SoloBotCommonMoveValidatorNames) {
    SoloBotCommonMoveValidatorNames["SoloBotClickHeroCardMoveValidator"] = "SoloBotClickHeroCardMoveValidator";
    SoloBotCommonMoveValidatorNames["SoloBotPlaceThrudHeroMoveValidator"] = "SoloBotPlaceThrudHeroMoveValidator";
})(SoloBotCommonMoveValidatorNames || (SoloBotCommonMoveValidatorNames = {}));
/**
 * <h3>Перечисление для названия общих соло бот улучшений монеты валидаторов мувов.</h3>
 */
export var SoloBotCommonCoinUpgradeMoveValidatorNames;
(function (SoloBotCommonCoinUpgradeMoveValidatorNames) {
    SoloBotCommonCoinUpgradeMoveValidatorNames["SoloBotClickCoinToUpgradeMoveValidator"] = "SoloBotClickCoinToUpgradeMoveValidator";
})(SoloBotCommonCoinUpgradeMoveValidatorNames || (SoloBotCommonCoinUpgradeMoveValidatorNames = {}));
/**
 * <h3>Перечисление для названия общих соло бот Andvari валидаторов мувов.</h3>
 */
export var SoloBotAndvariCommonMoveValidatorNames;
(function (SoloBotAndvariCommonMoveValidatorNames) {
    SoloBotAndvariCommonMoveValidatorNames["SoloBotAndvariClickHeroCardMoveValidator"] = "SoloBotAndvariClickHeroCardMoveValidator";
    SoloBotAndvariCommonMoveValidatorNames["SoloBotAndvariPlaceThrudHeroMoveValidator"] = "SoloBotAndvariPlaceThrudHeroMoveValidator";
    SoloBotAndvariCommonMoveValidatorNames["SoloBotAndvariClickCoinToUpgradeMoveValidator"] = "SoloBotAndvariClickCoinToUpgradeMoveValidator";
})(SoloBotAndvariCommonMoveValidatorNames || (SoloBotAndvariCommonMoveValidatorNames = {}));
//# sourceMappingURL=enums.js.map