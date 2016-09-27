var toggleCamera = true;
var evMouseDown = function(e){
    console.log('e : ', e);
    toggleCamera = toggleCamera ? false : true;
};
var cameraMain = null;
var cameraAim = null;
var prim1 = null;
var prim2 = null;
var initObject = function(){
    cameraMain = new Camera();
    cameraAim = new Camera();
    prim1 = new Primitive('rsrc/white.png');
    prim2 = new Primitive('rsrc/white.png');
    var vertices = [
        // Front face
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0,
         1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
    ];
    var textures = [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ];
    var indexes = [
        0, 1, 2,      0, 2, 3,    // Front face
    ];
    prim1.setVertex4(vertices, textures, indexes);
    prim1.setRotate(0, new Vector(0, 1, 0));
    prim1.setPos(new Vector(1.5, 0, 0));

    vertices = [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ];
    textures = [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ];
    indexes = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ];
    prim2.setVertex(vertices, 24, textures, 24, indexes, 36);
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

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
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

var gl = null;
var startWebGl = function(){
    var async = new Async();
    var task = [];
    // webglの初期化
    task.push(function(next){
        var canvas = document.getElementById('canvassample');
        var parms = {
            alpha : true,
            stencil : false,
            antialias : true,
        };
        initGL(canvas);
        next(null);
    });
    // 初期ロード
    task.push(function(next){
        initShaders();
        initObject();
        next(null);
    });
    // 初期化の後片付け
    task.push(function(next){
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        document.onmousedown = function(e){
            evMouseDown(e);
        };
        next(null);
    });
    async.waterfall(task, function(error){
        if(error){
            console.log('error : ', error);
            return;
        }
        tick();
    });
};
