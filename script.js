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
    } catch (error) {
        console.warn("Could not fetch image, skipping image in PDF.");
        return null;
    }
}

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const experience = document.getElementById('experience').value.trim();
    if (!name) {
        alert("Please enter a name.");
        return false;
    }
    if (!experience || isNaN(experience) || parseInt(experience) < 0) {
        alert("Please enter a valid number for experience.");
        return false;
    }
    return true;
}

async function saveToYaml() {
    if (!validateForm()) return;

    const data = {
        name: document.getElementById('name').value.trim(),
        profilePic: document.getElementById('profilePic').value.trim(),
        experience: parseInt(document.getElementById('experience').value) || 0,
        jobs: document.getElementById('jobs').value.split('\n').filter(job => job.trim() !== ""),
        social: document.getElementById('social').value.trim(),
        services: document.getElementById('services').value.split('\n').filter(service => service.trim() !== "")
    };

    try {
        localStorage.setItem('portfolioData', jsyaml.dump(data));
        alert("Portfolio saved!");
    } catch (error) {
        console.error("Error saving portfolio:", error);
        alert("Failed to save portfolio.");
    }
}

function loadFromYaml() {
    try {
        const yamlData = localStorage.getItem('portfolioData');
        if (!yamlData) {
            alert("No saved portfolio found.");
            return;
        }
        const data = jsyaml.load(yamlData);

        document.getElementById('name').value = data.name || "";
        document.getElementById('profilePic').value = data.profilePic || "";
        document.getElementById('experience').value = data.experience || 0;
        document.getElementById('jobs').value = (data.jobs || []).join('\n');
        document.getElementById('social').value = data.social || "";
        document.getElementById('services').value = (data.services || []).join('\n');

        alert("Portfolio loaded!");
    } catch (error) {
        console.error("Error loading portfolio:", error);
        alert("Failed to load portfolio.");
    }
}

async function generatePortfolio() {
    if (!validateForm()) return;

    const yamlData = localStorage.getItem('portfolioData');
    if (!yamlData) {
        alert("No saved data to generate portfolio.");
        return;
    }
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
            { text: data.name, fontSize: 20, bold: true },
            data.profilePicBase64 ? { image: data.profilePicBase64, width: 100, height: 100 } : {},
            { text: `Experience: ${data.experience} years`, margin: [0, 10, 0, 10] },
            { text: `Previous Jobs: ${data.jobs.join(', ') || "N/A"}` },
            { text: `Social Media Impact: ${data.social || "N/A"}` },
            { text: `Services: ${data.services.join(', ') || "N/A"}` }
        ]
    };

    pdfMake.createPdf(docDefinition).download("Dancer_Portfolio.pdf");
}
