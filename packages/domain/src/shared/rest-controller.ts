import { randomUUID } from 'node:crypto'
import { performance } from 'node:perf_hooks'

import { type ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error.logger-provider'
import { type ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider'
import { type Either } from '@phont/utils'
import { PerformanceTracker } from '@shared/performance-tracker'
import { ResponseBuilder } from '@shared/response-builder'
import {
  type ControllerResponse,
  type HttpResponse,
  type HttpResponseError,
  type HttpResponseHeaders,
  type HttpResponseSuccess,
  type LoggingContextController
} from '@shared/rest-controller.types'
import { SensitiveDataSanitizer } from '@shared/sensitive-data-sanitizer'
import { StatusError } from '@shared/status-error'
import { StatusMapper } from '@shared/status-mapper'
import { ValueObjectName } from '@value-objects/_value-object-name'
import { ID } from '@value-objects/id.value-object'

export type ControllerConstraints<TRequest, TFailure, TSuccess> = {
  request: TRequest
  failure: TFailure extends HttpResponseError ? TFailure : never
  success: TSuccess extends HttpResponseSuccess ? TSuccess : never
}

export abstract class RestController<
  TRequest,
  TFailure extends HttpResponseError,
  TSuccess extends HttpResponseSuccess
> {
  private readonly statusMapper: StatusMapper
  private readonly responseBuilder: ResponseBuilder
  private readonly performanceTracker: PerformanceTracker
  private readonly dataSanitizer: SensitiveDataSanitizer
  protected readonly requestIDHeader: string = 'x-request-id'

  constructor(protected readonly loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider) {
    this.statusMapper = new StatusMapper()
    this.responseBuilder = ResponseBuilder.createDefault({ statusMapper: this.statusMapper })
    this.dataSanitizer = new SensitiveDataSanitizer()
    this.performanceTracker = PerformanceTracker.createDefault({
      loggerProvider: this.loggerProvider,
      dataSanitizer: this.dataSanitizer
    })
  }

  protected abstract performOperation(request: TRequest): Promise<Either<TFailure, TSuccess>>

  public async handle(request: TRequest): ControllerResponse<TFailure | TSuccess> {
    const startTime = performance.now()
    const context = this.createLoggingContext({ request })
    try {
      const result = await this.performOperation(request)
      if (result.isFailure()) {
        const errorResponse = this.buildErrorResponse({ error: result.value })
        this.logError({ error: result.value, context })
        this.performanceTracker.trackRequest({
          request,
          response: errorResponse.data,
          context,
          isSuccess: false,
          startTime
        })
        return errorResponse
      }
      const successResponse = this.responseBuilder.buildSuccessResponse({
        data: result.value.success,
        status: result.value.status
      }) as HttpResponse<TSuccess>
      this.performanceTracker.trackRequest({
        request,
        response: successResponse.data,
        context,
        isSuccess: true,
        startTime
      })
      return successResponse
    } catch (error: unknown) {
      return this.handleUnexpectedError({ error, request, context, startTime })
    }
  }

  private buildErrorResponse<TError extends HttpResponseError>(parameters: {
    error: TError
    headers?: HttpResponseHeaders
  }): HttpResponse<TError> {
    return this.responseBuilder.buildErrorResponse(parameters)
  }

  protected createLoggingContext(parameters: { request: TRequest }): LoggingContextController {
    return {
      controllerName: this.constructor.name,
      method: 'handle',
      requestID: this.extractRequestID({ request: parameters.request }).requestID
    }
  }

  protected handleUnexpectedError(parameters: {
    error: unknown
    request: TRequest
    context: LoggingContextController
    startTime: number
  }): HttpResponse<TFailure> {
    this.logError({ error: parameters.error, context: parameters.context })
    const errorResponse = this.responseBuilder.buildErrorResponse({
      error: this.createGenericError({ message: this.extractErrorMessage(parameters.error) })
    })
    this.performanceTracker.trackRequest({
      request: parameters.request,
      response: errorResponse.data,
      context: parameters.context,
      isSuccess: false,
      startTime: parameters.startTime
    })
    return errorResponse
  }

  protected extractRequestID(parameters: { request: TRequest }): { requestID: ID } {
    let requestID: null | ID = null
    if (parameters.request && typeof parameters.request === 'object' && 'headers' in parameters.request) {
      const headers = (parameters.request as { headers: Record<string, unknown> }).headers
      if (typeof headers === 'object') {
        const requestIDString = headers[this.requestIDHeader]
        if (typeof requestIDString === 'string') {
          requestID = new ID({ id: requestIDString })
        } else {
          const resultGeneratedID = ID.generate({ valueObjectName: ValueObjectName.REQUEST_ID })
          if (resultGeneratedID.isSuccess()) {
            requestID = resultGeneratedID.value.idGenerated
          }
        }
      }
    }
    requestID ??= new ID({ id: randomUUID() })
    return { requestID }
  }

  protected logError(parameters: { error: unknown; context: LoggingContextController }): void {
    const errorMessage = `${parameters.context.controllerName}.${parameters.context.method}() error`
    const requestIDInfo = parameters.context.requestID.toString()
      ? ` [RequestID: ${parameters.context.requestID.toString()}]`
      : ''
    this.loggerProvider.sendLogError({
      message: `${errorMessage}${requestIDInfo}`,
      value: parameters.error,
      context: { requestID: parameters.context.requestID }
    })
  }

  protected extractErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    if (typeof error === 'string') return error
    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as { message: unknown }).message
      if (typeof message === 'string') return message
    }
    return 'An unexpected error occurred'
  }

  protected createGenericError(parameters: { message: string }): TFailure {
    return { error: { message: parameters.message }, status: StatusError.INTERNAL_ERROR } as TFailure
  }
}
