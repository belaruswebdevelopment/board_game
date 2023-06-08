import { CardTypeRusNames, GiantRusNames, SuitRusNames } from "../typescript/enums";
import type { AICardCharacteristics, AICardCharacteristicsArray, AllBasicHeroesPossibleCardIdType, AllCoinsValueType, AllDwarfPlayersAmountIdType, AllHeroesForDifficultySoloModePossibleCardIdType, AllHeroesForPlayerSoloModeAndvariPossibleCardIdType, AllHeroesForPlayerSoloModePossibleCardIdType, AllHeroesForSoloBotAndvariPossibleCardIdType, AllHeroesForSoloBotPossibleCardIdType, AllHeroesPossibleCardIdType, AllInitialCoins, AllInitialTradingCoinConfig, AllNumberValuesArraysLengthType, AllPriorityValueType, AllRoyalCoinConfig, BasicVidofnirVedrfolnirUpgradeValueType, BettermentMinMaxType, CampCardArray, CampCardArrayIndex, CampCardType, CanBeNegativeDwarfCardPointsType, CanBeNullType, CanBeUndefType, CoinType, CoinUpgradePossibleMaxValue, CoinsOnPouchNumber, CurrentPlayerCoinsScoreType, DistinctionsPlayersOrderArray, DwarfDeckCardType, DwergBrothersScoringArray, ExchangeOrderArray, ExplorerDistinctionCardIdType, ExplorerDistinctionCards, GeneralStrategyForSoloBotAndvariIdType, HeroCard, HeroesForSoloGameArrayType, HeroesForSoloGameForStrategyBotAndvariArray, HeroesInitialForSoloGameForBotAndvariArray, IndexOf, InitialCoinType, MarketCoinNumberValuesType, MaxCurrentSuitDistinctionPlayersArray, MaxCurrentSuitDistinctionPlayersType, MaxPlyersWithTotalScoreType, MercenariesConfigType, MinerDistinctionsScoringType, MythologicalCreatureCardType, MythologicalCreatureCardsForGiantSkymirArray, OneOrTwoType, PlayerCoinIdType, PlayerCoinNumberValuesType, PlayerCoinsNumber, PlayerID, PlayerPouchCoinIdType, PlayerRanksForDistinctionsArray, PlayerStack, PlayerTavernCoinIdType, PrioritiesAmountType, PrivatePlayerBoardCoins, PrivatePlayerHandCoins, PublicPlayerBoardCoins, PublicPlayerCoinType, PublicPlayerHandCoins, RefillDeckCardsWithExpansionArray, RefillDeckCardsWithoutExpansionArray, ReserveStrategyForSoloBotAndvariIdType, ResolvedPlayersOrderArray, RoyalCoin, RoyalCoinValueType, RoyalCoinsUniqueArray, RoyalOfferingsConfig, SecretAllCampDecks, SecretAllDwarfDecksArray, SecretAllDwarfDecksArrayIndex, Stack, StrengthTokenNotchLongMaxType, StrengthTokenNotchShortMaxType, TavernAllCardsArray, TavernCardIdPossibleType, TavernCardType, TavernsArrayIndex, TavernsHeuristicArray, TierType, TotalScoreArray, TradingCoinsType, TradingCoinsValueType, UpgradableCoinType, UpgradableCoinValueType, UpgradingCoinsArrayType, VidofnirVedrfolnirCoinsValue, WinnerArray, ZeroOrOneType } from "../typescript/interfaces";

export function AssertZeroOrOne(number: number): asserts number is ZeroOrOneType {
    if (!(number === 0 || number === 1)) {
        throw new Error(`No value '${number}' of ZeroOrOneType.`);
    }
}

export function AssertPlayerId(playerId: string): asserts playerId is PlayerID {
    if (!(playerId === `0` || playerId === `1` || playerId === `2` || playerId === `3` || playerId === `4`)) {
        throw new Error(`No value '${playerId}' of PlayerID.`);
    }
}

export function AssertOneOrTwo(number: number): asserts number is OneOrTwoType {
    if (!(number === 1 || number === 2)) {
        throw new Error(`No value '${number}' of OneOrTwoType.`);
    }
}

