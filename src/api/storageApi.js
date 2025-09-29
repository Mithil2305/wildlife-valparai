import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
	region: "auto",
	endpoint: `https://${import.meta.env.VITE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,
		secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,
	},
});

const BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME;

export const uploadToCloudflareR2 = async (file, folder = "uploads") => {
	try {
		const key = `${folder}/${Date.now()}-${file.name}`;

		const command = new PutObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
			Body: file,
			ContentType: file.type,
		});

		await s3Client.send(command);

		// Generate public URL (R2 public bucket required)
		const url = `https://pub-${import.meta.env.VITE_R2_ACCOUNT_ID}.r2.dev/${key}`;

		return { success: true, url, key };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const getSignedFileUrl = async (key, expiresIn = 3600) => {
	try {
		const command = new GetObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
		});

		const url = await getSignedUrl(s3Client, command, { expiresIn });
		return { success: true, url };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const deleteFromCloudflareR2 = async (key) => {
	try {
		const command = new DeleteObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
		});

		await s3Client.send(command);
		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const compressImage = (file, options = {}) => {
	return new Promise((resolve) => {
		const { maxWidth = 1200, quality = 0.8 } = options;

		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = (event) => {
			const img = new Image();
			img.src = event.target.result;

			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				let width = img.width;
				let height = img.height;

				if (width > maxWidth) {
					height = (height * maxWidth) / width;
					width = maxWidth;
				}

				canvas.width = width;
				canvas.height = height;

				ctx.drawImage(img, 0, 0, width, height);

				canvas.toBlob(
					(blob) => {
						resolve(
							new File([blob], file.name, {
								type: "image/jpeg",
								lastModified: Date.now(),
							})
						);
					},
					"image/jpeg",
					quality
				);
			};
		};

		reader.onerror = () => {
			resolve(file); // Return original file if compression fails
		};
	});
};
