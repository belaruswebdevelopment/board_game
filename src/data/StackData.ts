import { ConfigNames, DrawNames, StageNames, SuitNames } from "../typescript/enums";
import type { IStack, IStackData, SuitTypes } from "../typescript/interfaces";

// TODO Add type!
export const StackData: IStackData = {
    addCoinToPouch: (number: number): IStack => ({
        stageName: StageNames.AddCoinToPouch,
        number,
        drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
    }),
    brisingamensEndGameAction: (): IStack => ({
        drawName: DrawNames.BrisingamensEndGame,
    }),
    discardCardFromBoardBonfur: (): IStack => ({
        stageName: StageNames.DiscardBoardCard,
        drawName: DrawNames.Bonfur,
        suit: SuitNames.Blacksmith,
    }),
    discardCardFromBoardCrovaxTheDoppelganger: (): IStack => ({
        stageName: StageNames.DiscardBoardCard,
        drawName: DrawNames.CrovaxTheDoppelganger,
    }),
    discardCardFromBoardDagda: (number = 2): IStack => ({
        stageName: StageNames.DiscardBoardCard,
        drawName: DrawNames.Dagda,
        suit: SuitNames.Hunter,
        number,
    }),
    discardSuitCard: (playerId: number): IStack => ({
        playerId,
    }),
    discardSuitCardHofud: (): IStack => ({
        drawName: DrawNames.Hofud,
    }),
    discardTavernCard: (): IStack => ({
        stageName: StageNames.DiscardCard,
        drawName: DrawNames.DiscardTavernCard,
    }),
    enlistmentMercenaries: (): IStack => ({
        drawName: DrawNames.EnlistmentMercenaries,
    }),
    getDifficultyLevelForSoloMode: (): IStack => ({
        name: ConfigNames.GetDifficultyLevelForSoloMode,
        drawName: DrawNames.GetDifficultyLevelForSoloMode,
    }),
    getHeroesForSoloMode: (number: number): IStack => ({
        name: ConfigNames.GetHeroesForSoloMode,
        stageName: StageNames.ChooseHeroesForSoloMode,
        drawName: DrawNames.GetHeroesForSoloMode,
        number,
    }),
    getDistinctions: (): IStack => ({
        drawName: DrawNames.GetMjollnirProfit,
    }),
    getMjollnirProfit: (): IStack => ({
        drawName: DrawNames.Mjollnir,
    }),
    pickCampCardHolda: (): IStack => ({
        stageName: StageNames.PickCampCardHolda,
        drawName: DrawNames.Holda,
    }),
    pickCard: (): IStack => ({
        drawName: DrawNames.PickCard,
    }),
    pickConcreteCoinToUpgrade: (coinValue: number, value: number): IStack => ({
        stageName: StageNames.PickConcreteCoinToUpgrade,
        drawName: DrawNames.PickConcreteCoinToUpgrade,
        coinValue,
        value,
    }),
    pickDiscardCardAndumia: (): IStack => ({
        stageName: StageNames.PickDiscardCard,
        drawName: DrawNames.Andumia,
    }),
    pickDiscardCardBrisingamens: (number = 2, priority?: number): IStack => ({
        stageName: StageNames.PickDiscardCard,
        drawName: DrawNames.Brisingamens,
        number,
        priority,
    }),
    pickDistinctionCard: (): IStack => ({
        name: ConfigNames.ExplorerDistinction,
        stageName: StageNames.PickDistinctionCard,
        drawName: DrawNames.PickCardByExplorerDistinction,
    }),
    pickDistinctionCardSoloBot: (): IStack => ({
        stageName: StageNames.PickDistinctionCardSoloBot,
        drawName: DrawNames.PickCardByExplorerDistinctionSoloBot,
    }),
    placeOlwinCards: (number = 2, suit?: SuitTypes, priority?: number): IStack => ({
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
    placeThrudHero: (): IStack => ({
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
    placeTradingCoinsUline: (number?: number): IStack => ({
        stageName: StageNames.PlaceTradingCoinsUline,
        drawName: DrawNames.PlaceTradingCoinsUline,
        number,
    }),
    placeYludHero: (): IStack => ({
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
    pickHero: (): IStack => ({
        stageName: StageNames.PickHero,
        drawName: DrawNames.PickHero,
        priority: 1,
    }),
    pickHeroSoloBot: (): IStack => ({
        stageName: StageNames.PickHeroSoloBot,
        drawName: DrawNames.PickHeroSoloBot,
    }),
    placeEnlistmentMercenaries: (): IStack => ({
        stageName: StageNames.PlaceEnlistmentMercenaries,
        drawName: DrawNames.PlaceEnlistmentMercenaries,
    }),
    startOrPassEnlistmentMercenaries: (): IStack => ({
        name: ConfigNames.StartOrPassEnlistmentMercenaries,
        drawName: DrawNames.StartOrPassEnlistmentMercenaries,
    }),
    upgradeCoin: (value: number): IStack => ({
        stageName: StageNames.UpgradeCoin,
        value,
        drawName: DrawNames.UpgradeCoin,
    }),
    upgradeCoinVidofnirVedrfolnir: (value: number, coinId?: number): IStack => ({
        coinId,
        stageName: StageNames.UpgradeVidofnirVedrfolnirCoin,
        value,
        drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
    }),
    upgradeCoinWarriorDistinction: (): IStack => ({
        stageName: StageNames.UpgradeCoin,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinction,
    }),
};
