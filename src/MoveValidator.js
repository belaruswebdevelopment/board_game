import { CompareCards, EvaluateCard } from "./bot_logic/BotCardLogic";
import { CheckHeuristicsForCoinsPlacement } from "./bot_logic/BotConfig";
import { CheckSoloBotCanPickHero, CheckSoloBotMustTakeCardToPickHero, CheckSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard, CheckSuitsLeastPresentOnPlayerBoard, SoloBotMustTakeRandomCard } from "./bot_logic/SoloBotCardLogic";
import { IsCoin } from "./Coin";
import { ThrowMyError } from "./Error";
import { HasLowestPriority } from "./helpers/PriorityHelpers";
import { CheckMinCoinVisibleIndexForSoloBot, CheckMinCoinVisibleValueForSoloBot } from "./helpers/SoloBotHelpers";
import { IsCanPickHeroWithConditionsValidator, IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator } from "./move_validators/IsCanPickCurrentHeroValidator";
import { TotalRank } from "./score_helpers/ScoreHelpers";
import { CoinTypeNames, ErrorNames, MoveNames, MoveValidatorNames, PhaseNames, PickHeroCardValidatorNames, RusCardTypeNames, StageNames, SuitNames } from "./typescript/enums";
import { DrawCamp, DrawDiscardedCards, DrawDistinctions, DrawHeroes, DrawHeroesForSoloBotUI, DrawTaverns } from "./ui/GameBoardUI";
import { DrawPlayersBoards, DrawPlayersBoardsCoins, DrawPlayersHandsCoins } from "./ui/PlayerUI";
import { ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit, ChooseDifficultyLevelForSoloModeProfit, ExplorerDistinctionProfit, PickHeroesForSoloModeProfit } from "./ui/ProfitUI";
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
    const player = G.publicPlayers[Number(ctx.currentPlayer)], privatePlayer = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
    }
    let handCoins, boardCoins;
    if (G.multiplayer) {
        handCoins = privatePlayer.handCoins;
        boardCoins = privatePlayer.boardCoins;
    }
    else {
        handCoins = player.handCoins;
        boardCoins = player.boardCoins;
    }
    const handCoin = handCoins[coinData.coinId], boardCoin = boardCoins[coinData.coinId];
    let _exhaustiveCheck;
    switch (coinData.type) {
        case CoinTypeNames.Hand:
            if (handCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${coinData.coinId}'.`);
            }
            if (handCoin === null) {
                throw new Error(`Выбранная для улучшения монета игрока с id '${ctx.currentPlayer}' в руке с id '${coinData.coinId}' не может отсутствовать там.`);
            }
            if (!IsCoin(handCoin)) {
                throw new Error(`Монета с id '${coinData.coinId}' в руке текущего игрока с id '${ctx.currentPlayer}' не может быть закрытой для него.`);
            }
            if (!handCoin.isTriggerTrading) {
                return true;
            }
            break;
        case CoinTypeNames.Board:
            if (boardCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе отсутствует монета с id '${coinData.coinId}'.`);
            }
            if (boardCoin === null) {
                throw new Error(`Выбранная для улучшения монета игрока с id '${ctx.currentPlayer}' на столе с id '${coinData.coinId}' не может отсутствовать там.`);
            }
            if (!IsCoin(boardCoin)) {
                throw new Error(`Монета с id '${coinData.coinId}' на столе текущего игрока с id '${ctx.currentPlayer}' не может быть закрытой для него.`);
            }
            if (!boardCoin.isTriggerTrading) {
                return true;
            }
            break;
        default:
            _exhaustiveCheck = coinData.type;
            throw new Error(`Не существует типа монеты - '${coinData.type}'.`);
            return _exhaustiveCheck;
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
            isValid =
                ValidateByValues(id, validator.getRange(G, ctx));
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
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param phase Фаза игры.
 * @param stage Стадия игры.
 * @returns
 */
export const GetValidator = (phase, stage) => {
    let validator, _exhaustiveCheck;
    switch (phase) {
        case PhaseNames.ChooseDifficultySoloMode:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.Bids:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.BidUline:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.TavernsResolution:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.EnlistmentMercenaries:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.PlaceYlud:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.TroopEvaluation:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.BrisingamensEndGame:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.GetMjollnirProfit:
            validator = moveBy[phase][stage];
            break;
        default:
            _exhaustiveCheck = phase;
            throw new Error(`Нет такого валидатора '${phase}'.`);
            return _exhaustiveCheck;
    }
    return validator;
};
// TODO MOVE ALL SAME VALIDATING LOGIC FROM GET RANGE/GET VALUE TO VALIDATE! And not same in another functions too to reduce logic here!
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
export const moveValidators = {
    ClickBoardCoinMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
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
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawCamp(G, ctx, MoveValidatorNames.ClickCampCardMoveValidator);
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
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
            }
            return G.expansions.thingvellir.active && (ctx.currentPlayer === G.publicPlayersOrder[0]
                || (!G.campPicked && player.buffs.find((buff) => buff.goCamp !== undefined) !== undefined));
        },
    },
    ClickCardMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawTaverns(G, ctx, MoveValidatorNames.ClickCardMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            // TODO Get MythologicalCreature cards for bots...
            const moveArguments = currentMoveArguments;
            if (!G.solo || (G.solo && ctx.currentPlayer === `0`)) {
                const uniqueArr = [], currentTavern = G.taverns[G.currentTavern];
                if (currentTavern === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.CurrentTavernIsUndefined, G.currentTavern);
                }
                let flag = true;
                for (let i = 0; i < moveArguments.length; i++) {
                    const moveArgument = moveArguments[i];
                    if (moveArgument === undefined) {
                        throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
                    }
                    const tavernCard = currentTavern[moveArgument];
                    if (tavernCard === undefined) {
                        throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
                    }
                    if (tavernCard === null) {
                        throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карты с id '${moveArgument}'.`);
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
                            throw new Error(`В массиве уникальных карт отсутствует карта с id '${j}'.`);
                        }
                        if (tavernCard.type === RusCardTypeNames.Dwarf_Card
                            && uniqueCard.type === RusCardTypeNames.Dwarf_Card
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
            }
            else if (G.solo && ctx.currentPlayer === `1`) {
                let moveArgument;
                moveArgument = CheckSoloBotMustTakeCardToPickHero(G, ctx, moveArguments);
                if (moveArgument === undefined) {
                    moveArgument = CheckSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard(G, ctx, moveArguments);
                }
                // Todo Think about picking Royal Offering if other cards not LeastPresentOnPlayerBoard...
                if (moveArgument === undefined) {
                    moveArgument = SoloBotMustTakeRandomCard(G, moveArguments);
                }
                if (moveArgument !== undefined) {
                    return moveArgument;
                }
            }
            throw new Error(`Отсутствует вариант выбора карты из таверны для ботов.`);
        },
        moveName: MoveNames.ClickCardMove,
        validate: () => true,
    },
    ClickCardToPickDistinctionMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return ExplorerDistinctionProfit(G, ctx, MoveValidatorNames.ClickCardToPickDistinctionMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            // TODO Add for Solo Bot!
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
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
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
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
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
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
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
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
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
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator, null);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, suitNames = [];
            let suit;
            for (suit in moveArguments) {
                suitNames.push(suit);
            }
            const suitName = suitNames[Math.floor(Math.random() * suitNames.length)];
            if (suitName === undefined) {
                throw new Error(`Отсутствует выбранная случайно фракция '${suitName}' для сброса карты.`);
            }
            const moveArgumentForSuit = moveArguments[suitName];
            if (moveArgumentForSuit === undefined) {
                throw new Error(`Отсутствует обязательный параметр с аргументом '${suitName}'.`);
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
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawTaverns(G, ctx, MoveValidatorNames.DiscardCard2PlayersMoveValidator);
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
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.GetEnlistmentMercenariesMoveValidator, null);
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
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.GetMjollnirProfitMoveValidator, null);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, totalSuitsRanks = [];
            for (let j = 0; j < moveArguments.length; j++) {
                const player = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
                }
                const moveArgumentI = moveArguments[j];
                if (moveArgumentI === undefined) {
                    throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${j}'.`);
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
                throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${index}'.`);
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
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
            }
            const mercenariesCount = player.campCards.filter((card) => card.type === RusCardTypeNames.Mercenary_Card).length;
            return ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                && mercenariesCount > 0;
        },
    },
    PlaceEnlistmentMercenariesMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator, null);
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
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceYludHeroMoveValidator, null);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            // TODO Add for Solo Bot!
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
    // Bots
    BotsPlaceAllCoinsMoveValidator: {
        getRange: (G) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            return G.botData.allCoinsOrder;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const allCoinsOrder = currentMoveArguments, hasLowestPriority = HasLowestPriority(G, ctx, Number(ctx.currentPlayer));
            let resultsForCoins = CheckHeuristicsForCoinsPlacement(G, ctx);
            if (hasLowestPriority) {
                resultsForCoins = resultsForCoins.map((num, index) => index === 0 ? num - 20 : num);
            }
            const minResultForCoins = Math.min(...resultsForCoins), maxResultForCoins = Math.max(...resultsForCoins), deck = G.secret.decks[G.secret.decks.length - 1];
            if (deck === undefined) {
                throw new Error(`В массиве дек карт отсутствует дека '${G.secret.decks.length - 1}' эпохи.`);
            }
            const tradingProfit = deck.length > 9 ? 1 : 0;
            let [positionForMinCoin, positionForMaxCoin] = [-1, -1];
            if (minResultForCoins <= 0) {
                positionForMinCoin = resultsForCoins.indexOf(minResultForCoins);
            }
            if (maxResultForCoins >= 0) {
                positionForMaxCoin = resultsForCoins.indexOf(maxResultForCoins);
            }
            // TODO Check it bot can't play in multiplayer now...
            const player = G.publicPlayers[Number(ctx.currentPlayer)], privatePlayer = G.players[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
            }
            if (privatePlayer === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
            }
            let handCoins;
            if (G.multiplayer) {
                handCoins = privatePlayer.handCoins;
            }
            else {
                handCoins = player.handCoins;
            }
            for (let i = 0; i < allCoinsOrder.length; i++) {
                const allCoinsOrderI = allCoinsOrder[i];
                if (allCoinsOrderI === undefined) {
                    throw new Error(`В массиве выкладки монет отсутствует выкладка '${i}'.`);
                }
                const hasTrading = allCoinsOrderI.some((coinId) => {
                    const handCoin = handCoins[coinId];
                    if (handCoin === undefined) {
                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${coinId}'.`);
                    }
                    if (handCoin !== null && !IsCoin(handCoin)) {
                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${coinId}'.`);
                    }
                    if (IsCoin(handCoin) && handCoin.isOpened) {
                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${coinId}'.`);
                    }
                    return Boolean(handCoin === null || handCoin === void 0 ? void 0 : handCoin.isTriggerTrading);
                });
                // TODO How tradingProfit can be < 0?
                if (tradingProfit < 0) {
                    if (hasTrading) {
                        continue;
                    }
                    return allCoinsOrderI;
                }
                else if (tradingProfit > 0) {
                    const isEveryCoinsInHands = handCoins.every((coin, index) => {
                        if (coin !== null && !IsCoin(coin)) {
                            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${index}'.`);
                        }
                        if (IsCoin(coin) && coin.isOpened) {
                            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${index}'.`);
                        }
                        return IsCoin(coin);
                    });
                    if (!hasTrading && isEveryCoinsInHands) {
                        continue;
                    }
                    if (positionForMaxCoin === undefined) {
                        throw new Error(`Отсутствуют значения выкладки для максимальной монеты.`);
                    }
                    if (positionForMinCoin === undefined) {
                        throw new Error(`Отсутствуют значения выкладки для минимальной монеты.`);
                    }
                    const hasPositionForMaxCoin = positionForMaxCoin !== -1, hasPositionForMinCoin = positionForMinCoin !== -1, coinsOrderPositionForMaxCoin = allCoinsOrderI[positionForMaxCoin], coinsOrderPositionForMinCoin = allCoinsOrderI[positionForMinCoin];
                    if (coinsOrderPositionForMaxCoin !== undefined && coinsOrderPositionForMinCoin !== undefined) {
                        const maxCoin = handCoins[coinsOrderPositionForMaxCoin], minCoin = handCoins[coinsOrderPositionForMinCoin];
                        if (maxCoin === undefined) {
                            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует максимальная монета с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (minCoin === undefined) {
                            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует минимальная монета с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        if (maxCoin === null) {
                            throw new Error(`В массиве выкладки монет игрока с id '${ctx.currentPlayer}' не может не быть максимальной монеты с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (minCoin === null) {
                            throw new Error(`В массиве выкладки монет игрока с id '${ctx.currentPlayer}' не может не быть минимальной монеты с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        if (!IsCoin(maxCoin)) {
                            throw new Error(`В массиве выкладки монет игрока с id '${ctx.currentPlayer}' не может быть закрыта максимальная монета с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (!IsCoin(minCoin)) {
                            throw new Error(`В массиве выкладки монет игрока с id '${ctx.currentPlayer}' не может быть закрыта минимальная монета с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        if (IsCoin(maxCoin) && maxCoin.isOpened) {
                            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта максимальная монета с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (IsCoin(minCoin) && minCoin.isOpened) {
                            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта максимальная монета с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        let isTopCoinsOnPosition = false, isMinCoinsOnPosition = false;
                        if (hasPositionForMaxCoin) {
                            isTopCoinsOnPosition = allCoinsOrderI.filter((coinIndex) => {
                                const handCoin = handCoins[coinIndex];
                                if (handCoin === undefined) {
                                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${coinIndex}'.`);
                                }
                                if (handCoin !== null && !IsCoin(handCoin)) {
                                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${coinIndex}'.`);
                                }
                                if (IsCoin(handCoin) && handCoin.isOpened) {
                                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${coinIndex}'.`);
                                }
                                return IsCoin(handCoin) && handCoin.value > maxCoin.value;
                            }).length <= 1;
                        }
                        if (hasPositionForMinCoin) {
                            isMinCoinsOnPosition =
                                handCoins.filter((coin, index) => {
                                    if (coin !== null && !IsCoin(coin)) {
                                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${index}'.`);
                                    }
                                    if (IsCoin(coin) && coin.isOpened) {
                                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${index}'.`);
                                    }
                                    return IsCoin(coin) && coin.value < minCoin.value;
                                }).length <= 1;
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
    // Solo Bot
    SoloBotPlaceAllCoinsMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.SoloBotPlaceAllCoinsMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => currentMoveArguments,
        moveName: MoveNames.SoloBotPlaceAllCoinsMove,
        validate: () => true,
    },
    SoloBotClickHeroCardMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawHeroesForSoloBotUI(G, ctx, MoveValidatorNames.SoloBotClickHeroCardMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.SoloBotClickHeroCardMove,
        validate: () => true,
    },
    // Solo Mode
    ChooseDifficultyLevelForSoloModeMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return ChooseDifficultyLevelForSoloModeProfit(G, ctx, MoveValidatorNames.ChooseDifficultyLevelForSoloModeMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ChooseDifficultyLevelForSoloModeMove,
        validate: () => true,
    },
    ChooseHeroesForSoloModeMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return PickHeroesForSoloModeProfit(G, ctx, MoveValidatorNames.ChooseHeroesForSoloModeMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ChooseHeroForDifficultySoloModeMove,
        validate: () => true,
    },
    // start
    AddCoinToPouchMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.AddCoinToPouchMoveValidator);
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
    ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit(G, ctx, MoveValidatorNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMove,
        validate: () => true,
    },
    ClickCampCardHoldaMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawCamp(G, ctx, MoveValidatorNames.ClickCampCardHoldaMoveValidator);
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
    PickConcreteCoinToUpgradeMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoardsCoins(G, ctx, MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator).concat(DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator));
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickConcreteCoinToUpgradeMove,
        validate: (G, ctx, id) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            if (id === undefined) {
                throw new Error(`Function param 'id' is undefined.`);
            }
            if (typeof id !== `object`) {
                throw new Error(`Function param 'id' isn't object.`);
            }
            if (id === null) {
                throw new Error(`Function param 'id' is null.`);
            }
            if (!(`coinId` in id)) {
                throw new Error(`Function param 'id' hasn't 'coinId'.`);
            }
            return CoinUpgradeValidation(G, ctx, id);
        },
    },
    ClickCoinToUpgradeMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoardsCoins(G, ctx, MoveValidatorNames.ClickCoinToUpgradeMoveValidator).concat(DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.ClickCoinToUpgradeMoveValidator));
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            let moveArgument;
            if (G.solo && ctx.currentPlayer === `1`) {
                const player = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
                }
                let type, coins;
                if (ctx.phase === PhaseNames.ChooseDifficultySoloMode) {
                    type = CoinTypeNames.Hand;
                    coins = player.handCoins;
                }
                else {
                    type = CoinTypeNames.Board;
                    coins = player.boardCoins;
                }
                const minValue = CheckMinCoinVisibleValueForSoloBot(G, ctx, moveArguments, type);
                if (minValue === 0) {
                    throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может быть минимальная монета для улучшения с значением '${minValue}'.`);
                }
                const coinId = CheckMinCoinVisibleIndexForSoloBot(coins, minValue);
                if (coinId === -1) {
                    throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не найдена минимальная монета с значением '${minValue}'.`);
                }
                moveArgument = moveArguments[coinId];
            }
            else {
                moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            }
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickCoinToUpgradeMove,
        validate: (G, ctx, id) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            if (id === undefined) {
                throw new Error(`Function param 'id' is undefined.`);
            }
            if (typeof id !== `object`) {
                throw new Error(`Function param 'id' isn't object.`);
            }
            if (id === null) {
                throw new Error(`Function param 'id' is null.`);
            }
            if (!(`coinId` in id)) {
                throw new Error(`Function param 'id' hasn't field 'coinId'.`);
            }
            return CoinUpgradeValidation(G, ctx, id);
        },
    },
    ClickHeroCardMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawHeroes(G, ctx, MoveValidatorNames.ClickHeroCardMoveValidator);
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
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            if (id === undefined) {
                throw new Error(`Function param 'id' is undefined.`);
            }
            if (typeof id !== `number`) {
                throw new Error(`Function param 'id' isn't number.`);
            }
            let isValid = false;
            const hero = G.heroes[id];
            if (hero === undefined) {
                throw new Error(`В массиве карт героев отсутствует герой с id '${id}'.`);
            }
            const validators = hero.pickValidators;
            if (validators !== undefined) {
                let validator;
                for (validator in validators) {
                    switch (validator) {
                        case PickHeroCardValidatorNames.Conditions:
                            isValid = IsCanPickHeroWithConditionsValidator(G, ctx, id);
                            break;
                        case PickHeroCardValidatorNames.DiscardCard:
                            isValid = IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator(G, ctx, id);
                            break;
                        default:
                            throw new Error(`Отсутствует валидатор ${validator} для выбора карт героя.`);
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
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.DiscardCardMoveValidator, null);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, suitNamesArray = [];
            let suit;
            for (suit in moveArguments) {
                suitNamesArray.push(suit);
            }
            const suitName = suitNamesArray[Math.floor(Math.random() * suitNamesArray.length)];
            if (suitName === undefined) {
                throw new Error(`Отсутствует выбранная случайно фракция для сброса карты.`);
            }
            const moveArgumentForSuit = moveArguments[suitName];
            if (moveArgumentForSuit === undefined) {
                throw new Error(`Отсутствует обязательный параметр с аргументом '${suitName}'.`);
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
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            if (playerId === undefined) {
                throw new Error(`Function param 'playerId' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator, playerId);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, player = G.publicPlayers[moveArguments.playerId];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, moveArguments.playerId);
            }
            const cardFirst = player.cards[SuitNames.Warrior][0];
            if (cardFirst === undefined) {
                throw new Error(`В массиве карт игрока во фракции '${SuitNames.Warrior}' отсутствует первая карта.`);
            }
            let minCardIndex = 0, minCardValue = cardFirst.points;
            moveArguments.cards.forEach((value, index) => {
                const card = player.cards[SuitNames.Warrior][value];
                if (card === undefined) {
                    throw new Error(`В массиве карт игрока во фракции '${SuitNames.Warrior}' отсутствует карта ${value}.`);
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
                throw new Error(`В массиве аргументов для 'cardId' отсутствует значение с id '${minCardIndex}'.`);
            }
            return {
                playerId: moveArguments.playerId,
                cardId: cardIndex,
            };
        },
        moveName: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        // TODO validate Not bot playerId === ctx.currentPlayer & for Bot playerId exists in playersNum and card not hero?
        validate: () => true,
    },
    PickDiscardCardMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawDiscardedCards(G, ctx, MoveValidatorNames.PickDiscardCardMoveValidator);
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
    PlaceMultiSuitCardMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceMultiSuitCardMoveValidator, null);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.PlaceMultiSuitCardMove,
        validate: () => true,
    },
    PlaceThrudHeroMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceThrudHeroMoveValidator, null);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            // TODO Same logic for Ylud placement!
            const moveArguments = currentMoveArguments;
            let moveArgument;
            if (G.solo && ctx.currentPlayer === `1`) {
                const soloBotPublicPlayer = G.publicPlayers[1];
                if (soloBotPublicPlayer === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, 1);
                }
                const suit = CheckSoloBotCanPickHero(G, ctx, soloBotPublicPlayer);
                if (suit === undefined) {
                    const [suits] = CheckSuitsLeastPresentOnPlayerBoard(G, ctx, soloBotPublicPlayer);
                    if (suits.length === 0) {
                        throw new Error(`Не может не быть фракций с минимальным количеством карт.`);
                    }
                    else if (suits.length === 1) {
                        moveArgument = suits[0];
                    }
                    else {
                        // TODO Move Thrud in most left suit from `suits`
                    }
                }
                else {
                    moveArgument = suit;
                }
            }
            else {
                moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            }
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
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoardsCoins(G, ctx, MoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator);
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
            var _a;
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            if (id === undefined) {
                throw new Error(`Function param 'id' is undefined.`);
            }
            if (typeof id !== `object`) {
                throw new Error(`Function param 'id' isn't object.`);
            }
            if (id === null) {
                throw new Error(`Function param 'id' is null.`);
            }
            if (!(`coinId` in id)) {
                throw new Error(`Function param 'id' hasn't 'coinId'.`);
            }
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
            }
            return ((_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.coinId) !== id.coinId && CoinUpgradeValidation(G, ctx, id);
        },
    },
    // TODO Do it logic!
    UseGodPowerMoveValidator: {
        getRange: (G, ctx) => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.UseGodPowerMoveValidator, null);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.UseGodPowerMove,
        validate: () => true,
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
    chooseDifficultySoloMode: {
        default1: moveValidators.ChooseDifficultyLevelForSoloModeMoveValidator,
        chooseHeroesForSoloMode: moveValidators.ChooseHeroesForSoloModeMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
    },
    bids: {
        default1: moveValidators.ClickHandCoinMoveValidator,
        default2: moveValidators.ClickBoardCoinMoveValidator,
        // Bots
        default3: moveValidators.BotsPlaceAllCoinsMoveValidator,
        // Solo Bot
        default4: moveValidators.SoloBotPlaceAllCoinsMoveValidator,
    },
    bidUline: {
        default1: moveValidators.ClickHandCoinUlineMoveValidator,
    },
    tavernsResolution: {
        default1: moveValidators.ClickCardMoveValidator,
        default2: moveValidators.ClickCampCardMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        chooseCoinValueForVidofnirVedrfolnirUpgrade: moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickConcreteCoinToUpgrade: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeMultiSuitsCards: moveValidators.PlaceMultiSuitCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        useGodPower: moveValidators.UseGodPowerMoveValidator,
        // end
        discardCard: moveValidators.DiscardCard2PlayersMoveValidator,
        placeTradingCoinsUline: moveValidators.ClickHandTradingCoinUlineMoveValidator,
        // Solo Bot
        pickHeroSoloBot: moveValidators.SoloBotClickHeroCardMoveValidator,
    },
    enlistmentMercenaries: {
        default1: moveValidators.StartEnlistmentMercenariesMoveValidator,
        default2: moveValidators.PassEnlistmentMercenariesMoveValidator,
        default3: moveValidators.GetEnlistmentMercenariesMoveValidator,
        placeEnlistmentMercenaries: moveValidators.PlaceEnlistmentMercenariesMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        chooseCoinValueForVidofnirVedrfolnirUpgrade: moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickConcreteCoinToUpgrade: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeMultiSuitsCards: moveValidators.PlaceMultiSuitCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        useGodPower: moveValidators.UseGodPowerMoveValidator,
        // end
    },
    placeYlud: {
        default1: moveValidators.PlaceYludHeroMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        chooseCoinValueForVidofnirVedrfolnirUpgrade: moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickConcreteCoinToUpgrade: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeMultiSuitsCards: moveValidators.PlaceMultiSuitCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        useGodPower: moveValidators.UseGodPowerMoveValidator,
        // end
    },
    troopEvaluation: {
        default1: moveValidators.ClickDistinctionCardMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        chooseCoinValueForVidofnirVedrfolnirUpgrade: moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickConcreteCoinToUpgrade: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeMultiSuitsCards: moveValidators.PlaceMultiSuitCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        useGodPower: moveValidators.UseGodPowerMoveValidator,
        // end
        pickDistinctionCard: moveValidators.ClickCardToPickDistinctionMoveValidator,
        // Solo Bot
        pickHeroSoloBot: moveValidators.SoloBotClickHeroCardMoveValidator,
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
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param value
 * @param values
 * @returns
 */
const ValidateByObjectCoinIdTypeIsInitialValues = (value, values) => values.findIndex((coin) => value.coinId === coin.coinId && value.type === coin.type) !== -1;
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param value
 * @param values
 * @returns
 */
const ValidateByObjectSuitCardIdValues = (value, values) => {
    const objectSuitCardIdValues = values[value.suit];
    return objectSuitCardIdValues !== undefined && objectSuitCardIdValues.includes(value.cardId);
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param value
 * @param values
 * @returns
 */
const ValidateByObjectSuitCardIdPlayerIdValues = (value, values) => values.playerId === value.playerId && values.cards.includes(value.cardId);
//# sourceMappingURL=MoveValidator.js.map