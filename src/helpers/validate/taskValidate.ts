import validationMiddleware from "@/Presentation/middlewares/validation.middleware";
import { body } from "express-validator";

export const createTaskValidations = [
  body("title")
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage("Title must be a string between 1 and 255 characters"),

  body("description").isString().withMessage("Description must be a string"),

  body("date").isISO8601().withMessage("Date must be a valid ISO8601 date"),

  body("budget")
    .isDecimal({ decimal_digits: "2" })
    .withMessage("Budget must be a decimal with two decimal places"),

  body("location.longitude")
  .isFloat({ min: -180, max: 180 })
  .withMessage('Longitude must be between -180 and 180 degrees')
  .toFloat(),

  body("location.latitude")
  .isFloat({ min: -90, max: 90 })
  .withMessage('Latitude must be between -90 and 90 degrees')
  .toFloat(),

  body("address")
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage("Address must be a string between 1 and 255 characters"),

  body("category_id")
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),

  body("skills")
    .isArray()
    .withMessage("Skills must be an array")
    .custom((skills) => {
      if (skills.some((skill) => typeof skill !== "string")) {
        throw new Error("Each skill must be a string");
      }
      return true;
    }),

  body("status")
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage("Status must be a string between 1 and 255 characters"),

  body("schedule.start_time")
    .isString()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage("Start time must be a valid time in the format HH:MM:SS"),

  body("schedule.schedule_type")
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage("Schedule type must be a string between 1 and 255 characters"),

  body("schedule.end_time")
    .isString()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage("End time must be a valid time in the format HH:MM:SS"),

//   body("attachments")
//     .isArray()
//     .withMessage("Attachments must be an array")
//     .custom((attachments) => {
//       if (
//         attachments.some(
//           (att) => !att.file_type || !att.file_path || !att.file_size
//         )
//       ) {
//         throw new Error(
//           "Each attachment must have file_type, file_path, and file_size"
//         );
//       }
//       return true;
//     }),

  validationMiddleware,
];
