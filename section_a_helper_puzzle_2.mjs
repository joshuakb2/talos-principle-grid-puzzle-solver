#!/usr/bin/env node
import { makeShape, bgColors, solve, Grid } from './common.mjs';

function main() {
    let grid = new Grid(6, 6);
    let shapes = Object.entries({
        A: 'Z',
        B: 'Z',
        C: 'Z',
        D: 'L',
        E: 'L',
        F: 'L2',
        G: 'L2',
        H: 'T',
        I: 'T',
        //J: 'square',
    }).map(([ id, type ], i) => makeShape(id, bgColors[i % bgColors.length], type));

    let solved = solve(grid, shapes);

    if (!solved) {
        console.log('No solution could be found :(');
        process.exit(1);
    }

    console.log(grid.toString());
}

main();