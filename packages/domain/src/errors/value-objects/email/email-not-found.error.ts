import { StatusError } from '@shared/status-error'
import { type Email } from '@value-objects/email.value-object'

export class EmailNotFoundError {
  public readonly status: StatusError
  public readonly errorMessage: string
  public readonly name: 'EmailNotFoundError'
  public readonly errorValue: unknown

  constructor(parameters: { email: Pick<Email, 'value'> }) {
    this.errorMessage = `The email ${parameters.email.value} was not found.`
    this.errorValue = null
    this.name = 'EmailNotFoundError'
    this.status = StatusError.NOT_FOUND
  }
}
