import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { StartAutoAction } from "../dispatchers/AutoActionDispatcher";
import { ThrowMyError } from "../Error";
import { IsDwarfCard } from "../is_helpers/IsDwarfTypeHelpers";
import { IsMythicalAnimalCard } from "../is_helpers/IsMythologicalCreatureTypeHelpers";
import { AddDataToLog } from "../Logging";
import { ErrorNames, GameModeNames, GiantBuffNames, GiantNames, LogTypeNames, PhaseNames, RusCardTypeNames, SuitNames, ValkyryBuffNames } from "../typescript/enums";
import type { AddCardToPlayerType, CanBeUndefType, IPublicPlayer, MyFnContextWithMyPlayerID, MythologicalCreatureCommandZoneCardType, TavernCardWithExpansionType } from "../typescript/interfaces";
import { CheckPlayerHasBuff } from "./BuffHelpers";
import { DiscardCurrentCard } from "./DiscardCardHelpers";
import { CheckAndMoveThrudAction } from "./HeroActionHelpers";
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
 * @param context
 * @param card Карта.
 * @returns
 */
export const AddCardToPlayer = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, card: AddCardToPlayerType):
    void => {
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
 * @param context
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
    let _exhaustiveCheck: never;
    switch (card.type) {
        case RusCardTypeNames.God_Card:
            card.isActivated = false;
            break;
        case RusCardTypeNames.Giant_Card:
            card.isActivated = false;
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
    player.mythologicalCreatureCards.push(card);
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
 * @param context
 * @param tavernCard Выбранная карта дворфа или улучшения монет.
 * @returns Добавлена ли карта на планшет игрока.
 */
export const PickCardOrActionCardActions = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    tavernCard: TavernCardWithExpansionType): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            myPlayerID);
    }
    AddCardToPlayer({ G, ctx, myPlayerID, ...rest }, tavernCard);
    let _exhaustiveCheck: never;
    switch (tavernCard.type) {
        case RusCardTypeNames.Dwarf_Card:
        case RusCardTypeNames.Mythical_Animal_Card:
            if (IsMythicalAnimalCard(tavernCard)) {
                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, tavernCard.stack?.player, tavernCard);
                StartAutoAction({ G, ctx, myPlayerID, ...rest }, tavernCard.actions);
            }
            CheckAndMoveThrudAction({ G, ctx, myPlayerID, ...rest }, tavernCard);
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' выбрал карту '${tavernCard.type}' '${tavernCard.name}' во фракцию '${suitsConfig[tavernCard.suit].suitName}'.`);
            break;
        case RusCardTypeNames.Royal_Offering_Card:
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Игрок '${player.nickname}' выбрал карту '${tavernCard.type}' '${tavernCard.name}'.`);
            if (G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`) {
                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, tavernCard.stack?.soloBot, tavernCard);
            } else if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, tavernCard.stack?.soloBotAndvari,
                    tavernCard);
            } else {
                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, tavernCard.stack?.player, tavernCard);
            }
            DiscardCurrentCard({ G, ctx, ...rest }, tavernCard);
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Карта '${tavernCard.type}' '${tavernCard.name}' убрана в сброс после применения её эффекта.`);
            break;
        case RusCardTypeNames.God_Card:
        case RusCardTypeNames.Giant_Card:
        case RusCardTypeNames.Valkyry_Card:
            if (G.expansions.Idavoll.active) {
                AddMythologicalCreatureCardToPlayerCommandZone({ G, ctx, myPlayerID, ...rest }, tavernCard);
            }
            break;
        default:
            _exhaustiveCheck = tavernCard;
            throw new Error(`Добавленная на поле игрока карта не может быть с недопустимым типом.`);
            return _exhaustiveCheck;
    }
};
