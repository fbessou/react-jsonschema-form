module.exports = {
  schema: {
    definitions: {
      Color: {
        title: "Color",
        type: "string",
        anyOf: [
          {
            type: "string",
            enum: ["#ff0000"],
            title: "Red",
          },
          {
            type: "string",
            enum: ["#00ff00"],
            title: "Green",
          },
          {
            type: "string",
            enum: ["#0000ff"],
            title: "Blue",
          },
          {
            type: "string",
            pattern: "^#[0-9A-Za-z]{6}$",
            title: "Custom",
          },
        ],
      },
    },
    title: "Image editor",
    type: "object",
    required: ["colorPalette", "brush", "blendMode"],
    properties: {
      colorPalette: {
        type: "array",
        items: {
          $ref: "#/definitions/Color",
        },
      },
      brush: {
        type: "string",
        title: "Brush",
        oneOf: [
          {
            title: "Pencil",
            enum: ["pencil_01"],
          },
          {
            title: "Marker",
            enum: ["marker"],
          },
        ],
      },
      blendMode: {
        title: "Blend mode",
        type: "string",
        enum: ["screen", "multiply", "overlay"],
      },
    },
  },
  uiSchema: {},
  formData: {},
};
