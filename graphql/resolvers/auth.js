
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
    createUser: args => {   
        return User.findOne({email: args.userInput.email}).then(user => {
            if (user) {
                throw new Error('User already exists.')
            }
            return bcrypt.hash(args.userInput.password,12)
        })
        .then( hashedPassword =>{
            const user = new User({
                email:args.userInput.email,
                password: hashedPassword

            })
            return user.save();
                
            
        }).then(result => {
            return { ...result._doc,password:null,_id: result.id}
        }).catch(err => {
            throw err;
        })
        
    }
    ,

    login : async ({email,password}) => {
        const user = await User.findOne({email: email});
        if(!user){
            throw new Error ("User doesn't exist")
       
        }
        const isEqual= await bcrypt.compare(password,user.password)
        if(!isEqual){
            throw new Error("Password is incorrect!");

        }
        const token = jwt.sign({userId: user.id,email: user.email},'somesupersecretkey',{
            expiresIn: '1h'
        });
            return { userId: user.id,token:token, tokenExpiration: 1};

            


    }
  

} 