import { CountMarketCoins } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { DrawBoard } from "../helpers/DrawHelpers";
import { tavernsConfig } from "../Tavern";
import { CardMoveNames, ConfigNames, ErrorNames, GameModeNames, MoveValidatorNames, PhaseNames, RusCardTypeNames, RusPhaseNames, RusStageNames, StageNames } from "../typescript/enums";
import type { BoardProps, CampCardType, CanBeNullType, CanBeUndefType, Ctx, DiscardDeckCardType, DrawProfitType, HeroesForSoloGameArrayType, ICoin, IDrawBoardOptions, IHeroCard, IMyGameState, IndexOf, INumberValues, IPublicPlayer, ITavernInConfig, MoveArgumentsType, StageNameTextType, SuitNamesKeyofTypeofType, TavernAllCardType, TavernCardType, TavernsConfigType, TierType, ZeroOrOneOrTwoType } from "../typescript/interfaces";
import { DrawCard, DrawCoin, DrawSuit } from "./ElementsUI";
import { ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit, ChooseDifficultyLevelForSoloModeProfit, ChooseStrategyForSoloModeAndvariProfit, ChooseStrategyVariantForSoloModeAndvariProfit, ExplorerDistinctionProfit, PickHeroesForSoloModeProfit, StartEnlistmentMercenariesProfit } from "./ProfitUI";

// TODO Check Solo Bot & multiplayer actions!
/**
 * <h3>Отрисовка карт лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле лагеря | данные для списка доступных аргументов мува.
 */
export const DrawCamp = (G: IMyGameState, ctx: Ctx, validatorName: CanBeNullType<MoveValidatorNames>,
    data?: BoardProps<IMyGameState>): JSX.Element | MoveArgumentsType<number[]> => {
    const boardCells: JSX.Element[] = [],
        moveMainArgs: MoveArgumentsType<number[]> = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < G.campNum; j++) {
            const campCard: CanBeUndefType<CampCardType> = G.camp[j];
            if (campCard === undefined) {
                throw new Error(`В массиве карт лагеря отсутствует карта с id '${j}'.`);
            }
            if (campCard === null) {
                if (data !== undefined) {
                    boardCells.push(
                        <td className="bg-yellow-200" key={`Camp ${j} icon`}>
                            <span style={Styles.Camp()} className="bg-camp-icon"></span>
                        </td>
                    );
                }
            } else {
                const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                        ctx.currentPlayer);
                }
                let suit: CanBeNullType<SuitNamesKeyofTypeofType> = null;
                if (campCard.type === RusCardTypeNames.Artefact_Player_Card) {
                    suit = campCard.suit;
                }
                if ((ctx.phase === PhaseNames.TavernsResolution && ctx.activePlayers === null)
                    || (ctx.activePlayers?.[Number(ctx.currentPlayer)] === StageNames.pickCampCardHolda)) {
                    if (data !== undefined) {
                        const stage: CanBeUndefType<StageNames> = ctx.activePlayers?.[Number(ctx.currentPlayer)];
                        let moveName: CardMoveNames;
                        switch (stage) {
                            case StageNames.pickCampCardHolda:
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
                                throw new Error(`Нет такого мува.`);
                        }
                        DrawCard(data, boardCells, campCard, j, player, suit, moveName,
                            j);
                    } else if (validatorName === MoveValidatorNames.ClickCampCardMoveValidator
                        || validatorName === MoveValidatorNames.ClickCampCardHoldaMoveValidator) {
                        moveMainArgs.push(j);
                    } else {
                        throw new Error(`Не добавлен валидатор '${validatorName}'.`);
                    }
                } else {
                    if (data !== undefined) {
                        DrawCard(data, boardCells, campCard, j, player, suit);
                    }
                }
            }
        }
    }
    if (data !== undefined) {
        const tier: TierType = G.campDeckLength.length - G.tierToEnd + 1 > G.campDeckLength.length ?
            1 : G.campDeckLength.length - G.tierToEnd as TierType;
        return (
            <table>
                <caption>
                    <span style={Styles.Camp()} className="bg-top-camp-icon"></span>
                    <span><span style={Styles.CampBack(tier)}
                        className="bg-top-card-back-icon"></span>Camp
                        ({G.campDeckLength[G.campDeckLength.length - G.tierToEnd] ?? 0}
                        {(G.campDeckLength.length - G.tierToEnd === 0 ? `/` +
                            (G.campDeckLength[0] + G.campDeckLength[1]) : ``)} cards)
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
        throw new Error(`Функция должна возвращать значение.`);
    }
};

