import { ConfigNames, DrawNames, Stages, SuitNames } from "../typescript/enums";
import type { IStack, SuitTypes } from "../typescript/interfaces";

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
    discardCardFromBoardCrovaxTheDoppelganger: (): IStack => ({
        config: {
            stageName: Stages.DiscardBoardCard,
            drawName: DrawNames.CrovaxTheDoppelganger,
            name: ConfigNames.CrovaxTheDoppelgangerAction,
            suit: null,
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
    getDistinctions: (): IStack => ({
        config: {
            drawName: DrawNames.GetMjollnirProfit,
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
        },
    }),
    pickCard: (): IStack => ({
        config: {
            drawName: DrawNames.PickCard,
        },
    }),
    pickDiscardCardAndumia: (): IStack => ({
        config: {
            stageName: Stages.PickDiscardCard,
            drawName: DrawNames.Andumia,
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
    placeOlwinCards: (number?: number): IStack => ({
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
    placeThrudHero: (suit?: SuitTypes): IStack => ({
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
    placeTradingCoinsUline: (number?: number): IStack => ({
        config: {
            stageName: Stages.PlaceTradingCoinsUline,
            drawName: DrawNames.PlaceTradingCoinsUline,
            number,
        },
    }),
    placeYludHero: (): IStack => ({
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
    pickHero: (): IStack => ({
        config: {
            stageName: Stages.PickHero,
            drawName: DrawNames.PickHero,
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
