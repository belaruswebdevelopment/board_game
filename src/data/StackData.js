import { ChooseDifficultySoloModeStageNames, CommonStageNames, ConfigNames, DrawNames, EnlistmentMercenariesStageNames, GiantNames, HeroNames, MultiSuitCardNames, SoloBotAndvariCommonStageNames, SoloBotCommonStageNames, SuitNames, TavernsResolutionStageNames, TroopEvaluationStageNames } from "../typescript/enums";
/**
 * <h3>Данные об стеке действий.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным об стеке действий.</li>
 * </ol>
 */
export const StackData = {
    activateGiantAbilityOrPickCard: (giantName, card) => ({
        configName: ConfigNames.ActivateGiantAbilityOrPickCard,
        stageName: TavernsResolutionStageNames.ActivateGiantAbilityOrPickCard,
        drawName: DrawNames.ActivateGiantAbilityOrPickCard,
        giantName,
        card,
    }),
    addCoinToPouch: () => ({
        stageName: CommonStageNames.AddCoinToPouch,
        drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
    }),
    brisingamensEndGameAction: () => ({
        drawName: DrawNames.BrisingamensEndGame,
    }),
    chooseSuitOlrun: () => ({
        stageName: TavernsResolutionStageNames.ChooseSuitOlrun,
        drawName: DrawNames.ChooseSuitOlrun,
    }),
    chooseStrategyLevelForSoloModeAndvari: () => ({
        configName: ConfigNames.ChooseStrategyLevelForSoloModeAndvari,
        drawName: DrawNames.ChooseStrategyLevelForSoloModeAndvari,
    }),
    chooseStrategyVariantLevelForSoloModeAndvari: () => ({
        configName: ConfigNames.ChooseStrategyVariantLevelForSoloModeAndvari,
        drawName: DrawNames.ChooseStrategyVariantLevelForSoloModeAndvari,
    }),
    discardCardFromBoardBonfur: () => ({
        stageName: CommonStageNames.DiscardBoardCard,
        drawName: DrawNames.Bonfur,
        suit: SuitNames.blacksmith,
    }),
    discardCardFromBoardCrovaxTheDoppelganger: () => ({
        stageName: CommonStageNames.DiscardBoardCard,
        drawName: DrawNames.CrovaxTheDoppelganger,
    }),
    discardCardFromBoardDagda: (pickedSuit) => ({
        stageName: CommonStageNames.DiscardBoardCard,
        drawName: DrawNames.Dagda,
        suit: SuitNames.hunter,
        pickedSuit,
        name: HeroNames.Dagda,
    }),
    discardSuitCard: (playerId) => ({
        playerId,
    }),
    discardSuitCardHofud: () => ({
        drawName: DrawNames.Hofud,
    }),
    discardTavernCard: () => ({
        stageName: TavernsResolutionStageNames.DiscardCard,
        drawName: DrawNames.DiscardTavernCard,
    }),
    enlistmentMercenaries: () => ({
        drawName: DrawNames.EnlistmentMercenaries,
    }),
    getDifficultyLevelForSoloMode: () => ({
        configName: ConfigNames.GetDifficultyLevelForSoloMode,
        drawName: DrawNames.GetDifficultyLevelForSoloMode,
    }),
    getMythologyCardSkymir: (priority) => ({
        configName: ConfigNames.ChooseGetMythologyCard,
        stageName: TavernsResolutionStageNames.GetMythologyCard,
        drawName: DrawNames.GetMythologyCardSkymir,
        priority,
    }),
    getHeroesForSoloMode: () => ({
        configName: ConfigNames.GetHeroesForSoloMode,
        stageName: ChooseDifficultySoloModeStageNames.ChooseHeroesForSoloMode,
        drawName: DrawNames.GetHeroesForSoloMode,
    }),
    getDistinctions: () => ({
        drawName: DrawNames.GetMjollnirProfit,
    }),
    getMjollnirProfit: () => ({
        drawName: DrawNames.Mjollnir,
    }),
    pickCampCardHolda: () => ({
        stageName: CommonStageNames.PickCampCardHolda,
        drawName: DrawNames.Holda,
    }),
    pickCard: () => ({
        drawName: DrawNames.PickCard,
    }),
    pickCardSoloBot: () => ({
        drawName: DrawNames.PickCardSoloBot,
    }),
    pickCardSoloBotAndvari: () => ({
        drawName: DrawNames.PickCardSoloBotAndvari,
    }),
    // TODO Is it need for solo bot & Andvari?
    pickConcreteCoinToUpgrade: (coinValue, value) => ({
        stageName: CommonStageNames.PickConcreteCoinToUpgrade,
        drawName: DrawNames.PickConcreteCoinToUpgrade,
        coinValue,
        value,
    }),
    pickDiscardCardAndumia: () => ({
        stageName: CommonStageNames.PickDiscardCard,
        drawName: DrawNames.Andumia,
    }),
    pickDiscardCardBrisingamens: (priority) => ({
        stageName: CommonStageNames.PickDiscardCard,
        drawName: DrawNames.Brisingamens,
        priority,
    }),
    pickDistinctionCard: () => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: TroopEvaluationStageNames.PickDistinctionCard,
        drawName: DrawNames.PickCardByExplorerDistinction,
    }),
    pickDistinctionCardSoloBot: () => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: TroopEvaluationStageNames.PickDistinctionCardSoloBot,
        drawName: DrawNames.PickCardByExplorerDistinctionSoloBot,
    }),
    pickDistinctionCardSoloBotAndvari: () => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: TroopEvaluationStageNames.PickDistinctionCardSoloBotAndvari,
        drawName: DrawNames.PickCardByExplorerDistinctionSoloBotAndvari,
    }),
    placeMultiSuitsCards: (name, pickedSuit, priority) => ({
        stageName: CommonStageNames.PlaceMultiSuitsCards,
        drawName: DrawNames.PlaceMultiSuitsCards,
        pickedSuit,
        priority,
        name,
    }),
    placeThrudHero: () => ({
        stageName: CommonStageNames.PlaceThrudHero,
        drawName: DrawNames.PlaceThrudHero,
        priority: 2,
        name: HeroNames.Thrud,
    }),
    placeThrudHeroSoloBot: () => ({
        stageName: SoloBotCommonStageNames.PlaceThrudHeroSoloBot,
        drawName: DrawNames.PlaceThrudHeroSoloBot,
        priority: 2,
        name: HeroNames.Thrud,
    }),
    placeThrudHeroSoloBotAndvari: () => ({
        stageName: SoloBotAndvariCommonStageNames.PlaceThrudHeroSoloBotAndvari,
        drawName: DrawNames.PlaceThrudHeroSoloBotAndvari,
        priority: 2,
        name: HeroNames.Thrud,
    }),
    placeTradingCoinsUline: () => ({
        stageName: TavernsResolutionStageNames.PlaceTradingCoinsUline,
        drawName: DrawNames.PlaceTradingCoinsUline,
    }),
    placeYludHero: () => ({
        drawName: DrawNames.PlaceYludHero,
        name: HeroNames.Ylud,
    }),
    placeYludHeroSoloBot: () => ({
        drawName: DrawNames.PlaceYludHero,
        name: HeroNames.Ylud,
    }),
    placeYludHeroSoloBotAndvari: () => ({
        drawName: DrawNames.PlaceYludHero,
        name: HeroNames.Ylud,
    }),
    pickHero: (priority) => ({
        stageName: CommonStageNames.PickHero,
        drawName: DrawNames.PickHero,
        priority,
    }),
    pickHeroSoloBot: (priority) => ({
        stageName: SoloBotCommonStageNames.PickHeroSoloBot,
        drawName: DrawNames.PickHeroSoloBot,
        priority,
    }),
    pickHeroSoloBotAndvari: (priority) => ({
        stageName: SoloBotAndvariCommonStageNames.PickHeroSoloBotAndvari,
        drawName: DrawNames.PickHeroSoloBotAndvari,
        priority,
    }),
    placeEnlistmentMercenaries: (card) => ({
        stageName: EnlistmentMercenariesStageNames.PlaceEnlistmentMercenaries,
        drawName: DrawNames.PlaceEnlistmentMercenaries,
        card,
    }),
    startAddPlusTwoValueToAllCoinsUline: (coinId) => ({
        stageName: TavernsResolutionStageNames.ChooseCoinValueForHrungnirUpgrade,
        drawName: DrawNames.StartAddPlusTwoValueToAllCoinsUline,
        coinId,
    }),
    startChooseCoinValueForVidofnirVedrfolnirUpgrade: (valueArray, coinId, priority) => ({
        configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
        stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
        drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
        valueArray,
        coinId,
        priority,
    }),
    startOrPassEnlistmentMercenaries: () => ({
        configName: ConfigNames.StartOrPassEnlistmentMercenaries,
        drawName: DrawNames.StartOrPassEnlistmentMercenaries,
    }),
    upgradeCoin: (value) => ({
        stageName: CommonStageNames.UpgradeCoin,
        value,
        drawName: DrawNames.UpgradeCoin,
    }),
    upgradeCoinSoloBot: (value) => ({
        stageName: SoloBotCommonStageNames.UpgradeCoinSoloBot,
        value,
        drawName: DrawNames.UpgradeCoinSoloBot,
    }),
    upgradeCoinSoloBotAndvari: (value) => ({
        stageName: SoloBotAndvariCommonStageNames.UpgradeCoinSoloBotAndvari,
        value,
        drawName: DrawNames.UpgradeCoinSoloBotAndvari,
    }),
    upgradeCoinVidofnirVedrfolnir: (value, coinId, priority) => ({
        coinId,
        stageName: CommonStageNames.UpgradeVidofnirVedrfolnirCoin,
        value,
        drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
        priority,
    }),
    upgradeCoinWarriorDistinction: () => ({
        stageName: CommonStageNames.UpgradeCoin,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinction,
    }),
    upgradeCoinWarriorDistinctionSoloBot: () => ({
        stageName: SoloBotCommonStageNames.UpgradeCoinSoloBot,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinctionSoloBot,
    }),
    upgradeCoinWarriorDistinctionSoloBotAndvari: () => ({
        stageName: SoloBotAndvariCommonStageNames.UpgradeCoinSoloBotAndvari,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinctionSoloBotAndvari,
    }),
};
//# sourceMappingURL=StackData.js.map