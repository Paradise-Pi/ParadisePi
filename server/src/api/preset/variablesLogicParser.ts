import { Database } from '../../../../shared/database'
import { VariableRepository } from '../../database/repository/variable'
import logger from '../../logger'
import { createDatabaseObject, sendDatabaseObject } from '../database'
export interface VariableLogic {
	rules: Array<{
		[key: string]: any
	}>
}
export const variablesLogicParser = (variableLogic: VariableLogic, response: string, errorEncountered: boolean) => {
	if (
		variableLogic === undefined ||
		variableLogic == null ||
		!Object.prototype.hasOwnProperty.call(variableLogic, 'rules') ||
		variableLogic.rules === undefined ||
		variableLogic.rules.length === 0
	)
		return Promise.resolve()
	return Promise.all(
		variableLogic.rules.map(value => {
			return VariableRepository.getOne(parseInt(value.variable)).then(variable => {
				logger.debug('Evaluating variable logic', { variable, value, response })
				if (variable === null) return Promise.resolve()
				else if (value.logic === 'error' && errorEncountered) {
					if (variable.value != value.value) {
						return VariableRepository.setOne(variable.id, value.value)
							.then(() => createDatabaseObject('setting a variable'))
							.then((response: Database) => {
								sendDatabaseObject(response)
								return Promise.resolve()
							})
					}
				} else if (!errorEncountered) {
					if (value.logic === 'equal') {
						if (response == value.match && variable.value != value.value) {
							return VariableRepository.setOne(variable.id, value.value)
								.then(() => createDatabaseObject('setting a variable'))
								.then((response: Database) => {
									sendDatabaseObject(response)
									return Promise.resolve()
								})
						}
					} else if (value.logic === 'notequal') {
						if (response != value.match && variable.value != value.value) {
							return VariableRepository.setOne(variable.id, value.value)
								.then(() => createDatabaseObject('setting a variable'))
								.then((response: Database) => {
									sendDatabaseObject(response)
									return Promise.resolve()
								})
						}
					} else if (value.logic === 'contains') {
						if (response.includes(value.match) && variable.value != value.value) {
							return VariableRepository.setOne(variable.id, value.value)
								.then(() => createDatabaseObject('setting a variable'))
								.then((response: Database) => {
									sendDatabaseObject(response)
									return Promise.resolve()
								})
						}
					} else if (value.logic === 'notcontains') {
						if (!response.includes(value.match) && variable.value != value.value) {
							return VariableRepository.setOne(variable.id, value.value)
								.then(() => createDatabaseObject('setting a variable'))
								.then((response: Database) => {
									sendDatabaseObject(response)
									return Promise.resolve()
								})
						}
					} else if (value.logic === 'isnull') {
						if (response == '' && variable.value != value.value) {
							return VariableRepository.setOne(variable.id, value.value)
								.then(() => createDatabaseObject('setting a variable'))
								.then((response: Database) => {
									sendDatabaseObject(response)
									return Promise.resolve()
								})
						}
					} else if (value.logic === 'isnotnull') {
						if (response != '' && variable.value != value.value) {
							return VariableRepository.setOne(variable.id, value.value)
								.then(() => createDatabaseObject('setting a variable'))
								.then((response: Database) => {
									sendDatabaseObject(response)
									return Promise.resolve()
								})
						}
					} else return Promise.resolve()
				} else return Promise.resolve()
			})
		})
	)
}
