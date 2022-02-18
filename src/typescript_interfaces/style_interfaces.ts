/**
 * <h3>Интерфейс для отрисовки бэкграунда в стилях.</h3>
 */
export interface IBackground {
    readonly background: string,
}

/**
 * <h3>Интерфейс для всех стилей.</h3>
 */
export interface IStyles {
    readonly Camp: () => IBackground,
    readonly CampCards: (tier: number, cardPath: string) => IBackground,
    readonly Cards: (suit: string | null, name: string, points: number | null) => IBackground,
    readonly Coin: (value: number, initial: boolean) => IBackground,
    readonly CoinBack: () => IBackground,
    readonly Distinctions: (distinction: string) => IBackground,
    readonly DistinctionsBack: () => IBackground,
    readonly Exchange: () => IBackground,
    readonly Heroes: (game: string, heroName: string) => IBackground,
    readonly HeroBack: () => IBackground,
    readonly Priorities: (priority: number) => IBackground,
    readonly Priority: () => IBackground,
    readonly Suits: (suit: string) => IBackground,
    readonly Taverns: (tavernId: number) => IBackground,
}
