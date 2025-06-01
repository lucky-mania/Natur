/**
 * Calculator JavaScript for Natur Gym Website
 * Handles BMI, body fat, ideal weight calculations and progress tracking
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Calculator functionality loaded');

    // Initialize all calculator functionality
    initBMICalculator();
    initBodyFatCalculator();
    initIdealWeightCalculator();
    initProgressTracker();
    loadProgressHistory();

    /**
     * BMI Calculator functionality
     */
    function initBMICalculator() {
        const imcForm = document.getElementById('imcForm');
        const imcResult = document.getElementById('imcResult');
        const imcValue = document.getElementById('imcValue');
        const imcClassification = document.getElementById('imcClassification');
        const imcDescription = document.getElementById('imcDescription');

        if (!imcForm) return;

        imcForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value);

            if (!weight || !height) {
                showError('Por favor, preencha todos os campos.');
                return;
            }

            if (weight < 30 || weight > 300) {
                showError('Peso deve estar entre 30kg e 300kg.');
                return;
            }

            if (height < 140 || height > 220) {
                showError('Altura deve estar entre 140cm e 220cm.');
                return;
            }

            const bmi = calculateBMI(weight, height);
            const classification = getBMIClassification(bmi);
            const description = getBMIDescription(classification);

            displayBMIResult(bmi, classification, description);
        });

        function calculateBMI(weight, height) {
            const heightInMeters = height / 100;
            return weight / (heightInMeters * heightInMeters);
        }

        function getBMIClassification(bmi) {
            if (bmi < 18.5) return 'Baixo peso';
            if (bmi < 25) return 'Peso normal';
            if (bmi < 30) return 'Sobrepeso';
            if (bmi < 35) return 'Obesidade grau I';
            if (bmi < 40) return 'Obesidade grau II';
            return 'Obesidade grau III';
        }

        function getBMIDescription(classification) {
            const descriptions = {
                'Baixo peso': 'Pode indicar desnutrição ou outros problemas de saúde. Recomenda-se consultar um profissional de saúde.',
                'Peso normal': 'Parabéns! Seu peso está dentro da faixa considerada saudável. Mantenha hábitos saudáveis.',
                'Sobrepeso': 'Pequeno excesso de peso. Uma alimentação equilibrada e exercícios podem ajudar.',
                'Obesidade grau I': 'Excesso de peso que pode trazer riscos à saúde. Procure orientação profissional.',
                'Obesidade grau II': 'Obesidade severa. É importante buscar acompanhamento médico e nutricional.',
                'Obesidade grau III': 'Obesidade mórbida. Necessário acompanhamento médico urgente.'
            };
            return descriptions[classification] || '';
        }

        function displayBMIResult(bmi, classification, description) {
            imcValue.textContent = bmi.toFixed(1);
            imcClassification.textContent = classification;
            imcDescription.textContent = description;

            // Add color coding
            const colors = {
                'Baixo peso': '#EAB308',
                'Peso normal': '#4ADE80',
                'Sobrepeso': '#EAB308',
                'Obesidade grau I': '#F97316',
                'Obesidade grau II': '#DC2626',
                'Obesidade grau III': '#7C2D12'
            };

            imcClassification.style.color = colors[classification] || '#0066CC';
            imcResult.style.display = 'block';

            // Smooth scroll to result
            imcResult.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Save to local storage for progress tracking
            saveCalculationToHistory('BMI', { bmi: bmi.toFixed(1), classification });
        }
    }

    /**
     * Body Fat Calculator functionality
     */
    function initBodyFatCalculator() {
        const bodyFatForm = document.getElementById('bodyFatForm');
        const bodyFatResult = document.getElementById('bodyFatResult');
        const bodyFatValue = document.getElementById('bodyFatValue');
        const bodyFatClassification = document.getElementById('bodyFatClassification');
        const bodyFatDescription = document.getElementById('bodyFatDescription');

        if (!bodyFatForm) return;

        bodyFatForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const gender = document.getElementById('gender').value;
            const age = parseInt(document.getElementById('age').value);
            const weight = parseFloat(document.getElementById('weightBf').value);
            const height = parseFloat(document.getElementById('heightBf').value);

            if (!gender || !age || !weight || !height) {
                showError('Por favor, preencha todos os campos.');
                return;
            }

            const bodyFat = calculateBodyFat(gender, age, weight, height);
            const classification = getBodyFatClassification(bodyFat, gender);
            const description = getBodyFatDescription(classification);

            displayBodyFatResult(bodyFat, classification, description);
        });

        function calculateBodyFat(gender, age, weight, height) {
            // Using Deurenberg formula
            const bmi = weight / Math.pow(height / 100, 2);
            const genderFactor = gender === 'male' ? 1 : 0;
            
            return (1.20 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4;
        }

        function getBodyFatClassification(bodyFat, gender) {
            if (gender === 'male') {
                if (bodyFat < 6) return 'Muito baixo';
                if (bodyFat < 14) return 'Atlético';
                if (bodyFat < 18) return 'Fitness';
                if (bodyFat < 25) return 'Aceitável';
                return 'Obesidade';
            } else {
                if (bodyFat < 14) return 'Muito baixo';
                if (bodyFat < 21) return 'Atlético';
                if (bodyFat < 25) return 'Fitness';
                if (bodyFat < 32) return 'Aceitável';
                return 'Obesidade';
            }
        }

        function getBodyFatDescription(classification) {
            const descriptions = {
                'Muito baixo': 'Percentual muito baixo. Pode indicar problemas de saúde.',
                'Atlético': 'Excelente! Percentual típico de atletas.',
                'Fitness': 'Muito bom! Boa forma física.',
                'Aceitável': 'Dentro da média. Pode melhorar com exercícios.',
                'Obesidade': 'Alto percentual. Recomenda-se exercícios e acompanhamento.'
            };
            return descriptions[classification] || '';
        }

        function displayBodyFatResult(bodyFat, classification, description) {
            bodyFatValue.textContent = bodyFat.toFixed(1) + '%';
            bodyFatClassification.textContent = classification;
            bodyFatDescription.textContent = description;

            const colors = {
                'Muito baixo': '#EAB308',
                'Atlético': '#4ADE80',
                'Fitness': '#22C55E',
                'Aceitável': '#EAB308',
                'Obesidade': '#DC2626'
            };

            bodyFatClassification.style.color = colors[classification] || '#0066CC';
            bodyFatResult.style.display = 'block';

            bodyFatResult.scrollIntoView({ behavior: 'smooth', block: 'center' });

            saveCalculationToHistory('Gordura Corporal', { 
                bodyFat: bodyFat.toFixed(1) + '%', 
                classification 
            });
        }
    }

    /**
     * Ideal Weight Calculator functionality
     */
    function initIdealWeightCalculator() {
        const idealWeightForm = document.getElementById('idealWeightForm');
        const idealWeightResult = document.getElementById('idealWeightResult');
        const idealWeightValue = document.getElementById('idealWeightValue');
        const idealWeightDescription = document.getElementById('idealWeightDescription');

        if (!idealWeightForm) return;

        idealWeightForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const gender = document.getElementById('genderIdeal').value;
            const height = parseFloat(document.getElementById('heightIdeal').value);

            if (!gender || !height) {
                showError('Por favor, preencha todos os campos.');
                return;
            }

            const idealWeight = calculateIdealWeight(gender, height);
            const weightRange = calculateWeightRange(height);
            
            displayIdealWeightResult(idealWeight, weightRange);
        });

        function calculateIdealWeight(gender, height) {
            // Using Robinson formula
            const heightInInches = height / 2.54;
            
            if (gender === 'male') {
                return 52 + (1.9 * (heightInInches - 60));
            } else {
                return 49 + (1.7 * (heightInInches - 60));
            }
        }

        function calculateWeightRange(height) {
            const heightInMeters = height / 100;
            const minWeight = 18.5 * Math.pow(heightInMeters, 2);
            const maxWeight = 24.9 * Math.pow(heightInMeters, 2);
            
            return {
                min: minWeight,
                max: maxWeight
            };
        }

        function displayIdealWeightResult(idealWeight, weightRange) {
            idealWeightValue.textContent = `${idealWeight.toFixed(1)} kg`;
            
            const description = `Baseado na sua altura, seu peso ideal está entre ${weightRange.min.toFixed(1)}kg e ${weightRange.max.toFixed(1)}kg. O valor calculado de ${idealWeight.toFixed(1)}kg é uma estimativa usando a fórmula de Robinson.`;
            
            idealWeightDescription.textContent = description;
            idealWeightResult.style.display = 'block';

            idealWeightResult.scrollIntoView({ behavior: 'smooth', block: 'center' });

            saveCalculationToHistory('Peso Ideal', { 
                idealWeight: idealWeight.toFixed(1) + ' kg',
                range: `${weightRange.min.toFixed(1)} - ${weightRange.max.toFixed(1)} kg`
            });
        }
    }

    /**
     * Progress Tracker functionality
     */
    function initProgressTracker() {
        const progressForm = document.getElementById('progressForm');

        if (!progressForm) return;

        progressForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const weight = parseFloat(document.getElementById('progressWeight').value);
            const bodyFat = parseFloat(document.getElementById('progressBodyFat').value);
            const muscle = parseFloat(document.getElementById('progressMuscle').value);

            if (!weight) {
                showError('O peso é obrigatório para salvar o progresso.');
                return;
            }

            const progressData = {
                date: new Date().toISOString(),
                weight: weight,
                bodyFat: bodyFat || null,
                muscle: muscle || null
            };

            saveProgressData(progressData);
            updateProgressDisplay();
            
            // Clear form
            progressForm.reset();
            
            showSuccess('Medidas salvas com sucesso!');
        });
    }

    /**
     * Save progress data to localStorage
     */
    function saveProgressData(data) {
        let progressHistory = JSON.parse(localStorage.getItem('naturGymProgress')) || [];
        progressHistory.push(data);
        
        // Keep only last 50 entries
        if (progressHistory.length > 50) {
            progressHistory = progressHistory.slice(-50);
        }
        
        localStorage.setItem('naturGymProgress', JSON.stringify(progressHistory));
    }

    /**
     * Save calculation to history
     */
    function saveCalculationToHistory(type, data) {
        const historyKey = 'naturGymCalculations';
        let history = JSON.parse(localStorage.getItem(historyKey)) || [];
        
        const calculation = {
            type: type,
            date: new Date().toISOString(),
            data: data
        };
        
        history.push(calculation);
        
        // Keep only last 20 calculations
        if (history.length > 20) {
            history = history.slice(-20);
        }
        
        localStorage.setItem(historyKey, JSON.stringify(history));
    }

    /**
     * Load and display progress history
     */
    function loadProgressHistory() {
        updateProgressDisplay();
    }

    /**
     * Update progress display
     */
    function updateProgressDisplay() {
        const progressList = document.getElementById('progressList');
        if (!progressList) return;

        const progressHistory = JSON.parse(localStorage.getItem('naturGymProgress')) || [];
        
        if (progressHistory.length === 0) {
            progressList.innerHTML = '<p class="no-data">Nenhuma medida salva ainda.</p>';
            return;
        }

        // Sort by date (newest first)
        progressHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        let html = '';
        progressHistory.slice(0, 10).forEach(entry => { // Show last 10 entries
            const date = new Date(entry.date).toLocaleDateString('pt-BR');
            const time = new Date(entry.date).toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            let values = `Peso: ${entry.weight}kg`;
            if (entry.bodyFat) {
                values += ` | Gordura: ${entry.bodyFat}%`;
            }
            if (entry.muscle) {
                values += ` | Massa: ${entry.muscle}kg`;
            }

            html += `
                <div class="progress-item">
                    <div class="progress-date">${date} às ${time}</div>
                    <div class="progress-values">${values}</div>
                </div>
            `;
        });

        progressList.innerHTML = html;

        // Add clear history button if there are entries
        if (progressHistory.length > 0) {
            const clearButton = document.createElement('button');
            clearButton.textContent = 'Limpar Histórico';
            clearButton.className = 'btn btn-secondary';
            clearButton.style.marginTop = '1rem';
            clearButton.style.fontSize = '0.875rem';
            clearButton.onclick = clearProgressHistory;
            
            if (!progressList.parentElement.querySelector('.clear-history-btn')) {
                clearButton.classList.add('clear-history-btn');
                progressList.parentElement.appendChild(clearButton);
            }
        }
    }

    /**
     * Clear progress history
     */
    function clearProgressHistory() {
        if (confirm('Tem certeza que deseja limpar todo o histórico de medidas?')) {
            localStorage.removeItem('naturGymProgress');
            updateProgressDisplay();
            showSuccess('Histórico limpo com sucesso!');
        }
    }

    /**
     * Input formatting and validation
     */
    function initInputFormatting() {
        // Format phone numbers
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 11) {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else if (value.length >= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                }
                e.target.value = value;
            });
        });

        // Format number inputs
        const numberInputs = document.querySelectorAll('input[type="number"]');
        numberInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                const value = parseFloat(e.target.value);
                const min = parseFloat(e.target.min);
                const max = parseFloat(e.target.max);

                if (min && value < min) {
                    e.target.style.borderColor = '#DC2626';
                } else if (max && value > max) {
                    e.target.style.borderColor = '#DC2626';
                } else {
                    e.target.style.borderColor = '';
                }
            });
        });
    }

    // Initialize input formatting
    initInputFormatting();

    /**
     * Show error message
     */
    function showError(message) {
        if (window.NaturGym && window.NaturGym.showNotification) {
            window.NaturGym.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    /**
     * Show success message
     */
    function showSuccess(message) {
        if (window.NaturGym && window.NaturGym.showNotification) {
            window.NaturGym.showNotification(message, 'success');
        } else {
            alert(message);
        }
    }

    /**
     * Export progress data to CSV
     */
    function exportProgressToCSV() {
        const progressHistory = JSON.parse(localStorage.getItem('naturGymProgress')) || [];
        
        if (progressHistory.length === 0) {
            showError('Nenhum dado para exportar.');
            return;
        }

        let csv = 'Data,Peso (kg),Gordura Corporal (%),Massa Muscular (kg)\n';
        
        progressHistory.forEach(entry => {
            const date = new Date(entry.date).toLocaleDateString('pt-BR');
            const weight = entry.weight || '';
            const bodyFat = entry.bodyFat || '';
            const muscle = entry.muscle || '';
            
            csv += `${date},${weight},${bodyFat},${muscle}\n`;
        });

        // Create and download file
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'natur_gym_progresso.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Calculate BMR (Basal Metabolic Rate)
     */
    function calculateBMR(gender, age, weight, height) {
        // Mifflin-St Jeor Equation
        const bmr = gender === 'male' 
            ? (10 * weight) + (6.25 * height) - (5 * age) + 5
            : (10 * weight) + (6.25 * height) - (5 * age) - 161;
        
        return bmr;
    }

    /**
     * Calculate daily calorie needs
     */
    function calculateDailyCalories(bmr, activityLevel) {
        const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9
        };
        
        return bmr * (activityMultipliers[activityLevel] || 1.2);
    }

    // Add export functionality to progress section
    const progressHistory = document.getElementById('progressHistory');
    if (progressHistory) {
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Exportar CSV';
        exportButton.className = 'btn btn-secondary';
        exportButton.style.marginTop = '1rem';
        exportButton.style.fontSize = '0.875rem';
        exportButton.onclick = exportProgressToCSV;
        
        progressHistory.appendChild(exportButton);
    }

    // Auto-save form data on input
    function initAutoSave() {
        const forms = document.querySelectorAll('.calculator-form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select');
            
            inputs.forEach(input => {
                // Load saved values
                const savedValue = localStorage.getItem(`form_${input.id}`);
                if (savedValue && input.type !== 'submit') {
                    input.value = savedValue;
                }
                
                // Save on change
                input.addEventListener('input', function() {
                    localStorage.setItem(`form_${input.id}`, input.value);
                });
            });
        });
    }

    // Initialize auto-save
    initAutoSave();

    console.log('Calculator functionality initialized successfully');
});

// Make calculator functions available globally
window.NaturCalculator = {
    calculateBMI: function(weight, height) {
        const heightInMeters = height / 100;
        return weight / (heightInMeters * heightInMeters);
    },
    
    calculateBodyFat: function(gender, age, weight, height) {
        const bmi = this.calculateBMI(weight, height);
        const genderFactor = gender === 'male' ? 1 : 0;
        return (1.20 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4;
    },
    
    calculateIdealWeight: function(gender, height) {
        const heightInInches = height / 2.54;
        if (gender === 'male') {
            return 52 + (1.9 * (heightInInches - 60));
        } else {
            return 49 + (1.7 * (heightInInches - 60));
        }
    },
    
    exportProgress: function() {
        const progressHistory = JSON.parse(localStorage.getItem('naturGymProgress')) || [];
        return progressHistory;
    }
};
