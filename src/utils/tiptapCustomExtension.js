import { Extension } from "@tiptap/core";

export const Indent = Extension.create({
  name: "indent",

  addOptions() {
    return {
      types: ["heading", "paragraph"],
      defaultIndent: "0%"
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: this.options.defaultIndent,
            parseHTML: (element) =>
              element.style.marginLeft || this.options.defaultIndent,
            renderHTML: (attributes) => {
              if (attributes.indent === this.options.defaultIndent) {
                return {};
              }

              return {
                style: `margin-left: ${attributes.indent}`
              };
            }
          }
        }
      }
    ];
  },

  addCommands() {
    return {
      setIndentation:
        (indentValue) =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { indent: indentValue })
          );
        }
    };
  }
});

export const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["heading", "paragraph"],
      defaultFontSize: "16px"
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: this.options.fontSize,
            parseHTML: (element) =>
              element.style.fontSize || this.options.fontSize || "",
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}`
              };
            }
          }
        }
      }
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { fontSize })
          );
        }
    };
  }
});