/**
 * <h3>Отрисовка фазы и стадии игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка фазы и стадии игры на игровом поле.</li>
 * </ol>
 *
 * @param ctx
 * @returns Поле информации о текущей фазе и стадии игры.
 */
export const DrawCurrentPhaseStage = (ctx: Ctx): JSX.Element => {
    const stage: CanBeUndefType<StageNames> = ctx.activePlayers?.[Number(ctx.currentPlayer)],
        stageText: StageNameTextType = stage !== undefined ? RusStageNames[stage] : `none`;
    return (
        <b>Phase: <span className="italic">{RusPhaseNames[ctx.phase] ?? `none`}</span>
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
 * @param ctx
 * @returns Поле информации о текущем ходу.
 */
export const DrawCurrentPlayerTurn = (ctx: Ctx): JSX.Element => (
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
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле преимуществ в конце эпохи.
 */
export const DrawDistinctions = (G: IMyGameState, ctx: Ctx, validatorName: CanBeNullType<MoveValidatorNames>,
    data?: BoardProps<IMyGameState>): JSX.Element | MoveArgumentsType<SuitNamesKeyofTypeofType[]> => {
    const boardCells: JSX.Element[] = [],
        moveMainArgs: MoveArgumentsType<SuitNamesKeyofTypeofType[]> = [];
    for (let i = 0; i < 1; i++) {
        let suit: SuitNamesKeyofTypeofType,
            currentDistinctionSuit: CanBeUndefType<SuitNamesKeyofTypeofType>;
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
                    // TODO Move to DrawDistinction?
                    boardCells.push(
                        <td className="bg-green-500 cursor-pointer" key={`Distinction ${suit} card`}
                            onClick={() => data.moves.ClickDistinctionCardMove?.(suit)}
                            title={suitsConfig[suit].distinction.description}>
                            <span style={Styles.Distinction(suit)}
                                className="bg-suit-distinction"></span>
                        </td>
                    );
                } else if (validatorName === MoveValidatorNames.ClickDistinctionCardMoveValidator) {
                    moveMainArgs.push(suit);
                } else {
                    throw new Error(`Не добавлен валидатор '${validatorName}'.`);
                }
            } else {
                if (data !== undefined) {
                    // TODO Move to DrawDistinction?
                    boardCells.push(
                        <td className="bg-green-500" key={`Distinction ${suit} card`}
                            title={suitsConfig[suit].distinction.description}>
                            <span style={Styles.Distinction(suit)}
                                className="bg-suit-distinction"></span>
                        </td>
                    );
                }
            }
        }
    }
    if (data !== undefined) {
        return (
            <table>
                <caption>
                    <span style={Styles.DistinctionsBack()} className="bg-top-distinctions-icon"></span>
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
        throw new Error(`Функция должна возвращать значение.`);
    }
};

/**
 * <h3>Отрисовка колоды сброса карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле колоды сброса карт.
 */
export const DrawDiscardedCards = (G: IMyGameState, ctx: Ctx, validatorName: CanBeNullType<MoveValidatorNames>,
    data?: BoardProps<IMyGameState>): JSX.Element | MoveArgumentsType<number[]> => {
    const boardCells: JSX.Element[] = [],
        moveMainArgs: MoveArgumentsType<number[]> = [];
    for (let j = 0; j < G.discardCardsDeck.length; j++) {
        const card: CanBeUndefType<DiscardDeckCardType> = G.discardCardsDeck[j];
        if (card === undefined) {
            throw new Error(`В массиве колоды сброса карт отсутствует карта с id '${j}'.`);
        }
        let suit: CanBeNullType<SuitNamesKeyofTypeofType> = null;
        if (card.type === RusCardTypeNames.Dwarf_Card) {
            suit = card.suit;
        }
        if (ctx.activePlayers?.[Number(ctx.currentPlayer)] === StageNames.pickDiscardCard) {
            const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                    ctx.currentPlayer);
            }
            if (data !== undefined) {
                DrawCard(data, boardCells, card, j, player, suit,
                    CardMoveNames.PickDiscardCardMove, j);
            } else if (validatorName === MoveValidatorNames.PickDiscardCardMoveValidator) {
                moveMainArgs.push(j);
            } else {
                throw new Error(`Не добавлен валидатор '${validatorName}'.`);
            }
        } else {
            if (data !== undefined) {
                DrawCard(data, boardCells, card, j, null, suit);
            }
        }
    }
    if (data !== undefined) {
        return (
            <table>
                <caption className="whitespace-nowrap">
                    <span style={Styles.CardBack(0)} className="bg-top-card-back-icon"></span>
                    <span style={Styles.CardBack(1)} className="bg-top-card-back-icon"></span>
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
        throw new Error(`Функция должна возвращать значение.`);
    }
};

