'use strict';

var Camera = function(){
    this.primitive = new Primitive();
};
Camera.prototype.initialize = function(){
    var vertices = [
         1.0,  1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0,
    ];
    var colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.5, 0.5, 0.5, 1.0,
    ];
    this.primitive.setVertex4(vertices, colors);
    this.primitive.setRotate(0, new Vector(0, 1, 0));
    this.primitive.setPos(new Vector(0, 0, 0));
};
Camera.prototype.setPos = function(pos){
    this.primitive.setPos(pos);
};
Camera.prototype.setRotate = function(degrees, axis){
    this.primitive.setRotate(degrees, axis);
};
Camera.prototype.setting = function(matrix){
    mat4.rotate(matrix, degToRad(-this.primitive.rotateDegrees()), this.primitive.rotateAxis());
    mat4.translate(matrix, this.primitive.posToArrayInverse());
};
Camera.prototype.draw = function(matrix){
    gl.disable(gl.CULL_FACE);
    this.primitive.draw(matrix);
    gl.enable(gl.CULL_FACE);
};
Camera.prototype.aimRotate = function(pos, distance, degrees){
    if(degrees > 360){
        degrees -= 360;
    }
    if(degrees < 0){
        degrees += 360;
    }
    var own_pos = this.primitive.clonePos();
    own_pos.z = pos.z + (Math.cos(degToRad(degrees)) * distance);
    own_pos.x = pos.x + (Math.sin(degToRad(degrees)) * distance);
    this.setPos(own_pos);
    this.primitive.setRotate(degrees, new Vector(0, 1, 0));
};
Camera.prototype.aimRotate1sec = function(elapsed, pos, distance){
    var degrees = this.primitive.rotateDegrees() + (360 * elapsed / (1000 * 1));
    this.aimRotate(pos, distance, degrees);
};
Camera.prototype.aimRotate5sec = function(elapsed, pos, distance){
    var degrees = this.primitive.rotateDegrees() + (360 * elapsed / (1000 * 5));
    this.aimRotate(pos, distance, degrees);
};
Camera.prototype.aimRotate10sec = function(elapsed, pos, distance){
    var degrees = this.primitive.rotateDegrees() + (360 * elapsed / (1000 * 10));
    this.aimRotate(pos, distance, degrees);
};
Camera.prototype.aimRotate1min = function(elapsed, pos, distance){
    var degrees = this.primitive.rotateDegrees() + (360 * elapsed / (1000 * 60 * 1));
    this.aimRotate(pos, distance, degrees);
};
