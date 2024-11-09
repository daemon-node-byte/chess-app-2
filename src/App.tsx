import React from "react";
import clsx from "clsx";
import { Chess } from "chess.js";
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
const isSelfSelected = (selected: 'w' | 'b', turn: 'w' | 'b') => {
  return selected === turn;
}
const ChessPiece = ({
  pieceType,
  player,
  coordinates,
  onClick
}: {
  pieceType: string;
  player: string;
  coordinates: string;
  onClick: (id: string, isGamePiece: boolean) => void;
}) => {
  const pgnMapper = {
    type: player === 'w' ? pieceType.toUpperCase() : pieceType,
    square: coordinates,
  }

  return (
  <Icon
    id={`${coordinates}`}
    color={player === 'w' ? COLORS.PLAYER.WHITE : COLORS.PLAYER.BLACK}
    icon={getChessPiece(pieceType)}
    className={clsx("text-5xl", whiteOrBlack(player), 'target')}
    onClick={() => onClick(coordinates, true)}
    mode='svg'
    data-player={player}
  />
);
}

const updateSelection = (targetId: string, nodeList: NodeListOf<Element>) => {
  nodeList.forEach((node: Element) => {
    node = node as HTMLDivElement
    if (node.classList.contains('selected')) {
      node.classList.remove('selected');
    }
    if (node.id === targetId) {
      node.classList.add('selected');
    }
  })
}

function App() {
  const [position, setPosition] = React.useState<any[] | null>(null);
  const [game, setGame] = React.useState<Chess | null>(null);
  const [selectedTile, setSelectedTile] = React.useState<string | null>(null);
  const [whoIsTurnNext, setWhoIsTurnNext] = React.useState<string>('w');

  const movePiece = (id: string, isGamePiece: boolean) => {
    const square = document.getElementById(id);
    const whosSquare = square?.getAttribute('data-player');
    console.log("🚀 ~ movePiece ~ whosSquare:", whosSquare)
    const pieces = document.querySelectorAll('.target');
    if (selectedTile === null && isGamePiece && square?.id !== selectedTile) {
      updateSelection(id, pieces);
      setSelectedTile(id);
    }

  }
  
  React.useEffect(() => {
    setWhoIsTurnNext(game?.turn() === 'w' ? 'w' : 'b');
    if (game === null) {
      setGame(new Chess());
    }
    if (position === null && game !== null) {
      setPosition(game.board());
    }
    if (selectedTile !== null) {

      console.log(selectedTile);
    }
  }, [position, game, selectedTile, whoIsTurnNext]);

  return (
    <div className="App h-[100vh] w-[100vw] bg-indigo-800 text-gray-50">
      <div className={`flex justify-center items-center`}>
        <section id='info'>
          <h1 className='text-3xl'>Chess</h1>
          <p className='text-xl'>Next Turn:</p>
            <p className={clsx(whoIsTurnNext === 'w' ? 'bg-white text-black' : 'bg-black text-white', 'transition-colors p-2 rounded')}>{whoIsTurnNext === 'w' ? 'White' : 'Black'}</p>
            
          {/* <p className='text-xl'>FEN: <span>{fen}</span></p> */}
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
                return (
                  <div
                    key={coordinates}
                    id={!cell ? coordinates : `${cellIndex}-square`}
                    onClick={() => !cell ? movePiece(coordinates, false) : console.log('occupied')}
                    className={clsx(
                      "h-16 w-16",
                      tileColor,
                      "flex justify-center items-center relative",
                      "cursor-pointer",
                      "square",
                      "transition-all"
                    )}
                  >
                    {cell && (
                      <ChessPiece
                        coordinates={coordinates}
                        onClick={movePiece}
                        pieceType={cell.type}
                        player={cell.color}
                      />
                    )}
                    <span className="text-xs absolute bottom-0 right-0 text-black">
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
