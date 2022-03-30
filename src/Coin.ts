import type { Ctx } from "boardgame.io";
import { isInitialPlayerCoinsConfigNotMarket } from "./data/CoinData";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { IsMultiplayer } from "./helpers/MultiplayerHelpers";
import { AddDataToLog } from "./Logging";
import { BuffNames, CoinTypes, LogTypes, Stages } from "./typescript/enums";
import type { CoinType, IBuildCoinsOptions, ICoin, ICreateCoin, IInitialTradingCoinConfig, IMarketCoinConfig, IMyGameState, INumberValues, IPlayer, IPublicPlayer, PublicPlayerBoardCoinTypes } from "./typescript/interfaces";

/**
 * <h3>Создание всех монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается при создании всех базовых монет игроков.</li>
 * <li>Вызывается при создании всех монет рынка.</li>
 * </ol>
 *
 * @param coinConfig Конфиг монет.
 * @param options Опции создания монет.
 * @returns Массив всех монет.
 */
export const BuildCoins = (coinConfig: IMarketCoinConfig[] | IInitialTradingCoinConfig[],
    options: IBuildCoinsOptions): ICoin[] => {
    const coins: ICoin[] = [];
    for (let i = 0; i < coinConfig.length; i++) {
        const config: IMarketCoinConfig | IInitialTradingCoinConfig | undefined = coinConfig[i];
        if (config === undefined) {
            throw new Error(`В массиве конфига монет отсутствует монета ${i}.`);
        }
        const count: number | undefined = options.players !== undefined
            && !isInitialPlayerCoinsConfigNotMarket(config) ? config.count()[options.players] : 1;
        if (count === undefined) {
            throw new Error(`В конфиге монет для монеты ${i} отсутствует количество нужных монет для количества игроков - ${options.players}.`);
        }
        if (options.players !== undefined && options.count !== undefined) {
            options.count.push({
                value: config.value,
                isInitial: false,
                isTriggerTrading: false,
            });
        }
        for (let c = 0; c < count; c++) {
            coins.push(CreateCoin({
                value: config.value,
                isInitial: options.isInitial,
                isTriggerTrading: isInitialPlayerCoinsConfigNotMarket(config) ? config.isTriggerTrading : false,
            }));
        }
    }
    return coins;
};

/**
 * <h3>Вычисляет количество монет каждого номинала на рынке монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается при отображении рынка монет.</li>
 * </ol>
 *
 * @param G
 * @returns Количество всех монет на рынке (с повторами).
 */
export const CountMarketCoins = (G: IMyGameState): INumberValues => {
    const repeated: INumberValues = {};
    for (let i = 0; i < G.marketCoinsUnique.length; i++) {
        const marketCoin: ICoin | undefined = G.marketCoinsUnique[i];
        if (marketCoin === undefined) {
            throw new Error(`В массиве монет рынка отсутствует монета ${i}.`);
        }
        const temp: number = marketCoin.value;
        repeated[temp] = G.marketCoins.filter((coin: ICoin): boolean => coin.value === temp).length;
    }
    return repeated;
};

/**
 * <h3>Создание монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех монет при инициализации игры.</li>
 * <li>Вызывается при создании монеты преимущества по охотникам.</li>
 * </ol>
 *.
 * @param value Значение.
 * @param isInitial Является ли базовой.
 * @param isTriggerTrading Активирует ли обмен монет.
 * @returns Монета.
 */
export const CreateCoin = ({
    value,
    isInitial = false,
    isTriggerTrading = false,
}: ICreateCoin = {} as ICreateCoin): ICoin => ({
    value,
    isInitial,
    isTriggerTrading,
});

/**
 * <h3>Проверка, является ли объект монетой или пустым объектом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функции улучшения монеты.</li>
 * </ol>
 *
 * @param coin Пустой объект или монета.
 * @returns Является ли объект монетой, а не пустым объектом.
 */
export const IsCoin = (coin: unknown): coin is ICoin => coin !== null && (coin as ICoin).value !== undefined;

export const ReturnCoinsToPlayerBoard = (G: IMyGameState, playerId: number): void => {
    const multiplayer = IsMultiplayer(G),
        player: IPublicPlayer | undefined = G.publicPlayers[playerId],
        privatePlayer: IPlayer | undefined = G.players[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок ${playerId}.`);
    }
    let handCoins: CoinType[];
    if (multiplayer) {
        if (privatePlayer === undefined) {
            throw new Error(`В массиве приватных игроков отсутствует игрок ${playerId}.`);
        }
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    for (let i = 0; i < handCoins.length; i++) {
        const handCoin: CoinType | undefined = handCoins[i];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока в руке отсутствует монета ${i}.`);
        }
        if (IsCoin(handCoin)) {
            const tempCoinId: number = player.boardCoins.indexOf(null);
            if (tempCoinId !== -1) {
                if (multiplayer && privatePlayer !== undefined) {
                    privatePlayer.boardCoins[tempCoinId] = handCoin;
                }
                player.boardCoins[tempCoinId] = handCoin;
                handCoins[i] = null;
            }
        }
    }
};

