import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class LanguageService {
  constructor(private readonly i18n: I18nService) {}
  USERNAME_EXIST(param?: string): string {
    return this.i18n.t('exception.USERNAME_EXIST', {
      args: { username: param ?? 'username' },
      lang: I18nContext.current().lang,
    });
  }

  IS_NOT_PHONE_OR_REF(param?: string): string {
    return this.i18n.t('validation.IS_NOT_PHONE_OR_REF', {
      args: { phoneOrRef: param ?? 'phoneOrRef' },
      lang: I18nContext.current().lang,
    });
  }

  IS_NOT_NUMBER(param?: string): string {
    return this.i18n.t('validation.IS_NOT_NUMBER', {
      args: { phoneOrRef: param ?? 'phoneOrRef' },
      lang: I18nContext.current().lang,
    });
  }

  STAFF_NOT_FOUND(param?: string): string {
    return this.i18n.t('exception.STAFF_NOT_FOUND', {
      args: { username: param ?? 'username' },
      lang: I18nContext.current().lang,
    });
  }

  INCORRECT_PASSWORD(): string {
    return this.i18n.t('exception.INCORRECT_PASSWORD', {
      lang: I18nContext.current().lang,
    });
  }

  CREDENTIAL_NOT_MATCH(): string {
    return this.i18n.t('exception.CREDENTIAL_NOT_MATCH', {
      lang: I18nContext.current().lang,
    });
  }

  USERNAME_REQUIRED(): string {
    return this.i18n.t('validation.USERNAME_REQUIRED', {
      lang: I18nContext.current().lang,
    });
  }

  PASSWORD_REQUIRED(): string {
    return this.i18n.t('validation.PASSWORD_REQUIRED', {
      lang: I18nContext.current().lang,
    });
  }

  EMAIL_REQUIRED(): string {
    return this.i18n.t('validation.EMAIL_REQUIRED', {
      lang: I18nContext.current().lang,
    });
  }

  EMAIL_NOT_MATCH(): string {
    return this.i18n.t('validation.EMAIL_NOT_MATCH', {
      lang: I18nContext.current().lang,
    });
  }

  EMAIL_EXIST(param?: string): string {
    return this.i18n.t('exception.EMAIL_EXIST', {
      args: { email: param ?? 'email' },
      lang: I18nContext.current().lang,
    });
  }

  OLD_PASSWORD_IS_REQUIRED(): string {
    return this.i18n.t('validation.OLD_PASSWORD_IS_REQUIRED', {
      lang: I18nContext.current().lang,
    });
  }

  OLD_PASSWORD_NOT_MATCH(): string {
    return this.i18n.t('validation.OLD_PASSWORD_NOT_MATCH', {
      lang: I18nContext.current().lang,
    });
  }

  ROLE_ALREADY_EXIST(): string {
    return this.i18n.t('exception.ROLE_ALREADY_EXIST', {
      lang: I18nContext.current().lang,
    });
  }

  SERVICE_ALREADY_EXIST(): string {
    return this.i18n.t('exception.SERVICE_ALREADY_EXIST', {
      lang: I18nContext.current().lang,
    });
  }

  UNAUTHORIZED(): string {
    return this.i18n.t('exception.UNAUTHORIZED', {
      lang: I18nContext.current().lang,
    });
  }

  FORBIDDEN(): string {
    return this.i18n.t('exception.FORBIDDEN', {
      lang: I18nContext.current().lang,
    });
  }

  USER_NOT_FOUND(): string {
    return this.i18n.t('exception.USER_NOT_FOUND', {
      lang: I18nContext.current().lang,
    });
  }
}
