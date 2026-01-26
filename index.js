function showAlert() {
    // Instead of showing an alert, enlarge the GIF and the Yes button each click
    // but change actual dimensions (not only transform) so layout reflows and
    // other elements are not covered. Track number of increases and after 3
    // show an alert and reload the page when the user acknowledges.
    const gif = document.getElementById('valentine-gif');
    const yes = document.querySelector('.yes-button');
    const buttonsWrapper = document.querySelector('.buttons-wrapper');
    const factor = 1.15; // scale multiplier per click
    const maxScale = 4; // avoid runaway sizes

    // Resize GIF by updating width so layout reflows
    if (gif) {
        const origW = parseFloat(gif.dataset.origWidth) || gif.clientWidth;
        const origH = parseFloat(gif.dataset.origHeight) || gif.clientHeight;
        const current = parseFloat(gif.dataset.scale) || 1;
        const next = Math.min(current * factor, maxScale);
        const nextW = Math.round(origW * next);
        gif.style.width = nextW + 'px';
        gif.style.height = 'auto';
        const extra = Math.round(origH * (next - 1));
        gif.style.marginBottom = extra + 'px';
        gif.dataset.scale = next;

        // increment click counter attached to gif
        const clicks = (parseInt(gif.dataset.clicks, 10) || 0) + 1;
        gif.dataset.clicks = clicks;
        if (clicks >= 3) {
            alert("uhm... I think you should click yes. Please?");
            // reload after user acknowledges the alert
            location.reload();
            return;
        }
    }

    // Scale the Yes button visually, but reserve wrapper space so nothing overlaps
    if (yes) {
        const origYesH = parseFloat(yes.dataset.origHeight) || yes.getBoundingClientRect().height;
        const currentY = parseFloat(yes.dataset.scale) || 1;
        const nextY = Math.min(currentY * factor, maxScale);
        yes.style.transform = `scale(${nextY})`;
        yes.dataset.scale = nextY;
        if (buttonsWrapper) {
            const needed = Math.round(origYesH * nextY);
            buttonsWrapper.style.minHeight = needed + 'px';
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const noButton = document.querySelector(".no-button");
    if (noButton) {
        noButton.addEventListener("click", showAlert);
    }
    // Store original sizes for GIF and Yes button so layout can reflow properly
    const gif = document.getElementById('valentine-gif');
    if (gif && !gif.dataset.origWidth) {
        // Use current client width as baseline
        gif.dataset.origWidth = gif.clientWidth;
        gif.dataset.origHeight = gif.clientHeight;
        gif.style.width = gif.dataset.origWidth + 'px';
    }
    const yes = document.querySelector('.yes-button');
    const buttonsWrapper = document.querySelector('.buttons-wrapper');
    if (yes && !yes.dataset.origHeight) {
        yes.dataset.origHeight = yes.getBoundingClientRect().height;
        // ensure wrapper has baseline min-height
        if (buttonsWrapper) buttonsWrapper.style.minHeight = yes.dataset.origHeight + 'px';
    }
    // Modal elements
    const yesButton = document.querySelector(".yes-button");
    const modal = document.getElementById('email-modal');
    const modalTo = document.getElementById('modal-to');
    const modalSubject = document.getElementById('modal-subject');
    const modalBody = document.getElementById('modal-body');
    const openGmailBtn = document.getElementById('open-gmail');
    const closeModalBtn = document.getElementById('close-modal');
    const modalCloseBtn = document.querySelector('.modal-close');

    function openModal(){
        if (!modal) return;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden','false');
        // trap focus could be added later
    }
    function closeModal(){
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden','true');
    }

    if (yesButton) {
        yesButton.addEventListener("click", () => {
            // Prefill modal fields
            if (modalTo) modalTo.value = 'nalerags@gmail.com';
            if (modalSubject) modalSubject.value = "Yes — I'd love to be your Valentine!";
            if (modalBody) modalBody.value = "Hi Naledi,\n\nI'd love to be your Valentine. 💖\n\n— Wandile";
            openModal();
        });
    }

    // Open Gmail compose in new tab using modal values
    if (openGmailBtn) {
        openGmailBtn.addEventListener('click', () => {
            const to = modalTo ? encodeURIComponent(modalTo.value) : '';
            const subject = modalSubject ? encodeURIComponent(modalSubject.value) : '';
            const body = modalBody ? encodeURIComponent(modalBody.value) : '';
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
            window.open(gmailUrl, '_blank');
        });
    }

    // Close modal handlers
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
});
