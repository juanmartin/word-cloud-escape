let socket = new WebSocket("ws://localhost:3000");

let ports;

// message object to be sent
const message = {
  type: "",
  data: "",
};

// Request ports from server
function requestPorts() {
  message.type = "requestPorts";
  socket.send(JSON.stringify(message));
}

// Send message to server with port
export const sendPort = (port) => {
  message.type = "whichPort";
  message.data = port;
  socket.send(JSON.stringify(message));
};

// Send value to send over port
export const sendValue = (value) => {
  message.type = "sendValue";
  message.data = value;
  socket.send(JSON.stringify(message));
};

// Connect and listen for the available ports from the server
socket.onopen = function () {
  console.log("Connection established");
  requestPorts();
};

// function to export the ports
export const getPorts = async () => {
  return new Promise((resolve, reject) => {
    requestPorts();
    socket.onmessage = function (event) {
      console.log("Message received:", event);
      const data = JSON.parse(event.data);
      console.log("Ports received:", data);
      if (data.type === "ports") {
        ports = JSON.parse(data.data);
        resolve(ports);
      }
    };
    socket.onerror = function (error) {
      console.log("Error:", error);
      reject(error);
    };
  });
};
