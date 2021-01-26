/**
 * dot product
 * @param {MATRIX} matrix0
 * @param {MATRIX} matrix1
 * @returns {MATRIX}
 */
function dot(matrix0, matrix1){
    //if(matrix0.columnNum !== matrix1.rowNum) throw("matrix0 columnNum must be equal matrix1 rowNum to dot product!");
    let result = new MATRIX(matrix0.rowNum, matrix1.columnNum);
    for (let r = 0; r < result.rowNum; r++) {
        for (let c = 0; c < result.columnNum; c++) {
            let sum = 0;
            for(let x = 0; x < matrix0.columnNum; x++) sum += matrix0.getElement(r, x) * matrix1.getElement(x, c);
            result.setElement(r, c, sum);
        }
    }
    return result;
}

/**
 * returns random matrix
 * @param {number} rowNum
 * @param {number} columnNum
 * @returns {MATRIX}
 */
function matrixFromRand(rowNum, columnNum){
    let matrix = new MATRIX(rowNum, columnNum);
    matrix.buildFromRand();
    return matrix;
}

/**
 * returns matrix from array
 * @param {number} rowNum
 * @param {number} columnNum
 * @param {number[]} array
 * @returns {MATRIX}
 */
function matrixFromArray(rowNum, columnNum, array){
    let matrix = new MATRIX(rowNum, columnNum);
    matrix.buildFromArray(array);
    return matrix;
}

function getRandom(number){
    return Math.floor(Math.random() * number);
}