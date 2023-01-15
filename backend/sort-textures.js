var fs = require('fs');

const skyboxDir = '../skyboxes/';
const outputFile = 'skyboxes.json';
const needsRenaming = new RegExp('^.*(up|dn|lf|rt|ft|bk)\.jpg$', 'i');
const isSkybox = new RegExp('^.*(-pos-x|-neg-x|-pos-y|-neg-y|-pos-z|-neg-z)\.jpg$', 'i');
const isText = new RegExp('^.*\.txt$', 'i');

var fileType = ".jpg";
var itemsProcessed = 0;
var skyboxes = {};


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

function renameFinished() {
    itemsProcessed = 0;
    fs.readdir(skyboxDir, (err, files) => {
        // group into sets
        files.forEach(file => {
            if (isSkybox.test(file) && !(file.slice(0, -10) in skyboxes)) {
                // skyboxes[file.slice(0, -10)][file.slice(0, -4).slice(-5)] = file;
                skyboxes[file.slice(0, -10)] = {
                    "pos-x": file.slice(0, -10) + "-pos-x.jpg",
                    "neg-x": file.slice(0, -10) + "-neg-x.jpg",
                    "pos-y": file.slice(0, -10) + "-pos-y.jpg",
                    "neg-y": file.slice(0, -10) + "-neg-y.jpg",
                    "pos-z": file.slice(0, -10) + "-pos-z.jpg",
                    "neg-z": file.slice(0, -10) + "-neg-z.jpg"
                };
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
}