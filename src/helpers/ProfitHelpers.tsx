import { Ctx } from "boardgame.io";
import { BoardProps } from "boardgame.io/react";
import { isCardNotAction } from "../Card";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { IConfig } from "../typescript/action_interfaces";
import { CampCardTypes, CampDeckCardTypes, DeckCardTypes, PickedCardType, TavernCardTypes } from "../typescript/card_types";
import { CoinType } from "../typescript/coin_types";
import { ConfigNames, HeroNames, MoveNames, Phases, RusCardTypes, Stages } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { ICurrentMoveArgumentsStage, ICurrentMoveSuitCardIdArguments } from "../typescript/move_interfaces";
import { TotalRank } from "./ScoreHelpers";
import { DrawButton, DrawCard, DrawCoin } from "./UIElementHelpers";

// TODO Add functions docbloocks
export const AddCoinToPouchProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const moveMainArgs: ICurrentMoveArgumentsStage["numbers"] = [];
    for (let j = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
        if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === HeroNames.Uline
            && G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
            DrawCoin(data, boardCells, `coin`,
                G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j], j,
                G.publicPlayers[Number(ctx.currentPlayer)], `border-2`,
                null, MoveNames.AddCoinToPouchMove, j);
            moveMainArgs.push(j);
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.PickCards][Stages.AddCoinToPouch].numbers =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.AddCoinToPouch].numbers = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.EndTier][Stages.AddCoinToPouch].numbers =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.AddCoinToPouch].numbers = moveMainArgs;
};

export const DiscardCardFromBoardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const moveMainArgs: ICurrentMoveSuitCardIdArguments = {},
        config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config,
        pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (config !== undefined) {
        for (const suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                if (suit !== config.suit
                    && !(G.drawProfit === ConfigNames.DagdaAction && G.actionsNum === 1 && pickedCard !== null
                        && `suit` in pickedCard && suit === pickedCard.suit)) {
                    const last: number = G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length - 1;
                    if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last].type !== RusCardTypes.HERO) {
                        DrawCard(data, boardCells,
                            G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last], last,
                            G.publicPlayers[Number(ctx.currentPlayer)], suit,
                            MoveNames.DiscardCardMove, suit, last);
                        moveMainArgs[suit].push(last);
                    }
                }
            }
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.PickCards][Stages.DiscardBoardCard].suits =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.DiscardBoardCard].suits = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.EndTier][Stages.DiscardBoardCard].suits =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.DiscardBoardCard].suits = moveMainArgs;
};

export const DiscardAnyCardFromPlayerBoardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    // TODO Discard cards must be hidden from others users?
    const playerHeaders: JSX.Element[] = [],
        playerRows: JSX.Element[][] = [],
        moveMainArgs: ICurrentMoveSuitCardIdArguments = {};
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
                        moveMainArgs[suit].push(i);
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
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.PickCards][Stages.DiscardSuitCard].suits =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.DiscardSuitCard].suits = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.EndTier][Stages.DiscardSuitCard].suits =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.DiscardSuitCard].suits = moveMainArgs;
};

export const DiscardCardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>, boardCells: JSX.Element[])
    : void => {
    const moveMainArgs: ICurrentMoveArgumentsStage["numbers"] = [];
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
            moveMainArgs.push(j);
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.PickCards][Stages.DiscardCard].numbers =
        moveMainArgs;
};

// export const DiscardSuitCardFromPlayerBoardProfit = (G: MyGameState, ctx: Ctx,
//     data?: null | IBotMoveArgumentsTypes, boardCells: JSX.Element[]): void => {

// };

export const ExplorerDistinctionProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const moveMainArgs: ICurrentMoveArgumentsStage["numbers"] = [];
    for (let j = 0; j < 3; j++) {
        const card = G.decks[1][j];
        let suit: null | string = null;
        if (isCardNotAction(card)) {
            suit = card.suit;
        }
        DrawCard(data, boardCells, G.decks[1][j], j,
            G.publicPlayers[Number(ctx.currentPlayer)], suit,
            MoveNames.ClickCardToPickDistinctionMove, j);
        moveMainArgs.push(j);
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.PickDistinctionCard].numbers = moveMainArgs;
};

export const GetEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const moveMainArgs: ICurrentMoveArgumentsStage["numbers"] = [],
        mercenaries: CampDeckCardTypes[] =
            G.publicPlayers[Number(ctx.currentPlayer)].campCards
                .filter((card: CampDeckCardTypes): boolean => card.type === RusCardTypes.MERCENARY);
    for (let j = 0; j < mercenaries.length; j++) {
        DrawCard(data, boardCells, mercenaries[j], j,
            G.publicPlayers[Number(ctx.currentPlayer)], null,
            MoveNames.GetEnlistmentMercenariesMove, j);
        moveMainArgs.push(j);
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.Default3].numbers = moveMainArgs;
};

export const GetMjollnirProfitProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const moveMainArgs: ICurrentMoveArgumentsStage["strings"] = [];
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length) {
                // TODO Move logic to DrawCard?
                boardCells.push(
                    <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                        key={`${suit} suit to get Mjöllnir profit`}
                        onClick={() => data.moves.GetMjollnirProfitMove(suit)}>
                        <span style={Styles.Suits(suit)} className="bg-suit-icon">
                            <b className="whitespace-nowrap text-white">
                                {G.publicPlayers[Number(ctx.currentPlayer)].cards[suit]
                                    .reduce(TotalRank, 0) * 2}
                            </b>
                        </span>
                    </td>
                );
                moveMainArgs.push(suit);
            }
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.GetMjollnirProfit][Stages.Default1].strings =
        moveMainArgs;
};

