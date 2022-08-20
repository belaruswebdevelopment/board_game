import { ConfigNames, DrawNames, HeroNames, MultiSuitCardNames, StageNames, SuitNames } from "../typescript/enums";
import type { IMercenaryCampCard, IStack, IStackData, OneOrTwoStackPriorityType, SuitNamesKeyofTypeofType, VidofnirVedrfolnirUpgradeValueType } from "../typescript/interfaces";

/**
 * <h3>Данные об стеке действий.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным об стеке действий.</li>
 * </ol>
 */
export const StackData: IStackData = {
    addCoinToPouch: (): IStack => ({
        stageName: StageNames.addCoinToPouch,
        drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
    }),
    brisingamensEndGameAction: (): IStack => ({
        drawName: DrawNames.BrisingamensEndGame,
    }),
    chooseStrategyLevelForSoloModeAndvari: (): IStack => ({
        configName: ConfigNames.ChooseStrategyLevelForSoloModeAndvari,
        drawName: DrawNames.ChooseStrategyLevelForSoloModeAndvari,
    }),
    chooseStrategyVariantLevelForSoloModeAndvari: (): IStack => ({
        configName: ConfigNames.ChooseStrategyVariantLevelForSoloModeAndvari,
        drawName: DrawNames.ChooseStrategyVariantLevelForSoloModeAndvari,
    }),
    discardCardFromBoardBonfur: (): IStack => ({
        stageName: StageNames.discardBoardCard,
        drawName: DrawNames.Bonfur,
        suit: SuitNames.blacksmith,
    }),
    discardCardFromBoardCrovaxTheDoppelganger: (): IStack => ({
        stageName: StageNames.discardBoardCard,
        drawName: DrawNames.CrovaxTheDoppelganger,
    }),
    discardCardFromBoardDagda: (pickedSuit?: SuitNamesKeyofTypeofType): IStack => ({
        stageName: StageNames.discardBoardCard,
        drawName: DrawNames.Dagda,
        suit: SuitNames.hunter,
        pickedSuit,
        name: HeroNames.Dagda,
    }),
    discardSuitCard: (playerId: number): IStack => ({
        playerId,
    }),
    discardSuitCardHofud: (): IStack => ({
        drawName: DrawNames.Hofud,
    }),
    discardTavernCard: (): IStack => ({
        stageName: StageNames.discardCard,
        drawName: DrawNames.DiscardTavernCard,
    }),
    enlistmentMercenaries: (): IStack => ({
        drawName: DrawNames.EnlistmentMercenaries,
    }),
    getDifficultyLevelForSoloMode: (): IStack => ({
        configName: ConfigNames.GetDifficultyLevelForSoloMode,
        drawName: DrawNames.GetDifficultyLevelForSoloMode,
    }),
    getHeroesForSoloMode: (): IStack => ({
        configName: ConfigNames.GetHeroesForSoloMode,
        stageName: StageNames.chooseHeroesForSoloMode,
        drawName: DrawNames.GetHeroesForSoloMode,
    }),
    getDistinctions: (): IStack => ({
        drawName: DrawNames.GetMjollnirProfit,
    }),
    getMjollnirProfit: (): IStack => ({
        drawName: DrawNames.Mjollnir,
    }),
    pickCampCardHolda: (): IStack => ({
        stageName: StageNames.pickCampCardHolda,
        drawName: DrawNames.Holda,
    }),
    pickCard: (): IStack => ({
        drawName: DrawNames.PickCard,
    }),
    pickConcreteCoinToUpgrade: (coinValue: number, value: number): IStack => ({
        stageName: StageNames.pickConcreteCoinToUpgrade,
        drawName: DrawNames.PickConcreteCoinToUpgrade,
        coinValue,
        value,
    }),
    pickDiscardCardAndumia: (): IStack => ({
        stageName: StageNames.pickDiscardCard,
        drawName: DrawNames.Andumia,
    }),
    pickDiscardCardBrisingamens: (priority?: 3): IStack => ({
        stageName: StageNames.pickDiscardCard,
        drawName: DrawNames.Brisingamens,
        priority,
    }),
    pickDistinctionCard: (): IStack => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: StageNames.pickDistinctionCard,
        drawName: DrawNames.PickCardByExplorerDistinction,
    }),
    pickDistinctionCardSoloBot: (): IStack => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: StageNames.pickDistinctionCardSoloBot,
        drawName: DrawNames.PickCardByExplorerDistinctionSoloBot,
    }),
    pickDistinctionCardSoloBotAndvari: (): IStack => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: StageNames.pickDistinctionCardSoloBotAndvari,
        drawName: DrawNames.PickCardByExplorerDistinctionSoloBotAndvari,
    }),
    placeMultiSuitsCards: (name: MultiSuitCardNames, pickedSuit?: SuitNamesKeyofTypeofType, priority?: 3): IStack => ({
        stageName: StageNames.placeMultiSuitsCards,
        drawName: DrawNames.PlaceMultiSuitsCards,
        pickedSuit,
        priority,
        name,
    }),
    placeThrudHero: (): IStack => ({
        stageName: StageNames.placeThrudHero,
        drawName: DrawNames.PlaceThrudHero,
        priority: 2,
        name: HeroNames.Thrud,
    }),
    placeTradingCoinsUline: (): IStack => ({
        stageName: StageNames.placeTradingCoinsUline,
        drawName: DrawNames.PlaceTradingCoinsUline,
    }),
    placeYludHero: (): IStack => ({
        drawName: DrawNames.PlaceYludHero,
        name: HeroNames.Ylud,
    }),
    pickHero: (priority: OneOrTwoStackPriorityType): IStack => ({
        stageName: StageNames.pickHero,
        drawName: DrawNames.PickHero,
        priority,
    }),
    pickHeroSoloBot: (): IStack => ({
        stageName: StageNames.pickHeroSoloBot,
        drawName: DrawNames.PickHeroSoloBot,
    }),
    pickHeroSoloBotAndvari: (): IStack => ({
        stageName: StageNames.pickHeroSoloBotAndvari,
        drawName: DrawNames.PickHeroSoloBotAndvari,
    }),
    placeEnlistmentMercenaries: (card: IMercenaryCampCard): IStack => ({
        stageName: StageNames.placeEnlistmentMercenaries,
        drawName: DrawNames.PlaceEnlistmentMercenaries,
        card,
    }),
    startChooseCoinValueForVidofnirVedrfolnirUpgrade: (valueArray: VidofnirVedrfolnirUpgradeValueType,
        coinId?: number, priority?: 3): IStack => ({
            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
            stageName: StageNames.chooseCoinValueForVidofnirVedrfolnirUpgrade,
            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
            valueArray,
            coinId,
            priority,
        }),
    startOrPassEnlistmentMercenaries: (): IStack => ({
        configName: ConfigNames.StartOrPassEnlistmentMercenaries,
        drawName: DrawNames.StartOrPassEnlistmentMercenaries,
    }),
    upgradeCoin: (value: number): IStack => ({
        stageName: StageNames.upgradeCoin,
        value,
        drawName: DrawNames.UpgradeCoin,
    }),
    upgradeCoinVidofnirVedrfolnir: (value: number, coinId?: number, priority?: 3): IStack => ({
        coinId,
        stageName: StageNames.upgradeVidofnirVedrfolnirCoin,
        value,
        drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
        priority,
    }),
    upgradeCoinWarriorDistinction: (): IStack => ({
        stageName: StageNames.upgradeCoin,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinction,
    }),
};
