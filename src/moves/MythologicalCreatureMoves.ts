import { INVALID_MOVE } from "boardgame.io/core";
import { UpgradeCoinAction } from "../actions/CoinActions";
import { AddPickHeroAction } from "../actions/HeroAutoActions";
import { AddPlusTwoValueToAllCoinsAction } from "../actions/MythologicalCreatureActions";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { AddBuffToPlayer, CheckPlayerHasBuff, DeleteBuffFromPlayer } from "../helpers/BuffHelpers";
import { PickCardOrActionCardActions } from "../helpers/CardHelpers";
import { UpgradeNextCoinsHrungnir } from "../helpers/CoinActionHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { IsGiantCard } from "../is_helpers/IsMythologicalCreatureTypeHelpers";
import { IsValidMove } from "../MoveValidator";
import { BuffNames, ButtonMoveNames, CardMoveNames, CoinMoveNames, CoinTypeNames, ErrorNames, GiantBuffNames, GodNames, RusCardTypeNames, SuitMoveNames, SuitNames, TavernsResolutionStageNames, TavernsResolutionWithSubStageNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, IDwarfCard, InvalidMoveType, IPublicPlayer, IStack, Move, MyFnContext, MythologicalCreatureCommandZoneCardType, MythologicalCreatureDeckCardType } from "../typescript/interfaces";

export const ActivateGodAbilityMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, godName: GodNames):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        TavernsResolutionWithSubStageNames.ActivateGodAbilityOrNot,
        CardMoveNames.ActivateGodAbilityMove, godName);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            playerID);
    }

};

export const NotActivateGodAbilityMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, param: null):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        TavernsResolutionWithSubStageNames.ActivateGodAbilityOrNot,
        ButtonMoveNames.NotActivateGodAbilityMove, param);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            playerID);
    }

};

/**
 * <h3>Выбор монеты для улучшения по способности Гиганта Hrungnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при активации способности Гиганта Hrungnir при наличии героя Uline.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id улучшаемой монеты.
 * @returns
 */
export const ChooseCoinValueForHrungnirUpgradeMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext,
    coinId: number): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        TavernsResolutionStageNames.ChooseCoinValueForHrungnirUpgrade,
        CoinMoveNames.ChooseCoinValueForHrungnirUpgradeMove, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            playerID);
    }
    const stack: CanBeUndefType<IStack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionIsUndefined,
            playerID);
    }
    let nextCoinId: CanBeUndefType<number> = stack.coinId;
    if (nextCoinId === undefined) {
        throw new Error(`В стеке отсутствует 'coinId'.`);
    }
    UpgradeCoinAction({ G, ctx, myPlayerID: playerID, ...rest }, false, 2, coinId,
        CoinTypeNames.Hand);
    if (nextCoinId < 4) {
        UpgradeNextCoinsHrungnir({ G, ctx, myPlayerID: playerID, ...rest }, nextCoinId++);
    }
};

/**
 * <h3>Выбор карты дворфа, а не активации способности конкретного Гиганта.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе игроком карты Olrun.</li>
 * </ol>
 *
 * @param context
 * @param card Карта Дворфа.
 * @returns
 */
export const ClickCardNotGiantAbilityMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, card: IDwarfCard):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        TavernsResolutionWithSubStageNames.ActivateGiantAbilityOrPickCard,
        CardMoveNames.ClickCardNotGiantAbilityMove, card);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            playerID);
    }
    const stack: CanBeUndefType<IStack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionIsUndefined,
            playerID);
    }
    const giant: CanBeUndefType<MythologicalCreatureCommandZoneCardType> =
        player.mythologicalCreatureCards.find((card: MythologicalCreatureCommandZoneCardType):
            boolean => card.name === stack.giantName);
    if (giant === undefined) {
        throw new Error(`В массиве карт мифических существ игрока с id '${playerID}' в командной зоне отсутствует карта Гиганта с названием '${stack.giantName}'.`);
    }
    if (!IsGiantCard(giant)) {
        throw new Error(`В массиве карт мифических существ игрока с id '${playerID}' в командной зоне не может быть карта с типом '${giant.type}' вместо типа '${RusCardTypeNames.Giant_Card}' с названием '${stack.giantName}'.`);
    }
    giant.isActivated = true;
    let buffName: GiantBuffNames,
        _exhaustiveCheck: never;
    switch (card.suit) {
        case SuitNames.blacksmith:
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID: playerID, ...rest },
                GiantBuffNames.PlayerHasActiveGiantThrivaldi)) {
                buffName = GiantBuffNames.PlayerHasActiveGiantThrivaldi;
            } else {
                throw new Error(`Игрок с id '${playerID}' должен иметь баф '${GiantBuffNames.PlayerHasActiveGiantThrivaldi}'.`);
            }
            break;
        case SuitNames.explorer:
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID: playerID, ...rest },
                GiantBuffNames.PlayerHasActiveGiantGymir)) {
                buffName = GiantBuffNames.PlayerHasActiveGiantGymir;
            } else {
                throw new Error(`Игрок с id '${playerID}' должен иметь баф '${GiantBuffNames.PlayerHasActiveGiantGymir}'.`);
            }
            break;
        case SuitNames.hunter:
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID: playerID, ...rest },
                GiantBuffNames.PlayerHasActiveGiantSkymir)) {
                buffName = GiantBuffNames.PlayerHasActiveGiantSkymir;
            } else {
                throw new Error(`Игрок с id '${playerID}' должен иметь баф '${GiantBuffNames.PlayerHasActiveGiantSkymir}'.`);
            }
            break;
        case SuitNames.miner:
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID: playerID, ...rest },
                GiantBuffNames.PlayerHasActiveGiantHrungnir)) {
                buffName = GiantBuffNames.PlayerHasActiveGiantHrungnir;
            } else {
                throw new Error(`Игрок с id '${playerID}' должен иметь баф '${GiantBuffNames.PlayerHasActiveGiantHrungnir}'.`);
            }
            break;
        case SuitNames.warrior:
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID: playerID, ...rest },
                GiantBuffNames.PlayerHasActiveGiantSurt)) {
                buffName = GiantBuffNames.PlayerHasActiveGiantSurt;
            } else {
                throw new Error(`Игрок с id '${playerID}' должен иметь баф '${GiantBuffNames.PlayerHasActiveGiantSurt}'.`);
            }
            break;
        default:
            _exhaustiveCheck = card.suit;
            throw new Error(`Карта имеющая принадлежность к фракции должна быть добавлена на стол игрока.`);
            return _exhaustiveCheck;
    }
    DeleteBuffFromPlayer({ G, ctx, myPlayerID: playerID, ...rest }, buffName);
    PickCardOrActionCardActions({ G, ctx, myPlayerID: playerID, ...rest }, card);
};

/**
 * <h3>Выбор активации способности конкретного Гиганта.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе игроком карты Olrun.</li>
 * </ol>
 *
 * @param context
 * @param card Карта Дворфа.
 * @returns
 */
export const ClickGiantAbilityNotCardMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, card: IDwarfCard):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        TavernsResolutionWithSubStageNames.ActivateGiantAbilityOrPickCard,
        CardMoveNames.ClickGiantAbilityNotCardMove, card);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            playerID);
    }
    const stack: CanBeUndefType<IStack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionIsUndefined,
            playerID);
    }
    const giant: CanBeUndefType<MythologicalCreatureCommandZoneCardType> =
        player.mythologicalCreatureCards.find((card: MythologicalCreatureCommandZoneCardType):
            boolean => card.name === stack.giantName);
    if (giant === undefined) {
        throw new Error(`В массиве карт мифических существ игрока с id '${playerID}' в командной зоне отсутствует карта Гиганта с названием '${stack.giantName}'.`);
    }
    if (!IsGiantCard(giant)) {
        throw new Error(`В массиве карт мифических существ игрока с id '${playerID}' в командной зоне не может быть карта с типом '${giant.type}' вместо типа '${RusCardTypeNames.Giant_Card}' с названием '${stack.giantName}'.`);
    }
    giant.capturedCard = card;
    giant.isActivated = true;
    let buffName: GiantBuffNames,
        _exhaustiveCheck: never;
    switch (card.suit) {
        case SuitNames.blacksmith:
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID: playerID, ...rest },
                GiantBuffNames.PlayerHasActiveGiantThrivaldi)) {
                buffName = GiantBuffNames.PlayerHasActiveGiantThrivaldi;
                AddBuffToPlayer({ G, ctx, myPlayerID: playerID, ...rest }, {
                    name: BuffNames.HasOneNotCountHero,
                });
                AddPickHeroAction({ G, ctx, myPlayerID: playerID, ...rest }, 1);
            } else {
                throw new Error(`Игрок с id '${playerID}' должен иметь баф '${GiantBuffNames.PlayerHasActiveGiantThrivaldi}'.`);
            }
            break;
        case SuitNames.explorer:
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID: playerID, ...rest },
                GiantBuffNames.PlayerHasActiveGiantGymir)) {
                buffName = GiantBuffNames.PlayerHasActiveGiantGymir;
            } else {
                throw new Error(`Игрок с id '${playerID}' должен иметь баф '${GiantBuffNames.PlayerHasActiveGiantGymir}'.`);
            }
            break;
        case SuitNames.hunter:
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID: playerID, ...rest },
                GiantBuffNames.PlayerHasActiveGiantSkymir)) {
                buffName = GiantBuffNames.PlayerHasActiveGiantSkymir;
                AddActionsToStack({ G, ctx, myPlayerID: playerID, ...rest },
                    [StackData.getMythologyCardSkymir()]);
            } else {
                throw new Error(`Игрок с id '${playerID}' должен иметь баф '${GiantBuffNames.PlayerHasActiveGiantSkymir}'.`);
            }
            break;
        case SuitNames.miner:
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID: playerID, ...rest },
                GiantBuffNames.PlayerHasActiveGiantHrungnir)) {
                buffName = GiantBuffNames.PlayerHasActiveGiantHrungnir;
                AddPlusTwoValueToAllCoinsAction({ G, ctx, myPlayerID: playerID, ...rest });
            } else {
                throw new Error(`Игрок с id '${playerID}' должен иметь баф '${GiantBuffNames.PlayerHasActiveGiantHrungnir}'.`);
            }
            break;
        case SuitNames.warrior:
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID: playerID, ...rest },
                GiantBuffNames.PlayerHasActiveGiantSurt)) {
                buffName = GiantBuffNames.PlayerHasActiveGiantSurt;
            } else {
                throw new Error(`Игрок с id '${playerID}' должен иметь баф '${GiantBuffNames.PlayerHasActiveGiantSurt}'.`);
            }
            break;
        default:
            _exhaustiveCheck = card.suit;
            throw new Error(`Карта имеющая принадлежность к фракции должна быть добавлена на стол игрока.`);
            return _exhaustiveCheck;
    }
    DeleteBuffFromPlayer({ G, ctx, myPlayerID: playerID, ...rest }, buffName);
};

/**
 * <h3>Выбор фракции карты Olrun.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе игроком карты Olrun.</li>
 * </ol>
 *
 * @param context
 * @param suit Фракция дворфов.
 * @returns
 */
export const ChooseSuitOlrunMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, suit: SuitNames):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        TavernsResolutionStageNames.ChooseSuitOlrun, SuitMoveNames.ChooseSuitOlrunMove, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            playerID);
    }
    AddBuffToPlayer({ G, ctx, myPlayerID: playerID, ...rest }, {
        name: BuffNames.SuitIdForOlrun,
    }, suit);
};

/**
 * <h3>Выбор карты мифического существа Skymir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе игроком карты Olrun.</li>
 * </ol>
 *
 * @param context
 * @param cardId Id выбираемой карты Мифического существа.
 * @returns
 */
export const GetMythologyCardMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, cardId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        TavernsResolutionStageNames.GetMythologyCard, CardMoveNames.GetMythologyCardMove, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (G.mythologicalCreatureDeckForSkymir === null) {
        throw new Error(`Массив всех карт мифических существ для Skymir не может не быть заполнен картами.`);
    }
    const mythologyCard: CanBeUndefType<MythologicalCreatureDeckCardType> = G.mythologicalCreatureDeckForSkymir[cardId];
    if (mythologyCard === undefined) {
        throw new Error(`В массиве карт мифических существ для Skymir отсутствует мифическое существо с id '${cardId}'.`);
    }
    PickCardOrActionCardActions({ G, ctx, myPlayerID: playerID, ...rest }, mythologyCard);
    if (G.mythologicalCreatureDeckForSkymir.length === 4) {
        AddActionsToStack({ G, ctx, myPlayerID: playerID, ...rest },
            [StackData.getMythologyCardSkymir(3)]);
    }
};
