import { IsArtefactCardNotMercenary } from "../Camp";
import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
/**
 * <h3>Добавляет взятую из кэмпа карту в массив карт кэмпа игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты кэмпа игроком.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта кэмпа.
 */
export const AddCampCardToPlayer = (G, ctx, card) => {
    if (!IsArtefactCardNotMercenary(card) || (IsArtefactCardNotMercenary(card) && card.suit === null)) {
        G.publicPlayers[Number(ctx.currentPlayer)].campCards.push(card);
        AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} выбрал карту кэмпа ${card.name}.`);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не удалось добавить карту артефакта ${card.name} в массив карт кэмпа игрока из-за её принадлежности к фракции ${card.suit}.`);
    }
};
/**
 * <h3>Добавляет карту кэмпа в конкретную фракцию игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении карты кэмпа в конкретную фракцию игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта кэмпа.
 * @returns Добавлен ли артефакт на планшет игрока.
 */
export const AddCampCardToPlayerCards = (G, ctx, card) => {
    if (card.suit !== null) {
        G.publicPlayers[Number(ctx.currentPlayer)].cards[card.suit].push(card);
        AddDataToLog(G, LogTypes.PRIVATE, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} выбрал карту кэмпа '${card.name}' во фракцию ${suitsConfig[card.suit].suitName}.`);
        return true;
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не удалось добавить артефакт ${card.name} на планшет карт фракций игрока из-за отсутствия принадлежности его к конкретной фракции.`);
        return false;
    }
};
//# sourceMappingURL=CampCardHelpers.js.map