const  express =  require("express")

const mongoose = require("mongoose")
const app = express()

app.use(express.json())

const connect = ()=>mongoose.connect(
    "mongodb+srv://web15:web15@cluster0.zieim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )

    const pageSchema= new mongoose.Schema({
        id:{type:String,required:true},
        first_name:{type:String,required:true},
        last_name:{type:String,required:true},
        image_url:{type:String,required:true}


    },
    {
        timestamps:true,
        versionKey:false
    }
    
    )


    const Pagination = mongoose.model("paginations",pageSchema)

 
    
    app.get("/paginations", async(req,res)=>{

        try {

            const page = req.query.page||1;
            const pagesize= req.query.pagesize||10;


            let skip = (page-1)*pagesize

            const data = await Pagination.find()
            .skip(skip)
            .limit(pagesize)
            .lean().exec()
             
            const  totalpages= Math.ceil((await Pagination.find().countDocuments())/pagesize)

        return res.status(200).send({data,totalpages})

            
        } catch (error) {
           return res.status(500).send({message:error.message})
        }
       

    })



    app.listen(5000,()=>{
          connect()
        console.log("port listening on the 5000")
    })