import * as THREE from 'three';
import Stats from 'stats-js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import GUI from 'lil-gui';

import "./style.css";
import scumfont from "three/examples/fonts/helvetiker_bold.typeface.json";
import resizeElement from './resize-element.js';
import skyboxJson from '../backend/skyboxes.json'

var buttonEl = document.getElementById('rand-button');
buttonEl.onclick = function(){
    loadSkybox();
};

var skyboxNameEl = document.getElementById('skybox-title');

var codeEl = document.getElementById('code');
codeEl.onclick = function(){
    navigator.clipboard.writeText(codeEl.innerText);
}
var listEl = document.getElementById('skybox-list');

var skyboxCount = 0;
for (var skybox in skyboxJson) {
    let rowEl = document.createElement('div');
    rowEl.innerText = skybox;
    rowEl.setAttribute("data-position", skyboxCount)
    skyboxCount++;
    listEl.appendChild(rowEl);

    rowEl.onclick = function(){
        if (!this.classList.contains("active"))
            loadSkybox(rowEl.innerText);
    };
}

document.getElementById("next").onclick = function () {
    nextSkybox(1)
}

document.getElementById("prev").onclick = function () {
    nextSkybox(-1)
}

function loadSkybox(name) {
    var newSkybox = loader.load(getSkybox(name));
    scene.background = newSkybox;
    material.envMap = newSkybox;
    textMaterial.envMap = newSkybox;
}

function nextSkybox(direction) {
    for (let child of listEl.children) {
        if (child.classList.contains("active")) {
            var nextbox = Object.keys(skyboxJson)[parseInt(child.dataset.position)+direction];
            if (nextbox !== undefined)   
                loadSkybox(nextbox);
        }
     }
}

function getSkybox(name) {
    // console.log("getSkybox", skyboxJson.length)
    var count = Object.keys(skyboxJson).length;
    var keys = Object.keys(skyboxJson);
    var skybox, randbox;
    let withPaths = [];

    if (count == 0) {
        console.log("No skyboxes found.");
        skyboxNameEl.innerText = "No skyboxes found.";
        return;
    }
    if (typeof name !== 'undefined') {
        skybox = skyboxJson[name].array;
    } else {
        // pick random skybox
        var name = keys[ keys.length * Math.random() << 0];
        skybox = skyboxJson[name].array;
        // skybox = randbox.array;
        console.log(skyboxJson[keys[ keys.length * Math.random() << 0]])
    }

    skyboxNameEl.innerText = name;
    document.getElementById("skybox-download").href = 'skyboxes/' + name + ".zip";
    if (skyboxJson[name].source === undefined) {
        document.getElementById("skybox-source").innerText = "Sorry, no source";
        document.getElementById("skybox-source").target = "";
        document.getElementById("skybox-source").href = "#";
    } else {
        document.getElementById("skybox-source").innerText = "Source";
        document.getElementById("skybox-source").target = "_blank";
        document.getElementById("skybox-source").href = skyboxJson[name].source;
    }

    for (let child of listEl.children) {
        child.classList.remove('active');
        if (child.innerText == name) {
            child.classList.add("active")
        }
     }

    codeEl.innerText = 
`const loader = new THREE.CubeTextureLoader();
const skybox = loader.load([
    ${skybox[0]},
    ${skybox[1]},
    ${skybox[2]},
    ${skybox[3]},
    ${skybox[4]},
    ${skybox[5]},
]);
scene.background = skybox;`

    for (var i = 0; i < skybox.length; i++) {
        withPaths[i] = "skyboxes/" + skybox[i];
    }
    return withPaths
}


// function main() {
    const canvas = document.querySelector('.webgl');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setClearColor(0x222222);

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 10;

    const scene = new THREE.Scene();

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = true;
    controls.enableZoom = false;
    controls.enableDamping = true;

    // https://stackoverflow.com/questions/36676274/how-to-load-a-font-and-render-it-with-textgeometry
    const loaderfont = new FontLoader();
    const textMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );

    loaderfont.load( "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json", function ( font ) {
    
        const textGeo = new TextGeometry( "SCUM SYSTEMS", {
    
            font: font,
    
            size: 1,
            height: 0.2,
            curveSegments: 12,
    
            bevelThickness: 2,
            bevelSize: 5,
            bevelEnabled: false
    
        } );
    
    
        const mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( -5.5, 0, 0 );
    
        scene.add( mesh );
    
    } );

    const loader = new THREE.CubeTextureLoader();


    const spheres = [];

    const geometry = new THREE.SphereGeometry( 0.1, 32, 16 );
    // const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: skybox } );
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );

    for ( let i = 0; i < 5; i ++ ) {
        const mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = Math.random() * 10 - 5;
        mesh.position.y = Math.random() * 10 - 5;
        mesh.position.z = Math.random() * 10 - 5;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
        scene.add( mesh );
        spheres.push( mesh );
    }

    loadSkybox();


    // render loop
    function render(time) {
        const timer = 0.0001 * Date.now();
        for ( let i = 0, il = spheres.length; i < il; i ++ ) {
            const sphere = spheres[ i ];
            sphere.position.x = 5 * Math.cos( timer + i );
            sphere.position.y = 5 * Math.sin( timer + i * 1.1 );
        }

        controls.update(); // for autoRotate

        // responsive canvas - https://r105.threejsfundamentals.org/threejs/lessons/threejs-responsive.html
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);    
// }

// main();

// var stats = new Stats();
// stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild( stats.dom );

// function animate() {

// 	stats.begin();

// 	// monitored code goes here

// 	stats.end();

// 	requestAnimationFrame( animate );

// }

// requestAnimationFrame( animate );

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
}