export function AssertMinerDistinctionsScoring(number: number): asserts number is MinerDistinctionsScoringType {
    if (!(number === 0 || number === 3)) {
        throw new Error(`No value '${number}' of MinerDistinctionsScoringType.`);
    }
}

export function AssertBasicVidofnirVedrfolnirUpgradeValue(number: number):
    asserts number is BasicVidofnirVedrfolnirUpgradeValueType {
    if (!(number === 2 || number === 3 || number === 5)) {
        throw new Error(`No value '${number}' of BasicVidofnirVedrfolnirUpgradeValueType.`);
    }
}

export function AssertBettermentMinMax(number: number): asserts number is BettermentMinMaxType {
    if (!(number >= -46 || number <= 20)) {
        throw new Error(`No value '${number}' of BettermentMinMaxType.`);
    }
}

export function AssertCanBeNegativeDwarfCardPoints(number: number): asserts number is CanBeNegativeDwarfCardPointsType {
    if (!(number >= -12 || number <= 12)) {
        throw new Error(`No value '${number}' of CanBeNegativeDwarfCardPointsType.`);
    }
}

export function AssertCoinUpgradePossibleMaxValue(number: number): asserts number is CoinUpgradePossibleMaxValue {
    if (!(number >= 5 || number <= 51)) {
        throw new Error(`No value '${number}' of CoinUpgradePossibleMaxValue.`);
    }
}

export function AssertAllHeroesPossibleCardId(heroId: number): asserts heroId is AllHeroesPossibleCardIdType {
    if (!(heroId >= 1 || heroId <= 28)) {
        throw new Error(`No value '${heroId}' of AllHeroesPossibleCardIdType.`);
    }
}

export function AssertAllBasicHeroesPossibleCardId(heroId: number): asserts heroId is AllBasicHeroesPossibleCardIdType {
    if (!(heroId >= 1 || heroId <= 22)) {
        throw new Error(`No value '${heroId}' of AllBasicHeroesPossibleCardIdType.`);
    }
}

export function AssertAllHeroesForPlayerSoloModePossibleCardId(heroId: number):
    asserts heroId is AllHeroesForPlayerSoloModePossibleCardIdType {
    if (!(heroId >= 1 || heroId <= 10)) {
        throw new Error(`No value '${heroId}' of AllHeroesForPlayerSoloModePossibleCardIdType.`);
    }
}

export function AssertAllHeroesForPlayerSoloModeAndvariPossibleCardId(heroId: number):
    asserts heroId is AllHeroesForPlayerSoloModeAndvariPossibleCardIdType {
    if (!(heroId >= 1 || heroId <= 11)) {
        throw new Error(`No value '${heroId}' of AllHeroesForPlayerSoloModeAndvariPossibleCardIdType.`);
    }
}

export function AssertAllHeroesForSoloBotPossibleCardId(heroId: number):
    asserts heroId is AllHeroesForSoloBotPossibleCardIdType {
    if (!(heroId >= 1 || heroId <= 5)) {
        throw new Error(`No value '${heroId}' of AllHeroesForSoloBotPossibleCardIdType.`);
    }
}

export function AssertAllHeroesForSoloBotAndvariPossibleCardId(heroId: number):
    asserts heroId is AllHeroesForSoloBotAndvariPossibleCardIdType {
    if (!(heroId >= 1 || heroId <= 5)) {
        throw new Error(`No value '${heroId}' of AllHeroesForSoloBotAndvariPossibleCardIdType.`);
    }
}

export function AssertAllHeroesForDifficultySoloModePossibleCardId(heroId: number):
    asserts heroId is AllHeroesForDifficultySoloModePossibleCardIdType {
    if (!(heroId >= 1 || heroId <= 6)) {
        throw new Error(`No value '${heroId}' of AllHeroesForDifficultySoloModePossibleCardIdType.`);
    }
}

// TODO Must be 0 | (0 | 1 | 2) | (0 | 1 | 2 | 3 | 4 | 5) by array length! Add G to params and check G.explorerDistinctionCards.length!?
export function AssertExplorerDistinctionCardIdType(number: number): asserts number is ExplorerDistinctionCardIdType {
    if (!(number >= 0 || number <= 5)) {
        throw new Error(`No value '${number}' of ExplorerDistinctionCardIdType.`);
    }
}

