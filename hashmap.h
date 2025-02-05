#ifndef HASHMAP
#define HASHMAP

typedef struct {
    int key;
    int val;
} hashmap_int_T;

typedef struct {
    char key[4];
    int val;
} hashmap_char_T;

typedef struct {
    int key;
    int *val;
} hashmap_ptr_T;


int strcmp_s (const char *a, const char *b) {
    while (*a && (*a == *b)) {
        a++; b++;
    }
    return (unsigned char) *a - (unsigned char) *b;
}

int hashmap_int_retrieve(hashmap_int_T pairs[], int size, int key) {
    for (int i = 0; i < size; i++) {
        if (pairs[i].key == key) return pairs[i].val;
    }
    return -1;
}

int hashmap_char_retrieve(hashmap_char_T pairs[], int size, const char* key) {
    for (int i = 0; i < size; i++) {
        if (strcmp_s(pairs[i].key, key) == 0) return pairs[i].val;
    }
    return -1;
}

int hashmap_int_pairs(hashmap_int_T a[], hashmap_int_T b[], int size, int key) {
    for (int i = 0; i < size; i++) {
        if (a[i].val == 0) continue;
        if (a[i].key == key) return b[i].val;
    }
    return 0;
}

int hashmap_char_pairs(hashmap_char_T a[], hashmap_char_T b[], int size, const char* key) {
    for (int i = 0; i < size; i++) {
        if (a[i].val == 0) continue;
        if (strcmp_s(a[i].key, key) == 0) return b[i].val;
    }
    return 0;
}

#endif
