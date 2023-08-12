import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/style.css';


function ContactMessages()
 {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(10);

  useEffect(() => {
    getContactMessages();
  }, []);

  
  // Get contact messages
  const getContactMessages = async () => {
    try {
      const response = await axios.get('http://localhost:4000/messagesContactUs');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Calculate the index range of messages to display based on current page and messages per page
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="contact-messages-container text-center col-12 mb-3 mt-5">
      {messages.length === 0 ? (
        <p>لا توجد رسائل حتى الأن</p>
      ) : (
        <div className="table-container">
          <table className="message-table">
            <thead>
              <tr>
                <th>الإسم</th>
                <th>البريد الإلكتروني</th>
                <th>الموضوع</th>
                <th>الرسالة</th>
                <th>الرد</th>
              </tr>
            </thead>
            <tbody>
              {currentMessages.map((message) => (
                <tr key={message.contact_id}>
                  <td>{message.name}</td>
                  <td>{message.email}</td>
                  <td>{message.subject}</td>
                  <td>{message.message}</td>
                  <td>
                    <ReplySection email={message.email} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {messages.length > messagesPerPage && (
        <div className="pagination-container">
          <div className="pagination">
            {Array.from({ length: Math.ceil(messages.length / messagesPerPage) }).map((_, index) => (
              <button
                key={index}
                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactMessages;




function ReplySection({ email }) 
{

  return (
    <div className="reply-section">
      <a href={`mailto:${email}`}>
        <button className="ContactMessageButton">
          كتابة رّد
        </button> </a>
    </div>
  );
}