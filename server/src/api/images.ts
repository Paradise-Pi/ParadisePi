import { existsSync, readFileSync } from 'fs'
import { extname } from 'path'
import { Images } from '../../../shared/sharedTypes'
import logger from '../logger'
import { ConfigRepository } from '../database/repository/config'
import { broadcast } from './broadcast'
const base64Image = (path: string) => {
	const extension = extname(path)
	const mime = extension === '.png' ? 'image/png' : 'image/jpeg'
	const imageAsBase64 = readFileSync(path, 'base64')
	return 'data:' + mime + ';base64,' + imageAsBase64
}

/**
 * Create a new image object for monitoring by redux
 * @returns A promise that resolves to the image object
 */
export const createImagesObject = async (): Promise<Images> => {
	const logoPath = await ConfigRepository.getItem('logoPath')
	if (!logoPath || logoPath === 'false') {
		logger.verbose('Logo requested but no logo path set')
		return { logo: false }
	} else if (!existsSync(logoPath)) {
		logger.warn('Logo path set does not exist ' + logoPath)
		return { logo: false }
	} else
		return {
			logo: base64Image(logoPath),
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
