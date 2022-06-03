/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from 'typeorm'
import { QueryRunner } from 'typeorm/query-runner/QueryRunner'

export class MyCustomLogger implements Logger {
	logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
		logger.silly({ query: query, params: parameters })
	}
	logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
		logger.warn({ 'Query error': error, query, parameters })
	}
	logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
		logger.info({ 'query slow': time, query, parameters })
	}
	logSchemaBuild(message: string, queryRunner?: QueryRunner) {
		logger.info({ 'schema build': message })
	}
	logMigration(message: string, queryRunner?: QueryRunner) {
		logger.info({ migration: message })
	}
	log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
		logger.info({ level, message })
	}
}
