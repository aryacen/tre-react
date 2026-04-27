export async function submitSupportForm({ formType, subject, replyTo, fields }) {
  const response = await fetch('/api/forms/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      formType,
      subject,
      replyTo,
      fields,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Gagal mengirim formulir.');
  }

  return payload;
}

export async function sendFreeTestResults({ name, email, kecemasan, depresi, stress }) {
  const response = await fetch('/api/tests/send-results', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      kecemasan,
      depresi,
      stress,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Gagal mengirim hasil tes.');
  }

  return payload;
}
