const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const packageDefinition = protoLoader.loadSync('helloworld.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const helloWorldPackage = grpcObject.HelloWorld;
const client = new helloWorldPackage('localhost:50051', grpc.credentials.createInsecure());

function bothStreamGreetings(names) {
    const call = client.bothStreamGreetings((err, response) => {
        if (err) {
            console.error('Erreur lors de la réception:', err);
        } else {
            console.log('Réponse du serveur:', response.message);
        }
    }); 
    names.forEach(name => {
        call.write({ name: name, language: 'any' }); 
    });

    call.end(); 



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


bothStreamGreetings(['Hazem', 'Alice', 'Bob']); 
