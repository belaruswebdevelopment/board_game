import { HeroNames } from "./enums";

/**
 * <h3>Интерфейс для бафа карт.</h3>
 */
export interface IBuff {
    readonly name: keyof IBuffs,
    readonly value: string | number | true,
}

/**
 * <h3>Интерфейс для видов бафов у карт.</h3>
 */
export interface IBuffs {
    readonly coin?: `min`,
    readonly discardCardEndGame?: true,
    readonly endTier?: HeroNames.Ylud,
    readonly everyTurn?: HeroNames.Uline,
    readonly getMjollnirProfit?: true,
    readonly goCamp?: true,
    readonly goCampOneTime?: true,
    readonly noHero?: true,
    readonly upgradeCoin?: number,
    readonly upgradeNextCoin?: string,
}
