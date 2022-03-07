import type { Ctx } from "boardgame.io";
import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { IsMercenaryCampCard } from "../Camp";
import { IsActionCard, IsCardNotActionAndNotNull } from "../Card";
import { IsCoin } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { IsHeroCard } from "../Hero";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { BuffNames, ConfigNames, DrawNames, MoveNames, RusCardTypes } from "../typescript/enums";
import type { CampCardTypes, CampDeckCardTypes, CoinType, DeckCardTypes, DiscardCardTypes, IMyGameState, IPublicPlayer, IVariant, PickedCardType, PlayerCardsType, SuitTypes, TavernCardTypes } from "../typescript/interfaces";
import { DrawButton, DrawCard, DrawCoin, DrawSuit } from "./ElementsUI";

// TODO Add functions dock blocks and Errors!
export const AddCoinToPouchProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        for (let j = 0; j < player.handCoins.length; j++) {
            const handCoin: CoinType | undefined = player.handCoins[j];
            if (handCoin !== undefined) {
                if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && handCoin !== null) {
                    DrawCoin(data, boardCells, `coin`, handCoin, j, player,
                        `border-2`, null, MoveNames.AddCoinToPouchMove, j);
                }
            } else {
                throw new Error(`В массиве монет игрока на столе отсутствует монета ${j}.`);
            }
        }
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};

export const DiscardCardFromBoardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const configSuit: SuitTypes | undefined = player.stack[0]?.config?.suit,
            pickedCard: PickedCardType = player.pickedCard;
        if (configSuit !== undefined) {
            let suit: SuitTypes;
            for (suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    if (suit !== configSuit
                        && !(G.drawProfit === ConfigNames.DagdaAction && player.actionsNum === 1 && pickedCard !== null
                            && `suit` in pickedCard && suit === pickedCard.suit)) {
                        const last: number = player.cards[suit].length - 1;
                        if (last !== -1 && !IsHeroCard(player.cards[suit][last])) {
                            const card: PlayerCardsType | undefined = player.cards[suit][last];
                            if (card !== undefined) {
                                DrawCard(data, boardCells, card, last, player, suit,
                                    MoveNames.DiscardCardMove, suit, last);
                            } else {
                                throw new Error(`В массиве карт фракции ${suit} отсутствует последняя карта ${last}.`);
                            }
                        }
                    }
                }
            }
        } else {
            throw new Error(`Отсутствует обязательный параметр 'stack[0].config.suit'.`);
        }
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};

export const DiscardAnyCardFromPlayerBoardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    // TODO Discard cards must be hidden from others users?
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const playerHeaders: JSX.Element[] = [],
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
            if (!Array.isArray(data)) {
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
                            const card: PlayerCardsType | undefined = player.cards[suit][i];
                            if (card !== undefined) {
                                DrawCard(data, playerCells, card, id, player, suit,
                                    MoveNames.DiscardCardFromPlayerBoardMove, suit, i);
                            } else {
                                throw new Error(`В массиве карт фракции ${suit} отсутствует карта ${i}.`);
                            }
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
                // TODO Check it "?"
                playerRows[i]?.push(
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
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};

export const DiscardCardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>, boardCells: JSX.Element[])
    : void => {
    for (let j = 0; j < G.drawSize; j++) {
        const currentTavern: TavernCardTypes[] | undefined = G.taverns[G.currentTavern];
        if (currentTavern !== undefined) {
            const card: TavernCardTypes | undefined = currentTavern[j];
            if (card !== undefined) {
                if (card !== null) {
                    let suit: SuitTypes | null = null;
                    if (IsCardNotActionAndNotNull(card)) {
                        suit = card.suit;
                    }
                    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
                    if (player !== undefined) {
                        DrawCard(data, boardCells, card, j, player, suit,
                            MoveNames.DiscardCard2PlayersMove, j);
                    } else {
                        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                    }
                }
            } else {
                throw new Error(`В массиве карт текущей таверны отсутствует карта ${j}.`);
            }
        } else {
            throw new Error(`В массиве таверн отсутствует текущая таверна.`);
        }
    }
};

export const DiscardSuitCardFromPlayerBoardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void | never => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const playersHeaders: JSX.Element[] = [],
            playersRows: JSX.Element[][] = [],
            suit: SuitTypes | undefined = player.stack[0]?.config?.suit;
        if (suit !== undefined) {
            for (let p = 0; p < G.publicPlayers.length; p++) {
                if (p !== Number(ctx.currentPlayer)) {
                    const playerP1: IPublicPlayer | undefined = G.publicPlayers[p];
                    if (playerP1 !== undefined) {
                        playersHeaders.push(
                            <th className={`${suitsConfig[suit].suitColor} discard suit`}
                                key={`${playerP1.nickname} ${suitsConfig[suit].suitName}`}>
                                <span style={Styles.Suits(suit)} className="bg-suit-icon">
                                    {p + 1}
                                </span>
                            </th>
                        );
                    } else {
                        throw new Error(`В массиве игроков отсутствует игрок 1 ${p}.`);
                    }
                }
            }
            for (let i = 0; ; i++) {
                let isDrawRow = false,
                    isExit = true;
                playersRows[i] = [];
                const playersCells: JSX.Element[] = [];
                for (let p = 0; p < G.publicPlayers.length; p++) {
                    if (p !== Number(ctx.currentPlayer)) {
                        const playerP2: IPublicPlayer | undefined = G.publicPlayers[p];
                        if (playerP2 !== undefined) {
                            if (playerP2.cards[suit][i] !== undefined) {
                                if (!IsHeroCard(playerP2.cards[suit][i])) {
                                    isExit = false;
                                    isDrawRow = true;
                                    const card: PlayerCardsType | undefined = playerP2.cards[suit][i];
                                    if (card !== undefined) {
                                        DrawCard(data, playersCells, card, i, playerP2,
                                            suit, MoveNames.DiscardSuitCardFromPlayerBoardMove,
                                            suit, p, i);
                                    } else {
                                        throw new Error(`В массиве карт фракции ${suit} игрока отсутствует карта ${i}.`);
                                    }
                                }
                            } else {
                                playersCells.push(
                                    <td key={`${playerP2.nickname} discard suit cardboard row ${i}`}>

                                    </td>
                                );
                            }
                        } else {
                            throw new Error(`В массиве игроков отсутствует игрок 2 ${p}.`);
                        }
                    }
                }
                if (isDrawRow) {
                    // TODO Check it "?"
                    playersRows[i]?.push(
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
                <td key={`Discard ${suit} suit cardboard`}>
                    <table>
                        <thead>
                            <tr>{playersHeaders}</tr>
                        </thead>
                        <tbody>{playersRows}</tbody>
                    </table>
                </td>
            );
        } else {
            throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config.suit'.`);
        }
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};

export const ExplorerDistinctionProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (let j = 0; j < 3; j++) {
        const deck1: DeckCardTypes[] | undefined = G.decks[1];
        if (deck1 !== undefined) {
            const card: DeckCardTypes | undefined = deck1[j];
            if (card !== undefined) {
                let suit: null | SuitTypes = null;
                if (IsCardNotActionAndNotNull(card)) {
                    suit = card.suit;
                }
                const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player !== undefined) {
                    DrawCard(data, boardCells, card, j, player, suit,
                        MoveNames.ClickCardToPickDistinctionMove, j);
                } else {
                    throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                }
            } else {
                throw new Error(`В массиве карт 2 эпохи отсутствует карта ${j}.`);
            }
        } else {
            throw new Error(`В массиве дек карт отсутствует дека 1 эпохи.`);
        }
    }
};

export const GetEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const mercenaries: CampDeckCardTypes[] =
            player.campCards.filter((card: CampDeckCardTypes): boolean => IsMercenaryCampCard(card));
        for (let j = 0; j < mercenaries.length; j++) {
            const card: CampDeckCardTypes | undefined = mercenaries[j];
            if (card !== undefined) {
                DrawCard(data, boardCells, card, j, player, null,
                    MoveNames.GetEnlistmentMercenariesMove, j);
            } else {
                throw new Error(`В массиве карт кэмпа игрока отсутствует карта наёмника ${j}.`);
            }
        }
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};

export const GetMjollnirProfitProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player !== undefined) {
                if (player.cards[suit].length) {
                    const drawName: string | undefined = player.stack[0]?.config?.drawName;
                    if (drawName !== undefined) {
                        const value: number | string =
                            player.cards[suit].reduce(TotalRank, 0) * 2;
                        DrawSuit(data, boardCells, suit, drawName, value, player,
                            MoveNames.GetMjollnirProfitMove);
                    } else {
                        throw new Error(`Отсутствует обязательный параметр 'player.stack[0].config.drawName'.`);
                    }
                }
            } else {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
        }
    }
};

export const PickCampCardHoldaProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (let j = 0; j < G.campNum; j++) {
        const card: CampCardTypes | undefined = G.camp[j];
        if (card !== undefined) {
            if (card !== null) {
                const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player !== undefined) {
                    DrawCard(data, boardCells, card, j,
                        player, null, MoveNames.ClickCampCardHoldaMove, j);
                } else {
                    throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                }
            }
        } else {
            throw new Error(`В массиве карт кэмпа отсутствует карта ${j}.`);
        }
    }
};

export const PickDiscardCardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (let j = 0; j < G.discardCardsDeck.length; j++) {
        const card: DiscardCardTypes | undefined = G.discardCardsDeck[j];
        if (card !== undefined) {
            let suit: null | SuitTypes = null;
            if (!IsActionCard(card)) {
                suit = card.suit;
            }
            const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player !== undefined) {
                DrawCard(data, boardCells, card, j, player, suit, MoveNames.PickDiscardCardMove,
                    j);
            } else {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
        } else {
            throw new Error(`В массиве карт сброса отсутствует карта ${j}.`);
        }
    }
};

