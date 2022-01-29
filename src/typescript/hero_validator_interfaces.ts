/**
 * <h3>Интерфейс для условия карты героя.</h3>
 */
interface ICondition {
    suit: string,
    [name: string]: string | number | boolean,
}

/**
 * <h3>Интерфейс для условий карты героя.</h3>
 */
export interface IConditions {
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
}
