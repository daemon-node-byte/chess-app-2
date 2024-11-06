import React from 'react';
import clsx from 'clsx';
import { Chess } from 'chess.js'
import { Icon } from '@iconify/react';
import './App.css';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']

const COLORS = {
  TILE: {
    LITE: 'bg-gray-300',
    DARK: 'bg-green-600'
  },
  PLAYER: {
    WHITE: 'text-white',
    BLACK: 'text-black'
  }
}

function App() {
  const [position, setPosition] = React.useState<any[] | null>(null)
  console.log("🚀 ~ App ~ position:", position)


  React.useEffect(() => {
    const chess = new Chess()

    if (position === null) {
      setPosition(chess.board())
    }
  }, [position])
  return (
    <div className='App h-[100vh] w-[100vw] bg-indigo-800 text-gray-50'>
      <div className={`flex justify-center items-center`}>

        <div id='chessBoard' className={clsx('grid grid-cols-8 grid-rows-8', 'border-2 border-black')}>
          {position && position.map((row: any, rowIndex: number) => {
            return row.map((cell: any, cellIndex: number) => {
              const coordinates = `${files[cellIndex]}${ranks[rowIndex]}`
              return (
                <div key={coordinates} id={coordinates} className=''></div>
                // <div key={`${files[cellIndex]ranks[rowIndex]}`}></div>
              )
          })
        })}
        </div>
      </div>
    </div>
  );
}

export default App;
