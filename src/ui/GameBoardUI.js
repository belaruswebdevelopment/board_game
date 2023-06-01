import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CountRoyalCoins } from "../Coin";
import { ALlStyles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { DrawBoard } from "../helpers/DrawHelpers";
import { AssertAllHeroesForSoloBotPossibleCardId, AssertCampIndex, AssertGeneralStrategyForSoloBotAndvariId, AssertRoyalCoinsUniqueArrayIndex, AssertTavernIndex, AssertTierIndex } from "../is_helpers/AssertionTypeHelpers";
import { tavernsConfig } from "../Tavern";
import { CardMoveNames, CardTypeRusNames, CoinCssClassNames, CommonMoveValidatorNames, CommonStageNames, ConfigNames, DistinctionCardMoveNames, DrawCoinTypeNames, ErrorNames, GameModeNames, PhaseNames, PhaseRusNames, PlayerIdForSoloGameNames, SoloBotAndvariCommonMoveValidatorNames, SoloBotAndvariCommonStageNames, SoloBotCommonMoveValidatorNames, SoloBotCommonStageNames, StageRusNames, TavernsResolutionMoveValidatorNames, TavernsResolutionStageNames, TroopEvaluationMoveValidatorNames } from "../typescript/enums";
import { DrawCard, DrawCoin, DrawDistinctionCard, DrawSuit } from "./ElementsUI";
import { ActivateGiantAbilityOrPickCardProfit, ActivateGodAbilityOrNotProfit, ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit, ChooseDifficultyLevelForSoloModeProfit, ChooseGetMythologyCardProfit, ChooseStrategyForSoloModeAndvariProfit, ChooseStrategyVariantForSoloModeAndvariProfit, ExplorerDistinctionProfit, PickHeroesForSoloModeProfit, StartOrPassEnlistmentMercenariesProfit } from "./ProfitUI";
// TODO Check Solo Bot & multiplayer actions!
/**
 * <h3>Отрисовка карт лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле лагеря | данные для списка доступных аргументов мува.
 */
export const DrawCamp = ({ G, ctx, ...rest }, validatorName, data) => {
    var _a, _b, _c;
    const boardCells = [], moveMainArgs = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < G.campNum; j++) {
            AssertCampIndex(j);
            const campCard = G.camp[j];
            if (campCard === null) {
                if (data !== undefined) {
                    boardCells.push(_jsx("td", { className: "bg-yellow-200", children: _jsx("span", { style: ALlStyles.Camp(), className: "bg-camp-icon" }) }, `Camp ${j} icon`));
                }
            }
            else {
                const player = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
                }
                let suit = null;
                if (campCard.type === CardTypeRusNames.ArtefactCard) {
                    suit = campCard.playerSuit;
                }
                if ((ctx.phase === PhaseNames.TavernsResolution && ctx.activePlayers === null)
                    || (((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) ===
                        CommonStageNames.ClickCampCardHolda)) {
                    if (data !== undefined) {
                        const stage = (_b = ctx.activePlayers) === null || _b === void 0 ? void 0 : _b[Number(ctx.currentPlayer)];
                        let moveName;
                        switch (stage) {
                            case CommonStageNames.ClickCampCardHolda:
                                moveName = CardMoveNames.ClickCampCardHoldaMove;
                                break;
                            case undefined:
                                if (ctx.activePlayers === null) {
                                    moveName = CardMoveNames.ClickCampCardMove;
                                    break;
                                }
                                else {
                                    throw new Error(`Не может не быть доступного мува.`);
                                }
                            default:
                                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
                        }
                        DrawCard({ G, ctx, ...rest }, data, boardCells, campCard, j, player, suit, moveName, j);
                    }
                    else if (validatorName === TavernsResolutionMoveValidatorNames.ClickCampCardMoveValidator
                        || validatorName === CommonMoveValidatorNames.ClickCampCardHoldaMoveValidator) {
                        moveMainArgs.push(j);
                    }
                    else {
                        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                    }
                }
                else {
                    if (data !== undefined) {
                        DrawCard({ G, ctx, ...rest }, data, boardCells, campCard, j, player, suit);
                    }
                }
            }
        }
    }
    if (data !== undefined) {
        const currentTier = G.campDecksLength.length - G.tierToEnd;
        AssertTierIndex(currentTier);
        const tier = G.campDecksLength.length - G.tierToEnd + 1 > G.campDecksLength.length ?
            1 : currentTier;
        return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: ALlStyles.Camp(), className: "bg-top-camp-icon" }), _jsxs("span", { children: [_jsx("span", { style: ALlStyles.CampBack(tier), className: "bg-top-card-back-icon" }), "Camp (", (_c = G.campDecksLength[G.campDecksLength.length - G.tierToEnd]) !== null && _c !== void 0 ? _c : 0, (G.campDecksLength.length - G.tierToEnd === 0 ? `/` +
                                    (G.campDecksLength[0] + G.campDecksLength[1]) : ``), " cards)"] })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }));
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionMustHaveReturnValue);
    }
};
/**
 * <h3>Отрисовка фазы и стадии игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка фазы и стадии игры на игровом поле.</li>
 * </ol>
 *
 * @param context
 * @returns Поле информации о текущей фазе и стадии игры.
 */
