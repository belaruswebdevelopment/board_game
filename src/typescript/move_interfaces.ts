
/**
 * <h3>Интерфейс для аргументов мувов для ботов.</h3>
 */
export interface ICurrentMoveArguments {
    phases: ICurrentMoveArgumentPhases,
}

export interface ICurrentMoveArgumentPhases {
    [phase: string]: ICurrentMoveArgumentsStages,
}

export interface ICurrentMoveArgumentsStage {
    arrayNumbers?: number[][],
    coins?: ICurrentMoveCoinsArguments[],
    empty?: null,
    numbers?: number[],
    strings?: string[],
    suits?: ICurrentMoveSuitCardIdArguments,
}

interface ICurrentMoveArgumentsStages {
    [stage: string]: ICurrentMoveArgumentsStage,
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
    [suit: string]: number[],
}
