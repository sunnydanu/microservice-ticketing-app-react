import { prop, getModelForClass, pre, modelOptions } from '@typegoose/typegoose';
import { Password } from '../services/password';

@pre<User>('save', async function () {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
})
@modelOptions({
    schemaOptions: {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
                delete ret.id;
                delete ret.password;
            },
            versionKey: false
        }
    }
})


class User {

    @prop({ required: true })
    public email?: string;

    @prop({ required: true })
    public password?: string;
}


const UserModel = getModelForClass(User); // UserModel is a regular Mongoose Model with correct types




export { UserModel }