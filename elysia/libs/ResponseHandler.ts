export const CustomHttpSuccess = (data?: Record<string, any>) => {
  return Response.json({
    ...data,
    responseCode: 200,
    responseMessage: "Success",
  }, { status: 200 });
};

export const CustomHttpError = (message: string, code: number = 500) => {
  return Response.json({
    responseCode: code,
    responseMessage: message,
  }, { status: code });
};