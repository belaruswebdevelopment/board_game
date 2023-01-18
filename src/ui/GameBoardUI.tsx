import { CountRoyalCoins } from "../Coin";
import { ALlStyles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { DrawBoard } from "../helpers/DrawHelpers";
import { tavernsConfig } from "../Tavern";
import { CardMoveNames, CardTypeRusNames, CommonMoveValidatorNames, CommonStageNames, ConfigNames, DistinctionCardMoveNames, DrawCoinTypeNames, ErrorNames, GameModeNames, PhaseNames, PhaseRusNames, SoloBotAndvariCommonMoveValidatorNames, SoloBotAndvariCommonStageNames, SoloBotCommonMoveValidatorNames, SoloBotCommonStageNames, StageRusNames, SuitNames, TavernsResolutionMoveValidatorNames, TavernsResolutionStageNames, TroopEvaluationMoveValidatorNames } from "../typescript/enums";
import type { ActiveStageNames, AllCoinsValueType, BoardProps, CampCardArray, CampCardType, CanBeNullType, CanBeUndefType, DiscardDeckCardType, DrawBoardOptions, DrawProfitType, FnContext, HeroCard, HeroesForSoloGameArrayType, IndexOf, MoveArgumentsType, MoveValidatorNamesTypes, NumberValues, PublicPlayer, RoyalCoin, StageNameTextType, TavernAllCardType, TavernCardType, TavernInConfig, TavernsConfigType, TierType, ZeroOrOneOrTwoType } from "../typescript/interfaces";
import { DrawCard, DrawCoin, DrawDistinctionCard, DrawSuit } from "./ElementsUI";
import { ActivateGiantAbilityOrPickCardProfit, ActivateGodAbilityOrNotProfit, ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit, ChooseDifficultyLevelForSoloModeProfit, ChooseGetMythologyCardProfit, ChooseStrategyForSoloModeAndvariProfit, ChooseStrategyVariantForSoloModeAndvariProfit, ExplorerDistinctionProfit, PickHeroesForSoloModeProfit, StartOrPassEnlistmentMercenariesProfit } from "./ProfitUI";

// TODO Check Solo Bot & multiplayer actions!
/**
 * <h3>Отрисовка карт лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле лагеря | данные для списка доступных аргументов мува.
 */
export const DrawCamp = ({ G, ctx, ...rest }: FnContext, validatorName: CanBeNullType<MoveValidatorNamesTypes>,
    data?: BoardProps): JSX.Element | MoveArgumentsType<number[]> => {
    const boardCells: JSX.Element[] = [],
        moveMainArgs: MoveArgumentsType<number[]> = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < G.campNum; j++) {
            const campCard: CampCardType = G.camp[j as IndexOf<CampCardArray>];
            if (campCard === null) {
                if (data !== undefined) {
                    boardCells.push(
                        <td className="bg-yellow-200" key={`Camp ${j} icon`}>
                            <span style={ALlStyles.Camp()} className="bg-camp-icon"></span>
                        </td>
                    );
                }
            } else {
                const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                        ctx.currentPlayer);
                }
                let suit: CanBeNullType<SuitNames> = null;
                if (campCard.type === CardTypeRusNames.ArtefactCard) {
                    suit = campCard.playerSuit;
                }
                if ((ctx.phase === PhaseNames.TavernsResolution && ctx.activePlayers === null)
                    || (ctx.activePlayers?.[Number(ctx.currentPlayer)] ===
                        CommonStageNames.ClickCampCardHolda)) {
                    if (data !== undefined) {
                        const stage: CanBeUndefType<ActiveStageNames> =
                            ctx.activePlayers?.[Number(ctx.currentPlayer)];
                        let moveName: CardMoveNames;
                        switch (stage) {
                            case CommonStageNames.ClickCampCardHolda:
                                moveName = CardMoveNames.ClickCampCardHoldaMove;
                                break;
                            case undefined:
                                if (ctx.activePlayers === null) {
                                    moveName = CardMoveNames.ClickCampCardMove;
                                    break;
                                } else {
                                    throw new Error(`Не может не быть доступного мува.`);
                                }
                            default:
                                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
                        }
                        DrawCard({ G, ctx, ...rest }, data, boardCells, campCard, j, player,
                            suit, moveName, j);
                    } else if (validatorName === TavernsResolutionMoveValidatorNames.ClickCampCardMoveValidator
                        || validatorName === CommonMoveValidatorNames.ClickCampCardHoldaMoveValidator) {
                        moveMainArgs.push(j);
                    } else {
                        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                    }
                } else {
                    if (data !== undefined) {
                        DrawCard({ G, ctx, ...rest }, data, boardCells, campCard, j, player,
                            suit);
                    }
                }
            }
        }
    }
    if (data !== undefined) {
        const tier: TierType = G.campDecksLength.length - G.tierToEnd + 1 > G.campDecksLength.length ?
            1 : G.campDecksLength.length - G.tierToEnd as TierType;
        return (
            <table>
                <caption>
                    <span style={ALlStyles.Camp()} className="bg-top-camp-icon"></span>
                    <span><span style={ALlStyles.CampBack(tier)}
                        className="bg-top-card-back-icon"></span>Camp
                        ({G.campDecksLength[G.campDecksLength.length - G.tierToEnd] ?? 0}
                        {(G.campDecksLength.length - G.tierToEnd === 0 ? `/` +
                            (G.campDecksLength[0] + G.campDecksLength[1]) : ``)} cards)
                    </span>
                </caption>
                <tbody>
                    <tr>{boardCells}</tr>
                </tbody>
            </table>
        );
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionMustHaveReturnValue);
    }
};

