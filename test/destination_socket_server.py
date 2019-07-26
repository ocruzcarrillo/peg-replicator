# import argv library
import sys
# import socket programming library 
import socket 

# import thread module 
from _thread import *
import threading 

print_lock = threading.Lock() 

MODE = None
HOST = None
PORT = None

# thread fuction 
def threaded(conn, addr): 
    while True: 
        if MODE == "TCP":
            # data received from client 
            data = conn.recv(1024) 
        else:
            data, addr = conn.recvfrom(1024)
            
        print('Connected to :', addr[0], ':', addr[1]) 
        
        if not data:             
            # lock released on exit 
            print_lock.release() 
            break

        # send data o client
        print("Receive: ", data) 
        
        if MODE == "TCP":
            conn.send(data) 
        else:
            conn.sendto(data, addr)

    # connection closed 
    conn.close() 


def Main(argv): 
    print(socket.AF_INET)
    if (len(argv) != 3):
        print("Usage: %s {MODE} {HOST} {PORT}" % sys.argv[0])
        sys.exit(2)
    
    MODE = argv[0]
    HOST = argv[1]
    PORT = int(argv[2])
    
    if MODE == "TCP":
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
    elif MODE == "UDP":
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    else: 
        print("%s MODE isn't supported" % MODE)
        sys.exit(2)
        
    s.bind((HOST, PORT)) 
    print("socket binded to port", PORT) 

    if MODE == "TCP":
        # put the socket into listening mode 
        s.listen(1000) 
        print("socket is listening") 

    # a forever loop until client wants to exit 
    while True: 

        if MODE == "TCP":
            # establish connection with TCP client 
            conn, addr = s.accept() 
        else:
            addr = None
            conn = s

        # lock acquired by client 
        print_lock.acquire() 

        # Start a new thread and return its identifier 
        start_new_thread(threaded, (conn, addr, )) 
    s.close() 


if __name__ == '__main__': 
    Main(sys.argv[1:])
