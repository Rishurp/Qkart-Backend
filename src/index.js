const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");

let server;


// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Create Mongo connection and get the express app to listen on config.port
mongoose.connect(config.mongoose.url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("Connected to MongoDB");
    app.listen(config.port, () => {
      console.log(`Server Listening at PORT ${config.port}`);
    });
}).catch((err)=>{
    console.log(err);
})


