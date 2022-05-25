import type { Ctx } from "boardgame.io";
import { CreateOlwinDoubleNonPlacedCard } from "../AdditionalCard";
import { AddDataToLog } from "../Logging";
import { CardNames, DrawNames, HeroNames, LogTypes } from "../typescript/enums";
import type { CanBeUndef, IConfig, IMyGameState, IOlwinDoubleNonPlacedCard, IPublicPlayer, PickedCardTypes, SuitTypes } from "../typescript/interfaces";

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
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const config: CanBeUndef<IConfig> = player.stack[0]?.config;
    if (config !== undefined) {
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' должен получить преимущества от действия '${config.drawName}'.`);
        StartOrEndActionStage(G, ctx, config);
        if (G.expansions.thingvellir.active) {
            if (config.drawName === DrawNames.Olwin) {
                const pickedCard: PickedCardTypes = player.pickedCard;
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
        AddDataToLog(G, LogTypes.GAME, `Начало стадии '${config.stageName}'.`);
    } else if (ctx.activePlayers?.[Number(ctx.currentPlayer)] !== undefined) {
        ctx.events?.endStage();
    }
};
