import { EntityBase } from '@core/shared/domain/entity';
import { ValueObject } from '@core/shared/domain/value-object';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';

export class OrderItemId extends Uuid {}

export class OrderItem extends EntityBase {
  constructor(
    readonly order_item_id: OrderItemId,
    readonly name: string,
    readonly quantity: number,
    readonly unit_price_in_cents: number,
    readonly notes?: string,
  ) {
    super();
  }

  get subtotal_in_cents(): number {
    return this.quantity * this.unit_price_in_cents;
  }

  toJSON() {
    return {
      order_item_id: this.order_item_id.id,
      name: this.name,
      quantity: this.quantity,
      unit_price_in_cents: this.unit_price_in_cents,
      subtotal_in_cents: this.subtotal_in_cents,
      notes: this.notes,
    };
  }
  get entity_id(): ValueObject {
    return this.order_item_id;
  }
}
