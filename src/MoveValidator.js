import { CompareCards, EvaluateCard } from "./bot_logic/BotCardLogic";
import { CheckHeuristicsForCoinsPlacement } from "./bot_logic/BotConfig";
import { isCardNotAction } from "./Card";
import { suitsConfig } from "./data/SuitData";
import { TotalRank } from "./helpers/ScoreHelpers";
import { IsCanPickHeroWithConditionsValidator, IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator } from "./move_validators/IsCanPickCurrentHeroValidator";
import { HasLowestPriority } from "./Priority";
import { HeroNames, MoveNames, Phases, RusCardTypes, Stages } from "./typescript/enums";
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
 * @param coinId
 * @param type
 * @returns
 */
export const CoinUpgradeValidation = (G, ctx, coinId, type) => {
    var _a, _b;
    if (type === "hand") {
        const handCoinPosition = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
            .filter((coin, index) => coin === null && index <= coinId).length;
        if (!((_a = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .filter((coin) => coin !== null)[handCoinPosition - 1]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading)) {
            return true;
        }
    }
    else {
        if (!((_b = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[coinId]) === null || _b === void 0 ? void 0 : _b.isTriggerTrading)) {
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
 * @param obj Параметры валидации мува.
 * @returns Валидный ли мув.
 */
export const IsValidMove = (G, ctx, stage, id) => {
    let isValid = false;
    if (typeof id === `number`) {
        isValid = ValidateByValues(id, moveValidators[moveBy[ctx.phase][stage]].getRange(G, ctx));
    }
    else if (typeof id === `string`) {
        isValid = ValidateByValues(id, moveValidators[moveBy[ctx.phase][stage]].getRange(G, ctx));
    }
    else if (typeof id === `object` && !Array.isArray(id) && id !== null) {
        if (`suit` in id) {
            isValid = ValidateByObjectSuitIdValues(id, moveValidators[moveBy[ctx.phase][stage]].getRange(G, ctx));
        }
        else if (`coinId` in id) {
            isValid = ValidateByObjectCoinIdTypeIsInitialValues(id, moveValidators[moveBy[ctx.phase][stage]].getRange(G, ctx));
        }
    }
    else {
        isValid = true;
    }
    if (isValid) {
        return moveValidators[moveBy[ctx.phase][stage]].validate(G, ctx, id);
    }
    return isValid;
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
    null: {},
    [Phases.PlaceCoins]: {
        default1: MoveNames.ClickHandCoinMove,
        default2: MoveNames.ClickBoardCoinMove,
        default3: MoveNames.BotsPlaceAllCoinsMove,
    },
    [Phases.PlaceCoinsUline]: {
        default1: MoveNames.ClickHandCoinMove,
        default2: MoveNames.ClickBoardCoinMove,
    },
    [Phases.PickCards]: {
        default1: MoveNames.ClickCardMove,
        default2: MoveNames.ClickCampCardMove,
        // start
        [Stages.AddCoinToPouch]: MoveNames.AddCoinToPouchMove,
        [Stages.DiscardBoardCard]: MoveNames.DiscardCardMove,
        [Stages.DiscardSuitCard]: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        [Stages.PickCampCardHolda]: MoveNames.ClickCampCardHoldaMove,
        [Stages.PickDiscardCard]: MoveNames.PickDiscardCardMove,
        [Stages.PickHero]: MoveNames.ClickHeroCardMove,
        [Stages.PlaceCards]: MoveNames.PlaceCardMove,
        [Stages.UpgradeCoin]: MoveNames.ClickCoinToUpgradeMove,
        [Stages.UpgradeVidofnirVedrfolnirCoin]: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        // end
        [Stages.DiscardCard]: MoveNames.DiscardCard2PlayersMove,
        // TODO Fix it!
        [Stages.PlaceTradingCoinsUline]: MoveNames.ClickHandCoinMove,
        // [Stages.PlaceTradingCoinsUline]: MoveNames.ClickBoardCoinMove,
    },
    [Phases.EnlistmentMercenaries]: {
        default1: MoveNames.StartEnlistmentMercenariesMove,
        default2: MoveNames.PassEnlistmentMercenariesMove,
        default3: MoveNames.GetEnlistmentMercenariesMove,
        default4: MoveNames.PlaceEnlistmentMercenariesMove,
        // start
        [Stages.AddCoinToPouch]: MoveNames.AddCoinToPouchMove,
        [Stages.DiscardBoardCard]: MoveNames.DiscardCardMove,
        [Stages.DiscardSuitCard]: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        [Stages.PickCampCardHolda]: MoveNames.ClickCampCardHoldaMove,
        [Stages.PickDiscardCard]: MoveNames.PickDiscardCardMove,
        [Stages.PickHero]: MoveNames.ClickHeroCardMove,
        [Stages.PlaceCards]: MoveNames.PlaceCardMove,
        [Stages.UpgradeCoin]: MoveNames.ClickCoinToUpgradeMove,
        [Stages.UpgradeVidofnirVedrfolnirCoin]: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        // end
    },
    [Phases.EndTier]: {
        default1: MoveNames.PlaceCardMove,
        // start
        [Stages.AddCoinToPouch]: MoveNames.AddCoinToPouchMove,
        [Stages.DiscardBoardCard]: MoveNames.DiscardCardMove,
        [Stages.DiscardSuitCard]: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        [Stages.PickCampCardHolda]: MoveNames.ClickCampCardHoldaMove,
        [Stages.PickDiscardCard]: MoveNames.PickDiscardCardMove,
        [Stages.PickHero]: MoveNames.ClickHeroCardMove,
        [Stages.PlaceCards]: MoveNames.PlaceCardMove,
        [Stages.UpgradeCoin]: MoveNames.ClickCoinToUpgradeMove,
        [Stages.UpgradeVidofnirVedrfolnirCoin]: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        // end
    },
    [Phases.GetDistinctions]: {
        default1: MoveNames.ClickDistinctionCardMove,
        // start
        [Stages.AddCoinToPouch]: MoveNames.AddCoinToPouchMove,
        [Stages.DiscardBoardCard]: MoveNames.DiscardCardMove,
        [Stages.DiscardSuitCard]: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        [Stages.PickCampCardHolda]: MoveNames.ClickCampCardHoldaMove,
        [Stages.PickDiscardCard]: MoveNames.PickDiscardCardMove,
        [Stages.PickHero]: MoveNames.ClickHeroCardMove,
        [Stages.PlaceCards]: MoveNames.PlaceCardMove,
        [Stages.UpgradeCoin]: MoveNames.ClickCoinToUpgradeMove,
        [Stages.UpgradeVidofnirVedrfolnirCoin]: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        // end
        [Stages.PickDistinctionCard]: MoveNames.ClickCardToPickDistinctionMove,
    },
    [Phases.BrisingamensEndGame]: {
        default1: MoveNames.DiscardCardFromPlayerBoardMove,
    },
    [Phases.GetMjollnirProfit]: {
        defaul1: MoveNames.GetMjollnirProfitMove,
    },
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
export const moveValidators = {
    // TODO Add all validators to all moves
    [MoveNames.BotsPlaceAllCoinsMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default3].arrayNumbers,
        getValue: (G, ctx) => {
            const hasLowestPriority = HasLowestPriority(G, Number(ctx.currentPlayer));
            let resultsForCoins = CheckHeuristicsForCoinsPlacement(G, ctx);
            if (hasLowestPriority) {
                resultsForCoins = resultsForCoins.map((num, index) => index === 0 ? num - 20 : num);
            }
            const minResultForCoins = Math.min(...resultsForCoins), maxResultForCoins = Math.max(...resultsForCoins), tradingProfit = G.decks[G.decks.length - 1].length > 9 ? 1 : 0;
            let [positionForMinCoin, positionForMaxCoin] = [-1, -1];
            if (minResultForCoins <= 0) {
                positionForMinCoin = resultsForCoins.indexOf(minResultForCoins);
            }
            if (maxResultForCoins >= 0) {
                positionForMaxCoin = resultsForCoins.indexOf(maxResultForCoins);
            }
            const allCoinsOrder = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default3].arrayNumbers, handCoins = G.publicPlayers[Number(ctx.currentPlayer)].handCoins;
            for (let i = 0; i < allCoinsOrder.length; i++) {
                const hasTrading = allCoinsOrder[i].some((coinId) => { var _a; return Boolean((_a = handCoins[coinId]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading); });
                if (tradingProfit < 0) {
                    if (hasTrading) {
                        continue;
                    }
                    return allCoinsOrder[i];
                }
                else if (tradingProfit > 0) {
                    if (!hasTrading) {
                        continue;
                    }
                    const hasPositionForMaxCoin = positionForMaxCoin !== -1, hasPositionForMinCoin = positionForMinCoin !== -1, maxCoin = handCoins[allCoinsOrder[i][positionForMaxCoin]], minCoin = handCoins[allCoinsOrder[i][positionForMinCoin]];
                    if (maxCoin && minCoin) {
                        let isTopCoinsOnPosition = false, isMinCoinsOnPosition = false;
                        if (hasPositionForMaxCoin) {
                            isTopCoinsOnPosition =
                                allCoinsOrder[i].filter((coinIndex) => handCoins[coinIndex] !== null
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    && handCoins[coinIndex].value > maxCoin.value).length <= 1;
                        }
                        if (hasPositionForMinCoin) {
                            isMinCoinsOnPosition = handCoins.filter((coin) => coin !== null
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                && coin.value < minCoin.value).length <= 1;
                        }
                        if (isTopCoinsOnPosition && isMinCoinsOnPosition) {
                            return allCoinsOrder[i];
                            //console.log(`#` + i.toString().padStart(2) + `: ` + allCoinsOrder[i].map(item => handCoins[item].value));
                        }
                    }
                }
                else {
                    return allCoinsOrder[i];
                }
            }
            // TODO FIx it!
            return [];
        },
        validate: () => true,
    },
    [MoveNames.ClickBoardCoinMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default2].numbers,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default2].numbers;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G, ctx, id) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
                isValid = G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin !== undefined
                    && G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[id] === null;
            }
            return isValid;
        },
    },
    [MoveNames.ClickCampCardMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default1].numbers,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default1].numbers;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G, ctx) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined) {
                isValid = G.expansions.thingvellir.active && (ctx.currentPlayer === G.publicPlayersOrder[0]
                    || (!G.campPicked && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp)));
            }
            return isValid;
        },
    },
    [MoveNames.ClickCardMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default2].numbers,
        getValue: (G, ctx) => {
            // TODO G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default2].numbers !== G.taverns[G.currentTavern] becouse has no null cards!!!
            const uniqueArr = [], tavern = G.taverns[G.currentTavern];
            let flag = true;
            for (let i = 0; i < tavern.length; i++) {
                const tavernCard = tavern[i];
                if (tavernCard === null) {
                    continue;
                }
                if (tavern.some((card) => CompareCards(tavernCard, card) < 0)) {
                    continue;
                }
                const isCurrentCardWorse = EvaluateCard(G, ctx, tavernCard, i, tavern) < 0, isExistCardNotWorse = tavern.some((card) => (card !== null)
                    && (EvaluateCard(G, ctx, tavernCard, i, tavern) >= 0));
                if (isCurrentCardWorse && isExistCardNotWorse) {
                    continue;
                }
                const uniqueArrLength = uniqueArr.length;
                for (let j = 0; j < uniqueArrLength; j++) {
                    const uniqueCard = uniqueArr[j];
                    if (isCardNotAction(tavernCard) && isCardNotAction(uniqueCard)
                        && tavernCard.suit === uniqueCard.suit
                        && CompareCards(tavernCard, uniqueCard) === 0) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    uniqueArr.push(tavernCard);
                    return i;
                }
                flag = true;
            }
            // TODO FIX it!
            return -1;
        },
        validate: () => true,
    },
    [MoveNames.ClickCardToPickDistinctionMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)]
            .phases[ctx.phase][Stages.PickDistinctionCard].numbers,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.PickDistinctionCard].numbers;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: () => true,
    },
    [MoveNames.ClickDistinctionCardMove]: {
        // TODO Rework with validator in Move:
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default1].strings,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default1].strings;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G, ctx, id) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `string`) {
                // TODO ID === SUIT NOT NUMBER!
                const suitDistinctionIndex = Object.keys(G.distinctions).findIndex((suit) => suit === id);
                isValid = Object.keys(G.distinctions).includes(id)
                    && Object.keys(G.distinctions).filter((suit) => suit !== undefined
                        && suit !== null).findIndex((suit) => suit === id) ===
                        ctx.playOrderPos && G.distinctions[suitDistinctionIndex] === ctx.currentPlayer;
            }
            return isValid;
        }
    },
    [MoveNames.ClickHandCoinMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default1].numbers,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default1].numbers;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G, ctx, id) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
                isValid = G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin === undefined
                    && G.publicPlayers[Number(ctx.currentPlayer)].handCoins[id] !== null;
            }
            return isValid;
        },
    },
    [MoveNames.DiscardCardFromPlayerBoardMove]: {
        getRange: (G, ctx) => 
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.DiscardSuitCard].suits,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.DiscardSuitCard].suits, suitNames = [];
            let suitName = ``;
            for (const suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    suitNames.push(suit);
                }
            }
            suitName = suitNames[Math.floor(Math.random() * suitNames.length)];
            return {
                suit: suitName,
                cardId: moveArguments[suitName][Math.floor(Math.random() * moveArguments[suitName].length)],
            };
        },
        validate: () => true,
    },
    [MoveNames.DiscardCard2PlayersMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.DiscardCard].numbers,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.DiscardCard].numbers;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G, ctx) => {
            let isValid = false;
            if (ctx !== undefined) {
                isValid = ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1];
            }
            return isValid;
        },
    },
    [MoveNames.GetEnlistmentMercenariesMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default3].numbers,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default3].numbers;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: () => true,
    },
    [MoveNames.GetMjollnirProfitMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default1].strings,
        getValue: (G, ctx) => {
            const totalSuitsRanks = [];
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            for (let j = 0; j < G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default1].strings[0].length; j++) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const suit = G.currentMoveArguments[Number(ctx.currentPlayer)]
                    .phases[ctx.phase][Stages.Default1].strings[0][j];
                totalSuitsRanks.push(G.publicPlayers[Number(ctx.currentPlayer)]
                    .cards[suit].reduce(TotalRank, 0) * 2);
            }
            return Object.values(suitsConfig)[totalSuitsRanks
                .indexOf(Math.max(...totalSuitsRanks))].suit;
        },
        validate: () => true,
    },
    [MoveNames.PassEnlistmentMercenariesMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default2].empty,
        getValue: () => null,
        validate: (G, ctx) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined) {
                const mercenariesCount = G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter((card) => card.type === RusCardTypes.MERCENARY).length;
                isValid = ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                    && mercenariesCount > 0;
            }
            return isValid;
        },
    },
    [MoveNames.PlaceEnlistmentMercenariesMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default4].strings,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default4].strings;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: () => true,
    },
    [MoveNames.StartEnlistmentMercenariesMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default1].empty,
        getValue: () => null,
        validate: (G, ctx) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined) {
                const mercenariesCount = G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter((card) => card.type === RusCardTypes.MERCENARY).length;
                isValid = ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                    && mercenariesCount > 0;
            }
            return isValid;
        },
    },
    // start
    [MoveNames.AddCoinToPouchMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)]
            .phases[ctx.phase][Stages.AddCoinToPouch].numbers,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.AddCoinToPouch].numbers;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: () => true,
    },
    [MoveNames.ClickCampCardHoldaMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.PickCampCardHolda].numbers,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.PickCampCardHolda].numbers;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: () => true,
    },
    [MoveNames.ClickCoinToUpgradeMove]: {
        // TODO Rework if Uline in play or no 1 coin in game (& add param isInitial?)
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.UpgradeCoin].coins,
        getValue: (G, ctx) => {
            // TODO Check add TYPE!?
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.UpgradeCoin].coins;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G, ctx, id, type) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && type !== undefined
                && typeof id === `number`) {
                isValid = CoinUpgradeValidation(G, ctx, id, type);
            }
            return isValid;
        },
    },
    [MoveNames.ClickHeroCardMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.PickHero].numbers,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.PickHero].numbers;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G, ctx, id) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
                switch (G.heroes[id].name) {
                    case HeroNames.Hourya:
                        isValid = IsCanPickHeroWithConditionsValidator(G, ctx, id);
                        break;
                    case HeroNames.Bonfur:
                    case HeroNames.Dagda:
                        isValid = IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator(G, ctx, id);
                        break;
                    default:
                        break;
                }
            }
            return isValid;
        },
    },
    [MoveNames.DiscardCardMove]: {
        getRange: (G, ctx) => 
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.DiscardBoardCard].suits,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.DiscardBoardCard].suits;
            let suitName = ``;
            for (const suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    suitName = suit;
                }
            }
            return {
                suit: suitName,
                cardId: moveArguments[suitName][Math.floor(Math.random() * moveArguments[suitName].length)],
            };
        },
        validate: () => true,
    },
    // [MoveNames.DiscardSuitCardFromPlayerBoardMove]: {
    //     // TODO FIX  IT!!!!!!
    //     getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArguments => G.currentMoveArguments,
    //     // getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
    //     //     const moveArguments: number[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
    //     //         .phases[ctx.phase][Stages.PickDiscardCard].numbers as number[];
    //     //     return [moveArguments[Math.floor(Math.random() * moveArguments.length)]];
    //     // },
    //     validate: (): boolean => true, // TODO Check it
    // },
    [MoveNames.PickDiscardCardMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.PickDiscardCard].numbers,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.PickDiscardCard].numbers;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: () => true,
    },
    [MoveNames.PlaceCardMove]: {
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.PlaceCards].strings,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.PlaceCards].strings;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: () => true, // TODO Check it
    },
    [MoveNames.UpgradeCoinVidofnirVedrfolnirMove]: {
        // TODO Rework if Uline in play or no 1 coin in game(& add param isInitial ?)
        getRange: (G, ctx) => G.currentMoveArguments[Number(ctx.currentPlayer)]
            .phases[ctx.phase][Stages.UpgradeVidofnirVedrfolnirCoin].coins,
        getValue: (G, ctx) => {
            const moveArguments = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.UpgradeVidofnirVedrfolnirCoin].coins;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G, ctx, id, type) => {
            var _a;
            let isValid = false;
            if (G !== undefined && ctx !== undefined && type !== undefined && typeof id === `number`) {
                isValid = ((_a = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config) === null || _a === void 0 ? void 0 : _a.coinId) !== id
                    && CoinUpgradeValidation(G, ctx, id, type);
            }
            return isValid;
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
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param num
 * @param values
 * @returns
 */
const ValidateByValues = (value, values) => values.includes(value);
const ValidateByObjectCoinIdTypeIsInitialValues = (value, values) => values.includes(value);
const ValidateByObjectSuitIdValues = (value, values) => values[value.suit].includes(value.cardId);
//# sourceMappingURL=MoveValidator.js.map