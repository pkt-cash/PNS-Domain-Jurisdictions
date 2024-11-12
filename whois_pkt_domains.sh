#!/bin/sh

cat ./tlds.txt | \
    grep -v '^#' | \
    while read x; do
        echo $x
        whois pkt.$x > ./pkt_domains/whois.pkt.$x.txt
    done