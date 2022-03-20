const  express =  require("express")

const mongoose = require("mongoose")
const nodemailer = require("nodemailer");
const app = express()



const connect = ()=>mongoose.connect(
    "mongodb+srv://web15:web15@cluster0.zieim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )



    

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      
      let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "48908581d68c4b", // generated ethereal user
          pass: "6411178b62a036", // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
    
    main().catch(console.error);
    


    app.use(express.json())


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