export function AssertMarketCoinNumberValues(number: number): asserts number is MarketCoinNumberValuesType {
    if (!(number >= 0 || number <= 3)) {
        throw new Error(`No value '${number}' of MarketCoinNumberValuesType.`);
    }
}

export function AssertPlayerCoinNumberValues(number: number): asserts number is PlayerCoinNumberValuesType {
    if (!(number >= 1 || number <= 5)) {
        throw new Error(`No value '${number}' of PlayerCoinNumberValuesType.`);
    }
}

export function AssertTavernCardId(number: number): asserts number is TavernCardIdPossibleType {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No value '${number}' of TavernCardIdType.`);
    }
}

export function AssertPlayerTavernCoinId(number: number): asserts number is PlayerTavernCoinIdType {
    if (!(number >= 0 || number <= 2)) {
        throw new Error(`No value '${number}' of PlayerTavernCoinIdType.`);
    }
}

export function AssertGeneralStrategyForSoloBotAndvariId(number: number):
    asserts number is GeneralStrategyForSoloBotAndvariIdType {
    if (!(number >= 0 || number <= 2)) {
        throw new Error(`No value '${number}' of GeneralStrategyForSoloBotAndvariIdType.`);
    }
}

export function AssertReserveStrategyForSoloBotAndvariId(number: number):
    asserts number is ReserveStrategyForSoloBotAndvariIdType {
    if (!(number >= 1 || number <= 4)) {
        throw new Error(`No value '${number}' of ReserveStrategyForSoloBotAndvariId.`);
    }
}

export function AssertPlayerCoinsNumber(number: number): asserts number is PlayerCoinsNumber {
    if (!(number >= 0 || number <= 5)) {
        throw new Error(`No value '${number}' of PlayerCoinsNumber.`);
    }
}

export function AssertCurrentPlayerCoinsScore(number: number): asserts number is CurrentPlayerCoinsScoreType {
    if (!(number >= 14 || number <= 97)) {
        throw new Error(`No value '${number}' of CurrentPlayerCoinsScoreType.`);
    }
}

export function AssertVidofnirVedrfolnirCoinsValue(number: number): asserts number is VidofnirVedrfolnirCoinsValue {
    if (!(number >= 1 || number <= 2)) {
        throw new Error(`No value '${number}' of VidofnirVedrfolnirCoinsValue.`);
    }
}

export function AssertMaxPlyersWithTotalScore(number: number): asserts number is MaxPlyersWithTotalScoreType {
    if (!(number >= 2 || number <= 5)) {
        throw new Error(`No value '${number}' of MaxPlyersWithTotalScoreType.`);
    }
}

export function AssertCoinsOnPouchNumber(number: number): asserts number is CoinsOnPouchNumber {
    if (!(number >= 0 || number <= 2)) {
        throw new Error(`No value '${number}' of CoinsOnPouchNumber.`);
    }
}

export function AssertStrengthTokenNotchShortMax(number: number): asserts number is StrengthTokenNotchShortMaxType {
    if (!(number >= 0 || number <= 3)) {
        throw new Error(`No value '${number}' of StrengthTokenNotchShortMaxType.`);
    }
}

export function AssertAllDwarfPlayersAmountId(number: number): asserts number is AllDwarfPlayersAmountIdType {
    if (!(number >= 0 || number <= 7)) {
        throw new Error(`No value '${number}' of AllDwarfPlayersAmountIdType.`);
    }
}

export function AssertStrengthTokenNotchLongMax(number: number): asserts number is StrengthTokenNotchLongMaxType {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No value '${number}' of StrengthTokenNotchLongMaxType.`);
    }
}

