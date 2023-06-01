import { ChangeIsOpenedCoinStatus } from "../Coin";
import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { DiscardTradingCoin } from "../helpers/CoinHelpers";
import { CheckIsStartUseGodAbility } from "../helpers/GodAbilityHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { AssertNoCoinsOnPouchNumber, AssertPlayerCoinId, AssertPlayerCoinsNumber, AssertVidofnirVedrfolnirCoinsValue } from "../is_helpers/AssertionTypeHelpers";
import { IsCoin, IsTriggerTradingCoin } from "../is_helpers/IsCoinTypeHelpers";
import { AddDataToLog } from "../Logging";
import { CommonStageNames, ErrorNames, GameModeNames, GodNames, HeroBuffNames, LogTypeNames, SuitNames } from "../typescript/enums";
import type { ActionFunctionWithoutParams, CanBeUndefType, MyFnContextWithMyPlayerID, PlayerHandCoinsType, PrivatePlayer, PublicPlayer, PublicPlayerCoinType, Stack, StageArg } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные со сбросом обменной монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const DiscardTradingCoinAction: ActionFunctionWithoutParams = ({ G, ctx, myPlayerID, ...rest }:
    MyFnContextWithMyPlayerID): void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    DiscardTradingCoin({ G, ctx, myPlayerID, ...rest });
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' сбросил монету активирующую обмен.`);
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
export const FinishOdroerirTheMythicCauldronAction: ActionFunctionWithoutParams = ({ G }: MyFnContextWithMyPlayerID):
    void => {
    G.odroerirTheMythicCauldron = false;
};

/**
 * <h3>Старт действия, связанные с сбросом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты артефакта Hofud.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const StartDiscardSuitCardAction: ActionFunctionWithoutParams = ({ G, ctx, myPlayerID, events, ...rest }:
    MyFnContextWithMyPlayerID): void => {
    const value: Record<string, StageArg> = {};
    let results = 0;
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[i];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, events, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                i);
        }
        if (i !== Number(ctx.currentPlayer) && player.cards[SuitNames.warrior].length) {
            if (!(G.expansions.Idavoll.active
                && CheckIsStartUseGodAbility({ G, ctx, myPlayerID: String(i), events, ...rest },
                    GodNames.Thor))) {
                value[i] = {
                    stage: CommonStageNames.DiscardSuitCardFromPlayerBoard,
                };
                AddActionsToStack({ G, ctx, myPlayerID, events, ...rest },
                    [AllStackData.discardSuitCard(String(i))]);
                results++;
            }
        }
    }
    if (results) {
        events?.setActivePlayers({
            value,
            minMoves: 1,
            maxMoves: 1,
        });
    } else {
        // TODO Check it work ok if 1 player who pick Hofud has all warriors cards or all others warrior cards in discard!
        AddDataToLog({ G, ctx, events, ...rest }, LogTypeNames.Game, `Нет игроков с картами во фракции '${SuitNames.warrior}'.`);
    }
};

/**
 * <h3>Действия, связанные со стартом способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте способности карты артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const StartVidofnirVedrfolnirAction: ActionFunctionWithoutParams = ({ G, ctx, myPlayerID, ...rest }:
    MyFnContextWithMyPlayerID): void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)],
        privatePlayer: CanBeUndefType<PrivatePlayer> = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let handCoins: PlayerHandCoinsType;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    let isStart = true;
    if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.EveryTurn)) {
        const noCoinsOnPouchNumber: number =
            player.boardCoins.filter((coin: PublicPlayerCoinType, index: number): boolean =>
                index >= G.tavernsNum && coin === null).length;
        AssertNoCoinsOnPouchNumber(noCoinsOnPouchNumber);
        const handCoinsNumber: number = handCoins.filter(IsCoin).length;
        AssertPlayerCoinsNumber(handCoinsNumber);
        if (noCoinsOnPouchNumber > 0 && noCoinsOnPouchNumber < 3 && handCoinsNumber >= noCoinsOnPouchNumber) {
            for (let i = 0; i < noCoinsOnPouchNumber; i++) {
                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.addCoinToPouch()]);
            }
            isStart = false;
        } else if (noCoinsOnPouchNumber !== 0 && handCoinsNumber < noCoinsOnPouchNumber) {
            throw new Error(`При наличии бафа '${HeroBuffNames.EveryTurn}' всегда должно быть столько действий добавления монет в кошель, сколько ячеек для монет в кошеле пустые.`);
        }
    }
    if (isStart) {
        let coinsValue = 0,
            stack: Stack[] = [];
        for (let j: number = G.tavernsNum; j < player.boardCoins.length; j++) {
            AssertPlayerCoinId(j);
            let boardCoin: PublicPlayerCoinType;
            if (G.mode === GameModeNames.Multiplayer) {
                boardCoin = privatePlayer.boardCoins[j];
                const publicBoardCoin: PublicPlayerCoinType = player.boardCoins[j];
                if (IsCoin(boardCoin) && publicBoardCoin !== null && !IsCoin(publicBoardCoin)) {
                    if (!boardCoin.isOpened) {
                        ChangeIsOpenedCoinStatus(boardCoin, true);
                    }
                    player.boardCoins[j] = boardCoin;
                }
            } else {
                boardCoin = player.boardCoins[j];
                if (boardCoin !== null && !IsCoin(boardCoin)) {
                    throw new Error(`В массиве монет игрока с id '${myPlayerID}' на поле не должна быть закрыта монета в кошеле с id '${j}'.`);
                }
                if (boardCoin !== null && !boardCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(boardCoin, true);
                }
            }
            if (IsCoin(boardCoin) && !IsTriggerTradingCoin(boardCoin)) {
                coinsValue++;
            }
        }
        AssertVidofnirVedrfolnirCoinsValue(coinsValue);
        if (coinsValue === 1) {
            stack = [AllStackData.startChooseCoinValueForVidofnirVedrfolnirUpgrade([5])];
        } else if (coinsValue === 2) {
            stack = [AllStackData.startChooseCoinValueForVidofnirVedrfolnirUpgrade([2, 3])];
        }
        AddActionsToStack({ G, ctx, myPlayerID, ...rest }, stack);
    }
};
