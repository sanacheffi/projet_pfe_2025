import React, { useState } from 'react';

const ContactPage = () => {
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Message envoyé:', contactData);
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 tracking-tighter">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl uppercase mb-6 text-center">Contactez-Nous</h2>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            {/* Nom */}
            <div className="mb-4">
              <label className="block text-gray-700">Nom complet</label>
              <input
                type="text"
                value={contactData.name}
                onChange={(e) =>
                  setContactData({ ...contactData, name: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Téléphone */}
            <div className="mb-4">
              <label className="block text-gray-700">Téléphone</label>
              <input
                type="text"
                value={contactData.phone}
                onChange={(e) =>
                  setContactData({ ...contactData, phone: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={contactData.email}
                onChange={(e) =>
                  setContactData({ ...contactData, email: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Sujet */}
            <div className="mb-4">
              <label className="block text-gray-700">Sujet</label>
              <input
                type="text"
                value={contactData.subject}
                onChange={(e) =>
                  setContactData({ ...contactData, subject: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Message (optionnel) */}
            <div className="mb-4">
              <label className="block text-gray-700">Message (optionnel)</label>
              <textarea
                value={contactData.message}
                onChange={(e) =>
                  setContactData({ ...contactData, message: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows="5"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded"
            >
              Envoyer
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h3 className="text-lg mb-2">Merci pour votre message !</h3>
            <p>Nous vous contacterons bientôt.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
