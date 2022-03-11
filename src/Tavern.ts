import { AddDataToLog } from "./Logging";
import { LogTypes, TavernNames } from "./typescript/enums";
import type { DeckCardTypes, IMyGameState, ITavernInConfig, ITavernsConfig, TavernCardTypes } from "./typescript/interfaces";

/**
 * <h3>Проверяет все ли карты выбраны игроками в текущей таверне.</h1>
 * <p>Применения:</p>
 * <ol>
 * <li>Проверяет после каждого выбора карты дворфа из таверны.</li>
 * <li>Проверяет после каждого выбора карты улучшения монеты из таверны.</li>
 * <li>Проверяет после каждого выбора карты кэмпа из таверны.</li>
 * </ol>
 *
 * @param G
 * @returns Пуста ли текущая таверна.
 */
export const CheckIfCurrentTavernEmpty = (G: IMyGameState): boolean => {
    const currentTavern: TavernCardTypes[] | undefined = G.taverns[G.currentTavern];
    if (currentTavern !== undefined) {
        return currentTavern.every((card: TavernCardTypes): boolean => card === null);
    } else {
        throw new Error(`Отсутствует текущая таверна.`);
    }
};

/**
 * <h3>Убирает карту из таверны в стопку сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игре на 2-х игроков убирает не выбранную карту.</li>
 * <li>Убирает оставшуюся карту при выборе карты из кэмпа.</li>
 * <li>Игрок убирает одну карту при игре на двух игроков, если выбирает карту из кэмпа.</li>
 * <li>Игрок пике артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param G
 * @param discardCardIndex Индекс сбрасываемой карты в таверне.
 * @returns Сброшена ли карта из таверны.
 */
export const DiscardCardFromTavern = (G: IMyGameState, discardCardIndex: number): boolean => {
    const currentTavern: TavernCardTypes[] | undefined = G.taverns[G.currentTavern];
    if (currentTavern !== undefined) {
        const discardedCard: TavernCardTypes | undefined = currentTavern[discardCardIndex];
        if (discardedCard !== undefined) {
            if (discardedCard !== null) {
                G.discardCardsDeck.push(discardedCard);
                currentTavern.splice(discardCardIndex, 1, null);
                const currentTavernConfig: ITavernInConfig | undefined = tavernsConfig[G.currentTavern];
                if (currentTavernConfig !== undefined) {
                    AddDataToLog(G, LogTypes.GAME, `Карта '${discardedCard.name}' из таверны ${currentTavernConfig.name} убрана в сброс.`);
                    return true;
                } else {
                    throw new Error(`Отсутствует конфиг текущей таверны.`);
                }
            }
            throw new Error(`Не удалось сбросить лишнюю карту из таверны.`);
        } else {
            throw new Error(`В текущей таверне отсутствует карта ${discardCardIndex}.`);
        }
    } else {
        throw new Error(`Отсутствует текущая таверна.`);
    }
};

/**
 * <h3>Автоматически заполняет все таверны картами текущей эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при начале нового раунда.</li>
 * <li>Происходит при начале новой эпохе.</li>
 * </ol>
 *
 * @param G
 */
export const RefillTaverns = (G: IMyGameState): void => {
    for (let i = 0; i < G.tavernsNum; i++) {
        const deck: DeckCardTypes[] | undefined = G.decks[G.decks.length - G.tierToEnd];
        if (deck !== undefined) {
            const refillDeck: DeckCardTypes[] = deck.splice(0, G.drawSize),
                currentTavernConfig: ITavernInConfig | undefined = tavernsConfig[i];
            if (currentTavernConfig !== undefined) {
                if (refillDeck.length === G.drawSize) {
                    const currentTavern: TavernCardTypes[] | undefined = G.taverns[i];
                    if (currentTavern !== undefined) {
                        currentTavern.splice(0, currentTavern.length, ...refillDeck);
                        AddDataToLog(G, LogTypes.GAME, `Таверна ${currentTavernConfig.name} заполнена новыми картами.`);
                    } else {
                        throw new Error(`Отсутствует текущая таверна.`);
                    }
                } else {
                    throw new Error(`Таверна ${currentTavernConfig.name} не заполнена новыми картами из-за их нехватки в колоде.`);
                }
            } else {
                throw new Error(`Отсутствует конфиг текущей таверны.`);
            }
        } else {
            throw new Error(`Отсутствует колода карт текущей эпохи.`);
        }
    }
    AddDataToLog(G, LogTypes.GAME, `Все таверны заполнены новыми картами.`);
};

/**
 * <h3>Конфиг таверн.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется для описания таверн (+для ключей).</li>
 * </ol>
 */
export const tavernsConfig: ITavernsConfig = {
    0: {
        name: TavernNames.LaughingGoblin,
    },
    1: {
        name: TavernNames.DancingDragon,
    },
    2: {
        name: TavernNames.ShiningHorse,
    },
};
