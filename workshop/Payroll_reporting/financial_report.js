document.getElementById("filterForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const department = document.getElementById("department").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const position = document.getElementById("position").value;
    const minSalary = document.getElementById("minSalary").value;
    const maxSalary = document.getElementById("maxSalary").value;

    // Fetch filtered data from the backend
    const response = await fetch("fetch_financial_report.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department, startDate, endDate, position, minSalary, maxSalary }),
    });

    const data = await response.json();
    if (data.success) {
        populateTables(data.records);
    } else {
        alert("No records found");
    }
});

function populateTables(records) {
    const employeeTableBody = document.getElementById("employeeTableBody");
    const addonsTableBody = document.getElementById("addonsTableBody");
    const deductionsTableBody = document.getElementById("deductionsTableBody");
    const netPayTableBody = document.getElementById("netPayTableBody");

    // Clear existing rows
    employeeTableBody.innerHTML = "";
    addonsTableBody.innerHTML = "";
    deductionsTableBody.innerHTML = "";
    netPayTableBody.innerHTML = "";

    // Populate rows
    records.forEach((record) => {
        // Employee Table
        employeeTableBody.innerHTML += `
            <tr>
                <td>${record.Employee_id}</td>
                <td>${record.employee_name}</td>
                <td>${record.position}</td>
                <td>${record.department}</td>
                <td>${record.base_salary}</td>
            </tr>`;

        // Add-ons Table
        addonsTableBody.innerHTML += `
            <tr>
                <td>${record.bonuses}</td>
                <td>${record.incentives}</td>
                <td>${record.allowances}</td>
            </tr>`;

        // Deductions Table
        deductionsTableBody.innerHTML += `
            <tr>
                <td>${record.tax_deductions}</td>
                <td>${record.insurance_deductions}</td>
                <td>${record.retirement_contributions}</td>
            </tr>`;

        // Net Pay Table
        netPayTableBody.innerHTML += `
            <tr>
                <td>${record.net_pay}</td>
            </tr>`;
    });
}

// Handle Export to CSV
document.getElementById("exportCsvButton").addEventListener("click", () => {
    const data = getReportDataFromTables();
    exportToCsv(data);
});

// Handle Export to PDF
document.getElementById("exportPdfButton").addEventListener("click", () => {
    const data = getReportDataFromTables();
    exportToPdf(data);
});

// Function to extract data from tables
function getReportDataFromTables() {
    const reportData = {
        employeeTable: [],
        addonsTable: [],
        deductionsTable: [],
        netPayTable: []
    };

    // Extract Employee Table data
    document.querySelectorAll("#employeeTableBody tr").forEach((row) => {
        const rowData = Array.from(row.children).map(cell => cell.textContent);
        reportData.employeeTable.push(rowData);
    });

    // Extract Add-ons Table data
    document.querySelectorAll("#addonsTableBody tr").forEach((row) => {
        const rowData = Array.from(row.children).map(cell => cell.textContent);
        reportData.addonsTable.push(rowData);
    });

    // Extract Deductions Table data
    document.querySelectorAll("#deductionsTableBody tr").forEach((row) => {
        const rowData = Array.from(row.children).map(cell => cell.textContent);
        reportData.deductionsTable.push(rowData);
    });

    // Extract Net Pay Table data
    document.querySelectorAll("#netPayTableBody tr").forEach((row) => {
        const rowData = Array.from(row.children).map(cell => cell.textContent);
        reportData.netPayTable.push(rowData);
    });

    return reportData;
}

// Function to export data to CSV
function exportToCsv(data) {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add header row for all columns
    csvContent += "Employee ID,Employee Name,Position,Department,Base Salary,Bonuses,Incentives,Allowances,Tax Deductions,Insurance Deductions,Retirement Contributions,Net Pay\n";

    // Combine rows from all tables into one unified table
    const numRows = data.employeeTable.length;
    for (let i = 0; i < numRows; i++) {
        const row = [
            data.employeeTable[i][0], // Employee ID
            data.employeeTable[i][1], // Employee Name
            data.employeeTable[i][2], // Position
            data.employeeTable[i][3], // Department
            data.employeeTable[i][4], // Base Salary
            data.addonsTable[i][0],   // Bonuses
            data.addonsTable[i][1],   // Incentives
            data.addonsTable[i][2],   // Allowances
            data.deductionsTable[i][0], // Tax Deductions
            data.deductionsTable[i][1], // Insurance Deductions
            data.deductionsTable[i][2], // Retirement Contributions
            data.netPayTable[i][0]      // Net Pay
        ];

        csvContent += row.join(",") + "\n";
    }

    // Trigger file download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
}

// Function to export data to PDF
function exportToPdf(data) {
    const { jsPDF } = window.jspdf; // Assuming jsPDF library is included
    const doc = new jsPDF();

    // Add column headers
    doc.text("Employee Payroll Report", 10, 10);
    doc.text("Employee ID, Employee Name, Position, Department, Base Salary, Bonuses, Incentives, Allowances, Tax Deductions, Insurance Deductions, Retirement Contributions, Net Pay", 10, 20);

    let yPosition = 30;

    // Combine rows from all tables into one unified table and add to PDF
    const numRows = data.employeeTable.length;
    for (let i = 0; i < numRows; i++) {
        const row = [
            data.employeeTable[i][0], // Employee ID
            data.employeeTable[i][1], // Employee Name
            data.employeeTable[i][2], // Position
            data.employeeTable[i][3], // Department
            data.employeeTable[i][4], // Base Salary
            data.addonsTable[i][0],   // Bonuses
            data.addonsTable[i][1],   // Incentives
            data.addonsTable[i][2],   // Allowances
            data.deductionsTable[i][0], // Tax Deductions
            data.deductionsTable[i][1], // Insurance Deductions
            data.deductionsTable[i][2], // Retirement Contributions
            data.netPayTable[i][0]      // Net Pay
        ];

        doc.text(row.join(", "), 10, yPosition);
        yPosition += 10;
    }

    // Save PDF
    doc.save("report.pdf");
}

