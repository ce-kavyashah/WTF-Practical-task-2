const fineForm = document.getElementById("fineForm");

const lateDaysInput = document.getElementById("lateDays");
const booksInput = document.getElementById("books");
const memberTypeInput = document.getElementById("memberType");

const rateOutput = document.getElementById("rate");
const basicFineOutput = document.getElementById("basicFine");
const totalFineOutput = document.getElementById("totalFine");

const summaryOutput = document.getElementById("summary");
const errorMessage = document.getElementById("errorMessage");

const PROCESSING_CHARGE = 10;

// Fine rate per late day per book
const rates = {
    student: 5,
    staff: 3,
    visitor: 10
};

// Format amounts in Indian Rupees
function formatRupees(amount) {
    return "₹" + amount;
}

// Calculate fine when the form is submitted
fineForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const lateDays = Number(lateDaysInput.value);
    const books = Number(booksInput.value);
    const memberType = memberTypeInput.value;

    // Validate the inputs
    if (
        lateDaysInput.value.trim() === "" ||
        !Number.isInteger(lateDays) ||
        lateDays < 0 ||
        lateDays > 10
    ) {
        showError("Please enter late days between 0 and 10.");
        return;
    }

    if (
        booksInput.value.trim() === "" ||
        !Number.isInteger(books) ||
        books < 1 ||
        books > 5
    ) {
        showError("Please enter the number of books between 1 and 5.");
        return;
    }

    if (!Object.prototype.hasOwnProperty.call(rates, memberType)) {
        showError("Please select a valid member type.");
        return;
    }

    errorMessage.textContent = "";

    const rate = rates[memberType];

    // Fine per day for all books
    const dailyFine = rate * books;

    // Basic fine for all late days
    const basicFine = dailyFine * lateDays;

    // Add processing charge only if basic fine > 0
    const processingCharge =
        basicFine > 0 ? PROCESSING_CHARGE : 0;

    const totalFine = basicFine + processingCharge;

    // Display the result
    rateOutput.textContent = formatRupees(rate);
    basicFineOutput.textContent = formatRupees(basicFine);
    totalFineOutput.textContent = formatRupees(totalFine);

    // Generate day-wise summary
    generateSummary(
        lateDays,
        books,
        rate,
        dailyFine,
        basicFine,
        processingCharge,
        totalFine
    );

    // Move the result into view
    document.getElementById("results").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// Display an error message
function showError(message) {
    errorMessage.textContent = message;
}

// Generate the detailed day-wise table
function generateSummary(
    lateDays,
    books,
    rate,
    dailyFine,
    basicFine,
    processingCharge,
    totalFine
) {
    if (lateDays === 0) {
        summaryOutput.innerHTML = `
            <p>No late days. No fine is applicable.</p>
            <p>Books: ${books} | Fine per day per book: ${formatRupees(rate)}</p>
            <p>Processing charge: ${formatRupees(processingCharge)}</p>
            <p><strong>Total payable: ${formatRupees(totalFine)}</strong></p>
        `;
        return;
    }

    let tableHTML = `
        <p>
            Books: ${books} |
            Fine per day per book: ${formatRupees(rate)} |
            Fine per day for all books: ${formatRupees(dailyFine)}
        </p>

        <table class="summary-table">
            <thead>
                <tr>
                    <th>Late day</th>
                    <th>Fine per book</th>
                    <th>Number of books</th>
                    <th>Daily fine</th>
                    <th>Cumulative fine</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let day = 1; day <= lateDays; day++) {
        const cumulativeFine = dailyFine * day;

        tableHTML += `
            <tr>
                <td>Day ${day}</td>
                <td>${formatRupees(rate)}</td>
                <td>${books}</td>
                <td>${formatRupees(dailyFine)}</td>
                <td>${formatRupees(cumulativeFine)}</td>
            </tr>
        `;
    }

    tableHTML += `
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4">Basic fine</td>
                    <td>${formatRupees(basicFine)}</td>
                </tr>
                <tr>
                    <td colspan="4">Processing charge</td>
                    <td>${formatRupees(processingCharge)}</td>
                </tr>
                <tr>
                    <td colspan="4">Total payable</td>
                    <td>${formatRupees(totalFine)}</td>
                </tr>
            </tfoot>
        </table>
    `;

    summaryOutput.innerHTML = tableHTML;
}