export function AssertPrioritiesAmount(number: number): asserts number is PrioritiesAmountType {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No value '${number}' of PrioritiesAmountType.`);
    }
}

export function AssertRoyalCoinValue(number: number): asserts number is RoyalCoinValueType {
    if (!(number >= 5 || number <= 25)) {
        throw new Error(`No value '${number}' of RoyalCoinValueType.`);
    }
}

export function AssertAllPriorityValue(number: number): asserts number is AllPriorityValueType {
    if (!(number >= -1 || number <= 6)) {
        throw new Error(`No value '${number}' of AllPriorityValueType.`);
    }
}

export function AssertAllCoinsValue(number: number): asserts number is AllCoinsValueType {
    if (!(number >= 0 || number !== 1 || number <= 25)) {
        throw new Error(`No value '${number}' of AllCoinsValueType.`);
    }
}

export function AssertUpgradableCoinValue(number: number): asserts number is UpgradableCoinValueType {
    if (!(number >= 2 || number <= 25)) {
        throw new Error(`No value '${number}' of UpgradableCoinValueType.`);
    }
}

export function AssertPlayerCoinId(number: number): asserts number is PlayerCoinIdType {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No value '${number}' of PlayerCoinIdType.`);
    }
}

export function AssertPlayerPouchCoinId(number: number): asserts number is PlayerPouchCoinIdType {
    if (!(number >= 3 || number <= 4)) {
        throw new Error(`No value '${number}' of PlayerPouchCoinIdType.`);
    }
}

export function AssertAllNumberValuesArraysLengthType(number: number):
    asserts number is AllNumberValuesArraysLengthType {
    if (!(number >= 0 || number <= 8)) {
        throw new Error(`No value '${number}' of AllNumberValuesArraysLengthType.`);
    }
}

export function AssertMaxCurrentSuitDistinctionPlayersType(number: number):
    asserts number is MaxCurrentSuitDistinctionPlayersType {
    if (!(number >= 1 || number <= 5)) {
        throw new Error(`No value '${number}' of MaxCurrentSuitDistinctionPlayersType.`);
    }
}

export function AssertSecretAllDwarfDecksArrayIndex(number: number):
    asserts number is SecretAllDwarfDecksArrayIndex {
    if (!(number >= 0 || number <= 1)) {
        throw new Error(`No index '${number}' of SecretAllDwarfDecksArrayIndex.`);
    }
}

export function AssertHeroesForSoloGameForStrategyBotAndvariIndex(number: number):
    asserts number is IndexOf<HeroesForSoloGameForStrategyBotAndvariArray> {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No index '${number}' of HeroesForSoloGameForStrategyBotAndvariArray.`);
    }
}

export function AssertDwergBrothersScoringArrayIndex(number: number):
    asserts number is IndexOf<DwergBrothersScoringArray> {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No index '${number}' of DwergBrothersScoringArray.`);
    }
}

export function AssertSecretAllDwarfDecksIndex(number: number): asserts number is IndexOf<SecretAllDwarfDecksArray> {
    if (!(number >= 0 || number <= 1)) {
        throw new Error(`No index '${number}' of SecretAllDwarfDecks.`);
    }
}

export function AssertSecretAllCampDecksIndex(number: number): asserts number is IndexOf<SecretAllCampDecks> {
    if (!(number >= 0 || number <= 1)) {
        throw new Error(`No index '${number}' of SecretAllCampDecks.`);
    }
}

export function AssertCampIndex(number: number): asserts number is CampCardArrayIndex {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No index '${number}' of CampCardArray.`);
    }
}

export function AssertTavernIndex(number: number): asserts number is TavernsArrayIndex {
    if (!(number >= 0 || number <= 2)) {
        throw new Error(`No index '${number}' of TavernsType.`);
    }
}

export function AssertTavernsHeuristicArrayIndex(number: number): asserts number is IndexOf<TavernsHeuristicArray> {
    if (!(number >= 0 || number <= 2)) {
        throw new Error(`No index '${number}' of TavernsHeuristicArray.`);
    }
}

export function AssertMercenariesConfigIndex(number: number): asserts number is IndexOf<MercenariesConfigType> {
    if (!(number >= 0 || number <= 5)) {
        throw new Error(`No index '${number}' of MercenariesConfigType.`);
    }
}

export function AssertRoyalOfferingsConfigIndex(number: number): asserts number is IndexOf<RoyalOfferingsConfig> {
    if (!(number >= 0 || number <= 1)) {
        throw new Error(`No index '${number}' of RoyalOfferingsConfig.`);
    }
}

export function AssertTierIndex(number: number): asserts number is TierType {
    if (!(number >= 0 || number <= 1)) {
        throw new Error(`No '${number}' in TierType.`);
    }
}

export function AssertAllInitialTradingCoinConfigIndex(number: number):
    asserts number is IndexOf<AllInitialTradingCoinConfig> {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No '${number}' in AllInitialTradingCoinConfig.`);
    }
}

