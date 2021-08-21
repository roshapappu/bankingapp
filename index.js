let express = require('express')
const path = require('path')
let BodyParser=require('body-parser');
var MongoClient = require('mongodb').MongoClient;
let cors=require('cors');
const PORT = process.env.PORT || 5000
let app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(BodyParser.json());                                app.use(BodyParser.urlencoded({ extended: true }));


url="mongodb+srv://AJITH:ajay-ALTI-8@cluster0.9nz68.mongodb.net/?retryWrites=true&w=majority";
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
MongoClient.connect(url, function(err, db)
	{
	if (err)
		throw err;
/*	let dbo=db.db("WT");
	dbo.collection("kavinbankc").drop();
 	dbo.collection('kavinbankt').drop();
	dbo.collection("kavinbankc").insert([{"name":"Kavin","bal":30500,"no":"XXXX2579","mail":"kavin@gmail.com"},{"name":"KUMAR","bal":30000,"no":"XXXX4592","mail":"kumar@gmail.com"},{"name":"Surendhar","bal":10450,"no":"XXXX3789","mail":"surendhar@gmail.com"},{"name":"Siva","bal":20800,"no":"XXXX2894","mail":"siva@gmail.com"},{"name":"Akash","bal":23705,"no":"XXXX9876","mail":"akash@gmail.com"},{"name":"Sasi Kumar","bal":19700,"no":"XXXX6734","mail":"sasikumar@gmail.com"},{"name":"Gokul","bal":49000,"no":"XXXX2435","mail":"gokul@gmail.com"},{"name":"Indhu","bal":70000,"no":"XXXX6712","mail":"indhu@gmail.com"},{"name":"Priya","bal":15000,"no":"XXXX5673","mail":"priya@gmail.com"},{"name":"Karthika","bal":26700,"no":"XXXX4572","mail":"karthika@gmail.com"}],(err,result)=>            
	{                                                 
		console.log(result);
	});
	dbo.collection("kavinbankt").insert([{"mail":"kavin@gmail.com","t":[]},{"mail":"kumar@gmail.com","t":[]},{"mail":"surendhar@gmail.com","t":[]},{"mail":"priya@gmail.com","t":[]},{"mail":"karthika@gmail.com","t":[]},{"mail":"siva@gmail.com","t":[]},{"mail":"akash@gmail.com","t":[]},{"mail":"sasikumar@gmail.com","t":[]},{"mail":"gokul@gmail.com","t":[]},{"mail":"indhu@gmail.com","t":[]}],(err,result)=>      
		{                                         
			console.log(result);              
		});*/
		db.close();
});
app.get('/test',(req,res)=>{
	res.send("Hello");
});
app.post('/viewt',(req,res)=>{
	MongoClient.connect(url, function(err, db)       
		{                                        
			if (err)                          
				throw err;            
			let dbo=db.db("WT");     
			dbo.collection("kavinbankt").findOne({mail:req.body.from.mail},(err,result)=>
				{
					if(err)
						throw err;
					else
					{
					//	console.log(result);
						res.send(JSON.stringify(result));
					}

				});
			db.close();
		});
});
app.get('/viewc',(req,res)=>{
	MongoClient.connect(url, function(err, db)
		{
			if (err)
				throw err;
			let dbo=db.db("WT");
			dbo.collection("kavinbankc").find({}).toArray((err,result)=>             
				{                         
					// console.log(result);
					res.send(JSON.stringify(result));
				});             
			db.close();
		});
});

app.post("/send",(req,res)=>{
//	console.log(req.body);
	let from,to;
	MongoClient.connect(url, function(err, db) {    

		if (err) throw err;     
		let dbo=db.db("WT");
		let amt=req.body.amt;
		let bal1,bal2;
		dbo.collection("kavinbankc").findOne({mail:req.body.from.mail},(err,result)=>{
			if(err)
				throw err;
			else
			{
				bal1=result.bal;
			//	console.log(bal1);                  
			}
		});
		dbo.collection("kavinbankc").findOne({mail:req.body.to.mail},(err,result)=>{            
			if(err)                           
				throw(err);                      
			else     
			{
				bal2=result.bal; 
			//	console.log(bal2);
			}
		});
		let t=setTimeout(after,2000);
		function after()
		{
			if(bal1&&bal2)
			{
				bal1-=amt;
				bal2+=amt;
			}
			let query={mail:req.body.from.mail};                       let update={$push:{"t":{mail:req.body.to.mail,p:req.body.to.name,amt:amt,type:"Debited",time:Date()}}};
			dbo.collection("kavinbankt").updateOne(query,update,(err,result)=>{                                                                if(err)                                                            throw(err);
				//else                                                              console.log(result);
			});
			query={mail:req.body.to.mail};                             update={$push:{"t":{mail:req.body.from.mail,p:req.body.from.name,amt:amt,type:"Credited",time:Date()}}};
			dbo.collection("kavinbankt").updateOne(query,update,(err,result)=>{                                                                if(err)                                                            throw(err);
				//else                                                               console.log(result);                   
			});
			query={mail:req.body.from.mail};                           update={$set:{"bal":bal1}};
			dbo.collection("kavinbankc").updateOne(query,update,(err,result)=>{                                                                if(err)                                                            throw(err);
				//else                                                               console.log(result);                   
			});
			query={mail:req.body.to.mail};
			update={$set:{"bal":bal2}};
			dbo.collection("kavinbankc").updateOne(query,update,(err,result)=>{                                                                if(err)                                                            throw(err);       
				//else            
				//console.log(result);                   
			});
			res.send("Amount of"+amt+" sent successfully to "+req.body.to.name+" ("+req.body.to.mail+")")
			db.close();
		}

	});
});

app.listen(PORT, () => console.log(`Listening on ${PORT }`));

