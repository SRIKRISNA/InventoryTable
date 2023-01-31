const mongoose = require('mongoose');

const custSchema = new mongoose.Schema({
    customer_id: String,
    customer_name : String,
    email:{
        type:String,
        required:true,
        unique:true
    }
})
const customerM = mongoose.model('customer', custSchema);
module.exports = customerM;