import { AllStackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { StartAutoAction } from "../dispatchers/AutoActionDispatcher";
import { ThrowMyError } from "../Error";
import { IsDwarfCard } from "../is_helpers/IsDwarfTypeHelpers";
import { IsMythicalAnimalCard } from "../is_helpers/IsMythologicalCreatureTypeHelpers";
import { AddDataToLog } from "../Logging";
import { CardTypeRusNames, ErrorNames, GameModeNames, GiantBuffNames, GiantNames, LogTypeNames, PhaseNames, SuitNames, ValkyryBuffNames } from "../typescript/enums";
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
export const AddCardToPlayer = ({ G, ctx, myPlayerID, ...rest }, card) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let _exhaustiveCheck;
    if (G.expansions.Idavoll.active) {
        switch (card.type) {
            case CardTypeRusNames.Dwarf_Card:
            case CardTypeRusNames.Mercenary_Player_Card:
            case CardTypeRusNames.Mythical_Animal_Card:
            case CardTypeRusNames.Special_Card:
            case CardTypeRusNames.Artefact_Player_Card:
                if (CheckIfRecruitedCardHasNotLeastRankOfChosenClass({ G, ctx, myPlayerID, ...rest }, card.suit)) {
                    CheckValkyryRequirement({ G, ctx, myPlayerID, ...rest }, ValkyryBuffNames.CountPickedCardClassRankAmount);
                }
                break;
            default:
                break;
        }
    }
    let startGiant = false;
    switch (card.type) {
        case CardTypeRusNames.Dwarf_Card:
        case CardTypeRusNames.Mercenary_Player_Card:
        case CardTypeRusNames.Mythical_Animal_Card:
        case CardTypeRusNames.Special_Card:
        case CardTypeRusNames.Multi_Suit_Player_Card:
        case CardTypeRusNames.Artefact_Player_Card:
            if (G.expansions.Idavoll.active) {
                if (IsDwarfCard(card) && ctx.phase === PhaseNames.TavernsResolution && ctx.activePlayers === null) {
                    switch (card.suit) {
                        case SuitNames.blacksmith:
                            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, GiantBuffNames.PlayerHasActiveGiantThrivaldi)) {
                                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.activateGiantAbilityOrPickCard(GiantNames.Thrivaldi, card)]);
                            }
                            break;
                        case SuitNames.explorer:
                            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, GiantBuffNames.PlayerHasActiveGiantGymir)) {
                                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.activateGiantAbilityOrPickCard(GiantNames.Gymir, card)]);
                            }
                            break;
                        case SuitNames.hunter:
                            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, GiantBuffNames.PlayerHasActiveGiantSkymir)) {
                                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.activateGiantAbilityOrPickCard(GiantNames.Skymir, card)]);
                            }
                            break;
                        case SuitNames.miner:
                            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, GiantBuffNames.PlayerHasActiveGiantHrungnir)) {
                                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.activateGiantAbilityOrPickCard(GiantNames.Hrungnir, card)]);
                            }
                            break;
                        case SuitNames.warrior:
                            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, GiantBuffNames.PlayerHasActiveGiantSurt)) {
                                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.activateGiantAbilityOrPickCard(GiantNames.Surt, card)]);
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
        case CardTypeRusNames.Royal_Offering_Card:
        case CardTypeRusNames.God_Card:
        case CardTypeRusNames.Giant_Card:
        case CardTypeRusNames.Valkyry_Card:
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
const AddMythologicalCreatureCardToPlayerCommandZone = ({ G, ctx, myPlayerID, ...rest }, card) => {
    var _a;
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let _exhaustiveCheck;
    switch (card.type) {
        case CardTypeRusNames.God_Card:
            card.isActivated = false;
            break;
        case CardTypeRusNames.Giant_Card:
            card.isActivated = false;
            player.giantTokenSuits[card.placedSuit] = true;
            StartAutoAction({ G, ctx, myPlayerID, ...rest }, card.actions);
            break;
        case CardTypeRusNames.Valkyry_Card:
            card.strengthTokenNotch = 0;
            AddActionsToStack({ G, ctx, myPlayerID, ...rest }, (_a = card.stack) === null || _a === void 0 ? void 0 : _a.player, card);
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
export const PickCardOrActionCardActions = ({ G, ctx, myPlayerID, ...rest }, tavernCard) => {
    var _a, _b, _c, _d;
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    AddCardToPlayer({ G, ctx, myPlayerID, ...rest }, tavernCard);
    let _exhaustiveCheck;
    switch (tavernCard.type) {
        case CardTypeRusNames.Dwarf_Card:
        case CardTypeRusNames.Mythical_Animal_Card:
            if (IsMythicalAnimalCard(tavernCard)) {
                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, (_a = tavernCard.stack) === null || _a === void 0 ? void 0 : _a.player, tavernCard);
            }
            CheckAndMoveThrudAction({ G, ctx, myPlayerID, ...rest }, tavernCard);
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' выбрал карту '${tavernCard.type}' '${tavernCard.name}' во фракцию '${suitsConfig[tavernCard.suit].suitName}'.`);
            break;
        case CardTypeRusNames.Royal_Offering_Card:
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Игрок '${player.nickname}' выбрал карту '${tavernCard.type}' '${tavernCard.name}'.`);
            if (G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`) {
                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, (_b = tavernCard.stack) === null || _b === void 0 ? void 0 : _b.soloBot, tavernCard);
            }
            else if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, (_c = tavernCard.stack) === null || _c === void 0 ? void 0 : _c.soloBotAndvari, tavernCard);
            }
            else {
                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, (_d = tavernCard.stack) === null || _d === void 0 ? void 0 : _d.player, tavernCard);
            }
            DiscardCurrentCard({ G, ctx, ...rest }, tavernCard);
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Карта '${tavernCard.type}' '${tavernCard.name}' убрана в сброс после применения её эффекта.`);
            break;
        case CardTypeRusNames.God_Card:
        case CardTypeRusNames.Giant_Card:
        case CardTypeRusNames.Valkyry_Card:
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
//# sourceMappingURL=CardHelpers.js.map