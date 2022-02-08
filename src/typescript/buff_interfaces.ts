import { HeroNames } from "./enums";

/**
 * <h3>Интерфейс для бафа карт.</h3>
 */
export interface IBuff {
    name: keyof IBuffs,
    value: string | number | true,
}

/**
 * <h3>Интерфейс для видов бафов у карт.</h3>
 */
export interface IBuffs {
    coin?: `min`,
    discardCardEndGame?: true,
    endTier?: HeroNames.Ylud,
    everyTurn?: HeroNames.Uline,
    getMjollnirProfit?: true,
    goCamp?: true,
    goCampOneTime?: true,
    noHero?: true,
    upgradeCoin?: number,
    upgradeNextCoin?: string,
}
