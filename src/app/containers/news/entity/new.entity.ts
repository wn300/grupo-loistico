import { TypeNew } from '../../administration/types-news/entity/type-new.entity';

export interface New {
  id: string;
  peopleId: string;
  identification: number;
  name: string;
  typeId: string;
  dateStart: Date;
  dateEnd: Date;
  observations?: string;
  type?: TypeNew;
}

export interface NewPayload {
  id?: string;
  peopleId: string;
  identification: number;
  name: string;
  typeId: string;
  dateStart: Date;
  dateEnd: Date;
  observations: string;
}
