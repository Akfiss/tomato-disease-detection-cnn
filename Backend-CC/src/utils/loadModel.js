import * as tf from '@tensorflow/tfjs-node';

export async function loadModel() {
    const model = await tf.loadLayersModel('https://storage.googleapis.com/tomguard/models/model.json');
    return model;
}
