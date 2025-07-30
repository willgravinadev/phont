import { performance } from 'node:perf_hooks'

import { type ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error.logger-provider'
import { type ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider'
import { type Either } from '@phont/utils'
import { type ID } from '@value-objects/id.value-object'

export type UseCaseLoggingContext = {
  readonly requestID: ID
  readonly useCaseName: string
  readonly method: string
}

export abstract class UseCase<Parameters, ResultFailure, ResultSuccess> {
  constructor(public readonly loggerProvider: ISendLogTimeUseCaseLoggerProvider & ISendLogErrorLoggerProvider) {}

  public async execute(
    parameters: Parameters,
    loggingContext: UseCaseLoggingContext
  ): Promise<Either<ResultFailure, ResultSuccess>> {
    const startTime = performance.now()
    try {
      const response = await this.performOperation(parameters)
      const runtimeInMs = performance.now() - startTime
      this.loggerProvider.sendLogTimeUseCase({
        message: `${this.constructor.name} took +${runtimeInMs} ms to execute!`,
        parameters,
        runtimeInMs,
        useCaseName: this.constructor.name,
        isSuccess: response.isSuccess(),
        context: {
          requestID: loggingContext.requestID,
          useCaseName: loggingContext.useCaseName,
          method: loggingContext.method
        }
      })
      return response
    } catch (error: unknown) {
      const runtimeInMs = performance.now() - startTime
      this.loggerProvider.sendLogError({
        message: `Unexpected error in ${this.constructor.name}: ${this.extractErrorMessage(error)}`,
        value: error,
        context: {
          requestID: loggingContext.requestID
        }
      })
      this.loggerProvider.sendLogTimeUseCase({
        message: `${this.constructor.name} failed after +${runtimeInMs} ms`,
        parameters,
        runtimeInMs,
        useCaseName: this.constructor.name,
        isSuccess: false,
        context: {
          requestID: loggingContext.requestID,
          useCaseName: loggingContext.useCaseName,
          method: loggingContext.method
        }
      })
      throw error
    }
  }

  protected abstract performOperation(parameters: Parameters): Promise<Either<ResultFailure, ResultSuccess>>

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    if (typeof error === 'string') return error
    if (error && typeof error === 'object' && 'errorMessage' in error) {
      const message = (error as { errorMessage: unknown }).errorMessage
      if (typeof message === 'string') return message
    }
    return 'An unexpected error occurred'
  }
}
