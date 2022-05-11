import { ConfigNames, DrawNames, Stages, SuitNames } from "../typescript/enums";
export const StackData = {
    addCoinToPouch: (number) => ({
        config: {
            stageName: Stages.AddCoinToPouch,
            number,
            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
        },
    }),
    brisingamensEndGameAction: () => ({
        config: {
            drawName: DrawNames.BrisingamensEndGame,
        },
    }),
    discardCardFromBoardBonfur: () => ({
        config: {
            stageName: Stages.DiscardBoardCard,
            drawName: DrawNames.Bonfur,
            suit: SuitNames.BLACKSMITH,
        },
    }),
    discardCardFromBoardCrovaxTheDoppelganger: () => ({
        config: {
            stageName: Stages.DiscardBoardCard,
            drawName: DrawNames.CrovaxTheDoppelganger,
        },
    }),
    discardCardFromBoardDagda: (number) => ({
        config: {
            stageName: Stages.DiscardBoardCard,
            drawName: DrawNames.Dagda,
            suit: SuitNames.HUNTER,
            number,
        },
    }),
    discardSuitCard: (playerId) => ({
        playerId,
    }),
    discardSuitCardHofud: () => ({
        config: {
            drawName: DrawNames.Hofud,
        },
    }),
    discardTavernCard: () => ({
        config: {
            stageName: Stages.DiscardCard,
            drawName: DrawNames.DiscardTavernCard,
        },
    }),
    enlistmentMercenaries: () => ({
        config: {
            drawName: DrawNames.EnlistmentMercenaries,
        },
    }),
    getDifficultyLevelForSoloMode: () => ({
        config: {
            drawName: DrawNames.EnlistmentMercenaries,
        },
    }),
    getHeroesForSoloMode: () => ({
        config: {
            stageName: Stages.ChooseHeroesForSoloMode,
            drawName: DrawNames.GetHeroesForSoloMode,
        },
    }),
    getDistinctions: () => ({
        config: {
            drawName: DrawNames.GetMjollnirProfit,
        },
    }),
    getMjollnirProfit: () => ({
        config: {
            drawName: DrawNames.Mjollnir,
        },
    }),
    pickCampCardHolda: () => ({
        config: {
            stageName: Stages.PickCampCardHolda,
            drawName: DrawNames.Holda,
        },
    }),
    pickCard: () => ({
        config: {
            drawName: DrawNames.PickCard,
        },
    }),
    pickConcreteCoinToUpgrade: (coinValue, value) => ({
        config: {
            stageName: Stages.PickConcreteCoinToUpgrade,
            drawName: DrawNames.PickConcreteCoinToUpgrade,
            coinValue,
            value,
        },
    }),
    pickDiscardCardAndumia: () => ({
        config: {
            stageName: Stages.PickDiscardCard,
            drawName: DrawNames.Andumia,
        },
    }),
    pickDiscardCardBrisingamens: (number) => ({
        config: {
            stageName: Stages.PickDiscardCard,
            drawName: DrawNames.Brisingamens,
            number,
        },
    }),
    pickDistinctionCard: () => ({
        config: {
            name: ConfigNames.ExplorerDistinction,
            stageName: Stages.PickDistinctionCard,
            drawName: DrawNames.PickCardByExplorerDistinction,
        },
    }),
    placeOlwinCards: (number) => ({
        variants: {
            blacksmith: {
                suit: SuitNames.BLACKSMITH,
                rank: 1,
                points: null,
            },
            hunter: {
                suit: SuitNames.HUNTER,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: SuitNames.EXPLORER,
                rank: 1,
                points: 0,
            },
            warrior: {
                suit: SuitNames.WARRIOR,
                rank: 1,
                points: 0,
            },
            miner: {
                suit: SuitNames.MINER,
                rank: 1,
                points: 0,
            },
        },
        config: {
            stageName: Stages.PlaceOlwinCards,
            drawName: DrawNames.Olwin,
            number,
        },
    }),
    placeThrudHero: () => ({
        variants: {
            blacksmith: {
                suit: SuitNames.BLACKSMITH,
                rank: 1,
                points: null,
            },
            hunter: {
                suit: SuitNames.HUNTER,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: SuitNames.EXPLORER,
                rank: 1,
                points: null,
            },
            warrior: {
                suit: SuitNames.WARRIOR,
                rank: 1,
                points: null,
            },
            miner: {
                suit: SuitNames.MINER,
                rank: 1,
                points: null,
            },
        },
        config: {
            stageName: Stages.PlaceThrudHero,
            drawName: DrawNames.Thrud,
        },
    }),
    placeTradingCoinsUline: (number) => ({
        config: {
            stageName: Stages.PlaceTradingCoinsUline,
            drawName: DrawNames.PlaceTradingCoinsUline,
            number,
        },
    }),
    placeYludHero: () => ({
        variants: {
            blacksmith: {
                suit: SuitNames.BLACKSMITH,
                rank: 1,
                points: null,
            },
            hunter: {
                suit: SuitNames.HUNTER,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: SuitNames.EXPLORER,
                rank: 1,
                points: 11,
            },
            warrior: {
                suit: SuitNames.WARRIOR,
                rank: 1,
                points: 7,
            },
            miner: {
                suit: SuitNames.MINER,
                rank: 1,
                points: 1,
            },
        },
        config: {
            drawName: DrawNames.Ylud,
        },
    }),
    pickHero: () => ({
        config: {
            stageName: Stages.PickHero,
            drawName: DrawNames.PickHero,
        },
    }),
    pickHeroSoloBot: () => ({
        config: {
            stageName: Stages.PickHeroSoloBot,
            drawName: DrawNames.PickHeroSoloBot,
        },
    }),
    placeEnlistmentMercenaries: () => ({
        config: {
            drawName: DrawNames.PlaceEnlistmentMercenaries,
        },
    }),
    startOrPassEnlistmentMercenaries: () => ({
        config: {
            name: ConfigNames.StartOrPassEnlistmentMercenaries,
            drawName: DrawNames.StartOrPassEnlistmentMercenaries,
        },
    }),
    upgradeCoin: (value) => ({
        config: {
            stageName: Stages.UpgradeCoin,
            value,
            drawName: DrawNames.UpgradeCoin,
        },
    }),
    upgradeCoinVidofnirVedrfolnir: (value, coinId) => ({
        config: {
            coinId,
            stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
            value,
            drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
        },
    }),
    upgradeCoinWarriorDistinction: () => ({
        config: {
            stageName: Stages.UpgradeCoin,
            value: 5,
            drawName: DrawNames.UpgradeCoinWarriorDistinction,
        },
    }),
};
//# sourceMappingURL=StackData.js.map