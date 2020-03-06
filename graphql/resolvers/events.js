
const Event = require('../../models/event')
const {transformEvent} = require('./merge')
const User = require('../../models/user')


module.exports = {
    events: () => {
        //return events;
        return Event.find().then(events => { //creator only had userID but .populate got rest from User mode;
            return events.map(event => {
                
                // console.log(event)
                //return { ...event._doc,_id: event._doc._id.toString()}
                return transformEvent(event)

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
            createdEvent = transformEvent(result); 
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
    

  
   

} 