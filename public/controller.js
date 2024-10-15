document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    let currentSectionIndex = 0;
    const surveyData = getSurveyData();
    renderSection(surveyData, currentSectionIndex);

    app.addEventListener('click', (event) => {
        if (event.target.id === 'submitSurvey') {
            currentSectionIndex++;
            if (currentSectionIndex < surveyData.length) {
                renderSection(surveyData, currentSectionIndex);
            } else {
                const results = calculateScore(surveyData);
                localStorage.setItem('surveyResults', JSON.stringify(results));
                renderResults(results);
            }
        } else if (event.target.id === 'previousSurvey') {
            if (currentSectionIndex > 0) {
                currentSectionIndex--;
                animateSectionChange(() => renderSection(surveyData, currentSectionIndex));
            }
        }
    });
});

function getSurveyData() {
    return [
        {
            section: 'Circular Design and Materials',
            questions: [
                {
                    title: 'How many materials (or material groups) does the product(s) contain?',
                    description: 'Products generally consist of different materials that are distributed throughout the product, e.g. in different components.',
                    options: ['2-5', '6-9', '10-13', 'More than 13', 'I don\'t know'],
                    scores: [5, 4, 3, 2, 1, 0]
                },
                {
                    title: 'What is the product(s) relative weight relative to comparable products in the market?',
                    description: 'Circular design demand less materials for the same performance and quality.',
                    options: ['50% less', '25% less', '1x same weight', '1.5x more', '2x more', 'I don\'t know'],
                    scores: [5, 4, 3, 2, 1, 0]
                },
                {
                    title: 'How modular is the product(s) design so that it facilitates rapid disassembly and assembly of its parts?',
                    description: '100% separable joints and full accessibility',
                    options: ['Excellent', 'Good', 'Fair', 'Poor', 'Null', 'I don\'t know'],
                    scores: [5, 4, 3, 2, 1, 0]
                },
                {
                    title: 'What is the product(s) average lifetime relative to the industry average?',
                    description: 'The expected lifetime compared to similar products in the industry.',
                    options: ['2x more', '1.5x more', '1x equal lifetime', '25% less', '50% less', 'I don\'t know'],
                    scores: [5, 4, 3, 2, 1, 0]
                }
            ]
        },
        {
            section: 'Sourcing and Transportation',
            questions: [
                {
                    title: 'What are the primary geographical locations where the organization sources its virgin raw materials from?',
                    description: 'Identify the main regions from which raw materials are sourced.',
                    options: ['Countries outside of Europe', 'Other european countries', 'Switzerland\'s neighboring countries', 'Switzerland', 'Same canton as HQ', 'I don\'t know'],
                    scores: [1, 2, 3, 4, 5, 0]
                },
                {
                    title: 'What modes of transportation are used for the different sourcing locations?',
                    description: 'Specify the transportation modes used to source the materials.',
                    options: ['Air', 'Maritime', 'Rail', 'Road', 'Other', 'I don\'t know'],
                    scores: [1, 2, 3, 4, 5, 0]
                },
                {
                    title: 'What are the primary geographical locations where the organization sources its reused materials from?',
                    description: 'Identify the main regions from which reused materials are sourced.',
                    options: ['Organization\'s own waste', 'Other organizations\' waste', 'Countries outside of Europe', 'Switzerland\'s neighboring countries', 'Switzerland', 'I don\'t know'],
                    scores: [1, 2, 3, 4, 5, 0]
                }
            ]
        }
    ];
}

function renderSection(surveyData, sectionIndex) {
    const section = surveyData[sectionIndex];
    let html = `<form id="sustainabilityForm" class="mb-4 fade-enter">
                <h2 class="h4 fw-bold">${section.section}</h2>`;
    section.questions.forEach((question, index) => {
        html += `
            <div class="p-4 bg-white rounded shadow-sm">
                <label class="h5 fw-bold">${question.title}
                    <span class="text-secondary small cursor-pointer" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="${question.description}"><i class="bi bi-info-circle"></i></span>
                </label>
                <div class="mt-2">`;
        question.options.forEach((option, optionIndex) => {
            html += `<label class="form-check">
                <input type="radio" name="question${index}" value="${optionIndex}" class="form-check-input me-2">
                ${option}
            </label>`;
        });
        html += '</div></div>';
    });
    if (sectionIndex > 0) {
        html += '<button type="button" id="previousSurvey" class="btn btn-secondary mt-4 me-2"><i class="bi bi-arrow-left"></i> Previous</button>';
    }
    if (sectionIndex < surveyData.length - 1) {
        html += '<button type="button" id="submitSurvey" class="btn btn-primary mt-4">Next <i class="bi bi-arrow-right"></i></button></form>';
    } else {
        html += '<button type="button" id="submitSurvey" class="btn btn-success mt-4">See Results <i class="bi bi-check-circle"></i></button></form>';
    }
    document.getElementById('app').innerHTML = html;
    initializePopovers();
}

function initializePopovers() {
    const popoverElements = document.querySelectorAll('[data-bs-toggle="popover"]');
    popoverElements.forEach(el => {
        new bootstrap.Popover(el);
    });
}

function calculateScore(surveyData) {
    const formElements = document.forms['sustainabilityForm'].elements;
    let score = 0;
    surveyData.forEach((section, sectionIndex) => {
        section.questions.forEach((question, questionIndex) => {
            const inputName = `question${questionIndex}`;
            const selectedOption = formElements[inputName];
            if (selectedOption) {
                const selectedValue = [...selectedOption].find(input => input.checked)?.value;
                if (selectedValue !== undefined) {
                    score += question.scores[selectedValue];
                }
            }
        });
    });
    return score;
}

function renderResults(results) {
    document.getElementById('app').innerHTML = `<div class="text-center p-4 bg-white rounded shadow-sm fade-enter">
        <h2 class="h4 fw-bold">Your Sustainability Score</h2>
        <p class="display-4">${results} / 90</p>
        <div class="progress mt-4">
            <div class="progress-bar" role="progressbar" style="width: ${results / 90 * 100}%" aria-valuenow="${results}" aria-valuemin="0" aria-valuemax="90">${results} / 90</div>
        </div>
    </div>`;
}
