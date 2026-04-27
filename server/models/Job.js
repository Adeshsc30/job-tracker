const mongoose = require('mongoose')
const jobSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    company:{
        type : String,
        required : true,
    },
    role:{
        type : String,
        required : true,
    },
    status:{
        type : String,
        enum : ['Applied', 'Interviewing', 'Offered', 'Rejected'],
        default : 'Applied',
    },
    jobLink:{
        type : String,
        default : '',
    },
    notes:{
        type : String,
        default : '',
    },
    appliedDate:{
        type : Date,
        default : Date.now,
    },
    },{
        timestamps : true,
    }
)

const Job = mongoose.model('Job', jobSchema)

module.exports = Job    