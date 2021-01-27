//const NUMBER_OF_INDIVIDUALS = 10;
//const NUMBER_OF_ELITES = 5;
//const NUMBER_OF_MUTATION = 1;
//const NETWORK_SHAPE = [2, 3, 2];
let NUMBER_OF_GENERATION = 0;
const testCases = [
    [2, 2, 0],
    //[2, 1, 1],
    //[1, 2, 1],
    //[1, 1, 0]
];
let nn = [];
function initt(){
    createChromosomes();
    testLoop();
}

function testLoop(){
    console.log(NUMBER_OF_GENERATION);
    let testCase = testCases[Math.floor(Math.random() * testCases.length)];
    let testResult = testIndividuals(testCase);
    //console.log("best = ", nn[testResult[0][0]].forward(matrixFromArray(2, 1, testCase.slice(0, 2))).getMaxElementIndex()[0]);
    //console.log("testCase = ", testCase);
    crossover(testResult);
    mutate();
    NUMBER_OF_GENERATION += 1;
    if(NUMBER_OF_GENERATION !== 400) {
        requestAnimationFrame(testLoop);
    }
    //console.log(testResult);
}

function testIndividuals(testCase){
    let result = [];
    let counter = 0;
    for(let ind = 0; ind < NUMBER_OF_INDIVIDUALS; ind++){
        result[result.length] = [ind,
            Math.abs(testCase[2] - nn[ind].forward(matrixFromArray(2, 1, testCase.slice(0, 2))).getMaxElementIndex()[0])];
        if(nn[ind].forward(matrixFromArray(2, 1, testCase.slice(0, 2))).getMaxElementIndex()[0] === testCase[2]) counter++;
    }
    console.log("SUCCESS : ", counter / NUMBER_OF_INDIVIDUALS);
    result.sort((a,b) => a[1] - b[1]);
    return result;
}
let forwardCollisionVector0 = this.vector_addition(this.vector_rotate(this.direction_vector(30), this.deg_to_rad(this.angle)), center);
let forwardCollisionVector1 = this.vector_addition(this.vector_rotate(this.direction_vector(50), this.deg_to_rad(this.angle)), center);
let left_vector  = this.vector_addition(this.vector_rotate(this.direction_vector(29), this.deg_to_rad(this.angle - 90)), center);
let right_vector = this.vector_addition(this.vector_rotate(this.direction_vector(29), this.deg_to_rad(this.angle + 90)), center);
let frontCollisionVectorLeft  = this.vector_addition(this.vector_rotate(this.direction_vector(30), this.deg_to_rad(this.angle - 30)), center);
let frontCollisionVectorRight = this.vector_addition(this.vector_rotate(this.direction_vector(30), this.deg_to_rad(this.angle + 30)), center);

let forwardCollision0 = isEqual(this.getPixelColor(forwardCollisionVector0[0], forwardCollisionVector0[1]), [0, 0, 0, 255]);
let forwardCollision1 = isEqual(this.getPixelColor(forwardCollisionVector1[0], forwardCollisionVector1[1]), [0, 0, 0, 255]);
let sideCollisionLeft  = isEqual(this.getPixelColor(left_vector[0], left_vector[1]), [0, 0, 0, 255]);
let sideCollisionRight = isEqual(this.getPixelColor(right_vector[0], right_vector[1]), [0, 0, 0, 255]);
let frontCollisionLeft  = isEqual(this.getPixelColor(frontCollisionVectorLeft[0], frontCollisionVectorLeft[1]), [0, 0, 0, 255]);
let frontCollisionRight = isEqual(this.getPixelColor(frontCollisionVectorRight[0], frontCollisionVectorRight[1]), [0, 0, 0, 255]);


function createChromosomes(){
    for(let ind = 0; ind < NUMBER_OF_INDIVIDUALS; ind++){
        nn[nn.length] = new NN(NETWORK_SHAPE);
    }
}
/*
function mutate(){
    for(let ind = 0; ind < NUMBER_OF_INDIVIDUALS; ind++){
        nn[ind].mutation(NUMBER_OF_MUTATION);
    }
}

 */
/*
function crossover(resultOfTest){
    for(let ind = NUMBER_OF_ELITES; ind < NUMBER_OF_INDIVIDUALS; ind++){
        let randomElite0 = resultOfTest[getRandom(NUMBER_OF_ELITES)][0];
        let randomElite1 = resultOfTest[getRandom(NUMBER_OF_ELITES)][0];
        let chromosome0 = nn[randomElite0].getFlattenWeights();
        let chromosome1 = nn[randomElite1].getFlattenWeights();
        nn[resultOfTest[ind][0]].createWeightsFromArray(crossoverGenes(chromosome0, chromosome1));
    }
}

 */
/*
function crossoverGenes(chromosome0, chromosome1){
    let crossoverPoint = Math.floor(Math.random() * chromosome0.length);
    let resultChromosome = [];
    resultChromosome = resultChromosome.concat(chromosome0.slice(0, crossoverPoint));
    resultChromosome = resultChromosome.concat(chromosome1.slice(crossoverPoint, chromosome0.length));
    return resultChromosome;
}

 */