"""
ISC Omar Cruz Carrillo

destination_socket_server.py
"""
# Import argv library
import sys
# Import socket programming library 
import socket 

# Import thread module 
from _thread import *
import threading 

print_lock = threading.Lock() 

MODE = None
HOST = None
PORT = None

# Thread fuction 
def threaded(conn, addr, MODE): 
    print(MODE)
    while True: 
        # Data received from client 
        if MODE == "TCP":
            data = conn.recv(1024) 
        else:
            # Set the timeout
            # conn.settimeout(10);
            
            data, addr = conn.recvfrom(1024)
            
        print('Connected to :', addr[0], ':', addr[1]) 
        
        if not data:             
            # Lock released on exit 
            print_lock.release() 
            break

        # Send data to client
        print("Receive: ", data) 
        
        if MODE == "TCP":
            conn.send(data + str.encode(':' + str(addr[1]))) 
        else:
            print(conn)
            print(data)
            print(addr)
            conn.sendto(data, addr)

    # Connection closed 
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
        # Put the socket into listening mode 
        s.listen(1000) 
        print("socket is listening") 

    # A forever loop until client wants to exit 
    while True: 

        if MODE == "TCP":
            # Establish connection with TCP client 
            conn, addr = s.accept() 
            
            # Set the timeout
            # s.settimeout(10);
        else:
            addr = None
            conn = s

        # Lock acquired by client 
        print_lock.acquire() 

        # Start a new thread 
        start_new_thread(threaded, (conn, addr, MODE, )) 
    s.close() 


if __name__ == '__main__': 
    Main(sys.argv[1:])
