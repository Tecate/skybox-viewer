var fs = require('fs');

const skyboxDir = '../skyboxes/'
const needsRenaming = new RegExp('^.*(up|dn|lf|rt|ft|bk)\.jpg{1}$', 'i');
var fileType = ".jpg";

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
            });
        } else {
            console.log("skipping", file)
        }
    });
});