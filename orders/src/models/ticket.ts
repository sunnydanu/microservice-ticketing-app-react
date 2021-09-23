import { DocumentType, getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types';
import { OrderModel, OrderStatus } from './order';

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

class Ticket {
    @prop({ required: true })
    public title!: string;

    @prop({ required: true, min: 0 })
    public price!: number;

    @prop({ required: true })
    public userId!: string;

    // the "this" definition is required to have the correct types

    // the "this" definition is required to have the correct types
    public static async isReserved(this: ReturnModelType<typeof Ticket>) {
        const exisitingOrder = await OrderModel.findOne({
            ticket: new this,
            status: {
                $in: [
                    OrderStatus.AwaitingPayment,
                    OrderStatus.Created,
                    OrderStatus.Cancelled

                ],
            }

        });

        return !!exisitingOrder;

    }



}

const TicketModel = getModelForClass(Ticket);


export { TicketModel, Ticket }