import { COLORS } from "./colors";

const iconString = (val: string) => `fa6-solid:chess-${val}`
export const getChessPiece = (char: string) => {
  const piece = char
  switch (piece) {
    case 'p':
      return iconString('pawn');
    case 'r':
      return iconString('rook');
    case 'n':
      return iconString('knight');
    case 'b':
      return iconString('bishop');
    case 'q':
      return iconString('queen');
    case 'k':
      return iconString('king');
    default:
      return ''
  }
}
const { PLAYER } = COLORS;

export const whiteOrBlack = (char: string) => {
  return char === 'w' ? PLAYER.WHITE : PLAYER.BLACK;
}