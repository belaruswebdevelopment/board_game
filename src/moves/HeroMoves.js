import {suitsConfig} from "../data/SuitData";
import {CreateCard} from "../Card";
import {AddCardToPlayer} from "../Player";
import {CheckPickHero} from "../Hero";
import {ActionDispatcher, EndAction} from "../Actions";
import {heroesConfig} from "../data/HeroData";
import {CoinUpgradeValidation, IsValidMove} from "../MoveValidator";
import {INVALID_MOVE} from "boardgame.io/core";
import {AfterBasicPickCardActions, CheckEndTierPhaseEnded} from "./Moves";
import {ActivateCoinUpgrade, UpgradeCoinFromDiscard} from "./CoinMoves";
import {ClickCampCard} from "./CampMoves";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";
// todo Add logging
export const ClickHeroCard = (G, ctx, heroId) => {
    const isValidMove = IsValidMove({obj: G.heroes[heroId], objId: heroId, range: [0, G.heroes.length]}) ||
        G.players[ctx.currentPlayer].buffs?.["recruitHero"];
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ctx.events.setStage("heroAction");
    return ActionDispatcher(G, ctx, G.heroes[heroId].action);
};

const GridAction = (G, ctx, coinId, type, isInitial) => {
    const isValidMove = CoinUpgradeValidation(G, ctx, coinId, type);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ActivateCoinUpgrade(G, ctx, heroesConfig["Grid"].action.config.action.config.action, coinId, type, isInitial);
    G.drawProfit = null;
};

const PlaceCard = (G, ctx, suitId) => {
    G.players[ctx.currentPlayer].pickedCard = {
        suit: suitId,
    };
    const suit = Object.keys(suitsConfig)[suitId];
    let points = 0;
    if (suit === "hunter" || suit === "blacksmith") {
        points = null;
    }
    const olwinDouble = CreateCard({
        suit: suit,
        rank: 1,
        points: points,
        name: "Olwin",
    });
    AddCardToPlayer(G, ctx, olwinDouble);
    G.actionsNum--;
    if (!G.actionsNum) {
        G.drawProfit = null;
        G.actionsNum = null;
        EndAction(G, ctx);
    }
};

export const PlaceYlud = (G, ctx, suitId) => {
    const suit = Object.keys(suitsConfig)[suitId];
    let points = 0;
    if (suit === "hunter" || suit === "blacksmith") {
        points = null;
    } else if (suit === "explorer") {
        points = 11;
    } else if (suit === "warrior") {
        points = 7;
    } else if (suit === "miner") {
        points = 1;
    }
    const yludCard = CreateCard({
        suit: suit,
        rank: 1,
        points: points,
        type: "герой",
        name: "Ylud",
        game: "base",
    });
    AddCardToPlayer(G, ctx, yludCard);
    const isMoveThrud = CheckAndMoveThrud(G, ctx, yludCard);
    if (CheckPickHero(G, ctx)) {
        ctx.events.setStage("pickHero");
    } else {
        if (!isMoveThrud) {
            CheckEndTierPhaseEnded(G, ctx);
        } else {
            StartThrudMoving(G, ctx, yludCard);
        }
    }
};

export const CheckAndMoveThrud = (G, ctx, card) => {
    if (card.suit) {
        const suitId = GetSuitIndexByName(card.suit),
            index = G.players[ctx.currentPlayer].cards[suitId].findIndex(card => card.name === "Thrud");
        if (index !== -1) {
            G.players[ctx.currentPlayer].cards[suitId].splice(index, 1);
        }
        return index !== -1;
    }
    return false;
};

const AddThrudOnPlayerBoard = (G, ctx, suitId) => {
    const suit = Object.keys(suitsConfig)[suitId];
    let points = 0;
    if (suit === "hunter" || suit === "blacksmith") {
        points = null;
    } else if (suit === "explorer" || suit === "warrior" || suit === "miner") {
        points = 0;
    }
    const thrudCard = CreateCard({
        suit: suit,
        rank: 1,
        points: points,
        type: "герой",
        name: "Thrud",
        game: "base",
    });
    AddCardToPlayer(G, ctx, thrudCard);
};

export const StartThrudMoving = (G, ctx, card) => {
    G.players[ctx.currentPlayer].pickedCard = card;
    G.drawProfit = "moveThrud";
    ctx.events.setStage("moveThrud");
};

const PlaceThrud = (G, ctx, suitId) => {
    AddThrudOnPlayerBoard(G, ctx, suitId);
    if (CheckPickHero(G, ctx)) {
        ctx.events.setStage("pickHero");
    } else {
        EndAction(G, ctx);
    }
};

export const MoveThrud = (G, ctx, suitId) => {
    AddThrudOnPlayerBoard(G, ctx, suitId);
    G.drawProfit = null;
    if (CheckPickHero(G, ctx)) {
        ctx.events.setStage("pickHero");
    } else {
        AfterBasicPickCardActions(G, ctx);
    }
};

const DiscardCard = (G, ctx, suitId, cardId, hero = null) => {
    G.players[ctx.currentPlayer].pickedCard = G.players[ctx.currentPlayer].cards[suitId][cardId];
    G.discardCardsDeck.push(G.players[ctx.currentPlayer].cards[suitId].splice(cardId, 1)[0]);
    G.actionsNum--;
    if (!G.actionsNum) {
        G.drawProfit = null;
        G.actionsNum = null;
        ActionDispatcher(G, ctx, heroesConfig[hero].action.config.action);
    }
};

export const CheckAndStartUlineActionsOrContinue = (G, ctx) => {
    const ulinePlayerIndex = G.players.findIndex(player => player.buffs?.["everyTurn"] === "Uline");
    if (ulinePlayerIndex !== -1) {
        if (ctx.activePlayers?.[ctx.currentPlayer] !== "placeTradingCoinsUline" && ulinePlayerIndex === Number(ctx.currentPlayer) &&
            G.players[ctx.currentPlayer].boardCoins[G.currentTavern].isTriggerTrading) {
            if (G.players[ctx.currentPlayer].boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null)) {
                G.actionsNum = G.suitsNum - G.tavernsNum;
                ctx.events.setStage("placeTradingCoinsUline");
                return "placeTradingCoinsUline";
            }
        } else if (ctx.activePlayers?.[ctx.currentPlayer] === "placeTradingCoinsUline" && !G.actionsNum) {
            ctx.events.endStage();
            return "endPlaceTradingCoinsUline";
        } else if (ctx.activePlayers?.[ctx.currentPlayer] === "placeTradingCoinsUline" && G.actionsNum) {
            return "nextPlaceTradingCoinsUline";
        } else {
            return "placeCoinsUline";
        }
    } else if (ctx.phase !== "pickCards") {
        ctx.events.setPhase("pickCards");
    }
    return false;
};

export const PickDiscardCard = (G, ctx, cardId) => {
    const isAdded = AddCardToPlayer(G, ctx, G.discardCardsDeck[cardId]);
    G.discardCardsDeck.splice(cardId, 1);
    G.actionsNum--;
    if (!G.actionsNum) {
        G.drawProfit = null;
        G.actionsNum = null;
    }
    if (isAdded) {
        if (CheckPickHero(G, ctx)) {
            ctx.events.setStage("pickHero");
        } else {
            EndAction(G, ctx);
        }
    } else {
        G.drawProfit = "upgradeCoinFromDiscard";
    }
};

export const heroMovesList = {
    moves: {
        GridAction,
        PlaceThrud,
        DiscardCard,
        PlaceCard,
        PickDiscardCard,
        UpgradeCoinFromDiscard,
        ClickCampCard,
    },
};
