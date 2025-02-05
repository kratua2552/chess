#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <cctype>

#include <vector>
#include <array>

#include "hashmap.h"

using namespace std;

class Data {
public:
    int log_md(int first = 0, int second = 0, int third = 0, int forth = 0, int fifth = 0) {
        if (first == 0) return md.board[second][third][forth][fifth];
        if (first == 1) return md.metadata[second];
        return 0;
    }

protected:
    struct MainData {
        int ****board;
        hashmap_int_T ***board_data;
        int *metadata;
    };
    
public:
    static MainData md;
};

Data::MainData Data::md = {
    nullptr, nullptr
};

class Board : public Data {
private:
    void allocate(MainData *md, int row, int col) {
        md->board = (int ****)malloc(row * sizeof(int ***));
        md->metadata = (int *)malloc(3 * sizeof(int));

        md->metadata[0] = row;
        md->metadata[1] = col;

        for (int i = 0; i < row; i++) {
            md->board[i] = (int ***)malloc(col * sizeof(int **));

            for (int j = 0; j < col; j++) {
                md->board[i][j] = (int **)malloc(3 * sizeof(int *));
                md->board[i][j][0] = (int *)malloc(3 * sizeof(int));
                md->board[i][j][2] = (int *)malloc(4 * sizeof(int));
            }
        }

        md->board_data = new hashmap_int_T**[row];

        for (int i = 0; i < row; i++) {
            md->board_data[i] = new hashmap_int_T*[col];
            for (int j = 0; j < col; j++) {
                md->board_data[i][j] = new hashmap_int_T[8];
            }
        }
    }

    void initalize(MainData *md) {
        int rowa = md->metadata[0];
        int cola = md->metadata[1];
        int row = rowa - 1;

        for (int i = 0; i < rowa; i++) {
            for (int j = 0; j < cola; j++) {
                md->board[row][j][0][0] = (cola * i) + j;
                md->board[row][j][0][1] = 65 + j;
                md->board[i][j][0][2] = row + 1;
            }
            row--;
        }
    }

    void edgecount(MainData *md) {
        auto mathmin = [](int a, int b) { return (a < b) ? a : b; };

        for (int i = md->metadata[0] - 1; i >= 0; i--) {
            for (int j = 0; j < md->metadata[1]; j++) {
                int east = (md->metadata[1] - 1) - j;
                int west = j;
                int south = (md->metadata[0] - 1) - i;
                int north = i;

                int cache[8] = {north, south, west, east, mathmin(north, west), mathmin(south, east), mathmin(north, east), mathmin(south, west)};

                for (int k = 0; k < 8; k++) {
                    md->board_data[i][j][k].key = k;
                    md->board_data[i][j][k].val = cache[k];
                }
            }
        }
    }

    void insertpieces(MainData *md, const char *fen) {
        auto chartoint = [](char data) {
            switch (data) {
                case 'p':
                    return 1;
                case 'b':
                    return 2;
                case 'n':
                    return 3;
                case 'r':
                    return 4;
                case 'q':
                    return 5;
                case 'k':
                    return 6;
                default:
                    return 0;
            };
        };

        int row = md->metadata[0] - 1, col = 0;

        for (int i = 0; i < md->metadata[0]; i++) {
            for (int j = 0; j < md->metadata[1]; j++) {
                md->board[i][j][2][0] = 0;
                md->board[i][j][2][1] = 0;
                md->board[i][j][2][2] = 0;
            }
        }
        for (int i = 0; i < strlen(fen); i++) {
            if (fen[i] == '/') {
                row--;
                col = 0;
            } else {
                if (isdigit(fen[i])) {
                    col += fen[i] - '0';
                } else {
                    md->board[row][col][2][0] = fen[i];
                    md->board[row][col][2][1] = chartoint(tolower(fen[i]));
                    md->board[row][col][2][2] = (tolower(fen[i]) == fen[i]) ? 8 : 16;

                    col++;
                }
            }
        }
    }

    void deleteboard(MainData *md) {
        int row = md->metadata[0];
        int col = md->metadata[1];

        for (int i = 0; i < row; i++) {
            for (int j = 0; j < col; j++) {
                free(md->board[i][j][0]);
                free(md->board[i][j][2]);
                free(md->board[i][j]);

                delete[] md->board_data[i][j];
            }
            free(md->board[i]);
            
            delete[] md->board_data[i];
        }
        free(md->board);
        free(md->metadata);

        delete[] md->board_data;
    }

    int boardState = -1;

public:

    int interface(const char* type, int row = 8, int col = 8) {
        if (strcmp(type, "delete") == 0 && boardState == -1) {
            printf("cannot delete void\n");
            return -1;
        }

        if (strcmp(type, "delete") == 0 && boardState == 0) {
            deleteboard(&md);
            boardState = -1;
            printf("board deleted\n");
            return 0;
        }

        if (boardState == 0) {
            printf("cannot override board\n");
            return -1;
        }

        if (row < 1 || col < 1) {
            printf("cannot initialize zero or negative board\n");
            return -1;
        }
        if (strcmp(type, "default") == 0) type = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

        allocate(&md, row, col);
        initalize(&md);
        edgecount(&md);
        insertpieces(&md, type);
        boardState = 0;
        printf("board initalized\n");

        return 0;
    }

    ~Board() {
        deleteboard(&md);
        printf("board collapsed\n");
    }
};

class Validate : public Data {
public:
    Validate() {
        printf("engine constructed\n");
    }

    hashmap_int_T directions[8] = {
        {0, md.metadata[0]}, {1, -(md.metadata[0])}, {2, -1}, {3, 1}, {4, (md.metadata[0] - 1)}, 
        {5, -(md.metadata[0] - 1)}, {6, (md.metadata[0] + 1)}, {7, -(md.metadata[0] + 1)}
    };

    vector<array<int, 2>> qrb(int row, int col) {
        int stDirIndx = (md.board[row][col][2][1] == 2) ? 0 : 0;
        int enDirIndx = (md.board[row][col][2][1] == 4) ? 8 : 8;
        int enemColor = (md.board[row][col][2][2] == 8) ? 16 : 8;
        vector<array<int, 2>> vcache;

        for (int dirIndx = stDirIndx; dirIndx < enDirIndx; dirIndx++) {
            int enemCount = 0;

            for (int i = 0; i < hashmap_int_pairs(directions, md.board_data[row][col], 8, dirIndx); i++) {
                
            }
        }

        return vcache;
    }

};

int main() {
    Board board;
    
    board.interface("default", 8, 8);
    printf("size: %d(row) x %d(col)\n\n", board.log_md(1, 0), board.log_md(1, 1));

    for (int i = 0; i < board.log_md(1, 0); i++) {
        for (int j = 0; j < board.log_md(1, 1); j++) {
            printf("[%2d:%c%d | %c:%2d:%2d] ", board.log_md(0, i, j, 0, 0), board.log_md(0, i, j, 0, 1), board.log_md(0, i, j, 0, 2), board.log_md(0, i, j, 2, 0), board.log_md(0, i, j, 2, 1), board.log_md(0, i, j, 2, 2));
        }
        printf("\n\n");
    }

    Validate eng;
    eng.qrb(7, 2);
    printf("%d north, south, west, east, mathmin(north, west), mathmin(south, east), mathmin(north, east), mathmin(south, west)\n", board.md.board[7][2][0][0]);

    for (int i = 0;  i < 8; i++) {
        printf("%d, ", hashmap_int_retrieve(board.md.board_data[7][2], 8, i));
    }
    
    return 0;
}
