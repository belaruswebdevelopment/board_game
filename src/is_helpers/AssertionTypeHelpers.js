import { CardTypeRusNames, GiantRusNames, SuitRusNames } from "../typescript/enums";
export function AssertZeroOrOne(number) {
    if (!(number === 0 || number === 1)) {
        throw new Error(`No value '${number}' of ZeroOrOneType.`);
    }
}
export function AssertOneOrTwo(number) {
    if (!(number === 1 || number === 2)) {
        throw new Error(`No value '${number}' of OneOrTwoType.`);
    }
}
export function AssertMinerDistinctionsScoring(number) {
    if (!(number === 0 || number === 3)) {
        throw new Error(`No value '${number}' of MinerDistinctionsScoringType.`);
    }
}
export function AssertBasicVidofnirVedrfolnirUpgradeValue(number) {
    if (!(number === 2 || number === 3 || number === 5)) {
        throw new Error(`No value '${number}' of BasicVidofnirVedrfolnirUpgradeValueType.`);
    }
}
export function AssertCoinUpgradePossibleMaxValue(number) {
    if (!(number >= 5 || number <= 51)) {
        throw new Error(`No value '${number}' of CoinUpgradePossibleMaxValue.`);
    }
}
export function AssertAllHeroesPossibleCardId(heroId) {
    if (!(heroId >= 1 || heroId <= 28)) {
        throw new Error(`No value '${heroId}' of AllHeroesPossibleCardIdType.`);
    }
}
export function AssertAllBasicHeroesPossibleCardId(heroId) {
    if (!(heroId >= 1 || heroId <= 22)) {
        throw new Error(`No value '${heroId}' of AllBasicHeroesPossibleCardIdType.`);
    }
}
export function AssertAllHeroesForPlayerSoloModePossibleCardId(heroId) {
    if (!(heroId >= 1 || heroId <= 10)) {
        throw new Error(`No value '${heroId}' of AllHeroesForPlayerSoloModePossibleCardIdType.`);
    }
}
export function AssertAllHeroesForPlayerSoloModeAndvariPossibleCardId(heroId) {
    if (!(heroId >= 1 || heroId <= 11)) {
        throw new Error(`No value '${heroId}' of AllHeroesForPlayerSoloModeAndvariPossibleCardIdType.`);
    }
}
export function AssertAllHeroesForSoloBotPossibleCardId(heroId) {
    if (!(heroId >= 1 || heroId <= 5)) {
        throw new Error(`No value '${heroId}' of AllHeroesForSoloBotPossibleCardIdType.`);
    }
}
export function AssertAllHeroesForSoloBotAndvariPossibleCardId(heroId) {
    if (!(heroId >= 1 || heroId <= 5)) {
        throw new Error(`No value '${heroId}' of AllHeroesForSoloBotAndvariPossibleCardIdType.`);
    }
}
export function AssertAllHeroesForDifficultySoloModePossibleCardId(heroId) {
    if (!(heroId >= 1 || heroId <= 6)) {
        throw new Error(`No value '${heroId}' of AllHeroesForDifficultySoloModePossibleCardIdType.`);
    }
}
// TODO Must be 0 | (0 | 1 | 2) | (0 | 1 | 2 | 3 | 4 | 5) by array length! Add G to params and check G.explorerDistinctionCards.length!?
export function AssertExplorerDistinctionCardIdType(number) {
    if (!(number >= 0 || number <= 5)) {
        throw new Error(`No value '${number}' of ExplorerDistinctionCardIdType.`);
    }
}
export function AssertMarketCoinNumberValues(number) {
    if (!(number >= 0 || number <= 3)) {
        throw new Error(`No value '${number}' of MarketCoinNumberValuesType.`);
    }
}
export function AssertPlayerCoinNumberValues(number) {
    if (!(number >= 1 || number <= 5)) {
        throw new Error(`No value '${number}' of PlayerCoinNumberValuesType.`);
    }
}
export function AssertTavernCardId(number) {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No value '${number}' of TavernCardIdType.`);
    }
}
export function AssertPlayerTavernCoinId(number) {
    if (!(number >= 0 || number <= 2)) {
        throw new Error(`No value '${number}' of PlayerTavernCoinIdType.`);
    }
}
export function AssertGeneralStrategyForSoloBotAndvariId(number) {
    if (!(number >= 0 || number <= 2)) {
        throw new Error(`No value '${number}' of GeneralStrategyForSoloBotAndvariIdType.`);
    }
}
export function AssertReserveStrategyForSoloBotAndvariId(number) {
    if (!(number >= 1 || number <= 4)) {
        throw new Error(`No value '${number}' of ReserveStrategyForSoloBotAndvariId.`);
    }
}
export function AssertStrengthTokenNotchShortMax(number) {
    if (!(number >= 0 || number <= 3)) {
        throw new Error(`No value '${number}' of StrengthTokenNotchShortMaxType.`);
    }
}
export function AssertStrengthTokenNotchLongMax(number) {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No value '${number}' of StrengthTokenNotchLongMaxType.`);
    }
}
export function AssertPrioritiesAmount(number) {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No value '${number}' of PrioritiesAmountType.`);
    }
}
export function AssertRoyalCoinValue(number) {
    if (!(number >= 5 || number <= 25)) {
        throw new Error(`No value '${number}' of RoyalCoinValueType.`);
    }
}
export function AssertAllPriorityValue(number) {
    if (!(number >= -1 || number <= 6)) {
        throw new Error(`No value '${number}' of AllPriorityValueType.`);
    }
}
export function AssertAllCoinsValue(number) {
    if (!(number >= 0 || number !== 1 || number <= 25)) {
        throw new Error(`No value '${number}' of AllCoinsValueType.`);
    }
}
export function AssertUpgradableCoinValue(number) {
    if (!(number >= 2 || number <= 25)) {
        throw new Error(`No value '${number}' of UpgradableCoinValueType.`);
    }
}
export function AssertPlayerCoinId(number) {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No value '${number}' of PlayerCoinIdType.`);
    }
}
export function AssertPlayerPouchCoinId(number) {
    if (!(number >= 3 || number <= 4)) {
        throw new Error(`No value '${number}' of PlayerPouchCoinIdType.`);
    }
}
export function AssertHeroesForSoloGameForStrategyBotAndvariIndex(number) {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No index '${number}' of HeroesForSoloGameForStrategyBotAndvariArray.`);
    }
}
export function AssertDwergBrothersScoringArrayIndex(number) {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No index '${number}' of DwergBrothersScoringArray.`);
    }
}
export function AssertSecretAllDwarfDecksIndex(number) {
    if (!(number >= 0 || number <= 1)) {
        throw new Error(`No index '${number}' of SecretAllDwarfDecks.`);
    }
}
export function AssertSecretAllCampDecksIndex(number) {
    if (!(number >= 0 || number <= 1)) {
        throw new Error(`No index '${number}' of SecretAllCampDecks.`);
    }
}
export function AssertCampIndex(number) {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No index '${number}' of CampCardArray.`);
    }
}
export function AssertTavernIndex(number) {
    if (!(number >= 0 || number <= 2)) {
        throw new Error(`No index '${number}' of TavernsType.`);
    }
}
export function AssertMercenariesConfigIndex(number) {
    if (!(number >= 0 || number <= 5)) {
        throw new Error(`No index '${number}' of MercenariesConfigType.`);
    }
}
export function AssertRoyalOfferingsConfigIndex(number) {
    if (!(number >= 0 || number <= 1)) {
        throw new Error(`No index '${number}' of RoyalOfferingsConfig.`);
    }
}
export function AssertTierIndex(number) {
    if (!(number >= 0 || number <= 1)) {
        throw new Error(`No '${number}' in TierType.`);
    }
}
export function AssertAllInitialTradingCoinConfigIndex(number) {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No '${number}' in AllInitialTradingCoinConfig.`);
    }
}
export function AssertAllRoyalCoinConfigIndex(number) {
    if (!(number >= 0 || number <= 20)) {
        throw new Error(`No '${number}' in AllRoyalCoinConfig.`);
    }
}
export function AssertRoyalCoinsUniqueArrayIndex(number) {
    if (!(number >= 0 || number <= 20)) {
        throw new Error(`No '${number}' in RoyalCoinsUniqueArray.`);
    }
}
export function AssertHandCoins(handCoins) {
    if (!(handCoins.length === 5)) {
        throw new Error(`В массиве монет игрока в руке должно быть ровно 5 монет.`);
    }
}
export function AssertPrivateBoardCoins(boardCoins) {
    if (!(boardCoins.length === 5)) {
        throw new Error(`В массиве монет приватного игрока на столе должно быть ровно 5 монет.`);
    }
}
export function AssertPrivateHandCoins(handCoins) {
    if (!(handCoins.length === 5)) {
        throw new Error(`В массиве монет приватного игрока в руке должно быть ровно 5 монет.`);
    }
}
export function AssertRoyalCoinsUnique(uniqueRoyalCoins) {
    if (!(uniqueRoyalCoins.length === 21)) {
        throw new Error(`В массиве уникальных монет на рынке должно быть ровно 21 монета.`);
    }
}
export function AssertBoardCoins(boardCoins) {
    if (!(boardCoins.length === 5)) {
        throw new Error(`В массиве монет игрока на столе должно быть ровно 5 монет.`);
    }
}
export function AssertInitialCoins(initialCoins) {
    var _a, _b, _c, _d, _e;
    // TODO Add check 1 InitialTriggerTradingCoin & 4 InitialNotTriggerTradingCoin type&isOpened!?
    if (!(initialCoins.length === 5 && ((_a = initialCoins[0]) === null || _a === void 0 ? void 0 : _a.value) === 0 && ((_b = initialCoins[1]) === null || _b === void 0 ? void 0 : _b.value) === 2
        && ((_c = initialCoins[2]) === null || _c === void 0 ? void 0 : _c.value) === 3 && ((_d = initialCoins[3]) === null || _d === void 0 ? void 0 : _d.value) === 4 && ((_e = initialCoins[4]) === null || _e === void 0 ? void 0 : _e.value) === 5)) {
        throw new Error(`В массиве базовых монет должно быть ровно 5 монет со значениями 0 (обменная), 2, 3, 4, 5 (базовые).`);
    }
}
export function AssertMythologicalCreatureCardsForGiantSkymir(mythologyCreatureCardsSkymir) {
    if (!(mythologyCreatureCardsSkymir.length === 5)) {
        throw new Error(`В массиве карт мифических существ для карты '${CardTypeRusNames.GiantCard}' '${GiantRusNames.Skymir}' должно быть ровно 5 слотов для карт.`);
    }
}
export function AssertTradingCoins(tradingCoins) {
    if (!(tradingCoins.length === 1 || tradingCoins.length === 2)) {
        throw new Error(`В массиве монет для обмена должно быть ровно 1 | 2 монет(а/ы).`);
    }
}
export function AssertTradingCoinsValues(tradingCoinsValues) {
    if (!(tradingCoinsValues.length === 1 || tradingCoinsValues.length === 2)) {
        throw new Error(`В массиве значений монет для обмена должно быть ровно 1 | 2 монет(а/ы).`);
    }
}
export function AssertExplorerDistinctionCards(explorerDistinctionCards) {
    if (!(explorerDistinctionCards.length === 1 || explorerDistinctionCards.length === 3
        || explorerDistinctionCards.length === 6)) {
        throw new Error(`В массиве карт для получения преимущества по фракции '${SuitRusNames.explorer}' должно быть ровно 1 | 3 | 6 карт(а/ы).`);
    }
}
export function AssertCamp(camp) {
    if (!(camp.length === 5)) {
        throw new Error(`В массиве лагеря должно быть ровно 5 слотов для карт.`);
    }
}
export function AssertHeroesForSoloBot(heroesForSoloBot) {
    if (!(heroesForSoloBot.length === 5)) {
        throw new Error(`В массиве карт героев для соло бота должно быть ровно 5 карт.`);
    }
}
export function AssertHeroesInitialForSoloGameForBotAndvari(heroesInitialForSoloGameForBotAndvari) {
    if (!(heroesInitialForSoloGameForBotAndvari.length === 10)) {
        throw new Error(`В массиве карт героев для соло бота Андвари должно быть ровно 5 карт.`);
    }
}
export function AssertHeroesForSoloGameForStrategyBotAndvari(heroesForSoloGameForStrategyBotAndvari) {
    if (!(heroesForSoloGameForStrategyBotAndvari.length === 5)) {
        throw new Error(`В массиве карт героев для стратегии соло бота Андвари должно быть ровно 5 карт.`);
    }
}
export function AssertPlayerStack(stack) {
    if (!(`priority` in stack)) {
        throw new Error(`В стеке действий игрока должно быть поле 'priority'.`);
    }
}
//# sourceMappingURL=AssertionTypeHelpers.js.map