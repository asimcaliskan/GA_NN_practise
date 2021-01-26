let canvas, context2d, algorithm_info, speed;
const NUMBER_OF_POPULATION = 20;
const NETWORK_SHAPE = [3, 4, 2];
const NUMBER_OF_ELITES = 4;
const NUMBER_OF_MUTATION = 4;
let FINISHED_CARS = 0;

let nns = [], cars = [];
let GENERATION = 0;

function init(){
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context2d = canvas.getContext("2d");

    algorithm_info = document.getElementById("algorithm_info");
    speed = document.getElementById("speed");

    createChromosomes();
    createCars();

    testLoop();
}

function testLoop(){
    clearCanvas();
    algorithm_info.textContent = "GENERATION = " + GENERATION + " SPEED = " + speed.value + " #FINISHED = " + FINISHED_CARS;
    SPEED_OF_CAR = speed.value;
    if(all_cars_hit()){
        GENERATION += 1;
        FINISHED_CARS = 0;
        crossover(testResult());
        reset_all_cars();
    }
    drawRoad();
    for(let ind = 0; ind < NUMBER_OF_POPULATION; ind++) cars[ind].move();

    requestAnimationFrame(testLoop);
}

/*
function mutate(){
    for(let ind = 0; ind < NUMBER_OF_POPULATION; ind++){
        nns[ind].mutation(NUMBER_OF_MUTATION);
    }
}
 */

function crossover(resultOfTest){
    for(let ind = NUMBER_OF_ELITES; ind < NUMBER_OF_POPULATION; ind++){
        let randomElite0 = resultOfTest[getRandom(NUMBER_OF_ELITES)][0];
        let randomElite1 = resultOfTest[getRandom(NUMBER_OF_ELITES)][0];
        let chromosome0 = nns[randomElite0].getFlattenWeights();
        let chromosome1 = nns[randomElite1].getFlattenWeights();
        nns[resultOfTest[ind][0]].createWeightsFromArray(crossoverGenes(chromosome0, chromosome1));
        nns[resultOfTest[ind][0]].mutation(NUMBER_OF_MUTATION);
    }
}

function crossoverGenes(chromosome0, chromosome1){
    let crossoverPoint = Math.floor(Math.random() * chromosome0.length);
    let resultChromosome = [];
    resultChromosome = resultChromosome.concat(chromosome0.slice(0, crossoverPoint));
    resultChromosome = resultChromosome.concat(chromosome1.slice(crossoverPoint, chromosome0.length));
    return resultChromosome;
}


function testResult(){
    let result = [];
    for(let ind = 0; ind < NUMBER_OF_POPULATION; ind++) result[result.length] = [ind, cars[ind].x];
    return result.sort((a,b) => b[1] - a[1]);
}

function clearCanvas(){
    context2d.clearRect(0, 0, canvas.width, canvas.height);
}

function all_cars_hit(){
    for(let ind = 0; ind < NUMBER_OF_POPULATION; ind++) if(!cars[ind].hit) return false;
    return true;
}

function reset_all_cars(){
    for(let ind = 0; ind < NUMBER_OF_POPULATION; ind++) {
        if(cars[ind].x > canvas.width - 60) FINISHED_CARS += 1;//console.log(cars[ind].x);
        cars[ind].reset();
    }
}

function createChromosomes(){
    for(let ind = 0; ind < NUMBER_OF_POPULATION; ind++){
        nns[nns.length] = new NN(NETWORK_SHAPE);
    }
}

//BE SURE !: Firstly initialize chromosomes(nns)
function createCars(){
    for(let ind = 0; ind < NUMBER_OF_POPULATION; ind++){
        cars[cars.length] = new CAR(0, 240 , 40 , 20, "red", context2d, [0, 200, canvas.width, 100], nns[ind]);
    }
}

function drawRoad(){
    draw_finish_line("green");
    draw_road_line("black");
}

function draw_finish_line(color){
    context2d.fillStyle = color;
    context2d.fillRect(canvas.width - 20, 200, 20, 100);
}

function draw_road_line(color){
    context2d.fillStyle = color;
    context2d.fillRect(0, 180, canvas.width, 20);
    context2d.fillRect(0, 300, canvas.width, 20);
}

