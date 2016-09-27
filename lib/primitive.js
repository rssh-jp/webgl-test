'use strict';

var VertexBuffer = function(){
    this.position = null;
    this.color = null;
    this.texture = null;
    this.index = null;
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
VertexBuffer.prototype.setPositionArray = function(list, item_num){
    this.position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW);
    this.position.itemSize = 3;
    this.position.numItems = item_num;
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
VertexBuffer.prototype.setColorArray = function(list, item_num){
    this.color = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW);
    this.color.itemSize = 4;
    this.color.numItems = item_num;
};
VertexBuffer.prototype.setTextureArray3 = function(list){
    this.texture = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texture);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW);
    this.texture.itemSize = 2;
    this.texture.numItems = 3;
};
VertexBuffer.prototype.setTextureArray4 = function(list){
    this.texture = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texture);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW);
    this.texture.itemSize = 2;
    this.texture.numItems = 4;
};
VertexBuffer.prototype.setTextureArray = function(list, item_num){
    this.texture = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texture);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW);
    this.texture.itemSize = 2;
    this.texture.numItems = item_num;
};
VertexBuffer.prototype.setIndexArray3 = function(list){
    this.index = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(list), gl.STATIC_DRAW);
    this.index.itemSize = 1;
    this.index.numItems = 3;
};
VertexBuffer.prototype.setIndexArray4 = function(list){
    this.index = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(list), gl.STATIC_DRAW);
    this.index.itemSize = 1;
    this.index.numItems = 6;
};
VertexBuffer.prototype.setIndexArray = function(list, item_num){
    this.index = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(list), gl.STATIC_DRAW);
    this.index.itemSize = 1;
    this.index.numItems = item_num;
};
VertexBuffer.prototype.getPosition = function(){
    return this.position;
};
VertexBuffer.prototype.getColor = function(){
    return this.color;
};
VertexBuffer.prototype.getTexture = function(){
    return this.texture;
};
VertexBuffer.prototype.getIndex = function(){
    return this.index;
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
VertexBuffer.prototype.getTextureItemSize = function(){
    return this.texture.itemSize;
};
VertexBuffer.prototype.getTextureItemNum = function(){
    return this.texture.numItems;
};
VertexBuffer.prototype.getIndexItemSize = function(){
    return this.index.itemSize;
};
VertexBuffer.prototype.getIndexItemNum = function(){
    return this.index.numItems;
};
VertexBuffer.prototype.isValid = function(){
    if(this.position == null || this.texture == null){
        return false;
    }
    return true;
};


var Texture = function(texPath){
    this.is_loaded = false;
    this.texture = null;
    if(texPath == null){
        console.log('null');
        return;
    }
    this.setTexture(texPath);
};
Texture.prototype.setTexture = function(texPath){
    var self = this;
    this.texture = gl.createTexture();
    this.texture.image = new Image();
    this.texture.image.onload = function(){
        self.loadedTexture(self);
    };
    this.texture.image.src = texPath;
};
Texture.prototype.loadedTexture = function(self){
    gl.bindTexture(gl.TEXTURE_2D, self.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self.texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
    //console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    //for(var key in self.texture.image){
    //    var val = self.texture.image[key];
    //    console.log(key + ' : ', val);
    //}
    //console.log('tex : ', self.texture);
    self.is_loaded = true;
};
Texture.prototype.isValid = function(){
    return this.is_loaded;
};
Texture.prototype.getTexture = function(){
    return this.texture;
};


var Primitive = function(texPath){
    this.vertexBuffer = new VertexBuffer();
    this.pos = new Vector(0, 0, 0);
    this.rotate = new RotateObject();
    this.texture = new Texture(texPath);
};
Primitive.prototype.setVertex4 = function(position_list, texture_list, index_list){
    this.vertexBuffer.setPositionArray4(position_list);
    this.vertexBuffer.setTextureArray4(texture_list);
    this.vertexBuffer.setIndexArray4(index_list);
};
Primitive.prototype.setVertex = function(position_list, position_item_num, texture_list, texture_item_num, index_list, index_item_num){
    this.vertexBuffer.setPositionArray(position_list, position_item_num);
    this.vertexBuffer.setTextureArray(texture_list, texture_item_num);
    this.vertexBuffer.setIndexArray(index_list, index_item_num);
};
Primitive.prototype.setRotate = function(degrees, axis){
    this.rotate.set(degrees, axis);
};
Primitive.prototype.setPos = function(v){
    this.pos = v;
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
Primitive.prototype.clonePos = function(){
    return this.pos.clone();
};
Primitive.prototype.rotateDegrees = function(){
    return this.rotate.getDegrees();
};
Primitive.prototype.rotateAxis = function(){
    return this.rotate.getAxis();
};
Primitive.prototype.draw = function(matrix){
    if(!this.texture.isValid() || !this.vertexBuffer.isValid()){
        return;
    }
    // 移動の後に回転
    mat4.translate(matrix, this.posToArray());
    mat4.rotate(matrix, degToRad(this.rotateDegrees()), this.rotateAxis());

    // 描画
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.getPosition());
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexBuffer.getPositionItemSize(), gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.getTexture());
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexBuffer.getTextureItemSize(), gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture.getTexture());
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexBuffer.getIndex());
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, this.vertexBuffer.getIndexItemNum(), gl.UNSIGNED_SHORT, 0);

    // 移動や回転を戻す
    mat4.rotate(matrix, degToRad(-this.rotateDegrees()), this.rotateAxis());
    mat4.translate(matrix, this.posToArrayInverse());
};

