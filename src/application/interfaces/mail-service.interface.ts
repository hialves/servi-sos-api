export abstract class MailService {
  abstract sendMail(data: { to: string; subject: string; html: any }): Promise<boolean>;
}