/**
 * <h3>Отрисовка фазы и стадии игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка фазы и стадии игры на игровом поле.</li>
 * </ol>
 *
 * @param context
 * @returns Поле информации о текущей фазе и стадии игры.
 */
export const DrawCurrentPhaseStage = ({ ctx }: FnContext): JSX.Element => {
    const stage: CanBeUndefType<ActiveStageNames> = ctx.activePlayers?.[Number(ctx.currentPlayer)],
        stageText: StageNameTextType = stage !== undefined ? StageRusNames[stage] : `none`;
    return (
        <b>Phase: <span className="italic">{PhaseRusNames[ctx.phase] ?? `none`}</span>
            (Stage: <span className="italic">{stageText}</span>)</b>
    );
};

/**
 * <h3>Отрисовка игровой информации о текущем игроке и текущем ходе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @returns Поле информации о текущем ходу.
 */
export const DrawCurrentPlayerTurn = ({ ctx }: FnContext): JSX.Element => (
    <b><span className="italic">Player {Number(ctx.currentPlayer) + 1}</span> |
        Turn: <span className="italic">{ctx.turn}</span></b>
);

/**
 * <h3>Отрисовка преимуществ по фракциям в конце эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле преимуществ в конце эпохи.
 */
export const DrawDistinctions = ({ G, ctx, ...rest }: FnContext, validatorName: CanBeNullType<MoveValidatorNamesTypes>,
    data?: BoardProps): JSX.Element | MoveArgumentsType<SuitNames[]> => {
    const boardCells: JSX.Element[] = [],
        moveMainArgs: MoveArgumentsType<SuitNames[]> = [],
        player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            ctx.currentPlayer);
    }
    for (let i = 0; i < 1; i++) {
        let suit: SuitNames,
            currentDistinctionSuit: CanBeUndefType<SuitNames>;
        for (suit in G.distinctions) {
            if (G.distinctions[suit] !== undefined) {
                currentDistinctionSuit = suit;
                break;
            }
        }
        for (suit in suitsConfig) {
            if (ctx.phase === PhaseNames.TroopEvaluation && ctx.activePlayers === null
                && G.distinctions[suit] === ctx.currentPlayer && currentDistinctionSuit === suit) {
                if (data !== undefined) {
                    DrawDistinctionCard({ G, ctx, ...rest }, data, boardCells, player, suit,
                        DistinctionCardMoveNames.ClickDistinctionCardMove, suit);
                } else if (validatorName === TroopEvaluationMoveValidatorNames.ClickDistinctionCardMoveValidator) {
                    moveMainArgs.push(suit);
                } else {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                }
            } else {
                if (data !== undefined) {
                    DrawDistinctionCard({ G, ctx, ...rest }, data, boardCells, null, suit);
                }
            }
        }
    }
    if (data !== undefined) {
        return (
            <table>
                <caption>
                    <span style={ALlStyles.DistinctionsBack()} className="bg-top-distinctions-icon"></span>
                    <span>Distinctions</span>
                </caption>
                <tbody>
                    <tr>{boardCells}</tr>
                </tbody>
            </table>
        );
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionMustHaveReturnValue);
    }
};

