export default interface AccountModel {
  accountId: string;
  name: string;
  email: string;
  password: string;
  salt: string | null;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
