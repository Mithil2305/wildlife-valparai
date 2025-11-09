// Audio Compression Utility
// Note: Audio compression in browsers is limited. We'll use client-side quality reduction.

/**
 * Get audio file duration
 * @param {File} file - The audio file
 * @returns {Promise<number>} - Duration in seconds
 */
export const getAudioDuration = (file) => {
	return new Promise((resolve, reject) => {
		const audio = new Audio();
		const objectUrl = URL.createObjectURL(file);

		audio.addEventListener("loadedmetadata", () => {
			URL.revokeObjectURL(objectUrl);
			resolve(audio.duration);
		});

		audio.addEventListener("error", () => {
			URL.revokeObjectURL(objectUrl);
			reject(new Error("Failed to load audio file"));
		});

		audio.src = objectUrl;
	});
};

/**
 * Validate audio file and get metadata
 * @param {File} file - The audio file
 * @returns {Promise<Object>} - Audio metadata
 */
export const getAudioMetadata = async (file) => {
	try {
		const duration = await getAudioDuration(file);
		const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

		return {
			duration,
			size: file.size,
			sizeInMB,
			type: file.type,
			name: file.name,
		};
	} catch {
		throw new Error("Failed to read audio metadata");
	}
};

/**
 * Convert audio to lower bitrate (using Web Audio API)
 * Note: This is a simplified approach. Full compression requires server-side processing.
 * @param {File} file - The audio file
 * @returns {Promise<Blob>} - Compressed audio blob
 */
export const compressAudio = async (file) => {
	return new Promise((resolve, reject) => {
		const audioContext = new (window.AudioContext ||
			window.webkitAudioContext)();
		const reader = new FileReader();

		reader.onload = async (e) => {
			try {
				const arrayBuffer = e.target.result;
				const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

				// Create offline context for rendering
				const offlineContext = new OfflineAudioContext(
					1, // mono channel
					audioBuffer.duration * 22050, // reduced sample rate
					22050 // 22.05 kHz (half of CD quality)
				);

				const source = offlineContext.createBufferSource();
				source.buffer = audioBuffer;
				source.connect(offlineContext.destination);
				source.start();

				const renderedBuffer = await offlineContext.startRendering();

				// Convert to WAV blob (browsers don't support direct MP3 encoding)
				const wavBlob = audioBufferToWav(renderedBuffer);
				resolve(wavBlob);
			} catch (error) {
				reject(error);
			}
		};

		reader.onerror = () => reject(new Error("Failed to read audio file"));
		reader.readAsArrayBuffer(file);
	});
};

/**
 * Convert AudioBuffer to WAV Blob
 * @param {AudioBuffer} buffer - Audio buffer
 * @returns {Blob} - WAV blob
 */
function audioBufferToWav(buffer) {
	const length = buffer.length * buffer.numberOfChannels * 2;
	const arrayBuffer = new ArrayBuffer(44 + length);
	const view = new DataView(arrayBuffer);
	const channels = [];
	let offset = 0;
	let pos = 0;

	// Write WAV header
	setUint32(0x46464952); // "RIFF"
	setUint32(36 + length); // file length - 8
	setUint32(0x45564157); // "WAVE"
	setUint32(0x20746d66); // "fmt " chunk
	setUint32(16); // length = 16
	setUint16(1); // PCM (uncompressed)
	setUint16(buffer.numberOfChannels);
	setUint32(buffer.sampleRate);
	setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels); // avg. bytes/sec
	setUint16(buffer.numberOfChannels * 2); // block-align
	setUint16(16); // 16-bit
	setUint32(0x61746164); // "data" chunk
	setUint32(length);

	// Write interleaved data
	for (let i = 0; i < buffer.numberOfChannels; i++) {
		channels.push(buffer.getChannelData(i));
	}

	while (pos < buffer.length) {
		for (let i = 0; i < buffer.numberOfChannels; i++) {
			const sample = Math.max(-1, Math.min(1, channels[i][pos]));
			view.setInt16(
				44 + offset,
				sample < 0 ? sample * 0x8000 : sample * 0x7fff,
				true
			);
			offset += 2;
		}
		pos++;
	}

	function setUint16(data) {
		view.setUint16(pos, data, true);
		pos += 2;
	}

	function setUint32(data) {
		view.setUint32(pos, data, true);
		pos += 4;
	}

	return new Blob([arrayBuffer], { type: "audio/wav" });
}

/**
 * Trim audio file (remove silence from start/end)
 * @param {File} file - The audio file
 * @param {number} threshold - Silence threshold (0-1)
 * @returns {Promise<Blob>} - Trimmed audio blob
 */
export const trimAudio = async (file, threshold = 0.01) => {
	const audioContext = new (window.AudioContext || window.webkitAudioContext)();
	const reader = new FileReader();

	return new Promise((resolve, reject) => {
		reader.onload = async (e) => {
			try {
				const arrayBuffer = e.target.result;
				const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
				const channelData = audioBuffer.getChannelData(0);

				// Find start trim point
				let start = 0;
				for (let i = 0; i < channelData.length; i++) {
					if (Math.abs(channelData[i]) > threshold) {
						start = i;
						break;
					}
				}

				// Find end trim point
				let end = channelData.length;
				for (let i = channelData.length - 1; i >= 0; i--) {
					if (Math.abs(channelData[i]) > threshold) {
						end = i;
						break;
					}
				}

				// Create new buffer with trimmed audio
				const trimmedLength = end - start;
				const trimmedBuffer = audioContext.createBuffer(
					audioBuffer.numberOfChannels,
					trimmedLength,
					audioBuffer.sampleRate
				);

				for (
					let channel = 0;
					channel < audioBuffer.numberOfChannels;
					channel++
				) {
					const oldData = audioBuffer.getChannelData(channel);
					const newData = trimmedBuffer.getChannelData(channel);
					for (let i = 0; i < trimmedLength; i++) {
						newData[i] = oldData[start + i];
					}
				}

				const wavBlob = audioBufferToWav(trimmedBuffer);
				resolve(wavBlob);
			} catch (error) {
				reject(error);
			}
		};

		reader.onerror = () => reject(new Error("Failed to read audio file"));
		reader.readAsArrayBuffer(file);
	});
};

/**
 * Convert Blob to File
 * @param {Blob} blob - The blob
 * @param {string} filename - File name
 * @returns {File} - File object
 */
export const blobToFile = (blob, filename) => {
	return new File([blob], filename, {
		type: blob.type,
		lastModified: Date.now(),
	});
};

/**
 * Get file size in MB
 * @param {File} file - The file
 * @returns {number} - File size in MB
 */
export const getAudioFileSizeMB = (file) => {
	return (file.size / (1024 * 1024)).toFixed(2);
};

export default {
	getAudioDuration,
	getAudioMetadata,
	compressAudio,
	trimAudio,
	blobToFile,
	getAudioFileSizeMB,
};
