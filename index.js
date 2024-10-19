/**
 * Converts a valid YAML string into JSON string format. To convert multiple YAML documents into JSON,
 * separate the string by '---'.
 * For eg.,
 * 
 * ```
  ---
  title: "Program",
  languages:
    - JavaScript
    - TypeScript
  ---
  title: "Testing",
  tools:
    - JUnit
    - JMeter
```
 * @param {string} yamlStr - A Valid YAML string: contents of the .yaml file
 * @returns {string[]} - JSON string
 */
function convertYAMLToJSON(yamlStr) {
  if (yamlStr === undefined)
    throw Error("Missing required argument: yamlString");
  var jsonString = JSON.stringify(parseYAML(yamlStr), null, 2);
  return jsonString;
}
/**
 * Parses a simple YAML string and converts it to a JSON object.
 * Supports basic key-value pairs, lists, objects and scalar values.
 * @param {string} yamlStr - The YAML string to parse.
 * @returns {object} - Parsed JavaScript object (equivalent to JSON).
 */
function parseYAML(yamlStr) {
  const lines = yamlStr.split("\n"); // Split YAML string into lines
  let result = {};
  let currentIndent = 0; // Track the current indentation level
  let currentObj = result; // The current object being built

  let stack = []; // Stack to keep track of objects for nested structures
  let currentArray = null; // Track if we are in an array context
  let currentKey = null;
  let startFound = false;

  const resultList = [];

  for (let line of lines) {
    // Ignore empty lines and comments
    if (!line || line.startsWith("#")) continue;
    // Checking if the string has document start marker
    else if (line.trim() === "---") {
      startFound = true;
      // Pushing the result after every round
      if (Object.keys(result).length !== 0) resultList.push(result);

      result = {};
      currentIndent = 0; // Track the current indentation level
      currentObj = result; // The current object being built
      stack = []; // Stack to keep track of objects for nested structures
      currentArray = null; // Track if we are in an array context
      currentKey = null;

      continue;
    }

    if (startFound) {
      // Detect indentation level
      const indent = line.search(/\S/); // Find first non-whitespace character
      if (indent > currentIndent) {
        // Start of a nested structure (new object or array)
        //   stack.push({ object: currentObj, array: currentArray }); // Save state
        currentIndent = indent;
      } else if (indent < currentIndent) {
        // Exiting nested structure, go back to previous object in the stack
        while (indent < currentIndent && stack.length > 0) {
          const { object, array } = stack.pop();
          currentObj = object || currentObj; // resetting the current object to previous object
          if (currentArray != null) currentObj[currentKey] = currentArray;
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

        // Check if the value should start a new array/object
        if (value === "") {
          currentObj[key] = {};
          currentKey = key;
          stack.push({ object: currentObj, array: currentArray });
          currentObj = currentObj[key];
        } else {
          currentObj[key] = parseValue(value); // Parse value and assign to object
          currentArray = null; // Reset array context after the key-value pair
        }
      }
    } else {
      throw new Error(
        "Invalid YAML string: Missing '---' document start marker"
      );
    }
  }
  // Pushing the result after the last round
  resultList.push(result);
  return resultList;
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

/**
 *
 * @param {*} ffString - A delimiter-separated flat file string: contents of the flat file
 * @param {*} dataSeparator - A valid data separator(delimiter) such as ',', ';', and '#'
 * @returns {string} - JSON string
 */
function convertFlatFileToJSON(ffString, dataSeparator) {
  if (ffString === undefined)
    throw Error("Missing required argument(s): ffString");
  else if (dataSeparator === undefined)
    throw Error("Missing required argument(s): dataSeparator");
  const jsonString = JSON.stringify(
    parseFlatFile(ffString, dataSeparator),
    null,
    2
  );
  return jsonString;
}

/**
 *
 * @param {*} ffString - A delimiter-separated flat file string
 * @param {*} dataSeparator - A valid data separator(delimiter) such as ',', ';', and '#'
 * @returns {object} - Parsed JavaScript object (equivalent to JSON).
 */
function parseFlatFile(ffString, dataSeparator) {
  const lines = ffString.split("\n");

  const result = [];
  let keyList = [];
  let keyLine = 0;

  for (let line of lines) {
    line = line.trim();

    if (!line) continue;

    if (keyLine == 0) {
      keyList = line.split(dataSeparator);
      keyLine += 1;
    } else {
      let objLine = line.split(dataSeparator);
      if (objLine.length === keyList.length) {
        let currentObj = {};
        for (let index = 0; index < keyList.length; index++) {
          const key = keyList[index].trim();
          const value = objLine[index].trim();
          currentObj[key] = value;
        }
        result.push(currentObj);
      } else {
        throw Error(
          "Invalid Flat file data: Data mismatch with the header on the line:." +
            line
        );
      }
    }
  }
  return result;
}

/**
 *
 * @param {*} jsonString - A valid JSON string ideally with no nested values
 * @param {*} lineSeparator - A line separator representing Windows new line character: '\r\n' or Linux
 * new line character: '\n'
 * @param {*} dataSeparator - A valid data separator(delimiter) such as ',', ';', and '#'
 * @returns {string} - A delimiter-separated flat file string
 */
function convertJSONToFlatFile(jsonString, lineSeparator, dataSeparator) {
  if (jsonString === undefined)
    throw Error("Missing required argument(s): jsonString");
  else if (lineSeparator === undefined)
    throw Error("Missing required argument(s): lineSeparator");
  else if (dataSeparator === undefined)
    throw Error("Missing required argument(s): dataSeparator");
  const ffString = parseJSONForFlatFile(
    jsonString,
    lineSeparator,
    dataSeparator
  );
  return ffString;
}

/**
 *
 * @param {*} jsonString - A valid JSON string with no nested structure
 * @param {*} lineSeparator - A line separator representing Windows new line character: '\r\n' or Linux
 * new line character: '\n'
 * @param {*} dataSeparator - A valid data separator(delimiter) such as ',', ';', and '#'
 * @returns {string} - A delimiter-separated flat file string
 */
function parseJSONForFlatFile(jsonString, lineSeparator, dataSeparator) {
  let result = "";
  try {
    let jsonObjArray = JSON.parse(jsonString);
    for (let index = 0; index < jsonObjArray.length; index++) {
      const jsonObj = jsonObjArray[index];
      if (index === 0) {
        result += Object.keys(jsonObj).join(dataSeparator) + lineSeparator;
      }
      result += Object.values(jsonObj).join(dataSeparator) + lineSeparator;
    }
    return result;
  } catch (error) {
    throw error;
  }
}
// Enclosed by "" CSV

/**
 *
 * @param {*} iniString - A valid INI string: contents of the .ini file
 * @returns {string} - JSON string
 */
function convertINIToJSON(iniString) {
  if (iniString === undefined)
    throw Error("Missing required argument(s): iniString");

  const jsonString = JSON.stringify(parseINI(iniString), null, 2);
  return jsonString;
}

/**
 *
 * @param {*} iniString - A valid INI string: contents of the .ini file
 * @returns {object} - JSON object
 */
function parseINI(iniString) {
  const result = {};
  let currentObj = {};

  const lines = iniString.split("\n");
  let mainKey = "";

  for (let line of lines) {
    line = line.trim();

    // Ignore the empty lines and comments
    if (!line || line.startsWith("#")) continue;

    if (line.startsWith("[") && line.endsWith("]")) {
      currentObj = {};
      mainKey = line.substring(line.indexOf("[") + 1, line.indexOf("]"));
      result[mainKey] = {};
    } else {
      const [key, value] = line.split("=").map((part) => part.trim());
      currentObj[key] = value;
      result[mainKey] = currentObj;
    }
  }
  return result;
}

/**
 *
 * @param {*} jsonString - A valid JSON string with no nested structure
 * @returns {string} - INI string
 */
function convertJSONToINI(jsonString) {
  if (jsonString === undefined)
    throw Error("Missing required argument(s): jsonString");

  const iniString = parseJSONForINI(jsonString);
  return iniString;
}

/**
 *
 * @param {*} jsonString - A valid JSON string with no nested structure
 * @returns {string} - INI string
 */
function parseJSONForINI(jsonString) {
  let result = "";

  try {
    const jsonObj = JSON.parse(jsonString);

    const topLevelKeys = Object.keys(jsonObj);

    for (let index = 0; index < topLevelKeys.length; index++) {
      const element = topLevelKeys[index];

      result += "[" + element + "]\n";

      const innerObj = jsonObj[element];

      const innerLevelKeys = Object.keys(innerObj);

      for (
        let innerIndex = 0;
        innerIndex < innerLevelKeys.length;
        innerIndex++
      ) {
        const element = innerLevelKeys[innerIndex];

        result += element + "=" + innerObj[element] + "\n";
      }
      result += "\n";
    }

    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  convertYAMLToJSON,
  convertFlatFileToJSON,
  convertJSONToFlatFile,
  convertINIToJSON,
  convertJSONToINI,
};
