const fs = require('fs');

const Countries = require('./country_codes.json');

function parseWhois(whoisText, file) {
    const lines = whoisText.split("\n");

    let adminOrg = "";
    let country = "";
    let countryCode = "";

    const orgRegex = /^organisation:\s*(.+)/i;

    // Variables to track state
    let foundAdminOrg = false;
    let foundAdmin = false;

    for (let line of lines) {
        line = line.trim();

        // Find the administrative organization
        if (!foundAdminOrg && orgRegex.test(line)) {
            adminOrg = line.match(orgRegex)[1];
            foundAdminOrg = true;
        }

        if (/contact:\s*administrative/.test(line)) {
            foundAdmin = true;
        }
        if (!foundAdmin) { continue; }

        if (!foundAdminOrg) { continue; }

        if (adminOrg === 'CENIAInternet') {
            // We must special-case .CU because it does not mention the country anywhere in the WHOIS.
            country = 'Cuba';
            countryCode = 'CU';
            break;
        }

        if (line.indexOf('address:') > -1) {
            for (let c in Countries) {
                if (line.indexOf(c) > -1) {
                    country = c;
                    countryCode = Countries[c];
                    return [adminOrg, country, countryCode];
                }
            }
        }
    }

    if (!country) { throw new Error("no country for " + file + " ORG = " + adminOrg); }

    return [adminOrg, country, countryCode];
}

// Read all files in the directory
fs.readdir('./tld_whois', (err, files) => {
    if (err) {
        return console.error("Unable to read directory:", err);
    }

    // Filter out non-.txt files
    const txtFiles = files.filter(file => file.endsWith('.txt'));

    let out = [];

    // Loop through each .txt file
    txtFiles.forEach(file => {
        const tld = file.replace('.txt', '');
        // Read the content of each file
        const data = fs.readFileSync('./tld_whois/' + file, 'utf8');
        if (err) {
            return console.error("Unable to read file:", err);
        }

        // Parse the WHOIS data
        const result = parseWhois(data, tld);
        result.unshift(tld)
        out.push(result);
    });

    console.log(JSON.stringify(out, null, '\t'));
});