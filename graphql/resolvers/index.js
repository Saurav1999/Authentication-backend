const Event = require('../../models/event')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const events = eventIds => {
    return Event.find({_id: {$in: eventIds}}).then( events => {
        return events.map(event => {
            return { ...event._doc,_id:event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this,event.creator)
            }
        })
    })
    .catch(err =>{
        throw err;
    })
} 

// const events = async eventIds => {
//     try{
//     const events = await Event.find({_id: {$in: eventIds}})
//     events.map(event => {
//             return { ...event._doc,_id:event.id,
//                 date: new Date(event._doc.date).toISOString(),
//                 creator: user.bind(this,event.creator)
//             }
//         })
//         return events;
    
//     } catch (err) {
//         throw err;

//     }
   
// }


const user = userID => {
    return User.findById(userID).then(user => {
        return { ...user._doc,_id:user.id, createdEvents: events.bind(this,user._doc.createdEvents)}
    })
    .catch( err =>{
        throw err;
    });
};
module.exports = {
    events: () => {
        //return events;
        return Event.find().then(events => { //creator only had userID but .populate got rest from User mode;
            return events.map(event => {
                
                // console.log(event)
                //return { ...event._doc,_id: event._doc._id.toString()}
                return { ...event._doc,_id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this,event._doc.creator)
                    //creator: user(event._doc.creator)

                }

            })
        }).catch(err => {
            throw err;
        })
    },
    createEvent: (args) => {
       //console.log(args)
        // const event={
        //     _id: Math.random().toString(),
        //     title: args.eventInput.title,
        //     description:args.eventInput.description,
        //     price: +args.eventInput.price,
        //     date: new Date().toISOString()
        // };
        const event = new Event ({
            title: args.eventInput.title,
            description:args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date ),
            creator: '5e5f8e79170bc92780756e95'
        });
        let createdEvent;
        return event.save().then(result => {
            createdEvent = { ...result._doc, _id:result.id,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this,result._doc.creator)}; 
            return User.findById('5e5f8e79170bc92780756e95')
            //console.log(result)
            
        })
        .then(user => {
            if(!user) {
                throw new Error('User not found')
            }
            user.createdEvents.push(event)
            return user.save()
        })
        .then(result => {
            return createdEvent

        })
        .catch(err => {
            console.log(err);
            throw err;
        });
        
        
    },
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

} 