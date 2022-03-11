import { CreateCard } from "../Card";
import { heroesConfig } from "../data/HeroData";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { DeleteBuffFromPlayer } from "../helpers/BuffHelpers";
import { AddCardToPlayer } from "../helpers/CardHelpers";
import { AddHeroCardToPlayerCards } from "../helpers/HeroCardHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "../helpers/HeroHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { CreateHero, IsHeroCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { BuffNames, CardNames, GameNames, HeroNames, LogTypes, RusCardTypes } from "../typescript/enums";
/**
 * <h3>Действия, связанные с сбросом карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, сбрасывающих карты с планшета игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 * @param cardId Id карты.
 */
export const DiscardCardsFromPlayerBoardAction = (G, ctx, suit, cardId) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const pickedCard = player.cards[suit].splice(cardId, 1)[0];
        if (pickedCard !== undefined) {
            if (!IsHeroCard(pickedCard)) {
                player.pickedCard = pickedCard;
                G.discardCardsDeck.push(pickedCard);
                AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} отправил в колоду сброса карту '${pickedCard.name}'.`);
                if (player.actionsNum === 2) {
                    AddActionsToStackAfterCurrent(G, ctx, [StackData.discardCardFromBoardDagda()]);
                }
            }
            else {
                throw new Error(`Сброшенная карта не может быть с типом '${RusCardTypes.HERO}'.`);
            }
        }
        else {
            throw new Error(`В массиве карт игрока отсутствует выбранная карта: это должно проверяться в MoveValidator.`);
        }
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
/**
 * <h3>Действия, связанные с добавлением других карт на планшет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Ольвин на игровое поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 */
export const PlaceOlwinCardsAction = (G, ctx, suit) => {
    var _a;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const stack = player.stack[0];
        if (stack !== undefined) {
            const playerVariants = stack.variants;
            if (playerVariants !== undefined) {
                const olwinDouble = CreateCard({
                    suit,
                    rank: playerVariants[suit].rank,
                    points: playerVariants[suit].points,
                    name: CardNames.Olwin,
                    game: GameNames.Thingvellir,
                });
                const drawName = (_a = stack.config) === null || _a === void 0 ? void 0 : _a.drawName;
                if (drawName !== undefined) {
                    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} добавил карту ${drawName} во фракцию ${suitsConfig[suit].suitName}.`);
                    AddCardToPlayer(G, ctx, olwinDouble);
                    if (player.actionsNum === 2) {
                        AddActionsToStackAfterCurrent(G, ctx, [StackData.placeOlwinCards()]);
                    }
                    CheckAndMoveThrudOrPickHeroAction(G, ctx, olwinDouble);
                }
                else {
                    throw new Error(`У конфига действия игрока отсутствует обязательный параметр описания отрисовки профита.`);
                }
            }
            else {
                throw new Error(`У конфига действия игрока отсутствует обязательный параметр вариантов выкладки карты ${CardNames.Olwin}.`);
            }
        }
        else {
            throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
        }
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
/**
 * <h3>Действия, связанные с проверкой расположением конкретного героя на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Труд на игровое поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 */
export const PlaceThrudAction = (G, ctx, suit) => {
    var _a;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const stack = player.stack[0];
        if (stack !== undefined) {
            const playerVariants = stack.variants;
            if (playerVariants !== undefined) {
                const heroCard = CreateHero({
                    suit,
                    rank: playerVariants[suit].rank,
                    points: playerVariants[suit].points,
                    type: RusCardTypes.HERO,
                    name: HeroNames.Thrud,
                    game: GameNames.Basic,
                    description: heroesConfig.Thrud.description,
                });
                const drawName = (_a = stack.config) === null || _a === void 0 ? void 0 : _a.drawName;
                if (drawName !== undefined) {
                    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} добавил карту ${drawName} во фракцию ${suitsConfig[suit].suitName}.`);
                    AddHeroCardToPlayerCards(G, ctx, heroCard);
                }
                else {
                    throw new Error(`У конфига действия игрока отсутствует обязательный параметр описания отрисовки профита.`);
                }
            }
            else {
                throw new Error(`У конфига действия игрока отсутствует обязательный параметр вариантов выкладки карты ${HeroNames.Thrud}.`);
            }
        }
        else {
            throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
        }
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
/**
 * <h3>Действия, связанные с проверкой расположением конкретного героя на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Илуд на игровом поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 */
export const PlaceYludAction = (G, ctx, suit) => {
    var _a;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const stack = player.stack[0];
        if (stack !== undefined) {
            const playerVariants = stack.variants;
            if (playerVariants !== undefined) {
                const heroCard = CreateHero({
                    suit,
                    rank: playerVariants[suit].rank,
                    points: playerVariants[suit].points,
                    type: RusCardTypes.HERO,
                    name: HeroNames.Ylud,
                    game: GameNames.Basic,
                    description: heroesConfig.Ylud.description,
                });
                const drawName = (_a = stack.config) === null || _a === void 0 ? void 0 : _a.drawName;
                if (drawName !== undefined) {
                    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} добавил карту ${drawName} во фракцию ${suitsConfig[suit].suitName}.`);
                    AddHeroCardToPlayerCards(G, ctx, heroCard);
                    CheckAndMoveThrudOrPickHeroAction(G, ctx, heroCard);
                    if (G.tierToEnd === 0) {
                        DeleteBuffFromPlayer(G, ctx, BuffNames.EndTier);
                    }
                }
                else {
                    throw new Error(`У конфига действия игрока отсутствует обязательный параметр описания отрисовки профита.`);
                }
            }
            else {
                throw new Error(`У конфига действия игрока отсутствует обязательный параметр вариантов выкладки карты ${HeroNames.Ylud}.`);
            }
        }
        else {
            throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
        }
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
//# sourceMappingURL=HeroActions.js.map