const asyncHandler = require('express-async-handler');
const ScheduledEmail = require('../models/emailSchedulerModel');
const create = asyncHandler( async(req, res) => {
    //console.log(req.body);
    try {
        const { recipient, subject, body } = req.body;
        if(!recipient || !subject || !body){
            res.status(400);
            throw new Error("All fields are require!");
        }
    
        const email = new ScheduledEmail({ recipient, subject, body });
        await email.save();
        res.status(201).json({ message: 'Email scheduled successfully', data:email});
      } catch (err) {
        //console.error(err);
        res.status(500).json({ message: 'Error scheduling email' });
      }
    
})

// Read
const read =  asyncHandler(async (req, res) => {
    try {
      const email = await ScheduledEmail.findById(req.params.id);
      if (!email) {
        return res.status(404).json({ message: 'Email not found' });
      }
      res.status(200).json({ message: "Data read Successfully", data: email });
    } catch (err) {
    //  console.error(err);
      res.status(500).json({ message: 'Error retrieving email' });
    }
});
  
// List
const list = asyncHandler(async (req, res) => {
    try {
      const emails = await ScheduledEmail.find();
      res.status(200).json({message: "Listed Successfully",data:emails});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error listing emails' });
    }
  });

// Update
const update = asyncHandler(async (req, res) => {
    try {
        const { recipient, subject, body } = req.body;
        if (!recipient || !subject || !body) {
            res.status(400);
            throw new Error("All fields are require!");
        }
        const updatedEmail = await ScheduledEmail.findByIdAndUpdate(
            req.params.id,
            { $set: { recipient, subject, body } },
            { new: true } // Return updated document
        );
        if (!updatedEmail) {
            return res.status(404).json({ message: 'Email not found' });
        }
        //rescheduleEmail(updatedEmail); // Reschedule if scheduledAt changed
      res.status(200).json({ message: 'Email Updated', data: updatedEmail });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error update emails' });
        
    }
});    

// delete
const remove = asyncHandler(async (req, res) => {
    try {
        const removeEmail = await ScheduledEmail.findByIdAndDelete(req.params.id);
        if (!removeEmail) {
            return res.status(404).json({ message: 'Email not Deleted' });
        }
        //rescheduleEmail(updatedEmail); // Reschedule if scheduledAt changed
        res.status(200).json({message: 'Error update emails', data:removeEmail });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error update emails' });
        
    }
});

//unSendList
const unSendList =  asyncHandler(async (req, res) => {
    try {
        const email = await ScheduledEmail.find({ status:req.query.status });
      if (!email) {
        return res.status(404).json({ message: 'Email not found' });
      }
      res.status(200).json(email);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving email' });
    }
});
module.exports = {
    create,
    read,
    list,
    update,
    remove,
    unSendList,
}