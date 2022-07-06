import type { Ctx } from "boardgame.io";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { CreateOlwinDoubleNonPlacedCard, CreateThrudNonPlacedCard } from "../SpecialCard";
import { CardNames, DrawNames, ErrorNames, HeroNames, LogTypeNames } from "../typescript/enums";
import type { CanBeUndef, IMyGameState, IOlwinDoubleNonPlacedCard, IPublicPlayer, IStack, IThrudNonPlacedCard, PickedCardTypes, SuitTypes } from "../typescript/interfaces";

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
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const stack: CanBeUndef<IStack> = player.stack[0];
    if (stack !== undefined) {
        AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' должен получить преимущества от действия '${stack.drawName}'.`);
        StartOrEndActionStage(G, ctx, stack);
        const pickedCard: PickedCardTypes = player.pickedCard;
        if (stack.drawName === DrawNames.PlaceThrudHero && pickedCard !== null
            && pickedCard.name !== HeroNames.Thrud) {
            // TODO Think about it...
            const thrud: IThrudNonPlacedCard = CreateThrudNonPlacedCard();
            player.pickedCard = thrud;
        } else if (G.expansions.thingvellir.active) {
            if (stack.drawName === DrawNames.PlaceOlwinDouble) {
                let suit: SuitTypes | null | undefined;
                if (pickedCard !== null
                    && (pickedCard.name === HeroNames.Olwin || pickedCard.name === CardNames.OlwinsDouble)) {
                    if (!("suit" in pickedCard)) {
                        throw new Error(`У выбранной карты отсутствует обязательный параметр 'suit'.`);
                    }
                    suit = pickedCard.suit;
                } else {
                    suit = stack.suit;
                    if (suit === undefined) {
                        throw new Error(`У игрока с id '${ctx.currentPlayer}' в стеке действий отсутствует обязательный параметр 'suit'.`);
                    }
                }
                // TODO Think about it...
                const olwinDouble: IOlwinDoubleNonPlacedCard = CreateOlwinDoubleNonPlacedCard({
                    suit,
                });
                player.pickedCard = olwinDouble;
            } else if (stack.drawName === DrawNames.EnlistmentMercenaries) {
                player.pickedCard = null;
            }
        }
        if (stack.name !== undefined) {
            G.drawProfit = stack.name;
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
 * @param stack Стек действий героя.
 */
const StartOrEndActionStage = (G: IMyGameState, ctx: Ctx, stack: IStack): void => {
    if (stack.stageName !== undefined) {
        ctx.events?.setActivePlayers({
            currentPlayer: stack.stageName,
        });
        AddDataToLog(G, LogTypeNames.Game, `Начало стадии '${stack.stageName}'.`);
    } else if (ctx.activePlayers?.[Number(ctx.currentPlayer)] !== undefined) {
        ctx.events?.endStage();
    }
};
