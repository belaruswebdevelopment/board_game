import { ConfigNames, DrawNames, Stages, SuitNames } from "../typescript/enums";
import type { IStack } from "../typescript/interfaces";

export const StackData = {
    addCoinToPouch: (number: number): IStack => ({
        config: {
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
            suit: SuitNames.BLACKSMITH,
        },
    }),
    discardCardFromBoardCrovaxTheDoppelganger: (): IStack => ({
        config: {
            stageName: Stages.DiscardBoardCard,
            drawName: DrawNames.CrovaxTheDoppelganger,
        },
    }),
    discardCardFromBoardDagda: (number?: number): IStack => ({
        config: {
            stageName: Stages.DiscardBoardCard,
            drawName: DrawNames.Dagda,
            suit: SuitNames.HUNTER,
            number,
        },
    }),
    discardSuitCard: (playerId: number): IStack => ({
        playerId,
    }),
    discardSuitCardHofud: (): IStack => ({
        config: {
            drawName: DrawNames.Hofud,
        },
    }),
    discardTavernCard: (): IStack => ({
        config: {
            stageName: Stages.DiscardCard,
            drawName: DrawNames.DiscardTavernCard,
        },
    }),
    enlistmentMercenaries: (): IStack => ({
        config: {
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
    pickConcreteCoinToUpgrade: (coinValue: number, value: number): IStack => ({
        config: {
            stageName: Stages.PickConcreteCoinToUpgrade,
            drawName: DrawNames.PickConcreteCoinToUpgrade,
            coinValue,
            value,
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
            stageName: Stages.PlaceOlwinCards,
            drawName: DrawNames.Olwin,
            number,
        },
    }),
    placeThrudHero: (): IStack => ({
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
            stageName: Stages.UpgradeCoin,
            value,
            drawName: DrawNames.UpgradeCoin,
        },
    }),
    upgradeCoinVidofnirVedrfolnir: (value: number, coinId?: number): IStack => ({
        config: {
            coinId,
            stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
            value,
            drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
        },
    }),
    upgradeCoinWarriorDistinction: (): IStack => ({
        config: {
            stageName: Stages.UpgradeCoin,
            value: 5,
            drawName: DrawNames.UpgradeCoinWarriorDistinction,
        },
    }),
};
