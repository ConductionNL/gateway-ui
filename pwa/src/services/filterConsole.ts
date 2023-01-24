/**
 * Unfortunately, some packages send some errors or warnings that they do not fix and are unimportant.
 * To keep a clean development environment (not cluttered with redundant error messages in our console), this service exists.
 *
 * IMPORTANT NOTE: we should ALWAYS peer-review any and all additions to this file.
 */

export const filterConsole = () => {
  if (!console.error.toString().includes("shape-rendering")) {
    console.error();
  }
};
