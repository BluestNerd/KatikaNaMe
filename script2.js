function generatePortfolio() {
    const name = document.getElementById("name").value;
    const title = document.getElementById("title").value;
    const profilePicInput = document.getElementById("profilePic");
    const aboutMe = document.getElementById("aboutMe").value;
    const jobs = document.getElementById("jobs").value;
    const social = document.getElementById("social").value;
    const services = document.getElementById("services").value;
    const testimonials = document.getElementById("testimonials").value;
    const contactEmail = document.getElementById("contactEmail").value;
    const phone = document.getElementById("phone").value;
    
    const colorSuggestions = [
        { bg: "#1a1a1a", accent: "#ff4081" },
        { bg: "#282c36", accent: "#61dafb" },
        { bg: "#121212", accent: "#f4a261" }
    ];
    
    let choice = prompt("Choose a color scheme: 1 (Dark Pink), 2 (Dark Blue), 3 (Dark Orange)", "1");
    choice = Math.max(1, Math.min(3, parseInt(choice))); // Ensure valid input
    const { bg: bgColor, accent: accentColor } = colorSuggestions[choice - 1];
    
    let profilePicURL = "";
    if (profilePicInput.files && profilePicInput.files[0]) {
        const file = profilePicInput.files[0];
        profilePicURL = URL.createObjectURL(file);
    }
    
    const portfolioContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${name}'s Portfolio</title>
        <style>
            body { background-color: ${bgColor}; color: white; font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            header { padding: 20px; background: ${accentColor}; border-radius: 10px; margin-bottom: 20px; }
            h1, h2 { margin: 5px; }
            img { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin: 20px 0; }
            section { background: rgba(255, 255, 255, 0.1); padding: 15px; margin: 10px auto; width: 80%; border-radius: 10px; }
            footer { margin-top: 20px; padding: 10px; }
            a { color: ${accentColor}; text-decoration: none; font-weight: bold; }
        </style>
    </head>
    <body>
        <header>
            <h1>${name}</h1>
            <h2>${title}</h2>
        </header>
        <main>
            <img src="${profilePicURL}" alt="Profile Picture">
            <section>
                <h3>About Me</h3>
                <p>${aboutMe}</p>
            </section>
            <section>
                <h3>Performance History</h3>
                <p>${jobs}</p>
            </section>
            <section>
                <h3>Social Media</h3>
                <p>${social}</p>
            </section>
            <section>
                <h3>Services Offered</h3>
                <p>${services}</p>
            </section>
            <section>
                <h3>Testimonials</h3>
                <p>${testimonials}</p>
            </section>
        </main>
        <footer>
            <p>Contact: <a href="mailto:${contactEmail}">${contactEmail}</a> | Phone: ${phone}</p>
        </footer>
    </body>
    </html>`;
    
    const blob = new Blob([portfolioContent], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "DancerPortfolio.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
