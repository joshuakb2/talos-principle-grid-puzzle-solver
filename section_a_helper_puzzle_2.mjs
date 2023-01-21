#!/usr/bin/env node
import { makeShape, bgColors, solve, Grid } from './common.mjs';

function main() {
    let grid = new Grid(6, 6);
    let shapes = [
        'Z',
        'Z',
        'Z',
        'L',
        'L',
        'L2',
        'L2',
        'T',
        'T',
    ].map((type, i) => makeShape(bgColors[i % bgColors.length], type));

    let solved = solve(grid, shapes);

    if (!solved) {
        console.log('No solution could be found :(');
        process.exit(1);
    }

    console.log(grid.toString());
}

main();
