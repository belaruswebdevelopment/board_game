/**
 * <h3>Интерфейс для отрисовки бэкграунда в стилях.</h3>
 */
export interface IBackground {
    background: string,
}

/**
 * <h3>Интерфейс для всех стилей.</h3>
 */
export interface IStyles {
    Camp: () => IBackground,
    CampCards: (tier: number, cardPath: string) => IBackground,
    Cards: (suit: string | null, name: string, points: number | null) => IBackground,
    Coin: (value: number, initial: boolean) => IBackground,
    CoinBack: () => IBackground,
    Distinctions: (distinction: string) => IBackground,
    DistinctionsBack: () => IBackground,
    Exchange: () => IBackground,
    Heroes: (game: string, heroName: string) => IBackground,
    HeroBack: () => IBackground,
    Priorities: (priority: number) => IBackground,
    Priority: () => IBackground,
    Suits: (suit: string) => IBackground,
    Taverns: (tavernId: number) => IBackground,
}
