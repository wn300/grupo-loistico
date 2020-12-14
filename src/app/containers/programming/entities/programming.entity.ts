export interface Programming {
  identification: number;
  transport: boolean;
  date: Date | string;
  workplaceCode: number;
  applicantIdentification: number;
  observation: string;
}

export interface ProgrammingTemplate extends Programming {
  index: number;
  name: string;
  time: string;
  workplaceName: string;
  operationCode: number;
  operationName: string;
  applicantName: string;
  isValid: boolean;
  errorValues: number[];
}
