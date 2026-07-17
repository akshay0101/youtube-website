document.getElementById('analyzeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const handle = document.getElementById('channelHandle').value.trim();
    const btn = document.getElementById('submitBtn');
    const loader = document.getElementById('loader');
    const iframe = document.getElementById('previewFrame');
    const errorBox = document.getElementById('error');

    if (!handle) return;

    btn.disabled = true;
    loader.classList.remove('hidden');
    iframe.srcdoc = '';
    errorBox.classList.add('hidden');

    try {
        const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ handle })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Something went wrong.');
        }

        // Inject the generated HTML into the iframe
        iframe.srcdoc = data.html;

    } catch (err) {
        errorBox.textContent = err.message;
        errorBox.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        loader.classList.add('hidden');
    }
});
