import { type ID } from '@value-objects/id.value-object'

export namespace SendLogInfoLoggerProviderDTO {
  export type Parameters = Readonly<{
    message: string
    context: { requestID: ID }
  }>
  export type Result = Readonly<null>
}

export interface ISendLogInfoLoggerProvider {
  sendLogInfo(parameters: SendLogInfoLoggerProviderDTO.Parameters): SendLogInfoLoggerProviderDTO.Result
}
