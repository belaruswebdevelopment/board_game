import { IStack } from "../typescript/action_interfaces";
import { ConfigNames, DrawNames, Stages, SuitNames } from "../typescript/enums";

export const StackData = {
    addCoinToPouch: (number: number): IStack => ({
        config: {
            name: ConfigNames.AddCoinToPouchVidofnirVedrfolnir,
            stageName: Stages.AddCoinToPouch,
            number,
            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
        },
    }),
    brisingamensEndGameAction: (): IStack => ({
        config: {
            name: ConfigNames.BrisingamensEndGameAction,
            drawName: DrawNames.BrisingamensEndGame,
        },
    }),
    discardCardFromBoardBonfur: (): IStack => ({
        config: {
            stageName: Stages.DiscardBoardCard,
            drawName: DrawNames.Bonfur,
            name: ConfigNames.BonfurAction,
            suit: SuitNames.BLACKSMITH,
        },
    }),
    discardCardFromBoardDagda: (number?: number): IStack => ({
        config: {
            stageName: Stages.DiscardBoardCard,
            drawName: DrawNames.Dagda,
            name: ConfigNames.DagdaAction,
            suit: SuitNames.HUNTER,
            number,
        },
    }),
    discardSuitCard: (playerId: number): IStack => ({
        playerId,
        config: {
            suit: SuitNames.WARRIOR,
        },
    }),
    discardSuitCardHofud: (): IStack => ({
        config: {
            suit: SuitNames.WARRIOR,
            name: ConfigNames.HofudAction,
            drawName: DrawNames.Hofud,
        },
    }),
    discardTavernCard: (): IStack => ({
        config: {
            stageName: Stages.DiscardCard,
            name: ConfigNames.DiscardCard,
            drawName: DrawNames.DiscardTavernCard,
        },
    }),
    enlistmentMercenaries: (): IStack => ({
        config: {
            name: ConfigNames.EnlistmentMercenaries,
            drawName: DrawNames.EnlistmentMercenaries,
        },
    }),
    getMjollnirProfit: (): IStack => ({
        config: {
            name: ConfigNames.GetMjollnirProfit,
            drawName: DrawNames.Mjollnir,
        },
    }),
    pickCampCardHolda: (): IStack => ({
        config: {
            stageName: Stages.PickCampCardHolda,
            drawName: DrawNames.Holda,
            name: ConfigNames.HoldaAction,
        },
    }),
    pickDiscardCardAndumia: (): IStack => ({
        config: {
            stageName: Stages.PickDiscardCard,
            drawName: DrawNames.Andumia,
            name: ConfigNames.AndumiaAction,
        },
    }),
    pickDiscardCardBrisingamens: (number?: number): IStack => ({
        config: {
            stageName: Stages.PickDiscardCard,
            name: ConfigNames.BrisingamensAction,
            drawName: DrawNames.Brisingamens,
            number,
        },
    }),
    pickDistinctionCard: (): IStack => ({
        config: {
            name: ConfigNames.ExplorerDistinction,
            stageName: Stages.PickDistinctionCard,
            drawName: DrawNames.PickCardByExplorerDistinction,
        },
    }),
    placeCardsOlwin: (number?: number): IStack => ({
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
    placeCardsThrud: (suit?: string): IStack => ({
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
    placeCardsYlud: (): IStack => ({
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
    pickHero: (): IStack => ({
        config: {
            stageName: Stages.PickHero,
        },
    }),
    placeEnlistmentMercenaries: (): IStack => ({
        config: {
            name: ConfigNames.PlaceEnlistmentMercenaries,
            drawName: DrawNames.PlaceEnlistmentMercenaries,
        },
    }),
    startOrPassEnlistmentMercenaries: (): IStack => ({
        config: {
            name: ConfigNames.StartOrPassEnlistmentMercenaries,
            drawName: DrawNames.StartOrPassEnlistmentMercenaries,
        },
    }),
    upgradeCoin: (value: number): IStack => ({
        config: {
            name: ConfigNames.UpgradeCoin,
            stageName: Stages.UpgradeCoin,
            value,
            drawName: DrawNames.UpgradeCoin,
        },
    }),
    upgradeCoinVidofnirVedrfolnir: (value: number, coinId?: number): IStack => ({
        config: {
            coinId,
            name: ConfigNames.VidofnirVedrfolnirAction,
            stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
            value,
            drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
        },
    }),
    upgradeCoinWarriorDistinction: (): IStack => ({
        config: {
            name: ConfigNames.UpgradeCoin,
            stageName: Stages.UpgradeCoin,
            value: 5,
            drawName: DrawNames.UpgradeCoinWarriorDistinction,
        },
    }),
};