/**
 * <h3>Отрисовка колоды сброса карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле колоды сброса карт.
 */
export const DrawDiscardedCards = ({ G, ctx, ...rest }: FnContext,
    validatorName: CanBeNullType<MoveValidatorNamesTypes>, data?: BoardProps):
    JSX.Element | MoveArgumentsType<number[]> => {
    const boardCells: JSX.Element[] = [],
        moveMainArgs: MoveArgumentsType<number[]> = [],
        player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            ctx.currentPlayer);
    }
    for (let j = 0; j < G.discardCardsDeck.length; j++) {
        const card: CanBeUndefType<DiscardDeckCardType> = G.discardCardsDeck[j];
        if (card === undefined) {
            throw new Error(`В массиве колоды сброса карт отсутствует карта с id '${j}'.`);
        }
        let suit: CanBeNullType<SuitNames> = null;
        if (card.type === CardTypeRusNames.DwarfCard) {
            suit = card.playerSuit;
        } else if (card.type === CardTypeRusNames.DwarfPlayerCard) {
            suit = card.suit;
        }
        if (ctx.activePlayers?.[Number(ctx.currentPlayer)] === CommonStageNames.PickDiscardCard) {
            if (data !== undefined) {
                DrawCard({ G, ctx, ...rest }, data, boardCells, card, j, player, suit,
                    CardMoveNames.PickDiscardCardMove, j);
            } else if (validatorName === CommonMoveValidatorNames.PickDiscardCardMoveValidator) {
                moveMainArgs.push(j);
            } else {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
            }
        } else {
            if (data !== undefined) {
                DrawCard({ G, ctx, ...rest }, data, boardCells, card, j, null, suit);
            }
        }
    }
    if (data !== undefined) {
        return (
            <table>
                <caption className="whitespace-nowrap">
                    <span style={ALlStyles.CardBack(0)} className="bg-top-card-back-icon"></span>
                    <span style={ALlStyles.CardBack(1)} className="bg-top-card-back-icon"></span>
                    <span>Discard cards ({G.discardCardsDeck.length} cards)</span>
                </caption>
                <tbody>
                    <tr>{boardCells}</tr>
                </tbody>
            </table>
        );
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionMustHaveReturnValue);
    }
};

/**
 * <h3>Отрисовка всех героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле героев.
 */
export const DrawHeroes = ({ G, ctx, ...rest }: FnContext, validatorName: CanBeNullType<MoveValidatorNamesTypes>,
    data?: BoardProps): JSX.Element | MoveArgumentsType<number[]> => {
    const boardRows: JSX.Element[] = [],
        drawData: DrawBoardOptions = DrawBoard(G.heroes.length),
        moveMainArgs: MoveArgumentsType<number[]> = [];
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells: JSX.Element[] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment: number = i * drawData.boardCols + j,
                hero: CanBeUndefType<HeroCard> = G.heroes[increment];
            if (hero === undefined) {
                throw new Error(`В массиве карт героев отсутствует герой с id '${increment}'.`);
            }
            const suit: CanBeNullType<SuitNames> = hero.playerSuit;
            if (hero.active
                && ctx.activePlayers?.[Number(ctx.currentPlayer)] === CommonStageNames.ClickHeroCard) {
                const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                        ctx.currentPlayer);
                }
                if (data !== undefined) {
                    const stage: CanBeUndefType<ActiveStageNames> =
                        ctx.activePlayers?.[Number(ctx.currentPlayer)];
                    let moveName: CardMoveNames;
                    switch (stage) {
                        case CommonStageNames.ClickHeroCard:
                            moveName = CardMoveNames.ClickHeroCardMove;
                            break;
                        case SoloBotAndvariCommonStageNames.SoloBotAndvariClickHeroCard:
                            moveName = CardMoveNames.SoloBotAndvariClickHeroCardMove;
                            break;
                        default:
                            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
                    }
                    DrawCard({ G, ctx, ...rest }, data, boardCells, hero, increment, player,
                        suit, moveName, increment);
                } else if ((validatorName === CommonMoveValidatorNames.ClickHeroCardMoveValidator
                    || validatorName ===
                    SoloBotAndvariCommonMoveValidatorNames.SoloBotAndvariClickHeroCardMoveValidator) && hero.active) {
                    moveMainArgs.push(increment);
                } else {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                }
            } else {
                if (data !== undefined) {
                    DrawCard({ G, ctx, ...rest }, data, boardCells, hero, increment,
                        null, suit);
                }
            }
            if (increment + 1 === G.heroes.length) {
                break;
            }
        }
        if (data !== undefined) {
            boardRows.push(
                <tr key={`Heroes row ${i}`}>{boardCells}</tr>
            );
        }
    }
    if (data !== undefined) {
        return (
            <table>
                <caption>
                    <span style={ALlStyles.HeroBack()} className="bg-top-hero-icon"></span>
                    <span>Heroes ({G.heroes.length} cards)</span>
                </caption>
                <tbody>
                    {boardRows}
                </tbody>
            </table>
        );
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionMustHaveReturnValue);
    }
};

