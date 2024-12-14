// chess game INDEV

type Board = {
    type: number,
    color: number,

    behav: number,
    indx: number,
    access: string
}

type SquareToEdge = {
    NDir: number,
    SDir: number,
    WDir: number,
    EDir: number,
    NWDir: number,
    NEDir: number,
    SWDir: number,
    SEDir: number, 

    indx: number,
    access: string
}

type Move = {
    curPos: string, 
    nxtPos: string,
    select: number
}


type ReadOnlyData = {
    dirOffsets: ReadonlyArray<number>, 
    dirIndx: ReadonlyArray<string>, 
    dirOffsetsKnight: ReadonlyArray<[number, number]>,
    dirOffsetsPawn: ReadonlyArray<number>,
    dirOffsetsPawn2: ReadonlyArray<number>
}

type Profiles = {
    win: number,
    lose: number,
    draw: number,

    kingPos: number
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

const data: { board: Board[], sqToEdge: SquareToEdge[], movPos: Move, moveablePos: number[], whitePfp: Profiles, blackPfp: Profiles } = {
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
            NDir: 0,
            SDir: 0,
            WDir: 0,
            EDir: 0,
            NWDir: 0,
            NEDir: 0,
            SWDir: 0,
            SEDir: 0,
    
            indx: i,
            access: `${row}${col}`
        }
    }),
    
    movPos: {
        curPos: '0',
        nxtPos: '0',
        select: 0
    },

    moveablePos: [
        
    ],

    whitePfp: {
        win: 0,
        lose: 0,
        draw: 0,

        kingPos: 0
    },

    blackPfp: {
        win: 0,
        lose: 0,
        draw: 0,

        kingPos: 0
    }

}

const readOnlyData: ReadOnlyData = {

    dirOffsetsKnight: [
        [-2, -1], [-1, -2], [1, -2], [2, -1], 
        [2, 1], [1, 2], [-1, 2], [-2, 1]
    ],

    dirOffsets: [
        8, -8, -1, 1, 7, -7, 9, -9
    ],

    dirOffsetsPawn: [
        8, 7, 9
    ],

    dirOffsetsPawn2: [
        -8, -7, -9
    ],
    
    dirIndx: [
        'NDir',
        'SDir',
        'WDir',
        'EDir',
        'NWDir',
        'SEDir',
        'NEDir',
        'SWDir',
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
    
                    data.board[index] = {
                        ...data.board[index],
                        type: type,
                        color: color,
                    };
    
                    col++
                }
            }
        }
    
        return data.board;
    },

    sqToEdge(): SquareToEdge[] {

        for (let row: number = 0; row < 8; row++) {

            for (let col: number = 0; col < 8; col++) {
    
                const north: number = 7 - col;
                const south: number = col;
                const west: number = row;
                const east: number = 7 - row;
    
                const index: number = col * 8 + row;
    
                data.sqToEdge[index] = {
                    ...data.sqToEdge[index],
    
                    NDir: north,
                    SDir: south,
                    WDir: west,
                    EDir: east,
                    NWDir: Math.min(north, west),
                    SEDir: Math.min(south, east),
                    NEDir: Math.min(north, east),
                    SWDir: Math.min(south, west),
                }
            }
        }
    
        return data.sqToEdge;
    }

}

// automatically assign nessessary value

