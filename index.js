function convertYAMLToJSON(yamlStr) {
  var jsonString = JSON.stringify(parseYAML(yamlStr), null, 2);
  return jsonString;
}
/**
 * Parses a simple YAML string and converts it to a JSON object.
 * Supports basic key-value pairs, lists, and scalar values.
 * @param {string} yamlStr - The YAML string to parse.
 * @returns {object} - Parsed JavaScript object (equivalent to JSON).
 */
function parseYAML(yamlStr) {
  const lines = yamlStr.split("\n"); // Split YAML string into lines
  const result = {};
  let currentIndent = 0; // Track the current indentation level
  let currentObj = result; // The current object being built

  const stack = []; // Stack to keep track of objects for nested structures
  let currentArray = null; // Track if we are in an array context

  for (let line of lines) {
    // Ignore empty lines and comments

    if (!line || line.startsWith("#")) continue;

    // Detect indentation level
    const indent = line.search(/\S/); // Find first non-whitespace character
    if (indent > currentIndent) {
      // Start of a nested structure (new object or array)
      stack.push({ object: currentObj, array: currentArray }); // Save state
      currentIndent = indent;
    } else if (indent < currentIndent) {
      // Exiting nested structure, go back to previous object in the stack
      while (indent < currentIndent && stack.length > 0) {
        const { object, array } = stack.pop();
        currentObj = object || currentObj;
        currentArray = array;
        currentIndent -= 2;
      }
    }

    // Remove leading indentation for actual processing
    line = line.trim();

    // Check if line is a list item (starts with '-')
    if (line.startsWith("- ")) {
      const value = parseValue(line.slice(2).trim()); // Parse the list item
      if (!Array.isArray(currentArray)) currentArray = []; // Initialize as array if needed
      currentArray.push(value); // Add the value to the array
      currentObj = currentArray; // Keep the current context as the array
    } else {
      // Parse key-value pair
      const [key, value] = line.split(":").map((part) => part.trim());

      // Check if the value should start a new array
      if (value === "") {
        currentArray = []; // Initialize a new array for the key
        currentObj[key] = currentArray;
      } else {
        currentObj[key] = parseValue(value); // Parse value and assign to object
        currentArray = null; // Reset array context after the key-value pair
      }
    }
  }

  return result;
}

/**
 * Parses a YAML value and converts it to its JavaScript equivalent.
 * Supports strings, numbers, booleans, and null.
 * @param {string} value - The YAML value to parse.
 * @returns {*} - Parsed value as a JavaScript type.
 */
function parseValue(value) {
  if (value === "") return {}; // Empty value can mean an object
  if (value === "null" || value === "~") return null; // Handle null values
  if (value === "true" || value === "false") return value === "true"; // Boolean values
  if (!isNaN(value)) return Number(value); // Numeric values
  return value; // Treat as string if none of the above
}

// Example Usage
const yamlString = `
name: John Doe
age: 30
skills:
  - JavaScript
  - YAML
  - JSON
isAdmin: false
emptyField: null
`;

const jsonObject = convertYAMLToJSON(yamlString);
console.log(jsonObject);
