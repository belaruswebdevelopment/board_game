import { INVALID_MOVE } from "boardgame.io/core";
import { CreateCard, RusCardTypes } from "../Card";
import { ReturnCoinToPlayerHands } from "../Coin";
import { SuitNames, suitsConfig } from "../data/SuitData";
import { Stages } from "../Game";
import { AddBuffToPlayer, DrawCurrentProfit, PickDiscardCard, UpgradeCurrentCoin } from "../helpers/ActionHelpers";
import { CheckAndMoveThrudOrPickHeroAction, CheckPickDiscardCard, GetHeroIndexByName } from "../helpers/HeroHelpers";
import { TotalRank } from "../helpers/ScoreHelpers";
import { AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { CheckPickHero } from "../Hero";
import { AddDataToLog, LogTypes } from "../Logging";
import { AddCardToPlayer, AddHeroCardToPlayerCards, AddHeroCardToPlayerHeroCards } from "../Player";
import { ConfigNames, DrawNames } from "./Actions";
/**
 * <h3>Действия, связанные с добавлением бафов от героев игроку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющих бафы игроку.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const AddBuffToPlayerHeroAction = (G, ctx, config) => {
    AddBuffToPlayer(G, ctx, config);
};
/**
 * <h3>Действия, связанные с добавлением героев в массив карт игрока.</li>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющихся в массив карт игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const AddHeroToCardsAction = (G, ctx, config) => {
    if (config.drawName) {
        const heroIndex = GetHeroIndexByName(config.drawName), hero = G.heroes[heroIndex];
        let suit = null;
        AddHeroCardToPlayerHeroCards(G, ctx, hero);
        AddHeroCardToPlayerCards(G, ctx, hero);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, hero);
        if (hero.suit !== null) {
            suit = hero.suit;
        }
        EndActionFromStackAndAddNew(G, ctx, [], suit);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'config.drawName'.`);
    }
};
/**
 * <h3>Действия, связанные с возможностью дискарда карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность дискарда карт с планшета игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns
 */
export const CheckDiscardCardsFromPlayerBoardAction = (G, ctx, config) => {
    var _a;
    const cardsToDiscard = [];
    for (const suit in suitsConfig) {
        if (suitsConfig.hasOwnProperty(suit)) {
            if (config.suit !== suit) {
                const last = G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length - 1;
                if (last >= 0
                    && G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last].type !== RusCardTypes.HERO) {
                    cardsToDiscard.push(G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last]);
                }
            }
        }
    }
    const isValidMove = cardsToDiscard.length >= ((_a = config.number) !== null && _a !== void 0 ? _a : 1);
    if (!isValidMove) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
        return INVALID_MOVE;
    }
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с возможностью взятия карт из кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из кэмпа.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckPickCampCardAction = (G, ctx) => {
    if (G.camp.length === 0) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
    }
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с возможностью взятия карт из дискарда от героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из дискарда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckPickDiscardCardHeroAction = (G, ctx) => {
    CheckPickDiscardCard(G, ctx);
};
/**
 * <h3>Действия, связанные с дискардом карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дискардящих карты с планшета игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suit Название фракции.
 * @param cardId Id карты.
 */
