function saveToYaml() {
    const data = {
        name: document.getElementById('name').value,
        profilePic: document.getElementById('profilePic').value,
        experience: document.getElementById('experience').value,
        jobs: document.getElementById('jobs').value.split('\n'),
        social: document.getElementById('social').value,
        services: document.getElementById('services').value.split('\n')
    };
    localStorage.setItem('portfolioData', jsyaml.dump(data));
    alert("Portfolio saved!");
}

function loadFromYaml() {
    const yamlData = localStorage.getItem('portfolioData');
    if (yamlData) {
        const data = jsyaml.load(yamlData);
        document.getElementById('name').value = data.name || "";
        document.getElementById('profilePic').value = data.profilePic || "";
        document.getElementById('experience').value = data.experience || "";
        document.getElementById('jobs').value = (data.jobs || []).join('\n');
        document.getElementById('social').value = data.social || "";
        document.getElementById('services').value = (data.services || []).join('\n');
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
        <h3>${data.name}</h3>
        <img src="${data.profilePic}" alt="Profile Picture" />
        <p><strong>Experience:</strong> ${data.experience} years</p>
        <p><strong>Previous Jobs:</strong> ${data.jobs.join(', ')}</p>
        <p><strong>Social Media Impact:</strong> ${data.social}</p>
        <p><strong>Services:</strong> ${data.services.join(', ')}</p>
    `;
    document.getElementById('preview').innerHTML = preview;
    document.getElementById('downloadPdfBtn').classList.remove('hidden');
}

function generatePdf(data) {
    const docDefinition = {
        content: [
            { text: data.name, style: 'header' },
            { image: data.profilePic, width: 100 },
            { text: `Experience: ${data.experience} years` },
            { text: `Previous Jobs: ${data.jobs.join(', ')}` },
            { text: `Social Media Impact: ${data.social}` },
            { text: `Services: ${data.services.join(', ')}` }
        ],
        styles: {
            header: { fontSize: 18, bold: true }
        }
    };
    pdfMake.createPdf(docDefinition).download("portfolio.pdf");
}
