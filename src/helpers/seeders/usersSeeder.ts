import "reflect-metadata";



import fs from 'fs';
import path from 'path'
import { hasPass } from '@/helpers/bcryptHelper';
import { UserRepository } from '@/Application/repositories/userRepository';
import { User } from '@/Domain/entities/User';

// Function to read the JSON file
function readDummyData() {
  const filePath = path.join(__dirname, '../../../dummy-data/users.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Function to seed tasks into the database
async function seedTasks() {
  const users = readDummyData();
   const userRepository = new UserRepository();
  for (const user of users) {
    try {
      user.password = await hasPass(user.password, 4);
      await userRepository.create(new User(user.name, user.email, user.password, user.phoneNumber))// Adjust the method name based on your repository interface
      console.log(`Inserted user: ${user.name}`);
    } catch (err) {
      console.error(`Error inserting user: ${user.name}`, err);
    }
  }

  console.log('Seeding completed!');
}

// Run the seed function
seedTasks().then(() => {
  console.log('All tasks have been seeded.');
  process.exit(0);
}).catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
