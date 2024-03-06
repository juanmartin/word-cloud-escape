// Import necessary libraries
import express from "express";
import http from "http";
import WebSocket from "ws";
import { SerialPort } from "serialport";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Because of ES module thing
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const HTTP_PORT = 3000;

// Create an Express app
const app = express();
// Serve Vite Svelte frontend app
app.use(express.static(path.resolve(__dirname, "..", "dist")));
// Create an HTTP server
const server = http.createServer(app);
// Create a WebSocket server
const wss = new WebSocket.Server({ server });

let serialPorts;
let port;

async function listSerialPorts() {
  SerialPort.list()
    .then((ports) => {
      serialPorts = JSON.stringify(ports);
      console.log(`Listed serial ports: ${serialPorts}`);
      return serialPorts;
    })
    .catch((err) => {
      console.error(`Error listing serial ports: ${err}`);
      throw err;
    });
}

function sendSerialPorts(ws) {
  listSerialPorts();
  ws.send(JSON.stringify({ type: "ports", data: serialPorts }));
}

// Send serial data through serial port
function sendDataThroughSerial(data) {
  port.write(data + "\n");
}

// Function to handle WebSocket connection
function handleConnection(ws) {
  // send them once on connection
  sendSerialPorts(ws);
  // other events
  ws.on("message", (message) => handleIncomingMessage(ws, message));
  ws.on("close", () => {
    console.log("WebSocket connection closed, closing serial port connection");
    closeSerialPortConnection();
  });
}

// Function to handle incoming messages
function handleIncomingMessage(ws, message) {
  console.log(`WebSocket message: ${message}`);
  const data = JSON.parse(message);

  if (data.type === "requestPorts") {
    // when requested, get ports and send them back, or error
    sendSerialPorts(ws);
  } else if (data.type === "whichPort") {
    // Initialize a serial port connection
    initializeSerialPortConnection(data.data);
  } else if (data.type === "sendValue") {
    // Send the value over the serial port
    console.log(`Sending value through serial: ${data.data}`);
    port.write(data.data + "\n");
  }
}

// Function to initialize serial port connection
function initializeSerialPortConnection(portPath) {
  port = new SerialPort({ path: portPath, baudRate: 115200 });
}

// Function to close serial port connection
function closeSerialPortConnection() {
  if (port) {
    port.close();
    port = null;
    console.log("Serial port connection closed", port);
  }
}

// Function to start server
function startServer() {
  server.listen(HTTP_PORT, () => {
    console.log(`Server listening on port ${HTTP_PORT}`);
  });
}

startServer();
wss.on("connection", handleConnection);