export function AssertAllRoyalCoinConfigIndex(number: number): asserts number is IndexOf<AllRoyalCoinConfig> {
    if (!(number >= 0 || number <= 20)) {
        throw new Error(`No '${number}' in AllRoyalCoinConfig.`);
    }
}

export function AssertRoyalCoinsUniqueArrayIndex(number: number): asserts number is IndexOf<RoyalCoinsUniqueArray> {
    if (!(number >= 0 || number <= 20)) {
        throw new Error(`No '${number}' in RoyalCoinsUniqueArray.`);
    }
}

export function AssertAICardCharacteristicsArrayIndex(number: number):
    asserts number is IndexOf<AICardCharacteristicsArray> {
    if (!(number >= 0 || number <= 2)) {
        throw new Error(`No '${number}' in AICardCharacteristicsArray.`);
    }
}

export function AssertTop1And2ScoreNumber(top1And2ScoreNumber: CanBeUndefType<number>):
    asserts top1And2ScoreNumber is number {
    if (!(top1And2ScoreNumber === undefined)) {
        throw new Error(`Топ 1 и 2 значения очков должны быть числовыми значениями.`);
    }
}

export function AssertTavernAllCardsArray(tavernAllCardsArray: TavernCardType[]):
    asserts tavernAllCardsArray is TavernAllCardsArray {
    if (!(tavernAllCardsArray.length > 2 || tavernAllCardsArray.length < 6)) {
        throw new Error(`В массиве всех карт в любой таверне должно быть более 2 и менее 6 карт.`);
    }
}

export function AssertRefillDeckCardsWithExpansionArray(refillDeckCardsWithExpansionArray:
    MythologicalCreatureCardType[]):
    asserts refillDeckCardsWithExpansionArray is RefillDeckCardsWithExpansionArray {
    if (!(refillDeckCardsWithExpansionArray.length > 2 || refillDeckCardsWithExpansionArray.length < 6)) {
        throw new Error(`В массиве всех карт для заполнения в таверне с дополнением должно быть более 2 и менее 6 карт.`);
    }
}

export function AssertRefillDeckCardsWithoutExpansionArray(refillDeckCardsWithoutExpansionArray:
    DwarfDeckCardType[]):
    asserts refillDeckCardsWithoutExpansionArray is RefillDeckCardsWithoutExpansionArray {
    if (!(refillDeckCardsWithoutExpansionArray.length > 2 || refillDeckCardsWithoutExpansionArray.length < 6)) {
        throw new Error(`В массиве всех карт для заполнения в таверне без дополнения должно быть более 2 и менее 6 карт.`);
    }
}

export function AssertMaxCurrentSuitDistinctionPlayersArray(maxCurrentSuitDistinctionPlayersArray: number[]):
    asserts maxCurrentSuitDistinctionPlayersArray is MaxCurrentSuitDistinctionPlayersArray {
    if (!(maxCurrentSuitDistinctionPlayersArray.length > 0 || maxCurrentSuitDistinctionPlayersArray.length < 6)) {
        throw new Error(`В массиве индексов игроков с максимальным количеством шевронов для преимущества по фракции должно быть более 0 и менее 6 значений.`);
    }
}

export function AssertExchangeOrderArray(exchangeOrderArray: number[]):
    asserts exchangeOrderArray is ExchangeOrderArray {
    if (!(exchangeOrderArray.length > 1 || exchangeOrderArray.length < 6)) {
        throw new Error(`В массиве изменения порядка хода игроков игроков должно быть более 1 и менее 6 значений.`);
    }
}

export function AssertResolvedPlayersOrderArray(resolvedPlayersOrderArray: PlayerID[]):
    asserts resolvedPlayersOrderArray is ResolvedPlayersOrderArray {
    if (!(resolvedPlayersOrderArray.length > 0 || resolvedPlayersOrderArray.length < 6)) {
        throw new Error(`В массиве нового порядка хода игроков должно быть более 0 и менее 6 значений.`);
    }
}

