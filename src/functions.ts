export const getChessPiece = (char: string) => {
  const piece = char.toLowerCase()
  const iconString = (val) => `fa6-solid:chess-${val}`
  switch (piece) {
    case 'p':
      return 'pawn'
    case 'r':
      return 'rook'
    case 'n':
      return 'knight'
    case 'b':
      return 'bishop'
    case 'q':
      return 'queen'
    case 'k':
      return 'king'
    default:
      return ''
  }
}