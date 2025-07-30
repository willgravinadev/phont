import { type ModelName } from '@models/_model-name'
import { StatusError } from '@shared/status-error'
import { type ValueObjectName } from '@value-objects/_value-object-name'

export class GenerateIDError {
  public readonly errorMessage: string
  public readonly errorValue: unknown
  public readonly name: 'GenerateIDError'
  public readonly status: StatusError

  constructor(
    parameters: { modelName: ModelName; error: unknown } | { valueObjectName: ValueObjectName; error: unknown }
  ) {
    this.errorMessage = `Error generating id to ${
      'modelName' in parameters ? 'model' : 'value object'
    } ${'modelName' in parameters ? parameters.modelName : parameters.valueObjectName}`
    this.errorValue = parameters.error
    this.name = 'GenerateIDError'
    this.status = StatusError.INVALID
  }
}
