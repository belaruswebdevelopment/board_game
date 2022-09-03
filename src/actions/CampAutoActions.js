import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { DiscardTradingCoin } from "../helpers/CoinHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { ArtefactNames, BuffNames, ErrorNames, GameModeNames, LogTypeNames, StageNames, SuitNames } from "../typescript/enums";
/**
 * <h3>Действия, связанные со сбросом обменной монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const DiscardTradingCoinAction = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    DiscardTradingCoin(G, ctx, Number(ctx.currentPlayer));
    AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' сбросил монету активирующую обмен.`);
};
/**
 * <h3>Действия, связанные с завершением выкладки монет на артефакт Odroerir The Mythic Cauldron.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря артефакта Odroerir The Mythic Cauldron.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const FinishOdroerirTheMythicCauldronAction = (G) => {
    G.odroerirTheMythicCauldron = false;
};
/**
 * <h3>Старт действия, связанные с сбросом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const StartDiscardSuitCardAction = (G, ctx) => {
    var _a;
    const value = {};
    let results = 0;
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player = G.publicPlayers[i];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
        }
        if (i !== Number(ctx.currentPlayer) && player.cards[SuitNames.warrior].length) {
            value[i] = {
                stage: StageNames.discardSuitCard,
            };
            AddActionsToStack(G, ctx, [StackData.discardSuitCard(i)]);
            results++;
        }
    }
    if (!results) {
        throw new Error(`Должны быть игроки с картами в фракции '${SuitNames.warrior}'.`);
    }
    (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setActivePlayers({
        value,
        minMoves: 1,
        maxMoves: 1,
    });
};
/**
 * <h3>Действия, связанные со стартом способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте способности карты лагеря артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const StartVidofnirVedrfolnirAction = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], privatePlayer = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
    }
    let handCoins;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    if (CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
        const noCoinsOnPouchNumber = player.boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null).length, handCoinsNumber = handCoins.filter(IsCoin).length;
        if (noCoinsOnPouchNumber > 0 && noCoinsOnPouchNumber < 3 && handCoinsNumber >= noCoinsOnPouchNumber) {
            for (let i = 0; i < noCoinsOnPouchNumber; i++) {
                AddActionsToStack(G, ctx, [StackData.addCoinToPouch()]);
            }
        }
        else {
            throw new Error(`При наличии бафа '${BuffNames.EveryTurn}' всегда должно быть столько действий добавления монет в кошель, сколько ячеек для монет в кошеле пустые.`);
        }
    }
    else {
        let coinsValue = 0, stack = [];
        for (let j = G.tavernsNum; j < player.boardCoins.length; j++) {
            let boardCoin;
            if (G.mode === GameModeNames.Multiplayer) {
                boardCoin = privatePlayer.boardCoins[j];
                if (boardCoin === undefined) {
                    throw new Error(`В массиве приватных монет игрока с id '${ctx.currentPlayer}' на поле отсутствует монета с id '${j}'.`);
                }
                const publicBoardCoin = player.boardCoins[j];
                if (publicBoardCoin === undefined) {
                    throw new Error(`В массиве публичных монет игрока с id '${ctx.currentPlayer}' на поле отсутствует монета с id '${j}'.`);
                }
                if (IsCoin(boardCoin) && publicBoardCoin !== null && !IsCoin(publicBoardCoin)) {
                    if (!boardCoin.isOpened) {
                        ChangeIsOpenedCoinStatus(boardCoin, true);
                    }
                    player.boardCoins[j] = boardCoin;
                }
            }
            else {
                boardCoin = player.boardCoins[j];
                if (boardCoin === undefined) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле отсутствует монета с id '${j}'.`);
                }
                if (boardCoin !== null && !IsCoin(boardCoin)) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле не должна быть закрыта монета в кошеле с id '${j}'.`);
                }
                if (boardCoin !== null && !boardCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(boardCoin, true);
                }
            }
            if (IsCoin(boardCoin) && !boardCoin.isTriggerTrading) {
                coinsValue++;
            }
        }
        if (coinsValue === 1) {
            stack = [StackData.startChooseCoinValueForVidofnirVedrfolnirUpgrade([5])];
        }
        else if (coinsValue === 2) {
            stack = [StackData.startChooseCoinValueForVidofnirVedrfolnirUpgrade([2, 3])];
        }
        else {
            throw new Error(`У игрока должно быть ровно 1-2 монеты в кошеле для обмена для действия артефакта '${ArtefactNames.Vidofnir_Vedrfolnir}', а не '${coinsValue}' монет(ы).`);
        }
        AddActionsToStack(G, ctx, stack);
    }
};
//# sourceMappingURL=CampAutoActions.js.map