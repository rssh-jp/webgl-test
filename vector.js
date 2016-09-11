'use strict';

var Vector = function(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
};
Vector.prototype.set = function(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
};
Vector.prototype.toArray = function(){
    return [this.x, this.y, this.z];
};
Vector.prototype.toArrayInverse = function(){
    return [-this.x, -this.y, -this.z];
};

Vector.prototype.add = function(v){
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
};
Vector.prototype.sub = function(v){
    return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
};
Vector.prototype.mul = function(num){
    return new Vector(this.x * num, this.y * num, this.z * num);
};
Vector.prototype.div = function(num){
    return new Vector(this.x / num, this.y / num, this.z / num);
};
Vector.prototype.length = function(){
    return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
};
Vector.prototype.normalize = function(){
    return this.div(this.length());
};
Vector.prototype.dot = function(v){
    return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
};
Vector.prototype.cross = function(v){
    return new Vector((this.y * v.z) - (this.z * v.y), (this.x * v.z) - (this.z * v.x), (this.x * v.y) - (this.y * v.x));
};

