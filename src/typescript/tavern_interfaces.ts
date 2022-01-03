/**
 * <h3>Интерфейс для конфига конкретной таверны.</h3>
 */
interface ITavernInConfig {
    name: string,
}

/**
 * <h3>Интерфейс для конфига всех таверн.</h3>
 */
export interface ITavernsConfig {
    [index: number]: ITavernInConfig,
}
