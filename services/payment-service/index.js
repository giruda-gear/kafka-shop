import express from "express";
import cors from "cors";
import { Kafka } from "kafkajs";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["localhost:9094", "localhost:9095", "localhost:9096"],
});

const producer = kafka.producer();

const connectToKafka = async () => {
  try {
    await producer.connect();
    console.log("Producer connected");
  } catch (error) {
    console.log("Error connecting to Kafka", error);
  }
};

app.post("/payment-service", async (req, res) => {
  const { cart } = req.body;
  // asume that we get the cookie and decrypt the user id
  const userId = "123";

  // TODO: payment
  console.log("API endpoint hit!");
  // kafka
  await producer.send({
    topic: "payment-successful",
    messages: [{ value: JSON.stringify({ userId, cart }) }],
  });

  return res.status(200).send("payment success");
});

app.use((err, req, next) => {
  res.status(err.status || 500).send(err.message);
});

app.listen(8000, () => {
  connectToKafka();
  console.log("payment service is running.");
});
