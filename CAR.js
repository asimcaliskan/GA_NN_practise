let SPEED_OF_CAR = 1;
let ROTATE_ANGLE_OF_CAR = 1.5;
let MAX_ROTATE_ANGLE = 90;
class CAR {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {string} color
     * @param {Object} canvas_2d
     * @param {Array} road_rect - [x, y, w, h]
     * @param {Object} nn - neural network
     */
    constructor(x, y, width, height, color, canvas_2d, road_rect, nn) {
        this.x = x; this.x_keeper = x;
        this.y = y; this.y_keeper = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.canvas_2d = canvas_2d;
        this.angle = 0;
        this.road_rect = road_rect;
        this.hit = false;
        this.nn = nn;
    }

    reset(){
        this.hit = false;
        this.x = this.x_keeper;
        this.y = this.y_keeper;
        this.angle = 0;
    }

    /**
     * draws car then reset transform matrix
     */
    draw (){
        this.canvas_2d.fillStyle = this.color;
        this.canvas_2d.fillRect(this.x, this.y, this.width, this.height);
        this.canvas_2d.resetTransform();
    };

    /**
     * rotates car
     * rotate point is center of car
     * @param {number} angle
     */
    rotate(angle){
        if(MAX_ROTATE_ANGLE > this.angle + angle && -MAX_ROTATE_ANGLE < this.angle + angle){
            this.angle += angle;
            let temp_pos = this.center_of_car();
            this.canvas_2d.translate(temp_pos[0], temp_pos[1]);//translate canvas origin to center of car
            this.canvas_2d.rotate(this.angle * Math.PI / 180);
            this.canvas_2d.translate(-temp_pos[0], -temp_pos[1]);//translate canvas origin to (0, 0)
        }
    }

    /**
     * Moves car according to direction_vector
     */
    move(){
        if(!this.hit) {
            let rotate_direction = this.nn.forward(matrixFromArray(NETWORK_SHAPE[0], 1, this.calculate_distances())).getMaxElementIndex()[0];
            this.rotate(rotate_direction === 0 ? ROTATE_ANGLE_OF_CAR : - ROTATE_ANGLE_OF_CAR);
            this.collisionDetectorWithColor();
            let move_vector = this.vector_rotate(this.direction_vector(), this.deg_to_rad(this.angle));
            this.x += move_vector[0];
            this.y += move_vector[1];
            this.draw();
        }
    }

    /**
     * calculates center of car, returns [x, y]
     * @returns {number[]} [x, y]
     */
    center_of_car(){
        return [this.x + this.width / 2, this.y + this.height / 2];
    }

    /**
     * returns direction vector (0, 0)----->(SPEED_OF_CAR, 0)
     * @returns {number[]}
     */
    direction_vector(speed = SPEED_OF_CAR){
        if(speed <= 0) throw("speed of car must be > 0");
        return [speed, 0];
    }

    /**
     * rotates vector according to given angle(in radian)
     * and returns
     * @param {Array} vector
     * @param {number} angle in radian
     * @returns {number[]} [x, y]
     */
    vector_rotate(vector, angle){
        /*
           | cosT  -sinT | |x|
           | sinT   cosT | |y|
         */
        return[vector[0] * Math.cos(angle) - vector[1] * Math.sin(angle),
               vector[0] * Math.sin(angle) + vector[1] * Math.cos(angle)];
    }

    /**
     * degree to radian
     * @param {number} degree
     * @returns {number}
     */
    deg_to_rad(degree){
        return degree * Math.PI / 180;
    }

    /**
     * @param x
     * @param y
     * @returns {number[]} r g b a
     */
    getPixelColor(x, y){
        x = Math.floor(x); y = Math.floor(y);
        let data = this.canvas_2d.getImageData(x, y, 1, 1).data;
        return [data[0], data[1], data[2], data[3]];
    }

    /**
     * Adds two vectors
     * @param vector0
     * @param vector1
     * @returns {Array}
     */
    vector_addition(vector0, vector1){
        if(vector0.length !== vector1.length) throw("Vector length must be equal!");
        let result = [];
        for(let i = 0; i < vector0.length; i++) result[result.length] = vector0[i] + vector1[i];
        return result;
    }


