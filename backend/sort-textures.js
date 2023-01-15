const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const archiver = require('archiver');


const skyboxDir = '../skyboxes/';
const outputFile = 'skyboxes.json';
const needsRenaming = new RegExp('^.*(up|dn|lf|rt|ft|bk)\.jpg$', 'i');
const isSkybox = new RegExp('^.*(-pos-x|-neg-x|-pos-y|-neg-y|-pos-z|-neg-z)\.jpg$', 'i');
const isText = new RegExp('^.*\.txt$', 'i');
const isVtf = new RegExp('^.*\.vtf$', 'i');

var fileType = ".jpg";
var itemsProcessed = 0;
var skyboxes = {};

// this script:
// converts vtf files to jpgs using vtex2,
// removes converted vtf files,
// renames skyboxes to a more three.js friendly style,
// outputs a json file with skyboxes object,
// zips files for download by client

// usage:
// place skybox textures (.vtf/.jpg) in skyboxDir,
// create a .txt file with the same name as the skybox texture
// insert the url of where the skybox was downloaded from
// run this script


fs.readdir(skyboxDir, (err, files) => {
    files.forEach(file => {
        if (isVtf.test(file)) {
            var command;
            if (process.platform === 'win32') {
                command = 'vtex2-win extract -f jpg ' + path.resolve('../skyboxes/' + file);
            } else {
                command = 'vtex2 extract -f jpg ' + path.resolve('../skyboxes/' + file);
            }
            var vtex2 = exec(command, function(err, stdout, stderr) {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(stdout);
            });
            vtex2.on('exit', function() {
                fs.unlink(path.resolve('../skyboxes/' + file), (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log("deleted", path.resolve('../skyboxes/' + file));
                    itemsProcessed++;
                    if (itemsProcessed === files.length) {
                        conversionFinished();
                    }
                });
            });
        } else {
            itemsProcessed++;
            if (itemsProcessed === files.length) {
                conversionFinished();
            }
        }
    });
});

function conversionFinished() {
    itemsProcessed = 0;
    fs.readdir(skyboxDir, (err, files) => {
        files.forEach(file => {
            if (needsRenaming.test(file)) {
                var position = file.slice(0, -4).slice(-2).toLowerCase();
                var newName = "";

                if (position == "ft") { newName = file.slice(0, -6) + "-pos-x" + fileType; }
                if (position == "bk") { newName = file.slice(0, -6) + "-neg-x" + fileType; }
                if (position == "up") { newName = file.slice(0, -6) + "-pos-y" + fileType; }
                if (position == "dn") { newName = file.slice(0, -6) + "-neg-y" + fileType; }
                if (position == "rt") { newName = file.slice(0, -6) + "-pos-z" + fileType; }
                if (position == "lf") { newName = file.slice(0, -6) + "-neg-z" + fileType; }

                fs.rename(skyboxDir + file, skyboxDir + newName, function(err) {
                    console.log("renamed:", file, ">", newName)
                    if ( err ) console.log('ERROR: ' + err);
                    itemsProcessed++;
                    if (itemsProcessed === files.length) {
                        renameFinished();
                    }
                });
            } else {
                console.log("skipping", file)
                itemsProcessed++
                if (itemsProcessed === files.length) {
                    renameFinished();
                }
            }
        });
    });
}

function renameFinished() {
    itemsProcessed = 0;
    fs.readdir(skyboxDir, (err, files) => {
        // group into sets
        files.forEach(file => {
            var skyboxName = file.slice(0, -10);
            if (isSkybox.test(file) && !(skyboxName in skyboxes)) {
                // skyboxes[skyboxName][file.slice(0, -4).slice(-5)] = file;
                // skyboxes[skyboxName] = {
                //     "pos-x": skyboxName + "-pos-x.jpg",
                //     "neg-x": skyboxName + "-neg-x.jpg",
                //     "pos-y": skyboxName + "-pos-y.jpg",
                //     "neg-y": skyboxName + "-neg-y.jpg",
                //     "pos-z": skyboxName + "-pos-z.jpg",
                //     "neg-z": skyboxName + "-neg-z.jpg"
                // };
                skyboxes[skyboxName] = {};
                skyboxes[skyboxName].array = [
                    skyboxName + "-pos-x.jpg",
                    skyboxName + "-neg-x.jpg",
                    skyboxName + "-pos-y.jpg",
                    skyboxName + "-neg-y.jpg",
                    skyboxName + "-pos-z.jpg",
                    skyboxName + "-neg-z.jpg"
                ];
                itemsProcessed++
                if (itemsProcessed === files.length) {
                    jsonFinished();
                }
            } else if (isText.test(file)) {
                fs.readFile(skyboxDir + file, 'utf8', (err, data) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                    skyboxes[file.slice(0, -4)].source = data;
                    itemsProcessed++
                    if (itemsProcessed === files.length) {
                        jsonFinished();
                    }
                });
            } else {
                itemsProcessed++
                if (itemsProcessed === files.length) {
                    jsonFinished();
                }
            }
        });
    });
}

function jsonFinished() {
    console.log(skyboxes);
    console.log("writing skyboxes to", outputFile);
    try {
        fs.writeFileSync(outputFile, JSON.stringify(skyboxes))
    } catch (err) {
        console.error(err)
    }
    createArchive();
}

function createArchive() {
    for (const skybox in skyboxes) {
        fs.open(skyboxDir + skybox + '.zip', 'r', (err, fd) => {
            if (err) { 
                var output = fs.createWriteStream(skyboxDir + skybox + '.zip');
                var archive = archiver('zip');
                
                output.on('close', function () {
                    console.log('created', skybox + '.zip ' + archive.pointer() + ' total bytes');
                });
                
                archive.on('error', function(err){
                    throw err;
                });
                
                archive.pipe(output);
                
                for (i = 0; i < skyboxes[skybox].array.length; i++) {
                    // console.log(skyboxDir + skyboxes[skybox].array[i])
                    archive.file(skyboxDir + skyboxes[skybox].array[i], { name: skyboxes[skybox].array[i] });
                } 
                archive.file(skyboxDir + skybox + '.txt', { name: skybox + '.txt' });
        
                
                archive.finalize();
            } else {
                console.log(skybox + ".zip already exists")
            }
        });
    }
}