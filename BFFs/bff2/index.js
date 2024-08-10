// bff2_server.js
const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const xml2js = require('xml2js');
const cors = require('cors');
const app = express();
const PORT = 3002;

// Load gRPC client
const packageDef = protoLoader.loadSync('../../proto/main.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const dataPackage = grpcObject.main;

const client = new dataPackage.DataService('localhost:50051', grpc.credentials.createInsecure());
app.use(cors());
app.get('/data', (req, res) => {
  client.getData({}, (err, response) => {
    if (err) {
      return res.status(500).send('Error fetching data');
    }
    const builder = new xml2js.Builder();
    const xml = builder.buildObject(response);
    res.type('application/xml');
    res.send(xml);
  });
});

app.listen(PORT, () => {
  console.log(`BFF 2 Server running at http://localhost:${PORT}`);
});
