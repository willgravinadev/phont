import { type GenerateIDError } from '@errors/index'
import { ModelName } from '@models/_model-name'
import { type Either, failure, success } from '@phont/utils'
import { type Email, ID, type Password } from '@value-objects/index'

export class User {
  public readonly id: ID
  public readonly email: Email
  public readonly password: Password

  private constructor(parameters: { id: ID; email: Email; password: Password }) {
    this.id = parameters.id
    this.email = parameters.email
    this.password = parameters.password
  }

  public static createNewUser(parameters: {
    email: Email
    password: Password
  }): Either<GenerateIDError, { userCreated: User }> {
    const resultGenerateID = ID.generate({ modelName: ModelName.USER })
    if (resultGenerateID.isFailure()) return failure(resultGenerateID.value)
    const { idGenerated: userID } = resultGenerateID.value
    return success({
      userCreated: new User({
        id: userID,
        email: parameters.email,
        password: parameters.password
      })
    })
  }
}
