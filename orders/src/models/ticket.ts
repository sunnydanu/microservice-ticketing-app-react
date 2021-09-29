
import { DocumentType, getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types';
import { OrderModel, OrderStatus } from './order';

interface TicketAttr {

    id: string;
    title: string;
    price: number;
}

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
    @prop()
    public id!: string;

    @prop({ required: true })
    public title!: string;

    @prop({ required: true, min: 0 })
    public price!: number;

    @prop({ required: true })
    public userId!: string;

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


    public static async build(this: ReturnModelType<typeof Ticket>, attrs: TicketAttr) {

        try {
            return this.create({ _id: attrs.id, title: attrs.title, price: attrs.price });
        } catch (err) {
            return null;
        }

    }


}

const TicketModel = getModelForClass(Ticket);


export { TicketModel, Ticket }