/**
 * <h3>Отрисовка всех героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле героев.
 */
export const DrawHeroes = (G: IMyGameState, ctx: Ctx, validatorName: CanBeNullType<MoveValidatorNames>,
    data?: BoardProps<IMyGameState>): JSX.Element | MoveArgumentsType<number[]> => {
    const boardRows: JSX.Element[] = [],
        drawData: IDrawBoardOptions = DrawBoard(G.heroes.length),
        moveMainArgs: MoveArgumentsType<number[]> = [];
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells: JSX.Element[] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment: number = i * drawData.boardCols + j,
                hero: CanBeUndefType<IHeroCard> = G.heroes[increment];
            if (hero === undefined) {
                throw new Error(`В массиве карт героев отсутствует герой с id '${increment}'.`);
            }
            const suit: CanBeNullType<SuitNamesKeyofTypeofType> = hero.suit;
            if (hero.active && ctx.activePlayers?.[Number(ctx.currentPlayer)] === StageNames.pickHero) {
                const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                        ctx.currentPlayer);
                }
                if (data !== undefined) {
                    const stage: CanBeUndefType<StageNames> = ctx.activePlayers?.[Number(ctx.currentPlayer)];
                    let moveName: CardMoveNames;
                    switch (stage) {
                        case StageNames.pickHero:
                            moveName = CardMoveNames.ClickHeroCardMove;
                            break;
                        case StageNames.pickHeroSoloBotAndvari:
                            moveName = CardMoveNames.SoloBotAndvariClickHeroCardMove;
                            break;
                        default:
                            throw new Error(`Нет такого мува.`);
                    }
                    DrawCard(data, boardCells, hero, increment, player, suit, moveName,
                        increment);
                } else if ((validatorName === MoveValidatorNames.ClickHeroCardMoveValidator
                    || validatorName === MoveValidatorNames.SoloBotAndvariClickHeroCardMoveValidator) && hero.active) {
                    moveMainArgs.push(increment);
                } else {
                    throw new Error(`Не добавлен валидатор '${validatorName}'.`);
                }
            } else {
                if (data !== undefined) {
                    DrawCard(data, boardCells, hero, increment, null, suit);
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
                    <span style={Styles.HeroBack()} className="bg-top-hero-icon"></span>
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
        throw new Error(`Функция должна возвращать значение.`);
    }
};

/**
 * <h3>Отрисовка всех героев для выбора соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле героев для соло бота.
 */
