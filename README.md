# Skybox Viewer

[skybox.scum.systems](https://skybox.scum.systems)

This converts vtf skyboxes and displays them using three.js

![Screenshot](https://raw.githubusercontent.com/Tecate/skybox-viewer/main/screenshot.png)

## Installation

```bash
npm install
cd backend/;node sort-textures.js
npm run dev
```

## Adding skyboxes

```cd backend/;node sort-textures.js```

Any .vtf files in the skybox directory will be converted into jpegs when backend/sort-textures.js is run. Any .jpg files in the skybox directory with proper file names (eg. *-pos-x.jpg) will be added to the exported json file.

Any skyboxes must have an associated "skyboxname.txt" file containing the url of the skybox's author.