import { Ctx } from "boardgame.io";
import { AddDataToLog } from "./Logging";
import { DeckCardTypes, TavernCardTypes } from "./typescript/card_types";
import { LogTypes } from "./typescript/enums";
import { MyGameState, tavernsConfig } from "./typescript/interfaces";

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
 * @param ctx
 * @returns Пуста ли текущая таверна.
 */
export const CheckIfCurrentTavernEmpty = (G: MyGameState, ctx: Ctx): boolean => {
    let isCurrentTavernEmpty = false;
    if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        isCurrentTavernEmpty =
            G.taverns[G.currentTavern].every((card: TavernCardTypes): boolean => card === null);
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
 * <h3>Убирает карту из таверны в стопку сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игре на 2-х игроков убирает не выбранную карту.</li>
 * <li>Убирает оставшуюся карту при выборе карты из кэмпа.</li>
 * <li>Игрок убирает одну карту при игре на двух игроков, если выбирает карту из кэмпа.</li>
 * </ol>
 *
 * @param G
 * @param discardCardIndex Индекс сбрасываемой карты в таверне.
 * @returns Сброшена ли карта из таверны.
 */
export const DiscardCardFromTavern = (G: MyGameState, discardCardIndex: number): boolean => {
    const discardedCard: TavernCardTypes = G.taverns[G.currentTavern][discardCardIndex];
    if (discardedCard !== null) {
        G.discardCardsDeck.push(discardedCard);
        G.taverns[G.currentTavern][discardCardIndex] = null;
        AddDataToLog(G, LogTypes.GAME, `Карта ${discardedCard.name} из таверны ${tavernsConfig[G.currentTavern].name} убрана в сброс.`);
        const additionalDiscardCardIndex: number =
            G.taverns[G.currentTavern].findIndex((card: TavernCardTypes): boolean => card !== null);
        if (additionalDiscardCardIndex !== -1) {
            AddDataToLog(G, LogTypes.GAME, `Дополнительная карта из таверны ${tavernsConfig[G.currentTavern].name} должна быть убрана в сброс из-за пика артефакта Jarnglofi.`);
            DiscardCardFromTavern(G, additionalDiscardCardIndex);
        }
        return true;
    }
    AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не удалось сбросить лишнюю карту из таверны.`);
    return false;
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
export const RefillTaverns = (G: MyGameState): void => {
    let error = false;
    for (let i = 0; i < G.tavernsNum; i++) {
        const refillDeck: DeckCardTypes[] =
            G.decks[G.decks.length - G.tierToEnd].splice(0, G.drawSize);
        if (refillDeck.length === G.drawSize) {
            G.taverns[i] = refillDeck;
            AddDataToLog(G, LogTypes.GAME, `Таверна ${tavernsConfig[i].name} заполнена новыми картами.`);
        } else {
            error = true;
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Таверна ${tavernsConfig[i].name} не заполнена новыми картами из-за их нехватки в колоде.`);
        }
    }
    if (!error) {
        AddDataToLog(G, LogTypes.GAME, `Все таверны заполнены новыми картами.`);
    }
};
