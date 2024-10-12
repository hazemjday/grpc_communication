const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('helloworld.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const helloWorldPackage = grpcObject.HelloWorld;


const client = new helloWorldPackage('localhost:50051', grpc.credentials.createInsecure());

function streamGreetings(name, language) {
    const call = client.StreamGreetings({ name: name, language: language });

    call.on('data', response => {
        console.log('Réponse du serveur:', response.message);
    });

    call.on('end', () => {
        console.log('Fin du streaming.');
    });

    call.on('error', err => {
        console.error('Erreur lors de la réception:', err);
    });
}

streamGreetings('Hazem', 'fr');