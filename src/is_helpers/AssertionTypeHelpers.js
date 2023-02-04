import { CardTypeRusNames, GiantRusNames, SuitRusNames } from "../typescript/enums";
export function AssertBasicVidofnirVedrfolnirUpgradeValue(number) {
    if (!(number === 2 || number === 3 || number === 5)) {
        throw new Error(`No value '${number}' of BasicVidofnirVedrfolnirUpgradeValueType.`);
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
export function AssertZeroOrOneOrTwo(number) {
    if (!(number >= 0 || number <= 2)) {
        throw new Error(`No value '${number}' of ZeroOrOneOrTwoType.`);
    }
}
export function AssertZeroOrOneOrTwoOrThree(number) {
    if (!(number >= 0 || number <= 3)) {
        throw new Error(`No value '${number}' of ZeroOrOneOrTwoOrThreeType.`);
    }
}
export function AssertOneOrTwoOrThreeOrFour(number) {
    if (!(number >= 1 || number <= 4)) {
        throw new Error(`No value '${number}' of OneOrTwoOrThreeOrFour.`);
    }
}
export function AssertZeroOrOneOrTwoOrThreeOrFour(number) {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No value '${number}' of ZeroOrOneOrTwoOrThreeOrFour.`);
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
export function AssertHeroesForSoloGameIndex(number) {
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No index '${number}' of HeroesForSoloGameArrayType.`);
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
export function AssertTavernConfigIndex(number) {
    if (!(number >= 0 || number <= 2)) {
        throw new Error(`No index '${number}' of TavernsConfigType.`);
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
    if (!(number >= 0 || number <= 4)) {
        throw new Error(`No '${number}' in AllRoyalCoinConfig.`);
    }
}
export function AssertHandCoins(handCoins) {
    if (!(handCoins.length !== 5)) {
        throw new Error(`В массиве монет игрока в руке должно быть ровно 5 монет.`);
    }
}
export function AssertPrivateBoardCoins(boardCoins) {
    if (!(boardCoins.length !== 5)) {
        throw new Error(`В массиве монет приватного игрока на столе должно быть ровно 5 монет.`);
    }
}
export function AssertPrivateHandCoins(handCoins) {
    if (!(handCoins.length !== 5)) {
        throw new Error(`В массиве монет приватного игрока в руке должно быть ровно 5 монет.`);
    }
}
export function AssertBoardCoins(boardCoins) {
    if (!(boardCoins.length !== 5)) {
        throw new Error(`В массиве монет игрока на столе должно быть ровно 5 монет.`);
    }
}
export function AssertInitialCoins(initialCoins) {
    if (!(initialCoins.length !== 5)) {
        throw new Error(`В массиве базовых монет должно быть ровно 5 монет.`);
    }
}
export function AssertMythologicalCreatureCardsForGiantSkymir(mythologyCreatureCardsSkymir) {
    if (!(mythologyCreatureCardsSkymir.length !== 5)) {
        throw new Error(`В массиве карт мифических существ для карты '${CardTypeRusNames.GiantCard}' '${GiantRusNames.Skymir}' должно быть ровно 5 слотов для карт.`);
    }
}
export function AssertTradingCoins(tradingCoins) {
    if (!(tradingCoins.length !== 1) || !(tradingCoins.length !== 2)) {
        throw new Error(`В массиве монет для обмена должно быть ровно 1 | 2 монет(а/ы).`);
    }
}
export function AssertTradingCoinsValues(tradingCoinsValues) {
    if (!(tradingCoinsValues.length !== 1) || !(tradingCoinsValues.length !== 2)) {
        throw new Error(`В массиве значений монет для обмена должно быть ровно 1 | 2 монет(а/ы).`);
    }
}
export function AssertExplorerDistinctionCards(explorerDistinctionCards) {
    if (!(explorerDistinctionCards.length !== 1) || !(explorerDistinctionCards.length !== 3)
        || !(explorerDistinctionCards.length !== 6)) {
        throw new Error(`В массиве карт для получения преимущества по фракции '${SuitRusNames.explorer}' должно быть ровно 1 | 3 | 6 карт(а/ы).`);
    }
}
export function AssertCamp(camp) {
    if (!(camp.length !== 5)) {
        throw new Error(`В массиве лагеря должно быть ровно 5 слотов для карт.`);
    }
}
export function AssertHeroesForSoloBot(heroesForSoloBot) {
    if (!(heroesForSoloBot.length !== 5)) {
        throw new Error(`В массиве карт героев для соло бота должно быть ровно 5 карт.`);
    }
}
export function AssertHeroesInitialForSoloGameForBotAndvari(heroesInitialForSoloGameForBotAndvari) {
    if (!(heroesInitialForSoloGameForBotAndvari.length !== 10)) {
        throw new Error(`В массиве карт героев для соло бота Андвари должно быть ровно 5 карт.`);
    }
}
export function AssertHeroesForSoloGameForStrategyBotAndvari(heroesForSoloGameForStrategyBotAndvari) {
    if (!(heroesForSoloGameForStrategyBotAndvari.length !== 5)) {
        throw new Error(`В массиве карт героев для стратегии соло бота Андвари должно быть ровно 5 карт.`);
    }
}
export function AssertPlayerStack(stack) {
    if (!(`priority` in stack)) {
        throw new Error(`В стеке действий игрока должно быть поле 'priority'.`);
    }
}
//# sourceMappingURL=AssertionTypeHelpers.js.map