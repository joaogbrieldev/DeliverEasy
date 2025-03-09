import { ValueObject } from './value-object';

export abstract class EntityBase {
  created_at: Date;
  updated_at: Date;
  abstract get entity_id(): ValueObject;
  abstract toJSON(): any;
}
