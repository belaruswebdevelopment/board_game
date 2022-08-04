import type { Ctx } from "boardgame.io";
import { CompareCards } from "./bot_logic/BotCardLogic";
import { ThrowMyError } from "./Error";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { GetValidator } from "./MoveValidator";
import { CurrentScoring } from "./Score";
import { BuffNames, ConfigNames, ErrorNames, MoveNames, PhaseNames, RusCardTypeNames, StageNames } from "./typescript/enums";
import type { ActiveStageAIType, CanBeNullType, CanBeUndefType, DeckCardTypes, IMoves, IMoveValidator, IMyGameState, IObjectives, IPublicPlayer, MoveArgsType, MoveValidatorGetRangeType, TavernCardType, ValidMoveIdParamType } from "./typescript/interfaces";

/**
 * <h3>Возвращает массив возможных ходов для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется ботами для доступных ходов.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Массив возможных мувов у ботов.
 */
export const enumerate = (G: IMyGameState, ctx: Ctx): IMoves[] => {
    const moves: IMoves[] = [],
        player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    let playerId: CanBeUndefType<number>;
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const phase: PhaseNames = ctx.phase as PhaseNames;
    if (phase !== null) {
        // TODO Add MythologicalCreature moves
        const currentStage: CanBeUndefType<StageNames> =
            ctx.activePlayers?.[Number(ctx.currentPlayer)] as CanBeUndefType<StageNames>;
        let activeStageOfCurrentPlayer: ActiveStageAIType = currentStage ?? `default`;
        if (activeStageOfCurrentPlayer === `default`) {
            let _exhaustiveCheck: never;
            switch (phase) {
                case PhaseNames.ChooseDifficultySoloMode:
                    activeStageOfCurrentPlayer = StageNames.default1;
                    break;
                case PhaseNames.Bids:
                    if (!G.solo || (G.solo && ctx.currentPlayer === `0`)) {
                        activeStageOfCurrentPlayer = StageNames.default3;
                    } else if (G.solo && ctx.currentPlayer === `1`) {
                        activeStageOfCurrentPlayer = StageNames.default4;
                    }
                    break;
                case PhaseNames.BidUline:
                    // TODO Add BotPlaceCoinUline and others moves only for bots?!
                    activeStageOfCurrentPlayer = StageNames.default1;
                    break;
                case PhaseNames.TavernsResolution:
                    if (ctx.activePlayers === null) {
                        let pickCardOrCampCard = `card`;
                        if (G.expansions.thingvellir.active && (ctx.currentPlayer === G.publicPlayersOrder[0]
                            || (!G.campPicked && CheckPlayerHasBuff(player, BuffNames.GoCamp)))) {
                            pickCardOrCampCard = Math.floor(Math.random() * 2) ? `card` : `camp`;
                        }
                        if (pickCardOrCampCard === `card`) {
                            activeStageOfCurrentPlayer = StageNames.default1;
                        } else {
                            activeStageOfCurrentPlayer = StageNames.default2;
                        }
                    }
                    break;
                case PhaseNames.EnlistmentMercenaries:
                    if (G.drawProfit === ConfigNames.StartOrPassEnlistmentMercenaries) {
                        if (G.publicPlayersOrder.length === 1 || Math.floor(Math.random() * 2) === 0) {
                            activeStageOfCurrentPlayer = StageNames.default1;
                        } else {
                            activeStageOfCurrentPlayer = StageNames.default2;
                        }
                    } else if (G.drawProfit === null) {
                        activeStageOfCurrentPlayer = StageNames.default3;
                    }
                    break;
                case PhaseNames.PlaceYlud:
                    activeStageOfCurrentPlayer = StageNames.default1;
                    break;
                case PhaseNames.TroopEvaluation:
                    activeStageOfCurrentPlayer = StageNames.default1;
                    break;
                case PhaseNames.BrisingamensEndGame:
                    activeStageOfCurrentPlayer = StageNames.default1;
                    break;
                case PhaseNames.GetMjollnirProfit:
                    activeStageOfCurrentPlayer = StageNames.default1;
                    break;
                default:
                    _exhaustiveCheck = phase;
                    throw new Error(`Нет такой фазы '${phase}'.`);
                    return _exhaustiveCheck;
            }
            if (ctx.activePlayers !== null) {
                activeStageOfCurrentPlayer = StageNames.discardSuitCard;
                // TODO Bot can't do async turns...?
                for (let p = 0; p < ctx.numPlayers; p++) {
                    const playerP: CanBeUndefType<IPublicPlayer> = G.publicPlayers[p];
                    if (playerP === undefined) {
                        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                            p);
                    }
                    if (p !== Number(ctx.currentPlayer) && playerP.stack[0] !== undefined) {
                        playerId = p;
                        break;
                    }
                }
            }
        }
        if (activeStageOfCurrentPlayer === `default`) {
            throw new Error(`Variable 'activeStageOfCurrentPlayer' can't be 'default'.`);
        }
        // TODO Add smart bot logic to get move arguments from getValue() (now it's random move mostly)
        const validator: IMoveValidator<MoveValidatorGetRangeType> =
            GetValidator(phase, activeStageOfCurrentPlayer);
        if (validator !== null) {
            const moveName: MoveNames = validator.moveName,
                moveRangeData: MoveValidatorGetRangeType = validator.getRange(G, ctx, playerId),
                moveValue: ValidMoveIdParamType = validator.getValue(G, ctx, moveRangeData);
            let moveValues: MoveArgsType = [];
            if (typeof moveValue === `number`) {
                moveValues = [moveValue];
            } else if (typeof moveValue === `string`) {
                moveValues = [moveValue];
            } else if (typeof moveValue === `object` && !Array.isArray(moveValue) && moveValue !== null) {
                if (`coinId` in moveValue) {
                    moveValues = [moveValue.coinId, moveValue.type];
                } else if (`suit` in moveValue) {
                    moveValues = [moveValue.suit, moveValue.cardId];
                } else if (`playerId` in moveValue) {
                    moveValues = [moveValue.cardId];
                }
            } else if (moveValue === null) {
                moveValues = [];
            } else if (Array.isArray(moveValue)) {
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
* @returns
*/
export const iterations = (G: IMyGameState, ctx: Ctx): number => {
    const maxIter: number = G.botData.maxIter;
    if (ctx.phase === PhaseNames.TavernsResolution) {
        const currentTavern: CanBeUndefType<TavernCardType[]> = G.taverns[G.currentTavern];
        if (currentTavern === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentTavernIsUndefined, G.currentTavern);
        }
        if (currentTavern.filter((card: TavernCardType): boolean => card !== null).length === 1) {
            return 1;
        }
        const cardIndex: number =
            currentTavern.findIndex((card: TavernCardType): boolean => card !== null),
            tavernNotNullCard: CanBeUndefType<TavernCardType> = currentTavern[cardIndex];
        if (tavernNotNullCard === undefined) {
            throw new Error(`Отсутствует карта с id '${cardIndex}' в текущей таверне '1'.`);
        }
        if (currentTavern.every((card: TavernCardType): boolean =>
            card === null || (card.type === RusCardTypeNames.Dwarf_Card && tavernNotNullCard !== null
                && tavernNotNullCard.type === RusCardTypeNames.Dwarf_Card
                && card.suit === tavernNotNullCard.suit && CompareCards(card, tavernNotNullCard) === 0))
        ) {
            return 1;
        }
        let efficientMovesCount = 0;
        for (let i = 0; i < currentTavern.length; i++) {
            const tavernCard: CanBeUndefType<TavernCardType> = currentTavern[i];
            if (tavernCard === undefined) {
                throw new Error(`Отсутствует карта с id '${cardIndex}' в текущей таверне '2'.`);
            }
            if (tavernCard === null) {
                continue;
            }
            if (currentTavern.some((card: TavernCardType): boolean =>
                CompareCards(tavernCard, card) === -1)) {
                continue;
            }
            const deck0 = G.secret.decks[0];
            if (deck0 === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 0);
            }
            if (deck0.length > 18) {
                if (tavernCard.type === RusCardTypeNames.Dwarf_Card) {
                    if (CompareCards(tavernCard, G.averageCards[tavernCard.suit]) === -1
                        && currentTavern.some((card: TavernCardType): boolean => card !== null
                            && CompareCards(card, G.averageCards[tavernCard.suit]) > -1)) {
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

/**
 * <h3>Возвращает цели игры для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется ботами для определения целей.</li>
 * </ol>
 *
 * @returns
 */
export const objectives = (): IObjectives => ({
    isEarlyGame: {
        checker: (G: IMyGameState, ctx: Ctx): boolean => {
            const deck0: CanBeUndefType<DeckCardTypes[]> = G.secret.decks[0];
            if (deck0 === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 0);
            }
            return deck0.length > 0;
        },
        weight: -100.0,
    },
    // TODO Move same logic in one func?!
    /* isWeaker: {
        checker: (G: IMyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== Phases.PlaceCoins) {
                return false;
            }
            const deck1: CanBeUndef<DeckCardTypes[]> = G.secret.decks[1];
            if (deck1 === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 1);
            }
            const tavern0: CanBeUndef<TavernCardTypes[]> = G.taverns[0];
            if (tavern0 === undefined) {
                return ThrowError(G, ctx, Errors.TavernWithCurrentIdIsUndefined, 0);
            }
            if (deck1.length < (G.botData.deckLength - 2 * G.tavernsNum * tavern0.length)) {
                return false;
            }
            if (tavern0.some((card: TavernCardTypes): boolean => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                }
                totalScore.push(CurrentScoring(player));
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
        checker: (G: MyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== Phases.PlaceCoins) {
                return false;
            }
            const deck1: CanBeUndef<DeckCardTypes[]> = G.secret.decks[1];
            if (deck1 === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 1);
            }
            const tavern0: CanBeUndef<TavernCardTypes[]> = G.taverns[0];
            if (tavern0 === undefined) {
                return ThrowError(G, ctx, Errors.TavernWithCurrentIdIsUndefined, 0);
            }
            if (deck1.length < (G.botData.deckLength - 2 * G.tavernsNum * tavern0.length)) {
                return false;
            }
            if (tavern0.some((card: TavernCardTypes): boolean => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                }
                totalScore.push(CurrentScoring(player));
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
        checker: (G: MyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== Phases.PlaceCoins) {
                return false;
            }
            const deck1: CanBeUndef<DeckCardTypes[]> = G.secret.decks[1];
            if (deck1 === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 1);
            }
            const tavern0: CanBeUndef<TavernCardTypes[]> = G.taverns[0];
            if (tavern0 === undefined) {
                return ThrowError(G, ctx, Errors.TavernWithCurrentIdIsUndefined, 0);
            }
            if (deck1.length < (G.botData.deckLength - 2 * G.tavernsNum * tavern0.length)) {
                return false;
            }
            if (tavern0.some((card: TavernCardTypes): boolean => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i: number = 0; i < ctx.numPlayers; i++) {
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                }
                totalScore.push(CurrentScoring(player));
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
        checker: (G: IMyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== PhaseNames.TavernsResolution) {
                return false;
            }
            const deck1: CanBeUndefType<DeckCardTypes[]> = G.secret.decks[1];
            if (deck1 === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 1);
            }
            const tavern0: CanBeUndefType<CanBeNullType<DeckCardTypes>[]> =
                G.taverns[0] as CanBeUndefType<CanBeNullType<DeckCardTypes>[]>;
            if (tavern0 === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.TavernWithCurrentIdIsUndefined, 0);
            }
            if (deck1.length < (G.botData.deckLength - 2 * G.tavernsNum * tavern0.length)) {
                return false;
            }
            if (tavern0.some((card: CanBeNullType<DeckCardTypes>): boolean => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                        i);
                }
                totalScore.push(CurrentScoring(G, player));
            }
            const [top1, top2]: number[] =
                totalScore.sort((a: number, b: number): number => b - a).slice(0, 2),
                totalScoreCurPlayer: CanBeUndefType<number> = totalScore[Number(ctx.currentPlayer)];
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
        checker: (G: IMyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== PhaseNames.TavernsResolution) {
                return false;
            }
            const deck1: CanBeUndefType<DeckCardTypes[]> = G.secret.decks[1];
            if (deck1 === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 1);
            }
            const tavern0: CanBeUndefType<CanBeNullType<DeckCardTypes>[]> =
                G.taverns[0] as CanBeUndefType<CanBeNullType<DeckCardTypes>[]>;
            if (tavern0 === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.TavernWithCurrentIdIsUndefined, 0);
            }
            if (deck1.length < (G.botData.deckLength - 2 * G.tavernsNum * tavern0.length)) {
                return false;
            }
            if (tavern0.some((card: CanBeNullType<DeckCardTypes>): boolean => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                        i);
                }
                totalScore.push(CurrentScoring(G, player));
            }
            const [top1, top2]: number[] =
                totalScore.sort((a: number, b: number): number => b - a).slice(0, 2),
                totalScoreCurPlayer: CanBeUndefType<number> = totalScore[Number(ctx.currentPlayer)];
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
 * @returns
 */
export const playoutDepth = (G: IMyGameState, ctx: Ctx): number => {
    const deck1: CanBeUndefType<DeckCardTypes[]> = G.secret.decks[1];
    if (deck1 === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 1);
    }
    const tavern0: CanBeUndefType<CanBeNullType<DeckCardTypes>[]> =
        G.taverns[0] as CanBeUndefType<CanBeNullType<DeckCardTypes>[]>;
    if (tavern0 === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.TavernWithCurrentIdIsUndefined, 0);
    }
    if (deck1.length < G.botData.deckLength) {
        return 3 * G.tavernsNum * tavern0.length + 4 * ctx.numPlayers + 20;
    }
    return 3 * G.tavernsNum * tavern0.length + 4 * ctx.numPlayers + 2;
};
