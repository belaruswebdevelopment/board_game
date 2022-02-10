import { Ctx } from "boardgame.io";
import { BoardProps } from "boardgame.io/react";
import { isActionDiscardCard, isCardNotAction } from "../Card";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { IConfig } from "../typescript/action_interfaces";
import { CampCardTypes, CampDeckCardTypes, DiscardCardTypes, PickedCardType, TavernCardTypes } from "../typescript/card_types";
import { CoinType } from "../typescript/coin_types";
import { ConfigNames, DrawNames, HeroNames, MoveNames, RusCardTypes } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { TotalRank } from "./ScoreHelpers";
import { DrawButton, DrawCard, DrawCoin } from "./UIElementHelpers";

// TODO Add functions dock blocks
export const AddCoinToPouchProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (let j = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
        if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === HeroNames.Uline
            && G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
            DrawCoin(data, boardCells, `coin`,
                G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j], j,
                G.publicPlayers[Number(ctx.currentPlayer)], `border-2`,
                null, MoveNames.AddCoinToPouchMove, j);
        }
    }
};

export const DiscardCardFromBoardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config,
        pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (config !== undefined) {
        for (const suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                if (suit !== config.suit
                    && !(G.drawProfit === ConfigNames.DagdaAction && G.actionsNum === 1 && pickedCard !== null
                        && `suit` in pickedCard && suit === pickedCard.suit)) {
                    const last: number = G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length - 1;
                    if (last !== -1 && G.publicPlayers[Number(ctx.currentPlayer)]
                        .cards[suit][last].type !== RusCardTypes.HERO) {
                        DrawCard(data, boardCells,
                            G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last], last,
                            G.publicPlayers[Number(ctx.currentPlayer)], suit,
                            MoveNames.DiscardCardMove, suit, last);
                    }
                }
            }
        }
    }
};

export const DiscardAnyCardFromPlayerBoardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    // TODO Discard cards must be hidden from others users?
    const playerHeaders: JSX.Element[] = [],
        playerRows: JSX.Element[][] = [];
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            playerHeaders.push(
                <th className={`${suitsConfig[suit].suitColor}`}
                    key={`${data.G.publicPlayers[Number(data.ctx.currentPlayer)].nickname} ${suitsConfig[suit].suitName}`}>
                    <span style={Styles.Suits(suit)} className="bg-suit-icon">

                    </span>
                </th>
            );
        }
    }
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
                        isDrawRow = true;
                        DrawCard(data, playerCells,
                            G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][i], id,
                            G.publicPlayers[Number(ctx.currentPlayer)],
                            suit, MoveNames.DiscardCardFromPlayerBoardMove, suit, i);
                    } else {
                        playerCells.push(
                            <td key={`${G.publicPlayers[Number(ctx.currentPlayer)].nickname} empty card ${id}`}>

                            </td>
                        );
                    }
                } else {
                    playerCells.push(
                        <td key={`${G.publicPlayers[Number(ctx.currentPlayer)].nickname} empty card ${id}`}>

                        </td>
                    );
                }
                j++;
            }
        }
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
    }
    boardCells.push(
        <td
            key={`${data.G.publicPlayers[Number(data.ctx.currentPlayer)].nickname} discard card`}>
            <table>
                <thead>
                    <tr>{playerHeaders}</tr>
                </thead>
                <tbody>{playerRows}</tbody>
            </table>
        </td>
    );
};

export const DiscardCardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>, boardCells: JSX.Element[])
    : void => {
    for (let j = 0; j < G.drawSize; j++) {
        const card: TavernCardTypes = G.taverns[G.currentTavern][j];
        if (card !== null) {
            let suit: null | string = null;
            if (isCardNotAction(card)) {
                suit = card.suit;
            }
            DrawCard(data, boardCells, card, j,
                G.publicPlayers[Number(ctx.currentPlayer)], suit,
                MoveNames.DiscardCard2PlayersMove, j);
        }
    }
};

export const DiscardSuitCardFromPlayerBoardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const playersHeaders: JSX.Element[] = [],
        playersRows: JSX.Element[][] = [],
        config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0]?.config;
    if (config !== undefined && config.suit !== undefined) {
        for (let p = 0; p < G.publicPlayers.length; p++) {
            if (p !== Number(ctx.currentPlayer)) {
                playersHeaders.push(
                    <th className={`${suitsConfig[config.suit].suitColor} discard suit`}
                        key={`${G.publicPlayers[p].nickname} ${suitsConfig[config.suit].suitName}`}>
                        <span style={Styles.Suits(config.suit)} className="bg-suit-icon">
                            {p + 1}
                        </span>
                    </th>
                );
            }
        }
        for (let i = 0; ; i++) {
            let isDrawRow = false,
                isExit = true;
            playersRows[i] = [];
            const playersCells: JSX.Element[] = [];
            for (let p = 0; p < G.publicPlayers.length; p++) {
                if (p !== Number(ctx.currentPlayer)) {
                    if (G.publicPlayers[p].cards[config.suit][i] !== undefined) {
                        if (G.publicPlayers[p].cards[config.suit][i].type !== RusCardTypes.HERO) {
                            isExit = false;
                            isDrawRow = true;
                            DrawCard(data, playersCells, G.publicPlayers[p].cards[config.suit][i],
                                i, G.publicPlayers[p], config.suit,
                                MoveNames.DiscardSuitCardFromPlayerBoardMove, config.suit, p, i);
                        }
                    } else {
                        playersCells.push(
                            <td key={`${G.publicPlayers[p].nickname} discard suit cardboard row ${i}`}>

                            </td>
                        );
                    }
                }
            }
            if (isDrawRow) {
                playersRows[i].push(
                    <tr key={`Discard suit cardboard row ${i}`}>
                        {playersCells}
                    </tr>
                );
            }
            if (isExit) {
                break;
            }
        }
        boardCells.push(
            <td key={`Discard ${config.suit} suit cardboard`}>
                <table>
                    <thead>
                        <tr>{playersHeaders}</tr>
                    </thead>
                    <tbody>{playersRows}</tbody>
                </table>
            </td>
        );
    } else {
        // TODO Errors logging!?
    }
};

export const ExplorerDistinctionProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (let j = 0; j < 3; j++) {
        const card = G.decks[1][j];
        let suit: null | string = null;
        if (isCardNotAction(card)) {
            suit = card.suit;
        }
        DrawCard(data, boardCells, G.decks[1][j], j,
            G.publicPlayers[Number(ctx.currentPlayer)], suit,
            MoveNames.ClickCardToPickDistinctionMove, j);
    }
};

export const GetEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const mercenaries: CampDeckCardTypes[] =
        G.publicPlayers[Number(ctx.currentPlayer)].campCards
            .filter((card: CampDeckCardTypes): boolean => card.type === RusCardTypes.MERCENARY);
    for (let j = 0; j < mercenaries.length; j++) {
        DrawCard(data, boardCells, mercenaries[j], j,
            G.publicPlayers[Number(ctx.currentPlayer)], null,
            MoveNames.GetEnlistmentMercenariesMove, j);
    }
};

export const GetMjollnirProfitProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length) {
                // TODO Move logic to DrawCard?
                boardCells.push(
                    <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                        key={`${suit} suit to get Mjollnir profit`}
                        onClick={() => data.moves.GetMjollnirProfitMove(suit)}>
                        <span style={Styles.Suits(suit)} className="bg-suit-icon">
                            <b className="whitespace-nowrap text-white">
                                {G.publicPlayers[Number(ctx.currentPlayer)].cards[suit]
                                    .reduce(TotalRank, 0) * 2}
                            </b>
                        </span>
                    </td>
                );
            }
        }
    }
};

export const PickCampCardHoldaProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (let j = 0; j < G.campNum; j++) {
        const card: CampCardTypes = G.camp[j];
        if (card !== null) {
            DrawCard(data, boardCells, card, j,
                G.publicPlayers[Number(ctx.currentPlayer)], null,
                MoveNames.ClickCampCardHoldaMove, j);
        }
    }
};

export const PickDiscardCardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (let j = 0; j < G.discardCardsDeck.length; j++) {
        const card: DiscardCardTypes = G.discardCardsDeck[j];
        let suit: null | string = null;
        if (!isActionDiscardCard(card)) {
            suit = card.suit;
        }
        DrawCard(data, boardCells, card, j,
            G.publicPlayers[Number(ctx.currentPlayer)], suit,
            MoveNames.PickDiscardCardMove, j);
    }
};

