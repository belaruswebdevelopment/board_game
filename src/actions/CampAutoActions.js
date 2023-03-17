import { ChangeIsOpenedCoinStatus } from "../Coin";
import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { DiscardTradingCoin } from "../helpers/CoinHelpers";
import { CheckIsStartUseGodAbility } from "../helpers/GodAbilityHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { AssertPlayerCoinId } from "../is_helpers/AssertionTypeHelpers";
import { IsCoin, IsTriggerTradingCoin } from "../is_helpers/IsCoinTypeHelpers";
import { AddDataToLog } from "../Logging";
import { ArtefactNames, CommonStageNames, ErrorNames, GameModeNames, GodNames, HeroBuffNames, LogTypeNames, SuitNames } from "../typescript/enums";
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
export const DiscardTradingCoinAction = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
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
export const FinishOdroerirTheMythicCauldronAction = ({ G }) => {
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
export const StartDiscardSuitCardAction = ({ G, ctx, myPlayerID, events, ...rest }) => {
    const value = {};
    let results = 0;
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player = G.publicPlayers[i];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, events, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
        }
        if (i !== Number(ctx.currentPlayer) && player.cards[SuitNames.warrior].length) {
            if (!(G.expansions.Idavoll.active
                && CheckIsStartUseGodAbility({ G, ctx, myPlayerID: String(i), events, ...rest }, GodNames.Thor))) {
                value[i] = {
                    stage: CommonStageNames.DiscardSuitCardFromPlayerBoard,
                };
                AddActionsToStack({ G, ctx, myPlayerID, events, ...rest }, [AllStackData.discardSuitCard(String(i))]);
                results++;
            }
        }
    }
    if (results) {
        events === null || events === void 0 ? void 0 : events.setActivePlayers({
            value,
            minMoves: 1,
            maxMoves: 1,
        });
    }
    else {
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
export const StartVidofnirVedrfolnirAction = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)], privatePlayer = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let handCoins;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    let isStart = true;
    if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.EveryTurn)) {
        const noCoinsOnPouchNumber = 
        // TODO Add type for noCoinsOnPouchNumber
        player.boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null).length, 
        // TODO Can add type for handCoinsNumber!?
        handCoinsNumber = handCoins.filter(IsCoin).length;
        if (noCoinsOnPouchNumber > 0 && noCoinsOnPouchNumber < 3 && handCoinsNumber >= noCoinsOnPouchNumber) {
            for (let i = 0; i < noCoinsOnPouchNumber; i++) {
                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.addCoinToPouch()]);
            }
            isStart = false;
        }
        else if (noCoinsOnPouchNumber !== 0 && handCoinsNumber < noCoinsOnPouchNumber) {
            throw new Error(`При наличии бафа '${HeroBuffNames.EveryTurn}' всегда должно быть столько действий добавления монет в кошель, сколько ячеек для монет в кошеле пустые.`);
        }
    }
    if (isStart) {
        let coinsValue = 0, stack = [];
        for (let j = G.tavernsNum; j < player.boardCoins.length; j++) {
            AssertPlayerCoinId(j);
            let boardCoin;
            if (G.mode === GameModeNames.Multiplayer) {
                boardCoin = privatePlayer.boardCoins[j];
                const publicBoardCoin = player.boardCoins[j];
                if (IsCoin(boardCoin) && publicBoardCoin !== null && !IsCoin(publicBoardCoin)) {
                    if (!boardCoin.isOpened) {
                        ChangeIsOpenedCoinStatus(boardCoin, true);
                    }
                    player.boardCoins[j] = boardCoin;
                }
            }
            else {
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
        if (coinsValue === 1) {
            stack = [AllStackData.startChooseCoinValueForVidofnirVedrfolnirUpgrade([5])];
        }
        else if (coinsValue === 2) {
            stack = [AllStackData.startChooseCoinValueForVidofnirVedrfolnirUpgrade([2, 3])];
        }
        else {
            throw new Error(`У игрока должно быть ровно 1-2 монеты в кошеле для обмена для действия артефакта '${ArtefactNames.VidofnirVedrfolnir}', а не '${coinsValue}' монет(ы).`);
        }
        AddActionsToStack({ G, ctx, myPlayerID, ...rest }, stack);
    }
};
//# sourceMappingURL=CampAutoActions.js.map