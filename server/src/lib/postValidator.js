import Ajv from "ajv";
import ajvErrors from "ajv-errors";

const ajv = new Ajv({ allErrors: true });

ajvErrors(ajv);

const postSchema = {
  type: "object",
  anyOf: [{ required: ["content"] }, { required: ["postImage"] }],
  properties: {
    title: {
      type: "string",
      errorMessage: {
        type: "Post title must be of type string",
      },
    },
    content: {
      type: "string",
      maxLength: 300,
      errorMessage: {
        type: "Post content must be of type string",
        maxLength: "Post content must have at most 300 characters",
      },
    },
    postImage: {
      type: "object",
    },
  },
  errorMessage: {
    _: "Invalid post data.", // fallback error message
  },
};

const postValidator = ajv.compile(postSchema);

export default postValidator;