export const DrawCurrentPhaseStage = ({ ctx }) => {
    var _a, _b;
    const stage = (_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)], stageText = stage !== undefined ? StageRusNames[stage] : `none`;
    return (_jsxs("b", { children: ["Phase: ", _jsx("span", { className: "italic", children: (_b = PhaseRusNames[ctx.phase]) !== null && _b !== void 0 ? _b : `none` }), "(Stage: ", _jsx("span", { className: "italic", children: stageText }), ")"] }));
};
/**
 * <h3>Отрисовка игровой информации о текущем игроке и текущем ходе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @returns Поле информации о текущем ходу.
 */
export const DrawCurrentPlayerTurn = ({ ctx }) => (_jsxs("b", { children: [_jsxs("span", { className: "italic", children: ["Player ", Number(ctx.currentPlayer) + 1] }), " | Turn: ", _jsx("span", { className: "italic", children: ctx.turn })] }));
/**
 * <h3>Отрисовка преимуществ по фракциям в конце эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле преимуществ в конце эпохи.
 */
export const DrawDistinctions = ({ G, ctx, ...rest }, validatorName, data) => {
    const boardCells = [], moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
    }
    for (let i = 0; i < 1; i++) {
        let suit, currentDistinctionSuit;
        for (suit in G.distinctions) {
            if (G.distinctions[suit] !== undefined) {
                currentDistinctionSuit = suit;
                break;
            }
        }
        for (suit in suitsConfig) {
            if (ctx.phase === PhaseNames.TroopEvaluation && ctx.activePlayers === null
                && G.distinctions[suit] === ctx.currentPlayer && currentDistinctionSuit === suit) {
                if (data !== undefined) {
                    DrawDistinctionCard({ G, ctx, ...rest }, data, boardCells, player, suit, DistinctionCardMoveNames.ClickDistinctionCardMove, suit);
                }
                else if (validatorName === TroopEvaluationMoveValidatorNames.ClickDistinctionCardMoveValidator) {
                    moveMainArgs.push(suit);
                }
                else {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                }
            }
            else {
                if (data !== undefined) {
                    DrawDistinctionCard({ G, ctx, ...rest }, data, boardCells, null, suit);
                }
            }
        }
    }
    if (data !== undefined) {
        return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: ALlStyles.DistinctionsBack(), className: "bg-top-distinctions-icon" }), _jsx("span", { children: "Distinctions" })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }));
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionMustHaveReturnValue);
    }
};
/**
 * <h3>Отрисовка колоды сброса карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле колоды сброса карт.
 */
