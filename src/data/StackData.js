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
            name: ConfigNames.BrisingamensEndGameAction,
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
            name: ConfigNames.HoldaAction,
        },
    }),
    pickDiscardCardAndumia: () => ({
        config: {
            stageName: Stages.PickDiscardCard,
            drawName: DrawNames.Andumia,
            name: ConfigNames.AndumiaAction,
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
    placeCardsOlwin: (number) => ({
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
            name: ConfigNames.PlaceCards,
            stageName: Stages.PlaceCards,
            drawName: DrawNames.Olwin,
            number,
        },
    }),
    placeCardsThrud: (suit) => ({
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
        // TODO Check and fix it!
        // config: {
        //     name: HeroNames.Thrud,
        // },
        config: {
            stageName: Stages.PlaceCards,
            name: ConfigNames.PlaceCards,
            drawName: DrawNames.Thrud,
            suit,
        },
    }),
    placeCardsYlud: () => ({
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
        // TODO Fix it!
        // config: {
        //     name: ConfigNames.Ylud,
        // },
        config: {
            stageName: Stages.PlaceCards,
            drawName: DrawNames.Ylud,
            name: ConfigNames.PlaceCards,
        },
    }),
    pickHero: () => ({
        config: {
            stageName: Stages.PickHero,
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