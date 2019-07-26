
# PEG Replicator
PEG Replicator is a tool to provide concurrency functionality to a TCP / UDP type connection for IoT devices. It can have various purposes:
- Replication of information per se
- Diversification of functionality of the same source of information
- Asynchronous treatment of non-dependent data
- Forward data to mirror servers or other platforms
- Others

## The Challenge
### TCP/UDP Replicator 
Given the environment file with the following parameters *SOURCE_PORT* is the *PORT* the application will listen on *DESTINATIONS* csv with *ip:port* to forward the traffic to *MODE* the type of traffic to listen for (*tcp or udp*) 

*example.env*

    SOURCE_PORT=7890 
    MODE=TCP 
    DESTINATIONS=ip1:port1,ip2:port2 

Mount an application that will listen for traffic on the *SOURCE_PORT* and replicate the traffic to each destination in *DESTINATIONS*. 

The first destination in *DESTINATIONS* is the **primary** destination, all other connection are **secondary**, if they are down log a warning, establish a reconnection mechanism. 

A connection with the **primary** destination is required to replicate the traffic. 

The destinations may or may not reply to the forwarded traffic. 
### Requirements 
- For each connection on the *SOURCE_PORT* establish a connection to the **primary** and **secondary** destinations.

#### Managing traffic from source 
- For traffic coming from the **source**, forward the traffic to the **primary** destination first, store the replies, if any, as expected responses. 
- Forward the same traffic to each destination, if the responses differ (or there is no response). log a warning. 
#### Managing traffic from destinations 
-  Forward traffic from the **destination** to the **source**, store the replies, if any, as expected 
- If other destinations send identical traffic within 30 seconds: 
	- Do not forward the traffic to the source. 
	- If there is a stored response, send it to the **destination**.
 - Extra credit: have whitelist/blacklist for traffic coming from primary and secondary destinations
### Language 
Application must be completed in python or node. Provide an explanation of why you chose one over the other.

# My Proposal
## Language 
Far from providing a treaty of advantages and disadvantages of Node.JS VS Python, I will limit myself to the following.
### Node.JS
Helps to develop building scalable network applications. It uses an event-driven, non-blocking I/O model which makes it an ideal option for developing for data-intensive real-time applications. Offers greater performance and speed.

*Reason why, this will be chosen for the development of this Application*.
### Python
Is an object-oriented, high level, dynamic and multipurpose programming language. It has features like support for major databases, functional and statured programming, etc. Is best suited for developing scientific and big data solutions.

*Impossible to leave out, therefore I will use it to test the operation and performance of the Application*
## Full Run / Testing
### Start the Destinations
For this excercise, I create a Echo TCP and UDP Servers for work like a destination. For start a destination Server:

    python test\destination_socket_server.py {MODE} {host} {port}

For my **.env** example file would be:
*Primary destination*

    python test\destination_socket_server.py UDP localhost 1234
    
*Secondary destination*

	python test\destination_socket_server.py UDP localhost 5678
### Start PEG Replicator Tool
For start the PEG Replicator Tool

	node index.js
	
### Simulate one connection
*TCP*

	node test\client_tcp.js

*UDP*

	node test\client_udp.js