export interface Programming {
  identification: number;
  transport: boolean;
  date: Date | string;
  operationCode: number;
  applicantIdentification: number;
  observation: string;
  name?: string;
  workplaceCode?: number;
  workplaceName?: string;
  operationName?: string;
  applicantName?: string;
}

export interface ProgrammingTemplate extends Programming {
  index: number;
  time: string;
  isValid: boolean;
  errorValues: number[];
}
