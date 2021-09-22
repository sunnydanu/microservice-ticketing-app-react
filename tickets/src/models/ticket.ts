import { getClassForDocument, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

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

    @prop({ required: true })
    public price!: number;

    @prop({ required: true })
    public userId!: string;
}

const TicketModel = getModelForClass(Ticket);


export { TicketModel, Ticket }