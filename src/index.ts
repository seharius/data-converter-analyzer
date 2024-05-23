import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import csv from 'papaparse';
import { parseString } from 'xml2js';

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

const processCSV = (filePath: string) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsedData = csv.parse(fileContent, {
        header: true,
        dynamicTyping: true,
    });
    return parsedData.data;
};

const processXML = (filePath: string) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let parsedData: any;
    parseString(fileContent, (err, result) => {
        if (err) {
            throw new Error('Error parsing XML');
        }
        parsedData = result;
    });
    return parsedData;
};

const processJSON = (filePath: string) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
};

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    let data;
    if (req.file.mimetype === 'text/csv') {
        data = processCSV(filePath);
    } else if (req.file.mimetype === 'application/json') {
        data = processJSON(filePath);
    } else if (req.file.mimetype === 'text/xml') {
        data = processXML(filePath);
    } else {
        return res.status(400).send('Unsupported file type.');
    }
    res.json(data);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
