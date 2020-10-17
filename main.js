import { Cam } from "./src/3dCam.js";
let myCam = new Cam();
myCam.ready.then(() => {
    myCam.takePicture();
});


