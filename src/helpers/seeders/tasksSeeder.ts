import "reflect-metadata"

import fs from "fs";
import path from "path";

import { TaskRepository } from "@/Application/repositories/taskRepository";
import { Task } from "@/Domain/entities/Task";

// Function to read the JSON file
function readDummyData() {
  const filePath = path.join(__dirname, "../../../dummy-data/tasks.json");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Function to seed tasks into the database
async function seedTasks() {
  const tasks = readDummyData();
  const taskRepository = new TaskRepository();
  for (const task of tasks) {
    try {
      await taskRepository.createTask(
        new Task(
          task.user_id,
          task.title,
          task.description,
          task.date,
          task.budget,
          task.location,
          task.address,
          task.status,
          task.category_id,
          task.schedule,
          [],
          task.skills
        )
      ); // Adjust the method name based on your repository interface
      console.log(`Inserted task: ${task.title}`);
    } catch (err) {
      console.error(`Error inserting task: ${task.title}`, err);
    }
  }

  console.log("Seeding completed!");
}

// Run the seed function
seedTasks()
  .then(() => {
    console.log("All tasks have been seeded.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
