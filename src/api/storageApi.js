// Cloudflare R2 and Firebase Storage API
import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import { storage } from "./firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { compressImage } from "../utils/imageCompressor";

// R2 Configuration
const R2_CONFIG = {
	accountId: import.meta.env.VITE_R2_ACCOUNT_ID,
	accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,
	secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,
	bucketName: import.meta.env.VITE_R2_BUCKET_NAME || "wildlife-valparai",
};

// Initialize R2 client only if credentials are provided
let s3Client = null;

const initializeR2Client = () => {
	if (
		!R2_CONFIG.accountId ||
		!R2_CONFIG.accessKeyId ||
		!R2_CONFIG.secretAccessKey
	) {
		console.warn(
			"R2 credentials not configured. Using Firebase Storage fallback."
		);
		return null;
	}

	if (!s3Client) {
		s3Client = new S3Client({
			region: "auto",
			endpoint: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
			credentials: {
				accessKeyId: R2_CONFIG.accessKeyId,
				secretAccessKey: R2_CONFIG.secretAccessKey,
			},
		});
	}

	return s3Client;
};

/**
 * Check if R2 is configured
 */
export const isR2Configured = () => {
	return !!(
		R2_CONFIG.accountId &&
		R2_CONFIG.accessKeyId &&
		R2_CONFIG.secretAccessKey
	);
};

/**
 * Upload image to R2 (or Firebase Storage as fallback)
 */
export const uploadToCloudflareR2 = async (
	file,
	folder = "uploads",
	shouldCompress = true
) => {
	try {
		const client = initializeR2Client();

		// Use Firebase Storage as fallback if R2 not configured
		if (!client) {
			return await uploadToFirebaseStorage(file, folder, shouldCompress);
		}

		// Compress image before upload
		const processedFile = shouldCompress ? await compressImage(file) : file;

		// Generate unique filename
		const fileExtension = processedFile.name.split(".").pop();
		const key = `${folder}/${uuidv4()}.${fileExtension}`;

		// Convert file to ArrayBuffer
		const arrayBuffer = await processedFile.arrayBuffer();

		const command = new PutObjectCommand({
			Bucket: R2_CONFIG.bucketName,
			Key: key,
			Body: new Uint8Array(arrayBuffer),
			ContentType: processedFile.type,
			Metadata: {
				originalName: processedFile.name,
				uploadedAt: new Date().toISOString(),
			},
		});

		await client.send(command);

		// Generate public URL
		const url = `https://pub-${R2_CONFIG.accountId}.r2.dev/${key}`;

		return { success: true, url, key, size: processedFile.size };
	} catch (error) {
		console.error("Upload error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Get signed URL from R2 (or Firebase Storage)
 */
export const getSignedFileUrl = async (key, expiresIn = 3600) => {
	try {
		const client = initializeR2Client();

		if (!client) {
			// Use Firebase Storage
			return await getFirebaseStorageUrl(key);
		}

		const command = new GetObjectCommand({
			Bucket: R2_CONFIG.bucketName,
			Key: key,
		});

		const url = await getSignedUrl(client, command, { expiresIn });
		return { success: true, url };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

/**
 * Delete file from R2 (or Firebase Storage)
 */
export const deleteFromCloudflareR2 = async (key) => {
	try {
		const client = initializeR2Client();

		if (!client) {
			return await deleteFromFirebaseStorage(key);
		}

		const command = new DeleteObjectCommand({
			Bucket: R2_CONFIG.bucketName,
			Key: key,
		});

		await client.send(command);
		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

/**
 * Firebase Storage fallback functions
 */

/**
 * Upload to Firebase Storage (free 5GB)
 */
export const uploadToFirebaseStorage = async (
	file,
	folder = "uploads",
	shouldCompress = true
) => {
	try {
		const processedFile = shouldCompress ? await compressImage(file) : file;
		const fileExtension = processedFile.name.split(".").pop();
		const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

		const storageRef = ref(storage, fileName);
		const snapshot = await uploadBytes(storageRef, processedFile, {
			contentType: processedFile.type,
			customMetadata: {
				originalName: processedFile.name,
				uploadedAt: new Date().toISOString(),
			},
		});

		const url = await getDownloadURL(snapshot.ref);

		return {
			success: true,
			url,
			key: fileName,
			size: processedFile.size,
		};
	} catch (error) {
		console.error("Firebase upload error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Get URL from Firebase Storage
 */
export const getFirebaseStorageUrl = async (fileName) => {
	try {
		const storageRef = ref(storage, fileName);
		const url = await getDownloadURL(storageRef);
		return { success: true, url };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

/**
 * Delete from Firebase Storage
 */
export const deleteFromFirebaseStorage = async (fileName) => {
	try {
		const storageRef = ref(storage, fileName);
		await deleteObject(storageRef);
		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

// Main upload function that auto-selects storage
export const uploadFile = async (
	file,
	folder = "uploads",
	shouldCompress = true
) => {
	return await uploadToCloudflareR2(file, folder, shouldCompress);
};

// Export default storage functions
export default {
	isR2Configured,
	uploadToCloudflareR2,
	getSignedFileUrl,
	deleteFromCloudflareR2,
	uploadToFirebaseStorage,
	getFirebaseStorageUrl,
	deleteFromFirebaseStorage,
	uploadFile,
};
