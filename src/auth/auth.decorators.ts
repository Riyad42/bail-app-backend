import { SetMetadata } from '@nestjs/common';

export const Role = (role: string) => SetMetadata('role', role);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

