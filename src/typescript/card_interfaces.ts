/**
 * <h3>Интерфейс для карты дворфа.</h3>
 */
export interface ICard {
    readonly type: string,
    readonly suit: string,
    rank: number,
    points: null | number,
    readonly name: string,
    readonly game: string,
    readonly tier: number,
    readonly path: string,
}

/**
 * <h3>Интерфейс для создания карты дворфа.</h3>
 */
export interface ICreateCard {
    readonly type?: string,
    readonly suit: string,
    readonly rank: number,
    readonly points: null | number,
    readonly name?: string,
    readonly game?: string,
    readonly tier?: number,
    readonly path?: string,
}
