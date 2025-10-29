import { UUID } from 'crypto';

export interface IJwtPayload {
  sub: number;
  email: string;
  jti: UUID;
  sessionId: string;
}