/**
 * <h3>Отрисовка всех героев для выбора соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле героев для соло бота.
 */
export const DrawHeroesForSoloBotUI = ({ G, ctx, ...rest }: FnContext,
    validatorName: CanBeNullType<MoveValidatorNamesTypes>, data?: BoardProps):
    JSX.Element | MoveArgumentsType<number[]> => {
    if (G.heroesForSoloBot === null) {
        throw new Error(`В массиве карт героев для соло бота не может не быть героев.`);
    }
    const boardCells: JSX.Element[] = [],
        moveMainArgs: MoveArgumentsType<number[]> = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < G.heroesForSoloBot.length; j++) {
            const hero: HeroCard = G.heroesForSoloBot[j as IndexOf<HeroesForSoloGameArrayType>];
            if (hero.active && Number(ctx.currentPlayer) === 1
                && ctx.activePlayers?.[Number(ctx.currentPlayer)] ===
                SoloBotCommonStageNames.SoloBotClickHeroCard) {
                const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                        ctx.currentPlayer);
                }
                if (data !== undefined) {
                    DrawCard({ G, ctx, ...rest }, data, boardCells, hero, j, player, null,
                        CardMoveNames.SoloBotClickHeroCardMove, j);
                } else if (validatorName === SoloBotCommonMoveValidatorNames.SoloBotClickHeroCardMoveValidator) {
                    if (hero.active) {
                        moveMainArgs.push(j);
                    }
                } else {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                }
            } else {
                if (data !== undefined) {
                    DrawCard({ G, ctx, ...rest }, data, boardCells, hero, j, null,
                        null);
                }
            }
        }
    }
    if (data !== undefined) {
        return (
            <table>
                <caption>
                    <span style={ALlStyles.HeroBack()} className="bg-top-hero-icon"></span>
                    <span>Bot heroes ({G.heroesForSoloBot.length} cards)</span>
                </caption>
                <tbody>
                    <tr key={`Heroes row 0`}>{boardCells}</tr>
                </tbody>
            </table>
        );
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionMustHaveReturnValue);
    }
};

/**
 * <h3>Отрисовка рынка монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param data Глобальные параметры.
 * @returns Поле рынка монет.
 */
export const DrawMarketCoins = ({ G, ctx, ...rest }: FnContext, data: BoardProps): JSX.Element => {
    const boardRows: JSX.Element[] = [],
        drawData: DrawBoardOptions = DrawBoard(G.royalCoinsUnique.length),
        countMarketCoins: NumberValues = CountRoyalCoins({ G, ctx, ...rest });
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells: JSX.Element[] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment: number = i * drawData.boardCols + j,
                royalCoin: CanBeUndefType<RoyalCoin> = G.royalCoinsUnique[increment];
            if (royalCoin === undefined) {
                throw new Error(`В массиве монет рынка героев отсутствует монета с id '${increment}'.`);
            }
            const tempCoinValue: AllCoinsValueType = royalCoin.value,
                coinClassName: string = countMarketCoins[tempCoinValue] === 0 ? `text-red-500` : `text-blue-500`;
            DrawCoin({ G, ctx, ...rest }, data, boardCells, DrawCoinTypeNames.Market,
                royalCoin, increment, null, coinClassName,
                countMarketCoins[tempCoinValue]);
            if (increment + 1 === G.royalCoinsUnique.length) {
                break;
            }
        }
        boardRows.push(
            <tr key={`Market coins row ${i}`}>{boardCells}</tr>
        );
    }
    return (
        <table>
            <caption>
                <span className="block">
                    <span style={ALlStyles.Exchange()} className="bg-top-market-coin-icon"></span>
                    Market coins ({G.royalCoins.length} coins)</span>
            </caption>
            <tbody>
                {boardRows}
            </tbody>
        </table>
    );
};

