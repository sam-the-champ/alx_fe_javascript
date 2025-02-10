document.addEventListener("DOMContentLoaded", () => {
    const quotesContainer = document.getElementById("quotesContainer");
    const categoryFilter = document.getElementById("categoryFilter");
    const addQuoteBtn = document.getElementById("addQuoteBtn");

    let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
    let lastSelectedCategory = localStorage.getItem("lastSelectedCategory") || "all";

    // Simulated server API
    const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

    // Fetch quotes from the server
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch(SERVER_URL);
            const data = await response.json();
            const serverQuotes = data.map(item => ({
                text: item.title,
                category: "General"
            }));

            // Conflict resolution: merge local and server quotes
            syncQuotes(serverQuotes);
        } catch (error) {
            console.error("Error fetching server data:", error);
        }
    }

    // Sync local and server data (ensures consistency)
    function syncQuotes(serverQuotes) {
        const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
        
        // Merge local and server quotes, avoiding duplicates
        const mergedQuotes = [...new Map([...serverQuotes, ...localQuotes].map(q => [q.text, q])).values()];
        
        quotes = mergedQuotes;
        localStorage.setItem("quotes", JSON.stringify(quotes));
        renderQuotes();
    }

    // Send new quotes to server
    async function syncQuoteWithServer(quote) {
        try {
            const response = await fetch(SERVER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(quote)
            });

            if (!response.ok) {
                throw new Error("Failed to sync with server");
            }
        } catch (error) {
            console.error("Sync Error:", error);
        }
    }

    // Populate categories dynamically
    function populateCategories() {
        const categories = ["all", ...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
        categoryFilter.value = lastSelectedCategory;
    }

    // Filter quotes based on selected category
    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem("lastSelectedCategory", selectedCategory);
        renderQuotes();
    }

    // Render quotes based on category
    function renderQuotes() {
        const selectedCategory = categoryFilter.value;
        quotesContainer.innerHTML = "";
        const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
        
        filteredQuotes.forEach(q => {
            const quoteElement = document.createElement("p");
            quoteElement.textContent = `${q.text} - (${q.category})`;
            quotesContainer.appendChild(quoteElement);
        });
    }

    // Add a new quote
    function addQuote(text, category) {
        const newQuote = { text, category };
        quotes.push(newQuote);
        localStorage.setItem("quotes", JSON.stringify(quotes));

        // Sync with the server
        syncQuoteWithServer(newQuote);

        populateCategories();
        renderQuotes();
    }

    // Periodic Syncing with Server
    setInterval(fetchQuotesFromServer, 60000); // Every 60 seconds

    // Initialize
    fetchQuotesFromServer();
    populateCategories();
    renderQuotes();

    categoryFilter.addEventListener("change", filterQuotes);
    addQuoteBtn.addEventListener("click", () => {
        const text = prompt("Enter a new quote:");
        const category = prompt("Enter category:");
        if (text && category) addQuote(text, category);
    });
});
