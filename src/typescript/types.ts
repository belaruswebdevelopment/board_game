/**
 * <h3>Типы данных для рест аргументов функций.</h3>
 */
export type ArgsTypes = (string | number | boolean | null | object)[];

/**
 * <h3>Типы данных для преимуществ.</h3>
 */
export type DistinctionTypes = null | undefined | string;

export type MoveArgsTypes = number[][] | [string] | [number] | [string, number] | [string, number, number]
    | [number, string, boolean];
