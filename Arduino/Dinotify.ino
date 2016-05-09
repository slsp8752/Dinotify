#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>

const int LED_PIN = 5;
const int R_PIN = 12;
const int G_PIN = 13;
const int B_PIN = 4; 

int red = 255;
int green = 255;
int blue = 255;

String inData;

WiFiServer server(8888);

int isDigit(char c){
  return(c >= '0') && (c <= '9');
}

String getValue(String data, char separator, int index){
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length()-1;
  for(int i=0; i<=maxIndex && found<=index; i++){
    if(data.charAt(i)==separator || i==maxIndex){
      found++;
      strIndex[0] = strIndex[1]+1;
      strIndex[1] = (i == maxIndex) ? i+1 : i;
    }
  }
  return found>index ? data.substring(strIndex[0], strIndex[1]) : "";
}



void setup() {
  
    pinMode(LED_PIN, OUTPUT);
    pinMode(R_PIN, OUTPUT);
    pinMode(G_PIN, OUTPUT);
    pinMode(B_PIN, OUTPUT);
    
    WiFiManager wifiManager;
    wifiManager.autoConnect("Dinotify","dinodinodino");
    WiFi.mode(WIFI_AP_STA);
    digitalWrite(LED_PIN, HIGH);
    server.begin();
}

void loop() {

  WiFiClient client = server.available();
  if(client){
    while(client.connected()){
      if(client.available()){
        char received = client.read();
        
        inData += received;

        if(received == '\n'){
          if(inData == "On"){
            analogWrite(R_PIN, red);
            analogWrite(G_PIN, green);
            analogWrite(B_PIN, blue);
            client.println("Led is on.");
            
          }
          else if(inData == "Off\n"){
            analogWrite(R_PIN, 0);
            analogWrite(G_PIN, 0);
            analogWrite(B_PIN, 0);
            client.println("Led is off.");
          }

          else if(isDigit(inData.charAt(0)) && inData.length() == 12){
            //Ex: 123r255g28b
            
            red = getValue(inData, ':', 0).toInt();
            green = getValue(inData, ':', 1).toInt();
            blue = getValue(inData, ':', 2).toInt();
            if(red < 256 && blue < 256 && green < 256){
              analogWrite(R_PIN, red);
              analogWrite(G_PIN, green);
              analogWrite(B_PIN, blue);
              client.print("Color Set: ");
              client.print(red);
              client.print(green);
              client.println(blue);
            }
           
            else{
              client.println("Invalid Color.");
              analogWrite(R_PIN, red);
              analogWrite(G_PIN, green);
              analogWrite(B_PIN, blue);
            }
            
          }
          
          else{
            client.println("Invalid Command:" + inData);
            
          }
          inData = "";
        }
      }
    }
  } 
}
