
const API_BASE = "https://wvm5gkmsi7.execute-api.ap-southeast-2.amazonaws.com";

const loadButton = document.getElementById("loadButton");
const tableBody = document.getElementById("submissionTable");
const message = document.getElementById("dashboardMessage");

// Ask for the teacher access key
const teacherKey = sessionStorage.getItem("teacherKey") ||
    prompt("Enter Teacher Access Key:");

if (teacherKey) {
    sessionStorage.setItem("teacherKey", teacherKey);
}

function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}

async function loadSubmissions() {
    if (!teacherKey) {
        showMessage("Teacher access key is required.", "red");
        return;
    }

    loadButton.disabled = true;
    showMessage("Loading submissions...", "#2563eb");

    try {
        const response = await fetch(`${API_BASE}/submissions`, {
            method: "GET",
            headers: {
                "x-teacher-key": teacherKey
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to load submissions.");
        }

        displaySubmissions(result.submissions || []);

        showMessage(
            `Found ${result.submissions.length} submission(s).`,
            "green"
        );

    } catch (error) {
        console.error(error);
        showMessage(error.message, "red");

    } finally {
        loadButton.disabled = false;
    }
}

function displaySubmissions(submissions) {
    tableBody.innerHTML = "";

    if (submissions.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6">No submissions found.</td>
            </tr>
        `;
        return;
    }

    submissions.forEach(item => {
        const row = document.createElement("tr");

        const values = [
            item.studentName,
            item.rollNumber,
            item.subject,
            item.assignmentTitle,
            item.submissionDate
                ? new Date(item.submissionDate).toLocaleString()
                : "N/A"
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value || "N/A";
            row.appendChild(cell);
        });

        const downloadCell = document.createElement("td");
        const downloadButton = document.createElement("button");

        downloadButton.textContent = "Download";
        downloadButton.addEventListener("click", () => {
            downloadAssignment(item.submissionId);
        });

        downloadCell.appendChild(downloadButton);
        row.appendChild(downloadCell);

        tableBody.appendChild(row);
    });
}

async function downloadAssignment(submissionId) {
    try {
        showMessage("Generating download link...", "#2563eb");

        const response = await fetch(
            `${API_BASE}/download/${encodeURIComponent(submissionId)}`,
            {
                method: "GET",
                headers: {
                    "x-teacher-key": teacherKey
                }
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Download failed.");
        }

        window.open(result.downloadUrl, "_blank");

        showMessage("Download link generated.", "green");

    } catch (error) {
        console.error(error);
        showMessage(error.message, "red");
    }
}

loadButton.addEventListener("click", loadSubmissions);
