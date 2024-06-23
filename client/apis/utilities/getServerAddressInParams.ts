import { getSearchParameters } from './getSearchParams'

export const getServeraddressInParams = (): string | false => {
	const searchParams = getSearchParameters()
	if (searchParams.serverAddress && searchParams.serverAddress !== '' && searchParams.serverAddress !== 'undefined')
		return searchParams.serverAddress
	else return false
}
