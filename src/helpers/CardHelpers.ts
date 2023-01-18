import { AllStackData } from "../data/StackData";
import { StartAutoAction } from "../dispatchers/AutoActionDispatcher";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { CardTypeRusNames, ErrorNames, GameModeNames, GiantBuffNames, GiantNames, GodNames, HeroNames, LogTypeNames, MythicalAnimalBuffNames, PhaseNames, SuitNames, ValkyryBuffNames } from "../typescript/enums";
import type { AllCardType, AllPickedCardType, CanBeUndefType, MyFnContextWithMyPlayerID, MythologicalCreatureCommandZoneCardType, PlayerBoardCardType, PublicPlayer } from "../typescript/interfaces";
import { CheckPlayerHasBuff } from "./BuffHelpers";
import { AddCampCardToCards } from "./CampCardHelpers";
import { DiscardCurrentCard } from "./DiscardCardHelpers";
import { AddDwarfToPlayerCards } from "./DwarfCardHelpers";
import { CheckIsStartUseGodAbility } from "./GodAbilityHelpers";
import { CheckAndMoveThrudAction } from "./HeroActionHelpers";
import { AddHeroToPlayerCards } from "./HeroCardHelpers";
import { AddMultiSuitCardToPlayerCards } from "./MultiSuitCardHelpers";
import { AddMythicalAnimalToPlayerCards } from "./MythologicalCreatureCardHelpers";
import { CheckIfRecruitedCardEqualSuitIdForOlrun, CheckValkyryRequirement } from "./MythologicalCreatureHelpers";
import { AddSpecialCardToPlayerCards } from "./SpecialCardHelpers";
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
export const AddCardToPlayerBoardCards = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    card: PlayerBoardCardType): void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let _exhaustiveCheck: never;
    if (G.expansions.Idavoll.active) {
        // TODO Fix it both time!
        switch (card.type) {
            case CardTypeRusNames.DwarfPlayerCard:
            case CardTypeRusNames.MercenaryPlayerCard:
            case CardTypeRusNames.MythicalAnimalPlayerCard:
            case CardTypeRusNames.SpecialPlayerCard:
            case CardTypeRusNames.ArtefactPlayerCard:
                if (G.expansions.Idavoll.active) {
                    // TODO Can rework it!?
                    if (!(card.name === HeroNames.Thrud || HeroNames.Ylud)) {
                        if (CheckIfRecruitedCardEqualSuitIdForOlrun({ G, ctx, myPlayerID, ...rest }, card.suit)) {
                            CheckValkyryRequirement({ G, ctx, myPlayerID, ...rest },
                                ValkyryBuffNames.CountPickedCardClassRankAmount);
                        }
                    }
                }
                break;
            default:
                break;
        }
    }
    switch (card.type) {
        case CardTypeRusNames.DwarfPlayerCard:
        case CardTypeRusNames.HeroPlayerCard:
        case CardTypeRusNames.MercenaryPlayerCard:
        case CardTypeRusNames.MythicalAnimalPlayerCard:
        case CardTypeRusNames.SpecialPlayerCard:
        case CardTypeRusNames.MultiSuitPlayerCard:
        case CardTypeRusNames.ArtefactPlayerCard:
            player.cards[card.suit].push(card);
            break;
        default:
            _exhaustiveCheck = card;
            throw new Error(`Карта имеющая принадлежность к фракции должна быть добавлена на стол игрока.`);
            return _exhaustiveCheck;
    }
    if (card.name !== HeroNames.Thrud) {
        CheckAndMoveThrudAction({ G, ctx, myPlayerID, ...rest }, card);
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
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let _exhaustiveCheck: never;
    switch (card.type) {
        case CardTypeRusNames.GodCard:
            card.isActivated = false;
            break;
        case CardTypeRusNames.GiantCard:
            card.isActivated = false;
            player.giantTokenSuits[card.placedSuit] = true;
            break;
        case CardTypeRusNames.ValkyryCard:
            card.strengthTokenNotch = 0;
            break;
        default:
            _exhaustiveCheck = card;
            throw new Error(`Добавленная в командную зону для карт мифических существ карта не может быть с недопустимым типом.`);
            return _exhaustiveCheck;
    }
    player.mythologicalCreatureCards.push(card);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Игрок '${player.nickname}' выбрал карту '${card.type}' '${card.name}' в командную зону карт Idavoll.`);
};

// TODO Rework func description!!!
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
 * @param pickedCard Выбранная карта дворфа/мифического существа или улучшения монет.
 * @returns Добавлена ли карта на поле игрока.
 */
export const AddAnyCardToPlayerActions = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    pickedCard: AllPickedCardType): void => {
    let finalPickedCard: AllCardType = pickedCard;
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let startGiant = false,
        _exhaustiveCheck: never;
    switch (pickedCard.type) {
        case CardTypeRusNames.SpecialCard:
            finalPickedCard = AddSpecialCardToPlayerCards(pickedCard);
            break;
        case CardTypeRusNames.MultiSuitCard:
            finalPickedCard = AddMultiSuitCardToPlayerCards(pickedCard);
            break;
        case CardTypeRusNames.ArtefactCard:
        case CardTypeRusNames.MercenaryCard:
            finalPickedCard = AddCampCardToCards({ G, ctx, myPlayerID, ...rest }, pickedCard);
            break;
        case CardTypeRusNames.HeroCard:
            finalPickedCard = AddHeroToPlayerCards({ G, ctx, myPlayerID, ...rest }, pickedCard);
            break;
        case CardTypeRusNames.DwarfCard:
            if (G.expansions.Idavoll.active) {
                if (ctx.phase === PhaseNames.TavernsResolution && ctx.activePlayers === null) {
                    switch (pickedCard.playerSuit) {
                        case SuitNames.blacksmith:
                            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest },
                                GiantBuffNames.PlayerHasActiveGiantThrivaldi)) {
                                AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                                    [AllStackData.activateGiantAbilityOrPickCard(GiantNames.Thrivaldi,
                                        pickedCard)]);
                                startGiant = true;
                            }
                            break;
                        case SuitNames.explorer:
                            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest },
                                GiantBuffNames.PlayerHasActiveGiantGymir)) {
                                AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                                    [AllStackData.activateGiantAbilityOrPickCard(GiantNames.Gymir,
                                        pickedCard)]);
                                startGiant = true;
                            }
                            break;
                        case SuitNames.hunter:
                            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest },
                                GiantBuffNames.PlayerHasActiveGiantSkymir)) {
                                AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                                    [AllStackData.activateGiantAbilityOrPickCard(GiantNames.Skymir,
                                        pickedCard)]);
                                startGiant = true;
                            }
                            break;
                        case SuitNames.miner:
                            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest },
                                GiantBuffNames.PlayerHasActiveGiantHrungnir)) {
                                AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                                    [AllStackData.activateGiantAbilityOrPickCard(GiantNames.Hrungnir,
                                        pickedCard)]);
                                startGiant = true;
                            }
                            break;
                        case SuitNames.warrior:
                            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest },
                                GiantBuffNames.PlayerHasActiveGiantSurt)) {
                                AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                                    [AllStackData.activateGiantAbilityOrPickCard(GiantNames.Surt,
                                        pickedCard)]);
                                startGiant = true;
                            }
                            break;
                        default:
                            _exhaustiveCheck = pickedCard;
                            throw new Error(`Карта имеющая принадлежность к фракции должна быть добавлена на стол игрока.`);
                            return _exhaustiveCheck;
                    }
                }
            }
            // TODO Check if i have Giant and not captured dwarf activate Capturing Or Dwarf Picking
            if (!startGiant) {
                if (G.expansions.Idavoll.active
                    && CheckIsStartUseGodAbility({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest },
                        GodNames.Frigg)) {
                    AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                        [AllStackData.activateGodAbilityOrNot(GodNames.Frigg, pickedCard)]);
                    return;
                } else {
                    finalPickedCard = AddDwarfToPlayerCards(pickedCard);
                }
            }
            break;
        case CardTypeRusNames.MythicalAnimalCard:
            finalPickedCard = AddMythicalAnimalToPlayerCards(pickedCard);
            break;
        case CardTypeRusNames.RoyalOfferingCard:
            if (G.expansions.Idavoll.active && ctx.phase === PhaseNames.TavernsResolution && ctx.activePlayers === null
                && CheckIsStartUseGodAbility({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest },
                    GodNames.Frigg)) {
                AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                    [AllStackData.activateGodAbilityOrNot(GodNames.Frigg, pickedCard)]);
                return;
            } else {
                // TODO Move all Log from pickedCard to bottom of the func and to playerCards!
                AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Игрок '${player.nickname}' выбрал карту '${pickedCard.type}' '${pickedCard.name}'.`);
                DiscardCurrentCard({ G, ctx, ...rest }, pickedCard);
                AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Карта '${pickedCard.type}' '${pickedCard.name}' убрана в сброс после применения её эффекта.`);
            }
            break;
        case CardTypeRusNames.GodCard:
        case CardTypeRusNames.GiantCard:
        case CardTypeRusNames.ValkyryCard:
            if (G.expansions.Idavoll.active) {
                AddMythologicalCreatureCardToPlayerCommandZone({ G, ctx, myPlayerID, ...rest }, pickedCard);
            }
            break;
        default:
            _exhaustiveCheck = pickedCard;
            throw new Error(`Добавленная на поле игрока карта не может быть с недопустимым типом.`);
            return _exhaustiveCheck;
    }
    if (`suit` in finalPickedCard) {
        AddCardToPlayerBoardCards({ G, ctx, myPlayerID, ...rest }, finalPickedCard);
    }
    if (`stack` in pickedCard && pickedCard.stack !== undefined) {
        if (G.mode === GameModeNames.Solo && myPlayerID === `1`) {
            AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                pickedCard.stack.soloBot ?? pickedCard.stack.player, pickedCard);
        } else if (G.mode === GameModeNames.SoloAndvari && myPlayerID === `1`) {
            AddActionsToStack({ G, ctx, myPlayerID, ...rest },
                pickedCard.stack.soloBotAndvari ?? pickedCard.stack.player, pickedCard);
        } else {
            if (!(G.expansions.Idavoll.active && (pickedCard.name === HeroNames.Bonfur
                || pickedCard.name === HeroNames.CrovaxTheDoppelganger
                || (pickedCard.name === HeroNames.Dagda && CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest },
                    MythicalAnimalBuffNames.DagdaDiscardOnlyOneCards)))
                && CheckIsStartUseGodAbility({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest },
                    GodNames.Thor))) {
                // TODO Check if Thor & Durathor add for Dagda can not discard both cards at all!?
                AddActionsToStack({ G, ctx, myPlayerID, ...rest }, pickedCard.stack.player,
                    pickedCard);
            }
        }
    }
    if (`actions` in pickedCard) {
        StartAutoAction({ G, ctx, myPlayerID, ...rest }, pickedCard.actions);
    }
};
