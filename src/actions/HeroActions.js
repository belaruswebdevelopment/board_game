import { heroesConfig } from "../data/HeroData";
import { StackData } from "../data/StackData";
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
import { ErrorNames, GameModeNames, GodNames, HeroBuffNames, HeroNames, LogTypeNames, MultiSuitCardNames, MythicalAnimalBuffNames, RusCardTypeNames, SuitNames } from "../typescript/enums";
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
export const AddHeroToPlayerCardsAction = ({ G, ctx, myPlayerID, ...rest }, heroId) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const hero = G.heroes[heroId];
    if (hero === undefined) {
        throw new Error(`Не существует кликнутая карта героя с id '${heroId}'.`);
    }
    AddHeroToPlayerCards({ G, ctx, myPlayerID, ...rest }, hero);
    if (G.mode === GameModeNames.Solo && myPlayerID === `1`) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest }, (_b = (_a = hero.stack) === null || _a === void 0 ? void 0 : _a.soloBot) !== null && _b !== void 0 ? _b : (_c = hero.stack) === null || _c === void 0 ? void 0 : _c.player, hero);
    }
    else if (G.mode === GameModeNames.SoloAndvari && myPlayerID === `1`) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest }, (_e = (_d = hero.stack) === null || _d === void 0 ? void 0 : _d.soloBotAndvari) !== null && _e !== void 0 ? _e : (_f = hero.stack) === null || _f === void 0 ? void 0 : _f.player, hero);
    }
    else {
        if (!(G.expansions.Idavoll.active
            && (hero.name === HeroNames.Bonfur || hero.name === HeroNames.Crovax_The_Doppelganger
                || (hero.name === HeroNames.Dagda && CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, MythicalAnimalBuffNames.DagdaDiscardOnlyOneCards)))
            && CheckIsStartUseGodAbility({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest }, GodNames.Thor))) {
            // TODO Check if Thor & Durathor add for Dagda can not discard both cards at all!?
            AddActionsToStack({ G, ctx, myPlayerID, ...rest }, (_g = hero.stack) === null || _g === void 0 ? void 0 : _g.player, hero);
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
export const DiscardCardsFromPlayerBoardAction = ({ G, ctx, myPlayerID, ...rest }, suit, cardId) => {
    var _a, _b, _c;
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, myPlayerID);
    }
    const discardedCard = RemoveCardFromPlayerBoardSuitCards({ G, ctx, myPlayerID, ...rest }, suit, cardId);
    DiscardCurrentCard({ G, ctx, ...rest }, discardedCard);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Карта '${discardedCard.type}' '${discardedCard.name}' убрана в сброс из-за выбора карты '${RusCardTypeNames.Hero_Card}' '${(_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.name}'.`);
    if (((_b = player.stack[0]) === null || _b === void 0 ? void 0 : _b.name) === HeroNames.Dagda && ((_c = player.stack[0]) === null || _c === void 0 ? void 0 : _c.pickedSuit) === undefined) {
        if (!G.expansions.Idavoll.active || (G.expansions.Idavoll.active
            && (!CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, MythicalAnimalBuffNames.DagdaDiscardOnlyOneCards))
            || (CheckIsStartUseGodAbility({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest }, GodNames.Thor)))) {
            AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [StackData.discardCardFromBoardDagda(suit)]);
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
export const PlaceMultiSuitCardAction = ({ G, ctx, myPlayerID, ...rest }, suit) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, myPlayerID);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionIsUndefined);
    }
    const playerVariants = {
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
    }, name = stack.name;
    if (name === undefined) {
        throw new Error(`У конфига действия игрока с id '${myPlayerID}' отсутствует обязательный параметр вариантов выкладки карты '${MultiSuitCardNames.OlwinsDouble}'.`);
    }
    const card = G.multiCardsDeck.find((card) => card.name === name);
    if (card === undefined) {
        throw new Error(`В игре отсутствует карта с типом '${RusCardTypeNames.Multi_Suit_Card}' '${name}'.`);
    }
    const multiSuitCard = CreateMultiSuitPlayerCard({
        name,
        suit,
        rank: playerVariants[suit].rank,
        points: playerVariants[suit].points,
    });
    AddCardToPlayer({ G, ctx, myPlayerID, ...rest }, multiSuitCard);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' добавил карту '${multiSuitCard.type}' '${name}' во фракцию '${suitsConfig[suit].suitName}'.`);
    if (stack.pickedSuit === undefined && name === MultiSuitCardNames.OlwinsDouble) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [StackData.placeMultiSuitsCards(MultiSuitCardNames.OlwinsDouble, suit, 3)]);
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
export const PlaceThrudAction = ({ G, ctx, myPlayerID, ...rest }, suit) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, myPlayerID);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `текущего игрока`} с id '${myPlayerID}' отсутствует '0' действие.`);
    }
    const heroCard = CreateHeroPlayerCard({
        suit,
        rank: 1,
        points: null,
        type: RusCardTypeNames.Hero_Player_Card,
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
export const PlaceYludAction = ({ G, ctx, myPlayerID, ...rest }, suit) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, myPlayerID);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionIsUndefined);
    }
    const playerVariants = {
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
    }, heroCard = CreateHeroPlayerCard({
        suit,
        rank: playerVariants[suit].rank,
        points: playerVariants[suit].points,
        type: RusCardTypeNames.Hero_Player_Card,
        name: HeroNames.Ylud,
        description: heroesConfig.Ylud.description,
    });
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `Соло бот` : `Текущий игрок`} '${player.nickname}' добавил карту '${HeroNames.Ylud}' во фракцию '${suitsConfig[suit].suitName}'.`);
    AddHeroCardToPlayerCards({ G, ctx, myPlayerID, ...rest }, heroCard);
    if (G.tierToEnd === 0) {
        DeleteBuffFromPlayer({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.EndTier);
    }
};
//# sourceMappingURL=HeroActions.js.map