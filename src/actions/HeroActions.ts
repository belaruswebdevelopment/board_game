import type { Ctx } from "boardgame.io";
import { heroesConfig } from "../data/HeroData";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { ChangeBuffValue, DeleteBuffFromPlayer } from "../helpers/BuffHelpers";
import { AddCardToPlayer } from "../helpers/CardHelpers";
import { DiscardPickedCard } from "../helpers/DiscardCardHelpers";
import { CheckAndMoveThrudAction } from "../helpers/HeroActionHelpers";
import { AddHeroCardToPlayerCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { CreateHeroPlayerCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { CreateMultiSuitPlayerCard } from "../MultiSuitCard";
import { BuffNames, ErrorNames, HeroNames, LogTypeNames, MultiSuitCardNames, RusCardTypeNames, SuitNames } from "../typescript/enums";
import type { CanBeUndef, IHeroPlayerCard, IMultiSuitCard, IMultiSuitPlayerCard, IMyGameState, IPublicPlayer, IStack, PlayerCardTypes, SuitPropertyTypes, SuitTypes, VariantType } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с сбросом карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, сбрасывающих карты с планшета игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 * @param cardId Id карты.
 */
export const DiscardCardsFromPlayerBoardAction = (G: IMyGameState, ctx: Ctx, suit: SuitTypes, cardId: number): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const discardedCard: CanBeUndef<PlayerCardTypes> = player.cards[suit].splice(cardId, 1)[0];
    if (discardedCard === undefined) {
        throw new Error(`В массиве карт игрока с id '${ctx.currentPlayer}' отсутствует выбранная карта с id '${cardId}': это должно проверяться в MoveValidator.`);
    }
    DiscardPickedCard(G, discardedCard);
    if (player.stack[0]?.name === HeroNames.Dagda && player.stack[0]?.pickedSuit === undefined) {
        AddActionsToStack(G, ctx, [StackData.discardCardFromBoardDagda(suit)]);
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
 * @param suit Название фракции дворфов.
 */
export const PlaceMultiSuitCardAction = (G: IMyGameState, ctx: Ctx, suit: SuitTypes): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const stack: CanBeUndef<IStack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.FirstStackActionIsUndefined);
    }
    const playerVariants: SuitPropertyTypes<VariantType> = {
        blacksmith: {
            suit: SuitNames.Blacksmith,
            rank: 1,
            points: null,
        },
        hunter: {
            suit: SuitNames.Hunter,
            rank: 1,
            points: null,
        },
        explorer: {
            suit: SuitNames.Explorer,
            rank: 1,
            points: 0,
        },
        warrior: {
            suit: SuitNames.Warrior,
            rank: 1,
            points: 0,
        },
        miner: {
            suit: SuitNames.Miner,
            rank: 1,
            points: 0,
        },
    };
    const name: CanBeUndef<MultiSuitCardNames> = stack.name as CanBeUndef<MultiSuitCardNames>;
    if (name === undefined) {
        throw new Error(`У конфига действия игрока с id '${ctx.currentPlayer}' отсутствует обязательный параметр вариантов выкладки карты '${MultiSuitCardNames.OlwinsDouble}'.`);
    }
    const card: CanBeUndef<IMultiSuitCard> = G.multiCardsDeck.find((card: IMultiSuitCard): boolean =>
        card.name === name);
    if (card === undefined) {
        throw new Error(`В игре отсутствует карта с типом '${RusCardTypeNames.Multi_Suit_Card}' '${name}'.`);
    }
    const multiSuitCard: IMultiSuitPlayerCard = CreateMultiSuitPlayerCard({
        name,
        suit,
        rank: playerVariants[suit].rank,
        points: playerVariants[suit].points,
    });
    AddCardToPlayer(G, ctx, multiSuitCard);
    AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' добавил карту '${multiSuitCard.type}' '${name}' во фракцию '${suitsConfig[suit].suitName}'.`);
    if (stack.pickedSuit === undefined && name === MultiSuitCardNames.OlwinsDouble) {
        AddActionsToStack(G, ctx, [StackData.placeMultiSuitsCards(MultiSuitCardNames.OlwinsDouble,
            suit, 3)]);
    }
    CheckAndMoveThrudAction(G, ctx, multiSuitCard);
};

/**
 * <h3>Действия, связанные с проверкой расположением конкретного героя на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Труд на игровое поле игрока.</li>
 * <li>При добавлении героя Труд на игровое поле соло бота.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 */
export const PlaceThrudAction = (G: IMyGameState, ctx: Ctx, suit: SuitTypes): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const stack: CanBeUndef<IStack> = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `текущего игрока`} с id '${ctx.currentPlayer}' отсутствует '0' действие.`);
    }
    const heroCard: IHeroPlayerCard = CreateHeroPlayerCard({
        suit,
        rank: 1,
        points: null,
        type: RusCardTypeNames.Hero_Player_Card,
        name: HeroNames.Thrud,
        description: heroesConfig.Thrud.description,
    });
    AddDataToLog(G, LogTypeNames.Game, `${G.solo && ctx.currentPlayer === `1` ? `Соло бот` : `Текущий игрок`} добавил карту '${HeroNames.Thrud}' во фракцию '${suitsConfig[suit].suitName}'.`);
    AddHeroCardToPlayerCards(G, ctx, heroCard);
    ChangeBuffValue(G, ctx, BuffNames.MoveThrud, suit);
};

/**
 * <h3>Действия, связанные с проверкой расположением конкретного героя на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Илуд на игровом поле игрока.</li>
 * <li>При добавлении героя Илуд на игровом поле соло бота.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 */
export const PlaceYludAction = (G: IMyGameState, ctx: Ctx, suit: SuitTypes): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const stack: CanBeUndef<IStack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.FirstStackActionIsUndefined);
    }
    const playerVariants: SuitPropertyTypes<VariantType> = {
        blacksmith: {
            suit: SuitNames.Blacksmith,
            rank: 1,
            points: null,
        },
        hunter: {
            suit: SuitNames.Hunter,
            rank: 1,
            points: null,
        },
        explorer: {
            suit: SuitNames.Explorer,
            rank: 1,
            points: 11,
        },
        warrior: {
            suit: SuitNames.Warrior,
            rank: 1,
            points: 7,
        },
        miner: {
            suit: SuitNames.Miner,
            rank: 1,
            points: 1,
        },
    };
    const heroCard: IHeroPlayerCard = CreateHeroPlayerCard({
        suit,
        rank: playerVariants[suit].rank,
        points: playerVariants[suit].points,
        type: RusCardTypeNames.Hero_Player_Card,
        name: HeroNames.Ylud,
        description: heroesConfig.Ylud.description,
    });
    AddDataToLog(G, LogTypeNames.Game, `${G.solo && ctx.currentPlayer === `1` ? `Соло бот` : `Текущий игрок`} '${player.nickname}' добавил карту '${HeroNames.Ylud}' во фракцию '${suitsConfig[suit].suitName}'.`);
    AddHeroCardToPlayerCards(G, ctx, heroCard);
    if (G.tierToEnd === 0) {
        DeleteBuffFromPlayer(G, ctx, BuffNames.EndTier);
    }
};
