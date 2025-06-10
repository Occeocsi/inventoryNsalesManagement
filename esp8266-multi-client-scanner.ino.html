#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WebSocketsServer.h>
#include <SoftwareSerial.h>
#include <ESP8266mDNS.h>

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
unsigned long lastScanTime = 0;
int connectedClients = 0;

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
  server.on("/scan", HTTP_POST, handleManualScan);
  
  // Enable CORS for all routes
  server.enableCORS(true);
  
  server.begin();
  
  // Start WebSocket server
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  
  Serial.println("HTTP server started");
  Serial.println("WebSocket server started");
  Serial.println("Ready to scan barcodes for multiple clients");
}

void loop() {
  // Handle WebSocket events
  webSocket.loop();
  
  // Handle HTTP requests
  server.handleClient();
  
  // Handle mDNS
  MDNS.update();
  
  // Check for barcode scanner data
  if (scannerSerial.available()) {
    String scannedCode = scannerSerial.readStringUntil('\r');
    scannedCode.trim();
    
    if (scannedCode.length() > 0 && (millis() - lastScanTime > 1000)) { // Prevent duplicate scans within 1 second
      Serial.print("Barcode scanned: ");
      Serial.println(scannedCode);
      Serial.print("Broadcasting to ");
      Serial.print(connectedClients);
      Serial.println(" clients");
      
      lastScannedCode = scannedCode;
      lastScanTime = millis();
      newScan = true;
      
      // Send the scanned code to all connected WebSocket clients
      webSocket.broadcastTXT(scannedCode);
    }
  }
}

void handleRoot() {
  String html = "<!DOCTYPE html><html><head>";
  html += "<title>ESP8266 Multi-Client Barcode Scanner</title>";
  html += "<meta name='viewport' content='width=device-width, initial-scale=1'>";
  html += "<style>";
  html += "body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }";
  html += ".container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }";
  html += ".status { padding: 10px; margin: 10px 0; border-radius: 4px; }";
  html += ".connected { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }";
  html += ".disconnected { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }";
  html += ".code { font-family: monospace; font-size: 18px; background: #f8f9fa; padding: 10px; border-radius: 4px; margin: 10px 0; }";
  html += "button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 5px; }";
  html += "button:hover { background: #0056b3; }";
  html += "input { padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 4px; width: 200px; }";
  html += "</style></head>";
  html += "<body><div class='container'>";
  html += "<h1>ESP8266 Multi-Client Barcode Scanner</h1>";
  html += "<p>This ESP8266 broadcasts scanned barcodes to multiple connected clients (Staff and Customer terminals).</p>";
  
  html += "<div class='status " + String(connectedClients > 0 ? "connected" : "disconnected") + "'>";
  html += "Connected Clients: <strong>" + String(connectedClients) + "</strong>";
  html += "</div>";
  
  html += "<div class='status connected'>";
  html += "Scanner Status: <strong>Active</strong>";
  html += "</div>";
  
  html += "<h3>Last Scanned Code:</h3>";
  html += "<div class='code' id='lastCode'>" + (lastScannedCode.length() > 0 ? lastScannedCode : "No scans yet") + "</div>";
  
  html += "<h3>Manual Test Scan:</h3>";
  html += "<input type='text' id='testCode' placeholder='Enter test barcode' value='WH-001'>";
  html += "<button onclick='sendTestScan()'>Send Test Scan</button>";
  
  html += "<h3>Connection Info:</h3>";
  html += "<p><strong>WebSocket URL:</strong> ws://" + WiFi.localIP().toString() + ":81</p>";
  html += "<p><strong>mDNS URL:</strong> ws://esp8266-scanner.local:81</p>";
  
  html += "<script>";
  html += "var ws = new WebSocket('ws://' + window.location.hostname + ':81/');";
  html += "ws.onopen = function() { console.log('WebSocket connected'); };";
  html += "ws.onmessage = function(event) {";
  html += "  document.getElementById('lastCode').innerText = event.data;";
  html += "  console.log('Received:', event.data);";
  html += "};";
  html += "ws.onclose = function() { console.log('WebSocket disconnected'); };";
  html += "function sendTestScan() {";
  html += "  var code = document.getElementById('testCode').value;";
  html += "  if (code) {";
  html += "    fetch('/scan', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({code: code}) })";
  html += "    .then(response => response.json())";
  html += "    .then(data => console.log('Test scan sent:', data));";
  html += "  }";
  html += "}";
  html += "</script>";
  html += "</div></body></html>";
  
  server.send(200, "text/html", html);
}

void handleStatus() {
  String json = "{";
  json += "\"connected\": true,";
  json += "\"connectedClients\": " + String(connectedClients) + ",";
  json += "\"lastScannedCode\": \"" + lastScannedCode + "\",";
  json += "\"newScan\": " + String(newScan ? "true" : "false") + ",";
  json += "\"uptime\": " + String(millis()) + ",";
  json += "\"freeHeap\": " + String(ESP.getFreeHeap());
  json += "}";
  
  newScan = false; // Reset the new scan flag
  
  server.send(200, "application/json", json);
}

void handleManualScan() {
  if (server.hasArg("plain")) {
    String body = server.arg("plain");
    
    // Simple JSON parsing for test scans
    int codeStart = body.indexOf("\"code\":\"") + 8;
    int codeEnd = body.indexOf("\"", codeStart);
    
    if (codeStart > 7 && codeEnd > codeStart) {
      String testCode = body.substring(codeStart, codeEnd);
      
      Serial.print("Manual test scan: ");
      Serial.println(testCode);
      
      lastScannedCode = testCode;
      lastScanTime = millis();
      newScan = true;
      
      // Broadcast the test scan
      webSocket.broadcastTXT(testCode);
      
      server.send(200, "application/json", "{\"success\": true, \"code\": \"" + testCode + "\"}");
      return;
    }
  }
  
  server.send(400, "application/json", "{\"success\": false, \"error\": \"Invalid request\"}");
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Client disconnected!\n", num);
      connectedClients--;
      if (connectedClients < 0) connectedClients = 0;
      break;
      
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Client connected from %d.%d.%d.%d\n", num, ip[0], ip[1], ip[2], ip[3]);
        connectedClients++;
        
        // Send welcome message with last scanned code
        String welcomeMsg = "{\"type\":\"welcome\",\"lastCode\":\"" + lastScannedCode + "\",\"clients\":" + String(connectedClients) + "}";
        webSocket.sendTXT(num, welcomeMsg);
        
        // If we have a recent scan, send it to the new client
        if (lastScannedCode.length() > 0 && (millis() - lastScanTime < 30000)) { // Within last 30 seconds
          webSocket.sendTXT(num, lastScannedCode);
        }
      }
      break;
      
    case WStype_TEXT:
      // Handle incoming messages from clients if needed
      Serial.printf("[%u] Received: %s\n", num, payload);
      break;
      
    default:
      break;
  }
}
