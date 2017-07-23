const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const PORT_NUM = 8001;
const artifact = require("./build/contracts/IPFSExplorer.json");

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '100 mb'}));
app.use(bodyParser.urlencoded({extended: true}));

const VIEWS = {
    main: "index.ejs"
};

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render(VIEWS.main);
});

app.post("/uploadipfs", (req, res) => {
	let contents = req.body.file.contents;
	let fileName = req.body.file.name;
	res.send("Ok");
});

app.get("/downloadipfs", (req, res) => {
	let hash = req.query.hashToDl;

	//TODO: Send back a file
	res.set("Content-Disposition", "attachment");
	res.send("Ok");
});

app.get("/downloadartifact", (req, res) => {
	res.send(artifact);
})

app.listen(PORT_NUM, () => console.log("Distribute the Press --> Profit"));
