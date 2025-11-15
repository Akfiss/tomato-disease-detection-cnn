import * as tf from '@tensorflow/tfjs-node';
import sharp from 'sharp';

export function imageToTensor(data, width, height) {
    const imageTensor = tf.tensor3d(data, [height, width, 3], 'int32');
    const resizedImage = tf.image.resizeBilinear(imageTensor, [256, 256]);
    const normalizedImage = resizedImage.div(255.0).expandDims(0);
    return normalizedImage;
}

export async function validateImage(buffer) {
    try {
        const image = sharp(buffer);
        const metadata = await image.metadata();
        if (metadata.width < 64 || metadata.height < 64) {
            return { isValid: false, message: "Image is too small." };
        }

        const { data, info } = await image
            .removeAlpha()
            .resize(256, 256)
            .raw()
            .toBuffer({ resolveWithObject: true });

        const imageTensor = tf.tensor3d(data, [info.height, info.width, info.channels], 'int32');
        const channels = tf.split(imageTensor, 3, 2);
        const redChannel = channels[0];
        const greenChannel = channels[1];
        const blueChannel = channels[2];

        const redMean = redChannel.mean().dataSync()[0];
        const greenMean = greenChannel.mean().dataSync()[0];
        const blueMean = blueChannel.mean().dataSync()[0];
        if (Math.abs(redMean - greenMean) < 10 && Math.abs(greenMean - blueMean) < 10 && Math.abs(blueMean - redMean) < 10) {
            return { isValid: false, message: "Image is nearly grayscale." };
        }
        return { isValid: true, data, width: info.width, height: info.height };
    } catch (error) {
        console.error('Error processing image:', error);
        return { isValid: false, message: "Error decoding image. Please upload a valid image file." };
    }
}
