import { CompareTavernCards } from "./bot_logic/BotCardLogic";
import { ThrowMyError } from "./Error";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { GetValidator } from "./MoveValidator";
import { AllCurrentScoring } from "./Score";
import { ActivateGiantAbilityOrPickCardSubStageNames, ActivateGodAbilityOrNotSubStageNames, BidsDefaultStageNames, BidUlineDefaultStageNames, BrisingamensEndGameDefaultStageNames, CampBuffNames, ChooseDifficultySoloModeAndvariDefaultStageNames, ChooseDifficultySoloModeDefaultStageNames, CommonStageNames, ConfigNames, EnlistmentMercenariesDefaultStageNames, ErrorNames, GameModeNames, GetMjollnirProfitDefaultStageNames, PhaseNames, PlaceYludDefaultStageNames, RusCardTypeNames, TavernsResolutionDefaultStageNames, TavernsResolutionWithSubStageNames, TroopEvaluationDefaultStageNames } from "./typescript/enums";
/**
 * <h3>Возвращает массив возможных ходов для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется ботами для доступных ходов.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerID Id игрока.
 * @returns Массив возможных мувов у ботов.
 */
export const enumerate = (G, ctx, playerID) => {
    var _a;
    const moves = [], player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    const phase = ctx.phase;
    if (phase !== null) {
        // TODO Add MythologicalCreature moves
        const currentStage = (_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(playerID)];
        let activeStageOfCurrentPlayer = currentStage !== null && currentStage !== void 0 ? currentStage : null, type;
        if (activeStageOfCurrentPlayer === null) {
            let _exhaustiveCheck;
            switch (phase) {
                case PhaseNames.ChooseDifficultySoloMode:
                    activeStageOfCurrentPlayer =
                        ChooseDifficultySoloModeDefaultStageNames.ChooseDifficultyLevelForSoloMode;
                    break;
                case PhaseNames.ChooseDifficultySoloModeAndvari:
                    if (G.soloGameAndvariStrategyVariantLevel === null) {
                        activeStageOfCurrentPlayer =
                            ChooseDifficultySoloModeAndvariDefaultStageNames.ChooseStrategyVariantForSoloModeAndvari;
                    }
                    else if (G.soloGameAndvariStrategyLevel === null) {
                        activeStageOfCurrentPlayer =
                            ChooseDifficultySoloModeAndvariDefaultStageNames.ChooseStrategyForSoloModeAndvari;
                    }
                    break;
                case PhaseNames.Bids:
                    switch (G.mode) {
                        case GameModeNames.Basic:
                        case GameModeNames.Multiplayer:
                            activeStageOfCurrentPlayer = BidsDefaultStageNames.BotsPlaceAllCoins;
                            break;
                        case GameModeNames.Solo:
                            if (ctx.currentPlayer === `0`) {
                                activeStageOfCurrentPlayer = BidsDefaultStageNames.BotsPlaceAllCoins;
                            }
                            else if (ctx.currentPlayer === `1`) {
                                activeStageOfCurrentPlayer = BidsDefaultStageNames.SoloBotPlaceAllCoins;
                            }
                            else {
                                throw new Error(`Не может быть игроков больше 2-х в соло игре.`);
                            }
                            break;
                        case GameModeNames.SoloAndvari:
                            if (ctx.currentPlayer === `0`) {
                                activeStageOfCurrentPlayer = BidsDefaultStageNames.BotsPlaceAllCoins;
                            }
                            else if (ctx.currentPlayer === `1`) {
                                activeStageOfCurrentPlayer = BidsDefaultStageNames.SoloBotAndvariPlaceAllCoins;
                            }
                            else {
                                throw new Error(`Не может быть игроков больше 2-х в соло игре Андвари.`);
                            }
                            break;
                        default:
                            _exhaustiveCheck = G.mode;
                            throw new Error(`Нет такого режима игры.`);
                            return _exhaustiveCheck;
                    }
                    break;
                case PhaseNames.BidUline:
                    // TODO Add BotPlaceCoinUline and others moves only for bots?!
                    activeStageOfCurrentPlayer = BidUlineDefaultStageNames.ClickHandCoinUline;
                    break;
                case PhaseNames.TavernsResolution:
                    switch (G.mode) {
                        case GameModeNames.Basic:
                        case GameModeNames.Multiplayer:
                            if (ctx.activePlayers === null) {
                                let pickCardOrCampCard = `card`;
                                if (G.expansions.Thingvellir.active && (ctx.currentPlayer === G.publicPlayersOrder[0]
                                    || (!G.campPicked && CheckPlayerHasBuff({ G, ctx, myPlayerID: playerID }, CampBuffNames.GoCamp)))) {
                                    pickCardOrCampCard = Math.floor(Math.random() * 2) ? `card` : `camp`;
                                }
                                if (pickCardOrCampCard === `card`) {
                                    activeStageOfCurrentPlayer = TavernsResolutionDefaultStageNames.ClickCard;
                                }
                                else {
                                    activeStageOfCurrentPlayer = TavernsResolutionDefaultStageNames.ClickCampCard;
                                }
                            }
                            break;
                        case GameModeNames.Solo:
                            if (ctx.currentPlayer === `0`) {
                                activeStageOfCurrentPlayer = TavernsResolutionDefaultStageNames.ClickCard;
                            }
                            else if (ctx.currentPlayer === `1`) {
                                activeStageOfCurrentPlayer = TavernsResolutionDefaultStageNames.SoloBotClickCard;
                            }
                            else {
                                throw new Error(`Не может быть игроков больше 2-х в соло игре.`);
                            }
                            break;
                        case GameModeNames.SoloAndvari:
                            if (ctx.currentPlayer === `0`) {
                                activeStageOfCurrentPlayer = TavernsResolutionDefaultStageNames.ClickCard;
                            }
                            else if (ctx.currentPlayer === `1`) {
                                activeStageOfCurrentPlayer = TavernsResolutionDefaultStageNames.SoloBotAndvariClickCard;
                            }
                            else {
                                throw new Error(`Не может быть игроков больше 2-х в соло игре Андвари.`);
                            }
                            break;
                        default:
                            _exhaustiveCheck = G.mode;
                            throw new Error(`Нет такого режима игры.`);
                            return _exhaustiveCheck;
                    }
                    break;
                case PhaseNames.EnlistmentMercenaries:
                    if (G.drawProfit === ConfigNames.StartOrPassEnlistmentMercenaries) {
                        if (G.publicPlayersOrder.length === 1 || Math.floor(Math.random() * 2) === 0) {
                            activeStageOfCurrentPlayer =
                                EnlistmentMercenariesDefaultStageNames.StartEnlistmentMercenaries;
                        }
                        else {
                            activeStageOfCurrentPlayer =
                                EnlistmentMercenariesDefaultStageNames.PassEnlistmentMercenaries;
                        }
                    }
                    else if (G.drawProfit === null) {
                        activeStageOfCurrentPlayer = EnlistmentMercenariesDefaultStageNames.GetEnlistmentMercenaries;
                    }
                    break;
                case PhaseNames.PlaceYlud:
                    activeStageOfCurrentPlayer = PlaceYludDefaultStageNames.PlaceYludHero;
                    break;
                case PhaseNames.TroopEvaluation:
                    activeStageOfCurrentPlayer = TroopEvaluationDefaultStageNames.ClickDistinctionCard;
                    break;
                case PhaseNames.BrisingamensEndGame:
                    activeStageOfCurrentPlayer = BrisingamensEndGameDefaultStageNames.DiscardCardFromPlayerBoard;
                    break;
                case PhaseNames.GetMjollnirProfit:
                    activeStageOfCurrentPlayer = GetMjollnirProfitDefaultStageNames.GetMjollnirProfit;
                    break;
                default:
                    _exhaustiveCheck = phase;
                    throw new Error(`Нет такой фазы.`);
                    return _exhaustiveCheck;
            }
            if (ctx.activePlayers !== null) {
                activeStageOfCurrentPlayer = CommonStageNames.DiscardSuitCardFromPlayerBoard;
                // TODO Bot can't do async turns...?
                for (let p = 0; p < ctx.numPlayers; p++) {
                    const playerP = G.publicPlayers[p];
                    if (playerP === undefined) {
                        return ThrowMyError({ G, ctx }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, p);
                    }
                    if (p !== Number(playerID) && playerP.stack[0] !== undefined) {
                        playerID = String(p);
                        break;
                    }
                }
            }
        }
        if (activeStageOfCurrentPlayer === TavernsResolutionWithSubStageNames.ActivateGiantAbilityOrPickCard) {
            const activateGiantAbilityOrPickCard = Math.floor(Math.random() * 2) ? `ability` : `card`;
            if (activateGiantAbilityOrPickCard === `ability`) {
                type = ActivateGiantAbilityOrPickCardSubStageNames.ClickGiantAbilityNotCard;
            }
            else {
                type = ActivateGiantAbilityOrPickCardSubStageNames.ClickCardNotGiantAbility;
            }
        }
        else if (activeStageOfCurrentPlayer === TavernsResolutionWithSubStageNames.ActivateGodAbilityOrNot) {
            const activateGodAbilityOrPickCard = Math.floor(Math.random() * 2) ? `ability` : `not`;
            if (activateGodAbilityOrPickCard === `ability`) {
                type = ActivateGodAbilityOrNotSubStageNames.ActivateGodAbility;
            }
            else {
                type = ActivateGodAbilityOrNotSubStageNames.NotActivateGodAbility;
            }
        }
        if (activeStageOfCurrentPlayer === null) {
            throw new Error(`Variable 'activeStageOfCurrentPlayer' can't be 'default'.`);
        }
        // TODO Add smart bot logic to get move arguments from getValue() (now it's random move mostly)
        const validator = GetValidator(phase, activeStageOfCurrentPlayer, `${type !== null && type !== void 0 ? type : activeStageOfCurrentPlayer}Move`);
        if (validator !== null) {
            const moveName = validator.moveName, moveRangeData = validator.getRange({ G, ctx, myPlayerID: playerID }), moveValue = validator.getValue({ G, ctx, myPlayerID: playerID }, moveRangeData);
            let moveValues = [];
            if (typeof moveValue === `number`) {
                moveValues = [moveValue];
            }
            else if (typeof moveValue === `string`) {
                moveValues = [moveValue];
            }
            else if (typeof moveValue === `object` && !Array.isArray(moveValue) && moveValue !== null) {
                if (`coinId` in moveValue) {
                    moveValues = [moveValue.coinId, moveValue.type];
                }
                else if (`rank` in moveValue) {
                    moveValues = [moveValue];
                }
                else if (`suit` in moveValue) {
                    moveValues = [moveValue.suit, moveValue.cardId];
                }
                else if (`myPlayerID` in moveValue) {
                    moveValues = [moveValue.cardId];
                }
            }
            else if (moveValue === null) {
                moveValues = [];
            }
            else if (Array.isArray(moveValue)) {
                moveValues = [moveValue];
            }
            moves.push({
                move: moveName,
                args: moveValues,
            });
        }
        if (moves.length === 0) {
            console.log(`ALERT: bot has '${moves.length}' moves. Phase: '${phase}'.`);
        }
    }
    return moves;
};
/**
* <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
* <p>Применения:</p>
* <ol>
* <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
* </oL>
*
* @TODO Саше: сделать описание функции и параметров.
* @param G
* @param ctx
* @param playerID ID игрока.
* @returns Итерации.
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const iterations = (G, ctx, playerID) => {
    const maxIter = G.botData.maxIter;
    if (ctx.phase === PhaseNames.TavernsResolution) {
        const currentTavern = G.taverns[G.currentTavern];
        if (currentTavern.filter((card) => card !== null).length === 1) {
            return 1;
        }
        const cardIndex = currentTavern.findIndex((card) => card !== null), tavernNotNullCard = currentTavern[cardIndex];
        if (tavernNotNullCard === undefined) {
            return ThrowMyError({ G, ctx }, ErrorNames.CurrentTavernCardWithCurrentIdIsUndefined, cardIndex);
        }
        if (tavernNotNullCard === null) {
            return ThrowMyError({ G, ctx }, ErrorNames.CurrentTavernCardWithCurrentIdIsNull, cardIndex);
        }
        if (currentTavern.every((card) => card === null || (CompareTavernCards(card, tavernNotNullCard) === 0))) {
            return 1;
        }
        let efficientMovesCount = 0;
        for (let i = 0; i < currentTavern.length; i++) {
            const tavernCard = currentTavern[i];
            if (tavernCard === undefined) {
                throw new Error(`Отсутствует карта с id '${cardIndex}' в текущей таверне '2'.`);
            }
            if (tavernCard === null) {
                continue;
            }
            if (currentTavern.some((card) => CompareTavernCards(tavernCard, card) === -1)) {
                continue;
            }
            const deck0 = G.secret.decks[0];
            if (deck0.length > 18) {
                if (tavernCard.type === RusCardTypeNames.Dwarf_Card) {
                    if (CompareTavernCards(tavernCard, G.averageCards[tavernCard.suit]) === -1
                        && currentTavern.some((card) => CompareTavernCards(card, G.averageCards[tavernCard.suit]) > -1)) {
                        continue;
                    }
                }
            }
            efficientMovesCount++;
            if (efficientMovesCount > 1) {
                return maxIter;
            }
        }
        if (efficientMovesCount === 1) {
            return 1;
        }
    }
    return maxIter;
};
// TODO Move same logic in one place?!
/**
 * <h3>Возвращает цели игры для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется ботами для определения целей.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerID ID игрока.
 * @returns Цели.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const objectives = (G, ctx, playerID) => ({
    isEarlyGame: {
        checker: (G) => G.secret.decks[0].length > 0,
        weight: -100.0,
    },
    // TODO Move same logic in one func?!
    /* isWeaker: {
        checker: (G: IMyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== Phases.PlaceCoins) {
                return false;
            }
            const tavern0: CanBeNullType<DeckCardTypes>[] = G.taverns[0];
            if (G.secret.decks[1].length < (G.botData.deckLength - 2 * G.tavernsNum * tavern0.length)) {
                return false;
            }
            if (tavern0.some((card: TavernCardTypes): boolean => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx } as FnContext,
                        ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                }
                totalScore.push(CurrentScoring({ G, ctx, myPlayerID: String(i) } as
                MyFnContextWithMyPlayerID));
            }
            const [top1, top2]: number[] =
                totalScore.sort((a: number, b: number): number => b - a).slice(0, 2),
                totalScoreCurPlayer: CanBeUndef<number> = totalScore[Number(ctx.currentPlayer)];
            if (totalScoreCurPlayer === undefined) {
                throw new Error(`В массиве общего счёта отсутствует счёт текущего игрока с id '${ctx.currentPlayer}'.`);
            }
            if (totalScoreCurPlayer < top2 && top2 < top1) {
                return totalScoreCurPlayer >= Math.floor(0.85 * top1);
            }
            return false;
        },
        weight: 0.01,
    }, */
    /* isSecond: {
        checker: (G: IMyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== Phases.PlaceCoins) {
                return false;
            }
            const tavern0: CanBeNullType<DeckCardTypes>[] = G.taverns[0];
            if (G.secret.decks[1].length < (G.botData.deckLength - 2 * G.tavernsNum * tavern0.length)) {
                return false;
            }
            if (tavern0.some((card: TavernCardTypes): boolean => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx } as FnContext,
                        ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                }
                totalScore.push(CurrentScoring({ G, ctx, myPlayerID: String(i) } as
                MyFnContextWithMyPlayerID));
            }
            const [top1, top2]: number[] =
                totalScore.sort((a: number, b: number): number => b - a).slice(0, 2),
                totalScoreCurPlayer: CanBeUndef<number> = totalScore[Number(ctx.currentPlayer)];
            if (totalScoreCurPlayer === undefined) {
                throw new Error(`В массиве общего счёта отсутствует счёт текущего игрока с id '${ctx.currentPlayer}'.`);
            }
            if (totalScoreCurPlayer === top2 && top2 < top1) {
                return totalScoreCurPlayer >= Math.floor(0.90 * top1);
            }
            return false;
        },
        weight: 0.1,
    }, */
    /* isEqual: {
        checker: (G: IMyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== Phases.PlaceCoins) {
                return false;
            }
            const tavern0: CanBeNullType<DeckCardTypes>[] = G.taverns[0];
            if (G.secret.decks[1].length < (G.botData.deckLength - 2 * G.tavernsNum * tavern0.length)) {
                return false;
            }
            if (tavern0.some((card: TavernCardTypes): boolean => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i: number = 0; i < ctx.numPlayers; i++) {
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx } as FnContext,
                        ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                }
                totalScore.push(CurrentScoring({ G, ctx, myPlayerID: String(i) } as
                MyFnContextWithMyPlayerID));
            }
            const [top1, top2]: number[] =
                totalScore.sort((a: number, b: number): number => b - a).slice(0, 2),
                totalScoreCurPlayer: CanBeUndef<number> = totalScore[Number(ctx.currentPlayer)];
            if (totalScoreCurPlayer === undefined) {
                throw new Error(`В массиве общего счёта отсутствует счёт текущего игрока с id '${ctx.currentPlayer}'.`);
            }
            if (totalScoreCurPlayer < top2 && top2 === top1) {
                return totalScoreCurPlayer >= Math.floor(0.90 * top1);
            }
            return false;
        },
        weight: 0.1,
    }, */
    isFirst: {
        checker: (G, ctx) => {
            if (ctx.phase !== PhaseNames.TavernsResolution) {
                return false;
            }
            const tavern0 = G.taverns[0];
            if (G.secret.decks[1].length < (G.botData.deckLength - 2 * G.tavernsNum * tavern0.length)) {
                return false;
            }
            if (tavern0.some((card) => card === null)) {
                return false;
            }
            const totalScore = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                }
                totalScore.push(AllCurrentScoring({ G, ctx, myPlayerID: String(i) }));
            }
            const [top1, top2] = totalScore.sort((a, b) => b - a).slice(0, 2), totalScoreCurPlayer = totalScore[Number(ctx.currentPlayer)];
            if (totalScoreCurPlayer === undefined) {
                throw new Error(`В массиве общего счёта отсутствует счёт текущего игрока с id '${ctx.currentPlayer}'.`);
            }
            if (totalScoreCurPlayer === top1) {
                if (top2 === undefined) {
                    throw new Error(`В массиве общего счёта отсутствует счёт топ '2' игрока.`);
                }
                return totalScoreCurPlayer >= Math.floor(1.05 * top2);
            }
            return false;
        },
        weight: 0.5,
    },
    isStronger: {
        checker: (G, ctx) => {
            if (ctx.phase !== PhaseNames.TavernsResolution) {
                return false;
            }
            const tavern0 = G.taverns[0];
            if (G.secret.decks[1].length < (G.botData.deckLength - 2 * G.tavernsNum * tavern0.length)) {
                return false;
            }
            if (tavern0.some((card) => card === null)) {
                return false;
            }
            const totalScore = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                }
                totalScore.push(AllCurrentScoring({ G, ctx, myPlayerID: String(i) }));
            }
            const [top1, top2] = totalScore.sort((a, b) => b - a).slice(0, 2), totalScoreCurPlayer = totalScore[Number(ctx.currentPlayer)];
            if (totalScoreCurPlayer === undefined) {
                throw new Error(`В массиве общего счёта отсутствует счёт текущего игрока с id '${ctx.currentPlayer}'.`);
            }
            if (totalScoreCurPlayer === top1) {
                if (top2 === undefined) {
                    throw new Error(`В массиве общего счёта отсутствует счёт топ '2' игрока.`);
                }
                return totalScoreCurPlayer >= Math.floor(1.10 * top2);
            }
            return false;
        },
        weight: 0.5,
    },
});
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @param playerID ID игрока.
 * @returns Глубина.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const playoutDepth = (G, ctx, playerID) => {
    const tavern0 = G.taverns[0];
    if (G.secret.decks[1].length < G.botData.deckLength) {
        return 3 * G.tavernsNum * tavern0.length + 4 * ctx.numPlayers + 20;
    }
    return 3 * G.tavernsNum * tavern0.length + 4 * ctx.numPlayers + 2;
};
//# sourceMappingURL=AI.js.map