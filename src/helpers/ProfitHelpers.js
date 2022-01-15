import { jsx as _jsx } from "react/jsx-runtime";
import { isCardNotAction } from "../Card";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { ConfigNames, HeroNames, MoveNames, RusCardTypes } from "../typescript/enums";
import { TotalRank } from "./ScoreHelpers";
import { DrawButton, DrawCard, DrawCoin } from "./UIElementHelpers";
// TODO Add functions docbloocks
export const AddCoinToPouchProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
        if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === HeroNames.Uline
            && G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
            if (!Array.isArray(data) && boardCells !== undefined) {
                DrawCoin(data, boardCells, `coin`, G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j], j, G.publicPlayers[Number(ctx.currentPlayer)], `border-2`, null, MoveNames.AddCoinToPouchMove, j);
            }
            else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};
export const DiscardAnyCardFromPlayerBoardProfit = (G, ctx, data, playerRows) => {
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
                        if (!Array.isArray(data) && playerRows !== undefined) {
                            isDrawRow = true;
                            DrawCard(data, playerCells, G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][i], id, G.publicPlayers[Number(ctx.currentPlayer)], suit, MoveNames.DiscardCardFromPlayerBoardMove, suit, i);
                        }
                        else if (Array.isArray(data)) {
                            data.push([suit]);
                        }
                    }
                    else {
                        if (!Array.isArray(data) && playerRows !== undefined) {
                            playerCells.push(_jsx("td", {}, `${G.publicPlayers[Number(ctx.currentPlayer)].nickname} empty card ${id}`));
                        }
                    }
                }
                else {
                    if (!Array.isArray(data) && playerRows !== undefined) {
                        playerCells.push(_jsx("td", {}, `${G.publicPlayers[Number(ctx.currentPlayer)].nickname} empty card ${id}`));
                    }
                }
                j++;
            }
        }
        if (!Array.isArray(data) && playerRows !== undefined) {
            if (isDrawRow) {
                playerRows[i].push(_jsx("tr", { children: playerCells }, `${G.publicPlayers[Number(ctx.currentPlayer)].nickname} board row ${i}`));
            }
            if (isExit) {
                break;
            }
        }
        else if (Array.isArray(data)) {
            if (!isDrawRow) {
                break;
            }
        }
    }
};
export const DiscardCardFromBoardProfit = (G, ctx, data, boardCells) => {
    const config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config, pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (config !== undefined) {
        for (const suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                if (suit !== config.suit
                    && !(G.drawProfit === ConfigNames.DagdaAction && G.actionsNum === 1 && pickedCard !== null
                        && `suit` in pickedCard && suit === pickedCard.suit)) {
                    const last = G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length - 1;
                    if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last].type !== RusCardTypes.HERO) {
                        if (!Array.isArray(data) && boardCells !== undefined) {
                            DrawCard(data, boardCells, G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last], last, G.publicPlayers[Number(ctx.currentPlayer)], suit, MoveNames.DiscardCardMove, suit, last);
                        }
                        else if (Array.isArray(data)) {
                            data.push([suit, last]);
                        }
                    }
                }
            }
        }
    }
};
export const DiscardCardProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < G.drawSize; j++) {
        const card = G.taverns[G.currentTavern][j];
        if (card !== null) {
            if (!Array.isArray(data) && boardCells !== undefined) {
                let suit = null;
                if (isCardNotAction(card)) {
                    suit = card.suit;
                }
                DrawCard(data, boardCells, card, j, G.publicPlayers[Number(ctx.currentPlayer)], suit, MoveNames.DiscardCard2PlayersMove, j);
            }
            else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};
// export const DiscardSuitCardFromPlayerBoardProfit = (G: MyGameState, ctx: Ctx,
//     data?: null | IBotMoveArgumentsTypes, boardCells?: JSX.Element[]): void => {
// };
export const GetEnlistmentMercenariesProfit = (G, ctx, data, boardCells) => {
    const mercenaries = G.publicPlayers[Number(ctx.currentPlayer)].campCards
        .filter((card) => card.type === RusCardTypes.MERCENARY);
    for (let j = 0; j < mercenaries.length; j++) {
        if (!Array.isArray(data) && boardCells !== undefined) {
            DrawCard(data, boardCells, mercenaries[j], j, G.publicPlayers[Number(ctx.currentPlayer)], null, MoveNames.GetEnlistmentMercenariesMove, j);
        }
        else if (Array.isArray(data)) {
            data.push([j]);
        }
    }
};
export const GetMjollnirProfitProfit = (G, ctx, data, boardCells) => {
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            if (!Array.isArray(data) && boardCells !== undefined) {
                // TODO Move logic to DrawCard?
                boardCells.push(_jsx("td", { className: `${suitsConfig[suit].suitColor} cursor-pointer`, onClick: () => data.moves.GetMjollnirProfitMove(suit), children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon", children: _jsx("b", { className: "whitespace-nowrap text-white", children: G.publicPlayers[Number(ctx.currentPlayer)].cards[suit]
                                .reduce(TotalRank, 0) * 2 }, void 0) }, void 0) }, `${suit} suit to get Mjöllnir profit`));
            }
            else if (Array.isArray(data)) {
                data.push(G.publicPlayers[Number(ctx.currentPlayer)].cards[suit]
                    .reduce(TotalRank, 0));
            }
        }
    }
};
export const PickCampCardHoldaProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < G.campNum; j++) {
        const card = G.camp[j];
        if (card !== null) {
            if (!Array.isArray(data) && boardCells !== undefined) {
                DrawCard(data, boardCells, card, j, G.publicPlayers[Number(ctx.currentPlayer)], null, MoveNames.ClickCampCardHoldaMove, j);
            }
            else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};
export const PickDiscardCardProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < G.discardCardsDeck.length; j++) {
        if (!Array.isArray(data) && boardCells !== undefined) {
            const card = G.discardCardsDeck[j];
            let suit = null;
            if (isCardNotAction(card)) {
                suit = card.suit;
            }
            DrawCard(data, boardCells, card, j, G.publicPlayers[Number(ctx.currentPlayer)], suit, MoveNames.PickDiscardCardMove, j);
        }
        else if (Array.isArray(data)) {
            data.push([j]);
        }
    }
};
export const PlaceCardsProfit = (G, ctx, data, boardCells) => {
    var _a, _b;
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
            if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                if (!Array.isArray(data) && boardCells !== undefined) {
                    const config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
                    if (config !== undefined) {
                        // TODO Move logic to DrawCard?
                        boardCells.push(_jsx("td", { className: `${suitsConfig[suit].suitColor} cursor-pointer`, onClick: () => data.moves.PlaceCardMove(suit), children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon", children: _jsx("b", { children: (_b = (_a = G.publicPlayers[Number(ctx.currentPlayer)]
                                        .stack[0].variants) === null || _a === void 0 ? void 0 : _a[suit].points) !== null && _b !== void 0 ? _b : `` }, void 0) }, void 0) }, `Place ${config.drawName} on ${suitsConfig[suit].suitName}`));
                    }
                }
                else if (Array.isArray(data)) {
                    data.push([suit]);
                }
            }
        }
    }
};
export const PlaceEnlistmentMercenariesProfit = (G, ctx, data, boardCells) => {
    var _a, _b;
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const card = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
            if (card !== null && `stack` in card) {
                if (card.stack[0].variants !== undefined) {
                    if (suit === ((_a = card.stack[0].variants[suit]) === null || _a === void 0 ? void 0 : _a.suit)) {
                        if (!Array.isArray(data) && boardCells !== undefined) {
                            // TODO Move logic to DrawCard?
                            boardCells.push(_jsx("td", { className: `${suitsConfig[suit].suitColor} cursor-pointer`, onClick: () => data.moves.PlaceEnlistmentMercenariesMove(suit), children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon", children: _jsx("b", { children: (_b = card.stack[0].variants[suit].points) !== null && _b !== void 0 ? _b : `` }, void 0) }, void 0) }, `Place ${card.name} on ${suitsConfig[suit].suitName}`));
                        }
                        else if (Array.isArray(data)) {
                            data.push([suit]);
                        }
                    }
                }
            }
        }
    }
};
export const StartEnlistmentMercenariesProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < 2; j++) {
        if (j === 0) {
            // TODO Add Enums for ALL text here
            if (!Array.isArray(data) && boardCells !== undefined) {
                DrawButton(data, boardCells, `start Enlistment Mercenaries`, `Start`, G.publicPlayers[Number(ctx.currentPlayer)], MoveNames.StartEnlistmentMercenariesMove);
            }
            else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
        else if (G.publicPlayersOrder.length > 1) {
            if (!Array.isArray(data) && boardCells !== undefined) {
                DrawButton(data, boardCells, `pass Enlistment Mercenaries`, `Pass`, G.publicPlayers[Number(ctx.currentPlayer)], MoveNames.PassEnlistmentMercenariesMove);
            }
            else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};
export const UpgradeCoinVidofnirVedrfolnirProfit = (G, ctx, data, boardCells) => {
    const config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    if (config !== undefined) {
        for (let j = G.tavernsNum; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; j++) {
            const coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j];
            if (coin !== null) {
                if (!coin.isTriggerTrading && config.coinId !== j) {
                    if (!Array.isArray(data) && boardCells !== undefined) {
                        DrawCoin(data, boardCells, `coin`, G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j], j, G.publicPlayers[Number(ctx.currentPlayer)], `border-2`, null, MoveNames.UpgradeCoinVidofnirVedrfolnirMove, j, `board`, coin.isInitial);
                    }
                    else if (Array.isArray(data)) {
                        data.push([j, `board`, coin.isInitial]);
                    }
                }
            }
        }
    }
};
//# sourceMappingURL=ProfitHelpers.js.map