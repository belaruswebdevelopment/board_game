import { Ctx } from "boardgame.io";
import { ConfigNames } from "../actions/Actions";
import { IBotMoveArgumentsTypes } from "../AI";
import { isCardNotAction, RusCardTypes } from "../Card";
import { ICoin } from "../Coin";
import { HeroNames } from "../data/HeroData";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { GameBoard } from "../GameBoard";
import { CampCardTypes, CampDeckCardTypes, DeckCardTypes, MyGameState, TavernCardTypes } from "../GameSetup";
import { IConfig, PickedCardType } from "../Player";
import { TotalRank } from "./ScoreHelpers";
import {
    DrawButton,
    DrawCard,
    DrawCoin,
    OnClickCampCardHolda,
    OnClickCardFromDiscard,
    OnClickCardToDiscard,
    OnClickCardToDiscard2Players,
    OnClickCoinToAddToPouch,
    OnClickCoinToUpgradeVidofnirVedrfolnir,
    OnClickDiscardCardFromPlayerBoard,
    OnClickGetEnlistmentMercenaries,
    OnClickPassEnlistmentMercenaries,
    OnClickStartEnlistmentMercenaries
} from "./UIHelpers";

// todo Add functions docbloocks
export const AddCoinToPouchProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (let j: number = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
        if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === HeroNames.Uline
            && G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                DrawCoin(data, boardCells, `coin`,
                    G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j], j,
                    G.publicPlayers[Number(ctx.currentPlayer)], `border-2`, null, OnClickCoinToAddToPouch.name, j);
            } else if (Array.isArray(data)) {
                data.push([j]);
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
        let j: number = 0;
        for (const suit in suitsConfig) {
            if (suitsConfig.hasOwnProperty(suit)) {
                id = i + j;
                if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][i] !== undefined) {
                    isExit = false;
                    if (Array.isArray(data)) {
                        isDrawRow = true;
                    }
                    if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][i].type !== RusCardTypes.HERO) {
                        if (data instanceof GameBoard && playerRows !== undefined) {
                            isDrawRow = true;
                            DrawCard(data, playerCells,
                                data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                    .cards[suit][i], id,
                                data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)],
                                suit, OnClickDiscardCardFromPlayerBoard.name, suit, i);
                        } else if (Array.isArray(data)) {
                            data.push([suit]);
                        }
                    } else {
                        if (data instanceof GameBoard && playerRows !== undefined) {
                            playerCells.push(
                                <td key={`${data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].nickname} empty card ${id}`}>

                                </td>
                            );
                        }
                    }
                } else {
                    if (data instanceof GameBoard && playerRows !== undefined) {
                        playerCells.push(
                            <td key={`${data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].nickname} empty card ${id}`}>

                            </td>
                        );
                    }
                }
                j++;
            }
        }
        if (data instanceof GameBoard && playerRows !== undefined) {
            if (isDrawRow) {
                playerRows[i].push(
                    <tr key={`${data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].nickname} board row ${i}`}>
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

export const DiscardCardFromBoardProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config,
        pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (config !== undefined) {
        for (const suit in suitsConfig) {
            if (suitsConfig.hasOwnProperty(suit)) {
                if (suit !== config.suit
                    && !(G.drawProfit === ConfigNames.DagdaAction && G.actionsNum === 1 && pickedCard !== null
                        && `suit` in pickedCard && suit === pickedCard.suit)) {
                    const last: number = G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length - 1;
                    if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last].type !== RusCardTypes.HERO) {
                        if (data instanceof GameBoard && boardCells !== undefined) {
                            DrawCard(data, boardCells,
                                G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last], last,
                                G.publicPlayers[Number(ctx.currentPlayer)], suit,
                                OnClickCardToDiscard.name, suit, last);
                        } else if (Array.isArray(data)) {
                            data.push([suit, last]);
                        }
                    }
                }
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
                    G.publicPlayers[Number(ctx.currentPlayer)], suit, OnClickCardToDiscard2Players.name, j);
            } else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};

// export const DiscardSuitCardFromPlayerBoardProfit = (G: MyGameState, ctx: Ctx,
//     data?: GameBoard | IBotMoveArgumentsTypes, boardCells?: JSX.Element[]): void => {

// };

export const GetEnlistmentMercenariesProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    const mercenaries: CampDeckCardTypes[] =
        G.publicPlayers[Number(ctx.currentPlayer)].campCards
            .filter((card: CampDeckCardTypes): boolean => card.type === RusCardTypes.MERCENARY);
    for (let j: number = 0; j < mercenaries.length; j++) {
        if (data instanceof GameBoard && boardCells !== undefined) {
            DrawCard(data, boardCells, mercenaries[j], j,
                G.publicPlayers[Number(ctx.currentPlayer)], null,
                OnClickGetEnlistmentMercenaries.name, j);
        } else if (Array.isArray(data)) {
            data.push([j]);
        }
    }
};

export const GetMjollnirProfitProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | number[],
    boardCells?: JSX.Element[]): void => {
    for (const suit in suitsConfig) {
        if (suitsConfig.hasOwnProperty(suit)) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                // todo Move logic to DrawCard?
                boardCells.push(
                    <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                        key={`${suit} suit to get Mjöllnir profit`}
                        onClick={() => data.OnClickSuitToGetMjollnirProfit(suit)}>
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

export const PickCampCardHoldaProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (let j: number = 0; j < G.campNum; j++) {
        const card: CampCardTypes = G.camp[j];
        if (card !== null) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                DrawCard(data, boardCells, card, j,
                    G.publicPlayers[Number(ctx.currentPlayer)], null,
                    OnClickCampCardHolda.name, j);
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
                G.publicPlayers[Number(ctx.currentPlayer)], suit, OnClickCardFromDiscard.name,
                j);
        } else if (Array.isArray(data)) {
            data.push([j]);
        }
    }
};

export const PlaceCardsProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (const suit in suitsConfig) {
        if (suitsConfig.hasOwnProperty(suit)) {
            const pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
            if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                if (data instanceof GameBoard && boardCells !== undefined) {
                    const config: IConfig | undefined =
                        G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
                    if (config !== undefined) {
                        // todo Move logic to DrawCard?
                        boardCells.push(
                            <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                                key={`Place ${config.drawName} on ${suitsConfig[suit].suitName}`}
                                onClick={() => data.OnClickSuitToPlaceCard(suit)}>
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

export const PlaceEnlistmentMercenariesProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (const suit in suitsConfig) {
        if (suitsConfig.hasOwnProperty(suit)) {
            const card: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
            if (card !== null && `stack` in card) {
                if (card.stack[0].variants !== undefined) {
                    if (suit === card.stack[0].variants[suit]?.suit) {
                        if (data instanceof GameBoard && boardCells !== undefined) {
                            // todo Move logic to DrawCard?
                            boardCells.push(
                                <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                                    onClick={() => data.OnClickSuitToPlaceMercenary(suit)}
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

export const StartEnlistmentMercenariesProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    for (let j: number = 0; j < 2; j++) {
        if (j === 0) {
            // todo Add Enums for text
            if (data instanceof GameBoard && boardCells !== undefined) {
                DrawButton(data, boardCells, `start Enlistment Mercenaries`, `Start`,
                    G.publicPlayers[Number(ctx.currentPlayer)],
                    OnClickStartEnlistmentMercenaries.name);
            } else if (Array.isArray(data)) {
                data.push([j]);
            }
        } else if (G.publicPlayersOrder.length > 1) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                DrawButton(data, boardCells, `pass Enlistment Mercenaries`, `Pass`,
                    G.publicPlayers[Number(ctx.currentPlayer)],
                    OnClickPassEnlistmentMercenaries.name);
            } else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};

export const UpgradeCoinVidofnirVedrfolnirProfit = (G: MyGameState, ctx: Ctx, data?: GameBoard | IBotMoveArgumentsTypes,
    boardCells?: JSX.Element[]): void => {
    const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    if (config !== undefined) {
        for (let j: number = G.tavernsNum; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; j++) {
            const coin: ICoin | null = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j];
            if (coin !== null) {
                if (!coin.isTriggerTrading && config.coinId !== j) {
                    if (data instanceof GameBoard && boardCells !== undefined) {
                        DrawCoin(data, boardCells, `coin`,
                            G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j], j,
                            G.publicPlayers[Number(ctx.currentPlayer)], `border-2`,
                            null, OnClickCoinToUpgradeVidofnirVedrfolnir.name, j,
                            `board`, coin.isInitial);
                    } else if (Array.isArray(data)) {
                        data.push([j, `board`, coin.isInitial]);
                    }
                }
            }
        }
    }
};
