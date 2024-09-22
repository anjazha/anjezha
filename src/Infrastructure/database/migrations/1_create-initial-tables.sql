CREATE TABLE "users" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "profile_picture" VARCHAR(255),
    "phone_number" VARCHAR(255),
    "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "roles" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE "user_roles" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users"("id"),
    FOREIGN KEY ("role_id") REFERENCES "roles"("id")
);

CREATE TABLE "categories" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL
);

CREATE TABLE "subcategories" (
    "id" BIGSERIAL PRIMARY KEY,
    "category_id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("category_id") REFERENCES "categories"("id")
);

CREATE TABLE "taskers" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "bio" VARCHAR(255),
    "bidding" DECIMAL(8, 2),
    "pricing" DECIMAL(8, 2),
    "avg_rating" DECIMAL(3, 2),
    "category_id" BIGINT,
    FOREIGN KEY ("user_id") REFERENCES "users"("id"),
    FOREIGN KEY ("category_id") REFERENCES "categories"("id")
);

CREATE TABLE "tasker_skills" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "tasker_id" BIGINT NOT NULL,
    FOREIGN KEY ("tasker_id") REFERENCES "taskers"("id")
);

CREATE TABLE "tasker_locations" (
    "id" BIGSERIAL PRIMARY KEY,
    "longitude" DECIMAL(9, 6) NOT NULL,
    "latitude" DECIMAL(8, 6) NOT NULL,
    "tasker_id" BIGINT NOT NULL,
    FOREIGN KEY ("tasker_id") REFERENCES "taskers"("id")
);

CREATE TABLE "tasks" (
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

CREATE TABLE "task_skills" (
    "id" BIGSERIAL PRIMARY KEY,
    "task_id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("task_id") REFERENCES "tasks"("id")
);

CREATE TABLE "task_statuses" (
    "id" BIGSERIAL PRIMARY KEY,
    "task_id" BIGINT NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("task_id") REFERENCES "tasks"("id")
);

CREATE TABLE "task_schedules" (
    "id" BIGSERIAL PRIMARY KEY,
    "task_id" BIGINT NOT NULL,
    "start_time" TIME WITHOUT TIME ZONE NOT NULL,
    "schedule_type" VARCHAR(255) NOT NULL,
    "end_time" TIME WITHOUT TIME ZONE NOT NULL,
    FOREIGN KEY ("task_id") REFERENCES "tasks"("id")
);

CREATE TABLE "task_attachments" (
    "id" BIGSERIAL PRIMARY KEY,
    "task_id" BIGINT NOT NULL,
    "file_type" VARCHAR(255) NOT NULL,
    "file_path" VARCHAR(255) NOT NULL,
    "file_size" FLOAT NOT NULL,
    FOREIGN KEY ("task_id") REFERENCES "tasks"("id")
);

CREATE TABLE "tasker_assignments" (
    "id" BIGSERIAL PRIMARY KEY,
    "task_id" BIGINT NOT NULL,
    "tasker_id" BIGINT NOT NULL,
    "assigned_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("task_id") REFERENCES "tasks"("id"),
    FOREIGN KEY ("tasker_id") REFERENCES "taskers"("id")
);

CREATE TABLE "tasker_reviews" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "tasker_id" BIGINT NOT NULL,
    "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    "review" TEXT NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users"("id"),
    FOREIGN KEY ("tasker_id") REFERENCES "taskers"("id")
);

CREATE TABLE "password_recoveries" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "recovery_code" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_at" TIMESTAMP WITHOUT TIME ZONE,
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

CREATE TABLE "social_logins" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "provider" VARCHAR(255) NOT NULL,
    "provider_user_id" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

CREATE TABLE "email_confirmations" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "confirmation_code" VARCHAR(255) NOT NULL,
    "confirmed_at" TIMESTAMP WITHOUT TIME ZONE,
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

CREATE TABLE "notifications" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

CREATE TABLE "messages" (
    "id" BIGSERIAL PRIMARY KEY,
    "sender_id" BIGINT NOT NULL,
    "receiver_id" BIGINT NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT FALSE,
    "sent_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("sender_id") REFERENCES "users"("id"),
    FOREIGN KEY ("receiver_id") REFERENCES "users"("id")
);

CREATE TABLE "sessions" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
);
