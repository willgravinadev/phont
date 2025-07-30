import { StatusError } from '@shared/status-error'

type ParametersConstructorDTO = {
  error: unknown
  provider: {
    name: ProvidersNames
    method: TokenProviderMethods
    externalName?: string
  }
}

export enum ProvidersNames {
  TOKEN = 'token'
}

export enum TokenProviderMethods {
  GENERATE_JWT = 'generate jwt',
  VERIFY_JWT = 'verify jwt'
}

export class ProviderError {
  public readonly status: StatusError
  public readonly errorMessage: string
  public readonly name: 'ProviderError'
  public readonly errorValue: unknown

  constructor(parameters: ParametersConstructorDTO) {
    this.errorMessage = `Error in ${parameters.provider.name} provider in ${parameters.provider.method} method.${
      parameters.provider.externalName === undefined
        ? ''
        : ` Error in external lib name: ${parameters.provider.externalName}.`
    }`
    this.status = StatusError.PROVIDER_ERROR
    this.errorValue = parameters.error
    this.name = 'ProviderError'
  }
}
