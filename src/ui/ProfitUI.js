import { ThrowMyError } from "../Error";
import { IsDwarfCard } from "../is_helpers/IsDwarfTypeHelpers";
import { ActivateGiantAbilityOrPickCardSubMoveValidatorNames, ActivateGodAbilityOrNotSubMoveValidatorNames, ButtonMoveNames, ButtonNames, CardMoveNames, CardTypeRusNames, ChooseDifficultySoloModeAndvariMoveValidatorNames, ChooseDifficultySoloModeMoveValidatorNames, ChooseDifficultySoloModeStageNames, CommonMoveValidatorNames, EnlistmentMercenariesMoveValidatorNames, ErrorNames, GiantNames, GodNames, SoloGameAndvariStrategyNames, SuitNames, SuitRusNames, TavernsResolutionMoveValidatorNames, TavernsResolutionStageNames, TroopEvaluationMoveValidatorNames, TroopEvaluationStageNames } from "../typescript/enums";
import { DrawButton, DrawCard } from "./ElementsUI";
// TODO Add common ProfitFunctionType to all function here with common args and different return type!?
/**
 * <h3>Отрисовка для выбора карты Дворфа или активации способности Гиганта.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Поле для выбора карты Дворфа или активации способности Гиганта.
 */
export const ActivateGiantAbilityOrPickCardProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    let moveMainArgs;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionForPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
    }
    const card = stack.card;
    if (card === undefined) {
        throw new Error(`В стеке игрока отсутствует 'card'.`);
    }
    if (!IsDwarfCard(card)) {
        throw new Error(`В стеке игрока 'card' должен быть с типом '${CardTypeRusNames.DwarfCard}'.`);
    }
    for (let j = 0; j < 2; j++) {
        if (j === 0) {
            if (data !== undefined && boardCells !== undefined) {
                DrawCard({ G, ctx, ...rest }, data, boardCells, card, j, player, card.playerSuit, CardMoveNames.ClickCardNotGiantAbilityMove, card);
            }
            else if (validatorName ===
                ActivateGiantAbilityOrPickCardSubMoveValidatorNames.ClickCardNotGiantAbilityMoveValidator) {
                moveMainArgs = card;
            }
            else {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
            }
        }
        else if (G.publicPlayersOrder.length > 1) {
            const giantName = stack.giantName;
            if (giantName === undefined) {
                throw new Error(`В стеке игрока отсутствует 'giantName'.`);
            }
            const giant = player.mythologicalCreatureCards.find((card) => card.name === giantName);
            if (giant === undefined) {
                throw new Error(`В массиве карт мифических существ игрока с id '${ctx.currentPlayer}' в командной зоне отсутствует карта '${CardTypeRusNames.GiantCard}' с названием '${giantName}'.`);
            }
            if (data !== undefined && boardCells !== undefined) {
                DrawCard({ G, ctx, ...rest }, data, boardCells, giant, j, player, null, CardMoveNames.ClickGiantAbilityNotCardMove, card);
            }
            else if (validatorName ===
                ActivateGiantAbilityOrPickCardSubMoveValidatorNames.ClickGiantAbilityNotCardMoveValidator) {
                moveMainArgs = card;
            }
            else {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
            }
        }
    }
    if (validatorName !== null) {
        if (moveMainArgs === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
        }
        return moveMainArgs;
    }
};
/**
 * <h3>Отрисовка для выбора активировать или нет способности Бога.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Поле для выбора активировать или нет способности Бога.
 */
export const ActivateGodAbilityOrNotProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], moveMainArgs = [];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionForPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
    }
    const godName = stack.godName;
    if (godName === undefined) {
        throw new Error(`В стеке игрока отсутствует 'godName'.`);
    }
    const god = player.mythologicalCreatureCards.find((card) => card.name === godName);
    if (god === undefined) {
        throw new Error(`В массиве карт мифических существ игрока с id '${ctx.currentPlayer}' в командной зоне отсутствует карта '${CardTypeRusNames.GodCard}' с названием '${godName}'.`);
    }
    for (let j = 0; j < 2; j++) {
        if (j === 0) {
            if (data !== undefined && boardCells !== undefined) {
                DrawCard({ G, ctx, ...rest }, data, boardCells, god, j, player, null, CardMoveNames.ActivateGodAbilityMove, godName);
            }
            else if (validatorName ===
                ActivateGodAbilityOrNotSubMoveValidatorNames.ActivateGodAbilityMoveValidator) {
                moveMainArgs.push(godName);
            }
            else {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
            }
        }
        else {
            if (data !== undefined && boardCells !== undefined) {
                DrawButton({ G, ctx, ...rest }, data, boardCells, ButtonNames.NotActivateGodAbility, player, ButtonMoveNames.NotActivateGodAbilityMove, godName);
            }
            else if (validatorName ===
                ActivateGodAbilityOrNotSubMoveValidatorNames.NotActivateGodAbilityMoveValidator) {
                moveMainArgs.push(godName);
            }
            else {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
            }
        }
    }
    if (validatorName !== null) {
        if (moveMainArgs === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
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
 * @param context
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
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
                }
                if (data !== undefined && boardCells !== undefined) {
                    DrawCard({ G, ctx, ...rest }, data, boardCells, mythologicalCreature, j, player, null, CardMoveNames.GetMythologyCardMove, j);
                }
                else if (validatorName === TavernsResolutionMoveValidatorNames.GetMythologyCardMoveValidator) {
                    moveMainArgs.push(j);
                }
                else {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
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
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Поле для выбора уровня сложности стратегий соло бота Андвари соло игры.
 */
export const ChooseStrategyForSoloModeAndvariProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    const moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
    }
    for (let j = 0; j < 4; j++) {
        if (j === 0) {
            if (data !== undefined && boardCells !== undefined) {
                DrawButton({ G, ctx, ...rest }, data, boardCells, ButtonNames.NoHeroEasyStrategy, player, ButtonMoveNames.ChooseStrategyForSoloModeAndvariMove, SoloGameAndvariStrategyNames.NoHeroEasyStrategy);
            }
            else if (validatorName ===
                ChooseDifficultySoloModeAndvariMoveValidatorNames.ChooseStrategyForSoloModeAndvariMoveValidator) {
                moveMainArgs.push(SoloGameAndvariStrategyNames.NoHeroEasyStrategy);
            }
            else {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
            }
        }
        else if (j === 1) {
            if (data !== undefined && boardCells !== undefined) {
                DrawButton({ G, ctx, ...rest }, data, boardCells, ButtonNames.NoHeroHardStrategy, player, ButtonMoveNames.ChooseStrategyForSoloModeAndvariMove, SoloGameAndvariStrategyNames.NoHeroHardStrategy);
            }
            else if (validatorName ===
                ChooseDifficultySoloModeAndvariMoveValidatorNames.ChooseStrategyForSoloModeAndvariMoveValidator) {
                moveMainArgs.push(SoloGameAndvariStrategyNames.NoHeroHardStrategy);
            }
            else {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
            }
        }
        else if (j === 2) {
            if (data !== undefined && boardCells !== undefined) {
                DrawButton({ G, ctx, ...rest }, data, boardCells, ButtonNames.WithHeroEasyStrategy, player, ButtonMoveNames.ChooseStrategyForSoloModeAndvariMove, SoloGameAndvariStrategyNames.WithHeroEasyStrategy);
            }
            else if (validatorName ===
                ChooseDifficultySoloModeAndvariMoveValidatorNames.ChooseStrategyForSoloModeAndvariMoveValidator) {
                moveMainArgs.push(SoloGameAndvariStrategyNames.WithHeroEasyStrategy);
            }
            else {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
            }
        }
        else if (j === 3) {
            if (data !== undefined && boardCells !== undefined) {
                DrawButton({ G, ctx, ...rest }, data, boardCells, ButtonNames.WithHeroHardStrategy, player, ButtonMoveNames.ChooseStrategyForSoloModeAndvariMove, SoloGameAndvariStrategyNames.WithHeroHardStrategy);
            }
            else if (validatorName ===
                ChooseDifficultySoloModeAndvariMoveValidatorNames.ChooseStrategyForSoloModeAndvariMoveValidator) {
                moveMainArgs.push(SoloGameAndvariStrategyNames.WithHeroHardStrategy);
            }
            else {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
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
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Поле для выбора варианта уровня сложности стратегий соло бота Андвари соло игры.
 */
export const ChooseStrategyVariantForSoloModeAndvariProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    const moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
    }
    for (let j = 0; j < 3; j++) {
        if (data !== undefined && boardCells !== undefined) {
            DrawButton({ G, ctx, ...rest }, data, boardCells, String(j + 1), player, ButtonMoveNames.ChooseStrategyVariantForSoloModeAndvariMove, j + 1);
        }
        else if (validatorName ===
            ChooseDifficultySoloModeAndvariMoveValidatorNames.ChooseStrategyVariantForSoloModeAndvariMoveValidator) {
            moveMainArgs.push(j + 1);
        }
        else {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
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
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Поле для выбора уровня сложности соло игры.
 */
export const ChooseDifficultyLevelForSoloModeProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    const moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
    }
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < 6; j++) {
            if (data !== undefined && boardCells !== undefined) {
                DrawButton({ G, ctx, ...rest }, data, boardCells, String(j + 1), player, ButtonMoveNames.ChooseDifficultyLevelForSoloModeMove, j + 1);
            }
            else if (validatorName ===
                ChooseDifficultySoloModeMoveValidatorNames.ChooseDifficultyLevelForSoloModeMoveValidator) {
                moveMainArgs.push(j);
            }
            else {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
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
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Игровое поле для отрисовки выбора значения улучшения монеты по артефакту 'Vidofnir Vedrfolnir'.
 */
export const ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    const moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionForPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
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
            DrawButton({ G, ctx, ...rest }, data, boardCells, String(value), player, ButtonMoveNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMove, value);
        }
        else if (validatorName ===
            CommonMoveValidatorNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator) {
            moveMainArgs.push(value);
        }
        else {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
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
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Игровое поле для отрисовки получения профита по фракции разведчиков.
 */
export const ExplorerDistinctionProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    var _a;
    if (G.explorerDistinctionCards === null) {
        throw new Error(`В массиве карт для получения преимущества по фракции '${SuitRusNames.explorer}' не может не быть карт.`);
    }
    const moveMainArgs = [];
    for (let j = 0; j < G.explorerDistinctionCards.length; j++) {
        const card = G.explorerDistinctionCards[j];
        if (card === undefined) {
            throw new Error(`В массиве карт '2' эпохи отсутствует карта с id '${j}'.`);
        }
        let suit = null;
        if (card.type === CardTypeRusNames.DwarfCard) {
            suit = card.playerSuit;
        }
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
        }
        if (data !== undefined && boardCells !== undefined) {
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
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
            }
            DrawCard({ G, ctx, ...rest }, data, boardCells, card, j, player, suit, moveName, j);
        }
        else if (validatorName === TroopEvaluationMoveValidatorNames.ClickCardToPickDistinctionMoveValidator
            || TroopEvaluationMoveValidatorNames.SoloBotClickCardToPickDistinctionMoveValidator
            || TroopEvaluationMoveValidatorNames.SoloBotAndvariClickCardToPickDistinctionMoveValidator) {
            moveMainArgs.push(j);
        }
        else {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
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
 * @param context
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
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
                }
                if (data !== undefined && boardCells !== undefined) {
                    DrawCard({ G, ctx, ...rest }, data, boardCells, hero, j, player, null, CardMoveNames.ChooseHeroForDifficultySoloModeMove, j);
                }
                else if (validatorName ===
                    ChooseDifficultySoloModeMoveValidatorNames.ChooseHeroForDifficultySoloModeMoveValidator) {
                    if (hero.active) {
                        moveMainArgs.push(j);
                    }
                }
                else {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
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
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Игровое поле для отрисовки старта фазы 'enlistmentMercenaries'.
 */
export const StartOrPassEnlistmentMercenariesProfit = ({ G, ctx, ...rest }, validatorName, data, boardCells) => {
    let moveMainArgs;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
    }
    for (let j = 0; j < 2; j++) {
        if (j === 0) {
            if (data !== undefined && boardCells !== undefined) {
                DrawButton({ G, ctx, ...rest }, data, boardCells, ButtonNames.Start, player, ButtonMoveNames.StartEnlistmentMercenariesMove, null);
            }
            else if (validatorName ===
                EnlistmentMercenariesMoveValidatorNames.StartEnlistmentMercenariesMoveValidator) {
                moveMainArgs = null;
            }
            else {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
            }
        }
        else if (G.publicPlayersOrder.length > 1) {
            if (data !== undefined && boardCells !== undefined) {
                DrawButton({ G, ctx, ...rest }, data, boardCells, ButtonNames.Pass, player, ButtonMoveNames.PassEnlistmentMercenariesMove, null);
            }
            else if (validatorName ===
                EnlistmentMercenariesMoveValidatorNames.PassEnlistmentMercenariesMoveValidator) {
                moveMainArgs = null;
            }
            else {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
//# sourceMappingURL=ProfitUI.js.map