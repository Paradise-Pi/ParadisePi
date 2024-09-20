import { In, Not } from 'typeorm'
import { DatabaseVariable } from '../../../../shared/sharedTypes'
import dataSource from '../dataSource'
import { Variable } from '../model/Variable'

export const VariableRepository = dataSource.getRepository(Variable).extend({
	//get all
	async getAll(): Promise<Array<DatabaseVariable>> {
		const items = await this.find()
		return items.map((item: Variable) => {
			return {
				id: item.id,
				name: item.name,
				value: item.value,
				notes: item.notes,
				sort: item.sort,
			}
		})
	},
	/**
	 * Delete all existing variables and then upload the given variables
	 * @param variables - An array of variables to set as the database record
	 */
	async setAllFromApp(variables: Array<DatabaseVariable>): Promise<void> {
		const variableIdsToKeep: Array<number> = variables
			.filter((variable: DatabaseVariable) => variable.id !== null)
			.map((variable: DatabaseVariable) => variable.id)
		await this.delete({
			id: Not(In(variableIdsToKeep)),
		})
		// Convert variable back to an object
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const variablesToInsert: Array<{ [key: string]: any }> = variables.map(
			(variable: DatabaseVariable, count: number) => {
				return {
					...variable,
					sort: count + 10, // +10 to make sure that newly inserted ones with null/0/1 end up at the top
				}
			}
		)
		await this.upsert(variablesToInsert, ['id'])
	},
})
