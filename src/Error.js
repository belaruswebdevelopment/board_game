import { ErrorNames } from "./typescript/enums";
export const ThrowMyError = (G, ctx, error, ...errorArgs) => {
    switch (error) {
        case ErrorNames.CurrentTierDeckIsUndefined:
            //+
            throw new Error(`Отсутствует колода карт текущей эпохи с id '${G.secret.decks.length - G.tierToEnd}'.`);
        case ErrorNames.CurrentPublicPlayerIsUndefined:
            throw new Error(`В массиве публичных игроков отсутствует ${G.solo && ctx.currentPlayer === `1` ? `соло бот` : `текущий игрок`} с id '${errorArgs[0]}'.`);
        case ErrorNames.CurrentSuitDistinctionPlayerIndexIsUndefined:
            throw new Error(`Отсутствует игрок с максимальным количеством шевронов в фракции '${errorArgs[0]}'.`);
        case ErrorNames.CurrentTavernConfigIsUndefined:
            //+
            throw new Error(`Отсутствует конфиг текущей таверны с id '${errorArgs[0]}'.`);
        case ErrorNames.CurrentTavernIsUndefined:
            //+
            throw new Error(`В массиве таверн отсутствует текущая таверна с id '${errorArgs[0]}'.`);
        case ErrorNames.DeckIsUndefined:
            //+
            throw new Error(`В массиве колод карт отсутствует колода с id '${errorArgs[0]}'.`);
        case ErrorNames.DoNotDiscardCardFromCurrentTavernIfCardWithCurrentIdIsUndefined:
            //+
            throw new Error(`В текущей таверне с id '${errorArgs[0]}' отсутствует карта для сброса с id '${errorArgs[1]}'.`);
        case ErrorNames.DoNotDiscardCardFromCurrentTavernIfNoCardInTavern:
            //+
            throw new Error(`Не удалось сбросить лишнюю карту из текущей таверны с id '${errorArgs[0]}' из-за её отсутствия в таверне.`);
        case ErrorNames.DoNotDiscardCardFromTavernInSoloOrTwoPlayersGame:
            //+
            throw new Error(`Не удалось сбросить лишнюю карту из текущей таверны с id '${errorArgs[0]}' при игре ${G.solo ? `в соло режиме` : `на двух игроков`}.`);
        case ErrorNames.NoCardsToDiscardWhenNoWinnerInExplorerDistinction:
            //+
            throw new Error(`Отсутствует сбрасываемая карта из колоды с id '1' при отсутствии преимущества по фракции разведчиков.`);
        case ErrorNames.OnlyInSoloOrTwoPlayersGame:
            //+
            throw new Error(`Должно применяться только при игре в соло режиме или при наличии двух игроков в игре.`);
        case ErrorNames.PlayersCurrentSuitCardsMustHaveCardsForDistinction:
            //+
            throw new Error(`Должны быть карты во фракции '${errorArgs[0]}' хотя бы у одного игрока.`);
        case ErrorNames.PlayersCurrentSuitRanksArrayMustHavePlayerWithMostRankCount:
            //+
            throw new Error(`Должен быть хотя бы один игрок с максимальным количеством шевронов '${errorArgs[0]}' по фракции '${errorArgs[1]}'.`);
        case ErrorNames.PublicPlayerWithCurrentIdIsUndefined:
            throw new Error(`В массиве публичных игроков отсутствует ${G.solo && ctx.currentPlayer === `1` ? `соло бот` : ` игрок`} с id '${errorArgs[0]}'.`);
        case ErrorNames.SuitDistinctionMustBePresent:
            //+
            throw new Error(`Преимущество по фракции '${errorArgs[0]}' должно быть хотя бы у одного игрока.`);
        case ErrorNames.TavernCanNotBeRefilledBecauseNotEnoughCards:
            //+
            throw new Error(`Таверна с id '${errorArgs[0]}' не заполнена новыми картами из-за их нехватки в колоде.`);
        case ErrorNames.TavernConfigWithCurrentIdIsUndefined:
            //+
            throw new Error(`Отсутствует конфиг таверны с id '${errorArgs[0]}'.`);
        case ErrorNames.TavernWithCurrentIdIsUndefined:
            //+
            throw new Error(`В массиве таверн отсутствует таверна с id '${errorArgs[0]}'.`);
        default:
            // eslint-disable-next-line no-case-declarations
            const _exhaustiveCheck = error;
            throw new Error(`У ошибок отсутствует название '${error}'.`);
            return _exhaustiveCheck;
    }
};
//# sourceMappingURL=Error.js.map