    collisionDetectorWithColor(){
        /*
            *-----*
            | car |     Corner of the car can collide.
            *-----*
         */
        //Calculates corners' position
        let center = this.center_of_car();
        let left_back   = [-this.width / 2, -this.height / 2];
        let left_front  = [ this.width / 2, -this.height / 2];
        let right_back  = [-this.width / 2,  this.height / 2];
        let right_front = [ this.width / 2,  this.height / 2];

        left_back   = this.vector_rotate(left_back, this.deg_to_rad(this.angle));
        left_front  = this.vector_rotate(left_front, this.deg_to_rad(this.angle));
        right_back  = this.vector_rotate(right_back, this.deg_to_rad(this.angle));
        right_front = this.vector_rotate(right_front, this.deg_to_rad(this.angle));

        //positions on canvas(left up => (0, 0))
        left_back   = this.vector_addition(left_back, center);
        left_front  = this.vector_addition(left_front, center);
        right_back  = this.vector_addition(right_back, center);
        right_front = this.vector_addition(right_front, center);

        if(isEqual(this.getPixelColor(left_back[0], left_back[1]), [0, 0, 0, 255]))     this.hit = true;//for road line
        if(isEqual(this.getPixelColor(left_front[0], left_front[1]), [0, 0, 0, 255]))   this.hit = true;//for road line
        if(isEqual([0, 0, 0, 255], this.getPixelColor(right_front[0], right_front[1]))) this.hit = true;//for road line
        if(isEqual(this.getPixelColor(right_back[0], right_back[1]), [0, 0, 0, 255]))   this.hit = true;//for road line
        if(isEqual(this.getPixelColor(left_front[0], left_front[1]), [0, 128, 0, 255]))   this.hit = true;//for finish line
        if(isEqual([0, 128, 0, 255], this.getPixelColor(right_front[0], right_front[1]))) this.hit = true;//for finish line

    }
    /**
    collision_detector() {
        /*
            *-----*
            | car |     Corner of the car can collide.
            *-----*
         */
    /*
        //Calculates corners' position
        let center = this.center_of_car();
        let left_back   = [-this.width / 2, -this.height / 2];
        let left_front  = [ this.width / 2, -this.height / 2];
        let right_back  = [-this.width / 2,  this.height / 2];
        let right_front = [ this.width / 2,  this.height / 2];

        left_back   = this.vector_rotate(left_back, this.deg_to_rad(this.angle));
        left_front  = this.vector_rotate(left_front, this.deg_to_rad(this.angle));
        right_back  = this.vector_rotate(right_back, this.deg_to_rad(this.angle));
        right_front = this.vector_rotate(right_front, this.deg_to_rad(this.angle));

        left_back   = this.vector_addition(left_back, center);
        left_front  = this.vector_addition(left_front, center);
        right_back  = this.vector_addition(right_back, center);
        right_front = this.vector_addition(right_front, center);
        //..............

        if(this.road_rect[1] > left_front[1])                      this.hit = true;// left_front_corner.y > road.y
        if(this.road_rect[1] > left_back[1])                       this.hit = true;// left_back_corner.y > road.y
        if(this.road_rect[1] + this.road_rect[3] < right_front[1]) this.hit = true;// right_front_corner.y < road.y + road.h
        if(this.road_rect[1] + this.road_rect[3] < right_back[1])  this.hit = true;// right_back_corner.y < road.y + road.h
        if(this.road_rect[2] - 20 < left_front[0])                 this.hit = true;// when left_front pass finish line
        if(this.road_rect[2] - 20 < right_front[0])                this.hit = true;// when right_front pass finish line
    }
    */

    /**
     * @returns {number[]} - [left_distance, right_distance]
     */
    calculate_distances(){
        /*
                  | left_vector
                *---*                (vec.x / vec.y) * point.y = point.x
                |   |
                *---*
                  | right_vector
         */
        let center = this.center_of_car();
        let _0 = this.vector_addition(this.vector_rotate(this.direction_vector(30), this.deg_to_rad(this.angle - 30)), center);
        let _1 = this.vector_addition(this.vector_rotate(this.direction_vector(50), this.deg_to_rad(this.angle - 30)), center);
        let _2 = this.vector_addition(this.vector_rotate(this.direction_vector(70), this.deg_to_rad(this.angle - 30)), center);
        let _3 = this.vector_addition(this.vector_rotate(this.direction_vector(30), this.deg_to_rad(this.angle + 30)), center);
        let _4 = this.vector_addition(this.vector_rotate(this.direction_vector(50), this.deg_to_rad(this.angle + 30)), center);
        let _5 = this.vector_addition(this.vector_rotate(this.direction_vector(70), this.deg_to_rad(this.angle + 30)), center);
        //let _6 = this.vector_addition(this.vector_rotate(this.direction_vector(90), this.deg_to_rad(this.angle + 20)), center);

        let _00 = isEqual(this.getPixelColor(_0[0], _0[1]), [0, 0, 0, 255]);
        let _11 = isEqual(this.getPixelColor(_1[0], _1[1]), [0, 0, 0, 255]);
        let _22 = isEqual(this.getPixelColor(_2[0], _2[1]), [0, 0, 0, 255]);
        let _33 = isEqual(this.getPixelColor(_3[0], _3[1]), [0, 0, 0, 255]);
        let _44 = isEqual(this.getPixelColor(_4[0], _4[1]), [0, 0, 0, 255]);
        let _55 = isEqual(this.getPixelColor(_5[0], _5[1]), [0, 0, 0, 255]);
        //let _66 = isEqual(this.getPixelColor(_6[0], _6[1]), [0, 0, 0, 255]);

        this.helper(_0[0], _0[1], 2, 2);
        this.helper(_1[0], _1[1], 2, 2);
        this.helper(_2[0], _2[1], 2, 2);
        this.helper(_3[0], _3[1], 2, 2);
        this.helper(_4[0], _4[1], 2, 2);
        this.helper(_5[0], _5[1], 2, 2);
        //this.helper(_p60[0], _p60[1], 2, 2);
        //this.helper(_n60[0], _n60[1], 2, 2);

        //this.helper(forwardCollisionVector0[0], forwardCollisionVector0[1], 2, 2);
        //if(forwardCollision0 && forwardCollision1) console.log("HIT")
        return [
            _00 ? -30 : 30,
            _11 ? -20 : 20,
            _22 ? -10 : 10,
            _33 ? -30 : 30,
            _44 ? -20 : 20,
            _55 ? -10 : 10,
            this.angle];
    }

    /**
     * draw rect to help :)
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     */
    helper(x, y, w, h){
        this.canvas_2d.fillStyle = "green";
        this.canvas_2d.fillRect(x, y, w, h);
    }

    /**
     *
     * @param vector
     * @returns {number} - length of vector
     */
    vector_length(vector){
        let result = 0;
        for(let i = 0; i < vector.length; i++) result += vector[i] * vector[i];
        return Math.pow(result, 1/2);
    }
}
