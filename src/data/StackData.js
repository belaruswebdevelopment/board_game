import { ConfigNames, DrawNames, StageNames, SuitNames } from "../typescript/enums";
// TODO Add type!
export const StackData = {
    addCoinToPouch: (number) => ({
        stageName: StageNames.AddCoinToPouch,
        number,
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
    discardCardFromBoardDagda: (number = 2) => ({
        stageName: StageNames.DiscardBoardCard,
        drawName: DrawNames.Dagda,
        suit: SuitNames.Hunter,
        number,
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
        name: ConfigNames.GetDifficultyLevelForSoloMode,
        drawName: DrawNames.GetDifficultyLevelForSoloMode,
    }),
    getHeroesForSoloMode: (number) => ({
        name: ConfigNames.GetHeroesForSoloMode,
        stageName: StageNames.ChooseHeroesForSoloMode,
        drawName: DrawNames.GetHeroesForSoloMode,
        number,
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
    pickDiscardCardBrisingamens: (number = 2, priority) => ({
        stageName: StageNames.PickDiscardCard,
        drawName: DrawNames.Brisingamens,
        number,
        priority,
    }),
    pickDistinctionCard: () => ({
        name: ConfigNames.ExplorerDistinction,
        stageName: StageNames.PickDistinctionCard,
        drawName: DrawNames.PickCardByExplorerDistinction,
    }),
    pickDistinctionCardSoloBot: () => ({
        stageName: StageNames.PickDistinctionCardSoloBot,
        drawName: DrawNames.PickCardByExplorerDistinctionSoloBot,
    }),
    placeOlwinCards: (number = 2, suit, priority) => ({
        variants: {
            blacksmith: {
                suit: SuitNames.Blacksmith,
                rank: 1,
                points: null,
            },
            hunter: {
                suit: SuitNames.Hunter,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: SuitNames.Explorer,
                rank: 1,
                points: 0,
            },
            warrior: {
                suit: SuitNames.Warrior,
                rank: 1,
                points: 0,
            },
            miner: {
                suit: SuitNames.Miner,
                rank: 1,
                points: 0,
            },
        },
        stageName: StageNames.PlaceOlwinCards,
        drawName: DrawNames.PlaceOlwinDouble,
        number,
        suit,
        priority,
    }),
    placeThrudHero: () => ({
        variants: {
            blacksmith: {
                suit: SuitNames.Blacksmith,
                rank: 1,
                points: null,
            },
            hunter: {
                suit: SuitNames.Hunter,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: SuitNames.Explorer,
                rank: 1,
                points: null,
            },
            warrior: {
                suit: SuitNames.Warrior,
                rank: 1,
                points: null,
            },
            miner: {
                suit: SuitNames.Miner,
                rank: 1,
                points: null,
            },
        },
        stageName: StageNames.PlaceThrudHero,
        drawName: DrawNames.PlaceThrudHero,
        priority: 2,
    }),
    placeTradingCoinsUline: (number) => ({
        stageName: StageNames.PlaceTradingCoinsUline,
        drawName: DrawNames.PlaceTradingCoinsUline,
        number,
    }),
    placeYludHero: () => ({
        // TODO Move such logic for all heroes (Thrud, Ylud, Olwin) to Hero card variants
        variants: {
            blacksmith: {
                suit: SuitNames.Blacksmith,
                rank: 1,
                points: null,
            },
            hunter: {
                suit: SuitNames.Hunter,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: SuitNames.Explorer,
                rank: 1,
                points: 11,
            },
            warrior: {
                suit: SuitNames.Warrior,
                rank: 1,
                points: 7,
            },
            miner: {
                suit: SuitNames.Miner,
                rank: 1,
                points: 1,
            },
        },
        drawName: DrawNames.PlaceYludHero,
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
    placeEnlistmentMercenaries: () => ({
        stageName: StageNames.PlaceEnlistmentMercenaries,
        drawName: DrawNames.PlaceEnlistmentMercenaries,
    }),
    startOrPassEnlistmentMercenaries: () => ({
        name: ConfigNames.StartOrPassEnlistmentMercenaries,
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