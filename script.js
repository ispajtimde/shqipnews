async function fetchNews() {
    try {
        const newsResponse = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=c01e715442cb41b6af50ccdd990dfc5f');
        
        // Kontrollo statusin e përgjigjes
        if (!newsResponse.ok) {
            throw new Error(`HTTP error! Status: ${newsResponse.status}`);
        }
        
        const newsData = await newsResponse.json();

        if (!newsData.articles || newsData.articles.length === 0) {
            console.error('No news articles found.');
            return;
        }

        const titles = newsData.articles.map(article => article.title);
        const translatedTitles = await Promise.all(titles.map(title => translateText(title)));
        updateNewsUI(newsData.articles, translatedTitles);
    } catch (error) {
        console.error('Error fetching or translating news:', error);
        document.getElementById('news-container').innerHTML = '<p>Ndodhi një gabim gjatë ngarkimit të lajmeve.</p>';
    }
}

async function translateText(text) {
    try {
        const response = await fetch('https://libretranslate.com/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: text, source: 'en', target: 'sq' })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.translatedText;
    } catch (error) {
        console.error('Error translating text:', error);
        return text; // Kthe tekstin origjinal nëse ndodhi një gabim
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

fetchNews();
