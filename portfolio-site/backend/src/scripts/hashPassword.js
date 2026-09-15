// Usage: npm run hash-password -- your_chosen_password
import bcrypt from "bcrypt";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run hash-password -- your_chosen_password");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
console.log("\nPassword hash (paste into admin_users.password_hash):\n");
console.log(hash);
console.log();
