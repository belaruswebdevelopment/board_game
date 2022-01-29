/**
 * <h3>Интерфейс для баффа карт.</h3>
 */
export interface IBuff {
    name: string,
    value: string | number | boolean,
}

/**
 * <h3>Интерфейс для видов бафов у карт.</h3>
 */
export interface IBuffs {
    // discardCardEndGame?: boolean,
    // endTier?: string,
    // everyTurn?: string,
    // getMjollnirProfit?: boolean,
    // goCamp?: boolean,
    // goCampOneTime?: boolean,
    // noHero?: boolean,
    // upgradeCoin?: number,
    // upgradeNextCoin?: string,
    [name: string]: string | number | boolean,
}
