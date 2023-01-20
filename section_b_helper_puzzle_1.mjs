#!/usr/bin/env node
import { makeShape, bgColors, solve, Grid } from './common.mjs';

function main() {
    let grid = new Grid(8, 6);
    let shapes = Object.entries({
        A: 'T',
        B: 'T',
        C: 'square',
        D: 'square',
        E: 'line',
        F: 'L',
        G: 'L',
        H: 'L2',
        I: 'L2',
        J: 'L2',
        K: 'S',
        L: 'S',
    }).map(([ id, type ], i) => makeShape(id, bgColors[i % bgColors.length], type));

    let solved = solve(grid, shapes);

    if (!solved) {
        console.log('No solution could be found :(');
        process.exit(1);
    }

    console.log(grid.toString());
}

main();
