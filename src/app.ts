import express from "express";
import postRoutes from "./routes/posts";

const app = express();

app.get("/api", (req, res) => res.send("app is up and running"));
app.use("/api", postRoutes);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
