import {Cam} from "./src/3dCam"
document.onload=(ev)=>{
    let myCam=new Cam();
    myCam.takePicture()
}