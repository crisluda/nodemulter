const express = require("express");
const multer = require("multer");
const path = require("path");
const ejs = require("ejs");

const PORT = process.env.PORT || 3000;

const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(/\.[^/.]+$/, "") + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single("image")

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb("images only!")
    }

}

const app = express();


app.use(express.static(__dirname + "public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("index"));

app.post("/upload", (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            res.render("index", {
                msg: err
            })

        } else {
            if (req.file === undefined) {
                res.render("index", {
                    msg: "No File Selected"
                })
            } else {
                res.render("index", {
                    msg: "File Upladed",
                    file: `upload/${req.file.filename}`
                })
            }
        }
    })
});

app.listen(PORT, () =>
    console.log(`server is runing on http://127.0.0.1:${PORT}`)
);