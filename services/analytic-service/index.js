import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "analytic-service",
  brokers: ["localhost:9094"],
});

const consumer = kafka.consumer({ groupId: "analytic-service" });

const run = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: "payment-successful",
      fromBeginning: true,
    });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();

        try {
          const { userId, cart } = JSON.parse(value);

          const total = cart
            .reduce((acc, item) => acc + (item.price ?? 0), 0)
            .toFixed(2);

          console.log(`Analytic consumer: User ${userId} paid ${total}`);
        } catch (error) {
          console.error("Failed to process message in analytic-service:", {
            value,
            error,
          });
        }
      },
    });
  } catch (error) {
    console.log(error);
  }
};

run();
