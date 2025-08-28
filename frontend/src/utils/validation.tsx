import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup.string().min(8, "Minimum 8 characters").required("Password required"),
});

export const audienceSchema = yup.object({
  name: yup.string().required("Audience name required"),
  description: yup.string(),
});

export const campaignSchema = yup.object({
  name: yup.string().required("Campaign name required"),
  audienceId: yup.string().required("Audience selection is required"),
  templateId: yup.string().required("Template selection is required"),
});
