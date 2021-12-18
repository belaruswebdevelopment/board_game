import { CampCardTypes, CampDeckCardTypes, DeckCardTypes, MyGameState, TavernCardTypes } from "../GameSetup";
import { Ctx } from "boardgame.io";
import { DrawButton, DrawCard, DrawCoin } from "./UIHelpers";
import { GameBoard } from "../GameBoard";
import { IBotMoveArgumentsTypes } from "../AI";
import { suitsConfig } from "../data/SuitData";
import { IConfig, PickedCardType } from "../Player";
import { Styles } from "../data/StyleData";
import React from "react";
import { isCardNotAction } from "../Card";
import { ICoin } from "../Coin";
import { TotalRank } from "./ScoreHelpers";

// todo Add functions docbloocks
export const PickCampCardHoldaProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (let j: number = 0; j < G.campNum; j++) {
        const card: CampCardTypes = G.camp[j];
        if (card !== null) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                DrawCard(data, boardCells, card, j,
                    G.publicPlayers[Number(ctx.currentPlayer)], null, "OnClickCampCardHolda",
                    j);
            } else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};

export const PlaceCardsProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (let j: number = 0; j < G.suitsNum; j++) {
        const suit: string = Object.keys(suitsConfig)[j],
            pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
        if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
                if (config !== undefined) {
                    // todo Move logic to DrawCard?
                    boardCells.push(
                        <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                            key={`Place ${config.drawName} on ${suitsConfig[suit].suitName}`}
                            onClick={() => data.OnClickSuitToPlaceCard(j)}>
                            <span style={Styles.Suits(suitsConfig[suit].suit)} className="bg-suit-icon">
                                <b>{G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants?.[suit].points ??
                                    ""}</b>
                            </span>
                        </td>
                    );
                }
            } else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};

export const DiscardCardProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (let j: number = 0; j < G.drawSize; j++) {
        const card: TavernCardTypes = G.taverns[G.currentTavern][j];
        if (card !== null) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                let suit: null | string = null;
                if (isCardNotAction(card)) {
                    suit = card.suit;
                }
                DrawCard(data, boardCells, card, j,
                    G.publicPlayers[Number(ctx.currentPlayer)], suit,
                    "OnClickCardToDiscard2Players", j);
            } else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};

export const PickDiscardCardProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (let j: number = 0; j < G.discardCardsDeck.length; j++) {
        if (data instanceof GameBoard && boardCells !== undefined) {
            const card: DeckCardTypes = G.discardCardsDeck[j];
            let suit: null | string = null;
            if (isCardNotAction(card)) {
                suit = card.suit;
            }
            DrawCard(data, boardCells, card, j,
                G.publicPlayers[Number(ctx.currentPlayer)], suit, "OnClickCardFromDiscard",
                j);
        } else if (Array.isArray(data)) {
            data.push([j]);
        }
    }
};

export const DiscardCardFromBoardProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config,
        pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (config !== undefined) {
        for (let j: number = 0; j < G.suitsNum; j++) {
            const suit: string | null | undefined =
                G.publicPlayers[Number(ctx.currentPlayer)].cards[j][0]?.suit;
            if (suit !== undefined && suit !== null && suitsConfig[suit].suit !== config.suit
                && !(G.drawProfit === "DagdaAction" && G.actionsNum === 1 && pickedCard !== null
                    && "suit" in pickedCard && suitsConfig[suit].suit === pickedCard.suit)) {
                const last: number = G.publicPlayers[Number(ctx.currentPlayer)].cards[j].length - 1;
                if (G.publicPlayers[Number(ctx.currentPlayer)].cards[j][last].type !== "герой") {
                    if (data instanceof GameBoard && boardCells !== undefined) {
                        DrawCard(data, boardCells,
                            G.publicPlayers[Number(ctx.currentPlayer)].cards[j][last], last,
                            G.publicPlayers[Number(ctx.currentPlayer)],
                            G.publicPlayers[Number(ctx.currentPlayer)].cards[j][last].suit,
                            "OnClickCardToDiscard", j, last);
                    } else if (Array.isArray(data)) {
                        data.push([j, last]);
                    }
                }
            }
        }
    }
};

export const DiscardAnyCardFromPlayerBoardProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    playerRows?: JSX.Element[][]): void => {
    for (let i: number = 0; ; i++) {
        const playerCells: JSX.Element[] = [];
        let isDrawRow: boolean = false;
        let isExit: boolean = true,
            id: number = 0;
        if (data instanceof GameBoard && playerRows !== undefined) {
            playerRows[i] = [];
        }
        for (let j: number = 0; j < G.suitsNum; j++) {
            id = i + j;
            if (G.publicPlayers[Number(ctx.currentPlayer)].cards[j]?.[i] !== undefined) {
                isExit = false;
                if (Array.isArray(data)) {
                    isDrawRow = true;
                }
                if (G.publicPlayers[Number(ctx.currentPlayer)].cards[j][i].type !== "герой") {
                    if (data instanceof GameBoard && playerRows !== undefined) {
                        isDrawRow = true;
                        DrawCard(data, playerCells,
                            data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].cards[j][i], id,
                            data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)],
                            Object.keys(suitsConfig)[j], "OnClickDiscardCardFromPlayerBoard", j, i);
                    } else if (Array.isArray(data)) {
                        data.push([j]);
                    }
                } else {
                    if (data instanceof GameBoard && playerRows !== undefined) {
                        playerCells.push(
                            <td key={`${data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].nickname}
                            empty card ${id}`}>

                            </td>
                        );
                    }
                }
            } else {
                if (data instanceof GameBoard && playerRows !== undefined) {
                    playerCells.push(
                        <td key={`${data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].nickname}
                        empty card ${id}`}>

                        </td>
                    );
                }
            }
        }
        if (data instanceof GameBoard && playerRows !== undefined) {
            if (isDrawRow) {
                playerRows[i].push(
                    <tr key={`${data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].nickname} board row
                ${i}`}>
                        {playerCells}
                    </tr>
                );
            }
            if (isExit) {
                break;
            }
        } else if (Array.isArray(data)) {
            if (!isDrawRow) {
                break;
            }
        }
    }
};

export const DiscardSuitCardFromPlayerBoardProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {

};

export const UpgradeCoinVidofnirVedrfolnirProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    if (config !== undefined) {
        for (let j: number = G.tavernsNum; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length;
            j++) {
            const coin: ICoin | null = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j];
            if (coin !== null) {
                if (!coin.isTriggerTrading && config.coinId !== j) {
                    if (data instanceof GameBoard && boardCells !== undefined) {
                        DrawCoin(data, boardCells, "coin",
                            G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j],
                            j, G.publicPlayers[Number(ctx.currentPlayer)], "border-2",
                            null, "OnClickCoinToUpgradeVidofnirVedrfolnir", j, "board",
                            coin.isInitial);
                    } else if (Array.isArray(data)) {
                        data.push([j, "board", coin.isInitial]);
                    }
                }
            }
        }
    }
};

export const AddCoinToPouchProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (let j: number = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
        if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === "Uline"
            && G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                DrawCoin(data, boardCells, "coin",
                    G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j], j,
                    G.publicPlayers[Number(ctx.currentPlayer)], "border-2", null,
                    "OnClickCoinToAddToPouch", j);
            } else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};

export const PlaceEnlistmentMercenariesProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (let j: number = 0; j < G.suitsNum; j++) {
        const card: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
        if (card !== null && "stack" in card) {
            const suit: string = Object.keys(suitsConfig)[j];
            if (card.stack[0].variants !== undefined) {
                if (suit === card.stack[0].variants[suit]?.suit) {
                    if (data instanceof GameBoard && boardCells !== undefined) {
                        // todo Move logic to DrawCard?
                        boardCells.push(
                            <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                                onClick={() => data.OnClickSuitToPlaceMercenary(j)}
                                key={`Place ${card.name} ${j} on ${suitsConfig[suit].suitName}`}>
                                <span style={Styles.Suits(suitsConfig[suit].suit)} className="bg-suit-icon">
                                    <b>{card.stack[0].variants[suit].points ?? ""}</b>
                                </span>
                            </td>
                        );
                    } else if (Array.isArray(data)) {
                        data.push([j]);
                    }
                }
            }
        }
    }
};

export const GetEnlistmentMercenariesProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    const mercenaries: CampDeckCardTypes[] =
        G.publicPlayers[Number(ctx.currentPlayer)].campCards
            .filter((card: CampDeckCardTypes): boolean => card.type === "наёмник");
    for (let j: number = 0; j < mercenaries.length; j++) {
        if (data instanceof GameBoard && boardCells !== undefined) {
            DrawCard(data, boardCells, mercenaries[j], j,
                G.publicPlayers[Number(ctx.currentPlayer)], null,
                "OnClickGetEnlistmentMercenaries", j);
        } else if (Array.isArray(data)) {
            data.push([j]);
        }
    }
};

export const StartEnlistmentMercenariesProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (let j: number = 0; j < 2; j++) {
        if (j === 0) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                DrawButton(data, boardCells, "start Enlistment Mercenaries", "Start",
                    G.publicPlayers[Number(ctx.currentPlayer)], "OnClickStartEnlistmentMercenaries");
            } else if (Array.isArray(data)) {
                data.push([j]);
            }
        } else if (G.publicPlayersOrder.length > 1) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                DrawButton(data, boardCells, "pass Enlistment Mercenaries", "Pass",
                    G.publicPlayers[Number(ctx.currentPlayer)], "OnClickPassEnlistmentMercenaries");
            } else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};

export const GetMjollnirProfitProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | number[],
    boardCells?: JSX.Element[]): void => {
    for (let j: number = 0; j < G.suitsNum; j++) {
        if (data instanceof GameBoard && boardCells !== undefined) {
            const suit: string = Object.keys(suitsConfig)[j];
            // todo Move logic to DrawCard?
            boardCells.push(
                <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                    key={`${suit} suit to get Mjöllnir profit`}
                    onClick={() => data.OnClickSuitToGetMjollnirProfit(j)}>
                    <span style={Styles.Suits(suitsConfig[suit].suit)} className="bg-suit-icon">
                        <b className="whitespace-nowrap text-white">
                            {G.publicPlayers[Number(ctx.currentPlayer)].cards[j].reduce(TotalRank, 0) * 2}
                        </b>
                    </span>
                </td>
            );
        } else if (Array.isArray(data)) {
            data.push(G.publicPlayers[Number(ctx.currentPlayer)].cards[j].reduce(TotalRank, 0));
        }
    }
};
