// Retrieve stored quotes or initialize default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

// Retrieve last selected category filter from localStorage
let lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";

// Function to populate category dropdown dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

    const uniqueCategories = [...new Set(quotes.map(q => q.category))];

    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category
    categoryFilter.value = lastSelectedCategory;
}

// Function to filter quotes by selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);

    const filteredQuotes = selectedCategory === "all" 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);

    displayQuote(filteredQuotes);
}

// Function to display a random quote from the filtered list
function displayQuote(filteredQuotes = quotes) {
    if (filteredQuotes.length === 0) {
        document.getElementById("quoteDisplay").innerText = "No quotes available!";
        return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];

    document.getElementById("quoteDisplay").innerText = `"${quote.text}" - ${quote.category}`;
    
    // Store last viewed quote in session storage
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        localStorage.setItem("quotes", JSON.stringify(quotes));
        alert("Quote added successfully!");

        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";

        populateCategories(); // Update categories dynamically
        filterQuotes(); // Refresh displayed quotes
    } else {
        alert("Please enter both quote text and category.");
    }
}

// Function to export quotes as a JSON file
function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                localStorage.setItem("quotes", JSON.stringify(quotes));
                alert("Quotes imported successfully!");

                populateCategories(); // Update categories dynamically
                filterQuotes(); // Refresh displayed quotes
            } else {
                alert("Invalid JSON format!");
            }
        } catch (error) {
            alert("Error parsing JSON file!");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", () => filterQuotes());
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

// Initialize page with stored values
window.onload = function () {
    populateCategories();
    filterQuotes();

    // Load last viewed quote from session storage if available
    const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
    if (lastQuote) {
        document.getElementById("quoteDisplay").innerText = `"${lastQuote.text}" - ${lastQuote.category}`;
    }
};
