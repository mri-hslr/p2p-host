import WebSocket, { WebSocketServer } from "ws";
const PORT=8080
const wss=new WebSocketServer({port:PORT})
const pending = new Map();
let nextTicketId = 1;
let agentSocket = null;//global scope variable for both http and ws handlers
    wss.on("connection",(ws,req)=>{
         agentSocket=ws
         console.log("Agent socket saved:", agentSocket.readyState);
         console.log(`New agent connected on port ${PORT}`);
         console.log(`Client IP: ${req.socket.remoteAddress}`);
          
          ws.on("message", (message) => {
            const result = JSON.parse(message.toString());
             if (result.type === "response") {
            const visitorRes = pending.get(result.ticketId);
                if (visitorRes) {
                    visitorRes.status(result.statusCode).send(result.body);
                    pending.delete(result.ticketId);
                }
                console.log("Received:", message.toString());
            };
          })
          ws.on("close", () => {
          console.log("Agent  disconnected");
         });
    })
    

console.log(`WebSocket server listening on port ${PORT}`)






import express from "express";

const app = express();
app.get("/about",(req,res)=>{
    if (!agentSocket || agentSocket.readyState !== WebSocket.OPEN) {
        return res.status(503).send("No agent is connected");
    }
    const ticketId = nextTicketId++;
    pending.set(ticketId, res);
    agentSocket.send(JSON.stringify({
        type: "request",
        ticketId: ticketId,
        method: "GET",
        path: "/about"
    }));
    
    
})
app.listen(8081,()=>{
    console.log("http server running on 8081")
})