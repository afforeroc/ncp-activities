import math
import random

def show_matrix(rows, columns):
    for row in range(rows):
        for col in range(columns):
            print(f'{row}x{col}', end=' ')
        print()


def matrix_to_list(rows, columns):
    for row in range(rows):
        for col in range(columns):
            number = columns*row + col
            print(f'{number}', end=' ')
        print()

def find_pos_matrix(number, columns):
    row = number//columns
    col = number - columns*row
    return row, col

def is_adjacent(number, columns, target_set):
    row_box, col_box = find_pos_matrix(number, columns)
    for elem in target_set:
        row_elem, col_elem = find_pos_matrix(elem, columns)
        if abs(row_box - row_elem) == 1 and abs(col_box - col_elem) != 1:
            return 1
        if abs(row_box - row_elem) != 1 and abs(col_box - col_elem) == 1:
            return 1
    return 0

def main():
    rows = 3
    columns = 4
    show_matrix(rows, columns)
    matrix_to_list(rows, columns)
    for number in range(0, rows*columns):
        print(number, find_pos_matrix(number, columns))

    # Other program
    max_elems = columns
    num_elems = 0
    target_set = set()
    while num_elems < max_elems:
        box = random.randint(0, 11)
        print(target_set)
        if box not in target_set and not is_adjacent(box, columns, target_set):
            target_set.add(box)
            num_elems += 1
    print(target_set)


if __name__ == '__main__':
    main()

