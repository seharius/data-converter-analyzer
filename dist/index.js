"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const papaparse_1 = __importDefault(require("papaparse"));
const xml2js_1 = require("xml2js");
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// Serve static files from the "public" directory
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
const processCSV = (filePath) => {
    const fileContent = fs_1.default.readFileSync(filePath, 'utf8');
    const parsedData = papaparse_1.default.parse(fileContent, {
        header: true,
        dynamicTyping: true,
    });
    return parsedData.data;
};
const processXML = (filePath) => {
    const fileContent = fs_1.default.readFileSync(filePath, 'utf8');
    let parsedData;
    (0, xml2js_1.parseString)(fileContent, (err, result) => {
        if (err) {
            throw new Error('Error parsing XML');
        }
        parsedData = result;
    });
    return parsedData;
};
const processJSON = (filePath) => {
    const fileContent = fs_1.default.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
};
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const filePath = path_1.default.join(__dirname, '../uploads', req.file.filename);
    let data;
    if (req.file.mimetype === 'text/csv') {
        data = processCSV(filePath);
    }
    else if (req.file.mimetype === 'application/json') {
        data = processJSON(filePath);
    }
    else if (req.file.mimetype === 'text/xml') {
        data = processXML(filePath);
    }
    else {
        return res.status(400).send('Unsupported file type.');
    }
    res.json(data);
});
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