export const DrawDiscardedCards = ({ G, ctx, ...rest }, validatorName, data) => {
    var _a;
    const boardCells = [], moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
    }
    for (let j = 0; j < G.discardCardsDeck.length; j++) {
        const card = G.discardCardsDeck[j];
        if (card === undefined) {
            throw new Error(`В массиве колоды сброса карт отсутствует карта с id '${j}'.`);
        }
        let suit = null;
        if (card.type === CardTypeRusNames.DwarfCard) {
            suit = card.playerSuit;
        }
        else if (card.type === CardTypeRusNames.DwarfPlayerCard) {
            suit = card.suit;
        }
        if (((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) === CommonStageNames.PickDiscardCard) {
            if (data !== undefined) {
                DrawCard({ G, ctx, ...rest }, data, boardCells, card, j, player, suit, CardMoveNames.PickDiscardCardMove, j);
            }
            else if (validatorName === CommonMoveValidatorNames.PickDiscardCardMoveValidator) {
                moveMainArgs.push(j);
            }
            else {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
            }
        }
        else {
            if (data !== undefined) {
                DrawCard({ G, ctx, ...rest }, data, boardCells, card, j, null, suit);
            }
        }
    }
    if (data !== undefined) {
        return (_jsxs("table", { children: [_jsxs("caption", { className: "whitespace-nowrap", children: [_jsx("span", { style: ALlStyles.CardBack(0), className: "bg-top-card-back-icon" }), _jsx("span", { style: ALlStyles.CardBack(1), className: "bg-top-card-back-icon" }), _jsxs("span", { children: ["Discard cards (", G.discardCardsDeck.length, " cards)"] })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }));
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionMustHaveReturnValue);
    }
};
/**
 * <h3>Отрисовка всех героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле героев.
 */
export const DrawHeroes = ({ G, ctx, ...rest }, validatorName, data) => {
    var _a, _b;
    const boardRows = [], drawData = DrawBoard(G.heroes.length), moveMainArgs = [];
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j, hero = G.heroes[increment];
            if (hero === undefined) {
                throw new Error(`В массиве карт героев отсутствует герой с id '${increment}'.`);
            }
            const suit = hero.playerSuit;
            if (hero.active
                && ((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) === CommonStageNames.ClickHeroCard) {
                const player = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
                }
                if (data !== undefined) {
                    const stage = (_b = ctx.activePlayers) === null || _b === void 0 ? void 0 : _b[Number(ctx.currentPlayer)];
                    let moveName;
                    switch (stage) {
                        case CommonStageNames.ClickHeroCard:
                            moveName = CardMoveNames.ClickHeroCardMove;
                            break;
                        case SoloBotAndvariCommonStageNames.SoloBotAndvariClickHeroCard:
                            moveName = CardMoveNames.SoloBotAndvariClickHeroCardMove;
                            break;
                        default:
                            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
                    }
                    DrawCard({ G, ctx, ...rest }, data, boardCells, hero, increment, player, suit, moveName, increment);
                }
                else if ((validatorName === CommonMoveValidatorNames.ClickHeroCardMoveValidator
                    || validatorName ===
                        SoloBotAndvariCommonMoveValidatorNames.SoloBotAndvariClickHeroCardMoveValidator) && hero.active) {
                    moveMainArgs.push(increment);
                }
                else {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                }
            }
            else {
                if (data !== undefined) {
                    DrawCard({ G, ctx, ...rest }, data, boardCells, hero, increment, null, suit);
                }
            }
            if (increment + 1 === G.heroes.length) {
                break;
            }
        }
        if (data !== undefined) {
            boardRows.push(_jsx("tr", { children: boardCells }, `Heroes row ${i}`));
        }
    }
    if (data !== undefined) {
        return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: ALlStyles.HeroBack(), className: "bg-top-hero-icon" }), _jsxs("span", { children: ["Heroes (", G.heroes.length, " cards)"] })] }), _jsx("tbody", { children: boardRows })] }));
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionMustHaveReturnValue);
    }
};
/**
 * <h3>Отрисовка всех героев для выбора соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле героев для соло бота.
 */
export const DrawHeroesForSoloBotUI = ({ G, ctx, ...rest }, validatorName, data) => {
    var _a;
    if (G.heroesForSoloBot === null) {
        throw new Error(`В массиве карт героев для соло бота не может не быть героев.`);
    }
    const boardCells = [], moveMainArgs = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < G.heroesForSoloBot.length; j++) {
            AssertAllHeroesForSoloBotPossibleCardId(j);
            const hero = G.heroesForSoloBot[j];
            if (hero === undefined) {
                throw new Error(`Не существует кликнутая карта героя для соло бота с id '${j}'.`);
            }
            if (hero.active && Number(ctx.currentPlayer) === 1
                && ((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) ===
                    SoloBotCommonStageNames.SoloBotClickHeroCard) {
                const player = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
                }
                if (data !== undefined) {
                    DrawCard({ G, ctx, ...rest }, data, boardCells, hero, j, player, null, CardMoveNames.SoloBotClickHeroCardMove, j);
                }
                else if (validatorName === SoloBotCommonMoveValidatorNames.SoloBotClickHeroCardMoveValidator) {
                    if (hero.active) {
                        moveMainArgs.push(j);
                    }
                }
                else {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                }
            }
            else {
                if (data !== undefined) {
                    DrawCard({ G, ctx, ...rest }, data, boardCells, hero, j, null, null);
                }
            }
        }
    }
    if (data !== undefined) {
        return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: ALlStyles.HeroBack(), className: "bg-top-hero-icon" }), _jsxs("span", { children: ["Bot heroes (", G.heroesForSoloBot.length, " cards)"] })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }, `Heroes row 0`) })] }));
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionMustHaveReturnValue);
    }
};
/**
 * <h3>Отрисовка рынка монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param data Глобальные параметры.
 * @returns Поле рынка монет.
 */