/**
 * <h3>Возвращает все монеты со стола в руки игроков в начале фазы выставления монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В начале фазы выставления монет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const ReturnCoinsToPlayerHands = (G: IMyGameState, ctx: Ctx): void => {
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player: IPublicPlayer | undefined = G.publicPlayers[i];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок ${i}.`);
        }
        for (let j = 0; j < player.boardCoins.length; j++) {
            const isCoinReturned: boolean = ReturnCoinToPlayerHands(G, i, j);
            if (!isCoinReturned) {
                break;
            }
        }
    }
    AddDataToLog(G, LogTypes.GAME, `Все монеты вернулись в руки игроков.`);
};

/**
 * <h3>Возвращает указанную монету в руку игрока, если она ещё не в руке.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При возврате всех монет в руку в начале фазы выставления монет.</li>
 * <li>При возврате монет в руку, когда взят герой Улина.</li>
 * </ol>
 *
 * @param G
 * @param playerId Id игрока.
 * @param coinId Id монеты.
 * @returns Вернулась ли монета в руку.
 */
export const ReturnCoinToPlayerHands = (G: IMyGameState, playerId: number, coinId: number): boolean => {
    const multiplayer = IsMultiplayer(G),
        player: IPublicPlayer | undefined = G.publicPlayers[playerId],
        privatePlayer: IPlayer | undefined = G.players[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок ${playerId}.`);
    }
    let handCoins: CoinType[];
    if (multiplayer) {
        if (privatePlayer === undefined) {
            throw new Error(`В массиве приватных игроков отсутствует игрок ${playerId}.`);
        }
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    const tempCoinId: number = handCoins.indexOf(null);
    if (tempCoinId === -1) {
        return false;
    }
    const coin: PublicPlayerBoardCoinTypes | undefined = player.boardCoins[coinId];
    if (coin === undefined) {
        throw new Error(`В массиве монет игрока на поле отсутствует нужная монета ${coinId}.`);
    }
    if (IsCoin(coin)) {
        handCoins[tempCoinId] = coin;
    } else {
        if (multiplayer && privatePlayer !== undefined) {
            const privateBoardCoin: CoinType | undefined = privatePlayer.boardCoins[coinId];
            if (privateBoardCoin === undefined) {
                throw new Error(`В массиве монет приватного игрока на поле отсутствует монета ${coinId}.`);
            }
            if (IsCoin(privateBoardCoin)) {
                handCoins[tempCoinId] = privateBoardCoin;
            }
        }
    }
    if (multiplayer && privatePlayer !== undefined) {
        privatePlayer.boardCoins[coinId] = null;
    }
    player.boardCoins[coinId] = null;
    return true;
};

/**
 * <h3>Обмен монеты с рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается после выбора базовой карты игроком, если выложены монета, активирующая обмен монет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param value Значение увеличения монеты.
 * @param upgradingCoinId Id обменной монеты.
 * @param type Тип обменной монеты.
 * @param isInitial Является ли обменная монета базовой.
 */
export const UpgradeCoin = (G: IMyGameState, ctx: Ctx, value: number, upgradingCoinId: number, type: CoinTypes,
    isInitial: boolean): void => {
    const multiplayer = IsMultiplayer(G),
        player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: IPlayer | undefined = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    let handCoins: CoinType[];
    if (multiplayer) {
        if (privatePlayer === undefined) {
            throw new Error(`В массиве приватных игроков отсутствует текущий игрок.`);
        }
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    let upgradingCoin: ICoin | undefined;
    if (type === CoinTypes.Hand) {
        const handCoin: CoinType | undefined = handCoins[upgradingCoinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока в руке нет монеты с индексом ${upgradingCoinId}.`);
        }
        if (!IsCoin(handCoin)) {
            throw new Error(`В массиве монет игрока в руке не может не быть монеты с индексом ${upgradingCoinId}.`);
        }
        upgradingCoin = handCoin;
    } else if (type === CoinTypes.Board) {
        const boardCoin: PublicPlayerBoardCoinTypes | undefined = player.boardCoins[upgradingCoinId];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока на столе нет монеты с индексом ${upgradingCoinId}.`);
        }
        if (boardCoin === null) {
            throw new Error(`В массиве монет игрока на столе не может не быть монеты с индексом ${upgradingCoinId}.`);
        }
        if (!IsCoin(boardCoin)) {
            throw new Error(`В массиве монет игрока на столе не может быть закрытой монеты с индексом  ${upgradingCoinId}.`);
        }
        upgradingCoin = boardCoin;
    } else {
        throw new Error(`Не существует типа монеты - ${type}.`);
    }
    // TODO Split into different functions!?
    if (upgradingCoin === undefined) {
        throw new Error(`В массиве монет игрока отсутствует обменная монета.`);
    }
    const buffValue: number = CheckPlayerHasBuff(player, BuffNames.UpgradeCoin) ? 2 : 0,
        newValue: number = upgradingCoin.value + value + buffValue;
    let upgradedCoin: CoinType = null;
    if (G.marketCoins.length) {
        const lastMarketCoin = G.marketCoins[G.marketCoins.length - 1];
        if (lastMarketCoin === undefined) {
            throw new Error(`В массиве монет рынка отсутствует последняя монета.`);
        }
        if (newValue > lastMarketCoin.value) {
            upgradedCoin = lastMarketCoin;
            G.marketCoins.splice(G.marketCoins.length - 1, 1);
        } else {
            for (let i = 0; i < G.marketCoins.length; i++) {
                const marketCoin = G.marketCoins[i];
                if (marketCoin === undefined) {
                    throw new Error(`В массиве монет рынка отсутствует монета ${i}.`);
                }
                if (marketCoin.value < newValue) {
                    upgradedCoin = marketCoin;
                } else if (marketCoin.value >= newValue) {
                    upgradedCoin = marketCoin;
                    G.marketCoins.splice(i, 1);
                    break;
                }
                if (i === G.marketCoins.length - 1) {
                    G.marketCoins.splice(i, 1);
                }
            }
        }
    }
    AddDataToLog(G, LogTypes.GAME, `Начато обновление монеты с ценностью '${upgradingCoin.value}' на +${value}.`);
    if (upgradedCoin !== null) {
        AddDataToLog(G, LogTypes.PRIVATE, `Начато обновление монеты c ID '${upgradingCoinId}' с типом '${type}' с initial '${isInitial}' с ценностью '${upgradingCoin.value}' на +${value} с новым значением '${newValue}' с итоговым значением '${upgradedCoin.value}'.`);
        let handCoinIndex = -1;
        if (player.boardCoins[upgradingCoinId] === null) {
            const upgradingCoinValue: number = upgradingCoin.value;
            handCoinIndex = handCoins.findIndex((coin: CoinType): boolean =>
                coin?.value === upgradingCoinValue);
        } else {
            player.boardCoins[upgradingCoinId] = null;
        }
        if ((ctx.activePlayers?.[Number(ctx.currentPlayer)]) === Stages.PlaceTradingCoinsUline) {
            const emptyCoinIndex: number = handCoins.indexOf(null);
            handCoins[emptyCoinIndex] = upgradedCoin;
            AddDataToLog(G, LogTypes.PUBLIC, `Монета с ценностью '${upgradedCoin.value}' вернулась на руку игрока ${player.nickname}.`);
        } else {
            if (handCoinIndex === -1) {
                if (multiplayer && privatePlayer !== undefined) {
                    privatePlayer.boardCoins[upgradingCoinId] = upgradedCoin;
                } else {
                    player.boardCoins[upgradingCoinId] = upgradedCoin;
                }
                AddDataToLog(G, LogTypes.PUBLIC, `Монета с ценностью '${upgradedCoin.value}' вернулась на поле игрока ${player.nickname}.`);
            } else {
                handCoins[handCoinIndex] = upgradedCoin;
                AddDataToLog(G, LogTypes.PUBLIC, `Монета с ценностью '${upgradedCoin.value}' вернулась на руку игрока ${player.nickname}.`);
            }
        }
        if (!upgradingCoin.isInitial) {
            let returningIndex = 0;
            for (let i = 0; i < G.marketCoins.length; i++) {
                returningIndex = i;
                const marketCoinReturn = G.marketCoins[i];
                if (marketCoinReturn === undefined) {
                    throw new Error(`В массиве монет рынка отсутствует монета ${i}.`);
                }
                if (marketCoinReturn.value > upgradingCoin.value) {
                    break;
                }
            }
            G.marketCoins.splice(returningIndex, 0, upgradingCoin);
            AddDataToLog(G, LogTypes.GAME, `Монета с ценностью '${upgradingCoin.value}' вернулась на рынок.`);
        }
    } else {
        AddDataToLog(G, LogTypes.PRIVATE, `На рынке монет нет доступных монет для обмена.`);
    }
};
