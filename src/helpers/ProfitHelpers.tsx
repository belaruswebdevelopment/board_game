import { Ctx } from "boardgame.io";
import { BoardProps } from "boardgame.io/react";
import { isCardNotAction } from "../Card";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { CampCardTypes, CampDeckCardTypes, DeckCardTypes, PickedCardType, TavernCardTypes } from "../typescript/card_types";
import { CoinType } from "../typescript/coin_types";
import { ConfigNames, HeroNames, RusCardTypes } from "../typescript/enums";
import { IConfig, MyGameState } from "../typescript/interfaces";
import { IBotMoveArgumentsTypes } from "../typescript/types";
import { TotalRank } from "./ScoreHelpers";
import { DrawButton, DrawCard, DrawCoin } from "./UIElementHelpers";

// todo Add functions docbloocks
export const AddCoinToPouchProfit = (G: MyGameState, ctx: Ctx, data: BoardProps<MyGameState> | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (let j = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
        if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === HeroNames.Uline
            && G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
            if (!Array.isArray(data) && boardCells !== undefined) {
                DrawCoin(data, boardCells, `coin`,
                    G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j], j,
                    G.publicPlayers[Number(ctx.currentPlayer)], `border-2`,
                    null, data.moves.AddCoinToPouchMove.name, j);
            } else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};

export const DiscardAnyCardFromPlayerBoardProfit = (G: MyGameState, ctx: Ctx,
    data: BoardProps<MyGameState> | IBotMoveArgumentsTypes, playerRows?: JSX.Element[][]): void => {
    for (let i = 0; ; i++) {
        const playerCells: JSX.Element[] = [];
        let isDrawRow = false;
        let isExit = true,
            id = 0;
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
                            DrawCard(data, playerCells,
                                G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][i], id,
                                G.publicPlayers[Number(ctx.currentPlayer)],
                                suit, data.moves.DiscardCardFromPlayerBoardMove.name, suit, i);
                        } else if (Array.isArray(data)) {
                            data.push([suit]);
                        }
                    } else {
                        if (!Array.isArray(data) && playerRows !== undefined) {
                            playerCells.push(
                                <td key={`${G.publicPlayers[Number(ctx.currentPlayer)].nickname} empty card ${id}`}>

                                </td>
                            );
                        }
                    }
                } else {
                    if (!Array.isArray(data) && playerRows !== undefined) {
                        playerCells.push(
                            <td key={`${G.publicPlayers[Number(ctx.currentPlayer)].nickname} empty card ${id}`}>

                            </td>
                        );
                    }
                }
                j++;
            }
        }
        if (!Array.isArray(data) && playerRows !== undefined) {
            if (isDrawRow) {
                playerRows[i].push(
                    <tr key={`${G.publicPlayers[Number(ctx.currentPlayer)].nickname} board row ${i}`}>
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

export const DiscardCardFromBoardProfit = (G: MyGameState, ctx: Ctx,
    data: BoardProps<MyGameState> | IBotMoveArgumentsTypes, boardCells?: JSX.Element[]): void => {
    const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config,
        pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (config !== undefined) {
        for (const suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                if (suit !== config.suit
                    && !(G.drawProfit === ConfigNames.DagdaAction && G.actionsNum === 1 && pickedCard !== null
                        && `suit` in pickedCard && suit === pickedCard.suit)) {
                    const last: number = G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length - 1;
                    if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last].type !== RusCardTypes.HERO) {
                        if (!Array.isArray(data) && boardCells !== undefined) {
                            DrawCard(data, boardCells,
                                G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last], last,
                                G.publicPlayers[Number(ctx.currentPlayer)], suit,
                                data.moves.DiscardCardMove.name, suit, last);
                        } else if (Array.isArray(data)) {
                            data.push([suit, last]);
                        }
                    }
                }
            }
        }
    }
};

