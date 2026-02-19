import dns from 'dns';

const host = 'srv1990.hstgr.io';

console.log(`Resolving ${host}...`);

dns.lookup(host, { all: true }, (err, addresses) => {
    if (err) {
        console.error('DNS lookup failed:', err);
        return;
    }
    console.log('Addresses:', addresses);
});
