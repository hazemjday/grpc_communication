import grpc
from concurrent import futures
import helloworld_pb2
import helloworld_pb2_grpc
import time

class HelloWorldServicer(helloworld_pb2_grpc.HelloWorldServicer):
    def SayHello(self, request, context):
        if request.language == "fr":
            message = f"Bonjour {request.name}!"
        elif request.language == "ar":
            message = f"مرحبا {request.name}!"
        else:
            message = f"Hello {request.name}!"
        return helloworld_pb2.HelloReply(message=message)

    def StreamGreetings(self, request, context):
         if request.language == "fr":
                message = f"Bonjour {request.name}! Current time is {time.ctime()}"
         elif request.language == "ar":
                message = f"مرحبا {request.name}! الوقت الحالي هو {time.ctime()}"
         else:
                message = f"Hello {request.name}! Current time is {time.ctime()}"
         while True:
            yield helloworld_pb2.HelloReply(message=message)
            time.sleep(2)

    def StreamClientGreetings(self, request_iterator, context):
        names = []
        for request in request_iterator:
            names.append(request.name)  
        combined_greetings = ', '.join(names)
        message = f"Greetings to: {combined_greetings}!"
        return helloworld_pb2.HelloReply(message=message)

    
    def bothStreamGreetings(self, request_iterator, context):
        for request in request_iterator:
            message = f"Greetings to : {request.name}"
            yield helloworld_pb2.HelloReply(message = message)
            time.sleep(2)
        

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    helloworld_pb2_grpc.add_HelloWorldServicer_to_server(HelloWorldServicer(), server)
    server.add_insecure_port('0.0.0.0:50051') 
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
