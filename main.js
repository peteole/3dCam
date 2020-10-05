import { Cam } from "./src/3dCam.js";

alert("hi");
let myCam = new Cam();
myCam.ready.then(() => {
    myCam.takePicture();

})


