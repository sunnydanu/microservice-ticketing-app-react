import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@freakybug/ms-common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
