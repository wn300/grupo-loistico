export interface OperationCenterDataBase {
  code: number;
  workCenterCode: number;
}

export interface DataBase {
  people: number[];
  operationCenters: OperationCenterDataBase[];
}
