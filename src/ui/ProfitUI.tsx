import { Ctx } from "boardgame.io";
import { BoardProps } from "boardgame.io/react";
import { isActionDiscardCard, isCardNotActionAndNotNull } from "../Card";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { IConfig } from "../typescript/action_interfaces";
import { IBuffs } from "../typescript/buff_interfaces";
import { CampCardTypes, CampDeckCardTypes } from "../typescript/camp_card_types";
import { DeckCardTypes, DiscardCardTypes, PickedCardType, TavernCardTypes } from "../typescript/card_types";
import { CoinType } from "../typescript/coin_types";
import { ConfigNames, DrawNames, MoveNames, RusCardTypes } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";
import { DrawButton, DrawCard, DrawCoin, DrawSuit } from "./ElementsUI";

// TODO Add functions dock blocks
export const AddCoinToPouchProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    for (let j = 0; j < player.handCoins.length; j++) {
        if (player.buffs.find((buff: IBuffs): boolean => buff.everyTurn !== undefined)
            && player.handCoins[j] !== null) {
            DrawCoin(data, boardCells, `coin`, player.handCoins[j], j, player,
                `border-2`, null, MoveNames.AddCoinToPouchMove, j);
        }
    }
};

export const DiscardCardFromBoardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        config: IConfig | undefined = player.stack[0].config,
        pickedCard: PickedCardType = player.pickedCard;
    if (config !== undefined) {
        for (const suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                if (suit !== config.suit
                    && !(G.drawProfit === ConfigNames.DagdaAction && G.actionsNum === 1 && pickedCard !== null
                        && `suit` in pickedCard && suit === pickedCard.suit)) {
                    const last: number = player.cards[suit].length - 1;
                    if (last !== -1 && player.cards[suit][last].type !== RusCardTypes.HERO) {
                        DrawCard(data, boardCells, player.cards[suit][last], last, player, suit,
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
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        playerHeaders: JSX.Element[] = [],
        playerRows: JSX.Element[][] = [];
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            playerHeaders.push(
                <th className={`${suitsConfig[suit].suitColor}`}
                    key={`${player.nickname} ${suitsConfig[suit].suitName}`}>
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
                if (player.cards[suit][i] !== undefined) {
                    isExit = false;
                    if (Array.isArray(data)) {
                        isDrawRow = true;
                    }
                    if (player.cards[suit][i].type !== RusCardTypes.HERO) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, player.cards[suit][i], id, player, suit,
                            MoveNames.DiscardCardFromPlayerBoardMove, suit, i);
                    } else {
                        playerCells.push(
                            <td key={`${player.nickname} empty card ${id}`}>

                            </td>
                        );
                    }
                } else {
                    playerCells.push(
                        <td key={`${player.nickname} empty card ${id}`}>

                        </td>
                    );
                }
                j++;
            }
        }
        if (isDrawRow) {
            playerRows[i].push(
                <tr key={`${player.nickname} board row ${i}`}>
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
            key={`${player.nickname} discard card`}>
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
            if (isCardNotActionAndNotNull(card)) {
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
                    const player: IPublicPlayer = G.publicPlayers[p];
                    if (player.cards[config.suit][i] !== undefined) {
                        if (player.cards[config.suit][i].type !== RusCardTypes.HERO) {
                            isExit = false;
                            isDrawRow = true;
                            DrawCard(data, playersCells, player.cards[config.suit][i], i,
                                player, config.suit, MoveNames.DiscardSuitCardFromPlayerBoardMove,
                                config.suit, p, i);
                        }
                    } else {
                        playersCells.push(
                            <td key={`${player.nickname} discard suit cardboard row ${i}`}>

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
        const card: DeckCardTypes = G.decks[1][j];
        let suit: null | string = null;
        if (isCardNotActionAndNotNull(card)) {
            suit = card.suit;
        }
        DrawCard(data, boardCells, G.decks[1][j], j,
            G.publicPlayers[Number(ctx.currentPlayer)], suit,
            MoveNames.ClickCardToPickDistinctionMove, j);
    }
};

export const GetEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        mercenaries: CampDeckCardTypes[] = player.campCards.filter((card: CampDeckCardTypes): boolean =>
            card.type === RusCardTypes.MERCENARY);
    for (let j = 0; j < mercenaries.length; j++) {
        DrawCard(data, boardCells, mercenaries[j], j, player, null,
            MoveNames.GetEnlistmentMercenariesMove, j);
    }
};

export const GetMjollnirProfitProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player.cards[suit].length) {
                const config: IConfig | undefined = player.stack[0].config;
                if (config !== undefined && config.drawName !== undefined) {
                    const value: number | string =
                        player.cards[suit].reduce(TotalRank, 0) * 2;
                    DrawSuit(data, boardCells, suit, config.drawName, value, player,
                        MoveNames.GetMjollnirProfitMove);
                }
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
        DrawCard(data, boardCells, card, j, G.publicPlayers[Number(ctx.currentPlayer)],
            suit, MoveNames.PickDiscardCardMove, j);
    }
};

export const PlaceCardsProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>, boardCells: JSX.Element[]):
    void => {
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
                pickedCard: PickedCardType = player.pickedCard;
            if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                const config: IConfig | undefined = player.stack[0].config;
                let moveName: string | null;
                if (config !== undefined && config.drawName !== undefined) {
                    switch (config?.drawName) {
                        case DrawNames.Thrud:
                            moveName = MoveNames.PlaceThrudHeroMove;
                            break;
                        case DrawNames.Ylud:
                            moveName = MoveNames.PlaceYludHeroMove;
                            break;
                        case DrawNames.Olwin:
                            moveName = MoveNames.PlaceOlwinCardMove;
                            break;
                        default:
                            moveName = null;
                            break;
                    }
                    const value: number | string = player.stack[0].variants?.[suit].points ?? ``;
                    DrawSuit(data, boardCells, suit, config.drawName, value, player, moveName);
                }
            }
        }
    }
};

