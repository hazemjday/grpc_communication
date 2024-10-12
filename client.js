const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync("helloworld.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const helloWorldPackage = grpcObject.HelloWorld;

const client = new helloWorldPackage('localhost:50051', grpc.credentials.createInsecure());

function sayHello(name, language) {
    client.SayHello({ name: name, language: language }, (err, response) => {
        if (err) console.error(err);
        else console.log(response.message);
    });
}

sayHello('Hazem', 'fr')