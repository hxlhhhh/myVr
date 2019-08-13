
var mongoose = require('mongoose'),
    crypto = require('crypto'),
    validator = require('validator'),
    Schema = mongoose.Schema;

var validateUsername = function (username) {
    var usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
    return (
        this.provider !== 'local' ||
        (username && usernameRegex.test(username) && config.illegalUsernames.indexOf(username) < 0)
    );
};



var UserSchema = new Schema({
    userName:{
        type: String,
        unique: '用户名已经存在',
        required: '请输入用户名',
        validate: [validateUsername, 'Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.'],
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        default: '',
        trim: true,
    },
    salt:{
        type: String,
        default: '',
        trim: true,
    },
    phone:{
        type: String,
        default: '',
        trim: true,
    },
    creatDate:{
        type: Date,
        default: Date.now
    },
    sex:{
        type: String,
        default: '0'
    },
    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin']
        }],
        default: ['user'],
        required: 'Please provide at least one role'
    },
    departId:{
        type: Schema.Types.ObjectId,
        ref:'Depart',
    },
    userGroupId:{
        type: Schema.Types.ObjectId,
        ref:'UserGroup',
    }
});



/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};

UserSchema.pre('save', function (next) {
    console.log("在save之前");
    console.log(this.isModified('password'));
    if (this.password && this.isModified('password')) {
        console.log("aaa");
        console.log(this.password);
        this.salt = crypto.randomBytes(16).toString('base64');
        console.log(this.salt);
        this.password = this.hashPassword(this.password);
    }
    console.log(this)
    console.log("aaaaaaaaaaaaaa");
    next();
});

/**
 * Hook a pre validate method to test the local password
 */
/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
    } else {
        return password;
    }
};


module.exports = mongoose.model('User',UserSchema);
