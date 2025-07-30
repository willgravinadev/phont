import { type UseCaseLoggingContext } from '@shared/use-case'

export namespace SendLogTimeUseCaseLoggerProviderDTO {
  export type Parameters = Readonly<{
    message: string
    runtimeInMs: number
    useCaseName: string
    parameters: unknown
    isSuccess: boolean
    context: UseCaseLoggingContext
  }>
  export type Result = Readonly<null>
}

export interface ISendLogTimeUseCaseLoggerProvider {
  sendLogTimeUseCase(
    parameters: SendLogTimeUseCaseLoggerProviderDTO.Parameters
  ): SendLogTimeUseCaseLoggerProviderDTO.Result
}
