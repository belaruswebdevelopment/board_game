import { AddDataToLog, LogTypes } from "./Logging";
import { DeckCardTypes, MyGameState, TavernCardTypes } from "./GameSetup";
import { Ctx } from "boardgame.io";
import { DiscardCardFromTavern } from "./Card";

/**
 * <h3>Интерфейс для конфига конкретной таверны.</h3>
 */
interface ITavernInConfig {
    name: string,
}

/**
 * <h3>Интерфейс для конфига всех таверн.</h3>
 */
interface ITavernsConfig {
    [index: number]: ITavernInConfig,
}

/**
 * <h3>Конфиг таверн.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется для описания таверн (+для ключей).</li>
 * </ol>
 */
export const tavernsConfig: ITavernsConfig = {
    0: {
        name: "«Весёлый гоблин»",
    },
    1: {
        name: "«Парящий дракон»",
    },
    2: {
        name: "«Гарцующий конь»",
    },
};

/**
 * <h3>Проверяет все ли карты выбраны игроками в текущей таверне.</h1>
 * <p>Применения:</p>
 * <ol>
 * <li>Проверяет после каждого выбора карты дворфа из таверны.</li>
 * <li>Проверяет после каждого выбора карты улучшения монеты из таверны.</li>
 * <li>Проверяет после каждого выбора карты кэмпа из таверны.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @returns {boolean} Пуста ли текущая таверна.
 * @constructor
 */
export const CheckIfCurrentTavernEmpty = (G: MyGameState, ctx: Ctx): boolean => {
    let isCurrentTavernEmpty: boolean = false;
    if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        isCurrentTavernEmpty = G.taverns[G.currentTavern].every((card: TavernCardTypes): boolean => card === null);
        if (!isCurrentTavernEmpty) {
            const discardCardIndex: number =
                G.taverns[G.currentTavern].findIndex((card: TavernCardTypes): boolean => card !== null);
            if (discardCardIndex !== -1) {
                const isCardDiscarded: boolean = DiscardCardFromTavern(G, discardCardIndex);
                if (isCardDiscarded) {
                    isCurrentTavernEmpty = true;
                }
            }
        }
        if (isCurrentTavernEmpty) {
            AddDataToLog(G, LogTypes.GAME, `Таверна ${tavernsConfig[G.currentTavern].name} пустая.`);
        }
    }
    return isCurrentTavernEmpty;
};

/**
 * <h3>Автоматически заполняет все таверны картами текущей эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при начале нового раунда.</li>
 * <li>Происходит при начале новой эпохе.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @constructor
 */
export const RefillTaverns = (G: MyGameState): void => {
    let error: boolean = false;
    for (let i: number = 0; i < G.tavernsNum; i++) {
        const refillDeck: DeckCardTypes[] = G.decks[G.decks.length - G.tierToEnd].splice(0, G.drawSize);
        if (refillDeck.length === G.drawSize) {
            G.taverns[i] = refillDeck;
            AddDataToLog(G, LogTypes.GAME, `Таверна ${tavernsConfig[i].name} заполнена новыми картами.`);
        } else {
            error = true;
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Таверна ${tavernsConfig[i].name} не заполнена новыми
            картами из-за их нехватки в колоде.`);
        }
    }
    if (!error) {
        AddDataToLog(G, LogTypes.GAME, "Все таверны заполнены новыми картами.");
    }
};
