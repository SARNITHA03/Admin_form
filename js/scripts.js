
function nextPage(page) {
    const currentPage = document.getElementById(`page${page}`);
    const nextPage = document.getElementById(`page${page + 1}`);
    
    currentPage.style.display = 'none';
    nextPage.style.display = 'block';
    }
    
    function prevPage(page) {
    const currentPage = document.getElementById(`page${page}`);
    const prevPage = document.getElementById(`page${page - 1}`);
    
    currentPage.style.display = 'none';
    prevPage.style.display = 'block';
    }
    
    document.addEventListener('DOMContentLoaded', function() {
    let currentStep = 1;
    
    window.nextPage = function(step) {
        document.getElementById(`page${step}`).style.display = 'none';
        document.getElementById(`page${step + 1}`).style.display = 'block';
        currentStep = step + 1;
        updateSteps();
    };
    
    function updateSteps() {
        for (let i = 1; i <= currentStep; i++) {
            document.getElementById(`step${i}`).classList.add('completed');
            if (i > 1) {
                document.getElementById(`line${i - 1}`).classList.add('completed');
            }
        }
    }
  
    
    updateSteps();
    });