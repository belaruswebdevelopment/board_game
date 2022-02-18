/**
 * <h3>Интерфейс для условия карты героя.</h3>
 */
interface ICondition {
    readonly suit: string,
    // TODO Rework [name: string]?
    readonly [name: string]: string | number | boolean,
}

/**
 * <h3>Интерфейс для условий карты героя.</h3>
 */
export interface IConditions {
    // TODO Rework [name: string]?
    readonly [name: string]: ICondition,
}

interface IDiscardCard {
    readonly suit: string,
    readonly number?: number,
}

/**
 * <h3>Интерфейс для конфига валидаторов героев.</h3>
 */
export interface IValidatorsConfig {
    readonly conditions?: IConditions,
    readonly discardCard?: IDiscardCard,
    readonly pickCampCardToStack?: Record<string, never>,
    readonly pickDiscardCardToStack?: Record<string, never>,
}
