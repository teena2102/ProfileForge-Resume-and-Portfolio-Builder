import ImageKit from 'imagekit';

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const uploadToImageKit = (buffer, fileName, userId) => {
    return new Promise((resolve, reject) => {
        imagekit.upload(
            {
                file: buffer,
                fileName: `${userId}_${Date.now()}_${fileName}`,
                folder: '/resume-builder/profiles',
                useUniqueFileName: false,
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
    });
};

export const deleteFromImageKit = (fileId) => {
    return new Promise((resolve, reject) => {
        imagekit.deleteFile(fileId, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
};

export default imagekit;
