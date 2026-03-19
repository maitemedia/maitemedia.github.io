(() => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');
  const yearTarget = document.querySelector('[data-current-year]');

  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  if (!navToggle || !mobilePanel) return;

  const closeMenu = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    mobilePanel.hidden = true;
  };

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mobilePanel.hidden = expanded;
  });

  mobilePanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });


  const contactForm = document.querySelector('[data-form-integration]');
  if (contactForm) {
    const statusTarget = contactForm.querySelector('.form-status');
    const fields = contactForm.querySelectorAll('input, textarea');

    const setStatus = (message, state = 'info') => {
      if (!statusTarget) return;
      statusTarget.textContent = message;
      statusTarget.dataset.state = state;
    };

    const validateField = (field) => {
      if (!field) return true;
      const isValid = field.checkValidity();
      field.setAttribute('aria-invalid', String(!isValid));
      return isValid;
    };

    fields.forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });

    contactForm.addEventListener('submit', async (event) => {
      const allValid = Array.from(fields).every(validateField);
      if (!allValid) {
        event.preventDefault();
        setStatus(contactForm.dataset.errorMessage || 'Please review the highlighted fields and try again.', 'error');
        const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const endpoint = (contactForm.dataset.formEndpoint || '').trim();
      if (!endpoint) {
        event.preventDefault();
        setStatus(contactForm.dataset.successMessage || 'Thanks. Your inquiry is ready to be sent once the live form endpoint is connected at deployment.', 'pending');
        return;
      }

      event.preventDefault();
      setStatus('Sending your inquiry…', 'pending');
      try {
        const formData = new FormData(contactForm);
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Request failed');
        contactForm.reset();
        fields.forEach((field) => field.removeAttribute('aria-invalid'));
        setStatus('Thanks. Your inquiry has been sent successfully.', 'success');
      } catch (error) {
        setStatus('The inquiry could not be sent. Please try again when the live form endpoint is available.', 'error');
      }
    });
  }
})();