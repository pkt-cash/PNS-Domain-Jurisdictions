# PNS Domain Authorities

For PKT domain staking, domains get a bonus if they are registered in different jurisdictions.
The logic is as follows:

1. 100% divided by the number of domain stakers using the same TLD Authority, PLUS
2. 100% divided by the number of domain stakers using the same Registrar, PLUS
3. 100% divided by the number of domain stakers with the same Country

## TLD Authority
A TLD authority is the organization which manages the top level domain. As you can see in the
file `tld_authorities.json`, `.ACTOR`, `.AIRFORCE`, `.ARMY`, and `.ATTORNEY` are all operated
by the same organization, Dog Beach, LLC.

That means domains registered under all of those TLDs are still under the administrative
authority of the same person.

## Registrar
Those who register domains are probably more familiar with the registrar than the TLD
authority. Registrars act as a liason between the customer and the TLD Authority. Since the
registrar is technically the one who makes the request to the TLD Authority, they also have
the power to disable a domain if they want to.

The list of registrars is found in `registrars.json`

## Country
Both the TLD Authority and the Registrar are organizations which have domicile in some country
or another. For the purpose of deciding what a domain's Country is, we take the
*less advantageous* of the two.

So for example, if the Registrar is in an obscure country, but the TLD Authority is in a
popular country, the domain's Country is the country of the TLD Authority.

## Files and Generation

The files `tld_authorities.json` and `registrars.json` are both generated (by
`gen_tld_authorities.js` and `gen_registrars.json` respectively). These are generated from
the ICANN database.

1. `Accredited-Registrars-XXXXX.csv` - From: https://www.icann.org/en/accredited-registrars?view-all=true&page=1
2. `tlds.txt` - From: https://data.iana.org/TLD/tlds-alpha-by-domain.txt
3. `tld_whois/*.txt` - Generated with the command below:

```bash
cat ./tlds.txt | grep -v '^\#' | while read x; do
    if ! [ -e "$x.txt" ]; then
        echo $x
        whois $x > ./tld_whois/$x.txt
    fi
done
```