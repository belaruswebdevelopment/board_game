import type { Ctx, StageArg } from "boardgame.io";
import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { DiscardTradingCoin } from "../helpers/CoinHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { ArtefactNames, BuffNames, ErrorNames, LogTypeNames, StageNames, SuitNames } from "../typescript/enums";
import type { CanBeUndefType, IActionFunctionWithoutParams, IMyGameState, IPlayer, IPublicPlayer, IStack, PublicPlayerCoinType } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные со сбросом обменной монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const DiscardTradingCoinAction: IActionFunctionWithoutParams = (G: IMyGameState, ctx: Ctx): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
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
 */
export const FinishOdroerirTheMythicCauldronAction: IActionFunctionWithoutParams = (G: IMyGameState): void => {
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
 */
export const StartDiscardSuitCardAction: IActionFunctionWithoutParams = (G: IMyGameState, ctx: Ctx): void => {
    const value: Record<string, StageArg> = {};
    let results = 0;
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[i];
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
    ctx.events?.setActivePlayers({
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
 */
export const StartVidofnirVedrfolnirAction: IActionFunctionWithoutParams = (G: IMyGameState, ctx: Ctx): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined,
            ctx.currentPlayer);
    }
    let handCoins: PublicPlayerCoinType[];
    if (G.multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    if (CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
        const noCoinsOnPouchNumber: number =
            player.boardCoins.filter((coin: PublicPlayerCoinType, index: number): boolean =>
                index >= G.tavernsNum && coin === null).length,
            handCoinsNumber: number = handCoins.filter(IsCoin).length;
        if (noCoinsOnPouchNumber > 0 && noCoinsOnPouchNumber < 3 && handCoinsNumber >= noCoinsOnPouchNumber) {
            for (let i = 0; i < noCoinsOnPouchNumber; i++) {
                AddActionsToStack(G, ctx, [StackData.addCoinToPouch()]);
            }
        } else {
            throw new Error(`При наличии бафа '${BuffNames.EveryTurn}' всегда должно быть столько действий добавления монет в кошель, сколько ячеек для монет в кошеле пустые.`);
        }
    } else {
        let coinsValue = 0,
            stack: IStack[] = [];
        for (let j: number = G.tavernsNum; j < player.boardCoins.length; j++) {
            let boardCoin: CanBeUndefType<PublicPlayerCoinType>;
            if (G.multiplayer) {
                boardCoin = privatePlayer.boardCoins[j];
                if (boardCoin === undefined) {
                    throw new Error(`В массиве приватных монет игрока с id '${ctx.currentPlayer}' на поле отсутствует монета с id '${j}'.`);
                }
                const publicBoardCoin: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[j];
                if (publicBoardCoin === undefined) {
                    throw new Error(`В массиве публичных монет игрока с id '${ctx.currentPlayer}' на поле отсутствует монета с id '${j}'.`);
                }
                if (IsCoin(boardCoin) && publicBoardCoin !== null && !IsCoin(publicBoardCoin)) {
                    if (!boardCoin.isOpened) {
                        ChangeIsOpenedCoinStatus(boardCoin, true);
                    }
                    player.boardCoins[j] = boardCoin;
                }
            } else {
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
        } else if (coinsValue === 2) {
            stack = [StackData.startChooseCoinValueForVidofnirVedrfolnirUpgrade([2, 3])];
        } else {
            throw new Error(`У игрока должно быть ровно 1-2 монеты в кошеле для обмена для действия артефакта '${ArtefactNames.Vidofnir_Vedrfolnir}', а не '${coinsValue}' монет(ы).`);
        }
        AddActionsToStack(G, ctx, stack);
    }
};
