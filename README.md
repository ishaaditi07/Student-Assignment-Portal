# Cloud-Based Student Assignment Submission System

A serverless web application built using **Amazon Web Services (AWS)** that allows students to submit PDF assignments online and enables teachers to view and download submitted assignments.

## 1. Project Overview

The Cloud-Based Student Assignment Submission System simplifies academic assignment management through cloud computing.

Students can submit assignments by entering their details and uploading PDF files through a web interface. The uploaded documents are stored in Amazon S3, while submission information is maintained in Amazon DynamoDB.

Teachers can access a separate dashboard to retrieve submission records and download the uploaded PDF files.

The backend is implemented using AWS Lambda and exposed through Amazon API Gateway.

## 2. Objectives

- Provide an online platform for student assignment submission.
- Store assignment documents securely in cloud storage.
- Maintain student and assignment details in a database.
- Allow teachers to view submitted assignments.
- Enable secure PDF downloads using temporary access links.
- Demonstrate the integration of serverless AWS services.

## 3. Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- AWS Lambda
- Amazon API Gateway (HTTP API)

### Cloud Services
- Amazon S3 – PDF document storage
- Amazon DynamoDB – Submission metadata storage
- AWS IAM – Access permissions and resource authorization

## 4. System Architecture

```text
             Student / Teacher
                    |
                    v
             Web Application
             HTML, CSS, JS
                    |
                    v
              API Gateway
                    |
                    v
               AWS Lambda
               (Python)
                    |
             +------+------+
             |             |
             v             v
         Amazon S3    DynamoDB
       (PDF Storage)  (Submission
                       Metadata)
```

### Workflow

**Student Submission:**

1. Student enters the required details.
2. Student uploads a PDF assignment.
3. The frontend converts the PDF into Base64 format.
4. The request is sent to Amazon API Gateway.
5. AWS Lambda validates the submitted information and PDF.
6. The PDF is uploaded to Amazon S3.
7. Submission metadata is stored in DynamoDB.
8. A confirmation message is returned to the student.

**Teacher Retrieval:**

1. Teacher opens the dashboard and provides the teacher access key.
2. The dashboard sends a request to API Gateway.
3. Lambda verifies the teacher access key.
4. Submission records are retrieved from DynamoDB.
5. The records are displayed in a table.
6. When the teacher requests a download, Lambda generates a temporary presigned URL.
7. The PDF is accessed from the private S3 bucket.

## 5. Project Structure

```text
student-assignment-system/
│
├── index.html          # Student assignment submission page
├── style.css           # Application styling
├── script.js           # Student submission functionality
├── teacher.html        # Teacher dashboard
└── teacher.js          # Submission retrieval and downloads
```

The Python backend is deployed separately as an AWS Lambda function named `StudentAssignmentHandler`.

## 6. AWS Services Configuration

### Amazon S3

- Created a private S3 bucket for assignment storage.
- Enabled Block Public Access.
- Created an `assignments/` folder.
- Stores uploaded PDF documents.
- Files are accessed through temporary presigned URLs.

### Amazon DynamoDB

- Created a table named `StudentAssignments`.
- Configured `submissionId` as the partition key.
- Uses on-demand capacity mode.
- Stores assignment metadata.

**Stored attributes:**

| Attribute | Description |
|---|---|
| submissionId | Unique submission identifier |
| studentName | Student's name |
| rollNumber | Student's roll number |
| subject | Subject name |
| assignmentTitle | Assignment title |
| fileName | Original PDF filename |
| s3Key | S3 object key |
| submissionDate | Submission timestamp |

### AWS Lambda

Function name: `StudentAssignmentHandler`

Runtime: Python

The Lambda function handles:

- Assignment submission and validation.
- Uploading PDF files to S3.
- Saving submission metadata in DynamoDB.
- Retrieving submission records.
- Generating temporary PDF download links.

### Amazon API Gateway

