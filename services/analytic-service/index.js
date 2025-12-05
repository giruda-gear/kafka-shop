import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "analytic-service",
  brokers: ["localhost:9094", "localhost:9095", "localhost:9096"],
});

const consumer = kafka.consumer({ groupId: "analytic-service" });

const run = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topics: ["payment-successful", "order-successful", "email-successful"],
      fromBeginning: true,
    });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();

        switch (topic) {
          case "payment-successful": {
            const { userId, cart } = JSON.parse(value);

            const total = cart
              .reduce((acc, item) => acc + item.price, 0)
              .toFixed(2);

            console.log(`Analytic consumer: User ${userId} paid ${total}`);
          }
          case "order-successful": {
            const { userId, orderId } = JSON.parse(value);

            console.log(
              `Analytic consumer: Order id ${orderId} created for user id ${userId}`
            );
          }

          case "email-successful": {
            const { userId, emailId } = JSON.parse(value);

            console.log(
              `Analytic consumer: Email id ${emailId} sent to user id ${userId}`
            );
          }
          default:
            break;
        }
      },
    });
  } catch (error) {
    console.log(error);
  }
};

run();