export const DrawMarketCoins = ({ G, ctx, ...rest }, data) => {
    const boardRows = [], drawData = DrawBoard(G.royalCoinsUnique.length), countMarketCoins = CountRoyalCoins({ G, ctx, ...rest });
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j;
            AssertRoyalCoinsUniqueArrayIndex(increment);
            const royalCoin = G.royalCoinsUnique[increment], tempCoinValue = royalCoin.value, coinClassName = countMarketCoins[tempCoinValue] === 0
                ? CoinCssClassNames.NoAvailableMarketCoin : CoinCssClassNames.AvailableMarketCoin;
            DrawCoin({ G, ctx, ...rest }, data, boardCells, DrawCoinTypeNames.Market, royalCoin, increment, null, coinClassName, countMarketCoins[tempCoinValue]);
            if (increment + 1 === G.royalCoinsUnique.length) {
                break;
            }
        }
        boardRows.push(_jsx("tr", { children: boardCells }, `Market coins row ${i}`));
    }
    return (_jsxs("table", { children: [_jsx("caption", { children: _jsxs("span", { className: "block", children: [_jsx("span", { style: ALlStyles.Exchange(), className: "bg-top-market-coin-icon" }), "Market coins (", G.royalCoins.length, " coins)"] }) }), _jsx("tbody", { children: boardRows })] }));
};
/**
 * <h3>Отрисовка профита от карт и героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param data Глобальные параметры.
 * @returns Поле профита.
 */
export const DrawProfit = ({ G, ctx, ...rest }, data) => {
    const boardCells = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
    }
    const option = G.drawProfit;
    let caption = ``, _exhaustiveCheck;
    switch (option) {
        case ConfigNames.ActivateGiantAbilityOrPickCard:
            caption += `Activate Giant ability or pick dwarf card.`;
            ActivateGiantAbilityOrPickCardProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case ConfigNames.ActivateGodAbilityOrNot:
            caption += `Activate God ability or not.`;
            ActivateGodAbilityOrNotProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case ConfigNames.ChooseGetMythologyCard:
            caption += `Get Mythology card.`;
            ChooseGetMythologyCardProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade:
            caption += `Get value of coin upgrade.`;
            ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case ConfigNames.ExplorerDistinction:
            caption += `Get one card to your board.`;
            ExplorerDistinctionProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case ConfigNames.GetDifficultyLevelForSoloMode:
            caption += `Get difficulty level for Solo mode.`;
            ChooseDifficultyLevelForSoloModeProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case ConfigNames.ChooseStrategyLevelForSoloModeAndvari:
            caption += `Get strategy level for Solo mode Andvari.`;
            ChooseStrategyForSoloModeAndvariProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case ConfigNames.ChooseStrategyVariantLevelForSoloModeAndvari:
            caption += `Get strategy variant level for Solo mode Andvari.`;
            ChooseStrategyVariantForSoloModeAndvariProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case ConfigNames.GetHeroesForSoloMode:
            caption += `Get ${G.soloGameDifficultyLevel} hero${G.soloGameDifficultyLevel === 1 ? `` : `es`} to Solo Bot.`;
            PickHeroesForSoloModeProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case ConfigNames.StartOrPassEnlistmentMercenaries:
            caption = `Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.`;
            StartOrPassEnlistmentMercenariesProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case null:
            throw new Error(`Не задан обязательный параметр '${option}'.`);
        default:
            _exhaustiveCheck = option;
            throw new Error(`Не существует обязательный параметр 'drawProfit'.`);
            return _exhaustiveCheck;
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: ALlStyles.DistinctionsBack(), className: "bg-top-distinctions-icon" }), _jsx("span", { children: caption })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }));
};
/**
 * <h3>Отрисовка стратегий соло бота Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param data Глобальные параметры.
 * @returns Поле стратегий соло бота Андвари.
 */
