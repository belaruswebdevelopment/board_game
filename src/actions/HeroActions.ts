import { AllStackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { ChangeBuffValue, CheckPlayerHasBuff, DeleteBuffFromPlayer } from "../helpers/BuffHelpers";
import { AddAnyCardToPlayerActions } from "../helpers/CardHelpers";
import { DiscardCurrentCard, RemoveCardFromPlayerBoardSuitCards } from "../helpers/DiscardCardHelpers";
import { CheckIsStartUseGodAbility } from "../helpers/GodAbilityHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { CardTypeRusNames, ErrorNames, GameModeNames, GodNames, HeroBuffNames, HeroNames, LogTypeNames, MultiSuitCardNames, MythicalAnimalBuffNames, PlayerIdForSoloGameNames, SuitNames } from "../typescript/enums";
import type { AllHeroesForPlayerOrSoloBotAddToPlayerBoardPossibleCardIdType, CanBeUndefType, HeroCard, HeroRankType, MultiSuitCard, MultiSuitRankType, MyFnContextWithMyPlayerID, PlayerBoardCardType, PlayerStack, PublicPlayer, StackNamesType, SuitPropertyType, VariantType } from "../typescript/interfaces";

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
export const AddHeroToPlayerCardsAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    heroId: AllHeroesForPlayerOrSoloBotAddToPlayerBoardPossibleCardIdType): void => {
    const hero: CanBeUndefType<HeroCard> = G.heroes[heroId];
    if (hero === undefined) {
        throw new Error(`Не существует кликнутая карта героя с id '${heroId}'.`);
    }
    AddAnyCardToPlayerActions({ G, ctx, myPlayerID, ...rest }, hero);
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
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const discardedCard: PlayerBoardCardType =
        RemoveCardFromPlayerBoardSuitCards({ G, ctx, myPlayerID, ...rest }, suit, cardId);
    DiscardCurrentCard({ G, ctx, ...rest }, discardedCard);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Карта '${discardedCard.type}' '${discardedCard.name}' убрана в сброс из-за выбора карты '${CardTypeRusNames.HeroCard}' '${player.stack[0]?.name}'.`);
    if (player.stack[0]?.name === HeroNames.Dagda && player.stack[0]?.pickedSuit === undefined) {
        // TODO Check this logic!
        if (!(G.expansions.Idavoll.active
            && ((CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest },
                MythicalAnimalBuffNames.DagdaDiscardOnlyOneCards))
                || (CheckIsStartUseGodAbility({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest },
                    GodNames.Thor))))) {
            AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                [AllStackData.discardCardFromBoardDagda(suit)]);
        }
    }
};

/**
 * <h3>Действия, связанные с добавлением других карт на поле игрока.</h3>
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
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const stack: CanBeUndefType<PlayerStack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionForPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const playerVariants: SuitPropertyType<VariantType<MultiSuitRankType>> = {
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
        name: CanBeUndefType<StackNamesType> = stack.name;
    if (name === undefined) {
        throw new Error(`У конфига действия игрока с id '${myPlayerID}' отсутствует обязательный параметр вариантов выкладки карты с типом '${CardTypeRusNames.MultiSuitCard}' '${name}'.`);
    }
    const multiSuitCard: CanBeUndefType<MultiSuitCard> =
        G.multiCardsDeck.find((card: MultiSuitCard): boolean => card.name === name);
    if (multiSuitCard === undefined) {
        throw new Error(`В игре отсутствует карта с типом '${CardTypeRusNames.MultiSuitCard}' '${name}'.`);
    }
    multiSuitCard.playerSuit = suit;
    multiSuitCard.rank = playerVariants[suit].rank;
    multiSuitCard.points = playerVariants[suit].points;
    AddAnyCardToPlayerActions({ G, ctx, myPlayerID, ...rest }, multiSuitCard);
    // TODO Move all such logs to AddAnyCardToPlayerActions!
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' добавил карту '${multiSuitCard.type}' '${name}' во фракцию '${suitsConfig[suit].suitName}'.`);
    if (stack.pickedSuit === undefined && name === MultiSuitCardNames.OlwinsDouble) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest },
            [AllStackData.placeMultiSuitsCards(MultiSuitCardNames.OlwinsDouble, suit,
                3)]);
    }
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
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const stack: CanBeUndefType<PlayerStack> = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `текущего игрока`} с id '${myPlayerID}' отсутствует '0' действие.`);
    }
    const thrudHeroCard: CanBeUndefType<HeroCard> =
        player.heroes.find((hero: HeroCard): boolean => hero.name === HeroNames.Thrud);
    if (thrudHeroCard === undefined) {
        throw new Error(`В массиве карт игрока с id '${myPlayerID}' отсутствует карта героя '${HeroNames.Thrud}'.`);
    }
    thrudHeroCard.playerSuit = suit;
    ChangeBuffValue({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.MoveThrud, suit);
    AddAnyCardToPlayerActions({ G, ctx, myPlayerID, ...rest }, thrudHeroCard);
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
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const stack: CanBeUndefType<PlayerStack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionForPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const playerVariants: SuitPropertyType<VariantType<HeroRankType>> = {
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
        yludHeroCard: CanBeUndefType<HeroCard> =
            player.heroes.find((hero: HeroCard): boolean => hero.name === HeroNames.Ylud);
    if (yludHeroCard === undefined) {
        throw new Error(`В массиве карт игрока с id '${myPlayerID}' отсутствует карта героя '${HeroNames.Ylud}'.`);
    }
    yludHeroCard.playerSuit = suit;
    yludHeroCard.rank = playerVariants[suit].rank;
    yludHeroCard.points = playerVariants[suit].points;
    if (G.tierToEnd === 0) {
        DeleteBuffFromPlayer({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.EndTier);
    }
    AddAnyCardToPlayerActions({ G, ctx, myPlayerID, ...rest }, yludHeroCard);
};
