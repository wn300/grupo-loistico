import { ValidationMessageForm } from 'src/app/shared/entity/validator-message-form';

export interface Client {
  id: string;
  name: string;
  identification: number;
  city: string;
  contact: string;
  phone: string;
  email: string;
}

export interface ClientValidatorForm {
  name: ValidationMessageForm[];
  identification: ValidationMessageForm[];
  city: ValidationMessageForm[];
  contact: ValidationMessageForm[];
  phone: ValidationMessageForm[];
  email: ValidationMessageForm[];
}
