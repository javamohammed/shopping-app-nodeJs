const Role = require('../models/Role')
const User = require('../models/User')

exports.createRoles =  async (req, res) => {
    const countRoles = await Role.countDocuments();
    if(countRoles === 0){
        const roles = ["ADMIN", "SELLER", "BUYER"]
        roles.forEach(roleItem => {
            let role = new Role({
                role: roleItem
            });
            role.save();
            //console.log('roleItem:::',roleItem)
        });
    }
}