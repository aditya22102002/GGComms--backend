import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app, httpServer } from './app.js'

dotenv.config({
    path: './.env'
})
connectDB()
    .then(() => {
        // app.listen(process.env.PORT || 8000, ()=>{
        //     console.log(`serveris running on port ${process.env.PORT}`);
        // })
        const PORT = process.env.PORT || 8000;
        httpServer.listen(PORT, () => { // ⬅️ Use httpServer instead of app
            console.log(`✅ Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log("DB connection failed", err);

    })