export const DrawHeroesForSoloBotUI = (G: IMyGameState, ctx: Ctx, validatorName: CanBeNullType<MoveValidatorNames>,
    data?: BoardProps<IMyGameState>): JSX.Element | MoveArgumentsType<number[]> => {
    if (G.heroesForSoloBot === null) {
        throw new Error(`В массиве карт героев для соло бота не может не быть героев.`);
    }
    const boardCells: JSX.Element[] = [],
        moveMainArgs: MoveArgumentsType<number[]> = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < G.heroesForSoloBot.length; j++) {
            const hero: IHeroCard = G.heroesForSoloBot[j as IndexOf<HeroesForSoloGameArrayType>];
            if (hero.active && Number(ctx.currentPlayer) === 1
                && ctx.activePlayers?.[Number(ctx.currentPlayer)] === StageNames.pickHeroSoloBot) {
                const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                        ctx.currentPlayer);
                }
                if (data !== undefined) {
                    DrawCard(data, boardCells, hero, j, player, null,
                        CardMoveNames.SoloBotClickHeroCardMove, j);
                } else if (validatorName === MoveValidatorNames.SoloBotClickHeroCardMoveValidator) {
                    if (hero.active) {
                        moveMainArgs.push(j);
                    }
                } else {
                    throw new Error(`Не добавлен валидатор '${validatorName}'.`);
                }
            } else {
                if (data !== undefined) {
                    DrawCard(data, boardCells, hero, j, null, null);
                }
            }
        }
    }
    if (data !== undefined) {
        return (
            <table>
                <caption>
                    <span style={Styles.HeroBack()} className="bg-top-hero-icon"></span>
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
        throw new Error(`Функция должна возвращать значение.`);
    }
};

/**
 * <h3>Отрисовка рынка монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param data Глобальные параметры.
 * @returns Поле рынка монет.
 */
