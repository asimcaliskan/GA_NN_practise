const NUMBER_OF_INDIVIDUALS = 10;
const NUMBER_OF_ELITES = 5;
const NUMBER_OF_MUTATION = 0;
const NETWORK_SHAPE = [2, 3, 2];
let NUMBER_OF_GENERATION = 0;
const testCases = [
    [2, 2, 0],
    [2, 1, 1],
    [1, 2, 1],
    [1, 1, 0],
];
let nn = [];
function init(){
    createChromosomes();
/*
    let test0 = new NN([3, 4, 3]);
    let test1 = new NN([3, 4, 3]);
    console.log(test0.getWeights())
    test0.createWeightsFromArray(test0.getFlattenWeights());
    console.log(test0.mutation(NUMBER_OF_MUTATION))


 */
    //console.log(crossoverGenes([1, 2], [3, 4]));
    testLoop();
}

function testLoop(){
    console.log(NUMBER_OF_GENERATION);
    let testCase = testCases[Math.floor(Math.random() * testCases.length)];
    let testResult = testIndividuals(testCase);
    console.log("best = ", nn[testResult[0][0]].forward(matrixFromArray(2, 1, testCase.slice(0, 2))).getMaxElementIndex()[0]);
    console.log("testCase = ", testCase);
    crossover(testResult);
    mutate();
    NUMBER_OF_GENERATION += 1;
    if(NUMBER_OF_GENERATION !== 1) requestAnimationFrame(testLoop);

}

function testIndividuals(testCase){
    let result = [];
    for(let ind = 0; ind < NUMBER_OF_INDIVIDUALS; ind++){
        result[result.length] = [ind,
            Math.abs(testCase[2] - nn[ind].forward(matrixFromArray(2, 1, testCase.slice(0, 2))).getMaxElementIndex()[0])];
    }
    console.log(result)
    result.sort((a,b) => a[1] - b[1]);
    return result;
}

function createChromosomes(){
    for(let ind = 0; ind < NUMBER_OF_INDIVIDUALS; ind++){
        nn[nn.length] = new NN(NETWORK_SHAPE);
    }
}

function mutate(){
    for(let ind = 0; ind < NUMBER_OF_INDIVIDUALS; ind++){
        nn[ind].mutation(NUMBER_OF_MUTATION);
    }
}

function crossover(resultOfTest){
    let eliteChromosomes = [];
    for(let ind = 0; ind < NUMBER_OF_ELITES; ind++){
        eliteChromosomes[eliteChromosomes.length] = resultOfTest[ind];
    }

    for(let ind = NUMBER_OF_ELITES; ind < NUMBER_OF_INDIVIDUALS; ind++){
        let chromosome0 = nn[Math.floor(Math.random() * NUMBER_OF_ELITES)].getFlattenWeights();
        let chromosome1 = nn[Math.floor(Math.random() * NUMBER_OF_ELITES)].getFlattenWeights();
        nn[ind].createWeightsFromArray(crossoverGenes(chromosome0, chromosome1));
    }
}

function crossoverGenes(chromosome0, chromosome1){
    let crossoverPoint = Math.floor(Math.random() * chromosome0.length)
    let resultChromosome = [];
    resultChromosome = resultChromosome.concat(chromosome0.slice(0, crossoverPoint));
    resultChromosome = resultChromosome.concat(chromosome1.slice(crossoverPoint, chromosome0.length));
    return resultChromosome;
}