const axios = require('axios');
const { JSDOM } = require('jsdom');

exports.scrape = async (req, res, next) => {
    const keyword = req.query.keyword;
    //Verify if keyword is not null
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword query parameter is required' });
    }

    try {
        const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
        //Getting the HTML page
        const response = await axios.get(url);
        //Parsing HTML content
        const dom = new JSDOM(response.data);
        const document = dom.window.document;

        //Selecting all products
        const productElements = document.querySelectorAll('.s-result-item');

        //Extracting details from each product
        const products = Array.from(productElements).map(productElement => {
            const titleElement = productElement.querySelector('h2 .a-link-normal');
            const ratingElement = productElement.querySelector('.a-icon-star-small span.a-icon-alt');
            const reviewsElement = productElement.querySelector('.a-size-small .a-size-base');
            const imageElement = productElement.querySelector('.s-image');

            return {
                title: titleElement ? titleElement.textContent.trim() : null,
                //Getting rating as a float
                rating: ratingElement ? parseFloat(ratingElement.textContent.split(' ')[0]) : null,
                numberOfReviews: reviewsElement ? parseInt(reviewsElement.textContent.replace(',', '')) : null,
                imageUrl: imageElement ? imageElement.src : null,
            };
        }).filter(product => product.title);// Validating if product has a title

        // Return the API response
        res.json(products);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        return err;
    }                
};