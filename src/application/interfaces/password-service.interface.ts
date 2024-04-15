export abstract class PasswordService {
  abstract hashPassword(password: string): Promise<string>;
  abstract comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}
