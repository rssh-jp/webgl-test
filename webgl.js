var gl = null;
var startWebGl = function(){
    var canvas = document.getElementById('canvassample');
    var parms = {
        alpha : true,
        stencil : false,
        antialias : true,
    };
    initGL(canvas);
    initShaders();
    initObject();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    document.onmousedown = function(e){
        evMouseDown(e);
    };

    tick();
};
var toggleCamera = true;
var evMouseDown = function(e){
    console.log('e : ', e);
    toggleCamera = toggleCamera ? false : true;
};
var cameraMain = new Camera();
var cameraAim = new Camera();
var prim1 = new Primitive();
var prim2 = new Primitive();
var initObject = function(){
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
    prim1.setVertex4(vertices, colors);
    prim1.setRotate(0, new Vector(0, 1, 0));
    prim1.setPos(new Vector(1.5, 0, 0));

    vertices = [
        -1.0, -1.0,  1.0,   // 左下前
         1.0, -1.0,  1.0,   // 右下前
        -1.0,  1.0,  1.0,   // 左上前
         1.0,  1.0,  1.0,   // 右上前

         1.0,  1.0,  1.0,   // 右上前
         1.0, -1.0,  1.0,   // 右下前
         1.0,  1.0, -1.0,   // 右上奥
         1.0, -1.0, -1.0,   // 右下奥

         1.0, -1.0, -1.0,   // 右下奥
        -1.0, -1.0, -1.0,   // 左下奥
         1.0,  1.0, -1.0,   // 右上奥
        -1.0,  1.0, -1.0,   // 左上奥

        -1.0,  1.0, -1.0,   // 左上奥
        -1.0, -1.0, -1.0,   // 左下奥
        -1.0,  1.0,  1.0,   // 左上前
        -1.0, -1.0,  1.0,   // 左下前

        -1.0,  1.0, -1.0,   // 左上奥
        -1.0,  1.0,  1.0,   // 左上前
         1.0,  1.0, -1.0,   // 右上奥
         1.0,  1.0,  1.0,   // 右上前

        -1.0, -1.0,  1.0,   // 左下前
        -1.0, -1.0, -1.0,   // 左下奥
         1.0, -1.0,  1.0,   // 右下前
         1.0, -1.0, -1.0,   // 右下奥
    ];
    colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,

        1.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0,

        0.0, 1.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,

        1.0, 1.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        1.0, 1.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,

        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
    ];
    prim2.setVertex(vertices, 24, colors, 24);
    prim2.setRotate(0, new Vector(0, 1, 0));
    prim2.setPos(new Vector(-1.5, 0, 0));

    // カメラ初期化
    cameraMain.initialize();
    cameraMain.setPos(new Vector(0, 20, 20));
    cameraMain.setRotate(-45, new Vector(1, 0, 0));
    cameraAim.initialize();
    cameraAim.setPos(new Vector(0, 0, 0));
    cameraAim.setRotate(0, new Vector(0, 1, 0));
};
var initGL = function(canvas){
    try{
        gl = canvas.getContext('experimental-webgl');
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    }
    catch(e){
    }
    if(!gl){
        alert('webglを初期化できませんでした');
    }
};

var getShader = function(gl, id){
    var shaderScript = document.getElementById(id);
    if(!shaderScript){
        return null;
    }

    var str = '';
    var k = shaderScript.firstChild;
    while(k){
        if(k.nodeType == 3){
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if(shaderScript.type == 'x-shader/x-fragment'){
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else if(shaderScript.type == 'x-shader/x-vertex'){
        shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else{
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
};
var shaderProgram;

var initShaders = function(){
    var fragmentShader = getShader(gl, 'shader-fs');
    var vertexShader = getShader(gl, 'shader-vs');

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        alert('シェーダーの初期化に失敗');
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
};

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var setMatrixUniforms = function(){
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
};

var drawScene = function(){
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, pMatrix);

    mat4.identity(mvMatrix);
    if(toggleCamera){
        cameraMain.setting(mvMatrix);
    }
    else{
        cameraAim.setting(mvMatrix);
    }

    // カメラの描画
    cameraAim.draw(mvMatrix);

    // プリミティブの描画
    prim1.draw(mvMatrix);
    prim2.draw(mvMatrix);
};

var lastTime = 0;
var animate = function(){
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        // エイムするカメラの移動
        cameraAim.aimRotate5sec(elapsed, new Vector(0, 0, 0), 10);
    }
    lastTime = timeNow;
}

var tick = function() {
    requestAnimFrame(tick);
    drawScene();
    animate();
}

