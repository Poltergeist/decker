const heroSchema = {
  description: "describes a simple hero",
  properties: {
    color: {
      type: "string"
    },
    name: {
      primary: true,
      type: "string"
    }
  },
  required: ["color"],
  title: "hero schema",
  type: "object",
  version: 0
};

export default heroSchema;
