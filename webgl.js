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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
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
        alert('シャーダーの初期化に失敗');
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

var triangleVertexPositionBuffer;
var triangleVertexColorBuffer;
var squareVertexPositionBuffer;
var squareVertexColorBuffer;
var cameraVertexPositionBuffer;
var cameraVertexColorBuffer;

var initBuffers = function(){
    // 三角形の情報
    // 三角形の頂点
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var vertices = [
         0.0,  1.0, 0.0,
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0,0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;
    // 三角形の頂点の色
    triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    var colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    triangleVertexColorBuffer.itemSize = 3;
    triangleVertexColorBuffer.numItems = 4;

    // 四角形の情報
    // 四角形の頂点
    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    vertices = [
         1.0,  1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0,0
        -1.0, -1.0, 0,0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;
    // 四角形の頂点の色
    squareVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    colors = [];
    for(var i=0; i<4; i++){
        colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    squareVertexColorBuffer.itemSize = 4;
    squareVertexColorBuffer.numItems = 4;

    // カメラの情報
    // カメラの頂点
    cameraVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cameraVertexPositionBuffer);
    vertices = [
         1.0,  1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0,0
        -1.0, -1.0, 0,0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cameraVertexPositionBuffer.itemSize = 3;
    cameraVertexPositionBuffer.numItems = 4;
    // カメラの頂点の色
    cameraVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cameraVertexColorBuffer);
    colors = [];
    for(var i=0; i<4; i++){
        colors = colors.concat([1.0, 0.5, 1.0, 1.0]);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    cameraVertexColorBuffer.itemSize = 4;
    cameraVertexColorBuffer.numItems = 4;
};

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
var pitch = -45;
var yaw = 0;
var pos = new Vector(0,50,50);
var cameraPos = new Vector(0, 0, 0);
var drawScene = function(){
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, pMatrix);

    mat4.identity(mvMatrix);
    mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
    mat4.translate(mvMatrix, pos.toArrayInverse());


    // 三角形の描画
    mat4.rotate(mvMatrix, degToRad(35), [0, 1, 0]);
    mat4.translate(mvMatrix, [-1.5, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

    // 四角形の描画
    mat4.rotate(mvMatrix, degToRad(-35), [0, 1, 0]);
    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);

    // カメラの描画
//    mat4.translate(mvMatrix, cameraPos.toArray());
    mat4.rotate(mvMatrix, degToRad(cameraDegrees), [0, 1, 0]);
    mat4.translate(mvMatrix, [-1.5, 0, 0]);
    mat4.translate(mvMatrix, cameraPos.toArray());
    gl.bindBuffer(gl.ARRAY_BUFFER, cameraVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cameraVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cameraVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cameraVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, cameraVertexPositionBuffer.numItems);

};

var aimCamera = function(pos, aimPos, distance, degrees){
    pos.z = aimPos.z + Math.cos(degToRad(degrees)) * distance;
    pos.x = aimPos.x + Math.sin(degToRad(degrees)) * distance;
};
var lastTime = 0;
var cameraDegrees = 0;
var animate = function(){
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        cameraDegrees += 1;
        if(cameraDegrees >= 360){
            cameraDegrees -= 360;
        }
        aimCamera(cameraPos, new Vector(0, 0, 0), 10, cameraDegrees);
    }
    lastTime = timeNow;
    console.log('cameraPos : ', cameraPos);
}

var tick = function() {
    requestAnimFrame(tick);
    drawScene();
    animate();
}

