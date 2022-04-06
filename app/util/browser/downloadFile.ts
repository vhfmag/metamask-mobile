import Share, { ShareOptions } from 'react-native-share';
import { ShareOpenResult } from 'react-native-share/lib/typescript/types';
import RNFetchBlob, { FetchBlobResponse } from 'rn-fetch-blob';

interface DownloadResult {
	success: boolean;
	message: string;
}

const shareFile = async (filePath: string) => {
	const options: ShareOptions = {
		title: 'Save file',
		message: 'Where do you want this file to be saved?:',
		url: filePath,
		saveToFiles: true,
	};
	return await Share.open(options);
};

const downloadFile = async (downloadUrl: string): Promise<DownloadResult> => {
	console.log('downloadFiles called');
	const { config } = RNFetchBlob;
	const response: FetchBlobResponse = await config({ fileCache: true }).fetch('GET', downloadUrl);
	if (response.path()) {
		const shareResponse: ShareOpenResult = await shareFile(response.path());
		return {
			success: shareResponse.success,
			message: shareResponse.message,
		};
	}
	return {
		success: false,
		message: response.text().toString(),
	};
};

export default downloadFile;
