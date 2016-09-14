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
    initBuffers();
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
    if(toggleCamera){
        pitch = -45;
    }
    else{
        pitch = 0;
    }
};
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
        -1.0, -1.0, -1.0,   // 左下奥
        -1.0,  1.0,  1.0,   // 左上前
        -1.0, -1.0,  1.0,   // 左下前
    ];
    colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
    ];
    prim2.setVertex(vertices, 16, colors, 16);
    prim2.setRotate(0, new Vector(0, 1, 0));
    prim2.setPos(new Vector(-1.5, 0, 0));
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

var cameraVertexPositionBuffer;
var cameraVertexColorBuffer;

var initBuffers = function(){
    // カメラの情報
    // カメラの頂点
    cameraVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cameraVertexPositionBuffer);
    vertices = [
         1.0,  1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0,

        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cameraVertexPositionBuffer.itemSize = 3;
    cameraVertexPositionBuffer.numItems = 8;
    // カメラの頂点の色
    cameraVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cameraVertexColorBuffer);
    colors = [];
    for(var i=0; i<8; i++){
        colors = colors.concat([1.0, 0.5, 1.0, 1.0]);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    cameraVertexColorBuffer.itemSize = 4;
    cameraVertexColorBuffer.numItems = 8;
};

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
var drawPrimitive = function(matrix, positionBuffer, colorBuffer, pos, rotDegrees, rotAxis){
    // 移動の後に回転
    if(pos != null){
        mat4.translate(matrix, pos.toArray());
    }
    if(rotDegrees != null && rotAxis != null){
        mat4.rotate(matrix, degToRad(rotDegrees), rotAxis.toArray());
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, positionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, positionBuffer.numItems);

    // 移動や回転を戻す
    if(rotDegrees != null && rotAxis != null){
        mat4.rotate(matrix, degToRad(-rotDegrees), rotAxis.toArray());
    }
    if(pos != null){
        mat4.translate(matrix, pos.toArrayInverse());
    }
};
var pitch = -45;
var yaw = 0;
var pos = new Vector(0,20,20);
var cameraPos = new Vector(0, 0, 0);
var drawScene = function(){
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, pMatrix);

    mat4.identity(mvMatrix);
    mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
    if(toggleCamera){
        mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
        mat4.translate(mvMatrix, pos.toArrayInverse());
    }
    else{
        mat4.rotate(mvMatrix, degToRad(-cameraDegrees), [0, 1, 0]);
        mat4.translate(mvMatrix, cameraPos.toArrayInverse());
    }

    // カメラの描画
    drawPrimitive(mvMatrix, cameraVertexPositionBuffer, cameraVertexColorBuffer, cameraPos, cameraDegrees, new Vector(0, 1, 0, 22.5));

    prim1.draw(mvMatrix);
    prim2.draw(mvMatrix);
};

var aimCamera = function(pos, aimPos, distance, degrees){
    pos.z = aimPos.z + (Math.cos(degToRad(degrees)) * distance);
    pos.x = aimPos.x + (Math.sin(degToRad(degrees)) * distance);
};
var lastTime = 0;
var cameraDegrees = 0;
var animate = function(){
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        cameraDegrees += 1.5;
        if(cameraDegrees >= 360){
            cameraDegrees -= 360;
        }
        if(cameraDegrees < 0){
            cameraDegrees += 360;
        }
        aimCamera(cameraPos, new Vector(0, 0, 0), 10, cameraDegrees);
    }
    lastTime = timeNow;
}

var tick = function() {
    requestAnimFrame(tick);
    drawScene();
    animate();
}

