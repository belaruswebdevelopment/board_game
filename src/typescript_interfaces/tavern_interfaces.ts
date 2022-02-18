/**
 * <h3>Интерфейс для конфига конкретной таверны.</h3>
 */
interface ITavernInConfig {
    readonly name: string,
}

/**
 * <h3>Интерфейс для конфига всех таверн.</h3>
 */
export interface ITavernsConfig {
    readonly [index: number]: ITavernInConfig,
}
