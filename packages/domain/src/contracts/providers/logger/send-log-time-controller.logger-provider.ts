import type { LoggingContextController } from '@shared/rest-controller.types'

export namespace SendLogTimeControllerLoggerProviderDTO {
  export type Parameters = Readonly<{
    message: string
    runtimeInMs: number
    controllerName: string
    httpRequest: string
    httpResponse: string
    isSuccess: boolean
    context: LoggingContextController
  }>
  export type Result = Readonly<null>
}

export interface ISendLogTimeControllerLoggerProvider {
  sendLogTimeController(
    parameters: SendLogTimeControllerLoggerProviderDTO.Parameters
  ): SendLogTimeControllerLoggerProviderDTO.Result
}
