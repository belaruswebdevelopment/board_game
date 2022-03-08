import type { Ctx } from "boardgame.io";
import { IsMercenaryCampCard } from "../Camp";
import { AddDataToLog } from "../Logging";
import { BuffNames, HeroNames, LogTypes, Phases } from "../typescript/enums";
import type { CampDeckCardTypes, DeckCardTypes, IMyGameState, INext, IPublicPlayer, PlayerCardsType } from "../typescript/interfaces";
import { DrawCurrentProfit } from "./ActionHelpers";
import { CheckPlayerHasBuff } from "./BuffHelpers";

/**
 * <h3>Выполняет основные действия после того как опустела последняя таверна.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После того как опустела последняя таверна.</li>
 * </oL>
 *
 * @param G
 */
export const AfterLastTavernEmptyActions = (G: IMyGameState): boolean | INext => {
    const deck: DeckCardTypes[] | undefined = G.decks[G.decks.length - G.tierToEnd];
    if (deck !== undefined) {
        if (deck.length === 0) {
            if (G.expansions.thingvellir?.active) {
                return CheckEnlistmentMercenaries(G);
            } else {
                return CheckEndTierActionsOrEndGameLastActions(G);
            }
        } else {
            return {
                next: Phases.PlaceCoins,
            };
        }
    } else {
        throw new Error(`Отсутствует колода карт текущей эпохи.`);
    }
};

/**
 * <h3>Проверяет необходимость начала фазы 'placeCoinsUline' или фазы 'pickCards'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, после которых может начаться фаза 'placeCoinsUline' или фаза 'pickCards'.</li>
 * </ol>
 *
 * @param G
 */
export const CheckAndStartPlaceCoinsUlineOrPickCardsPhase = (G: IMyGameState): INext => {
    const ulinePlayerIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
        CheckPlayerHasBuff(player, BuffNames.EveryTurn));
    if (ulinePlayerIndex !== -1) {
        return {
            next: Phases.PlaceCoinsUline,
        };
    } else {
        return {
            next: Phases.PickCards,
        };
    }
};

/**
 * <h3>Завершает каждую фазу конца игры и проверяет переход к другим фазам или завершает игру.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После завершения действий в каждой фазе конца игры.</li>
 * </ol>
 *
 * @param G
 */
export const CheckEndGameLastActions = (G: IMyGameState): boolean | INext => {
    const deck1: DeckCardTypes[] | undefined = G.decks[0],
        deck2: DeckCardTypes[] | undefined = G.decks[1];
    if (deck1 !== undefined && deck2 !== undefined) {
        if (!deck1.length && deck2.length) {
            return {
                next: Phases.GetDistinctions,
            };
        } else {
            if (G.expansions.thingvellir?.active) {
                const brisingamensBuffIndex: number =
                    G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
                        CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame));
                if (brisingamensBuffIndex !== -1) {
                    return {
                        next: Phases.BrisingamensEndGame,
                    };
                }
                const mjollnirBuffIndex: number =
                    G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
                        CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
                if (mjollnirBuffIndex !== -1) {
                    return {
                        next: Phases.GetMjollnirProfit,
                    };
                }
            }
            return true;
        }
    } else {
        throw new Error(`Отсутствует колода карт 1 и/или 2 эпох.`);
    }
};

/**
* <h3>Проверка начала фазы 'endTier' или фазы конца игры.</h3>
* <p>Применения:</p>
* <ol>
* <li>После завершения всех карт в деке каждой эпохи.</li>
* <li>После завершения фазы 'enlistmentMercenaries'.</li>
* </ol>
*
* @param G
*/
export const CheckEndTierActionsOrEndGameLastActions = (G: IMyGameState): boolean | INext => {
    const yludIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
        CheckPlayerHasBuff(player, BuffNames.EndTier));
    if (yludIndex !== -1) {
        return {
            next: Phases.EndTier,
        };
    } else {
        return CheckEndGameLastActions(G);
    }
};

/**
 * <h3>Проверяет есть ли у игроков наёмники для начала их вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При наличии у игроков наёмников в конце текущей эпохи.</li>
 * </ol>
 *
 * @param G
 */
const CheckEnlistmentMercenaries = (G: IMyGameState): boolean | INext => {
    let count = false;
    for (let i = 0; i < G.publicPlayers.length; i++) {
        const player: IPublicPlayer | undefined = G.publicPlayers[i];
        if (player !== undefined) {
            if (player.campCards.filter((card: CampDeckCardTypes): boolean =>
                IsMercenaryCampCard(card)).length) {
                count = true;
                break;
            }
        } else {
            throw new Error(`В массиве игроков отсутствует игрок ${i}.`);
        }
    }
    if (count) {
        return {
            next: Phases.EnlistmentMercenaries,
        };
    } else {
        return CheckEndTierActionsOrEndGameLastActions(G);
    }
};

export const ClearPlayerPickedCard = (G: IMyGameState, ctx: Ctx): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        player.pickedCard = null;
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};

/**
 * <h3>Завершает игру.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фаз конца игры.</li>
 * </ol>
 *
 * @param ctx
 */
export const EndGame = (ctx: Ctx): void => {
    ctx.events?.endGame();
};

export const EndTurnActions = (G: IMyGameState, ctx: Ctx): boolean | void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        if (!player.stack.length && !player.actionsNum) {
            return true;
        }
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};

/**
 * <h3>Удаляет Труд в конце игры с поля игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит в конце матча после всех игровых событий.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const RemoveThrudFromPlayerBoardAfterGameEnd = (G: IMyGameState, ctx: Ctx): void => {
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player: IPublicPlayer | undefined = G.publicPlayers[i];
        if (player !== undefined) {
            const playerCards: PlayerCardsType[] = Object.values(player.cards).flat(),
                thrud: PlayerCardsType | undefined =
                    playerCards.find((card: PlayerCardsType): boolean => card.name === HeroNames.Thrud);
            if (thrud !== undefined && thrud.suit !== null) {
                const thrudIndex: number =
                    player.cards[thrud.suit].findIndex((card: PlayerCardsType): boolean =>
                        card.name === HeroNames.Thrud);
                if (thrudIndex !== -1) {
                    player.cards[thrud.suit].splice(thrudIndex, 1);
                    AddDataToLog(G, LogTypes.GAME, `Герой Труд игрока ${player.nickname} уходит с игрового поля.`);
                } else {
                    throw new Error(`У игрока отсутствует обязательная карта героя ${HeroNames.Thrud}.`);
                }
            }
        } else {
            throw new Error(`В массиве игроков отсутствует игрок ${i}.`);
        }
    }
};

export const StartOrEndActions = (G: IMyGameState, ctx: Ctx): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        if (player.actionsNum) {
            player.actionsNum--;
        }
        if (ctx.activePlayers === null || ctx.activePlayers?.[Number(ctx.currentPlayer)] !== undefined) {
            player.stack.shift();
            DrawCurrentProfit(G, ctx);
        }
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
