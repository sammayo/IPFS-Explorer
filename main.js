const express = require("express");
const path = require("path");
const app = express();
const PORT_NUM = 8001;

app.use(express.static(path.join(__dirname, 'public')));

const VIEWS = {
    main: "index.ejs"
};

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render(VIEWS.main);
});

app.listen(PORT_NUM, () => console.log("Distribute the Press --> Profit"));
