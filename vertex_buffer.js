'use strict';

var VertexBuffer = function(){
};
VertexBuffer.prototype.setPositonArray3 = function(list){
    this.position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW);
    this.position.itemSize = 3;
    this.position.numItems = 3;
};
VertexBuffer.prototype.setPositonArray4 = function(list){
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
