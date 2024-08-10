const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('../proto/main.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const dataPackage = grpcObject.main;

function getData(call, callback) {
  const response = { message: 'Hello from Main Server', value: 42 };
  callback(null, response);
}

function main() {
  const server = new grpc.Server();
  server.addService(dataPackage.DataService.service, { getData });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    // server.start();
    console.log('Main Server running at http://0.0.0.0:50051');
  });
}

main();
