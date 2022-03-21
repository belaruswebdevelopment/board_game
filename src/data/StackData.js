import { ConfigNames, DrawNames, Stages, SuitNames } from "../typescript/enums";
export const StackData = {
    addCoinToPouch: (number) => ({
        config: {
            name: ConfigNames.AddCoinToPouchVidofnirVedrfolnir,
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
            name: ConfigNames.BonfurAction,
            suit: SuitNames.BLACKSMITH,
        },
    }),
    discardCardFromBoardCrovaxTheDoppelganger: () => ({
        config: {
            stageName: Stages.DiscardBoardCard,
            drawName: DrawNames.CrovaxTheDoppelganger,
            name: ConfigNames.CrovaxTheDoppelgangerAction,
            suit: null,
        },
    }),
    discardCardFromBoardDagda: (number) => ({
        config: {
            stageName: Stages.DiscardBoardCard,
            drawName: DrawNames.Dagda,
            name: ConfigNames.DagdaAction,
            suit: SuitNames.HUNTER,
            number,
        },
    }),
    discardSuitCard: (playerId) => ({
        playerId,
        config: {
            suit: SuitNames.WARRIOR,
        },
    }),
    discardSuitCardHofud: () => ({
        config: {
            suit: SuitNames.WARRIOR,
            name: ConfigNames.HofudAction,
            drawName: DrawNames.Hofud,
        },
    }),
    discardTavernCard: () => ({
        config: {
            stageName: Stages.DiscardCard,
            name: ConfigNames.DiscardCard,
            drawName: DrawNames.DiscardTavernCard,
        },
    }),
    enlistmentMercenaries: () => ({
        config: {
            name: ConfigNames.EnlistmentMercenaries,
            drawName: DrawNames.EnlistmentMercenaries,
        },
    }),
    getDistinctions: () => ({
        config: {
            drawName: DrawNames.GetMjollnirProfit,
        },
    }),
    getMjollnirProfit: () => ({
        config: {
            name: ConfigNames.GetMjollnirProfit,
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
    pickDiscardCardAndumia: () => ({
        config: {
            stageName: Stages.PickDiscardCard,
            drawName: DrawNames.Andumia,
        },
    }),
    pickDiscardCardBrisingamens: (number) => ({
        config: {
            stageName: Stages.PickDiscardCard,
            name: ConfigNames.BrisingamensAction,
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
            name: ConfigNames.PlaceOlwinCards,
            stageName: Stages.PlaceOlwinCards,
            drawName: DrawNames.Olwin,
            number,
        },
    }),
    placeThrudHero: (suit) => ({
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
            name: ConfigNames.PlaceThrudHero,
            drawName: DrawNames.Thrud,
            suit,
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
            name: ConfigNames.PlaceYludHero,
        },
    }),
    pickHero: () => ({
        config: {
            stageName: Stages.PickHero,
            drawName: DrawNames.PickHero,
        },
    }),
    placeEnlistmentMercenaries: () => ({
        config: {
            name: ConfigNames.PlaceEnlistmentMercenaries,
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
            name: ConfigNames.UpgradeCoin,
            stageName: Stages.UpgradeCoin,
            value,
            drawName: DrawNames.UpgradeCoin,
        },
    }),
    upgradeCoinVidofnirVedrfolnir: (value, coinId) => ({
        config: {
            coinId,
            name: ConfigNames.VidofnirVedrfolnirAction,
            stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
            value,
            drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
        },
    }),
    upgradeCoinWarriorDistinction: () => ({
        config: {
            name: ConfigNames.UpgradeCoin,
            stageName: Stages.UpgradeCoin,
            value: 5,
            drawName: DrawNames.UpgradeCoinWarriorDistinction,
        },
    }),
};
//# sourceMappingURL=StackData.js.map