API type: HTTP API

The following routes are configured:

| HTTP Method | Endpoint | Functionality |
|---|---|---|
| POST | `/submit` | Submit an assignment |
| GET | `/submissions` | Retrieve all submissions |
| GET | `/download/{submissionId}` | Generate a PDF download link |

All three routes are integrated with the same AWS Lambda function.

## 7. Application Features

### Student Module

- Student information collection.
- Assignment title and subject entry.
- PDF file upload.
- File extension and size validation.
- Backend PDF signature validation.
- Submission confirmation.

### Teacher Module

- Teacher access key verification.
- View all submitted assignments.
- Display student and assignment information.
- View submission dates.
- Download submitted PDF files.

### Security Features

- Private S3 bucket with public access blocked.
- IAM-based permissions for AWS resource access.
- Teacher API key verification for teacher endpoints.
- Temporary presigned URLs for PDF downloads.
- Backend validation of uploaded files.

## 8. Setup and Execution

### Prerequisites

- An AWS account.
- Visual Studio Code.
- Live Server extension for VS Code.
- Internet connection.
- A modern web browser.

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
```

### Step 2: Open the Project

Open the project folder in Visual Studio Code.

### Step 3: Configure the API URL

In `script.js` and `teacher.js`, configure the API base URL to point to your deployed API Gateway endpoint.

### Step 4: Configure Teacher Access

The teacher dashboard requires a teacher access key.

The expected key must be configured as the `TEACHER_API_KEY` environment variable in the AWS Lambda function.

Do not commit the actual key to the repository.

### Step 5: Run the Frontend

1. Open `index.html` in VS Code.
2. Right-click the file.
3. Select **Open with Live Server**.
4. The student submission portal opens in the browser.

To access the teacher dashboard, open:

```text
http://127.0.0.1:5500/teacher.html
```

## 9. File Validation

The application implements the following validation:

- Required fields cannot be empty.
- Only PDF files are accepted.
- Maximum supported PDF size is 3 MB.
- Backend checks the PDF signature (`%PDF-`).
- Invalid file submissions are rejected.

## 10. Testing and Results

The application was tested successfully for the following operations:

| Test Case | Expected Result | Status |
|---|---|---|
| Student submits valid PDF | Submission successful | Passed |
| Upload non-PDF file | File rejected | Passed |
| Upload file larger than 3 MB | File rejected | Passed |
| Store PDF in S3 | Object uploaded | Passed |
| Save submission metadata | DynamoDB item created | Passed |
| Retrieve teacher submissions | Records displayed | Passed |
| Generate PDF download URL | Temporary URL generated | Passed |
| Download submitted PDF | PDF downloaded successfully | Passed |

## 11. Limitations

- The frontend currently runs locally using Live Server and is not deployed on public hosting.
- Teacher access uses a shared API key rather than individual user accounts.
- Student submissions do not currently use individual authentication.
- The application currently supports PDF uploads only.
- The application is a demonstration prototype and requires additional security and operational controls before production deployment.

## 12. Future Enhancements

- Deploy the frontend using AWS Amplify.
- Implement individual student and teacher authentication.
- Add assignment deadlines and late submission tracking.
- Add search and filtering by student, subject and assignment.
- Support additional document formats.
- Introduce notifications for successful submissions.
- Add improved monitoring and audit logging.

## 13. Conclusion

The Cloud-Based Student Assignment Submission System demonstrates the practical integration of Amazon S3, AWS Lambda, Amazon DynamoDB and Amazon API Gateway.

The application provides a cloud-based workflow for submitting, storing, retrieving and downloading student assignments.

This project demonstrates the use of serverless architecture, cloud storage, managed NoSQL databases and API integration to solve a practical problem in the education domain.

---

**Project Domain:** Cloud Computing  
**Cloud Platform:** Amazon Web Services (AWS)  
**Project Type:** Serverless Web Application
