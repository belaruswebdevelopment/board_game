import type { Ctx } from "boardgame.io";
import { UpgradeCoinAction } from "../actions/AutoActions";
import { CreateOlwinDoubleNonPlacedCard, IsCardNotActionAndNotNull } from "../Card";
import { AddDataToLog } from "../Logging";
import { CardNames, CoinTypes, DrawNames, HeroNames, LogTypes } from "../typescript/enums";
import type { DeckCardTypes, IConfig, IMyGameState, IOlwinDoubleNonPlacedCard, IPublicPlayer, IStack, PickedCardType, SuitTypes } from "../typescript/interfaces";
import { AddCardToPlayer } from "./CardHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "./HeroHelpers";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";

/**
 * <h3>Действия, связанные с отображением профита.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих профит.</li>
 * <li>При выборе конкретных карт лагеря, дающих профит.</li>
 * <li>При выборе конкретных карт улучшения монет, дающих профит.</li>
 * <li>При игровых моментах, дающих профит.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const DrawCurrentProfit = (G: IMyGameState, ctx: Ctx): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const config: IConfig | undefined = player.stack[0]?.config;
    if (config !== undefined) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} должен получить преимущества от действия '${config.drawName}'.`);
        StartOrEndActionStage(G, ctx, config);
        if (config.drawName === DrawNames.Olwin) {
            const pickedCard: PickedCardType = player.pickedCard;
            if (pickedCard !== null
                && (pickedCard.name === HeroNames.Olwin || pickedCard.name === CardNames.OlwinsDouble)) {
                let suit: SuitTypes | null = null;
                if (`suit` in pickedCard) {
                    suit = pickedCard.suit;
                }
                const olwinDouble: IOlwinDoubleNonPlacedCard = CreateOlwinDoubleNonPlacedCard({
                    suit,
                });
                player.pickedCard = olwinDouble;
            }
        } else if (config.drawName === DrawNames.EnlistmentMercenaries) {
            player.pickedCard = null;
        }
        player.actionsNum = config.number ?? 1;
        if (config.name !== undefined) {
            G.drawProfit = config.name;
        } else {
            G.drawProfit = ``;
        }
    } else {
        G.drawProfit = ``;
    }
};

export const PickCardOrActionCardActions = (G: IMyGameState, ctx: Ctx, card: DeckCardTypes): boolean => {
    const isAdded: boolean = AddCardToPlayer(G, ctx, card);
    if (IsCardNotActionAndNotNull(card)) {
        if (isAdded) {
            CheckAndMoveThrudOrPickHeroAction(G, ctx, card);
        }
    } else {
        AddActionsToStackAfterCurrent(G, ctx, card.stack, card);
        G.discardCardsDeck.push(card);
    }
    return isAdded;
};

/**
 * <h3>Действия, связанные со стартом конкретной стадии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале действий, требующих старта конкретной стадии.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
const StartOrEndActionStage = (G: IMyGameState, ctx: Ctx, config: IConfig): void => {
    if (config.stageName !== undefined) {
        ctx.events?.setActivePlayers({
            currentPlayer: config.stageName,
        });
        AddDataToLog(G, LogTypes.GAME, `Начало стадии ${config.stageName}.`);
    } else if (ctx.activePlayers?.[Number(ctx.currentPlayer)] !== undefined) {
        ctx.events?.endStage();
    }
};

export const UpgradeCoinActions = (G: IMyGameState, ctx: Ctx, coinId: number, type: CoinTypes, isInitial: boolean):
    void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const stack: IStack | undefined = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
    }
    const value: number | undefined = stack.config?.value;
    if (value === undefined) {
        throw new Error(`У игрока в стеке действий отсутствует обязательный параметр 'config.value'.`);
    }
    UpgradeCoinAction(G, ctx, value, coinId, type, isInitial);
};
