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
 * @param {string} yamlStr - A Valid YAML string
 * @returns {string[]} - JSON string
 */
function convertYAMLToJSON(yamlStr) {
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

module.exports = convertYAMLToJSON;

// Example Usage
const yamlString = `
# Document start marker
---
environment: production

# Nested objects
server:
  name: "Main Server"
  ip: "192.168.1.1"
  ports:
    - http: 80
    - https: 443
    - ssh: 22

# Array of objects with nested structures
databases:
  - name: postgres
    type: SQL
    version: "13.3"
    credentials:
      username: admin
      password: securePassword
  - name: redis
    type: NoSQL
    version: "6.0.6"
    credentials:
      username: cacheAdmin
      password: cacheSecure

# A string key
description: "This is a production server setup. It includes configurations for database connections and network settings."

# Nested array of objects with various data types
users:
  - id: 1
    name: Alice
    roles: 
      - admin
      - editor
    active: true
  - id: 2
    name: Bob
    roles: 
      - viewer
    active: false
  - id: 3
    name: Carol
    roles: 
      - admin
      - viewer
    active: true

# YAML Boolean, null, and numbers
features:
  isEnabled: true
  maintenanceMode: false
  releaseVersion: null
  maxRequestsPerMinute: 1200

# A complex array of arrays and objects
api:
  endpoints:
    - path: /users
      methods:
        - GET
        - POST
      rate_limit: 500
    - path: /orders
      methods:
        - GET
        - DELETE
      rate_limit: 300
`;
const complexString = `
---
company: spacelift
domain:
  - devops
  - devsecops
tutorial:
  - name: yaml
  - type: awesome
  - rank: 1
  - born: 2001
author: omkarbirade
published: true
---
doe: "a deer, a female deer"
ray: "a drop of golden sun"
pi: 3.14159
xmas: true
french-hens: 3
calling-birds:
  - huey
  - dewey
  - louie
  - fred
xmas-fifth-day:
  calling-birds: four
  french-hens: 3
  golden-rings: 5
  partridges:
    count: 1
    location: "a pear tree"
  turtle-doves: two
`;

// const jsonObject = convertYAMLToJSON(yamlString);
// console.log(jsonObject);

/**
 *
 * @param {*} csvString - A valid CSV string
 * @returns {string} - JSON string
 */
function convertCSVToJSON(csvString) {
  const jsonString = JSON.stringify(parseCSV(csvString), null, 2);
  return jsonString;
}

/**
 *
 * @param {*} csvString - A valid CSV string
 * @returns {object} - Parsed JavaScript object (equivalent to JSON).
 */
function parseCSV(csvString) {
  const lines = csvString.split("\n");

  const result = [];
  let keyList = [];
  let keyLine = 0;

  for (let line of lines) {
    line = line.trim();

    if (!line) continue;

    if (keyLine == 0) {
      keyList = line.split(",");
      keyLine += 1;
    } else {
      let objLine = line.split(",");
      if (objLine.length === keyList.length) {
        let currentObj = {};
        for (let index = 0; index < keyList.length; index++) {
          const key = keyList[index].trim();
          const value = objLine[index].trim();
          currentObj[key] = value;
        }
        result.push(currentObj);
      } else {
        // Invalid data
      }
    }
  }
  return result;
}

/**
 *
 * @param {*} jsonString - A valid JSON string ideally with no nested values
 * @returns {string} - CSV string
 */
function convertJSONToCSV(jsonString) {
  const csvString = parseJSONForCSV(jsonString);
  return csvString;
}

function parseJSONForCSV(jsonString) {
  let result = "";
  try {
    let jsonObjArray = JSON.parse(jsonString);
    for (let index = 0; index < jsonObjArray.length; index++) {
      const jsonObj = jsonObjArray[index];
      if (index === 0) {
        result += Object.keys(jsonObj).join(",") + "\n";
      }
      result += Object.values(jsonObj).join(",") + "\n";
    }
    return result;
  } catch (error) {
    throw error;
  }
}

// Handling csv- comma,semicolon or any other valid separator
// Enclosed by "" CSV

const csvString = `
album, year, US_peak_chart_post
The White Stripes, 1999, -
De Stijl, 2000, -
White Blood Cells, 2001, 61
Elephant, 2003, 6
Get Behind Me Satan, 2005, 3
Icky Thump, 2007, 2
Under Great White Northern Lights, 2010, 11
Live in Mississippi, 2011, -
Live at the Gold Dollar, 2012, -
Nine Miles from the White City, 2013, -
`;
const jsonString = `
[
    {
      "album": "The White Stripes",
      "year": 1999,
      "US_peak_chart_post": "-"
    },
    {
      "album": "De Stijl",
      "year": 2000,
      "US_peak_chart_post": "-"
    },
    {
      "album": "White Blood Cells",
      "year": 2001,
      "US_peak_chart_post": 61
    },
    {
      "album": "Elephant",
      "year": 2003,
      "US_peak_chart_post": 6
    },
    {
      "album": "Get Behind Me Satan",
      "year": 2005,
      "US_peak_chart_post": 3
    },
    {
      "album": "Icky Thump",
      "year": 2007,
      "US_peak_chart_post": 2
    },
    {
      "album": "Under Great White Northern Lights",
      "year": 2010,
      "US_peak_chart_post": 11
    },
    {
      "album": "Live in Mississippi",
      "year": 2011,
      "US_peak_chart_post": "-"
    },
    {
      "album": "Live at the Gold Dollar",
      "year": 2012,
      "US_peak_chart_post": "-"
    },
    {
      "album": "Nine Miles from the White City",
      "year": 2013,
      "US_peak_chart_post": "-"
    }
]
`;
// console.log(convertCSVToJSON(csvString));
console.log(parseJSONForCSV(jsonString));