export const PlaceCardsProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>, boardCells: JSX.Element[]):
    void | never => {
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player !== undefined) {
                const pickedCard: PickedCardType = player.pickedCard;
                if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                    const drawName: string | undefined = player.stack[0]?.config?.drawName;
                    if (drawName !== undefined) {
                        let moveName: string | null;
                        switch (drawName) {
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
                        const value: number | string = player.stack[0]?.variants?.[suit].points ?? ``;
                        DrawSuit(data, boardCells, suit, drawName, value, player, moveName);
                    } else {
                        throw new Error(`Отсутствует обязательный параметр 'player.stack[0].config.drawName'.`);
                    }
                }
            } else {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
        }
    }
};

export const PlaceEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void | never => {
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player !== undefined) {
                const card: PickedCardType = player.pickedCard;
                if (card !== null && `variants` in card) {
                    if (card.variants !== undefined) {
                        const drawName: string | undefined = player.stack[0]?.config?.drawName;
                        if (drawName !== undefined) {
                            if (suit === card.variants[suit]?.suit) {
                                const cardVariants: IVariant | undefined = card.variants[suit];
                                if (cardVariants !== undefined) {
                                    const value: number | string = cardVariants.points ?? ``;
                                    DrawSuit(data, boardCells, suit, drawName, value, player,
                                        MoveNames.PlaceEnlistmentMercenariesMove);
                                } else {
                                    throw new Error(`У выбранной карты отсутствует обязательный параметр 'variants[suit]'.`);
                                }
                            }
                        } else {
                            throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config.drawName'.`);
                        }
                    } else {
                        throw new Error(`У выбранной карты отсутствует обязательный параметр 'variants'.`);
                    }
                } else {
                    throw new Error(`Выбранная карта должна быть с типом '${RusCardTypes.MERCENARY}'.`);
                }
            } else {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
        }
    }
};

export const StartEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (let j = 0; j < 2; j++) {
        const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player !== undefined) {
            if (j === 0) {
                // TODO Add Enums for ALL text here
                DrawButton(data, boardCells, `start Enlistment Mercenaries`, `Start`, player,
                    MoveNames.StartEnlistmentMercenariesMove);
            } else if (G.publicPlayersOrder.length > 1) {
                DrawButton(data, boardCells, `pass Enlistment Mercenaries`, `Pass`, player,
                    MoveNames.PassEnlistmentMercenariesMove);
            }
        } else {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
    }
};

export const UpgradeCoinProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const handCoins: CoinType[] = player.handCoins.filter((coin: CoinType): boolean => IsCoin(coin));
        let handCoinIndex = -1;
        for (let j = 0; j < player.boardCoins.length; j++) {
            const boardCoin: CoinType | undefined = player.boardCoins[j];
            if (boardCoin !== undefined) {
                if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && boardCoin === null) {
                    handCoinIndex++;
                    const handCoinNotNull: CoinType | undefined = handCoins[handCoinIndex];
                    if (handCoinNotNull !== undefined) {
                        const handCoinId: number = player.handCoins.findIndex((coin: CoinType): boolean =>
                            IsCoin(handCoinNotNull) && coin?.value === handCoinNotNull.value
                            && coin.isInitial === handCoinNotNull.isInitial);
                        if (handCoinId !== -1) {
                            const handCoin: CoinType | undefined = player.handCoins[handCoinId];
                            if (handCoin !== undefined) {
                                if (IsCoin(handCoin) && !handCoin.isTriggerTrading) {
                                    DrawCoin(data, boardCells, `coin`, handCoin, j, player,
                                        `border-2`, null,
                                        MoveNames.ClickCoinToUpgradeMove, j, `hand`,
                                        handCoin.isInitial);
                                }
                            } else {
                                throw new Error(`В массиве монет игрока в руке 2 отсутствует монета ${handCoinId}.`);
                            }
                        } else {
                            // TODO Is it need Error!?
                            console.log(`Test me!`);
                        }
                    } else {
                        throw new Error(`В массиве монет игрока в руке 1 отсутствует монета ${handCoinIndex}.`);
                    }
                } else if (IsCoin(boardCoin) && !boardCoin.isTriggerTrading) {
                    DrawCoin(data, boardCells, `coin`, boardCoin, j, player,
                        `border-2`, null, MoveNames.ClickCoinToUpgradeMove,
                        j, `board`, boardCoin.isInitial);
                }
            } else {
                throw new Error(`В массиве монет игрока на столе отсутствует монета ${j}.`);
            }
        }
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};

export const UpgradeCoinVidofnirVedrfolnirProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        for (let j: number = G.tavernsNum; j < player.boardCoins.length; j++) {
            const boardCoin: CoinType | undefined = player.boardCoins[j];
            if (boardCoin !== undefined) {
                if (IsCoin(boardCoin)) {
                    if (!boardCoin.isTriggerTrading && player.stack[0]?.config?.coinId !== j) {
                        DrawCoin(data, boardCells, `coin`, boardCoin, j, player,
                            `border-2`, null,
                            MoveNames.UpgradeCoinVidofnirVedrfolnirMove, j, `board`,
                            boardCoin.isInitial);
                    }
                }
            } else {
                throw new Error(`В массиве монет игрока на столе отсутствует монета ${j}.`);
            }
        }
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
