#ITP CAMP NODEJS --> ARDUINO SESSION
##June 13th, 2011 w/ John Schimmel

The following NodeJS script will create a Websocket server using Socket.io and also create a TCP socket server for an ethernet arduino connection. 

With two socket servers running, the users from the webpage will connect to Socket.io. The Arduino will connect to the TCP socket server. Traffic from both servers will be passed to each other, so any data coming in from Socket.io will be passed to clients on the TCP server.

#Setup

##Arduino

* Prepare the ethernet Arduino shield or other xport, wifly, etc. 
* Default, put an LED on pin 9.
* When the Arduino hardware is ready, open the Arduino IDE, in .pde file, modify the server IP address, save the code.
* Upload the code to the Arduino


##Socket.io & TCP Servers
Install Socket.io (using Node Package Manager)

    npm install socket.io

Turn on the Socket.io & TCP servers, they are in the same .js file. From terminal command line, run:

    node /<path-to-files>/socket/arduino/server-w-tcp.js
    
Test Socket.io server is running, open browser and visit

    http://localhost:8090/arduino.html

If webpage loads successfully you should see some logged statements inside the terminal window. 
Now, plugin in the Arduino network connection and then plug in the Arduino power. If successful, the original terminal window will log a connection from the TCP server. 

Click on the web page button, a socket will send '1' to the socket server. 
The Socket.io server will receive the '1' and send it to the clients on the TCP server. 
The TCP connected Arduino will receive the '1' and turn it's LED high. 

When mouse is released on the web page button, the browser sends '0' to turn the LED off.