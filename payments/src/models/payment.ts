import mongoose from "mongoose";

interface PaymentAttr {
    orderId: string;
    stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
    orderId: string;
    stripeId: string;

}
interface PaymentModel extends mongoose.Model<PaymentDoc> {

    build(attr: PaymentAttr): PaymentDoc

}

const PaymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id
        }
    }
});

PaymentSchema.statics.build = (attr: PaymentAttr) => {
    return new Payment(attr);
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', PaymentSchema);

export { Payment };