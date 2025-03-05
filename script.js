function saveToYaml() {
    if (!validateForm()) return;

    const data = {
        name: document.getElementById('name').value,
        title: document.getElementById('title').value,
        profilePic: document.getElementById('profilePic').value,
        aboutMe: document.getElementById('aboutMe').value,
        experience: document.getElementById('experience').value,
        jobs: document.getElementById('jobs').value.split('\n'),
        shows: document.getElementById('shows').value.split('\n'),
        social: document.getElementById('social').value,
        services: document.getElementById('services').value.split('\n'),
        testimonials: document.getElementById('testimonials').value.split('\n'),
        contactEmail: document.getElementById('contactEmail').value,
        phone: document.getElementById('phone').value
    };

    localStorage.setItem('portfolioData', jsyaml.dump(data));
    alert("Portfolio saved!");
}

function loadFromYaml() {
    const yamlData = localStorage.getItem('portfolioData');
    if (!yamlData) {
        alert("No saved portfolio found.");
        return;
    }
    const data = jsyaml.load(yamlData);

    Object.keys(data).forEach(key => {
        if (document.getElementById(key)) {
            document.getElementById(key).value = Array.isArray(data[key]) ? data[key].join('\n') : data[key];
        }
    });

    alert("Portfolio loaded!");
}

async function generatePortfolio() {
    if (!validateForm()) return;

    const yamlData = localStorage.getItem('portfolioData');
    if (!yamlData) return alert("No saved data to generate portfolio.");

    const data = jsyaml.load(yamlData);
    data.profilePicBase64 = await convertImageToBase64(data.profilePic);

    document.getElementById('downloadPdfBtn').classList.remove('hidden');
    document.getElementById('downloadPdfBtn').onclick = function () {
        generatePdf(data);
    };
}

function generatePdf(data) {
    const docDefinition = {
        content: [
            { text: data.name, fontSize: 26, bold: true, alignment: 'center' },
            { text: data.title, fontSize: 18, italics: true, alignment: 'center', margin: [0, 5] },
            data.profilePicBase64 ? { image: data.profilePicBase64, width: 150, alignment: 'center', margin: [0, 10] } : {},
            { text: 'About Me', fontSize: 20, bold: true, margin: [0, 15] },
            { text: data.aboutMe, margin: [0, 5] },
            { text: `Years of Experience: ${data.experience}`, bold: true, margin: [0, 10] },

            { text: 'Performance History', fontSize: 20, bold: true, margin: [0, 15] },
            { ul: data.jobs },

            { text: 'Notable Shows & Competitions', fontSize: 20, bold: true, margin: [0, 15] },
            { ul: data.shows },

            { text: 'Social Media Impact', fontSize: 20, bold: true, margin: [0, 15] },
            { text: data.social },

            { text: 'Services Offered', fontSize: 20, bold: true, margin: [0, 15] },
            { ul: data.services },

            { text: 'Testimonials', fontSize: 20, bold: true, margin: [0, 15] },
            { ul: data.testimonials },

            { text: 'Contact Information', fontSize: 20, bold: true, margin: [0, 15] },
            { text: `📧 Email: ${data.contactEmail}` },
            { text: `📞 Phone: ${data.phone}` },

            { text: '---', alignment: 'center', margin: [0, 20] },
            { text: 'Thank you for viewing this portfolio!', italics: true, alignment: 'center' }
        ]
    };

    pdfMake.createPdf(docDefinition).download(`${data.name}_Portfolio.pdf`);
}

async function convertImageToBase64(url) {
    if (!url) return null;
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch {
        return null;
    }
}

function validateForm() {
    if (!document.getElementById('name').value.trim()) {
        alert("Name is required.");
        return false;
    }
    return true;
}
