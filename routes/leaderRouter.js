const express =require('express');
const bodyParser=require('body-parser');
const leaderRouter =express.Router();

leaderRouter.use(bodyParser.json());
//for all leaders
leaderRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('All leaders coming your way!');
})
.post((req,res,next)=>{
    res.end('Will add the leader: ' + req.body.name+' with details: '+ req.body.description);
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('Put operation not supported in leaders!');
})
.delete((req,res,next)=>{
    res.end('deleting all leaders!');
});


//for specific leaders
leaderRouter.route('/:leaderId')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Getting leader: '+req.params.leaderId+' details for you!');
})
.post((req,res,next) => {
    res.statusCode=403;
    res.end('Post operation not supported on a particular leader');
})
.put((req,res,next)=>{
    res.write('Updating leader: '+req.params.leaderId);
    res.end(' Updated leader: '+req.body.name+' with details: '+req.body.description);
})
.delete((req,res,next)=>{
    res.end('deleting leader: '+req.params.leaderId);
});

module.exports=leaderRouter;