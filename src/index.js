import * as THREE from 'three';
import Stats from 'stats-js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import "./style.css";

import desertft from './img/desertft.png';
import desertbk from './img/desertbk.png';
import desertup from './img/desertup.png';
import desertdn from './img/desertdn.png';
import desertrt from './img/desertrt.png';
import desertlf from './img/desertlf.png';


//remove lunarsky-pos-x2.jpg
fetch('https://scum.systems/misc/skyboxes/')
  .then((response) => response.json())
  .then((data) => {
    // detect skyboxes with more than 6 files & remove
    // const regex = new RegExp('/^(.*?)\-(pos|neg)\-[x-y]\.jpg/');
    // for (var i = 0; i < data.length; i++) {
    //     console.log(regex.test(data[i].name), data[i].name);
    // }

    // group into arrays of 6
    var group = [];
    for (var i = 0, j = 0; i < data.length; i++) {
        if (i >= 6 && i % 6 === 0)
            j++;
        group[j] = group[j] || [];
        group[j].push(data[i].name)
    }

    // pick random group and sort
    var randGroup = group[Math.floor(Math.random() * group.length)];
    var sortedGroup = [];
    var imagePath = "https://scum.systems/misc/skyboxes/"
    for (var i = 0; i < 6; i++) {
        if (randGroup[i].indexOf("-pos-x") !== -1)
            sortedGroup[0] = imagePath + randGroup[i];
            
        if (randGroup[i].indexOf("-neg-x") !== -1)
            sortedGroup[1] = imagePath + randGroup[i];
            
        if (randGroup[i].indexOf("-pos-y") !== -1)
            sortedGroup[2] = imagePath + randGroup[i];

        if (randGroup[i].indexOf("-neg-y") !== -1)
            sortedGroup[3] = imagePath + randGroup[i];
            
        if (randGroup[i].indexOf("-pos-z") !== -1)
            sortedGroup[4] = imagePath + randGroup[i];
            
        if (randGroup[i].indexOf("-neg-z") !== -1)
            sortedGroup[5] = imagePath + randGroup[i];
    }

});

function main() {
    const canvas = document.querySelector('.webgl');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setClearColor(0x222222);

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    const controls = new OrbitControls(camera, renderer.domElement)

    // skybox - https://r105.threejsfundamentals.org/threejs/lessons/threejs-backgrounds.html
    const loader = new THREE.CubeTextureLoader();
    // loader.setPath( 'img/' );
    const skybox = loader.load([
      desertft, // pos-x
      desertbk, // neg-x
      desertup, // pos-y
      desertdn, // neg-y
      desertrt, // pos-z
      desertlf, // neg-z
   ]);
    scene.background = skybox;

    const spheres = [];

    const geometry = new THREE.SphereGeometry( 0.1, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: skybox } );
    // const sphere = new THREE.Mesh(geometry, material);
    // scene.add(sphere)

    for ( let i = 0; i < 5; i ++ ) {

        const mesh = new THREE.Mesh( geometry, material );

        mesh.position.x = Math.random() * 10 - 5;
        mesh.position.y = Math.random() * 10 - 5;
        mesh.position.z = Math.random() * 10 - 5;

        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

        scene.add( mesh );

        spheres.push( mesh );

    }

    // const color = 0xFFFFFF;
    // const intensity = 1;
    // const light = new THREE.DirectionalLight(color, intensity);
    // light.position.set(-1, 2, 4);
    // scene.add(light);

    // const size = 10;
    // const divisions = 10;
    // const gridHelper = new THREE.GridHelper( size, divisions );
    // scene.add( gridHelper );

    const axesHelper = new THREE.AxesHelper( 1 );
    scene.add( axesHelper );

    // render loop
    function render(time) {
        // time *= 0.001;  // convert time to seconds
        // cube.rotation.x = time;
        // cube.rotation.y = time;

        const timer = 0.0001 * Date.now();
        for ( let i = 0, il = spheres.length; i < il; i ++ ) {

            const sphere = spheres[ i ];

            sphere.position.x = 5 * Math.cos( timer + i );
            sphere.position.y = 5 * Math.sin( timer + i * 1.1 );

        }

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
}

main();

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function animate() {

	stats.begin();

	// monitored code goes here

	stats.end();

	requestAnimationFrame( animate );

}

requestAnimationFrame( animate );

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