export function AssertDistinctionsPlayersOrderArray(distinctionsPlayersOrderArray: PlayerID[]):
    asserts distinctionsPlayersOrderArray is DistinctionsPlayersOrderArray {
    if (!(distinctionsPlayersOrderArray.length >= 0 || distinctionsPlayersOrderArray.length < 6)) {
        throw new Error(`В массиве порядка хода игроков по преимуществам по фракции должно быть более 0 и менее 6 значений.`);
    }
}

export function AssertPlayerRanksForDistinctionsArray(playerRanksForDistinctionsArray: number[]):
    asserts playerRanksForDistinctionsArray is PlayerRanksForDistinctionsArray {
    if (!(playerRanksForDistinctionsArray.length > 0 || playerRanksForDistinctionsArray.length < 6)) {
        throw new Error(`В массиве количества шевронов игроков для преимущества по фракции должно быть более 0 и менее 6 значений.`);
    }
}

export function AssertTotalScoreArray(totalScoreArray: number[]): asserts totalScoreArray is TotalScoreArray {
    if (!(totalScoreArray.length > 1 || totalScoreArray.length < 6)) {
        throw new Error(`В массиве итоговых очков игроков должно быть более 1 и менее 6 итоговых результатов.`);
    }
}

export function AssertWinnerArray(winnerArray: number[]):
    asserts winnerArray is WinnerArray {
    if (!(winnerArray.length > 0 || winnerArray.length < 6)) {
        throw new Error(`В массиве победителей игры должно быть более 0 и менее 6 игроков.`);
    }
}

export function AssertUpgradingCoinsArray(upgradingCoinsArray: UpgradableCoinType[]):
    asserts upgradingCoinsArray is UpgradingCoinsArrayType {
    if (!(upgradingCoinsArray.length > 0 || upgradingCoinsArray.length < 5)) {
        throw new Error(`В массиве монет для обмена должно быть более 0 и менее 5 монет.`);
    }
}

export function AssertAICardCharacteristicsArray(aiCardCharacteristicsArray: AICardCharacteristics[]):
    asserts aiCardCharacteristicsArray is AICardCharacteristicsArray {
    if (!(aiCardCharacteristicsArray.length === 3)) {
        throw new Error(`В массиве эвристик таверн должно быть ровно 3 характеристики.`);
    }
}

export function AssertTavernsHeuristicArray(tavernsHeuristicArray: number[]):
    asserts tavernsHeuristicArray is TavernsHeuristicArray {
    if (!(tavernsHeuristicArray.length === 3)) {
        throw new Error(`В массиве эвристик таверн должно быть ровно 3 эвристики.`);
    }
}

export function AssertHandCoins(handCoins: PublicPlayerCoinType[]): asserts handCoins is PublicPlayerHandCoins {
    if (!(handCoins.length === 5)) {
        throw new Error(`В массиве монет игрока в руке должно быть ровно 5 монет.`);
    }
}

export function AssertPrivateBoardCoins(boardCoins: CoinType[]): asserts boardCoins is PrivatePlayerBoardCoins {
    if (!(boardCoins.length === 5)) {
        throw new Error(`В массиве монет приватного игрока на столе должно быть ровно 5 монет.`);
    }
}

export function AssertPrivateHandCoins(handCoins: CoinType[]): asserts handCoins is PrivatePlayerHandCoins {
    if (!(handCoins.length === 5)) {
        throw new Error(`В массиве монет приватного игрока в руке должно быть ровно 5 монет.`);
    }
}

export function AssertRoyalCoinsUnique(uniqueRoyalCoins: RoyalCoin[]):
    asserts uniqueRoyalCoins is RoyalCoinsUniqueArray {
    if (!(uniqueRoyalCoins.length === 21)) {
        throw new Error(`В массиве уникальных монет на рынке должно быть ровно 21 монета.`);
    }
}

export function AssertBoardCoins(boardCoins: PublicPlayerCoinType[]): asserts boardCoins is PublicPlayerBoardCoins {
    if (!(boardCoins.length === 5)) {
        throw new Error(`В массиве монет игрока на столе должно быть ровно 5 монет.`);
    }
}

