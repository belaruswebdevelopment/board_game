import { ThrowMyError } from "./Error";
import { DiscardPickedCard } from "./helpers/DiscardCardHelpers";
import { AddDataToLog } from "./Logging";
import { ErrorNames, GameModeNames, LogTypeNames, TavernNames } from "./typescript/enums";
import type { CanBeUndefType, Ctx, DeckCardType, IMyGameState, IndexOf, ITavernInConfig, TavernAllCardType, TavernCardType, TavernsConfigType, TavernsType } from "./typescript/interfaces";

/**
 * <h3>Проверяет не осталось ли карт в текущей таверне.</h1>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверке необходимость завершения фазы 'Посещение таверн' (если не осталось карт в текущей таверне).</li>
 * <li>При финальных действиях после завершения фазы 'Посещение таверн' (чтобы убедиться, что не осталось карт в текущей таверне).</li>
 * <li>При каждом действии первого игрока в фазу 'Посещение таверн' при игре на двух игроков, если первым игроком выбрана карта из лагеря и нужно сбросить одну карту из таверны в стопку сброса (чтобы убедиться, что остались карты в текущей таверне).</li>
 * <li>При завершении хода последнего игрока в фазу 'Посещение таверн' при игре на двух игроков или в соло режиме, чтобы сбросить одну лишнюю карту из таверны в стопку сброса (чтобы убедиться, что остались карты в текущей таверне).</li>
 * </ol>
 *
 * @param G
 * @returns Нет ли карт в текущей таверне.
 */
export const CheckIfCurrentTavernEmpty = (G: IMyGameState): boolean => {
    const currentTavern: TavernCardType[] = G.taverns[G.currentTavern];
    return currentTavern.every((card: TavernCardType): boolean => card === null);
};

/**
 * <h3>Сбрасывает одну лишнюю карту из таверны в стопку сброса при игре на двух игроков или в соло режиме.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении хода последнего игрока в фазу 'Посещение таверн' при игре на двух игроков или в соло режиме, чтобы сбросить одну лишнюю карту из таверны в стопку сброса.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const DiscardCardIfTavernHasCardFor2Players = (G: IMyGameState, ctx: Ctx): void => {
    if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer) && ctx.numPlayers !== 2) {
        return ThrowMyError(G, ctx, ErrorNames.OnlyInSoloOrTwoPlayersGame);
    }
    const currentTavernConfig: ITavernInConfig = tavernsConfig[G.currentTavern];
    AddDataToLog(G, LogTypeNames.Game, `Лишняя карта из текущей таверны ${currentTavernConfig.name} должна быть убрана в сброс при игре ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) ? `в соло режиме` : `на двух игроков в игре`}.`);
    const isCardDiscarded: boolean = DiscardCardFromTavern(G, ctx);
    if (!isCardDiscarded) {
        return ThrowMyError(G, ctx, ErrorNames.DoNotDiscardCardFromTavernInSoloOrTwoPlayersGame,
            G.currentTavern);
    }
};

/**
 * <h3>Автоматически сбрасывает одну лишнюю карту из таверны в стопку сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игре на двух игроков или в соло режиме, когда сбрасывается одна лишняя карта из таверны в стопку сброса.</li>
 * <li>При сбросе одной лишней карты таверны в колоду сброса, если первый игрок выбрал карту из лагеря.</li>
 * <li>При сбросе одной лишней карты таверны в колоду сброса, если какой-то игрок выбрал в лагере артефакт Jarnglofi и если сброшенная обменная монета была выложена на месте одной из таверн.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Сброшена ли карта из таверны.
 */
export const DiscardCardFromTavern = (G: IMyGameState, ctx: Ctx): boolean => {
    const currentTavern: TavernAllCardType = G.taverns[G.currentTavern],
        cardIndex: number = currentTavern.findIndex((card: TavernCardType): boolean => card !== null);
    if (cardIndex === -1) {
        return ThrowMyError(G, ctx, ErrorNames.DoNotDiscardCardFromCurrentTavernIfNoCardInTavern,
            G.currentTavern);
    }
    return DiscardConcreteCardFromTavern(G, ctx, cardIndex);
};

/**
 * <h3>Сбрасывает конкретную карту из таверны в стопку сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При автоматическом сбросе конкретной лишней карты из таверны.</li>
 * <li>При сбросе конкретной карты из таверны после выбора первым игроком карты из лагеря при игре на двух игроков.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param discardCardIndex Индекс сбрасываемой карты в таверне.
 * @returns Сброшена ли карта из таверны.
 */
export const DiscardConcreteCardFromTavern = (G: IMyGameState, ctx: Ctx, discardCardIndex: number): boolean => {
    const currentTavern: TavernAllCardType = G.taverns[G.currentTavern],
        discardedCard: CanBeUndefType<TavernCardType> = currentTavern[discardCardIndex];
    if (discardedCard === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.DoNotDiscardCardFromCurrentTavernIfCardWithCurrentIdIsUndefined,
            G.currentTavern, discardCardIndex);
    }
    if (discardedCard !== null) {
        DiscardPickedCard(G, discardedCard);
        currentTavern.splice(discardCardIndex, 1, null);
        const currentTavernConfig: ITavernInConfig = tavernsConfig[G.currentTavern];
        AddDataToLog(G, LogTypeNames.Game, `Карта '${discardedCard.type}' '${discardedCard.name}' из таверны ${currentTavernConfig.name} убрана в сброс.`);
        return true;
    }
    return false;
};

/**
 * <h3>Автоматически заполняет все таверны картами текущей эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при подготовке к фазе 'Ставки'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const RefillTaverns = (G: IMyGameState, ctx: Ctx): void => {
    for (let t = 0; t < G.tavernsNum; t++) {
        let refillDeck: TavernAllCardType;
        if (G.expansions.idavoll.active && G.tierToEnd === 2 && G.round < 3 && t === 1) {
            refillDeck = G.secret.mythologicalCreatureDecks.splice(0, G.drawSize);
            G.mythologicalCreatureDeckLength = G.secret.mythologicalCreatureDecks.length;
        } else {
            const currentDeck: CanBeUndefType<DeckCardType[]> = G.secret.decks[G.secret.decks.length - G.tierToEnd];
            if (currentDeck === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentTierDeckIsUndefined);
            }
            refillDeck = currentDeck.splice(0, G.drawSize);
            G.deckLength[G.secret.decks.length - G.tierToEnd] = currentDeck.length;
        }
        if (refillDeck.length !== G.drawSize) {
            return ThrowMyError(G, ctx, ErrorNames.TavernCanNotBeRefilledBecauseNotEnoughCards, t);
        }
        const tavern: TavernCardType[] = G.taverns[t as IndexOf<TavernsType>];
        tavern.splice(0, tavern.length, ...refillDeck);
        const tavernConfig: ITavernInConfig = tavernsConfig[t as IndexOf<TavernsConfigType>];
        AddDataToLog(G, LogTypeNames.Game, `Таверна ${tavernConfig.name} заполнена новыми картами.`);
    }
    AddDataToLog(G, LogTypeNames.Game, `Все таверны заполнены новыми картами.`);
};

/**
 * <h3>Конфиг таверн.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При описании названия таверн в логах.</li>
 * <li>При описании названия таверн в уникальных ключах.</li>
 * </ol>
 */
export const tavernsConfig: TavernsConfigType = [
    {
        name: TavernNames.LaughingGoblin,
    },
    {
        name: TavernNames.DancingDragon,
    },
    {
        name: TavernNames.ShiningHorse,
    },
] as const;
