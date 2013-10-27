/*
Original Code by Tom Igoe
edited John Schimmel
Source: https://github.com/johnschimmel/node-session

Arduino connects over TCP to a NodeJS server,
and NodeJS talks to the browser over socket.io passing information through.

Update to new Ethernet.h syntax by Sergio Majluf 
ITP - October 2013


*/

#include <SPI.h>
#include <Ethernet.h>

// Enter a MAC address of your Ethernet shield or Arduino.
byte mac[] = {  
   0x90, 0xA2, 0xDA, 0x00, 0x6C, 0xFE 
};

// Arduino's IP address, dependent on your network configuration
IPAddress ip(192,168,0,225);

// Node.js Server IP Address
IPAddress server(192,168,0,133);

int pin = 9; //pin on Arduino you want to toggle
int pinVal = 0;

// Create the Ethernet client
EthernetClient client;

void setup() {
  // start the Ethernet connection:
  Ethernet.begin(mac, ip);
  // start the serial library:
  Serial.begin(9600);
  // give the Ethernet shield a second to initialize:
  delay(1000);
  Serial.println("connecting...");

  // if you get a connection, report back via serial:
  // The 1337 PORT is for the TCP server, not the Web Server (8090 in node.js setup)
  if (client.connect(server, 1337)) {
    Serial.println("connected");
  } 
  else {
    // if you didn't get a connection to the server:
    Serial.println("connection failed");
  }

  pinMode(pin, OUTPUT);
}

void loop()
{
  
  //if you are connected and data is available
  if (client.available()) {
    char c = client.read();
    Serial.print(c);

    // '1' was received, return '1' for HIGH
    if (c == '1') {
      pinVal = HIGH;
      client.print('1');
    } 
    else if (c == '0') {
      pinVal = LOW;
      client.print('0'); 
    }
    
    //turn led pin to new position
    digitalWrite(pin, pinVal);

  }

}
