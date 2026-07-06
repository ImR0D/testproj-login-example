import { inject, Injectable } from '@angular/core';
import { AuthenticationStrategy } from '../../interfaces/AuthStrategy';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../env/env.development';
import { firstValueFrom } from 'rxjs';
import { Argon2IdService } from '../../helper/argon2id-service';
import CreateAccountModel from '../../models/Account/CreateAccount.model';
import AccountModel from '../../models/Account/Account.model';

@Injectable({
  providedIn: 'root',
})
export class MockedHttpAuthStrategyService implements AuthenticationStrategy {
  private http = inject(HttpClient);
  private argon2 = inject(Argon2IdService);

  private apiUrl = environment.gistAccountsUrl; // Mock
  private accountRegisterLocalKey = 'account_registers';

  async login(email: string, password: string): Promise<boolean> {
    // Pegar dados da api mockada
    const dataFromApi = await firstValueFrom(
      this.http.get<Record<string, AccountModel>>(this.apiUrl),
    );
    const accountsFromApi = dataFromApi['accounts'];

    // Pegar dados armazenados do localStorage
    const rawDataFromLocal =
      localStorage.getItem(this.accountRegisterLocalKey) ??
      '{"accounts": [], "authentications": []}';
    const dataFromLocal = JSON.parse(rawDataFromLocal);
    const accountsFromLocal = dataFromLocal['accounts'];

    // Agrupar dados da api e dados do localStorage
    const mergedDataAccounts = { ...accountsFromApi, ...accountsFromLocal };

    // Transformar lista de contas mescladas em um Array do contrato de contas
    const accountsList = Object.values(mergedDataAccounts) as AccountModel[];

    // Localizar conta na lista
    const findAccount = accountsList.find((acc) => acc.email === email);

    if (!findAccount) {
      return false;
    }

    const isPasswordValid = await this.argon2.verifyPassword(findAccount.password, password);
    return isPasswordValid;
  }

  async register(account: CreateAccountModel): Promise<boolean> {
    const accountHashedPassword = await this.argon2.createHash(account.password);

    const rawDataFromLocal =
      localStorage.getItem(this.accountRegisterLocalKey) ??
      '{"accounts": {}, "authentications": {}}';

    const dataFromLocal = JSON.parse(rawDataFromLocal);

    if (!dataFromLocal.accounts || Array.isArray(dataFromLocal.accounts)) {
      dataFromLocal.accounts = {};
    }

    const nextIndex = Object.keys(dataFromLocal.accounts).length.toString();

    const newAccount: AccountModel = {
      accountId: crypto.randomUUID(),
      name: account.name,
      email: account.email,
      password: accountHashedPassword,
      salt: this.argon2.LastSaltGenerated,
      role: 'user',
      createdAt: new Date(),
    };

    dataFromLocal.accounts[nextIndex] = newAccount;
    localStorage.setItem(this.accountRegisterLocalKey, JSON.stringify(dataFromLocal));
    return true;
  }
}
