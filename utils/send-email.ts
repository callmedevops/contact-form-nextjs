import { FormData } from '@/components/contact';

export async function sendEmail(data: FormData) {
  const apiEndpoint = '/api/email';

  fetch(apiEndpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      alert(response.message);
      return true
    })
    .catch((err) => {
      alert(err);
    });
}