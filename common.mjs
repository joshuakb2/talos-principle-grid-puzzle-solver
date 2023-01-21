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

    index(x, y) {
        return x + this.width * y;
    }

    set(x, y, value) {
        this.cells[this.index(x, y)] = value;
    }

    at(x, y) {
        return this.cells[this.index(x, y)];
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

    hasImpossibleGaps() {
        // Create a DAG of empty cell indexes that represent adjacent empty cells
        let gapGraph = new Map();

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let i = this.index(x, y);
                if (this.cells[i]) continue;

                gapGraph.set(i, i);

                if (x > 0 && !this.cells[i - 1]) {
                    let key = i - 1;
                    while (true) {
                        let next = gapGraph.get(key);
                        if (key == next) break;
                        key = next;
                    }
                    gapGraph.set(key, i);
                }
                if (y > 0 && !this.cells[i - this.width]) {
                    let key = i - this.width;
                    while (true) {
                        let next = gapGraph.get(key);
                        if (key == next) break;
                        key = next;
                    }
                    gapGraph.set(key, i);
                }
            }
        }

        // Assign each empty cell an equivalence class ID
        let classes = new Map();
        
        for (let i of gapGraph.keys()) {
            assignClass(i);
        }

        // Count how many cells belong to each equivalence class (each contiguous gap)
        let classSizes = new Map();

        for (let cls of classes.values()) {
            classSizes.set(cls, (classSizes.get(cls) ?? 0) + 1);
        }

        // If any of those gaps contains a number of cells that is not a multiple of 4,
        // it will be impossible to fill it and we can deduce that there is no solution
        // to the puzzle from this state.
        return [ ...classSizes.values() ].some(n => n % 4 !== 0);

        function assignClass(key) {
            if (classes.has(key)) return classes.get(key);
            
            let next = gapGraph.get(key);
            let cls = next == key ? key : assignClass(next);

            classes.set(key, cls);
            return cls;
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
                    while (true) {
                        if (grid.hasImpossibleGaps()) break;
                        if (solve(grid, shapes)) return true;
                        break;
                    }
                    grid.remove(x, y, rotated);
                }
            }
        }
        rotated.cells = rotate(rotated.cells);
    }

    shapes.push(shapeToPlace);
    return false;
}
