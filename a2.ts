// chess game INDEV

type Board = {
    pieceType: number,
    pieceColor: number,

    arrayIndex: number,
    access: string
}

type SquareToEdge = {
    northDirection: number,
    southDirection: number,
    westDirection: number,
    eastDirection: number,
    minNorthWestDirection: number,
    minNorthEastDirection: number,
    minSouthWestDirection: number,
    minSouthEastDirection: number,

    arrayIndex: number,
    access: string
}

type Move = {
    currentPos: string, 
    nextPos: string,
    selectedPiece: number
}

/////////////////////////////////////////////////////////////

class Pieces {
    static Pawn = 1; // first play: move 2 row straight then move 1 row straight
    static Bishop = 2; // move diagonal
    static Knight = 3; // how do i code this 
    static Rook = 4; // move horizontal, vertical
    static Queen = 5; // move diagonal, horizontal, vertical
    static King = 6; // move around itself

    static White = 8;
    static Black = 16;
}

const processSideData: { board: Board[], remainingSquareToEdge: SquareToEdge[], movePosition: Move, moveablePosition: number[] } = {
    board: new Array(64).fill(undefined).map((placeholder, i: number) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        return {
            pieceType: 0,
            pieceColor: 0,
    
            arrayIndex: i,
            access: `${row}${col}`
        };
    }),
    
    remainingSquareToEdge: new Array(64).fill(undefined).map((placeholder, i: number) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
    
        return {
            northDirection: 0,
            southDirection: 0,
            westDirection: 0,
            eastDirection: 0,
            minNorthWestDirection: 0,
            minNorthEastDirection: 0,
            minSouthWestDirection: 0,
            minSouthEastDirection: 0,
    
            arrayIndex: i,
            access: `${row}${col}`
        }
    }),
    
    movePosition: {
        currentPos: '0',
        nextPos: '0',
        selectedPiece: 0
    },

    moveablePosition: [
        
    ]

}

const readOnlyData: { directionOffsets: ReadonlyArray<number>, directionIndexStr: ReadonlyArray<string> } = {
    directionOffsets: [
        8, -8, -1, 1, 7, -7, 9, -9
    ],
    
    directionIndexStr: [
        'northDirection',
        'southDirection',
        'westDirection',
        'eastDirection',
        'minNorthWestDirection',
        'minSouthEastDirection',
        'minNorthEastDirection',
        'minSouthWestDirection',
    ]

}

/////////////////////////////////////////////////////////////

function loadPosition(fen: string): Board[] {
    const pieces: {p: number, b: number, n: number, r: number, q: number, k: number} = {
        'p': Pieces.Pawn, 'b': Pieces.Bishop, 'n': Pieces.Knight,
        'r': Pieces.Rook, 'q': Pieces.Queen, 'k': Pieces.King
    }

    const fenArr: string[] = fen.split('');

    let row: number = 7, col: number = 0;

    for (let i: number = 0; i < fenArr.length; i++) {

        if (fenArr[i] === '/') {
            row--; col = 0;
        } else {
            if (/^[0-9]$/.test(fenArr[i])) {
                col += parseInt(fenArr[i], 10);
            } else {
                const pieceType: number = pieces[fenArr[i].toLowerCase()];
                const pieceColor: number = (fenArr[i].toUpperCase() === fenArr[i]) ? Pieces.White : Pieces.Black;
                const index: number = row * 8 + col;

                processSideData.board[index] = {
                    ...processSideData.board[index],
                    pieceType: pieceType,
                    pieceColor: pieceColor,
                };

                col++
            }
        }
    }


    return processSideData.board;
}

function sqToEdge(): SquareToEdge[] {
    for (let row: number = 0; row < 8; row++) {
        for (let col: number = 0; col < 8; col++) {

            const north: number = 7 - col;
            const south: number = col;

            const west: number = row;
            const east: number = 7 - row;

            const index: number = col * 8 + row;

            processSideData.remainingSquareToEdge[index] = {
                ...processSideData.remainingSquareToEdge[index],

                northDirection: north,
                southDirection: south,
                westDirection: west,
                eastDirection: east,
                minNorthWestDirection: Math.min(north, west),
                minSouthEastDirection: Math.min(south, east),
                minNorthEastDirection: Math.min(north, east),
                minSouthWestDirection: Math.min(south, west),
            }
        }
    }

    return processSideData.remainingSquareToEdge;
}

