document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    const navLinks = document.querySelectorAll('.nav-link');

    let data = {};

    // Fetch data and load home page
    fetch('data.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadHome();
        });

    // Navigation click handlers
    document.getElementById('home-link').addEventListener('click', () => {
        setActiveLink('home-link');
        loadHome();
    });
    document.getElementById('people-link').addEventListener('click', () => {
        setActiveLink('people-link');
        loadPeople();
    });
    document.getElementById('publications-link').addEventListener('click', () => {
        setActiveLink('publications-link');
        loadPublications();
    });
    document.getElementById('research-link').addEventListener('click', () => {
        setActiveLink('research-link');
        loadResearch();
    });
    document.getElementById('communications-link').addEventListener('click', () => {
        setActiveLink('communications-link');
        loadCommunications();
    });
    document.getElementById('teaching-link').addEventListener('click', () => {
        setActiveLink('teaching-link');
        loadTeaching();
    });


    function setActiveLink(activeId) {
        navLinks.forEach(link => {
            if (link.id === activeId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Load content functions
    function loadHome() {
        contentDiv.innerHTML = `
            <div class="home-section">
                <img src="${data.home.logo}" alt="EMES Lab Logo">
                <p>${data.home.description}</p>
            </div>
        `;
    }

    function loadPeople() {
        let html = '<h2>People</h2>';
        data.people.forEach(person => {
            html += `
                <div class="person">
                    <img src="${person.image}" alt="${person.name}">
                    <div class="person-info">
                        <h3>${person.name}</h3>
                        <p><em>${person.title}</em></p>
                        <ul>
                            ${person.cv.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                        <p>${person.research}</p>
                    </div>
                </div>
            `;
        });
        contentDiv.innerHTML = html;
    }

    function loadPublications() {
        let html = '<h2>Publications</h2>';
        html += '<ol class="publications-list" reversed>';
        data.publications.forEach((pub, index) => {
            let citation = pub.citation;
            if (pub.isStudent) {
                citation = citation.replace('†', '<sup>†</sup>');
            }
            if (pub.isPostdoc) {
                citation = citation.replace('‡', '<sup>‡</sup>');
            }
            html += `<li>${citation}</li>`;
        });
        html += '</ol>';
        contentDiv.innerHTML = html;
        const ol = contentDiv.querySelector('.publications-list');
        ol.setAttribute('start', data.publications.length);

    }

    function loadCommunications() {
        let html = '<h2>Communications</h2>';

        html += '<h3 class="communications-category">Invited Presentations</h3>';
        html += '<ul class="communications-list">';
        data.communications.invited.forEach(comm => {
            html += `<li>${comm}</li>`;
        });
        html += '</ul>';

        html += '<h3 class="communications-category">Conference Presentations (Oral)</h3>';
        html += '<ul class="communications-list">';
        data.communications.oral.forEach(comm => {
            html += `<li>${comm}</li>`;
        });
        html += '</ul>';

        html += '<h3 class="communications-category">Conference Presentations (Poster)</h3>';
        html += '<ul class="communications-list">';
        data.communications.poster.forEach(comm => {
            html += `<li>${comm}</li>`;
        });
        html += '</ul>';

        html += '<h3 class="communications-category">Outreach</h3>';
        html += '<ul class="communications-list">';
        data.communications.outreach.forEach(comm => {
            html += `<li>${comm}</li>`;
        });
        html += '</ul>';

        contentDiv.innerHTML = html;
    }

    function loadResearch() {
        let html = '<h2>Research</h2>';
        data.research.forEach((item, index) => {
            html += `
                <div class="research-item">
                    <div class="research-item-header" data-index="${index}">
                        <h3>${item.title}</h3>
                        <span>+</span>
                    </div>
                    <div class="research-item-content" id="research-content-${index}">
                        <img src="${item.image}" alt="${item.title}">
                        <p>${item.description}</p>
                    </div>
                </div>
            `;
        });
        contentDiv.innerHTML = html;
        addAccordionListeners('.research-item-header');
    }

    function loadTeaching() {
        let html = '<h2>Teaching</h2>';
        data.teaching.forEach((item, index) => {
            html += `
                <div class="teaching-item">
                    <div class="teaching-item-header" data-index="${index}">
                        <h3>${item.title}</h3>
                        <span>+</span>
                    </div>
                    <div class="teaching-item-content" id="teaching-content-${index}">
                        <img src="${item.image}" alt="${item.title}">
                        <p>${item.description}</p>
                    </div>
                </div>
            `;
        });
        contentDiv.innerHTML = html;
        addAccordionListeners('.teaching-item-header');
    }

    function addAccordionListeners(selector) {
        document.querySelectorAll(selector).forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const isVisible = content.style.display === 'block';
                content.style.display = isVisible ? 'none' : 'block';
                header.querySelector('span').textContent = isVisible ? '+' : '-';
            });
        });
    }
});
