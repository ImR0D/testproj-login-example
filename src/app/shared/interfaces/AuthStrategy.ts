import { InjectionToken } from '@angular/core';
import CreateAccountModel from '../models/Account/CreateAccount.model';

export interface AuthenticationStrategy {
  login(email: string, password: string): Promise<boolean>;
  register(account: CreateAccountModel): Promise<boolean>;
}

export const AuthStrategy = new InjectionToken<AuthenticationStrategy>('AuthStrategy');
