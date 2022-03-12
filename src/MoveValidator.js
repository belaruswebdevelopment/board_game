import { CompareCards, EvaluateCard } from "./bot_logic/BotCardLogic";
import { CheckHeuristicsForCoinsPlacement } from "./bot_logic/BotConfig";
import { IsMercenaryCampCard } from "./Camp";
import { IsCardNotActionAndNotNull } from "./Card";
import { IsCoin } from "./Coin";
import { IsCanPickHeroWithConditionsValidator, IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator } from "./move_validators/IsCanPickCurrentHeroValidator";
import { HasLowestPriority } from "./Priority";
import { TotalRank } from "./score_helpers/ScoreHelpers";
import { MoveNames, MoveValidatorNames, Phases, ValidatorNames } from "./typescript/enums";
import { DrawCamp, DrawDistinctions, DrawHeroes, DrawTaverns } from "./ui/GameBoardUI";
import { DrawPlayersBoardsCoins, DrawPlayersHandsCoins } from "./ui/PlayerUI";
import { AddCoinToPouchProfit, DiscardAnyCardFromPlayerBoardProfit, DiscardCardFromBoardProfit, DiscardCardProfit, DiscardSuitCardFromPlayerBoardProfit, ExplorerDistinctionProfit, GetEnlistmentMercenariesProfit, GetMjollnirProfitProfit, PickCampCardHoldaProfit, PickDiscardCardProfit, PlaceCardsProfit, PlaceEnlistmentMercenariesProfit, UpgradeCoinProfit, UpgradeCoinVidofnirVedrfolnirProfit } from "./ui/ProfitUI";
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
 * @param coinData Данные монеты.
 * @returns
 */
export const CoinUpgradeValidation = (G, ctx, coinData) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    if (coinData.type === "hand") {
        const handCoinPosition = player.boardCoins.filter((coin, index) => coin === null && index <= coinData.coinId).length - 1, handCoin = player.handCoins.filter((coin) => IsCoin(coin))[handCoinPosition];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока в руке отсутствует монета ${handCoinPosition}.`);
        }
        if (handCoin === null) {
            throw new Error(`Выбранная для улучшения монета игрока в руке ${handCoinPosition} не может отсутствовать там.`);
        }
        if (!handCoin.isTriggerTrading) {
            return true;
        }
    }
    else {
        const boardCoin = player.boardCoins[coinData.coinId];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока на столе отсутствует монета ${coinData.coinId}.`);
        }
        if (boardCoin === null) {
            throw new Error(`Выбранная для улучшения монета игрока на столе ${coinData.coinId} не может отсутствовать там.`);
        }
        if (!boardCoin.isTriggerTrading) {
            return true;
        }
    }
    return false;
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
 * @param stage Стадия.
 * @param id Данные для валидации.
 * @returns Валидный ли мув.
 */
