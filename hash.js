const bcrypt = require("bcrypt");

async function run() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("1234", 10);

  console.log(salt);
  console.log(hashedPassword);
}

run();

// $2b$10$SUTkOdy./L7iyPidVkFyju/j9kUOzah4rP0dRIIb6Uaf2lXun/p9K
// $2b$10$ykIVSEUn8kwWWB05qgSoae9MU/pZM0JuSMdxLA.PR6Y29A.qudKA6