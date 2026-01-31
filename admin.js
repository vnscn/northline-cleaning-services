// ===================================
// NORTHLINE HOME SERVICES - ADMIN JS
// ===================================

// IMPORTANT: Change this password in production!
const ADMIN_PASSWORD = 'northline2025';

let currentBookingId = null;
let bookingsChart, serviceChart, revenueChart, cancellationChart;

// ==================
// AUTHENTICATION
// ==================

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('loginError');
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuth', 'true');
        showDashboard();
    } else {
        errorMsg.textContent = 'Incorrect password';
        errorMsg.style.display = 'block';
    }
});

function checkAuth() {
    if (sessionStorage.getItem('adminAuth') === 'true') {
        showDashboard();
    }
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboardScreen').style.display = 'block';
    loadDashboardData();
}

function logout() {
    sessionStorage.removeItem('adminAuth');
    location.reload();
}

// ==================
// LOAD DASHBOARD DATA
// ==================

function loadDashboardData() {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // Update stats
    updateStats(bookings);
    
    // Load bookings table
    loadBookingsTable(bookings);
    
    // Load analytics charts
    loadAnalytics(bookings);
}

function updateStats(bookings) {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'Pending').length;
    const completed = bookings.filter(b => b.status === 'Completed').length;
    const revenue = calculateRevenue(bookings);
    
    document.getElementById('totalBookings').textContent = total;
    document.getElementById('pendingBookings').textContent = pending;
    document.getElementById('completedBookings').textContent = completed;
    document.getElementById('totalRevenue').textContent = '₱' + revenue.toLocaleString();
}

function calculateRevenue(bookings) {
   return bookings
    .filter(b => b.status === 'Completed')
    .reduce((total, booking) => {
        const priceEstimates = {
            'basic': 1150,      // Average of 800-1500
            'standard': 2250,   // Average of 1500-3000
            'deep': 3750        // Average of 2500-5000
        };
        return total + (booking.price || estimated[booking.serviceType] || 0);
    }, 0);
}

// ==================
// BOOKINGS TABLE
// ==================

function loadBookingsTable(bookings) {
    const tbody = document.getElementById('bookingsTableBody');
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No bookings yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = bookings.map(booking => `
    <tr>
        <td>${booking.id}</td>
        <td>${booking.fullName}</td>
        <td>${formatServiceType(booking.serviceType)}</td>
        <td>₱${(booking.price || 0).toLocaleString()}</td>   <!-- NEW price column -->
        <td>${booking.preferredDate}</td>
        <td><span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span></td>
        <td>
            <button class="action-btn btn-view" onclick="viewBooking('${booking.id}')">View</button>
            <select onchange="updateStatus('${booking.id}', this.value)" style="padding: 0.5rem; border-radius: 4px; border: 2px solid var(--gray-300);">
                <option value="">Change Status</option>
                <option value="Pending" ${booking.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="Confirmed" ${booking.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                <option value="Completed" ${booking.status === 'Completed' ? 'selected' : ''}>Completed</option>
                <option value="Cancelled" ${booking.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
        </td>
    </tr>
`).join('');
}

function formatServiceType(type) {
    const types = {
        'basic': 'Basic Cleaning',
        'standard': 'Standard Cleaning',
        'deep': 'Deep Cleaning'
    };
    return types[type] || type;
}

