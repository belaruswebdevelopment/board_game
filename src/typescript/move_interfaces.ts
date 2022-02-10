export interface ICurrentMoveArgumentsStage<T> {
    readonly args: T,
}

export interface ICurrentMoveCoinsArguments {
    readonly coinId: number,
    readonly type: string,
    readonly isInitial: boolean,
}

/**
 * <h3>Интерфейс для выбранного аргумента мувов с фракциями для ботов.</h3>
 */
export interface ICurrentMoveSuitCardCurrentId {
    readonly suit: string,
    readonly cardId: number,
}

export interface ICurrentMoveSuitCardPlayerCurrentId {
    readonly playerId: number,
    readonly suit: string,
    readonly cardId: number,
}

/**
 * <h3>Интерфейс для аргументов мувов с фракциями для ботов.</h3>
 */
export interface ICurrentMoveSuitCardIdArguments {
    // TODO Rework [name: string]?
    [suit: string]: number[],
}

export interface ICurrentMoveSuitCardPlayerIdArguments {
    readonly playerId: number,
    suit: string,
    readonly cards: number[],
}
