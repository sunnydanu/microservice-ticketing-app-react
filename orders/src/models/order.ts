import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose'
import { OrderStatus } from '@freakybug/ms-common'
import { Ticket } from './ticket';

export { OrderStatus };


@modelOptions({
    schemaOptions: {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
                delete ret._id
            },
            versionKey: false
        }
    }
})

class Order {
    @prop({ required: true })
    public userId!: string;


    @prop({ enum: OrderStatus, type: String, default: [OrderStatus.Created] })
    public status!: OrderStatus[];


    @prop({ required: true })
    public expresAt!: Date;

    @prop({ required: true, ref: () => Ticket })
    public ticket!: Ref<Ticket>;


}


const OrderModel = getModelForClass(Order);


export { OrderModel, Order }