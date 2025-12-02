import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.post("/payment-service", async (req, res) => {
  const { cart } = req.body;
  // asume that we get the cookie and decrypt the user id
  const userId = "123";

  // TODO: payment
  console.log("API endpoint hit!");

  // kafka

  return res.status(200).send("payment success");
});

app.use((err, req, next) => {
  res.status(err.status || 500).send(err.message);
});

app.listen(8000, () => {
  console.log("payment service is running.");
});
