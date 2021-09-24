import { DocumentType, getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'

import { OrderModel, OrderStatus } from './order';

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

class Ticket {
    @prop({ required: true })
    public title!: string;

    @prop({ required: true, min: 0 })
    public price!: number;



    // the "this" definition is required to have the correct types

    public async isReserved(this: DocumentType<Ticket>): Promise<boolean> {
        const exisitingOrder = await OrderModel.findOne({
            ticket: this,
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