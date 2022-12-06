import { ThrowMyError } from "../Error";
import { IsDwarfCard } from "../helpers/IsDwarfTypeHelpers";
import { ActivateGiantAbilityOrPickCardSubMoveValidatorNames, ButtonMoveNames, ButtonNames, CardMoveNames, ChooseDifficultySoloModeAndvariMoveValidatorNames, ChooseDifficultySoloModeMoveValidatorNames, ChooseDifficultySoloModeStageNames, CommonMoveValidatorNames, ErrorNames, RusCardTypeNames, RusSuitNames, SoloGameAndvariStrategyNames, SuitNames, TavernsResolutionMoveValidatorNames, TavernsResolutionStageNames, TroopEvaluationMoveValidatorNames, TroopEvaluationStageNames } from "../typescript/enums";
import { DrawButton, DrawCard } from "./ElementsUI";
/**
 * <h3>Отрисовка для выбора карты Дворфа или активации способности Гиганта.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Поле для выбора карты Дворфа или активации способности Гиганта.
 */
export const ActivateGiantAbilityOrPickCardProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    let moveMainArgs;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionIsUndefined, ctx.currentPlayer);
    }
    const card = stack.card;
    if (card === undefined) {
        throw new Error(`В стеке игрока отсутствует 'card'.`);
    }
    if (!IsDwarfCard(card)) {
        throw new Error(`В стеке игрока 'card' должен быть с типом '${RusCardTypeNames.Dwarf_Card}'.`);
    }
    for (let j = 0; j < 2; j++) {
        if (j === 0) {
            if (data !== undefined && boardCells !== undefined) {
                DrawCard(data, boardCells, card, j, player, card.suit, CardMoveNames.ClickCardNotGiantAbilityMove, card);
            }
            else if (validatorName ===
                ActivateGiantAbilityOrPickCardSubMoveValidatorNames.ClickCardNotGiantAbilityMoveValidator) {
                moveMainArgs = card;
            }
            else {
                throw new Error(`Не добавлен валидатор '${validatorName}'.`);
            }
        }
        else if (G.publicPlayersOrder.length > 1) {
            if (stack.giantName === undefined) {
                throw new Error(`В стеке игрока отсутствует 'giantName'.`);
            }
            const giant = player.mythologicalCreatureCards.find((card) => card.name === stack.giantName);
            if (giant === undefined) {
                throw new Error(`В массиве карт мифических существ игрока с id '${ctx.currentPlayer}' в командной зоне отсутствует карта Гиганта с названием '${stack.giantName}'.`);
            }
            if (data !== undefined && boardCells !== undefined) {
                DrawCard(data, boardCells, giant, j, player, null, CardMoveNames.ClickGiantAbilityNotCardMove, card);
            }
            else if (validatorName ===
                ActivateGiantAbilityOrPickCardSubMoveValidatorNames.ClickGiantAbilityNotCardMoveValidator) {
                moveMainArgs = card;
            }
            else {
                throw new Error(`Не добавлен валидатор '${validatorName}'.`);
            }
        }
    }
    if (validatorName !== null) {
        if (moveMainArgs === undefined) {
            throw new Error(`Не задан параметр аргумента мува.`);
        }
        return moveMainArgs;
    }
};
/**
 * <h3>Отрисовка для выбора карты Мифического существа при выборе Skymir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Поле для выбора карты Мифического существа при выборе Skymir.
 */
export const ChooseGetMythologyCardProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    var _a;
    const moveMainArgs = [];
    for (let i = 0; i < 1; i++) {
        if (G.mythologicalCreatureDeckForSkymir === null) {
            throw new Error(`Массив всех карт мифических существ для Skymir не может не быть заполнен картами.`);
        }
        for (let j = 0; j < G.mythologicalCreatureDeckForSkymir.length; j++) {
            const mythologicalCreature = G.mythologicalCreatureDeckForSkymir[j];
            if (mythologicalCreature === undefined) {
                throw new Error(`В массиве карт мифических существ для Skymir отсутствует мифическое существо с id '${j}'.`);
            }
            if (((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)])
                === TavernsResolutionStageNames.GetMythologyCard) {
                const player = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
                }
                if (data !== undefined && boardCells !== undefined) {
                    DrawCard(data, boardCells, mythologicalCreature, j, player, null, CardMoveNames.GetMythologyCardMove, j);
                }
                else if (validatorName === TavernsResolutionMoveValidatorNames.GetMythologyCardMoveValidator) {
                    moveMainArgs.push(j);
                }
                else {
                    throw new Error(`Не добавлен валидатор '${validatorName}'.`);
                }
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
/**
 * <h3>Отрисовка для выбора уровня сложности стратегий соло бота Андвари соло игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Поле для выбора уровня сложности стратегий соло бота Андвари соло игры.
 */
export const ChooseStrategyForSoloModeAndvariProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    const moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    for (let j = 0; j < 4; j++) {
        if (j === 0) {
            if (data !== undefined && boardCells !== undefined) {
                DrawButton(data, boardCells, ButtonNames.NoHeroEasyStrategy, player, ButtonMoveNames.ChooseStrategyForSoloModeAndvariMove, SoloGameAndvariStrategyNames.NoHeroEasyStrategy);
            }
            else if (validatorName ===
                ChooseDifficultySoloModeAndvariMoveValidatorNames.ChooseStrategyForSoloModeAndvariMoveValidator) {
                moveMainArgs.push(SoloGameAndvariStrategyNames.NoHeroEasyStrategy);
            }
            else {
                throw new Error(`Не добавлен валидатор '${validatorName}'.`);
            }
        }
        else if (j === 1) {
            if (data !== undefined && boardCells !== undefined) {
                DrawButton(data, boardCells, ButtonNames.NoHeroHardStrategy, player, ButtonMoveNames.ChooseStrategyForSoloModeAndvariMove, SoloGameAndvariStrategyNames.NoHeroHardStrategy);
            }
            else if (validatorName ===
                ChooseDifficultySoloModeAndvariMoveValidatorNames.ChooseStrategyForSoloModeAndvariMoveValidator) {
                moveMainArgs.push(SoloGameAndvariStrategyNames.NoHeroHardStrategy);
            }
            else {
                throw new Error(`Не добавлен валидатор '${validatorName}'.`);
            }
        }
        else if (j === 2) {
            if (data !== undefined && boardCells !== undefined) {
                DrawButton(data, boardCells, ButtonNames.WithHeroEasyStrategy, player, ButtonMoveNames.ChooseStrategyForSoloModeAndvariMove, SoloGameAndvariStrategyNames.WithHeroEasyStrategy);
            }
            else if (validatorName ===
                ChooseDifficultySoloModeAndvariMoveValidatorNames.ChooseStrategyForSoloModeAndvariMoveValidator) {
                moveMainArgs.push(SoloGameAndvariStrategyNames.WithHeroEasyStrategy);
            }
            else {
                throw new Error(`Не добавлен валидатор '${validatorName}'.`);
            }
        }
        else if (j === 3) {
            if (data !== undefined && boardCells !== undefined) {
                DrawButton(data, boardCells, ButtonNames.WithHeroHardStrategy, player, ButtonMoveNames.ChooseStrategyForSoloModeAndvariMove, SoloGameAndvariStrategyNames.WithHeroHardStrategy);
            }
            else if (validatorName ===
                ChooseDifficultySoloModeAndvariMoveValidatorNames.ChooseStrategyForSoloModeAndvariMoveValidator) {
                moveMainArgs.push(SoloGameAndvariStrategyNames.WithHeroHardStrategy);
            }
            else {
                throw new Error(`Не добавлен валидатор '${validatorName}'.`);
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
/**
 * <h3>Отрисовка для выбора варианта уровня сложности стратегий соло бота Андвари соло игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Поле для выбора варианта уровня сложности стратегий соло бота Андвари соло игры.
 */
export const ChooseStrategyVariantForSoloModeAndvariProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    const moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    for (let j = 0; j < 3; j++) {
        if (data !== undefined && boardCells !== undefined) {
            DrawButton(data, boardCells, String(j + 1), player, ButtonMoveNames.ChooseStrategyVariantForSoloModeAndvariMove, j + 1);
        }
        else if (validatorName ===
            ChooseDifficultySoloModeAndvariMoveValidatorNames.ChooseStrategyVariantForSoloModeAndvariMoveValidator) {
            moveMainArgs.push(j + 1);
        }
        else {
            throw new Error(`Не добавлен валидатор '${validatorName}'.`);
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
/**
 * <h3>Отрисовка для выбора уровня сложности соло игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Поле для выбора уровня сложности соло игры.
 */
export const ChooseDifficultyLevelForSoloModeProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    const moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < 6; j++) {
            if (data !== undefined && boardCells !== undefined) {
                DrawButton(data, boardCells, String(j + 1), player, ButtonMoveNames.ChooseDifficultyLevelForSoloModeMove, j + 1);
            }
            else if (validatorName ===
                ChooseDifficultySoloModeMoveValidatorNames.ChooseDifficultyLevelForSoloModeMoveValidator) {
                moveMainArgs.push(j);
            }
            else {
                throw new Error(`Не добавлен валидатор '${validatorName}'.`);
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
/**
 * <h3>Отрисовка поля для выбора значения улучшения монеты по артефакту 'Vidofnir Vedrfolnir'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Игровое поле для отрисовки выбора значения улучшения монеты по артефакту 'Vidofnir Vedrfolnir'.
 */
export const ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    const moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionIsUndefined, ctx.currentPlayer);
    }
    const values = stack.valueArray;
    if (values === undefined) {
        throw new Error(`У конфига действия игрока с id '${ctx.currentPlayer}' отсутствует обязательный параметр 'valueArray'.`);
    }
    for (let j = 0; j < values.length; j++) {
        const value = values[j];
        if (value === undefined) {
            throw new Error(`У конфига действия игрока с id '${ctx.currentPlayer}' в параметре 'valueArray' отсутствует значение параметра  id '${j}'.`);
        }
        if (data !== undefined && boardCells !== undefined) {
            DrawButton(data, boardCells, String(value), player, ButtonMoveNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMove, value);
        }
        else if (validatorName ===
            CommonMoveValidatorNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator) {
            moveMainArgs.push(value);
        }
        else {
            throw new Error(`Не добавлен валидатор '${validatorName}'.`);
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
/**
 * <h3>Отрисовка поля для получения профита по фракции разведчиков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Игровое поле для отрисовки получения профита по фракции разведчиков.
 */
export const ExplorerDistinctionProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    var _a;
    if (G.explorerDistinctionCards === null) {
        throw new Error(`В массиве карт для получения преимущества по фракции '${RusSuitNames.explorer}' не может не быть карт.`);
    }
    const moveMainArgs = [];
    for (let j = 0; j < G.explorerDistinctionCards.length; j++) {
        const card = G.explorerDistinctionCards[j];
        if (card === undefined) {
            throw new Error(`В массиве карт '2' эпохи отсутствует карта с id '${j}'.`);
        }
        let suit = null;
        if (card.type === RusCardTypeNames.Dwarf_Card) {
            suit = card.suit;
        }
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
        }
        if (data !== undefined && boardCells !== undefined) {
            // TODO StageNames => TroopEvaluationStageNames
            const stage = (_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)];
            let moveName;
            switch (stage) {
                case TroopEvaluationStageNames.ClickCardToPickDistinction:
                    moveName = CardMoveNames.ClickCardToPickDistinctionMove;
                    break;
                case TroopEvaluationStageNames.SoloBotClickCardToPickDistinction:
                    moveName = CardMoveNames.SoloBotClickCardToPickDistinctionMove;
                    break;
                case TroopEvaluationStageNames.SoloBotAndvariClickCardToPickDistinction:
                    moveName = CardMoveNames.SoloBotAndvariClickCardToPickDistinctionMove;
                    break;
                default:
                    throw new Error(`Нет такого мува.`);
            }
            DrawCard(data, boardCells, card, j, player, suit, moveName, j);
        }
        else if (validatorName === TroopEvaluationMoveValidatorNames.ClickCardToPickDistinctionMoveValidator
            || TroopEvaluationMoveValidatorNames.SoloBotClickCardToPickDistinctionMoveValidator
            || TroopEvaluationMoveValidatorNames.SoloBotAndvariClickCardToPickDistinctionMoveValidator) {
            moveMainArgs.push(j);
        }
        else {
            throw new Error(`Не добавлен валидатор '${validatorName}'.`);
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
/**
 * <h3>Отрисовка всех героев для выбора сложности соло игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Поле героев для выбора сложности соло игры.
 */
export const PickHeroesForSoloModeProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    var _a;
    const moveMainArgs = [];
    for (let i = 0; i < 1; i++) {
        if (G.heroesForSoloGameDifficultyLevel === null) {
            throw new Error(`Уровень сложности для соло игры не может быть ранее выбран.`);
        }
        for (let j = 0; j < G.heroesForSoloGameDifficultyLevel.length; j++) {
            const hero = G.heroesForSoloGameDifficultyLevel[j];
            if (hero === undefined) {
                throw new Error(`В массиве карт героев для выбора сложности соло игры отсутствует герой с id '${j}'.`);
            }
            if (hero.active && Number(ctx.currentPlayer) === 0
                && ((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)])
                    === ChooseDifficultySoloModeStageNames.ChooseHeroForDifficultySoloMode) {
                const player = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
                }
                if (data !== undefined && boardCells !== undefined) {
                    DrawCard(data, boardCells, hero, j, player, null, CardMoveNames.ChooseHeroForDifficultySoloModeMove, j);
                }
                else if (validatorName ===
                    ChooseDifficultySoloModeMoveValidatorNames.ChooseHeroForDifficultySoloModeMoveValidator) {
                    if (hero.active) {
                        moveMainArgs.push(j);
                    }
                }
                else {
                    throw new Error(`Не добавлен валидатор '${validatorName}'.`);
                }
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
/**
 * <h3>Отрисовка поля для старта фазы 'enlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Игровое поле для отрисовки старта фазы 'enlistmentMercenaries'.
 */
export const StartEnlistmentMercenariesProfit = ({ G, ctx, ...rest }, data, boardCells) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    for (let j = 0; j < 2; j++) {
        if (j === 0) {
            DrawButton(data, boardCells, ButtonNames.Start, player, ButtonMoveNames.StartEnlistmentMercenariesMove);
        }
        else if (G.publicPlayersOrder.length > 1) {
            DrawButton(data, boardCells, ButtonNames.Pass, player, ButtonMoveNames.PassEnlistmentMercenariesMove);
        }
    }
};
//# sourceMappingURL=ProfitUI.js.map