import { type ID } from '@value-objects/id.value-object'

export namespace SendLogErrorLoggerProviderDTO {
  export type Parameters = Readonly<{
    message: string
    value: unknown
    context: { requestID: ID }
  }>
  export type Result = Readonly<null>
}

export interface ISendLogErrorLoggerProvider {
  sendLogError(parameters: SendLogErrorLoggerProviderDTO.Parameters): SendLogErrorLoggerProviderDTO.Result
}