sqToEdge();

function moveFunction(key: string): string {
    setMovePosition(key)
    pieceValidation();
    executeMovePosition();
    
    return 'moving process ended';
}

function pieceValidation(): void {
    let oppositPieceColor: number = 0;
    const startDirectionIndex: number = (processSideData.movePosition.selectedPiece === Pieces.Bishop) ? 4 : 0;
    const endDirectionIndex: number = (processSideData.movePosition.selectedPiece === Pieces.Rook) ? 4 : 8;

    switch (processSideData.board[processSideData.board.findIndex((obj: Board) => obj.access === processSideData.movePosition.currentPos)].pieceColor) {
        case 8:
            oppositPieceColor = 16;
            break;
        case 16:
            oppositPieceColor = 8;
            break;
    }

    for (let directionIndex: number = startDirectionIndex; directionIndex < endDirectionIndex; directionIndex++) {
        for (let i: number = 0; i < processSideData.remainingSquareToEdge[processSideData.board[processSideData.board.findIndex((obj: Board) => obj.access === processSideData.movePosition.currentPos)].arrayIndex][readOnlyData.directionIndexStr[directionIndex]]; i++) {

            // remainingSquareToEdge[movePosition.currentPos NOTE: 0-63][directionIndexKey[directionIndex] NOTE: only return targeted direction key]; in this case is
            // remainingSquareToEdge["0"]["northDirection"] or remainingSquareToEdge[0].northDirection
            
            const preComputedTargetSquare: number = processSideData.board[processSideData.board.findIndex((obj: Board) => obj.access === processSideData.movePosition.currentPos)].arrayIndex + readOnlyData.directionOffsets[directionIndex] * ( i + 1 );

            // if block by friendly piece then unable to move any further
            if (processSideData.board[preComputedTargetSquare].pieceColor === processSideData.board[processSideData.board.findIndex((obj: Board) => obj.access === processSideData.movePosition.currentPos)].pieceColor) {
                break;
            }

            // cant move any further after capture enemy piece
            if (processSideData.board[preComputedTargetSquare].pieceColor === oppositPieceColor) {
                break;
            }
            
            console.log(preComputedTargetSquare);

        }
    }
}

function setMovePosition(input: string): void {
    const moveAccessKey: string[] = input.split('');
    
    for (let i: number = 0; i < moveAccessKey.length; i++) {
        switch (i) {
            case 0:
                processSideData.movePosition.currentPos = `${moveAccessKey[i]}${moveAccessKey[i += 1]}`;
                continue;
            case 3:
                processSideData.movePosition.nextPos = `${moveAccessKey[i]}${moveAccessKey[i += 1]}`;
                break;
            default:
                continue;
        }
    }

    processSideData.movePosition.selectedPiece = processSideData.board[processSideData.board.findIndex((obj: Board) => obj.access === processSideData.movePosition.currentPos)].pieceType
    return;
}

function executeMovePosition(): void {
    const curIndx: number = processSideData.board.findIndex((obj: Board) => obj.access === processSideData.movePosition.currentPos); // finds board.access that is equal to movePosition.currentPos if founded, returns arrayIndex, stores in this variable
    const targetIndx: number = processSideData.board.findIndex((obj: Board) => obj.access === processSideData.movePosition.nextPos); // target index

    const currentObject: Board = processSideData.board[curIndx]; // 00
    const targetObject: Board = processSideData.board[targetIndx]; // 74

    const logging: string = `\n${JSON.stringify(processSideData.movePosition)} executed\n${JSON.stringify(processSideData.board[curIndx])} moved to\n${JSON.stringify(processSideData.board[targetIndx])}\n`;
    
    // some kind of bruteforce, but if it works it works
    processSideData.board[curIndx] = {
      pieceType: 0,
      pieceColor: 0,
      arrayIndex: currentObject.arrayIndex,
      access: currentObject.access
    };

    processSideData.board[targetIndx] = {
        ...currentObject,
        arrayIndex: targetObject.arrayIndex,
        access: targetObject.access
    };

    return;
}



console.log(loadPosition("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"));
console.log(moveFunction('10>74'));
console.log(moveFunction('00>30'));
console.log(moveFunction('30>74'));
console.log(processSideData.board);
console.log(processSideData.movePosition);




