var express=require("express"),
	app=express(),
	request=require("request-promise"),
	cheerio=require("cheerio"),
	json2csv=require("json2csv").parse;

let page,loaded=false;
let urlpath;
let fields=['App Name','App Description','App link','App rank'];
let allapp=[];
let appnameslist=[],descriptionslist=[],rankslist=[],linkslist=[];

app.set("view engine","ejs");
urlpath="https://alternativeto.net/platform/windows/";
let url="";

for(let i=1;i<8;i++){
	page="?p="+String(i);
	url=urlpath+page;
	request(url,function(err,res,html){
	if(!err && res.statusCode==200){
		const $=cheerio.load(html);
		const appnames=$('a.jsx-4009401448');
		const descriptions=$('.description');
		const ranks=$('span.jsx-869847290');
		appnames.each(function(){
			appnameslist.push($(this).text());
			linkslist.push($(this).attr('href'));
		});
		descriptions.each(function(){
			descriptionslist.push($(this).text());
		});
		ranks.each(function(){
			rankslist.push($(this).text());
		});
	}	
});
}

app.get("/",function(req,res){
	if(!loaded){
		for (let y=0;y<appnameslist.length;y++){
			allapp.push({'appname':String(appnameslist[y]),
				   		'appdescription':String(descriptionslist[y]),
			   			'applink':String(linkslist[y]),
			   			'apprank':Number(rankslist[y]),
			 });
		}
		loaded=true;
	}
	res.render("applist",{allapp:JSON.stringify(allapp)});
});

app.get("/csvdownload",function(req,res){
	
	const csvString = json2csv(allapp);
	res.setHeader('Content-disposition', 'attachment; filename=StablX_round2_problem2_webscraped_data.csv');
	res.set('Content-Type', 'text/csv');
	res.status(200).send(csvString);
});

app.listen(3000,function(req,res){
	console.log("AttainU clone");
});