import type { Ctx } from "boardgame.io";
import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { IsCoin } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { CurrentScoring } from "../Score";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { tavernsConfig } from "../Tavern";
import { BuffNames, CoinTypeNames, ErrorNames, HeroNames, MoveNames, MoveValidatorNames, MultiSuitCardNames, PhaseNames, RusCardTypeNames, StageNames, SuitNames } from "../typescript/enums";
import type { CampDeckCardType, CanBeNullType, CanBeUndefType, CoinType, IHeroCard, IMoveArgumentsStage, IMoveCardsPlayerIdArguments, IMoveCoinsArguments, IMyGameState, IPlayer, IPublicPlayer, IStack, ITavernInConfig, MoveFunctionType, MythologicalCreatureCommandZoneCardType, PlayerCardType, PublicPlayerCoinType, SuitKeyofType, SuitPropertyType, VariantType } from "../typescript/interfaces";
import { DrawCard, DrawCoin, DrawSuit } from "./ElementsUI";

// TODO Check Solo Bot & multiplayer actions!
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
 */
export const DrawPlayersBoards = (G: IMyGameState, ctx: Ctx, validatorName: CanBeNullType<MoveValidatorNames>,
    playerId: CanBeNullType<number>, data?: BoardProps<IMyGameState>): JSX.Element[]
    | (IMoveArgumentsStage<number[]>[`args`] | IMoveArgumentsStage<SuitKeyofType[]>[`args`]
        | IMoveArgumentsStage<IMoveCardsPlayerIdArguments>[`args`]
        | IMoveArgumentsStage<Partial<SuitPropertyType<number[]>>>[`args`]) => {
    const playersBoards: JSX.Element[] = [];
    let moveMainArgs: CanBeUndefType<IMoveArgumentsStage<number[]>[`args`] | IMoveArgumentsStage<SuitKeyofType[]>[`args`]
        | IMoveArgumentsStage<Partial<SuitPropertyType<number[]>>>[`args`]
        | IMoveArgumentsStage<IMoveCardsPlayerIdArguments>[`args`]>;
    if (validatorName !== null) {
        switch (validatorName) {
            case MoveValidatorNames.PlaceThrudHeroMoveValidator:
            case MoveValidatorNames.PlaceYludHeroMoveValidator:
            case MoveValidatorNames.PlaceMultiSuitCardMoveValidator:
            case MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator:
            case MoveValidatorNames.GetEnlistmentMercenariesMoveValidator:
            case MoveValidatorNames.GetMjollnirProfitMoveValidator:
            case MoveValidatorNames.UseGodPowerMoveValidator:
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
            player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[p],
            stage: CanBeUndefType<string> = ctx.activePlayers?.[p];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, p);
        }
        const stack: CanBeUndefType<IStack> = player.stack[0];
        let suitTop: SuitKeyofType;
        // TODO Draw Giant Capture token on suit if needed!
        for (suitTop in suitsConfig) {
            if ((!G.solo || (G.solo && p === 0)) && p === Number(ctx.currentPlayer)
                && validatorName === MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator) {
                if (player.cards[suitTop].length) {
                    if (moveMainArgs === undefined || typeof moveMainArgs !== `object`
                        || Array.isArray(moveMainArgs) || `cards` in moveMainArgs) {
                        throw new Error(`Аргумент валидатора '${validatorName}' должен быть объектом с полем '${suitTop}'.`);
                    }
                    moveMainArgs[suitTop] = [];
                }
            }
            if ((!G.solo || (G.solo && p === 0)) && p === Number(ctx.currentPlayer)
                && ctx.phase === PhaseNames.GetMjollnirProfit) {
                if (data !== undefined) {
                    const suitArg: SuitKeyofType = suitTop;
                    DrawSuit(data, playerHeaders, suitArg, player, MoveNames.GetMjollnirProfitMove);
                } else if (validatorName === MoveValidatorNames.GetMjollnirProfitMoveValidator) {
                    if (!Array.isArray(moveMainArgs)) {
                        throw new Error(`Аргумент валидатора '${validatorName}' должен быть массивом`);
                    }
                    (moveMainArgs as IMoveArgumentsStage<SuitKeyofType[]>[`args`]).push(suitTop);
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
                } else if (!G.solo) {
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
                suit: SuitKeyofType;
            for (suit in suitsConfig) {
                id = i + j;
                const card: CanBeUndefType<PlayerCardType> = player.cards[suit][i],
                    last: number = player.cards[suit].length - 1;
                if (card !== undefined) {
                    isDrawRow = true;
                    if (p !== Number(ctx.currentPlayer) && stage === StageNames.DiscardSuitCard
                        && suit === SuitNames.Warrior && card.type !== RusCardTypeNames.Hero_Player_Card) {
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
                        && stage === StageNames.DiscardBoardCard && card.type !== RusCardTypeNames.Hero_Player_Card) {
                        // TODO Does it need more then 1 checking?
                        if (stack === undefined) {
                            return ThrowMyError(G, ctx, ErrorNames.FirstStackActionIsUndefined);
                        }
                        const stackSuit: CanBeUndefType<CanBeNullType<SuitKeyofType>> = stack.suit;
                        if (suit !== stackSuit && suit !== stack.pickedSuit) {
                            if (data !== undefined) {
                                const suitArg: SuitKeyofType = suit;
                                DrawCard(data, playerCells, card, id, player, suit,
                                    MoveNames.DiscardCardMove, suitArg, last);
                            } else if (validatorName === MoveValidatorNames.DiscardCardMoveValidator) {
                                if (moveMainArgs === undefined || typeof moveMainArgs !== `object`
                                    || Array.isArray(moveMainArgs) || `cards` in moveMainArgs) {
                                    throw new Error(`Аргумент валидатора '${validatorName}' должен быть объектом с полем '${suit}'.`);
                                }
                                moveMainArgs[suit] = [];
                                const moveMainArgsFoSuit: CanBeUndefType<number[]> = moveMainArgs[suit];
                                if (moveMainArgsFoSuit === undefined) {
                                    throw new Error(`Массив значений должен содержать фракцию '${suit}'.`);
                                }
                                moveMainArgsFoSuit.push(last);
                            }
                        }
                    } else if (p === Number(ctx.currentPlayer) && ctx.phase === PhaseNames.BrisingamensEndGame
                        && card.type !== RusCardTypeNames.Hero_Player_Card) {
                        if (data !== undefined) {
                            const suitArg: SuitKeyofType = suit;
                            DrawCard(data, playerCells, card, id, player, suit,
                                MoveNames.DiscardCardFromPlayerBoardMove, suitArg, i);
                        } else if (validatorName === MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator) {
                            if (moveMainArgs === undefined || typeof moveMainArgs !== `object`
                                || Array.isArray(moveMainArgs) || `cards` in moveMainArgs) {
                                throw new Error(`Аргумент валидатора '${validatorName}' должен быть объектом с полем '${suit}'.`);
                            }
                            const moveMainArgsFoSuit: CanBeUndefType<number[]> = moveMainArgs[suit];
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
                } else if (p === Number(ctx.currentPlayer) && (last + 1) === i
                    && ((((ctx.phase === PhaseNames.PlaceYlud && ctx.activePlayers === null)
                        || ctx.phase === PhaseNames.EnlistmentMercenaries
                        && ctx.activePlayers?.[Number(ctx.currentPlayer)] ===
                        StageNames.PlaceEnlistmentMercenaries)) || stage === StageNames.PlaceThrudHero
                        || stage === StageNames.PlaceMultiSuitsCards)) {
                    if (stack === undefined) {
                        return ThrowMyError(G, ctx, ErrorNames.FirstStackActionIsUndefined);
                    }
                    let cardVariants: CanBeUndefType<VariantType>;
                    if (ctx.phase === PhaseNames.EnlistmentMercenaries
                        && ctx.activePlayers?.[Number(ctx.currentPlayer)] ===
                        StageNames.PlaceEnlistmentMercenaries) {
                        cardVariants = stack.card?.variants[suit];
                        if (cardVariants !== undefined && cardVariants.suit !== suit) {
                            throw new Error(`У выбранной карты отсутствует обязательный параметр 'variants[suit]'.`);
                        }
                    }
                    if (data !== undefined) {
                        // TODO Draw heroes with more then one ranks no after the last card but when last rank of this hero card placed!?
                        // TODO Can Ylud be placed in old place because of "suit !== pickedCard.suit"? Thrud can be placed same suit in solo game!
                        let action: MoveFunctionType;
                        if ((G.solo || (!G.solo && (stack.name !== MultiSuitCardNames.OlwinsDouble
                            || (stack.name === MultiSuitCardNames.OlwinsDouble && suit !== stack.pickedSuit))))
                            || (cardVariants !== undefined && suit === cardVariants.suit)) {
                            switch (stack.name) {
                                case HeroNames.Thrud:
                                    action = data.moves.PlaceThrudHeroMove!;
                                    break;
                                case HeroNames.Ylud:
                                    action = data.moves.PlaceYludHeroMove!;
                                    break;
                                case MultiSuitCardNames.OlwinsDouble:
                                case MultiSuitCardNames.Gullinbursti:
                                    action = data.moves.PlaceMultiSuitCardMove!;
                                    break;
                                default:
                                    if (ctx.activePlayers?.[Number(ctx.currentPlayer)] ===
                                        StageNames.PlaceEnlistmentMercenaries
                                        && Number(ctx.currentPlayer) === p) {
                                        action = data.moves.PlaceEnlistmentMercenariesMove!;
                                        break;
                                    } else {
                                        throw new Error(`Нет такого мува.`);
                                    }
                            }
                            isDrawRow = true;
                            const suitArg: SuitKeyofType = suit;
                            // TODO Move to DrawSuit
                            playerCells.push(
                                <td onClick={() => action?.(suitArg)} className="cursor-pointer"
                                    key={`${player.nickname} place card ${stack.name} to ${suit}`}></td>
                            );
                        } else {
                            playerCells.push(
                                <td key={`${player.nickname} empty card ${id}`}></td>
                            );
                        }
                    } else if (validatorName === MoveValidatorNames.PlaceThrudHeroMoveValidator
                        || validatorName === MoveValidatorNames.PlaceYludHeroMoveValidator
                        || validatorName === MoveValidatorNames.PlaceMultiSuitCardMoveValidator
                        || (validatorName === MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator
                            && cardVariants !== undefined && suit === cardVariants.suit)) {
                        (moveMainArgs as IMoveArgumentsStage<SuitKeyofType[]>[`args`]).push(suit);
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
            for (let k = 0; k < 1; k++) {
                id += k + 1;
                const playerCards: PlayerCardType[] = Object.values(player.cards).flat(),
                    hero: CanBeUndefType<IHeroCard> = player.heroes[i];
                // TODO Draw heroes from the beginning if player has suit heroes (or draw them with opacity)
                if (hero !== undefined && !hero.suit && !((hero.name === HeroNames.Ylud
                    && playerCards.findIndex((card: PlayerCardType): boolean =>
                        card.name === HeroNames.Ylud) !== -1) || (hero.name === HeroNames.Thrud
                            && playerCards.findIndex((card: PlayerCardType): boolean =>
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
            }
            if (!G.solo) {
                for (let t = 0; t < 0 + Number(G.expansions.thingvellir.active); t++) {
                    id += t + 1;
                    const campCard: CanBeUndefType<CampDeckCardType> = player.campCards[i];
                    if (campCard !== undefined) {
                        isDrawRow = true;
                        if (campCard.type === RusCardTypeNames.Mercenary_Card
                            && ctx.phase === PhaseNames.EnlistmentMercenaries
                            && ctx.activePlayers === null && Number(ctx.currentPlayer) === p) {
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
                for (let m = 0; m < 0 + Number(G.expansions.idavoll.active); m++) {
                    id += m + 1;
                    const mythologicalCreatureCommandZoneCard: CanBeUndefType<MythologicalCreatureCommandZoneCardType> =
                        player.mythologicalCreatureCards[i];
                    if (mythologicalCreatureCommandZoneCard !== undefined) {
                        isDrawRow = true;
                        if (mythologicalCreatureCommandZoneCard.type === RusCardTypeNames.God_Card
                            && Number(ctx.currentPlayer) === p) {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, mythologicalCreatureCommandZoneCard, id, player,
                                    null, MoveNames.UseGodPowerMove, i);
                            } else if (validatorName === MoveValidatorNames.UseGodPowerMoveValidator) {
                                if (!Array.isArray(moveMainArgs)) {
                                    throw new Error(`Аргумент валидатора '${validatorName}' должен быть массивом.`);
                                }
                                (moveMainArgs as IMoveArgumentsStage<number[]>[`args`]).push(i);
                            }
                        } else {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, mythologicalCreatureCommandZoneCard, id, player,
                                    null);
                            }
                        }
                    } else {
                        if (data !== undefined) {
                            playerCells.push(
                                <td key={`${player.nickname} mythological creature command zone card ${i}`}></td>
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
                    <caption>Player {p + 1} ({player.nickname}) cards, {G.winner.length ? `Final: ${G.totalScore[p]}` : CurrentScoring(G, player)} points
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

// TODO Check all solo bot coins opened during Troop Evaluation phase to upgrade coin!
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
 */
export const DrawPlayersBoardsCoins = (G: IMyGameState, ctx: Ctx, validatorName: CanBeNullType<MoveValidatorNames>,
    data?: BoardProps<IMyGameState>): JSX.Element[]
    | (IMoveArgumentsStage<number[]>[`args`] | IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]) => {
    const playersBoardsCoins: JSX.Element[] = [],
        moveMainArgs: IMoveArgumentsStage<number[]>[`args`] | IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] = [];
    let moveName: CanBeUndefType<MoveNames>;
    for (let p = 0; p < ctx.numPlayers; p++) {
        const stage: CanBeUndefType<string> = ctx.activePlayers?.[p];
        switch (ctx.phase) {
            case PhaseNames.Bids:
                moveName = MoveNames.ClickBoardCoinMove;
                break;
            default:
                if (stage === StageNames.UpgradeCoin) {
                    moveName = MoveNames.ClickCoinToUpgradeMove;
                } else if (stage === StageNames.PickConcreteCoinToUpgrade) {
                    moveName = MoveNames.ClickConcreteCoinToUpgradeMove;
                } else if (stage === StageNames.UpgradeVidofnirVedrfolnirCoin) {
                    moveName = MoveNames.UpgradeCoinVidofnirVedrfolnirMove;
                } else {
                    moveName = undefined;
                }
                break;
        }
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[p],
            privatePlayer: CanBeUndefType<IPlayer> = G.players[p];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, p);
        }
        const playerRows: JSX.Element[] = [],
            playerHeaders: JSX.Element[] = [],
            playerFooters: JSX.Element[] = [];
        for (let i = 0; i < 2; i++) {
            const playerCells: JSX.Element[] = [];
            for (let t = 0; t < G.tavernsNum; t++) {
                if (data !== undefined) {
                    if (i === 0) {
                        const currentTavernConfig: CanBeUndefType<ITavernInConfig> = tavernsConfig[t];
                        if (currentTavernConfig === undefined) {
                            return ThrowMyError(G, ctx, ErrorNames.TavernConfigWithCurrentIdIsUndefined,
                                t);
                        }
                        playerHeaders.push(
                            <th key={`Tavern ${currentTavernConfig.name}`}>
                                <span style={Styles.Tavern(t)} className="bg-tavern-icon"></span>
                            </th>
                        );
                    } else {
                        if (t === G.tavernsNum - 1) {
                            playerFooters.push(
                                <th key={`${player.nickname} priority icon`}>
                                    <span style={Styles.Priority()} className="bg-priority-icon"></span>
                                </th>
                            );
                            playerCells.push(
                                <td key={`${player.nickname} priority gem`}
                                    className="bg-gray-300">
                                    <span style={player.priority.value > 0 ?
                                        Styles.Priorities(player.priority.value) : undefined}
                                        className="bg-priority"></span>
                                </td>
                            );
                        } else {
                            if (data !== undefined) {
                                playerFooters.push(
                                    <th key={`${player.nickname} exchange icon ${t}`}>
                                        <span style={Styles.Exchange()} className="bg-small-market-coin"></span>
                                    </th>
                                );
                            }
                        }
                    }
                }
                if (i === 0 || (i === 1 && t !== G.tavernsNum - 1)) {
                    const id: number = t + G.tavernsNum * i,
                        publicBoardCoin: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[id],
                        privateBoardCoin: CanBeUndefType<PublicPlayerCoinType> = privatePlayer?.boardCoins[id];
                    if (publicBoardCoin === undefined) {
                        throw new Error(`В массиве монет игрока на столе отсутствует монета с id '${id}'.`);
                    }
                    if (publicBoardCoin !== null) {
                        if (ctx.phase === PhaseNames.Bids && Number(ctx.currentPlayer) === p
                            && ((G.multiplayer && privateBoardCoin !== undefined)
                                || (!G.multiplayer && publicBoardCoin !== undefined))) {
                            if (data !== undefined) {
                                if (G.multiplayer && privateBoardCoin === undefined) {
                                    throw new Error(`Монета с id '${id}' на столе текущего приватного игрока не может отсутствовать.`);
                                }
                                // TODO Add errors!
                                if (!G.multiplayer && !IsCoin(publicBoardCoin)
                                    || (G.multiplayer && privateBoardCoin !== undefined
                                        && !IsCoin(privateBoardCoin))) {
                                    throw new Error(`Монета с id '${id}' на столе текущего игрока не может быть закрытой для него.`);
                                }
                                DrawCoin(data, playerCells, `coin`, privateBoardCoin ?? publicBoardCoin,
                                    id, player, null, null, moveName, id);
                            } else if (validatorName === MoveValidatorNames.ClickBoardCoinMoveValidator) {
                                (moveMainArgs as IMoveArgumentsStage<number[]>[`args`]).push(id);
                            }
                        } else if (Number(ctx.currentPlayer) === p && IsCoin(publicBoardCoin)
                            && !publicBoardCoin.isTriggerTrading && ((stage === StageNames.UpgradeCoin)
                                || (stage === StageNames.PickConcreteCoinToUpgrade
                                    && player.stack[0]?.coinValue === publicBoardCoin.value)
                                || (stage === StageNames.UpgradeVidofnirVedrfolnirCoin
                                    && player.stack[0]?.coinId !== id && id >= G.tavernsNum))) {
                            if (data !== undefined) {
                                if (G.multiplayer && !publicBoardCoin.isOpened) {
                                    throw new Error(`В массиве монет игрока на столе не может быть закрыта ранее открытая монета с id '${id}'.`);
                                }
                                DrawCoin(data, playerCells, `coin`, publicBoardCoin, id, player,
                                    `border-2`, null, moveName, id,
                                    CoinTypeNames.Board);
                            } else if (validatorName === MoveValidatorNames.ClickCoinToUpgradeMoveValidator
                                || validatorName === MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator
                                || validatorName === MoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator) {
                                (moveMainArgs as IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]).push({
                                    coinId: id,
                                    type: CoinTypeNames.Board,
                                });
                            }
                        } else {
                            if (G.winner.length || (G.solo && p === 0)
                                || (ctx.phase !== PhaseNames.Bids && i === 0 && G.currentTavern >= t)) {
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
                                if (G.multiplayer && privateBoardCoin !== undefined) {
                                    if (IsCoin(publicBoardCoin)) {
                                        if (!publicBoardCoin.isOpened) {
                                            throw new Error(`В массиве монет игрока на столе не может быть закрыта для других игроков ранее открытая монета с id '${id}'.`);
                                        }
                                        if (data !== undefined) {
                                            if (ctx.phase !== PhaseNames.Bids && i === 0 && G.currentTavern < t) {
                                                DrawCoin(data, playerCells, `coin`, publicBoardCoin, id,
                                                    player);
                                            } else {
                                                DrawCoin(data, playerCells, `hidden-coin`,
                                                    publicBoardCoin, id, player, `bg-small-coin`);
                                            }
                                        }
                                    } else {
                                        if (Number(ctx.currentPlayer) === p && IsCoin(privateBoardCoin)
                                            && !privateBoardCoin.isTriggerTrading && ((stage === StageNames.UpgradeCoin)
                                                || (stage === StageNames.PickConcreteCoinToUpgrade
                                                    && player.stack[0]?.coinValue ===
                                                    privateBoardCoin.value))) {
                                            if (data !== undefined) {
                                                DrawCoin(data, playerCells, `hidden-coin`,
                                                    privateBoardCoin, id, player, `bg-small-coin`,
                                                    null, moveName, id, CoinTypeNames.Board);
                                            } else if (!(G.solo && ctx.currentPlayer === `1`) &&
                                                validatorName === MoveValidatorNames.ClickCoinToUpgradeMoveValidator
                                                || validatorName ===
                                                MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator) {
                                                (moveMainArgs as IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`])
                                                    .push({
                                                        coinId: id,
                                                        type: CoinTypeNames.Board,
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
                        if (ctx.phase === PhaseNames.Bids && player.selectedCoin !== null
                            && ((!G.multiplayer && (Number(ctx.currentPlayer) === p))
                                || (G.multiplayer && (Number(ctx.currentPlayer) === p)))) {
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
 */
export const DrawPlayersHandsCoins = (G: IMyGameState, ctx: Ctx, validatorName: CanBeNullType<MoveValidatorNames>,
    data?: BoardProps<IMyGameState>): JSX.Element[]
    | (IMoveArgumentsStage<number[]>[`args`] | IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]) => {
    const playersHandsCoins: JSX.Element[] = [],
        moveMainArgs: IMoveArgumentsStage<number[]>[`args`] | IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] = [];
    let moveName: CanBeUndefType<MoveNames>;
    for (let p = 0; p < ctx.numPlayers; p++) {
        const stage: CanBeUndefType<string> = ctx.activePlayers?.[p];
        switch (ctx.phase) {
            case PhaseNames.Bids:
                moveName = MoveNames.ClickHandCoinMove;
                break;
            case PhaseNames.BidUline:
                moveName = MoveNames.ClickHandCoinUlineMove;
                break;
            default:
                if (stage === StageNames.UpgradeCoin) {
                    moveName = MoveNames.ClickCoinToUpgradeMove;
                } else if (stage === StageNames.PlaceTradingCoinsUline) {
                    moveName = MoveNames.ClickHandTradingCoinUlineMove;
                } else if (stage === StageNames.PickConcreteCoinToUpgrade) {
                    moveName = MoveNames.ClickConcreteCoinToUpgradeMove;
                } else if (stage === StageNames.AddCoinToPouch) {
                    moveName = MoveNames.AddCoinToPouchMove;
                } else {
                    moveName = undefined;
                }
                break;
        }
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[p],
            privatePlayer: CanBeUndefType<IPlayer> = G.players[p],
            playerCells: JSX.Element[] = [];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, p);
        }
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < 5; j++) {
                const publicHandCoin: CanBeUndefType<PublicPlayerCoinType> = player.handCoins[j],
                    privateHandCoin: CanBeUndefType<CoinType> = privatePlayer?.handCoins[j];
                if (publicHandCoin === undefined) {
                    throw new Error(`В массиве монет игрока в руке отсутствует монета с id '${j}'.`);
                }
                if ((G.multiplayer && privateHandCoin !== undefined && IsCoin(privateHandCoin))
                    || (!G.multiplayer && ((!G.solo && Number(ctx.currentPlayer) === p)
                        || (G.solo && (p === 0 || ctx.phase === PhaseNames.ChooseDifficultySoloMode)))
                        && IsCoin(publicHandCoin))) {
                    let coinClasses = `border-2`;
                    if (player.selectedCoin === j) {
                        coinClasses = `border-2 border-green-400`;
                    }
                    const handCoin: PublicPlayerCoinType = privateHandCoin ?? publicHandCoin;
                    if (!IsCoin(handCoin)) {
                        throw new Error(`В массиве монет игрока в руке должна быть открыта монета с id '${j}'.`);
                    }
                    if (Number(ctx.currentPlayer) === p
                        && (ctx.phase === PhaseNames.Bids || ctx.phase === PhaseNames.BidUline
                            || (stage === StageNames.PlaceTradingCoinsUline)
                            || (!G.solo && stage === StageNames.AddCoinToPouch
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
                    } else if (((!G.solo && Number(ctx.currentPlayer) === p
                        && CheckPlayerHasBuff(player, BuffNames.EveryTurn))
                        || (G.solo && Number(ctx.currentPlayer) === p && ctx.currentPlayer === `1`
                            && ctx.phase === PhaseNames.ChooseDifficultySoloMode))
                        && (stage === StageNames.UpgradeCoin || (stage === StageNames.PickConcreteCoinToUpgrade
                            && player.stack[0]?.coinValue === handCoin.value))) {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `coin`, handCoin, j, player, coinClasses,
                                null, moveName, j, CoinTypeNames.Hand);
                        } else if (validatorName === MoveValidatorNames.ClickCoinToUpgradeMoveValidator
                            || validatorName === MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator) {
                            (moveMainArgs as IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]).push({
                                coinId: j,
                                type: CoinTypeNames.Hand,
                            });
                        }
                    } else {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `coin`, handCoin, j, player, coinClasses);
                        }
                    }
                } else if ((!G.multiplayer || (G.multiplayer && privateHandCoin === undefined))
                    && IsCoin(publicHandCoin) && publicHandCoin.isOpened) {
                    if (data !== undefined) {
                        DrawCoin(data, playerCells, `hidden-coin`, publicHandCoin, j, player,
                            `bg-small-coin`);
                    }
                } else {
                    // TODO Add Throw errors to all UI files
                    if (!G.multiplayer && !G.solo && IsCoin(publicHandCoin) && !publicHandCoin.isOpened) {
                        if (data !== undefined) {
                            const handCoin: PublicPlayerCoinType = privateHandCoin ?? publicHandCoin;
                            if (!G.multiplayer && !G.solo && !IsCoin(handCoin)) {
                                throw new Error(`В массиве монет игрока в руке должна быть открыта для текущего игрока с id '${p}' монета с id '${j}'.`);
                            }
                            DrawCoin(data, playerCells, `back`, handCoin, j, player);
                        }
                    } else if (G.solo && p === 1 && !IsCoin(publicHandCoin) && publicHandCoin !== null) {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `back`, publicHandCoin, j, player);
                        } else if (validatorName === MoveValidatorNames.SoloBotPlaceAllCoinsMoveValidator) {
                            (moveMainArgs as IMoveArgumentsStage<number[]>[`args`]).push(j);
                        }
                    } else if (G.multiplayer && privateHandCoin === undefined) {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `back`, null, j, player);
                        }
                    } else {
                        if (data !== undefined) {
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
