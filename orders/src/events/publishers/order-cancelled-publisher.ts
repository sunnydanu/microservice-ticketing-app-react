import { Publisher, OrderCancelledEvent, Subjects } from "@freakybug/ms-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}