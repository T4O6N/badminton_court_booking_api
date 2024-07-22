import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
    private readonly storage: admin.storage.Storage;
    private static initialized = false;

    constructor() {
        if (!FirebaseService.initialized) {
            if (!process.env.PRIVATE_KEY) {
                throw new Error('Environment variable "PRIVATE_KEY" is not defined.');
            }

            const encodePrivate = Buffer.from(process.env.PRIVATE_KEY);

            const privateKey = `-----BEGIN PRIVATE KEY-----\n${encodePrivate}\n-----END PRIVATE KEY-----\n`;

            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.PROJECT_ID,
                    clientEmail: process.env.CLIENT_EMAIL,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                }),
                storageBucket: process.env.STORAGE_BUCKET_URL,
            });
            FirebaseService.initialized = true;
        }
        this.storage = admin.storage();
    }

    getStorageInstance(): admin.storage.Storage {
        return this.storage;
    }

    async uploadImage(file: Express.Multer.File) {
        const storage = this.getStorageInstance();
        const bucket = storage.bucket();
        const fileType = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${fileType}`;
        const fileUpload = bucket.file(`court_image/${fileName}`);

        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        await new Promise((resolve, reject) => {
            stream.on('error', (err) => {
                reject(err);
            });

            stream.on('finish', () => {
                resolve(fileName);
            });

            stream.end(file.buffer);
        });

        const [url] = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '12-31-9999',
        });

        return {
            filename: `${Date.now()}-${fileType}`,
            path: 'court_image/',
            url,
        };
    }
}
