import initializer from "./wasm/build/output.wasm.js";
const modulePromise = initializer();
export default modulePromise;