function viewBooking(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) return;
    
    currentBookingId = bookingId;
    
    const detailsHtml = `
        <div class="detail-row">
            <div class="detail-label">Booking ID:</div>
            <div>${booking.id}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Status:</div>
            <div><span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span></div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Full Name:</div>
            <div>${booking.fullName}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Phone:</div>
            <div>${booking.phone}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Email:</div>
            <div>${booking.email || 'Not provided'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Messenger Name:</div>
            <div>${booking.messengerName}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Address:</div>
            <div>${booking.address}, ${booking.barangay}, ${booking.city}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Landmarks:</div>
            <div>${booking.landmarks}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Directions:</div>
            <div>${booking.directions || 'None provided'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Service Type:</div>
            <div>${formatServiceType(booking.serviceType)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Property Type:</div>
            <div>${booking.propertyType}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Bedrooms:</div>
            <div>${booking.bedrooms || 'N/A'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Bathrooms:</div>
            <div>${booking.bathrooms || 'N/A'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Size (sqm):</div>
            <div>${booking.squareMeters || 'N/A'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Preferred Date:</div>
            <div>${booking.preferredDate}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Preferred Time:</div>
            <div>${booking.preferredTime}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Add-ons:</div>
            <div>${booking.addons ? (Array.isArray(booking.addons) ? booking.addons.join(', ') : booking.addons) : 'None'}</div>
        </div>
        <div class="detail-row">
        <div class="detail-label">Price (₱):</div>
        <div>
            <input type="number" id="bookingPrice" value="${booking.price || ''}" min="0" step="100" style="width: 150px; padding: 0.5rem;">
            <small style="color: #666;">(leave blank to use default estimate)</small>
        </div>
    </div>
        <div class="detail-row">
            <div class="detail-label">Will be present:</div>
            <div>${booking.presence === 'yes' ? 'Yes' : 'No'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Special Requests:</div>
            <div>${booking.specialRequests || 'None'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Submitted:</div>
            <div>${new Date(booking.submittedAt).toLocaleString()}</div>
        </div>
        <div style="margin-top: 2rem; text-align: center;">
            <button class="action-btn" style="background: #dc3545; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600;"
                    onclick="deleteBooking('${booking.id}')">
                Delete This Booking
            </button>
        </div>
    `;
    
    document.getElementById('bookingDetails').innerHTML = detailsHtml;
    document.getElementById('bookingNotes').value = booking.notes || '';
    document.getElementById('bookingModal').classList.add('show');
}

function updateStatus(bookingId, newStatus) {
    if (!newStatus) return;
    
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const index = bookings.findIndex(b => b.id === bookingId);
    
    if (index !== -1) {
        bookings[index].status = newStatus;
        localStorage.setItem('bookings', JSON.stringify(bookings));
        loadDashboardData();
    }
}

function saveBookingChanges() {
    if (!currentBookingId) return;
    
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const index = bookings.findIndex(b => b.id === currentBookingId);
    
    if (index !== -1) {
        bookings[index].notes = document.getElementById('bookingNotes').value;
        
        const priceInput = document.getElementById('bookingPrice').value.trim();
        if (priceInput !== '') {
            bookings[index].price = parseFloat(priceInput) || 0;
        } else {
            delete bookings[index].price;
        }
        
        localStorage.setItem('bookings', JSON.stringify(bookings));
        alert('Changes saved successfully');
        loadDashboardData();  // refresh table & stats
    }
}

function closeModal() {
    document.getElementById('bookingModal').classList.remove('show');
    currentBookingId = null;
}
function deleteBooking(bookingId) {
    if (!confirm('Are you sure you want to PERMANENTLY delete this booking? This cannot be undone.')) {
        return;
    }
    
    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings = bookings.filter(b => b.id !== bookingId);
    
    localStorage.setItem('bookings', JSON.stringify(bookings));
    alert('Booking deleted successfully');
    
    closeModal();
    loadDashboardData();  // refresh table, stats, charts
}

// ==================
// ANALYTICS CHARTS
// ==================

