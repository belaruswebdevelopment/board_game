import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { ReturnCoinToPlayerHands } from "../helpers/CoinHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { AssertPlayerCoinId, AssertUpgradableCoinValue } from "../is_helpers/AssertionTypeHelpers";
import { IsCoin, IsInitialCoin, IsTriggerTradingCoin } from "../is_helpers/IsCoinTypeHelpers";
import { AddDataToLog } from "../Logging";
import { CoinTypeNames, ErrorNames, GameModeNames, HeroBuffNames, LogTypeNames } from "../typescript/enums";
import type { ActionFunctionWithoutParams, AllCoinsType, AutoActionFunction, CanBeUndefType, MyFnContextWithMyPlayerID, OneOrTwoType, PlayerHandCoinsType, PrivatePlayer, PublicPlayer, PublicPlayerCoinType, UpgradableCoinType } from "../typescript/interfaces";
import { UpgradeCoinAction } from "./CoinActions";

/**
 * <h3>Действия, связанные с взятием героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игровых моментах, дающих возможность взять карту героя.</li>
 * </ol>
 *
 * @param context
 * @param priority Приоритет выбора героя.
 * @returns
 */
export const AddPickHeroAction: AutoActionFunction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    priority: number /* OneOrTwoType */): void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (G.mode === GameModeNames.Solo && myPlayerID === `1`) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest },
            [AllStackData.pickHeroSoloBot(priority as OneOrTwoType)]);
    } else if (G.mode === GameModeNames.SoloAndvari && myPlayerID === `1`) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest },
            [AllStackData.pickHeroSoloBotAndvari(priority as OneOrTwoType)]);
    } else {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest },
            [AllStackData.pickHero(priority as OneOrTwoType)]);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `Соло бот` : `Игрок '${player.nickname}'`} должен выбрать нового героя.`);
};

/**
 * <h3>Действия, связанные с возвращением закрытых монет со стола в руку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, возвращающих закрытые монеты со стола в руку.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const GetClosedCoinIntoPlayerHandAction: ActionFunctionWithoutParams = ({ G, ctx, myPlayerID, ...rest }:
    MyFnContextWithMyPlayerID): void => {
    if (G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer
        || (G.mode === GameModeNames.Solo && myPlayerID === `0`)
        || (G.mode === GameModeNames.SoloAndvari && myPlayerID === `0`)) {
        const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                myPlayerID);
        }
        for (let i = 0; i < player.boardCoins.length; i++) {
            AssertPlayerCoinId(i);
            if (i > G.currentTavern) {
                const isCoinReturned: boolean = ReturnCoinToPlayerHands({ G, ctx, myPlayerID, ...rest }, i,
                    false);
                if (!isCoinReturned) {
                    break;
                }
            }
        }
    }
};

// TODO Add code for Thrud Grid action!
// TODO Refactor & split into different functions and add throw errors
/**
 * <h3>Действия, связанные с улучшением минимальной монеты игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, улучшающих минимальную монету игрока.</li>
 * </ol>
 *
 * @param context
 * @param value Значение обмена монеты.
 * @returns
 */
export const UpgradeMinCoinAction: AutoActionFunction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    value: number/* UpgradableCoinValueType */): void => {
    AssertUpgradableCoinValue(value);
    // TODO Check it `G.mode === GameModeNames.Solo1 ? 1 : Number(ctx.currentPlayer)` and rework to `Number(ctx.currentPlayer)` if bot always upgrade Grid `2` in his turn during setup!
    const currentPlayer: number = G.mode === GameModeNames.Solo ? 1 : Number(myPlayerID),
        player: CanBeUndefType<PublicPlayer> = G.publicPlayers[currentPlayer],
        privatePlayer: CanBeUndefType<PrivatePlayer> = G.players[currentPlayer];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            currentPlayer);
    }
    let type: CoinTypeNames;
    if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
        && CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.EveryTurn)) {
        let handCoins: PlayerHandCoinsType;
        if (G.mode === GameModeNames.Multiplayer) {
            handCoins = privatePlayer.handCoins;
        } else {
            handCoins = player.handCoins;
        }
        const allCoins: AllCoinsType[] = [],
            allHandCoins: AllCoinsType[] = handCoins.filter(IsCoin) as AllCoinsType[];
        for (let i = 0; i < player.boardCoins.length; i++) {
            AssertPlayerCoinId(i);
            const boardCoin: PublicPlayerCoinType = player.boardCoins[i];
            if (boardCoin === null) {
                const handCoin: CanBeUndefType<AllCoinsType> = allHandCoins.splice(0, 1)[0];
                if (handCoin === undefined) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' в руке отсутствует монета с id '${i}'.`);
                }
                allCoins.push(handCoin);
            } else {
                if (!IsCoin(boardCoin)) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' на поле не может быть закрыта монета с id '${i}'.`);
                }
                allCoins.push(boardCoin);
            }
        }
        const minCoinValue: number = Math.min(...allCoins.filter((coin: AllCoinsType): boolean =>
            !IsTriggerTradingCoin(coin)).map((coin: AllCoinsType): number =>
                coin.value));
        AssertUpgradableCoinValue(minCoinValue);
        const upgradingCoinsArray: UpgradableCoinType[] = allCoins.filter((coin: AllCoinsType): boolean =>
            coin.value === minCoinValue) as UpgradableCoinType[],
            upgradingCoinsValue: number = upgradingCoinsArray.length;
        let isInitialInUpgradingCoinsValue = false;
        if (upgradingCoinsValue > 1) {
            isInitialInUpgradingCoinsValue =
                upgradingCoinsArray.some((coin: UpgradableCoinType): boolean => IsInitialCoin(coin));
        }
        if (upgradingCoinsValue === 1 || ((upgradingCoinsValue > 1) && !isInitialInUpgradingCoinsValue)) {
            const upgradingCoinId: number =
                allCoins.findIndex((coin: AllCoinsType): boolean => coin.value === minCoinValue);
            if (upgradingCoinId === -1) {
                throw new Error(`В массиве монет игрока с id '${currentPlayer}' на столе нет минимальной монеты с значением '${minCoinValue}'.`);
            }
            AssertPlayerCoinId(upgradingCoinId);
            const boardCoin: PublicPlayerCoinType = player.boardCoins[upgradingCoinId];
            if (boardCoin === null) {
                const handCoinIndex: number =
                    handCoins.findIndex((coin: PublicPlayerCoinType, index: number): boolean => {
                        if (coin !== null && !IsCoin(coin)) {
                            throw new Error(`В массиве монет игрока с id '${currentPlayer}' в руке не может быть закрыта монета с id '${index}'.`);
                        }
                        return coin?.value === minCoinValue;
                    });
                if (handCoinIndex === -1) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' в руке нет минимальной монеты с значением '${minCoinValue}'.`);
                }
                AssertPlayerCoinId(handCoinIndex);
                const handCoin: PublicPlayerCoinType = handCoins[handCoinIndex];
                if (!IsCoin(handCoin)) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' в руке не может не быть монеты с id '${upgradingCoinId}'.`);
                }
                type = CoinTypeNames.Hand;
            } else {
                if (!IsCoin(boardCoin)) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' на столе не может быть закрытой монеты с id '${upgradingCoinId}'.`);
                }
                type = CoinTypeNames.Board;
            }
            UpgradeCoinAction({ G, ctx, myPlayerID, ...rest }, false, value, upgradingCoinId, type);
        } else if (upgradingCoinsValue > 1 && isInitialInUpgradingCoinsValue) {
            AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                [AllStackData.pickConcreteCoinToUpgrade(minCoinValue, value)]);
            DrawCurrentProfit({ G, ctx, myPlayerID, ...rest });
        } else if (upgradingCoinsValue <= 0) {
            throw new Error(`Количество возможных монет для обмена не может быть меньше либо равно нулю.`);
        }
    } else {
        const minCoinValue: number =
            Math.min(...(player.boardCoins.filter((coin: PublicPlayerCoinType): boolean =>
                IsCoin(coin) && !IsTriggerTradingCoin(coin)) as UpgradableCoinType[])
                .map((coin: UpgradableCoinType): number => coin.value));
        AssertUpgradableCoinValue(minCoinValue);
        if (G.mode === GameModeNames.Solo && minCoinValue !== 2) {
            throw new Error(`В массиве монет соло бота с id '${currentPlayer}' не может быть минимальная монета не со значением '2'.`);
        }
        const upgradingCoinsArray: UpgradableCoinType[] =
            player.boardCoins.filter((coin: PublicPlayerCoinType): boolean =>
                coin?.value === minCoinValue) as UpgradableCoinType[],
            upgradingCoinsValue: number = upgradingCoinsArray.length;
        let isInitialInUpgradingCoinsValue = false;
        if (upgradingCoinsValue > 1) {
            isInitialInUpgradingCoinsValue =
                upgradingCoinsArray.some((coin: UpgradableCoinType): boolean => IsInitialCoin(coin));
        }
        if (upgradingCoinsValue === 1 || ((upgradingCoinsValue > 1) && !isInitialInUpgradingCoinsValue)) {
            const upgradingCoinId: number =
                player.boardCoins.findIndex((coin: PublicPlayerCoinType): boolean =>
                    coin?.value === minCoinValue);
            if (upgradingCoinId === -1) {
                throw new Error(`В массиве монет игрока с id '${currentPlayer}' на столе нет минимальной монеты с значением '${minCoinValue}'.`);
            }
            AssertPlayerCoinId(upgradingCoinId);
            const boardCoin: PublicPlayerCoinType = player.boardCoins[upgradingCoinId];
            if (boardCoin === null) {
                throw new Error(`В массиве монет игрока с id '${currentPlayer}' на столе нет монеты с id '${upgradingCoinId}'.`);
            }
            if (!IsCoin(boardCoin)) {
                throw new Error(`В массиве монет игрока с id '${currentPlayer}' на столе не может быть закрытой монеты с id '${upgradingCoinId}'.`);
            }
            type = CoinTypeNames.Board;
            UpgradeCoinAction({ G, ctx, myPlayerID, ...rest }, false, value, upgradingCoinId, type);
        } else if (upgradingCoinsValue > 1 && isInitialInUpgradingCoinsValue) {
            AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                [AllStackData.pickConcreteCoinToUpgrade(minCoinValue, value)]);
            DrawCurrentProfit({ G, ctx, myPlayerID, ...rest });
        } else if (upgradingCoinsValue <= 0) {
            throw new Error(`Количество возможных монет для обмена не может быть меньше либо равно нулю.`);
        }
    }
};
