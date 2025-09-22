document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    const navLinks = document.querySelectorAll('.nav-link');

    let data = {};

    // Fetch data and then load the home page
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(jsonData => {
            data = jsonData;
            loadHome(); // Load home content by default
        })
        .catch(error => {
            console.error("Error loading data.json:", error);
            contentDiv.innerHTML = `<p style="color: red;">Error: Could not load website data. Please check the developer console for more information.</p>`;
        });

    // --- Navigation click handlers ---
    document.getElementById('home-link').addEventListener('click', () => { setActiveLink('home-link'); loadHome(); });
    document.getElementById('people-link').addEventListener('click', () => { setActiveLink('people-link'); loadPeople(); });
    document.getElementById('publications-link').addEventListener('click', () => { setActiveLink('publications-link'); loadPublications(); });
    document.getElementById('research-link').addEventListener('click', () => { setActiveLink('research-link'); loadResearch(); });
    document.getElementById('communications-link').addEventListener('click', () => { setActiveLink('communications-link'); loadCommunications(); });
    document.getElementById('teaching-link').addEventListener('click', () => { setActiveLink('teaching-link'); loadTeaching(); });


    function setActiveLink(activeId) {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.id === activeId);
        });
    }

    // --- Content Loading Functions ---

    function loadHome() {
        if (!data.home) return;
        contentDiv.innerHTML = `
            <div class="home-section">
                <img src="${data.home.logo}" alt="EMES Lab Logo">
                <h2>${data.home.description}</h2>
            </div>
        `;
    }

    function loadPeople() {
        if (!data.people) return;
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
        if (!data.publications) return;
        let html = '<h2>Publications</h2>';
        html += '<ol class="publications-list" reversed>';
        // The most recent publication is first in the JSON, but will get the highest number.
        data.publications.forEach(pub => {
            let citation = pub.citation
                .replace('†', '<sup>†</sup>')
                .replace('‡', '<sup>‡</sup>');
            html += `<li>${citation}</li>`;
        });
        html += '</ol>';
        contentDiv.innerHTML = html;
        // Set the starting number of the list to be the total count
        const ol = contentDiv.querySelector('.publications-list');
        if (ol) {
            ol.setAttribute('start', data.publications.length);
        }
    }

    function loadCommunications() {
        if (!data.communications) return;
        let html = '<h2>Communications</h2>';

        const categories = {
            "invited": "Invited Presentations",
            "oral": "Conference Presentations (Oral)",
            "poster": "Conference Presentations (Poster)",
            "outreach": "Outreach"
        };

        for (const key in categories) {
            if (data.communications[key] && data.communications[key].length > 0) {
                html += `<h3 class="communications-category">${categories[key]}</h3>`;
                html += '<ul class="communications-list">';
                data.communications[key].forEach(comm => {
                     let citation = comm
                        .replace('†', '<sup>†</sup>')
                        .replace('‡', '<sup>‡</sup>');
                    html += `<li>${citation}</li>`;
                });
                html += '</ul>';
            }
        }
        contentDiv.innerHTML = html;
    }

    function loadResearch() {
        if (!data.research) return;
        let html = '<h2>Research</h2>';
        data.research.forEach((item, index) => {
            html += `
                <div class="research-item">
                    <div class="research-item-header" data-index="${index}">
                        <h3>${item.title}</h3>
                        <span>+</span>
                    </div>
                    <div class="research-item-content">
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
        if (!data.teaching) return;
        let html = '<h2>Teaching</h2>';
        data.teaching.forEach((item, index) => {
            html += `
                <div class="teaching-item">
                    <div class="teaching-item-header" data-index="${index}">
                        <h3>${item.title}</h3>
                        <span>+</span>
                    </div>
                    <div class="teaching-item-content">
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
