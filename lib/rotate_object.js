'use strict';

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

