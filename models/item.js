const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    itemName: {type: String, required: [true, 'Item name is required'], minLength: [1, 'Must be non-empty']},
    itemCategory: {type: String, required: [true, 'Category is required'],minLength: [1, 'Must be non-empty']},
    detail: {type:String, required: [true, 'Detail is required'],
        minLength: [10, 'The detail should have at least 10 characters']},
    itemCondition: {type: String, required: [true, 'Condition is required'], enum: ['New', 'Like New', 'Used']},
    imageURL: {type: String, required: [true, 'Image Url is required'], },
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
})

// Collection name is "items"
module.exports = mongoose.model('Item', itemSchema);
