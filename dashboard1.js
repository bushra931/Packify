// Sample data for demonstration
        const optimizationData = {
            'smartphone-case': {
                name: 'Smartphone Case',
                dimensions: '15x8x2 cm',
                weight: '150g',
                currentMaterial: 'Standard Cardboard',
                supplier: 'TechSupplier Inc.',
                status: 'pending'
            },
            'plant-pots': {
                name: 'Plant Pots',
                dimensions: '20x20x15 cm',
                weight: '800g',
                currentMaterial: 'Bubble Wrap + Box',
                supplier: 'GreenGarden Co.',
                status: 'processing'
            },
            'leather-wallet': {
                name: 'Leather Wallet',
                dimensions: '12x9x2 cm',
                weight: '120g',
                optimizedMaterial: 'Recycled Corrugated',
                supplier: 'Fashion Forward Ltd.',
                status: 'completed',
                savings: '35% material reduction'
            }
        };

        // Function to optimize product
        function optimizeProduct(productId) {
            const product = optimizationData[productId];
            
            if (product.status === 'pending') {
                // Simulate AI processing
                showNotification('Starting AI optimization for ' + product.name, 'info');
                
                setTimeout(() => {
                    showNotification('AI analysis complete! Recommendations generated.', 'success');
                    
                    // Show optimization results modal
                    showOptimizationModal(product);
                }, 2000);
                
            } else if (product.status === 'processing') {
                showOptimizationProgress(product);
            } else if (product.status === 'completed') {
                viewResults(productId);
            }
        }

        // Function to show optimization modal
        function showOptimizationModal(product) {
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                    <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; width: 90%;">
                        <h3 style="color: #4CAF50; margin-bottom: 20px;">
                            <i class="fas fa-brain"></i> AI Optimization Results
                        </h3>
                        <div style="margin-bottom: 20px;">
                            <strong>Product:</strong> ${product.name}<br>
                            <strong>Recommended Material:</strong> Recycled Corrugated Board (3mm)<br>
                            <strong>Optimal Dimensions:</strong> 14x7.5x1.8 cm<br>
                            <strong>Estimated Savings:</strong> 32% material reduction<br>
                            <strong>CO₂ Reduction:</strong> 0.8 kg per unit<br>
                            <strong>Cost Savings:</strong> $0.45 per unit
                        </div>
                        <div style="display: flex; gap: 10px; justify-content: flex-end;">
                            <button onclick="this.parentElement.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #ddd; border: none; border-radius: 5px; cursor: pointer;">
                                Cancel
                            </button>
                            <button onclick="implementOptimization('${product.name}'); this.parentElement.parentElement.parentElement.remove();" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                                Implement Changes
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        // Function to implement optimization
        function implementOptimization(productName) {
            showNotification(`Optimization implemented for ${productName}`, 'success');
            
            // Update stats
            updateStats();
            
            // Add to activity feed
            addActivity('check', `${productName} optimization implemented successfully`, 'just now');
        }

        // Function to view results
        function viewResults(productId) {
            const product = optimizationData[productId];
            showNotification(`Viewing detailed results for ${product.name}`, 'info');
            
            // In a real application, this would open a detailed results page
            const resultsModal = document.createElement('div');
            resultsModal.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                    <div style="background: white; padding: 30px; border-radius: 15px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                        <h3 style="color: #4CAF50; margin-bottom: 20px;">
                            <i class="fas fa-chart-bar"></i> Optimization Results - ${product.name}
                        </h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
                                <h4>Before Optimization</h4>
                                <p><strong>Material:</strong> ${product.currentMaterial || 'Standard Cardboard'}</p>
                                <p><strong>Cost:</strong> $2.50 per unit</p>
                                <p><strong>CO₂ Impact:</strong> 2.8 kg per unit</p>
                            </div>
                            <div style="background: #e8f5e8; padding: 15px; border-radius: 10px;">
                                <h4>After Optimization</h4>
                                <p><strong>Material:</strong> ${product.optimizedMaterial}</p>
                                <p><strong>Cost:</strong> $1.62 per unit</p>
                                <p><strong>CO₂ Impact:</strong> 1.8 kg per unit</p>
                            </div>
                        </div>
                        <div style="background: #4CAF50; color: white; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                            <h4>Total Savings</h4>
                            <p><strong>Material Reduction:</strong> ${product.savings}</p>
                            <p><strong>Cost Savings:</strong> $0.88 per unit (35% reduction)</p>
                            <p><strong>Environmental Impact:</strong> 1.0 kg CO₂ reduction per unit</p>
                        </div>
                        <button onclick="this.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; float: right;">
                            Close
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(resultsModal);
        }

        // Function to show optimization progress
        function showOptimizationProgress(product) {
            const progressModal = document.createElement('div');
            progressModal.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                    <div style="background: white; padding: 30px; border-radius: 15px; max-width: 400px; width: 90%;">
                        <h3 style="color: #2196F3; margin-bottom: 20px;">
                            <i class="fas fa-cogs fa-spin"></i> Processing ${product.name}
                        </h3>
                        <div style="margin-bottom: 20px;">
                            <div style="background: #f0f0f0; height: 10px; border-radius: 5px; overflow: hidden;">
                                <div style="background: #2196F3; height: 100%; width: 75%; transition: width 0.3s ease;"></div>
                            </div>
                            <p style="margin-top: 10px; color: #666;">75% Complete - Analyzing material properties...</p>
                        </div>
                        <div style="text-align: center;">
                            <button onclick="this.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #ddd; border: none; border-radius: 5px; cursor: pointer;">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(progressModal);
        }

        // Function to add new product
        function addNewProduct() {
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                    <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; width: 90%;">
                        <h3 style="color: #4CAF50; margin-bottom: 20px;">
                            <i class="fas fa-plus"></i> Request New Optimization
                        </h3>
                        <form onsubmit="submitNewProduct(event)">
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Product Name:</label>
                                <input type="text" name="productName" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Dimensions (LxWxH):</label>
                                <input type="text" name="dimensions" placeholder="e.g., 20x15x5 cm" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Weight:</label>
                                <input type="text" name="weight" placeholder="e.g., 500g" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Current Packaging:</label>
                                <input type="text" name="currentPackaging" placeholder="e.g., Cardboard box" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Product Image:</label>
                                <input type="file" name="productImage" accept="image/*" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            </div>
                            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                                <button type="button" onclick="this.parentElement.parentElement.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #ddd; border: none; border-radius: 5px; cursor: pointer;">
                                    Cancel
                                </button>
                                <button type="submit" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        // Function to submit new product
        function submitNewProduct(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const productName = formData.get('productName');
            
            showNotification(`New optimization request submitted for ${productName}`, 'success');
            
            // Close modal
            event.target.parentElement.parentElement.remove();
            
            // Update stats
            updateStats();
            
            // Add to activity feed
            addActivity('upload', `New product optimization request: ${productName}`, 'just now');
        }

        // Function to show notifications
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            const colors = {
                success: '#4CAF50',
                error: '#f44336',
                info: '#2196F3',
                warning: '#FF9800'
            };
            
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${colors[type]};
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                z-index: 2000;
                animation: slideIn 0.3s ease;
            `;
            
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : type === 'warning' ? 'exclamation' : 'info'}"></i>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Function to update stats
        function updateStats() {
            // Simulate real-time updates
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach(card => {
                const value = card.querySelector('.stat-value');
                const change = card.querySelector('.stat-change');
                
                // Add pulse effect
                card.style.animation = 'pulse 0.5s ease';
                setTimeout(() => card.style.animation = '', 500);
            });
        }

        // Function to add activity
        function addActivity(icon, text, time) {
            const activityContainer = document.querySelector('.recent-activity');
            const newActivity = document.createElement('div');
            newActivity.className = 'activity-item';
            newActivity.innerHTML = `
                <div class="activity-icon" style="background: #4CAF50;">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${text}</div>
                    <div class="activity-time">${time}</div>
                </div>
            `;
            
            // Insert at the beginning
            const firstActivity = activityContainer.querySelector('.activity-item');
            if (firstActivity) {
                activityContainer.insertBefore(newActivity, firstActivity);
            } else {
                activityContainer.appendChild(newActivity);
            }
            
            // Remove last activity if more than 5
            const activities = activityContainer.querySelectorAll('.activity-item');
            if (activities.length > 4) {
                activities[activities.length - 1].remove();
            }
        }

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            // Simulate real-time data updates
            setInterval(() => {
                // Randomly update a stat
                const randomStat = Math.floor(Math.random() * 4);
                const statCards = document.querySelectorAll('.stat-card');
                const randomCard = statCards[randomStat];
                
                if (randomCard) {
                    const value = randomCard.querySelector('.stat-value');
                    const change = randomCard.querySelector('.stat-change');
                    
                    // Subtle animation
                    randomCard.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        randomCard.style.transform = 'scale(1)';
                    }, 200);
                }
            }, 30000); // Update every 30 seconds
            
            // Welcome message
            setTimeout(() => {
                showNotification('Welcome to Packify Inventory Dashboard!', 'info');
            }, 1000);
        });

        // Simulate chart data updates
        function updateChartData() {
            const chartContainer = document.querySelector('.chart-placeholder');
            
            // In a real application, this would update actual charts
            chartContainer.style.background = 'linear-gradient(45deg, #e8f5e8, #f0f8ff)';
            setTimeout(() => {
                chartContainer.style.background = 'linear-gradient(45deg, #f8f9fa, #e9ecef)';
            }, 1000);
        }

        // Update chart data periodically
        setInterval(updateChartData, 60000); // Update every minute