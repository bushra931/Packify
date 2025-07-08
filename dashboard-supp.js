// File upload functionality
        function triggerFileUpload() {
            document.getElementById('fileInput').click();
        }

        function handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                // Show loading animation
                document.getElementById('loadingArea').style.display = 'block';
                document.getElementById('uploadArea').style.display = 'none';
                
                // Simulate AI analysis
                setTimeout(() => {
                    // Hide loading and show results
                    document.getElementById('loadingArea').style.display = 'none';
                    document.getElementById('uploadArea').style.display = 'block';
                    
                    // Show analysis result
                    showAnalysisResult(file.name);
                }, 3000);
            }
        }

        function showAnalysisResult(filename) {
            const result = {
                name: filename,
                score: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
                recommendation: "Single-wall corrugated cardboard",
                savings: "$" + (Math.random() * 50 + 10).toFixed(2)
            };
            
            alert(`Analysis Complete!\n\nProduct: ${result.name}\nSustainability Score: ${result.score}/100\nRecommended Material: ${result.recommendation}\nEstimated Savings: ${result.savings}`);
        }

        // Drag and drop functionality
        const uploadArea = document.getElementById('uploadArea');
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload({ target: { files: files } });
            }
        });

        // Navigation functions
        function showNotifications() {
            alert('Notifications:\n\n• New sustainability guidelines available\n• Your monthly report is ready\n• 3 new material recommendations');
        }

        function showProfile() {
            alert('Profile Options:\n\n• Account Settings\n• Billing Information\n• API Keys\n• Logout');
        }

        function viewReports() {
            alert('Redirecting to detailed analytics dashboard...');
        }

        function downloadData() {
            alert('Preparing your analysis data for download...');
        }

        function scheduleConsultation() {
            alert('Opening calendar to schedule a sustainability consultation with our experts...');
        }

        // Update dashboard stats periodically
        function updateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const text = stat.textContent;
        const currentValue = parseFloat(text.replace(/[^0-9.]/g, ''));
        const newValue = currentValue + Math.floor(Math.random() * 3);

        if (text.includes('K')) {
            stat.textContent = '$' + newValue + 'K';
        } else if (text.includes('%')) {
            stat.textContent = Math.min(newValue, 100) + '%';
        } else if (text.includes('t')) {
            stat.textContent = (newValue / 1000).toFixed(1) + 't';
        } else {
            stat.textContent = Math.round(newValue).toLocaleString();
        }
    });
}

        /*function updateStats() {
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                const currentValue = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
                const newValue = currentValue + Math.floor(Math.random() * 3);
                
                if (stat.textContent.includes('
                )) {
                    stat.textContent = '
                 + newValue + 'K';
                } else if (stat.textContent.includes('%')) {
                    stat.textContent = Math.min(newValue, 100) + '%';
                } else if (stat.textContent.includes('t')) {
                    stat.textContent = (newValue / 1000).toFixed(1) + 't';
                } else {
                    stat.textContent = newValue.toLocaleString();
                }
            });
        }*/

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            // Update stats every 30 seconds for demo
            setInterval(updateStats, 30000);
            
            // Add hover effects to buttons
            document.querySelectorAll('button').forEach(button => {
                button.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                });
                
                button.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                });
            });
            
            // Animate score circle on load
            animateScoreCircle();
        });

        function animateScoreCircle() {
            const circle = document.querySelector('.score-circle');
            const score = 85; // Current score
            const percentage = (score / 100) * 360;
            
            circle.style.background = `conic-gradient(#00a652 0deg ${percentage}deg, #e0e6ed ${percentage}deg 360deg)`;
        }

        // Responsive menu toggle for mobile
        function toggleMobileMenu() {
            const userSection = document.querySelector('.user-section');
            userSection.style.display = userSection.style.display === 'none' ? 'flex' : 'none';
        }

        // Add some dynamic content updates
        setInterval(() => {
            const notificationCount = document.querySelector('.notification-count');
            const currentCount = parseInt(notificationCount.textContent);
            if (Math.random() > 0.7) { // 30% chance to add notification
                notificationCount.textContent = currentCount + 1;
            }
        }, 60000); // Check every minute
