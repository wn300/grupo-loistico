import { ValidationMessageForm } from 'src/app/shared/entity/validator-message-form';

export interface WorkCenterBasic {
  id: string;
  name: string;
  identification: number;
}

export interface WorkCenter extends WorkCenterBasic {
  city: string;
  contact: string;
  phone: string;
  email: string;
  code?: number;
  coordinator?: string;
  coordinatorIdentification?: number;
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
