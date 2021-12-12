import {CampCardTypes, DeckCardTypes, MyGameState, TavernCardTypes} from "../GameSetup";
import {Ctx} from "boardgame.io";
import {DrawCard} from "./UIHelpers";
import {GameBoard} from "../GameBoard";
import {IBotMoveArgumentsTypes} from "../AI";
import {suitsConfig} from "../data/SuitData";
import {IConfig, PickedCardType} from "../Player";
import {Styles} from "../data/StyleData";
import React from "react";
import {isCardNotAction} from "../Card";

export const HoldaActionProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
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
