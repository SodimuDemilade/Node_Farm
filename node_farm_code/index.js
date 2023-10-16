const fs = require('fs');
// const { test } = require('node:test');
const http = require('http');
const path = require('path');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

///////////FILES///////////
//Blocking, Synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log("File has been written");


//Non-blocking, Asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8',err => {
//                 console.log('Your file has been written.');
//             });
//         });
// });
// });
// console.log("Will read file!");


//////////SERVER/////////
const tempOveview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

//create an array of all the slugs
const slugs = dataObject.map(el => slugify(el.productName, {lower: true}));
console.log(slugs);

const server = http.createServer((req, res) =>{
    const { query, pathname }  = url.parse(req.url, true);

    //OVERVIEW PAGE//
    if (pathname == '/' || pathname == '/overview') {
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        const cardsHTML = dataObject.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOveview.replace('{%PRODUCT_CARDS%}', cardsHTML);
        res.end(output);

    //PRODUCT PAGE//
    } else if (pathname == '/product'){
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        const product = dataObject[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    //API 
    } else if (pathname == '/api') {
        res.writeHead(200, {
            'content-type': 'application/json'
        });
        res.end(data);

    //NOT FOUND
    } else {
        res.writeHead('404', {
            'Content-type': 'text/html',
            'my-own-header': 'Hello-World'
        });
        res.end("<h1>Page not Found!</h1>");
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log("listening to requests on port 8000");
});