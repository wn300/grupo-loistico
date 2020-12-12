import { ValidationMessageForm } from 'src/app/shared/entity/validator-message-form';

export interface People {
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  identification: number;
  dateAdmission: Date;
  company: string;
  phone: string;
  memberShip: string;
  email: string;
  address: string;
  position: string;
  status: string;
  manager: string;
  city: string;
  dayOfRest: string;
}

export interface PeopleValidatorForm {
  firstName: ValidationMessageForm[];
  secondName: ValidationMessageForm[];
  firstLastName: ValidationMessageForm[];
  secondLastName: ValidationMessageForm[];
  identification: ValidationMessageForm[];
  dateAdmission: ValidationMessageForm[];
  company: ValidationMessageForm[];
  phone: ValidationMessageForm[];
  memberShip: ValidationMessageForm[];
  email: ValidationMessageForm[];
  address: ValidationMessageForm[];
  position: ValidationMessageForm[];
  status: ValidationMessageForm[];
  manager: ValidationMessageForm[];
}
