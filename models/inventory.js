const mongoose = require('mongoose');

const invenSchema = new mongoose.Schema({
    inventory_id: String,
    inventory_type:String,
    item_name : String,
    Avl_quantity: String
})
const inventoryM = mongoose.model('inventory', invenSchema);
module.exports = inventoryM;