async function fetchNews() {
    try {
        // Merr lajmet nga NewsAPI
        const newsResponse = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=c01e715442cb41b6af50ccdd990dfc5f');
        const newsData = await newsResponse.json();

        // Kontrollo nëse kemi lajme
        if (!newsData.articles || newsData.articles.length === 0) {
            console.error('No news articles found.');
            return;
        }

        // Merr titujt e lajmeve për përkthim
        const titles = newsData.articles.map(article => article.title);

        // Përkthen titujt në shqip duke përdorur LibreTranslate
        const translatedTitles = await Promise.all(titles.map(title => translateText(title)));

        // Përdor të dhënat e përkthyera për të azhurnuar DOM-in
        updateNewsUI(newsData.articles, translatedTitles);
    } catch (error) {
        console.error('Error fetching or translating news:', error);
    }
}

async function translateText(text) {
    try {
        const response = await fetch('https://libretranslate.com/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: 'sq'
            })
        });
        const data = await response.json();
        return data.translatedText;
    } catch (error) {
        console.error('Error translating text:', error);
        return text; // Nëse ndodhi një gabim, kthe tekstin origjinal
    }
}

function updateNewsUI(articles, translations) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    articles.forEach((article, index) => {
        const translatedTitle = translations[index];
        const articleElement = document.createElement('div');
        articleElement.className = 'news-item';
        articleElement.innerHTML = `
            <img src="${article.urlToImage || 'placeholder.jpg'}" alt="${translatedTitle}">
            <div class="content">
                <h2>${translatedTitle}</h2>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Lexo më shumë</a>
            </div>
        `;
        newsContainer.appendChild(articleElement);
    });
}

// Thirr funksionin për të marrë lajmet
fetchNews();
