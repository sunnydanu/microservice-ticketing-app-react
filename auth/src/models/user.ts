import { prop,getModelForClass, getClass } from '@typegoose/typegoose';
 

class User {

    @prop({ required: true })
    public email?: string;

    @prop({ required: true })
    public password?: string;

}
const UserModel = getModelForClass(User); // UserModel is a regular Mongoose Model with correct types
  
UserModel.create();

export { UserModel }