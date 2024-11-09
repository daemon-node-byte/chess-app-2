import React from "react";
import clsx from "clsx";
import { Chess, Move, type Square } from "chess.js";
import { Icon } from "@iconify/react";
import { getChessPiece, whiteOrBlack } from "./functions";
import "./App.css";
import { COLORS } from "./colors";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

interface CellData {
  type: string;
  color: string;
  square: string;
}

const ChessPiece = ({
  pieceType,
  player,
  coordinates,
  selected,
}:
{
  pieceType: string;
  player: string;
  coordinates: string;
  selected: boolean;
}) => {
  const playerClass = player === "w" ? "white-player" : "black-player";

  return (
    <Icon
      id={`${coordinates}-piece`}
      color={player === "w" ? COLORS.PLAYER.WHITE : COLORS.PLAYER.BLACK}
      icon={getChessPiece(pieceType)}
      className={clsx("text-4xl md:text-5xl", whiteOrBlack(player), selected && "selected-piece", playerClass, 'drop-shadow-lg', 'transition-all')}
      mode="svg"
      data-player={player}
    />
  );
};

function App() {
  const [position, setPosition] = React.useState<any[] | null>(null);
  const [game, setGame] = React.useState<Chess | null>(null);
  const [selectedTile, setSelectedTile] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string>("");
  console.log("🚀 ~ App ~ message:", message)
  const [whoIsTurnNext, setWhoIsTurnNext] = React.useState<string>("w");
  const [validMoves, setValidMoves] = React.useState<(Move[] | string)[]>([]);
  const [lastMove, setLastMove] = React.useState<{ to: string, from: string}>({ to: '', from: '' });


  const handleSquareClick = (id: string, occupied: boolean) => {
    setMessage("");
    setValidMoves([]);
    const selectedColor = document
      .getElementById(id)
      ?.getAttribute("data-player");
      if (selectedTile && occupied && selectedColor === whoIsTurnNext) {
      setSelectedTile(id);
      return;
      }
    if (selectedColor !== whoIsTurnNext && !selectedTile) {
      setMessage("not your turn");
      return;
    }
    if (selectedTile && game) {
      try {
        const move = game.move({
          from: selectedTile,
          to: id,
        });
        if (move) {
          setPosition(game.board());
          setSelectedTile(null);
          setWhoIsTurnNext(game.turn() === "w" ? "w" : "b");
          setValidMoves([]);
          setLastMove({ to: id, from: selectedTile });
        }
      } catch (error: unknown | any) {
        console.error(error);
        setSelectedTile(null);
        setMessage("invalid move");
      }
    } else {
      setSelectedTile(id);
      setValidMoves([]);
    }
  };

  const showValidMoves = React.useCallback((id: string) => {

      setValidMoves([]);
      const move = game?.moves({ square: id as Square, verbose: true })
      if (move) {
        const parse = move.map((m) => m.to)
        setValidMoves((prev) => [...prev, ...parse])
      }

  }, [game])

  React.useEffect(() => {
    setWhoIsTurnNext(game?.turn() === "w" ? "w" : "b");
    if (game === null) {
      setGame(new Chess());
    }
    if (position === null && game !== null) {
      setPosition(game.board());
    }
    if (selectedTile !== null) {
      showValidMoves(selectedTile)
    }

  }, [position, game, selectedTile, whoIsTurnNext, showValidMoves]);

  return (
    <div className="flex flex-col justify-center items-center bg-indigo-800 w-[100vw] h-[100vh] text-gray-50 App">
      <div className={`flex justify-center items-center flex-col h-[100vh]`}>
        <section id="info">
          <p
            className={clsx(
              whoIsTurnNext === "w"
                ? "bg-white text-black"
                : "bg-black text-white",
              "transition-colors p-2 rounded", 'mb-4'
            )}
          >
            {whoIsTurnNext === "w" ? "White " : "Black "} to move
          </p>
        </section>
        <div
          id="chessBoard"
          className={clsx(
            "grid grid-cols-8 grid-rows-8",
            "border-8 border-black"
          )}
        >
          {position &&
            position.map((row: any, rowIndex: number) => {
              const color =
                rowIndex % 2 === 0
                  ? { a: COLORS.TILE.LITE, b: COLORS.TILE.DARK }
                  : { a: COLORS.TILE.DARK, b: COLORS.TILE.LITE };
              return row.map((cell: CellData | null, cellIndex: number) => {
                const coordinates = `${files[cellIndex]}${ranks[rowIndex]}`;
                const tileColor = cellIndex % 2 === 0 ? color.a : color.b;
                const isOccupied = cell ? true : false;
                return (
                  <div
                    key={coordinates}
                    id={`${coordinates}`}
                    onClick={() => handleSquareClick(coordinates, isOccupied)}
                    className={clsx(
                      "w-12 md:w-16 h-12 md:h-16",
                      tileColor,
                      "flex justify-center items-center relative",
                      "cursor-pointer",
                      "square",
                      "hover:border-4 border-yellow-300",
                      selectedTile === coordinates ? "bg-yellow-300" : "",
                      validMoves.includes(coordinates) ? "border-2 !border-fuchsia-500" : "",
                      lastMove.to === coordinates || lastMove.from === coordinates ? "bg-blue-300" : ""
                    )}
                    data-player={cell ? cell.color : "open"}
                  >
                    {cell && (
                      <ChessPiece
                        selected={selectedTile === coordinates}
                        coordinates={coordinates}
                        pieceType={cell.type}
                        player={cell.color}
                      />
                    )}
                    <span className="right-0 bottom-0 absolute text-black text-xs">
                      {coordinates}
                    </span>
                  </div>
                );
              });
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
