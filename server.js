const fs = require('fs');
const http = require('http');
const url = require('url');
const port = 3000;

/*read file synchronusly because it will run at the first time 
if we put into the server it will run again and again when the server met request..*/

const data = fs.readFileSync('./data.json', 'utf-8');
const dataObj = JSON.parse(data)  //This is actual data in form of javascript object..

const homePage = fs.readFileSync('./homePage.html', 'utf-8');
const cardOverview = fs.readFileSync('./card.html', 'utf-8');
const template = fs.readFileSync('./template.html', 'utf-8');
const cardTemplate = fs.readFileSync('./cardTemplate.html', 'utf-8');



//Server...

const replaceTemplate = (temp, product) =>{
    let output = temp.replace(/{%NAME%}/g, product.title);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%RATING%}/g, product.rating.rate);
    output = output.replace(/{%CATEGORY%}/g, product.category);

    return output
}

const server = http.createServer((req, res) => {
    

    console.log(url.parse(req.url))
    const {query, pathname} = (url.parse(req.url))
    //console.log(query, pathname)


    //Overview page or Home page......
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, { 'Content-type' : 'text/html' })


        const cardsHtml = dataObj.map(el => replaceTemplate(template, el)).join('');
        let page = homePage.replace('{%PRODUCTS%}', cardsHtml)

        res.end(page)
    }

    //Product page........
    else if( pathname === '/product'){
        res.writeHead(200,{
            'Content-type':'text/html'
        })
        console.log(query)
        const product = dataObj[query.charAt(3)]
        const output = replaceTemplate(cardTemplate,product)
        let selectedProduct = cardOverview.replace('{%PRODUCTCARD%}', output)
        res.end(selectedProduct);
    }

    //api page.........
    else if( pathname === '/api'){
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(data);
    }

    //File not found page...
    else{
        res.writeHead(404,{
            'Content-type':'text/html'
        })
        res.end("<h1>404 Page Not Found</h1>")
    }
})

server.listen(port,() => {
    console.log("Hey server is now listening on the port 8080..")
})