export const DiscardCardProfit = (G: MyGameState, ctx: Ctx, data: BoardProps<MyGameState> | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (let j = 0; j < G.drawSize; j++) {
        const card: TavernCardTypes = G.taverns[G.currentTavern][j];
        if (card !== null) {
            if (!Array.isArray(data) && boardCells !== undefined) {
                let suit: null | string = null;
                if (isCardNotAction(card)) {
                    suit = card.suit;
                }
                DrawCard(data, boardCells, card, j,
                    G.publicPlayers[Number(ctx.currentPlayer)], suit,
                    data.moves.DiscardCard2PlayersMove.name, j);
            } else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};

// export const DiscardSuitCardFromPlayerBoardProfit = (G: MyGameState, ctx: Ctx,
//     data?: null | IBotMoveArgumentsTypes, boardCells?: JSX.Element[]): void => {

// };

export const GetEnlistmentMercenariesProfit = (G: MyGameState, ctx: Ctx,
    data: BoardProps<MyGameState> | IBotMoveArgumentsTypes, boardCells?: JSX.Element[]): void => {
    const mercenaries: CampDeckCardTypes[] =
        G.publicPlayers[Number(ctx.currentPlayer)].campCards
            .filter((card: CampDeckCardTypes): boolean => card.type === RusCardTypes.MERCENARY);
    for (let j = 0; j < mercenaries.length; j++) {
        if (!Array.isArray(data) && boardCells !== undefined) {
            DrawCard(data, boardCells, mercenaries[j], j,
                G.publicPlayers[Number(ctx.currentPlayer)], null,
                data.moves.GetEnlistmentMercenariesMove.name, j);
        } else if (Array.isArray(data)) {
            data.push([j]);
        }
    }
};

export const GetMjollnirProfitProfit = (G: MyGameState, ctx: Ctx, data: BoardProps<MyGameState> | number[],
    boardCells?: JSX.Element[]): void => {
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            if (!Array.isArray(data) && boardCells !== undefined) {
                // todo Move logic to DrawCard?
                boardCells.push(
                    <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                        key={`${suit} suit to get Mjöllnir profit`}
                        onClick={() => data.moves.GetMjollnirProfit(suit)}>
                        <span style={Styles.Suits(suit)} className="bg-suit-icon">
                            <b className="whitespace-nowrap text-white">
                                {G.publicPlayers[Number(ctx.currentPlayer)].cards[suit]
                                    .reduce(TotalRank, 0) * 2}
                            </b>
                        </span>
                    </td>
                );
            } else if (Array.isArray(data)) {
                data.push(G.publicPlayers[Number(ctx.currentPlayer)].cards[suit]
                    .reduce(TotalRank, 0));
            }
        }
    }
};

export const PickCampCardHoldaProfit = (G: MyGameState, ctx: Ctx,
    data: BoardProps<MyGameState> | IBotMoveArgumentsTypes, boardCells?: JSX.Element[]): void => {
    for (let j = 0; j < G.campNum; j++) {
        const card: CampCardTypes = G.camp[j];
        if (card !== null) {
            if (!Array.isArray(data) && boardCells !== undefined) {
                DrawCard(data, boardCells, card, j,
                    G.publicPlayers[Number(ctx.currentPlayer)], null,
                    data.moves.ClickCampCardHoldaMove.name, j);
            } else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};

export const PickDiscardCardProfit = (G: MyGameState, ctx: Ctx, data: BoardProps<MyGameState> | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (let j = 0; j < G.discardCardsDeck.length; j++) {
        if (!Array.isArray(data) && boardCells !== undefined) {
            const card: DeckCardTypes = G.discardCardsDeck[j];
            let suit: null | string = null;
            if (isCardNotAction(card)) {
                suit = card.suit;
            }
            DrawCard(data, boardCells, card, j,
                G.publicPlayers[Number(ctx.currentPlayer)], suit,
                data.moves.PickDiscardCardMove.name, j);
        } else if (Array.isArray(data)) {
            data.push([j]);
        }
    }
};

export const PlaceCardsProfit = (G: MyGameState, ctx: Ctx, data: BoardProps<MyGameState> | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
            if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                if (!Array.isArray(data) && boardCells !== undefined) {
                    const config: IConfig | undefined =
                        G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
                    if (config !== undefined) {
                        // todo Move logic to DrawCard?
                        boardCells.push(
                            <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                                key={`Place ${config.drawName} on ${suitsConfig[suit].suitName}`}
                                onClick={() => data.moves.PlaceCard(suit)}>
                                <span style={Styles.Suits(suit)} className="bg-suit-icon">
                                    <b>{G.publicPlayers[Number(ctx.currentPlayer)]
                                        .stack[0].variants?.[suit].points ?? ``}</b>
                                </span>
                            </td>
                        );
                    }
                } else if (Array.isArray(data)) {
                    data.push([suit]);
                }
            }
        }
    }
};

