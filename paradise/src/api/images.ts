import { ConfigRepository } from '../database/repository/config'
import { broadcast } from './broadcast'
import { existsSync, readFileSync } from 'fs'
import path, { extname } from 'path'
const base64Image = (path: string) => {
	const extension = extname(path)
	const mime = extension === '.png' ? 'image/png' : 'image/jpeg'
	const imageAsBase64 = readFileSync(path, 'base64')
	return 'data:' + mime + ';base64,' + imageAsBase64
}
export interface Images {
	logo: string | false
}
/**
 * Create a new image object for monitoring by redux
 * @returns A promise that resolves to the image object
 */
export const createImagesObject = async (): Promise<Images> => {
	const logoPath = await ConfigRepository.getItem('logoPath')
	return {
		logo:
			logoPath !== 'false' && existsSync(path.join(__dirname, '../../', logoPath))
				? base64Image(path.join(__dirname, '../../', logoPath))
				: false,
	}
}
/**
 * Sends the image object over both channels to notify all clients of an update
 * @param database - The image object to send
 */
export const sendImagesObject = (images: Images): void => {
	broadcast('refreshImagesDatastore', images)
}

export const createAndSendImagesObject = (): Promise<void> => {
	return createImagesObject().then(sendImagesObject)
}
