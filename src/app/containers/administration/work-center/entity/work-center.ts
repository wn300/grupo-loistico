import { ValidationMessageForm } from 'src/app/shared/entity/validator-message-form';

export interface WorkCenter {
  id: string;
  name: string;
  identification: number;
  city: string;
  contact: string;
  phone: string;
  email: string;
}

export interface WorkCenterValidatorForm {
  name: ValidationMessageForm[];
  identification: ValidationMessageForm[];
  city: ValidationMessageForm[];
  operationCode: ValidationMessageForm[];
  operation: ValidationMessageForm[];
  address: ValidationMessageForm[];
  latitude: ValidationMessageForm[];
  longitude: ValidationMessageForm[];
  client: ValidationMessageForm[];
  coordinator: ValidationMessageForm[];
  coordinatorIdentification: ValidationMessageForm[];
  phone: ValidationMessageForm[];
}
