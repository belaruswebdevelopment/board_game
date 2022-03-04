import type { Ctx } from "boardgame.io";
import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { IsMercenaryCampCard } from "../Camp";
import { IsActionCard, IsCardNotActionAndNotNull } from "../Card";
import { IsCoin } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { IsHeroCard } from "../Hero";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { ConfigNames, DrawNames, MoveNames, RusCardTypes } from "../typescript/enums";
import type { CampCardTypes, CampDeckCardTypes, CoinType, DeckCardTypes, DiscardCardTypes, IBuffs, IConfig, IMyGameState, IPublicPlayer, IVariant, PickedCardType, SuitTypes, TavernCardTypes } from "../typescript/interfaces";
import { DrawButton, DrawCard, DrawCoin, DrawSuit } from "./ElementsUI";

// TODO Add functions dock blocks and Errors!
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
        let suit: SuitTypes;
        for (suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                if (suit !== config.suit
                    && !(G.drawProfit === ConfigNames.DagdaAction && player.actionsNum === 1 && pickedCard !== null
                        && `suit` in pickedCard && suit === pickedCard.suit)) {
                    const last: number = player.cards[suit].length - 1;
                    if (last !== -1 && !IsHeroCard(player.cards[suit][last])) {
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
    let suit: SuitTypes;
    for (suit in suitsConfig) {
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
        let isDrawRow = false,
            isExit = true,
            id = 0;
        if (!Array.isArray(data) && playerRows !== undefined) {
            playerRows[i] = [];
        }
        let j = 0;
        for (suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                id = i + j;
                if (player.cards[suit][i] !== undefined) {
                    isExit = false;
                    if (Array.isArray(data)) {
                        isDrawRow = true;
                    }
                    if (!IsHeroCard(player.cards[suit][i])) {
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
            let suit: SuitTypes | null = null;
            if (IsCardNotActionAndNotNull(card)) {
                suit = card.suit;
            }
            DrawCard(data, boardCells, card, j,
                G.publicPlayers[Number(ctx.currentPlayer)], suit,
                MoveNames.DiscardCard2PlayersMove, j);
        }
    }
};

export const DiscardSuitCardFromPlayerBoardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void | never => {
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
                        if (!IsHeroCard(player.cards[config.suit][i])) {
                            isExit = false;
                            isDrawRow = true;
                            DrawCard(data, playersCells, player.cards[config.suit][i],
                                i, player, config.suit, MoveNames.DiscardSuitCardFromPlayerBoardMove,
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
        throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config' и/или 'stack[0].config.suit'.`);
    }
};

export const ExplorerDistinctionProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (let j = 0; j < 3; j++) {
        const card: DeckCardTypes = G.decks[1][j];
        let suit: null | SuitTypes = null;
        if (IsCardNotActionAndNotNull(card)) {
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
            IsMercenaryCampCard(card));
    for (let j = 0; j < mercenaries.length; j++) {
        DrawCard(data, boardCells, mercenaries[j], j, player, null,
            MoveNames.GetEnlistmentMercenariesMove, j);
    }
};

export const GetMjollnirProfitProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    let suit: SuitTypes;
    for (suit in suitsConfig) {
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
        let suit: null | SuitTypes = null;
        if (!IsActionCard(card)) {
            suit = card.suit;
        }
        DrawCard(data, boardCells, card, j, G.publicPlayers[Number(ctx.currentPlayer)],
            suit, MoveNames.PickDiscardCardMove, j);
    }
};

export const PlaceCardsProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>, boardCells: JSX.Element[]):
    void | never => {
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
                pickedCard: PickedCardType = player.pickedCard;
            if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                const config: IConfig | undefined = player.stack[0].config;
                let moveName: string | null;
                if (config !== undefined && config.drawName !== undefined) {
                    switch (config.drawName) {
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
                            throw new Error(`Нет такого мува.`);
                    }
                    const value: number | string = player.stack[0].variants?.[suit].points ?? ``;
                    DrawSuit(data, boardCells, suit, config.drawName, value, player, moveName);
                }
            }
        }
    }
};

export const PlaceEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void | never => {
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        // TODO Add all Errors for hasOwnProperty!!!!!!!!!!!!!!!!!!!?
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
                card: PickedCardType = player.pickedCard;
            if (card !== null && `variants` in card) {
                if (card.variants !== undefined) {
                    const config: IConfig | undefined = player.stack[0].config;
                    if (config !== undefined && config.drawName !== undefined) {
                        if (suit === card.variants[suit]?.suit) {
                            const cardVariants: IVariant | undefined = card.variants[suit];
                            if (cardVariants !== undefined) {
                                const value: number | string = cardVariants.points ?? ``;
                                DrawSuit(data, boardCells, suit, config.drawName, value, player,
                                    MoveNames.PlaceEnlistmentMercenariesMove);
                            } else {
                                throw new Error(`У выбранной карты отсутствует обязательный параметр 'variants[suit]'.`);
                            }
                        }
                    } else {
                        throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config' и/или 'stack[0].config.drawName'.`);
                    }
                } else {
                    throw new Error(`У выбранной карты отсутствует обязательный параметр 'variants'.`);
                }
            } else {
                throw new Error(`Выбранная карта должна быть с типом '${RusCardTypes.MERCENARY}'.`);
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
        handCoins: CoinType[] = player.handCoins.filter((coin: CoinType): boolean => IsCoin(coin));
    let handCoinIndex = -1;
    for (let j = 0; j < player.boardCoins.length; j++) {
        const boardCoin: CoinType = player.boardCoins[j];
        if (player.buffs.find((buff: IBuffs): boolean => buff.everyTurn !== undefined) !== undefined
            && boardCoin === null) {
            handCoinIndex++;
            const handCoinNotNull: CoinType = handCoins[handCoinIndex],
                handCoinId: number = player.handCoins.findIndex((coin: CoinType): boolean =>
                    IsCoin(handCoinNotNull) && coin?.value === handCoinNotNull.value
                    && coin.isInitial === handCoinNotNull.isInitial);
            if (handCoinId !== -1) {
                const handCoin: CoinType = player.handCoins[handCoinId];
                if (IsCoin(handCoin) && !handCoin.isTriggerTrading) {
                    DrawCoin(data, boardCells, `coin`, handCoin, j, player,
                        `border-2`, null, MoveNames.ClickCoinToUpgradeMove,
                        j, `hand`, handCoin.isInitial);
                }
            } else {
                // TODO Is it need Error!?
            }
        } else if (IsCoin(boardCoin) && !boardCoin.isTriggerTrading) {
            DrawCoin(data, boardCells, `coin`, boardCoin, j, player,
                `border-2`, null, MoveNames.ClickCoinToUpgradeMove,
                j, `board`, boardCoin.isInitial);
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
            if (IsCoin(coin)) {
                if (!coin.isTriggerTrading && config.coinId !== j) {
                    DrawCoin(data, boardCells, `coin`, coin, j, player, `border-2`,
                        null, MoveNames.UpgradeCoinVidofnirVedrfolnirMove, j,
                        `board`, coin.isInitial);
                }
            }
        }
    } else {
        throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config'.`);
    }
};
