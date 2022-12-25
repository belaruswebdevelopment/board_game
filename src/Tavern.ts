import { ThrowMyError } from "./Error";
import { GetCardsFromCardDeck, GetMythologicalCreatureCardsFromMythologicalCreatureCardDeck } from "./helpers/DecksHelpers";
import { DiscardCurrentCard, RemoveCardFromTavern } from "./helpers/DiscardCardHelpers";
import { AddDataToLog } from "./Logging";
import { ErrorNames, GameModeNames, LogTypeNames, TavernNames } from "./typescript/enums";
import type { FnContext, IndexOf, ITavernInConfig, TavernAllCardType, TavernCardType, TavernCardWithExpansionType, TavernsConfigType, TavernsType, TierType } from "./typescript/interfaces";

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
 * @param context
 * @returns Нет ли карт в текущей таверне.
 */
export const CheckIfCurrentTavernEmpty = ({ G }: FnContext): boolean => {
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
 * @param context
 * @returns
 */
export const DiscardCardIfTavernHasCardFor2Players = ({ G, ctx, ...rest }: FnContext): void => {
    if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer) && ctx.numPlayers !== 2) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.OnlyInSoloOrTwoPlayersGame);
    }
    const currentTavernConfig: ITavernInConfig = tavernsConfig[G.currentTavern];
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Лишняя карта из текущей таверны ${currentTavernConfig.name} должна быть убрана в сброс при игре ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) ? `в соло режиме` : `на двух игроков в игре`}.`);
    DiscardCardFromTavern({ G, ctx, ...rest });
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
 * @param context
 * @returns Сброшена ли карта из таверны.
 */
export const DiscardCardFromTavern = ({ G, ctx, ...rest }: FnContext): void => {
    const currentTavern: TavernAllCardType = G.taverns[G.currentTavern],
        cardIndex: number = currentTavern.findIndex((card: TavernCardType): boolean => card !== null);
    if (cardIndex === -1) {
        return ThrowMyError({ G, ctx, ...rest },
            ErrorNames.DoNotDiscardCardFromCurrentTavernIfNoCardInTavern, G.currentTavern);
    }
    DiscardConcreteCardFromTavern({ G, ctx, ...rest }, cardIndex);
};

/**
 * <h3>Сбрасывает конкретную карту из таверны в стопку сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При автоматическом сбросе конкретной лишней карты из таверны.</li>
 * <li>При сбросе конкретной карты из таверны после выбора первым игроком карты из лагеря при игре на двух игроков.</li>
 * </ol>
 *
 * @param context
 * @param tavernCardId Индекс сбрасываемой карты в таверне.
 * @returns Сброшена ли карта из таверны.
 */
export const DiscardConcreteCardFromTavern = ({ G, ctx, ...rest }: FnContext, tavernCardId: number): void => {
    const discardedCard: TavernCardWithExpansionType = RemoveCardFromTavern({ G, ctx, ...rest }, tavernCardId);
    DiscardCurrentCard({ G, ctx, ...rest }, discardedCard);
    const currentTavernConfig: ITavernInConfig = tavernsConfig[G.currentTavern];
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Карта '${discardedCard.type}' '${discardedCard.name}' из таверны ${currentTavernConfig.name} убрана в сброс.`);
};

/**
 * <h3>Автоматически заполняет все таверны картами текущей эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при подготовке к фазе 'Ставки'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const RefillTaverns = ({ G, ctx, ...rest }: FnContext): void => {
    for (let t = 0; t < G.tavernsNum; t++) {
        let refillDeck: TavernAllCardType;
        if (G.expansions.Idavoll.active && G.tierToEnd === 2 && G.round < 3 && t === 1) {
            refillDeck = GetMythologicalCreatureCardsFromMythologicalCreatureCardDeck({ G, ctx, ...rest }, 0,
                G.drawSize);
        } else {
            refillDeck = GetCardsFromCardDeck({ G, ctx, ...rest }, 0,
                (G.secret.decks.length - G.tierToEnd) as TierType, G.drawSize);
        }
        if (refillDeck.length !== G.drawSize) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.TavernCanNotBeRefilledBecauseNotEnoughCards,
                t);
        }
        const tavern: TavernCardType[] = G.taverns[t as IndexOf<TavernsType>];
        tavern.splice(0, tavern.length, ...refillDeck);
        const tavernConfig: ITavernInConfig = tavernsConfig[t as IndexOf<TavernsConfigType>];
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Таверна ${tavernConfig.name} заполнена новыми картами.`);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Все таверны заполнены новыми картами.`);
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
