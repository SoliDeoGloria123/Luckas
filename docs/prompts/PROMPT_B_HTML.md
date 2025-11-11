# Prompt for Converting Markdown Manuals to Elegant Interactive HTML

## Overview
This prompt is designed for Google AI Studio to convert Markdown documentation into a modern, responsive HTML page. The output should include various interactive and aesthetic features to enhance user experience.

## Key Features
- **Dark Mode**: Implement a toggle for switching between light and dark themes.
- **Search Functionality**: Include a search bar that filters through the content.
- **Responsive Sidebar Navigation**: Create a sidebar that adjusts according to the screen size, maintaining usability on both desktop and mobile.
- **Syntax Highlighting**: Use libraries like Prism.js to add syntax highlighting to code blocks.
- **Image Lightbox**: Enable images to open in a fullscreen view upon clicking.
- **Print Optimization**: Ensure that the content is printer-friendly.
- **Keyboard Shortcuts**: Offer shortcuts for key actions within the documentation.
- **Role-Specific Color Schemes**: Define color schemes that correspond to roles:
  - Admin: `#dc3545` (red)
  - Tesorero: `#fd7e14` (orange)
  - Seminarista: `#198754` (green)
  - Externo: `#0d6efd` (blue)

## Complete Structure
### HTML Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Documentation</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="sidebar">
        <!-- Sidebar content goes here -->
    </div>
    <main>
        <header>
            <h1>Your Documentation Title</h1>
            <input type="text" id="search" placeholder="Search..." />
        </header>
        <section class="content">
            <!-- Markdown content will be injected here -->
        </section>
    </main>
    <script src="script.js"></script>
</body>
</html>
```

### CSS Guidelines
```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}

.sidebar {
    width: 250px;
    position: fixed;
    height: 100%;
    background-color: #f4f4f4;
}

.content {
    margin-left: 260px;
    padding: 20px;
}

.dark-mode {
    background-color: #333;
    color: white;
}
```

### JavaScript Functions
```javascript
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function searchContent() {
    const input = document.getElementById('search').value.toLowerCase();
    const content = document.querySelectorAll('.content > div');
    content.forEach(item => {
        if (item.innerText.toLowerCase().includes(input)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}
```

### Callout Components
- Use alert boxes or cards to emphasize important information and callouts within the documentation.

### Code Blocks with Copy Buttons
```html
<pre><code class="language-js">console.log('Hello World!');</code></pre>
<button onclick="copyToClipboard('Hello World!')">Copy</button>
```

### Responsive Breakpoints
```css
@media (max-width: 768px) {
    .sidebar {
        display: none;
    }
}
```

### Accessibility Features
- Ensure all controls and interactive elements are keyboard accessible and screen-reader friendly.

### Usage Instructions
1. Integrate the provided HTML structure into your comprehensive documentation setup.
2. Add relevant Markdown content that will be processed into HTML.
3. Customize CSS and JavaScript as per your specific requirements.

---
By following this prompt, you can create a beautiful, functional representation of your Markdown documentation that enhances user engagement and accessibility.