export const DiscardCardsFromPlayerBoardAction = (G, ctx, config, suit, cardId) => {
    const pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][cardId];
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = pickedCard;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} отправил в сброс карту ${pickedCard.name}.`);
    // todo Artefact cards can be added to discard too OR make artefact card as created ICard?
    G.discardCardsDeck.push(G.publicPlayers[Number(ctx.currentPlayer)].cards[suit]
        .splice(cardId, 1)[0]);
    if (G.actionsNum === 2) {
        const stack = [
            {
                action: DrawProfitHeroAction.name,
                config: {
                    stageName: Stages.DiscardCardFromBoard,
                    drawName: DrawNames.Dagda,
                    name: ConfigNames.DagdaAction,
                    suit: SuitNames.HUNTER,
                },
            },
            {
                action: DiscardCardsFromPlayerBoardAction.name,
                config: {
                    suit: SuitNames.HUNTER,
                },
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с отрисовкой профита от героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих профит.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const DrawProfitHeroAction = (G, ctx, config) => {
    DrawCurrentProfit(G, ctx, config);
};
/**
 * <h3>Действия, связанные с возвращением закрытых монет со стола в руку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, возвращающих закрытые монеты со стола в руку.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const GetClosedCoinIntoPlayerHandAction = (G, ctx) => {
    const coinsCount = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length, tradingBoardCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
        .findIndex((coin) => Boolean(coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading)), tradingHandCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
        .findIndex((coin) => Boolean(coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading));
    for (let i = 0; i < coinsCount; i++) {
        if ((i < G.tavernsNum && G.currentTavern < i) || (i >= G.tavernsNum && tradingHandCoinIndex !== -1)
            || (i >= G.tavernsNum && tradingBoardCoinIndex >= G.currentTavern)) {
            ReturnCoinToPlayerHands(G.publicPlayers[Number(ctx.currentPlayer)], i);
        }
    }
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с взятием карт из дискарда от героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из дискарда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 */
export const PickDiscardCardHeroAction = (G, ctx, config, cardId) => {
    PickDiscardCard(G, ctx, config, cardId);
};
/**
 * <h3>Действия, связанные с выбором героев по определённым условиям.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, получаемых по определённым условиям.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns
 */
export const PickHeroWithConditionsAction = (G, ctx, config) => {
    let isValidMove = false;
    for (const condition in config.conditions) {
        if (config.conditions.hasOwnProperty(condition)) {
            if (condition === `suitCountMin`) {
                let ranks = 0;
                for (const key in config.conditions[condition]) {
                    if (config.conditions[condition].hasOwnProperty(key)) {
                        if (key === `suit`) {
                            ranks =
                                G.publicPlayers[Number(ctx.currentPlayer)].cards[config.conditions[condition][key]]
                                    .reduce(TotalRank, 0);
                        }
                        else if (key === `value`) {
                            isValidMove = ranks >= config.conditions[condition][key];
                        }
                    }
                }
            }
        }
    }
    if (!isValidMove) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
        return INVALID_MOVE;
    }
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с добавлением других карт на планшет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющих другие карты на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suit Название фракции.
 */
export const PlaceCardsAction = (G, ctx, config, suit) => {
    const playerVariants = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants !== undefined) {
        const olwinDouble = CreateCard({
            suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            name: `Olwin`,
        });
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} добавил карту Олвин во фракцию ${suitsConfig[suit].suitName}.`);
        AddCardToPlayer(G, ctx, olwinDouble);
        if (G.actionsNum === 2) {
            const variants = {
                blacksmith: {
                    suit: SuitNames.BLACKSMITH,
                    rank: 1,
                    points: null,
                },
                hunter: {
                    suit: SuitNames.HUNTER,
                    rank: 1,
                    points: null,
                },
                explorer: {
                    suit: SuitNames.EXPLORER,
                    rank: 1,
                    points: 0,
                },
                warrior: {
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: 0,
                },
                miner: {
                    suit: SuitNames.MINER,
                    rank: 1,
                    points: 0,
                },
            }, stack = [
                {
                    action: DrawProfitHeroAction.name,
                    variants,
                    config: {
                        name: ConfigNames.PlaceCards,
                        stageName: Stages.PlaceCards,
                        drawName: DrawNames.Olwin,
                    },
                },
                {
                    action: PlaceCardsAction.name,
                    variants,
                },
            ];
            AddActionsToStackAfterCurrent(G, ctx, stack);
        }
        CheckAndMoveThrudOrPickHeroAction(G, ctx, olwinDouble);
        EndActionFromStackAndAddNew(G, ctx, [], suit);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не найден обязательный параметр 'stack[0].variants'.`);
    }
};
/**
 * <h3>Действия, связанные с проверкой расположением конкретного героя на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Труд на игровом поле игрока.</li>
 * <li>При добавлении героя Илуд на игровом поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suit Название фракции.
 */
export const PlaceHeroAction = (G, ctx, config, suit) => {
    const playerVariants = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants !== undefined && config.name !== undefined) {
        const heroCard = CreateCard({
            suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            type: RusCardTypes.HERO,
            name: config.name,
            game: `base`,
        });
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} добавил карту ${config.name} во фракцию ${suitsConfig[suit].suitName}.`);
        AddCardToPlayer(G, ctx, heroCard);
        CheckPickHero(G, ctx);
        EndActionFromStackAndAddNew(G, ctx);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'stack[0].variants' или не передан обязательный параметр 'stack[0].config.name'.`);
    }
};
/**
 * <h3>Действия, связанные с улучшением монет от героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, улучшающих монеты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя или карты улучшающей монеты.
 * @param args Дополнительные аргументы.
 */
export const UpgradeCoinHeroAction = (G, ctx, config, ...args) => {
    UpgradeCurrentCoin(G, ctx, config, ...args);
};
