import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import { ValueObject } from '@core/shared/domain/value-object';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { OrderItem, OrderItemId } from './order-item.entity';
import { OrderStatus } from './order.types';

export class OrderId extends Uuid {}

export type OrderAggregateProps = {
  order_id: OrderId;
  customer_id: Uuid;
  restaurant_id: Uuid;
  items: OrderItem[];
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
  delivery_address?: string;
  delivery_fee_in_cents?: number;
  discount_in_cents?: number;
  notes?: string;
};

export class OrderAggregate extends AggregateRoot {
  order_id: OrderId;
  customer_id: Uuid;
  restaurant_id: Uuid;
  items: OrderItem[];
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
  delivery_address?: string;
  delivery_fee_in_cents?: number;
  discount_in_cents?: number;
  notes?: string;

  constructor(props: OrderAggregateProps) {
    super();
    this.order_id = props.order_id;
    this.customer_id = props.customer_id;
    this.restaurant_id = props.restaurant_id;
    this.items = props.items;
    this.status = props.status;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.delivery_address = props.delivery_address;
    this.delivery_fee_in_cents = props.delivery_fee_in_cents;
    this.discount_in_cents = props.discount_in_cents;
    this.notes = props.notes;
  }

  static create(
    props: Omit<
      OrderAggregateProps,
      'order_id' | 'status' | 'created_at' | 'updated_at'
    >,
  ): OrderAggregate {
    const now = new Date();
    return new OrderAggregate({
      ...props,
      order_id: new OrderId(),
      status: OrderStatus.PENDING,
      created_at: now,
      updated_at: now,
    });
  }

  get itemsQuantity(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  get subtotal_in_cents(): number {
    return this.items.reduce(
      (total, item) => total + item.subtotal_in_cents,
      0,
    );
  }

  get total_in_cents(): number {
    const deliveryFee = this.delivery_fee_in_cents || 0;
    const discount = this.discount_in_cents || 0;
    return this.subtotal_in_cents + deliveryFee - discount;
  }

  updateStatus(status: OrderStatus): void {
    this.status = status;
    this.updated_at = new Date();
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
    this.updated_at = new Date();
  }

  removeItem(item_id: OrderItemId): void {
    this.items = this.items.filter(
      (item) => !item.order_item_id.equals(item_id),
    );
    this.updated_at = new Date();
  }

  applyDiscount(amount_in_cents: number): void {
    this.discount_in_cents = amount_in_cents;
    this.updated_at = new Date();
  }

  toJSON() {
    return {
      order_id: this.order_id.id,
      customer_id: this.customer_id.id,
      restaurant_id: this.restaurant_id.id,
      items: this.items.map((item) => item.toJSON()),
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
      delivery_address: this.delivery_address,
      delivery_fee_in_cents: this.delivery_fee_in_cents,
      discount_in_cents: this.discount_in_cents,
      notes: this.notes,
    };
  }
  get entity_id(): ValueObject {
    return this.order_id;
  }
}
