
const API_URL = "https://wvm5gkmsi7.execute-api.ap-southeast-2.amazonaws.com/submit";

const form = document.getElementById("submissionForm");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitButton");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const studentName = document.getElementById("studentName").value.trim();
    const rollNumber = document.getElementById("rollNumber").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const assignmentTitle = document.getElementById("assignmentTitle").value.trim();
    const file = document.getElementById("file").files[0];

    if (!file) {
        message.style.color = "red";
        message.textContent = "Please select a PDF file.";
        return;
    }

    if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
        message.style.color = "red";
        message.textContent = "Only PDF files are allowed.";
        return;
    }

    if (file.size > 3 * 1024 * 1024) {
        message.style.color = "red";
        message.textContent = "PDF size must not exceed 3 MB.";
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
    message.textContent = "";

    try {
        const base64Content = await convertToBase64(file);

        const submissionData = {
            studentName: studentName,
            rollNumber: rollNumber,
            subject: subject,
            assignmentTitle: assignmentTitle,
            fileName: file.name,
            fileContent: base64Content
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(submissionData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Submission failed.");
        }

        message.style.color = "green";
        message.textContent = "Assignment submitted successfully!";

        form.reset();

    } catch (error) {
        console.error("Submission error:", error);

        message.style.color = "red";
        message.textContent = error.message || "Something went wrong.";
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Assignment";
    }
});

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function () {
            const base64 = reader.result.split(",")[1];
            resolve(base64);
        };

        reader.onerror = function () {
            reject(new Error("Could not read the PDF file."));
        };

        reader.readAsDataURL(file);
    });
}
