"use client";

export default function Contact() {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>
        Have questions? re here to help. Get in touch with **Rexo Trading** for any inquiries.
      </p>

      <h2>Contact Information</h2>
      <p>📩 **Email:** support@rexotrading.com</p>
      <p>📞 **Phone:** +1 234 567 890</p>
      <p>📍 **Address:** 123 Trading Street, New York, USA</p>

      <h2>Send Us a Message</h2>
      <form>
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>

      <style jsx>{`
        .contact-container {
          max-width: 800px;
          margin: auto;
          padding: 20px;
          text-align: center;
        }
        h1 {
          color: #1abc9c;
        }
        form {
          display: flex;
          flex-direction: column;
          max-width: 400px;
          margin: auto;
        }
        input, textarea {
          margin: 10px 0;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        button {
          background-color: #1abc9c;
          color: white;
          padding: 10px;
          border: none;
          cursor: pointer;
        }
        button:hover {
          background-color: #16a085;
        }
      `}</style>
    </div>
  );
}
