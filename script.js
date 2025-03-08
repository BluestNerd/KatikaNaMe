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
        phone: document.getElementById('phone').value,
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
        
        if (data.profilePic) {
            document.getElementById('profilePreview').src = data.profilePic;
            document.getElementById('profilePreview').style.display = "block";
        }

        alert("Portfolio loaded!");
    } else {
        alert("No saved portfolio found.");
    }
}

document.getElementById('profilePic').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePreview').src = e.target.result;
            document.getElementById('profilePreview').style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

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
            ${data.profilePic ? `<img src="${data.profilePic}" class="w-32 h-32 rounded-full mt-2" />` : ''}
        </div>
    `;
    document.getElementById('preview').innerHTML = preview;
    document.getElementById('downloadPdfBtn').classList.remove('hidden');
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
            { text: data.name, style: 'header' },
            { text: `Title: ${data.title}`, style: 'subheader' },
            { text: `Experience: ${data.experience} years` },
            { text: `About Me: ${data.aboutMe}` },
            { text: `Performance History: ${data.jobs.join(', ')}` },
            { text: `Social Media Impact: ${data.social}` },
            { text: `Services: ${data.services.join(', ')}` },
            { text: `Testimonials: ${data.testimonials}` },
            { text: `Contact: ${data.contactEmail} | ${data.phone}` },
        ],
        styles: {
            header: { fontSize: 22, bold: true },
            subheader: { fontSize: 18, bold: true }
        }
    };

    if (data.profilePic) {
        convertImgToBase64(data.profilePic, function(base64Img) {
            docDefinition.content.splice(1, 0, { image: base64Img, width: 150 });
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