export const PickCampCardHoldaProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const moveMainArgs: ICurrentMoveArgumentsStage["numbers"] = [];
    for (let j = 0; j < G.campNum; j++) {
        const card: CampCardTypes = G.camp[j];
        if (card !== null) {
            DrawCard(data, boardCells, card, j,
                G.publicPlayers[Number(ctx.currentPlayer)], null,
                MoveNames.ClickCampCardHoldaMove, j);
            moveMainArgs.push(j);
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.PickCards][Stages.PickCampCardHolda].numbers = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.PickCampCardHolda].numbers = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.EndTier][Stages.PickCampCardHolda].numbers =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.PickCampCardHolda].numbers = moveMainArgs;
};

export const PickDiscardCardProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const moveMainArgs: ICurrentMoveArgumentsStage["numbers"] = [];
    for (let j = 0; j < G.discardCardsDeck.length; j++) {
        const card: DeckCardTypes = G.discardCardsDeck[j];
        let suit: null | string = null;
        if (isCardNotAction(card)) {
            suit = card.suit;
        }
        DrawCard(data, boardCells, card, j,
            G.publicPlayers[Number(ctx.currentPlayer)], suit,
            MoveNames.PickDiscardCardMove, j);
        moveMainArgs.push(j);
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.PickCards][Stages.PickDiscardCard].numbers =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.PickDiscardCard].numbers = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.EndTier][Stages.PickDiscardCard].numbers =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.PickDiscardCard].numbers = moveMainArgs;
};

export const PlaceCardsProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const moveMainArgs: ICurrentMoveArgumentsStage["strings"] = [];
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
            if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
                if (config !== undefined) {
                    // TODO Move logic to DrawCard?
                    boardCells.push(
                        <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                            key={`Place ${config.drawName} on ${suitsConfig[suit].suitName}`}
                            onClick={() => data.moves.PlaceCardMove(suit)}>
                            <span style={Styles.Suits(suit)} className="bg-suit-icon">
                                <b>{G.publicPlayers[Number(ctx.currentPlayer)]
                                    .stack[0].variants?.[suit].points ?? ``}</b>
                            </span>
                        </td>
                    );
                    moveMainArgs.push(suit);
                }
            }
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.PickCards][Stages.PlaceCards].strings =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.PlaceCards].strings = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.EndTier][Stages.Default1].strings =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.EndTier][Stages.PlaceCards].strings =
        moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)].phases[Phases.GetDistinctions][Stages.PlaceCards].strings =
        moveMainArgs;
};

export const PlaceEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const moveMainArgs: ICurrentMoveArgumentsStage["strings"] = [];
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
                        moveMainArgs.push(suit);
                    }
                }
            }
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.Default4].strings = moveMainArgs;
};

export const StartEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (let j = 0; j < 2; j++) {
        if (j === 0) {
            // TODO Add Enums for ALL text here
            DrawButton(data, boardCells, `start Enlistment Mercenaries`, `Start`,
                G.publicPlayers[Number(ctx.currentPlayer)],
                MoveNames.StartEnlistmentMercenariesMove);
            G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[Phases.EnlistmentMercenaries][Stages.Default1].empty = null;
        } else if (G.publicPlayersOrder.length > 1) {
            DrawButton(data, boardCells, `pass Enlistment Mercenaries`, `Pass`,
                G.publicPlayers[Number(ctx.currentPlayer)],
                MoveNames.PassEnlistmentMercenariesMove);
            G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[Phases.EnlistmentMercenaries][Stages.Default1].empty = null;
        }
    }
};

export const UpgradeCoinProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const handCoins = data.G.publicPlayers[Number(data.ctx.currentPlayer)].handCoins
        .filter((coin: CoinType): boolean => coin !== null),
        moveMainArgs: ICurrentMoveArgumentsStage["coins"] = [];
    let handCoinIndex = -1;
    for (let j = 0; j < data.G.publicPlayers[Number(data.ctx.currentPlayer)].boardCoins.length; j++) {
        // TODO Check .? for all coins!!! and delete AS
        if (G.publicPlayers[Number(data.ctx.currentPlayer)].buffs.everyTurn === HeroNames.Uline
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
                moveMainArgs.push({
                    coinId: j,
                    type: `board`,
                    isInitial: handCoins[handCoinIndex]?.isInitial as boolean,
                });
            }
        } else if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]
            && !G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]?.isTriggerTrading) {
            DrawCoin(data, boardCells, `coin`,
                G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j], j,
                G.publicPlayers[Number(ctx.currentPlayer)], `border-2`, null,
                MoveNames.ClickCoinToUpgradeMove, j, `board`,
                G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]?.isInitial as boolean);
            moveMainArgs.push({
                coinId: j,
                type: `board`,
                isInitial: G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]?.isInitial as boolean,
            });
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.PickCards][Stages.UpgradeCoin].coins = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.UpgradeCoin].coins = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EndTier][Stages.UpgradeCoin].coins = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.UpgradeCoin].coins = moveMainArgs;
};

export const UpgradeCoinVidofnirVedrfolnirProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config,
        moveMainArgs: ICurrentMoveArgumentsStage["coins"] = [];
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
                    moveMainArgs.push({
                        coinId: j,
                        type: `board`,
                        isInitial: coin.isInitial,
                    });
                }
            }
        }
    }
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.PickCards][Stages.UpgradeVidofnirVedrfolnirCoin].coins = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EnlistmentMercenaries][Stages.UpgradeVidofnirVedrfolnirCoin].coins = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.EndTier][Stages.UpgradeVidofnirVedrfolnirCoin].coins = moveMainArgs;
    G.currentMoveArguments[Number(ctx.currentPlayer)]
        .phases[Phases.GetDistinctions][Stages.UpgradeVidofnirVedrfolnirCoin].coins = moveMainArgs;
};
