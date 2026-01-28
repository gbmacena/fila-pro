import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserNotAuthenticatedException } from '../exceptions/custom.exceptions';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = request.user?.userId;

    if (!userId) {
      throw new UserNotAuthenticatedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return userId;
  },
);