export const DrawStrategyForSoloBotAndvariUI = ({ G, ctx, ...rest }, data) => {
    if (G.soloGameAndvariStrategyVariantLevel === null) {
        throw new Error(`Не задан вариант уровня сложности для стратегий соло бота Андвари в соло игре.`);
    }
    const playerHeadersGeneral = [], playerHeadersReserve = [];
    if (G.strategyForSoloBotAndvari === null) {
        throw new Error(`В объекте стратегий для соло бота Андвари не может не быть фракций.`);
    }
    for (let i = 0; i < G.soloGameAndvariStrategyVariantLevel; i++) {
        AssertGeneralStrategyForSoloBotAndvariId(i);
        const suit = G.strategyForSoloBotAndvari.general[i];
        if (suit === undefined) {
            throw new Error(`В объекте общих стратегий соло бота Андвари отсутствует фракция с id '${i}'.`);
        }
        if (suit === null) {
            throw new Error(`В объекте общих стратегий соло бота Андвари не задана фракция с id '${i}'.`);
        }
        DrawSuit({ G, ctx, ...rest }, data, playerHeadersGeneral, suit);
    }
    for (let i = G.soloGameAndvariStrategyVariantLevel; i < 5; i++) {
        const suit = G.strategyForSoloBotAndvari.reserve[i];
        if (suit === undefined) {
            throw new Error(`В объекте резервных стратегий соло бота Андвари отсутствует фракция с id '${i}'.`);
        }
        if (suit === null) {
            throw new Error(`В объекте резервных стратегий соло бота Андвари не задана фракция с id '${i}'.`);
        }
        DrawSuit({ G, ctx, ...rest }, data, playerHeadersReserve, suit);
    }
    // TODO Add different colors or dividers for different strategies and draw their names!
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: ALlStyles.HeroBack(), className: "bg-top-hero-icon" }), _jsx("span", { children: "Bot strategy" })] }), _jsxs("tbody", { children: [_jsx("tr", { children: playerHeadersGeneral }, `Strategy general`), _jsx("tr", { children: playerHeadersReserve }, `Strategy reserve`)] })] }));
};
/**
 * <h3>Отрисовка карт таверн.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param gridClass Класс для отрисовки таверны.
 * @returns Поле таверн.
 */
export const DrawTaverns = ({ G, ctx, ...rest }, validatorName, data, gridClass) => {
    var _a, _b;
    const tavernsBoards = [], moveMainArgs = [];
    for (let t = 0; t < G.tavernsNum; t++) {
        AssertTavernIndex(t);
        const currentTavernConfig = tavernsConfig[t];
        for (let i = 0; i < 1; i++) {
            const boardCells = [];
            for (let j = 0; j < G.drawSize; j++) {
                const tavern = G.taverns[t], tavernCard = tavern[j];
                if (G.round !== -1 && tavernCard === undefined) {
                    throw new Error(`В массиве карт таверны с id '${t}' отсутствует карта с id '${j}'.`);
                }
                if (tavernCard === undefined || tavernCard === null) {
                    if (data !== undefined) {
                        boardCells.push(_jsx("td", { children: _jsx("span", { style: ALlStyles.Tavern(t), className: "bg-tavern-icon" }) }, `${currentTavernConfig.name} ${j}`));
                    }
                }
                else {
                    let suit = null;
                    if (`playerSuit` in tavernCard) {
                        suit = tavernCard.playerSuit;
                    }
                    const player = G.publicPlayers[Number(ctx.currentPlayer)];
                    if (player === undefined) {
                        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
                    }
                    if (t === G.currentTavern && ctx.phase === PhaseNames.TavernsResolution
                        && ((ctx.activePlayers === null)
                            || (((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)])
                                === TavernsResolutionStageNames.DiscardCard2Players))) {
                        if (data !== undefined) {
                            const stage = (_b = ctx.activePlayers) === null || _b === void 0 ? void 0 : _b[Number(ctx.currentPlayer)];
                            let moveName, _exhaustiveCheck;
                            switch (stage) {
                                case TavernsResolutionStageNames.DiscardCard2Players:
                                    moveName = CardMoveNames.DiscardCard2PlayersMove;
                                    break;
                                case undefined:
                                    if (ctx.activePlayers === null) {
                                        switch (G.mode) {
                                            case GameModeNames.Basic:
                                            case GameModeNames.Multiplayer:
                                                moveName = CardMoveNames.ClickCardMove;
                                                break;
                                            case GameModeNames.Solo:
                                                if (ctx.currentPlayer === PlayerIdForSoloGameNames.HumanPlayerId) {
                                                    moveName = CardMoveNames.ClickCardMove;
                                                }
                                                else if (ctx.currentPlayer ===
                                                    PlayerIdForSoloGameNames.SoloBotPlayerId) {
                                                    moveName = CardMoveNames.SoloBotClickCardMove;
                                                }
                                                else {
                                                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CanNotBeMoreThenTwoPlayersInSoloGameMode);
                                                }
                                                break;
                                            case GameModeNames.SoloAndvari:
                                                if (ctx.currentPlayer === PlayerIdForSoloGameNames.HumanPlayerId) {
                                                    moveName = CardMoveNames.ClickCardMove;
                                                }
                                                else if (ctx.currentPlayer ===
                                                    PlayerIdForSoloGameNames.SoloBotPlayerId) {
                                                    moveName = CardMoveNames.SoloBotAndvariClickCardMove;
                                                }
                                                else {
                                                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CanNotBeMoreThenTwoPlayersInSoloGameMode);
                                                }
                                                break;
                                            default:
                                                _exhaustiveCheck = G.mode;
                                                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchGameMode);
                                                return _exhaustiveCheck;
                                        }
                                    }
                                    else {
                                        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
                                    }
                                    break;
                                default:
                                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
                            }
                            DrawCard({ G, ctx, ...rest }, data, boardCells, tavernCard, j, player, suit, moveName, j);
                        }
                        else if (validatorName === TavernsResolutionMoveValidatorNames.ClickCardMoveValidator
                            || validatorName === TavernsResolutionMoveValidatorNames.SoloBotClickCardMoveValidator
                            || validatorName ===
                                TavernsResolutionMoveValidatorNames.SoloBotAndvariClickCardMoveValidator
                            || validatorName === TavernsResolutionMoveValidatorNames.DiscardCard2PlayersMoveValidator) {
                            moveMainArgs.push(j);
                        }
                        else {
                            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                        }
                    }
                    else {
                        if (data !== undefined) {
                            DrawCard({ G, ctx, ...rest }, data, boardCells, tavernCard, j, null, suit);
                        }
                    }
                }
            }
            if (data !== undefined) {
                tavernsBoards.push(_jsxs("table", { className: `${gridClass} justify-self-center`, children: [_jsxs("caption", { className: "whitespace-nowrap", children: [_jsx("span", { style: ALlStyles.Tavern(t), className: "bg-top-tavern-icon" }), _jsx("b", { children: currentTavernConfig.name })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }, `Tavern ${currentTavernConfig.name} board`));
            }
        }
    }
    if (data !== undefined) {
        return tavernsBoards;
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionMustHaveReturnValue);
    }
};
/**
 * <h3>Отрисовка игровой информации о текущей эпохе и количестве карт в деках.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @returns Поле информации о количестве карт по эпохам.
 */
