import { ALlStyles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { AssertPlayerCoinId, AssertTavernIndex } from "../is_helpers/AssertionTypeHelpers";
import { IsMercenaryCampCard } from "../is_helpers/IsCampTypeHelpers";
import { IsCoin, IsTriggerTradingCoin } from "../is_helpers/IsCoinTypeHelpers";
import { AllCurrentScoring } from "../Score";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { tavernsConfig } from "../Tavern";
import { BidsMoveValidatorNames, BidUlineMoveValidatorNames, BrisingamensEndGameMoveValidatorNames, CardMoveNames, CardTypeRusNames, CoinCssClassNames, CoinMoveNames, CoinTypeNames, CommonMoveValidatorNames, CommonStageNames, DrawCoinTypeNames, EmptyCardMoveNames, EnlistmentMercenariesMoveValidatorNames, EnlistmentMercenariesStageNames, ErrorNames, GameModeNames, GetMjollnirProfitMoveValidatorNames, HeroBuffNames, HeroNames, MultiSuitCardNames, PhaseNames, PlaceYludMoveValidatorNames, PlayerIdForSoloGameNames, SoloBotAndvariCommonMoveValidatorNames, SoloBotAndvariCommonStageNames, SoloBotCommonCoinUpgradeMoveValidatorNames, SoloBotCommonCoinUpgradeStageNames, SoloBotCommonMoveValidatorNames, SoloBotCommonStageNames, SuitMoveNames, SuitNames, TavernsResolutionMoveValidatorNames, TavernsResolutionStageNames } from "../typescript/enums";
import type { ActiveStageNames, BoardProps, CampCardType, CanBeNullType, CanBeUndefType, CoinType, FnContext, HandBorderedCoinCssClasses, HeroCard, MercenaryRankType, MoveArgumentsType, MoveCardsArguments, MoveCoinsArguments, MoveValidatorNamesTypes, MythologicalCreatureCommandZoneCardType, PlayerBoardCardType, PlayerStack, PrivatePlayer, PublicPlayer, PublicPlayerCoinType, SuitPropertyType, VariantType } from "../typescript/interfaces";
import { DrawCard, DrawCoin, DrawEmptyCard, DrawSuit } from "./ElementsUI";

// TODO Check Solo Bot & multiplayer actions!
// TODO Move strings coins class names to enum!
/**
 * <h3>Отрисовка планшета всех карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param playerId Id игрока.
 * @param data Глобальные параметры.
 * @returns Игровые поля для планшета всех карт игрока.
 */
export const DrawPlayersBoards = ({ G, ctx, ...rest }: FnContext,
    validatorName: CanBeNullType<MoveValidatorNamesTypes>, playerId: CanBeNullType<number> = null, data?: BoardProps):
    JSX.Element[] | MoveArgumentsType<number[] | SuitNames[] | MoveCardsArguments
        | Partial<SuitPropertyType<number[]>>> => {
    const playersBoards: JSX.Element[] = [];
    let moveMainArgs: CanBeUndefType<MoveArgumentsType<number[] | SuitNames[] | MoveCardsArguments
        | Partial<SuitPropertyType<number[]>>>>;
    if (validatorName !== null) {
        switch (validatorName) {
            case CommonMoveValidatorNames.PlaceThrudHeroMoveValidator:
            case SoloBotCommonMoveValidatorNames.SoloBotPlaceThrudHeroMoveValidator:
            case SoloBotAndvariCommonMoveValidatorNames.SoloBotAndvariPlaceThrudHeroMoveValidator:
            case PlaceYludMoveValidatorNames.PlaceYludHeroMoveValidator:
            case PlaceYludMoveValidatorNames.SoloBotPlaceYludHeroMoveValidator:
            case PlaceYludMoveValidatorNames.SoloBotAndvariPlaceYludHeroMoveValidator:
            case CommonMoveValidatorNames.PlaceMultiSuitCardMoveValidator:
            case EnlistmentMercenariesMoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator:
            case EnlistmentMercenariesMoveValidatorNames.GetEnlistmentMercenariesMoveValidator:
            case GetMjollnirProfitMoveValidatorNames.GetMjollnirProfitMoveValidator:
            case TavernsResolutionMoveValidatorNames.ChooseSuitOlrunMoveValidator:
                moveMainArgs = [];
                break;
            case BrisingamensEndGameMoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator:
            case CommonMoveValidatorNames.DiscardTopCardFromSuitMoveValidator:
                moveMainArgs = {};
                break;
            case CommonMoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator:
                if (playerId === null) {
                    throw new Error(`Отсутствует обязательный параметр '${playerId}'.`);
                }
                moveMainArgs = {
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
            player: CanBeUndefType<PublicPlayer> = G.publicPlayers[p],
            stage: CanBeUndefType<ActiveStageNames> = ctx.activePlayers?.[p];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                p);
        }
        const stack: CanBeUndefType<PlayerStack> = player.stack[0];
        let suitTop: SuitNames;
        // TODO Draw player has distinction card after troop evaluation!
        // TODO Draw Giant Capture token on suit if needed!
        for (suitTop in suitsConfig) {
            if (((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer))
                && p === Number(ctx.currentPlayer)
                && validatorName === BrisingamensEndGameMoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator) {
                if (player.cards[suitTop].length) {
                    if (moveMainArgs === undefined || typeof moveMainArgs !== `object`
                        || Array.isArray(moveMainArgs) || `cards` in moveMainArgs) {
                        throw new Error(`Аргумент валидатора '${validatorName}' должен быть объектом с полем '${suitTop}'.`);
                    }
                    moveMainArgs[suitTop] = [];
                }
            }
            if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
                && p === Number(ctx.currentPlayer) && (ctx.phase === PhaseNames.GetMjollnirProfit
                    || ctx.activePlayers?.[Number(ctx.currentPlayer)]
                    === TavernsResolutionStageNames.ChooseSuitOlrun)) {
                if (data !== undefined) {
                    const phase: PhaseNames = ctx.phase;
                    let moveName: SuitMoveNames;
                    switch (phase) {
                        case PhaseNames.GetMjollnirProfit:
                            moveName = SuitMoveNames.GetMjollnirProfitMove;
                            break;
                        default:
                            if (ctx.activePlayers?.[Number(ctx.currentPlayer)]
                                === TavernsResolutionStageNames.ChooseSuitOlrun) {
                                moveName = SuitMoveNames.ChooseSuitOlrunMove;
                                break;
                            } else {
                                throw new Error(`Не может не быть доступного мува.`);
                            }
                    }
                    DrawSuit({ G, ctx, ...rest }, data, playerHeaders, suitTop, player, moveName);
                } else if (validatorName === GetMjollnirProfitMoveValidatorNames.GetMjollnirProfitMoveValidator
                    || validatorName === TavernsResolutionMoveValidatorNames.ChooseSuitOlrunMoveValidator) {
                    if (!Array.isArray(moveMainArgs)) {
                        throw new Error(`Аргумент валидатора '${validatorName}' должен быть массивом`);
                    }
                    (moveMainArgs as MoveArgumentsType<SuitNames[]>).push(suitTop);
                } else {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                }
            } else {
                if (data !== undefined) {
                    DrawSuit({ G, ctx, ...rest }, data, playerHeaders, suitTop, player);
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
            for (let s = 0; s < 1 + Number(G.expansions.Thingvellir.active); s++) {
                if (s === 0) {
                    playerHeaders.push(
                        <th className="bg-gray-600" key={`${player.nickname} hero icon`}>
                            <span style={ALlStyles.HeroBack()} className="bg-hero-icon"></span>
                        </th>
                    );
                    playerHeadersCount.push(
                        <th className="bg-gray-600 text-white"
                            key={`${player.nickname} hero count`}>
                            <b>{player.heroes.length}</b>
                        </th>
                    );
                } else if (G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer) {
                    playerHeaders.push(
                        <th className="bg-yellow-200" key={`${player.nickname} camp icon`}>
                            <span style={ALlStyles.Camp()} className="bg-camp-icon"></span>
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
                suit: SuitNames;
            for (suit in suitsConfig) {
                id = i + j;
                const card: CanBeUndefType<PlayerBoardCardType> = player.cards[suit][i],
                    last: number = player.cards[suit].length - 1;
                if (card !== undefined) {
                    isDrawRow = true;
                    if (p !== Number(ctx.currentPlayer)
                        && stage === CommonStageNames.DiscardSuitCardFromPlayerBoard
                        && suit === SuitNames.warrior && card.type !== CardTypeRusNames.HeroPlayerCard) {
                        if (data !== undefined) {
                            DrawCard({ G, ctx, ...rest }, data, playerCells, card, id, player, suit,
                                CardMoveNames.DiscardSuitCardFromPlayerBoardMove, i);
                        } else if (validatorName ===
                            CommonMoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator) {
                            if (p === playerId) {
                                if (moveMainArgs !== undefined && `cards` in moveMainArgs) {
                                    moveMainArgs.cards.push(i);
                                } else {
                                    throw new Error(`Аргумент валидатора '${validatorName}' должен быть объектом с полем 'cards'.`);
                                }
                            }
                        } else {
                            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                        }
                    } else if (p === Number(ctx.currentPlayer) && last === i
                        && stage === CommonStageNames.DiscardTopCardFromSuit
                        && card.type !== CardTypeRusNames.HeroPlayerCard) {
                        // TODO Does it need more then 1 checking?
                        if (stack === undefined) {
                            return ThrowMyError({ G, ctx, ...rest },
                                ErrorNames.FirstStackActionForPlayerWithCurrentIdIsUndefined, p);
                        }
                        const stackSuit: CanBeUndefType<SuitNames> = stack.suit;
                        if (suit !== stackSuit && suit !== stack.pickedSuit) {
                            if (data !== undefined) {
                                DrawCard({ G, ctx, ...rest }, data, playerCells, card, id, player, suit,
                                    CardMoveNames.DiscardTopCardFromSuitMove, suit, last);
                            } else if (validatorName === CommonMoveValidatorNames.DiscardTopCardFromSuitMoveValidator) {
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
                            } else {
                                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                            }
                        }
                    } else if (p === Number(ctx.currentPlayer) && ctx.phase === PhaseNames.BrisingamensEndGame
                        && card.type !== CardTypeRusNames.HeroPlayerCard) {
                        if (data !== undefined) {
                            DrawCard({ G, ctx, ...rest }, data, playerCells, card, id, player, suit,
                                CardMoveNames.DiscardCardFromPlayerBoardMove, suit, i);
                        } else if (validatorName ===
                            BrisingamensEndGameMoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator) {
                            if (moveMainArgs === undefined || typeof moveMainArgs !== `object`
                                || Array.isArray(moveMainArgs) || `cards` in moveMainArgs) {
                                throw new Error(`Аргумент валидатора '${validatorName}' должен быть объектом с полем '${suit}'.`);
                            }
                            const moveMainArgsFoSuit: CanBeUndefType<number[]> = moveMainArgs[suit];
                            if (moveMainArgsFoSuit === undefined) {
                                throw new Error(`Массив значений должен содержать фракцию '${suit}'.`);
                            }
                            moveMainArgsFoSuit.push(i);
                        } else {
                            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                        }
                    } else {
                        if (data !== undefined) {
                            DrawCard({ G, ctx, ...rest }, data, playerCells, card, id, player, suit);
                        }
                    }
                } else if (p === Number(ctx.currentPlayer) && (last + 1) === i
                    && ((((ctx.phase === PhaseNames.PlaceYlud && ctx.activePlayers === null)
                        || (ctx.phase === PhaseNames.EnlistmentMercenaries
                            && ctx.activePlayers?.[Number(ctx.currentPlayer)]
                            === EnlistmentMercenariesStageNames.PlaceEnlistmentMercenaries)))
                        || stage === CommonStageNames.PlaceMultiSuitCard
                        || stage === CommonStageNames.PlaceThrudHero
                        || stage === SoloBotCommonStageNames.SoloBotPlaceThrudHero
                        || stage === SoloBotAndvariCommonStageNames.SoloBotAndvariPlaceThrudHero)) {
                    if (stack === undefined) {
                        return ThrowMyError({ G, ctx, ...rest },
                            ErrorNames.FirstStackActionForPlayerWithCurrentIdIsUndefined, p);
                    }
                    let cardVariants: CanBeUndefType<VariantType<MercenaryRankType>>;
                    if (ctx.phase === PhaseNames.EnlistmentMercenaries
                        && ctx.activePlayers?.[Number(ctx.currentPlayer)] ===
                        EnlistmentMercenariesStageNames.PlaceEnlistmentMercenaries) {
                        if (IsMercenaryCampCard(stack.card)) {
                            cardVariants = stack.card.variants[suit];
                            if (cardVariants !== undefined && cardVariants.suit !== suit) {
                                throw new Error(`У выбранной карты отсутствует обязательный параметр 'variants[suit]'.`);
                            }
                        } else {
                            throw new Error(`Выбранная карта должна быть с типом '${CardTypeRusNames.MercenaryCard}'.`);
                        }
                    }
                    if (data !== undefined) {
                        // TODO Draw heroes with more then one ranks no after the last card but when last rank of this hero card placed!?
                        // TODO Can Ylud be placed in old place because of "suit !== pickedCard.suit"? Thrud can be placed same suit in solo game!
                        let cardType: CardTypeRusNames,
                            moveName: EmptyCardMoveNames;
                        if (((G.mode === GameModeNames.Solo
                            && ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId)
                            || G.mode === GameModeNames.SoloAndvari
                            || ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
                                && (stack.name !== MultiSuitCardNames.OlwinsDouble
                                    || (stack.name === MultiSuitCardNames.OlwinsDouble && suit !== stack.pickedSuit))))
                            || (cardVariants !== undefined && suit === cardVariants.suit)) {
                            let _exhaustiveCheck: never;
                            switch (stack.name) {
                                case HeroNames.Thrud:
                                    switch (G.mode) {
                                        case GameModeNames.Basic:
                                        case GameModeNames.Multiplayer:
                                            moveName = EmptyCardMoveNames.PlaceThrudHeroMove;
                                            break;
                                        case GameModeNames.Solo:
                                            if (ctx.currentPlayer === PlayerIdForSoloGameNames.HumanPlayerId) {
                                                moveName = EmptyCardMoveNames.PlaceThrudHeroMove;
                                            } else if (ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId) {
                                                moveName = EmptyCardMoveNames.SoloBotPlaceThrudHeroMove;
                                            } else {
                                                return ThrowMyError({ G, ctx, ...rest },
                                                    ErrorNames.CanNotBeMoreThenTwoPlayersInSoloGameMode);
                                            }
                                            break;
                                        case GameModeNames.SoloAndvari:
                                            if (ctx.currentPlayer === PlayerIdForSoloGameNames.HumanPlayerId) {
                                                moveName = EmptyCardMoveNames.PlaceThrudHeroMove;
                                            } else if (p === 1
                                                && ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId) {
                                                moveName = EmptyCardMoveNames.SoloBotAndvariPlaceThrudHeroMove;
                                            } else {
                                                return ThrowMyError({ G, ctx, ...rest },
                                                    ErrorNames.CanNotBeMoreThenTwoPlayersInSoloGameMode);
                                            }
                                            break;
                                        default:
                                            _exhaustiveCheck = G.mode;
                                            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchGameMode);
                                            return _exhaustiveCheck;
                                    }
                                    cardType = CardTypeRusNames.HeroPlayerCard;
                                    break;
                                case HeroNames.Ylud:
                                    switch (G.mode) {
                                        case GameModeNames.Basic:
                                        case GameModeNames.Multiplayer:
                                            moveName = EmptyCardMoveNames.PlaceYludHeroMove;
                                            break;
                                        case GameModeNames.Solo:
                                            if (ctx.currentPlayer === PlayerIdForSoloGameNames.HumanPlayerId) {
                                                moveName = EmptyCardMoveNames.PlaceYludHeroMove;
                                            } else if (ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId) {
                                                moveName = EmptyCardMoveNames.SoloBotPlaceYludHeroMove;
                                            } else {
                                                return ThrowMyError({ G, ctx, ...rest },
                                                    ErrorNames.CanNotBeMoreThenTwoPlayersInSoloGameMode);
                                            }
                                            break;
                                        case GameModeNames.SoloAndvari:
                                            if (ctx.currentPlayer === PlayerIdForSoloGameNames.HumanPlayerId) {
                                                moveName = EmptyCardMoveNames.PlaceYludHeroMove;
                                            } else if (p === 1
                                                && ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId) {
                                                moveName = EmptyCardMoveNames.SoloBotAndvariPlaceYludHeroMove;
                                            } else {
                                                return ThrowMyError({ G, ctx, ...rest },
                                                    ErrorNames.CanNotBeMoreThenTwoPlayersInSoloGameMode);
                                            }
                                            break;
                                        default:
                                            _exhaustiveCheck = G.mode;
                                            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchGameMode);
                                            return _exhaustiveCheck;
                                    }
                                    cardType = CardTypeRusNames.HeroPlayerCard;
                                    break;
                                case MultiSuitCardNames.OlwinsDouble:
                                case MultiSuitCardNames.Gullinbursti:
                                    cardType = CardTypeRusNames.MultiSuitPlayerCard;
                                    moveName = EmptyCardMoveNames.PlaceMultiSuitCardMove;
                                    break;
                                default:
                                    if (ctx.activePlayers?.[Number(ctx.currentPlayer)] ===
                                        EnlistmentMercenariesStageNames.PlaceEnlistmentMercenaries
                                        && Number(ctx.currentPlayer) === p) {
                                        cardType = CardTypeRusNames.MercenaryPlayerCard;
                                        moveName = EmptyCardMoveNames.PlaceEnlistmentMercenariesMove;
                                        break;
                                    } else {
                                        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
                                    }
                            }
                            isDrawRow = true;
                            DrawEmptyCard({ G, ctx, ...rest }, data, playerCells, cardType, id, player, suit,
                                moveName, suit);
                        } else {
                            DrawEmptyCard({ G, ctx, ...rest }, data, playerCells,
                                CardTypeRusNames.PlayerBoardCard, id, player, suit);
                        }
                    } else if (validatorName === CommonMoveValidatorNames.PlaceThrudHeroMoveValidator
                        || validatorName === SoloBotCommonMoveValidatorNames.SoloBotPlaceThrudHeroMoveValidator
                        || validatorName ===
                        SoloBotAndvariCommonMoveValidatorNames.SoloBotAndvariPlaceThrudHeroMoveValidator
                        || validatorName ===
                        PlaceYludMoveValidatorNames.PlaceYludHeroMoveValidator
                        || validatorName === PlaceYludMoveValidatorNames.SoloBotPlaceYludHeroMoveValidator
                        || validatorName === PlaceYludMoveValidatorNames.SoloBotAndvariPlaceYludHeroMoveValidator
                        || validatorName === CommonMoveValidatorNames.PlaceMultiSuitCardMoveValidator
                        || validatorName ===
                        EnlistmentMercenariesMoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator) {
                        if (!(validatorName ===
                            EnlistmentMercenariesMoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator
                            && ((cardVariants !== undefined && suit !== cardVariants.suit)
                                || (cardVariants === undefined)))) {
                            (moveMainArgs as MoveArgumentsType<SuitNames[]>).push(suit);
                        }
                    } else {
                        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                    }
                } else {
                    if (data !== undefined) {
                        DrawEmptyCard({ G, ctx, ...rest }, data, playerCells,
                            CardTypeRusNames.PlayerBoardCard, id, player, suit);
                    }
                }
                j++;
            }
            for (let k = 0; k < 1; k++) {
                id += k + 1;
                const playerCards: PlayerBoardCardType[] = Object.values(player.cards).flat(),
                    hero: CanBeUndefType<HeroCard> = player.heroes[i];
                // TODO Draw heroes from the beginning if player has suit heroes (or draw them with opacity)
                // TODO How draw and count no counting Hero from Thrivaldi!?
                if (hero !== undefined && !hero.playerSuit && !((hero.name === HeroNames.Ylud
                    && playerCards.findIndex((card: PlayerBoardCardType): boolean =>
                        card.name === HeroNames.Ylud) !== -1) || (hero.name === HeroNames.Thrud
                            && playerCards.findIndex((card: PlayerBoardCardType): boolean =>
                                card.name === HeroNames.Thrud) !== -1))) {
                    isDrawRow = true;
                    if (data !== undefined) {
                        DrawCard({ G, ctx, ...rest }, data, playerCells, hero, id, player, null);
                    }
                } else {
                    if (data !== undefined) {
                        DrawEmptyCard({ G, ctx, ...rest }, data, playerCells,
                            CardTypeRusNames.CommandZoneHeroCard, id, player, null);
                    }
                }
            }
            if (G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer) {
                for (let t = 0; t < 0 + Number(G.expansions.Thingvellir.active); t++) {
                    id += t + 1;
                    const campCard: CanBeUndefType<CampCardType> = player.campCards[i];
                    if (campCard !== undefined) {
                        isDrawRow = true;
                        if (campCard.type === CardTypeRusNames.MercenaryCard
                            && ctx.phase === PhaseNames.EnlistmentMercenaries
                            && ctx.activePlayers === null && Number(ctx.currentPlayer) === p) {
                            if (data !== undefined) {
                                DrawCard({ G, ctx, ...rest }, data, playerCells, campCard, id, player, null,
                                    CardMoveNames.GetEnlistmentMercenariesMove, i);
                            } else if (validatorName ===
                                EnlistmentMercenariesMoveValidatorNames.GetEnlistmentMercenariesMoveValidator) {
                                if (!Array.isArray(moveMainArgs)) {
                                    throw new Error(`Аргумент валидатора '${validatorName}' должен быть массивом.`);
                                }
                                (moveMainArgs as MoveArgumentsType<number[]>).push(i);
                            } else {
                                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                            }
                        } else {
                            if (data !== undefined) {
                                DrawCard({ G, ctx, ...rest }, data, playerCells, campCard, id, player,
                                    null);
                            }
                        }
                    } else {
                        if (data !== undefined) {
                            DrawEmptyCard({ G, ctx, ...rest }, data, playerCells,
                                CardTypeRusNames.CommandZoneCampCard, id, player, null);
                        }
                    }
                }
                for (let m = 0; m < 0 + Number(G.expansions.Idavoll.active); m++) {
                    id += m + 1;
                    const mythologicalCreatureCommandZoneCard: CanBeUndefType<MythologicalCreatureCommandZoneCardType> =
                        player.mythologicalCreatureCards[i];
                    if (mythologicalCreatureCommandZoneCard !== undefined) {
                        isDrawRow = true;
                        if (data !== undefined) {
                            DrawCard({ G, ctx, ...rest }, data, playerCells, mythologicalCreatureCommandZoneCard,
                                id, player, null);
                        }
                    } else {
                        if (data !== undefined) {
                            DrawEmptyCard({ G, ctx, ...rest }, data, playerCells,
                                CardTypeRusNames.CommandZoneMythologicalCreatureCard, id, player,
                                null);
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
            let scoreText = ``;
            if (G.winner) {
                if (G.totalScore === null) {
                    throw new Error(`В массиве итоговых очков игроков должны быть значения.`);
                }
                const finalTotalScore: CanBeUndefType<number> = G.totalScore[p];
                if (finalTotalScore === undefined) {
                    throw new Error(`В массиве итоговых очков игроков должно быть значение игрока с id ${p}.`);
                }
                scoreText = `Final: ${finalTotalScore}`;
            } else {
                scoreText = `${AllCurrentScoring({ G, ctx, myPlayerID: String(p), ...rest })}`;
            }
            playersBoards.push(
                <table className="mx-auto" key={`${player.nickname} board`}>
                    <caption>Player {p + 1} ({player.nickname}) cards, {scoreText} points</caption>
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
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionMustHaveReturnValue);
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
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Игровые поля для пользовательских монет на столе | данные для списка доступных аргументов мува.
 */
export const DrawPlayersBoardsCoins = ({ G, ctx, ...rest }: FnContext,
    validatorName: CanBeNullType<MoveValidatorNamesTypes>, data?: BoardProps):
    JSX.Element[] | MoveArgumentsType<number[] | MoveCoinsArguments[]> => {
    const playersBoardsCoins: JSX.Element[] = [],
        moveMainArgs: MoveArgumentsType<number[] | MoveCoinsArguments[]> = [];
    let moveName: CanBeUndefType<CoinMoveNames>;
    for (let p = 0; p < ctx.numPlayers; p++) {
        const stage: CanBeUndefType<ActiveStageNames> = ctx.activePlayers?.[p];
        switch (ctx.phase) {
            case PhaseNames.Bids:
                moveName = CoinMoveNames.ClickBoardCoinMove;
                break;
            default:
                if (stage === CommonStageNames.ClickCoinToUpgrade
                    || stage === SoloBotCommonCoinUpgradeStageNames.SoloBotClickCoinToUpgrade
                    || stage === SoloBotAndvariCommonStageNames.SoloBotAndvariClickCoinToUpgrade) {
                    let _exhaustiveCheck: never;
                    switch (G.mode) {
                        case GameModeNames.Basic:
                        case GameModeNames.Multiplayer:
                            moveName = CoinMoveNames.ClickCoinToUpgradeMove;
                            break;
                        case GameModeNames.Solo:
                            if (ctx.currentPlayer === PlayerIdForSoloGameNames.HumanPlayerId) {
                                moveName = CoinMoveNames.ClickCoinToUpgradeMove;
                            } else if (ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId) {
                                moveName = CoinMoveNames.SoloBotClickCoinToUpgradeMove;
                            } else {
                                return ThrowMyError({ G, ctx, ...rest },
                                    ErrorNames.CanNotBeMoreThenTwoPlayersInSoloGameMode);
                            }
                            break;
                        case GameModeNames.SoloAndvari:
                            if (ctx.currentPlayer === PlayerIdForSoloGameNames.HumanPlayerId) {
                                moveName = CoinMoveNames.ClickCoinToUpgradeMove;
                            } else if (p === 1 && ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId) {
                                moveName = CoinMoveNames.SoloBotAndvariClickCoinToUpgradeMove;
                            } else {
                                return ThrowMyError({ G, ctx, ...rest },
                                    ErrorNames.CanNotBeMoreThenTwoPlayersInSoloGameMode);
                            }
                            break;
                        default:
                            _exhaustiveCheck = G.mode;
                            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchGameMode);
                            return _exhaustiveCheck;
                    }
                } else if (stage === CommonStageNames.PickConcreteCoinToUpgrade) {
                    moveName = CoinMoveNames.PickConcreteCoinToUpgradeMove;
                } else if (stage === CommonStageNames.UpgradeCoinVidofnirVedrfolnir) {
                    moveName = CoinMoveNames.UpgradeCoinVidofnirVedrfolnirMove;
                } else {
                    moveName = undefined;
                }
                break;
        }
        const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[p],
            privatePlayer: CanBeUndefType<PrivatePlayer> = G.players[p];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                p);
        }
        const playerRows: JSX.Element[] = [],
            playerHeaders: JSX.Element[] = [],
            playerFooters: JSX.Element[] = [];
        for (let i = 0; i < 2; i++) {
            const playerCells: JSX.Element[] = [];
            for (let t = 0; t < G.tavernsNum; t++) {
                if (data !== undefined) {
                    if (i === 0) {
                        AssertTavernIndex(t);
                        playerHeaders.push(
                            <th key={`${player.nickname} tavern ${tavernsConfig[t].name} coin`}>
                                <span style={ALlStyles.Tavern(t)}
                                    className="bg-tavern-icon"></span>
                            </th>
                        );
                    } else {
                        if (t === G.tavernsNum - 1) {
                            playerFooters.push(
                                <th key={`${player.nickname} priority icon`}>
                                    <span style={ALlStyles.Priority()} className="bg-priority-icon"></span>
                                </th>
                            );
                            playerCells.push(
                                <td key={`${player.nickname} priority gem`}
                                    className="bg-gray-300">
                                    <span style={player.priority.value > 0 ?
                                        ALlStyles.Priorities(player.priority.value) : undefined}
                                        className="bg-priority"></span>
                                </td>
                            );
                        } else {
                            if (data !== undefined) {
                                playerFooters.push(
                                    <th key={`${player.nickname} exchange icon ${t}`}>
                                        <span style={ALlStyles.Exchange()} className="bg-small-market-coin"></span>
                                    </th>
                                );
                            }
                        }
                    }
                }
                if (i === 0 || (i === 1 && t !== G.tavernsNum - 1)) {
                    const id: number = (t + G.tavernsNum * i);
                    AssertPlayerCoinId(id);
                    const publicBoardCoin: PublicPlayerCoinType = player.boardCoins[id],
                        privateBoardCoin: CanBeUndefType<PublicPlayerCoinType> = privatePlayer?.boardCoins[id];
                    if (publicBoardCoin !== null) {
                        if (ctx.phase === PhaseNames.Bids && Number(ctx.currentPlayer) === p
                            && ((G.mode === GameModeNames.Multiplayer && privateBoardCoin !== undefined)
                                || (G.mode === GameModeNames.Basic && publicBoardCoin !== undefined))) {
                            if (data !== undefined) {
                                if (G.mode === GameModeNames.Multiplayer && privateBoardCoin === undefined) {
                                    throw new Error(`Монета с id '${id}' на столе текущего приватного игрока не может отсутствовать.`);
                                }
                                // TODO Add errors!
                                if (G.mode === GameModeNames.Basic && !IsCoin(publicBoardCoin)
                                    || (G.mode === GameModeNames.Multiplayer && privateBoardCoin !== undefined
                                        && !IsCoin(privateBoardCoin))) {
                                    throw new Error(`Монета с id '${id}' на столе текущего игрока не может быть закрытой для него.`);
                                }
                                DrawCoin({ G, ctx, ...rest }, data, playerCells, DrawCoinTypeNames.Coin,
                                    privateBoardCoin ?? publicBoardCoin, id, player, null,
                                    null, moveName, id);
                            } else if (validatorName === BidsMoveValidatorNames.ClickBoardCoinMoveValidator) {
                                (moveMainArgs as MoveArgumentsType<number[]>).push(id);
                            } else {
                                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                            }
                        } else if (Number(ctx.currentPlayer) === p && IsCoin(publicBoardCoin)
                            && !IsTriggerTradingCoin(publicBoardCoin)
                            && ((stage === CommonStageNames.ClickCoinToUpgrade
                                || stage === SoloBotCommonCoinUpgradeStageNames.SoloBotClickCoinToUpgrade
                                || stage === SoloBotAndvariCommonStageNames.SoloBotAndvariClickCoinToUpgrade)
                                || (stage === CommonStageNames.PickConcreteCoinToUpgrade
                                    && player.stack[0]?.coinValue === publicBoardCoin.value)
                                || (stage === CommonStageNames.UpgradeCoinVidofnirVedrfolnir
                                    && player.stack[0]?.coinId !== id && id >= G.tavernsNum))) {
                            if (data !== undefined) {
                                if (G.mode === GameModeNames.Multiplayer && !publicBoardCoin.isOpened) {
                                    throw new Error(`В массиве монет игрока на столе не может быть закрыта ранее открытая монета с id '${id}'.`);
                                }
                                DrawCoin({ G, ctx, ...rest }, data, playerCells, DrawCoinTypeNames.Coin,
                                    publicBoardCoin, id, player, CoinCssClassNames.BorderedCoin,
                                    null, moveName, id, CoinTypeNames.Board);
                            } else if (validatorName === CommonMoveValidatorNames.ClickCoinToUpgradeMoveValidator
                                || validatorName ===
                                SoloBotCommonCoinUpgradeMoveValidatorNames.SoloBotClickCoinToUpgradeMoveValidator
                                || validatorName ===
                                SoloBotAndvariCommonMoveValidatorNames.SoloBotAndvariClickCoinToUpgradeMoveValidator
                                || validatorName === CommonMoveValidatorNames.PickConcreteCoinToUpgradeMoveValidator
                                || validatorName ===
                                CommonMoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator) {
                                (moveMainArgs as MoveArgumentsType<MoveCoinsArguments[]>).push({
                                    coinId: id,
                                    type: CoinTypeNames.Board,
                                });
                            } else {
                                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                            }
                        } else {
                            if (G.winner || ((G.mode === GameModeNames.Solo)
                                || (G.mode === GameModeNames.SoloAndvari) && p === 0)
                                || (ctx.phase !== PhaseNames.Bids && i === 0 && G.currentTavern >= t)) {
                                if (data !== undefined) {
                                    if (!IsCoin(publicBoardCoin)) {
                                        throw new Error(`Монета с id '${id}' на столе текущего игрока не может быть закрытой для него.`);
                                    }
                                    if (!publicBoardCoin.isOpened) {
                                        throw new Error(`В массиве монет игрока на столе не может быть закрыта для других игроков ранее открытая монета с id '${id}'.`);
                                    }
                                    DrawCoin({ G, ctx, ...rest }, data, playerCells, DrawCoinTypeNames.Coin,
                                        publicBoardCoin, id, player);
                                }
                            } else {
                                if (G.mode === GameModeNames.Multiplayer && privateBoardCoin !== undefined) {
                                    if (IsCoin(publicBoardCoin)) {
                                        if (!publicBoardCoin.isOpened) {
                                            throw new Error(`В массиве монет игрока на столе не может быть закрыта для других игроков ранее открытая монета с id '${id}'.`);
                                        }
                                        if (data !== undefined) {
                                            if (ctx.phase !== PhaseNames.Bids && i === 0 && G.currentTavern < t) {
                                                DrawCoin({ G, ctx, ...rest }, data, playerCells,
                                                    DrawCoinTypeNames.Coin, publicBoardCoin, id, player);
                                            } else {
                                                DrawCoin({ G, ctx, ...rest }, data, playerCells,
                                                    DrawCoinTypeNames.HiddenCoin, publicBoardCoin, id,
                                                    player, CoinCssClassNames.SmallCoinBG);
                                            }
                                        }
                                    } else {
                                        if (Number(ctx.currentPlayer) === p && IsCoin(privateBoardCoin)
                                            && !!IsTriggerTradingCoin(privateBoardCoin)
                                            && ((stage === CommonStageNames.ClickCoinToUpgrade)
                                                || (stage === CommonStageNames.PickConcreteCoinToUpgrade
                                                    && player.stack[0]?.coinValue === privateBoardCoin.value))) {
                                            if (data !== undefined) {
                                                DrawCoin({ G, ctx, ...rest }, data, playerCells,
                                                    DrawCoinTypeNames.HiddenCoin, privateBoardCoin, id,
                                                    player, CoinCssClassNames.SmallCoinBG,
                                                    null, moveName, id, CoinTypeNames.Board);
                                            } else if (validatorName ===
                                                CommonMoveValidatorNames.ClickCoinToUpgradeMoveValidator
                                                || validatorName ===
                                                CommonMoveValidatorNames.PickConcreteCoinToUpgradeMoveValidator) {
                                                (moveMainArgs as MoveArgumentsType<MoveCoinsArguments[]>)
                                                    .push({
                                                        coinId: id,
                                                        type: CoinTypeNames.Board,
                                                    });
                                            } else {
                                                return ThrowMyError({ G, ctx, ...rest },
                                                    ErrorNames.NoAddedValidator);
                                            }
                                        } else {
                                            if (data !== undefined) {
                                                if (!IsCoin(privateBoardCoin)) {
                                                    throw new Error(`Монета с id '${id}' на столе текущего приватного игрока не может отсутствовать.`);
                                                }
                                                DrawCoin({ G, ctx, ...rest }, data, playerCells,
                                                    DrawCoinTypeNames.HiddenCoin, privateBoardCoin, id,
                                                    player, CoinCssClassNames.SmallCoinBG);
                                            }
                                        }
                                    }
                                } else {
                                    if (data !== undefined) {
                                        if (!IsCoin(publicBoardCoin) || !publicBoardCoin.isOpened) {
                                            DrawCoin({ G, ctx, ...rest }, data, playerCells,
                                                DrawCoinTypeNames.Back, publicBoardCoin, id, player);
                                        } else if (publicBoardCoin.isOpened) {
                                            DrawCoin({ G, ctx, ...rest }, data, playerCells,
                                                DrawCoinTypeNames.HiddenCoin, publicBoardCoin, id, player,
                                                CoinCssClassNames.SmallCoinBG);
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if (ctx.phase === PhaseNames.Bids && player.selectedCoin !== null
                            && ((G.mode === GameModeNames.Basic && (Number(ctx.currentPlayer) === p))
                                || (G.mode === GameModeNames.Multiplayer
                                    && (Number(ctx.currentPlayer) === p))
                                || ((G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari)
                                    && ctx.currentPlayer === PlayerIdForSoloGameNames.HumanPlayerId))) {
                            if (data !== undefined) {
                                if (i === 0) {
                                    DrawCoin({ G, ctx, ...rest }, data, playerCells,
                                        DrawCoinTypeNames.BackTavernIcon, publicBoardCoin, id, player,
                                        null, id, moveName, id);
                                } else {
                                    DrawCoin({ G, ctx, ...rest }, data, playerCells,
                                        DrawCoinTypeNames.BackSmallMarketCoin, publicBoardCoin, id,
                                        player, null, null, moveName, id);
                                }
                            } else if (validatorName === BidsMoveValidatorNames.ClickBoardCoinMoveValidator) {
                                (moveMainArgs as MoveArgumentsType<number[]>).push(id);
                            } else {
                                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                            }
                        } else {
                            if (data !== undefined) {
                                if (i === 0) {
                                    DrawCoin({ G, ctx, ...rest }, data, playerCells,
                                        DrawCoinTypeNames.BackTavernIcon, publicBoardCoin, id, player,
                                        null, id);
                                } else {
                                    DrawCoin({ G, ctx, ...rest }, data, playerCells,
                                        DrawCoinTypeNames.BackSmallMarketCoin, publicBoardCoin, id, player);
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
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionMustHaveReturnValue);
    }
};

/**
 * <h3>Отрисовка планшета монет, находящихся в руках игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Игровые поля для пользовательских монет в руке.
 */
export const DrawPlayersHandsCoins = ({ G, ctx, ...rest }: FnContext,
    validatorName: CanBeNullType<MoveValidatorNamesTypes>, data?: BoardProps):
    JSX.Element[] | MoveArgumentsType<number[][] | number[] | MoveCoinsArguments[]> => {
    const playersHandsCoins: JSX.Element[] = [],
        moveMainArgs: MoveArgumentsType<number[][] | number[] | MoveCoinsArguments[]> = [];
    if (validatorName === BidsMoveValidatorNames.SoloBotPlaceAllCoinsMoveValidator
        || validatorName === BidsMoveValidatorNames.SoloBotAndvariPlaceAllCoinsMoveValidator) {
        moveMainArgs[0] = [];
    }
    let moveName: CanBeUndefType<CoinMoveNames>;
    for (let p = 0; p < ctx.numPlayers; p++) {
        const stage: CanBeUndefType<ActiveStageNames> = ctx.activePlayers?.[p];
        switch (ctx.phase) {
            case PhaseNames.Bids:
                moveName = CoinMoveNames.ClickHandCoinMove;
                break;
            case PhaseNames.BidUline:
                moveName = CoinMoveNames.ClickHandCoinUlineMove;
                break;
            default:
                if (stage === CommonStageNames.ClickCoinToUpgrade
                    || stage === SoloBotCommonCoinUpgradeStageNames.SoloBotClickCoinToUpgrade) {
                    let _exhaustiveCheck: never;
                    switch (G.mode) {
                        case GameModeNames.Basic:
                        case GameModeNames.Multiplayer:
                            moveName = CoinMoveNames.ClickCoinToUpgradeMove;
                            break;
                        case GameModeNames.Solo:
                            if (ctx.currentPlayer === PlayerIdForSoloGameNames.HumanPlayerId) {
                                moveName = CoinMoveNames.ClickCoinToUpgradeMove;
                            } else if (ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId) {
                                moveName = CoinMoveNames.SoloBotClickCoinToUpgradeMove;
                            } else {
                                return ThrowMyError({ G, ctx, ...rest },
                                    ErrorNames.CanNotBeMoreThenTwoPlayersInSoloGameMode);
                            }
                            break;
                        case GameModeNames.SoloAndvari:
                            if (ctx.currentPlayer === PlayerIdForSoloGameNames.HumanPlayerId) {
                                moveName = CoinMoveNames.ClickCoinToUpgradeMove;
                            }
                            break;
                        default:
                            _exhaustiveCheck = G.mode;
                            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchGameMode);
                            return _exhaustiveCheck;
                    }
                } else if (stage === TavernsResolutionStageNames.ClickHandTradingCoinUline) {
                    moveName = CoinMoveNames.ClickHandTradingCoinUlineMove;
                } else if (stage === CommonStageNames.PickConcreteCoinToUpgrade) {
                    moveName = CoinMoveNames.PickConcreteCoinToUpgradeMove;
                } else if (stage === CommonStageNames.AddCoinToPouch) {
                    moveName = CoinMoveNames.AddCoinToPouchMove;
                } else {
                    moveName = undefined;
                }
                break;
        }
        const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[p],
            privatePlayer: CanBeUndefType<PrivatePlayer> = G.players[p],
            playerCells: JSX.Element[] = [];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                p);
        }
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < 5; j++) {
                AssertPlayerCoinId(j);
                const publicHandCoin: PublicPlayerCoinType = player.handCoins[j],
                    privateHandCoin: CanBeUndefType<CoinType> = privatePlayer?.handCoins[j];
                if ((G.mode === GameModeNames.Multiplayer && privateHandCoin !== undefined
                    && IsCoin(privateHandCoin))
                    || (((G.mode === GameModeNames.Basic && Number(ctx.currentPlayer) === p)
                        || ((G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari)
                            && (p === 0 || ctx.phase === PhaseNames.ChooseDifficultySoloMode)))
                        && IsCoin(publicHandCoin))) {
                    let coinClasses: HandBorderedCoinCssClasses = CoinCssClassNames.BorderedCoin;
                    if (player.selectedCoin === j) {
                        coinClasses = CoinCssClassNames.BorderedCoinPicked;
                    }
                    const handCoin: PublicPlayerCoinType = privateHandCoin ?? publicHandCoin;
                    if (!IsCoin(handCoin)) {
                        throw new Error(`В массиве монет игрока в руке должна быть открыта монета с id '${j}'.`);
                    }
                    if (Number(ctx.currentPlayer) === p
                        && (ctx.phase === PhaseNames.Bids || ctx.phase === PhaseNames.BidUline
                            || (stage === TavernsResolutionStageNames.ClickHandTradingCoinUline)
                            || ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
                                && stage === CommonStageNames.AddCoinToPouch
                                && CheckPlayerHasBuff({ G, ctx, myPlayerID: String(p), ...rest },
                                    HeroBuffNames.EveryTurn)))) {
                        if (data !== undefined) {
                            DrawCoin({ G, ctx, ...rest }, data, playerCells, DrawCoinTypeNames.Coin,
                                handCoin, j, player, coinClasses, null, moveName,
                                j);
                        } else if (validatorName === BidsMoveValidatorNames.ClickHandCoinMoveValidator
                            || validatorName === BidUlineMoveValidatorNames.ClickHandCoinUlineMoveValidator
                            || validatorName ===
                            TavernsResolutionMoveValidatorNames.ClickHandTradingCoinUlineMoveValidator
                            || validatorName === CommonMoveValidatorNames.AddCoinToPouchMoveValidator) {
                            (moveMainArgs as MoveArgumentsType<number[]>).push(j);
                        } else {
                            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                        }
                    } else if ((((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
                        && Number(ctx.currentPlayer) === p
                        && CheckPlayerHasBuff({ G, ctx, myPlayerID: String(p), ...rest },
                            HeroBuffNames.EveryTurn))
                        || ((G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari)
                            && Number(ctx.currentPlayer) === p
                            && ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId
                            && ctx.phase === PhaseNames.ChooseDifficultySoloMode))
                        && (stage === CommonStageNames.ClickCoinToUpgrade
                            || stage === SoloBotCommonCoinUpgradeStageNames.SoloBotClickCoinToUpgrade
                            || (stage === CommonStageNames.PickConcreteCoinToUpgrade
                                && player.stack[0]?.coinValue === handCoin.value))) {
                        if (data !== undefined) {
                            DrawCoin({ G, ctx, ...rest }, data, playerCells, DrawCoinTypeNames.Coin,
                                handCoin, j, player, coinClasses, null, moveName,
                                j, CoinTypeNames.Hand);
                        } else if (validatorName === CommonMoveValidatorNames.ClickCoinToUpgradeMoveValidator
                            || validatorName ===
                            SoloBotCommonCoinUpgradeMoveValidatorNames.SoloBotClickCoinToUpgradeMoveValidator
                            || validatorName === CommonMoveValidatorNames.PickConcreteCoinToUpgradeMoveValidator) {
                            (moveMainArgs as MoveArgumentsType<MoveCoinsArguments[]>).push({
                                coinId: j,
                                type: CoinTypeNames.Hand,
                            });
                        } else {
                            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                        }
                    } else {
                        if (data !== undefined) {
                            DrawCoin({ G, ctx, ...rest }, data, playerCells, DrawCoinTypeNames.Coin,
                                handCoin, j, player, coinClasses);
                        }
                    }
                } else if (((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Solo
                    || G.mode === GameModeNames.SoloAndvari)
                    || (G.mode === GameModeNames.Multiplayer && privateHandCoin === undefined))
                    && IsCoin(publicHandCoin) && publicHandCoin.isOpened) {
                    if (data !== undefined) {
                        DrawCoin({ G, ctx, ...rest }, data, playerCells, DrawCoinTypeNames.HiddenCoin,
                            publicHandCoin, j, player, CoinCssClassNames.SmallCoinBG);
                    }
                } else {
                    // TODO Add Throw errors to all UI files
                    if (G.mode === GameModeNames.Basic && IsCoin(publicHandCoin) && !publicHandCoin.isOpened) {
                        if (data !== undefined) {
                            const handCoin: PublicPlayerCoinType = privateHandCoin ?? publicHandCoin;
                            if (!IsCoin(handCoin)) {
                                throw new Error(`В массиве монет игрока в руке должна быть открыта для текущего игрока с id '${p}' монета с id '${j}'.`);
                            }
                            DrawCoin({ G, ctx, ...rest }, data, playerCells, DrawCoinTypeNames.Back,
                                handCoin, j, player);
                        }
                    } else if ((G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari)
                        && p === 1 && !IsCoin(publicHandCoin) && publicHandCoin !== null) {
                        if (data !== undefined) {
                            DrawCoin({ G, ctx, ...rest }, data, playerCells, DrawCoinTypeNames.Back,
                                publicHandCoin, j, player);
                        } else if (validatorName === BidsMoveValidatorNames.SoloBotPlaceAllCoinsMoveValidator
                            || validatorName === BidsMoveValidatorNames.SoloBotAndvariPlaceAllCoinsMoveValidator) {
                            const moveMainArg: CanBeUndefType<MoveArgumentsType<number[]>> =
                                (moveMainArgs as MoveArgumentsType<number[][]>)[0];
                            if (moveMainArg === undefined) {
                                throw new Error(`В массиве аргументов мува отсутствует значение аргумента с id '0'.`);
                            }
                            moveMainArg.push(j);

                        } else {
                            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                        }
                    } else if (G.mode === GameModeNames.Multiplayer && privateHandCoin === undefined) {
                        if (data !== undefined) {
                            DrawCoin({ G, ctx, ...rest }, data, playerCells, DrawCoinTypeNames.Back, null,
                                j, player);
                        }
                    } else {
                        if (data !== undefined) {
                            // TODO Move empty coin to the DrawCoin or add DrawEmptyCoin?!
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
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionMustHaveReturnValue);
    }
};
