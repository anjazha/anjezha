export const apiResponse = (
  data: {},
  message: string = "Request success",
  success: boolean = true
) => {
  return { success, message,  data };
};
