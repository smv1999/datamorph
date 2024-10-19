const { convertINIToJSON } = require("../index.js");
const { convertJSONToINI } = require("../index.js");
const { convertYAMLToJSON } = require("../index.js");
const { convertJSONToFlatFile } = require("../index.js");
const { convertFlatFileToJSON } = require("../index.js");

// YAML Example Usage
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

const jsonObject = convertYAMLToJSON(complexString);
console.log(jsonObject);

// CSV to JSON Example Usage
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
console.log(convertFlatFileToJSON(csvString, ","));
// console.log(convertJSONToFlatFile(jsonString, "\n", ";"));

// Example usage for INI

const iniString = `
# Sample INI file for configuration

[general]
app_name = MyApp
version = 1.2.3
is_active = true

[database]
host = localhost
port = 5432
username = admin
password = secret

[paths]
log_path = /var/log/myapp/
data_path = /usr/local/myapp/data/

[features]
enable_logging = true
max_connections = 100
timeout = 30

[mail]
smtp_server = smtp.mailserver.com
smtp_port = 587
use_tls = true
sender_email = noreply@myapp.com
`;

const jsonStringForINI = `
{
  "general": {
    "app_name": "MyApp",
    "version": "1.2.3",
    "is_active": "true"
  },
  "database": {
    "host": "localhost",
    "port": "5432",
    "username": "admin",
    "password": "secret"
  },
  "paths": {
    "log_path": "/var/log/myapp/",
    "data_path": "/usr/local/myapp/data/"
  },
  "features": {
    "enable_logging": "true",
    "max_connections": "100",
    "timeout": "30"
  },
  "mail": {
    "smtp_server": "smtp.mailserver.com",
    "smtp_port": "587",
    "use_tls": "true",
    "sender_email": "noreply@myapp.com"
  }
}
`;

// console.log(convertINIToJSON(iniString));
// console.log(convertJSONToINI(jsonStringForINI));
