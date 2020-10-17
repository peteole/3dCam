import wasmPromise from "./wasmGlue.js";
wasmPromise.then((wasmModule) => {
    Cam.wasmModule = wasmModule;
});
const focusDistances = [0.0]//[0, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 1];
class Cam {
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
                    await wasmPromise;
                    res();
                }
            );
        });

    }
    async takePicture() {
        await this.ready;
        let blobs = [];
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
                        canvas.getContext("2d").drawImage(img, 0, 0);
                        const buffer = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data.buffer;
                        data.push(buffer);
                        const pointer = Cam.wasmModule._malloc(buffer.byteLength);
                        Cam.wasmModule.HEAPU8.set(new Uint8Array(buffer), pointer);
                        const wasmImage = new Cam.wasmModule.Image(canvas.width, canvas.height, pointer);
                        const value = wasmImage.getPixelValue(10, 10, 1);
                        console.log(value);
                        const sharpness = wasmImage.getSharpnessImage();
                        const sharpnessDataPointer = sharpness.data;
                        const canvasData = new Uint8Array(Cam.wasmModule.HEAPU8.subarray(sharpnessDataPointer, sharpnessDataPointer + buffer.byteLength));
                        const imageData = new ImageData(new Uint8ClampedArray(canvasData), canvas.width, canvas.height);
                        const outputCanvas = document.createElement("canvas");
                        outputCanvas.width = canvas.width;
                        outputCanvas.height = canvas.height;
                        outputCanvas.getContext("2d").putImageData(imageData, 0, 0);
                        document.body.appendChild(outputCanvas);
                    }
                    img.src = url;
                }
            );
        }
    }
}
/**@type {Module} */
Cam.wasmModule = null;
export { Cam }