export const PlaceEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
                card: PickedCardType = player.pickedCard;
            if (card !== null && `variants` in card) {
                if (card.variants !== undefined) {
                    const config: IConfig | undefined = player.stack[0].config;
                    if (config !== undefined && config.drawName !== undefined) {
                        if (suit === card.variants[suit]?.suit) {
                            const value: number | string = card.variants[suit].points ?? ``;
                            DrawSuit(data, boardCells, suit, config.drawName, value, player,
                                MoveNames.PlaceEnlistmentMercenariesMove);
                        }
                    }
                }
            }
        }
    }
};

export const StartEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (let j = 0; j < 2; j++) {
        const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
        if (j === 0) {
            // TODO Add Enums for ALL text here
            DrawButton(data, boardCells, `start Enlistment Mercenaries`, `Start`, player,
                MoveNames.StartEnlistmentMercenariesMove);
        } else if (G.publicPlayersOrder.length > 1) {
            DrawButton(data, boardCells, `pass Enlistment Mercenaries`, `Pass`, player,
                MoveNames.PassEnlistmentMercenariesMove);
        }
    }
};

export const UpgradeCoinProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        handCoins: CoinType[] = player.handCoins.filter((coin: CoinType): boolean => coin !== null);
    let handCoinIndex = -1;
    for (let j = 0; j < player.boardCoins.length; j++) {
        // TODO Check .? for all coins!!! and delete AS
        if (player.buffs.find((buff: IBuffs): boolean => buff.everyTurn !== undefined)
            && player.boardCoins[j] === null) {
            handCoinIndex++;
            const handCoinId: number = player.handCoins.findIndex((coin: CoinType): boolean =>
                coin?.value === handCoins[handCoinIndex]?.value
                && coin?.isInitial === handCoins[handCoinIndex]?.isInitial);
            if (player.handCoins[handCoinId] && !player.handCoins[handCoinId]?.isTriggerTrading) {
                DrawCoin(data, boardCells, `coin`, player.handCoins[handCoinId], j,
                    player, `border-2`, null,
                    MoveNames.ClickCoinToUpgradeMove, j, `hand`,
                    handCoins[handCoinIndex]?.isInitial as boolean);
            }
        } else if (player.boardCoins[j] && !player.boardCoins[j]?.isTriggerTrading) {
            DrawCoin(data, boardCells, `coin`, player.boardCoins[j], j, player,
                `border-2`, null, MoveNames.ClickCoinToUpgradeMove,
                j, `board`, player.boardCoins[j]?.isInitial as boolean);
        }
    }
};

export const UpgradeCoinVidofnirVedrfolnirProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        config: IConfig | undefined = player.stack[0].config;
    if (config !== undefined) {
        for (let j: number = G.tavernsNum; j < player.boardCoins.length; j++) {
            const coin: CoinType = player.boardCoins[j];
            if (coin !== null) {
                if (!coin.isTriggerTrading && config.coinId !== j) {
                    DrawCoin(data, boardCells, `coin`, player.boardCoins[j], j,
                        player, `border-2`, null,
                        MoveNames.UpgradeCoinVidofnirVedrfolnirMove, j, `board`, coin.isInitial);
                }
            }
        }
    }
};
