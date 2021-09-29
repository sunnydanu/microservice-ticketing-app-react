import { Subjects, Publisher, OrderCancelledEvent } from '@freakybug/ms-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
