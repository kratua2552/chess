export type Board = {
    type: number,
    color: number,

    mov: number,
    indx: number,
    access: string
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
    dirOffsetsPawn: ReadonlyArray<number>,
    dirOffsetsPawn2: ReadonlyArray<number>
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

export const data: { board: Board[], sqToEdge: SquareToEdge[], movPos: Move, moveablePos: any[], whitePfp: Profiles, blackPfp: Profiles, castlingPos: Castle, game: Game } = {

    board: [],

    sqToEdge: [],
    
    movPos: {
        curPos: '0',
        nxtPos: '0',
        select: 0,
    },

    moveablePos: [],

    whitePfp: {
        win: 0,
        lose: 0,
        draw: 0,
        match: 0,

        kingPos: 0,
        score: 0,
    },

    blackPfp: {
        win: 0,
        lose: 0,
        draw: 0,
        match: 0,

        kingPos: 0,
        score: 0,
    },

    castlingPos: {
        kingPos: '0',
        rookPos: '0',
    },

    game: {
        board: 0,
        turn: 0
    }

}

export const readOnlyData: ReadOnlyData = {

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
