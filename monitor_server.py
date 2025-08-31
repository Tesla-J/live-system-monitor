import asyncio
import websockets
import random
import json

connected_clients = set()  # Set to keep track of connected clients

async def broadcast(message):
    if connected_clients:  # Only send if there are connected clients
        await asyncio.gather(*(client.send(message) for client in connected_clients))

async def send_numbers(websocket):
    connected_clients.add(websocket)
    try:
        while True:
            # Generate an array of three random numbers between 20 and 80
            numbers = [random.randint(20, 80) for _ in range(3)]
            message = json.dumps(numbers)
            await broadcast(message)
            await asyncio.sleep(1)
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        connected_clients.remove(websocket)

async def main():
    async with websockets.serve(send_numbers, "localhost", 6789):
        print("WebSocket server started on ws://localhost:6789")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Server stopped by user.")

