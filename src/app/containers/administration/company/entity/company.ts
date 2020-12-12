import { ValidationMessageForm } from 'src/app/shared/entity/validator-message-form';

export interface Company {
  id: string;
  name: string;
  identification: number;
  type: string;
}

export interface CompanyValidatorForm {
  name: ValidationMessageForm[];
  identification: ValidationMessageForm[];
  type: ValidationMessageForm[];
}
