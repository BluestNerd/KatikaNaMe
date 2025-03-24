document.addEventListener("DOMContentLoaded", function () {
    function saveToYaml() {
        const data = {
            name: document.getElementById("name").value,
            title: document.getElementById("title").value,
            experience: document.getElementById("experience").value,
            aboutMe: document.getElementById("aboutMe").value,
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

    function loadFromYaml() {
        const yamlData = localStorage.getItem("portfolioData");
        if (yamlData) {
            const data = jsyaml.load(yamlData);
            document.getElementById("name").value = data.name || "";
            document.getElementById("title").value = data.title || "";
            document.getElementById("experience").value = data.experience || "";
            document.getElementById("aboutMe").value = data.aboutMe || "";
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
                <p><strong>About Me:</strong> ${data.aboutMe}</p>
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
                { text: data.title, style: 'subheader' },
                { text: `Experience: ${data.experience} years`, margin: [0, 10, 0, 10] },
                { text: "About Me", style: 'sectionHeader' },
                { text: data.aboutMe, margin: [0, 5, 0, 10] },
                { text: "Performance History", style: 'sectionHeader' },
                { ul: data.jobs },
                { text: "Social Media Impact", style: 'sectionHeader' },
                { text: data.social },
                { text: "Services Offered", style: 'sectionHeader' },
                { ul: data.services },
                { text: "Testimonials", style: 'sectionHeader' },
                { ul: data.testimonials },
                { text: "Dance Styles & Skills", style: 'sectionHeader' },
                { ul: data.skills },
                { text: "Contact Information", style: 'sectionHeader' },
                { text: `Email: ${data.contactEmail}\nPhone: ${data.phone}` }
            ],
            styles: {
                header: { fontSize: 22, bold: true, alignment: 'center' },
                subheader: { fontSize: 16, bold: true, alignment: 'center' },
                sectionHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] }
            }
        };
        pdfMake.createPdf(docDefinition).download("Dancer_Portfolio.pdf");
    }

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

    document.getElementById("saveBtn").addEventListener("click", saveToYaml);
    document.getElementById("loadBtn").addEventListener("click", loadFromYaml);
    document.getElementById("generateBtn").addEventListener("click", generatePortfolio);
    document.getElementById("downloadPdfBtn").addEventListener("click", generatePDF);
});
