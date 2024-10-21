-- Create users table if not exists
CREATE TABLE if not exists "users" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "profile_picture" VARCHAR(255),
    "phone_number" VARCHAR(255),
    "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table if not exists
CREATE TABLE if not exists "roles" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "user_id" BIGINT,
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- Create categories table if not exists
CREATE TABLE if not exists "categories" (
    "id" BIGSERIAL PRIMARY KEY,
    "category" VARCHAR(255) NOT NULL,
    "image_url" VARCHAR(255) NULL,
    "description" VARCHAR(255) NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create subcategories table if not exists
CREATE TABLE if not exists "subcategories" (
    "id" BIGSERIAL PRIMARY KEY,
    "category_id" BIGINT NOT NULL,
    "subcategory" VARCHAR(255) NOT NULL,
    "image_url" VARCHAR(255) NULL,
    "description" VARCHAR(255) NULL,
    FOREIGN KEY ("category_id") REFERENCES "categories"("id")
);

-- Create taskers table if not exists
CREATE TABLE if not exists "taskers" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "bio" VARCHAR(255),
    "bidding" DECIMAL(8, 2),
    "pricing" DECIMAL(8, 2),
    "avg_rating" DECIMAL(3, 2),
    "longitude" DECIMAL(9, 3) NOT NULL,
    "latitude" DECIMAL(8, 3) NOT NULL,
    "category_id" BIGINT,
    FOREIGN KEY ("user_id") REFERENCES "users"("id"),
    FOREIGN KEY ("category_id") REFERENCES "categories"("id")
);

-- Create skills table if not exists
CREATE TABLE if not exists "skills" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL
);

-- Create tasker_skills table if not exists
CREATE TABLE if not exists "tasker_skills" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "skill_id" BIGINT NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users"("id"),
    FOREIGN KEY ("skill_id") REFERENCES "skills"("id")
);

-- Create tasker_locations table if not exists
CREATE TABLE if not exists "tasker_locations" (
    "id" BIGSERIAL PRIMARY KEY,
    "longitude" DECIMAL(9, 6) NOT NULL,
    "latitude" DECIMAL(8, 6) NOT NULL,
    "tasker_id" BIGINT NOT NULL,
    FOREIGN KEY ("tasker_id") REFERENCES "taskers"("id")
);

-- Create tasks table if not exists
CREATE TABLE if not exists "tasks" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "budget" DECIMAL(10, 2) NOT NULL,
    "longitude" DECIMAL(9, 6) NOT NULL,
    "latitude" DECIMAL(8, 6) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "category_id" BIGINT NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users"("id"),
    FOREIGN KEY ("category_id") REFERENCES "categories"("id")
);

-- Create task_skills table if not exists
CREATE TABLE if not exists "task_skills" (
    "id" BIGSERIAL PRIMARY KEY,
    "task_id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("task_id") REFERENCES "tasks"("id")
);

-- Create task_statuses table if not exists
CREATE TABLE if not exists "task_statuses" (
    "id" BIGSERIAL PRIMARY KEY,
    "task_id" BIGINT NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("task_id") REFERENCES "tasks"("id")
);

-- Create task_schedules table if not exists
CREATE TABLE if not exists "task_schedules" (
    "id" BIGSERIAL PRIMARY KEY,
    "task_id" BIGINT NOT NULL,
    "start_time" TIME WITHOUT TIME ZONE NOT NULL,
    "end_time" TIME WITHOUT TIME ZONE NOT NULL,
    "schedule_type" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("task_id") REFERENCES "tasks"("id")
);

-- Create task_attachments table if not exists
CREATE TABLE if not exists "task_attachments" (
    "id" BIGSERIAL PRIMARY KEY,
    "task_id" BIGINT NOT NULL,
    "file_type" VARCHAR(255) NOT NULL,
    "file_path" VARCHAR(255) NOT NULL,
    "file_size" FLOAT NOT NULL,
    FOREIGN KEY ("task_id") REFERENCES "tasks"("id")
);

-- Create tasker_assignments table if not exists
CREATE TABLE if not exists "tasker_assignments" (
    "id" BIGSERIAL PRIMARY KEY,
    "task_id" BIGINT NOT NULL,
    "tasker_id" BIGINT NOT NULL,
    "assigned_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("task_id") REFERENCES "tasks"("id"),
    FOREIGN KEY ("tasker_id") REFERENCES "taskers"("id")
);

-- Create reviews table if not exists
CREATE TABLE if not exists "reviews" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "tasker_id" BIGINT NOT NULL,
    "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    "review" TEXT NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users"("id"),
    FOREIGN KEY ("tasker_id") REFERENCES "taskers"("id")
);

-- Create password_recoveries table if not exists
CREATE TABLE if not exists "password_recoveries" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "recovery_code" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_at" TIMESTAMP WITHOUT TIME ZONE,
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- Create social_logins table if not exists
CREATE TABLE if not exists "social_logins" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "provider" VARCHAR(255) NOT NULL,
    "provider_user_id" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- Create email_confirmations table if not exists
CREATE TABLE if not exists "email_confirmations" (
    "id" BIGSERIAL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "confirmed_at" TIMESTAMP WITHOUT TIME ZONE,
    "expiration_time" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- Create notifications table if not exists
CREATE TABLE if not exists "notifications" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- Create conversations table if not exists
CREATE TABLE if not exists "conversations" (
    "id" BIGSERIAL PRIMARY KEY,
    "sender_id" BIGINT NOT NULL,
    "receiver_id" BIGINT NOT NULL,
    "update_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("sender_id") REFERENCES "users"("id"),
    FOREIGN KEY ("receiver_id") REFERENCES "users"("id")
);

-- Create messages table if not exists
-- CREATE TYPE if not exists message_status AS ENUM ('sent', 'delivered', 'read');

CREATE TABLE if not exists "messages" (
    "id" BIGSERIAL PRIMARY KEY,
    "sender_id" BIGINT NOT NULL,
    "conversation_id" BIGINT NOT NULL,
    "receiver_id" BIGINT NULL,
    "message" TEXT NOT NULL,
    "message_status" ENUM ('sent', 'delivered', 'read') DEFAULT 'sent',
    "is_read" BOOLEAN NOT NULL DEFAULT FALSE,
    "sent_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "change_status_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("sender_id") REFERENCES "users"("id"),
    FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id")
);

-- Create sessions table if not exists
CREATE TABLE if not exists "sessions" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
);
