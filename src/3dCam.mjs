
const focusDistances=[0,0.05,0.1,0.2,0.3,0.5,0.7,1];
export class Cam {
    constructor() {
        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user"
            }
        }).then(
            async (stream) => {
                this.stream = stream;
                this.track = stream.getVideoTracks()[0];
                this.capabilities=this.track.getCapabilities()
                this.imageCapturer = new ImageCapture(this.track);
            }
        );
    }
    async takePicture() {
        let blobs=[]
        for(let distance of focusDistances){
            await this.track.applyConstraints({
                advanced:[{
                    focusMode:"manual",
                    focusDistance:distance
                }]
            });
            this.imageCapturer.takePhoto().then(
                (blob)=>blobs.push(blob)
            );
        }
    }
}