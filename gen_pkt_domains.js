const fs = require('fs');

const Registrars = require('./registrars.json');

const REGISTRAR_TO_ID = {};
Registrars.forEach((r) => {
    REGISTRAR_TO_ID[r[0]] = r[1];
});
const registrarToId = (reg) => {
    return REGISTRAR_TO_ID[id];
}


function parseWhois(whoisText, file) {
    const lines = whoisText.split("\n");

    let registrar;
    let registrar_id;

    for (let line of lines) {
        line = line.trim();

        // Registrar: NameCheap, Inc.
        // Registrar IANA ID: 1068
        line.replace(/^Registrar IANA ID: ([0-9]*)$/i, (_all, cap) => {
            registrar_id = Number(cap);
            if (isNaN(registrar_id)) {
                throw new Error("Invalid registrar ID in line: " + line);
            }
        });

        line.replace(/^Registrar: (.*)$/, (_all, cap) => {
            if (registrar && registrar !== cap) {
                console.log(`File ${file} has multiple registrars: ${registrar} and ${cap}`);
                if (registrarToId[cap]) {
                    registrar = cap;
                }
            }
        });
    }
    if (registrar_id) {
        return registrar_id;
    }
    if (!registrar) {
        // unregistered domain
        return 0;
    }
    const id = registrarToId(registrar);
    if (!id) {
        throw new Error(`Unidentified registrar ${registrar} in ${file}`);
    }
    return id;
}

// Read all files in the directory
fs.readdir('./pkt_domains', (err, files) => {
    if (err) {
        return console.error("Unable to read directory:", err);
    }

    // Filter out non-.txt files
    const txtFiles = files.filter(file => file.endsWith('.txt'));

    let out = {};

    // Loop through each .txt file
    txtFiles.forEach(file => {
        const tld = file.replace(/^whois\.pkt\./, '').replace(/.txt$/, '');
        // Read the content of each file
        const data = fs.readFileSync('./pkt_domains/' + file, 'utf8');
        if (err) {
            return console.error("Unable to read file:", err);
        }

        // Parse the WHOIS data
        const id = parseWhois(data, file);
        if (id) {
            out[tld] = id;
        }
    });

    console.log(JSON.stringify(out, null, '\t'));
});