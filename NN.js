class NN{
    /**
     * @param {number[]} shape
     */
    constructor(shape) {
        this.shape = shape;
        this.numberOfLayer = shape.length;
        this.weights = this.createWeights();
    }

    /**
     * returns weight matrices(l + 1, l)
     * @returns {MATRIX[]}
     */
    createWeights() {
        let resultWeight = [];
        for(let layer = 0; layer < this.numberOfLayer - 1; layer++){
            resultWeight.push(matrixFromRand(this.shape[layer + 1], this.shape[layer]));
        }
        return resultWeight;
    }

    /**
     * recrate weights from genes array
     * @param {number[]}genArr
     */
    createWeightsFromArray(genArr){
        let resultWeight = [];
        let start = 0;
        for(let layer = 0; layer < this.numberOfLayer - 1; layer++){
            let rowNum = this.shape[layer + 1];
            let columnNum = this.shape[layer];
            resultWeight.push(matrixFromArray(rowNum, columnNum, genArr.slice(start, start + rowNum * columnNum)));
            start += rowNum * columnNum;
        }
        this.weights = resultWeight;
    }

    /**
     * @returns {MATRIX[]}
     */
    getWeights(){ return this.weights};

    /**
     * forward propagation
     * @param {MATRIX} vector - matrix(numOfInputLayer, 1)
     * @returns {MATRIX} vector - matrix(numOfOutLayer, 1)
     */
    forward(vector){
        let result = vector;
        for(let layer = 0; layer < this.numberOfLayer - 1; layer++){
            result = dot(this.weights[layer], result);
            //result.sigmoid();
        }
        return result;
    }



    /**
     * Mutates random genes(weight)
     * @param {number} numOfMutation
     */
    mutation(numOfMutation){
        for(let i = 0; i < 1; i++){
            let index = Math.floor(Math.random() * (this.numberOfLayer - 1));
            let rowNum = Math.floor(Math.random() * this.weights[index].rowNum);
            let columnNum = Math.floor(Math.random() * this.weights[index].columnNum);
            this.weights[index].setElement(rowNum, columnNum, 1 - this.weights[index].getElement(rowNum, columnNum));
        }
    }

    /**
     * @returns {number[]}
     */
    getFlattenWeights() {
        let result = [];
        for(let layer = 0; layer < this.numberOfLayer - 1; layer++){
            result = result.concat(this.weights[layer].getFlattenMatrix());
        }
        return result;
    }
}