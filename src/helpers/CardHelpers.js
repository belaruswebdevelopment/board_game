import { StackData } from "../data/StackData";
import { StartAutoAction } from "../dispatchers/AutoActionDispatcher";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { ErrorNames, GameModeNames, GiantBuffNames, LogTypeNames, PhaseNames, RusCardTypeNames, SuitNames, ValkyryBuffNames } from "../typescript/enums";
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
 * @returns Добавлена ли карта на планшет игрока.
 */
export const AddCardToPlayer = ({ G, ctx, playerID, ...rest }, card) => {
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    let _exhaustiveCheck;
    if (G.expansions.idavoll.active) {
        switch (card.type) {
            case RusCardTypeNames.Dwarf_Card:
            case RusCardTypeNames.Mercenary_Player_Card:
            case RusCardTypeNames.Mythical_Animal_Card:
            case RusCardTypeNames.Special_Card:
            case RusCardTypeNames.Artefact_Player_Card:
                if (CheckIfRecruitedCardHasNotLeastRankOfChosenClass({ G, ctx, playerID, ...rest }, Number(playerID), card.suit)) {
                    CheckValkyryRequirement({ G, ctx, playerID, ...rest }, ValkyryBuffNames.CountPickedCardClassRankAmount);
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
            if (G.expansions.idavoll.active) {
                if (IsDwarfCard(card) && ctx.phase === PhaseNames.TavernsResolution && ctx.activePlayers === null) {
                    switch (card.suit) {
                        case SuitNames.blacksmith:
                            if (CheckPlayerHasBuff({ G, ctx, playerID, ...rest }, GiantBuffNames.PlayerHasActiveGiantThrivaldi)) {
                                AddActionsToStack({ G, ctx, playerID, ...rest }, [StackData.activateGiantAbilityOrPickCard(card)]);
                            }
                            break;
                        case SuitNames.explorer:
                            if (CheckPlayerHasBuff({ G, ctx, playerID, ...rest }, GiantBuffNames.PlayerHasActiveGiantGymir)) {
                                AddActionsToStack({ G, ctx, playerID, ...rest }, [StackData.activateGiantAbilityOrPickCard(card)]);
                            }
                            break;
                        case SuitNames.hunter:
                            if (CheckPlayerHasBuff({ G, ctx, playerID, ...rest }, GiantBuffNames.PlayerHasActiveGiantSkymir)) {
                                AddActionsToStack({ G, ctx, playerID, ...rest }, [StackData.activateGiantAbilityOrPickCard(card)]);
                            }
                            break;
                        case SuitNames.miner:
                            if (CheckPlayerHasBuff({ G, ctx, playerID, ...rest }, GiantBuffNames.PlayerHasActiveGiantHrungnir)) {
                                AddActionsToStack({ G, ctx, playerID, ...rest }, [StackData.activateGiantAbilityOrPickCard(card)]);
                            }
                            break;
                        case SuitNames.warrior:
                            if (CheckPlayerHasBuff({ G, ctx, playerID, ...rest }, GiantBuffNames.PlayerHasActiveGiantSurt)) {
                                AddActionsToStack({ G, ctx, playerID, ...rest }, [StackData.activateGiantAbilityOrPickCard(card)]);
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
                return true;
            }
            return false;
        case RusCardTypeNames.Royal_Offering_Card:
        case RusCardTypeNames.God_Card:
        case RusCardTypeNames.Giant_Card:
        case RusCardTypeNames.Valkyry_Card:
            return false;
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
const AddMythologicalCreatureCardToPlayerCommandZone = ({ G, ctx, playerID, ...rest }, card) => {
    var _a;
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    player.mythologicalCreatureCards.push(card);
    let _exhaustiveCheck;
    switch (card.type) {
        case RusCardTypeNames.God_Card:
            card.isPowerTokenUsed = false;
            break;
        case RusCardTypeNames.Giant_Card:
            player.giantTokenSuits[card.placedSuit] = true;
            break;
        case RusCardTypeNames.Valkyry_Card:
            card.strengthTokenNotch = 0;
            AddActionsToStack({ G, ctx, playerID, ...rest }, (_a = card.stack) === null || _a === void 0 ? void 0 : _a.player, card);
            StartAutoAction({ G, ctx, playerID, ...rest }, card.actions);
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
export const PickCardOrActionCardActions = ({ G, ctx, playerID, ...rest }, card) => {
    var _a, _b, _c, _d;
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    const isAdded = AddCardToPlayer({ G, ctx, playerID, ...rest }, card);
    let _exhaustiveCheck;
    switch (card.type) {
        case RusCardTypeNames.Dwarf_Card:
        case RusCardTypeNames.Mythical_Animal_Card:
            if (isAdded) {
                if (IsMythicalAnimalCard(card)) {
                    AddActionsToStack({ G, ctx, playerID, ...rest }, (_a = card.stack) === null || _a === void 0 ? void 0 : _a.player, card);
                    StartAutoAction({ G, ctx, playerID, ...rest }, card.actions);
                }
                CheckAndMoveThrudAction({ G, ctx, playerID, ...rest }, card);
            }
            break;
        case RusCardTypeNames.Royal_Offering_Card:
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Игрок '${player.nickname}' выбрал карту '${card.type}' '${card.name}'.`);
            if (G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`) {
                AddActionsToStack({ G, ctx, playerID, ...rest }, (_b = card.stack) === null || _b === void 0 ? void 0 : _b.soloBot, card);
            }
            else if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
                AddActionsToStack({ G, ctx, playerID, ...rest }, (_c = card.stack) === null || _c === void 0 ? void 0 : _c.soloBotAndvari, card);
            }
            else {
                AddActionsToStack({ G, ctx, playerID, ...rest }, (_d = card.stack) === null || _d === void 0 ? void 0 : _d.player, card);
            }
            DiscardPickedCard({ G, ctx, ...rest }, card);
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Карта '${card.type}' '${card.name}' убрана в сброс после применения её эффекта.`);
            break;
        case RusCardTypeNames.God_Card:
        case RusCardTypeNames.Giant_Card:
        case RusCardTypeNames.Valkyry_Card:
            if (G.expansions.idavoll.active) {
                AddMythologicalCreatureCardToPlayerCommandZone({ G, ctx, playerID, ...rest }, card);
            }
            break;
        default:
            _exhaustiveCheck = card;
            throw new Error(`Добавленная на поле игрока карта не может быть с недопустимым типом.`);
            return _exhaustiveCheck;
    }
    return isAdded;
};
//# sourceMappingURL=CardHelpers.js.map