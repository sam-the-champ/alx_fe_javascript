document.addEventListener("DOMContentLoaded", () => {
    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");

    function showRandomQuote() {
        if (quotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const quote = quotes[randomIndex];
            quoteDisplay.innerHTML = `<p>${quote.text} - <em>${quote.category}</em></p>`;
        } else {
            quoteDisplay.innerHTML = "<p>No quotes available.</p>";
        }
    }

    newQuoteButton.addEventListener("click", showRandomQuote);
    showRandomQuote();

    function addQuote() {
        const quoteText = document.getElementById("newQuoteText").value.trim();
        const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (quoteText && quoteCategory) {
            quotes.push({ text: quoteText, category: quoteCategory });
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
        `;
        document.body.appendChild(formContainer);

        document.getElementById("addQuoteButton").addEventListener("click", addQuote);
    }

    createAddQuoteForm();
});
