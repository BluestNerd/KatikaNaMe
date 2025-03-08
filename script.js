document.getElementById("saveBtn").addEventListener("click", saveToYaml);
document.getElementById("loadBtn").addEventListener("click", loadFromYaml);
document.getElementById("generateBtn").addEventListener("click", generatePortfolio);
document.getElementById("downloadPdfBtn").addEventListener("click", downloadPdf);

function saveToYaml() {
    const data = {
        name: document.getElementById('name').value,
        title: document.getElementById('title').value,
        experience: document.getElementById('experience').value,
        aboutMe: document.getElementById('aboutMe').value,
        jobs: document.getElementById('jobs').value.split('\n'),
        social: document.getElementById('social').value,
        services: document.getElementById('services').value.split('\n'),
        testimonials: document.getElementById('testimonials').value,
        contactEmail: document.getElementById('contactEmail').value,
        phone: document.getElementById('phone').value
    };
    localStorage.setItem('portfolioData', jsyaml.dump(data));
    alert("Portfolio saved!");
}

function loadFromYaml() {
    const yamlData = localStorage.getItem('portfolioData');
    if (yamlData) {
        const data = jsyaml.load(yamlData);
        document.getElementById('name').value = data.name || "";
        document.getElementById('title').value = data.title || "";
        document.getElementById('experience').value = data.experience || "";
        document.getElementById('aboutMe').value = data.aboutMe || "";
        document.getElementById('jobs').value = (data.jobs || []).join('\n');
        document.getElementById('social').value = data.social || "";
        document.getElementById('services').value = (data.services || []).join('\n');
        document.getElementById('testimonials').value = data.testimonials || "";
        document.getElementById('contactEmail').value = data.contactEmail || "";
        document.getElementById('phone').value = data.phone || "";
        alert("Portfolio loaded!");
    } else {
        alert("No saved portfolio found.");
    }
}

function generatePortfolio() {
    const yamlData = localStorage.getItem('portfolioData');
    if (!yamlData) {
        alert("No saved data to generate portfolio.");
        return;
    }
    const data = jsyaml.load(yamlData);
    const preview = `
        <div class='p-4 border border-purple-500 rounded'>
            <h3 class='text-xl font-bold'>${data.name}</h3>
            <p><strong>Title:</strong> ${data.title}</p>
            <p><strong>Experience:</strong> ${data.experience} years</p>
            <p><strong>About Me:</strong> ${data.aboutMe}</p>
            <p><strong>Performance History:</strong> ${data.jobs.join(', ')}</p>
            <p><strong>Social Media Impact:</strong> ${data.social}</p>
            <p><strong>Services:</strong> ${data.services.join(', ')}</p>
            <p><strong>Testimonials:</strong> ${data.testimonials}</p>
            <p><strong>Contact:</strong> ${data.contactEmail} | ${data.phone}</p>
        </div>
    `;
    document.getElementById('preview').innerHTML = preview;
    document.getElementById('downloadPdfBtn').classList.remove('hidden');
}

function downloadPdf() {
    const yamlData = localStorage.getItem('portfolioData');
    if (!yamlData) {
        alert("No saved data to generate PDF.");
        return;
    }
    const data = jsyaml.load(yamlData);
    const docDefinition = {
        content: [
            { text: data.name, style: 'header' },
            { text: `Title: ${data.title}` },
            { text: `Experience: ${data.experience} years` },
            { text: `About Me: ${data.aboutMe}` },
            { text: `Performance History: ${data.jobs.join(', ')}` },
            { text: `Social Media Impact: ${data.social}` },
            { text: `Services: ${data.services.join(', ')}` },
            { text: `Testimonials: ${data.testimonials}` },
            { text: `Contact: ${data.contactEmail} | ${data.phone}` }
        ],
        styles: {
            header: { fontSize: 18, bold: true }
        }
    };
    pdfMake.createPdf(docDefinition).download("portfolio.pdf");
}
