/*
Original Code by Tom Igoe
edited John Schimmel
 
 */

#include <SPI.h>
#include <Ethernet.h>

// Enter a MAC address and IP address for your controller below.
// The IP address will be dependent on your local network:
byte mac[] = {  
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };

//your arduino's IP address might need to change depending on your network
byte ip[] = { 
  192,168,1,177 };

// IMPORTANT
// CHANGE THE SERVER IP ADDRESS
byte server[] = {
  11,22,33,44 };


int pin = 9; //pin on arduino you want to toggle
int pinVal = 0;

// Initialize the Ethernet client library
// with the IP address and port of the server 
Client client(server, 1337);

void setup() {
  // start the Ethernet connection:
  Ethernet.begin(mac, ip);
  // start the serial library:
  Serial.begin(9600);
  // give the Ethernet shield a second to initialize:
  delay(1000);
  Serial.println("connecting...");

  // if you get a connection, report back via serial:
  if (client.connect()) {
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
