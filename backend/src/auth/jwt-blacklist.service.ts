import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtBlacklistService {
  private blacklist = new Set<string>();

  async addToBlacklist(token: string): Promise<void> {
    this.blacklist.add(token);

    // Optionally, remove token after its expiration time
    const tokenTTL = 3600; // Example: 1 hour
    setTimeout(() => this.blacklist.delete(token), tokenTTL * 1000);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    return this.blacklist.has(token);
  }
}
