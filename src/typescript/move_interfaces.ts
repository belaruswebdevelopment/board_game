export interface ICurrentMoveArgumentsStage<T> {
    args: T,
}

export interface ICurrentMoveCoinsArguments {
    coinId: number,
    type: string,
    isInitial: boolean,
}

/**
 * <h3>Интерфейс для выбранного аргумента мувов с фракциями для ботов.</h3>
 */
export interface ICurrentMoveSuitCardCurrentId {
    suit: string,
    cardId: number,
}

/**
 * <h3>Интерфейс для аргументов мувов с фракциями для ботов.</h3>
 */
export interface ICurrentMoveSuitCardIdArguments {
    // TODO Rework [name: string]?
    [suit: string]: number[],
}
