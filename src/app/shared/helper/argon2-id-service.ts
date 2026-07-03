import { Injectable } from '@angular/core';
import * as argon2 from 'argon2-browser';

@Injectable({
  providedIn: 'root',
})
export class Argon2IdService {
  private Cf_Argon2ID_Time = 100; // Iterations
  private Cf_Argon2ID_Mem = 65536; // 64 MiB
  private Cf_Argon2ID_HashLen = 64; // Hash Length (bytes)
  private Cf_Argon2ID_Parallelism = 4;
  private Cf_Argon2ID_Type = argon2.ArgonType.Argon2id;

  async hashPassword(password: string, passwordSalt: Uint8Array): Promise<string> {
    if (!password) {
      throw new Error('You may pass the password to hash it');
    }
    const hashBufferConfig = await argon2.hash({
      pass: password,
      salt: passwordSalt,
      type: this.Cf_Argon2ID_Type,
      mem: this.Cf_Argon2ID_Mem,
      time: this.Cf_Argon2ID_Time,
      parallelism: this.Cf_Argon2ID_Parallelism,
      hashLen: this.Cf_Argon2ID_HashLen,
    });

    return hashBufferConfig.toString();
  }

  async verifyPassword(hashedPassword: string, passwordAttempt: string): Promise<boolean> {
    if (!passwordAttempt || !hashedPassword) {
      return false;
    }

    const hashResolver = await argon2.verify({
      encoded: hashedPassword,
      pass: passwordAttempt,
      type: this.Cf_Argon2ID_Type,
    });

    return hashResolver === true;
  }

  async generateSalt(bytesLength: number = 16): Promise<Uint8Array> {
    if (bytesLength < 4) {
      throw new Error('Salt must be equal or higher than 4 bytes');
    }
    const intarray = new Uint8Array(bytesLength);
    crypto.getRandomValues(intarray);

    return intarray;
  }

  // Método auxiliar para leitura
  convertUint8ArrayToBase64(array: Uint8Array): string {
    return btoa(String.fromCharCode(...array));
  }

  // Método auxiliar para escrita
  convertBase64ToUint8Array(base64String: string): Uint8Array {
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}