export const IsValidMove = (G, ctx, stage, id) => {
    const validator = GetValidator(ctx.phase, stage);
    let isValid = false;
    if (validator !== null) {
        if (typeof id === `number`) {
            isValid = ValidateByValues(id, validator.getRange(G, ctx));
        }
        else if (typeof id === `string`) {
            isValid = ValidateByValues(id, validator.getRange(G, ctx));
        }
        else if (typeof id === `object` && !Array.isArray(id) && id !== null) {
            if (`coinId` in id) {
                isValid = ValidateByObjectCoinIdTypeIsInitialValues(id, validator.getRange(G, ctx));
            }
            else if (`playerId` in id) {
                isValid = ValidateByObjectSuitCardIdPlayerIdValues(id, validator.getRange(G, ctx, id.playerId));
            }
            else if (`suit` in id) {
                isValid = ValidateByObjectSuitCardIdValues(id, validator.getRange(G, ctx));
            }
        }
        else {
            isValid = true;
        }
        if (isValid) {
            return validator.validate(G, ctx, id);
        }
    }
    return isValid;
};
export const GetValidator = (phase, stage) => {
    let validator;
    switch (phase) {
        case Phases.PlaceCoins:
            validator = moveBy[phase][stage];
            break;
        case Phases.PlaceCoinsUline:
            validator = moveBy[phase][stage];
            break;
        case Phases.PickCards:
            validator = moveBy[phase][stage];
            break;
        case Phases.EnlistmentMercenaries:
            validator = moveBy[phase][stage];
            break;
        case Phases.EndTier:
            validator = moveBy[phase][stage];
            break;
        case Phases.GetDistinctions:
            validator = moveBy[phase][stage];
            break;
        case Phases.BrisingamensEndGame:
            validator = moveBy[phase][stage];
            break;
        case Phases.GetMjollnirProfit:
            validator = moveBy[phase][stage];
            break;
        default:
            throw new Error(`Нет такого валидатора.`);
    }
    return validator;
};
// TODO MOVE ALL SAME VALIDATING LOGIC FROM GET RANGE/GET VALUE TO VALIDATE!
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
export const moveValidators = {
    BotsPlaceAllCoinsMoveValidator: {
        getRange: (G) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            return G.botData.allCoinsOrder;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const allCoinsOrder = currentMoveArguments, hasLowestPriority = HasLowestPriority(G, Number(ctx.currentPlayer));
            let resultsForCoins = CheckHeuristicsForCoinsPlacement(G, ctx);
            if (hasLowestPriority) {
                resultsForCoins = resultsForCoins.map((num, index) => index === 0 ? num - 20 : num);
            }
            const minResultForCoins = Math.min(...resultsForCoins), maxResultForCoins = Math.max(...resultsForCoins);
            const deck = G.decks[G.decks.length - 1];
            if (deck === undefined) {
                throw new Error(`В массиве дек карт отсутствует дека ${G.decks.length - 1} эпохи.`);
            }
            const tradingProfit = deck.length > 9 ? 1 : 0;
            let [positionForMinCoin, positionForMaxCoin] = [-1, -1];
            if (minResultForCoins <= 0) {
                positionForMinCoin = resultsForCoins.indexOf(minResultForCoins);
            }
            if (maxResultForCoins >= 0) {
                positionForMaxCoin = resultsForCoins.indexOf(maxResultForCoins);
            }
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
            const handCoins = player.handCoins;
            for (let i = 0; i < allCoinsOrder.length; i++) {
                const allCoinsOrderI = allCoinsOrder[i];
                if (allCoinsOrderI === undefined) {
                    throw new Error(`В массиве выкладки монет отсутствует выкладка ${i}.`);
                }
                const hasTrading = allCoinsOrderI.some((coinId) => {
                    var _a;
                    const handCoin = handCoins[coinId];
                    if (handCoin === undefined) {
                        throw new Error(`В массиве монет игрока в руке отсутствует монета ${coinId}.`);
                    }
                    return Boolean((_a = handCoins[coinId]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading);
                });
                // TODO How tradingProfit can be < 0?
                if (tradingProfit < 0) {
                    if (hasTrading) {
                        continue;
                    }
                    return allCoinsOrderI;
                }
                else if (tradingProfit > 0) {
                    if (!hasTrading && handCoins.every(coin => IsCoin(coin))) {
                        continue;
                    }
                    if (positionForMaxCoin === undefined || positionForMinCoin === undefined) {
                        throw new Error(`Отсутствуют значения выкладки для минимальной и/или максимальной монеты.`);
                    }
                    const hasPositionForMaxCoin = positionForMaxCoin !== -1, hasPositionForMinCoin = positionForMinCoin !== -1, coinsOrderPositionForMaxCoin = allCoinsOrderI[positionForMaxCoin], coinsOrderPositionForMinCoin = allCoinsOrderI[positionForMinCoin];
                    if (coinsOrderPositionForMaxCoin !== undefined
                        && coinsOrderPositionForMinCoin !== undefined) {
                        const maxCoin = handCoins[coinsOrderPositionForMaxCoin], minCoin = handCoins[coinsOrderPositionForMinCoin];
                        if (maxCoin === undefined || minCoin === undefined) {
                            throw new Error(`В массиве монет игрока в руке отсутствует максимальная и/или минимальная монета.`);
                        }
                        if (!IsCoin(maxCoin) || !IsCoin(minCoin)) {
                            throw new Error(`В массиве выкладки монет отсутствует выкладка для максимальной ${coinsOrderPositionForMaxCoin} и/или минимальной ${coinsOrderPositionForMinCoin} монеты.`);
                        }
                        let isTopCoinsOnPosition = false, isMinCoinsOnPosition = false;
                        if (hasPositionForMaxCoin) {
                            isTopCoinsOnPosition = allCoinsOrderI.filter((coinIndex) => {
                                const handCoin = handCoins[coinIndex];
                                if (handCoin === undefined) {
                                    throw new Error(`В массиве монет игрока в руке отсутствует монета ${coinIndex}.`);
                                }
                                return IsCoin(handCoin) && handCoin.value > maxCoin.value;
                            }).length <= 1;
                        }
                        if (hasPositionForMinCoin) {
                            isMinCoinsOnPosition = handCoins.filter((coin) => IsCoin(coin) && coin.value < minCoin.value).length <= 1;
                        }
                        if (isTopCoinsOnPosition && isMinCoinsOnPosition) {
                            return allCoinsOrderI;
                            //console.log(`#` + i.toString().padStart(2) + `: ` + allCoinsOrder[i].map(item => handCoins[item].value));
                        }
                    }
                }
                else {
                    // TODO Why if trading profit === 0 we not checked min max coins positions!?
                    return allCoinsOrderI;
                }
            }
            throw new Error(`Отсутствует вариант выкладки монет для ботов.`);
        },
        moveName: MoveNames.BotsPlaceAllCoinsMove,
        validate: () => true,
    },
    ClickBoardCoinMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return DrawPlayersBoardsCoins(G, ctx, MoveValidatorNames.ClickBoardCoinMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickBoardCoinMove,
        validate: () => true,
    },
    ClickCampCardMoveValidator: {
        getRange: (G) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            return DrawCamp(G, MoveValidatorNames.ClickCampCardMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickCampCardMove,
        validate: (G, ctx) => {
            var _a;
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
            return ((_a = G.expansions.thingvellir) === null || _a === void 0 ? void 0 : _a.active) && (ctx.currentPlayer === G.publicPlayersOrder[0]
                || (!G.campPicked && player.buffs.find((buff) => buff.goCamp !== undefined) !== undefined));
        },
    },
    ClickCardMoveValidator: {
        getRange: (G) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            return DrawTaverns(G, MoveValidatorNames.ClickCardMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, uniqueArr = [], currentTavern = G.taverns[G.currentTavern];
            if (currentTavern === undefined) {
                throw new Error(`В массиве таверн отсутствует текущая таверна.`);
            }
            let flag = true;
            for (let i = 0; i < moveArguments.length; i++) {
                const moveArgument = moveArguments[i];
                if (moveArgument === undefined) {
                    throw new Error(`В массиве аргументов мува отсутствует аргумент ${i}.`);
                }
                const tavernCard = currentTavern[moveArgument];
                if (tavernCard === undefined) {
                    throw new Error(`В массиве карт текущей таверны отсутствует карта ${moveArgument}.`);
                }
                if (tavernCard === null) {
                    continue;
                }
                if (currentTavern.some((card) => CompareCards(tavernCard, card) < 0)) {
                    continue;
                }
                const isCurrentCardWorse = EvaluateCard(G, ctx, tavernCard, moveArgument, currentTavern) < 0, isExistCardNotWorse = currentTavern.some((card) => (card !== null)
                    && (EvaluateCard(G, ctx, tavernCard, moveArgument, currentTavern) >= 0));
                if (isCurrentCardWorse && isExistCardNotWorse) {
                    continue;
                }
                const uniqueArrLength = uniqueArr.length;
                for (let j = 0; j < uniqueArrLength; j++) {
                    const uniqueCard = uniqueArr[j];
                    if (uniqueCard === undefined) {
                        throw new Error(`В массиве уникальных карт отсутствует карта ${j}.`);
                    }
                    if (IsCardNotActionAndNotNull(tavernCard)
                        && IsCardNotActionAndNotNull(uniqueCard)
                        && tavernCard.suit === uniqueCard.suit
                        && CompareCards(tavernCard, uniqueCard) === 0) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    uniqueArr.push(tavernCard);
                    return moveArgument;
                }
                flag = true;
            }
            throw new Error(`Отсутствует вариант выбора карты из таверны для ботов.`);
        },
        moveName: MoveNames.ClickCardMove,
        validate: () => true,
    },
    ClickCardToPickDistinctionMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return ExplorerDistinctionProfit(G, ctx, MoveValidatorNames.ClickCardToPickDistinctionMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickCardToPickDistinctionMove,
        validate: () => true,
    },
    ClickDistinctionCardMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return DrawDistinctions(G, ctx, MoveValidatorNames.ClickDistinctionCardMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickDistinctionCardMove,
        validate: () => true,
    },
    ClickHandCoinMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.ClickHandCoinMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickHandCoinMove,
        validate: () => true,
    },
    ClickHandCoinUlineMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.ClickHandCoinUlineMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickHandCoinUlineMove,
        validate: () => true,
    },
    ClickHandTradingCoinUlineMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.ClickHandTradingCoinUlineMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickHandTradingCoinUlineMove,
        validate: () => true,
    },
    DiscardCardFromPlayerBoardMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return DiscardAnyCardFromPlayerBoardProfit(G, ctx, MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, suitNames = [];
            let suit;
            for (suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(moveArguments, suit)) {
                    suitNames.push(suit);
                }
            }
            const suitName = suitNames[Math.floor(Math.random() * suitNames.length)];
            if (suitName === undefined) {
                throw new Error(`Отсутствует выбранная случайно фракция для сброса карты.`);
            }
            const moveArgumentForSuit = moveArguments[suitName];
            if (moveArgumentForSuit === undefined) {
                throw new Error(`Отсутствует обязательный параметр 'moveArguments[suitName]'.`);
            }
            const moveArgument = moveArgumentForSuit[Math.floor(Math.random() * moveArgumentForSuit.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return {
                suit: suitName,
                cardId: moveArgument,
            };
        },
        moveName: MoveNames.DiscardCardFromPlayerBoardMove,
        validate: () => true,
    },
    DiscardCard2PlayersMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return DiscardCardProfit(G, ctx, MoveValidatorNames.DiscardCard2PlayersMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.DiscardCard2PlayersMove,
        validate: () => true,
    },
    GetEnlistmentMercenariesMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return GetEnlistmentMercenariesProfit(G, ctx, MoveValidatorNames.GetEnlistmentMercenariesMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.GetEnlistmentMercenariesMove,
        validate: () => true,
    },
    GetMjollnirProfitMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return GetMjollnirProfitProfit(G, ctx, MoveValidatorNames.GetMjollnirProfitMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, totalSuitsRanks = [];
            for (let j = 0; j < moveArguments.length; j++) {
                const player = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                }
                const moveArgumentI = moveArguments[j];
                if (moveArgumentI === undefined) {
                    throw new Error(`В массиве аргументов мува отсутствует аргумент ${j}.`);
                }
                totalSuitsRanks.push(player.cards[moveArgumentI]
                    .reduce(TotalRank, 0) * 2);
            }
            const index = totalSuitsRanks.indexOf(Math.max(...totalSuitsRanks));
            if (index === -1) {
                throw new Error(`Должна быть хотя бы одна фракция с максимальным количеством шевронов.`);
            }
            const moveArgument = moveArguments[index];
            if (moveArgument === undefined) {
                throw new Error(`В массиве аргументов мува отсутствует аргумент ${index}.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.GetMjollnirProfitMove,
        validate: () => true,
    },
    PassEnlistmentMercenariesMoveValidator: {
        getRange: () => null,
        getValue: () => null,
        moveName: MoveNames.PassEnlistmentMercenariesMove,
        validate: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
            const mercenariesCount = player.campCards.filter((card) => IsMercenaryCampCard(card)).length;
            return ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                && mercenariesCount > 0;
        },
    },
    PlaceEnlistmentMercenariesMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return PlaceEnlistmentMercenariesProfit(G, ctx, MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.PlaceEnlistmentMercenariesMove,
        validate: () => true,
    },
    PlaceYludHeroMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return PlaceCardsProfit(G, ctx, MoveValidatorNames.PlaceYludHeroMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.PlaceYludHeroMove,
        validate: () => true,
    },
    StartEnlistmentMercenariesMoveValidator: {
        getRange: () => null,
        getValue: () => null,
        moveName: MoveNames.StartEnlistmentMercenariesMove,
        validate: () => true,
    },
    // start
    AddCoinToPouchMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return AddCoinToPouchProfit(G, ctx, MoveValidatorNames.AddCoinToPouchMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.AddCoinToPouchMove,
        validate: () => true,
    },
    ClickCampCardHoldaMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return PickCampCardHoldaProfit(G, ctx, MoveValidatorNames.ClickCampCardHoldaMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickCampCardHoldaMove,
        validate: () => true,
    },
    ClickCoinToUpgradeMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return UpgradeCoinProfit(G, ctx, MoveValidatorNames.ClickCoinToUpgradeMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickCoinToUpgradeMove,
        validate: (G, ctx, id) => {
            if (G === undefined || ctx === undefined || id === undefined || typeof id !== `object` || id === null
                || !(`coinId` in id)) {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'id' is undefined.`);
            }
            return CoinUpgradeValidation(G, ctx, id);
        },
    },
    ClickHeroCardMoveValidator: {
        getRange: (G) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            return DrawHeroes(G, MoveValidatorNames.ClickHeroCardMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickHeroCardMove,
        validate: (G, ctx, id) => {
            if (G === undefined || ctx === undefined || id === undefined || typeof id !== `number`) {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'id' is undefined.`);
            }
            let isValid = false;
            const hero = G.heroes[id];
            if (hero === undefined) {
                throw new Error(`В массиве карт героев отсутствует герой ${id}.`);
            }
            const validators = hero.validators;
            if (validators !== undefined) {
                for (const validator in validators) {
                    if (Object.prototype.hasOwnProperty.call(validators, validator)) {
                        switch (validator) {
                            case ValidatorNames.Conditions:
                                isValid = IsCanPickHeroWithConditionsValidator(G, ctx, id);
                                break;
                            case ValidatorNames.DiscardCard:
                                isValid = IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator(G, ctx, id);
                                break;
                            default:
                                isValid = true;
                                break;
                        }
                    }
                }
            }
            else {
                isValid = true;
            }
            return isValid;
        },
    },
    DiscardCardMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return DiscardCardFromBoardProfit(G, ctx, MoveValidatorNames.DiscardCardMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, suitNamesArray = [];
            let suit;
            for (suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(moveArguments, suit)) {
                    suitNamesArray.push(suit);
                }
            }
            const suitName = suitNamesArray[Math.floor(Math.random() * suitNamesArray.length)];
            if (suitName === undefined) {
                throw new Error(`Отсутствует выбранная случайно фракция для сброса карты.`);
            }
            const moveArgumentForSuit = moveArguments[suitName];
            if (moveArgumentForSuit === undefined) {
                throw new Error(`Отсутствует обязательный параметр 'moveArguments[suitName]'.`);
            }
            const moveArgument = moveArgumentForSuit[Math.floor(Math.random() * moveArgumentForSuit.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return {
                suit: suitName,
                cardId: moveArgument,
            };
        },
        moveName: MoveNames.DiscardCardMove,
        validate: () => true,
    },
    DiscardSuitCardFromPlayerBoardMoveValidator: {
        getRange: (G, ctx, playerId) => {
            if (G === undefined || ctx === undefined || playerId === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'playerId' is undefined.`);
            }
            return DiscardSuitCardFromPlayerBoardProfit(G, ctx, MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator, playerId);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, player = G.publicPlayers[moveArguments.playerId];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует игрок ${moveArguments.playerId}.`);
            }
            const cardFirst = player.cards[moveArguments.suit][0];
            if (cardFirst === undefined) {
                throw new Error(`В массиве карт игрока во фракции ${moveArguments.suit} отсутствует первая карта.`);
            }
            let minCardIndex = 0, minCardValue = cardFirst.points;
            moveArguments.cards.forEach((value, index) => {
                const card = player.cards[moveArguments.suit][value];
                if (card === undefined) {
                    throw new Error(`В массиве карт игрока во фракции ${moveArguments.suit} отсутствует карта ${value}.`);
                }
                const cardPoints = card.points;
                if (cardPoints === null || minCardValue === null) {
                    throw new Error(`Фракция должна иметь параметр 'points'.`);
                }
                if (cardPoints < minCardValue) {
                    minCardIndex = index;
                    minCardValue = cardPoints;
                }
            });
            const cardIndex = moveArguments.cards[minCardIndex];
            if (cardIndex === undefined) {
                throw new Error(`В массиве аргументов для 'cardId' отсутствует значение ${minCardIndex}.`);
            }
            return {
                playerId: moveArguments.playerId,
                suit: moveArguments.suit,
                cardId: cardIndex,
            };
        },
        moveName: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        // TODO validate Not bot playerId === ctx.currentPlayer & for Bot playerId exists in playersNum and card not hero?
        validate: () => true,
    },
    PickDiscardCardMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return PickDiscardCardProfit(G, ctx, MoveValidatorNames.PickDiscardCardMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.PickDiscardCardMove,
        validate: () => true,
    },
    PlaceOlwinCardMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return PlaceCardsProfit(G, ctx, MoveValidatorNames.PlaceOlwinCardMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.PlaceOlwinCardMove,
        validate: () => true,
    },
    PlaceThrudHeroMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'id' is undefined.`);
            }
            return PlaceCardsProfit(G, ctx, MoveValidatorNames.PlaceThrudHeroMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.PlaceThrudHeroMove,
        validate: () => true,
    },
    UpgradeCoinVidofnirVedrfolnirMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined || ctx === undefined) {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
            return UpgradeCoinVidofnirVedrfolnirProfit(G, ctx, MoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        validate: (G, ctx, id) => {
            var _a, _b;
            if (G === undefined || ctx === undefined || id === undefined || typeof id !== `object` || id === null
                || !(`coinId` in id)) {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'id' is undefined.`);
            }
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
            return ((_b = (_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.coinId) !== id.coinId && CoinUpgradeValidation(G, ctx, id);
        },
    },
    // end
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
export const moveBy = {
    placeCoins: {
        default1: moveValidators.ClickHandCoinMoveValidator,
        default2: moveValidators.ClickBoardCoinMoveValidator,
        default3: moveValidators.BotsPlaceAllCoinsMoveValidator,
    },
    placeCoinsUline: {
        default1: moveValidators.ClickHandCoinUlineMoveValidator,
    },
    pickCards: {
        default1: moveValidators.ClickCardMoveValidator,
        default2: moveValidators.ClickCampCardMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
        discardCard: moveValidators.DiscardCard2PlayersMoveValidator,
        placeTradingCoinsUline: moveValidators.ClickHandTradingCoinUlineMoveValidator,
    },
    enlistmentMercenaries: {
        default1: moveValidators.StartEnlistmentMercenariesMoveValidator,
        default2: moveValidators.PassEnlistmentMercenariesMoveValidator,
        default3: moveValidators.GetEnlistmentMercenariesMoveValidator,
        default4: moveValidators.PlaceEnlistmentMercenariesMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
    },
    endTier: {
        default1: moveValidators.PlaceYludHeroMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
    },
    getDistinctions: {
        default1: moveValidators.ClickDistinctionCardMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
        pickDistinctionCard: moveValidators.ClickCardToPickDistinctionMoveValidator,
    },
    brisingamensEndGame: {
        default1: moveValidators.DiscardCardFromPlayerBoardMoveValidator,
    },
    getMjollnirProfit: {
        default1: moveValidators.GetMjollnirProfitMoveValidator,
    },
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param value Значение для валидации.
 * @param values Массив значений, допустимых для прохождения валидации.
 * @returns
 */
const ValidateByValues = (value, values) => values.includes(value);
const ValidateByObjectCoinIdTypeIsInitialValues = (value, values) => values.findIndex((coin) => value.coinId === coin.coinId && value.type === coin.type && value.isInitial === coin.isInitial) !== -1;
const ValidateByObjectSuitCardIdValues = (value, values) => {
    const objectSuitCardIdValues = values[value.suit];
    return objectSuitCardIdValues !== undefined && objectSuitCardIdValues.includes(value.cardId);
};
const ValidateByObjectSuitCardIdPlayerIdValues = (value, values) => values.suit === value.suit
    && values.playerId === value.playerId && values.cards.includes(value.cardId);
//# sourceMappingURL=MoveValidator.js.map