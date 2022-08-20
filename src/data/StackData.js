import { ConfigNames, DrawNames, HeroNames, MultiSuitCardNames, StageNames, SuitNames } from "../typescript/enums";
/**
 * <h3>Данные об стеке действий.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным об стеке действий.</li>
 * </ol>
 */
export const StackData = {
    addCoinToPouch: () => ({
        stageName: StageNames.addCoinToPouch,
        drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
    }),
    brisingamensEndGameAction: () => ({
        drawName: DrawNames.BrisingamensEndGame,
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
        stageName: StageNames.discardBoardCard,
        drawName: DrawNames.Bonfur,
        suit: SuitNames.blacksmith,
    }),
    discardCardFromBoardCrovaxTheDoppelganger: () => ({
        stageName: StageNames.discardBoardCard,
        drawName: DrawNames.CrovaxTheDoppelganger,
    }),
    discardCardFromBoardDagda: (pickedSuit) => ({
        stageName: StageNames.discardBoardCard,
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
        stageName: StageNames.discardCard,
        drawName: DrawNames.DiscardTavernCard,
    }),
    enlistmentMercenaries: () => ({
        drawName: DrawNames.EnlistmentMercenaries,
    }),
    getDifficultyLevelForSoloMode: () => ({
        configName: ConfigNames.GetDifficultyLevelForSoloMode,
        drawName: DrawNames.GetDifficultyLevelForSoloMode,
    }),
    getHeroesForSoloMode: () => ({
        configName: ConfigNames.GetHeroesForSoloMode,
        stageName: StageNames.chooseHeroesForSoloMode,
        drawName: DrawNames.GetHeroesForSoloMode,
    }),
    getDistinctions: () => ({
        drawName: DrawNames.GetMjollnirProfit,
    }),
    getMjollnirProfit: () => ({
        drawName: DrawNames.Mjollnir,
    }),
    pickCampCardHolda: () => ({
        stageName: StageNames.pickCampCardHolda,
        drawName: DrawNames.Holda,
    }),
    pickCard: () => ({
        drawName: DrawNames.PickCard,
    }),
    pickConcreteCoinToUpgrade: (coinValue, value) => ({
        stageName: StageNames.pickConcreteCoinToUpgrade,
        drawName: DrawNames.PickConcreteCoinToUpgrade,
        coinValue,
        value,
    }),
    pickDiscardCardAndumia: () => ({
        stageName: StageNames.pickDiscardCard,
        drawName: DrawNames.Andumia,
    }),
    pickDiscardCardBrisingamens: (priority) => ({
        stageName: StageNames.pickDiscardCard,
        drawName: DrawNames.Brisingamens,
        priority,
    }),
    pickDistinctionCard: () => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: StageNames.pickDistinctionCard,
        drawName: DrawNames.PickCardByExplorerDistinction,
    }),
    pickDistinctionCardSoloBot: () => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: StageNames.pickDistinctionCardSoloBot,
        drawName: DrawNames.PickCardByExplorerDistinctionSoloBot,
    }),
    pickDistinctionCardSoloBotAndvari: () => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: StageNames.pickDistinctionCardSoloBotAndvari,
        drawName: DrawNames.PickCardByExplorerDistinctionSoloBotAndvari,
    }),
    placeMultiSuitsCards: (name, pickedSuit, priority) => ({
        stageName: StageNames.placeMultiSuitsCards,
        drawName: DrawNames.PlaceMultiSuitsCards,
        pickedSuit,
        priority,
        name,
    }),
    placeThrudHero: () => ({
        stageName: StageNames.placeThrudHero,
        drawName: DrawNames.PlaceThrudHero,
        priority: 2,
        name: HeroNames.Thrud,
    }),
    placeTradingCoinsUline: () => ({
        stageName: StageNames.placeTradingCoinsUline,
        drawName: DrawNames.PlaceTradingCoinsUline,
    }),
    placeYludHero: () => ({
        drawName: DrawNames.PlaceYludHero,
        name: HeroNames.Ylud,
    }),
    pickHero: (priority) => ({
        stageName: StageNames.pickHero,
        drawName: DrawNames.PickHero,
        priority,
    }),
    pickHeroSoloBot: () => ({
        stageName: StageNames.pickHeroSoloBot,
        drawName: DrawNames.PickHeroSoloBot,
    }),
    pickHeroSoloBotAndvari: () => ({
        stageName: StageNames.pickHeroSoloBotAndvari,
        drawName: DrawNames.PickHeroSoloBotAndvari,
    }),
    placeEnlistmentMercenaries: (card) => ({
        stageName: StageNames.placeEnlistmentMercenaries,
        drawName: DrawNames.PlaceEnlistmentMercenaries,
        card,
    }),
    startChooseCoinValueForVidofnirVedrfolnirUpgrade: (valueArray, coinId, priority) => ({
        configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
        stageName: StageNames.chooseCoinValueForVidofnirVedrfolnirUpgrade,
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
        stageName: StageNames.upgradeCoin,
        value,
        drawName: DrawNames.UpgradeCoin,
    }),
    upgradeCoinVidofnirVedrfolnir: (value, coinId, priority) => ({
        coinId,
        stageName: StageNames.upgradeVidofnirVedrfolnirCoin,
        value,
        drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
        priority,
    }),
    upgradeCoinWarriorDistinction: () => ({
        stageName: StageNames.upgradeCoin,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinction,
    }),
};
//# sourceMappingURL=StackData.js.map