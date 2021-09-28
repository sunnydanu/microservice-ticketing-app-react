import { getModelForClass, modelOptions, mongoose, prop, Ref } from '@typegoose/typegoose'
import { OrderStatus } from '@freakybug/ms-common'
import { Ticket } from './ticket';

export { OrderStatus };

@modelOptions({
    schemaOptions: {
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                ret.id = ret._id
                delete ret._id;

            },
            versionKey: false
        },
        toObject: { virtuals: true }

    }
})

class Order {
    @prop()
    public id!: string;

    @prop({ required: true })
    public userId!: string;

    @prop({ enum: Object.values(OrderStatus), type: String, default: OrderStatus.Created })
    public status!: string;


    @prop({ required: true })
    public expiresAt!: Date;

    @prop({ required: true, ref: () => Ticket })
    public ticket: Ref<Ticket>;


}


const OrderModel = getModelForClass(Order);


export { OrderModel, Order }