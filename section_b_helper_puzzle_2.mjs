#!/usr/bin/env node
import { makeShape, bgColors, solve, Grid } from './common.mjs';

function main() {
    let grid = new Grid(8, 6);
    let shapes = Object.entries({
        A: 'line',
        B: 'T',
        C: 'T',
        D: 'square',
        E: 'square',
        F: 'S',
        G: 'Z',
        H: 'Z',
        I: 'Z',
        J: 'L2',
        K: 'L2',
        L: 'L2',
    }).map(([ id, type ], i) => makeShape(id, bgColors[i % bgColors.length], type));

    let solved = solve(grid, shapes);

    if (!solved) {
        console.log('No solution could be found :(');
        process.exit(1);
    }

    console.log(grid.toString());
}

main();
