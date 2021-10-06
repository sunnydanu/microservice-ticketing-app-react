import { PaymentCreatedEvent, Publisher, Subjects } from "@freakybug/ms-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}