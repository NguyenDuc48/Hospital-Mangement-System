// MedicalReportModal.js

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const MedicalReportModal = ({ show, onHide, onSubmit, selectedPatient }) => {
  const [diagnostic, setDiagnostic] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    onSubmit({
      diagnostic,
      conclusion,
      note,
    });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Medical Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="diagnostic">
            <Form.Label>Diagnostic</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter diagnostic"
              value={diagnostic}
              onChange={(e) => setDiagnostic(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="conclusion">
            <Form.Label>Conclusion</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter conclusion"
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="note">
            <Form.Label>Note</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MedicalReportModal;
