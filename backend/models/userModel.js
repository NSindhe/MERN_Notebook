const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      // just in case we need
      type: Boolean,
      required: true,
      default: false,
    },
    pic: {
      type: String,
      requireed: true,
      default: "/images/user.png",
    },
  },
  {
    timestamps: true,
  }
);

// encrypt password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  // const myPlaintextPassword = "password";
  // // const salt = await bcrypt.salt(10);
  // bcrypt.genSalt(10, function (err, salt) {
  //   bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
  //     // Store hash in your password DB.
  //     console.log("!!! ", hash, "!!Hash");
  //     this.password = hash;
  //     console.log("!!! ", this.password, "!!Hash");
  //   });
  // });
  // this.password = await bcrypt.hash(this.password, salt);

  let user = this;

  const saltRounds = 10;

  const hashed_password = await hashPassword(user.password, saltRounds);

  user.password = hashed_password;
});

const hashPassword = async function (password, saltRounds) {
  try {
    let newHash = await bcrypt.hash(password, saltRounds);

    return newHash;
  } catch (err) {
    // error handling here
  }
};

//decrypt password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
