const Fs = require('fs');
const { parse } = require('csv-parse/sync');

const Countries = require('./country_codes.json');

const f = Fs.readFileSync('./Accredited-Registrars-202410084636.csv');
const records = parse(f, {
    columns: true, // Treat the first line as headers
    skip_empty_lines: true, // Skip empty lines
    trim: true, // Trim whitespace from each field
    bom: true,
});

// console.log(records);

const out = [];
// Process each record
for (let record of records) {
    if (!record['Country/Territory'] && record['Registrar Name'] === "Butterfly Asset Management Pte. Ltd") {
        // Special case because no country is listed.
        record['Country/Territory'] = 'Singapore';
    }

    const code = Countries[record['Country/Territory']];
    if (!code) {
        throw new Error("No country code for " + JSON.stringify(record));
    }
    out.push([
        record['Registrar Name'],
        Number(record['IANA Number']),
        record['Country/Territory'],
        code,
    ]);
}
console.log(JSON.stringify(out, null, '\t'));