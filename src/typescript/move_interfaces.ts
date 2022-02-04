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

export interface ICurrentMoveSuitCardPlayerCurrentId {
    playerId: number,
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

export interface ICurrentMoveSuitCardPlayerIdArguments {
    playerId: number,
    suit: string,
    cards: number[],
}
