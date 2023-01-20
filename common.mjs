import 'colors';

export const bgColors = [
    'bgRed',
    'bgGreen',
    'bgYellow',
    'bgBlue',
    'bgMagenta',
    'bgCyan',
    'bgGray',
    'bgBrightRed',
    'bgBrightGreen',
    'bgBrightYellow',
    'bgBrightBlue',
    'bgBrightMagenta',
    'bgBrightCyan',
];

export const makeShape = (id, color, type) => ({ id, color, ...shapes[type] });

export const shapes = {
    line: {
        cells: [[0, 0], [0, 1], [0, 2], [0, 3]],
        rotations: 2,
    },
    square: {
        cells: [[0, 0], [0, 1], [1, 0], [1, 1]],
        rotations: 1,
    },
    T: {
        cells: [[0, 0], [1, 0], [2, 0], [1, 1]],
        rotations: 4,
    },
    L: {
        cells: [[0, 0], [0, 1], [0, 2], [1, 2]],
        rotations: 4,
    },
    L2: {
        cells: [[0, 0], [0, 1], [0, 2], [-1, 2]],
        rotations: 4,
    },
    Z: {
        cells: [[0, 0], [1, 0], [1, 1], [2, 1]],
        rotations: 2,
    },
    S: {
        cells: [[0, 0], [1, 0], [1, -1], [2, -1]],
        rotations: 2,
    },
};

// 90 degrees to the right
export const rotate = cells => cells.map(([x, y]) => [-y, x]);

export class Grid {
    width;
    height;
    cells;

    constructor(w, h) {
        this.width = w;
        this.height = h;
        this.cells = Array.from({ length: w * h }, () => undefined);
    }

    set(x, y, value) {
        this.cells[x * this.height + y] = value;
    }

    at(x, y) {
        return this.cells[x * this.height + y];
    }

    fits(x, y, shape) {
        for (let [dx, dy] of shape.cells) {
            let x_ = x + dx;
            let y_ = y + dy;
            if (x_ < 0 || y_ < 0 || x_ >= this.width || y_ >= this.height) return false;
            if (this.at(x + dx, y + dy)) return false;
        }

        return true;
    }

    place(x, y, shape) {
        for (let [dx, dy] of shape.cells) {
            this.set(x + dx, y + dy, shape);
        }
    }

    remove(x, y, shape) {
        for (let [dx, dy] of shape.cells) {
            this.set(x + dx, y + dy, undefined);
        }
    }

    toString() {
        let horizontalBorder = Array.from({ length: this.width + 2 }, () => '#').join('');
        let r = horizontalBorder + '\n';
        for (let y = 0; y < this.height; y++) {
            r += '#'
            for (let x = 0; x < this.width; x++) {
                const shape = this.at(x, y);
                r += shape ? shape.id[shape.color] : ' ';
            }
            r += '#\n';
        }

        r += horizontalBorder;
        return r;
    }
}

export const solve = (grid, shapes) => {
    if (shapes.length === 0) return true;

    const shapeToPlace = shapes.pop();
    let rotated = { ...shapeToPlace };

    for (let r = 1; r <= shapeToPlace.rotations; r++) {
        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                if (grid.fits(x, y, rotated)) {
                    grid.place(x, y, rotated);
                    if (solve(grid, shapes)) return true;
                    grid.remove(x, y, rotated);
                }
            }
        }
        rotated.cells = rotate(rotated.cells);
    }

    shapes.push(shapeToPlace);
    return false;
}