function loadAnalytics(bookings) {
    // Destroy existing charts if they exist
    if (bookingsChart) bookingsChart.destroy();
    if (serviceChart) serviceChart.destroy();
    if (revenueChart) revenueChart.destroy();
    if (cancellationChart) cancellationChart.destroy();
    
    // Bookings Over Time
    const bookingsByMonth = getBookingsByMonth(bookings);
    const ctx1 = document.getElementById('bookingsChart').getContext('2d');
    bookingsChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: bookingsByMonth.labels,
            datasets: [{
                label: 'Bookings',
                data: bookingsByMonth.data,
                borderColor: '#5DB5A4',
                backgroundColor: 'rgba(93, 181, 164, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Service Type Distribution
    const serviceTypes = getServiceTypeDistribution(bookings);
    const ctx2 = document.getElementById('serviceChart').getContext('2d');
    serviceChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Basic', 'Standard', 'Deep'],
            datasets: [{
                data: [serviceTypes.basic, serviceTypes.standard, serviceTypes.deep],
                backgroundColor: ['#5DB5A4', '#1B3A5F', '#7DC9B9']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
    
    // Revenue Over Time
    const revenueByMonth = getRevenueByMonth(bookings);
    const ctx3 = document.getElementById('revenueChart').getContext('2d');
    revenueChart = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: revenueByMonth.labels,
            datasets: [{
                label: 'Revenue (₱)',
                data: revenueByMonth.data,
                backgroundColor: '#1B3A5F'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Cancellation Rate
    const cancellationData = getCancellationRate(bookings);
    const ctx4 = document.getElementById('cancellationChart').getContext('2d');
    cancellationChart = new Chart(ctx4, {
        type: 'pie',
        data: {
            labels: ['Completed', 'Cancelled'],
            datasets: [{
                data: [cancellationData.completed, cancellationData.cancelled],
                backgroundColor: ['#28A745', '#DC3545']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

function getBookingsByMonth(bookings) {
    const months = {};
    bookings.forEach(booking => {
        const date = new Date(booking.submittedAt);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        months[monthYear] = (months[monthYear] || 0) + 1;
    });
    
    return {
        labels: Object.keys(months),
        data: Object.values(months)
    };
}

function getServiceTypeDistribution(bookings) {
    return {
        basic: bookings.filter(b => b.serviceType === 'basic').length,
        standard: bookings.filter(b => b.serviceType === 'standard').length,
        deep: bookings.filter(b => b.serviceType === 'deep').length
    };
}

function getRevenueByMonth(bookings) {
    const priceEstimates = {
        'basic': 1150,
        'standard': 2250,
        'deep': 3750
    };
    
    const months = {};
    bookings.filter(b => b.status === 'Completed').forEach(booking => {
        const date = new Date(booking.submittedAt);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        const revenue = priceEstimates[booking.serviceType] || 0;
        months[monthYear] = (months[monthYear] || 0) + revenue;
    });
    
    return {
        labels: Object.keys(months),
        data: Object.values(months)
    };
}

function getCancellationRate(bookings) {
    return {
        completed: bookings.filter(b => b.status === 'Completed').length,
        cancelled: bookings.filter(b => b.status === 'Cancelled').length
    };
}

// ==================
// CSV EXPORT
// ==================

function exportToCSV() {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    if (bookings.length === 0) {
        alert('No bookings to export');
        return;
    }
    
    // CSV headers
    const headers = [
        'ID', 'Status', 'Full Name', 'Phone', 'Email', 'Messenger Name',
        'Address', 'Barangay', 'City', 'Landmarks', 'Directions',
        'Service Type', 'Property Type', 'Bedrooms', 'Bathrooms', 'Square Meters',
        'Preferred Date', 'Preferred Time', 'Add-ons', 'Will Be Present',
        'Special Requests', 'Submitted At', 'Notes'
    ];
    
    // Convert bookings to CSV rows
    const rows = bookings.map(b => [
        b.id,
        b.status,
        b.fullName,
        b.phone,
        b.email || '',
        b.messengerName,
        b.address,
        b.barangay,
        b.city,
        b.landmarks,
        b.directions || '',
        formatServiceType(b.serviceType),
        b.propertyType,
        b.bedrooms || '',
        b.bathrooms || '',
        b.squareMeters || '',
        b.preferredDate,
        b.preferredTime,
        Array.isArray(b.addons) ? b.addons.join('; ') : (b.addons || ''),
        b.presence === 'yes' ? 'Yes' : 'No',
        b.specialRequests || '',
        new Date(b.submittedAt).toLocaleString(),
        b.notes || ''
    ]);
    
    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `northline-bookings-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==================
// INITIALIZE
// ==================

checkAuth();
