#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WebSocketsServer.h>
#include <SoftwareSerial.h>

// WiFi credentials
const char* ssid = "YourWiFiName";
const char* password = "YourWiFiPassword";

// Create a web server on port 80
ESP8266WebServer server(80);

// Create a WebSocket server on port 81
WebSocketsServer webSocket = WebSocketsServer(81);

// Software serial for barcode scanner (RX, TX)
SoftwareSerial scannerSerial(D2, D3); // Connect scanner TX to D2, RX to D3

String lastScannedCode = "";
bool newScan = false;

void setup() {
  // Start serial communication
  Serial.begin(115200);
  scannerSerial.begin(9600); // Most barcode scanners use 9600 baud rate
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Set up mDNS responder
  if (!MDNS.begin("esp8266-scanner")) {
    Serial.println("Error setting up MDNS responder!");
  } else {
    Serial.println("mDNS responder started - esp8266-scanner.local");
  }
  
  // Set up web server routes
  server.on("/", HTTP_GET, handleRoot);
  server.on("/status", HTTP_GET, handleStatus);
  server.begin();
  
  // Start WebSocket server
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  
  Serial.println("HTTP server started");
  Serial.println("WebSocket server started");
}

void loop() {
  // Handle WebSocket events
  webSocket.loop();
  
  // Handle HTTP requests
  server.handleClient();
  
  // Check for barcode scanner data
  if (scannerSerial.available()) {
    String scannedCode = scannerSerial.readStringUntil('\r');
    scannedCode.trim();
    
    if (scannedCode.length() > 0) {
      Serial.print("Barcode scanned: ");
      Serial.println(scannedCode);
      
      lastScannedCode = scannedCode;
      newScan = true;
      
      // Send the scanned code to all connected WebSocket clients
      webSocket.broadcastTXT(scannedCode);
    }
  }
}

void handleRoot() {
  String html = "<html><head><title>ESP8266 Barcode Scanner</title></head>";
  html += "<body><h1>ESP8266 Barcode Scanner</h1>";
  html += "<p>This ESP8266 is connected to a barcode scanner and broadcasts scanned codes via WebSocket.</p>";
  html += "<p>Last scanned code: <strong id='lastCode'>" + lastScannedCode + "</strong></p>";
  html += "<script>";
  html += "var ws = new WebSocket('ws://' + window.location.hostname + ':81/');";
  html += "ws.onmessage = function(event) {";
  html += "  document.getElementById('lastCode').innerText = event.data;";
  html += "};";
  html += "</script>";
  html += "</body></html>";
  
  server.send(200, "text/html", html);
}

void handleStatus() {
  String json = "{";
  json += "\"connected\": true,";
  json += "\"lastScannedCode\": \"" + lastScannedCode + "\",";
  json += "\"newScan\": " + String(newScan ? "true" : "false");
  json += "}";
  
  newScan = false; // Reset the new scan flag
  
  server.send(200, "application/json", json);
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %d.%d.%d.%d\n", num, ip[0], ip[1], ip[2], ip[3]);
        
        // Send the last scanned code to the newly connected client
        if (lastScannedCode.length() > 0) {
          webSocket.sendTXT(num, lastScannedCode);
        }
      }
      break;
    case WStype_TEXT:
      // Handle incoming messages if needed
      break;
  }
}
