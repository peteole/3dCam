
const focusDistances = [0, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 1];
export class Cam {
    constructor() {
        this.ready = new Promise((res, rej) => {
            navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user"
                }
            }).then(
                async (stream) => {
                    this.stream = stream;
                    this.track = stream.getVideoTracks()[0];
                    this.capabilities = this.track.getCapabilities()
                    this.imageCapturer = new ImageCapture(this.track);
                    res();
                }
            );
        });

    }
    async takePicture() {
        let blobs = []
        let data = []
        for (let distance of focusDistances) {
            await this.track.applyConstraints({
                advanced: [{
                    //focusMode: "manual",
                    //zoom: distance + 1
                }]
            });
            this.imageCapturer.takePhoto().then(
                (blob) => {
                    blobs.push(blob);
                    const url = URL.createObjectURL(blob);
                    let img = new Image();
                    img.onload = () => {
                        URL.revokeObjectURL(url);
                        const canvas = document.createElement("canvas")
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const buffer=canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height).data.buffer;
                        data.push(buffer);
                    }
                    img.src = url;
                }
            );
        }
    }
}