import type { Ctx } from "boardgame.io";
import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { IsMercenaryCampCard } from "../Camp";
import { IsCoin } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
import { IsHeroCard } from "../Hero";
import { CurrentScoring } from "../Score";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { tavernsConfig } from "../Tavern";
import { BuffNames, CardNames, CoinTypes, HeroNames, MoveNames, MoveValidatorNames, Phases, RusCardTypes, Stages, SuitNames } from "../typescript/enums";
import type { CampDeckCardTypes, CoinType, IHeroCard, IMoveArgumentsStage, IMoveCardIdPlayerIdArguments, IMoveCoinsArguments, IMoveFunctionTypes, IMyGameState, IPlayer, IPublicPlayer, IStack, ITavernInConfig, IVariant, OptionalSuitPropertyTypes, PickedCardType, PlayerCardsType, PublicPlayerCoinTypes, SuitTypes } from "../typescript/interfaces";
import { DrawCard, DrawCoin, DrawSuit } from "./ElementsUI";

// TODO Move strings coins names to enum!
/**
 * <h3>Отрисовка планшета всех карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param data Глобальные параметры.
 * @returns Игровые поля для планшета всех карт игрока.
 * @constructor
 */
export const DrawPlayersBoards = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorNames | null,
    playerId: number | null, data?: BoardProps<IMyGameState>): JSX.Element[]
    | (IMoveArgumentsStage<number[]>[`args`] | IMoveArgumentsStage<SuitTypes[]>[`args`]
        | IMoveArgumentsStage<IMoveCardIdPlayerIdArguments>[`args`]
        | IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`]) => {
    const playersBoards: JSX.Element[] = [];
    let moveMainArgs: IMoveArgumentsStage<number[]>[`args`] | IMoveArgumentsStage<SuitTypes[]>[`args`]
        | IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`]
        | IMoveArgumentsStage<IMoveCardIdPlayerIdArguments>[`args`] | undefined;
    if (validatorName !== null) {
        switch (validatorName) {
            case MoveValidatorNames.PlaceThrudHeroMoveValidator:
            case MoveValidatorNames.PlaceYludHeroMoveValidator:
            case MoveValidatorNames.PlaceOlwinCardMoveValidator:
            case MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator:
            case MoveValidatorNames.GetEnlistmentMercenariesMoveValidator:
            case MoveValidatorNames.GetMjollnirProfitMoveValidator:
                moveMainArgs = [];
                break;
            case MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator:
            case MoveValidatorNames.DiscardCardMoveValidator:
                moveMainArgs = {};
                break;
            case MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator:
                if (playerId === null) {
                    throw new Error(`Отсутствует обязательный параметр '${playerId}'.`);
                }
                moveMainArgs = {
                    playerId,
                    cards: [],
                };
                break;
            default:
                throw new Error(`Не существует валидатора '${validatorName}'.`);
        }
    }
    for (let p = 0; p < ctx.numPlayers; p++) {
        const playerRows: JSX.Element[] = [],
            playerHeaders: JSX.Element[] = [],
            playerHeadersCount: JSX.Element[] = [],
            player: IPublicPlayer | undefined = G.publicPlayers[p],
            stage: string | undefined = ctx.activePlayers?.[p];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок с id '${p}'.`);
        }
        const pickedCard: PickedCardType = player.pickedCard;
        let suitTop: SuitTypes;
        for (suitTop in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suitTop)) {
                if (p === Number(ctx.currentPlayer)
                    && validatorName === MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator) {
                    if (player.cards[suitTop].length) {
                        if (moveMainArgs === undefined || typeof moveMainArgs !== `object`
                            || Array.isArray(moveMainArgs) || `cards` in moveMainArgs) {
                            throw new Error(`Аргумент валидатора '${validatorName}' должен быть объектом с полем '${suitTop}'.`);
                        }
                        moveMainArgs[suitTop] = [];
                    }
                }
                if (p === Number(ctx.currentPlayer) && ctx.phase === Phases.GetMjollnirProfit) {
                    if (data !== undefined) {
                        const suitArg: SuitTypes = suitTop;
                        DrawSuit(data, playerHeaders, suitArg, player, MoveNames.GetMjollnirProfitMove);
                    } else if (validatorName === MoveValidatorNames.GetMjollnirProfitMoveValidator) {
                        if (!Array.isArray(moveMainArgs)) {
                            throw new Error(`Аргумент валидатора '${validatorName}' должен быть массивом`);
                        }
                        (moveMainArgs as IMoveArgumentsStage<SuitTypes[]>[`args`]).push(suitTop);
                    }
                } else {
                    if (data !== undefined) {
                        DrawSuit(data, playerHeaders, suitTop, player, null);
                    }
                }
                if (data !== undefined) {
                    playerHeadersCount.push(
                        <th className={`${suitsConfig[suitTop].suitColor} text-white`}
                            key={`${player.nickname} ${suitsConfig[suitTop].suitName} count`}>
                            <b>{player.cards[suitTop].reduce(TotalRank, 0)}</b>
                        </th>
                    );
                }
            }
        }
        if (data !== undefined) {
            for (let s = 0; s < 1 + Number(G.expansions.thingvellir.active); s++) {
                if (s === 0) {
                    playerHeaders.push(
                        <th className="bg-gray-600" key={`${player.nickname} hero icon`}>
                            <span style={Styles.HeroBack()} className="bg-hero-icon"></span>
                        </th>
                    );
                    playerHeadersCount.push(
                        <th className="bg-gray-600 text-white"
                            key={`${player.nickname} hero count`}>
                            <b>{player.heroes.length}</b>
                        </th>
                    );
                } else {
                    playerHeaders.push(
                        <th className="bg-yellow-200" key={`${player.nickname} camp icon`}>
                            <span style={Styles.Camp()} className="bg-camp-icon"></span>
                        </th>
                    );
                    playerHeadersCount.push(
                        <th className="bg-yellow-200 text-white"
                            key={`${player.nickname} camp counts`}>
                            <b>{player.campCards.length}</b>
                        </th>
                    );
                }
            }
        }
        for (let i = 0; ; i++) {
            const playerCells: JSX.Element[] = [];
            let isDrawRow = false,
                id = 0,
                j = 0,
                suit: SuitTypes;
            for (suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    id = i + j;
                    const card: PlayerCardsType | undefined = player.cards[suit][i],
                        last: number = player.cards[suit].length - 1;
                    if (card !== undefined) {
                        isDrawRow = true;
                        if (p !== Number(ctx.currentPlayer) && stage === Stages.DiscardSuitCard
                            && suit === SuitNames.WARRIOR && !IsHeroCard(card)) {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, card, id, player, suit,
                                    MoveNames.DiscardSuitCardFromPlayerBoardMove, i);
                            } else if (validatorName === MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator
                                && p === playerId) {
                                if (moveMainArgs === undefined || !(`cards` in moveMainArgs)) {
                                    throw new Error(`Аргумент валидатора '${validatorName}' должен быть объектом с полем 'cards'.`);
                                }
                                moveMainArgs.cards.push(i);
                            }
                        } else if (p === Number(ctx.currentPlayer) && last === i
                            && stage === Stages.DiscardBoardCard && !IsHeroCard(card)) {
                            const stack: IStack | undefined = player.stack[0];
                            if (stack === undefined) {
                                throw new Error(`В массиве стека действий игрока отсутствует '0' действие.`);
                            }
                            const configSuit: SuitTypes | null | undefined = stack.config?.suit,
                                pickedCard: PickedCardType = player.pickedCard;
                            if (suit !== configSuit
                                && !(configSuit === SuitNames.HUNTER && player.actionsNum === 1
                                    && pickedCard !== null && `suit` in pickedCard && suit === pickedCard.suit)) {
                                if (data !== undefined) {
                                    const suitArg: SuitTypes = suit;
                                    DrawCard(data, playerCells, card, id, player, suit,
                                        MoveNames.DiscardCardMove, suitArg, last);
                                } else if (validatorName === MoveValidatorNames.DiscardCardMoveValidator) {
                                    if (moveMainArgs === undefined || typeof moveMainArgs !== `object`
                                        || Array.isArray(moveMainArgs) || `cards` in moveMainArgs) {
                                        throw new Error(`Аргумент валидатора '${validatorName}' должен быть объектом с полем '${suit}'.`);
                                    }
                                    moveMainArgs[suit] = [];
                                    const moveMainArgsFoSuit: number[] | undefined = moveMainArgs[suit];
                                    if (moveMainArgsFoSuit === undefined) {
                                        throw new Error(`Массив значений должен содержать фракцию '${suit}'.`);
                                    }
                                    moveMainArgsFoSuit.push(last);
                                }
                            }
                        } else if (p === Number(ctx.currentPlayer)
                            && ctx.phase === Phases.BrisingamensEndGame && !IsHeroCard(card)) {
                            if (data !== undefined) {
                                const suitArg: SuitTypes = suit;
                                DrawCard(data, playerCells, card, id, player, suit,
                                    MoveNames.DiscardCardFromPlayerBoardMove, suitArg, i);
                            } else if (validatorName === MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator) {
                                if (moveMainArgs === undefined || typeof moveMainArgs !== `object`
                                    || Array.isArray(moveMainArgs) || `cards` in moveMainArgs) {
                                    throw new Error(`Аргумент валидатора '${validatorName}' должен быть объектом с полем '${suit}'.`);
                                }
                                const moveMainArgsFoSuit: number[] | undefined = moveMainArgs[suit];
                                if (moveMainArgsFoSuit === undefined) {
                                    throw new Error(`Массив значений должен содержать фракцию '${suit}'.`);
                                }
                                moveMainArgsFoSuit.push(i);
                            }
                        } else {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, card, id, player, suit);
                            }
                        }
                    } else if (p === Number(ctx.currentPlayer) && (last + 1) === i && pickedCard !== null
                        && (((ctx.phase === Phases.EndTier || ctx.phase === Phases.EnlistmentMercenaries)
                            && ctx.activePlayers === null) || stage === Stages.PlaceThrudHero
                            || stage === Stages.PlaceOlwinCards)) {
                        let cardVariants: IVariant | undefined = undefined;
                        if (ctx.phase === Phases.EnlistmentMercenaries && ctx.activePlayers === null) {
                            if (!IsMercenaryCampCard(pickedCard)) {
                                throw new Error(`Выбранная карта должна быть с типом '${RusCardTypes.MERCENARY}'.`);
                            }
                            cardVariants = pickedCard.variants[suit];
                            if (cardVariants !== undefined && cardVariants.suit !== suit) {
                                throw new Error(`У выбранной карты отсутствует обязательный параметр 'variants[suit]'.`);
                            }
                        } else {
                            if (!("suit" in pickedCard)) {
                                throw new Error(`У выбранной карты отсутствует обязательный параметр 'suit'.`);
                            }
                        }
                        if (data !== undefined) {
                            // TODO Draw heroes with more then one ranks no after the last card but when last rank of this hero card placed!?
                            let action: IMoveFunctionTypes;
                            if ((!IsMercenaryCampCard(pickedCard) && suit !== pickedCard.suit)
                                || (IsMercenaryCampCard(pickedCard) && cardVariants !== undefined
                                    && suit === cardVariants.suit)) {
                                switch (pickedCard.name) {
                                    case HeroNames.Thrud:
                                        action = data.moves.PlaceThrudHeroMove!;
                                        break;
                                    case HeroNames.Ylud:
                                        action = data.moves.PlaceYludHeroMove!;
                                        break;
                                    case CardNames.OlwinsDouble:
                                        action = data.moves.PlaceOlwinCardMove!;
                                        break;
                                    default:
                                        if (ctx.phase === Phases.EnlistmentMercenaries && ctx.activePlayers === null) {
                                            action = data.moves.PlaceEnlistmentMercenariesMove!;
                                            break;
                                        } else {
                                            throw new Error(`Нет такого мува.`);
                                        }
                                }
                                isDrawRow = true;
                                const suitArg: SuitTypes = suit;
                                playerCells.push(
                                    <td onClick={() => action?.(suitArg)} className="cursor-pointer"
                                        key={`${player.nickname} place card ${pickedCard.name} to ${suit}`}></td>
                                );
                            } else {
                                playerCells.push(
                                    <td key={`${player.nickname} empty card ${id}`}></td>
                                );
                            }
                        } else if (validatorName === MoveValidatorNames.PlaceThrudHeroMoveValidator
                            || validatorName === MoveValidatorNames.PlaceYludHeroMoveValidator
                            || validatorName === MoveValidatorNames.PlaceOlwinCardMoveValidator
                            || (validatorName === MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator
                                && cardVariants !== undefined && suit === cardVariants.suit)) {
                            (moveMainArgs as IMoveArgumentsStage<SuitTypes[]>[`args`]).push(suit);
                        }
                    } else {
                        if (data !== undefined) {
                            playerCells.push(
                                <td key={`${player.nickname} empty card ${id}`}></td>
                            );
                        }
                    }
                    j++;
                }
            }
            for (let k = 0; k < 1 + Number(G.expansions.thingvellir?.active); k++) {
                id += k + 1;
                if (k === 0) {
                    const playerCards: PlayerCardsType[] = Object.values(player.cards).flat(),
                        hero: IHeroCard | undefined = player.heroes[i];
                    // TODO Draw heroes from the beginning if player has suit heroes (or draw them with opacity)
                    if (hero !== undefined && !hero.suit && !((hero.name === HeroNames.Ylud
                        && playerCards.findIndex((card: PlayerCardsType): boolean =>
                            card.name === HeroNames.Ylud) !== -1) || (hero.name === HeroNames.Thrud
                                && playerCards.findIndex((card: PlayerCardsType): boolean =>
                                    card.name === HeroNames.Thrud) !== -1))) {
                        isDrawRow = true;
                        if (data !== undefined) {
                            DrawCard(data, playerCells, hero, id, player, null);
                        }
                    } else {
                        if (data !== undefined) {
                            playerCells.push(
                                <td key={`${player.nickname} hero ${i}`}></td>
                            );
                        }
                    }
                } else {
                    const campCard: CampDeckCardTypes | undefined = player.campCards[i];
                    if (campCard !== undefined) {
                        isDrawRow = true;
                        if (IsMercenaryCampCard(campCard) && ctx.phase === Phases.EnlistmentMercenaries
                            && ctx.activePlayers === null && Number(ctx.currentPlayer) === p
                            && pickedCard === null) {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, campCard, id, player, null,
                                    MoveNames.GetEnlistmentMercenariesMove, i);
                            } else if (validatorName === MoveValidatorNames.GetEnlistmentMercenariesMoveValidator) {
                                if (!Array.isArray(moveMainArgs)) {
                                    throw new Error(`Аргумент валидатора '${validatorName}' должен быть массивом.`);
                                }
                                (moveMainArgs as IMoveArgumentsStage<number[]>[`args`]).push(i);
                            }
                        } else {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, campCard, id, player, null);
                            }
                        }
                    } else {
                        if (data !== undefined) {
                            playerCells.push(
                                <td key={`${player.nickname} camp card ${i}`}></td>
                            );
                        }
                    }
                }
            }
            if (isDrawRow) {
                if (data !== undefined) {
                    playerRows.push(
                        <tr key={`${player.nickname} board row ${i}`}>{playerCells}</tr>
                    );
                }
            } else {
                break;
            }
        }
        if (data !== undefined) {
            playersBoards.push(
                <table className="mx-auto" key={`${player.nickname} board`}>
                    <caption>Player {p + 1} ({player.nickname}) cards, {G.winner.length ? `Final: ${G.totalScore[p]}` : CurrentScoring(player)} points
                    </caption>
                    <thead>
                        <tr>{playerHeaders}</tr>
                        <tr>{playerHeadersCount}</tr>
                    </thead>
                    <tbody>{playerRows}</tbody>
                </table>
            );
        }
    }
    if (data !== undefined) {
        return playersBoards;
    } else if (validatorName !== null && moveMainArgs !== undefined) {
        return moveMainArgs;
    } else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};

/**
 * <h3>Отрисовка планшета монет, выложенных игроком на стол.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Игровые поля для пользовательских монет на столе | данные для списка доступных аргументов мува.
 * @constructor
 */
export const DrawPlayersBoardsCoins = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorNames | null,
    data?: BoardProps<IMyGameState>): JSX.Element[]
    | (IMoveArgumentsStage<number[]>[`args`] | IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]) => {
    const multiplayer: boolean = IsMultiplayer(G),
        playersBoardsCoins: JSX.Element[] = [],
        moveMainArgs: IMoveArgumentsStage<number[]>[`args`] | IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] = [];
    let moveName: MoveNames | undefined;
    for (let p = 0; p < ctx.numPlayers; p++) {
        const stage: string | undefined = ctx.activePlayers?.[p];
        switch (ctx.phase) {
            case Phases.PlaceCoins:
                moveName = MoveNames.ClickBoardCoinMove;
                break;
            default:
                if (stage === Stages.UpgradeCoin) {
                    moveName = MoveNames.ClickCoinToUpgradeMove;
                } else if (stage === Stages.PickConcreteCoinToUpgrade) {
                    moveName = MoveNames.ClickConcreteCoinToUpgradeMove;
                } else if (stage === Stages.UpgradeVidofnirVedrfolnirCoin) {
                    moveName = MoveNames.UpgradeCoinVidofnirVedrfolnirMove;
                } else {
                    moveName = undefined;
                }
                break;
        }
        const player: IPublicPlayer | undefined = G.publicPlayers[p],
            privatePlayer: IPlayer | undefined = G.players[p];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок с id '${p}'.`);
        }
        const playerRows: JSX.Element[] = [],
            playerHeaders: JSX.Element[] = [],
            playerFooters: JSX.Element[] = [];
        for (let i = 0; i < 2; i++) {
            const playerCells: JSX.Element[] = [];
            for (let j = 0; j < G.tavernsNum; j++) {
                if (data !== undefined) {
                    if (i === 0) {
                        const currentTavernConfig: ITavernInConfig | undefined = tavernsConfig[j];
                        if (currentTavernConfig === undefined) {
                            throw new Error(`Отсутствует конфиг таверны с id '${j}'.`);
                        }
                        playerHeaders.push(
                            <th key={`Tavern ${currentTavernConfig.name}`}>
                                <span style={Styles.Taverns(j)} className="bg-tavern-icon"></span>
                            </th>
                        );
                    } else {
                        if (j === G.tavernsNum - 1) {
                            playerFooters.push(
                                <th key={`${player.nickname} priority icon`}>
                                    <span style={Styles.Priority()} className="bg-priority-icon"></span>
                                </th>
                            );
                            playerCells.push(
                                <td key={`${player.nickname} priority gem`}
                                    className="bg-gray-300">
                                    <span style={Styles.Priorities(player.priority.value)}
                                        className="bg-priority"></span>
                                </td>
                            );
                        } else {
                            if (data !== undefined) {
                                playerFooters.push(
                                    <th key={`${player.nickname} exchange icon ${j}`}>
                                        <span style={Styles.Exchange()} className="bg-small-market-coin"></span>
                                    </th>
                                );
                            }
                        }
                    }
                }
                if (i === 0 || (i === 1 && j !== G.tavernsNum - 1)) {
                    const id: number = j + G.tavernsNum * i,
                        publicBoardCoin: PublicPlayerCoinTypes | undefined = player.boardCoins[id],
                        privateBoardCoin: PublicPlayerCoinTypes | undefined = privatePlayer?.boardCoins[id];
                    if (publicBoardCoin === undefined) {
                        throw new Error(`В массиве монет игрока на столе отсутствует монета с id '${id}'.`);
                    }
                    if (publicBoardCoin !== null) {
                        if (ctx.phase === Phases.PlaceCoins && Number(ctx.currentPlayer) === p
                            && ((multiplayer && privateBoardCoin !== undefined)
                                || (!multiplayer && publicBoardCoin !== undefined))) {
                            if (data !== undefined) {
                                if (multiplayer && privateBoardCoin === undefined) {
                                    throw new Error(`Монета с id '${id}' на столе текущего приватного игрока не может отсутствовать.`);
                                }
                                // TODO Add errors!
                                if (!multiplayer && !IsCoin(publicBoardCoin)
                                    || (multiplayer && privateBoardCoin !== undefined
                                        && !IsCoin(privateBoardCoin))) {
                                    throw new Error(`Монета с id '${id}' на столе текущего игрока не может быть закрытой для него.`);
                                }
                                DrawCoin(data, playerCells, `coin`, privateBoardCoin ?? publicBoardCoin,
                                    id, player, null, null, moveName, id);
                            } else if (validatorName === MoveValidatorNames.ClickBoardCoinMoveValidator) {
                                (moveMainArgs as IMoveArgumentsStage<number[]>[`args`]).push(id);
                            }
                        } else if (Number(ctx.currentPlayer) === p && IsCoin(publicBoardCoin)
                            && !publicBoardCoin.isTriggerTrading && ((stage === Stages.UpgradeCoin)
                                || (stage === Stages.PickConcreteCoinToUpgrade
                                    && player.stack[0]?.config?.coinValue === publicBoardCoin.value)
                                || (stage === Stages.UpgradeVidofnirVedrfolnirCoin
                                    && player.stack[0]?.config?.coinId !== id && id >= G.tavernsNum))) {
                            if (data !== undefined) {
                                if (!publicBoardCoin.isOpened) {
                                    throw new Error(`В массиве монет игрока на столе не может быть закрыта ранее открытая монета с id '${id}'.`);
                                }
                                DrawCoin(data, playerCells, `coin`, publicBoardCoin, id, player,
                                    `border-2`, null, moveName, id,
                                    CoinTypes.Board);
                            } else if (validatorName === MoveValidatorNames.ClickCoinToUpgradeMoveValidator
                                || validatorName === MoveValidatorNames.PickConcreteCoinToUpgradeMoveValidator
                                || validatorName === MoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator) {
                                (moveMainArgs as IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]).push({
                                    coinId: id,
                                    type: CoinTypes.Board,
                                });
                            }
                        } else {
                            if (G.winner.length) {
                                if (data !== undefined) {
                                    if (!IsCoin(publicBoardCoin)) {
                                        throw new Error(`Монета с id '${id}' на столе текущего игрока не может быть закрытой для него.`);
                                    }
                                    if (!publicBoardCoin.isOpened) {
                                        throw new Error(`В массиве монет игрока на столе не может быть закрыта для других игроков ранее открытая монета с id '${id}'.`);
                                    }
                                    DrawCoin(data, playerCells, `coin`, publicBoardCoin, id, player);
                                }
                            } else {
                                if (multiplayer && privateBoardCoin !== undefined) {
                                    if (IsCoin(publicBoardCoin)) {
                                        if (!publicBoardCoin.isOpened) {
                                            throw new Error(`В массиве монет игрока на столе не может быть закрыта для других игроков ранее открытая монета с id '${id}'.`);
                                        }
                                        if (data !== undefined) {
                                            if (ctx.phase !== Phases.PlaceCoins && i === 0 && G.currentTavern < j) {
                                                DrawCoin(data, playerCells, `coin`, publicBoardCoin, id,
                                                    player);
                                            } else {
                                                DrawCoin(data, playerCells, `hidden-coin`,
                                                    publicBoardCoin, id, player, `bg-small-coin`);
                                            }
                                        }
                                    } else {
                                        if (Number(ctx.currentPlayer) === p && IsCoin(privateBoardCoin)
                                            && !privateBoardCoin.isTriggerTrading
                                            && ((stage === Stages.UpgradeCoin)
                                                || (stage === Stages.PickConcreteCoinToUpgrade
                                                    && player.stack[0]?.config?.coinValue ===
                                                    privateBoardCoin.value))) {
                                            if (data !== undefined) {
                                                DrawCoin(data, playerCells, `hidden-coin`,
                                                    privateBoardCoin, id, player,
                                                    `bg-small-coin`, null, moveName,
                                                    id, CoinTypes.Board);
                                            } else if (validatorName ===
                                                MoveValidatorNames.ClickCoinToUpgradeMoveValidator
                                                || validatorName ===
                                                MoveValidatorNames.PickConcreteCoinToUpgradeMoveValidator) {
                                                (moveMainArgs as IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`])
                                                    .push({
                                                        coinId: id,
                                                        type: CoinTypes.Board,
                                                    });
                                            }
                                        } else {
                                            if (data !== undefined) {
                                                if (!IsCoin(privateBoardCoin)) {
                                                    throw new Error(`Монета с id '${id}' на столе текущего приватного игрока не может отсутствовать.`);
                                                }
                                                DrawCoin(data, playerCells, `hidden-coin`,
                                                    privateBoardCoin, id, player, `bg-small-coin`);
                                            }
                                        }
                                    }
                                } else {
                                    if (data !== undefined) {
                                        if (!IsCoin(publicBoardCoin) || !publicBoardCoin.isOpened) {
                                            DrawCoin(data, playerCells, `back`, publicBoardCoin, id,
                                                player);
                                        } else if (publicBoardCoin.isOpened) {
                                            DrawCoin(data, playerCells, `hidden-coin`, publicBoardCoin, id,
                                                player, `bg-small-coin`);
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if (ctx.phase === Phases.PlaceCoins && player.selectedCoin !== null
                            && ((!multiplayer && (Number(ctx.currentPlayer) === p))
                                || (multiplayer && (Number(ctx.currentPlayer) === p)))) {
                            if (data !== undefined) {
                                if (i === 0) {
                                    DrawCoin(data, playerCells, `back-tavern-icon`, publicBoardCoin, id,
                                        player, null, id, moveName, id);
                                } else {
                                    DrawCoin(data, playerCells, `back-small-market-coin`, publicBoardCoin,
                                        id, player, null, null, moveName, id);
                                }
                            } else if (validatorName === MoveValidatorNames.ClickBoardCoinMoveValidator) {
                                (moveMainArgs as IMoveArgumentsStage<number[]>[`args`]).push(id);
                            }
                        } else {
                            if (data !== undefined) {
                                if (i === 0) {
                                    DrawCoin(data, playerCells, `back-tavern-icon`, publicBoardCoin, id,
                                        player, null, id);
                                } else {
                                    DrawCoin(data, playerCells, `back-small-market-coin`, publicBoardCoin,
                                        id, player);
                                }
                            }
                        }
                    }
                }
            }
            if (data !== undefined) {
                playerRows.push(
                    <tr key={`${player.nickname} board coins row ${i}`}>{playerCells}</tr>
                );
            }
        }
        if (data !== undefined) {
            playersBoardsCoins.push(
                <table className="mx-auto" key={`${player.nickname} board coins`}>
                    <caption>
                        Player {p + 1} ({player.nickname}) played coins
                    </caption>
                    <thead>
                        <tr>{playerHeaders}</tr>
                    </thead>
                    <tbody>
                        {playerRows}
                    </tbody>
                    <tfoot>
                        <tr>{playerFooters}</tr>
                    </tfoot>
                </table>
            );
        }
    }
    if (data !== undefined) {
        return playersBoardsCoins;
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};

/**
 * <h3>Отрисовка планшета монет, находящихся в руках игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Игровые поля для пользовательских монет в руке.
 * @constructor
 */
export const DrawPlayersHandsCoins = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorNames | null,
    data?: BoardProps<IMyGameState>): JSX.Element[]
    | (IMoveArgumentsStage<number[]>[`args`] | IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]) => {
    const multiplayer: boolean = IsMultiplayer(G),
        playersHandsCoins: JSX.Element[] = [],
        moveMainArgs: IMoveArgumentsStage<number[]>[`args`] | IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] = [];
    let moveName: MoveNames | undefined;
    for (let p = 0; p < ctx.numPlayers; p++) {
        const stage: string | undefined = ctx.activePlayers?.[p];
        switch (ctx.phase) {
            case Phases.PlaceCoins:
                moveName = MoveNames.ClickHandCoinMove;
                break;
            case Phases.PlaceCoinsUline:
                moveName = MoveNames.ClickHandCoinUlineMove;
                break;
            default:
                if (stage === Stages.UpgradeCoin) {
                    moveName = MoveNames.ClickCoinToUpgradeMove;
                } else if (stage === Stages.PlaceTradingCoinsUline) {
                    moveName = MoveNames.ClickHandTradingCoinUlineMove;
                } else if (stage === Stages.PickConcreteCoinToUpgrade) {
                    moveName = MoveNames.ClickConcreteCoinToUpgradeMove;
                } else if (stage === Stages.AddCoinToPouch) {
                    moveName = MoveNames.AddCoinToPouchMove;
                } else {
                    moveName = undefined;
                }
                break;
        }
        const player: IPublicPlayer | undefined = G.publicPlayers[p],
            privatePlayer: IPlayer | undefined = G.players[p],
            playerCells: JSX.Element[] = [];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок с id '${p}'.`);
        }
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < 5; j++) {
                const publicHandCoin: PublicPlayerCoinTypes | undefined = player.handCoins[j],
                    privateHandCoin: CoinType | undefined = privatePlayer?.handCoins[j];
                if (publicHandCoin === undefined) {
                    throw new Error(`В массиве монет игрока в руке отсутствует монета с id '${j}'.`);
                }
                if ((multiplayer && privateHandCoin !== undefined && IsCoin(privateHandCoin))
                    || (!multiplayer && Number(ctx.currentPlayer) === p && IsCoin(publicHandCoin))) {
                    let coinClasses = `border-2`;
                    if (player.selectedCoin === j) {
                        coinClasses = `border-2 border-green-400`;
                    }
                    const handCoin: PublicPlayerCoinTypes = privateHandCoin ?? publicHandCoin;
                    if (!IsCoin(handCoin)) {
                        throw new Error(`В массиве монет игрока в руке должна быть открыта монета с id '${j}'.`);
                    }
                    if (Number(ctx.currentPlayer) === p
                        && (ctx.phase === Phases.PlaceCoins || ctx.phase === Phases.PlaceCoinsUline
                            || (stage === Stages.PlaceTradingCoinsUline) || (stage === Stages.AddCoinToPouch
                                && CheckPlayerHasBuff(player, BuffNames.EveryTurn)))) {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `coin`, handCoin, j, player, coinClasses,
                                null, moveName, j);
                        } else if (validatorName === MoveValidatorNames.ClickHandCoinMoveValidator
                            || validatorName === MoveValidatorNames.ClickHandCoinUlineMoveValidator
                            || validatorName === MoveValidatorNames.ClickHandTradingCoinUlineMoveValidator
                            || validatorName === MoveValidatorNames.AddCoinToPouchMoveValidator) {
                            (moveMainArgs as IMoveArgumentsStage<number[]>[`args`]).push(j);
                        }
                    } else if (Number(ctx.currentPlayer) === p
                        && CheckPlayerHasBuff(player, BuffNames.EveryTurn)
                        && (stage === Stages.UpgradeCoin || (stage === Stages.PickConcreteCoinToUpgrade
                            && player.stack[0]?.config?.coinValue === handCoin.value))) {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `coin`, handCoin, j, player, coinClasses,
                                null, moveName, j, CoinTypes.Hand);
                        } else if (validatorName === MoveValidatorNames.ClickCoinToUpgradeMoveValidator
                            || validatorName === MoveValidatorNames.PickConcreteCoinToUpgradeMoveValidator) {
                            (moveMainArgs as IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]).push({
                                coinId: j,
                                type: CoinTypes.Hand,
                            });
                        }
                    } else {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `coin`, handCoin, j, player, coinClasses);
                        }
                    }
                } else if ((!multiplayer && IsCoin(publicHandCoin) && publicHandCoin.isOpened)
                    || (multiplayer && privateHandCoin === undefined && IsCoin(publicHandCoin)
                        && publicHandCoin.isOpened)) {
                    if (data !== undefined) {
                        DrawCoin(data, playerCells, `hidden-coin`, publicHandCoin, j, player,
                            `bg-small-coin`);
                    }
                } else {
                    if (data !== undefined) {
                        const boardCoinsLength: number =
                            player.boardCoins.filter((coin: PublicPlayerCoinTypes): boolean =>
                                coin !== null).length;
                        if (!multiplayer && IsCoin(publicHandCoin) && !publicHandCoin.isOpened) {
                            DrawCoin(data, playerCells, `back`, publicHandCoin, j, player);
                        } else if (multiplayer && privateHandCoin === undefined && (j < (5 - boardCoinsLength))) {
                            DrawCoin(data, playerCells, `back`, null, j, player);
                        } else {
                            playerCells.push(
                                <td key={`${player.nickname} hand coin ${j} empty`}
                                    className="bg-yellow-300">
                                    <span className="bg-coin bg-yellow-300 border-2"></span>
                                </td>
                            );
                        }
                    }
                }
            }
        }
        if (data !== undefined) {
            playersHandsCoins.push(
                <table className="mx-auto" key={`${player.nickname} hand coins`}>
                    <caption>Player {p + 1} ({player.nickname}) coins</caption>
                    <tbody>
                        <tr>{playerCells}</tr>
                    </tbody>
                </table>
            );
        }
    }
    if (data !== undefined) {
        return playersHandsCoins;
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};
