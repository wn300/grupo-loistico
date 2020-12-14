import * as moment from 'moment';
import { DataBase } from '../entities/form-base.entity';

import { ProgrammingTemplate } from '../entities/programming.entity';

export const programmingTemplateMapper = (
  data: any,
  dataBase?: DataBase
): ProgrammingTemplate[] => {
  if (Array.isArray(data)) {
    const newData = [];
    for (let i = 1; i < data.length; i++) {
      const item = data[i];
      const validate = validateProgrammingTemp(item, dataBase);
      const newItem: ProgrammingTemplate = {
        index: i + 1,
        identification: parseInt(item[0], 10),
        name: item[1],
        transport: String(item[2]).toLowerCase() === 'si',
        date: item[3],
        time: item[4],
        workplaceCode: parseInt(item[5], 10),
        workplaceName: item[6],
        operationCode: parseInt(item[7], 10),
        operationName: item[8],
        applicantIdentification: parseInt(item[9], 10),
        applicantName: item[10],
        observation: item[11],
        isValid: validate.valid,
        errorValues: validate.errors,
      };
      newData.push(newItem);
    }
    return newData;
  }
  return [];
};

export const validateProgrammingTemp = (
  data: any[],
  dataBase?: DataBase
): {
  valid: boolean;
  errors: number[];
} => {
  let valid = true;
  let errors = [];
  const date = moment(`${data[3]} ${data[4]}`, 'DD/MM/YYYY HH:mm');

  if (
    !dataBase ||
    isNaN(data[0]) ||
    dataBase.people.indexOf(parseInt(data[0])) < 0
  ) {
    valid = false;
    errors.push(0);
  }
  if (
    !(
      String(data[2]).toLowerCase() === 'si' ||
      String(data[2]).toLowerCase() === 'no'
    )
  ) {
    valid = false;
    errors.push(2);
  }
  if (!date.isValid() || date.toDate() < new Date()) {
    valid = false;
    errors.push(3);
  }
  if (
    !dataBase ||
    isNaN(data[5]) ||
    dataBase.workCenters.indexOf(parseInt(data[5])) < 0
  ) {
    valid = false;
    errors.push(5);
  }
  if (isNaN(data[7])) {
    valid = false;
    errors.push(7);
  }
  if (isNaN(data[9])) {
    valid = false;
    errors.push(9);
  }

  return {
    valid: valid,
    errors: errors,
  };
};