/**
 * <h3>Отрисовка профита от карт и героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param data Глобальные параметры.
 * @returns Поле профита.
 */
export const DrawProfit = ({ G, ctx, ...rest }: FnContext, data: BoardProps): JSX.Element => {
    const boardCells: JSX.Element[] = [],
        player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            ctx.currentPlayer);
    }
    const option: DrawProfitType = G.drawProfit;
    let caption = ``,
        _exhaustiveCheck: never;
    switch (option) {
        case ConfigNames.ActivateGiantAbilityOrPickCard:
            caption += `Activate Giant ability or pick dwarf card.`;
            ActivateGiantAbilityOrPickCardProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case ConfigNames.ActivateGodAbilityOrNot:
            caption += `Activate God ability or not.`;
            ActivateGodAbilityOrNotProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case ConfigNames.ChooseGetMythologyCard:
            caption += `Get Mythology card.`;
            ChooseGetMythologyCardProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade:
            caption += `Get value of coin upgrade.`;
            ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit({ G, ctx, ...rest }, null, data,
                boardCells);
            break;
        case ConfigNames.ExplorerDistinction:
            caption += `Get one card to your board.`;
            ExplorerDistinctionProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case ConfigNames.GetDifficultyLevelForSoloMode:
            caption += `Get difficulty level for Solo mode.`;
            ChooseDifficultyLevelForSoloModeProfit({ G, ctx, ...rest }, null, data,
                boardCells);
            break;
        case ConfigNames.ChooseStrategyLevelForSoloModeAndvari:
            caption += `Get strategy level for Solo mode Andvari.`;
            ChooseStrategyForSoloModeAndvariProfit({ G, ctx, ...rest }, null, data,
                boardCells);
            break;
        case ConfigNames.ChooseStrategyVariantLevelForSoloModeAndvari:
            caption += `Get strategy variant level for Solo mode Andvari.`;
            ChooseStrategyVariantForSoloModeAndvariProfit({ G, ctx, ...rest }, null,
                data, boardCells);
            break;
        case ConfigNames.GetHeroesForSoloMode:
            caption += `Get ${G.soloGameDifficultyLevel} hero${G.soloGameDifficultyLevel === 1 ? `` : `es`} to Solo Bot.`;
            PickHeroesForSoloModeProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case ConfigNames.StartOrPassEnlistmentMercenaries:
            caption = `Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.`;
            StartOrPassEnlistmentMercenariesProfit({ G, ctx, ...rest }, null, data, boardCells);
            break;
        case null:
            throw new Error(`Не задан обязательный параметр '${option}'.`);
        default:
            _exhaustiveCheck = option;
            throw new Error(`Не существует обязательный параметр 'drawProfit'.`);
            return _exhaustiveCheck;
    }
    return (
        <table>
            <caption>
                <span style={ALlStyles.DistinctionsBack()} className="bg-top-distinctions-icon"></span>
                <span>{caption}</span>
            </caption>
            <tbody>
                <tr>{boardCells}</tr>
            </tbody>
        </table>
    );
};

/**
 * <h3>Отрисовка стратегий соло бота Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param data Глобальные параметры.
 * @returns Поле стратегий соло бота Андвари.
 */
export const DrawStrategyForSoloBotAndvariUI = ({ G, ctx, ...rest }: FnContext, data: BoardProps): JSX.Element => {
    if (G.soloGameAndvariStrategyVariantLevel === null) {
        throw new Error(`Не задан вариант уровня сложности для стратегий соло бота Андвари в соло игре.`);
    }
    const playerHeadersGeneral: JSX.Element[] = [],
        playerHeadersReserve: JSX.Element[] = [];
    for (let i = 0; i < G.soloGameAndvariStrategyVariantLevel; i++) {
        const suit: CanBeUndefType<SuitNames> =
            G.strategyForSoloBotAndvari.general[i as ZeroOrOneOrTwoType];
        if (suit === undefined) {
            throw new Error(`В объекте общих стратегий соло бота Андвари отсутствует фракция с id '${i}'.`);
        }
        DrawSuit({ G, ctx, ...rest }, data, playerHeadersGeneral, suit);
    }
    for (let i = G.soloGameAndvariStrategyVariantLevel; i < 5; i++) {
        const suit: CanBeUndefType<SuitNames> = G.strategyForSoloBotAndvari.reserve[i];
        if (suit === undefined) {
            throw new Error(`В объекте резервных стратегий соло бота Андвари отсутствует фракция с id '${i}'.`);
        }
        DrawSuit({ G, ctx, ...rest }, data, playerHeadersReserve, suit);
    }
    // TODO Add different colors or dividers for different strategies and draw their names!
    return (
        <table>
            <caption>
                <span style={ALlStyles.HeroBack()} className="bg-top-hero-icon"></span>
                <span>Bot strategy</span>
            </caption>
            <tbody>
                <tr key={`Strategy general`}>{playerHeadersGeneral}</tr>
                <tr key={`Strategy reserve`}>{playerHeadersReserve}</tr>
            </tbody>
        </table>
    );
};

