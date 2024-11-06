import React from 'react';
import clsx from 'clsx';
import { Chess } from 'chess.js'

import './App.css';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']

function App() {
  const [position, setPosition] = React.useState<any[] | null>(null)
  const [boardHeight, setBoardHeight] = React.useState<number>(0)
  React.useEffect(() => {
    const chess = new Chess()
    const board = document.getElementById('chessBoard') as HTMLDivElement

    if (position === null) {
      setPosition(chess.board())
    }
    if (board) {
      const boardWidth = board.getBoundingClientRect().width
      setBoardHeight(boardWidth)
    }
  }, [position])
  return (
    <div className='App h-[100vh] w-[100vw] bg-indigo-800 text-gray-50'>
      <div className='h-full flex justify-center items-center'>

        <div id='chessBoard' className={clsx('grid grid-cols-8 grid-rows-8', `w-11/12 md:w-[620px] h-[${boardHeight}]`)}>
          
        </div>
      </div>
    </div>
  );
}

export default App;
