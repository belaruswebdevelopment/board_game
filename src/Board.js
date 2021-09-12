import React from "react";
import {
    DrawTierCards,
    DrawCurrentPlayerTurn,
    DrawWinner,
    DrawMarketCoins,
    DrawCamp,
    DrawTaverns,
    DrawHeroes,
    DrawDistinctions,
    DrawProfit,
} from "./ui/GameBoardUI";
import {
    DrawPlayersBoardsCoins,
    DrawPlayersBoards,
    DrawPlayersHandsCoins,
} from "./ui/PlayerUI";
import {DrawDebugData} from "./ui/DebugUI";
import {DrawLogData} from "./ui/LogUI";

/**
 * <h3>Отрисовка игрового стола.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При отрисовке игрового поля для игроков.</li>
 * </ol>
 */
export class GameBoard extends React.Component {
    OnClickDistinctionCard = (cardId) => {
        this.props.moves.ClickDistinctionCard(cardId);
    };
    OnClickSuitToPlaceCard = (suitId) => {
        this.props.moves.PlaceCard(suitId);
    };
    OnClickSuitToPlaceMercenary = (suitId) => {
        this.props.moves.PlaceEnlistmentMercenaries(suitId);
    };
    OnClickSuitToGetMjollnirProfit = (suitId) => {
        this.props.moves.GetMjollnirProfit(suitId);
    };

    render() {
        const gridClass = "col-span-4",
            classes = "col-span-4 text-center underline border",
            tierCardsUI = DrawTierCards(this),
            currentPlayerTurnUI = DrawCurrentPlayerTurn(this),
            winnerUI = DrawWinner(this),
            marketCoinsUI = DrawMarketCoins(this),
            drawHeroesUI = DrawHeroes(this),
            drawCampUI = this.props.G.expansions.thingvellir.active ? DrawCamp(this) : null,
            drawDistinctionsUI = DrawDistinctions(this),
            drawDistinctionProfitUI = this.props.G.drawProfit ? DrawProfit(this, this.props.G.drawProfit)
                : this.props.G.drawProfit,
            tavernsUI = DrawTaverns(this, gridClass),
            playersBoardsCoinsUI = DrawPlayersBoardsCoins(this),
            playersHandsCoinsUI = DrawPlayersHandsCoins(this),
            playersBoardsUI = DrawPlayersBoards(this),
            logUI = DrawLogData(this),
            debugUI = DrawDebugData(this);
        return (
            <div className="flex">
                <div className="grid auto-cols-min grid-cols-1 md:grid-cols-12 gap-1">
                    <div className={classes}>
                        {tierCardsUI}
                    </div>
                    <div className={classes}>
                        {currentPlayerTurnUI}
                    </div>
                    <div className={classes}>
                        {winnerUI}
                    </div>
                    <div className={`${gridClass} justify-self-center`}>
                        {marketCoinsUI}
                    </div>
                    <div className={`${gridClass} justify-self-center`}>
                        {drawHeroesUI}
                    </div>
                    <div className={`${gridClass} justify-self-center h-full flex flex-col justify-evenly`}>
                        {drawDistinctionsUI}
                        {drawDistinctionProfitUI}
                        {drawCampUI}
                    </div>
                    {tavernsUI}
                    <div className="col-span-full flex flex-col gap-1">
                        <div className="flex flex-col lg:flex-row gap-1">{playersBoardsCoinsUI}</div>
                        <div className="flex flex-col lg:flex-row gap-1">{playersHandsCoinsUI}</div>
                        <div className="flex items-start flex-col lg:flex-row gap-1">{playersBoardsUI}</div>
                    </div>
                </div>
                {logUI}
                {debugUI}
            </div>
        );
    }
}
