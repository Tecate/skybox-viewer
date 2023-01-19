import skyboxJson from '../backend/skyboxes.json'
import { loader, scene, sphereMaterial, textMaterial } from './index.js'

var randButtonEl = document.getElementById('rand-button');
var nextButtonEl = document.getElementById("next");
var prevButtonEl = document.getElementById("prev");
var skyboxNameEl = document.getElementById('skybox-title');
var codeEl = document.getElementById('code');
var listEl = document.getElementById('skybox-list');

randButtonEl.onclick = function() { loadSkybox(); };


codeEl.onclick = function(){
    // chrome requests permissions for this
    navigator.clipboard.writeText(codeEl.innerText);
    alert("Copied code. Yes, I know alert() is probably the laziest way to display this message.");
}

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

document.onkeydown = function(e) {
    e = e || window.event;
    if (e.keyCode == '37') {
       nextSkybox(-1);
    }
    else if (e.keyCode == '39') {
       nextSkybox(1);
    }
}

nextButtonEl.onclick = function () { nextSkybox(1) }
prevButtonEl.onclick = function () { nextSkybox(-1) }

function nextSkybox(direction) {
    for (let child of listEl.children) {
        if (child.classList.contains("active")) {
            var nextbox = Object.keys(skyboxJson)[parseInt(child.dataset.position)+direction];
            if (nextbox !== undefined)   
                loadSkybox(nextbox);
            break;
        }
     }
}

export function loadSkybox(name) {
    var newSkybox = loader.load(getSkybox(name));
    scene.background = newSkybox;
    sphereMaterial.envMap = newSkybox;
    textMaterial.envMap = newSkybox;
}

function getSkybox(name) {
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
    }

    skyboxNameEl.innerText = name;
    document.getElementById("skybox-download").href = 'skyboxes/' + name + ".zip";
    if (skyboxJson[name].source === undefined) {
        // document.getElementById("skybox-source").innerText = "Sorry, no source";
        document.getElementById("skybox-title").target = "";
        document.getElementById("skybox-title").href = "#";
    } else {
        // document.getElementById("skybox-title").innerText = "Credit";
        document.getElementById("skybox-title").target = "_blank";
        document.getElementById("skybox-title").href = skyboxJson[name].source;
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