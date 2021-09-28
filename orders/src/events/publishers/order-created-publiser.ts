import { Publisher, OrderCreatedEvent, Subjects } from "@freakybug/ms-common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated =  Subjects.OrderCreated;
}