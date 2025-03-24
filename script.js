document.addEventListener("DOMContentLoaded", function () {
    // Function to save portfolio data to local storage in YAML format
    function saveToYaml() {
        const data = {
            name: document.getElementById("name").value,
            title: document.getElementById("title").value,
            experience: document.getElementById("experience").value,
            jobs: document.getElementById("jobs").value.split('\n'),
            social: document.getElementById("social").value,
            services: document.getElementById("services").value.split('\n'),
            testimonials: document.getElementById("testimonials").value.split('\n'),
            skills: document.getElementById("skills").value.split(',').map(skill => skill.trim()),
            contactEmail: document.getElementById("contactEmail").value,
            phone: document.getElementById("phone").value
        };
        localStorage.setItem("portfolioData", jsyaml.dump(data));
        alert("Portfolio saved successfully!");
    }

    // Function to load portfolio data from local storage
    function loadFromYaml() {
        const yamlData = localStorage.getItem("portfolioData");
        if (yamlData) {
            const data = jsyaml.load(yamlData);
            document.getElementById("name").value = data.name || "";
            document.getElementById("title").value = data.title || "";
            document.getElementById("experience").value = data.experience || "";
            document.getElementById("jobs").value = (data.jobs || []).join('\n');
            document.getElementById("social").value = data.social || "";
            document.getElementById("services").value = (data.services || []).join('\n');
            document.getElementById("testimonials").value = (data.testimonials || []).join('\n');
            document.getElementById("skills").value = (data.skills || []).join(', ');
            document.getElementById("contactEmail").value = data.contactEmail || "";
            document.getElementById("phone").value = data.phone || "";
            alert("Portfolio loaded successfully!");
        } else {
            alert("No saved portfolio found.");
        }
    }

    // Function to generate the portfolio preview
    function generatePortfolio() {
        const yamlData = localStorage.getItem("portfolioData");
        if (!yamlData) {
            alert("No saved data to generate portfolio.");
            return;
        }
        const data = jsyaml.load(yamlData);
        const preview = `
            <div class='preview-card'>
                <h3>${data.name}</h3>
                <p><strong>Title:</strong> ${data.title}</p>
                <p><strong>Experience:</strong> ${data.experience} years</p>
                <p><strong>Previous Jobs:</strong> ${data.jobs.join(', ')}</p>
                <p><strong>Social Media Impact:</strong> ${data.social}</p>
                <p><strong>Services:</strong> ${data.services.join(', ')}</p>
                <p><strong>Testimonials:</strong> ${data.testimonials.join(', ')}</p>
                <p><strong>Skills:</strong> ${data.skills.join(', ')}</p>
                <p><strong>Contact:</strong> ${data.contactEmail} | ${data.phone}</p>
            </div>
        `;
        document.getElementById("preview").innerHTML = preview;
        document.getElementById("downloadPdfBtn").classList.remove("hidden");
    }

    // Function to generate a PDF from the portfolio preview
    function generatePDF() {
        const yamlData = localStorage.getItem("portfolioData");
        if (!yamlData) {
            alert("No saved data to generate PDF.");
            return;
        }
        const data = jsyaml.load(yamlData);
        const docDefinition = {
            content: [
                { text: data.name, style: 'header' },
                { text: `Title: ${data.title}`, style: 'subheader' },
                { text: `Experience: ${data.experience} years`, margin: [0, 10, 0, 10] },
                { text: `Previous Jobs: ${data.jobs.join(', ')}` },
                { text: `Social Media Impact: ${data.social}` },
                { text: `Services: ${data.services.join(', ')}` },
                { text: `Testimonials: ${data.testimonials.join(', ')}` },
                { text: `Skills: ${data.skills.join(', ')}` },
                { text: `Contact: ${data.contactEmail} | ${data.phone}` },
            ],
            styles: {
                header: { fontSize: 18, bold: true },
                subheader: { fontSize: 14, bold: true }
            }
        };
        pdfMake.createPdf(docDefinition).download("Dancer_Portfolio.pdf");
    }

    // Event listener to preview selected profile picture
    document.getElementById("profilePic").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("profilePreview").src = e.target.result;
                document.getElementById("profilePreview").style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });

    // Event listeners for buttons
    document.getElementById("saveBtn").addEventListener("click", saveToYaml);
    document.getElementById("loadBtn").addEventListener("click", loadFromYaml);
    document.getElementById("generateBtn").addEventListener("click", generatePortfolio);
    document.getElementById("downloadPdfBtn").addEventListener("click", generatePDF);
});
