import Ajv from "ajv";
import ajvErrors from "ajv-errors";

const ajv = new Ajv({ allErrors: true });

ajvErrors(ajv);

/* Fields */
const emailField = {
  type: "string",
  pattern: "[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,}",
  errorMessage: {
    type: "ُEmail must be of type String",
    pattern: "Invalid Email format",
  },
};

const passwordField = {
  type: "string",
  minLength: 6,
  errorMessage: {
    type: "Password must be of type String",
    minLength: "Password must be at least 6 characters",
  },
};

const fullNameField = {
  type: "string",
  minLength: 3,
  maxLength: 50,
  errorMessage: {
    type: "Full name must be of type String",
    minLength: "Full name must be at least 3 characters",
    maxLength: "Full name must be no more than 50 characters",
  },
};

const usernameField = {
  type: "string",
  minLength: 3,
  maxLength: 20,
  errorMessage: {
    type: "username must be of type String",
    minLength: "Username must be at least 3 characters",
    maxLength: "Username must be no more than 20 characters",
  },
};

/* Schemas */
const signupSchema = {
  type: "object",
  required: ["fullName", "username", "email", "password"],
  properties: {
    fullName: fullNameField,
    username: usernameField,
    email: emailField,
    password: passwordField,
    profilePic: {
      type: "object",
    },
  },
  errorMessage: {
    required: {
      fullname: "Full name is required.",
      username: "Username is required.",
      email: "Email is required.",
      password: "Password is required.",
    },
    _: "Invalid user data.", // fallback error message
  },
};

const loginSchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: emailField,
    password: passwordField,
  },
  errorMessage: {
    required: {
      fullname: "Full name is required.",
      username: "Username is required.",
      email: "Email is required.",
      password: "Password is required.",
    },
    _: "Invalid user data.", // fallback error message
  },
};

const updateProfileSchema = {
  type: "object",
  properties: {
    fullName: fullNameField,
    username: usernameField,
    email: emailField,
  },
  additionalProperties: false,
};

/* Validators */
const loginValidator = ajv.compile(loginSchema);

const signupValidator = ajv.compile(signupSchema);

const updateProfileValidator = ajv.compile(updateProfileSchema);

export { signupValidator, loginValidator, updateProfileValidator };
