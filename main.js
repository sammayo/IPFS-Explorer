const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const PORT_NUM = 8001;
const artifact = require("./build/contracts/IPFSExplorer.json");
const ipfsInteractor = require("./sendToIPFS.js");

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '100 mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '100 mb'}));

const VIEWS = {
    main: "newsfeed.ejs"
};

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render(VIEWS.main);
});

app.post("/uploadipfs", async (req, res) => {
	let fileName = req.body.file.name;
	let contents = req.body.file.contents;
	let hash = await ipfsInteractor.upload(fileName, contents);
	res.send({hash: hash});
});

app.get("/downloadipfs", async (req, res) => {
	let hash = req.query.hashToDl;
	let content = await ipfsInteractor.download(hash);
	//TODO: Send back a file
	res.set("Content-Disposition", "attachment");
	res.send({data: content['data'], name: content['name']});
});

app.get("/downloadartifact", (req, res) => {
	res.send(artifact);
})

app.get("/getpostsnewsfeed", (req, res) => {
	res.send({
		posts: [
			{
				timestamp: 1,
				text: "",
				image: "https://www.takemefishing.org/tmf/assets/images/fish/dolphinfish-464x170.png"
			},
			{
				timestamp: 1,
				text: "",
				image: "https://www.takemefishing.org/tmf/assets/images/fish/dolphinfish-464x170.png"
			}
		]
	});
});

app.listen(PORT_NUM, () => console.log("Distribute the Press --> Profit"));
