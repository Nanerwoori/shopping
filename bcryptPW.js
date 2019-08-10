const bcrypt = require("bcrypt");

const hashPassword = async (password, cb) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  cb(password, hashedPassword);
};

const comparePassword = async (password, hashedPW) => {
  bcrypt.compare(password, hashedPW, (err, isMatch) => {
    if (err) console.log(err);
    console.log("hashedPW : ", hashedPW);
    console.log("isMatch", isMatch);
  });
};

hashPassword("111111", comparePassword);