export const PlaceCardsProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
            if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
                let move: ((suit: string) => void) | null;
                switch (config?.drawName) {
                    case DrawNames.Thrud:
                        move = data.moves.PlaceThrudHeroMove;
                        break;
                    case DrawNames.Ylud:
                        move = data.moves.PlaceYludHeroMove;
                        break;
                    case DrawNames.Olwin:
                        move = data.moves.PlaceOlwinCardMove;
                        break;
                    default:
                        move = null;
                        break;
                }
                if (config !== undefined) {
                    // TODO Move logic to DrawCard?
                    boardCells.push(
                        <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                            key={`Place ${config.drawName} on ${suitsConfig[suit].suitName}`}
                            onClick={() => move?.(suit)}>
                            <span style={Styles.Suits(suit)} className="bg-suit-icon">
                                <b>{G.publicPlayers[Number(ctx.currentPlayer)]
                                    .stack[0].variants?.[suit].points ?? ``}</b>
                            </span>
                        </td>
                    );
                }
            }
        }
    }
};

export const PlaceEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const card: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
            if (card !== null && `variants` in card) {
                if (card.variants !== undefined) {
                    if (suit === card.variants[suit]?.suit) {
                        // TODO Move logic to DrawCard?
                        boardCells.push(
                            <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                                onClick={() => data.moves.PlaceEnlistmentMercenariesMove(suit)}
                                key={`Place ${card.name} on ${suitsConfig[suit].suitName}`}>
                                <span style={Styles.Suits(suit)} className="bg-suit-icon">
                                    <b>{card.variants[suit].points ?? ``}</b>
                                </span>
                            </td>
                        );
                    }
                }
            }
        }
    }
};

export const StartEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (let j = 0; j < 2; j++) {
        if (j === 0) {
            // TODO Add Enums for ALL text here
            DrawButton(data, boardCells, `start Enlistment Mercenaries`, `Start`,
                G.publicPlayers[Number(ctx.currentPlayer)],
                MoveNames.StartEnlistmentMercenariesMove);
        } else if (G.publicPlayersOrder.length > 1) {
            DrawButton(data, boardCells, `pass Enlistment Mercenaries`, `Pass`,
                G.publicPlayers[Number(ctx.currentPlayer)],
                MoveNames.PassEnlistmentMercenariesMove);
        }
    }
};

export const UpgradeCoinProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const handCoins = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
        .filter((coin: CoinType): boolean => coin !== null);
    let handCoinIndex = -1;
    for (let j = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; j++) {
        // TODO Check .? for all coins!!! and delete AS
        if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === HeroNames.Uline
            && G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j] === null) {
            handCoinIndex++;
            const handCoinId: number = G.publicPlayers[Number(data.ctx.currentPlayer)]
                .handCoins.findIndex((coin: CoinType): boolean =>
                    coin?.value === handCoins[handCoinIndex]?.value
                    && coin?.isInitial === handCoins[handCoinIndex]?.isInitial);
            if (G.publicPlayers[Number(ctx.currentPlayer)].handCoins[handCoinId]
                && !G.publicPlayers[Number(ctx.currentPlayer)].handCoins[handCoinId]?.isTriggerTrading) {
                DrawCoin(data, boardCells, `coin`,
                    G.publicPlayers[Number(ctx.currentPlayer)].handCoins[handCoinId], j,
                    G.publicPlayers[Number(ctx.currentPlayer)], `border-2`, null, MoveNames.ClickCoinToUpgradeMove, j, `hand`,
                    handCoins[handCoinIndex]?.isInitial as boolean);
            }
        } else if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]
            && !G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]?.isTriggerTrading) {
            DrawCoin(data, boardCells, `coin`,
                G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j], j,
                G.publicPlayers[Number(ctx.currentPlayer)], `border-2`, null,
                MoveNames.ClickCoinToUpgradeMove, j, `board`,
                G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]?.isInitial as boolean);
        }
    }
};

export const UpgradeCoinVidofnirVedrfolnirProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    if (config !== undefined) {
        for (let j: number = G.tavernsNum; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length;
            j++) {
            const coin: CoinType = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j];
            if (coin !== null) {
                if (!coin.isTriggerTrading && config.coinId !== j) {
                    DrawCoin(data, boardCells, `coin`,
                        G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j], j,
                        G.publicPlayers[Number(ctx.currentPlayer)], `border-2`,
                        null, MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
                        j, `board`, coin.isInitial);
                }
            }
        }
    }
};
