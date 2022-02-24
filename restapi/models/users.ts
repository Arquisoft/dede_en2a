import mongoose, {Schema, model} from "mongoose";

interface User extends mongoose.Document {
    name: string;
    email: string
}

const UserSchema = new Schema({
    name: String, 
    email: String
})

export default model<User>('User', UserSchema);