/**
 * <h3>Отрисовка карт таверн.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param gridClass Класс для отрисовки таверны.
 * @returns Поле таверн.
 */
export const DrawTaverns = ({ G, ctx, ...rest }: FnContext,
    validatorName: CanBeNullType<MoveValidatorNamesTypes>, data?: BoardProps, gridClass?: string):
    JSX.Element[] | MoveArgumentsType<number[]> => {
    const tavernsBoards: JSX.Element[] = [],
        moveMainArgs: MoveArgumentsType<number[]> = [];
    for (let t = 0; t < G.tavernsNum; t++) {
        const currentTavernConfig: TavernInConfig = tavernsConfig[t as IndexOf<TavernsConfigType>];
        for (let i = 0; i < 1; i++) {
            const boardCells: JSX.Element[] = [];
            for (let j = 0; j < G.drawSize; j++) {
                const tavern: TavernAllCardType = G.taverns[t as IndexOf<TavernsConfigType>],
                    tavernCard: CanBeUndefType<TavernCardType> = tavern[j];
                if (G.round !== -1 && tavernCard === undefined) {
                    throw new Error(`В массиве карт таверны с id '${t}' отсутствует карта с id '${j}'.`);
                }
                if (tavernCard === undefined || tavernCard === null) {
                    if (data !== undefined) {
                        boardCells.push(
                            <td key={`${currentTavernConfig.name} ${j}`}>
                                <span style={ALlStyles.Tavern(t as IndexOf<TavernsConfigType>)}
                                    className="bg-tavern-icon"></span>
                            </td>
                        );
                    }
                } else {
                    let suit: CanBeNullType<SuitNames> = null;
                    if (`playerSuit` in tavernCard) {
                        suit = tavernCard.playerSuit;
                    }
                    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                    if (player === undefined) {
                        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                            ctx.currentPlayer);
                    }
                    if (t === G.currentTavern && ctx.phase === PhaseNames.TavernsResolution
                        && ((ctx.activePlayers === null)
                            || (ctx.activePlayers?.[Number(ctx.currentPlayer)]
                                === TavernsResolutionStageNames.DiscardCard2Players))) {
                        if (data !== undefined) {
                            const stage: CanBeUndefType<ActiveStageNames> =
                                ctx.activePlayers?.[Number(ctx.currentPlayer)];
                            let moveName: CardMoveNames,
                                _exhaustiveCheck: never;
                            switch (stage) {
                                case TavernsResolutionStageNames.DiscardCard2Players:
                                    moveName = CardMoveNames.DiscardCard2PlayersMove;
                                    break;
                                case undefined:
                                    if (ctx.activePlayers === null) {
                                        switch (G.mode) {
                                            case GameModeNames.Basic:
                                            case GameModeNames.Multiplayer:
                                                moveName = CardMoveNames.ClickCardMove;
                                                break;
                                            case GameModeNames.Solo:
                                                if (ctx.currentPlayer === `0`) {
                                                    moveName = CardMoveNames.ClickCardMove;
                                                } else if (ctx.currentPlayer === `1`) {
                                                    moveName = CardMoveNames.SoloBotClickCardMove;
                                                } else {
                                                    return ThrowMyError({ G, ctx, ...rest },
                                                        ErrorNames.CanNotBeMoreThenTwoPlayersInSoloGameMode);
                                                }
                                                break;
                                            case GameModeNames.SoloAndvari:
                                                if (ctx.currentPlayer === `0`) {
                                                    moveName = CardMoveNames.ClickCardMove;
                                                } else if (ctx.currentPlayer === `1`) {
                                                    moveName = CardMoveNames.SoloBotAndvariClickCardMove;
                                                } else {
                                                    return ThrowMyError({ G, ctx, ...rest },
                                                        ErrorNames.CanNotBeMoreThenTwoPlayersInSoloGameMode);
                                                }
                                                break;
                                            default:
                                                _exhaustiveCheck = G.mode;
                                                return ThrowMyError({ G, ctx, ...rest },
                                                    ErrorNames.NoSuchGameMode);
                                                return _exhaustiveCheck;
                                        }
                                    } else {
                                        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
                                    }
                                    break;
                                default:
                                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
                            }
                            DrawCard({ G, ctx, ...rest }, data, boardCells, tavernCard, j,
                                player, suit, moveName, j);
                        } else if (validatorName === TavernsResolutionMoveValidatorNames.ClickCardMoveValidator
                            || validatorName === TavernsResolutionMoveValidatorNames.SoloBotClickCardMoveValidator
                            || validatorName ===
                            TavernsResolutionMoveValidatorNames.SoloBotAndvariClickCardMoveValidator
                            || validatorName === TavernsResolutionMoveValidatorNames.DiscardCard2PlayersMoveValidator) {
                            moveMainArgs.push(j);
                        } else {
                            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoAddedValidator);
                        }
                    } else {
                        if (data !== undefined) {
                            DrawCard({ G, ctx, ...rest }, data, boardCells, tavernCard, j,
                                null, suit);
                        }
                    }
                }
            }
            if (data !== undefined) {
                tavernsBoards.push(
                    <table className={`${gridClass} justify-self-center`}
                        key={`Tavern ${currentTavernConfig.name} board`}>
                        <caption className="whitespace-nowrap">
                            <span style={ALlStyles.Tavern(t as IndexOf<TavernsConfigType>)}
                                className="bg-top-tavern-icon"></span>
                            <b>{currentTavernConfig.name}</b>
                        </caption>
                        <tbody>
                            <tr>{boardCells}</tr>
                        </tbody>
                    </table>
                );
            }
        }
    }
    if (data !== undefined) {
        return tavernsBoards;
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionMustHaveReturnValue);
    }
};

