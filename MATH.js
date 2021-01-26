class MATRIX{
    /**
     * default create zero matrix
     * @param {number} rowNum
     * @param {number} columnNum
     */
    constructor(rowNum, columnNum) {
        this.rowNum = rowNum;
        this.columnNum = columnNum;
        this.buildFromZeros();
    }

    /**
     * Builds matrix from Math.random()
     * @param {number} rowNum - default this.rowNum
     * @param {number} columnNum - default this.columnNum
     * @returns {[]} matrix
     */
    buildFromRand(rowNum = this.rowNum, columnNum = this.columnNum){
        let result = [];
        for(let r = 0; r < rowNum; r++){
            let column = [];
            for(let c = 0; c < columnNum; c++){
                column[column.length] = Math.random();
            }
            result[result.length] = column;
        }
        this.matrix = result;
    }

    /**
     * Builds matrix from given array
     * @param {number[]} array
     * @param {number} rowNum - default this.rowNum
     * @param {number} columnNum - default this.columnNum
     * @returns {[]} matrix
     */
    buildFromArray(array, rowNum = this.rowNum, columnNum = this.columnNum){
        //if(rowNum * columnNum !== array.length) throw("Array length must be equal matrix size");
        let result = [];
        for(let r = 0; r < rowNum; r++){
            let column = [];
            for(let c = 0; c < columnNum; c++){
                column[column.length] = array[r * columnNum + c];
            }
            result[result.length] = column;
        }
        this.matrix = result;
    }

    /**
     * Returns zero matrix
     * @param {number} rowNum - default this.rowNum
     * @param {number} columnNum - default this.columnNum
     * @returns {[]} matrix
     */
    buildFromZeros(rowNum = this.rowNum, columnNum = this.columnNum){
        let result = [];
        for(let r = 0; r < rowNum; r++){
            let column = [];
            for(let c = 0; c < columnNum; c++){
                column[column.length] = 0;
            }
            result[result.length] = column;
        }
        this.matrix = result;
    }

    /**
     * @returns {number}
     */
    getSize(){ return this.rowNum * this.columnNum; }

    /*
     * @returns {number[]}
     */
    getShape(){ return [this.rowNum, this.columnNum];}

    /**
     * @returns {[]} matrix
     */
    getMatrix(){ return this.matrix;}

    getFlattenMatrix(){ return this.matrix.flat()};

    /**
     * @param {number} rowNum
     * @param {number} columnNum
     * @returns {number}
     */
    getElement(rowNum, columnNum){ return this.matrix[rowNum][columnNum]};

    /**
     * @param {number} rowNum
     * @param {number} columnNum
     * @param {number} element
     */
    setElement(rowNum, columnNum, element){ this.matrix[rowNum][columnNum] = element};

    /**
     * if occurrence of max number is one returns index
     * else return -1
     * @returns {[rowNum, columnNum]|number}
     */
    getMaxElementIndex(){
        let max = Number.NEGATIVE_INFINITY;
        let index = [];
        let occurrenceOfMax = 0;
        for(let r = 0; r < this.rowNum; r++){
            for(let c = 0; c < this.columnNum; c++) {
                if (this.matrix[r][c] > max) {max = this.matrix[r][c]; occurrenceOfMax = 0; index = [r, c] }
                else if (this.matrix[r][c] === max) occurrenceOfMax += 1;
            }
        }
        if(occurrenceOfMax > 0) return -1;
        return index;
    }
}
