import express,{Application} from 'express'; 
const path = require('path');
const publicPath = path.join(__dirname, '..', 'public');
//for using an import here we need to configure the tsconfig.json
//setting the option module to commonjs

var app: Application = express()
const port: number = 3000;

app.use(express.static('build'))

app.get('*', (req, res) => {    
    res.sendFile(path.join(publicPath, 'index.html')), function(err: any) {             
    if (err) {                 
         res.status(500).send(err) 
         }        
    };
});

app.listen(port, ():void => {
    console.log('Webapp started on port '+ port);
}).on("error",(error:Error)=>{
    console.error('Error occured: ' + error.message);
});