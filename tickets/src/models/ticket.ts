import { getClassForDocument, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
    schemaOptions: {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
            },
            versionKey: false
        }
    }
})

class Ticket {
    @prop({ required: true, type: () => String })
    public title!: string;

    @prop({ required: true, type: () => Number })
    public price!: number;

    @prop({ required: true, type: () => String })
    public userId!: string;
}

const TicketModel = getModelForClass(Ticket);


export { TicketModel, Ticket }