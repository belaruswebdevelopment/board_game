
/**
 * <h3>Интерфейс для бафа карт.</h3>
 */
export interface IBuff {
    readonly name: keyof IBuffs,
}

/**
 * <h3>Интерфейс для видов бафов у карт.</h3>
 */
export interface IBuffs {
    readonly coin?: true,
    readonly discardCardEndGame?: true,
    readonly endTier?: true,
    readonly everyTurn?: true,
    readonly getMjollnirProfit?: true,
    readonly goCamp?: true,
    readonly goCampOneTime?: true,
    readonly noHero?: true,
    readonly suitIdForMjollnir?: string,
    readonly upgradeCoin?: true,
    readonly upgradeNextCoin?: true,
}
