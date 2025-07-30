import {
  type ISendLogErrorLoggerProvider,
  type ISendLogTimeUseCaseLoggerProvider,
  UseCase,
  type User
} from '@phont/domain'
import { type Either, success } from '@phont/utils'

export namespace SearchGithubRepositoriesUseCaseDTO {
  export type Parameters = Readonly<{ credentials: { email: string; password: string } } | { user: Pick<User, 'id'> }>

  export type ResultFailure = Readonly<undefined>
  export type ResultSuccess = Readonly<null>

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>
}

export class SearchGithubRepositoriesUseCase extends UseCase<
  SearchGithubRepositoriesUseCaseDTO.Parameters,
  SearchGithubRepositoriesUseCaseDTO.ResultFailure,
  SearchGithubRepositoriesUseCaseDTO.ResultSuccess
> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor -- example
  constructor(loggerProvider: ISendLogTimeUseCaseLoggerProvider & ISendLogErrorLoggerProvider) {
    super(loggerProvider)
  }

  // eslint-disable-next-line @typescript-eslint/require-await -- example
  protected async performOperation(
    parameters: SearchGithubRepositoriesUseCaseDTO.Parameters
  ): SearchGithubRepositoriesUseCaseDTO.Result {
    console.log(parameters)
    return success(null)
  }
}
