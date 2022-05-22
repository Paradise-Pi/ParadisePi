import { Logger } from 'typeorm'
import { QueryRunner } from 'typeorm/query-runner/QueryRunner'

export class MyCustomLogger implements Logger {
	logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
		//console.log('query', query, parameters)
	}
	logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
		console.log('Query error', error, query, parameters)
	}
	logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
		console.log('query slow', time, query, parameters)
	}
	logSchemaBuild(message: string, queryRunner?: QueryRunner) {
		console.log('schema build', message)
	}
	logMigration(message: string, queryRunner?: QueryRunner) {
		console.log('migration', message)
	}
	log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
		console.log('generic log', level, message)
	}
}
