import { CardTypeRusNames, GiantRusNames, SuitRusNames } from "../typescript/enums";
import type { AllCoinsValueType, AllDwarfPlayersAmountType, AllInitialCoins, AllInitialTradingCoinConfig, AllPriorityValueType, AllRoyalCoinConfig, BasicVidofnirVedrfolnirUpgradeValueType, CampCardArray, CampCardType, CanBeNullType, CoinType, DwarfDeckCardType, DwergBrothersScoringArray, ExplorerDistinctionCardIdType, ExplorerDistinctionCards, GeneralStrategyForSoloBotAndvariIdType, HeroCard, HeroesForSoloGameArrayType, HeroesForSoloGameForStrategyBotAndvariArray, HeroesInitialForSoloGameForBotAndvariArray, IndexOf, InitialCoinType, MarketCoinNumberValuesType, MercenariesConfigType, MythologicalCreatureCardType, MythologicalCreatureCardsForGiantSkymirArray, PlayerCoinIdType, PlayerCoinNumberValuesType, PlayerPouchCoinIdType, PlayerStack, PlayerTavernCoinIdType, PrioritiesAmountType, PrivatePlayerBoardCoins, PrivatePlayerHandCoins, PublicPlayerBoardCoins, PublicPlayerCoinType, PublicPlayerHandCoins, ReserveStrategyForSoloBotAndvariIdType, RoyalCoinValueType, RoyalOfferingsConfig, SecretAllCampDecks, SecretAllDwarfDecks, Stack, StrengthTokenNotchLongMaxType, StrengthTokenNotchShortMaxType, TavernCardIdPossibleType, TavernsType, TierType, TradingCoinsType, TradingCoinsValueType, UpgradableCoinType, UpgradableCoinValueType } from "../typescript/interfaces";

export function AssertBasicVidofnirVedrfolnirUpgradeValue(number: number):
    asserts number is BasicVidofnirVedrfolnirUpgradeValueType {
    if (!(number === 2 || number === 3 || number === 5)) {
        throw new Error(`No value '${number}' of BasicVidofnirVedrfolnirUpgradeValueType.`);
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

export function AssertAllDwarfPlayersAmount(number: number): asserts number is AllDwarfPlayersAmountType {
    if (!(number >= 6 || number <= 8 || number === 10)) {
        throw new Error(`No value '${number}' of AllDwarfPlayersAmountType.`);
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

export function AssertStrengthTokenNotchShortMax(number: number): asserts number is StrengthTokenNotchShortMaxType {
    if (!(number >= 0 || number <= 3)) {
        throw new Error(`No value '${number}' of StrengthTokenNotchShortMaxType.`);
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

export function AssertHeroesForSoloGameForStrategyBotAndvariIndex(number: number):
    asserts number is IndexOf<HeroesForSoloGameForStrategyBotAndvariArray> {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No index '${number}' of HeroesForSoloGameForStrategyBotAndvariArray.`);
    }
}

export function AssertHeroesForSoloGameIndex(number: number): asserts number is IndexOf<HeroesForSoloGameArrayType> {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No index '${number}' of HeroesForSoloGameArrayType.`);
    }
}

export function AssertDwergBrothersScoringArrayIndex(number: number):
    asserts number is IndexOf<DwergBrothersScoringArray> {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No index '${number}' of DwergBrothersScoringArray.`);
    }
}

export function AssertSecretAllDwarfDecksIndex(number: number): asserts number is IndexOf<SecretAllDwarfDecks> {
    if (!(number >= 0 || number <= 1)) {
        throw new Error(`No index '${number}' of SecretAllDwarfDecks.`);
    }
}

export function AssertSecretAllCampDecksIndex(number: number): asserts number is IndexOf<SecretAllCampDecks> {
    if (!(number >= 0 || number <= 1)) {
        throw new Error(`No index '${number}' of SecretAllCampDecks.`);
    }
}

export function AssertCampIndex(number: number): asserts number is IndexOf<CampCardArray> {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No index '${number}' of CampCardArray.`);
    }
}

export function AssertTavernIndex(number: number): asserts number is IndexOf<TavernsType> {
    if (!(number >= 0 || number <= 2)) {
        throw new Error(`No index '${number}' of TavernsType.`);
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
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No '${number}' in AllRoyalCoinConfig.`);
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
