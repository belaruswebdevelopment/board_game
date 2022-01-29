import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { isCardNotAction } from "../Card";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { ConfigNames, HeroNames, MoveNames, Phases, RusCardTypes, Stages } from "../typescript/enums";
import { TotalRank } from "./ScoreHelpers";
import { DrawButton, DrawCard, DrawCoin } from "./UIElementHelpers";
// TODO Add functions docbloocks
export const AddCoinToPouchProfit = (G, ctx, data, boardCells) => {
    const moveMainArgs = [];
    for (let j = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
        if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === HeroNames.Uline
            && G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
            DrawCoin(data, boardCells, `coin`, G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j], j, G.publicPlayers[Number(ctx.currentPlayer)], `border-2`, null, MoveNames.AddCoinToPouchMove, j);
            moveMainArgs.push(j);
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.PickCards][Stages.AddCoinToPouch].numbers =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.AddCoinToPouch].numbers = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.EndTier][Stages.AddCoinToPouch].numbers =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.AddCoinToPouch].numbers = moveMainArgs;
};
export const DiscardCardFromBoardProfit = (G, ctx, data, boardCells) => {
    const moveMainArgs = {}, config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config, pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (config !== undefined) {
        for (const suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                if (suit !== config.suit
                    && !(G.drawProfit === ConfigNames.DagdaAction && G.actionsNum === 1 && pickedCard !== null
                        && `suit` in pickedCard && suit === pickedCard.suit)) {
                    const last = G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length - 1;
                    if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last].type !== RusCardTypes.HERO) {
                        DrawCard(data, boardCells, G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last], last, G.publicPlayers[Number(ctx.currentPlayer)], suit, MoveNames.DiscardCardMove, suit, last);
                        moveMainArgs[suit].push(last);
                    }
                }
            }
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.PickCards][Stages.DiscardBoardCard].suits =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.DiscardBoardCard].suits = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.EndTier][Stages.DiscardBoardCard].suits =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.DiscardBoardCard].suits = moveMainArgs;
};
export const DiscardAnyCardFromPlayerBoardProfit = (G, ctx, data, boardCells) => {
    // TODO Discard cards must be hidden from others users?
    const playerHeaders = [], playerRows = [], moveMainArgs = {};
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            playerHeaders.push(_jsx("th", { className: `${suitsConfig[suit].suitColor}`, children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon" }, void 0) }, `${data.G.publicPlayers[Number(data.ctx.currentPlayer)].nickname} ${suitsConfig[suit].suitName}`));
        }
    }
    for (let i = 0;; i++) {
        const playerCells = [];
        let isDrawRow = false;
        let isExit = true, id = 0;
        if (!Array.isArray(data) && playerRows !== undefined) {
            playerRows[i] = [];
        }
        let j = 0;
        for (const suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                id = i + j;
                if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][i] !== undefined) {
                    isExit = false;
                    if (Array.isArray(data)) {
                        isDrawRow = true;
                    }
                    if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][i].type !== RusCardTypes.HERO) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][i], id, G.publicPlayers[Number(ctx.currentPlayer)], suit, MoveNames.DiscardCardFromPlayerBoardMove, suit, i);
                        moveMainArgs[suit].push(i);
                    }
                    else {
                        playerCells.push(_jsx("td", {}, `${G.publicPlayers[Number(ctx.currentPlayer)].nickname} empty card ${id}`));
                    }
                }
                else {
                    playerCells.push(_jsx("td", {}, `${G.publicPlayers[Number(ctx.currentPlayer)].nickname} empty card ${id}`));
                }
                j++;
            }
        }
        if (isDrawRow) {
            playerRows[i].push(_jsx("tr", { children: playerCells }, `${G.publicPlayers[Number(ctx.currentPlayer)].nickname} board row ${i}`));
        }
        if (isExit) {
            break;
        }
    }
    boardCells.push(_jsx("td", { children: _jsxs("table", { children: [_jsx("thead", { children: _jsx("tr", { children: playerHeaders }, void 0) }, void 0), _jsx("tbody", { children: playerRows }, void 0)] }, void 0) }, `${data.G.publicPlayers[Number(data.ctx.currentPlayer)].nickname} discard card`));
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.PickCards][Stages.DiscardSuitCard].suits =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.DiscardSuitCard].suits = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.EndTier][Stages.DiscardSuitCard].suits =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.DiscardSuitCard].suits = moveMainArgs;
};
export const DiscardCardProfit = (G, ctx, data, boardCells) => {
    const moveMainArgs = [];
    for (let j = 0; j < G.drawSize; j++) {
        const card = G.taverns[G.currentTavern][j];
        if (card !== null) {
            let suit = null;
            if (isCardNotAction(card)) {
                suit = card.suit;
            }
            DrawCard(data, boardCells, card, j, G.publicPlayers[Number(ctx.currentPlayer)], suit, MoveNames.DiscardCard2PlayersMove, j);
            moveMainArgs.push(j);
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.PickCards][Stages.DiscardCard].numbers =
        moveMainArgs;
};
// export const DiscardSuitCardFromPlayerBoardProfit = (G: MyGameState, ctx: Ctx,
//     data?: null | IBotMoveArgumentsTypes, boardCells: JSX.Element[]): void => {
// };
export const ExplorerDistinctionProfit = (G, ctx, data, boardCells) => {
    const moveMainArgs = [];
    for (let j = 0; j < 3; j++) {
        const card = G.decks[1][j];
        let suit = null;
        if (isCardNotAction(card)) {
            suit = card.suit;
        }
        DrawCard(data, boardCells, G.decks[1][j], j, G.publicPlayers[Number(ctx.currentPlayer)], suit, MoveNames.ClickCardToPickDistinctionMove, j);
        moveMainArgs.push(j);
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.PickDistinctionCard].numbers = moveMainArgs;
};
export const GetEnlistmentMercenariesProfit = (G, ctx, data, boardCells) => {
    const moveMainArgs = [], mercenaries = G.publicPlayers[Number(ctx.currentPlayer)].campCards
        .filter((card) => card.type === RusCardTypes.MERCENARY);
    for (let j = 0; j < mercenaries.length; j++) {
        DrawCard(data, boardCells, mercenaries[j], j, G.publicPlayers[Number(ctx.currentPlayer)], null, MoveNames.GetEnlistmentMercenariesMove, j);
        moveMainArgs.push(j);
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.Default3].numbers = moveMainArgs;
};
export const GetMjollnirProfitProfit = (G, ctx, data, boardCells) => {
    const moveMainArgs = [];
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length) {
                // TODO Move logic to DrawCard?
                boardCells.push(_jsx("td", { className: `${suitsConfig[suit].suitColor} cursor-pointer`, onClick: () => data.moves.GetMjollnirProfitMove(suit), children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon", children: _jsx("b", { className: "whitespace-nowrap text-white", children: G.publicPlayers[Number(ctx.currentPlayer)].cards[suit]
                                .reduce(TotalRank, 0) * 2 }, void 0) }, void 0) }, `${suit} suit to get Mjöllnir profit`));
                moveMainArgs.push(suit);
            }
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.GetMjollnirProfit][Stages.Default1].strings =
        moveMainArgs;
};
export const PickCampCardHoldaProfit = (G, ctx, data, boardCells) => {
    const moveMainArgs = [];
    for (let j = 0; j < G.campNum; j++) {
        const card = G.camp[j];
        if (card !== null) {
            DrawCard(data, boardCells, card, j, G.publicPlayers[Number(ctx.currentPlayer)], null, MoveNames.ClickCampCardHoldaMove, j);
            moveMainArgs.push(j);
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.PickCards][Stages.PickCampCardHolda].numbers = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.PickCampCardHolda].numbers = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.EndTier][Stages.PickCampCardHolda].numbers =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.PickCampCardHolda].numbers = moveMainArgs;
};
export const PickDiscardCardProfit = (G, ctx, data, boardCells) => {
    const moveMainArgs = [];
    for (let j = 0; j < G.discardCardsDeck.length; j++) {
        const card = G.discardCardsDeck[j];
        let suit = null;
        if (isCardNotAction(card)) {
            suit = card.suit;
        }
        DrawCard(data, boardCells, card, j, G.publicPlayers[Number(ctx.currentPlayer)], suit, MoveNames.PickDiscardCardMove, j);
        moveMainArgs.push(j);
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.PickCards][Stages.PickDiscardCard].numbers =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.PickDiscardCard].numbers = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.EndTier][Stages.PickDiscardCard].numbers =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.PickDiscardCard].numbers = moveMainArgs;
};
export const PlaceCardsProfit = (G, ctx, data, boardCells) => {
    var _a, _b;
    const moveMainArgs = [];
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
            if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                const config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
                if (config !== undefined) {
                    // TODO Move logic to DrawCard?
                    boardCells.push(_jsx("td", { className: `${suitsConfig[suit].suitColor} cursor-pointer`, onClick: () => data.moves.PlaceCardMove(suit), children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon", children: _jsx("b", { children: (_b = (_a = G.publicPlayers[Number(ctx.currentPlayer)]
                                    .stack[0].variants) === null || _a === void 0 ? void 0 : _a[suit].points) !== null && _b !== void 0 ? _b : `` }, void 0) }, void 0) }, `Place ${config.drawName} on ${suitsConfig[suit].suitName}`));
                    moveMainArgs.push(suit);
                }
            }
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.PickCards][Stages.PlaceCards].strings =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.PlaceCards].strings = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.EndTier][Stages.Default1].strings =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.EndTier][Stages.PlaceCards].strings =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.GetDistinctions][Stages.PlaceCards].strings =
        moveMainArgs;
};
export const PlaceEnlistmentMercenariesProfit = (G, ctx, data, boardCells) => {
    var _a, _b;
    const moveMainArgs = [];
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const card = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
            if (card !== null && `variants` in card) {
                if (card.variants !== undefined) {
                    if (suit === ((_a = card.variants[suit]) === null || _a === void 0 ? void 0 : _a.suit)) {
                        // TODO Move logic to DrawCard?
                        boardCells.push(_jsx("td", { className: `${suitsConfig[suit].suitColor} cursor-pointer`, onClick: () => data.moves.PlaceEnlistmentMercenariesMove(suit), children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon", children: _jsx("b", { children: (_b = card.variants[suit].points) !== null && _b !== void 0 ? _b : `` }, void 0) }, void 0) }, `Place ${card.name} on ${suitsConfig[suit].suitName}`));
                        moveMainArgs.push(suit);
                    }
                }
            }
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.Default4].strings = moveMainArgs;
};
export const StartEnlistmentMercenariesProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < 2; j++) {
        if (j === 0) {
            // TODO Add Enums for ALL text here
            DrawButton(data, boardCells, `start Enlistment Mercenaries`, `Start`, G.publicPlayers[Number(ctx.currentPlayer)], MoveNames.StartEnlistmentMercenariesMove);
            G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[Phases.EnlistmentMercenaries][Stages.Default1].empty = null;
        }
        else if (G.publicPlayersOrder.length > 1) {
            DrawButton(data, boardCells, `pass Enlistment Mercenaries`, `Pass`, G.publicPlayers[Number(ctx.currentPlayer)], MoveNames.PassEnlistmentMercenariesMove);
            G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[Phases.EnlistmentMercenaries][Stages.Default1].empty = null;
        }
    }
};
export const UpgradeCoinProfit = (G, ctx, data, boardCells) => {
    var _a, _b, _c, _d, _e, _f;
    const handCoins = data.G.publicPlayers[Number(data.ctx.currentPlayer)].handCoins
        .filter((coin) => coin !== null), moveMainArgs = [];
    let handCoinIndex = -1;
    for (let j = 0; j < data.G.publicPlayers[Number(data.ctx.currentPlayer)].boardCoins.length; j++) {
        // TODO Check .? for all coins!!! and delete AS
        if (G.publicPlayers[Number(data.ctx.currentPlayer)].buffs.everyTurn === HeroNames.Uline
            && G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j] === null) {
            handCoinIndex++;
            const handCoinId = G.publicPlayers[Number(data.ctx.currentPlayer)]
                .handCoins.findIndex((coin) => {
                var _a, _b;
                return (coin === null || coin === void 0 ? void 0 : coin.value) === ((_a = handCoins[handCoinIndex]) === null || _a === void 0 ? void 0 : _a.value)
                    && (coin === null || coin === void 0 ? void 0 : coin.isInitial) === ((_b = handCoins[handCoinIndex]) === null || _b === void 0 ? void 0 : _b.isInitial);
            });
            if (G.publicPlayers[Number(ctx.currentPlayer)].handCoins[handCoinId]
                && !((_a = G.publicPlayers[Number(ctx.currentPlayer)].handCoins[handCoinId]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading)) {
                DrawCoin(data, boardCells, `coin`, G.publicPlayers[Number(ctx.currentPlayer)].handCoins[handCoinId], j, G.publicPlayers[Number(ctx.currentPlayer)], `border-2`, null, MoveNames.ClickCoinToUpgradeMove, j, `hand`, (_b = handCoins[handCoinIndex]) === null || _b === void 0 ? void 0 : _b.isInitial);
                moveMainArgs.push({
                    coinId: j,
                    type: `board`,
                    isInitial: (_c = handCoins[handCoinIndex]) === null || _c === void 0 ? void 0 : _c.isInitial,
                });
            }
        }
        else if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]
            && !((_d = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]) === null || _d === void 0 ? void 0 : _d.isTriggerTrading)) {
            DrawCoin(data, boardCells, `coin`, G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j], j, G.publicPlayers[Number(ctx.currentPlayer)], `border-2`, null, MoveNames.ClickCoinToUpgradeMove, j, `board`, (_e = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]) === null || _e === void 0 ? void 0 : _e.isInitial);
            moveMainArgs.push({
                coinId: j,
                type: `board`,
                isInitial: (_f = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]) === null || _f === void 0 ? void 0 : _f.isInitial,
            });
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.PickCards][Stages.UpgradeCoin].coins = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.UpgradeCoin].coins = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EndTier][Stages.UpgradeCoin].coins = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.UpgradeCoin].coins = moveMainArgs;
};
export const UpgradeCoinVidofnirVedrfolnirProfit = (G, ctx, data, boardCells) => {
    const config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config, moveMainArgs = [];
    if (config !== undefined) {
        for (let j = G.tavernsNum; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; j++) {
            const coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j];
            if (coin !== null) {
                if (!coin.isTriggerTrading && config.coinId !== j) {
                    DrawCoin(data, boardCells, `coin`, G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j], j, G.publicPlayers[Number(ctx.currentPlayer)], `border-2`, null, MoveNames.UpgradeCoinVidofnirVedrfolnirMove, j, `board`, coin.isInitial);
                    moveMainArgs.push({
                        coinId: j,
                        type: `board`,
                        isInitial: coin.isInitial,
                    });
                }
            }
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.PickCards][Stages.UpgradeVidofnirVedrfolnirCoin].coins = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.UpgradeVidofnirVedrfolnirCoin].coins = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EndTier][Stages.UpgradeVidofnirVedrfolnirCoin].coins = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.UpgradeVidofnirVedrfolnirCoin].coins = moveMainArgs;
};
//# sourceMappingURL=ProfitHelpers.js.map