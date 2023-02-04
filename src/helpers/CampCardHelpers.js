import { CreateArtefactPlayerCard, CreateMercenaryPlayerCard } from "../Camp";
import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { CampBuffNames, CardTypeRusNames, ErrorNames, HeroBuffNames, LogTypeNames, PhaseNames } from "../typescript/enums";
import { AddBuffToPlayer, CheckPlayerHasBuff, DeleteBuffFromPlayer } from "./BuffHelpers";
import { RemoveCoinFromMarket } from "./DiscardCoinHelpers";
import { AddActionsToStack } from "./StackHelpers";
/**
 * <h3>Действия, связанные с добавлением карты лагеря артефакта в массив карт на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря артефакта, добавляющейся на поле игрока.</li>
 * </ol>
 *
 * @param context
 * @param card Карта.
 * @returns Карта артефакт на поле игрока.
 */
export const AddArtefactToPlayerCards = (card) => {
    if (card.playerSuit !== null && card.rank !== null) {
        return CreateArtefactPlayerCard({
            name: card.name,
            path: card.path,
            description: card.description,
            suit: card.playerSuit,
            points: card.points,
            rank: card.rank,
        });
    }
    throw new Error(`Карта '${card.type}' '${card.name}' должна иметь параметры 'playerSuit' и 'rank'.`);
};
/**
 * <h3>Действия, связанные с добавлением карты наёмника в массив карт на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты наёмника, добавляющейся на поле игрока.</li>
 * </ol>
 *
 * @param context
 * @param card Карта.
 * @returns Карта наёмник на поле игрока.
 */
export const AddMercenaryToPlayerCards = (card) => {
    if (card.playerSuit !== null && card.rank !== null) {
        return CreateMercenaryPlayerCard({
            name: card.name,
            path: card.path,
            suit: card.playerSuit,
            points: card.points,
            rank: card.rank,
        });
    }
    throw new Error(`Карта '${card.type}' '${card.name}' должна иметь параметры 'playerSuit' и 'rank'.`);
};
/**
 * <h3>Действия, связанные с добавлением карт лагеря в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт лагеря, добавляющихся на поле игрока.</li>
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
    if (!(card.type === CardTypeRusNames.MercenaryCard && card.playerSuit === null)) {
        AddCampCardToPlayerCampCards({ G, ctx, myPlayerID, ...rest }, card);
        if (G.odroerirTheMythicCauldron) {
            AddCoinOnOdroerirTheMythicCauldronCampCard({ G, ctx, ...rest });
        }
        if (card.type === CardTypeRusNames.ArtefactCard) {
            AddBuffToPlayer({ G, ctx, myPlayerID, ...rest }, card.buff);
            return AddArtefactToPlayerCards(card);
        }
        if (card.type === CardTypeRusNames.MercenaryCard && ctx.phase === PhaseNames.EnlistmentMercenaries) {
            AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.placeEnlistmentMercenaries(card)]);
        }
        return AddMercenaryToPlayerCards(card);
    }
    return card;
};
/**
 * <h3>Добавляет взятую из лагеря карту в массив карт лагеря игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты лагеря игроком.</li>
 * </ol>
 *
 * @param context
 * @param card Карта.
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
    const minCoinValue = G.royalCoins.reduceRight((prev, curr) => prev.value < curr.value ? prev : curr).value, minCoinIndex = G.royalCoins.findIndex((coin) => coin.value === minCoinValue);
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