boardInit.loadPos("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
boardInit.sqToEdge();

const moveLogic = {

    move(key: string): string {

        this.setPos(key) // set position ready for the next move
        this.validate.manage(); // check if the move is valid
    
        let increment: number = 1;
        const movPosLength: number = data.moveablePos.length;
        const movPos: number[] = data.moveablePos;
        
        console.log(`current position: ${data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx}`)

        console.log(`target position: ${data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.nxtPos)].indx}`)

        console.log(`possible position: ${movPos}`);
    
        if (movPosLength === 0) {
            console.log(`invalid position`);
            return 'exit1';
        }
    
        for (let i: number = 0; i < movPosLength; i++) {

            if (movPos[i] === data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.nxtPos)].indx) {

                console.log(`position verified tries: ${increment}`)
                this.executePos();
                return 'exit0\n';

            } else {

                console.log(`verifying possible position: ${increment++}/${movPosLength}`)

            }
    
            if (increment > data.moveablePos.length) {

                console.log(`invalid position`);
                return 'exit1\n';

            }
        }
        return 'something went wrong\n';
    },

    setPos(input: string): void {

        const movKey: string[] = input.split('');
        
        for (let i: number = 0; i < movKey.length; i++) {

            switch (i) {

                case 0:
                    data.movPos.curPos = `${movKey[i]}${movKey[i += 1]}`;
                    continue;

                case 3:
                    data.movPos.nxtPos = `${movKey[i]}${movKey[i += 1]}`;
                    break;

                default:
                    continue;

            }
        }
    
        data.movPos.select = data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].type

        return;
    },

    executePos(): void {

        const curIndx: number = data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos); // finds board.access that is equal to movPos.curPos if founded, returns indx, stores in this variable
        const tarIndx: number = data.board.findIndex((obj: Board) => obj.access === data.movPos.nxtPos); // target index
    
        const curObj: Board = data.board[curIndx]; // 00
        const tarObj: Board = data.board[tarIndx]; // 74
        
        // some kind of bruteforce, but if it works it works
        data.board[curIndx] = {
          type: 0,
          color: 0,
          behav: 0,
          indx: curObj.indx,
          access: curObj.access
        };
    
        data.board[tarIndx] = {
            ...curObj,
            indx: tarObj.indx,
            access: tarObj.access,
            behav: data.board[tarIndx].behav = data.board[tarIndx].behav + 1
        };
    
        return;
    },

    validate: {

        manage(): number {

            data.moveablePos = [];
            const select: number = data.movPos.select
    
            if ([2, 4, 5].includes(select)) {
    
                this.queenRookBishop();
                return 245;
    
            }

            switch (select) {
                case 1:
                    this.pawn();
                    return 1;
                case 3:
                    this.knight();
                    return 3;
                case 6:
                    this.king();
                    return 6;
                case 0:
                    return 0;
            }
    
            return 400;
        },

        enemColor(): number[] {

            let oppn: number = 0;
            const cache: number[] = [];
            const fnly: number = data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].color;


            switch (fnly) {

                case 8:
                    oppn = 16;
                    break;

                case 16:
                    oppn = 8;
                    break;

            }

            cache.push(oppn);
            cache.push(fnly);

            return cache;
        },

        queenRookBishop() {

            const color: number[] = this.enemColor();
            const stDirIndx: number = (data.movPos.select === Pieces.Bishop) ? 4 : 0;
            const enDirIndx: number = (data.movPos.select === Pieces.Rook) ? 4 : 8;
            
            for (let dirIndx: number = stDirIndx; dirIndx < enDirIndx; dirIndx++) {
                let enemCount: number = 0;
                
                for (let i: number = 0; i < data.sqToEdge[data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx][readOnlyData.dirIndx[dirIndx]]; i++) {
        
                    // sqToEdge[movPos.curPos NOTE: 0-63][dirIndxKey[dirIndx] NOTE: only return targeted direction key]; in this case is
                    // sqToEdge["0"]["NDir"] or sqToEdge[0].NDir
                    
                    const targetSq: number = data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx + readOnlyData.dirOffsets[dirIndx] * ( i + 1 );
        
                    // if block by friendly piece then unable to move any further
                    if (data.board[targetSq].color === color[1]) {

                        break;

                    }
        
                    // cant move any further after capture enemy piece
                    if (data.board[targetSq].color === color[0]) {
                        if (enemCount === 1) {
                            break;
                        }
                        data.moveablePos.push(targetSq);
                        enemCount++;

                    }
                    
                    // console.log(targetSq);
                    data.moveablePos.push(targetSq);
                }
            }
        },

        king() {

            const color: number[] = this.enemColor();

            for (let dirIndx: number = 0; dirIndx < 8; dirIndx++) {

                for (let i: number = 0; i < Math.min(1, data.sqToEdge[data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx][readOnlyData.dirIndx[dirIndx]]); i++) {

                    const targetSq: number = data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx + readOnlyData.dirOffsets[dirIndx];
    
                    if (data.board[targetSq].color === color[1]) {

                        break;

                    }

                    data.moveablePos.push(targetSq);
                }
            }
        },

        pawn() {
            
            const color: number[] = this.enemColor();

            for (let dirIndx: number = 0; dirIndx < 3; dirIndx++) {

                for (let i: number = 0; i < Math.min(1, data.sqToEdge[data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx][readOnlyData.dirIndx[dirIndx]]); i++) {

                    let targetSq: number = data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx + readOnlyData.dirOffsetsPawn[dirIndx];

                    if (data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].color === 16) {

                        targetSq = data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx + readOnlyData.dirOffsetsPawn2[dirIndx];

                    }

                    if (data.board[targetSq].color === color[1]) {

                        break;

                    }

                    if (data.board[targetSq].color === color[0]) {

                        if (dirIndx === 0) {

                            break;

                        }
                        
                    }

                    if (data.board[targetSq].color !== color[0]) {

                        if (dirIndx === 1 || dirIndx === 2) {

                            break;

                        }

                    }

                    data.moveablePos.push(targetSq);
                }
            }

        },

        knight() {

            const color: number[] = this.enemColor();
            const curRow = parseInt((data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].access[0]))
            const curCol = parseInt((data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].access[1]))
        
            for (let dirIndx = 0; dirIndx < 8; dirIndx++) {

                const rowOffset = readOnlyData.dirOffsetsKnight[dirIndx][0];
                const colOffset = readOnlyData.dirOffsetsKnight[dirIndx][1];

                const newRow = curRow + rowOffset;
                const newCol = curCol + colOffset;
        
                // corner check
                if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) {

                    continue;

                }
        
                const targetSq = newRow * 8 + newCol;

                if (data.board[targetSq].color === color[1]) {

                    continue;

                }

                if (data.board[targetSq].color === color[0]) {

                    continue;

                }

                data.moveablePos.push(targetSq);
            }
        }
    }
}

console.log(moveLogic.move('13>23'));
console.log(moveLogic.move('23>33'));
console.log(moveLogic.move('62>52'));
console.log(moveLogic.move('52>42'));
console.log(moveLogic.move('33>42'));
console.log(data.movPos);