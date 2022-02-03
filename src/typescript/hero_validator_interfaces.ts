/**
 * <h3>Интерфейс для условия карты героя.</h3>
 */
interface ICondition {
    suit: string,
    // TODO Rework [name: string]?
    [name: string]: string | number | boolean,
}

/**
 * <h3>Интерфейс для условий карты героя.</h3>
 */
export interface IConditions {
    // TODO Rework [name: string]?
    [name: string]: ICondition,
}

interface IDiscardCard {
    suit: string,
    number?: number,
}

/**
 * <h3>Интерфейс для конфига валидаторов героев.</h3>
 */
export interface IValidatorsConfig {
    conditions?: IConditions,
    discardCard?: IDiscardCard,
    pickCampCardToStack?: Record<string, never>,
    pickDiscardCardToStack?: Record<string, never>,
}
