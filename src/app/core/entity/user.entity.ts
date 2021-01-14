import { USER_ROL } from '../constants/user.constants';

export interface User {
  id: string;
  name: string;
  rol: USER_ROL;
  permissions: {
    [key: string]: string[];
  };
}
