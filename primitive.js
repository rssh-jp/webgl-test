'use strict';

var VertexBuffer = function(){
    this.position = null;
    this.color = null;
};
VertexBuffer.prototype.setPositionArray3 = function(list){
    this.position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW);
    this.position.itemSize = 3;
    this.position.numItems = 3;
};
VertexBuffer.prototype.setPositionArray4 = function(list){
    this.position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW);
    this.position.itemSize = 3;
    this.position.numItems = 4;
};
VertexBuffer.prototype.setColorArray3 = function(list){
    this.color = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW);
    this.color.itemSize = 3;
    this.color.numItems = 4;
};
VertexBuffer.prototype.setColorArray4 = function(list){
    this.color = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW);
    this.color.itemSize = 4;
    this.color.numItems = 4;
};
VertexBuffer.prototype.getPosition = function(){
    return this.position;
};
VertexBuffer.prototype.getColor = function(){
    return this.color;
};
VertexBuffer.prototype.getPositionItemSize = function(){
    return this.position.itemSize;
};
VertexBuffer.prototype.getPositionItemNum = function(){
    return this.position.numItems;
};
VertexBuffer.prototype.getColorItemSize = function(){
    return this.color.itemSize;
};
VertexBuffer.prototype.getColorItemNum = function(){
    return this.color.numItems;
};
VertexBuffer.prototype.isValid = function(){
    if(this.position == null || this.color == null){
        return false;
    }
    return true;
};



var RotateObject = function(){
    this.degrees = 0;
    this.axis = new Vector(0, 0, 0);
};
RotateObject.prototype.set = function(degrees, axis){
    this.degrees = degrees;
    this.axis = axis;
};
RotateObject.prototype.getDegrees = function(){
    return this.degrees;
};
RotateObject.prototype.getAxis = function(){
    return this.axis.toArray();
};



var Primitive = function(){
    this.vertexBuffer = new VertexBuffer();
    this.pos = new Vector(0, 0, 0);
    this.rotate = new RotateObject();
};
Primitive.prototype.setVertex4 = function(position_list, color_list){
    this.vertexBuffer.setPositionArray4(position_list);
    this.vertexBuffer.setColorArray4(color_list);
};
Primitive.prototype.setRotate = function(degrees, axis){
    this.rotate.set(degrees, axis);
};
Primitive.prototype.addPos = function(v){
    this.pos.add(v);
};
Primitive.prototype.posToArray = function(){
    return [this.pos.x, this.pos.y, this.pos.z];
};
Primitive.prototype.posToArrayInverse = function(){
    return [-this.pos.x, -this.pos.y, -this.pos.z];
};
Primitive.prototype.rotateDegrees = function(){
    return this.rotate.getDegrees();
};
Primitive.prototype.rotateAxis = function(){
    return this.rotate.getAxis();
};
Primitive.prototype.draw = function(matrix){
    // 移動の後に回転
    mat4.translate(matrix, this.posToArray());
    mat4.rotate(matrix, degToRad(this.rotateDegrees()), this.rotateAxis());
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.getPosition());
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexBuffer.getPositionItemSize(), gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.getColor());
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.vertexBuffer.getColorItemSize(), gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertexBuffer.getPositionItemNum());

    // 移動や回転を戻す
    mat4.rotate(matrix, degToRad(-this.rotateDegrees()), this.rotateAxis());
    mat4.translate(matrix, this.posToArrayInverse());
};