/**
 * <h3>Отрисовка игровой информации о текущей эпохе и количестве карт в деках.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @returns Поле информации о количестве карт по эпохам.
 */
export const DrawTierCards = ({ G }: FnContext): JSX.Element => {
    return (
        <b>Tier: <span className="italic">
            {G.decksLength.length - G.tierToEnd + 1 > G.decksLength.length ? G.decksLength.length :
                G.decksLength.length - G.tierToEnd + 1}/{G.decksLength.length}
            ({G.decksLength[G.decksLength.length - G.tierToEnd] ?? 0}{G.decksLength.length - G.tierToEnd === 0 ? `/`
                + (G.decksLength[0] + G.decksLength[1]) : ``} cards)
        </span></b>
    );
};

/**
 * <h3>Отрисовка игровой информации о текущем статусе игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param context
 * @returns Поле информации о ходе/победителях игры.
 */
export const DrawWinner = ({ G, ctx }: FnContext): JSX.Element => {
    let winner: string;
    if (ctx.gameover !== undefined) {
        if (G.winner !== undefined) {
            if (G.winner.length === 1) {
                const winnerIndex: CanBeUndefType<number> = G.winner[0];
                if (winnerIndex === undefined) {
                    throw new Error(`Отсутствует индекс игрока победителя.`);
                }
                const winnerPlayer = G.publicPlayers[winnerIndex];
                if (winnerPlayer === undefined) {
                    throw new Error(`Отсутствует игрок победитель с id '${winnerIndex}'.`);
                }
                winner = `Winner: Player ${winnerPlayer.nickname}`;
            } else {
                winner = "Winners: ";
                G.winner.forEach((playerId: number, index: number): void => {
                    const winnerPlayerI: CanBeUndefType<PublicPlayer> = G.publicPlayers[playerId];
                    if (winnerPlayerI === undefined) {
                        throw new Error(`Отсутствует игрок победитель с id '${playerId}'.`);
                    }
                    winner += `${index + 1}) Player '${winnerPlayerI.nickname}'; `;
                });
            }
        } else {
            winner = `Draw!`;
        }
    } else {
        winner = `Game is started`;
    }
    return (
        <b>Game status: <span className="italic">{winner.trim()}</span></b>
    );
};
