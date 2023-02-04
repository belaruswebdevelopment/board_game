import { ChooseDifficultySoloModeStageNames, CommonStageNames, ConfigNames, DrawNames, EnlistmentMercenariesStageNames, GiantNames, GodNames, HeroNames, MultiSuitCardNames, SoloBotAndvariCommonStageNames, SoloBotCommonCoinUpgradeStageNames, SoloBotCommonStageNames, SuitNames, TavernsResolutionStageNames, TavernsResolutionWithSubStageNames, TroopEvaluationStageNames } from "../typescript/enums";
import type { BasicUpgradeCoinValueType, DwarfCard, DwarfDeckCardType, MercenaryCard, OneOrTwoType, PlayerCoinIdType, PlayerID, PlayerPouchCoinIdType, Stack, StackData, UpgradableCoinValueType, VidofnirVedrfolnirUpgradeValueType } from "../typescript/interfaces";

/**
 * <h3>Данные об стеке действий.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным об стеке действий.</li>
 * </ol>
 */
export const AllStackData: StackData = {
    activateGiantAbilityOrPickCard: (giantName: GiantNames, card: DwarfCard): Stack => ({
        configName: ConfigNames.ActivateGiantAbilityOrPickCard,
        stageName: TavernsResolutionWithSubStageNames.ActivateGiantAbilityOrPickCard,
        drawName: DrawNames.ActivateGiantAbilityOrPickCard,
        giantName,
        card,
    }),
    activateGodAbilityOrNot: (godName: GodNames, card?: DwarfDeckCardType): Stack => ({
        configName: ConfigNames.ActivateGodAbilityOrNot,
        stageName: TavernsResolutionWithSubStageNames.ActivateGodAbilityOrNot,
        drawName: DrawNames.ActivateGodAbilityOrNot,
        godName,
        card,
    }),
    addCoinToPouch: (): Stack => ({
        stageName: CommonStageNames.AddCoinToPouch,
        drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
    }),
    brisingamensEndGameAction: (): Stack => ({
        drawName: DrawNames.BrisingamensEndGame,
    }),
    chooseSuitOlrun: (): Stack => ({
        stageName: TavernsResolutionStageNames.ChooseSuitOlrun,
        drawName: DrawNames.ChooseSuitOlrun,
    }),
    chooseStrategyLevelForSoloModeAndvari: (): Stack => ({
        configName: ConfigNames.ChooseStrategyLevelForSoloModeAndvari,
        drawName: DrawNames.ChooseStrategyLevelForSoloModeAndvari,
    }),
    chooseStrategyVariantLevelForSoloModeAndvari: (): Stack => ({
        configName: ConfigNames.ChooseStrategyVariantLevelForSoloModeAndvari,
        drawName: DrawNames.ChooseStrategyVariantLevelForSoloModeAndvari,
    }),
    discardCardFromBoardBonfur: (): Stack => ({
        stageName: CommonStageNames.DiscardTopCardFromSuit,
        drawName: DrawNames.Bonfur,
        suit: SuitNames.blacksmith,
    }),
    discardCardFromBoardCrovaxTheDoppelganger: (): Stack => ({
        stageName: CommonStageNames.DiscardTopCardFromSuit,
        drawName: DrawNames.CrovaxTheDoppelganger,
    }),
    discardCardFromBoardDagda: (pickedSuit?: SuitNames): Stack => ({
        stageName: CommonStageNames.DiscardTopCardFromSuit,
        drawName: DrawNames.Dagda,
        suit: SuitNames.hunter,
        pickedSuit,
        name: HeroNames.Dagda,
    }),
    discardSuitCard: (playerId: PlayerID): Stack => ({
        playerId,
    }),
    discardSuitCardHofud: (): Stack => ({
        drawName: DrawNames.Hofud,
    }),
    discardTavernCard: (): Stack => ({
        stageName: TavernsResolutionStageNames.DiscardCard2Players,
        drawName: DrawNames.DiscardTavernCard,
    }),
    enlistmentMercenaries: (): Stack => ({
        drawName: DrawNames.EnlistmentMercenaries,
    }),
    getDifficultyLevelForSoloMode: (): Stack => ({
        configName: ConfigNames.GetDifficultyLevelForSoloMode,
        drawName: DrawNames.GetDifficultyLevelForSoloMode,
    }),
    getMythologyCardSkymir: (priority?: 3): Stack => ({
        configName: ConfigNames.ChooseGetMythologyCard,
        stageName: TavernsResolutionStageNames.GetMythologyCard,
        drawName: DrawNames.GetMythologyCardSkymir,
        priority,
    }),
    getHeroesForSoloMode: (): Stack => ({
        configName: ConfigNames.GetHeroesForSoloMode,
        stageName: ChooseDifficultySoloModeStageNames.ChooseHeroForDifficultySoloMode,
        drawName: DrawNames.GetHeroesForSoloMode,
    }),
    getDistinctions: (): Stack => ({
        drawName: DrawNames.GetMjollnirProfit,
    }),
    getMjollnirProfit: (): Stack => ({
        drawName: DrawNames.Mjollnir,
    }),
    pickCampCardHolda: (): Stack => ({
        stageName: CommonStageNames.ClickCampCardHolda,
        drawName: DrawNames.Holda,
    }),
    pickCard: (): Stack => ({
        drawName: DrawNames.PickCard,
    }),
    pickCardSoloBot: (): Stack => ({
        drawName: DrawNames.PickCardSoloBot,
    }),
    pickCardSoloBotAndvari: (): Stack => ({
        drawName: DrawNames.PickCardSoloBotAndvari,
    }),
    // TODO Is it need for solo bot & Andvari?
    pickConcreteCoinToUpgrade: (coinValue: UpgradableCoinValueType, value: UpgradableCoinValueType): Stack => ({
        stageName: CommonStageNames.PickConcreteCoinToUpgrade,
        drawName: DrawNames.PickConcreteCoinToUpgrade,
        coinValue,
        value,
    }),
    pickDiscardCardAndumia: (): Stack => ({
        stageName: CommonStageNames.PickDiscardCard,
        drawName: DrawNames.Andumia,
    }),
    pickDiscardCardBrisingamens: (priority?: 3): Stack => ({
        stageName: CommonStageNames.PickDiscardCard,
        drawName: DrawNames.Brisingamens,
        priority,
    }),
    pickDistinctionCard: (): Stack => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: TroopEvaluationStageNames.ClickCardToPickDistinction,
        drawName: DrawNames.PickCardByExplorerDistinction,
    }),
    pickDistinctionCardSoloBot: (): Stack => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: TroopEvaluationStageNames.SoloBotClickCardToPickDistinction,
        drawName: DrawNames.PickCardByExplorerDistinctionSoloBot,
    }),
    pickDistinctionCardSoloBotAndvari: (): Stack => ({
        configName: ConfigNames.ExplorerDistinction,
        stageName: TroopEvaluationStageNames.SoloBotAndvariClickCardToPickDistinction,
        drawName: DrawNames.PickCardByExplorerDistinctionSoloBotAndvari,
    }),
    placeMultiSuitsCards: (name: MultiSuitCardNames, pickedSuit?: SuitNames, priority?: 3): Stack => ({
        stageName: CommonStageNames.PlaceMultiSuitCard,
        drawName: DrawNames.PlaceMultiSuitsCards,
        pickedSuit,
        priority,
        name,
    }),
    placeThrudHero: (): Stack => ({
        stageName: CommonStageNames.PlaceThrudHero,
        drawName: DrawNames.PlaceThrudHero,
        priority: 2,
        name: HeroNames.Thrud,
    }),
    placeThrudHeroSoloBot: (): Stack => ({
        stageName: SoloBotCommonStageNames.SoloBotPlaceThrudHero,
        drawName: DrawNames.PlaceThrudHeroSoloBot,
        priority: 2,
        name: HeroNames.Thrud,
    }),
    placeThrudHeroSoloBotAndvari: (): Stack => ({
        stageName: SoloBotAndvariCommonStageNames.SoloBotAndvariPlaceThrudHero,
        drawName: DrawNames.PlaceThrudHeroSoloBotAndvari,
        priority: 2,
        name: HeroNames.Thrud,
    }),
    placeTradingCoinsUline: (): Stack => ({
        stageName: TavernsResolutionStageNames.ClickHandTradingCoinUline,
        drawName: DrawNames.PlaceTradingCoinsUline,
    }),
    placeYludHero: (): Stack => ({
        drawName: DrawNames.PlaceYludHero,
        name: HeroNames.Ylud,
    }),
    placeYludHeroSoloBot: (): Stack => ({
        drawName: DrawNames.PlaceYludHero,
        name: HeroNames.Ylud,
    }),
    placeYludHeroSoloBotAndvari: (): Stack => ({
        drawName: DrawNames.PlaceYludHero,
        name: HeroNames.Ylud,
    }),
    pickHero: (priority: OneOrTwoType): Stack => ({
        stageName: CommonStageNames.ClickHeroCard,
        drawName: DrawNames.PickHero,
        priority,
    }),
    pickHeroSoloBot: (priority: OneOrTwoType): Stack => ({
        stageName: SoloBotCommonStageNames.SoloBotClickHeroCard,
        drawName: DrawNames.PickHeroSoloBot,
        priority,
    }),
    pickHeroSoloBotAndvari: (priority: OneOrTwoType): Stack => ({
        stageName: SoloBotAndvariCommonStageNames.SoloBotAndvariClickHeroCard,
        drawName: DrawNames.PickHeroSoloBotAndvari,
        priority,
    }),
    placeEnlistmentMercenaries: (card: MercenaryCard): Stack => ({
        stageName: EnlistmentMercenariesStageNames.PlaceEnlistmentMercenaries,
        drawName: DrawNames.PlaceEnlistmentMercenaries,
        card,
    }),
    startAddPlusTwoValueToAllCoinsUline: (coinId: PlayerCoinIdType): Stack => ({
        stageName: TavernsResolutionStageNames.ChooseCoinValueForHrungnirUpgrade,
        drawName: DrawNames.StartAddPlusTwoValueToAllCoinsUline,
        coinId,
    }),
    startChooseCoinValueForVidofnirVedrfolnirUpgrade: (valueArray: VidofnirVedrfolnirUpgradeValueType,
        coinId?: PlayerPouchCoinIdType, priority?: 3): Stack => ({
            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
            valueArray,
            coinId,
            priority,
        }),
    startOrPassEnlistmentMercenaries: (): Stack => ({
        configName: ConfigNames.StartOrPassEnlistmentMercenaries,
        drawName: DrawNames.StartOrPassEnlistmentMercenaries,
    }),
    upgradeCoin: (value: BasicUpgradeCoinValueType): Stack => ({
        stageName: CommonStageNames.ClickCoinToUpgrade,
        value,
        drawName: DrawNames.UpgradeCoin,
    }),
    upgradeCoinSoloBot: (value: BasicUpgradeCoinValueType): Stack => ({
        stageName: SoloBotCommonCoinUpgradeStageNames.SoloBotClickCoinToUpgrade,
        value,
        drawName: DrawNames.UpgradeCoinSoloBot,
    }),
    upgradeCoinSoloBotAndvari: (value: BasicUpgradeCoinValueType): Stack => ({
        stageName: SoloBotAndvariCommonStageNames.SoloBotAndvariClickCoinToUpgrade,
        value,
        drawName: DrawNames.UpgradeCoinSoloBotAndvari,
    }),
    upgradeCoinVidofnirVedrfolnir: (value: UpgradableCoinValueType, coinId?: PlayerPouchCoinIdType, priority?: 3):
        Stack => ({
            coinId,
            stageName: CommonStageNames.UpgradeCoinVidofnirVedrfolnir,
            value,
            drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
            priority,
        }),
    upgradeCoinWarriorDistinction: (): Stack => ({
        stageName: CommonStageNames.ClickCoinToUpgrade,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinction,
    }),
    upgradeCoinWarriorDistinctionSoloBot: (): Stack => ({
        stageName: SoloBotCommonCoinUpgradeStageNames.SoloBotClickCoinToUpgrade,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinctionSoloBot,
    }),
    upgradeCoinWarriorDistinctionSoloBotAndvari: (): Stack => ({
        stageName: SoloBotAndvariCommonStageNames.SoloBotAndvariClickCoinToUpgrade,
        value: 5,
        drawName: DrawNames.UpgradeCoinWarriorDistinctionSoloBotAndvari,
    }),
};
