import { CreateArtefactPlayerCard, CreateMercenaryPlayerCard } from "../Camp";
import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { AssertRoyalCoinValue } from "../is_helpers/AssertionTypeHelpers";
import { AddDataToLog } from "../Logging";
import { CampBuffNames, CardTypeRusNames, ErrorNames, HeroBuffNames, LogTypeNames, PhaseNames } from "../typescript/enums";
import type { AllCampCardType, ArtefactCard, ArtefactPlayerCard, CampCreatureCommandZoneCardType, CampDeckCardType, CanBeUndefType, FnContext, MercenaryCard, MercenaryPlayerCard, MyFnContextWithMyPlayerID, PublicPlayer, RoyalCoin } from "../typescript/interfaces";
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
export const AddArtefactToPlayerCards = (card: ArtefactCard): ArtefactPlayerCard => {
    if (card.playerSuit !== null && card.rank !== null) {
        return CreateArtefactPlayerCard({
            description: card.description,
            name: card.name,
            path: card.path,
            points: card.points,
            rank: card.rank,
            suit: card.playerSuit,
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
export const AddMercenaryToPlayerCards = (card: MercenaryCard): MercenaryPlayerCard => {
    if (card.playerSuit !== null && card.rank !== null) {
        return CreateMercenaryPlayerCard({
            name: card.name,
            path: card.path,
            points: card.points,
            rank: card.rank,
            suit: card.playerSuit,
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
export const AddCampCardToCards = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, card: CampDeckCardType):
    AllCampCardType => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (ctx.phase === PhaseNames.TavernsResolution && ctx.activePlayers === null
        && (ctx.currentPlayer === G.publicPlayersOrder[0]
            || CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, CampBuffNames.GoCamp))) {
        G.campPicked = true;
    }
    if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.GoCampOneTime)) {
        DeleteBuffFromPlayer({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.GoCampOneTime);
    }
    if (G.odroerirTheMythicCauldron) {
        AddCoinOnOdroerirTheMythicCauldronCampCard({ G, ctx, ...rest });
    }
    if (card.type === CardTypeRusNames.ArtefactCard) {
        AddBuffToPlayer({ G, ctx, myPlayerID, ...rest }, card.buff);
        if (card.playerSuit !== null && card.rank !== null) {
            return AddArtefactToPlayerCards(card);
        }
    }
    if (card.type === CardTypeRusNames.MercenaryCard) {
        if (ctx.phase === PhaseNames.EnlistmentMercenaries) {
            AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.placeEnlistmentMercenaries(card)]);
        }
        if (card.playerSuit !== null && card.rank !== null) {
            return AddMercenaryToPlayerCards(card);
        }
    }
    AddCampCardToPlayerCampCards({ G, ctx, myPlayerID, ...rest }, card);
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
const AddCampCardToPlayerCampCards = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    card: CampCreatureCommandZoneCardType): void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
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
export const AddCoinOnOdroerirTheMythicCauldronCampCard = ({ G, ctx, ...rest }: FnContext): void => {
    const minCoinValue: number = G.royalCoins.reduceRight((prev: RoyalCoin, curr: RoyalCoin): RoyalCoin =>
        prev.value < curr.value ? prev : curr).value;
    AssertRoyalCoinValue(minCoinValue);
    const minCoinIndex: number =
        G.royalCoins.findIndex((coin: RoyalCoin): boolean => coin.value === minCoinValue);
    if (minCoinIndex === -1) {
        throw new Error(`Не существует минимальная монета на рынке с значением - '${minCoinValue}'.`);
    }
    const coin: RoyalCoin = RemoveCoinFromMarket({ G, ctx, ...rest }, minCoinIndex);
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
export const GetOdroerirTheMythicCauldronCoinsValues = ({ G }: MyFnContextWithMyPlayerID): number =>
    G.odroerirTheMythicCauldronCoins.reduce((prev: number, curr: RoyalCoin): number =>
        prev + curr.value, 0);
