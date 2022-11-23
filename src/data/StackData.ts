import { ChooseDifficultySoloModeStageNames, CommonStageNames, ConfigNames, DrawNames, EnlistmentMercenariesStageNames, GiantNames, HeroNames, MultiSuitCardNames, SoloBotAndvariCommonStageNames, SoloBotCommonStageNames, SuitNames, TavernsResolutionStageNames, TroopEvaluationStageNames } from "../typescript/enums";
import type { IDwarfCard, IMercenaryCampCard, IStack, IStackData, OneOrTwoType, VidofnirVedrfolnirUpgradeValueType } from "../typescript/interfaces";

/**
 * <h3>Данные об стеке действий.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным об стеке действий.</li>
 * </ol>
 */
export const StackData: IStackData = {
    activateGiantAbilityOrPickCard: (giantName: GiantNames, card: IDwarfCard): IStack => ({
        configName: ConfigNames.ActivateGiantAbilityOrPickCard,
        stageName: TavernsResolutionStageNames.ActivateGiantAbilityOrPickCard,
        drawName: DrawNames.ActivateGiantAbilityOrPickCard,
        giantName,
        card,
    }),
    addCoinToPouch: (): IStack => ({
        stageName: CommonStageNames.AddCoinToPouch,
        drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
    }),
    brisingamensEndGameAction: (): IStack => ({
        drawName: DrawNames.BrisingamensEndGame,
    }),
    chooseSuitOlrun: (): IStack => ({
        stageName: TavernsResolutionStageNames.ChooseSuitOlrun,
        drawName: DrawNames.ChooseSuitOlrun,
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
        stageName: CommonStageNames.DiscardBoardCard,
        drawName: DrawNames.Bonfur,
        suit: SuitNames.blacksmith,
    }),
    discardCardFromBoardCrovaxTheDoppelganger: (): IStack => ({
        stageName: CommonStageNames.DiscardBoardCard,
        drawName: DrawNames.CrovaxTheDoppelganger,
    }),
    discardCardFromBoardDagda: (pickedSuit?: SuitNames): IStack => ({
        stageName: CommonStageNames.DiscardBoardCard,
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
        stageName: TavernsResolutionStageNames.DiscardCard,
        drawName: DrawNames.DiscardTavernCard,
    }),
    enlistmentMercenaries: (): IStack => ({
        drawName: DrawNames.EnlistmentMercenaries,
    }),
    getDifficultyLevelForSoloMode: (): IStack => ({
        configName: ConfigNames.GetDifficultyLevelForSoloMode,
        drawName: DrawNames.GetDifficultyLevelForSoloMode,
    }),
    getMythologyCardSkymir: (priority?: 3): IStack => ({
        configName: ConfigNames.ChooseGetMythologyCard,
        stageName: TavernsResolutionStageNames.GetMythologyCard,
        drawName: DrawNames.GetMythologyCardSkymir,
        priority,
    }),
    getHeroesForSoloMode: (): IStack => ({
        configName: ConfigNames.GetHeroesForSoloMode,
        stageName: ChooseDifficultySoloModeStageNames.ChooseHeroesForSoloMode,
        drawName: DrawNames.GetHeroesForSoloMode,
    }),
    getDistinctions: (): IStack => ({
        drawName: DrawNames.GetMjollnirProfit,
    }),
    getMjollnirProfit: (): IStack => ({
        drawName: DrawNames.Mjollnir,
    }),
    pickCampCardHolda: (): IStack => ({
        stageName: CommonStageNames.PickCampCardHolda,
        drawName: DrawNames.Holda,
    }),
    pickCard: (): IStack => ({
        drawName: DrawNames.PickCard,
    }),
    pickCardSoloBot: (): IStack => ({
        drawName: DrawNames.PickCardSoloBot,
    }),
    pickCardSoloBotAndvari: (): IStack => ({
        drawName: DrawNames.PickCardSoloBotAndvari,
    }),
    // TODO Is it need for solo bot & Andvari?
    pickConcreteCoinToUpgrade: (coinValue: number, value: number): IStack => ({
        stageName: CommonStageNames.PickConcreteCoinToUpgrade,
        drawName: DrawNames.PickConcreteCoinToUpgrade,
        coinValue,
        value,
    }),
    pickDiscardCardAndumia: (): IStack => ({
        stageName: CommonStageNames.PickDiscardCard,
        drawName: DrawNames.Andumia,
    }),
    pickDiscardCardBrisingamens: (priority?: 3): IStack => ({
        stageName: CommonStageNames.PickDiscardCard,
        drawName: DrawNames.Brisingamens,
        priority,
    }),
    pickDistinctionCard: (): IStack => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: TroopEvaluationStageNames.PickDistinctionCard,
        drawName: DrawNames.PickCardByExplorerDistinction,
    }),
    pickDistinctionCardSoloBot: (): IStack => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: TroopEvaluationStageNames.PickDistinctionCardSoloBot,
        drawName: DrawNames.PickCardByExplorerDistinctionSoloBot,
    }),
    pickDistinctionCardSoloBotAndvari: (): IStack => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: TroopEvaluationStageNames.PickDistinctionCardSoloBotAndvari,
        drawName: DrawNames.PickCardByExplorerDistinctionSoloBotAndvari,
    }),
    placeMultiSuitsCards: (name: MultiSuitCardNames, pickedSuit?: SuitNames, priority?: 3): IStack => ({
        stageName: CommonStageNames.PlaceMultiSuitsCards,
        drawName: DrawNames.PlaceMultiSuitsCards,
        pickedSuit,
        priority,
        name,
    }),
    placeThrudHero: (): IStack => ({
        stageName: CommonStageNames.PlaceThrudHero,
        drawName: DrawNames.PlaceThrudHero,
        priority: 2,
        name: HeroNames.Thrud,
    }),
    placeThrudHeroSoloBot: (): IStack => ({
        stageName: SoloBotCommonStageNames.PlaceThrudHeroSoloBot,
        drawName: DrawNames.PlaceThrudHeroSoloBot,
        priority: 2,
        name: HeroNames.Thrud,
    }),
    placeThrudHeroSoloBotAndvari: (): IStack => ({
        stageName: SoloBotAndvariCommonStageNames.PlaceThrudHeroSoloBotAndvari,
        drawName: DrawNames.PlaceThrudHeroSoloBotAndvari,
        priority: 2,
        name: HeroNames.Thrud,
    }),
    placeTradingCoinsUline: (): IStack => ({
        stageName: TavernsResolutionStageNames.PlaceTradingCoinsUline,
        drawName: DrawNames.PlaceTradingCoinsUline,
    }),
    placeYludHero: (): IStack => ({
        drawName: DrawNames.PlaceYludHero,
        name: HeroNames.Ylud,
    }),
    placeYludHeroSoloBot: (): IStack => ({
        drawName: DrawNames.PlaceYludHero,
        name: HeroNames.Ylud,
    }),
    placeYludHeroSoloBotAndvari: (): IStack => ({
        drawName: DrawNames.PlaceYludHero,
        name: HeroNames.Ylud,
    }),
    pickHero: (priority: OneOrTwoType): IStack => ({
        stageName: CommonStageNames.PickHero,
        drawName: DrawNames.PickHero,
        priority,
    }),
    pickHeroSoloBot: (priority: OneOrTwoType): IStack => ({
        stageName: SoloBotCommonStageNames.PickHeroSoloBot,
        drawName: DrawNames.PickHeroSoloBot,
        priority,
    }),
    pickHeroSoloBotAndvari: (priority: OneOrTwoType): IStack => ({
        stageName: SoloBotAndvariCommonStageNames.PickHeroSoloBotAndvari,
        drawName: DrawNames.PickHeroSoloBotAndvari,
        priority,
    }),
    placeEnlistmentMercenaries: (card: IMercenaryCampCard): IStack => ({
        stageName: EnlistmentMercenariesStageNames.PlaceEnlistmentMercenaries,
        drawName: DrawNames.PlaceEnlistmentMercenaries,
        card,
    }),
    startAddPlusTwoValueToAllCoinsUline: (coinId: number): IStack => ({
        stageName: TavernsResolutionStageNames.ChooseCoinValueForHrungnirUpgrade,
        drawName: DrawNames.StartAddPlusTwoValueToAllCoinsUline,
        coinId,
    }),
    startChooseCoinValueForVidofnirVedrfolnirUpgrade: (valueArray: VidofnirVedrfolnirUpgradeValueType,
        coinId?: number, priority?: 3): IStack => ({
            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
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
        stageName: CommonStageNames.UpgradeCoin,
        value,
        drawName: DrawNames.UpgradeCoin,
    }),
    upgradeCoinSoloBot: (value: number): IStack => ({
        stageName: SoloBotCommonStageNames.UpgradeCoinSoloBot,
        value,
        drawName: DrawNames.UpgradeCoinSoloBot,
    }),
    upgradeCoinSoloBotAndvari: (value: number): IStack => ({
        stageName: SoloBotAndvariCommonStageNames.UpgradeCoinSoloBotAndvari,
        value,
        drawName: DrawNames.UpgradeCoinSoloBotAndvari,
    }),
    upgradeCoinVidofnirVedrfolnir: (value: number, coinId?: number, priority?: 3): IStack => ({
        coinId,
        stageName: CommonStageNames.UpgradeVidofnirVedrfolnirCoin,
        value,
        drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
        priority,
    }),
    upgradeCoinWarriorDistinction: (): IStack => ({
        stageName: CommonStageNames.UpgradeCoin,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinction,
    }),
    upgradeCoinWarriorDistinctionSoloBot: (): IStack => ({
        stageName: SoloBotCommonStageNames.UpgradeCoinSoloBot,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinctionSoloBot,
    }),
    upgradeCoinWarriorDistinctionSoloBotAndvari: (): IStack => ({
        stageName: SoloBotAndvariCommonStageNames.UpgradeCoinSoloBotAndvari,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinctionSoloBotAndvari,
    }),
};
