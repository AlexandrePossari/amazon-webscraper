document.getElementById('scrapeButton').addEventListener('click', async () => {
    const keyword = document.getElementById('keyword').value;
    if (!keyword) {
        alert('Please enter a search keyword.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/scrape?keyword=${encodeURIComponent(keyword)}`);
        const products = await response.json();
        displayResults(products);
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching data.');
    }
});

function displayResults(products) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (products.length === 0) {
        resultsDiv.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const productImage = document.createElement('img');
        productImage.src = product.imageUrl || 'placeholder.jpg';
        productImage.alt = product.title;

        const productDetails = document.createElement('div');
        productDetails.classList.add('product-details');

        const productTitle = document.createElement('h2');
        productTitle.textContent = product.title;

        const productRating = document.createElement('p');
        productRating.textContent = `Rating: ${product.rating || 'N/A'} stars`;

        const productReviews = document.createElement('p');
        productReviews.textContent = `Number of reviews: ${product.numberOfReviews || 'N/A'}`;

        productDetails.appendChild(productTitle);
        productDetails.appendChild(productRating);
        productDetails.appendChild(productReviews);

        productDiv.appendChild(productImage);
        productDiv.appendChild(productDetails);

        resultsDiv.appendChild(productDiv);
    });
}
