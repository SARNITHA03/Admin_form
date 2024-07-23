const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3003;

// Simple admin authentication middleware
const adminAuth = (req, res, next) => {
    const { admin } = req.query;
    if (admin === 'true') {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

let submissions = [];

app.post('/submit', upload.fields([{ name: 'Certificate_of_Registration' }, { name: 'Commercial_Registry_document' }, { name: 'company_Organizational_Chart' }, { name: 'Memorandum' }, { name: 'Certificate_of_Shareholders' } , { name: 'Business_Plan' },{ name: 'Address_Proof' },{ name: 'bank_statmnts' },{ name: 'activity_proof' },{ name: 'passport' },{ name: 'address_shareholders' }, { name: 'Signatory' },{ name: 'proof_activity' }]), (req, res) => {
    const data = {
        Company_Name: req.body.Company_Name,
        Company_Number: req.body.Company_Number,
        Company_Website: req.body.Company_Website,
        Country_Of_Registration: req.body.Country_Of_Registration,
        Company_directorsUBO_residence: req.body.Company_directorsUBO_residence,
        cur_type: req.body.cur_type,
        turnover: req.body.turnover,
        files: req.files
    };
    submissions.push(data);
    res.redirect('/confirmation');
});

app.get('/confirmation', (req, res) => {
    res.sendFile(path.join(__dirname,'\public' ,'thank_you.html'));
});

            



app.get('/results', adminAuth, (req, res) => {
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Panel Results</title>
        <link rel="stylesheet" href="css/styles.css">
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            .sidebar {
                width: 200px;
                background: #333;
                color: white;
                position: fixed;
                height: 100%;
                padding: 20px;
            }
            .sidebar h2 {
                margin-top: 0;
            }
            .sidebar ul {
                list-style: none;
                padding: 0;
            }
            .sidebar ul li {
                margin: 10px 0;
            }
            .sidebar ul li a {
                color: white;
                text-decoration: none;
            }
            .content {
                margin-left: 220px;
                padding: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            table, th, td {
                border: 1px solid black;
            }
            th, td {
                padding: 10px;
                text-align: center;
            }
            th {
                background-color: #f2f2f2;
            }
            a{
                color: #a345da;
            }
        </style>
    </head>
    <body>
        <div class="sidebar">
            <h2>Admin Panel</h2>
            <ul>
                <li><a href="index.html">Dashboard</a></li>
                <li><a href="form.html">Form</a></li>
                <li><a href="results?admin=true">Results</a></li>
            </ul>
        </div>
        <div class="content">
            <h1 style="text-align:center">Submissions</h1>
            <table>
                <tr>
                    <th>Full Registered Company Name</th>
                    <th>Company Number</th>
                    <th>Company Website</th>
                    <th>Country Of Registration</th>
                    <th>Company directors/UBO residing in the country</th>
                    <th>Currency</th>
                    <th>Expected annual turnover:</th>
                    <th>Certificate of Registration</th>
                    <th>Extract - Commercial Registry document</th>
                    <th>Company Organizational Chart</th>
                    <th>Memorandum & Articles of Association</th>
                    <th>Certificate of Shareholders and Register of Directors</th>
                    <th>Business Plan</th>
                    <th>Business Proof of Address</th>
                    <th>Business Bank Statements</th>
                    <th>Business Proof of activity</th>
                    <th>Passport of Shareholder + Director</th>
                    <th>Proof of Address of Shareholder(s) and Director(s)</th>
                    <th>Authorized Signatory</th>
                    <th>Business Proof of activity</th>
                </tr>`;
    submissions.forEach(submission => {
        html += `<tr>
            <td>${submission.Company_Name}</td>
            <td>${submission.Company_Number}</td>
            <td>${submission.Company_Website}</td>
            <td>${submission.Country_Of_Registration}</td>
            <td>${submission.Company_directorsUBO_residence ? 'Yes' : 'No'}</td>
            <td>${submission.cur_type}</td>
            <td>${submission.turnover}</td>
            <td><a href="/uploads/${submission.files.Certificate_of_Registration[0].filename}" download="${submission.files.Certificate_of_Registration[0].originalname}">${submission.files.Certificate_of_Registration[0].originalname}</a></td>
            <td><a href="/uploads/${submission.files.Commercial_Registry_document[0].filename}" download="${submission.files.Commercial_Registry_document[0].originalname}">${submission.files.Commercial_Registry_document[0].originalname}</a></td>
            <td><a href="/uploads/${submission.files.company_Organizational_Chart[0].filename}" download="${submission.files.company_Organizational_Chart[0].originalname}">${submission.files.company_Organizational_Chart[0].originalname}</a></td>
            <td><a href="/uploads/${submission.files.Memorandum[0].filename}" download="${submission.files.Memorandum[0].originalname}">${submission.files.Memorandum[0].originalname}</a></td>
            <td><a href="/uploads/${submission.files.Certificate_of_Shareholders[0].filename}" download="${submission.files.Certificate_of_Shareholders[0].originalname}">${submission.files.Certificate_of_Shareholders[0].originalname}</a></td>
            <td><a href="/uploads/${submission.files.Business_Plan[0].filename}" download="${submission.files.Business_Plan[0].originalname}">${submission.files.Business_Plan[0].originalname}</a></td>    
            <td><a href="/uploads/${submission.files.Address_Proof[0].filename}" download="${submission.files.Address_Proof[0].originalname}">${submission.files.Address_Proof[0].originalname}</a></td>
            <td><a href="/uploads/${submission.files.bank_statmnts[0].filename}" download="${submission.files.bank_statmnts[0].originalname}">${submission.files.bank_statmnts[0].originalname}</a></td>
            <td><a href="/uploads/${submission.files.activity_proof[0].filename}" download="${submission.files.activity_proof[0].originalname}">${submission.files.activity_proof[0].originalname}</a></td>
            <td><a href="/uploads/${submission.files.passport[0].filename}" download="${submission.files.passport[0].originalname}">${submission.files.passport[0].originalname}</a></td>
            <td><a href="/uploads/${submission.files.address_shareholders[0].filename}" download="${submission.files.address_shareholders[0].originalname}">${submission.files.address_shareholders[0].originalname}</a></td>
            <td><a href="/uploads/${submission.files.Signatory[0].filename}" download="${submission.files.Signatory[0].originalname}">${submission.files.Signatory[0].originalname}</a></td>
            <td><a href="/uploads/${submission.files.proof_activity[0].filename}" download="${submission.files.proof_activity[0].originalname}">${submission.files.proof_activity[0].originalname}</a></td>

        </tr>`;
    });
    html += `</table>
        </div>
    </body>
    </html>`;
    res.send(html);
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
