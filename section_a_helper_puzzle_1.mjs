#!/usr/bin/env node
import { makeShape, bgColors, solve, Grid } from './common.mjs';

function main() {
    let grid = new Grid(6, 6);
    let shapes = [
        'square',
        'square',
        'T',
        'T',
        'L',
        'L',
        'L2',
        'line',
        'S',
    ].map((type, i) => makeShape(bgColors[i % bgColors.length], type));

    let solved = solve(grid, shapes);

    if (!solved) {
        console.log('No solution could be found :(');
        process.exit(1);
    }

    console.log(grid.toString());
}

main();