export const DrawTierCards = ({ G }) => {
    var _a;
    return (_jsxs("b", { children: ["Tier: ", _jsxs("span", { className: "italic", children: [G.decksLength.length - G.tierToEnd + 1 > G.decksLength.length ? G.decksLength.length :
                        G.decksLength.length - G.tierToEnd + 1, "/", G.decksLength.length, "(", (_a = G.decksLength[G.decksLength.length - G.tierToEnd]) !== null && _a !== void 0 ? _a : 0, G.decksLength.length - G.tierToEnd === 0 ? `/`
                        + (G.decksLength[0] + G.decksLength[1]) : ``, " cards)"] })] }));
};
/**
 * <h3>Отрисовка игровой информации о текущем статусе игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @returns Поле информации о ходе/победителях игры.
 */
export const DrawWinner = ({ G, ctx }) => {
    let winner;
    if (ctx.gameover !== undefined) {
        if (G.winner === null) {
            throw new Error(`В игре должен быть хотя бы 1 победитель.`);
        }
        if (G.winner.length === 1) {
            const winnerIndex = G.winner[0], winnerPlayer = G.publicPlayers[winnerIndex];
            if (winnerPlayer === undefined) {
                throw new Error(`Отсутствует игрок победитель с id '${winnerIndex}'.`);
            }
            winner = `Winner: Player ${winnerPlayer.nickname}`;
        }
        else {
            winner = "Winners: ";
            G.winner.forEach((playerId, index) => {
                const winnerPlayerI = G.publicPlayers[playerId];
                if (winnerPlayerI === undefined) {
                    throw new Error(`Отсутствует игрок победитель с id '${playerId}'.`);
                }
                winner += `${index + 1}) Player '${winnerPlayerI.nickname}'; `;
            });
        }
    }
    else {
        winner = `Game is started`;
    }
    return (_jsxs("b", { children: ["Game status: ", _jsx("span", { className: "italic", children: winner.trim() })] }));
};
//# sourceMappingURL=GameBoardUI.js.map