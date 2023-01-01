import { heroesConfig } from "../data/HeroData";
import { AllStackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { StartAutoAction } from "../dispatchers/AutoActionDispatcher";
import { ThrowMyError } from "../Error";
import { ChangeBuffValue, CheckPlayerHasBuff, DeleteBuffFromPlayer } from "../helpers/BuffHelpers";
import { AddCardToPlayer } from "../helpers/CardHelpers";
import { DiscardCurrentCard, RemoveCardFromPlayerBoardSuitCards } from "../helpers/DiscardCardHelpers";
import { CheckIsStartUseGodAbility } from "../helpers/GodAbilityHelpers";
import { CheckAndMoveThrudAction } from "../helpers/HeroActionHelpers";
import { AddHeroCardToPlayerCards, AddHeroToPlayerCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { CreateHeroPlayerCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { CreateMultiSuitPlayerCard } from "../MultiSuitCard";
import { CardTypeRusNames, ErrorNames, GameModeNames, GodNames, HeroBuffNames, HeroNames, LogTypeNames, MultiSuitCardNames, MythicalAnimalBuffNames, SuitNames } from "../typescript/enums";
import type { CanBeUndefType, HeroCard, HeroPlayerCard, IPublicPlayer, MultiSuitCard, MultiSuitPlayerCard, MyFnContextWithMyPlayerID, PlayerCardType, Stack, SuitPropertyType, VariantType } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с добавлениям героя игроку или соло боту.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора героя игроком.</li>
 * <li>При необходимости выбора героя соло ботом Андвари.</li>
 * </ol>
 *
 * @param context
 * @param heroId Id героя.
 * @returns
 */
export const AddHeroToPlayerCardsAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, heroId: number):
    void => {
    const hero: CanBeUndefType<HeroCard> = G.heroes[heroId];
    if (hero === undefined) {
        throw new Error(`Не существует кликнутая карта героя с id '${heroId}'.`);
    }
    AddHeroToPlayerCards({ G, ctx, myPlayerID, ...rest }, hero);
    if (G.mode === GameModeNames.Solo && myPlayerID === `1`) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest },
            hero.stack?.soloBot ?? hero.stack?.player, hero);
    } else if (G.mode === GameModeNames.SoloAndvari && myPlayerID === `1`) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest },
            hero.stack?.soloBotAndvari ?? hero.stack?.player, hero);
    } else {
        if (!(G.expansions.Idavoll.active
            && (hero.name === HeroNames.Bonfur || hero.name === HeroNames.Crovax_The_Doppelganger
                || (hero.name === HeroNames.Dagda && CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest },
                    MythicalAnimalBuffNames.DagdaDiscardOnlyOneCards)))
            && CheckIsStartUseGodAbility({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest }, GodNames.Thor))) {
            // TODO Check if Thor & Durathor add for Dagda can not discard both cards at all!?
            AddActionsToStack({ G, ctx, myPlayerID, ...rest }, hero.stack?.player, hero);
        }
    }
    StartAutoAction({ G, ctx, myPlayerID, ...rest }, hero.actions);
};

/**
 * <h3>Действия, связанные с сбросом карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, сбрасывающих карты с планшета игрока.</li>
 * </ol>
 *
 * @param context
 * @param suit Название фракции дворфов.
 * @param cardId Id карты.
 * @returns
 */
export const DiscardCardsFromPlayerBoardAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    suit: SuitNames, cardId: number): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const discardedCard: PlayerCardType =
        RemoveCardFromPlayerBoardSuitCards({ G, ctx, myPlayerID, ...rest }, suit, cardId);
    DiscardCurrentCard({ G, ctx, ...rest }, discardedCard);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Карта '${discardedCard.type}' '${discardedCard.name}' убрана в сброс из-за выбора карты '${CardTypeRusNames.Hero_Card}' '${player.stack[0]?.name}'.`);
    if (player.stack[0]?.name === HeroNames.Dagda && player.stack[0]?.pickedSuit === undefined) {
        if (!G.expansions.Idavoll.active || (G.expansions.Idavoll.active
            && (!CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest },
                MythicalAnimalBuffNames.DagdaDiscardOnlyOneCards))
            || (CheckIsStartUseGodAbility({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest },
                GodNames.Thor)))) {
            AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                [AllStackData.discardCardFromBoardDagda(suit)]);
        }
    }
};

/**
 * <h3>Действия, связанные с добавлением других карт на планшет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Ольвин на игровое поле игрока.</li>
 * </ol>
 *
 * @param context
 * @param suit Название фракции дворфов.
 * @returns
 */
export const PlaceMultiSuitCardAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, suit: SuitNames):
    void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const stack: CanBeUndefType<Stack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionForPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const playerVariants: SuitPropertyType<VariantType> = {
        blacksmith: {
            suit: SuitNames.blacksmith,
            rank: 1,
            points: null,
        },
        hunter: {
            suit: SuitNames.hunter,
            rank: 1,
            points: null,
        },
        explorer: {
            suit: SuitNames.explorer,
            rank: 1,
            points: 0,
        },
        warrior: {
            suit: SuitNames.warrior,
            rank: 1,
            points: 0,
        },
        miner: {
            suit: SuitNames.miner,
            rank: 1,
            points: 0,
        },
    },
        name: CanBeUndefType<MultiSuitCardNames> = stack.name as CanBeUndefType<MultiSuitCardNames>;
    if (name === undefined) {
        throw new Error(`У конфига действия игрока с id '${myPlayerID}' отсутствует обязательный параметр вариантов выкладки карты '${MultiSuitCardNames.OlwinsDouble}'.`);
    }
    const card: CanBeUndefType<MultiSuitCard> = G.multiCardsDeck.find((card: MultiSuitCard): boolean =>
        card.name === name);
    if (card === undefined) {
        throw new Error(`В игре отсутствует карта с типом '${CardTypeRusNames.Multi_Suit_Card}' '${name}'.`);
    }
    const multiSuitCard: MultiSuitPlayerCard = CreateMultiSuitPlayerCard({
        name,
        suit,
        rank: playerVariants[suit].rank,
        points: playerVariants[suit].points,
    });
    AddCardToPlayer({ G, ctx, myPlayerID, ...rest }, multiSuitCard);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' добавил карту '${multiSuitCard.type}' '${name}' во фракцию '${suitsConfig[suit].suitName}'.`);
    if (stack.pickedSuit === undefined && name === MultiSuitCardNames.OlwinsDouble) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest },
            [AllStackData.placeMultiSuitsCards(MultiSuitCardNames.OlwinsDouble, suit,
                3)]);
    }
    CheckAndMoveThrudAction({ G, ctx, myPlayerID, ...rest }, multiSuitCard);
};

/**
 * <h3>Действия, связанные с проверкой расположением конкретного героя на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Труд на игровое поле игрока.</li>
 * <li>При добавлении героя Труд на игровое поле соло бота.</li>
 * </ol>
 *
 * @param context
 * @param suit Название фракции дворфов.
 * @returns
 */
export const PlaceThrudAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, suit: SuitNames): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const stack: CanBeUndefType<Stack> = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `текущего игрока`} с id '${myPlayerID}' отсутствует '0' действие.`);
    }
    const heroCard: HeroPlayerCard = CreateHeroPlayerCard({
        suit,
        type: CardTypeRusNames.Hero_Player_Card,
        name: HeroNames.Thrud,
        description: heroesConfig.Thrud.description,
    });
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `Соло бот` : `Текущий игрок`} добавил карту '${HeroNames.Thrud}' во фракцию '${suitsConfig[suit].suitName}'.`);
    AddHeroCardToPlayerCards({ G, ctx, myPlayerID, ...rest }, heroCard);
    ChangeBuffValue({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.MoveThrud, suit);
};

/**
 * <h3>Действия, связанные с проверкой расположением конкретного героя на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Илуд на игровом поле игрока.</li>
 * <li>При добавлении героя Илуд на игровом поле соло бота.</li>
 * </ol>
 *
 * @param context
 * @param suit Название фракции дворфов.
 * @returns
 */
export const PlaceYludAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, suit: SuitNames): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const stack: CanBeUndefType<Stack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionForPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const playerVariants: SuitPropertyType<VariantType> = {
        blacksmith: {
            suit: SuitNames.blacksmith,
            rank: 1,
            points: null,
        },
        hunter: {
            suit: SuitNames.hunter,
            rank: 1,
            points: null,
        },
        explorer: {
            suit: SuitNames.explorer,
            rank: 1,
            points: 11,
        },
        warrior: {
            suit: SuitNames.warrior,
            rank: 1,
            points: 7,
        },
        miner: {
            suit: SuitNames.miner,
            rank: 1,
            points: 1,
        },
    },
        heroCard: HeroPlayerCard = CreateHeroPlayerCard({
            suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            type: CardTypeRusNames.Hero_Player_Card,
            name: HeroNames.Ylud,
            description: heroesConfig.Ylud.description,
        });
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `Соло бот` : `Текущий игрок`} '${player.nickname}' добавил карту '${HeroNames.Ylud}' во фракцию '${suitsConfig[suit].suitName}'.`);
    AddHeroCardToPlayerCards({ G, ctx, myPlayerID, ...rest }, heroCard);
    if (G.tierToEnd === 0) {
        DeleteBuffFromPlayer({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.EndTier);
    }
};
