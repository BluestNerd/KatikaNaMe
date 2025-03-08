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
        phone: document.getElementById('phone').value,
        skills: document.getElementById('skills').value.split(',').map(s => s.trim()), // Convert to array
        profilePic: document.getElementById('profilePreview').src
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
        document.getElementById('skills').value = (data.skills || []).join(', '); 

        if (data.profilePic) {
            document.getElementById('profilePreview').src = data.profilePic;
            document.getElementById('profilePreview').style.display = "block";
        }
        alert("Portfolio loaded!");
    } else {
        alert("No saved portfolio found.");
    }
}

function downloadPdf() {
    const yamlData = localStorage.getItem('portfolioData');
    if (!yamlData) {
        alert("No portfolio data available for download.");
        return;
    }
    const data = jsyaml.load(yamlData);

    const docDefinition = {
        content: [
            { text: data.name, style: 'header', alignment: 'center' },
            { text: data.title, style: 'subheader', alignment: 'center', margin: [0, 0, 0, 10] },
            { text: `Experience: ${data.experience} years`, style: 'body' },

            { text: 'About Me', style: 'sectionHeader' },
            { text: data.aboutMe, style: 'body' },

            { text: 'Skills', style: 'sectionHeader' },
            { ul: data.skills.length > 0 ? data.skills : ["No skills provided"], margin: [0, 5, 0, 10] },

            { text: 'Performance History', style: 'sectionHeader' },
            { ul: data.jobs.length > 0 ? data.jobs : ["No performance history available"], margin: [0, 5, 0, 10] },

            { text: 'Social Media Impact', style: 'sectionHeader' },
            { text: data.social, style: 'body' },

            { text: 'Services Offered', style: 'sectionHeader' },
            { ul: data.services.length > 0 ? data.services : ["No services listed"], margin: [0, 5, 0, 10] },

            { text: 'Testimonials', style: 'sectionHeader' },
            { text: data.testimonials || "No testimonials available", style: 'body' },

            { text: 'Contact Information', style: 'sectionHeader' },
            { text: `Email: ${data.contactEmail}`, style: 'body' },
            { text: `Phone: ${data.phone}`, style: 'body' },
        ],
        styles: {
            header: { fontSize: 24, bold: true, margin: [0, 0, 0, 10] },
            subheader: { fontSize: 18, italics: true, margin: [0, 0, 0, 10] },
            sectionHeader: { fontSize: 16, bold: true, decoration: 'underline', margin: [0, 10, 0, 5] },
            body: { fontSize: 12, margin: [0, 0, 0, 5] },
        }
    };

    if (data.profilePic) {
        convertImgToBase64(data.profilePic, function(base64Img) {
            docDefinition.content.splice(2, 0, { image: base64Img, width: 150, alignment: 'center', margin: [0, 0, 0, 10] });
            pdfMake.createPdf(docDefinition).download("portfolio.pdf");
        });
    } else {
        pdfMake.createPdf(docDefinition).download("portfolio.pdf");
    }
}

function convertImgToBase64(url, callback) {
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
}
