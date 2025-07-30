import {
  type HttpResponse,
  type HttpResponseError,
  type HttpResponseHeaders,
  type HttpResponseSuccess
} from '@shared/rest-controller.types'
import { StatusError } from '@shared/status-error'
import { type IStatusMapper } from '@shared/status-mapper'
import { type StatusSuccess } from '@shared/status-success'

export interface IResponseBuilder {
  buildErrorResponse<TError extends HttpResponseError>(parameters: {
    error: TError
    headers?: HttpResponseHeaders
  }): HttpResponse<TError>

  buildSuccessResponse<TData>(parameters: {
    data: TData
    status: StatusSuccess
    headers?: HttpResponseHeaders
  }): HttpResponse<HttpResponseSuccess<TData>>
}

export class ResponseBuilder implements IResponseBuilder {
  private readonly defaultHeaders: HttpResponseHeaders
  private readonly includeTimestamp: boolean
  private readonly timestampKey: string

  constructor(
    private readonly statusMapper: IStatusMapper,
    readonly options: {
      defaultHeaders?: HttpResponseHeaders
      includeTimestamp?: boolean
      timestampKey?: string
    } = {}
  ) {
    this.defaultHeaders = options.defaultHeaders ?? {}
    this.includeTimestamp = options.includeTimestamp ?? false
    this.timestampKey = options.timestampKey ?? 'timestamp'
  }

  public buildErrorResponse<TError extends HttpResponseError>(parameters: {
    error: TError
    headers?: HttpResponseHeaders
  }): HttpResponse<TError> {
    const responseHeaders = this.mergeHeaders({ additionalHeaders: parameters.headers })
    const statusCode = this.statusMapper.mapToHttpStatusCode({ status: parameters.error.status })
    const responseData = this.includeTimestamp
      ? ({ ...parameters.error, [this.timestampKey]: new Date().toISOString() } as TError)
      : parameters.error

    return {
      statusCode,
      data: responseData,
      headers: responseHeaders
    }
  }

  public buildSuccessResponse<TData>(parameters: {
    data: TData
    status: StatusSuccess
    headers?: HttpResponseHeaders
  }): HttpResponse<HttpResponseSuccess<TData>> {
    const responseHeaders = this.mergeHeaders({ additionalHeaders: parameters.headers })
    const statusCode = this.statusMapper.mapToHttpStatusCode({ status: parameters.status })
    const successData: HttpResponseSuccess<TData> = { success: parameters.data, status: parameters.status }
    const responseData = this.includeTimestamp
      ? ({ ...successData, [this.timestampKey]: new Date().toISOString() } as HttpResponseSuccess<TData>)
      : successData
    return { statusCode, data: responseData, headers: responseHeaders }
  }

  public buildCustomResponse<TData>(parameters: {
    data: TData
    status: StatusError | StatusSuccess
    headers?: HttpResponseHeaders
  }): HttpResponse<TData> {
    const responseHeaders = this.mergeHeaders({
      additionalHeaders: parameters.headers
    })
    const statusCode = this.statusMapper.mapToHttpStatusCode({ status: parameters.status })
    const responseData = this.includeTimestamp
      ? ({ ...(parameters.data as object), [this.timestampKey]: new Date().toISOString() } as TData)
      : parameters.data
    return {
      statusCode,
      data: responseData,
      headers: responseHeaders
    }
  }

  public buildInternalErrorResponse(parameters: {
    errorMessage: string
    headers: HttpResponseHeaders
  }): HttpResponse<HttpResponseError> {
    return this.buildErrorResponse({
      error: {
        error: { message: parameters.errorMessage },
        status: StatusError.INTERNAL_ERROR
      } as HttpResponseError,
      headers: parameters.headers
    })
  }

  private mergeHeaders(parameters: { additionalHeaders?: HttpResponseHeaders }): HttpResponseHeaders {
    if (!parameters.additionalHeaders || Object.keys(parameters.additionalHeaders).length === 0) {
      return this.defaultHeaders
    }
    return {
      ...this.defaultHeaders,
      ...parameters.additionalHeaders
    }
  }

  public setDefaultHeader(key: string, value: string | string[]): void {
    ;(this.defaultHeaders as Record<string, string | string[]>)[key] = value
  }

  public removeDefaultHeader(key: string): void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- this is a valid use case
    delete (this.defaultHeaders as Record<string, string | string[]>)[key]
  }

  public static createDefault(parameters: { statusMapper: IStatusMapper }): ResponseBuilder {
    return new ResponseBuilder(parameters.statusMapper, {
      defaultHeaders: {
        'Content-Type': 'application/json',
        'X-Powered-By': 'PHONT'
      },
      includeTimestamp: true
    })
  }

  public static createMinimal(parameters: { statusMapper: IStatusMapper }): ResponseBuilder {
    return new ResponseBuilder(parameters.statusMapper, {
      includeTimestamp: false,
      defaultHeaders: { 'Content-Type': 'application/json' }
    })
  }
}
