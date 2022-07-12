import { ConfigNames, DrawNames, HeroNames, MultiSuitCardNames, StageNames, SuitNames } from "../typescript/enums";
// TODO Add type!
export const StackData = {
    addCoinToPouch: () => ({
        stageName: StageNames.AddCoinToPouch,
        drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
    }),
    brisingamensEndGameAction: () => ({
        drawName: DrawNames.BrisingamensEndGame,
    }),
    discardCardFromBoardBonfur: () => ({
        stageName: StageNames.DiscardBoardCard,
        drawName: DrawNames.Bonfur,
        suit: SuitNames.Blacksmith,
    }),
    discardCardFromBoardCrovaxTheDoppelganger: () => ({
        stageName: StageNames.DiscardBoardCard,
        drawName: DrawNames.CrovaxTheDoppelganger,
    }),
    discardCardFromBoardDagda: (pickedSuit) => ({
        stageName: StageNames.DiscardBoardCard,
        drawName: DrawNames.Dagda,
        suit: SuitNames.Hunter,
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
        stageName: StageNames.DiscardCard,
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
        stageName: StageNames.ChooseHeroesForSoloMode,
        drawName: DrawNames.GetHeroesForSoloMode,
    }),
    getDistinctions: () => ({
        drawName: DrawNames.GetMjollnirProfit,
    }),
    getMjollnirProfit: () => ({
        drawName: DrawNames.Mjollnir,
    }),
    pickCampCardHolda: () => ({
        stageName: StageNames.PickCampCardHolda,
        drawName: DrawNames.Holda,
    }),
    pickCard: () => ({
        drawName: DrawNames.PickCard,
    }),
    pickConcreteCoinToUpgrade: (coinValue, value) => ({
        stageName: StageNames.PickConcreteCoinToUpgrade,
        drawName: DrawNames.PickConcreteCoinToUpgrade,
        coinValue,
        value,
    }),
    pickDiscardCardAndumia: () => ({
        stageName: StageNames.PickDiscardCard,
        drawName: DrawNames.Andumia,
    }),
    pickDiscardCardBrisingamens: (priority) => ({
        stageName: StageNames.PickDiscardCard,
        drawName: DrawNames.Brisingamens,
        priority,
    }),
    pickDistinctionCard: () => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: StageNames.PickDistinctionCard,
        drawName: DrawNames.PickCardByExplorerDistinction,
    }),
    pickDistinctionCardSoloBot: () => ({
        stageName: StageNames.PickDistinctionCardSoloBot,
        drawName: DrawNames.PickCardByExplorerDistinctionSoloBot,
    }),
    placeMultiSuitsCards: (name, pickedSuit, priority) => ({
        stageName: StageNames.PlaceMultiSuitsCards,
        drawName: DrawNames.PlaceMultiSuitsCards,
        pickedSuit,
        priority,
        name,
    }),
    placeThrudHero: () => ({
        stageName: StageNames.PlaceThrudHero,
        drawName: DrawNames.PlaceThrudHero,
        priority: 2,
        name: HeroNames.Thrud,
    }),
    placeTradingCoinsUline: () => ({
        stageName: StageNames.PlaceTradingCoinsUline,
        drawName: DrawNames.PlaceTradingCoinsUline,
    }),
    placeYludHero: () => ({
        drawName: DrawNames.PlaceYludHero,
        name: HeroNames.Ylud,
    }),
    pickHero: () => ({
        stageName: StageNames.PickHero,
        drawName: DrawNames.PickHero,
        priority: 1,
    }),
    pickHeroSoloBot: () => ({
        stageName: StageNames.PickHeroSoloBot,
        drawName: DrawNames.PickHeroSoloBot,
    }),
    placeEnlistmentMercenaries: (card) => ({
        stageName: StageNames.PlaceEnlistmentMercenaries,
        drawName: DrawNames.PlaceEnlistmentMercenaries,
        card,
    }),
    startOrPassEnlistmentMercenaries: () => ({
        configName: ConfigNames.StartOrPassEnlistmentMercenaries,
        drawName: DrawNames.StartOrPassEnlistmentMercenaries,
    }),
    upgradeCoin: (value) => ({
        stageName: StageNames.UpgradeCoin,
        value,
        drawName: DrawNames.UpgradeCoin,
    }),
    upgradeCoinVidofnirVedrfolnir: (value, coinId) => ({
        coinId,
        stageName: StageNames.UpgradeVidofnirVedrfolnirCoin,
        value,
        drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
    }),
    upgradeCoinWarriorDistinction: () => ({
        stageName: StageNames.UpgradeCoin,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinction,
    }),
};
//# sourceMappingURL=StackData.js.map