// ===================================
// NORTHLINE HOME SERVICES - BOOKING JS
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================
    // TERMS & PRIVACY MODAL SYSTEM
    // ==================
    
    const termsModal = document.getElementById('termsModal');
    const privacyModal = document.getElementById('privacyModal');
    const viewTermsBtn = document.getElementById('viewTermsBtn');
    const viewPrivacyBtn = document.getElementById('viewPrivacyBtn');
    const closeTermsModal = document.getElementById('closeTermsModal');
    const closePrivacyModal = document.getElementById('closePrivacyModal');
    const acceptTermsBtn = document.getElementById('acceptTermsBtn');
    const acceptPrivacyBtn = document.getElementById('acceptPrivacyBtn');
    const agreeCheckbox = document.getElementById('agreeTerms');
    const termsStatus = document.getElementById('termsStatus');
    const privacyStatus = document.getElementById('privacyStatus');
    const termsBody = document.getElementById('termsBody');
    const privacyBody = document.getElementById('privacyBody');
    
    let termsScrolled = false;
    let privacyScrolled = false;
    let termsAccepted = false;
    let privacyAccepted = false;
    
    // ==================
    // OPEN TERMS MODAL
    // ==================
    
    viewTermsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.classList.add('show');
        termsScrolled = false;
        acceptTermsBtn.disabled = true;
    });
    
    // ==================
    // OPEN PRIVACY MODAL
    // ==================
    
    viewPrivacyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        privacyModal.classList.add('show');
        privacyScrolled = false;
        acceptPrivacyBtn.disabled = true;
    });
    
    // ==================
    // CLOSE MODALS
    // ==================
    
    closeTermsModal.addEventListener('click', function() {
        termsModal.classList.remove('show');
    });
    
    closePrivacyModal.addEventListener('click', function() {
        privacyModal.classList.remove('show');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === termsModal) {
            termsModal.classList.remove('show');
        }
        if (e.target === privacyModal) {
            privacyModal.classList.remove('show');
        }
    });
    
    // ==================
    // DETECT SCROLL IN IFRAME (Terms)
    // ==================
    
    const termsIframe = termsBody.querySelector('iframe');
    if (termsIframe) {
        termsIframe.addEventListener('load', function() {
            try {
                const iframeDoc = termsIframe.contentDocument || termsIframe.contentWindow.document;
                
                iframeDoc.addEventListener('scroll', function() {
                    checkScroll(iframeDoc, 'terms');
                });
                
                // Also check on iframe window scroll
                termsIframe.contentWindow.addEventListener('scroll', function() {
                    checkScroll(iframeDoc, 'terms');
                });
            } catch (e) {
                // If iframe is from different origin, use fallback
                console.log('Unable to access iframe content, using fallback scroll detection');
                setTimeout(() => {
                    termsScrolled = true;
                    acceptTermsBtn.disabled = false;
                }, 3000); // Enable after 3 seconds as fallback
            }
        });
    }
    
    // ==================
    // DETECT SCROLL IN IFRAME (Privacy)
    // ==================
    
    const privacyIframe = privacyBody.querySelector('iframe');
    if (privacyIframe) {
        privacyIframe.addEventListener('load', function() {
            try {
                const iframeDoc = privacyIframe.contentDocument || privacyIframe.contentWindow.document;
                
                iframeDoc.addEventListener('scroll', function() {
                    checkScroll(iframeDoc, 'privacy');
                });
                
                // Also check on iframe window scroll
                privacyIframe.contentWindow.addEventListener('scroll', function() {
                    checkScroll(iframeDoc, 'privacy');
                });
            } catch (e) {
                // If iframe is from different origin, use fallback
                console.log('Unable to access iframe content, using fallback scroll detection');
                setTimeout(() => {
                    privacyScrolled = true;
                    acceptPrivacyBtn.disabled = false;
                }, 3000); // Enable after 3 seconds as fallback
            }
        });
    }
    
    // ==================
    // CHECK SCROLL POSITION
    // ==================
    
    function checkScroll(doc, type) {
        const scrollTop = doc.documentElement.scrollTop || doc.body.scrollTop;
        const scrollHeight = doc.documentElement.scrollHeight || doc.body.scrollHeight;
        const clientHeight = doc.documentElement.clientHeight || doc.body.clientHeight;
        
        // User has scrolled to bottom (with 50px tolerance)
        if (scrollTop + clientHeight >= scrollHeight - 50) {
            if (type === 'terms') {
                termsScrolled = true;
                acceptTermsBtn.disabled = false;
            } else if (type === 'privacy') {
                privacyScrolled = true;
                acceptPrivacyBtn.disabled = false;
            }
        }
    }
    
    // ==================
    // ACCEPT TERMS
    // ==================
    
    acceptTermsBtn.addEventListener('click', function() {
        termsAccepted = true;
        termsModal.classList.remove('show');
        termsStatus.textContent = 'Read';
        termsStatus.classList.add('read');
        updateAgreementCheckbox();
    });
    
    // ==================
    // ACCEPT PRIVACY
    // ==================
    
    acceptPrivacyBtn.addEventListener('click', function() {
        privacyAccepted = true;
        privacyModal.classList.remove('show');
        privacyStatus.textContent = 'Read';
        privacyStatus.classList.add('read');
        updateAgreementCheckbox();
    });
    
    // ==================
    // UPDATE AGREEMENT CHECKBOX
    // ==================
    
    function updateAgreementCheckbox() {
        if (termsAccepted && privacyAccepted) {
            agreeCheckbox.disabled = false;
            document.querySelector('.checkbox-note').textContent = 'You may now check this box to agree to the terms.';
            document.querySelector('.checkbox-note').style.color = '#28A745';
        }
    }
    
    // ==================
    // FORM VALIDATION
    // ==================
    
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all required fields
            const requiredFields = bookingForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value || (field.type === 'checkbox' && !field.checked) || (field.type === 'radio' && !bookingForm.querySelector(`input[name="${field.name}"]:checked`))) {
                    isValid = false;
                    field.style.borderColor = '#DC3545';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!agreeCheckbox.checked) {
                alert('You must read and agree to the Terms & Conditions and Privacy Policy.');
                return;
            }
            
            // Collect form data
            const formData = new FormData(bookingForm);
            const data = {};
            
            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                if (data[key]) {
                    // Handle multiple values (like checkboxes)
                    if (Array.isArray(data[key])) {
                        data[key].push(value);
                    } else {
                        data[key] = [data[key], value];
                    }
                } else {
                    data[key] = value;
                }
            }
            
            // Store in localStorage (for demonstration - in production, send to server)
            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            data.id = 'BOOK-' + Date.now();
            data.status = 'Pending';
            data.submittedAt = new Date().toISOString();
            bookings.push(data);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            // Show success message
            alert('Booking request submitted successfully! We will send you a price quote within 24 hours via email or Messenger.');
            
            // Reset form
            bookingForm.reset();
            termsAccepted = false;
            privacyAccepted = false;
            termsStatus.textContent = 'Not Read';
            termsStatus.classList.remove('read');
            privacyStatus.textContent = 'Not Read';
            privacyStatus.classList.remove('read');
            agreeCheckbox.disabled = true;
            document.querySelector('.checkbox-note').textContent = 'You must read both documents to enable this checkbox.';
            document.querySelector('.checkbox-note').style.color = '';
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
    
});
