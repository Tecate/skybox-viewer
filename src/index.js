import * as THREE from 'three';
import Stats from 'stats-js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import GUI from 'lil-gui';

import "./style.css";
import scumfont from "three/examples/fonts/helvetiker_bold.typeface.json";

// import desertft from './img/desertft.png';
// import desertbk from './img/desertbk.png';
// import desertup from './img/desertup.png';
// import desertdn from './img/desertdn.png';
// import desertrt from './img/desertrt.png';
// import desertlf from './img/desertlf.png';

import resizeElement from './resize-element.js';

import skyboxJson from '../backend/skyboxes.json'

// var req = require.context("../skyboxes", true, /(\.zip|\.jpg)$/im);
// req.keys().forEach(function(key){
//     req(key);
// });

var buttonEl = document.getElementById('rand-button');
buttonEl.onclick = function(){
    loadSkybox();
    for (const child of listEl.children) {
        child.classList.remove('active');
    }
};

var skyboxNameEl = document.getElementById('skybox-title');

var codeEl = document.getElementById('code');
codeEl.id = "code";
codeEl.onclick = function(){
    navigator.clipboard.writeText(codeEl.innerText);
    // document.getElementById("code-title")
}
var listEl = document.getElementById('skybox-list');

console.log(skyboxJson);
for (var skybox in skyboxJson) {
    let rowEl = document.createElement('div');
    rowEl.innerText = skybox;
    // rowEl.setAttribute("data-filename", skybox)
    listEl.appendChild(rowEl);

    rowEl.onclick = function(){
        loadSkybox(rowEl.innerText);
        for (const child of listEl.children) {
            child.classList.remove('active');
        }
        rowEl.classList.add("active");
    };
}

function loadSkybox(name) {
    var newSkybox = loader.load(getSkybox(name));
    scene.background = newSkybox;
    material.envMap = newSkybox;
    textMaterial.envMap = newSkybox;
}

function getSkybox(name) {
    // console.log("getSkybox", skyboxJson.length)
    var count = Object.keys(skyboxJson).length;
    var keys = Object.keys(skyboxJson);
    var skybox;
    let withPaths = [];

    if (count == 0) {
        console.log("No skyboxes found.");
        return;
    }
    if (typeof name !== 'undefined') {
        skybox = skyboxJson[name].array;
    } else {
        // pick random skybox
        skybox = skyboxJson[keys[ keys.length * Math.random() << 0]].array;
        console.log(skyboxJson[keys[ keys.length * Math.random() << 0]])
    }

    skyboxNameEl.innerText = skybox[0].substring(0, skybox[0].length-10);
    document.getElementById("skybox-download").href = 'skyboxes/' + skybox[0].substring(0, skybox[0].length-10) + ".zip";
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

// var skyboxList = [];
// fetch('https://scum.systems/misc/skyboxes/')
//   .then((response) => response.json())
//   .then((data) => {
//     // detect skyboxes with more than 6 files & remove
//     // const regex = new RegExp('/^(.*?)\-(pos|neg)\-[x-y]\.jpg/');
//     // for (var i = 0; i < data.length; i++) {
//     //     console.log(regex.test(data[i].name), data[i].name);
//     // }

//     // also need to check if all images are the same width & height

//     // group into arrays of 6
//     for (var i = 0, j = 0; i < data.length; i++) {
//         if (i >= 6 && i % 6 === 0)
//             j++;
//         skyboxList[j] = skyboxList[j] || [];
//         skyboxList[j].push(data[i].name)
//     }

//     for (var i = 0; i < skyboxList.length; i++) {
//         let rowEl = document.createElement('div');
//         // let downloadEl = document.createElement('a');
//         // downloadEl.classList.add("download-icon");
//         // downloadEl.href = "#";
//         rowEl.innerText = skyboxList[i][0].substring(0, skyboxList[i][0].length-10)
//         rowEl.setAttribute("data-arrayposition", i)
//         listEl.appendChild(rowEl);
//         // rowEl.appendChild(downloadEl);
//         rowEl.onclick = function(){
//             loadSkybox(rowEl);
//             for (const child of listEl.children) {
//                 child.classList.remove('active');
//             }
//             rowEl.classList.add("active");
//         };
//     }
//     // get first skybox
//     loadSkybox();
// });

// function getSkybox(name) {
//     if (skyboxList.length == 0) {
//         console.log("No skyboxes found.");
//         return;
//     }

//     if (typeof name !== 'undefined') {
//         var skybox = skyboxList[name.dataset.arrayposition]
//     } else {
//         // pick random skybox
//         var skybox = skyboxList[Math.floor(Math.random() * skyboxList.length)];
//     }

//     // sort into loader format
//     var sortedGroup = [];
//     var imagePath = "https://scum.systems/misc/skyboxes/"
//     for (var i = 0; i < 6; i++) {
//         if (skybox[i].indexOf("-pos-x") !== -1)
//             sortedGroup[0] = imagePath + skybox[i];
            
//         if (skybox[i].indexOf("-neg-x") !== -1)
//             sortedGroup[1] = imagePath + skybox[i];
            
//         if (skybox[i].indexOf("-pos-y") !== -1)
//             sortedGroup[2] = imagePath + skybox[i];

//         if (skybox[i].indexOf("-neg-y") !== -1)
//             sortedGroup[3] = imagePath + skybox[i];
            
//         if (skybox[i].indexOf("-pos-z") !== -1)
//             sortedGroup[4] = imagePath + skybox[i];
            
//         if (skybox[i].indexOf("-neg-z") !== -1)
//             sortedGroup[5] = imagePath + skybox[i];
//     }

//     skyboxNameEl.innerText = skybox[0].substring(0, skybox[0].length-10);
//     document.getElementById("skybox-download").href = skybox[0].substring(0, skybox[0].length-10) + ".zip";
//     codeEl.innerText = 
// `const loader = new THREE.CubeTextureLoader();
// const skybox = loader.load([
//     ${sortedGroup[0]},
//     ${sortedGroup[1]},
//     ${sortedGroup[2]},
//     ${sortedGroup[3]},
//     ${sortedGroup[4]},
//     ${sortedGroup[5]},
// ]);
// scene.background = skybox;`

//     return sortedGroup;
// }



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