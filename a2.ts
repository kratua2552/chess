// chess game INDEV

type Board = {
    type: number,
    color: number,

    behav: number,
    indx: number,
    access: string
}

type SquareToEdge = {
    northDir: number,
    southDir: number,
    westDir: number,
    eastDir: number,
    minNorthwestDir: number,
    minNortheastDir: number,
    minSouthwestDir: number,
    minSoutheastDir: number, 

    indx: number,
    access: string
}

type Move = {
    currentPos: string, 
    nextPos: string,
    selecting: number
}

/////////////////////////////////////////////////////////////

class Pieces {
    static Pawn = 1;
    static Bishop = 2;
    static Knight = 3;
    static Rook = 4;
    static Queen = 5;
    static King = 6;

    static White = 8;
    static Black = 16;
}

const processData: { board: Board[], sqToEdge: SquareToEdge[], movPos: Move, moveablePos: number[] } = {
    board: new Array(64).fill(undefined).map((placeholder, i: number) => {
        const row = Math.floor(i / 8);
        const col = i % 8;

        return {
            type: 0,
            color: 0,
            behav: 0,
    
            indx: i,
            access: `${row}${col}`
        };
    }),
    
    sqToEdge: new Array(64).fill(undefined).map((placeholder, i: number) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
    
        return {
            northDir: 0,
            southDir: 0,
            westDir: 0,
            eastDir: 0,
            minNorthwestDir: 0,
            minNortheastDir: 0,
            minSouthwestDir: 0,
            minSoutheastDir: 0,
    
            indx: i,
            access: `${row}${col}`
        }
    }),
    
    movPos: {
        currentPos: '0',
        nextPos: '0',
        selecting: 0
    },

    moveablePos: [
        
    ]

}

const readOnlyData: { dirOffsets: ReadonlyArray<number>, dirIndx: ReadonlyArray<string>, dirOffsetsKnight: ReadonlyArray<[number, number]> } = {

    dirOffsetsKnight: [
        [-2, -1], [-1, -2], [1, -2], [2, -1], 
        [2, 1], [1, 2], [-1, 2], [-2, 1]
    ],

    dirOffsets: [
        8, -8, -1, 1, 7, -7, 9, -9
    ],
    
    dirIndx: [
        'northDir',
        'southDir',
        'westDir',
        'eastDir',
        'minNorthwestDir',
        'minSoutheastDir',
        'minNortheastDir',
        'minSouthwestDir',
    ]

}


///////////////////////////////////////////////////////////// 

const boardInit = {

    loadPos(fen: string): Board[] {
        
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

                    const type: number = pieces[fenArr[i].toLowerCase()];
                    const color: number = (fenArr[i].toUpperCase() === fenArr[i]) ? Pieces.White : Pieces.Black;
                    const index: number = row * 8 + col;
    
                    processData.board[index] = {
                        ...processData.board[index],
                        type: type,
                        color: color,
                    };
    
                    col++
                }
            }
        }
    
        return processData.board;
    },

    sqToEdge(): SquareToEdge[] {

        for (let row: number = 0; row < 8; row++) {

            for (let col: number = 0; col < 8; col++) {
    
                const north: number = 7 - col;
                const south: number = col;
                const west: number = row;
                const east: number = 7 - row;
    
                const index: number = col * 8 + row;
    
                processData.sqToEdge[index] = {
                    ...processData.sqToEdge[index],
    
                    northDir: north,
                    southDir: south,
                    westDir: west,
                    eastDir: east,
                    minNorthwestDir: Math.min(north, west),
                    minSoutheastDir: Math.min(south, east),
                    minNortheastDir: Math.min(north, east),
                    minSouthwestDir: Math.min(south, west),
                }
            }
        }
    
        return processData.sqToEdge;
    }

}

// automatically assign nessessary value

