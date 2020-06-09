const express =require('express');
const bodyParser=require('body-parser');
const promoRouter =express.Router();

promoRouter.use(bodyParser.json());
//for all promotions
promoRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('All promotions coming your way!');
})
.post((req,res,next)=>{
    res.end('Will add the promotion: ' + req.body.name+' with details: '+ req.body.description);
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('Put operation not supported on promotions!');
})
.delete((req,res,next)=>{
    res.end('deleting all promotions!');
});

//for specific promotions
promoRouter.route('/:promoId')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Getting promo: '+req.params.promoId+' details for you!');
})
.post((req,res,next) => {
    res.statusCode=403;
    res.end('Post operation not supported on a particular promotion');
})
.put((req,res,next)=>{
    res.write('Updating promotion: '+req.params.promoId);
    res.end(' Updated promotion: '+req.body.name+' with details: '+req.body.description);
})
.delete((req,res,next)=>{
    res.end('deleting promotion: '+req.params.promoId);
});

module.exports=promoRouter;