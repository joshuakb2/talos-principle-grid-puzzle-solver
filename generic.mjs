#!/usr/bin/env node

import { createInterface } from 'readline';
import { makeShape, bgColors, solve, Grid } from './common.mjs';

const term = createInterface({ input: process.stdin, output: process.stdout});

const prompt = s => new Promise(resolve => term.question(s, resolve));

async function main() {
    let w = +(await prompt('width: '));
    let h = +(await prompt('height: '));
    let grid = new Grid(w, h);

    let shapeCount = w * h / 4;
    let shapes = [];

    for (let i = 0; i < shapeCount; i++) {
        let type = await prompt(`Shape #${shapes.length + 1}: `);
        shapes.push(makeShape(bgColors[shapes.length % bgColors.length], type));
    }

    term.close();
    
    let solved = solve(grid, shapes);

    if (!solved) {
        console.log('No solution could be found :(');
        process.exit(1);
    }

    console.log(grid.toString());
}

main();