export const DrawMarketCoins = (G: IMyGameState, data: BoardProps<IMyGameState>): JSX.Element => {
    const boardRows: JSX.Element[] = [],
        drawData: IDrawBoardOptions = DrawBoard(G.marketCoinsUnique.length),
        countMarketCoins: INumberValues = CountMarketCoins(G);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells: JSX.Element[] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment: number = i * drawData.boardCols + j,
                marketCoin: CanBeUndefType<ICoin> = G.marketCoinsUnique[increment];
            if (marketCoin === undefined) {
                throw new Error(`В массиве монет рынка героев отсутствует монета с id '${increment}'.`);
            }
            const tempCoinValue: number = marketCoin.value,
                coinClassName: string = countMarketCoins[tempCoinValue] === 0 ? `text-red-500` : `text-blue-500`;
            DrawCoin(data, boardCells, `market`, marketCoin, increment, null,
                coinClassName, countMarketCoins[tempCoinValue]);
            if (increment + 1 === G.marketCoinsUnique.length) {
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
                    <span style={Styles.Exchange()} className="bg-top-market-coin-icon"></span>
                    Market coins ({G.marketCoins.length} coins)</span>
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
 * @param G
 * @param ctx
 * @param data Глобальные параметры.
 * @returns Поле профита.
 */
export const DrawProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>): JSX.Element => {
    const boardCells: JSX.Element[] = [],
        player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const option: DrawProfitType = G.drawProfit;
    let caption = ``,
        _exhaustiveCheck: never;
    switch (option) {
        case ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade:
            caption += `Get value of coin upgrade.`;
            ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit(G, ctx, null, data, boardCells);
            break;
        case ConfigNames.ExplorerDistinction:
            caption += `Get one card to your board.`;
            ExplorerDistinctionProfit(G, ctx, null, data, boardCells);
            break;
        case ConfigNames.GetDifficultyLevelForSoloMode:
            caption += `Get difficulty level for Solo mode.`;
            ChooseDifficultyLevelForSoloModeProfit(G, ctx, null, data, boardCells);
            break;
        case ConfigNames.ChooseStrategyLevelForSoloModeAndvari:
            caption += `Get strategy level for Solo mode Andvari.`;
            ChooseStrategyForSoloModeAndvariProfit(G, ctx, null, data, boardCells);
            break;
        case ConfigNames.ChooseStrategyVariantLevelForSoloModeAndvari:
            caption += `Get strategy variant level for Solo mode Andvari.`;
            ChooseStrategyVariantForSoloModeAndvariProfit(G, ctx, null, data, boardCells);
            break;
        case ConfigNames.GetHeroesForSoloMode:
            caption += `Get ${G.soloGameDifficultyLevel} hero${G.soloGameDifficultyLevel === 1 ? `` : `es`} to Solo Bot.`;
            PickHeroesForSoloModeProfit(G, ctx, null, data, boardCells);
            break;
        case ConfigNames.StartOrPassEnlistmentMercenaries:
            caption = `Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.`;
            StartEnlistmentMercenariesProfit(G, ctx, data, boardCells);
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
                <span style={Styles.DistinctionsBack()} className="bg-top-distinctions-icon"></span>
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
 * @param G
 * @param ctx
 * @param data Глобальные параметры.
 * @returns Поле стратегий соло бота Андвари.
 */
export const DrawStrategyForSoloBotAndvariUI = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>):
    JSX.Element => {
    if (G.soloGameAndvariStrategyVariantLevel === null) {
        throw new Error(`Не задан вариант уровня сложности для стратегий соло бота Андвари в соло игре.`);
    }
    const playerHeadersGeneral: JSX.Element[] = [],
        playerHeadersReserve: JSX.Element[] = [];
    for (let i = 0; i < G.soloGameAndvariStrategyVariantLevel; i++) {
        const suit: CanBeUndefType<SuitNamesKeyofTypeofType> =
            G.strategyForSoloBotAndvari.general[i as ZeroOrOneOrTwoType];
        if (suit === undefined) {
            throw new Error(`В объекте общих стратегий соло бота Андвари отсутствует фракция с id '${i}'.`);
        }
        DrawSuit(data, playerHeadersGeneral, suit);
    }
    for (let i = G.soloGameAndvariStrategyVariantLevel; i < 5; i++) {
        const suit: CanBeUndefType<SuitNamesKeyofTypeofType> = G.strategyForSoloBotAndvari.reserve[i];
        if (suit === undefined) {
            throw new Error(`В объекте резервных стратегий соло бота Андвари отсутствует фракция с id '${i}'.`);
        }
        DrawSuit(data, playerHeadersReserve, suit);
    }
    // TODO Add different colors or dividers for different strategies and draw their names!
    return (
        <table>
            <caption>
                <span style={Styles.HeroBack()} className="bg-top-hero-icon"></span>
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
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param gridClass Класс для отрисовки таверны.
 * @returns Поле таверн.
 */
export const DrawTaverns = (G: IMyGameState, ctx: Ctx, validatorName: CanBeNullType<MoveValidatorNames>,
    data?: BoardProps<IMyGameState>, gridClass?: string): JSX.Element[] | MoveArgumentsType<number[]> => {
    const tavernsBoards: JSX.Element[] = [],
        moveMainArgs: MoveArgumentsType<number[]> = [];
    for (let t = 0; t < G.tavernsNum; t++) {
        const currentTavernConfig: ITavernInConfig = tavernsConfig[t as IndexOf<TavernsConfigType>];
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
                                <span style={Styles.Tavern(t as IndexOf<TavernsConfigType>)}
                                    className="bg-tavern-icon"></span>
                            </td>
                        );
                    }
                } else {
                    let suit: CanBeNullType<SuitNamesKeyofTypeofType> = null;
                    if (`suit` in tavernCard) {
                        suit = tavernCard.suit;
                    }
                    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                    if (player === undefined) {
                        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                            ctx.currentPlayer);
                    }
                    if (t === G.currentTavern && ctx.phase === PhaseNames.TavernsResolution
                        && ((ctx.activePlayers === null)
                            || (ctx.activePlayers?.[Number(ctx.currentPlayer)] === StageNames.discardCard))) {
                        if (data !== undefined) {
                            const stage: CanBeUndefType<StageNames> =
                                ctx.activePlayers?.[Number(ctx.currentPlayer)];
                            let moveName: CardMoveNames,
                                _exhaustiveCheck: never;
                            switch (stage) {
                                case StageNames.discardCard:
                                    moveName = CardMoveNames.DiscardCard2PlayersMove;
                                    break;
                                case undefined:
                                    if (ctx.activePlayers === null) {
                                        switch (G.mode) {
                                            case GameModeNames.Basic:
                                            case GameModeNames.Multiplayer:
                                                moveName = CardMoveNames.ClickCardMove;
                                                break;
                                            case GameModeNames.Solo1:
                                                if (ctx.currentPlayer === `0`) {
                                                    moveName = CardMoveNames.ClickCardMove;
                                                } else if (ctx.currentPlayer === `1`) {
                                                    moveName = CardMoveNames.SoloBotClickCardMove;
                                                } else {
                                                    throw new Error(`Не может быть игроков больше 2-х в соло игре.`);
                                                }
                                                break;
                                            case GameModeNames.SoloAndvari:
                                                if (ctx.currentPlayer === `0`) {
                                                    moveName = CardMoveNames.ClickCardMove;
                                                } else if (ctx.currentPlayer === `1`) {
                                                    moveName = CardMoveNames.SoloBotAndvariClickCardMove;
                                                } else {
                                                    throw new Error(`Не может быть игроков больше 2-х в соло игре Андвари.`);
                                                }
                                                break;
                                            default:
                                                _exhaustiveCheck = G.mode;
                                                throw new Error(`Нет такого режима игры.`);
                                                return _exhaustiveCheck;
                                        }
                                    } else {
                                        throw new Error(`Нет такого мува '1'.`);
                                    }
                                    break;
                                default:
                                    throw new Error(`Нет такого мува '2'.`);
                            }
                            DrawCard(data, boardCells, tavernCard, j, player, suit, moveName,
                                j);
                        } else if (validatorName === MoveValidatorNames.ClickCardMoveValidator
                            || validatorName === MoveValidatorNames.SoloBotClickCardMoveValidator
                            || validatorName === MoveValidatorNames.SoloBotAndvariClickCardMoveValidator
                            || validatorName === MoveValidatorNames.DiscardCard2PlayersMoveValidator) {
                            moveMainArgs.push(j);
                        } else {
                            throw new Error(`Не добавлен валидатор '${validatorName}'.`);
                        }
                    } else {
                        if (data !== undefined) {
                            DrawCard(data, boardCells, tavernCard, j, null, suit);
                        }
                    }
                }
            }
            if (data !== undefined) {
                tavernsBoards.push(
                    <table className={`${gridClass} justify-self-center`}
                        key={`Tavern ${currentTavernConfig.name} board`}>
                        <caption className="whitespace-nowrap">
                            <span style={Styles.Tavern(t as IndexOf<TavernsConfigType>)}
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
        throw new Error(`Функция должна возвращать значение.`);
    }
};

/**
 * <h3>Отрисовка игровой информации о текущей эпохе и количестве карт в деках.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @returns Поле информации о количестве карт по эпохам.
 */
export const DrawTierCards = (G: IMyGameState): JSX.Element => {
    return (
        <b>Tier: <span className="italic">
            {G.deckLength.length - G.tierToEnd + 1 > G.deckLength.length ? G.deckLength.length :
                G.deckLength.length - G.tierToEnd + 1}/{G.deckLength.length}
            ({G.deckLength[G.deckLength.length - G.tierToEnd] ?? 0}{G.deckLength.length - G.tierToEnd === 0 ? `/`
                + (G.deckLength[0] + G.deckLength[1]) : ``} cards)
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
 * @param G
 * @param ctx
 * @returns Поле информации о ходе/победителях игры.
 */
export const DrawWinner = (G: IMyGameState, ctx: Ctx): JSX.Element => {
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
                    const winnerPlayerI: CanBeUndefType<IPublicPlayer> = G.publicPlayers[playerId];
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
