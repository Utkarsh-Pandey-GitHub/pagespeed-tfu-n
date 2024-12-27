const connectToServer = () => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);

    ws.onopen = () => {
      const zoomAttendeeId = new URLSearchParams(window.location.search)?.get(
        "zoomAttendeeId"
      );

      if (!zoomAttendeeId) {
        console.error("No zoomAttendeeId found in URL");
        return;
      }

      window.ws = ws;

      sendUsingSocket({
        type: "identify",
        id: zoomAttendeeId,
      }).then(() => {
        resolve(ws);
      });
    };

    ws.onclose = (event) => {
      if (event.wasClean) {
        console.error(
          `Connection closed cleanly, code=${event.code}, reason=${event.reason}`
        );
      } else {
        console.error("Connection abruptly closed");
      }

      // Reconnect after 5 seconds
      setTimeout(async () => {
        console.log("Reconnecting...");
        await connectToServer()
          .then(() => resolve())
          .then(() => reject());
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      reject(error);
    };
  });
};

const sendUsingSocket = async (payload) => {
  console.log("Sending payload", payload);
  try {
    await window.ws?.send(JSON.stringify(payload));
  } catch (err) {
    console.log(err);
  }
};

export { connectToServer, sendUsingSocket };
