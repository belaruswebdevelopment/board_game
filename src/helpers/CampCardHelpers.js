import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { CampBuffNames, CardTypeRusNames, ErrorNames, HeroBuffNames, LogTypeNames, PhaseNames } from "../typescript/enums";
import { AddBuffToPlayer, CheckPlayerHasBuff, DeleteBuffFromPlayer } from "./BuffHelpers";
import { AddCardToPlayer } from "./CardHelpers";
import { RemoveCoinFromMarket } from "./DiscardCoinHelpers";
import { CheckAndMoveThrudAction } from "./HeroActionHelpers";
/**
 * <h3>Действия, связанные с добавлением карт лагеря в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт лагеря, добавляющихся на планшет игрока.</li>
 * </ol>
 *
 * @param context
 * @param card Карта.
 * @returns
 */
export const AddCampCardToCards = ({ G, ctx, myPlayerID, ...rest }, card) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    if (ctx.phase === PhaseNames.TavernsResolution && ctx.activePlayers === null
        && (ctx.currentPlayer === G.publicPlayersOrder[0]
            || CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, CampBuffNames.GoCamp))) {
        G.campPicked = true;
    }
    if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.GoCampOneTime)) {
        DeleteBuffFromPlayer({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.GoCampOneTime);
    }
    if (card.type === CardTypeRusNames.Artefact_Player_Card) {
        AddArtefactPlayerCardToPlayerCards({ G, ctx, myPlayerID, ...rest }, card);
        CheckAndMoveThrudAction({ G, ctx, myPlayerID, ...rest }, card);
    }
    else {
        AddCampCardToPlayerCampCards({ G, ctx, myPlayerID, ...rest }, card);
        if (card.type === CardTypeRusNames.Artefact_Card) {
            AddBuffToPlayer({ G, ctx, myPlayerID, ...rest }, card.buff);
        }
    }
};
/**
 * <h3>Добавляет взятую из лагеря карту в массив карт лагеря игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты лагеря игроком.</li>
 * </ol>
 *
 * @param context
 * @param card Карта лагеря.
 * @returns
 */
const AddCampCardToPlayerCampCards = ({ G, ctx, myPlayerID, ...rest }, card) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    player.campCards.push(card);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Игрок '${player.nickname}' выбрал карту лагеря '${card.type}' '${card.name}'.`);
};
/**
 * <h3>Добавляет карту лагеря в конкретную фракцию игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении карты лагеря в конкретную фракцию игрока.</li>
 * </ol>
 *
 * @param context
 * @param card Карта лагеря.
 * @returns Добавлен ли артефакт на планшет игрока.
 */
const AddArtefactPlayerCardToPlayerCards = ({ G, ctx, myPlayerID, ...rest }, card) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    AddCardToPlayer({ G, ctx, myPlayerID, ...rest }, card);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Игрок '${player.nickname}' выбрал карту лагеря '${card.type}' '${card.name}' во фракцию '${suitsConfig[card.suit].suitName}'.`);
    return true;
};
/**
 * <h3>Действия, связанные с выкладкой монет на артефакт Odroerir The Mythic Cauldron.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const AddCoinOnOdroerirTheMythicCauldronCampCard = ({ G, ctx, ...rest }) => {
    const minCoinValue = G.marketCoins.reduceRight((prev, curr) => prev.value < curr.value ? prev : curr).value, minCoinIndex = G.marketCoins.findIndex((coin) => coin.value === minCoinValue);
    if (minCoinIndex === -1) {
        throw new Error(`Не существует минимальная монета на рынке с значением - '${minCoinValue}'.`);
    }
    const coin = RemoveCoinFromMarket({ G, ctx, ...rest }, minCoinIndex);
    G.odroerirTheMythicCauldronCoins.push(coin);
};
/**
 * <h3>Действия, связанные с завершением выкладки монет на артефакт Odroerir The Mythic Cauldron.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При отрисовке артефакта Odroerir The Mythic Cauldron.</li>
 * <li>При финальном подсчёте очков за артефакт Odroerir The Mythic Cauldron.</li>
 * </ol>
 *
 * @param context
 * @returns Значение всех монет на артефакте Odroerir The Mythic Cauldron.
 */
export const GetOdroerirTheMythicCauldronCoinsValues = ({ G }) => G.odroerirTheMythicCauldronCoins.reduce((prev, curr) => prev + curr.value, 0);
//# sourceMappingURL=CampCardHelpers.js.map