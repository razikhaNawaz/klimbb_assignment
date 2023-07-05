import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

const Activate = () => {
  const [isActivate, setIsActivate] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Retrieve messages from local storage
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    // Update local storage when messages change
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  const activateHandler = () => {
    setIsActivate(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMessage('');
    setResponseMessage('');
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/posts/',
        {
          message: message,
        }
      );

      console.log('Response:', response);

      // Simulate 1 second delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newMessage = response.data.message;
      setResponseMessage(newMessage);

      // Add the new message to the existing messages
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setMessage('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div style={{ margin: '100px 100px 200px 200px' }}>
        <Button variant="success" onClick={activateHandler}>
          {isActivate ? 'activate' : 'deactivate'}
        </Button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '24px', color: 'blue'}}>ChatBot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {responseMessage && (
            <div className="response-message">
              <strong>You:</strong> {responseMessage}
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div key={index}>Bot:{msg}</div>
          ))}
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Enter your message"
                value={message}
                onChange={handleMessageChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Send
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Activate;
