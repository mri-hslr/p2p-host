import WebSocket from "ws";
const SERVER_URL="ws://localhost:8080"   // store the web-socket-server address to which client can connect 
//- ws:// — the WebSocket protocol without TLS encryption.
//- localhost — your own computer.
//- 8080 — the port where your server is listening.
const TEST_APP_URL="http://localhost:3000"
const ws= new WebSocket(SERVER_URL) // WebSocket creates the client and the WebSocketServer creates the ws server 
ws.on("open",()=>{
    console.log("agent connected to the server");
    
})
/**EXPLNATION
    * This means: When the connection opens successfully, execute this function.
    * What does () => {} mean? It's an arrow function, which defines the callback. 
        There are no parameters because this event doesn't require any arguments for 
        our example.
    * ws.send() sends the message to the server over the active connection  
*/

                    
ws.on("message",async (data)=>{
    const request=JSON.parse(data.toString());
    if(request.type==="request"){
        const response= await fetch(TEST_APP_URL+request.path)
        console.log("response from fetch to test app",response)
        const body = await (response.text());// fetch returns the object response , that has metadata and methods to read 
        // its response , try await.response() . you will get to know
        const result={
            type:"response",
            ticketId:request.ticketId,
            statusCode:response.status,
            body:body

        }
        ws.send(JSON.stringify(result))
        console.log("ticket",request.ticketId)
        console.log("Status:", response.status)
        console.log("Body",body)
    }

    //console.log("message from server",data)
})
/**EXPLNATION
 * This callback runs when the server sends a message to the agent.
 * Here, data is the message payload received from the library. For text messages, converting it to a string makes 
   it readable.
 * Notice that ws.send() and ws.on("message", ...) serve opposite purposes:
    - send() transmits data.
    - "message" listens for incoming data.
*/
ws.on("close",()=>{
    console.log("server conncection closed")
})
ws.on("error", (error) => {
    console.error("WebSocket error:", error.message);
});