import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { StartAutoAction } from "../dispatchers/AutoActionDispatcher";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { ErrorNames, GameModeNames, GiantBuffNames, GiantNames, LogTypeNames, PhaseNames, RusCardTypeNames, SuitNames, ValkyryBuffNames } from "../typescript/enums";
import type { AddCardToPlayerType, CanBeUndefType, IPublicPlayer, MyFnContextWithMyPlayerID, MythologicalCreatureCommandZoneCardType, TavernCardType } from "../typescript/interfaces";
import { CheckPlayerHasBuff } from "./BuffHelpers";
import { DiscardPickedCard } from "./DiscardCardHelpers";
import { CheckAndMoveThrudAction } from "./HeroActionHelpers";
import { IsDwarfCard } from "./IsDwarfTypeHelpers";
import { IsMythicalAnimalCard } from "./IsMythologicalCreatureTypeHelpers";
import { CheckIfRecruitedCardHasNotLeastRankOfChosenClass, CheckValkyryRequirement } from "./MythologicalCreatureHelpers";
import { AddActionsToStack } from "./StackHelpers";

/**
 * <h3>Добавляет взятую карту в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты из текущей таверны.</li>
 * <li>Происходит при взятии карты из карт преимущества по разведчикам в конце 1 эпохи.</li>
 * <li>Происходит при взятии карты из сброса при активации героя.</li>
 * <li>Происходит при взятии карты из сброса при активации карты лагеря.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @returns
 */
export const AddCardToPlayer = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, card: AddCardToPlayerType): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            myPlayerID);
    }
    let _exhaustiveCheck: never;
    if (G.expansions.Idavoll.active) {
        switch (card.type) {
            case RusCardTypeNames.Dwarf_Card:
            case RusCardTypeNames.Mercenary_Player_Card:
            case RusCardTypeNames.Mythical_Animal_Card:
            case RusCardTypeNames.Special_Card:
            case RusCardTypeNames.Artefact_Player_Card:
                if (CheckIfRecruitedCardHasNotLeastRankOfChosenClass({ G, ctx, myPlayerID, ...rest },
                    card.suit)) {
                    CheckValkyryRequirement({ G, ctx, myPlayerID, ...rest },
                        ValkyryBuffNames.CountPickedCardClassRankAmount);
                }
                break;
            default:
                break;
        }
    }
    let startGiant = false;
    switch (card.type) {
        case RusCardTypeNames.Dwarf_Card:
        case RusCardTypeNames.Mercenary_Player_Card:
        case RusCardTypeNames.Mythical_Animal_Card:
        case RusCardTypeNames.Special_Card:
        case RusCardTypeNames.Multi_Suit_Player_Card:
        case RusCardTypeNames.Artefact_Player_Card:
            if (G.expansions.Idavoll.active) {
                if (IsDwarfCard(card) && ctx.phase === PhaseNames.TavernsResolution && ctx.activePlayers === null) {
                    switch (card.suit) {
                        case SuitNames.blacksmith:
                            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest },
                                GiantBuffNames.PlayerHasActiveGiantThrivaldi)) {
                                AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                                    [StackData.activateGiantAbilityOrPickCard(GiantNames.Thrivaldi,
                                        card)]);
                            }
                            break;
                        case SuitNames.explorer:
                            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest },
                                GiantBuffNames.PlayerHasActiveGiantGymir)) {
                                AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                                    [StackData.activateGiantAbilityOrPickCard(GiantNames.Gymir,
                                        card)]);
                            }
                            break;
                        case SuitNames.hunter:
                            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest },
                                GiantBuffNames.PlayerHasActiveGiantSkymir)) {
                                AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                                    [StackData.activateGiantAbilityOrPickCard(GiantNames.Skymir,
                                        card)]);
                            }
                            break;
                        case SuitNames.miner:
                            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest },
                                GiantBuffNames.PlayerHasActiveGiantHrungnir)) {
                                AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                                    [StackData.activateGiantAbilityOrPickCard(GiantNames.Hrungnir,
                                        card)]);
                            }
                            break;
                        case SuitNames.warrior:
                            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest },
                                GiantBuffNames.PlayerHasActiveGiantSurt)) {
                                AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                                    [StackData.activateGiantAbilityOrPickCard(GiantNames.Surt,
                                        card)]);
                            }
                            break;
                        default:
                            _exhaustiveCheck = card.suit;
                            throw new Error(`Карта имеющая принадлежность к фракции должна быть добавлена на стол игрока.`);
                            return _exhaustiveCheck;
                    }
                    // TODO Check if i have Giant and not captured dwarf activate Capturing Or Dwarf Picking
                    startGiant = true;
                }
            }
            if (!startGiant) {
                player.cards[card.suit].push(card);
            }
            break;
        case RusCardTypeNames.Royal_Offering_Card:
        case RusCardTypeNames.God_Card:
        case RusCardTypeNames.Giant_Card:
        case RusCardTypeNames.Valkyry_Card:
            break;
        default:
            _exhaustiveCheck = card;
            throw new Error(`Карта имеющая принадлежность к фракции должна быть добавлена на стол игрока.`);
            return _exhaustiveCheck;
    }
};

