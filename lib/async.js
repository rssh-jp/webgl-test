'use strict';
var Async = function(){
};
Async.prototype.waterfall = function(list, callback){
    var index = 0;
    var error = null;
    var is_exec = false;
    var length = list.length;
    var loop = function(){
        if(index >= length || error != null){
            callback(error);
            return;
        }
        if(is_exec){
            setTimeout(loop, 0);
            return;
        }
        is_exec = true;
        list[index](function(cb){
            if(cb != null){
                error = cb;
            }
            is_exec = false;
            index++;
        });
        setTimeout(loop, 0);
    };
    setTimeout(loop, 0);
};
Async.prototype.parallel = function(list, callback){
    var error = null;
    var is_exec = false;
    var loop = function(){
        if(error != null){
            callback(error);
            return;
        }
        if(is_exec){
            setTimeout(loop, 0);
            return;
        }
        is_exec = true;
        for(var i=0; i<list.length; i++){
            var val = list[i];
            val(function(cb){
                if(cb != null){
                    error = cb;
                }
            });
        }
        setTimeout(loop, 0);
    };
    setTimeout(loop, 0);
};

