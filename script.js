
document.addEventListener("DOMContentLoaded", function () {
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
            skills: document.getElementById('skills').value.split(','),
            testimonials: document.getElementById('testimonials').value,
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
        document.getElementById('name').value = data.name || "";
        document.getElementById('title').value = data.title || "";
        document.getElementById('experience').value = data.experience || "";
        document.getElementById('aboutMe').value = data.aboutMe || "";
        document.getElementById('jobs').value = (data.jobs || []).join('\n');
        document.getElementById('social').value = data.social || "";
        document.getElementById('services').value = (data.services || []).join('\n');
        document.getElementById('skills').value = (data.skills || []).join(', ');
        document.getElementById('testimonials').value = data.testimonials || "";
        document.getElementById('contactEmail').value = data.contactEmail || "";
        document.getElementById('phone').value = data.phone || "";
    }

    function generatePortfolio() {
        const yamlData = localStorage.getItem('portfolioData');
        if (!yamlData) {
            alert("No saved data to generate portfolio.");
            return;
        }
        const data = jsyaml.load(yamlData);
        document.getElementById('preview').innerHTML = `
            <h3>${data.name}</h3>
            <p><strong>Title:</strong> ${data.title}</p>
            <p><strong>Experience:</strong> ${data.experience} years</p>
            <p><strong>Social Media:</strong> ${data.social}</p>
            <p><strong>Services:</strong> ${data.services.join(', ')}</p>
        `;
        document.getElementById('downloadPdfBtn').classList.remove('hidden');
    }

    function downloadPdf() {
        alert("PDF generation not implemented yet.");
    }
});

function downloadPdf() {
    const yamlData = localStorage.getItem('portfolioData');
    if (!yamlData) {
        alert("No portfolio data available for download.");
        return;
    }

    const data = jsyaml.load(yamlData);

    // Ensure all properties exist and are arrays if needed
    data.skills = Array.isArray(data.skills) ? data.skills : [];
    data.jobs = Array.isArray(data.jobs) ? data.jobs : [];
    data.services = Array.isArray(data.services) ? data.services : [];

    const docDefinition = {
        content: [
            { text: data.name || "No Name Provided", style: 'header', alignment: 'center' },
            { text: data.title || "No Title Provided", style: 'subheader', alignment: 'center', margin: [0, 0, 0, 10] },
            { text: `Experience: ${data.experience || "N/A"} years`, style: 'body' },

            { text: 'About Me', style: 'sectionHeader' },
            { text: data.aboutMe || "No about me section provided", style: 'body' },

            { text: 'Skills', style: 'sectionHeader' },
            { ul: data.skills.length > 0 ? data.skills : ["No skills provided"], margin: [0, 5, 0, 10] },

            { text: 'Performance History', style: 'sectionHeader' },
            { ul: data.jobs.length > 0 ? data.jobs : ["No performance history available"], margin: [0, 5, 0, 10] },

            { text: 'Social Media Impact', style: 'sectionHeader' },
            { text: data.social || "No social media impact data provided", style: 'body' },

            { text: 'Services Offered', style: 'sectionHeader' },
            { ul: data.services.length > 0 ? data.services : ["No services listed"], margin: [0, 5, 0, 10] },

            { text: 'Testimonials', style: 'sectionHeader' },
            { text: data.testimonials || "No testimonials available", style: 'body' },

            { text: 'Contact Information', style: 'sectionHeader' },
            { text: `Email: ${data.contactEmail || "No email provided"}`, style: 'body' },
            { text: `Phone: ${data.phone || "No phone number provided"}`, style: 'body' },
        ],
        styles: {
            header: { fontSize: 24, bold: true, margin: [0, 0, 0, 10] },
            subheader: { fontSize: 18, italics: true, margin: [0, 0, 0, 10] },
            sectionHeader: { fontSize: 16, bold: true, decoration: 'underline', margin: [0, 10, 0, 5] },
            body: { fontSize: 12, margin: [0, 0, 0, 5] },
        }
    };

    // Handle profile picture
    if (data.profilePic && data.profilePic.startsWith("data:image")) {
        docDefinition.content.splice(2, 0, {
            image: data.profilePic,
            width: 150,
            alignment: 'center',
            margin: [0, 0, 0, 10]
        });
        pdfMake.createPdf(docDefinition).download("portfolio.pdf");
    } else if (data.profilePic) {
        // Convert URL-based image to Base64
        convertImgToBase64(data.profilePic, function(base64Img) {
            docDefinition.content.splice(2, 0, {
                image: base64Img,
                width: 150,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            });
            pdfMake.createPdf(docDefinition).download("portfolio.pdf");
        }, function(error) {
            console.error("Image conversion failed:", error);
            alert("Failed to load image for the PDF, proceeding without image.");
            pdfMake.createPdf(docDefinition).download("portfolio.pdf");
        });
    } else {
        pdfMake.createPdf(docDefinition).download("portfolio.pdf");
    }
}

// Function to convert an image URL to Base64
function convertImgToBase64(url, callback, errorCallback) {
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        callback(dataURL);
    };
    img.onerror = function() {
        errorCallback("Failed to load image.");
    };
}
