let key = "4a7bd660e2774d02a2f2142f36ceac33";
let mainContent = document.querySelector(".main-content");
let searchBtn = document.getElementById("searchBtn");
let inputData = document.getElementById("inputData");
let jsonData;

const getData = async (input = '', category = '') => {
    try {
        let apiUrl = `https://newsapi.org/v2/top-headlines?language=en&apiKey=${key}`;
        if (input) apiUrl += `&q=${input}`;
        if (category) apiUrl += `&category=${category}`;

        console.log(`Fetching data from: ${apiUrl}`); // Log the API URL
        let encodedUrl = encodeURIComponent(apiUrl);
        let res = await fetch(`https://api.allorigins.win/raw?url=${encodedUrl}`);
        if (!res.ok) {
            throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        jsonData = await res.json();
        
        console.log('API response:', jsonData); // Log the API response

        if (!jsonData.articles || jsonData.articles.length === 0) {
            throw new Error('No articles found in response');
        }

        displayArticles(jsonData.articles);
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
};

const displayArticles = (articles) => {
    // Clear previous content
    mainContent.innerHTML = "";

    // Filter out articles with urlToImage as 'removed' or not available
    let filteredArticles = articles.filter(article => article.urlToImage && article.urlToImage !== 'removed');

    if (filteredArticles.length > 0) {
        filteredArticles.forEach(article => {
            let card = createArticleCard(article);
            mainContent.appendChild(card);
        });
    }
};

const createArticleCard = (article) => {
    let card = document.createElement("div");
    card.classList.add("card");

    // Check if urlToImage is available and not 'removed'
    let imageSrc = article.urlToImage && article.urlToImage !== 'removed' ? article.urlToImage : 'placeholder-image-url'; // Replace 'placeholder-image-url' with a fallback image URL

    // Check if description is available
    let description = article.description ? article.description : 'No description available';

    card.innerHTML = `
        <img src="${imageSrc}" alt="">
        <h3>${article.title}</h3>
        <p>${description}</p>
    `;
    card.onclick = () => {
        window.open(article.url);
    };

    return card;
};

document.addEventListener("DOMContentLoaded", () => {
    // Ensure the DOM is fully loaded before calling getData
    getData();
});

searchBtn.addEventListener("click", () => {
    let inputText = inputData.value;
    getData(inputText);
});

function navClick(navName) {
    let navItems = document.querySelectorAll("nav ul li");
    navItems.forEach(item => item.style.color = "white");
    
    if (navName === '') {
        document.getElementById("home").style.color = "#C7C8CC";
    } else {
        document.getElementById(navName).style.color = "#C7C8CC";
    }
    
    getData('', navName);
}
