import { ChooseDifficultySoloModeStageNames, CommonStageNames, ConfigNames, DrawNames, EnlistmentMercenariesStageNames, GiantNames, GodNames, HeroNames, MultiSuitCardNames, SoloBotAndvariCommonStageNames, SoloBotCommonCoinUpgradeStageNames, SoloBotCommonStageNames, SuitNames, TavernsResolutionStageNames, TavernsResolutionWithSubStageNames, TroopEvaluationStageNames } from "../typescript/enums";
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
        stageName: TavernsResolutionWithSubStageNames.ActivateGiantAbilityOrPickCard,
        drawName: DrawNames.ActivateGiantAbilityOrPickCard,
        giantName,
        card,
    }),
    activateGodAbilityOrNot: (godName) => ({
        configName: ConfigNames.ActivateGodAbilityOrNot,
        stageName: TavernsResolutionWithSubStageNames.ActivateGodAbilityOrNot,
        drawName: DrawNames.ActivateGodAbilityOrNot,
        godName,
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
        stageName: CommonStageNames.DiscardTopCardFromSuit,
        drawName: DrawNames.Bonfur,
        suit: SuitNames.blacksmith,
    }),
    discardCardFromBoardCrovaxTheDoppelganger: () => ({
        stageName: CommonStageNames.DiscardTopCardFromSuit,
        drawName: DrawNames.CrovaxTheDoppelganger,
    }),
    discardCardFromBoardDagda: (pickedSuit) => ({
        stageName: CommonStageNames.DiscardTopCardFromSuit,
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
        stageName: TavernsResolutionStageNames.DiscardCard2Players,
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
        stageName: ChooseDifficultySoloModeStageNames.ChooseHeroForDifficultySoloMode,
        drawName: DrawNames.GetHeroesForSoloMode,
    }),
    getDistinctions: () => ({
        drawName: DrawNames.GetMjollnirProfit,
    }),
    getMjollnirProfit: () => ({
        drawName: DrawNames.Mjollnir,
    }),
    pickCampCardHolda: () => ({
        stageName: CommonStageNames.ClickCampCardHolda,
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
        stageName: TroopEvaluationStageNames.ClickCardToPickDistinction,
        drawName: DrawNames.PickCardByExplorerDistinction,
    }),
    pickDistinctionCardSoloBot: () => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: TroopEvaluationStageNames.SoloBotClickCardToPickDistinction,
        drawName: DrawNames.PickCardByExplorerDistinctionSoloBot,
    }),
    pickDistinctionCardSoloBotAndvari: () => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: TroopEvaluationStageNames.SoloBotAndvariClickCardToPickDistinction,
        drawName: DrawNames.PickCardByExplorerDistinctionSoloBotAndvari,
    }),
    placeMultiSuitsCards: (name, pickedSuit, priority) => ({
        stageName: CommonStageNames.PlaceMultiSuitCard,
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
        stageName: SoloBotCommonStageNames.SoloBotPlaceThrudHero,
        drawName: DrawNames.PlaceThrudHeroSoloBot,
        priority: 2,
        name: HeroNames.Thrud,
    }),
    placeThrudHeroSoloBotAndvari: () => ({
        stageName: SoloBotAndvariCommonStageNames.SoloBotAndvariPlaceThrudHero,
        drawName: DrawNames.PlaceThrudHeroSoloBotAndvari,
        priority: 2,
        name: HeroNames.Thrud,
    }),
    placeTradingCoinsUline: () => ({
        stageName: TavernsResolutionStageNames.ClickHandTradingCoinUline,
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
        stageName: CommonStageNames.ClickHeroCard,
        drawName: DrawNames.PickHero,
        priority,
    }),
    pickHeroSoloBot: (priority) => ({
        stageName: SoloBotCommonStageNames.SoloBotClickHeroCard,
        drawName: DrawNames.PickHeroSoloBot,
        priority,
    }),
    pickHeroSoloBotAndvari: (priority) => ({
        stageName: SoloBotAndvariCommonStageNames.SoloBotAndvariClickHeroCard,
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
        stageName: CommonStageNames.ClickCoinToUpgrade,
        value,
        drawName: DrawNames.UpgradeCoin,
    }),
    upgradeCoinSoloBot: (value) => ({
        stageName: SoloBotCommonCoinUpgradeStageNames.SoloBotClickCoinToUpgrade,
        value,
        drawName: DrawNames.UpgradeCoinSoloBot,
    }),
    upgradeCoinSoloBotAndvari: (value) => ({
        stageName: SoloBotAndvariCommonStageNames.SoloBotAndvariClickCoinToUpgrade,
        value,
        drawName: DrawNames.UpgradeCoinSoloBotAndvari,
    }),
    upgradeCoinVidofnirVedrfolnir: (value, coinId, priority) => ({
        coinId,
        stageName: CommonStageNames.UpgradeCoinVidofnirVedrfolnir,
        value,
        drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
        priority,
    }),
    upgradeCoinWarriorDistinction: () => ({
        stageName: CommonStageNames.ClickCoinToUpgrade,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinction,
    }),
    upgradeCoinWarriorDistinctionSoloBot: () => ({
        stageName: SoloBotCommonCoinUpgradeStageNames.SoloBotClickCoinToUpgrade,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinctionSoloBot,
    }),
    upgradeCoinWarriorDistinctionSoloBotAndvari: () => ({
        stageName: SoloBotAndvariCommonStageNames.SoloBotAndvariClickCoinToUpgrade,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinctionSoloBotAndvari,
    }),
};
//# sourceMappingURL=StackData.js.map