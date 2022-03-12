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
import { BuffNames, CoinTypes, ConfigNames, DrawNames, MoveNames, MoveValidatorNames, RusCardTypes } from "../typescript/enums";
import type { CampCardTypes, CampDeckCardTypes, CoinType, DeckCardTypes, DiscardCardTypes, IMoveArgumentsStage, IMoveCoinsArguments, IMoveSuitCardPlayerIdArguments, IMyGameState, IPublicPlayer, IStack, IVariant, MoveValidatorTypes, OptionalSuitPropertyTypes, PickedCardType, PlayerCardsType, SuitTypes, TavernCardTypes } from "../typescript/interfaces";
import { DrawButton, DrawCard, DrawCoin, DrawSuit } from "./ElementsUI";

export const AddCoinToPouchProfit = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]): void | IMoveArgumentsStage<number[]>[`args`] => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)],
        moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    for (let j = 0; j < player.handCoins.length; j++) {
        const handCoin: CoinType | undefined = player.handCoins[j];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока на столе отсутствует монета ${j}.`);
        }
        if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && IsCoin(handCoin)) {
            if (data !== undefined && boardCells !== undefined) {
                DrawCoin(data, boardCells, `coin`, handCoin, j, player,
                    `border-2`, null, MoveNames.AddCoinToPouchMove, j);
            } else if (validatorName === MoveValidatorNames.AddCoinToPouchMoveValidator) {
                moveMainArgs.push(j);
            } else {
                throw new Error(`Функция должна иметь один из ключевых параметров.`);
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};

export const DiscardCardFromBoardProfit = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]):
    void | IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`] => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)],
        moveMainArgs: IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`] = {};
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const stack: IStack | undefined = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
    }
    const configSuit: SuitTypes | undefined = stack.config?.suit,
        pickedCard: PickedCardType = player.pickedCard;
    if (configSuit === undefined) {
        throw new Error(`Отсутствует обязательный параметр 'stack[0].config.suit'.`);
    }
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            if (suit !== configSuit
                && !(G.drawProfit === ConfigNames.DagdaAction && player.actionsNum === 1 && pickedCard !== null
                    && `suit` in pickedCard && suit === pickedCard.suit)) {
                const last: number = player.cards[suit].length - 1;
                if (last !== -1) {
                    const card: PlayerCardsType | undefined = player.cards[suit][last];
                    if (card === undefined) {
                        throw new Error(`В массиве карт фракции ${suit} отсутствует последняя карта ${last}.`);
                    }
                    if (!IsHeroCard(card)) {
                        if (data !== undefined && boardCells !== undefined) {
                            DrawCard(data, boardCells, card, last, player, suit,
                                MoveNames.DiscardCardMove, suit, last);
                        } else if (validatorName === MoveValidatorNames.DiscardCardMoveValidator) {
                            moveMainArgs[suit] = [];
                            const moveMainArgsFoSuit: number[] | undefined = moveMainArgs[suit];
                            if (moveMainArgsFoSuit !== undefined) {
                                moveMainArgsFoSuit.push(last);
                            } else {
                                throw new Error(`Массив значений должен содержать фракцию ${suit}.`);
                            }
                        } else {
                            throw new Error(`Функция должна иметь один из ключевых параметров.`);
                        }
                    }
                }
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};

export const DiscardAnyCardFromPlayerBoardProfit = (G: IMyGameState, ctx: Ctx,
    validatorName: MoveValidatorTypes | null, data?: BoardProps<IMyGameState>,
    boardCells?: JSX.Element[]): void | IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`] => {
    // TODO Discard cards must be hidden from others users?
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)],
        moveMainArgs: IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`] = {};
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const playerHeaders: JSX.Element[] = [],
        playerRows: JSX.Element[] = [];
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            if (data !== undefined) {
                playerHeaders.push(
                    <th className={`${suitsConfig[suit].suitColor}`}
                        key={`${player.nickname} ${suitsConfig[suit].suitName}`}>
                        <span style={Styles.Suits(suit)} className="bg-suit-icon">

                        </span>
                    </th>
                );
            } else if (validatorName !== null) {
                moveMainArgs[suit] = [];
            }
        }
    }
    for (let i = 0; ; i++) {
        const playerCells: JSX.Element[] = [];
        let isDrawRow = false,
            isExit = true,
            id = 0;
        let j = 0;
        for (suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                id = i + j;
                const card: PlayerCardsType | undefined = player.cards[suit][i];
                if (card !== undefined) {
                    isExit = false;
                    if (!IsHeroCard(card)) {
                        isDrawRow = true;
                        if (data !== undefined && boardCells !== undefined) {
                            DrawCard(data, playerCells, card, id, player, suit,
                                MoveNames.DiscardCardFromPlayerBoardMove, suit, i);
                        } else if (validatorName === MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator) {
                            moveMainArgs[suit]?.push(i);
                        }
                    } else {
                        if (data !== undefined) {
                            playerCells.push(
                                <td key={`${player.nickname} empty card ${id}`}>

                                </td>
                            );
                        }
                    }
                } else {
                    if (data !== undefined) {
                        playerCells.push(
                            <td key={`${player.nickname} empty card ${id}`}>

                            </td>
                        );
                    }
                }
                j++;
            }
        }
        if (isDrawRow) {
            if (data !== undefined) {
                playerRows.push(
                    <tr key={`${player.nickname} board row ${i}`}>
                        {playerCells}
                    </tr>
                );
            }
        }
        if (isExit) {
            break;
        }
    }
    if (data !== undefined && boardCells !== undefined) {
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
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};

export const DiscardCardProfit = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]): void | IMoveArgumentsStage<number[]>[`args`] => {
    const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    for (let j = 0; j < G.drawSize; j++) {
        const currentTavern: TavernCardTypes[] | undefined = G.taverns[G.currentTavern];
        if (currentTavern === undefined) {
            throw new Error(`В массиве таверн отсутствует текущая таверна.`);
        }
        const card: TavernCardTypes | undefined = currentTavern[j];
        if (card === undefined) {
            throw new Error(`В массиве карт текущей таверны отсутствует карта ${j}.`);
        }
        if (card !== null) {
            let suit: SuitTypes | null = null;
            if (IsCardNotActionAndNotNull(card)) {
                suit = card.suit;
            }
            const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
            if (data !== undefined && boardCells !== undefined) {
                DrawCard(data, boardCells, card, j, player, suit,
                    MoveNames.DiscardCard2PlayersMove, j);
            } else if (validatorName === MoveValidatorNames.DiscardCard2PlayersMoveValidator) {
                moveMainArgs.push(j);
            } else {
                throw new Error(`Функция должна иметь один из ключевых параметров.`);
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};

export const DiscardSuitCardFromPlayerBoardProfit = (G: IMyGameState, ctx: Ctx,
    validatorName: MoveValidatorTypes | null, playerId: number | null, data?: BoardProps<IMyGameState>,
    boardCells?: JSX.Element[]): void | IMoveArgumentsStage<IMoveSuitCardPlayerIdArguments>[`args`] => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const playersHeaders: JSX.Element[] = [],
        playersRows: JSX.Element[] = [];
    const stack: IStack | undefined = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
    }
    const suit: SuitTypes | undefined = stack.config?.suit;
    if (suit === undefined) {
        throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config.suit'.`);
    }
    let moveMainArgs: IMoveArgumentsStage<Partial<IMoveSuitCardPlayerIdArguments>>[`args`] = {
        playerId: undefined,
        suit,
        cards: [],
    };
    if (validatorName !== null) {
        if (playerId === null) {
            throw new Error(`Отсутствует обязательный параметр 'playerId'.`);
        }
        moveMainArgs = {
            playerId,
            suit,
            cards: [],
        } as IMoveArgumentsStage<IMoveSuitCardPlayerIdArguments>[`args`];
    }
    for (let p = 0; p < G.publicPlayers.length; p++) {
        if (p !== Number(ctx.currentPlayer)) {
            const playerP1: IPublicPlayer | undefined = G.publicPlayers[p];
            if (playerP1 === undefined) {
                throw new Error(`В массиве игроков отсутствует игрок 1 ${p}.`);
            }
            if (data !== undefined) {
                playersHeaders.push(
                    <th className={`${suitsConfig[suit].suitColor} discard suit`}
                        key={`${playerP1.nickname} ${suitsConfig[suit].suitName}`}>
                        <span style={Styles.Suits(suit)} className="bg-suit-icon">
                            {p + 1}
                        </span>
                    </th>
                );
            }
        }
    }
    for (let i = 0; ; i++) {
        let isDrawRow = false,
            isExit = true;
        const playersCells: JSX.Element[] = [];
        for (let p = 0; p < G.publicPlayers.length; p++) {
            if (p !== Number(ctx.currentPlayer)) {
                const playerP2: IPublicPlayer | undefined = G.publicPlayers[p];
                if (playerP2 === undefined) {
                    throw new Error(`В массиве игроков отсутствует игрок 2 ${p}.`);
                }
                const card: PlayerCardsType | undefined = playerP2.cards[suit][i];
                if (card !== undefined) {
                    if (!IsHeroCard(card)) {
                        isExit = false;
                        isDrawRow = true;
                        if (data !== undefined) {
                            DrawCard(data, playersCells, card, i, playerP2, suit,
                                MoveNames.DiscardSuitCardFromPlayerBoardMove, suit, p, i);
                        } else if (p === playerId && validatorName ===
                            MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator) {
                            if (moveMainArgs.cards === undefined) {
                                throw new Error(`Отсутствует параметр 'cards'.`);
                            }
                            moveMainArgs.cards.push(i);
                        }
                    }
                } else {
                    if (data !== undefined) {
                        playersCells.push(
                            <td key={`${playerP2.nickname} discard suit cardboard row ${i}`}>

                            </td>
                        );
                    }
                }
            }
        }
        if (isDrawRow) {
            if (data !== undefined) {
                playersRows.push(
                    <tr key={`Discard suit cardboard row ${i}`}>
                        {playersCells}
                    </tr>
                );
            }
        }
        if (isExit) {
            break;
        }
    }
    if (data !== undefined && boardCells !== undefined) {
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
    } else if (validatorName !== null) {
        return moveMainArgs as IMoveArgumentsStage<IMoveSuitCardPlayerIdArguments>[`args`];
    } else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};

