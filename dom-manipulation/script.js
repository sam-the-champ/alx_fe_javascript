document.addEventListener("DOMContentLoaded", () => {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    
    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    function showRandomQuote() {
        if (quotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const quote = quotes[randomIndex];
            quoteDisplay.innerHTML = `<p>${quote.text} - <em>${quote.category}</em></p>`;
            sessionStorage.setItem("lastQuote", JSON.stringify(quote));
        } else {
            quoteDisplay.innerHTML = "<p>No quotes available.</p>";
        }
    }

    newQuoteButton.addEventListener("click", showRandomQuote);
    
    const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
    if (lastQuote) {
        quoteDisplay.innerHTML = `<p>${lastQuote.text} - <em>${lastQuote.category}</em></p>`;
    } else {
        showRandomQuote();
    }

    function addQuote() {
        const quoteText = document.getElementById("newQuoteText").value.trim();
        const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (quoteText && quoteCategory) {
            quotes.push({ text: quoteText, category: quoteCategory });
            saveQuotes();
            alert("Quote added successfully!");
            document.getElementById("newQuoteText").value = "";
            document.getElementById("newQuoteCategory").value = "";
        } else {
            alert("Please enter both a quote and a category.");
        }
    }

    function createAddQuoteForm() {
        const formContainer = document.createElement("div");
        formContainer.innerHTML = `
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button id="addQuoteButton">Add Quote</button>
            <button id="exportQuotes">Export Quotes</button>
            <input type="file" id="importFile" accept=".json" />
        `;
        document.body.appendChild(formContainer);

        document.getElementById("addQuoteButton").addEventListener("click", addQuote);
        document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);
        document.getElementById("importFile").addEventListener("change", importFromJsonFile);
    }

    function exportToJsonFile() {
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

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                if (Array.isArray(importedQuotes)) {
                    quotes.push(...importedQuotes);
                    saveQuotes();
                    alert("Quotes imported successfully!");
                } else {
                    alert("Invalid JSON format.");
                }
            } catch (error) {
                alert("Error parsing JSON file.");
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }

    createAddQuoteForm();
});