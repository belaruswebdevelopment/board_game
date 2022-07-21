import type { Ctx } from "boardgame.io";
import { IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { CoinTypeNames, ErrorNames } from "../typescript/enums";
import type { CanBeUndef, IMoveArgumentsStage, IMoveCoinsArguments, IMyGameState, IPublicPlayer, PublicPlayerCoinTypes } from "../typescript/interfaces";

export const CheckMinCoinVisibleIndexForSoloBot = (coins: PublicPlayerCoinTypes[], minValue: number): number => {
    let coinId = -1;
    coins.forEach((coin: PublicPlayerCoinTypes, index: number): void => {
        if (IsCoin(coin)) {
            if ((coinId === -1 && coin.value === minValue)
                || (coinId !== -1 && coin.value === minValue && !coin.isInitial)) {
                coinId = index;
            }
        }
    });
    return coinId;
};

export const CheckMinCoinVisibleValueForSoloBot = (G: IMyGameState, ctx: Ctx,
    moveArguments: IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`], type: CoinTypeNames): number => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
            ctx.currentPlayer);
    }
    let minValue = 0;
    for (let i = 0; i < moveArguments.length; i++) {
        const currentMoveArgument: CanBeUndef<IMoveCoinsArguments> = moveArguments[i];
        if (currentMoveArgument === undefined) {
            throw new Error(`Отсутствует необходимый аргумент мува для бота с id '${i}'.`);
        }
        let coin: CanBeUndef<PublicPlayerCoinTypes>,
            _exhaustiveCheck: never;
        switch (type) {
            case CoinTypeNames.Hand:
                coin = player.handCoins[currentMoveArgument.coinId];
                break;
            case CoinTypeNames.Board:
                coin = player.boardCoins[currentMoveArgument.coinId];
                break;
            default:
                _exhaustiveCheck = type;
                throw new Error(`Не существует типа монеты - '${type}'.`);
                return _exhaustiveCheck;
        }
        if (coin === undefined) {
            throw new Error(`В массиве монет ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} отсутствует монета с id '${currentMoveArgument.coinId}'.`);
        }
        if (coin === null) {
            throw new Error(`В массиве монет ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может отсутствовать монета с id '${currentMoveArgument.coinId}'.`);
        }
        if (!IsCoin(coin)) {
            throw new Error(`В массиве монет ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может быть закрытой для него монета с id '${ctx.currentPlayer}'.`);
        }
        if (minValue === 0 || coin.value < minValue || (coin.value === minValue && !coin.isInitial)) {
            minValue = coin.value;
        }
    }
    return minValue;
};