export const ExplorerDistinctionProfit = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]): void | IMoveArgumentsStage<number[]>[`args`] => {
    const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    for (let j = 0; j < 3; j++) {
        const deck1: DeckCardTypes[] | undefined = G.decks[1];
        if (deck1 === undefined) {
            throw new Error(`В массиве дек карт отсутствует дека 1 эпохи.`);
        }
        const card: DeckCardTypes | undefined = deck1[j];
        if (card === undefined) {
            throw new Error(`В массиве карт 2 эпохи отсутствует карта ${j}.`);
        }
        let suit: null | SuitTypes = null;
        if (IsCardNotActionAndNotNull(card)) {
            suit = card.suit;
        }
        const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        if (data !== undefined && boardCells !== undefined) {
            DrawCard(data, boardCells, card, j, player, suit,
                MoveNames.ClickCardToPickDistinctionMove, j);
        } else if (validatorName === MoveValidatorNames.ClickCardToPickDistinctionMoveValidator) {
            moveMainArgs.push(j);
        } else {
            throw new Error(`Функция должна иметь один из ключевых параметров.`);
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};

export const GetEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]): void | IMoveArgumentsStage<number[]>[`args`] => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)],
        moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const mercenaries: CampDeckCardTypes[] =
        player.campCards.filter((card: CampDeckCardTypes): boolean => IsMercenaryCampCard(card));
    for (let j = 0; j < mercenaries.length; j++) {
        const card: CampDeckCardTypes | undefined = mercenaries[j];
        if (card === undefined) {
            throw new Error(`В массиве карт кэмпа игрока отсутствует карта наёмника ${j}.`);
        }
        if (data !== undefined && boardCells !== undefined) {
            DrawCard(data, boardCells, card, j, player, null,
                MoveNames.GetEnlistmentMercenariesMove, j);
        } else if (validatorName === MoveValidatorNames.GetEnlistmentMercenariesMoveValidator) {
            moveMainArgs.push(j);
        } else {
            throw new Error(`Функция должна иметь один из ключевых параметров.`);
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};

export const GetMjollnirProfitProfit = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]): void | IMoveArgumentsStage<SuitTypes[]>[`args`] => {
    const moveMainArgs: IMoveArgumentsStage<SuitTypes[]>[`args`] = [];
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
            if (player.cards[suit].length) {
                const stack: IStack | undefined = player.stack[0];
                if (stack === undefined) {
                    throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
                }
                const drawName: string | undefined = stack.config?.drawName;
                if (drawName === undefined) {
                    throw new Error(`Отсутствует обязательный параметр 'config.drawName'.`);
                }
                if (data !== undefined && boardCells !== undefined) {
                    const value: number | string =
                        player.cards[suit].reduce(TotalRank, 0) * 2;
                    DrawSuit(data, boardCells, suit, drawName, value, player,
                        MoveNames.GetMjollnirProfitMove);
                } else if (validatorName === MoveValidatorNames.GetMjollnirProfitMoveValidator) {
                    moveMainArgs.push(suit);
                } else {
                    throw new Error(`Функция должна иметь один из ключевых параметров.`);
                }
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};

export const PickCampCardHoldaProfit = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]): void | IMoveArgumentsStage<number[]>[`args`] => {
    const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    for (let j = 0; j < G.campNum; j++) {
        const card: CampCardTypes | undefined = G.camp[j];
        if (card === undefined) {
            throw new Error(`В массиве карт кэмпа отсутствует карта ${j}.`);
        }
        if (card !== null) {
            const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
            if (data !== undefined && boardCells !== undefined) {
                DrawCard(data, boardCells, card, j, player, null,
                    MoveNames.ClickCampCardHoldaMove, j);
            } else if (validatorName === MoveValidatorNames.ClickCampCardHoldaMoveValidator) {
                moveMainArgs.push(j);
            } else {
                throw new Error(`Функция должна иметь один из ключевых параметров.`);
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};

export const PickDiscardCardProfit = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]): void | IMoveArgumentsStage<number[]>[`args`] => {
    const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    for (let j = 0; j < G.discardCardsDeck.length; j++) {
        const card: DiscardCardTypes | undefined = G.discardCardsDeck[j];
        if (card === undefined) {
            throw new Error(`В массиве карт сброса отсутствует карта ${j}.`);
        }
        let suit: null | SuitTypes = null;
        if (!IsActionCard(card)) {
            suit = card.suit;
        }
        const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        if (data !== undefined && boardCells !== undefined) {
            DrawCard(data, boardCells, card, j, player, suit,
                MoveNames.PickDiscardCardMove, j);
        } else if (validatorName === MoveValidatorNames.PickDiscardCardMoveValidator) {
            moveMainArgs.push(j);
        } else {
            throw new Error(`Функция должна иметь один из ключевых параметров.`);
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};

export const PlaceCardsProfit = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]): void | IMoveArgumentsStage<SuitTypes[]>[`args`] => {
    const moveMainArgs: IMoveArgumentsStage<SuitTypes[]>[`args`] = [];
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
            const pickedCard: PickedCardType = player.pickedCard;
            if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                const stack: IStack | undefined = player.stack[0];
                if (stack === undefined) {
                    throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
                }
                const drawName: string | undefined = stack.config?.drawName;
                if (drawName === undefined) {
                    throw new Error(`Отсутствует обязательный параметр 'config.drawName'.`);
                }
                let moveName: MoveNames | null;
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
                if (data !== undefined && boardCells !== undefined) {
                    const value: number | string = stack.variants?.[suit].points ?? ``;
                    DrawSuit(data, boardCells, suit, drawName, value, player, moveName);
                } else if (validatorName === MoveValidatorNames.PlaceThrudHeroMoveValidator
                    || validatorName === MoveValidatorNames.PlaceOlwinCardMoveValidator
                    || validatorName === MoveValidatorNames.PlaceYludHeroMoveValidator) {
                    moveMainArgs.push(suit);
                } else {
                    throw new Error(`Функция должна иметь один из ключевых параметров.`);
                }
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};

export const PlaceEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]): void | IMoveArgumentsStage<SuitTypes[]>[`args`] => {
    const moveMainArgs: IMoveArgumentsStage<SuitTypes[]>[`args`] = [];
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
            const card: PickedCardType = player.pickedCard;
            if (card === null || !IsMercenaryCampCard(card)) {
                throw new Error(`Выбранная карта должна быть с типом '${RusCardTypes.MERCENARY}'.`);
            }
            const stack: IStack | undefined = player.stack[0];
            if (stack === undefined) {
                throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
            }
            const drawName: string | undefined = stack.config?.drawName;
            if (drawName === undefined) {
                throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config.drawName'.`);
            }
            const cardVariants: IVariant | undefined = card.variants[suit];
            if (cardVariants === undefined) {
                throw new Error(`У выбранной карты отсутствует обязательный параметр 'variants[suit]'.`);
            }
            if (suit === cardVariants.suit) {
                if (data !== undefined && boardCells !== undefined) {
                    const value: number | string = cardVariants.points ?? ``;
                    DrawSuit(data, boardCells, suit, drawName, value, player,
                        MoveNames.PlaceEnlistmentMercenariesMove);
                } else if (validatorName ===
                    MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator) {
                    moveMainArgs.push(suit);
                } else {
                    throw new Error(`Функция должна иметь один из ключевых параметров.`);
                }
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};

export const StartEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (let j = 0; j < 2; j++) {
        const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
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

export const UpgradeCoinProfit = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]):
    void | IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)],
        moveMainArgs: IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] =
            [] as IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const handCoins: CoinType[] = player.handCoins.filter((coin: CoinType): boolean => IsCoin(coin));
    let handCoinIndex = -1;
    for (let j = 0; j < player.boardCoins.length; j++) {
        const boardCoin: CoinType | undefined = player.boardCoins[j];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока на столе отсутствует монета ${j}.`);
        }
        if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && boardCoin === null) {
            handCoinIndex++;
            const handCoinNotNull: CoinType | undefined = handCoins[handCoinIndex];
            if (handCoinNotNull === undefined) {
                throw new Error(`В массиве монет игрока в руке 1 отсутствует монета ${handCoinIndex}.`);
            }
            const handCoinId: number = player.handCoins.findIndex((coin: CoinType): boolean =>
                IsCoin(handCoinNotNull) && coin?.value === handCoinNotNull.value
                && coin.isInitial === handCoinNotNull.isInitial);
            if (handCoinId === -1) {
                throw new Error(`В массиве монет игрока в руке отсутствует нужная монета.`);
            }
            const handCoin: CoinType | undefined = player.handCoins[handCoinId];
            if (handCoin === undefined) {
                throw new Error(`В массиве монет игрока в руке 2 отсутствует монета ${handCoinId}.`);
            }
            if (IsCoin(handCoin) && !handCoin.isTriggerTrading) {
                if (data !== undefined && boardCells !== undefined) {
                    DrawCoin(data, boardCells, `coin`, handCoin, j, player,
                        `border-2`, null, MoveNames.ClickCoinToUpgradeMove,
                        j, CoinTypes.Hand, handCoin.isInitial);
                } else if (validatorName === MoveValidatorNames.ClickCoinToUpgradeMoveValidator) {
                    moveMainArgs.push({
                        coinId: j,
                        type: CoinTypes.Hand,
                        isInitial: handCoin.isInitial,
                    });
                } else {
                    throw new Error(`Функция должна иметь один из ключевых параметров.`);
                }
            }
        } else if (IsCoin(boardCoin) && !boardCoin.isTriggerTrading) {
            if (data !== undefined && boardCells !== undefined) {
                DrawCoin(data, boardCells, `coin`, boardCoin, j, player,
                    `border-2`, null, MoveNames.ClickCoinToUpgradeMove,
                    j, CoinTypes.Board, boardCoin.isInitial);
            } else if (validatorName === MoveValidatorNames.ClickCoinToUpgradeMoveValidator) {
                moveMainArgs.push({
                    coinId: j,
                    type: CoinTypes.Board,
                    isInitial: boardCoin.isInitial,
                });
            } else {
                throw new Error(`Функция должна иметь один из ключевых параметров.`);
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};

export const UpgradeCoinVidofnirVedrfolnirProfit = (G: IMyGameState, ctx: Ctx,
    validatorName: MoveValidatorTypes | null, data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]):
    void | IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)],
        moveMainArgs: IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] = [];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    for (let j: number = G.tavernsNum; j < player.boardCoins.length; j++) {
        const boardCoin: CoinType | undefined = player.boardCoins[j];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока на столе отсутствует монета ${j}.`);
        }
        if (IsCoin(boardCoin)) {
            if (!boardCoin.isTriggerTrading && player.stack[0]?.config?.coinId !== j) {
                if (data !== undefined && boardCells !== undefined) {
                    DrawCoin(data, boardCells, `coin`, boardCoin, j, player,
                        `border-2`, null,
                        MoveNames.UpgradeCoinVidofnirVedrfolnirMove, j, CoinTypes.Board,
                        boardCoin.isInitial);
                } else if (validatorName === MoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator) {
                    moveMainArgs.push({
                        coinId: j,
                        type: CoinTypes.Board,
                        isInitial: boardCoin.isInitial,
                    });
                } else {
                    throw new Error(`Функция должна иметь один из ключевых параметров.`);
                }
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
