import { CardTypeRusNames, ErrorNames, GameModeNames } from "./typescript/enums";
import type { ErrorArgsType, FnContext } from "./typescript/interfaces";

/**
 * <h3>Все возможные ошибки/исключения в игре.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при любой ошибке/исключении.</li>
 * </ol>
 *
 * @param context
 * @param error Ошибка.
 * @param errorArgs Аргументы действия.
 * @returns
 */
export const ThrowMyError = ({ G, ctx }: FnContext, error: ErrorNames, ...errorArgs: ErrorArgsType): never => {
    let _exhaustiveCheck: never;
    switch (error) {
        case ErrorNames.CanNotBeMoreThenTwoPlayersInSoloGameMode:
            throw new Error(`Не может быть игроков больше 2-х в соло игре${G.mode === GameModeNames.SoloAndvari ? ` Andvari` : ``}.`);
        case ErrorNames.CurrentMoveArgumentIsUndefined:
            throw new Error(`Отсутствует необходимый аргумент мува.`);
        case ErrorNames.CurrentTavernCardWithCurrentIdCanNotBeRoyalOfferingCard:
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может быть карта '${CardTypeRusNames.Royal_Offering_Card}' с id  '${errorArgs[0]}'`);
        case ErrorNames.CurrentTavernCardWithCurrentIdIsNull:
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карты с id '${errorArgs[0]}'`);
        case ErrorNames.CurrentTavernCardWithCurrentIdIsUndefined:
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${errorArgs[0]}'`);
        case ErrorNames.CurrentSuitDistinctionPlayerIndexIsUndefined:
            throw new Error(`Отсутствует игрок с максимальным количеством шевронов в фракции '${errorArgs[0]}'.`);
        case ErrorNames.DoNotDiscardCardFromCurrentTavernIfNoCardInTavern:
            throw new Error(`Не удалось сбросить лишнюю карту из текущей таверны с id '${errorArgs[0]}' из-за её отсутствия в таверне.`);
        case ErrorNames.FirstStackActionForPlayerWithCurrentIdIsUndefined:
            throw new Error(`В массиве стека действий ${errorArgs[0] === ctx.currentPlayer ? `текущий ` : ``}${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && errorArgs[0] === `1` ? `соло бота` : `игрока`} с id '${errorArgs[0]}' отсутствует '0' действие.`);
        case ErrorNames.FunctionMustHaveReturnValue:
            throw new Error(`Функция должна возвращать значение.`);
        case ErrorNames.FunctionParamIsUndefined:
            throw new Error(`Отсутствует необходимый параметр функции '${errorArgs[0]}'.`);
        case ErrorNames.NoAddedValidator:
            throw new Error(`Не добавлен валидатор.`);
        case ErrorNames.NoCardsToDiscardWhenNoWinnerInExplorerDistinction:
            throw new Error(`Отсутствует сбрасываемая карта из колоды с id '1' при отсутствии преимущества по фракции разведчиков.`);
        case ErrorNames.NoSuchGameMode:
            throw new Error(`Нет такого режима игры.`);
        case ErrorNames.NoSuchMove:
            throw new Error(`Нет такого мува.`);
        case ErrorNames.OnlyInSoloOrTwoPlayersGame:
            throw new Error(`Должно применяться только при игре в соло режиме или при наличии двух игроков в игре.`);
        case ErrorNames.PlayersCurrentSuitCardsMustHaveCardsForDistinction:
            throw new Error(`Должны быть карты во фракции '${errorArgs[0]}' хотя бы у одного игрока.`);
        case ErrorNames.PlayersCurrentSuitRanksArrayMustHavePlayerWithMostRankCount:
            throw new Error(`Должен быть хотя бы один игрок с максимальным количеством шевронов '${errorArgs[0]}' по фракции '${errorArgs[1]}'.`);
        case ErrorNames.PossibleMoveArgumentsIsUndefined:
            throw new Error(`Не заданы возможные аргумента мува.`);
        case ErrorNames.PrivatePlayerWithCurrentIdIsUndefined:
            throw new Error(`В массиве приватных игроков отсутствует ${errorArgs[0] === ctx.currentPlayer ? `текущий ` : ``}${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && errorArgs[0] === `1` ? `соло бот` : `игрок`} с id '${errorArgs[0]}'.`);
        case ErrorNames.PublicPlayerWithCurrentIdIsUndefined:
            throw new Error(`В массиве публичных игроков отсутствует ${errorArgs[0] === ctx.currentPlayer ? `текущий ` : ``}${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && errorArgs[0] === `1` ? `соло бот` : `игрок`} с id '${errorArgs[0]}'.`);
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
