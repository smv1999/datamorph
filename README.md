## DataMorph

A package that allows you to convert your data between different formats.

### Supported Data Formats

- YAML
- JSON
- CSV
- INI

### Supported Data Format Conversions

The following conversions are supported in the current version of the package:

- YAML to JSON
- CSV to JSON
- JSON to CSV
- INI to JSON
- JSON to INI

### Usage

You can install the package using the following command:

```
npm install @smv1999/datamorph
```

### Examples

Let's see how to convert CSV to JSON.

```js
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

console.log(convertFlatFileToJSON(csvString, ","));
```

In the above example, we pass the contents of the CSV file, i.e., CSV string as the first argument and the data separator(delimeter) as the second argument.

It will generate the following output in JSON format:

```json
[
  {
    "album": "The White Stripes",
    "year": "1999",
    "US_peak_chart_post": "-"
  },
  {
    "album": "De Stijl",
    "year": "2000",
    "US_peak_chart_post": "-"
  },
  {
    "album": "White Blood Cells",
    "year": "2001",
    "US_peak_chart_post": "61"
  },
  {
    "album": "Elephant",
    "year": "2003",
    "US_peak_chart_post": "6"
  },
  {
    "album": "Get Behind Me Satan",
    "year": "2005",
    "US_peak_chart_post": "3"
  },
  {
    "album": "Icky Thump",
    "year": "2007",
    "US_peak_chart_post": "2"
  },
  {
    "album": "Under Great White Northern Lights",
    "year": "2010",
    "US_peak_chart_post": "11"
  },
  {
    "album": "Live in Mississippi",
    "year": "2011",
    "US_peak_chart_post": "-"
  },
  {
    "album": "Live at the Gold Dollar",
    "year": "2012",
    "US_peak_chart_post": "-"
  },
  {
    "album": "Nine Miles from the White City",
    "year": "2013",
    "US_peak_chart_post": "-"
  }
]
```
