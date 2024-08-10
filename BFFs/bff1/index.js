// bff1_server.js
const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Load gRPC client
const packageDef = protoLoader.loadSync('../../proto/main.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const dataPackage = grpcObject.main;

const client = new dataPackage.DataService('localhost:50051', grpc.credentials.createInsecure());
app.use(cors());
app.get('/data', (req, res) => {
  client.getData({}, (err, response) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(response);
  });
});

app.listen(PORT, () => {
  console.log(`BFF 1 Server running at http://localhost:${PORT}`);
});