export const PlaceEnlistmentMercenariesProfit = (G: MyGameState, ctx: Ctx,
    data: BoardProps<MyGameState> | IBotMoveArgumentsTypes, boardCells?: JSX.Element[]): void => {
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const card: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
            if (card !== null && `stack` in card) {
                if (card.stack[0].variants !== undefined) {
                    if (suit === card.stack[0].variants[suit]?.suit) {
                        if (!Array.isArray(data) && boardCells !== undefined) {
                            // todo Move logic to DrawCard?
                            boardCells.push(
                                <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                                    onClick={() => data.moves.PlaceEnlistmentMercenaries(suit)}
                                    key={`Place ${card.name} on ${suitsConfig[suit].suitName}`}>
                                    <span style={Styles.Suits(suit)} className="bg-suit-icon">
                                        <b>{card.stack[0].variants[suit].points ?? ``}</b>
                                    </span>
                                </td>
                            );
                        } else if (Array.isArray(data)) {
                            data.push([suit]);
                        }
                    }
                }
            }
        }
    }
};

export const StartEnlistmentMercenariesProfit = (G: MyGameState, ctx: Ctx,
    data: BoardProps<MyGameState> | IBotMoveArgumentsTypes, boardCells?: JSX.Element[]): void => {
    for (let j = 0; j < 2; j++) {
        if (j === 0) {
            // todo Add Enums for ALL text here
            if (!Array.isArray(data) && boardCells !== undefined) {
                DrawButton(data, boardCells, `start Enlistment Mercenaries`, `Start`,
                    G.publicPlayers[Number(ctx.currentPlayer)],
                    data.moves.StartEnlistmentMercenariesMove.name);
            } else if (Array.isArray(data)) {
                data.push([j]);
            }
        } else if (G.publicPlayersOrder.length > 1) {
            if (!Array.isArray(data) && boardCells !== undefined) {
                DrawButton(data, boardCells, `pass Enlistment Mercenaries`, `Pass`,
                    G.publicPlayers[Number(ctx.currentPlayer)],
                    data.moves.PassEnlistmentMercenariesMove.name);
            } else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};

export const UpgradeCoinVidofnirVedrfolnirProfit = (G: MyGameState, ctx: Ctx,
    data: BoardProps<MyGameState> | IBotMoveArgumentsTypes, boardCells?: JSX.Element[]): void => {
    const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    if (config !== undefined) {
        for (let j: number = G.tavernsNum; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length;
            j++) {
            const coin: CoinType = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j];
            if (coin !== null) {
                if (!coin.isTriggerTrading && config.coinId !== j) {
                    if (!Array.isArray(data) && boardCells !== undefined) {
                        DrawCoin(data, boardCells, `coin`,
                            G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j], j,
                            G.publicPlayers[Number(ctx.currentPlayer)], `border-2`,
                            null, data.moves.UpgradeCoinVidofnirVedrfolnirMove.name,
                            j, `board`, coin.isInitial);
                    } else if (Array.isArray(data)) {
                        data.push([j, `board`, coin.isInitial]);
                    }
                }
            }
        }
    }
};
