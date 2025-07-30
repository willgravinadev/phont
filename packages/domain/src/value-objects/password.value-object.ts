import { randomUUID } from 'node:crypto'

import { InvalidPasswordFormatError } from '@errors/value-objects/password/invalid-password-format.error'
import { InvalidPasswordLengthError } from '@errors/value-objects/password/invalid-password-length.error'
import { type Either, failure, success } from '@phont/utils'

export class Password {
  public readonly value: string
  public readonly isEncrypted: boolean

  constructor(parameters: { password: string; isEncrypted: boolean }) {
    this.value = parameters.password
    this.isEncrypted = parameters.isEncrypted
  }

  public static validateDecryptedPassword(parameters: {
    password: string
  }): Either<InvalidPasswordFormatError, { passwordValidated: Password }> {
    const passwordFormatted = parameters.password.trim()
    if (passwordFormatted.split(' ').length > 1) {
      return failure(new InvalidPasswordFormatError({ decryptedPassword: passwordFormatted }))
    }
    if (passwordFormatted.length < 8) {
      return failure(new InvalidPasswordFormatError({ decryptedPassword: passwordFormatted }))
    }
    if (passwordFormatted.length > 32) {
      return failure(new InvalidPasswordFormatError({ decryptedPassword: passwordFormatted }))
    }
    return success({ passwordValidated: new Password({ password: passwordFormatted, isEncrypted: false }) })
  }

  public static generateRandomPassword(input: {
    length: number
  }): Either<InvalidPasswordLengthError, { randomPasswordGenerated: Password }> {
    if (input.length < 8) return failure(new InvalidPasswordLengthError({ passwordLength: input.length }))
    const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const randomPassword = Array.from({ length: input.length }, () =>
      CHAR_SET.charAt(Math.floor(Math.random() * CHAR_SET.length))
    ).join('')
    return success({ randomPasswordGenerated: new Password({ password: randomPassword, isEncrypted: false }) })
  }

  public static createNewPassword(parameters: {
    password: string | null
  }): Either<InvalidPasswordFormatError | InvalidPasswordLengthError, { passwordCreated: Password }> {
    let password: string | null = null
    if (parameters.password === null || parameters.password.trim() === '') {
      const resultGenerateRandomPassword = Password.generateRandomPassword({ length: 12 })
      if (resultGenerateRandomPassword.isFailure()) return failure(resultGenerateRandomPassword.value)
      const { randomPasswordGenerated } = resultGenerateRandomPassword.value
      password = randomPasswordGenerated.value
    } else {
      password = parameters.password
    }
    if (!password) return failure(new InvalidPasswordFormatError({ decryptedPassword: password }))
    const resultValidateDecryptedPassword = Password.validateDecryptedPassword({ password })
    if (resultValidateDecryptedPassword.isFailure()) return failure(resultValidateDecryptedPassword.value)
    const { passwordValidated } = resultValidateDecryptedPassword.value
    return success({ passwordCreated: new Password({ isEncrypted: false, password: passwordValidated.value }) })
  }

  public static generateForgotPasswordToken(): { forgotPasswordTokenGenerated: string } {
    return { forgotPasswordTokenGenerated: randomUUID() }
  }
}
