// Fetch employee records from the server
function fetchEmployeeRecords() {
    fetch('fetch_records.php')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('recordsContainer');
            container.innerHTML = ''; // Clear previous content

            if (data.success) {
                const records = data.data;

                if (records.length === 0) {
                    container.innerHTML = '<p>No records available.</p>';
                } else {
                    records.forEach(record => {
                        const recordDiv = document.createElement('div');
                        recordDiv.className = 'record';

                        // Display record details
                        recordDiv.innerHTML = `
                            <h3>Employee ID: ${record.employee_id}</h3>
                            <p>Action: ${record.action_type}</p>
                            <p>Details: ${record.details}</p>
                            <p>Date: ${new Date(record.action_date).toLocaleString()}</p>
                        `;

                        container.appendChild(recordDiv);
                    });
                }
            } else {
                container.innerHTML = '<p>Error fetching records.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching records:', error);
            document.getElementById('recordsContainer').innerHTML = '<p>Error fetching records.</p>';
        });
}

// Initialize the page by fetching records
fetchEmployeeRecords();
