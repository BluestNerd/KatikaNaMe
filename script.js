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
