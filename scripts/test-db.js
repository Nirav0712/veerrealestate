import net from 'net';

const client = new net.Socket();
const host = 'srv1990.hstgr.io';
const port = 3306;

console.log(`Connecting to ${host}:${port}...`);

const timeout = setTimeout(() => {
    console.error('Connection timed out (custom timeout)');
    client.destroy();
}, 10000);

client.connect(port, host, () => {
    clearTimeout(timeout);
    console.log('Connected successfully!');
    client.destroy();
});

client.on('error', (err) => {
    clearTimeout(timeout);
    console.error(`Connection failed: ${err.message}`);
    if (err.code === 'ETIMEDOUT') {
        console.error('Timeout suggests firewall blockage. Please enable Remote MySQL for your IP.');
    }
});

client.on('close', () => {
    console.log('Connection closed');
});