boardInit.loadPos("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
boardInit.sqToEdge();

const moveLogic = {

    move(key: string): string {

        this.setPos(key)
        this.pieceValidate.manage();
    
        let increment: number = 1;
        const movPosLength: number = processData.moveablePos.length;
        const movPos: number[] = processData.moveablePos;
        
        console.log(`current position: ${processData.board[processData.board.findIndex((obj: Board) => obj.access === processData.movPos.currentPos)].indx}`)

        console.log(`target position: ${processData.board[processData.board.findIndex((obj: Board) => obj.access === processData.movPos.nextPos)].indx}`)

        console.log(`possible position: ${movPos}`);
    
        if (movPosLength === 0) {
            console.log(`invalid position`);
            return 'exit1';
        }
    
        for (let i: number = 0; i < movPosLength; i++) {

            if (movPos[i] === processData.board[processData.board.findIndex((obj: Board) => obj.access === processData.movPos.nextPos)].indx) {

                console.log(`position verified tries: ${increment}`)
                this.executePos();
                return 'exit0\n';

            } else {

                console.log(`verifying possible position: ${increment++}/${movPosLength}`)

            }
    
            if (increment > processData.moveablePos.length) {

                console.log(`invalid position`);
                return 'exit1\n';

            }
        }
        return 'something went wrong\n';
    },

    setPos(input: string): void {

        const movAccessKey: string[] = input.split('');
        
        for (let i: number = 0; i < movAccessKey.length; i++) {

            switch (i) {

                case 0:
                    processData.movPos.currentPos = `${movAccessKey[i]}${movAccessKey[i += 1]}`;
                    continue;

                case 3:
                    processData.movPos.nextPos = `${movAccessKey[i]}${movAccessKey[i += 1]}`;
                    break;

                default:
                    continue;

            }
        }
    
        processData.movPos.selecting = processData.board[processData.board.findIndex((obj: Board) => obj.access === processData.movPos.currentPos)].type

        return;
    },

    executePos(): void {

        const curIndx: number = processData.board.findIndex((obj: Board) => obj.access === processData.movPos.currentPos); // finds board.access that is equal to movPos.currentPos if founded, returns indx, stores in this variable
        const targetIndx: number = processData.board.findIndex((obj: Board) => obj.access === processData.movPos.nextPos); // target index
    
        const currentObject: Board = processData.board[curIndx]; // 00
        const targetObject: Board = processData.board[targetIndx]; // 74
        
        // some kind of bruteforce, but if it works it works
        processData.board[curIndx] = {
          type: 0,
          color: 0,
          behav: 0,
          indx: currentObject.indx,
          access: currentObject.access
        };
    
        processData.board[targetIndx] = {
            ...currentObject,
            indx: targetObject.indx,
            access: targetObject.access,
            behav: processData.board[targetIndx].behav = processData.board[targetIndx].behav + 1
        };
    
        return;
    },

    pieceValidate: {

        manage(): void {

            processData.moveablePos = [];
            const selecting: number = processData.movPos.selecting
    
            if ([2, 4, 5].includes(selecting)) {
    
                this.queenRookBishop();
                return;
    
            }
    
            if ([1, 6].includes(selecting)) {
    
                this.kingPawn();
                return;
    
            }
    
            if (3 === selecting) {
    
                this.knight();
                return;
    
            }
    
            if (0 === selecting) {
    
                return;
    
            }
    
            return;
        },

        blockingDetection(): number[] {

            let opponentcolor: number = 0;
            const cachingArray: number[] = [];
            const friendlycolor: number = processData.board[processData.board.findIndex((obj: Board) => obj.access === processData.movPos.currentPos)].color;


            switch (friendlycolor) {

                case 8:
                    opponentcolor = 16;
                    break;

                case 16:
                    opponentcolor = 8;
                    break;

            }

            cachingArray.push(opponentcolor);
            cachingArray.push(friendlycolor);

            return cachingArray;
        },

        queenRookBishop() {

            const color: number[] = this.blockingDetection();
            const startDirectionIndex: number = (processData.movPos.selecting === Pieces.Bishop) ? 4 : 0;
            const endDirectionIndex: number = (processData.movPos.selecting === Pieces.Rook) ? 4 : 8;
        
            for (let directionIndex: number = startDirectionIndex; directionIndex < endDirectionIndex; directionIndex++) {

                for (let i: number = 0; i < processData.sqToEdge[processData.board[processData.board.findIndex((obj: Board) => obj.access === processData.movPos.currentPos)].indx][readOnlyData.dirIndx[directionIndex]]; i++) {
        
                    // sqToEdge[movPos.currentPos NOTE: 0-63][directionIndexKey[directionIndex] NOTE: only return targeted direction key]; in this case is
                    // sqToEdge["0"]["northDir"] or sqToEdge[0].northDir
                    
                    const preComputedTargetSquare: number = processData.board[processData.board.findIndex((obj: Board) => obj.access === processData.movPos.currentPos)].indx + readOnlyData.dirOffsets[directionIndex] * ( i + 1 );
        
                    // if block by friendly piece then unable to move any further
                    if (processData.board[preComputedTargetSquare].color === color[1]) {

                        break;

                    }
        
                    // cant move any further after capture enemy piece
                    if (processData.board[preComputedTargetSquare].color === color[0]) {

                        break;

                    }
                    
                    // console.log(preComputedTargetSquare);
                    processData.moveablePos.push(preComputedTargetSquare);
                }
            }
        },

        kingPawn() {

            const color: number[] = this.blockingDetection();
            const endDirectionIndex: number = (processData.movPos.selecting === Pieces.Pawn) ? 1 : 8;

            for (let directionIndex: number = 0; directionIndex < endDirectionIndex; directionIndex++) {

                for (let i: number = 0; i < Math.min(1, processData.sqToEdge[processData.board[processData.board.findIndex((obj: Board) => obj.access === processData.movPos.currentPos)].indx][readOnlyData.dirIndx[directionIndex]]); i++) {

                    const preComputedTargetSquare: number = processData.board[processData.board.findIndex((obj: Board) => obj.access === processData.movPos.currentPos)].indx + readOnlyData.dirOffsets[directionIndex];
                    console.log(preComputedTargetSquare);
    
                    if (processData.board[preComputedTargetSquare].color === color[1]) {

                        break;

                    }
    
                    if (processData.board[preComputedTargetSquare].color === color[0]) {

                        break;

                    }

                    processData.moveablePos.push(preComputedTargetSquare);
                }
            }
        },

        knight() {

            const color: number[] = this.blockingDetection();
            const currentRow = parseInt((processData.board[processData.board.findIndex((obj: Board) => obj.access === processData.movPos.currentPos)].access[0]))
            const currentCol = parseInt((processData.board[processData.board.findIndex((obj: Board) => obj.access === processData.movPos.currentPos)].access[1]))
        
            for (let directionIndex = 0; directionIndex < 8; directionIndex++) {

                const rowOffset = readOnlyData.dirOffsetsKnight[directionIndex][0];
                const colOffset = readOnlyData.dirOffsetsKnight[directionIndex][1];

                const newRow = currentRow + rowOffset;
                const newCol = currentCol + colOffset;
        
                // corner check
                if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) {

                    continue;

                }
        
                const preComputedTargetSquare = newRow * 8 + newCol;

                if (processData.board[preComputedTargetSquare].color === color[1]) {

                    continue;

                }

                if (processData.board[preComputedTargetSquare].color === color[0]) {

                    continue;

                }

                processData.moveablePos.push(preComputedTargetSquare);
            }
        }
        
    }
}

console.log(moveLogic.move('01>74'));
console.log(processData.movPos);