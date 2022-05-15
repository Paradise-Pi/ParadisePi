export interface IpcRequest {
	path: string
	method: 'GET' | 'POST' | 'PUT' | 'DELETE'
	payload: apiObject
}
