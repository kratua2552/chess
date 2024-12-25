export type Board = {
    type: number,
    color: number,

    mov: number,
    indx: number,
    access: string

    ENGINESIDEDATA_ALLPOSSIBLEPOSITION: number[] | undefined,
}

export type SquareToEdge = {
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

export type Move = {
    curPos: string, 
    nxtPos: string,
    select: number,
}


export type ReadOnlyData = {
    dirOffsets: ReadonlyArray<number>, 
    dirIndx: ReadonlyArray<string>, 
    dirOffsetsKnight: ReadonlyArray<[number, number]>,
    dirOffsetsPawnWhite: ReadonlyArray<number>,
    dirOffsetsPawnBlack: ReadonlyArray<number>,
    dirIndxPawn: ReadonlyArray<string>
}

export type Profiles = {
    win: number,
    lose: number,
    draw: number,
    match: number,

    kingPos: number,
    score: number
}

export type Castle = {
    kingPos: string,
    rookPos: string,
}

export type Game = {
    board: number,
    turn: number
}

/////////////////////////////////////////////////////////////

export class Pieces {
    static Pawn = 1;
    static Bishop = 2;
    static Knight = 3;
    static Rook = 4;
    static Queen = 5;
    static King = 6;

    static White = 8;
    static Black = 16;
}

export const data: { board: Board[], sqToEdge: SquareToEdge[] } = {

    board: [],

    sqToEdge: [],

}

export const readOnlyData: ReadOnlyData = {

    dirOffsetsKnight: [
        [-2, -1], [-1, -2], [1, -2], [2, -1], 
        [2, 1], [1, 2], [-1, 2], [-2, 1]
    ],

    dirOffsets: [
        8, -8, -1, 1, 7, -7, 9, -9
    ],

    dirOffsetsPawnWhite: [
        7, 9
    ],

    dirOffsetsPawnBlack: [
        -7, -9
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
    ],

    dirIndxPawn: [
        'NWDir',
        'NEDir'
    ]
}
