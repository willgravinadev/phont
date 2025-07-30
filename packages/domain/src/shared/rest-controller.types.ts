import { type Readable } from 'node:stream'

import { type HttpStatusCode } from '@phont/utils'
import { type StatusError } from '@shared/status-error'
import { type StatusSuccess } from '@shared/status-success'
import { type ID } from '@value-objects/id.value-object'

export type HttpResponseError = {
  readonly error: { message: string }
  readonly status: StatusError
}

export type HttpResponseSuccess<T = unknown> = {
  readonly success: T
  readonly status: StatusSuccess
}

export type HttpResponseHeaders = Readonly<Record<string, string | string[] | undefined>>

export type HttpResponse<TData = unknown> = {
  readonly statusCode: HttpStatusCode
  readonly data: TData
  readonly headers?: HttpResponseHeaders
}

export type HttpRequest<
  TBody = unknown,
  TParams = Record<string, unknown>,
  THeaders extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>
> = {
  readonly body: TBody
  readonly params: TParams
  readonly headers: THeaders
  readonly accessToken: string
  readonly requestID: ID
  readonly file?: FileUpload
}

export type FileUpload = {
  readonly type: 'file'
  readonly fieldname: string
  readonly filename: string
  readonly encoding: string
  readonly mimetype: string
  toBuffer(): Promise<Buffer>
  readonly file: Readable
}

export type ControllerResponse<TData = unknown> = Promise<HttpResponse<TData>>

export interface IController<TRequest = unknown, TResponse = unknown> {
  handle(request: TRequest): ControllerResponse<TResponse>
}

export type PerformanceMetrics<TRequest = unknown, TResponse = unknown> = {
  readonly request: TRequest
  readonly response: TResponse
  readonly startTime: number
  readonly endTime: number
  readonly runtimeMs: number
  readonly success: boolean
  readonly controllerName: string
}

export type LoggingContextController = {
  readonly controllerName: string
  readonly method: string
  readonly requestID: ID
}