export function AssertInitialCoins(initialCoins: readonly InitialCoinType[]): asserts initialCoins is AllInitialCoins {
    // TODO Add check 1 InitialTriggerTradingCoin & 4 InitialNotTriggerTradingCoin type&isOpened!?
    if (!(initialCoins.length === 5 && initialCoins[0]?.value === 0 && initialCoins[1]?.value === 2
        && initialCoins[2]?.value === 3 && initialCoins[3]?.value === 4 && initialCoins[4]?.value === 5)) {
        throw new Error(`В массиве базовых монет должно быть ровно 5 монет со значениями 0 (обменная), 2, 3, 4, 5 (базовые).`);
    }
}

export function AssertMythologicalCreatureCardsForGiantSkymir(mythologyCreatureCardsSkymir:
    MythologicalCreatureCardType[]):
    asserts mythologyCreatureCardsSkymir is Required<MythologicalCreatureCardsForGiantSkymirArray> {
    if (!(mythologyCreatureCardsSkymir.length === 5)) {
        throw new Error(`В массиве карт мифических существ для карты '${CardTypeRusNames.GiantCard}' '${GiantRusNames.Skymir}' должно быть ровно 5 слотов для карт.`);
    }
}

export function AssertTradingCoins(tradingCoins: UpgradableCoinType[]): asserts tradingCoins is TradingCoinsType {
    if (!(tradingCoins.length === 1 || tradingCoins.length === 2)) {
        throw new Error(`В массиве монет для обмена должно быть ровно 1 | 2 монет(а/ы).`);
    }
}

export function AssertTradingCoinsValues(tradingCoinsValues: number[]):
    asserts tradingCoinsValues is TradingCoinsValueType {
    if (!(tradingCoinsValues.length === 1 || tradingCoinsValues.length === 2)) {
        throw new Error(`В массиве значений монет для обмена должно быть ровно 1 | 2 монет(а/ы).`);
    }
}

export function AssertExplorerDistinctionCards(explorerDistinctionCards: readonly DwarfDeckCardType[]):
    asserts explorerDistinctionCards is ExplorerDistinctionCards {
    if (!(explorerDistinctionCards.length === 1 || explorerDistinctionCards.length === 3
        || explorerDistinctionCards.length === 6)) {
        throw new Error(`В массиве карт для получения преимущества по фракции '${SuitRusNames.explorer}' должно быть ровно 1 | 3 | 6 карт(а/ы).`);
    }
}

export function AssertCamp(camp: CanBeNullType<CampCardType>[]): asserts camp is CampCardArray {
    if (!(camp.length === 5)) {
        throw new Error(`В массиве лагеря должно быть ровно 5 слотов для карт.`);
    }
}

export function AssertHeroesForSoloBot(heroesForSoloBot: HeroCard[]):
    asserts heroesForSoloBot is HeroesForSoloGameArrayType {
    if (!(heroesForSoloBot.length === 5)) {
        throw new Error(`В массиве карт героев для соло бота должно быть ровно 5 карт.`);
    }
}

export function AssertHeroesInitialForSoloGameForBotAndvari(heroesInitialForSoloGameForBotAndvari: HeroCard[]):
    asserts heroesInitialForSoloGameForBotAndvari is HeroesInitialForSoloGameForBotAndvariArray {
    if (!(heroesInitialForSoloGameForBotAndvari.length === 10)) {
        throw new Error(`В массиве карт героев для соло бота Андвари должно быть ровно 5 карт.`);
    }
}

export function AssertHeroesForSoloGameForStrategyBotAndvari(heroesForSoloGameForStrategyBotAndvari: HeroCard[]):
    asserts heroesForSoloGameForStrategyBotAndvari is HeroesForSoloGameForStrategyBotAndvariArray {
    if (!(heroesForSoloGameForStrategyBotAndvari.length === 5)) {
        throw new Error(`В массиве карт героев для стратегии соло бота Андвари должно быть ровно 5 карт.`);
    }
}

export function AssertPlayerStack(stack: Stack | PlayerStack): asserts stack is PlayerStack {
    if (!(`priority` in stack)) {
        throw new Error(`В стеке действий игрока должно быть поле 'priority'.`);
    }
}
