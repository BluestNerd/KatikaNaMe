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
    if (!name) {
        alert("Please enter your name.");
        return false;
    }
    return true;
}

async function saveToYaml() {
    if (!validateForm()) return;

    const data = {
        name: document.getElementById('name').value.trim(),
        title: document.getElementById('title').value.trim(),
        profilePic: document.getElementById('profilePic').value.trim(),
        contactEmail: document.getElementById('contactEmail').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        social: document.getElementById('social').value.trim(),
        aboutMe: document.getElementById('aboutMe').value.trim(),
        experience: parseInt(document.getElementById('experience').value) || 0,
        jobs: document.getElementById('jobs').value.split('\n').filter(job => job.trim() !== ""),
        shows: document.getElementById('shows').value.split('\n').filter(show => show.trim() !== ""),
        services: document.getElementById('services').value.split('\n').filter(service => service.trim() !== ""),
        testimonials: document.getElementById('testimonials').value.split('\n').filter(testimonial => testimonial.trim() !== "")
    };

    localStorage.setItem('portfolioData', jsyaml.dump(data));
    alert("Portfolio saved!");
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
            // Cover Page
            { text: data.name, fontSize: 28, bold: true, alignment: 'center' },
            { text: data.title, fontSize: 18, italics: true, alignment: 'center', margin: [0, 10, 0, 20] },
            data.profilePicBase64 ? { image: data.profilePicBase64, width: 150, alignment: 'center' } : {},
            { text: `Contact: ${data.contactEmail} | ${data.phone}`, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: `Social: ${data.social}`, alignment: 'center', margin: [0, 0, 0, 30] },

            // About Me
            { text: "About Me", style: "header" },
            { text: data.aboutMe, margin: [0, 10, 0, 10] },
            { text: `Experience: ${data.experience} years` },

            // Performance History
            { text: "Performance History", style: "header" },
            { ul: data.jobs },

            // Services
            { text: "Services Offered", style: "header" },
            { ul: data.services },

            // Testimonials
            { text: "Testimonials", style: "header" },
            { ul: data.testimonials },

            // Contact
            { text: "Contact Me", style: "header" },
            { text: `Email: ${data.contactEmail} | Phone: ${data.phone}`, margin: [0, 10, 0, 0] },
        ],
        styles: {
            header: { fontSize: 18, bold: true, margin: [0, 10, 0, 5] }
        }
    };

    pdfMake.createPdf(docDefinition).download("Dancer_Portfolio.pdf");
}