/**
 * <h3>Добавляет взятую карту Idavoll в командную зону карт Idavoll игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты из текущей таверны.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @returns
 */
const AddMythologicalCreatureCardToPlayerCommandZone = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    card: MythologicalCreatureCommandZoneCardType): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            myPlayerID);
    }
    player.mythologicalCreatureCards.push(card);
    let _exhaustiveCheck: never;
    switch (card.type) {
        case RusCardTypeNames.God_Card:
            card.isPowerTokenUsed = false;
            break;
        case RusCardTypeNames.Giant_Card:
            player.giantTokenSuits[card.placedSuit] = true;
            break;
        case RusCardTypeNames.Valkyry_Card:
            card.strengthTokenNotch = 0;
            AddActionsToStack({ G, ctx, myPlayerID, ...rest }, card.stack?.player, card);
            StartAutoAction({ G, ctx, myPlayerID, ...rest }, card.actions);
            break;
        default:
            _exhaustiveCheck = card;
            throw new Error(`Добавленная в командную зону для карт мифических существ карта не может быть с недопустимым типом.`);
            return _exhaustiveCheck;
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Игрок '${player.nickname}' выбрал карту '${card.type}' '${card.name}' в командную зону карт Idavoll.`);
};

/**
 * <h3>Добавляет взятую карту в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты из текущей таверны.</li>
 * <li>Происходит при взятии карты из карт преимущества по разведчикам в конце 1 эпохи.</li>
 * <li>Происходит при взятии карты из сброса при активации героя.</li>
 * <li>Происходит при взятии карты из сброса при активации карты лагеря.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Выбранная карта дворфа или улучшения монет.
 * @returns Добавлена ли карта на планшет игрока.
 */
export const PickCardOrActionCardActions = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    card: NonNullable<TavernCardType>): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            myPlayerID);
    }
    AddCardToPlayer({ G, ctx, myPlayerID, ...rest }, card);
    let _exhaustiveCheck: never;
    switch (card.type) {
        case RusCardTypeNames.Dwarf_Card:
        case RusCardTypeNames.Mythical_Animal_Card:
            if (IsMythicalAnimalCard(card)) {
                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, card.stack?.player, card);
                StartAutoAction({ G, ctx, myPlayerID, ...rest }, card.actions);
            }
            CheckAndMoveThrudAction({ G, ctx, myPlayerID, ...rest }, card);
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' выбрал карту '${card.type}' '${card.name}' во фракцию '${suitsConfig[card.suit].suitName}'.`);
            break;
        case RusCardTypeNames.Royal_Offering_Card:
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Игрок '${player.nickname}' выбрал карту '${card.type}' '${card.name}'.`);
            if (G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`) {
                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, card.stack?.soloBot, card);
            } else if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, card.stack?.soloBotAndvari, card);
            } else {
                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, card.stack?.player, card);
            }
            DiscardPickedCard({ G, ctx, ...rest }, card);
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Карта '${card.type}' '${card.name}' убрана в сброс после применения её эффекта.`);
            break;
        case RusCardTypeNames.God_Card:
        case RusCardTypeNames.Giant_Card:
        case RusCardTypeNames.Valkyry_Card:
            if (G.expansions.Idavoll.active) {
                AddMythologicalCreatureCardToPlayerCommandZone({ G, ctx, myPlayerID, ...rest }, card);
            }
            break;
        default:
            _exhaustiveCheck = card;
            throw new Error(`Добавленная на поле игрока карта не может быть с недопустимым типом.`);
            return _exhaustiveCheck;
    }
};
