import { argon2id, argon2Verify } from 'hash-wasm';
('hash-wasm');
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Argon2IdService {
  public LastSaltGenerated: string | null;

  constructor() {
    this.LastSaltGenerated = null;
  }

  async createHash(password: string): Promise<string> {
    try {
      const mapArraySalt = new Uint8Array(16);
      const salt = crypto.getRandomValues(mapArraySalt);

      this.LastSaltGenerated = Array.from(salt)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');

      const hash = await argon2id({
        password: password,
        salt: salt,
        parallelism: 4,
        iterations: 100,
        memorySize: 65536,
        hashLength: 64,
        outputType: 'encoded',
      });

      return hash;
    } catch (error) {
      throw new Error(
        "An error has occured. The password hash wasn\'t created. Error get: " + error,
      );
    }
  }

  async verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
    try {
      const isValidPassword = await argon2Verify({
        password: password,
        hash: hashedPassword,
      });

      return isValidPassword;
    } catch {
      throw new Error('The login password does not match to the account hashed password');
    }
  }
}
