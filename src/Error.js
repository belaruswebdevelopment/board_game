import { ErrorNames, GameModeNames } from "./typescript/enums";
/**
 * <h3>Все возможные ошибки/исключения в игре.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при любой ошибке/исключении.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param error Ошибка.
 * @param errorArgs Аргументы действия.
 * @returns
 */
export const ThrowMyError = (G, ctx, error, ...errorArgs) => {
    let _exhaustiveCheck;
    switch (error) {
        case ErrorNames.CurrentTierDeckIsUndefined:
            throw new Error(`Отсутствует колода карт текущей эпохи с id '${G.secret.decks.length - G.tierToEnd}'.`);
        case ErrorNames.CurrentPrivatePlayerIsUndefined:
            throw new Error(`В массиве приватных игроков отсутствует ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && errorArgs[0] === `1` ? `текущий соло бот` : `текущий игрок`} с id '${errorArgs[0]}'.`);
        case ErrorNames.CurrentPublicPlayerIsUndefined:
            throw new Error(`В массиве публичных игроков отсутствует ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && errorArgs[0] === `1` ? `текущий соло бот` : `текущий игрок`} с id '${errorArgs[0]}'.`);
        case ErrorNames.CurrentSuitDistinctionPlayerIndexIsUndefined:
            throw new Error(`Отсутствует игрок с максимальным количеством шевронов в фракции '${errorArgs[0]}'.`);
        case ErrorNames.DeckIsUndefined:
            throw new Error(`В массиве колод карт отсутствует колода с id '${errorArgs[0]}'.`);
        case ErrorNames.DoNotDiscardCardFromCurrentTavernIfCardWithCurrentIdIsUndefined:
            throw new Error(`В текущей таверне с id '${errorArgs[0]}' отсутствует карта для сброса с id '${errorArgs[1]}'.`);
        case ErrorNames.DoNotDiscardCardFromCurrentTavernIfNoCardInTavern:
            throw new Error(`Не удалось сбросить лишнюю карту из текущей таверны с id '${errorArgs[0]}' из-за её отсутствия в таверне.`);
        case ErrorNames.DoNotDiscardCardFromTavernInSoloOrTwoPlayersGame:
            throw new Error(`Не удалось сбросить лишнюю карту из текущей таверны с id '${errorArgs[0]}' при игре ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) ? `в соло режиме` : `на двух игроков`}.`);
        // TODO Move ctx.currentPlayer to Error(..., ctx.currentPlayer)?
        case ErrorNames.FirstStackActionIsUndefined:
            throw new Error(`В массиве стека действий текущего ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${ctx.currentPlayer}' отсутствует '0' действие.`);
        case ErrorNames.NoCardsToDiscardWhenNoWinnerInExplorerDistinction:
            throw new Error(`Отсутствует сбрасываемая карта из колоды с id '1' при отсутствии преимущества по фракции разведчиков.`);
        case ErrorNames.OnlyInSoloOrTwoPlayersGame:
            throw new Error(`Должно применяться только при игре в соло режиме или при наличии двух игроков в игре.`);
        case ErrorNames.PlayersCurrentSuitCardsMustHaveCardsForDistinction:
            throw new Error(`Должны быть карты во фракции '${errorArgs[0]}' хотя бы у одного игрока.`);
        case ErrorNames.PlayersCurrentSuitRanksArrayMustHavePlayerWithMostRankCount:
            throw new Error(`Должен быть хотя бы один игрок с максимальным количеством шевронов '${errorArgs[0]}' по фракции '${errorArgs[1]}'.`);
        case ErrorNames.PrivatePlayerWithCurrentIdIsUndefined:
            throw new Error(`В массиве приватных игроков отсутствует ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && errorArgs[0] === `1` ? `соло бот` : `игрок`} с id '${errorArgs[0]}'.`);
        case ErrorNames.PublicPlayerWithCurrentIdIsUndefined:
            throw new Error(`В массиве публичных игроков отсутствует ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && errorArgs[0] === `1` ? `соло бот` : `игрок`} с id '${errorArgs[0]}'.`);
        case ErrorNames.SuitDistinctionMustBePresent:
            throw new Error(`Преимущество по фракции '${errorArgs[0]}' должно быть хотя бы у одного игрока.`);
        case ErrorNames.TavernCanNotBeRefilledBecauseNotEnoughCards:
            throw new Error(`Таверна с id '${errorArgs[0]}' не заполнена новыми картами из-за их нехватки в колоде.`);
        default:
            _exhaustiveCheck = error;
            throw new Error(`Нет такой ошибки.`);
            return _exhaustiveCheck;
    }
};
//# sourceMappingURL=Error.js.map